import Header from "@/components/Header";
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
                    В дизайне более 10 лет. Работаю на стыке 3D, брендинга и performance-маркетинга. Помогаю продуктам выглядеть дороже,
                    убедительнее и сильнее в конкурентной среде.
                  </div>

                  <div className="mt-6 text-xs text-white/60">
                    <div className="font-semibold text-white/80">Работаю с:</div>
                    <ul className="mt-3 space-y-2">
                      {[
                        "3D key visuals для запусков",
                        "Performance-креативы",
                        "Визуальные системы для digital-сервисов",
                        "Интеграция визуалов в интерфейсы",
                      ].map((x) => (
                        <li key={x} className="flex gap-2">
                          <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-white/40" />
                          <span>{x}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
                  <div className="text-sm font-semibold">Фокус</div>
                  <div className="mt-3 space-y-2 text-xs text-white/60">
                    <div className="flex items-center justify-between gap-2">
                      <span>3D + digital-коммуникации</span>
                      <span className="text-white/45">основа</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span>Скорость и системность</span>
                      <span className="text-white/45">под запуск</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span>Форматы</span>
                      <span className="text-white/45">продукты / кампании</span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-black/30 p-4 ring-1 ring-white/10">
                    <div className="text-xs font-semibold text-white/80">Как работаю</div>
                    <ol className="mt-2 space-y-2 text-xs text-white/60">
                      <li>1) Погружение в продукт и задачу</li>
                      <li>2) Концепт + ключевые референсы</li>
                      <li>3) Система адаптаций и финал</li>
                    </ol>
                  </div>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        <section id="contacts" className="py-14 md:py-20">
          <Container>
            <h2 className="text-2xl font-semibold md:text-3xl">Контакты</h2>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <Reveal>
                <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
                  <div className="text-sm font-semibold">Быстрые ссылки</div>
                  <div className="mt-4 grid gap-3">
                    <a className="rounded-2xl bg-white/5 p-4 text-sm ring-1 ring-white/10 hover:bg-white/10" href="#">
                      Telegram
                      <div className="mt-1 text-xs text-white/55">оперативная связь</div>
                    </a>
                    <a className="rounded-2xl bg-white/5 p-4 text-sm ring-1 ring-white/10 hover:bg-white/10" href="#">
                      Email
                      <div className="mt-1 text-xs text-white/55">для запросов</div>
                    </a>
                    <a className="rounded-2xl bg-white/5 p-4 text-sm ring-1 ring-white/10 hover:bg-white/10" href="#">
                      Behance
                      <div className="mt-1 text-xs text-white/55">кейсы и визуалы</div>
                    </a>
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
                  <div className="text-sm font-semibold">Обсудим ваш проект</div>
                  <p className="mt-2 text-sm text-white/60">Опиши задачу — отвечу с предложением, бюджетом и сроками.</p>

                  <form className="mt-5 grid gap-3">
                    <input
                      placeholder="Имя"
                      className="h-11 rounded-2xl bg-white/5 px-4 text-sm text-white placeholder:text-white/35 ring-1 ring-white/10 outline-none focus:ring-white/20"
                    />
                    <input
                      placeholder="Контакт (Telegram / Email)"
                      className="h-11 rounded-2xl bg-white/5 px-4 text-sm text-white placeholder:text-white/35 ring-1 ring-white/10 outline-none focus:ring-white/20"
                    />
                    <textarea
                      placeholder="Коротко о задаче"
                      className="min-h-28 rounded-2xl bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 ring-1 ring-white/10 outline-none focus:ring-white/20"
                    />
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button type="button" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black hover:opacity-90">
                        Написать в Telegram
                      </button>
                      <button
                        type="button"
                        className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
                      >
                        Написать на email
                      </button>
                    </div>
                  </form>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}