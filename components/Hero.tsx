"use client";

import { useEffect, useMemo, useState } from "react";
import Container from "./Container";
import type { Work } from "@/lib/types";
import WorkCard from "./WorkCard";
import WorkModal from "./WorkModal";

function pickRandom<T>(arr: T[], n: number) {
  const a = [...arr];
  // Fisher–Yates
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, Math.min(n, a.length));
}

export default function Hero() {
  const [works, setWorks] = useState<Work[]>([]);
  const [active, setActive] = useState<Work | null>(null);

  useEffect(() => {
    fetch("/api/works", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setWorks(d.works || []))
      .catch(() => setWorks([]));
  }, []);

  // каждый рефреш страницы — новая 4ка
  const featured = useMemo(() => pickRandom(works, 4), [works]);

  return (
    <section className="pt-16 md:pt-24">
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* left */}
          <div>
            <h1 className="text-4xl font-semibold leading-[1.05] md:text-6xl">
              High-impact <br />
              визуалы для <br />
              digital-продуктов.
            </h1>

            <p className="mt-5 max-w-xl text-sm text-white/60 md:text-base">
              Финтех, SaaS, digital-сервисы. Запуски, performance-кампании, продуктовые экосистемы.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#works"
                className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-3 text-sm font-medium text-white ring-1 ring-white/15 hover:bg-white/15"
              >
                Смотреть работы →
              </a>
              <a
                href="#contacts"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-medium text-black hover:bg-white/90"
              >
                Обсудить проект
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/60">
              {["Key Visuals", "3D/CG", "Performance Ads", "Product Visuals"].map((t) => (
                <span key={t} className="rounded-full bg-white/5 px-3 py-1.5 ring-1 ring-white/10">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* right – как на референсе: 2 колонки, по 2 карточки */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* col 1 */}
            <div className="flex flex-col gap-4">
              {featured[0] ? <WorkCard work={featured[0]} onOpen={setActive} coverHeightClass="h-56 md:h-60" /> : null}
              {featured[1] ? <WorkCard work={featured[1]} onOpen={setActive} coverHeightClass="h-56 md:h-60" /> : null}
            </div>

            {/* col 2 */}
            <div className="flex flex-col gap-4">
              {featured[2] ? <WorkCard work={featured[2]} onOpen={setActive} coverHeightClass="h-56 md:h-60" /> : null}
              {featured[3] ? <WorkCard work={featured[3]} onOpen={setActive} coverHeightClass="h-56 md:h-60" /> : null}
            </div>
          </div>
        </div>
      </Container>

      <WorkModal work={active} onClose={() => setActive(null)} />
    </section>
  );
}