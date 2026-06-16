"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";


const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const ROUTES = [
  { from: "Tuticorin", to: "China", startLat: 8.76, startLng: 78.13, endLat: 31.23, endLng: 121.28, animMs: 1900 },
  { from: "Tuticorin", to: "UAE", startLat: 8.76, startLng: 78.13, endLat: 25.20, endLng: 55.27, animMs: 1600 },
  { from: "Tuticorin", to: "United Kingdom", startLat: 8.76, startLng: 78.13, endLat: 51.51, endLng: -0.13, animMs: 2800 },
  { from: "Tuticorin", to: "Germany", startLat: 8.76, startLng: 78.13, endLat: 53.55, endLng: 9.97, animMs: 2700 },
  { from: "Tuticorin", to: "Singapore", startLat: 8.76, startLng: 78.13, endLat: 1.36, endLng: 103.82, animMs: 1500 },
  { from: "Tuticorin", to: "Japan", startLat: 8.76, startLng: 78.13, endLat: 35.68, endLng: 139.60, animMs: 2100 },
  { from: "Tuticorin", to: "USA", startLat: 8.76, startLng: 78.13, endLat: 40.71, endLng: -74.00, animMs: 3200 },
  { from: "Tuticorin", to: "Australia", startLat: 8.76, startLng: 78.13, endLat: -33.87, endLng: 151.15, animMs: 2200 },
  { from: "Tuticorin", to: "Saudi Arabia", startLat: 8.76, startLng: 78.13, endLat: 21.49, endLng: 39.19, animMs: 1700 },
  { from: "Tuticorin", to: "Malaysia", startLat: 8.76, startLng: 78.13, endLat: 3.14, endLng: 101.70, animMs: 1600 },
  { from: "Tuticorin", to: "Netherlands", startLat: 8.76, startLng: 78.13, endLat: 51.91, endLng: 4.48, animMs: 2900 },
  { from: "Tuticorin", to: "South Africa", startLat: 8.76, startLng: 78.13, endLat: -29.87, endLng: 30.92, animMs: 2500 },
];

// Arc data: one base arc + one glow arc per route (all always active)
const ARCS_DATA = [
  ...ROUTES.map(r => ({ ...r, _glow: false })),
  ...ROUTES.map(r => ({ ...r, _glow: true })),
];

const LABEL_POINTS = [
  { lat: 9.92, lng: 78.12, label: "Tuticorin", isHub: true },
  { lat: 31.23, lng: 121.28, label: "China" },
  { lat: 25.20, lng: 55.27, label: "UAE" },
  { lat: 51.51, lng: -0.13, label: "United Kingdom" },
  { lat: 53.55, lng: 9.97, label: "Germany" },
  { lat: 1.36, lng: 103.82, label: "Singapore" },
  { lat: 35.68, lng: 139.60, label: "Japan" },
  { lat: 40.71, lng: -74.00, label: "USA" },
  { lat: -33.87, lng: 151.15, label: "Australia" },
  { lat: 21.49, lng: 39.19, label: "Saudi Arabia" },
  { lat: 3.14, lng: 101.70, label: "Malaysia" },
  { lat: 51.91, lng: 4.48, label: "Netherlands" },
  { lat: -29.87, lng: 30.92, label: "South Africa" },
];

const STATS = [
  { num: "50K+", label: "Shipments" },
  { num: "30+", label: "Countries" },
  { num: "12", label: "Sea Routes" },
  { num: "25+", label: "Years" },
];

const FIXED_ALT = 2.2;

