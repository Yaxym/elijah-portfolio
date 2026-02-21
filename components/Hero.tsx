import Container from "./Container";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -left-40 top-[-200px] h-[520px] w-[520px] rounded-full bg-indigo-500/20 blur-[90px]" />
        <div className="absolute right-[-200px] top-[-220px] h-[520px] w-[520px] rounded-full bg-fuchsia-500/15 blur-[90px]" />
      </div>

      <Container>
        <div className="grid gap-10 py-14 md:grid-cols-[1.1fr_.9fr] md:py-20">
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold leading-[1.05] md:text-6xl">
              High-impact <br />
              визуалы для <br />
              digital-продуктов.
            </h1>

            <p className="max-w-xl text-base text-white/65 md:text-lg">
              Финтех, SaaS, digital-сервисы. Запуски, performance-кампании,
              продуктовые экосистемы.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#works"
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black hover:opacity-90"
              >
                Смотреть работы
              </a>
              <a
                href="#contacts"
                className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
              >
                Обсудить проект
              </a>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 text-xs text-white/55">
              {["Key Visual", "3D", "Performance", "Product Visual"].map((t) => (
                <span key={t} className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:pt-3">
            <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="aspect-[16/10] rounded-2xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/10" />
              <div className="mt-3">
                <div className="text-sm font-semibold">Мобильная коммерция</div>
                <div className="text-xs text-white/55">Launch Key Visual</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/10" />
                <div className="mt-3">
                  <div className="text-sm font-semibold">Трансгран</div>
                  <div className="text-xs text-white/55">Global Finance Visual</div>
                </div>
              </div>
              <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/10" />
                <div className="mt-3">
                  <div className="text-sm font-semibold">Запуск METEO</div>
                  <div className="text-xs text-white/55">Performance KV</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}