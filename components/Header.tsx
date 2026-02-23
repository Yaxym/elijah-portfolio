import Container from "./Container";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#06070a]/70 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <a href="#top" className="flex items-center gap-2">
            {/* LOGO / AVATAR */}
            <img
              src="/avatar.png" // положи файл в /public/avatar.png
              alt="Елисей Афанасьев"
              className="h-9 w-9 rounded-full object-cover ring-1 ring-white/15 bg-white/5"
              loading="eager"
            />

            <div className="leading-tight">
              <div className="text-sm font-semibold">Елисей Афанасьев</div>
              <div className="text-xs text-white/55">Visual Designer • 3D • Motion</div>
            </div>
          </a>

          <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            <a className="hover:text-white" href="#works">
              Работы
            </a>
            <a className="hover:text-white" href="#services">
              Услуги
            </a>
            <a className="hover:text-white" href="#about">
              Обо мне
            </a>
            <a className="hover:text-white" href="#contacts">
              Контакты
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#contacts"
              className="rounded-full bg-white/10 px-4 py-2 text-sm text-white ring-1 ring-white/10 hover:bg-white/15"
            >
              Обсудить проект
            </a>
          </div>
        </div>
      </Container>
    </header>
  );
}