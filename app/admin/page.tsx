"use client";

import React, { useEffect, useMemo, useState } from "react";

type Work = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  cover: string;
  images?: string[]; // NEW
  category: string;
  tags: string[];
  year?: number;
  href?: string;
  createdAt?: string;
  updatedAt?: string;
};

const CATEGORIES = [
  "Key Visual",
  "Performance",
  "Branding & Logo",
  "Editorial / Media",
  "Motion / Video",
  "Product Visual",
  "UI Integration",
];

function tagsToString(tags: string[] | undefined) {
  return (tags || []).join(", ");
}

export default function AdminPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");

  const [editingId, setEditingId] = useState<string | null>(null);

  // UI helper for remove images (edit mode)
  const [removeSelected, setRemoveSelected] = useState<Record<string, boolean>>({});

  async function load() {
    const r = await fetch("/api/works", { cache: "no-store" });
    const d = await r.json().catch(() => ({}));
    setWorks(d.works || []);
  }

  useEffect(() => {
    load();
  }, []);

  const editing = useMemo(
    () => works.find((w) => w.id === editingId) || null,
    [works, editingId]
  );

  useEffect(() => {
    // when open editing — reset selection
    if (editing?.images?.length) {
      const initial: Record<string, boolean> = {};
      for (const url of editing.images) initial[url] = false;
      setRemoveSelected(initial);
    } else {
      setRemoveSelected({});
    }
  }, [editingId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function createWork(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);

    const res = await fetch("/api/works", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setMsg(data?.error || "Ошибка создания");
      setLoading(false);
      return;
    }

    e.currentTarget.reset();
    setMsg("Создано");
    await load();
    setLoading(false);
  }

  async function updateWork(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingId) return;

    setMsg("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    fd.set("id", editingId);

    // build removeImages from selected checkboxes
    const toRemove = Object.entries(removeSelected)
      .filter(([, v]) => v)
      .map(([k]) => k);

    if (toRemove.length) {
      fd.set("removeImages", toRemove.join(","));
    } else {
      fd.delete("removeImages");
    }

    const res = await fetch("/api/works", { method: "PUT", body: fd });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setMsg(data?.error || "Ошибка обновления");
      setLoading(false);
      return;
    }

    setMsg("Обновлено");
    setEditingId(null);
    await load();
    setLoading(false);
  }

  async function deleteWork(id: string) {
    const ok = confirm("Удалить работу? Это удалит запись и попробует удалить файлы.");
    if (!ok) return;

    setMsg("");
    setLoading(true);

    const res = await fetch("/api/works", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data?.error || "Ошибка удаления");
      setLoading(false);
      return;
    }

    setMsg("Удалено");
    if (editingId === id) setEditingId(null);
    await load();
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#06070a] text-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Admin • Работы</h1>
            <p className="mt-2 text-sm text-white/60">
              Создание, редактирование и удаление работ. (Доступ защищён Basic Auth)
            </p>
          </div>

          <div className="flex gap-2">
            <a
              href="/"
              className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
            >
              На главную
            </a>
          </div>
        </div>

        {/* CREATE */}
        <div className="mt-8 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="text-sm font-semibold">Добавить новую работу</div>

          <form onSubmit={createWork} className="mt-5 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs text-white/60">Обложка (png/jpg/webp)</label>
                <input
                  name="cover"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  required
                  className="mt-2 block w-full rounded-2xl bg-white/5 p-3 text-sm ring-1 ring-white/10"
                />
              </div>

              <div>
                <label className="text-xs text-white/60">
                  Доп. картинки (необязательно, можно несколько)
                </label>
                <input
                  name="images"
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="mt-2 block w-full rounded-2xl bg-white/5 p-3 text-sm ring-1 ring-white/10"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs text-white/60">Название</label>
                <input
                  name="title"
                  required
                  className="mt-2 h-11 w-full rounded-2xl bg-white/5 px-4 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-white/20"
                />
              </div>

              <div>
                <label className="text-xs text-white/60">Подзаголовок</label>
                <input
                  name="subtitle"
                  className="mt-2 h-11 w-full rounded-2xl bg-white/5 px-4 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-white/20"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/60">Описание</label>
              <textarea
                name="description"
                className="mt-2 min-h-28 w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-white/20"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-xs text-white/60">Категория</label>
                <select
                  name="category"
                  defaultValue={CATEGORIES[0]}
                  className="mt-2 h-11 w-full rounded-2xl bg-white/5 px-4 text-sm ring-1 ring-white/10 outline-none focus:ring-white/20"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-[#06070a]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-white/60">Год</label>
                <input
                  name="year"
                  className="mt-2 h-11 w-full rounded-2xl bg-white/5 px-4 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-white/20"
                />
              </div>

              <div>
                <label className="text-xs text-white/60">Ссылка</label>
                <input
                  name="href"
                  className="mt-2 h-11 w-full rounded-2xl bg-white/5 px-4 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-white/20"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/60">Теги (через запятую)</label>
              <input
                name="tags"
                className="mt-2 h-11 w-full rounded-2xl bg-white/5 px-4 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-white/20"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                disabled={loading}
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black disabled:opacity-60"
              >
                {loading ? "..." : "Добавить"}
              </button>

              {msg ? <span className="text-sm text-white/70">{msg}</span> : null}
            </div>
          </form>
        </div>

        {/* EDIT */}
        {editing ? (
          <div className="mt-6 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-semibold">Редактирование: {editing.title}</div>
              <button
                onClick={() => setEditingId(null)}
                className="rounded-full bg-white/10 px-4 py-2 text-sm ring-1 ring-white/10 hover:bg-white/15"
              >
                Закрыть
              </button>
            </div>

            <div className="mt-4 grid gap-6">
              <div className="flex gap-4">
                <img
                  src={editing.cover}
                  alt=""
                  className="hidden h-28 w-44 rounded-2xl object-cover ring-1 ring-white/10 md:block"
                />

                <form onSubmit={updateWork} className="grid flex-1 gap-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-xs text-white/60">Новая обложка (необязательно)</label>
                      <input
                        name="cover"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="mt-2 block w-full rounded-2xl bg-white/5 p-3 text-sm ring-1 ring-white/10"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-white/60">
                        Добавить картинки (необязательно, можно несколько)
                      </label>
                      <input
                        name="images"
                        type="file"
                        multiple
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="mt-2 block w-full rounded-2xl bg-white/5 p-3 text-sm ring-1 ring-white/10"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-xs text-white/60">Название</label>
                      <input
                        name="title"
                        defaultValue={editing.title}
                        className="mt-2 h-11 w-full rounded-2xl bg-white/5 px-4 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-white/20"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-white/60">Подзаголовок</label>
                      <input
                        name="subtitle"
                        defaultValue={editing.subtitle || ""}
                        className="mt-2 h-11 w-full rounded-2xl bg-white/5 px-4 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-white/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-white/60">Описание</label>
                    <textarea
                      name="description"
                      defaultValue={editing.description || ""}
                      className="mt-2 min-h-28 w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-white/20"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="text-xs text-white/60">Категория</label>
                      <select
                        name="category"
                        defaultValue={editing.category}
                        className="mt-2 h-11 w-full rounded-2xl bg-white/5 px-4 text-sm ring-1 ring-white/10 outline-none focus:ring-white/20"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c} className="bg-[#06070a]">
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-white/60">Год</label>
                      <input
                        name="year"
                        defaultValue={editing.year ?? ""}
                        className="mt-2 h-11 w-full rounded-2xl bg-white/5 px-4 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-white/20"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-white/60">Ссылка</label>
                      <input
                        name="href"
                        defaultValue={editing.href || ""}
                        className="mt-2 h-11 w-full rounded-2xl bg-white/5 px-4 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-white/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-white/60">Теги</label>
                    <input
                      name="tags"
                      defaultValue={tagsToString(editing.tags)}
                      className="mt-2 h-11 w-full rounded-2xl bg-white/5 px-4 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-white/20"
                    />
                  </div>

                  {/* hidden input used by server, we fill it in code */}
                  <input name="removeImages" type="hidden" />

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      disabled={loading}
                      className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black disabled:opacity-60"
                    >
                      {loading ? "..." : "Сохранить"}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteWork(editing.id)}
                      className="rounded-full bg-red-500/20 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-red-500/30 hover:bg-red-500/25"
                    >
                      Удалить
                    </button>
                  </div>

                  {msg ? <div className="text-sm text-white/70">{msg}</div> : null}
                </form>
              </div>

              {/* Existing gallery images with selection for removal */}
              <div className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
                <div className="text-sm font-semibold">Галерея</div>
                <p className="mt-1 text-xs text-white/60">
                  Отметь картинки для удаления и нажми “Сохранить”. Новые добавляются через поле “Добавить картинки”.
                </p>

                {(editing.images || []).length ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {(editing.images || []).map((url) => (
                      <label
                        key={url}
                        className="group relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10"
                      >
                        <img src={url} alt="" className="h-36 w-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
                        <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-xs ring-1 ring-white/10">
                          <input
                            type="checkbox"
                            checked={!!removeSelected[url]}
                            onChange={(e) =>
                              setRemoveSelected((s) => ({ ...s, [url]: e.target.checked }))
                            }
                          />
                          <span>Удалить</span>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 text-sm text-white/60">Пока нет дополнительных картинок.</div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {/* LIST */}
        <div className="mt-8">
          <div className="text-sm font-semibold">Список работ</div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {works.map((w) => (
              <div key={w.id} className="overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10">
                <img src={w.cover} alt={w.title} className="h-40 w-full object-cover" />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">{w.title}</div>
                      <div className="text-xs text-white/55">
                        {w.category}
                        {typeof w.images?.length === "number" ? ` • +${w.images.length} img` : ""}
                      </div>
                    </div>
                    <button
                      onClick={() => setEditingId(w.id)}
                      className="rounded-full bg-white/10 px-3 py-1.5 text-xs ring-1 ring-white/10 hover:bg-white/15"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(w.tags || []).slice(0, 6).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-white/5 px-2 py-1 text-[11px] text-white/60 ring-1 ring-white/10"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => deleteWork(w.id)}
                      className="rounded-full bg-red-500/20 px-3 py-1.5 text-xs ring-1 ring-red-500/30 hover:bg-red-500/25"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {works.length === 0 ? (
            <div className="mt-6 rounded-3xl bg-white/5 p-6 text-sm text-white/60 ring-1 ring-white/10">
              Пока нет работ.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}