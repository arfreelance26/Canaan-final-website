"use client";

import { useState, useEffect } from "react";

/**
 * One-shot visibility hook — returns true once the element enters the viewport,
 * then disconnects. Animations never replay on scroll-back.
 */
export default function useFadeIn(ref, threshold = 0.05) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);

  return visible;
}
