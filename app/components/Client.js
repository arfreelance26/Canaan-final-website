"use client";

import { useState, useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const CLIENTS = [
  { name: "Maersk",       logo: "/logos/maersh.png" },
  { name: "Hapag-Lloyd",  logo: "/logos/lloyd.png" },
  { name: "MSC",          logo: "/logos/msc.png" },
  { name: "Evergreen",    logo: "/logos/evergreen.svg" },
  { name: "OOCL",         logo: "/logos/oocl.png" },
  { name: "ONE",          logo: "/logos/one.png" },
  { name: "COSCO",        logo: "/logos/cosco.png" },
  { name: "CMA CGM",      logo: "/logos/cma.png" },
  { name: "ZIM",          logo: "/logos/zim.png" },
  { name: "PIL",          logo: "/logos/pil.png" },
  { name: "Hyundai MM",   logo: "/logos/hmm.png" },
  { name: "Yang Ming",    logo: "/logos/ym.png" },
  { name: "Hamburg Süd",  logo: "/logos/ham.png" },
  { name: "FESCO",        logo: "/logos/fesco.png" },
  { name: "Bertschi",     logo: "/logos/bert.png" },
  { name: "SCI",          logo: "/logos/sci.png" },
];

function useFadeIn(ref, threshold = 0.05) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

function LogoCard({ name, logo, index, isVisible }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      data-aos="fade-up"
      data-aos-delay={String(150 + index * 60)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0) scale(1)" : "translateY(14px) scale(0.97)",
        background: "#fff",
        transitionProperty: "opacity, transform, background",
        transitionDuration: "0.55s, 0.55s, 0.3s",
        transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1), cubic-bezier(0.16,1,0.3,1), ease",
        transitionDelay: isVisible ? `${(index % 5) * 55}ms` : "0ms",
        borderRadius: 18,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        minHeight: "clamp(100px, 12vh, 130px)",
        padding: "1.25rem 1rem",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Corner chip */}


      {imgError ? (
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: hovered ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.3)",
          textAlign: "center",
          transition: "color 0.3s ease",
        }}>
          {name}
        </span>
      ) : (
        <img
          src={logo}
          alt={`${name} logo`}
          onError={() => setImgError(true)}
          style={{
            maxHeight: 50,
            maxWidth: "70%",
            width: "auto",
            objectFit: "contain",
            filter: hovered ? "none" : "grayscale(100%) contrast(0.6) brightness(1.1)",
            opacity: hovered ? 1 : 0.65,
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "filter 0.35s ease, opacity 0.35s ease, transform 0.35s ease",
          }}
        />
      )}

      {/* Name label on hover */}
      <span style={{
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.45)",
        opacity: hovered ? 1 : 0,
        transform: hovered ? "translateY(0)" : "translateY(4px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}>
        {name}
      </span>
    </div>
  );
}

export default function ClientsSection() {
  const sectionRef = useRef(null);
  const isVisible = useFadeIn(sectionRef, 0.05);
  useEffect(() => {
      AOS.init({
        duration: 600,
        easing: "ease-out-cubic",
        once: true,
        offset: 0,
      });
    }, []);

  return (
    <section
      ref={sectionRef}
      id="clients"
      className="relative bg-[#f5f4f0] font-sans flex flex-col min-h-screen p-4 sm:p-5 overflow-hidden"
    >
      {/* ── HEADER ── */}
      <div className={`relative rounded-2xl overflow-hidden bg-white px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 transition-all duration-700 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}>
        <div className="absolute top-0 left-0 bg-[#f5f4f0] px-5 py-3 rounded-br-2xl">
          <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-[#85660c]">
            Trusted by
          </span>
        </div>

        <div className="mt-8 sm:mt-6">
          <h2 className="text-3xl sm:text-[2.8rem] font-bold tracking-[-0.03em] leading-[1.1] text-[#0a0908]">
            Industry leaders<br />
            <span className="text-[#85660c] font-normal italic">ship with confidence.</span>
          </h2>
        </div>

        <p className="text-sm text-neutral-400 leading-relaxed max-w-xs sm:text-right">
          The world's top shipping lines trust Canaan Global to move what matters — on time, every time.
        </p>
      </div>

      {/* ── LOGO GRID ── */}
      <div className="flex-1 flex flex-col justify-center py-4 sm:py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
          {CLIENTS.map(({ name, logo }, i) => (
            <LogoCard
              key={name}
              name={name}
              logo={logo}
              index={i}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>

      {/* ── BOTTOM STRIP ── */}
      <div className={`rounded-2xl bg-white px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 transition-all duration-700 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-sm font-medium text-[#0a0908]">
            16+ active global carrier partnerships
          </span>
        </div>
        <p className="text-xs text-neutral-400 tracking-tight text-center sm:text-right">
          Serving clients across 30+ countries · Est. 2009
        </p>
      </div>
    </section>
  );
}