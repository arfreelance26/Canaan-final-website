"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import useFadeIn from "../hooks/useFadeIn";

const CLIENTS = [
  { name: "Amazon",      domain: "amazon.com" },
  { name: "DHL",         domain: "dhl.com" },
  { name: "Maersk",      domain: "maersk.com" },
  { name: "FedEx",       domain: "fedex.com" },
  { name: "Samsung",     domain: "samsung.com" },
  { name: "Siemens",     domain: "siemens.com" },
  { name: "Nestle",      domain: "nestle.com" },
  { name: "Unilever",    domain: "unilever.com" },
  { name: "IKEA",        domain: "ikea.com" },
  { name: "Adidas",      domain: "adidas.com" },
  { name: "Sony",        domain: "sony.com" },
  { name: "Philips",     domain: "philips.com" },
  { name: "Caterpillar", domain: "cat.com" },
  { name: "3M",          domain: "3m.com" },
  { name: "Honeywell",   domain: "honeywell.com" },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Arjun Mehta",
    title: "Head of Supply Chain",
    company: "Nexora Industries",
    flag: "🇮🇳",
    quote: "Canaan Global handled our first cross-border shipment to Germany flawlessly. Customs was cleared in record time, and we had real-time visibility throughout. They've become our only logistics partner.",
    metric: "98%",
    metricLabel: "On-time rate",
  },
  {
    id: 2,
    name: "Sarah O'Brien",
    title: "Director of Operations",
    company: "Atlantic Trade Co.",
    flag: "🇮🇪",
    quote: "What sets Canaan apart is their people. Our account manager knew every detail of our shipment without us having to chase. That kind of proactive service is rare in freight forwarding.",
    metric: "3×",
    metricLabel: "Faster clearance",
  },
  {
    id: 3,
    name: "Lena Hoffmann",
    title: "Procurement Manager",
    company: "Bauwerk GmbH",
    flag: "🇩🇪",
    quote: "We ship sensitive industrial equipment across 12 countries every month. Canaan's end-to-end documentation management has eliminated delays entirely. I can't imagine going back to our old provider.",
    metric: "12",
    metricLabel: "Countries covered",
  },
  {
    id: 4,
    name: "Marcus Williams",
    title: "CEO",
    company: "Horizon Retail Group",
    flag: "🇺🇸",
    quote: "We scaled from 200 to over 2,000 shipments per quarter with Canaan. Their infrastructure just grew with us — no hiccups, no delays, no excuses. Exactly what a growing business needs.",
    metric: "10×",
    metricLabel: "Volume scaled",
  },
  {
    id: 5,
    name: "Priya Nair",
    title: "Logistics Coordinator",
    company: "SunBridge Exports",
    flag: "🇦🇪",
    quote: "The team handled an urgent perishable shipment to Tokyo over a weekend with zero fuss. Temperature-controlled, on time, and perfectly documented. That experience made us a lifelong client.",
    metric: "72h",
    metricLabel: "Emergency delivery",
  },
];

const AUTOPLAY_INTERVAL = 4500;

function Avatar({ name }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  const colors = [
    ["#e8e3d4", "#6b6450"],
    ["#d4e3e0", "#4a6b64"],
    ["#e3d4e0", "#6b4a68"],
    ["#d4dde3", "#4a5e6b"],
    ["#e3ddd4", "#6b5e4a"],
  ];
  const [bg, fg] = colors[name.charCodeAt(0) % colors.length];
  return (
    <div style={{ width: 34, height: 34, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 11, color: fg, letterSpacing: "0.04em", flexShrink: 0 }}>
      {initials}
    </div>
  );
}

