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
    // убираем дубли/пустые
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
      className="fixed inset-0 z-[100] bg-black/70 p-3 md:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="mx-auto h-[calc(100vh-24px)] w-full max-w-6xl overflow-hidden rounded-3xl bg-[#0b0d12] ring-1 ring-white/10 md:h-[calc(100vh-48px)]">
        {/* header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-[#0b0d12]/80 p-4 backdrop-blur md:p-5">
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

        {/* body */}
        <div className="h-[calc(100%-64px)] overflow-y-auto md:h-[calc(100%-72px)]">
          <div className="grid gap-6 p-4 md:grid-cols-[1.55fr_.45fr] md:p-6">
            {/* images column */}
            <div className="space-y-4">
              {(images.length ? images : [work.cover]).map((src, i) => (
                <div key={`${src}-${i}`} className="overflow-hidden rounded-3xl bg-black/25 ring-1 ring-white/10">
                  <img
                    src={src}
                    alt={`${work.title} — ${i + 1}`}
                    className="w-full object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            {/* info column */}
            <aside className="md:sticky md:top-[88px] md:h-fit">
              <div className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
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

                <div className="mt-4">
                  {work.description ? (
                    <div className="text-sm leading-relaxed text-white/70 whitespace-pre-wrap">
                      {work.description}
                    </div>
                  ) : (
                    <div className="text-sm text-white/50">Описание не добавлено.</div>
                  )}
                </div>

                {work.tags?.length ? (
                  <div className="mt-4 flex flex-wrap gap-1.5">
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
                    className="mt-5 inline-flex w-full justify-center rounded-full bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-white/90"
                  >
                    Открыть ссылку →
                  </a>
                ) : null}

                <div className="mt-4 text-xs text-white/45">
                  {images.length} изображений
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}