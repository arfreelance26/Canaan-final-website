"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

// ── 8K textures (pinned three-globe@2.33.0) ───────────────────
const NIGHT_TEXTURE = "//unpkg.com/three-globe@2.33.0/example/img/earth-night.jpg";
const BUMP_TEXTURE  = "//unpkg.com/three-globe@2.33.0/example/img/earth-topology.png";
const STARS_TEXTURE = "//unpkg.com/three-globe@2.33.0/example/img/night-sky.png";

// Stable polygon accessors — defined outside component so refs never change on tick
const POLY_CAP    = () => "rgba(6,10,24,0.82)";
const POLY_SIDE   = () => "rgba(185,145,32,0.55)";
const POLY_STROKE = () => "rgba(210,170,52,0.55)";
const POLY_LABEL  = () => "";

// ── SHIPPING ROUTES ───────────────────────────────────────────
const ROUTES = [
  { from: "Tuticorin",      to: "China",          startLat:  8.76, startLng:  78.13, endLat:  35.86, endLng: 104.19, count: 1240, animMs: 1900 },
  { from: "Tuticorin",      to: "UAE",             startLat:  8.76, startLng:  78.13, endLat:  25.20, endLng:  55.27, count:  980, animMs: 1600 },
  { from: "Tuticorin",      to: "United Kingdom",  startLat:  8.76, startLng:  78.13, endLat:  55.37, endLng:  -3.43, count:  856, animMs: 2800 },
  { from: "Tuticorin",      to: "Germany",         startLat:  8.76, startLng:  78.13, endLat:  51.16, endLng:  10.45, count:  720, animMs: 2700 },
  { from: "Tuticorin",      to: "Singapore",       startLat:  8.76, startLng:  78.13, endLat:   1.35, endLng: 103.81, count: 1420, animMs: 1500 },
  { from: "Tuticorin",      to: "Japan",           startLat:  8.76, startLng:  78.13, endLat:  36.20, endLng: 138.25, count:  680, animMs: 2100 },
  { from: "Tuticorin",      to: "USA",             startLat:  8.76, startLng:  78.13, endLat:  37.09, endLng: -95.71, count: 1100, animMs: 3200 },
  { from: "Tuticorin",      to: "Australia",       startLat:  8.76, startLng:  78.13, endLat: -25.27, endLng: 133.77, count:  550, animMs: 2200 },
  { from: "Tuticorin",      to: "South Africa",    startLat:  8.76, startLng:  78.13, endLat: -30.55, endLng:  22.93, count:  420, animMs: 2500 },
  { from: "Tuticorin",      to: "Saudi Arabia",    startLat:  8.76, startLng:  78.13, endLat:  23.88, endLng:  45.07, count: 1580, animMs: 1700 },
  { from: "Tuticorin",      to: "Malaysia",        startLat:  8.76, startLng:  78.13, endLat:   4.21, endLng: 101.97, count: 1350, animMs: 1600 },
  { from: "Tuticorin",      to: "Netherlands",     startLat:  8.76, startLng:  78.13, endLat:  52.13, endLng:   5.29, count:  640, animMs: 2900 },
  { from: "UAE",            to: "USA",             startLat:  25.20, startLng: 55.27, endLat:  37.09, endLng: -95.71, count:  890, animMs: 3000 },
  { from: "Singapore",      to: "Australia",       startLat:   1.35, startLng:103.81, endLat: -25.27, endLng: 133.77, count:  540, animMs: 1900 },
  { from: "United Kingdom", to: "Nigeria",         startLat:  55.37, startLng: -3.43, endLat:   9.08, endLng:   8.67, count:  380, animMs: 2300 },
  { from: "UAE",            to: "Kenya",           startLat:  25.20, startLng: 55.27, endLat:  -0.02, endLng:  37.90, count:  290, animMs: 2000 },
  { from: "China",          to: "USA",             startLat:  35.86, startLng:104.19, endLat:  37.09, endLng: -95.71, count:  760, animMs: 3400 },
  { from: "Germany",        to: "USA",             startLat:  51.16, startLng: 10.45, endLat:  37.09, endLng: -95.71, count:  430, animMs: 3100 },
];

const TOTAL = ROUTES.reduce((s, r) => s + r.count, 0);