export default function ClientsSection() {
  const sectionRef = useRef(null);
  const isVisible = useFadeIn(sectionRef, 0.05);

  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(null);
  const [direction, setDirection] = useState("next");
  const [animating, setAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const total = TESTIMONIALS.length;

  const goTo = useCallback((index, dir = "next") => {
    if (animating) return;
    setPrev(active);
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => { setActive(index); setPrev(null); setAnimating(false); }, 350);
  }, [active, animating]);

  const nextT = useCallback(() => goTo((active + 1) % total, "next"), [active, goTo, total]);
  const prevT = useCallback(() => goTo((active - 1 + total) % total, "prev"), [active, goTo, total]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(nextT, AUTOPLAY_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [nextT, paused]);

  const t = TESTIMONIALS[active];
  const p = prev !== null ? TESTIMONIALS[prev] : null;

  return (
    <>
      <style>{`
        @keyframes slideInNext { from { opacity:0; transform:translateX(24px); } to { opacity:1; transform:translateX(0); } }
        @keyframes slideInPrev { from { opacity:0; transform:translateX(-24px); } to { opacity:1; transform:translateX(0); } }
        @keyframes slideOutNext { from { opacity:1; transform:translateX(0); } to { opacity:0; transform:translateX(-24px); } }
        @keyframes slideOutPrev { from { opacity:1; transform:translateX(0); } to { opacity:0; transform:translateX(24px); } }
        .tce-next { animation: slideInNext 0.35s cubic-bezier(0.22,1,0.36,1) forwards; }
        .tce-prev { animation: slideInPrev 0.35s cubic-bezier(0.22,1,0.36,1) forwards; }
        .tcx-next { animation: slideOutNext 0.35s cubic-bezier(0.22,1,0.36,1) forwards; }
        .tcx-prev { animation: slideOutPrev 0.35s cubic-bezier(0.22,1,0.36,1) forwards; }
        .tpip { transition: width 0.3s cubic-bezier(0.22,1,0.36,1), background 0.3s; }
        .tnav2 { transition: opacity 0.15s, transform 0.12s; }
        .tnav2:hover { opacity: 0.8; }
        .tnav2:active { transform: scale(0.93); }
      `}</style>
      <section
        ref={sectionRef}
        id="clients"
        className="relative bg-[#f5f4f0] font-sans flex flex-col h-screen p-4 sm:p-5 gap-3 overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >

      {/* ── HEADER ── */}
      <div className={`relative shrink-0 rounded-2xl overflow-hidden bg-white px-5 py-5 sm:px-7 sm:py-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 transition-all duration-700 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}>

        {/* Top-left label chip */}
        <div className="absolute top-0 left-0 bg-[#f5f4f0] px-5 py-3 rounded-br-2xl">
          <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-neutral-400">
            Trusted by
          </span>
        </div>

        <div className="mt-6 sm:mt-5">
          <h2 className="text-2xl sm:text-[2.2rem] font-bold tracking-[-0.03em] leading-[1.1] text-neutral-900">
            Brands that ship<br />
            <span className="text-neutral-400 font-normal italic">with confidence.</span>
          </h2>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed max-w-xs sm:text-right">
          From global enterprises to regional leaders — they trust Canaan Global to move what matters.
        </p>
      </div>

      {/* ── LOGO GRID ── */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 grid-rows-3 flex-1 min-h-0 gap-3">
        {CLIENTS.map(({ name, domain }, i) => (
          <div
            key={name}
            style={{ 
              transitionDelay: isVisible ? `${(i % 5) * 60}ms` : "0ms" 
            }}
            className={`group relative bg-white rounded-2xl flex items-center justify-center p-4 overflow-hidden cursor-pointer bento-card transition-all duration-500 ease-out transform ${
              isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-[0.97]"
            }`}
          >
            {/* Corner accent — top-right on even, top-left on odd */}
            <div
              className={`absolute top-0 ${i % 2 === 0 ? "right-0 rounded-bl-xl" : "left-0 rounded-br-xl"} bg-[#f5f4f0] w-3 h-3 transition-colors duration-300 group-hover:bg-neutral-900`}
            />

            <img
              src={`https://img.logo.dev/${domain}?token=pk_TCYqoFGsRJK7RG3c9IqeQQ&size=128`}
              alt={`${name} logo`}
              loading="lazy"
              decoding="async"
              className="max-h-8 sm:max-h-10 w-auto object-contain opacity-60 group-hover:opacity-0 transition-opacity duration-300 filter grayscale group-hover:scale-95 duration-500"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />

            {/* Fallback text if logo fails */}
            <span
              className="hidden items-center justify-center text-xs font-semibold tracking-widest uppercase text-neutral-300 group-hover:text-white transition-colors duration-300"
            >
              {name}
            </span>

            {/* Hover state — white logo + name */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:scale-105 duration-500">
              <img
                src={`https://img.logo.dev/${domain}?token=pk_TCYqoFGsRJK7RG3c9IqeQQ&size=128`}
                alt={`${name} logo`}
                loading="lazy"
                decoding="async"
                className="max-h-7 sm:max-h-9 w-auto object-contain brightness-0 invert"
              />
              <span className="text-[9px] font-medium tracking-[0.15em] uppercase text-neutral-400">
                {name}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── TESTIMONIAL STRIP ── */}
      <div
        className={`shrink-0 rounded-2xl overflow-hidden bg-white transition-all duration-700 ease-out transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ transitionDelay: isVisible ? "300ms" : "0ms" }}
      >
        {/* Animated card area */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          {animating && p && (
            <div
              className={direction === "next" ? "tcx-next" : "tcx-prev"}
              style={{ position: "absolute", inset: 0, zIndex: 1 }}
            >
              <TStrip t={p} />
            </div>
          )}
          <div
            className={animating ? (direction === "next" ? "tce-next" : "tce-prev") : ""}
            style={{ position: "relative", zIndex: 2 }}
          >
            <TStrip t={t} />
          </div>
        </div>

        {/* Pips + nav */}
        <div className="flex items-center justify-between px-4 sm:px-5 pb-4 pt-1">
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > active ? "next" : "prev")}
                aria-label={`Testimonial ${i + 1}`}
                className="tpip"
                style={{
                  height: 3,
                  width: i === active ? 20 : 7,
                  borderRadius: 9999,
                  background: i === active ? "#1a1916" : "#c8c5bc",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={prevT}
              className="tnav2"
              aria-label="Previous testimonial"
              style={{ width: 34, height: 34, borderRadius: "50%", border: "1.5px solid #d5d2ca", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <ArrowLeft size={13} color="#1a1916" />
            </button>
            <button
              onClick={nextT}
              className="tnav2"
              aria-label="Next testimonial"
              style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: "#1a1916", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <ArrowRight size={13} color="#f5f4f0" />
            </button>
          </div>
        </div>
      </div>

      </section>
    </>
  );
}

function TStrip({ t }) {
  return (
    <div className="flex items-start gap-4 px-4 sm:px-5 pt-4 pb-2">
      {/* Left: quote icon + text + author */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "#f5f4f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Quote size={12} color="#a0998c" />
        </div>
        <p style={{ margin: 0, fontSize: "clamp(0.78rem, 1.5vw, 0.875rem)", color: "#525252", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          &ldquo;{t.quote}&rdquo;
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 2 }}>
          <Avatar name={t.name} />
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1a1916", letterSpacing: "-0.01em", lineHeight: 1.3 }}>{t.name}</p>
            <p style={{ margin: 0, fontSize: 11, color: "#a0998c", lineHeight: 1.3 }}>{t.title} · {t.company} {t.flag}</p>
          </div>
        </div>
      </div>
      {/* Right: metric stat */}
      <div style={{ background: "#1a1916", borderRadius: 14, padding: "10px 14px", textAlign: "center", flexShrink: 0, minWidth: 72 }}>
        <p style={{ margin: 0, fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>{t.metric}</p>
        <p style={{ margin: "4px 0 0", fontSize: 8, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", lineHeight: 1.2 }}>{t.metricLabel}</p>
      </div>
    </div>
  );
}