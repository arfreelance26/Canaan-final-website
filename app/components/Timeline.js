"use client";
import { useEffect, useRef, useState } from "react";
import {
  Anchor, Globe, Package, Award,
  TrendingUp, Users, Zap, Star,
} from "lucide-react";

const MILESTONES = [
  {
    year: "2009",
    icon: Anchor,
    title: "Founded in Chennai",
    tag: "Origin",
    description:
      "Canaan Shipping & Logistics was born from a vision to simplify international freight — starting with a single trade lane between India and Europe.",
    image:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1400&q=85",
  },
  {
    year: "2012",
    icon: Globe,
    title: "First intercontinental route",
    tag: "Expansion",
    description:
      "We established our first Europe–India full-container corridor, connecting Chennai to Hamburg with reliable weekly sailings.",
    image:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=1400&q=85",
  },
  {
    year: "2015",
    icon: Package,
    title: "Full customs clearance desk",
    tag: "Operations",
    description:
      "A dedicated in-house customs brokerage team was formed, cutting clearance times by 40% and eliminating third-party delays for our clients.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=85",
  },
  {
    year: "2017",
    icon: Award,
    title: "ISO 9001 certified",
    tag: "Quality",
    description:
      "Canaan achieved ISO 9001:2015 certification, formalising our quality management processes and opening doors to Tier-1 global accounts.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=85",
  },
  {
    year: "2019",
    icon: Users,
    title: "10,000 shipments milestone",
    tag: "Milestone",
    description:
      "A decade of trust — we celebrated 10,000 successful shipments across 18 countries, with a growing team of 85 logistics professionals.",
    image:
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1400&q=85",
  },
  {
    year: "2021",
    icon: Zap,
    title: "Real-time tracking platform",
    tag: "Technology",
    description:
      "We launched our proprietary CargoTrack portal — live GPS, customs status, ETA updates, and document management, all in one dashboard.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85",
  },
  {
    year: "2023",
    icon: TrendingUp,
    title: "30 countries, 50K+ shipments",
    tag: "Growth",
    description:
      "Expansion into Southeast Asia, the Middle East, and North America brought us to 30 active trade corridors and over 50,000 lifetime shipments.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=85",
  },
  {
    year: "2025",
    icon: Star,
    title: "Best Freight Forwarder Award",
    tag: "Recognition",
    description:
      "Recognised at the Asia Freight & Logistics Awards as Best Freight Forwarder — a testament to our team, our clients, and 15 years of relentless commitment.",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=85",
  },
];