// ── DESTINATION COUNTRY LABELS ────────────────────────────────
// One label per unique endpoint; multi-route destinations show aggregate count
const DEST_LABELS = [
  { to: "China",          lat:  35.86, lng: 104.19, count: 1240 },
  { to: "UAE",            lat:  25.20, lng:  55.27, count:  980 },
  { to: "United Kingdom", lat:  55.37, lng:  -3.43, count:  856 },
  { to: "Germany",        lat:  51.16, lng:  10.45, count:  720 },
  { to: "Singapore",      lat:   1.35, lng: 103.81, count: 1420 },
  { to: "Japan",          lat:  36.20, lng: 138.25, count:  680 },
  { to: "USA",            lat:  37.09, lng: -95.71, count: 3180 },
  { to: "Australia",      lat: -25.27, lng: 133.77, count: 1090 },
  { to: "South Africa",   lat: -30.55, lng:  22.93, count:  420 },
  { to: "Saudi Arabia",   lat:  23.88, lng:  45.07, count: 1580 },
  { to: "Malaysia",       lat:   4.21, lng: 101.97, count: 1350 },
  { to: "Netherlands",    lat:  52.13, lng:   5.29, count:  640 },
  { to: "Nigeria",        lat:   9.08, lng:   8.67, count:  380 },
  { to: "Kenya",          lat:  -0.02, lng:  37.90, count:  290 },
];

// Stable element factory — module-level so react-globe.gl never recreates
function makeDestLabel(d) {
  // outer: CSS2DRenderer positions this with transform translate(x,y)
  const outer = document.createElement("div");
  outer.style.cssText = "pointer-events:none;";
  outer.dataset.lat = d.lat;
  outer.dataset.lng = d.lng;

  // inner: visibility modifier controls opacity/translate only
  const inner = document.createElement("div");
  inner.style.cssText = [
    "opacity:0",
    "transition:opacity 0.6s ease, transform 0.6s ease, filter 0.5s ease",
    "transform:translateY(10px) scale(0.93)",
    "will-change:opacity,transform,filter",
  ].join(";");
  inner.innerHTML = `
    <div style="
      font-family:system-ui,-apple-system,sans-serif;
      background:rgba(8,6,4,0.90);
      border:1px solid rgba(210,175,55,0.38);
      border-radius:9px;
      padding:5px 11px 6px;
      white-space:nowrap;
      box-shadow:0 0 16px rgba(212,175,55,0.12),0 3px 16px rgba(0,0,0,0.65);
      text-align:center;
    ">
      <div style="
        font-size:8px;
        font-weight:700;
        letter-spacing:0.12em;
        text-transform:uppercase;
        color:rgba(212,175,55,0.85);
        margin-bottom:3px;
      ">${d.to}</div>
      <div style="
        font-size:14px;
        font-weight:700;
        color:rgba(255,255,255,0.92);
        letter-spacing:-0.02em;
        line-height:1;
      ">${d.count.toLocaleString()}<span style="font-size:8px;font-weight:400;color:rgba(255,255,255,0.30);margin-left:3px">shipped</span></div>
    </div>
  `;
  outer.appendChild(inner);
  return outer;
}

