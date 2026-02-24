"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import WorkCard from "./WorkCard";
import type { Work } from "@/lib/types";
import Container from "./Container";
import WorkModal from "./WorkModal";

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

const PAGE_SIZE = 6;

export default function WorksSection() {
  const [works, setWorks] = useState<Work[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все");
  const [tag, setTag] = useState<string>("");
  const [active, setActive] = useState<Work | null>(null);

  const [page, setPage] = useState(1);
  const [anim, setAnim] = useState<"idle" | "out" | "in">("idle");

  const topRef = useRef<HTMLDivElement | null>(null);

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
        ? [
            w.title,
            w.subtitle,
            w.description,
            w.category,
            ...(w.tags || []),
            String(w.year || ""),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(q)
        : true;

      return inCategory && inTag && inQuery;
    });
  }, [works, query, category, tag]);

  // сбрасываем страницу при изменении фильтров
  useEffect(() => {
    setPage(1);
  }, [query, category, tag]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  }, [filtered.length]);

  // не даём странице выйти за границы
  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  function goToPage(next: number) {
    const target = Math.min(Math.max(1, next), totalPages);
    if (target === page) return;

    setAnim("out");
    window.setTimeout(() => {
      setPage(target);
      // поднимаем к сетке работ
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setAnim("in");
      window.setTimeout(() => setAnim("idle"), 180);
    }, 160);
  }

  return (
    <section id="works" className="py-14 md:py-20">
      <Container>
        <div ref={topRef} />

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

        {/* grid with smooth page switch */}
        <div
          className={`mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 transition duration-200 ${
            anim === "out" ? "opacity-0 translate-y-2" : anim === "in" ? "opacity-100 translate-y-0" : "opacity-100"
          }`}
        >
          {pageItems.map((w) => (
            <WorkCard key={w.id} work={w} onOpen={setActive} />
          ))}
        </div>

        {/* pagination */}
        {totalPages > 1 ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10 hover:bg-white/10 disabled:opacity-40"
            >
              ← Назад
            </button>

            <div className="mx-2 text-sm text-white/60">
              {page} / {totalPages}
            </div>

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10 hover:bg-white/10 disabled:opacity-40"
            >
              Вперёд →
            </button>
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