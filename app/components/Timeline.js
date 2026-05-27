"use client";
import { useEffect, useRef, useState } from "react";

/* ─── Milestone data ─────────────────────────────────────────── */
const MILESTONES = [
  {
    year: "2009",
    tag: "ORIGIN",
    title: "Founded in Chennai",
    description:
      "A single trade lane between India and Europe. One vision — make international freight honest, fast, and reliable.",
    statNum: 1,
    statSuffix: " trade lane",
    statSub: "The first of many.",
    image:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1600&q=80",
    rgb: "18,12,6",
    alpha: 0.72,
  },
  {
    year: "2012",
    tag: "EXPANSION",
    title: "First Intercontinental Route",
    description:
      "Chennai to Hamburg. Weekly sailings. The beginning of a network that would span continents and connect industries.",
    statNum: 6,
    statSuffix: " countries",
    statSub: "Connected.",
    image:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=1600&q=80",
    rgb: "12,9,4",
    alpha: 0.58,
  },
  {
    year: "2016",
    tag: "INFRASTRUCTURE",
    title: "Warehouse & Operations at Scale",
    description:
      "An in-house customs desk. Dedicated warehousing. The infrastructure of a serious logistics company taking shape.",
    statNum: 85,
    statSuffix: "+ team",
    statSub: "Logistics professionals.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80",
    rgb: "8,6,2",
    alpha: 0.44,
  },
  {
    year: "2020",
    tag: "GLOBAL",
    title: "The World Opens Up",
    description:
      "Southeast Asia. The Middle East. North America. Canaan becomes a truly global freight network with no limits.",
    statNum: 50000,
    statSuffix: "+",
    statSub: "Shipments delivered.",
    image:
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1600&q=80",
    rgb: "6,4,1",
    alpha: 0.28,
  },
  {
    year: "2025",
    tag: "LEGACY",
    title: "Best Freight Forwarder — Asia",
    description:
      "Recognised at the Asia Freight & Logistics Awards. Thirty countries. Fifty thousand shipments. One promise kept.",
    statNum: 30,
    statSuffix: " countries",
    statSub: "One home port.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
    rgb: "245,244,240",
    alpha: 0.90,
    bright: true,
  },
];

/* ─── Count-up hook ──────────────────────────────────────────── */
function useCountUp(target, active) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (!active) {
      setCount(0);
      return;
    }
    const duration = target > 9999 ? 1500 : target > 99 ? 1000 : 650;
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min((now - t0) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - t, 3)) * target));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, target]);

  return count;
}

/* ─── Single milestone panel ─────────────────────────────────── */
function Panel({ m, isActive }) {
  const count = useCountUp(m.statNum, isActive);
  const dark = !m.bright;

  const T = dark ? "#f5f1e8" : "#0a0908";
  const S = dark ? "rgba(245,241,232,0.50)" : "rgba(10,9,8,0.46)";
  const A = dark ? "#c8a84b" : "#8a6f24";

  /* Staggered appear — resets instantly when inactive so it replays on re-entry */
  const ap = (d) => ({
    opacity: isActive ? 1 : 0,
    transform: isActive ? "translateY(0px)" : "translateY(26px)",
    transition: isActive
      ? `opacity .85s cubic-bezier(.22,1,.36,1) ${d}s, transform .85s cubic-bezier(.22,1,.36,1) ${d}s`
      : "none",
  });

  const fmt = (n) => (n >= 1000 ? n.toLocaleString("en-IN") : String(n));

  return (
    <div
      style={{
        width: "100vw",
        height: "100%",
        position: "relative",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {/* Background image with Ken Burns zoom */}
      <img
        src={m.image}
        alt=""
        aria-hidden="true"
        decoding="async"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 35%",
          transform: isActive ? "scale(1)" : "scale(1.07)",
          transition: isActive
            ? "transform 1.7s cubic-bezier(.25,.46,.45,.94)"
            : "none",
          willChange: "transform",
        }}
      />

      {/* Directional gradient overlay: opaque left to transparent right */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          background:
            "linear-gradient(to right," +
            "rgba(" + m.rgb + "," + m.alpha + ") 0%," +
            "rgba(" + m.rgb + "," + (m.alpha * 0.95) + ") 30%," +
            "rgba(" + m.rgb + "," + (m.alpha * 0.45) + ") 60%," +
            "rgba(" + m.rgb + ",0) 82%)",
        }}
      />

      {/* Giant ghost year watermark */}
      <div
        style={{
          position: "absolute",
          bottom: "3%",
          left: "1.5%",
          zIndex: 2,
          fontSize: "clamp(6.5rem,19vw,17rem)",
          fontWeight: 900,
          letterSpacing: "-.07em",
          lineHeight: 1,
          color: dark ? "rgba(255,255,255,.055)" : "rgba(10,9,8,.038)",
          userSelect: "none",
          pointerEvents: "none",
          ...ap(0),
        }}
      >
        {m.year}
      </div>

      {/* Text content */}
      <div className="tl-panel-content" style={{ zIndex: 3 }}>

        {/* Tag line */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
            ...ap(0.04),
          }}
        >
          <div style={{ width: 26, height: 1.5, background: A, flexShrink: 0 }} />
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: ".2em",
              textTransform: "uppercase",
              color: A,
            }}
          >
            {m.tag}
          </span>
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: "clamp(1.85rem,4vw,3.4rem)",
            fontWeight: 800,
            letterSpacing: "-.04em",
            lineHeight: 1.07,
            color: T,
            margin: "0 0 18px",
            ...ap(0.12),
          }}
        >
          {m.title}
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: "clamp(.8rem,1.15vw,.93rem)",
            color: S,
            lineHeight: 1.82,
            margin: "0 0 30px",
            maxWidth: 400,
            ...ap(0.20),
          }}
        >
          {m.description}
        </p>

        {/* Animated stat */}
        <div style={{ ...ap(0.28) }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 3,
              marginBottom: 6,
            }}
          >
            <span
              style={{
                fontSize: "clamp(2.5rem,5vw,4.2rem)",
                fontWeight: 900,
                letterSpacing: "-.05em",
                lineHeight: 1,
                color: A,
              }}
            >
              {fmt(count)}
            </span>
            <span
              style={{
                fontSize: "clamp(.9rem,1.8vw,1.35rem)",
                fontWeight: 700,
                color: A,
                letterSpacing: "-.02em",
              }}
            >
              {m.statSuffix}
            </span>
          </div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: ".18em",
              textTransform: "uppercase",
              color: S,
            }}
          >
            {m.statSub}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Section shell ──────────────────────────────────────────── */
