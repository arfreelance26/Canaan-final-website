"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import { Anchor, Globe, Ship, Package, ArrowRight } from "lucide-react";

const COMPANIES = [
  {
    name: "Canaan Global Logistics",
    category: "Freight",
    Icon: Anchor,
    tagline: "Where cargo, oceans, and infrastructure move in synchronized rhythm.",
  },
  {
    name: "Canaan Global Shipping Services",
    category: "Trade",
    Icon: Globe,
    tagline: "Behind every successful shipment lies precision invisible to the eye.",
  },
  {
    name: "Canaan Global International",
    category: "Sea Freight",
    Icon: Ship,
    tagline: "The operational nerve center connecting commerce, coordination, and execution.",
  },
  {
    name: "Rehoboth Transports",
    category: "Port Services",
    Icon: Package,
    tagline: "The final momentum behind the supply chain.",
  },
];

const PILLS = [
  "Canaan Global Logistics",
  "Canaan Global Shipping Services",
  "Canaan Global International",
  "Rehoboth Transports",
  "Freight Forwarding",
  "Customs Brokerage",
  "Port Services",
];

// â”€â”€â”€ Individual card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Card({ co, i, phase, dir }) {
  const cardRef = useRef(null);
  const spotlightRef = useRef(null);
  const rafRef = useRef(null);
  const tiltRef = useRef({ rx: 0, ry: 0 });
  const [hovered, setHovered] = useState(false);

  const delay = 0.05 + (dir === "right" ? (3 - i) : i) * 0.1;

  const handleMouseMove = useCallback((e) => {
    if (phase !== "idle") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rx = -((cy / h) - 0.5) * 10;
      const ry =  ((cx / w) - 0.5) * 10;
      tiltRef.current = { rx, ry };
      if (cardRef.current) {
        cardRef.current.style.transform =
          `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
      }
      if (spotlightRef.current) {
        spotlightRef.current.style.background =
          `radial-gradient(circle 200px at ${(cx / w) * 100}% ${(cy / h) * 100}%, rgba(255,255,255,0.55) 0%, transparent 70%)`;
        spotlightRef.current.style.opacity = "1";
      }
    });
  }, [phase]);

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    tiltRef.current = { rx: 0, ry: 0 };
    setHovered(false);
    if (spotlightRef.current) spotlightRef.current.style.opacity = "0";
  }, []);

  const entranceTransform =
    phase === "hidden"
      ? `perspective(900px) translateX(${dir === "left" ? "-110vw" : "110vw"}) rotateY(${dir === "left" ? "5deg" : "-5deg"})`
      : "perspective(900px) translateX(0px) rotateY(0deg)";
  const idleTransform =
    `perspective(900px) rotateX(${tiltRef.current.rx}deg) rotateY(${tiltRef.current.ry}deg) translateY(${hovered ? -5 : 0}px)`;
  const transform = phase === "idle" ? idleTransform : entranceTransform;
  const transition =
    phase === "reveal"
      ? `opacity 0.55s cubic-bezier(0.25,1,0.5,1) ${delay}s, transform 0.7s cubic-bezier(0.25,1,0.5,1) ${delay}s`
      : phase === "idle" && !hovered
      ? "transform 0.65s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease"
      : "box-shadow 0.3s ease";

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.07)",
        borderRadius: 16,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
        opacity: phase === "hidden" ? 0 : 1,
        transform,
        transition,
        willChange: "transform",
        boxShadow: hovered
          ? "inset 3px 0 0 rgba(210,165,45,0.85), 0 20px 50px rgba(0,0,0,0.12)"
          : "0 2px 12px rgba(0,0,0,0.05)",
        cursor: "default",
      }}
    >
      {/* Spotlight */}
      <div ref={spotlightRef} style={{ position: "absolute", inset: 0, opacity: 0, transition: "opacity 0.4s ease", pointerEvents: "none", zIndex: 0 }} />

      {/* Gold top hairline */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(to right, rgba(210,165,45,0.95), rgba(210,165,45,0.3), transparent)",
        transform: hovered ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left center",
        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
        zIndex: 1,
      }} />

      {/* â”€â”€ Top row: category + icon â”€â”€ */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px 8px", flexShrink: 0 }}>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaaaaa" }}>
          {co.category}
        </span>
        <div style={{ width: 30, height: 30, borderRadius: 8, border: "1.5px solid #eeeeee", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <co.Icon size={14} color="#c0bdb6" />
        </div>
      </div>

      {/* â”€â”€ Image area â”€â”€ */}
      <div style={{
        position: "relative", zIndex: 1,
        flex: 1, minHeight: 0,
        background: "#f5f4f0",
        margin: "0 12px",
        borderRadius: 12,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        <co.Icon size={40} color="rgba(0,0,0,0.07)" />
        <span style={{ fontSize: 10, color: "rgba(0,0,0,0.18)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Image
        </span>
      </div>

      {/* â”€â”€ Bottom content â”€â”€ */}
      <div style={{ position: "relative", zIndex: 1, padding: "12px 14px 14px", flexShrink: 0 }}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111111", letterSpacing: "-0.02em", lineHeight: 1.2, margin: "0 0 4px" }}>
          {co.name}
        </h3>
        <p style={{
          fontSize: "11.5px", color: "#999999", lineHeight: 1.5, margin: "0 0 10px",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {co.tagline}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c0bdb6" }}>
            Learn More
          </span>
          <ArrowRight size={13} color="#c0bdb6" />
        </div>
      </div>
    </div>
  );
}


// â”€â”€â”€ Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function GroupSection() {
  const sectionRef = useRef(null);
  const [phase, setPhase] = useState("hidden");
  const [dir, setDir] = useState("left");
  const [activePill, setActivePill] = useState(0);
  const revealTimer = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const fromBottom = entry.boundingClientRect.top > 0;
          setDir(fromBottom ? "left" : "right");
          setPhase("reveal");
          if (revealTimer.current) clearTimeout(revealTimer.current);
          revealTimer.current = setTimeout(() => setPhase("idle"), 1400);
        } else {
          setPhase("hidden");
          if (revealTimer.current) clearTimeout(revealTimer.current);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (revealTimer.current) clearTimeout(revealTimer.current);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes goldOrbit {
          0%   { transform: translate(calc(-50% - 44vw), -50%) scale(1);    }
          25%  { transform: translate(-50%, calc(-50% - 24vh)) scale(1.08); }
          50%  { transform: translate(calc(-50% + 44vw), -50%) scale(1);    }
          75%  { transform: translate(-50%, calc(-50% + 24vh)) scale(0.93); }
          100% { transform: translate(calc(-50% - 44vw), -50%) scale(1);    }
        }
        .pill-btn { transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease; }
        .pill-wrap { scrollbar-width: none; }
        .pill-wrap::-webkit-scrollbar { display: none; }
      `}</style>
      <section
        ref={sectionRef}
        style={{
          background: "#f5f4f0",
          borderRadius: "20px 20px 0 0",
          boxShadow: "0 -20px 60px rgba(0,0,0,0.10)",
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: 16,
        }}
      >
        {/* â”€â”€ Banner â”€â”€ */}
        <div style={{
          position: "relative",
          flexShrink: 0,
          borderRadius: 16,
          overflow: "hidden",
          height: "clamp(120px, 18vh, 190px)",
          opacity: phase === "hidden" ? 0 : 1,
          transform: phase === "hidden" ? "translateY(16px)" : "translateY(0)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
          {/* Dark maritime background */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(125deg, #1c2b3a 0%, #2b4560 50%, #1e3a2f 100%)" }} />
          {/* Subtle grid texture */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
          {/* Gold accent line at bottom */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
            background: "linear-gradient(90deg, transparent, rgba(210,165,45,0.65) 25%, rgba(210,165,45,0.65) 75%, transparent)",
          }} />

          {/* Heading card â€” top left */}
          <div style={{
            position: "absolute", top: 14, left: 14,
            background: "rgba(255,255,255,0.97)",
            borderRadius: 12, padding: "12px 18px",
          }}>
            <span style={{ fontSize: 10, letterSpacing: "0.18em", color: "rgba(210,165,45,0.8)", textTransform: "uppercase", fontWeight: 500, display: "block", marginBottom: 5 }}>
              The Canaan Group
            </span>
            <h2 style={{ fontSize: "clamp(1.1rem, 2vw, 1.6rem)", fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.025em", lineHeight: 1.15, margin: 0 }}>
              Four companies,{" "}
              <span style={{ color: "rgba(0,0,0,0.28)" }}>one mission.</span>
            </h2>
          </div>

          {/* Top-right glass label */}
          <div style={{
            position: "absolute", top: 14, right: 14,
            background: "rgba(255,255,255,0.10)",
            backdropFilter: "blur(8px)",
            borderRadius: 20, padding: "6px 14px",
            border: "1px solid rgba(255,255,255,0.18)",
          }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: 500, letterSpacing: "0.04em" }}>
              The Canaan Group
            </span>
          </div>
        </div>

        {/* â”€â”€ Cards â”€â”€ */}
        <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
          {/* Orbiting gold glow */}
          <div style={{
            position: "absolute",
            width: 580, height: 440,
            borderRadius: "50%",
            background: "radial-gradient(ellipse at center, rgba(210,165,45,0.26) 0%, rgba(210,165,45,0.10) 48%, transparent 72%)",
            top: "50%", left: "50%",
            pointerEvents: "none", zIndex: 0,
            animation: "goldOrbit 11s linear infinite",
            willChange: "transform",
            filter: "blur(2px)",
          }} />
          <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, height: "100%" }}>
            {COMPANIES.map((co, i) => (
              <Card key={i} co={co} i={i} phase={phase} dir={dir} />
            ))}
          </div>
        </div>

        {/* â”€â”€ Pills â”€â”€ */}
        <div
          className="pill-wrap"
          style={{
            flexShrink: 0,
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 2,
            opacity: phase === "hidden" ? 0 : 1,
            transition: "opacity 0.7s ease 0.45s",
          }}
        >
          {PILLS.map((pill, i) => (
            <button
              key={i}
              onClick={() => setActivePill(i)}
              className="pill-btn"
              style={{
                flexShrink: 0,
                padding: "7px 16px",
                borderRadius: 9999,
                border: "1.5px solid",
                borderColor: activePill === i ? "#1a1916" : "#d5d2ca",
                background: activePill === i ? "#1a1916" : "transparent",
                color: activePill === i ? "#f5f4f0" : "#777777",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                letterSpacing: "0.01em",
              }}
            >
              {pill}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