// ── CITY ACTIVITY LIGHTS (~120 strategic points on land) ──────
// p = phase offset (0-5) so flashes are naturally staggered
const CITY_LIGHTS = [
  // Tuticorin HQ — kept permanently bright via isHub flag
  { lat: 8.76, lng: 78.13, isHub: true, p: 0 },
  // Africa
  { lat: 36.7, lng:   3.0, p: 0 }, { lat: 31.0, lng:  31.2, p: 3 }, { lat: 30.0, lng:  -7.6, p: 1 },
  { lat: 36.8, lng:  10.2, p: 5 }, { lat: 32.9, lng:  13.2, p: 2 }, { lat: 15.6, lng:  32.5, p: 4 },
  { lat:  9.0, lng:  40.0, p: 1 }, { lat:  1.3, lng:  36.8, p: 3 }, { lat: -6.2, lng:  35.7, p: 0 },
  { lat:-26.0, lng:  28.0, p: 5 }, { lat:-33.9, lng:  18.4, p: 2 }, { lat:  6.4, lng:   3.4, p: 4 },
  { lat:  9.1, lng:   7.4, p: 0 }, { lat:  5.5, lng:  -0.2, p: 2 }, { lat: 14.7, lng: -17.4, p: 5 },
  { lat:  3.8, lng:  11.5, p: 1 }, { lat: -4.3, lng:  15.3, p: 3 }, { lat: -8.8, lng:  13.2, p: 0 },
  { lat:-18.9, lng:  47.5, p: 4 }, { lat: 12.4, lng:  15.0, p: 2 }, { lat:  4.0, lng:  -9.8, p: 5 },
  { lat:-13.9, lng:  33.8, p: 1 }, { lat: 12.6, lng:  -8.0, p: 3 }, { lat:  0.3, lng:   9.5, p: 0 },
  { lat: -3.4, lng:  29.4, p: 4 }, { lat: 15.5, lng:  38.9, p: 2 },
  // Europe
  { lat: 51.5, lng:  -0.1, p: 2 }, { lat: 48.9, lng:   2.4, p: 0 }, { lat: 52.5, lng:  13.4, p: 4 },
  { lat: 40.4, lng:  -3.7, p: 1 }, { lat: 41.9, lng:  12.5, p: 3 }, { lat: 59.9, lng:  10.7, p: 5 },
  { lat: 55.7, lng:  37.6, p: 2 }, { lat: 50.1, lng:  14.4, p: 0 }, { lat: 47.5, lng:  19.0, p: 4 },
  { lat: 44.8, lng:  20.5, p: 1 }, { lat: 37.9, lng:  23.7, p: 3 }, { lat: 41.0, lng:  28.9, p: 5 },
  { lat: 59.4, lng:  24.7, p: 0 }, { lat: 50.4, lng:  30.5, p: 2 }, { lat: 48.2, lng:  16.4, p: 4 },
  { lat: 53.9, lng:  27.6, p: 1 }, { lat: 38.7, lng:  -9.1, p: 3 }, { lat: 45.8, lng:  15.9, p: 5 },
  { lat: 42.7, lng:  23.3, p: 0 }, { lat: 60.2, lng:  25.0, p: 2 }, { lat: 51.9, lng:   4.5, isMajorHub: true, p: 1 },
  // Asia
  { lat: 43.3, lng:  76.9, p: 3 }, { lat: 39.9, lng: 116.4, p: 1 }, { lat: 31.2, lng: 121.5, isMajorHub: true, p: 5 },
  { lat: 22.3, lng: 114.2, p: 2 }, { lat: 13.8, lng: 100.5, p: 0 }, { lat: 21.0, lng: 105.8, p: 4 },
  { lat: 10.8, lng: 106.7, p: 1 }, { lat:  3.1, lng: 101.7, isMajorHub: true, p: 3 }, { lat:  6.9, lng:  79.8, p: 5 },
  { lat: 23.7, lng:  90.4, p: 0 }, { lat: 27.7, lng:  85.3, p: 2 }, { lat: 17.4, lng:  78.5, p: 4 },
  { lat: 19.1, lng:  72.9, p: 1 }, { lat: 28.6, lng:  77.2, p: 3 }, { lat: 13.0, lng:  77.6, p: 5 },
  { lat: 22.6, lng:  88.4, p: 0 }, { lat: 33.7, lng:  73.1, p: 2 }, { lat: 24.4, lng:  67.0, p: 4 },
  { lat: 33.3, lng:  44.4, p: 1 }, { lat: 35.7, lng:  51.4, p: 3 }, { lat: 33.5, lng:  36.3, p: 5 },
  { lat: 24.7, lng:  46.7, p: 0 }, { lat: 21.5, lng:  39.2, p: 2 }, { lat: 25.3, lng:  51.5, isMajorHub: true, p: 4 },
  { lat: 35.7, lng: 139.7, p: 1 }, { lat: 37.6, lng: 127.0, p: 3 }, { lat: 45.0, lng: 132.0, p: 5 },
  { lat: 51.2, lng:  71.5, p: 0 }, { lat: 39.7, lng:  66.9, p: 2 }, { lat: 38.6, lng:  59.6, p: 4 },
  { lat: -6.2, lng: 106.8, p: 1 }, { lat: 55.0, lng:  83.0, p: 3 }, { lat: 56.8, lng:  60.6, p: 5 },
  { lat: 23.1, lng:  72.6, p: 0 }, { lat: 26.9, lng:  75.8, p: 2 }, { lat: 43.1, lng: 131.9, p: 4 },
  { lat: 14.1, lng: 108.3, p: 1 }, { lat: 16.9, lng:  96.2, p: 3 }, { lat: 31.5, lng:  74.3, p: 5 },
  // North America
  { lat: 40.7, lng: -74.0, p: 4 }, { lat: 34.0, lng:-118.2, p: 1 }, { lat: 41.9, lng: -87.6, p: 3 },
  { lat: 29.8, lng: -95.4, p: 0 }, { lat: 33.4, lng:-112.1, p: 5 }, { lat: 47.6, lng:-122.3, p: 2 },
  { lat: 37.8, lng:-122.4, p: 4 }, { lat: 25.8, lng: -80.2, p: 1 }, { lat: 43.7, lng: -79.4, p: 3 },
  { lat: 45.5, lng: -73.6, p: 0 }, { lat: 49.3, lng:-123.1, p: 5 }, { lat: 19.4, lng: -99.1, p: 2 },
  { lat: 20.7, lng:-103.4, p: 4 }, { lat: 25.7, lng:-100.3, p: 1 }, { lat: 32.7, lng: -97.3, p: 3 },
  { lat: 38.9, lng: -77.0, p: 0 }, { lat: 42.4, lng: -71.1, p: 5 }, { lat: 53.5, lng:-113.5, p: 2 },
  // South America
  { lat:-23.5, lng: -46.6, p: 2 }, { lat:-22.9, lng: -43.2, p: 0 }, { lat:-15.8, lng: -47.9, p: 4 },
  { lat:-34.6, lng: -58.4, p: 1 }, { lat:-33.5, lng: -70.7, p: 3 }, { lat:-12.0, lng: -77.0, p: 5 },
  { lat:  4.7, lng: -74.1, p: 0 }, { lat: 10.5, lng: -66.9, p: 2 }, { lat: -0.2, lng: -78.5, p: 4 },
  { lat:-16.5, lng: -68.2, p: 1 }, { lat:-25.3, lng: -57.6, p: 3 }, { lat: -3.1, lng: -60.0, p: 5 },
  // Australia / Oceania
  { lat:-33.9, lng: 151.2, p: 2 }, { lat:-37.8, lng: 145.0, p: 0 }, { lat:-27.5, lng: 153.0, p: 4 },
  { lat:-31.9, lng: 115.9, p: 1 }, { lat:-34.9, lng: 138.6, p: 3 }, { lat:-12.5, lng: 130.8, p: 5 },
  { lat:-36.9, lng: 174.8, p: 0 },
];

