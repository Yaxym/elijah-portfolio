import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabasePublic } from "@/lib/supabase";
import { isAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";

type WorkRow = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  cover_url: string;
  images_urls: string[]; // <-- NEW
  category: string;
  tags: string[];
  year: number | null;
  href: string | null;
  created_at: string;
  updated_at: string;
};

function normalizeTags(tagsRaw: string) {
  return tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => t.toLowerCase());
}

function publicWork(w: WorkRow) {
  const images =
    Array.isArray(w.images_urls) && w.images_urls.length > 0
      ? w.images_urls
      : w.cover_url
        ? [w.cover_url]
        : [];

  return {
    id: w.id,
    title: w.title,
    subtitle: w.subtitle || undefined,
    description: w.description || undefined,
    cover: w.cover_url,
    images, // <-- NEW
    category: w.category,
    tags: w.tags || [],
    year: w.year ?? undefined,
    href: w.href || undefined,
    createdAt: w.created_at,
    updatedAt: w.updated_at,
  };
}

function getExtSafe(fileName: string) {
  const ext = (fileName.split(".").pop() || "jpg").toLowerCase();
  return ["png", "jpg", "jpeg", "webp"].includes(ext) ? ext : "jpg";
}

async function uploadToBucket(params: {
  supa: ReturnType<typeof supabaseAdmin>;
  bucket: string;
  folder: "covers" | "gallery";
  file: File;
}) {
  const { supa, bucket, folder, file } = params;

  const safeExt = getExtSafe(file.name);
  const filePath = `${folder}/${Date.now()}-${randomUUID()}.${safeExt}`;

  const arrayBuffer = await file.arrayBuffer();
  const body = Buffer.from(arrayBuffer);

  const { error: upErr } = await supa.storage.from(bucket).upload(filePath, body, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });

  if (upErr) throw new Error(upErr.message);

  const { data: pub } = supa.storage.from(bucket).getPublicUrl(filePath);
  return { filePath, publicUrl: pub.publicUrl };
}

function extractBucketObjectPath(publicUrl: string, bucket: string) {
  // https://xxxx.supabase.co/storage/v1/object/public/<bucket>/<path>
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
}

export async function GET() {
  const supa = supabasePublic();
  const { data, error } = await supa.from("works").select("*").order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ works: (data as WorkRow[]).map(publicWork) });
}

/**
 * CREATE (admin only)
 * form-data:
 *  - cover: file (required)
 *  - images: files (optional multiple)
 *  - title, subtitle, description, category, tags, year, href
 */
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();

  const title = String(form.get("title") || "").trim();
  const subtitle = String(form.get("subtitle") || "").trim();
  const description = String(form.get("description") || "").trim();
  const category = String(form.get("category") || "Key Visual").trim();
  const tagsRaw = String(form.get("tags") || "").trim();
  const href = String(form.get("href") || "").trim();
  const yearRaw = String(form.get("year") || "").trim();

  const coverFile = form.get("cover") as File | null;
  const galleryFiles = (form.getAll("images") as File[]).filter((f) => f && typeof f === "object" && f.size > 0);

  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
  if (!coverFile) return NextResponse.json({ error: "Cover is required" }, { status: 400 });

  const year = yearRaw ? Number(yearRaw) : null;
  const tags = tagsRaw ? normalizeTags(tagsRaw) : [];

  const supa = supabaseAdmin();
  const bucket = "works-covers";

  try {
    // 1) upload cover
    const coverUp = await uploadToBucket({ supa, bucket, folder: "covers", file: coverFile });
    const coverUrl = coverUp.publicUrl;

    // 2) upload gallery (optional)
    const uploadedGallery: string[] = [];
    for (const f of galleryFiles) {
      const up = await uploadToBucket({ supa, bucket, folder: "gallery", file: f });
      uploadedGallery.push(up.publicUrl);
    }

    const imagesUrls = uploadedGallery.length > 0 ? [coverUrl, ...uploadedGallery] : [coverUrl];

    // 3) insert row
    const { data, error } = await supa
      .from("works")
      .insert({
        title,
        subtitle: subtitle || null,
        description: description || null,
        cover_url: coverUrl,
        images_urls: imagesUrls,
        category,
        tags,
        year: Number.isFinite(year as any) ? year : null,
        href: href || null,
      })
      .select("*")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true, work: publicWork(data as WorkRow) }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Upload failed" }, { status: 500 });
  }
}