function makeLabelEl(d) {
  const dotSize = d.isHub ? 9 : 7;
  const wrap = document.createElement("div");
  wrap.style.cssText = "pointer-events:none; position:relative; width:0; height:0; transition:opacity 0.2s ease;";

  const dot = document.createElement("div");
  dot.style.cssText = `
    position: absolute;
    width: ${dotSize}px;
    height: ${dotSize}px;
    border-radius: 50%;
    background: ${d.isHub ? "#1a1916" : "rgba(26,25,22,0.65)"};
    border: ${d.isHub ? "2px solid rgba(255,255,255,0.85)" : "1.5px solid rgba(255,255,255,0.6)"};
    box-shadow: 0 0 ${d.isHub ? 10 : 6}px rgba(0,0,0,0.35);
    transform: translate(-50%, -50%);
  `;

  const pill = document.createElement("div");
  pill.style.cssText = `
    position: absolute;
    bottom: ${dotSize / 2 + 4}px;
    left: 0;
    transform: translateX(-50%);
    font-family: system-ui, -apple-system, sans-serif;
    font-size: ${d.isHub ? 9 : 8}px;
    font-weight: ${d.isHub ? 700 : 600};
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${d.isHub ? "#1a1916" : "rgba(26,25,22,0.8)"};
    background: rgba(245,244,240,0.97);
    border: 1px solid rgba(0,0,0,${d.isHub ? 0.14 : 0.08});
    border-radius: 6px;
    padding: 2px 7px;
    white-space: nowrap;
    box-shadow: 0 1px 6px rgba(0,0,0,0.12);
  `;
  pill.textContent = d.label;

  wrap.appendChild(dot);
  wrap.appendChild(pill);
  return wrap;
}

