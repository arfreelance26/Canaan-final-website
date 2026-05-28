"use client";

import { useState, useEffect } from "react";

/**
 * Continuous scroll-reveal hook.
 * Returns `true` when the element is intersecting the viewport,
 * `false` when it leaves. Animations replay every time the element
 * scrolls back into view (both directions).
 */
export default function useScrollReveal(ref, threshold = 0.08) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return isVisible;
}
