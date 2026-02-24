"use client";

import React, { useEffect, useRef, useState } from "react";

export default function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShow(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "120px 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${show ? "animate-fade-slide" : "opacity-0"} ${className}`}>
      {children}
    </div>
  );
}