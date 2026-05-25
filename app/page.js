"use client";
import { useRef, useEffect } from "react";
import DavidHazHero from "./components/Hero";
import CustomerGlobeSection from "./components/CustomerGlobe";
import About from "./components/About";
import FleetSection from "./components/Fleet";
import FounderSection from "./components/Founder";
import ClientsSection from "./components/Client";
import TestimonialsSection from "./components/Testimonial";
import TimelineSection from "./components/Timeline";
import ContactSection from "./components/Contact";
import WorldNetworkSection from "./components/World";
import GroupSection from "./components/Group";

// Section order — Group is index 0 (no D; is the C target for index 1)
const SECTIONS = [
  GroupSection,
  CustomerGlobeSection,
  TimelineSection,
  FleetSection,
  WorldNetworkSection,
  ClientsSection,
  TestimonialsSection,
  ContactSection,
];

export default function Home() {
  const wrapRefs = useRef([]);

  useEffect(() => {
    const wraps = wrapRefs.current.filter(Boolean);

    // ── Set initial hidden state for sections not yet in viewport ──────────
    // Group (index 0) is revealed by the hero slide-over — skip it
    wraps.forEach((el, i) => {
      if (i === 0) return;
      const { top, bottom } = el.getBoundingClientRect();
      if (!(top < window.innerHeight && bottom > 0)) {
        el.style.opacity    = "0";
        el.style.transform  = "translateY(40px)";
        el.style.willChange = "transform, opacity";
      }
    });

    // Safety net: reveal any still-hidden sections after 2.5s
    const fallback = setTimeout(() => {
      wraps.forEach((el) => {
        if (el.style.opacity === "0") {
          el.style.transition = "transform 0.6s ease, opacity 0.6s ease";
          el.style.opacity    = "1";
          el.style.transform  = "translateY(0)";
        }
      });
    }, 2500);

    const observers = [];

    wraps.forEach((el, i) => {
      // ── D: one-shot entrance — section rises into view ──────────────────
      if (i > 0) {
        const dObs = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            el.style.transition =
              "transform 0.95s cubic-bezier(0.16,1,0.3,1), opacity 0.8s ease";
            el.style.opacity   = "1";
            el.style.transform = "translateY(0)";
            dObs.disconnect();
          },
          { threshold: 0.1 }
        );
        dObs.observe(el);
        observers.push(dObs);
      }

      // ── C: previous section recedes as this one enters ──────────────────
      if (i > 0) {
        const cObs = new IntersectionObserver(
          ([entry]) => {
            const prev = wraps[i - 1];
            if (!prev) return;
            if (entry.isIntersecting) {
              // Push previous section back
              prev.style.transition =
                "transform 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.7s ease";
              prev.style.transform = "scale(0.96) translateY(-12px)";
              prev.style.opacity   = "0.78";
            } else if (entry.boundingClientRect.top > 0) {
              // User scrolled back up — restore previous section
              prev.style.transition =
                "transform 0.55s ease, opacity 0.55s ease";
              prev.style.transform = "scale(1) translateY(0)";
              prev.style.opacity   = "1";
            }
          },
          { threshold: 0.1 }
        );
        cObs.observe(el);
        observers.push(cObs);
      }
    });

    return () => {
      clearTimeout(fallback);
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    <div>
      <DavidHazHero />
      <div style={{ position: "relative", zIndex: 2 }}>
        {SECTIONS.map((Section, i) => (
          <div key={i} ref={(el) => { wrapRefs.current[i] = el; }}>
            <Section />
          </div>
        ))}
      </div>
    </div>
  );
}
