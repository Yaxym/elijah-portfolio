import Header from "@/components/Header";
import Contacts from "@/components/Contacts";
import Hero from "@/components/Hero";
import WorksSection from "@/components/WorksSection";
import Services from "@/components/Services";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";


export default function HomePage() {
  return (
    <div>
      <Header />
      <main>
        <Hero />
        <WorksSection />
        <Services />

        <section id="about" className="py-14 md:py-20">
          <Container>
            <h2 className="text-2xl font-semibold md:text-3xl">Обо мне</h2>

            <div className="mt-8 grid gap-4 md:grid-cols-[1.4fr_.6fr]">
              <Reveal>
                <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
                  <div className="text-sm font-semibold">Елисей Афанасьев</div>
                  <div className="mt-2 text-sm text-white/60">
                    В дизайне более 10 лет. Работаю на стыке 3D, брендинга и performance-коммуникациями. Помогаю продуктам выглядеть дороже,
                    дороже, убедительнее и сильнее в конкурентной среде.
                  </div>

                  <div className="mt-6 text-xs text-white/60">
                    <div className="font-semibold text-white/80">Работаю с:</div>
                    <ul className="mt-3 space-y-2">
                      {[
                        "3D key visuals для запусков",
                        "Performance-креативами",
                        "Визуальными системами для digital-сервисов",
                        "Интеграцией 3D в интерфейсы",
                      ].map((x) => (
                        <li key={x} className="flex gap-2">
                          <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-white/40" />
                          <span>{x}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-2 text-sm text-white/60">
                    Инструменты: Photoshop, Illustrator, After Effects, Blender, Cinema 4D, Figma. Использую AI как инструмент ускорения. 
                    Мне важно не просто сделать красиво — а усилить продукт через визуал.
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
                  <div className="text-sm font-semibold">Факты</div>
                  <div className="mt-3 space-y-2 text-xs text-white/60">
                    <div className="flex items-center justify-between gap-2">
                      <span>Опыт</span>
                      <span className="text-white/45">в дизайне с 9 лет</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span>Фокус</span>
                      <span className="text-white/45">3D + digital-коммуникация</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span>Подход</span>
                      <span className="text-white/45">системность + скорость</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span>Формат</span>
                      <span className="text-white/45">проекты / удалённо / долгосрочно</span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-black/30 p-4 ring-1 ring-white/10">
                    <div className="text-xs font-semibold text-white/80">Как работаю</div>
                    <ol className="mt-2 space-y-2 text-xs text-white/60">
                      <li>1. Погружение в продукт и задачу</li>
                      <li>2. Концепт + ключевой визуал</li>
                      <li>3. Система адаптаций и финал</li>
                    </ol>
                  </div>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        <Contacts />
      </main>

      <Footer />
    </div>
  );
}