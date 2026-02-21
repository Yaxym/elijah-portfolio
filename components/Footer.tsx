import Container from "./Container";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <Container>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="text-sm text-white/55">© {new Date().getFullYear()}. Все права защищены.</div>
          <div className="text-xs text-white/45">
            dev @poisonouswaters
          </div>
        </div>
      </Container>
    </footer>
  );
}