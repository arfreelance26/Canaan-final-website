"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import { Anchor, Globe, Ship, Package, ArrowRight, X } from "lucide-react";


const COMPANIES = [
  {
    name: "Canaan Global Logistics",
    abbr: "CGL",
    Icon: Anchor,
    images: ["/company/logistics1b.png", "/company/logistics2.png", "/company/logistics3.png"],
    tagline: "Where cargo, oceans, and infrastructure move in synchronized rhythm.",
    role: "The operational backbone of the network.",
    body: "From freight movement to cargo coordination, CGL orchestrates the complex mechanics behind global transportation, whether cargo moves by land, sea, or through interconnected transit systems.",
    ops: ["Freight Forwarding", "Multimodal Transportation", "Vessel Operations", "NVOCC Services", "Cargo Consolidation"],
    abstract: "Where cargo movement becomes effortless motion.",
  },
  {
    name: "Canaan Global Shipping Services",
    abbr: "CGSS",
    Icon: Globe,
    images: ["/company/shipping1b.png", "/company/shipping2.png", "/company/shipping3.png"],
    tagline: "Behind every successful shipment lies precision invisible to the eye.",
    role: "The regulatory and clearance arm.",
    body: "CGSS operates at the intersection of compliance and movement, managing customs procedures, import/export clearances, and documentation flow required to keep cargo crossing borders without friction.",
    ops: ["Customs Brokerage", "Import Handling", "Export Processing", "Trade Documentation", "Port Clearance Coordination"],
    abstract: "Navigating borders before cargo even reaches them.",
  },
  {
    name: "Canaan Global International",
    abbr: "CGI",
    Icon: Ship,
    images: ["/company/cgi1b.png", "/company/cgi2.png", "/company/cgi3b.png"],
    tagline: "The operational nerve center connecting commerce, coordination, and execution.",
    role: "The commercial intelligence layer.",
    body: "CGI manages the financial, nomination, and coordination infrastructure supporting the wider Canaan Global network, connecting operational execution with administrative control.",
    ops: ["Nominations & Coordination", "Billing Infrastructure", "Invoice Processing", "Transport Commercial Management", "Internal Operational Integration"],
    abstract: "Connecting operations with commercial flow.",
  },
  {
    name: "Rehoboth Transports",
    abbr: "RT",
    Icon: Package,
    images: ["/company/rehoboth1.png", "/company/rehoboth2b.png", "/company/rehoboth3b.png"],
    tagline: "The final momentum behind the supply chain.",
    role: "The ground-movement engine.",
    body: "Rehoboth handles transport execution for both internal logistics operations and external clients, designed for flexibility across raw material movement, customer logistics support, and multi-channel coordination.",
    ops: ["Cargo Transportation", "Fleet Coordination", "External Logistics Support", "Raw Material Movement", "Integrated Transport Handling"],
    abstract: "Keeping industries moving beyond the port.",
  },
];

