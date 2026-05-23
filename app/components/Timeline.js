"use client";
import { useEffect, useRef, useState } from "react";
import {
  Anchor, Globe, Package, Award,
  TrendingUp, Users, Zap, Star, ArrowRight
} from "lucide-react";

const MILESTONES = [
  {
    year: "2009", icon: Anchor, title: "Founded in Chennai",
    description: "Canaan Global International was established with a single vision — to make cross-border freight simple, reliable, and human. Our first shipment crossed into Sri Lanka within weeks of opening.",
    tag: "Origin", accent: "#1a1916",
  },
  {
    year: "2012", icon: Globe, title: "First intercontinental route",
    description: "We launched our inaugural Europe corridor, connecting Indian exporters to Germany and the Netherlands — our evolution from regional player to global freight partner.",
    tag: "Expansion", accent: "#2d4a3e",
  },
  {
    year: "2015", icon: Package, title: "Full customs clearance desk",
    description: "We brought customs clearance entirely in-house — cutting client wait times by 40% and giving us end-to-end control of every shipment.",
    tag: "Operations", accent: "#1a1916",
  },
  {
    year: "2017", icon: Award, title: "ISO 9001 certified",
    description: "We earned ISO 9001 certification for quality management, reinforcing our commitment to consistent, auditable processes across every office and corridor.",
    tag: "Quality", accent: "#2d4a3e",
  },
  {
    year: "2019", icon: Users, title: "10,000 shipments milestone",
    description: "A decade in, we celebrated our 10,000th delivered shipment — our client roster spanning 20 countries across four continents.",
    tag: "Milestone", accent: "#1a1916",
  },
  {
    year: "2021", icon: Zap, title: "Real-time tracking platform",
    description: "We launched our proprietary shipment tracking portal, giving clients live visibility into cargo status, customs stages, and delivery ETAs.",
    tag: "Technology", accent: "#2d4a3e",
  },
  {
    year: "2023", icon: TrendingUp, title: "30 countries, 50K+ shipments",
    description: "Canaan now operates active trade lanes across 30+ countries. Our team of 200+ professionals moves over 50,000 shipments annually.",
    tag: "Growth", accent: "#1a1916",
  },
  {
    year: "2025", icon: Star, title: "Best Freight Forwarder Award",
    description: "Recognised as Best International Freight Forwarder at the Asia Logistics Awards — a testament to our people, processes, and the trust of every client.",
    tag: "Recognition", accent: "#2d4a3e",
  },
];

// ── PARALLAX HOOK ─────────────────────────────────────────────
function useParallax(ref, speed = 0.3) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2 - window.innerHeight / 2;
      setOffset(centerY * speed);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);
  return offset;
}

// ── FADE IN HOOK ──────────────────────────────────────────────
function useFadeIn(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}

// ── ACTIVE MILESTONE TRACKER ──────────────────────────────────
function useActiveIndex(refs) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight / 2;
      let closest = 0;
      let closestDist = Infinity;
      refs.forEach((ref, i) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - mid);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      });
      setActive(closest);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [refs]);
  return active;
}