export default function CustomerGlobeSection() {
  const sectionRef = useRef(null);
  const globeRef = useRef(null);
  const cleanupRef = useRef(null);
  const globeContainerRef = useRef(null);

  const [sectionIn, setSectionIn] = useState(false);
  const [globeVisible, setGlobeVisible] = useState(false);
  const [globeSize, setGlobeSize] = useState({ width: 0, height: 0 });
  const router = useRouter();


  // ── Section entrance: observe + orchestrate animations ──────────
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionIn(true);
        } else {
          // Reset for re-entry
          setSectionIn(false);
          setGlobeVisible(false);
          const gl = globeRef.current;
          if (gl) {
            try {
              gl.controls().autoRotate = false;
              gl.pointOfView({ lat: 0, lng: -100, altitude: FIXED_ALT }, 0);
            } catch (_) { }
          }
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ResizeObserver for responsive Globe size
  useEffect(() => {
    if (!globeContainerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const { width, height } = entries[0].contentRect;
      setGlobeSize({ width, height });
    });
    obs.observe(globeContainerRef.current);
    return () => obs.disconnect();
  }, []);

  // ── Trigger animations when section enters ───────────────────────
  useEffect(() => {
    if (!sectionIn) return;
    const timers = [];
    // Globe fade-in
    timers.push(setTimeout(() => setGlobeVisible(true), 350));
    // Globe spin: Pacific Ocean → Tuticorin
    timers.push(setTimeout(() => {
      const gl = globeRef.current;
      if (!gl) return;
      try {
        gl.controls().autoRotate = false;
        gl.pointOfView({ lat: 8.76, lng: 78.13, altitude: FIXED_ALT }, 2200);
        setTimeout(() => {
          try { const c = globeRef.current?.controls(); if (c) c.autoRotate = true; } catch (_) { }
        }, 2300);
      } catch (_) { }
    }, 400));
    return () => timers.forEach(clearTimeout);
  }, [sectionIn]);

  // ── Globe ready ──────────────────────────────────────────────────
  const handleGlobeReady = useCallback(() => {
    const gl = globeRef.current;
    if (!gl) return;
    const controls = gl.controls();
    controls.autoRotate = false; // enabled after spin-in animation
    controls.autoRotateSpeed = 0.35;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = true;
    const lockedDist = 100 * (1 + FIXED_ALT);
    controls.minDistance = lockedDist;
    controls.maxDistance = lockedDist;
    // Start at Pacific Ocean — will spin to Tuticorin on section entry
    gl.pointOfView({ lat: 0, lng: -100, altitude: FIXED_ALT }, 0);
    try { gl.renderer().setPixelRatio(Math.min(window.devicePixelRatio, 1.2)); } catch (_) { }

    let resumeTimer;
    const onDragStart = () => { controls.autoRotate = false; clearTimeout(resumeTimer); };
    const onDragEnd = () => { resumeTimer = setTimeout(() => { controls.autoRotate = true; }, 2500); };
    controls.addEventListener("start", onDragStart);
    controls.addEventListener("end", onDragEnd);

    cleanupRef.current = () => {
      clearTimeout(resumeTimer);
      controls.removeEventListener("start", onDragStart);
      controls.removeEventListener("end", onDragEnd);
    };
  }, []);

  useEffect(() => () => { cleanupRef.current?.(); }, []);

  // ── Arc styling (all routes always amber) ───────────────────────
  const arcColor = useCallback((d) =>
    d._glow
      ? ["rgba(210,165,45,0)", "rgba(210,165,45,0.20)", "rgba(210,165,45,0)"]
      : ["rgba(210,165,45,0)", "rgba(210,165,45,0.92)", "rgba(210,165,45,0)"],
    []);
  const arcStroke = useCallback((d) => (d._glow ? 7 : 1.9), []);

  const htmlElement = useCallback((d) => makeLabelEl(d), []);
  const htmlVisibility = useCallback((el, isVis) => { el.style.opacity = isVis ? "1" : "0"; }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#f5f4f0] font-sans flex flex-col lg:flex-row lg:h-screen p-5 sm:p-6 gap-5 lg:overflow-hidden">

      {/* ── LEFT: STATIC CONTENT ── */}
      <div
        className="flex flex-col lg:w-[40%] shrink-0 justify-start lg:pr-10 py-8 lg:pt-12 lg:pb-0"
        style={{
          opacity: sectionIn ? 1 : 0,
          transform: sectionIn ? "translateX(0)" : "translateX(-100px)",
          transition: sectionIn
            ? "opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.05s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.05s"
            : "none",
        }}
      >

        <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.26em] uppercase text-neutral-400 mb-3">
          — Global Network
        </p>

        <h2
          className="font-black tracking-[-0.035em] leading-[1.05] mb-4"
          style={{ fontSize: "clamp(2rem, 4.5vw, 3.8rem)" }}
        >
          <span className="block text-neutral-900">30 countries.</span>
          <span className="block" style={{ color: "rgba(0,0,0,0.22)" }}>One home port.</span>
        </h2>

        <p className="text-sm sm:text-[15px] text-neutral-500 leading-[1.85] max-w-[400px] mb-6">
          From Tuticorin — India&apos;s southernmost major port — Canaan has built
          a freight network spanning four continents. Every route originates
          here, tracked end-to-end with precision.
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          {STATS.map(({ num, label }) => (
            <div key={label}>
              <div
                className="font-black tracking-[-0.04em] text-neutral-900 leading-none"
                style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
              >
                {num}
              </div>
              <div className="text-[10px] font-medium tracking-[0.22em] uppercase text-neutral-400 mt-1.5">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Founder portrait + Meet the team button */}
        <div
          onClick={() => router.push("/about")}
          style={{
            marginTop: 28,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "12px 14px",
            borderRadius: 14,
            
            
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(26,25,22,0.07)";
            e.currentTarget.style.borderColor = "rgba(0,0,0,0.13)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(26,25,22,0.04)";
            e.currentTarget.style.borderColor = "rgba(0,0,0,0.07)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {/* Portrait */}
          <div style={{ width: 120, height: 120, flexShrink: 0, position: "relative", borderRadius: 9999, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "2px solid rgba(210,165,45,0.10)" }}>
            <Image src="/arun2.png" alt="Arun Samuel Alfred" fill sizes="(max-width: 768px) 100vw, 300px" className="object-cover" />
          </div>

          {/* Visually hidden name for accessibility */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>Arun Samuel Alfred — Founder & CEO</span>
          </div>

          {/* Arrow / button text */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#555555",
              flexShrink: 0,
              transition: "color 0.2s ease",
            }}
          >
            Meet the team
            <ArrowRight size={13} />
          </div>
        </div>
      </div>
      <div
        className="relative flex-1 rounded-2xl overflow-hidden border border-black/[0.08]"
        style={{
          minHeight: 440,
          touchAction: "none",
          background: "linear-gradient(150deg, #f0f4ff 0%, #ffffff 45%, #f9f8f5 100%)",
        }}
      >
        {/* Top-left chip */}
        <div className="absolute top-0 left-0 bg-white/90 backdrop-blur-sm px-4 py-3 sm:px-5 sm:py-4 rounded-br-2xl z-10">
          <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-neutral-400">
            Live Routes
          </span>
        </div>

        {/* Top-right chip */}
        <div className="absolute top-0 right-0 bg-white/90 backdrop-blur-sm px-4 py-3 sm:px-5 sm:py-4 rounded-bl-2xl z-10 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-[11px] font-medium text-neutral-900 tracking-tight">
            {ROUTES.length} active routes
          </span>
        </div>

        {/* Globe — hidden via opacity until init animation finishes */}
        <div ref={globeContainerRef} style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: globeVisible ? 1 : 0, transition: "opacity 0.45s ease",
        }}>
          {globeSize.width > 0 && (
            <Globe
              ref={(el) => { globeRef.current = el; }}
              onGlobeReady={handleGlobeReady}
              animateIn={false}
              waitForGlobeReady={false}
              width={globeSize.width}
              height={globeSize.height}
              globeImageUrl="//unpkg.com/three-globe@2.33.0/example/img/earth-blue-marble.jpg"
              bumpImageUrl="//unpkg.com/three-globe@2.33.0/example/img/earth-topology.png"
              backgroundImageUrl=""
              backgroundColor="rgba(0,0,0,0)"
              atmosphereColor="rgb(120, 185, 255)"
              atmosphereAltitude={0.22}
              arcsData={ARCS_DATA}
              arcStartLat="startLat"
              arcStartLng="startLng"
              arcEndLat="endLat"
              arcEndLng="endLng"
              arcColor={arcColor}
              arcDashLength={0.07}
              arcDashGap={0.015}
              arcDashAnimateTime={(d) => d.animMs}
              arcStroke={arcStroke}
              arcAltitudeAutoScale={0.45}
              htmlElementsData={LABEL_POINTS}
              htmlLat={(d) => d.lat}
              htmlLng={(d) => d.lng}
              htmlAltitude={(d) => d.isHub ? 0.01 : 0.005}
              htmlElement={htmlElement}
              htmlTransitionDuration={0}
              htmlElementVisibilityModifier={htmlVisibility}
            />
          )}
        </div>

        {/* Bottom-left chip */}
        <div className="absolute bottom-0 left-0 bg-white/90 backdrop-blur-sm px-4 py-3 sm:px-5 sm:py-4 rounded-tr-2xl z-10">
          <p className="text-[9px] font-medium tracking-[0.1em] uppercase text-neutral-400 mb-0.5">Hub</p>
          <p className="text-xs font-bold text-neutral-900 tracking-tight">Tuticorin, India</p>
        </div>

        {/* Bottom-right chip */}
        <div className="absolute bottom-0 right-0 bg-white/90 backdrop-blur-sm px-4 py-3 sm:px-5 sm:py-4 rounded-tl-2xl z-10">
          <p className="text-[9px] font-medium tracking-[0.1em] uppercase text-neutral-400 mb-0.5">Coverage</p>
          <p className="text-xs font-bold text-neutral-900 tracking-tight">4 Continents</p>
        </div>
      </div>
    </section>
  );
}