// ─── Individual card ──────────────────────────────────────────────────────────
function Card({ co, i, phase, dir, isActive, onToggle, isMobile }) {
  const cardRef = useRef(null);
  const spotlightRef = useRef(null);
  const rafRef = useRef(null);

  const [hovered, setHovered] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  // Auto-advance carousel every 3 s
  useEffect(() => {
    if (!co.images?.length) return;
    const timer = setInterval(() => {
      setImgIdx((idx) => (idx + 1) % co.images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [co.images]);

  const delay = 0.05 + (dir === "right" ? (3 - i) : i) * 0.1;

  const handleMouseMove = useCallback((e) => {
    if (phase !== "idle" || isActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (spotlightRef.current) {
        spotlightRef.current.style.background =
          `radial-gradient(circle 200px at ${(cx / w) * 100}% ${(cy / h) * 100}%, rgba(255,255,255,0.55) 0%, transparent 70%)`;
        spotlightRef.current.style.opacity = "1";
      }
    });
  }, [phase, isActive]);

  const handleMouseEnter = useCallback(() => {
    if (!isActive) setHovered(true);
  }, [isActive]);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setHovered(false);
    if (spotlightRef.current) spotlightRef.current.style.opacity = "0";
  }, [isActive]);



  const entranceTransform =
    phase === "hidden"
      ? `perspective(900px) translateX(${dir === "left" ? "-110vw" : "110vw"}) rotateY(${dir === "left" ? "5deg" : "-5deg"})`
      : "perspective(900px) translateX(0px) rotateY(0deg)";
  const idleTransform = isActive
    ? "none"
    : `perspective(900px) translateY(${hovered ? -5 : 0}px)`;
  const transform = phase === "idle" ? idleTransform : entranceTransform;
  const transition = isActive
    ? "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.4s ease"
    : phase === "reveal"
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
      onClick={() => onToggle(i)}
      style={{
        position: "relative",
        background: "#ffffff",
        border: isActive ? "1px solid rgba(210,165,45,0.30)" : "1px solid rgba(0,0,0,0.07)",
        borderRadius: 16,
        overflow: "hidden",
        height: "100%",
        opacity: phase === "hidden" ? 0 : 1,
        transform,
        transition,
        willChange: "transform",
        boxShadow: isActive
          ? "inset 3px 0 0 rgba(210,165,45,0.85), 0 24px 56px rgba(0,0,0,0.13)"
          : hovered
            ? "inset 3px 0 0 rgba(210,165,45,0.85), 0 20px 50px rgba(0,0,0,0.12)"
            : "0 2px 12px rgba(0,0,0,0.05)",
        cursor: "pointer",
      }}
    >
      {/* Gold top hairline */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(to right, rgba(210,165,45,0.95), rgba(210,165,45,0.3), transparent)",
        transform: (isActive || hovered) ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left center",
        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
        zIndex: 2,
      }} />

      {/* ── INACTIVE LAYOUT — always in DOM, fades out when active ── */}
      <div className="mt-4" style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        opacity: isActive ? 0 : 1,
        transition: isActive
          ? "opacity 0.18s ease"
          : "opacity 0.28s ease 0.22s",
        pointerEvents: isActive ? "none" : "auto",
      }}>
        {/* Spotlight */}
        <div ref={spotlightRef} style={{ position: "absolute", inset: 0, opacity: 0, transition: "opacity 0.4s ease", pointerEvents: "none", zIndex: 0 }} />


        {/* Image carousel */}
        <div
        style={{
          position: "relative", zIndex: 1,
          flex: 1, minHeight: 0,
          margin: "0 12px",
          borderRadius: 12,
          overflow: "hidden",
          background: "#f5f4f0",
          opacity: 0.92,
        }}>
          {co.images.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt={co.name}
              style={{
                position: idx === 0 ? "relative" : "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: idx === imgIdx ? 1 : 0,
                transition: "opacity 0.9s ease",
              }}
              
            />
          ))}

          {/* Dot / pill indicators */}
          <div style={{
            position: "absolute", bottom: 8, left: "50%",
            transform: "translateX(-50%)",
            display: "flex", gap: 4, alignItems: "center",
            zIndex: 3,
          }}>
            {co.images.map((_, idx) => (
              <div
                key={idx}
                onClick={(e) => { e.stopPropagation(); setImgIdx(idx); }}
                style={{
                  height: 4,
                  width: idx === imgIdx ? 16 : 4,
                  borderRadius: 4,
                  background: idx === imgIdx ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)",
                  transition: "width 0.35s ease, background 0.35s ease",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom content */}
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

      {/* ── ACTIVE LAYOUT — always in DOM, fades in when active ── */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: isMobile ? "column" : "row",
        opacity: isActive ? 1 : 0,
        transition: isActive
          ? "opacity 0.32s ease 0.26s"
          : "opacity 0.16s ease",
        pointerEvents: isActive ? "auto" : "none",
        overflow: "hidden",
      }}>

        {/* LEFT SPINE */}
        <div style={{
          width: isMobile ? "100%" : "36%",
          height: isMobile ? "30%" : "auto",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          padding: "14px 12px 14px 14px",
          borderRight: isMobile ? "none" : "1px solid rgba(0,0,0,0.05)",
          borderBottom: isMobile ? "1px solid rgba(0,0,0,0.05)" : "none",
          background: "#fafafa",
        }}>
          {/* Category + icon */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#bbbbbb" }}>
              {co.category}
            </span>
            <div style={{ width: 26, height: 26, borderRadius: 7, border: "1.5px solid #eeeeee", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <co.Icon size={12} color="#c0bdb6" />
            </div>
          </div>

          {/* Image carousel (mirrors the inactive card carousel) */}
          <div style={{
            flex: 1, minHeight: 0,
            position: "relative",
            borderRadius: 10,
            overflow: "hidden",
            background: "#f0efeb",
            opacity: 0.82,
            marginBottom: 10,
          }}>
            {co.images.map((src, idx) => (
              <img
                key={src}
                src={src}
                alt={co.name}
                style={{
                  position: idx === 0 ? "relative" : "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: idx === imgIdx ? 1 : 0,
                  transition: "opacity 0.9s ease",
                }}
              />
            ))}
            {/* Dot indicators */}
            <div style={{
              position: "absolute", bottom: 6, left: "50%",
              transform: "translateX(-50%)",
              display: "flex", gap: 4, alignItems: "center", zIndex: 3,
            }}>
              {co.images.map((_, idx) => (
                <div
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setImgIdx(idx); }}
                  style={{
                    height: 4,
                    width: idx === imgIdx ? 14 : 4,
                    borderRadius: 4,
                    background: idx === imgIdx ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)",
                    transition: "width 0.35s ease, background 0.35s ease",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Name + close */}
          <div>
            <h3 style={{ fontSize: "0.78rem", fontWeight: 700, color: "#111", letterSpacing: "-0.02em", lineHeight: 1.25, margin: "0 0 10px" }}>
              {co.name}
            </h3>
            <button
              onClick={(e) => { e.stopPropagation(); onToggle(i); }}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                color: "#bbbbbb",
                background: "none", border: "none", padding: 0, cursor: "pointer",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#555"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#bbbbbb"; }}
            >
              <X size={9} strokeWidth={2.5} />
              Close
            </button>
          </div>
        </div>

        {/* RIGHT DETAIL */}
        <div style={{
          flex: 1,
          padding: "16px 18px 16px 16px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 0,
        }}>
          {/* ── Top block ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>

            {/* Eyebrow + role headline */}
            <div>
              <p style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.18em",
                textTransform: "uppercase", color: "rgba(210,165,45,0.85)", margin: "0 0 5px",
              }}>
                {co.category}
              </p>
              <p style={{
                fontSize: "1rem", fontWeight: 750, color: "#111",
                letterSpacing: "-0.03em", lineHeight: 1.2, margin: 0,
              }}>
                {co.role}
              </p>
            </div>

            {/* Gold gradient divider */}
            <div style={{
              height: 1,
              background: "linear-gradient(to right, rgba(210,165,45,0.3), rgba(210,165,45,0.05), transparent)",
              flexShrink: 0,
            }} />

            {/* Body copy */}
            <p style={{ fontSize: "12px", color: "#666", lineHeight: 1.78, margin: 0 }}>
              {co.body}
            </p>

            {/* Core Operations — pill chips */}
            <div>
              <p style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.16em",
                textTransform: "uppercase", color: "#bbb", margin: "0 0 7px",
              }}>
                Core Operations
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {co.ops.map((op) => (
                  <span
                    key={op}
                    style={{
                      fontSize: "10.5px",
                      fontWeight: 600,
                      color: "#444",
                      background: "rgba(0,0,0,0.04)",
                      border: "1px solid rgba(0,0,0,0.08)",
                      borderRadius: 6,
                      padding: "4px 10px",
                      lineHeight: 1.4,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {op}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Bottom: Abstract quote callout ── */}
          <div style={{
            marginTop: 14,
            padding: "10px 13px",
            background: "linear-gradient(135deg, rgba(210,165,45,0.07), rgba(210,165,45,0.02))",
            borderLeft: "2.5px solid rgba(210,165,45,0.55)",
            borderRadius: "0 8px 8px 0",
            flexShrink: 0,
          }}>
            <p style={{
              fontSize: "11.5px",
              fontStyle: "italic",
              color: "rgba(180,135,25,0.95)",
              lineHeight: 1.55,
              margin: 0,
              letterSpacing: "0.01em",
            }}>
              &ldquo;{co.abstract}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── Section ──────────────────────────────────────────────────────────────────
export default function GroupSection() {
  const sectionRef = useRef(null);
  const [phase, setPhase] = useState("hidden");
  const [dir, setDir] = useState("left");
  const [activePill, setActivePill] = useState(0); // unused — pills removed
  const [activeCard, setActiveCard] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const revealTimer = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggle = useCallback((idx) => {
    setActiveCard((prev) => (prev === idx ? null : idx));
  }, []);

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
          setActiveCard(null);
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

  const desktopCols =
    activeCard === null
      ? "1fr 1fr"
      : activeCard % 2 === 0
      ? "2.5fr 0.83fr"
      : "0.83fr 2.5fr";

  const desktopRows =
    activeCard === null
      ? "1fr 1fr"
      : activeCard < 2
      ? "2.5fr 0.83fr"
      : "0.83fr 2.5fr";

  const mobileCols = "1fr";
  const mobileRows =
    activeCard === null
      ? "repeat(4, 1fr)"
      : [0, 1, 2, 3].map((i) => (i === activeCard ? "2.5fr" : "0.5fr")).join(" ");

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
        @keyframes detailFadeIn {
          from { opacity: 0; transform: translateX(10px); }
          to   { opacity: 1; transform: translateX(0); }
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
          height: isMobile ? "auto" : "100vh",
          minHeight: isMobile ? "100vh" : "auto",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: 16,
        }}
      >
        {/* ── Banner Title ── */}
        <div style={{
          position: "relative",
          flexShrink: 0,
          padding: "10px 14px",
          opacity: phase === "hidden" ? 0 : 1,
          transform: phase === "hidden" ? "translateY(16px)" : "translateY(0)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
          <span style={{ fontSize: 10, letterSpacing: "0.18em", color: "rgba(210,165,45,0.8)", textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: 5 }}>
            The Canaan Global Group
          </span>
          <h2 style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", fontWeight: 700, color: "#111", letterSpacing: "-0.025em", lineHeight: 1.15, margin: 0 }}>
            Four companies,{" "}
            <span style={{ color: "rgba(0,0,0,0.3)" }}>one mission.</span>
          </h2>
        </div>

        {/* ── Cards ── */}
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
          <div style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: isMobile ? mobileCols : desktopCols,
            gridTemplateRows: isMobile ? mobileRows : desktopRows,
            gap: 12,
            height: "100%",
            minHeight: isMobile ? "1200px" : "auto",
            transition: "grid-template-columns 0.48s cubic-bezier(0.16,1,0.3,1), grid-template-rows 0.48s cubic-bezier(0.16,1,0.3,1)",
          }}>
            {COMPANIES.map((co, i) => (
              <Card
                key={i}
                co={co}
                i={i}
                phase={phase}
                dir={dir}
                isActive={activeCard === i}
                onToggle={handleToggle}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>

      </section>
    </>
  );
}
