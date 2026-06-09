"use client";

import { useRef } from "react";
import Image from "next/image";
import { Globe, Award, TrendingUp, Quote, Mail, MapPin } from "lucide-react";
import useFadeIn from "../hooks/useFadeIn";
import team1 from "../../company photos/team1.jpeg";
import team2 from "../../company photos/team2.jpeg";
import team3 from "../../company photos/team3.jpeg";
import team4 from "../../company photos/team4.jpeg";
import team5 from "../../company photos/team5.jpeg";
import arun from "../../company photos/Arun.png";
import cgi1 from "../../company photos/cgi1.png";
import cgi2 from "../../company photos/cgi2.png";
import logistics1 from "../../company photos/logistics1.png";
import logistics2 from "../../company photos/logistics2.png";

function FounderSection() {
  const sectionRef = useRef(null);
  const isVisible = useFadeIn(sectionRef, 0.05);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#f5f4f0] font-sans flex flex-col p-4 sm:p-5 gap-3 overflow-hidden"
    >
      <div
        className={`group relative rounded-2xl overflow-hidden min-h-[180px] sm:min-h-[200px] transition-all duration-700 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
      >
        <Image
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070"
          alt="Canaan Global International"
          fill
          className="object-cover absolute inset-0 transition-transform duration-[1.2s] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/45 group-hover:bg-black/50 transition-colors duration-500" />

        <div className="absolute bottom-0 left-0 right-0 sm:right-auto bg-white/90 backdrop-blur-sm px-5 py-5 sm:px-7 sm:py-6 rounded-tr-2xl z-10">
          <h1 className="text-2xl sm:text-3xl lg:text-[2.4rem] font-bold tracking-[-0.03em] leading-[1.18] text-neutral-900">
            The people behind<br className="hidden sm:block" /> Canaan Global
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        <div
          style={{ transitionDelay: isVisible ? "100ms" : "0ms" }}
          className={`lg:col-span-2 relative rounded-2xl overflow-hidden min-h-[360px] sm:min-h-[440px] group cursor-pointer bento-card transition-all duration-700 ease-out transform ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.98]"
            }`}
        >
          <Image
            src={arun}
            alt="Arun Samuel Alfred — Founder"
            fill
            className="object-cover object-top absolute inset-0 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent group-hover:via-black/20 transition-all duration-500" />

          <div className="absolute top-0 left-0 bg-white/90 backdrop-blur-sm px-4 py-3 sm:px-5 sm:py-4 rounded-br-2xl z-10">
            <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-neutral-400">
              Founder &amp; CEO
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
            <p className="text-white/60 text-xs font-medium tracking-[0.1em] uppercase mb-1">
              CEO - Canaan Global International
            </p>
            <h2 className="text-white text-2xl sm:text-3xl font-bold tracking-[-0.03em] leading-tight">
              Arun Samuel Alfred
            </h2>
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-3">
          <div
            style={{ transitionDelay: isVisible ? "180ms" : "0ms" }}
            className={`group relative bg-neutral-900 rounded-2xl px-6 py-6 sm:px-8 sm:py-8 overflow-hidden bento-card transition-all duration-500 ease-out transform ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.98]"
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
                Arun Samuel Alfred, Founder
              </span>
            </div>
          </div>

          <div
            style={{ transitionDelay: isVisible ? "225ms" : "0ms" }}
            className={`group relative bg-neutral-900 rounded-2xl px-6 py-6 sm:px-8 sm:py-8 overflow-hidden bento-card transition-all duration-500 ease-out transform ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.98]"
              }`}
          >
            <Quote size={40} className="text-white/10 absolute top-4 right-4 group-hover:scale-110 transition-transform duration-500" />
            <div className="relative z-10 flex flex-col gap-5">
              <div>
                <p className="text-[10px] font-medium tracking-[0.12em] uppercase text-white/45">
                  Guiding Promise
                </p>
                <h3 className="mt-2 text-xl sm:text-2xl font-semibold tracking-[-0.03em] leading-[1.3] text-white">
                  Deuteronomy 8 shaped the company&apos;s sense of gratitude,
                  stewardship, and responsibility from the start.
                </h3>
              </div>

              <p className="text-sm sm:text-[15px] text-white/75 leading-relaxed">
                From the first shipment to a presence across 30+ countries,
                Canaan Global International has been built on the belief that
                success and provision are entrusted blessings. Deuteronomy 8:18
                remains a founding reminder that opportunity comes with a duty
                to serve clients faithfully, lead with humility, and conduct
                business with excellence and integrity.
              </p>

              {/* Tag pills intentionally removed per request */}
            </div>
          </div>

          <div
            style={{ transitionDelay: isVisible ? "260ms" : "0ms" }}
            className={`relative bg-white/80 border border-black/10 rounded-2xl px-5 py-5 sm:px-7 sm:py-6 overflow-hidden bento-card transition-all duration-500 ease-out transform ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.98]"
              }`}
          >
            <div className="absolute top-0 left-0 bg-white/90 backdrop-blur-sm px-4 py-2.5 rounded-br-2xl z-10">
              <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-neutral-400">
                Background
              </span>
            </div>

            <div className="pt-8 flex flex-col gap-4">
              <p className="text-sm sm:text-[15px] text-neutral-600 leading-relaxed">
                Arun Samuel Alfred founded Canaan Global International with a singular
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

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Globe, num: "30+", label: "Countries" },
              { icon: TrendingUp, num: "50K+", label: "Shipments" },
              { icon: Award, num: "15+", label: "Years" },
            ].map(({ icon: Icon, num, label }, i) => (
              <div
                key={label}
                style={{ transitionDelay: isVisible ? `${320 + i * 60}ms` : "0ms" }}
                className={`bg-white/80 border border-black/10 rounded-2xl px-4 py-5 flex flex-col justify-between min-h-[100px] sm:min-h-[110px] bento-card transition-all duration-500 ease-out transform ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.98]"
                  }`}
              >
                <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center">
                  <Icon size={13} className="text-neutral-400" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold tracking-[-0.04em] text-neutral-900">{num}</p>
                  <p className="text-[10px] font-medium tracking-[0.08em] uppercase text-neutral-400 mt-0.5">
                    {label}
                  </p>
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

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#f5f4f0] font-sans flex flex-col p-4 sm:p-5 gap-3 pt-0 overflow-hidden"
    >
      <div
        className={`group relative rounded-2xl overflow-hidden min-h-[280px] sm:min-h-[400px] lg:min-h-[480px] transition-all duration-700 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
      >
        <Image
          src={team1}
          alt="Canaan Global International team"
          fill
          className="object-cover absolute inset-0 object-center transition-transform duration-[1.2s] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent group-hover:via-black/30 transition-all duration-500" />

        <div className="absolute top-0 left-0 bg-white/90 backdrop-blur-sm px-4 py-3 sm:px-7 sm:py-5 rounded-br-2xl z-10">
          <span className="text-[10px] sm:text-xs font-medium tracking-[0.12em] uppercase text-neutral-400">
            Our Team
          </span>
        </div>

        {/* Top-right team count removed per request */}

        <div className="absolute bottom-0 left-0 right-0 sm:right-auto bg-white/90 backdrop-blur-sm px-5 py-5 sm:px-7 sm:py-7 rounded-tr-2xl z-10">
          <p className="text-[10px] font-medium tracking-[0.12em] uppercase text-neutral-400 mb-2">
            Canaan Global International
          </p>
          <h2 className="text-xl sm:text-2xl lg:text-[1.8rem] font-bold tracking-[-0.03em] leading-[1.18] text-neutral-900">
            One team, one mission,<br className="hidden sm:block" /> worldwide
          </h2>
        </div>

        <div className="hidden sm:flex absolute bottom-0 right-0 bg-white/90 backdrop-blur-sm px-7 py-7 rounded-tl-2xl z-10 flex-col gap-2">
          {[
            "People-first culture",
            "Diverse & global",
            "Always delivering",
          ].map((val) => (
            <div key={val} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-neutral-700 tracking-tight">
                {val}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const TEAM_MEMBERS = [
  {
    name: "John Doe",
    role: "Chief Operating Officer",
    email: "coo@canaanglobal.com",
    image: team2,
  },
  {
    name: "Jane Smith",
    role: "Head of Customs",
    email: "customs@canaanglobal.com",
    image: team3,
  },
  {
    name: "Michael Johnson",
    role: "Global Logistics Director",
    email: "logistics@canaanglobal.com",
    image: team4,
  },
  {
    name: "Emily Davis",
    role: "Client Relations Manager",
    email: "clients@canaanglobal.com",
    image: team5,
  },
];

const BRANCHES = [
  { city: "Chennai", desc: "Headquarters & Primary Operations", image: cgi1 },
  { city: "Vilinjiyam", desc: "Strategic Port Operations", image: logistics1 },
  { city: "Tuticorin", desc: "Southern Gateway Hub", image: cgi2 },
  { city: "Madurai", desc: "Inland Logistics Center", image: logistics2 },
];

function BranchesSection() {
  const sectionRef = useRef(null);
  const isVisible = useFadeIn(sectionRef, 0.05);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#f5f4f0] font-sans flex flex-col p-4 sm:p-5 gap-3 pt-0 pb-12 overflow-hidden"
    >
      <div className={`mb-6 px-2 transition-all duration-700 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">Our Branches</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {BRANCHES.map((branch, i) => (
          <div
            key={i}
            style={{ transitionDelay: isVisible ? `${i * 100}ms` : "0ms" }}
            className={`group relative bg-white/80 border border-black/10 rounded-2xl overflow-hidden min-h-[300px] bento-card transition-all duration-700 ease-out transform hover:bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.98]"}`}
          >
            <div className="relative h-[160px] w-full overflow-hidden">
              <Image
                src={branch.image}
                alt={branch.city}
                fill
                className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-40 transition-opacity duration-500" />
            </div>

            <div className="p-5 flex flex-col justify-between h-[calc(100%-160px)]">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="text-amber-600 w-4 h-4" />
                  <h3 className="text-xl font-bold tracking-tight text-neutral-900 group-hover:text-amber-800 transition-colors duration-300">
                    {branch.city}
                  </h3>
                </div>
                <p className="text-[13px] sm:text-sm font-medium leading-relaxed text-neutral-500">
                  {branch.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HierarchySection() {
  const sectionRef = useRef(null);
  const isVisible = useFadeIn(sectionRef, 0.05);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#f5f4f0] font-sans flex flex-col p-4 sm:p-5 gap-3 pt-0 pb-12 overflow-hidden"
    >
      <div className={`mb-6 px-2 transition-all duration-700 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">Our Crew</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {TEAM_MEMBERS.map((member, i) => (
          <div
            key={i}
            style={{ transitionDelay: isVisible ? `${i * 120}ms` : "0ms" }}
            className={`group relative bg-white/80 border border-black/10 rounded-2xl overflow-hidden min-h-[380px] bento-card transition-all duration-700 ease-out transform ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.98]"}`}
          >
            <div className="relative h-[240px] w-full overflow-hidden">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover object-top transition-transform duration-[1.2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
            </div>

            <div className="p-5 flex flex-col justify-between h-[calc(100%-240px)]">
              <div>
                <p className="text-[10px] font-medium tracking-[0.12em] uppercase text-amber-700/80 mb-1">
                  {member.role}
                </p>
                <h3 className="text-xl font-bold tracking-[-0.02em] text-neutral-900 group-hover:text-amber-800 transition-colors duration-300">
                  {member.name}
                </h3>
              </div>
              
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-black/5">
                <Mail size={14} className="text-neutral-400" />
                <a href={`mailto:${member.email}`} className="text-[11px] font-medium tracking-wide text-neutral-500 hover:text-neutral-900 transition-colors duration-300">
                  {member.email}
                </a>
              </div>
            </div>
          </div>
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
      <BranchesSection />
      <HierarchySection />
    </>
  );
}
