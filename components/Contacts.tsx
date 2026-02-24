"use client";

import { useMemo, useState } from "react";
import Container from "./Container";

const TELEGRAM_SHARE_URL = "https://t.me/share/url";
// сюда впиши свой email
const EMAIL_TO = "speed.design.pro@gmail.com";
// можно добавить URL сайта в сообщение
const SITE_URL = "https://elijah-portfolio-brown.vercel.app/";

function enc(v: string) {
  return encodeURIComponent(v);
}

export default function Contacts() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [task, setTask] = useState("");

  const message = useMemo(() => {
    const lines = [
      "Заявка с сайта",
      "",
      `Имя: ${name || "-"}`,
      `Контакт: ${contact || "-"}`,
      "",
      "Задача:",
      task || "-",
      "",
      `Сайт: ${SITE_URL}`,
    ];
    return lines.join("\n");
  }, [name, contact, task]);

  const onTelegram = () => {
    // Telegram share: пользователь выберет чат, но текст уже будет вставлен
    const share = `${TELEGRAM_SHARE_URL}?url=${enc(SITE_URL)}&text=${enc(message)}`;
    window.open(share, "_blank", "noopener,noreferrer");
  };

  const onEmail = () => {
    const subject = "Заявка с сайта";
    const href = `mailto:${enc(EMAIL_TO)}?subject=${enc(subject)}&body=${enc(message)}`;
    window.location.href = href;
  };

  return (
    <section id="contacts" className="py-14 md:py-20">
      <Container>
        <h2 className="text-2xl font-semibold md:text-3xl">Контакты</h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="text-sm font-semibold">Быстрые ссылки</div>
            <div className="mt-4 grid gap-3">
              <a
                className="rounded-2xl bg-white/5 p-4 text-sm ring-1 ring-white/10 hover:bg-white/10"
                href="https://t.me/elkaluv"
                target="_blank"
                rel="noreferrer"
              >
                Telegram
                <div className="mt-1 text-xs text-white/55">оперативная связь</div>
              </a>

              <a
                className="rounded-2xl bg-white/5 p-4 text-sm ring-1 ring-white/10 hover:bg-white/10"
                href={`mailto:${EMAIL_TO}`}
              >
                Email
                <div className="mt-1 text-xs text-white/55">для запросов</div>
              </a>

              <a
                className="rounded-2xl bg-white/5 p-4 text-sm ring-1 ring-white/10 hover:bg-white/10"
                href="https://www.behance.net/elijah_afanasev"
              >
                Behance
                <div className="mt-1 text-xs text-white/55">кейсы и визуалы</div>
              </a>
            </div>
          </div>

          <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="text-sm font-semibold">Обсудим ваш проект</div>
            <p className="mt-2 text-sm text-white/60">
              Опиши задачу — открою Telegram/Email с уже собранным сообщением.
            </p>

            <form
              className="mt-5 grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                onTelegram();
              }}
            >
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Имя"
                className="h-11 rounded-2xl bg-white/5 px-4 text-sm text-white placeholder:text-white/35 ring-1 ring-white/10 outline-none focus:ring-white/20"
              />
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Контакт (Telegram / Email)"
                className="h-11 rounded-2xl bg-white/5 px-4 text-sm text-white placeholder:text-white/35 ring-1 ring-white/10 outline-none focus:ring-white/20"
              />
              <textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Коротко о задаче"
                className="min-h-28 rounded-2xl bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 ring-1 ring-white/10 outline-none focus:ring-white/20"
              />

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={onTelegram}
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black hover:opacity-90"
                >
                  Написать в Telegram
                </button>
                <button
                  type="button"
                  onClick={onEmail}
                  className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
                >
                  Написать на email
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}