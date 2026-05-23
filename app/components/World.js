"use client";

import { useState, useEffect, useRef } from "react";
import { Globe, ArrowRight, TrendingUp, Package } from "lucide-react";
import dynamic from "next/dynamic";

const WorldMap = dynamic(() => import("react-svg-worldmap"), { ssr: false });

const COUNTRY_DATA = [
  { country: "us", value: 120 },
  { country: "gb", value: 85 },
  { country: "de", value: 70 },
  { country: "ae", value: 95 },
  { country: "in", value: 110 },
  { country: "cn", value: 100 },
  { country: "sg", value: 75 },
  { country: "au", value: 60 },
  { country: "za", value: 45 },
  { country: "br", value: 55 },
  { country: "ca", value: 65 },
  { country: "fr", value: 72 },
  { country: "nl", value: 68 },
  { country: "jp", value: 80 },
  { country: "ng", value: 40 },
  { country: "ke", value: 35 },
  { country: "sa", value: 88 },
  { country: "mx", value: 50 },
  { country: "my", value: 62 },
  { country: "th", value: 58 },
];

const REGIONS = [
  { label: "Middle East", countries: "UAE, Saudi Arabia, Kuwait", shipments: "2,400+" },
  { label: "Asia Pacific", countries: "India, China, Singapore", shipments: "3,100+" },
  { label: "Europe", countries: "UK, Germany, Netherlands", shipments: "1,800+" },
  { label: "Americas", countries: "USA, Canada, Mexico", shipments: "2,200+" },
  { label: "Africa", countries: "Nigeria, Kenya, South Africa", shipments: "900+" },
];

function useFadeIn(ref, threshold = 0.1) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