export default function TimelineSection() {
  const sectionRef = useRef(null);
  const progressBarRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const activeIdxRef = useRef(0);

  useEffect(() => {
    let rafId = null;
    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const scrolled = -rect.top;
        const scrollable = rect.height - window.innerHeight;
        if (scrollable <= 0) return;
        const prog = Math.max(0, Math.min(1, scrolled / scrollable));
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${prog * 100}%`;
        }
        const newIdx = Math.min(
          MILESTONES.length - 1,
          Math.round(prog * (MILESTONES.length - 1))
        );
        if (newIdx !== activeIdxRef.current) {
          activeIdxRef.current = newIdx;
          setActiveIdx(newIdx);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const m = MILESTONES[activeIdx];

  return (
    <>
      <style>{`
        .tl-overlay {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(
            to top,
            rgba(245,244,240,1) 0%,
            rgba(245,244,240,0.96) 28%,
            rgba(245,244,240,0.55) 52%,
            rgba(245,244,240,0.08) 78%,
            rgba(245,244,240,0) 100%
          );
        }
        @media (min-width: 1024px) {
          .tl-overlay {
            background: linear-gradient(
              104deg,
              rgba(245,244,240,1) 0%,
              rgba(245,244,240,1) 26%,
              rgba(245,244,240,0.94) 44%,
              rgba(245,244,240,0.32) 63%,
              rgba(245,244,240,0) 80%
            );
          }
        }
        .tl-content {
          position: absolute;
          bottom: clamp(28px, 6vh, 56px);
          left: clamp(20px, 5vw, 32px);
          right: clamp(20px, 5vw, 32px);
          z-index: 3;
        }
        @media (min-width: 1024px) {
          .tl-content {
            top: 50%;
            bottom: auto;
            left: clamp(40px, 6vw, 88px);
            right: auto;
            width: min(500px, 46%);
            transform: translateY(-56%);
          }
        }
        .tl-ghost {
          display: none;
        }
        @media (min-width: 1024px) {
          .tl-ghost {
            display: block;
            position: absolute;
            right: 3%;
            bottom: 5%;
            z-index: 2;
            pointer-events: none;
            user-select: none;
            font-size: clamp(8rem, 18vw, 15rem);
            font-weight: 900;
            letter-spacing: -0.06em;
            line-height: 1;
          }
        }
        .tl-topbar {
          position: absolute;
          top: clamp(18px, 3.2vh, 38px);
          left: clamp(20px, 5vw, 32px);
          right: clamp(20px, 5vw, 32px);
          z-index: 4;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        @media (min-width: 1024px) {
          .tl-topbar {
            left: clamp(40px, 6vw, 88px);
            right: clamp(40px, 6vw, 88px);
          }
        }
        @keyframes tlUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes tlImgIn {
          from { opacity: 0; transform: scale(1.04); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <section
        ref={sectionRef}
        style={{ height: `${MILESTONES.length * 100}vh`, position: "relative" }}
        className="font-sans"
      >
        {/* ── STICKY VIEWPORT PANEL ── */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            background: "#f5f4f0",
          }}
        >
          {/* Background images — crossfade */}
          {MILESTONES.map((mi, i) => (
            <img
              key={i}
              src={mi.image}
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                opacity: i === activeIdx ? 1 : 0,
                transition: "opacity 1.1s cubic-bezier(0.4,0,0.2,1)",
                willChange: "opacity",
              }}
            />
          ))}

          {/* Directional warm overlay */}
          <div className="tl-overlay" style={{ zIndex: 1 }} />

          {/* Bottom fade reinforcement */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "18%",
              background:
                "linear-gradient(to top, rgba(245,244,240,0.9), transparent)",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />

          {/* Ghost year on image side (desktop only) */}
          {MILESTONES.map((mi, i) => (
            <div
              key={i}
              className="tl-ghost"
              style={{
                color: "rgba(255,255,255,0.09)",
                opacity: i === activeIdx ? 1 : 0,
                transition: "opacity 1.1s ease",
              }}
            >
              {mi.year}
            </div>
          ))}

          {/* ── Top bar ── */}
          <div className="tl-topbar">
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#8a6f24",
              }}
            >
              Our Journey
            </span>

            {/* Pill progress dots */}
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {MILESTONES.map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 6,
                    width: i === activeIdx ? 22 : 6,
                    borderRadius: 3,
                    background:
                      i === activeIdx
                        ? "#c8a84b"
                        : "rgba(10,9,8,0.12)",
                    transition:
                      "width 0.5s cubic-bezier(0.34,1.2,0.64,1), background 0.35s ease",
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── Main content block ── */}
          <div className="tl-content">
            {/* Year watermark */}
            <div
              key={`yw-${activeIdx}`}
              style={{
                fontSize: "clamp(5.5rem, 13vw, 10.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.06em",
                lineHeight: 0.85,
                color: "#0a0908",
                opacity: 0.055,
                marginBottom: "-0.15em",
                marginLeft: "-0.035em",
                userSelect: "none",
                animation: "tlUp 0.5s cubic-bezier(0.22,1,0.36,1) both",
              }}
            >
              {m.year}
            </div>

            {/* Tag row */}
            <div
              key={`tag-${activeIdx}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
                animation: "tlUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.06s both",
              }}
            >
              <div
                style={{ width: 28, height: 1.5, background: "#c8a84b", flexShrink: 0 }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#8a6f24",
                }}
              >
                {m.tag}
              </span>
            </div>

            {/* Title */}
            <h2
              key={`title-${activeIdx}`}
              style={{
                fontSize: "clamp(1.8rem, 4.5vw, 3.1rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                color: "#0a0908",
                margin: "0 0 16px",
                animation: "tlUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.11s both",
              }}
            >
              {m.title}
            </h2>

            {/* Description */}
            <p
              key={`desc-${activeIdx}`}
              style={{
                fontSize: "clamp(0.82rem, 1.4vw, 0.94rem)",
                color: "rgba(10,9,8,0.52)",
                lineHeight: 1.75,
                margin: "0 0 24px",
                maxWidth: 400,
                animation: "tlUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.16s both",
              }}
            >
              {m.description}
            </p>

            {/* Counter */}
            <div
              key={`count-${activeIdx}`}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 6,
                animation: "tlUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.21s both",
              }}
            >
              <span
                style={{
                  fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "#0a0908",
                }}
              >
                {String(activeIdx + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: "rgba(10,9,8,0.28)",
                  fontWeight: 500,
                }}
              >
                &thinsp;/&thinsp;{String(MILESTONES.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* ── Gold progress bar ── */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              background: "rgba(10,9,8,0.07)",
              zIndex: 5,
            }}
          >
            <div
              ref={progressBarRef}
              style={{
                height: "100%",
                width: "0%",
                background: "linear-gradient(to right, #c8a84b, #d4af37)",
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