// Flash palette: state 0 = brightest, 5 = ghost
const FLASH_COLORS = [
  "rgba(255,224,80,1)",    // 0 bright flash
  "rgba(255,200,55,0.72)", // 1 fade
  "rgba(220,165,38,0.42)", // 2 mid
  "rgba(180,130,22,0.22)", // 3 dim
  "rgba(150,108,14,0.10)", // 4 ghost
  "rgba(140,100,12,0.08)", // 5 ghost
];
const FLASH_RADII = [0.54, 0.40, 0.30, 0.24, 0.20, 0.20];
// Major trade hubs — brighter, larger, on the same 6-step pulse cycle
const MAJOR_HUB_COLORS = [
  "rgba(255,220,70,1.00)",    // 0 peak flash
  "rgba(250,205,58,0.92)",    // 1
  "rgba(238,188,42,0.78)",    // 2
  "rgba(220,168,30,0.60)",    // 3
  "rgba(238,188,42,0.78)",    // 4
  "rgba(250,205,58,0.92)",    // 5
];
const MAJOR_HUB_RADII = [0.80, 0.68, 0.56, 0.50, 0.56, 0.68];
// Underglow breathing rhythm — maps to tick % 6
const BREATHE_OPA = [1.0, 0.84, 0.64, 0.64, 0.84, 1.0];