export default function WorldNetworkSection() {
  const [activeRegion, setActiveRegion] = useState(null);
  const sectionRef = useRef(null);
  const isVisible = useFadeIn(sectionRef, 0.05);

  return (
    <section 
      ref={sectionRef}
      id="world-network"
      className="relative bg-[#f5f4f0] font-sans flex flex-col p-4 sm:p-5 gap-3"
    >

      {/* ── HEADER CARD ── */}
      <div className={`group relative rounded-2xl overflow-hidden min-h-[180px] sm:min-h-[220px] transition-all duration-700 ${
        isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-6"
      }`}>
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2070"
          alt="World Network"
          className="w-full h-full object-cover absolute inset-0 transition-transform duration-[1.2s] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/45 group-hover:bg-black/50 transition-colors duration-500" />

        {/* TOP LEFT — label */}
        <div className="absolute top-0 left-0 bg-white/90 backdrop-blur-sm px-4 py-3 sm:px-7 sm:py-5 rounded-br-2xl z-10">
          <span className="text-[10px] sm:text-xs font-medium tracking-[0.12em] uppercase text-neutral-400">
            World Network
          </span>
        </div>

        {/* TOP RIGHT — live badge */}
        <div className="absolute top-0 right-0 bg-white/90 backdrop-blur-sm px-4 py-3 sm:px-7 sm:py-5 rounded-bl-2xl z-10 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-[11px] sm:text-sm font-medium text-neutral-900 tracking-tight">
            30+ countries active
          </span>
        </div>

        {/* BOTTOM LEFT — heading */}
        <div className="absolute bottom-0 left-0 right-0 sm:right-auto bg-white/90 backdrop-blur-sm px-5 py-5 sm:px-7 sm:py-6 rounded-tr-2xl z-10">
          <h2 className="text-2xl sm:text-3xl lg:text-[2.4rem] font-bold tracking-[-0.03em] leading-[1.18] text-neutral-900">
            Connecting the world,<br className="hidden sm:block" /> one shipment at a time
          </h2>
        </div>

        {/* BOTTOM RIGHT — stat (desktop) */}
        <div className="hidden sm:flex absolute bottom-0 right-0 bg-white/90 backdrop-blur-sm px-7 py-6 rounded-tl-2xl z-10 items-center gap-3">
          <Globe size={16} className="text-neutral-400 animate-spin-slow" />
          <div>
            <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">
              Total shipments
            </p>
            <p className="text-lg font-bold tracking-[-0.03em] text-neutral-900">
              50,000+ delivered
            </p>
          </div>
        </div>
      </div>

      {/* ── MAP + REGIONS GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

        {/* ── MAP CARD ── */}
        <div className={`lg:col-span-2 relative rounded-2xl overflow-hidden bg-white/80 border border-black/10 min-h-[320px] sm:min-h-[400px] transition-all duration-700 delay-100 ${
          isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-6"
        }`}>

          {/* TOP LEFT — label */}
          <div className="absolute top-0 left-0 bg-white/90 backdrop-blur-sm px-4 py-3 sm:px-5 sm:py-4 rounded-br-2xl z-10">
            <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-neutral-400">
              Active routes
            </span>
          </div>

          {/* TOP RIGHT — legend */}
          <div className="absolute top-0 right-0 bg-white/90 backdrop-blur-sm px-4 py-3 sm:px-5 sm:py-4 rounded-bl-2xl z-10 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
              <span className="text-[10px] text-neutral-400">Low</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-500" />
              <span className="text-[10px] text-neutral-400">Mid</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
              <span className="text-[10px] text-neutral-400">High</span>
            </div>
          </div>

          {/* Map */}
          <div className="flex items-center justify-center w-full h-full pt-14 pb-4 px-2 sm:pt-16 sm:px-4">
            <WorldMap
              color="#171717"
              title=""
              valueSuffix="shipments"
              size="responsive"
              data={COUNTRY_DATA}
              richInteraction
              tooltipBgColor="#171717"
              tooltipTextColor="#ffffff"
              backgroundColor="transparent"
              borderColor="#e5e5e5"
              strokeOpacity={0.6}
            />
          </div>
        </div>

        {/* ── REGIONS COLUMN ── */}
        <div className="lg:col-span-1 flex flex-col gap-3">

          {/* Stats cards row */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Globe, num: "30+", label: "Countries" },
              { icon: Package, num: "50K+", label: "Shipments" },
              { icon: TrendingUp, num: "98%", label: "On-time rate" },
              { icon: ArrowRight, num: "15+", label: "Years active" },
            ].map(({ icon: Icon, num, label }, i) => (
              <div
                key={label}
                style={{ animationDelay: `${i * 75}ms` }}
                className={`bg-white/80 border border-black/10 rounded-2xl px-4 py-5 flex flex-col justify-between min-h-[110px] bento-card transition-all duration-500 ${
                  isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-6"
                }`}
              >
                <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <Icon size={13} className="text-neutral-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-[-0.04em] text-neutral-900">{num}</p>
                  <p className="text-[10px] font-medium tracking-[0.08em] uppercase text-neutral-400 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Regions list card */}
          <div 
            style={{ animationDelay: "300ms" }}
            className={`relative flex-1 bg-white/80 border border-black/10 rounded-2xl overflow-hidden transition-all duration-700 ${
              isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-6"
            }`}
          >

            {/* TOP LEFT — label */}
            <div className="absolute top-0 left-0 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-br-2xl z-10">
              <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-neutral-400">
                Key regions
              </span>
            </div>

            <div className="flex flex-col pt-14 pb-4 px-4 sm:px-5 gap-0">
              {REGIONS.map((region, i) => (
                <div
                  key={region.label}
                  onClick={() => setActiveRegion(activeRegion === i ? null : i)}
                  className={`flex flex-col py-3.5 border-b border-black/5 last:border-0 cursor-pointer transition-colors ${
                    activeRegion === i ? "opacity-100" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold tracking-tight text-neutral-900">
                      {region.label}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-semibold text-neutral-900 bg-black/5 px-2.5 py-1 rounded-full">
                        {region.shipments}
                      </span>
                      <div className={`w-6 h-6 rounded-full border border-black/10 flex items-center justify-center transition-all duration-300 ${activeRegion === i ? "rotate-90 bg-neutral-900 border-neutral-900 text-white" : "text-neutral-400"}`}>
                        <ArrowRight size={11} className={`${activeRegion === i ? "text-white" : "text-neutral-400"} transition-colors`} />
                      </div>
                    </div>
                  </div>

                  {/* Accordion dropdown with smooth height & opacity transition */}
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    activeRegion === i ? "max-h-16 opacity-100 mt-2" : "max-h-0 opacity-0 pointer-events-none"
                  }`}>
                    <p className="text-[11px] text-neutral-400 tracking-tight leading-relaxed">
                      Active Corridors: <span className="text-neutral-600 font-medium">{region.countries}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM STRIP ── */}
      <div className={`flex flex-wrap gap-2 px-1 transition-all duration-700 delay-400 ${isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-6"}`}>
        {[
          "Middle East", "Asia Pacific", "Europe",
          "Americas", "Africa", "Air Routes",
          "Sea Routes", "Road Networks",
        ].map((tag) => (
          <span
            key={tag}
            className="bg-white/80 border border-black/10 text-neutral-700 text-xs font-medium px-4 py-2 rounded-full tracking-tight hover:bg-[#1a1916] hover:text-[#f5f4f0] hover:border-[#1a1916] transition-all duration-300 cursor-pointer"
          >
            {tag}
          </span>
        ))}
      </div>

    </section>
  );
}