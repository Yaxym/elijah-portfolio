"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import WorkCard from "./WorkCard";
import type { Work } from "@/lib/types";
import Container from "./Container";
import WorkModal from "./WorkModal";
import Reveal from "./Reveal";

const CATEGORIES = [
  "Все",
  "Key Visual",
  "Performance",
  "Branding & Logo",
  "Editorial / Media",
  "Motion / Video",
  "Product Visual",
  "UI Integration",
];

const PER_PAGE = 9;

export default function WorksSection() {
  const [works, setWorks] = useState<Work[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все");
  const [tag, setTag] = useState<string>("");
  const [active, setActive] = useState<Work | null>(null);

  const [page, setPage] = useState(1);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    fetch("/api/works", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setWorks(d.works || []))
      .catch(() => setWorks([]));
  }, []);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    works.forEach((w) => (w.tags || []).forEach((t) => s.add(t)));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [works]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return works.filter((w) => {
      const inCategory = category === "Все" ? true : w.category === category;
      const inTag = tag ? (w.tags || []).includes(tag) : true;

      const inQuery = q
        ? [w.title, w.subtitle, w.description, w.category, ...(w.tags || []), String(w.year || "")]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(q)
        : true;

      return inCategory && inTag && inQuery;
    });
  }, [works, query, category, tag]);

  // reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [query, category, tag]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filtered.length / PER_PAGE)), [filtered.length]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paged = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, page]);

  function goPage(p: number) {
    const next = Math.min(totalPages, Math.max(1, p));
    setPage(next);

    // smooth scroll back to section top (so pagination feels snappy)
    window.requestAnimationFrame(() => {
      const el = document.getElementById("works");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // keep ref for future if needed
  useEffect(() => {
    sectionRef.current = document.getElementById("works") as any;
  }, []);

  const pageNumbers = useMemo(() => {
    // compact pagination: show up to 5 pages around current
    const max = 5;
    const half = Math.floor(max / 2);

    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + max - 1);
    start = Math.max(1, end - max + 1);

    const arr: number[] = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  }, [page, totalPages]);

  return (
    <section id="works" className="py-14 md:py-20">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">Работы</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/60">
              Каждый проект — это задача бизнеса, концепт и система реализации.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по названию / тегам / описанию..."
              className="h-10 w-full rounded-full bg-white/5 px-4 text-sm text-white placeholder:text-white/35 ring-1 ring-white/10 outline-none focus:ring-white/20 md:w-80"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 rounded-full bg-white/5 px-4 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-white/20"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-[#06070a]">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => setTag("")}
            className={`rounded-full px-3 py-1.5 text-xs ring-1 transition ${
              !tag ? "bg-white text-black ring-white" : "bg-white/5 text-white/70 ring-white/10 hover:bg-white/10"
            }`}
          >
            Все теги
          </button>

          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setTag(t)}
              className={`rounded-full px-3 py-1.5 text-xs ring-1 transition ${
                tag === t ? "bg-white text-black ring-white" : "bg-white/5 text-white/70 ring-white/10 hover:bg-white/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* page content */}
        <div key={`${page}-${filtered.length}-${category}-${tag}-${query}`} className="mt-8 animate-fade-slide">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paged.map((w) => (
              <Reveal key={w.id}>
                <WorkCard work={w} onOpen={setActive} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* pagination */}
        {filtered.length > 0 ? (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-white/55">
              Показано: {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} из {filtered.length}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goPage(page - 1)}
                disabled={page <= 1}
                className="rounded-full bg-white/5 px-3 py-2 text-xs text-white/80 ring-1 ring-white/10 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5"
              >
                ←
              </button>

              {pageNumbers[0] > 1 ? (
                <>
                  <button
                    onClick={() => goPage(1)}
                    className="rounded-full bg-white/5 px-3 py-2 text-xs text-white/80 ring-1 ring-white/10 hover:bg-white/10"
                  >
                    1
                  </button>
                  <span className="px-1 text-xs text-white/35">…</span>
                </>
              ) : null}

              {pageNumbers.map((p) => (
                <button
                  key={p}
                  onClick={() => goPage(p)}
                  className={`rounded-full px-3 py-2 text-xs ring-1 transition ${
                    p === page
                      ? "bg-white text-black ring-white"
                      : "bg-white/5 text-white/80 ring-white/10 hover:bg-white/10"
                  }`}
                >
                  {p}
                </button>
              ))}

              {pageNumbers[pageNumbers.length - 1] < totalPages ? (
                <>
                  <span className="px-1 text-xs text-white/35">…</span>
                  <button
                    onClick={() => goPage(totalPages)}
                    className="rounded-full bg-white/5 px-3 py-2 text-xs text-white/80 ring-1 ring-white/10 hover:bg-white/10"
                  >
                    {totalPages}
                  </button>
                </>
              ) : null}

              <button
                onClick={() => goPage(page + 1)}
                disabled={page >= totalPages}
                className="rounded-full bg-white/5 px-3 py-2 text-xs text-white/80 ring-1 ring-white/10 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5"
              >
                →
              </button>
            </div>
          </div>
        ) : null}

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-white/5 p-6 text-sm text-white/60 ring-1 ring-white/10">
            Ничего не найдено. Попробуй снять фильтры или изменить запрос.
          </div>
        ) : null}
      </Container>

      <WorkModal work={active} onClose={() => setActive(null)} />
    </section>
  );
}