"use client";

import { useRef } from "react";
import { Globe, Award, Users, TrendingUp, Quote } from "lucide-react";
import useFadeIn from "../hooks/useFadeIn";

function FounderSection() {
  const sectionRef = useRef(null);
  const isVisible = useFadeIn(sectionRef, 0.05);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#f5f4f0] font-sans flex flex-col p-4 sm:p-5 gap-3 overflow-hidden"
    >
      {/* HEADER CARD */}
      <div className={`group relative rounded-2xl overflow-hidden min-h-[180px] sm:min-h-[200px] transition-all duration-700 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}>
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070"
          alt="Canaan Global International"
          className="w-full h-full object-cover absolute inset-0 transition-transform duration-[1.2s] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/45 group-hover:bg-black/50 transition-colors duration-500" />

        {/* BOTTOM LEFT — heading */}
        <div className="absolute bottom-0 left-0 right-0 sm:right-auto bg-white/90 backdrop-blur-sm px-5 py-5 sm:px-7 sm:py-6 rounded-tr-2xl z-10">
          <h1 className="text-2xl sm:text-3xl lg:text-[2.4rem] font-bold tracking-[-0.03em] leading-[1.18] text-neutral-900">
            The people behind<br className="hidden sm:block" /> Canaan Global
          </h1>
        </div>
      </div>

      {/* FOUNDER CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">

        {/* LEFT — founder photo */}
        <div
          style={{ transitionDelay: isVisible ? "100ms" : "0ms" }}
          className={`lg:col-span-2 relative rounded-2xl overflow-hidden min-h-[360px] sm:min-h-[440px] group cursor-pointer bento-card transition-all duration-700 ease-out transform ${
            isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.98]"
          }`}
        >
          <img
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2070"
            alt="Arun Sam Alfred — Founder"
            className="w-full h-full object-cover object-top absolute inset-0 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent group-hover:via-black/20 transition-all duration-500" />

          {/* TOP LEFT — role tag */}
          <div className="absolute top-0 left-0 bg-white/90 backdrop-blur-sm px-4 py-3 sm:px-5 sm:py-4 rounded-br-2xl z-10">
            <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-neutral-400">
              Founder &amp; CEO
            </span>
          </div>

          {/* BOTTOM — name */}
          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
            <p className="text-white/60 text-xs font-medium tracking-[0.1em] uppercase mb-1">
              Canaan Global International
            </p>
            <h2 className="text-white text-2xl sm:text-3xl font-bold tracking-[-0.03em] leading-tight">
              Arun Sam<br />Alfred
            </h2>
          </div>
        </div>

        {/* RIGHT — founder details */}
        <div className="lg:col-span-3 flex flex-col gap-3">

          {/* Quote card */}
          <div
            style={{ transitionDelay: isVisible ? "180ms" : "0ms" }}
            className={`group relative bg-neutral-900 rounded-2xl px-6 py-6 sm:px-8 sm:py-8 overflow-hidden bento-card transition-all duration-500 ease-out transform ${
              isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.98]"
            }`}
          >
            <Quote size={40} className="text-white/10 absolute top-4 right-4 group-hover:scale-110 transition-transform duration-500" />
            <p className="text-white text-lg sm:text-xl font-medium tracking-[-0.02em] leading-[1.5] relative z-10">
              &quot;Our mission is to bridge businesses across borders with
              reliability, integrity, and a relentless commitment to
              delivering on time — every time.&quot;
            </p>
            <div className="mt-5 flex items-center gap-3">
              <div className="w-8 h-0.5 bg-white/30" />
              <span className="text-white/50 text-xs tracking-[0.1em] uppercase">
                Arun Sam Alfred, Founder
              </span>
            </div>
          </div>

          {/* Bio card */}
          <div
            style={{ transitionDelay: isVisible ? "260ms" : "0ms" }}
            className={`relative bg-white/80 border border-black/10 rounded-2xl px-5 py-5 sm:px-7 sm:py-6 overflow-hidden bento-card transition-all duration-500 ease-out transform ${
              isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.98]"
            }`}
          >
            <div className="absolute top-0 left-0 bg-white/90 backdrop-blur-sm px-4 py-2.5 rounded-br-2xl z-10">
              <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-neutral-400">
                Background
              </span>
            </div>

            <div className="pt-8 flex flex-col gap-4">
              <p className="text-sm sm:text-[15px] text-neutral-600 leading-relaxed">
                Arun Sam Alfred founded Canaan Global International with a singular
                vision — to create a logistics company that treats every shipment
                as a promise. With over 15 years of experience in international
                freight and supply chain management, Arun has built Canaan from
                the ground up into a trusted name across 30+ countries.
              </p>
              <p className="text-sm sm:text-[15px] text-neutral-600 leading-relaxed">
                His deep expertise in customs regulations, multimodal logistics,
                and client relations has shaped a company culture rooted in
                transparency, precision, and genuine care for every client&apos;s
                business goals.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {["15+ Yrs Experience", "Freight Forwarding", "Supply Chain", "Customs Expert"].map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#f5f4f0] border border-black/10 text-neutral-600 text-xs font-medium px-3 py-1.5 rounded-full tracking-tight hover:bg-[#1a1916] hover:text-[#f5f4f0] hover:border-[#1a1916] transition-all duration-300 cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Globe, num: "30+", label: "Countries" },
              { icon: TrendingUp, num: "50K+", label: "Shipments" },
              { icon: Award, num: "15+", label: "Years" },
            ].map(({ icon: Icon, num, label }, i) => (
              <div
                key={label}
                style={{ transitionDelay: isVisible ? `${320 + i * 60}ms` : "0ms" }}
                className={`bg-white/80 border border-black/10 rounded-2xl px-4 py-5 flex flex-col justify-between min-h-[100px] sm:min-h-[110px] bento-card transition-all duration-500 ease-out transform ${
                  isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.98]"
                }`}
              >
                <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center">
                  <Icon size={13} className="text-neutral-400" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold tracking-[-0.04em] text-neutral-900">{num}</p>
                  <p className="text-[10px] font-medium tracking-[0.08em] uppercase text-neutral-400 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  const sectionRef = useRef(null);
  const isVisible = useFadeIn(sectionRef, 0.05);

  const TEAM = [
    { name: "Arun Sam Alfred", role: "Founder & CEO", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400" },
    { name: "Sarah Mitchell", role: "Head of Operations", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400" },
    { name: "James Okonkwo", role: "Africa Regional Lead", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400" },
    { name: "Priya Nair", role: "Customs & Compliance", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400" },
    { name: "David Chen", role: "Asia Pacific Director", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400" },
    { name: "Layla Hassan", role: "Middle East Lead", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#f5f4f0] font-sans flex flex-col p-4 sm:p-5 gap-3 pt-0 overflow-hidden"
    >
      {/* GROUP PHOTO CARD */}
      <div className={`group relative rounded-2xl overflow-hidden min-h-[280px] sm:min-h-[400px] lg:min-h-[480px] transition-all duration-700 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}>
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070"
          alt="Canaan Global International team"
          className="w-full h-full object-cover absolute inset-0 object-center transition-transform duration-[1.2s] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent group-hover:via-black/30 transition-all duration-500" />

        {/* TOP LEFT — label */}
        <div className="absolute top-0 left-0 bg-white/90 backdrop-blur-sm px-4 py-3 sm:px-7 sm:py-5 rounded-br-2xl z-10">
          <span className="text-[10px] sm:text-xs font-medium tracking-[0.12em] uppercase text-neutral-400">
            Our Team
          </span>
        </div>

        {/* TOP RIGHT — count */}
        <div className="absolute top-0 right-0 bg-white/90 backdrop-blur-sm px-4 py-3 sm:px-7 sm:py-5 rounded-bl-2xl z-10 flex items-center gap-2">
          <Users size={13} className="text-neutral-400" />
          <span className="text-[11px] sm:text-sm font-medium text-neutral-900 tracking-tight">
            100+ team members worldwide
          </span>
        </div>

        {/* BOTTOM overlay */}
        <div className="absolute bottom-0 left-0 right-0 sm:right-auto bg-white/90 backdrop-blur-sm px-5 py-5 sm:px-7 sm:py-7 rounded-tr-2xl z-10">
          <p className="text-[10px] font-medium tracking-[0.12em] uppercase text-neutral-400 mb-2">
            Canaan Global International
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-[2.4rem] font-bold tracking-[-0.03em] leading-[1.18] text-neutral-900">
            One team, one mission,<br className="hidden sm:block" /> worldwide
          </h2>
        </div>

        {/* BOTTOM RIGHT — culture tags (desktop) */}
        <div className="hidden sm:flex absolute bottom-0 right-0 bg-white/90 backdrop-blur-sm px-7 py-7 rounded-tl-2xl z-10 flex-col gap-2">
          {["People-first culture", "Diverse & global", "Always delivering"].map((val) => (
            <div key={val} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-neutral-700 tracking-tight">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TEAM MEMBER CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {TEAM.map((member, i) => (
          <div
            key={member.name}
            style={{ transitionDelay: isVisible ? `${(i % 6) * 60}ms` : "0ms" }}
            className={`relative rounded-2xl overflow-hidden min-h-[200px] sm:min-h-[240px] group bento-card transition-all duration-500 ease-out transform ${
              i === 0 ? "col-span-2 sm:col-span-1 lg:col-span-1" : ""
            } ${
              isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.98]"
            }`}
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover absolute inset-0 transition-transform duration-[0.8s] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent group-hover:via-black/25 transition-all duration-300" />

            {i === 0 && (
              <div className="absolute top-0 left-0 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-br-xl z-10">
                <span className="text-[9px] font-bold tracking-[0.1em] uppercase text-neutral-900">
                  Founder
                </span>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
              <p className="text-white text-xs font-bold tracking-tight leading-tight">{member.name}</p>
              <p className="text-white/60 text-[10px] tracking-tight mt-0.5">{member.role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM STRIP */}
      <div
        className={`flex flex-wrap gap-2 px-1 transition-all duration-700 ease-out transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ transitionDelay: isVisible ? "250ms" : "0ms" }}
      >
        {["Leadership Team", "Operations", "Customs & Compliance", "Asia Pacific", "Middle East", "Africa", "Americas", "Europe"].map((tag) => (
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

export default function AboutEmbed() {
  return (
    <>
      <FounderSection />
      <TeamSection />
    </>
  );
}
