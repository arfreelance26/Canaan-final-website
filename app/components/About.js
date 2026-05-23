"use client";

import { useRef } from "react";
import { ArrowRight, Globe, Package, Clock, TrendingUp } from "lucide-react";
import useScrollReveal from "../hooks/useScrollReveal";

const STATS = [
  { num: "15+", label: "Years in business" },
  { num: "50K+", label: "Shipments delivered" },
  { num: "30+", label: "Countries served" },
];

const PILLARS = [
  { icon: Globe, text: "Global reach, local expertise" },
  { icon: Package, text: "End-to-end cargo solutions" },
  { icon: Clock, text: "On-time delivery, every time" },
  { icon: TrendingUp, text: "Scalable for any volume" },
];

export default function AboutSection() {
  const sectionRef = useRef(null);
  const isVisible = useScrollReveal(sectionRef, 0.05);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#f5f4f0] font-sans flex flex-col p-4 sm:p-5 gap-3 overflow-hidden"
    >

      {/* ── MAIN CARD ── */}
      <div className={`group relative rounded-2xl overflow-hidden min-h-[600px] sm:min-h-[640px] lg:min-h-[700px] transition-all duration-700 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}>

        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070"
          alt="Canaan Global International logistics"
          className="w-full h-full object-cover absolute inset-0 transition-transform duration-[1.2s] group-hover:scale-105"
        />

        {/* Dark scrim */}
        <div className="absolute inset-0 bg-black/35 group-hover:bg-black/40 transition-colors duration-500" />

        {/* ── TOP LEFT — label ── */}
        <div className="absolute top-0 left-0 bg-[#f5f4f0] backdrop-blur-sm px-4 py-3 sm:px-7 sm:py-5 rounded-br-2xl z-10">
          <span className="text-[10px] sm:text-xs font-medium tracking-[0.12em] uppercase text-neutral-400">
            Who we are
          </span>
        </div>

        {/* ── TOP RIGHT — Est. badge ── */}
        <div className="absolute top-0 right-0 bg-[#f5f4f0] backdrop-blur-sm px-4 py-3 sm:px-7 sm:py-5 rounded-bl-2xl z-10 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-[11px] sm:text-sm font-medium text-neutral-900 tracking-tight">
            Est. 2009
            <span className="hidden sm:inline"> · Worldwide operations</span>
          </span>
        </div>

        {/* ── MOBILE LAYOUT — full bottom overlay ── */}
        <div className="sm:hidden absolute bottom-0 left-0 right-0 bg-[#f5f4f0] backdrop-blur-sm px-5 py-6 z-10 rounded-t-2xl flex flex-col gap-4">

          <p className="text-[10px] font-medium tracking-[0.12em] uppercase text-neutral-400">
            Canaan Global International
          </p>

          <h2 className="text-2xl font-bold tracking-[-0.03em] leading-[1.18] text-neutral-900">
            Moving cargo across<br />borders, seamlessly
          </h2>

          <p className="text-sm text-neutral-500 leading-relaxed">
            A full-service international logistics company specializing in
            freight forwarding, customs clearance, and supply chain
            management — connecting businesses to the world.
          </p>

          {/* Mobile stats row */}
          <div className="grid grid-cols-3 gap-2 py-4 border-y border-black/5">
            {STATS.map(({ num, label }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-xl font-bold tracking-[-0.03em] text-neutral-900">{num}</span>
                <span className="text-[10px] text-neutral-400 leading-tight">{label}</span>
              </div>
            ))}
          </div>

          {/* Mobile pillars */}
          <ul className="grid grid-cols-2 gap-2">
            {PILLARS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-2 text-xs text-neutral-600">
                <Icon size={13} className="text-neutral-400 shrink-0 mt-0.5" />
                {text}
              </li>
            ))}
          </ul>

          <button className="group flex items-center justify-center gap-2 bg-neutral-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-colors w-full">
            Our services <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* ── DESKTOP BOTTOM LEFT — heading + bio + pillars + CTA ── */}
        <div className="hidden sm:flex absolute bottom-0 left-0 sm:right-[36%] bg-[#f5f4f0] backdrop-blur-sm px-7 py-8 rounded-tr-2xl z-10 flex-col gap-4">

          <p className="text-xs font-medium tracking-[0.12em] uppercase text-neutral-400">
            Canaan Global International
          </p>

          <h2 className="text-3xl lg:text-[2.4rem] font-bold tracking-[-0.03em] leading-[1.18] text-neutral-900">
            Moving cargo across<br />borders, seamlessly
          </h2>

          <p className="text-[15px] text-neutral-500 leading-relaxed max-w-sm">
            A full-service international logistics company specializing in
            freight forwarding, customs clearance, and supply chain
            management — connecting businesses to the world with speed,
            reliability, and care.
          </p>

          <ul className="flex flex-col gap-2.5">
            {PILLARS.map(({ icon: Icon, text }, idx) => (
              <li
                key={text}
                style={{ transitionDelay: isVisible ? `${idx * 80}ms` : "0ms" }}
                className={`flex items-center gap-2.5 text-sm text-neutral-700 transition-all duration-500 ease-out transform ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                }`}
              >
                <Icon size={15} className="text-neutral-400 shrink-0 hover:scale-110 transition-transform duration-300" />
                {text}
              </li>
            ))}
          </ul>

          <button className="group flex items-center gap-2 bg-neutral-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-all duration-300 self-start active:scale-95">
            Our services <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </button>
        </div>

        {/* ── DESKTOP BOTTOM RIGHT — stats ── */}
        <div className="hidden sm:flex absolute bottom-0 right-0 bg-[#f5f4f0] backdrop-blur-sm px-7 py-8 rounded-tl-2xl z-10 flex-col gap-7">
          {STATS.map(({ num, label }, i) => (
            <div
              key={label}
              style={{ transitionDelay: isVisible ? `${200 + i * 80}ms` : "0ms" }}
              className={`flex flex-col gap-0.5 transition-all duration-700 ease-out transform ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
            >
              <span className="text-4xl font-bold tracking-[-0.04em] text-neutral-900 leading-none hover:scale-105 transition-transform duration-300 origin-left cursor-default">
                {num}
              </span>
              <span className="text-sm text-neutral-400 tracking-tight">{label}</span>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}