"use client"
import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Arjun Mehta",
    title: "Head of Supply Chain",
    company: "Nexora Industries",
    country: "India",
    flag: "🇮🇳",
    quote:
      "Canaan Global handled our first cross-border shipment to Germany flawlessly. Customs was cleared in record time, and we had real-time visibility throughout. They've become our only logistics partner.",
    metric: "98%",
    metricLabel: "On-time rate",
  },
  {
    id: 2,
    name: "Sarah O'Brien",
    title: "Director of Operations",
    company: "Atlantic Trade Co.",
    country: "Ireland",
    flag: "🇮🇪",
    quote:
      "What sets Canaan apart is their people. Our account manager knew every detail of our shipment without us having to chase. That kind of proactive service is rare in freight forwarding.",
    metric: "3×",
    metricLabel: "Faster clearance",
  },
  {
    id: 3,
    name: "Lena Hoffmann",
    title: "Procurement Manager",
    company: "Bauwerk GmbH",
    country: "Germany",
    flag: "🇩🇪",
    quote:
      "We ship sensitive industrial equipment across 12 countries every month. Canaan's end-to-end documentation management has eliminated delays entirely. I can't imagine going back to our old provider.",
    metric: "12",
    metricLabel: "Countries covered",
  },
  {
    id: 4,
    name: "Marcus Williams",
    title: "CEO",
    company: "Horizon Retail Group",
    country: "United States",
    flag: "🇺🇸",
    quote:
      "We scaled from 200 to over 2,000 shipments per quarter with Canaan. Their infrastructure just grew with us — no hiccups, no delays, no excuses. Exactly what a growing business needs.",
    metric: "10×",
    metricLabel: "Volume scaled",
  },
  {
    id: 5,
    name: "Priya Nair",
    title: "Logistics Coordinator",
    company: "SunBridge Exports",
    country: "UAE",
    flag: "🇦🇪",
    quote:
      "The team handled an urgent perishable shipment to Tokyo over a weekend with zero fuss. Temperature-controlled, on time, and perfectly documented. That experience made us a lifelong client.",
    metric: "72h",
    metricLabel: "Emergency delivery",
  },
];

const AUTOPLAY_INTERVAL = 4000;

