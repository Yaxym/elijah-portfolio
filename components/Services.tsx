import Container from "./Container";

const services = [
  {
    title: "3D Key Visuals for Digital Products",
    desc: "High-impact 3D визуалы для финтех, SaaS и digital-сервисов.",
    bullets: ["KV для рекламных форматов", "Concept & Art Direction", "3D сцены"],
  },
  {
    title: "Performance Campaign Design",
    desc: "Серия креативов для performance-кампаний и масштабирования.",
    bullets: ["Key visual → адаптации", "Сетка форматов", "Motion (по необходимости)"],
  },
  {
    title: "Product 3D & Visual Systems",
    desc: "3D-объекты и серии для коммуникации продукта.",
    bullets: ["3D assets", "UI интеграция", "Иллюстрации/иконки"],
  },
  {
    title: "Branding & Identity",
    desc: "Айдентика и графическая система для продукта/бренда.",
    bullets: ["Logo", "Visual Identity", "Brand Guidelines"],
  },
  {
    title: "Media & Editorial Visuals",
    desc: "Визуальный storytelling для медиа, постеров, обложек.",
    bullets: ["Podcast Covers", "Documentary Posters", "Key Art"],
  },
  {
    title: "UI Integration & Visual Support",
    desc: "Интеграция визуалов в интерфейсы и поддержку продукта.",
    bullets: ["Ретушь под UI", "Hero-секции и иллюстрации", "App Store / презентации"],
  },
];

export default function Services() {
  return (
    <section id="services" className="py-14 md:py-20">
      <Container>
        <h2 className="text-2xl font-semibold md:text-3xl">Услуги</h2>
        <p className="mt-2 max-w-2xl text-sm text-white/60">
          High-impact 3D & performance visuals for fintech, SaaS and digital products.
          Launches. Campaigns. Product ecosystems.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
              <div className="text-sm font-semibold">{s.title}</div>
              <div className="mt-2 text-sm text-white/60">{s.desc}</div>
              <ul className="mt-4 space-y-2 text-xs text-white/65">
                {s.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-white/40" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}