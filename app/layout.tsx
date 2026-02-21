import "./globals.css";

export const metadata = {
  title: "Портфолио — High-impact визуалы",
  description: "Портфолио digital- и 3D-визуалов с фильтрацией работ.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}