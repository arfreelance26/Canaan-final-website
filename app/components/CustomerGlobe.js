"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, Globe2 } from "lucide-react";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const ROUTES = [
  { from: "Tuticorin", to: "China", startLat: 8.76, startLng: 78.13, endLat: 35.86, endLng: 104.19, animMs: 1900 },
  { from: "Tuticorin", to: "UAE", startLat: 8.76, startLng: 78.13, endLat: 25.20, endLng: 55.27, animMs: 1600 },
  { from: "Tuticorin", to: "United Kingdom", startLat: 8.76, startLng: 78.13, endLat: 55.37, endLng: -3.43, animMs: 2800 },
  { from: "Tuticorin", to: "Germany", startLat: 8.76, startLng: 78.13, endLat: 51.16, endLng: 10.45, animMs: 2700 },
  { from: "Tuticorin", to: "Singapore", startLat: 8.76, startLng: 78.13, endLat: 1.35, endLng: 103.81, animMs: 1500 },
  { from: "Tuticorin", to: "Japan", startLat: 8.76, startLng: 78.13, endLat: 36.20, endLng: 138.25, animMs: 2100 },
  { from: "Tuticorin", to: "USA", startLat: 8.76, startLng: 78.13, endLat: 37.09, endLng: -95.71, animMs: 3200 },
  { from: "Tuticorin", to: "Australia", startLat: 8.76, startLng: 78.13, endLat: -25.27, endLng: 133.77, animMs: 2200 },
  { from: "Tuticorin", to: "Saudi Arabia", startLat: 8.76, startLng: 78.13, endLat: 23.88, endLng: 45.07, animMs: 1700 },
  { from: "Tuticorin", to: "Malaysia", startLat: 8.76, startLng: 78.13, endLat: 4.21, endLng: 101.97, animMs: 1600 },
  { from: "Tuticorin", to: "Netherlands", startLat: 8.76, startLng: 78.13, endLat: 52.13, endLng: 5.29, animMs: 2900 },
  { from: "Tuticorin", to: "South Africa", startLat: 8.76, startLng: 78.13, endLat: -30.55, endLng: 22.93, animMs: 2500 },
];

const STATS = [
  { num: "30+", label: "Countries" },
  { num: "12", label: "Active routes" },
  { num: "50K+", label: "Shipments" },
  { num: "2009", label: "Est." },
];

const LABEL_POINTS = [
  { lat: 8.76, lng: 78.13, label: "Tuticorin", isHub: true },
  { lat: 35.86, lng: 104.19, label: "China" },
  { lat: 25.20, lng: 55.27, label: "UAE" },
  { lat: 55.37, lng: -3.43, label: "United Kingdom" },
  { lat: 51.16, lng: 10.45, label: "Germany" },
  { lat: 1.35, lng: 103.81, label: "Singapore" },
  { lat: 36.20, lng: 138.25, label: "Japan" },
  { lat: 37.09, lng: -95.71, label: "USA" },
  { lat: -25.27, lng: 133.77, label: "Australia" },
  { lat: 23.88, lng: 45.07, label: "Saudi Arabia" },
  { lat: 4.21, lng: 101.97, label: "Malaysia" },
  { lat: 52.13, lng: 5.29, label: "Netherlands" },
  { lat: -30.55, lng: 22.93, label: "South Africa" },
];

