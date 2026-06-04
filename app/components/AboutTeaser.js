"use client";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import useFadeIn from "../hooks/useFadeIn";
import team2 from "../../company photos/team2.jpeg";
import team3 from "../../company photos/team3.jpeg";
import team4 from "../../company photos/team4.jpeg";
import team5 from "../../company photos/team5.jpeg";

const STATS = [
  { num: "100+", label: "Team members" },
  { num: "30+",  label: "Countries" },
  { num: "15+",  label: "Years" },
  { num: "50K+", label: "Shipments" },
];

export default function AboutTeaserSection() {
  const router = useRouter();
  const sectionRef = useRef(null);
  const isVisible = useFadeIn(sectionRef, 0.08);

  // rotating background images
  const images = [team2.src, team3.src, team4.src, team5.src];
  const [bgIndex, setBgIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setBgIndex((i) => (i + 1) % images.length), 3000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        background: "#1a1916",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {/* ── Rotating background images (auto-loop every 3s) ── */}
      <div style={{ position: "absolute", inset: 0 }}>
        {images.map((src, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url('${src}')`,
              backgroundSize: "cover",
              backgroundPosition: "center 30%",
              /* increase image visibility: brighter and full saturation */
              filter: "brightness(0.50) saturate(1)",
              transform: isVisible ? "scale(1)" : "scale(1.04)",
              transition: "opacity 0.9s ease, transform 1.8s cubic-bezier(0.16,1,0.3,1)",
              opacity: i === bgIndex ? 1 : 0,
              zIndex: 0,
            }}
          />
        ))}
      </div>

      {/* ── Gradient overlay ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(26,25,22,0.75) 0%, rgba(26,25,22,0.35) 55%, rgba(26,25,22,0.08) 100%)",
        }}
      />

      {/* ── Gold accent line (top) ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(210,165,45,0.6) 30%, rgba(210,165,45,0.6) 70%, transparent 100%)",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 1s ease 0.3s",
        }}
      />

      {/* ── Top-right chip ── */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          background: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 9999,
          padding: "6px 14px",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(-8px)",
          transition: "opacity 0.7s ease 0.5s, transform 0.7s ease 0.5s",
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Our People
        </span>
      </div>

      {/* ── Main content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "clamp(32px, 5vw, 60px) clamp(24px, 6vw, 72px) clamp(48px, 7vh, 80px)",
          maxWidth: 760,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 0.9s ease 0.15s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s",
        }}
      >
        {/* Label */}
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(210,165,45,0.75)",
            display: "block",
            marginBottom: 18,
          }}
        >
          The People Behind Canaan
        </span>

        {/* Headline */}
        <h2
          style={{
            fontSize: "clamp(2.6rem, 5.5vw, 5rem)",
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.03em",
            lineHeight: 1.04,
            margin: "0 0 28px",
          }}
        >
          Built by people
          <br />
          <span style={{ color: "rgba(255,255,255,0.28)" }}>who move the world.</span>
        </h2>

        {/* Founder quote strip */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
            marginBottom: 32,
            paddingLeft: 16,
            borderLeft: "2px solid rgba(210,165,45,0.5)",
          }}
        >
          <p
            style={{
              fontSize: "clamp(13px, 1.6vw, 16px)",
              color: "rgba(255,255,255,0.52)",
              lineHeight: 1.7,
              margin: 0,
              fontStyle: "italic",
              letterSpacing: "0.005em",
            }}
          >
            &ldquo;Our mission is to bridge businesses across borders with reliability,
            integrity, and a relentless commitment to delivering on time — every time.&rdquo;
            <br />
            <span
              style={{
                display: "inline-block",
                marginTop: 6,
                fontSize: 10,
                fontStyle: "normal",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(210,165,45,0.65)",
              }}
            >
              — Arun Samuel  Alfred, Founder &amp; CEO
            </span>
          </p>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: "clamp(24px, 4vw, 48px)",
            marginBottom: 36,
            flexWrap: "wrap",
          }}
        >
          {STATS.map(({ num, label }) => (
            <div key={label}>
              <div
                style={{
                  fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)",
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}
              >
                {num}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.35)",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  marginTop: 4,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA button */}
        <button
          onClick={() => router.push("/about")}
          className="about-teaser-cta"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "13px 24px",
            borderRadius: 9999,
            background: "rgba(255,255,255,0.09)",
            border: "1px solid rgba(255,255,255,0.18)",
            color: "#ffffff",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.02em",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            transition: "background 0.3s ease, border-color 0.3s ease, gap 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.16)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)";
            e.currentTarget.style.gap = "14px";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.09)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
            e.currentTarget.style.gap = "10px";
          }}
        >
          Meet the team
          <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
}