// ── DESKTOP STICKY SCROLL LAYOUT ─────────────────────────────
// ── DESKTOP STICKY SCROLL LAYOUT ─────────────────────────────
function DesktopTimeline() {
  const rowRefs = useRef(MILESTONES.map(() => ({ current: null })));
  const activeIndex = useActiveIndex(rowRefs.current);
  const sectionRef = useRef(null);
  const parallaxOffset = useParallax(sectionRef, 0.08);

  return (
    <div
      ref={sectionRef}
      className="hidden sm:flex"
      style={{
        gap: 0,
        position: "relative",
        alignItems: "flex-start", // ← CRITICAL: flex-start not stretch
      }}
    >

      {/* ── LEFT STICKY PANEL ── */}
      <div
        style={{
          width: 280,
          flexShrink: 0,
          position: "sticky",
          top: 24,            // ← distance from top of viewport when stuck
          alignSelf: "flex-start", // ← CRITICAL: must be flex-start
          zIndex: 10,
        }}
      >
        {/* 3D floating year display */}
        <div
          style={{
            background: "linear-gradient(145deg, #1a1916, #2e2b26)",
            borderRadius: 20,
            padding: "2rem 1.75rem",
            boxShadow: "0 24px 64px rgba(0,0,0,0.28), 0 4px 16px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.08)",
            transform: `translateY(${parallaxOffset * -0.4}px)`,
            transition: "transform 0.1s linear",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Glossy shimmer */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "45%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 100%)",
            borderRadius: "20px 20px 0 0", pointerEvents: "none",
          }} />

          <p style={{
            fontSize: 10, fontWeight: 600, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.4)", margin: "0 0 12px",
          }}>
            Currently viewing
          </p>

          <div
            key={activeIndex}
            style={{
              fontSize: "clamp(3rem, 5vw, 4.5rem)",
              fontWeight: 800, letterSpacing: "-0.05em",
              color: "#ffffff", lineHeight: 1, margin: "0 0 10px",
              animation: "yearPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
            }}
          >
            {MILESTONES[activeIndex].year}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 16px" }}>
            <span style={{
              fontSize: 10, background: "rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.7)", borderRadius: 99, padding: "3px 10px",
              fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
            }}>
              {MILESTONES[activeIndex].tag}
            </span>
          </div>

          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: "0 0 20px" }}>
            {MILESTONES[activeIndex].title}
          </p>

          {/* Progress bar */}
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 3, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${((activeIndex + 1) / MILESTONES.length) * 100}%`,
              background: "linear-gradient(90deg, #4ade80, #22d3ee)",
              borderRadius: 99,
              transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
            }} />
          </div>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", margin: "6px 0 0", letterSpacing: "0.05em" }}>
            {activeIndex + 1} of {MILESTONES.length} milestones
          </p>

          {/* Dot nav */}
          <div style={{ display: "flex", gap: 6, marginTop: 20, flexWrap: "wrap" }}>
            {MILESTONES.map((_, i) => (
              <div
                key={i}
                onClick={() => rowRefs.current[i]?.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
                style={{
                  width: i === activeIndex ? 20 : 6,
                  height: 6, borderRadius: 99,
                  background: i === activeIndex ? "#4ade80" : "rgba(255,255,255,0.2)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </div>

        {/* Mini index list */}
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 2 }}>
          {MILESTONES.map((m, i) => (
            <div
              key={m.year}
              onClick={() => rowRefs.current[i]?.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 12px", borderRadius: 10, cursor: "pointer",
                background: i === activeIndex ? "rgba(255,255,255,0.8)" : "transparent",
                border: `1px solid ${i === activeIndex ? "#dedad2" : "transparent"}`,
                transition: "all 0.25s ease",
              }}
            >
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                background: i === activeIndex ? "#1a1916" : "#c8c5bc",
                transition: "background 0.25s", flexShrink: 0,
              }} />
              <span style={{
                fontSize: 12,
                fontWeight: i === activeIndex ? 600 : 400,
                color: i === activeIndex ? "#1a1916" : "#a0998c",
                letterSpacing: "-0.01em", transition: "all 0.25s",
              }}>
                {m.year} — {m.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT SCROLLABLE CARDS ── */}
      <div
        style={{
          flex: 1,
          paddingLeft: 40,
          display: "flex",
          flexDirection: "column",
          gap: 0,
          // No overflow hidden here — lets sticky work
        }}
      >
        {MILESTONES.map((m, i) => (
          <MilestoneCard
            key={m.year}
            m={m}
            index={i}
            isLast={i === MILESTONES.length - 1}
            isActive={i === activeIndex}
            ref={rowRefs.current[i]}
          />
        ))}
      </div>
    </div>
  );
}

// ── MILESTONE CARD (desktop right) ───────────────────────────
const MilestoneCard = ({ m, index, isLast, isActive, ref: outerRef }) => {
  const innerRef = useRef(null);
  const visible = useFadeIn(innerRef);
  const parallaxOffset = useParallax(innerRef, 0.12);
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const Icon = m.icon;
  const delay = `${index * 80}ms`;

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setTilt({ x: dy * -5, y: dx * 5 });
  };

  return (
    <div
      ref={(el) => { innerRef.current = el; if (outerRef) outerRef.current = el; }}
      style={{
        display: "grid",
        gridTemplateColumns: "48px 1fr",
        gap: 0,
        alignItems: "flex-start",
        opacity: visible ? 1 : 0,
        transform: visible
          ? `translateY(${parallaxOffset}px)`
          : `translateY(${24 + parallaxOffset}px)`,
        transition: `opacity 0.6s ease ${delay}, transform 0.15s linear`,
        paddingBottom: isLast ? 0 : 16,
      }}
    >
      {/* Spine column */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
        {/* Icon dot */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: isActive
              ? "linear-gradient(145deg, #2a2926, #1a1916)"
              : "linear-gradient(145deg, #d5d2ca, #c8c5bc)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: isActive
              ? "0 6px 20px rgba(0,0,0,0.25), 0 0 0 5px #f7f5f1, inset 0 1px 0 rgba(255,255,255,0.12)"
              : "0 2px 8px rgba(0,0,0,0.08), 0 0 0 4px #f7f5f1",
            transition: "all 0.4s ease",
            zIndex: 2,
          }}
        >
          <Icon size={16} color={isActive ? "#f5f4f0" : "#8a8278"} strokeWidth={1.8} />
        </div>

        {/* Spine line */}
        {!isLast && (
          <div style={{
            width: 2, flex: 1, minHeight: 60,
            background: isActive
              ? "linear-gradient(to bottom, #4ade80 0%, #c8c5bc 60%, transparent 100%)"
              : "linear-gradient(to bottom, #c8c5bc 0%, #e5e3dc 80%, transparent 100%)",
            borderRadius: 2,
            transition: "background 0.5s ease",
            marginTop: 2,
          }} />
        )}
      </div>

      {/* Card */}
      <div style={{ paddingLeft: 24, paddingBottom: 32 }}>
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
          style={{
            background: isActive
              ? "#ffffff"
              : hovered ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.5)",
            border: `1.5px solid ${isActive ? "#d0cdc5" : hovered ? "#d5d2ca" : "#e8e5de"}`,
            borderRadius: 20,
            padding: "1.5rem 1.6rem",
            transform: hovered
              ? `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${isActive ? 14 : 8}px)`
              : `perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(${isActive ? 4 : 0}px)`,
            transition: hovered
              ? "transform 0.08s linear, box-shadow 0.2s, background 0.2s, border-color 0.2s"
              : "transform 0.45s cubic-bezier(0.34,1.2,0.64,1), box-shadow 0.4s, background 0.3s, border-color 0.3s",
            boxShadow: isActive
              ? "0 20px 56px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.07)"
              : hovered
                ? "0 12px 32px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.05)"
                : "0 2px 8px rgba(0,0,0,0.03)",
            position: "relative",
            overflow: "hidden",
            willChange: "transform",
          }}
        >
          {/* Active left bar */}
          {isActive && (
            <div style={{
              position: "absolute", left: 0, top: "15%", bottom: "15%",
              width: 3, borderRadius: "0 3px 3px 0",
              background: "linear-gradient(to bottom, #4ade80, #22d3ee)",
            }} />
          )}

          {/* Shimmer */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "40%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 100%)",
            borderRadius: "20px 20px 0 0", pointerEvents: "none",
          }} />

          {/* Accent glow */}
          <div style={{
            position: "absolute", width: 140, height: 140, borderRadius: "50%",
            background: `radial-gradient(circle, ${m.accent}${isActive ? "22" : "10"} 0%, transparent 70%)`,
            top: -40, right: -40, pointerEvents: "none",
            transition: "opacity 0.3s",
          }} />

          {/* Tag + year */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: "0.12em",
              color: "#a0998c", textTransform: "uppercase",
            }}>
              {m.tag}
            </span>
            <span style={{
              fontSize: 10, background: m.accent, color: "#f5f4f0",
              borderRadius: 99, padding: "2px 10px", fontWeight: 700, letterSpacing: "0.04em",
            }}>
              {m.year}
            </span>
            {isActive && (
              <span style={{
                fontSize: 9, background: "linear-gradient(90deg,#4ade80,#22d3ee)",
                color: "#fff", borderRadius: 99, padding: "2px 8px",
                fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
              }}>
                Now viewing
              </span>
            )}
          </div>

          <h3 style={{
            fontSize: isActive ? 17 : 15,
            fontWeight: 700, letterSpacing: "-0.025em",
            color: "#1a1916", margin: "0 0 8px", lineHeight: 1.3,
            transition: "font-size 0.3s",
          }}>
            {m.title}
          </h3>

          <p style={{
            fontSize: 13, color: "#7a7167",
            lineHeight: 1.7, margin: 0,
          }}>
            {m.description}
          </p>
        </div>
      </div>
    </div>
  );
};

// ── MOBILE CARD ───────────────────────────────────────────────
function MobileCard({ m, index, isLast }) {
  const ref = useRef(null);
  const visible = useFadeIn(ref);
  const parallaxOffset = useParallax(ref, 0.08);
  const [hovered, setHovered] = useState(false);
  const Icon = m.icon;
  const delay = `${index * 70}ms`;

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        gap: 14,
        opacity: visible ? 1 : 0,
        transform: visible
          ? `translateY(${parallaxOffset}px)`
          : `translateY(${20 + parallaxOffset}px)`,
        transition: `opacity 0.5s ease ${delay}, transform 0.15s linear`,
      }}
    >
      {/* Spine */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: "linear-gradient(145deg, #2a2926, #1a1916)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2), 0 0 0 4px #f5f4f0, inset 0 1px 0 rgba(255,255,255,0.1)",
          flexShrink: 0,
        }}>
          <Icon size={14} color="#f5f4f0" strokeWidth={1.8} />
        </div>
        {!isLast && (
          <div style={{
            width: 2, flex: 1, minHeight: 28,
            background: "linear-gradient(to bottom, #c8c5bc, #e5e3dc)",
            borderRadius: 2,
          }} />
        )}
      </div>

      {/* Card */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          flex: 1,
          paddingBottom: isLast ? 0 : 24,
          background: hovered ? "#ffffff" : "rgba(255,255,255,0.6)",
          border: `1.5px solid ${hovered ? "#d0cdc5" : "#e8e5de"}`,
          borderRadius: 16,
          padding: "1rem 1.1rem",
          marginBottom: isLast ? 0 : 8,
          transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
          boxShadow: hovered
            ? "0 12px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.05)"
            : "0 2px 6px rgba(0,0,0,0.03)",
          position: "relative", overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "40%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 100%)",
          borderRadius: "16px 16px 0 0", pointerEvents: "none",
        }} />

        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", color: "#a0998c", textTransform: "uppercase" }}>
            {m.tag}
          </span>
          <span style={{ fontSize: 9, background: m.accent, color: "#f5f4f0", borderRadius: 99, padding: "1.5px 8px", fontWeight: 700 }}>
            {m.year}
          </span>
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.02em", color: "#1a1916", margin: "0 0 5px", lineHeight: 1.3 }}>
          {m.title}
        </h3>
        <p style={{ fontSize: 12, color: "#7a7167", lineHeight: 1.65, margin: 0 }}>
          {m.description}
        </p>
      </div>
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────
export default function TimelineSection() {
  const headerRef = useRef(null);
  const headerVisible = useFadeIn(headerRef);
  const bgRef = useRef(null);
  const bgParallax = useParallax(bgRef, 0.15);
  const rowRefs = useRef(MILESTONES.map(() => ({ current: null })));
  const activeIndex = useActiveIndex(rowRefs.current);

  return (
    <>
      <style>{`
        .timeline-section * { box-sizing: border-box; }
        @keyframes yearPop {
          0% { opacity: 0; transform: translateY(8px) scale(0.92); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <section
        ref={bgRef}
        className="timeline-section relative font-sans"
        style={{ background: "#f5f4f0", padding: "0 1.25rem 1.25rem" }}
      >
        {/* Parallax blobs */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden",
          transform: `translateY(${bgParallax * 0.5}px)`,
          transition: "transform 0.1s linear",
        }}>
          <div style={{
            position: "absolute", width: 500, height: 500, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)",
            top: "10%", right: "-10%",
          }} />
          <div style={{
            position: "absolute", width: 400, height: 400, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 70%)",
            bottom: "20%", left: "-5%",
          }} />
        </div>

        {/* ── WHITE CARD ── */}
        <div style={{
          background: "linear-gradient(160deg, #fdfcfb 0%, #f7f5f1 100%)",
          borderRadius: 24,
          padding: "clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 5vw, 3.5rem)",
          boxShadow: "0 2px 24px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)",
          border: "1px solid #e8e5de",
          position: "relative",
          // ← NO overflow hidden here
        }}>

          {/* ── HEADER — this scrolls away normally ── */}
          <div
            ref={headerRef}
            style={{
              marginBottom: "clamp(2.5rem, 6vw, 4rem)",
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <div className="inline-flex items-center gap-2 mb-3">
              <span style={{
                fontSize: 10, fontWeight: 600, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "#a0998c",
                background: "#ece9e2", padding: "4px 12px",
                borderRadius: 99, border: "1px solid #dedad2",
              }}>
                Our Journey
              </span>
            </div>

            <div style={{
              display: "flex", alignItems: "flex-end",
              justifyContent: "space-between", flexWrap: "wrap", gap: 20,
            }}>
              <h2 style={{
                fontSize: "clamp(1.7rem, 4.5vw, 2.6rem)",
                fontWeight: 700, letterSpacing: "-0.03em",
                lineHeight: 1.15, color: "#1a1916", margin: 0,
              }}>
                15 years of moving<br />the world forward
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end" }}>
                <p style={{
                  fontSize: 14, color: "#7a7167", lineHeight: 1.65,
                  maxWidth: 320, margin: 0, textAlign: "right",
                }}>
                  From a single trade lane out of Chennai to a global network spanning 30+ countries.
                </p>
                <button style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "#1a1916", color: "#f5f4f0",
                  border: "none", borderRadius: 99, padding: "10px 20px",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  letterSpacing: "-0.01em",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
                }}>
                  Our full story <ArrowRight size={13} />
                </button>
              </div>
            </div>

            <div style={{
              height: 1,
              background: "linear-gradient(to right, transparent, #dedad2, transparent)",
              marginTop: 32,
            }} />
          </div>

          {/* ── STICKY ZONE — header scrolls away, this section sticks ── */}
          {/* 
            Key idea: the sticky panel's top value must account for 
            how far down the page the white card starts.
            Use top: 24 to stick just below the browser top edge.
            The sticky stops naturally when the right column runs out.
          */}
          <div
            className="hidden sm:flex"
            style={{
              gap: 0,
              position: "relative",
              alignItems: "flex-start", // ← CRITICAL
            }}
          >

            {/* ── LEFT STICKY PANEL ── */}
            <div
              style={{
                width: 280,
                flexShrink: 0,
                position: "sticky",
                top: 24,                  // ← sticks 24px from top of viewport
                alignSelf: "flex-start",  // ← CRITICAL, do not remove
                zIndex: 10,
                // Panel will naturally unstick when right column ends
              }}
            >
              {/* Dark year card */}
              <div style={{
                background: "linear-gradient(145deg, #1a1916, #2e2b26)",
                borderRadius: 20,
                padding: "2rem 1.75rem",
                boxShadow: "0 24px 64px rgba(0,0,0,0.28), 0 4px 16px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.08)",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "45%",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 100%)",
                  borderRadius: "20px 20px 0 0", pointerEvents: "none",
                }} />

                <p style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: "0.14em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.4)", margin: "0 0 12px",
                }}>
                  Currently viewing
                </p>

                <div
                  key={activeIndex}
                  style={{
                    fontSize: "clamp(3rem, 5vw, 4.5rem)",
                    fontWeight: 800, letterSpacing: "-0.05em",
                    color: "#ffffff", lineHeight: 1, margin: "0 0 10px",
                    animation: "yearPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
                  }}
                >
                  {MILESTONES[activeIndex].year}
                </div>

                <span style={{
                  fontSize: 10, background: "rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.7)", borderRadius: 99,
                  padding: "3px 10px", fontWeight: 600,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  display: "inline-block", marginBottom: 16,
                }}>
                  {MILESTONES[activeIndex].tag}
                </span>

                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: "0 0 20px" }}>
                  {MILESTONES[activeIndex].title}
                </p>

                {/* Progress bar */}
                <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 3, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${((activeIndex + 1) / MILESTONES.length) * 100}%`,
                    background: "linear-gradient(90deg, #4ade80, #22d3ee)",
                    borderRadius: 99,
                    transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
                  }} />
                </div>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", margin: "6px 0 0", letterSpacing: "0.05em" }}>
                  {activeIndex + 1} of {MILESTONES.length} milestones
                </p>

                {/* Dot nav */}
                <div style={{ display: "flex", gap: 6, marginTop: 20, flexWrap: "wrap" }}>
                  {MILESTONES.map((_, i) => (
                    <div
                      key={i}
                      onClick={() => rowRefs.current[i]?.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
                      style={{
                        width: i === activeIndex ? 20 : 6,
                        height: 6, borderRadius: 99,
                        background: i === activeIndex ? "#4ade80" : "rgba(255,255,255,0.2)",
                        transition: "all 0.3s ease", cursor: "pointer",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Mini index */}
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 2 }}>
                {MILESTONES.map((m, i) => (
                  <div
                    key={m.year}
                    onClick={() => rowRefs.current[i]?.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "8px 12px", borderRadius: 10, cursor: "pointer",
                      background: i === activeIndex ? "rgba(255,255,255,0.8)" : "transparent",
                      border: `1px solid ${i === activeIndex ? "#dedad2" : "transparent"}`,
                      transition: "all 0.25s ease",
                    }}
                  >
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: i === activeIndex ? "#1a1916" : "#c8c5bc",
                      transition: "background 0.25s", flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: 12,
                      fontWeight: i === activeIndex ? 600 : 400,
                      color: i === activeIndex ? "#1a1916" : "#a0998c",
                      letterSpacing: "-0.01em", transition: "all 0.25s",
                    }}>
                      {m.year} — {m.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT SCROLLABLE CARDS ── */}
            <div style={{ flex: 1, paddingLeft: 40, display: "flex", flexDirection: "column" }}>
              {MILESTONES.map((m, i) => (
                <MilestoneCard
                  key={m.year}
                  m={m}
                  index={i}
                  isLast={i === MILESTONES.length - 1}
                  isActive={i === activeIndex}
                  ref={rowRefs.current[i]}
                />
              ))}
            </div>
          </div>

          {/* ── MOBILE ── */}
          <div className="sm:hidden flex flex-col gap-0">
  {MILESTONES.map((m, i) => (
    <MobileCard key={m.year} m={m} index={i} isLast={i === MILESTONES.length - 1} />
  ))}
</div>
          {/* ── FOOTER ── */}
          <div style={{
            marginTop: "clamp(2rem, 5vw, 3rem)", paddingTop: "1.5rem",
            borderTop: "1px solid #ece9e2",
            display: "flex", alignItems: "center",
            justifyContent: "space-between", flexWrap: "wrap", gap: 16,
          }}>
            <p style={{ fontSize: 12, color: "#a0998c", margin: 0 }}>
              Est. 2009 · Chennai, India · Worldwide operations
            </p>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {["🇮🇳", "🇩🇪", "🇦🇪", "🇺🇸", "🇯🇵", "🇸🇬", "🇬🇧"].map((flag, i) => (
                <span key={i} style={{ fontSize: 18 }}>{flag}</span>
              ))}
              <span style={{ fontSize: 12, color: "#a0998c", marginLeft: 4 }}>+23</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}