// ── COMPONENT ─────────────────────────────────────────────────
export default function CustomerGlobeSection() {
  const globeRef     = useRef(null);
  const containerRef = useRef(null);
  const headingRef   = useRef(null);

  const [dims,          setDims]          = useState({ w: 800, h: 600 });
  const [hoveredRoute,  setHoveredRoute]  = useState(null);
  const [globeReady,    setGlobeReady]    = useState(false);
  const [countries,     setCountries]     = useState([]);
  const [tick,          setTick]          = useState(0);
  const [displayNums,   setDisplayNums]   = useState({ countries: 0, routes: 0, shipments: 0 });
  const [headingVisible, setHeadingVisible] = useState(false);
  const statsRef = useRef(null);

  // ── Fetch world GeoJSON → country polygon extrusion ──────────
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
    )
      .then((r) => r.json())
      .then((d) => setCountries(d.features))
      .catch(() => {});
  }, []);

  // ── City light pulse ticker ───────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % 6), 650);
    return () => clearInterval(id);
  }, []);

  // ── Responsive sizing ─────────────────────────────────────────
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

  // ── Globe controls + material ─────────────────────────────────
  useEffect(() => {
    if (!globeReady || !globeRef.current) return;
    const gl       = globeRef.current;
    const controls = gl.controls();

    controls.autoRotate      = true;
    controls.autoRotateSpeed = 0.38;
    controls.enableZoom      = false;
    gl.pointOfView({ lat: 8.76, lng: 78.13, altitude: 2.2 }, 1200);

    try {
      const mat     = gl.globeMaterial();
      mat.bumpScale = 20;
      mat.shininess = 14;
    } catch (_) {}

    try {
      gl.renderer().setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch (_) {}

    let resumeTimer;
    const pause  = () => { controls.autoRotate = false; clearTimeout(resumeTimer); };
    const resume = () => { resumeTimer = setTimeout(() => { controls.autoRotate = true; }, 3500); };
    controls.addEventListener("start", pause);
    controls.addEventListener("end",   resume);

    return () => {
      clearTimeout(resumeTimer);
      controls.removeEventListener("start", pause);
      controls.removeEventListener("end",   resume);
    };
  }, [globeReady]);

  // ── Stats count-up (fires once when the strip enters the viewport) ────
  useEffect(() => {
    const targets = { countries: 30, routes: ROUTES.length, shipments: TOTAL };
    const DURATION = 2000;
    const easeOut  = (t) => 1 - Math.pow(1 - t, 3);
    let raf;
    let startTs = null;
    const run = (ts) => {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / DURATION, 1);
      const e = easeOut(p);
      setDisplayNums({
        countries: Math.round(e * targets.countries),
        routes:    Math.round(e * targets.routes),
        shipments: Math.round(e * targets.shipments),
      });
      if (p < 1) raf = requestAnimationFrame(run);
    };
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { io.disconnect(); raf = requestAnimationFrame(run); } },
      { threshold: 0.4 }
    );
    if (statsRef.current) io.observe(statsRef.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  // ── Depth-blur: labels near the horizon get progressively blurred ──────
  useEffect(() => {
    if (!globeReady) return;
    let raf;
    let lastTs = 0;
    const toRad = (d) => (d * Math.PI) / 180;
    const loop = (ts) => {
      raf = requestAnimationFrame(loop);
      if (ts - lastTs < 220) return;          // ~4-5 fps — globe rotates slowly
      lastTs = ts;
      const gl = globeRef.current;
      if (!gl) return;
      const pov = gl.pointOfView();
      const outerEls = containerRef.current?.querySelectorAll("[data-lat]");
      outerEls?.forEach((outer) => {
        const lat   = parseFloat(outer.dataset.lat);
        const lng   = parseFloat(outer.dataset.lng);
        const inner = outer.firstElementChild;
        if (!inner) return;
        const dLat = toRad(pov.lat - lat);
        const dLng = toRad(pov.lng - lng);
        const a    = Math.sin(dLat / 2) ** 2 +
          Math.cos(toRad(lat)) * Math.cos(toRad(pov.lat)) * Math.sin(dLng / 2) ** 2;
        const angDeg = 2 * Math.asin(Math.sqrt(Math.min(1, a))) * 180 / Math.PI;
        // Sharp within 40°, max blur (3 px) at the horizon (90°)
        const t     = Math.max(0, (angDeg - 40) / 50);
        inner.style.filter = t > 0.05 ? `blur(${(t * 3).toFixed(1)}px)` : "";
      });
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [globeReady]);

  // ── Heading entrance ─────────────────────────────────────────
  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHeadingVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── Arc accessors ─────────────────────────────────────────────
  const isHov = (d) =>
    hoveredRoute && d.from === hoveredRoute.from && d.to === hoveredRoute.to;

  const arcColor = (d) =>
    isHov(d)
      ? ["rgba(220,175,50,0)", "rgba(248,200,68,1)",  "rgba(220,175,50,0)"]
      : ["rgba(195,148,28,0)", "rgba(218,168,42,1)",  "rgba(195,148,28,0)"];

  const arcStroke = (d) => {
    const base = 0.38 + Math.log10(d.count) * 0.10;
    return isHov(d) ? base * 2.8 : base;
  };

  // ── Point accessors (depend on tick) ─────────────────────────
  const pointColor = (d) => {
    if (d.isHub)      return "rgba(255,228,80,1)";
    if (d.isMajorHub) return MAJOR_HUB_COLORS[(d.p + tick) % 6];
    return FLASH_COLORS[(d.p + tick) % 6];
  };
  const pointRadius = (d) => {
    if (d.isHub)      return 0.62;
    if (d.isMajorHub) return MAJOR_HUB_RADII[(d.p + tick) % 6];
    return FLASH_RADII[(d.p + tick) % 6];
  };
  const pointAlt = (d) => {
    if (d.isHub)      return 0.030;
    if (d.isMajorHub) return 0.025;
    return (d.p + tick) % 6 === 0 ? 0.026 : 0.014;
  };

  return (
    <section
      className="relative font-sans"
      style={{ background: "#f5f4f0" }}
    >
      {/* ── HEADING — sits directly on the page background, no card box ── */}
      <div
        ref={headingRef}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-6 sm:px-12 lg:px-20 pt-20 sm:pt-28 pb-6"
      >
        <div>
          {/* Label row */}
          <div
            className="flex items-center gap-3 mb-4"
            style={{
              opacity:    headingVisible ? 1 : 0,
              transform:  headingVisible ? "translateX(0)" : "translateX(-18px)",
              transition: "opacity 0.55s ease, transform 0.55s ease",
            }}
          >
            <span className="text-[10px] font-medium tracking-[0.14em] uppercase text-[#8a6f24]/70">
              Our Customers
            </span>
            <span className="w-px h-3 bg-black/15" />
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8a84b] animate-pulse shrink-0" />
              <span className="text-[10px] font-medium text-black/40 tracking-tight">
                {ROUTES.length} active routes
              </span>
            </div>
          </div>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "#0a0908",
              margin: 0,
            }}
          >
            <span style={{ display: "block", overflow: "hidden", lineHeight: 1.2 }}>
              <span style={{
                display: "block",
                transform: headingVisible ? "translateY(0)" : "translateY(108%)",
                transition: "transform 0.78s cubic-bezier(0.16,1,0.3,1) 80ms",
              }}>
                A global shipping
              </span>
            </span>
            <span style={{ display: "block", overflow: "hidden", lineHeight: 1.2 }}>
              <span style={{
                display: "block",
                color: "rgba(10,9,8,0.28)",
                fontWeight: 400,
                fontStyle: "italic",
                transform: headingVisible ? "translateY(0)" : "translateY(108%)",
                transition: "transform 0.78s cubic-bezier(0.16,1,0.3,1) 165ms",
              }}>
                network, built from Tuticorin.
              </span>
            </span>
          </h2>
        </div>
        <p
          className="text-sm text-black/30 leading-relaxed max-w-xs sm:text-right"
          style={{
            opacity:    headingVisible ? 1 : 0,
            transform:  headingVisible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.65s ease 230ms, transform 0.65s ease 230ms",
          }}
        >
          Hover any route to explore —
          <br className="hidden sm:block" />
          drag the globe to rotate freely.
        </p>
      </div>

      {/* ── GLOBE + STATS — side by side on desktop ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] items-center gap-4 px-6 sm:px-12 lg:px-20 pb-20 sm:pb-28">

        {/* ── STATS — left column desktop / below globe mobile ── */}
        <div
          ref={statsRef}
          className="order-2 lg:order-1 grid grid-cols-2 lg:grid-cols-1 gap-3"
          style={{
            opacity:    headingVisible ? 1 : 0,
            transform:  headingVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.8s ease 500ms, transform 0.8s ease 500ms",
          }}
        >
          {[
            { num: `${displayNums.countries}+`,                  label: "Countries" },
            { num: `${displayNums.routes}`,                      label: "Active routes" },
            { num: `${displayNums.shipments.toLocaleString()}+`, label: "Total shipments" },
            { num: "2009",                                       label: "Since" },
          ].map(({ num, label }, i) => (
            <div
              key={label}
              className="rounded-2xl bg-[#edecea] border border-black/[0.06] px-5 py-6 flex flex-col gap-2"
            >
              <span
                style={{
                  fontSize: "clamp(1.6rem, 2.2vw, 2.4rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  color: "#0a0908",
                }}
              >
                {num}
              </span>
              <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-black/40">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* ── GLOBE — right column desktop / above stats mobile ── */}
        <div
          ref={containerRef}
          className="order-1 lg:order-2 relative overflow-hidden"
          style={{
            height: "82vh",
            minHeight: "520px",
            background: "transparent",
            opacity:    headingVisible ? 1 : 0,
            transform:  headingVisible ? "translateY(0)" : "translateY(52px)",
            transition: "opacity 1s cubic-bezier(0.16,1,0.3,1) 300ms, transform 1s cubic-bezier(0.16,1,0.3,1) 300ms",
          }}
          onMouseLeave={() => setHoveredRoute(null)}
        >
        {/* Underglow bloom — wide soft golden pool beneath the sphere */}
        <div style={{
          position: "absolute",
          top: "52%", left: "50%",
          transform: "translate(-50%, 0)",
          width: "72%", height: "52%",
          background: "radial-gradient(ellipse 100% 70% at 50% 10%, rgba(200,152,24,0.28) 0%, rgba(180,120,10,0.12) 50%, transparent 78%)",
          filter: "blur(48px)",
          opacity: BREATHE_OPA[tick % 6],
          transition: "opacity 0.65s ease",
          pointerEvents: "none",
        }} />

        {/* Underglow core — tighter bright spot directly beneath the equator */}
        <div style={{
          position: "absolute",
          top: "54%", left: "50%",
          transform: "translate(-50%, 0)",
          width: "36%", height: "22%",
          background: "radial-gradient(ellipse, rgba(215,170,35,0.40) 0%, rgba(180,110,10,0.16) 60%, transparent 100%)",
          filter: "blur(24px)",
          opacity: BREATHE_OPA[(tick + 2) % 6],
          transition: "opacity 0.65s ease",
          pointerEvents: "none",
        }} />

        {/* Scan-line texture — faint horizontal grid, adds screen/analytics feel */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.010) 2px, rgba(0,0,0,0.010) 4px)",
          zIndex: 5,
          pointerEvents: "none",
        }} />

        <Globe
          ref={(el) => {
            globeRef.current = el;
            if (el && !globeReady) setGlobeReady(true);
          }}
          width={dims.w}
          height={dims.h}
          /* Textures */
          globeImageUrl={NIGHT_TEXTURE}
          bumpImageUrl={BUMP_TEXTURE}
          backgroundImageUrl=""
          backgroundColor="rgba(0,0,0,0)"
          atmosphereColor="#5a9fe8"
          atmosphereAltitude={0.28}
          waitForGlobeReady={false}
          /* Country polygon extrusion — continent pop */
          polygonsData={countries}
          polygonGeoJsonGeometry="geometry"
          polygonAltitude={0.015}
          polygonCapColor={POLY_CAP}
          polygonSideColor={POLY_SIDE}
          polygonStrokeColor={POLY_STROKE}
          polygonLabel={POLY_LABEL}
          /* Animated light-trail arcs (beam only) */
          arcsData={ROUTES}
          arcStartLat="startLat"
          arcStartLng="startLng"
          arcEndLat="endLat"
          arcEndLng="endLng"
          arcColor={arcColor}
          arcDashLength={0.012}
          arcDashGap={0.012}
          arcDashAnimateTime={(d) => d.animMs}
          arcStroke={arcStroke}
          arcAltitudeAutoScale={0.52}
          onArcHover={(arc) => {
            setHoveredRoute(arc ? (ROUTES.find((x) => x.from === arc.from && x.to === arc.to) ?? null) : null);
          }}
          /* Country destination labels */
          htmlElementsData={DEST_LABELS}
          htmlLat={(d) => d.lat}
          htmlLng={(d) => d.lng}
          htmlAltitude={0.07}
          htmlElement={makeDestLabel}
          htmlTransitionDuration={0}
          htmlElementVisibilityModifier={(el, isVisible) => {
            const inner = el.firstElementChild;
            if (!inner) return;
            inner.style.opacity = isVisible ? "1" : "0";
            inner.style.transform = isVisible
              ? "translateY(0px) scale(1)"
              : "translateY(10px) scale(0.93)";
          }}
          /* Pulsing city activity lights */
          pointsData={CITY_LIGHTS}
          pointLat="lat"
          pointLng="lng"
          pointAltitude={pointAlt}
          pointRadius={pointRadius}
          pointColor={pointColor}
          pointsMerge={false}
        />


        </div>
        {/* end globe column */}
      </div>
      {/* end globe+stats grid */}

    </section>
  );
}