function makeLabelEl(d) {
  const wrap = document.createElement("div");
  wrap.dataset.lat = d.lat;
  wrap.dataset.lng = d.lng;
  wrap.style.cssText = "pointer-events:none; display:flex; flex-direction:column; align-items:center; gap:3px;";

  const dot = document.createElement("div");
  dot.style.cssText = `
    width: ${d.isHub ? 9 : 7}px;
    height: ${d.isHub ? 9 : 7}px;
    border-radius: 50%;
    background: ${d.isHub ? "#1a1916" : "rgba(26,25,22,0.65)"};
    border: ${d.isHub ? "2px solid rgba(255,255,255,0.85)" : "1.5px solid rgba(255,255,255,0.6)"};
    box-shadow: 0 0 ${d.isHub ? 10 : 6}px rgba(0,0,0,0.35);
    flex-shrink: 0;
  `;

  const pill = document.createElement("div");
  pill.style.cssText = `
    font-family: system-ui, -apple-system, sans-serif;
    font-size: ${d.isHub ? 9 : 8}px;
    font-weight: ${d.isHub ? 700 : 600};
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${d.isHub ? "#1a1916" : "rgba(26,25,22,0.8)"};
    background: rgba(245,244,240,0.92);
    border: 1px solid rgba(0,0,0,${d.isHub ? 0.14 : 0.08});
    border-radius: 6px;
    padding: 2px 7px;
    white-space: nowrap;
    backdrop-filter: blur(8px);
    box-shadow: 0 1px 6px rgba(0,0,0,0.12);
  `;
  pill.textContent = d.label;

  wrap.appendChild(dot);
  wrap.appendChild(pill);
  return wrap;
}
export default function CustomerGlobeSection() {
  const globeRef = useRef(null);
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const [dims, setDims] = useState({ w: 600, h: 500 });
  const [globeReady, setGlobeReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hoveredRoute, setHoveredRoute] = useState(null);
  const [selectedDest,  setSelectedDest]  = useState(null);

  // ── Resize ────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() =>
      setDims({ w: el.offsetWidth, h: el.offsetHeight })
    );
    ro.observe(el);
    setDims({ w: el.offsetWidth, h: el.offsetHeight });
    return () => ro.disconnect();
  }, []);

  // ── Entrance observer ─────────────────────────────────────────
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── Globe setup ───────────────────────────────────────────────
  useEffect(() => {
    if (!globeReady || !globeRef.current) return;
    const gl = globeRef.current;
    const controls = gl.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.enableZoom = false;
    gl.pointOfView({ lat: 8.76, lng: 78.13, altitude: 2.4 }, 1200);

    try {
      gl.renderer().setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    } catch (_) { }

    let timer;
    const pause = () => { controls.autoRotate = false; clearTimeout(timer); };
    const resume = () => { timer = setTimeout(() => { controls.autoRotate = true; }, 3000); };
    controls.addEventListener("start", pause);
    controls.addEventListener("end", resume);
    return () => {
      clearTimeout(timer);
      controls.removeEventListener("start", pause);
      controls.removeEventListener("end", resume);
    };
  }, [globeReady]);

  const flyTo = (lat, lng) => {
  if (!globeRef.current) return;
  const gl = globeRef.current;
  const controls = gl.controls();

  // Pause auto-rotate while flying
  controls.autoRotate = false;

  gl.pointOfView(
    { lat, lng, altitude: 2.0 },
    1200 // animation duration ms
  );

  // Resume auto-rotate after fly completes
  setTimeout(() => {
    controls.autoRotate = true;
  }, 1800);
};

  // ── Arc color ─────────────────────────────────────────────────
  const arcColor = (d) => {
  const isHov = hoveredRoute && d.from === hoveredRoute.from && d.to === hoveredRoute.to;
  return isHov
    ? ["rgba(0,0,0,0)", "rgba(0,0,0,0.95)", "rgba(0,0,0,0)"]
    : ["rgba(0,0,0,0)", "rgba(0,0,0,0.6)", "rgba(0,0,0,0)"];   // was 0.35 → 0.6
};

  const arcStroke = (d) => {
  const isHov = hoveredRoute && d.from === hoveredRoute.from && d.to === hoveredRoute.to;
  return isHov ? 1.8 : 0.9;   // was 1.2 / 0.5
};

  return (
    <section className="relative bg-[#f5f4f0] font-sans flex flex-col p-4 sm:p-5 gap-3">

      {/* ── HEADER CARD ── */}
      <div
        ref={headerRef}
        className="relative rounded-2xl overflow-hidden min-h-[180px] sm:min-h-[200px]"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2070"
          alt="Global network"
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="absolute inset-0 bg-black/45" />

        {/* TOP LEFT */}
        <div className="absolute top-0 left-0 bg-white/90 backdrop-blur-sm px-4 py-3 sm:px-7 sm:py-5 rounded-br-2xl z-10">
          <span className="text-[10px] sm:text-xs font-medium tracking-[0.12em] uppercase text-neutral-400">
            Our Network
          </span>
        </div>

        {/* TOP RIGHT */}
        <div className="absolute top-0 right-0 bg-white/90 backdrop-blur-sm px-4 py-3 sm:px-7 sm:py-5 rounded-bl-2xl z-10 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-[11px] sm:text-sm font-medium text-neutral-900 tracking-tight">
            {ROUTES.length} active routes
          </span>
        </div>

        {/* BOTTOM LEFT */}
        <div className="absolute bottom-0 left-0 right-0 sm:right-auto bg-white/90 backdrop-blur-sm px-5 py-5 sm:px-7 sm:py-6 rounded-tr-2xl z-10">
          <h2 className="text-2xl sm:text-3xl lg:text-[2.4rem] font-bold tracking-[-0.03em] leading-[1.18] text-neutral-900">
            A global network,<br className="hidden sm:block" />
            <span className="text-neutral-400"> built from Tuticorin.</span>
          </h2>
        </div>
      </div>

      {/* ── MAIN CARD — globe + stats ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-3">

        {/* Globe card */}
        <div
          className="relative rounded-2xl overflow-hidden bg-white/70 border border-black/10"
          style={{
            minHeight: 480,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.9s ease 0.15s, transform 0.9s ease 0.15s",
          }}
          onMouseLeave={() => setHoveredRoute(null)}
        >
          {/* TOP LEFT */}
          <div className="absolute top-0 left-0 bg-white/90 backdrop-blur-sm px-4 py-3 sm:px-5 sm:py-4 rounded-br-2xl z-10">
            <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-neutral-400">
              Live routes
            </span>
          </div>

          {/* TOP RIGHT — hover tooltip */}
          <div className="absolute top-0 right-0 bg-white/90 backdrop-blur-sm px-4 py-3 sm:px-5 sm:py-4 rounded-bl-2xl z-10">
            {hoveredRoute ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-neutral-900 tracking-tight">
                  {hoveredRoute.from}
                </span>
                <ArrowRight size={10} className="text-neutral-400" />
                <span className="text-[11px] font-semibold text-neutral-900 tracking-tight">
                  {hoveredRoute.to}
                </span>
              </div>
            ) : (
              <span className="text-[10px] font-medium text-neutral-400 tracking-tight">
                Hover a route
              </span>
            )}
          </div>

          {/* Globe */}
          <div
            ref={containerRef}
            className="w-full h-full"
            style={{ minHeight: 480 }}
          >
            <Globe
              ref={(el) => {
                globeRef.current = el;
                if (el && !globeReady) setGlobeReady(true);
              }}
              width={dims.w}
              height={dims.h}
              globeImageUrl="//unpkg.com/three-globe@2.33.0/example/img/earth-day.jpg"
              backgroundImageUrl=""
              backgroundColor="rgba(0,0,0,0)"
              atmosphereColor="rgba(180,200,220,0.6)"
              atmosphereAltitude={0.15}
              waitForGlobeReady={false}
              arcsData={ROUTES}
              arcStartLat="startLat"
              arcStartLng="startLng"
              arcEndLat="endLat"
              arcEndLng="endLng"
              arcColor={arcColor}
              arcDashLength={0.04}       // longer dash = more visible streak
              arcDashGap={0.03}
              arcDashAnimateTime={(d) => d.animMs}
              arcStroke={arcStroke}
              arcAltitudeAutoScale={0.45}
              onArcHover={(arc) =>
                setHoveredRoute(
                  arc ? ROUTES.find((x) => x.from === arc.from && x.to === arc.to) ?? null : null
                )
              }
              
              htmlElementsData={LABEL_POINTS}
              htmlLat={(d) => d.lat}
              htmlLng={(d) => d.lng}
              htmlAltitude={(d) => d.isHub ? 0.04 : 0.03}
              htmlElement={makeLabelEl}
              htmlTransitionDuration={0}
              htmlElementVisibilityModifier={(el, isVisible) => {
                el.style.opacity = isVisible ? "1" : "0";
                el.style.transform = isVisible ? "scale(1)" : "scale(0.85)";
                el.style.transition = "opacity 0.4s ease, transform 0.4s ease";
              }}
            />
          </div>

          {/* HQ label */}
          <div className="absolute bottom-0 left-0 bg-white/90 backdrop-blur-sm px-4 py-3 sm:px-5 sm:py-4 rounded-tr-2xl z-10">
            <p className="text-[9px] font-medium tracking-[0.1em] uppercase text-neutral-400 mb-0.5">
              Hub
            </p>
            <p className="text-xs font-bold text-neutral-900 tracking-tight">
              Tuticorin, India
            </p>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div
          className="flex flex-col gap-3"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.9s ease 0.25s, transform 0.9s ease 0.25s",
          }}
        >
          {/* Stats 2×2 */}
          <div className="grid grid-cols-2 gap-3">
            {STATS.map(({ num, label }) => (
              <div
                key={label}
                className="bg-white/80 border border-black/10 rounded-2xl px-4 py-5 flex flex-col justify-between min-h-[100px]"
              >
                <Globe2 size={13} className="text-neutral-300" />
                <div>
                  <p className="text-2xl font-bold tracking-[-0.04em] text-neutral-900 leading-none">
                    {num}
                  </p>
                  <p className="text-[10px] font-medium tracking-[0.08em] uppercase text-neutral-400 mt-1">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Routes list card */}
<div className="relative flex-1 bg-white/80 border border-black/10 rounded-2xl overflow-hidden">

  {/* TOP LEFT */}
  <div className="absolute top-0 left-0 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-br-2xl z-10">
    <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-neutral-400">
      Destinations
    </span>
  </div>

  {/* TOP RIGHT — selected indicator */}
  {selectedDest && (
    <div className="absolute top-0 right-0 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-bl-2xl z-10">
      <span className="text-[9px] font-medium text-neutral-500 tracking-tight">
        → {selectedDest}
      </span>
    </div>
  )}

  <div className="flex flex-col pt-12 pb-3 px-4">
    {ROUTES.map((r) => {
      // Find matching label point for coordinates
      const point = LABEL_POINTS.find((p) => p.label === r.to);
      const isSelected = selectedDest === r.to;
      const isHovered  = hoveredRoute?.to === r.to;

      return (
        <div
          key={r.to}
          onMouseEnter={() => setHoveredRoute(r)}
          onMouseLeave={() => setHoveredRoute(null)}
          onClick={() => {
            if (!point) return;
            setSelectedDest(r.to);
            flyTo(point.lat, point.lng);
          }}
          className={`flex items-center justify-between py-2.5 border-b border-black/5 last:border-0 cursor-pointer transition-all duration-200 ${
            isSelected || isHovered ? "opacity-100" : "opacity-55 hover:opacity-100"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
              style={{
                background: isSelected
                  ? "#1a1916"
                  : isHovered
                  ? "rgba(26,25,22,0.5)"
                  : "#d4d0ca",
                transform: isSelected ? "scale(1.4)" : "scale(1)",
                transition: "background 0.2s, transform 0.2s",
              }}
            />
            <span
              className="text-xs tracking-tight transition-all duration-200"
              style={{
                fontWeight: isSelected ? 700 : 500,
                color: isSelected ? "#1a1916" : "#374151",
              }}
            >
              {r.to}
            </span>
          </div>

          <div
            className="w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200"
            style={{
              background:   isSelected ? "#1a1916" : "transparent",
              borderColor:  isSelected ? "#1a1916" : "rgba(0,0,0,0.1)",
            }}
          >
            <ArrowRight
              size={9}
              style={{ color: isSelected ? "#f5f4f0" : "#c8c5be" }}
            />
          </div>
        </div>
      );
    })}
  </div>
</div>
        </div>
      </div>

      {/* ── BOTTOM STRIP ── */}
      

    </section>
  );
}