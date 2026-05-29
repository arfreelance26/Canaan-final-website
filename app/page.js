"use client";
import { useRef, useEffect } from "react";
import DavidHazHero from "./components/Hero";
import CustomerGlobeSection from "./components/CustomerGlobe";
import AboutTeaserSection from "./components/AboutTeaser";
import FleetSection from "./components/Fleet";
import ClientsSection from "./components/Client";
import TimelineSection from "./components/Timeline";
import ContactSection from "./components/Contact";
import WorldNetworkSection from "./components/World";
import GroupSection from "./components/Group";

// Section order
const SECTIONS = [
  GroupSection,          // 0 — Home
  CustomerGlobeSection,  // 1 — Home
  TimelineSection,       // 2 — Home
  WorldNetworkSection,   // 3 — Service
  AboutTeaserSection,    // 4 — About (teaser → links to /about)
  FleetSection,          // 5 — Fleet
  ClientsSection,        // 6 — Clients
  ContactSection,        // 7 — Contact
];

const SECTION_NAV_ITEMS = [
  "Home",
  "Home",
  "Home",
  "Service",
  "About",
  "Fleet",
  "Clients",
  "Contact",
];

export default function Home() {
  const wrapRefs = useRef([]);
  const snapRef  = useRef({ cooldown: false, delta: 0, ticks: 0, lastTime: 0, quietTimer: null });

  useEffect(() => {
    const wraps = wrapRefs.current.filter(Boolean);

    // ── Set initial hidden state for sections not yet in viewport ──────────
    // Group (index 0) is revealed by the hero slide-over — skip it
    wraps.forEach((el, i) => {
      if (i === 0) return;
      const { top, bottom } = el.getBoundingClientRect();
      if (!(top < window.innerHeight && bottom > 0)) {
        el.style.opacity    = "0";
        el.style.transform  = "scale(0.97)";
        el.style.willChange = "transform, opacity";
      }
    });

    // Safety net: reveal any still-hidden sections after 2.5s
    const fallback = setTimeout(() => {
      wraps.forEach((el) => {
        if (el.style.opacity === "0") {
          el.style.transition = "transform 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.7s ease";
          el.style.opacity    = "1";
          el.style.transform  = "scale(1)";
          el.style.willChange = "auto";
        }
      });
    }, 2500);

    const observers = [];

    wraps.forEach((el, i) => {
      // ── D: one-shot entrance — section fades + scales into view ─────────
      if (i > 0) {
        const dObs = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            el.style.transition =
              "transform 1.1s cubic-bezier(0.16,1,0.3,1), opacity 0.85s ease";
            el.style.opacity   = "1";
            el.style.transform = "scale(1)";
            el.addEventListener("transitionend", () => {
              el.style.willChange = "auto";
            }, { once: true });
            dObs.disconnect();
          },
          { threshold: 0.08 }
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
              // Push previous section back with scale + blur.
              // Skip opacity on i===1 (GroupSection covers sticky hero — fading it
              // to <1 lets the hero bleed through behind it).
              const fadeOpacity = i > 1;
              prev.style.transition = fadeOpacity
                ? "transform 0.85s cubic-bezier(0.4,0,0.2,1), opacity 0.75s ease, filter 0.75s ease"
                : "transform 0.85s cubic-bezier(0.4,0,0.2,1), filter 0.75s ease";
              prev.style.transform = "scale(0.93)";
              prev.style.filter    = "blur(2px)";
              if (fadeOpacity) prev.style.opacity = "0.55";
            } else if (entry.boundingClientRect.top > 0) {
              // User scrolled back up — restore previous section
              prev.style.transition =
                "transform 0.65s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease, filter 0.55s ease";
              prev.style.transform = "scale(1)";
              prev.style.filter    = "blur(0px)";
              prev.style.opacity   = "1";
            }
          },
          { threshold: 0.18 }
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

  // ── Wheel-snap: snaps to the next section on fast / multi-tick scrolls ────
  useEffect(() => {
    const state = snapRef.current;
    const WINDOW_MS = 160;  // accumulation window in ms
    const TICK_MIN  = 3;    // min events in window to trigger section snap
    const DELTA_MIN = 300;  // OR accumulated |deltaY| to trigger section snap
    // QUIET_MS: cooldown lifts this long after the LAST scroll event.
    // Trackpad momentum keeps re-arming it until inertia fully decays.
    // A physical mouse releases almost immediately (no momentum events).
    const QUIET_MS  = 360;

    const getSectionTops = () =>
      wrapRefs.current
        .filter(Boolean)
        .map((el) => {
          // Walk offsetParent chain — layout-based, unaffected by CSS transforms
          // (getBoundingClientRect would include scale/translateY from recede animations)
          let t = 0, node = el;
          while (node) { t += node.offsetTop; node = node.offsetParent; }
          return t;
        });

    // Re-arm the quiet timer — called on every event so momentum extends the lock
    const armQuiet = () => {
      clearTimeout(state.quietTimer);
      state.quietTimer = setTimeout(() => {
        state.cooldown = false;
        state.delta    = 0;
        state.ticks    = 0;
      }, QUIET_MS);
    };

    const handleWheel = (e) => {
      // During cooldown: keep extending the quiet timer so trackpad momentum
      // can't accidentally re-trigger a snap before the gesture fully settles.
      if (state.cooldown) { armQuiet(); return; }

      const now = Date.now();
      if (now - state.lastTime > WINDOW_MS) { state.delta = 0; state.ticks = 0; }
      state.lastTime = now;
      state.delta   += Math.abs(e.deltaY);
      state.ticks   += 1;

      const dir     = e.deltaY > 0 ? 1 : -1;
      const scrollY = window.scrollY;
      const vh      = window.innerHeight;

      // Fire a snap and arm the adaptive quiet lock
      const doSnap = (targetY) => {
        state.cooldown = true; state.delta = 0; state.ticks = 0;
        window.scrollTo({ top: targetY, behavior: "smooth" });
        armQuiet();
      };

      // ── Panel snap inside tall sections (e.g. horizontal timeline) ──────
      // A single scroll advances exactly one panel. At the edge panel we
      // fall through so a multi-scroll can exit the section entirely.
      const tallEl = wrapRefs.current.filter(Boolean).find((el) => {
        if (el.offsetHeight <= vh * 1.5) return false;
        const top    = Math.round(el.getBoundingClientRect().top + scrollY);
        const bottom = top + el.offsetHeight;
        return scrollY >= top && scrollY < bottom - vh;
      });

      if (tallEl) {
        const sTop     = Math.round(tallEl.getBoundingClientRect().top + scrollY);
        const scrollable = tallEl.offsetHeight - vh;
        const N        = Math.round(tallEl.offsetHeight / vh);
        const current  = Math.round(((scrollY - sTop) / scrollable) * (N - 1));
        const next     = Math.max(0, Math.min(N - 1, current + dir));

        if (next !== current) {
          doSnap(sTop + (next / (N - 1)) * scrollable);
          return;
        }
        // At edge panel — fall through to section snap
      }

      // ── Section-level snap (multi-scroll only) ───────────────────────────
      if (state.ticks < TICK_MIN && state.delta < DELTA_MIN) return;

      const tops   = getSectionTops();
      const target = dir > 0
        ? tops.find((t) => t > scrollY + 80)
        : [...tops].reverse().find((t) => t < scrollY - 80);

      if (target === undefined) return;
      doSnap(target);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div>
      <DavidHazHero />
      <div style={{ position: "relative", zIndex: 2, background: "#f5f4f0" }}>
        {SECTIONS.map((Section, i) => (
          <div
            key={i}
            ref={(el) => { wrapRefs.current[i] = el; }}
            data-nav-item={SECTION_NAV_ITEMS[i]}
            {...(i === 4 ? { id: "about" } : {})}
            {...(i === 2 || i === 5 ? { "data-hide-navbar": "true" } : {})}
          >
            <Section />
          </div>
        ))}
      </div>
    </div>
  );
}
