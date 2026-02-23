"use client";

import { useEffect, useMemo, useState } from "react";
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

const PER_PAGE = 9;

export default function WorksSection() {
  const [works, setWorks] = useState<Work[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все");
  const [tag, setTag] = useState<string>("");
  const [active, setActive] = useState<Work | null>(null);

  const [page, setPage] = useState(1);

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

  // reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [query, category, tag]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  const pageItems = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, page]);

  // clamp page if items removed
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  function pageButtons() {
    // компактная пагинация показываем до 7 кнопок
    const maxBtns = 7;
    const half = Math.floor(maxBtns / 2);

    let start = Math.max(1, page - half);
    let end = Math.min(pageCount, start + maxBtns - 1);
    start = Math.max(1, end - maxBtns + 1);

    const nums: number[] = [];
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  }

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

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((w) => (
            <WorkCard key={w.id} work={w} onOpen={setActive} />
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-white/5 p-6 text-sm text-white/60 ring-1 ring-white/10">
            Ничего не найдено. Попробуй снять фильтры или изменить запрос.
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center gap-3">
            <div className="text-xs text-white/45">
              Показано {pageItems.length} из {filtered.length} • Страница {page} / {pageCount}
            </div>

            {pageCount > 1 ? (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-full bg-white/5 px-3 py-2 text-xs text-white/75 ring-1 ring-white/10 hover:bg-white/10 disabled:opacity-40"
                >
                  ← Назад
                </button>

                {pageButtons().map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`rounded-full px-3 py-2 text-xs ring-1 transition ${
                      n === page
                        ? "bg-white text-black ring-white"
                        : "bg-white/5 text-white/75 ring-white/10 hover:bg-white/10"
                    }`}
                  >
                    {n}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={page === pageCount}
                  className="rounded-full bg-white/5 px-3 py-2 text-xs text-white/75 ring-1 ring-white/10 hover:bg-white/10 disabled:opacity-40"
                >
                  Вперёд →
                </button>
              </div>
            ) : null}
          </div>
        )}
      </Container>

      <WorkModal work={active} onClose={() => setActive(null)} />
    </section>
  );
}