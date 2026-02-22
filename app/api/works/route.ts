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
  return {
    id: w.id,
    title: w.title,
    subtitle: w.subtitle || undefined,
    description: w.description || undefined,
    cover: w.cover_url,
    category: w.category,
    tags: w.tags || [],
    year: w.year ?? undefined,
    href: w.href || undefined,
    createdAt: w.created_at,
    updatedAt: w.updated_at,
  };
}

export async function GET() {
  const supa = supabasePublic();
  const { data, error } = await supa
    .from("works")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ works: (data as WorkRow[]).map(publicWork) });
}

/**
 * CREATE (admin only)
 * form-data:
 *  - cover: file
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
  const file = form.get("cover") as File | null;

  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
  if (!file) return NextResponse.json({ error: "Cover is required" }, { status: 400 });

  const year = yearRaw ? Number(yearRaw) : null;
  const tags = tagsRaw ? normalizeTags(tagsRaw) : [];

  const supa = supabaseAdmin();

  // upload file
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const safeExt = ["png", "jpg", "jpeg", "webp"].includes(ext) ? ext : "jpg";
  const filePath = `covers/${Date.now()}-${randomUUID()}.${safeExt}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: upErr } = await supa.storage
    .from("works-covers")
    .upload(filePath, arrayBuffer, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });

  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  const { data: pub } = supa.storage.from("works-covers").getPublicUrl(filePath);
  const coverUrl = pub.publicUrl;

  const { data, error } = await supa
    .from("works")
    .insert({
      title,
      subtitle: subtitle || null,
      description: description || null,
      cover_url: coverUrl,
      category,
      tags,
      year: Number.isFinite(year as any) ? year : null,
      href: href || null,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, work: publicWork(data as WorkRow) }, { status: 201 });
}

/**
 * UPDATE (admin only)
 * form-data:
 *  - id (required)
 *  - cover (optional new file)
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
  const file = form.get("cover") as File | null;

  const supa = supabaseAdmin();

  // read current row (to possibly replace/delete cover)
  const { data: current, error: curErr } = await supa.from("works").select("*").eq("id", id).single();
  if (curErr) return NextResponse.json({ error: curErr.message }, { status: 500 });

  let coverUrl = (current as WorkRow).cover_url;

  // if new cover provided -> upload new cover (and try delete old)
  if (file && file.size > 0) {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const safeExt = ["png", "jpg", "jpeg", "webp"].includes(ext) ? ext : "jpg";
    const filePath = `covers/${Date.now()}-${randomUUID()}.${safeExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const { error: upErr } = await supa.storage.from("works-covers").upload(filePath, arrayBuffer, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

    const { data: pub } = supa.storage.from("works-covers").getPublicUrl(filePath);
    coverUrl = pub.publicUrl;

    // best-effort delete old file if it was from our bucket
    try {
      const old = (current as WorkRow).cover_url;
      const marker = "/storage/v1/object/public/works-covers/";
      const idx = old.indexOf(marker);
      if (idx !== -1) {
        const objectPath = old.slice(idx + marker.length);
        await supa.storage.from("works-covers").remove([objectPath]);
      }
    } catch {}
  }

  const tags = tagsRaw ? normalizeTags(tagsRaw) : (current as WorkRow).tags;
  const year = yearRaw ? Number(yearRaw) : (current as WorkRow).year;

  const patch: any = {
    cover_url: coverUrl,
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

  const { data: current, error: curErr } = await supa.from("works").select("*").eq("id", id).single();
  if (curErr) return NextResponse.json({ error: curErr.message }, { status: 500 });

  // delete row
  const { error: delErr } = await supa.from("works").delete().eq("id", id);
  if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });

  // best-effort delete cover
  try {
    const old = (current as WorkRow).cover_url;
    const marker = "/storage/v1/object/public/works-covers/";
    const idx = old.indexOf(marker);
    if (idx !== -1) {
      const objectPath = old.slice(idx + marker.length);
      await supa.storage.from("works-covers").remove([objectPath]);
    }
  } catch {}

  return NextResponse.json({ ok: true });
}