/**
 * UPDATE (admin only)
 * form-data:
 *  - id (required)
 *  - cover (optional new file)
 *  - images (optional multiple new files) -> если пришли, заменяем images_urls целиком (cover + новые)
 *  - title, subtitle, description, category, tags, year, href
 */
export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();

  const id = String(form.get("id") || "").trim();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const title = String(form.get("title") || "").trim();
  const subtitle = String(form.get("subtitle") || "").trim();
  const description = String(form.get("description") || "").trim();
  const category = String(form.get("category") || "").trim();
  const tagsRaw = String(form.get("tags") || "").trim();
  const href = String(form.get("href") || "").trim();
  const yearRaw = String(form.get("year") || "").trim();

  const newCover = form.get("cover") as File | null;
  const newGallery = (form.getAll("images") as File[]).filter((f) => f && typeof f === "object" && f.size > 0);

  const supa = supabaseAdmin();
  const bucket = "works-covers";

  const { data: current, error: curErr } = await supa.from("works").select("*").eq("id", id).single();
  if (curErr) return NextResponse.json({ error: curErr.message }, { status: 500 });

  const cur = current as WorkRow;

  let coverUrl = cur.cover_url;

  // cover replace
  if (newCover && newCover.size > 0) {
    try {
      const up = await uploadToBucket({ supa, bucket, folder: "covers", file: newCover });
      coverUrl = up.publicUrl;

      // best-effort delete old cover
      const oldPath = extractBucketObjectPath(cur.cover_url, bucket);
      if (oldPath) await supa.storage.from(bucket).remove([oldPath]);
    } catch (e: any) {
      return NextResponse.json({ error: e?.message || "Cover upload failed" }, { status: 500 });
    }
  }

  // gallery replace (if provided)
  let imagesUrls = Array.isArray(cur.images_urls) && cur.images_urls.length > 0 ? cur.images_urls : [cur.cover_url];

  if (newGallery.length > 0) {
    try {
      // delete all old gallery images (best-effort), but keep cover handling above separately
      const toDelete: string[] = [];
      for (const url of imagesUrls) {
        const p = extractBucketObjectPath(url, bucket);
        if (p) toDelete.push(p);
      }
      if (toDelete.length > 0) {
        // не важно, если что-то не удалится
        await supa.storage.from(bucket).remove(toDelete).catch(() => {});
      }

      // upload new gallery
      const uploaded: string[] = [];
      for (const f of newGallery) {
        const up = await uploadToBucket({ supa, bucket, folder: "gallery", file: f });
        uploaded.push(up.publicUrl);
      }
      imagesUrls = [coverUrl, ...uploaded];
    } catch (e: any) {
      return NextResponse.json({ error: e?.message || "Gallery upload failed" }, { status: 500 });
    }
  } else {
    // если галерея не прислана, но cover заменили — обновим first image
    if (imagesUrls.length === 0) imagesUrls = [coverUrl];
    else imagesUrls = [coverUrl, ...imagesUrls.filter((u) => u !== cur.cover_url)];
  }

  const tags = tagsRaw ? normalizeTags(tagsRaw) : cur.tags;
  const year = yearRaw ? Number(yearRaw) : cur.year;

  const patch: any = {
    cover_url: coverUrl,
    images_urls: imagesUrls,
  };
  if (title) patch.title = title;
  patch.subtitle = subtitle ? subtitle : null;
  patch.description = description ? description : null;
  if (category) patch.category = category;
  patch.tags = tags;
  patch.year = Number.isFinite(year as any) ? year : null;
  patch.href = href ? href : null;

  const { data, error } = await supa.from("works").update(patch).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, work: publicWork(data as WorkRow) });
}

/**
 * DELETE (admin only)
 * JSON: { id }
 */
export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const id = String(body?.id || "").trim();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const supa = supabaseAdmin();
  const bucket = "works-covers";

  const { data: current, error: curErr } = await supa.from("works").select("*").eq("id", id).single();
  if (curErr) return NextResponse.json({ error: curErr.message }, { status: 500 });

  const cur = current as WorkRow;

  // delete row
  const { error: delErr } = await supa.from("works").delete().eq("id", id);
  if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });

  // best-effort delete all images
  try {
    const urls = Array.isArray(cur.images_urls) && cur.images_urls.length > 0 ? cur.images_urls : [cur.cover_url];
    const toDelete: string[] = [];
    for (const url of urls) {
      const p = extractBucketObjectPath(url, bucket);
      if (p) toDelete.push(p);
    }
    if (toDelete.length > 0) await supa.storage.from(bucket).remove(toDelete);
  } catch {}

  return NextResponse.json({ ok: true });
}