"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  wrapperClassName?: string;
};

export default function FadeInImage({
  wrapperClassName,
  className,
  loading,
  ...imgProps
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
            break;
          }
        }
      },
      { root: null, threshold: 0.12, rootMargin: "150px 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const shouldShow = inView && loaded;

  return (
    <div ref={ref} className={wrapperClassName}>
      {/* placeholder */}
      <div
        className={`absolute inset-0 rounded-[inherit] bg-white/5 ring-1 ring-white/10 transition-opacity duration-300 ${
          shouldShow ? "opacity-0" : "opacity-100"
        }`}
      />

      <img
        {...imgProps}
        loading={loading ?? "lazy"}
        onLoad={(e) => {
          setLoaded(true);
          imgProps.onLoad?.(e);
        }}
        className={`relative transition-opacity duration-300 ${
          shouldShow ? "opacity-100 animate-img-fade" : "opacity-0"
        } ${className || ""}`}
      />
    </div>
  );
}