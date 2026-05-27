"use client";

import { useState, useEffect } from "react";

/**
 * Continuous scroll-reveal hook.
 * Returns `true` when the element is intersecting the viewport,
 * `false` when it leaves. This means animations replay every time
 * the user scrolls an element back into view.
 */
export default function useScrollReveal(ref, threshold = 0.08) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return isVisible;
}
