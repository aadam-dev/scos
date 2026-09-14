"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const words =
  "Every SC generation leaves a trail. The next one picks it up.".split(" ");

export function TaglineReveal() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const [active, setActive] = useState(reduce ? words.length : 0);

  useEffect(() => {
    if (reduce || !ref.current) return;
    const nodes = Array.from(ref.current.querySelectorAll("[data-word]"));
    const observers = nodes.map((node, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive((prev) => Math.max(prev, i + 1));
            obs.disconnect();
          }
        },
        { threshold: 0.6, rootMargin: "0px 0px -20% 0px" },
      );
      obs.observe(node);
      return obs;
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [reduce]);

  return (
    <section className="bg-ink-950 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-4xl">
        <p
          ref={ref}
          className="text-balance text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl"
        >
          {words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              data-word
              className="mr-[0.28em] inline-block transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{
                color:
                  i < active ? "rgb(255,255,255)" : "rgba(255,255,255,0.28)",
              }}
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
