"use client";

import { useEffect, useMemo, useState } from "react";
import type { Work } from "@/lib/types";
import FadeInImage from "./FadeInImage";

export default function WorkModal({
  work,
  onClose,
}: {
  work: Work | null;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);

  const images = useMemo(() => {
    if (!work) return [];
    const arr = Array.isArray(work.images) && work.images.length > 0 ? work.images : [work.cover];
    return Array.from(new Set(arr.filter(Boolean)));
  }, [work]);

  useEffect(() => {
    setIdx(0);
  }, [work?.id]);

  useEffect(() => {
    if (!work) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIdx((v) => (v - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setIdx((v) => (v + 1) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [work, images.length, onClose]);

  if (!work) return null;

  const current = images[idx] || work.cover;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-[#0b0d12] ring-1 ring-white/10">
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

        <div className="grid gap-0 md:grid-cols-[1.35fr_0.65fr]">
          {/* Left */}
          <div className="relative bg-black/30">
            <FadeInImage
              wrapperClassName="relative"
              src={current}
              alt={work.title}
              className="h-[50vh] w-full object-contain md:h-[70vh]"
              loading="eager"
            />

            {images.length > 1 ? (
              <>
                <button
                  onClick={() => setIdx((v) => (v - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-white ring-1 ring-white/10 hover:bg-black/70"
                  aria-label="Prev"
                >
                  ←
                </button>
                <button
                  onClick={() => setIdx((v) => (v + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-white ring-1 ring-white/10 hover:bg-black/70"
                  aria-label="Next"
                >
                  →
                </button>
              </>
            ) : null}
          </div>

          {/* Right */}
          <div className="space-y-4 p-4 md:p-5">
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

            {images.length > 1 ? (
              <div className="pt-2">
                <div className="text-xs text-white/50">Галерея</div>
                <div className="mt-2 grid grid-cols-5 gap-2">
                  {images.slice(0, 10).map((u, i) => (
                    <button
                      key={u}
                      onClick={() => setIdx(i)}
                      className={`overflow-hidden rounded-xl ring-1 transition ${
                        i === idx ? "ring-white/40" : "ring-white/10 hover:ring-white/25"
                      }`}
                      title={`#${i + 1}`}
                    >
                      <FadeInImage wrapperClassName="relative" src={u} alt="" className="h-14 w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}