export default function TimelineSection() {
  const sectionRef = useRef(null);
  const trackRef   = useRef(null);
  const barRef     = useRef(null);

  const [active, setActive] = useState(0);
  const [live,   setLive]   = useState(false);
  const activeRef = useRef(0);
  const N = MILESTONES.length;

  /* Only fire panel animations while section is in viewport */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setLive(e.isIntersecting),
      { threshold: 0 }
    );
    const el = sectionRef.current;
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Scroll -> horizontal translate driver */
  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const s = sectionRef.current;
        if (!s) return;
        const r = s.getBoundingClientRect();
        const scrollable = r.height - window.innerHeight;
        if (scrollable <= 0) return;
        const p = Math.max(0, Math.min(1, -r.top / scrollable));

        if (trackRef.current) {
          trackRef.current.style.transform =
            "translateX(" + (-p * (N - 1) * 100) + "vw)";
        }
        if (barRef.current) {
          barRef.current.style.width = (p * 100) + "%";
        }

        const idx = Math.min(N - 1, Math.round(p * (N - 1)));
        if (idx !== activeRef.current) {
          activeRef.current = idx;
          setActive(idx);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [N]);

  const bright  = !!MILESTONES[active].bright;
  const gold    = "#c8a84b";
  const dotDim  = bright ? "rgba(10,9,8,.12)"  : "rgba(255,255,255,.14)";
  const lineDim = bright ? "rgba(10,9,8,.09)"  : "rgba(255,255,255,.10)";
  const lbDim   = bright ? "rgba(10,9,8,.32)"  : "rgba(255,255,255,.22)";

  return (
    <>
      <style>{`
        .tl-panel-content {
          position: absolute;
          bottom: clamp(88px, 18vh, 130px);
          left:   clamp(20px, 5vw,  32px);
          right:  clamp(20px, 5vw,  32px);
        }
        @media (min-width: 768px) {
          .tl-panel-content {
            top:       50%;
            bottom:    auto;
            left:      clamp(40px, 6vw, 88px);
            right:     auto;
            transform: translateY(-54%);
            max-width: min(500px, 46vw);
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        style={{ height: (N * 100) + "vh", position: "relative" }}
        className="font-sans"
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {/* Horizontal panel track */}
          <div
            ref={trackRef}
            style={{
              display: "flex",
              width: (N * 100) + "vw",
              height: "100%",
              willChange: "transform",
            }}
          >
            {MILESTONES.map((mi, i) => (
              <Panel key={i} m={mi} isActive={live && active === i} />
            ))}
          </div>

          {/* Persistent top bar */}
          <div
            style={{
              position: "absolute",
              top: "clamp(20px, 3.2vh, 34px)",
              left: "clamp(20px, 5vw, 88px)",
              right: "clamp(20px, 5vw, 88px)",
              zIndex: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: ".22em",
                textTransform: "uppercase",
                color: bright ? "#8a6f24" : "rgba(200,168,75,.75)",
                transition: "color .5s ease",
              }}
            >
              Built on Trust Since 2009
            </span>

            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {MILESTONES.map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 6,
                    width: i === active ? 22 : 6,
                    borderRadius: 3,
                    background: i === active ? gold : dotDim,
                    transition:
                      "width .45s cubic-bezier(.34,1.2,.64,1), background .4s ease",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Bottom scrubber */}
          <div
            style={{
              position: "absolute",
              bottom: "clamp(18px, 3.5vh, 34px)",
              left: "clamp(20px, 5vw, 88px)",
              right: "clamp(20px, 5vw, 88px)",
              zIndex: 20,
              pointerEvents: "none",
            }}
          >
            {/* Year labels */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 9,
              }}
            >
              {MILESTONES.map((mi, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 11,
                    fontWeight: i === active ? 700 : 500,
                    letterSpacing: ".1em",
                    color: i === active ? gold : lbDim,
                    transition: "color .4s ease",
                  }}
                >
                  {mi.year}
                </span>
              ))}
            </div>

            {/* Gold fill line + milestone dots */}
            <div
              style={{
                position: "relative",
                height: 2,
                background: lineDim,
                borderRadius: 2,
                transition: "background .5s ease",
              }}
            >
              <div
                ref={barRef}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: "0%",
                  background: "linear-gradient(to right, #c8a84b, #d4af37)",
                  borderRadius: 2,
                }}
              />
              {MILESTONES.map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: ((i / (N - 1)) * 100) + "%",
                    transform: "translate(-50%, -50%)",
                    width: i === active ? 11 : 7,
                    height: i === active ? 11 : 7,
                    borderRadius: "50%",
                    background: i <= active ? gold : dotDim,
                    boxShadow:
                      i === active ? "0 0 0 2.5px rgba(200,168,75,.30)" : "none",
                    transition: "all .4s cubic-bezier(.34,1.2,.64,1)",
                    zIndex: 2,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
