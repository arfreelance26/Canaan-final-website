"use client";
import { useRef, useEffect, useState, useCallback } from "react";

const COMPANIES = [
  { name: "Canaan Shipping Services",    desc: "Full-service freight forwarding and end-to-end logistics management" },
  { name: "Canaan International",         desc: "Cross-border trade facilitation and international cargo operations" },
  { name: "Canaan Shipping",              desc: "Sea freight operations and vessel coordination across major trade lanes" },
  { name: "Rehoboth Shipping & Services", desc: "Specialised cargo handling and comprehensive port-side services" },
];

// ─── Individual card ──────────────────────────────────────────────────────────
// Performance rule: ONLY `hovered` is React state (fires 2× per interaction).
// Tilt + spotlight are written directly to DOM refs inside rAF — zero React
// re-renders during continuous mouse movement.
function Card({ co, i, phase }) {
  const cardRef      = useRef(null);   // direct style writes for tilt
  const spotlightRef = useRef(null);   // direct style writes for spotlight
  const rafRef       = useRef(null);
  const tiltRef      = useRef({ rx: 0, ry: 0 }); // mutable; read by React on re-render
  const [hovered, setHovered] = useState(false);

  const delay = 0.1 + i * 0.12;

  // ── Mouse handlers ──────────────────────────────────────────────────────────
  const handleMouseMove = useCallback((e) => {
    if (phase !== "idle") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const w  = rect.width;
    const h  = rect.height;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rx = -((cy / h) - 0.5) * 12;
      const ry =  ((cx / w) - 0.5) * 12;
      tiltRef.current = { rx, ry };

      // Direct DOM write — no setState, no React re-render
      if (cardRef.current) {
        cardRef.current.style.transform =
          `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
      }
      if (spotlightRef.current) {
        spotlightRef.current.style.background =
          `radial-gradient(circle 180px at ${(cx / w) * 100}% ${(cy / h) * 100}%, rgba(255,255,255,0.6) 0%, transparent 70%)`;
        spotlightRef.current.style.opacity = "1";
      }
    });
  }, [phase]);

  const handleMouseEnter = useCallback(() => setHovered(true), []);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    tiltRef.current = { rx: 0, ry: 0 };
    setHovered(false); // re-render reads tiltRef (now 0,0) → writes neutral transform + spring transition
    if (spotlightRef.current) spotlightRef.current.style.opacity = "0";
  }, []);

  // ── Transforms / transitions ────────────────────────────────────────────────
  // Entrance (hidden → reveal): React controls transform via inline style
  const entranceTransform =
    phase === "hidden"
      ? "perspective(900px) rotateX(10deg) translateY(52px)"
      : "perspective(900px) rotateX(0deg) translateY(0px)";

  // Idle: React reads tiltRef so re-renders (from setHovered) write correct values
  const idleTransform =
    `perspective(900px) rotateX(${tiltRef.current.rx}deg) rotateY(${tiltRef.current.ry}deg) translateY(${hovered ? -6 : 0}px)`;

  const transform = phase === "idle" ? idleTransform : entranceTransform;

  // No transform transition while hovering — rAF writes track cursor instantly
  // Spring-back when leaving (hovered just became false) or on entrance
  const transition =
    phase === "reveal"
      ? `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`
      : phase === "idle" && !hovered
      ? "transform 0.65s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease"
      : "box-shadow 0.35s ease";

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.07)",
        borderRadius: "16px",
        padding: "1.75rem",
        cursor: "default",
        display: "flex",
        flexDirection: "column",
        opacity: phase === "hidden" ? 0 : 1,
        transform,
        transition,
        transformStyle: "preserve-3d",
        willChange: "transform",
        boxShadow: hovered
          ? "inset 3px 0 0 rgba(210,165,45,0.85), 0 24px 60px rgba(0,0,0,0.13)"
          : "0 2px 16px rgba(0,0,0,0.055)",
      }}
    >
      {/* ── Travelling spotlight ── */}
      <div
        ref={spotlightRef}
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle 180px at 50% 30%, rgba(255,255,255,0.6) 0%, transparent 70%)",
          opacity: 0,
          transition: "opacity 0.45s ease",
          pointerEvents: "none",
          borderRadius: "16px",
          zIndex: 0,
        }}
      />

      {/* ── Top gold hairline — draws left-to-right on hover entry ── */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "2px",
        background: "linear-gradient(to right, rgba(210,165,45,0.95), rgba(210,165,45,0.3), transparent)",
        transform: hovered ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left center",
        transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
        zIndex: 1,
      }} />

      {/* ── Content ── */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", flex: 1 }}>

        <h3 style={{
          fontSize: "1.25rem",
          fontWeight: 800,
          color: "#111111",
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
          marginBottom: "0.5rem",
        }}>
          {co.name}
        </h3>

        <div style={{
          width: "1.75rem", height: "2px",
          background: "rgba(210,165,45,0.75)",
          borderRadius: "2px",
          marginBottom: "0.75rem",
          flexShrink: 0,
        }} />

        <p style={{
          fontSize: "13px",
          lineHeight: 1.75,
          color: hovered ? "#555555" : "#999999",
          transform: hovered ? "translateY(-4px)" : "translateY(0px)",
          transition: "color 0.35s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)",
          marginBottom: "1.5rem",
        }}>
          {co.desc}
        </p>

        <div style={{
          borderRadius: "10px",
          overflow: "hidden",
          background: "#f5f4f0",
          border: "1px solid rgba(0,0,0,0.06)",
          aspectRatio: "9 / 16",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.18)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Image
          </span>
        </div>
      </div>
    </div>
  );
}


// ─── Section ─────────────────────────────────────────────────────────────────
export default function GroupSection() {
  const sectionRef = useRef(null);
  const [phase, setPhase] = useState("hidden");

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase("reveal");
          obs.disconnect();
          setTimeout(() => setPhase("idle"), 1400);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#f5f4f0",
        borderRadius: "20px 20px 0 0",
        boxShadow: "0 -20px 60px rgba(0,0,0,0.10)",
      }}
      className="px-6 sm:px-12 lg:px-20 py-20 sm:py-28"
    >

      {/* ── Header ── */}
      <div
        className="mb-14"
        style={{
          opacity: phase === "hidden" ? 0 : 1,
          transform: phase === "hidden" ? "translateY(20px)" : "translateY(0)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(210,165,45,0.85)" }} />
          <span style={{ fontSize: "11px", letterSpacing: "0.22em", color: "rgba(210,165,45,0.75)", fontWeight: 500 }} className="uppercase">
            The Canaan Group
          </span>
        </div>
        <h2 style={{ fontSize: "clamp(1.7rem, 4vw, 2.8rem)", fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.025em", lineHeight: 1.15 }}>
          Four companies,{" "}
          <span style={{ color: "rgba(0,0,0,0.28)" }}>one mission.</span>
        </h2>
      </div>

      {/* ── Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {COMPANIES.map((co, i) => (
          <Card key={i} co={co} i={i} phase={phase} />
        ))}
      </div>
    </section>
  );
}

