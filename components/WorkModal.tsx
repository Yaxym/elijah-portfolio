"use client";

import { useEffect, useMemo } from "react";
import type { Work } from "@/lib/types";

export default function WorkModal({
  work,
  onClose,
}: {
  work: Work | null;
  onClose: () => void;
}) {
  const images = useMemo(() => {
    if (!work) return [];
    const arr = Array.isArray(work.images) && work.images.length > 0 ? work.images : [work.cover];
    // убираем пустые и дубли
    return Array.from(new Set(arr.filter(Boolean)));
  }, [work]);

  useEffect(() => {
    if (!work) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [work, onClose]);

  if (!work) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="mx-auto flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-[#0b0d12] ring-1 ring-white/10">
        {/* header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-4 md:p-5">
          <div className="min-w-0">
            <div className="truncate text-base font-semibold md:text-lg">{work.title}</div>
            {work.subtitle ? <div className="mt-1 text-sm text-white/60">{work.subtitle}</div> : null}
          </div>

          <button
            onClick={onClose}
            className="shrink-0 rounded-full bg-white/5 px-3 py-1.5 text-sm text-white/80 ring-1 ring-white/10 hover:bg-white/10"
          >
            Закрыть ✕
          </button>
        </div>

        {/* content */}
        <div className="grid flex-1 gap-0 overflow-hidden md:grid-cols-[1.35fr_0.65fr]">
          {/* LEFT: вертикальная лента картинок */}
          <div className="h-full overflow-y-auto bg-black/20 p-4 md:p-6">
            <div className="space-y-4">
              {images.map((src, i) => (
                <figure key={`${src}-${i}`} className="overflow-hidden rounded-2xl ring-1 ring-white/10">
                  <img
                    src={src}
                    alt={`${work.title} — ${i + 1}`}
                    loading="lazy"
                    className="w-full object-contain bg-black/30"
                    style={{
                      // чтобы “большие” смотрелись как в рефе: ограничим высоту каждого кадра
                      maxHeight: "78vh",
                    }}
                  />
                </figure>
              ))}
            </div>
          </div>

          {/* RIGHT: инфо (можно скроллить отдельно) */}
          <div className="h-full overflow-y-auto border-t border-white/10 p-4 md:border-l md:border-t-0 md:p-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/75 ring-1 ring-white/10">
                  {work.category}
                </span>
                {work.year ? (
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/75 ring-1 ring-white/10">
                    {work.year}
                  </span>
                ) : null}
              </div>

              {work.description ? (
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-white/70">{work.description}</div>
              ) : (
                <div className="text-sm text-white/50">Описание не добавлено.</div>
              )}

              {work.tags?.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {work.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/65 ring-1 ring-white/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}

              {work.href ? (
                <a
                  href={work.href}
                  target="_blank"
                  className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90"
                >
                  Открыть ссылку →
                </a>
              ) : null}

              <div className="text-xs text-white/45">Картинок: {images.length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}