function Avatar({ name }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  const colors = [
    ["#e8e3d4", "#6b6450"],
    ["#d4e3e0", "#4a6b64"],
    ["#e3d4e0", "#6b4a68"],
    ["#d4dde3", "#4a5e6b"],
    ["#e3ddd4", "#6b5e4a"],
  ];
  const [bg, fg] = colors[name.charCodeAt(0) % colors.length];
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: 13,
        color: fg,
        letterSpacing: "0.04em",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(null);
  const [direction, setDirection] = useState("next"); // "next" | "prev"
  const [animating, setAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const total = TESTIMONIALS.length;

  const goTo = useCallback(
    (index, dir = "next") => {
      if (animating) return;
      setPrev(active);
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setActive(index);
        setPrev(null);
        setAnimating(false);
      }, 380);
    },
    [active, animating]
  );

  const next = useCallback(() => goTo((active + 1) % total, "next"), [active, goTo, total]);
  const goBack = useCallback(
    () => goTo((active - 1 + total) % total, "prev"),
    [active, goTo, total]
  );

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [next, paused]);

  const t = TESTIMONIALS[active];
  const p = prev !== null ? TESTIMONIALS[prev] : null;

  /* CSS injected once */
  return (
    <>
      <style>{`
        @keyframes slideInNext {
          from { opacity: 0; transform: translateX(32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInPrev {
          from { opacity: 0; transform: translateX(-32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutNext {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(-32px); }
        }
        @keyframes slideOutPrev {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(32px); }
        }
        .tcard-enter-next { animation: slideInNext 0.38s cubic-bezier(0.22,1,0.36,1) forwards; }
        .tcard-enter-prev { animation: slideInPrev 0.38s cubic-bezier(0.22,1,0.36,1) forwards; }
        .tcard-exit-next  { animation: slideOutNext 0.38s cubic-bezier(0.22,1,0.36,1) forwards; }
        .tcard-exit-prev  { animation: slideOutPrev 0.38s cubic-bezier(0.22,1,0.36,1) forwards; }
        .tpip { transition: width 0.35s cubic-bezier(0.22,1,0.36,1), background 0.35s; }
        .tnav-btn:hover { background: #e5e4df !important; }
        .tnav-btn:active { transform: scale(0.95); }
        .tnav-btn { transition: background 0.18s, transform 0.12s; }
      `}</style>

      <section
        className="relative font-sans"
        style={{ background: "#f5f4f0", padding: "1.25rem 1.25rem" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
            gap: 16,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#a0998c",
                margin: 0,
                marginBottom: 6,
              }}
            >
              Client voices
            </p>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                color: "#1a1916",
                margin: 0,
              }}
            >
              Trusted by businesses
              <br />
              around the world
            </h2>
          </div>

          {/* Nav buttons — desktop */}
          {/* <div className="hidden sm:flex" style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button
              onClick={goBack}
              className="tnav-btn"
              aria-label="Previous testimonial"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "1.5px solid #d5d2ca",
                background: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#1a1916",
              }}
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={next}
              className="tnav-btn"
              aria-label="Next testimonial"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "none",
                background: "#1a1916",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#f5f4f0",
              }}
            >
              <ArrowRight size={16} />
            </button>
          </div> */}
        </div>

        {/* Card stage */}
        <div style={{ position: "relative", overflow: "hidden", borderRadius: 20 }}>
          {/* Exit card */}
          {animating && p && (
            <div
              className={direction === "next" ? "tcard-exit-next" : "tcard-exit-prev"}
              style={{ position: "absolute", inset: 0, zIndex: 1 }}
            >
              <TestimonialCard t={p} />
            </div>
          )}

          {/* Enter card */}
          <div
            className={
              animating
                ? direction === "next"
                  ? "tcard-enter-next"
                  : "tcard-enter-prev"
                : ""
            }
            style={{ position: "relative", zIndex: 2 }}
          >
            <TestimonialCard t={t} />
          </div>
        </div>

        {/* Bottom row: pips + mobile nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "1rem",
          }}
        >
          {/* Pips */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > active ? "next" : "prev")}
                aria-label={`Go to testimonial ${i + 1}`}
                className="tpip"
                style={{
                  height: 4,
                  width: i === active ? 28 : 10,
                  borderRadius: 9999,
                  background: i === active ? "#1a1916" : "#c8c5bc",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              />
            ))}
          </div>

          {/* Mobile nav */}
          <div className="sm:hidden" style={{ display: "flex", gap: 8 }}>
            <button
              onClick={goBack}
              className="tnav-btn"
              aria-label="Previous"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "1.5px solid #d5d2ca",
                background: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#1a1916",
              }}
            >
              <ArrowLeft size={15} />
            </button>
            <button
              onClick={next}
              className="tnav-btn"
              aria-label="Next"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "none",
                background: "#1a1916",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#f5f4f0",
              }}
            >
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

function TestimonialCard({ t }) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 20,
        padding: "clamp(1.5rem, 4vw, 2.5rem)",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: "clamp(1.5rem, 4vw, 3rem)",
        alignItems: "stretch",
        minHeight: 260,
      }}
    >
      {/* Left: quote + author */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Quote icon */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "#f5f4f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Quote size={16} color="#a0998c" />
        </div>

        {/* Quote text */}
        <blockquote
          style={{
            margin: 0,
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            fontWeight: 400,
            color: "#1a1916",
            lineHeight: 1.65,
            letterSpacing: "-0.01em",
            flex: 1,
          }}
        >
          "{t.quote}"
        </blockquote>

        {/* Author */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar name={t.name} />
          <div>
            <p
              style={{
                margin: 0,
                fontWeight: 600,
                fontSize: 14,
                color: "#1a1916",
                letterSpacing: "-0.01em",
              }}
            >
              {t.name}
            </p>
            <p style={{ margin: 0, fontSize: 12, color: "#a0998c", marginTop: 1 }}>
              {t.title} · {t.company}{" "}
              <span style={{ fontSize: 13 }}>{t.flag}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Right: metric card — hidden on mobile */}
      <div
        className="hidden sm:flex"
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1916",
          borderRadius: 14,
          padding: "1.5rem 2rem",
          minWidth: 130,
          gap: 6,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: "clamp(2rem, 5vw, 2.8rem)",
            fontWeight: 700,
            color: "#f5f4f0",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          {t.metric}
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: "#a0998c",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          {t.metricLabel}
        </span>
      </div>
    </div>
  );
}