import type { Work } from "@/lib/types";

export default function WorkCard({ work }: { work: Work }) {
  return (
    <article className="group overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 transition hover:bg-white/[0.07]">
      <div className="relative">
        {/* обычный img, чтобы не тянуть next/image и не упираться в оптимизацию */}
        <img
          src={work.cover}
          alt={work.title}
          className="h-52 w-full object-cover opacity-95 transition group-hover:opacity-100"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0" />
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">{work.title}</div>
            {work.subtitle ? <div className="text-xs text-white/55">{work.subtitle}</div> : null}
          </div>
          <span className="shrink-0 rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/70 ring-1 ring-white/10">
            {work.category}
          </span>
        </div>

        {work.description ? (
          <p className="line-clamp-2 text-xs leading-relaxed text-white/60">{work.description}</p>
        ) : null}

        <div className="flex flex-wrap gap-1.5 pt-1">
          {work.tags?.slice(0, 6).map((t) => (
            <span
              key={t}
              className="rounded-full bg-white/5 px-2 py-1 text-[11px] text-white/60 ring-1 ring-white/10"
            >
              {t}
            </span>
          ))}
        </div>

        {work.href ? (
          <a
            href={work.href}
            target="_blank"
            className="inline-flex pt-1 text-xs text-white/70 hover:text-white"
          >
            Смотреть кейс →
          </a>
        ) : null}
      </div>
    </article>
  );
}