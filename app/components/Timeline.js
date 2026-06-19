// ── Hot reload trigger for new timeline images ──
"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import timeline1 from "@/app/assets/images/company/timeline1.png";
import timeline2 from "@/app/assets/images/company/timeline2.png";
import timeline3a from "@/app/assets/images/company/timeline 3a.png";
import timeline3b from "@/app/assets/images/company/timeline 3b.png";
import timeline3c from "@/app/assets/images/company/timeline 3c.png";
import timeline4 from "@/app/assets/images/company/timeline4.png";
import timeline5a from "@/app/assets/images/company/timeline5a.png";
import timeline5b from "@/app/assets/images/company/timeline5b.png";
import timeline5c from "@/app/assets/images/company/timeline5c.png";
import timeline5d from "@/app/assets/images/company/timeline5d.png";
import trucks1 from "@/app/assets/images/company/trucks1.png";
import {
  Anchor, Globe, Truck, MapPin, Award, ArrowRight,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const CHAPTERS = [
  {
    id: "origin",
    chapter: "01",
    total: "05",
    year: "2009",
    label: "FOUNDING",
    heading: "One idea.\nOne Promise.",
    body: "Founded in Tuticorin, Tamil Nadu, a humble port city with global ambitions. Canaan Global International began with a few trucks and an unshakeable commitment to reliable freight.",
    scripture: "Remember the Lord your God, for it is He who gives you the ability to produce wealth...",
    scriptureRef: "Deuteronomy 8:18",
    photo: timeline1.src,
    stat: { num: "2009", label: "Year founded" },
    accent: "#1A5276",
    icon: Anchor,
  },
  {
    id: "growth-early",
    chapter: "02",
    total: "05",
    year: "2010 – 2013",
    label: "EARLY GROWTH",
    heading: "Building the\nfoundation.",
    body: "The fleet grew. The routes expanded. Word spread that Canaan Global delivered on time, every time. South India's industrial corridors became our home territory.",
    photo: timeline2.src,
    stat: { num: "12", label: "Trucks by 2013" },
    accent: "#1E8449",
    icon: Truck,
  },
  {
    id: "accel",
    chapter: "03",
    total: "05",
    year: "2014 – 2017",
    label: "ACCELERATION",
    heading: "Scaling across\nIndia.",
    body: "Port-to-port. City-to-city. Warehouse to warehouse. Our network stretched from Chennai to Mumbai, connecting manufacturers with ports and global supply chains.",
    photo: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2000",
    carouselImages: [timeline3a.src, timeline3b.src, timeline3c.src],
    stat: { num: "4", label: "Major ports served" },
    accent: "#6C3483",
    icon: MapPin,
  },
  {
    id: "global",
    chapter: "04",
    total: "05",
    year: "2018 – 2020",
    label: "GOING GLOBAL",
    heading: "Beyond borders.\nBeyond limits.",
    body: "Freight forwarding, customs clearance, and international shipping. Canaan Global became a full-service logistics partner, moving goods across continents with care.",
    photo: timeline4.src,
    stat: { num: "30+", label: "Countries served" },
    accent: "#D4A017",
    icon: Globe,
  },
  {
    id: "today",
    chapter: "05",
    total: "05",
    year: "2021 – Today",
    label: "TODAY",
    heading: "A legacy of\nmovement.",
    body: "Four divisions. Over 50,000 shipments. 42 vehicles strong. Canaan Global continues to redefine logistics, connecting India to the world one shipment at a time.",
    carouselImages: [timeline5a.src, timeline5b.src, timeline5c.src, timeline5d.src],
    stat: { num: "50K+", label: "Shipments delivered" },
    accent: "#C0392B",
    icon: Award,
  },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { setVisible(entry.isIntersecting); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ImageCarousel({ images, alt }) {
  const [index, setIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const pausedRef = useRef(false);
  const autoRef = useRef(null);

  useEffect(() => {
    autoRef.current = setInterval(() => {
      if (!pausedRef.current) setIndex((i) => (i + 1) % images.length);
    }, 3000);
    return () => clearInterval(autoRef.current);
  }, [images.length]);

  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.clientX;
    setDragOffset(0);
    pausedRef.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const delta = e.clientX - startXRef.current;
    setDragOffset(delta);
  };

  const endDrag = (e) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    const delta = e.clientX - startXRef.current;
    setDragOffset(0);
    if (Math.abs(delta) > 60) {
      if (delta < 0) setIndex((i) => (i + 1) % images.length);
      else setIndex((i) => (i - 1 + images.length) % images.length);
    }
    pausedRef.current = false;
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden select-none"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      style={{ touchAction: "pan-y", cursor: "grab" }}
    >
      <div
        className="h-full flex"
        style={{
          transform: `translateX(calc(${-index * 100}% + ${dragOffset}px))`,
          transition: isDragging ? "none" : "transform 0.45s ease",
        }}
      >
        {images.map((src, i) => (
          <div key={i} className="relative w-full h-full flex-shrink-0">
            <Image src={src} alt={`${alt} ${i + 1}`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ChapterCard({ chapter, index }) {
  const [ref, visible] = useReveal(0.08);
  const isEven = index % 2 === 0;
  const Icon = chapter.icon;

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(48px)",
        transition: "opacity 0.85s ease-out, transform 0.85s ease-out",
      }}
    >
      <div className="rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[480px]">

        {/* Photo side */}
        <div className={`relative min-h-[280px] lg:min-h-0 ${!isEven ? "lg:order-2" : ""}`}>
          {Array.isArray(chapter.carouselImages) ? (
            <ImageCarousel images={chapter.carouselImages} alt={chapter.heading.replace(/\n/g, " ")} />
          ) : typeof chapter.photo === "string" ? (
            <Image
              src={chapter.photo}
              alt={chapter.heading.replace(/\n/g, " ")}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <Image
              src={chapter.photo && chapter.photo.src ? chapter.photo.src : chapter.photo}
              alt={chapter.heading.replace(/\n/g, " ")}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />

          {/* Chapter number watermark */}
          <div
            className="absolute bottom-0 right-0 font-black select-none pointer-events-none"
            style={{
              fontSize: "clamp(100px, 18vw, 200px)",
              color: "rgba(255,255,255,0.06)",
              lineHeight: 0.82,
            }}
          >
            {chapter.chapter}
          </div>

          {/* Year + counter badge */}
          <div className="absolute top-5 left-5 flex items-center gap-2.5">
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">
              {chapter.chapter} / {chapter.total}
            </span>
            <span className="w-px h-3 bg-white/20" />
            <span className="text-[13px] font-medium text-white/80">{chapter.year}</span>
          </div>
        </div>

        {/* Content side */}
        <div
          className={`bg-white px-7 py-9 sm:px-10 sm:py-11 flex flex-col justify-center gap-5 overflow-hidden ${!isEven ? "lg:order-1" : ""}`}
        >
          {/* Accent bar + label */}
          <div
            className="flex items-center gap-3"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : `translateX(${isEven ? "56px" : "-56px"})`,
              transition: "opacity 0.6s ease-out 0.1s, transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s",
            }}
          >
            <div className="w-[3px] h-7 rounded-full shrink-0" style={{ background: chapter.accent }} />
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-neutral-400">
              {chapter.label}
            </span>
          </div>

          {/* Heading */}
          <h3
            className="font-bold tracking-[-0.03em] leading-[1.12] text-neutral-900 whitespace-pre-line"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.6rem)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : `translateX(${isEven ? "56px" : "-56px"})`,
              transition: "opacity 0.65s ease-out 0.22s, transform 0.65s cubic-bezier(0.16,1,0.3,1) 0.22s",
            }}
          >
            {chapter.heading}
          </h3>

          {/* Body */}
          <p
            className="text-neutral-500 text-[15px] leading-[1.72]"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : `translateX(${isEven ? "56px" : "-56px"})`,
              transition: "opacity 0.65s ease-out 0.34s, transform 0.65s cubic-bezier(0.16,1,0.3,1) 0.34s",
            }}
          >
            {chapter.body}
          </p>

          {/* Scripture / founding reference (optional) */}
          {chapter.scripture && (
            <blockquote
              className="mt-4 text-neutral-700 italic border-l-2 pl-4"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(0)" : `translateX(${isEven ? "56px" : "-56px"})`,
                transition: "opacity 0.65s ease-out 0.34s, transform 0.65s cubic-bezier(0.16,1,0.3,1) 0.34s",
              }}
            >
              <p className="text-[15px]">{chapter.scripture}</p>
              {chapter.scriptureRef && (
                <div className="mt-2 text-xs text-neutral-500 font-medium">{chapter.scriptureRef}</div>
              )}
            </blockquote>
          )}

          {/* Stat chip */}
          <div
            className="flex items-center gap-3 pt-1"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : `translateX(${isEven ? "56px" : "-56px"})`,
              transition: "opacity 0.65s ease-out 0.46s, transform 0.65s cubic-bezier(0.16,1,0.3,1) 0.46s",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: chapter.accent + "18" }}
            >
              <Icon size={17} style={{ color: chapter.accent }} />
            </div>
            <div>
              <div className="text-xl font-bold tracking-[-0.02em] text-neutral-900 leading-none">
                {chapter.stat.num}
              </div>
              <div className="text-xs text-neutral-400 mt-0.5">{chapter.stat.label}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function TimelineSection() {
  const [headerRef, headerVisible] = useReveal(0.08);
  const [outroRef, outroVisible] = useReveal(0.15);

  return (
    <section className="relative bg-[#f5f4f0] font-sans flex flex-col p-4 sm:p-5 gap-3 sm:gap-4 overflow-hidden">

      {/* HEADER CARD */}
      <div
        ref={headerRef}
        className="rounded-2xl overflow-hidden relative min-h-[380px] sm:min-h-[460px]"
        style={{
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 0.85s ease-out, transform 0.85s ease-out",
        }}
      >
        <Image
          src={trucks1}
          alt="Canaan Global, 15 years of logistics"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/75" />

        <div className="absolute top-0 left-0 bg-[#f5f4f0] px-5 py-3.5 sm:px-7 sm:py-5 rounded-br-2xl z-10">
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase text-neutral-400">
            Our Story
          </span>
        </div>

        <div className="relative z-10 h-full min-h-[380px] sm:min-h-[460px] flex flex-col justify-end p-7 sm:p-12">
          <p
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateX(0)" : "translateX(-48px)",
              transition: "opacity 0.7s ease-out 0.2s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s",
            }}
            className="text-white/50 text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase mb-3"
          >
            Canaan Global International · Est. 2009
          </p>
          <h2
            className="text-white font-bold tracking-[-0.03em] leading-[1.08] max-w-2xl"
            style={{
              fontSize: "clamp(2rem, 5.5vw, 3.75rem)",
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateX(0)" : "translateX(-56px)",
              transition: "opacity 0.75s ease-out 0.35s, transform 0.75s cubic-bezier(0.16,1,0.3,1) 0.35s",
            }}
          >
            15 years of moving<br />the world forward.
          </h2>
          <p
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateX(0)" : "translateX(-48px)",
              transition: "opacity 0.7s ease-out 0.5s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s",
            }}
            className="text-white/60 text-[15px] sm:text-lg mt-4 max-w-xl leading-relaxed"
          >
            From a single truck in Tuticorin to a global logistics network spanning 30+ countries. This is our story.
          </p>
        </div>
      </div>

      {/* CHAPTER CARDS */}
      {CHAPTERS.map((chapter, i) => (
        <ChapterCard key={chapter.id} chapter={chapter} index={i} />
      ))}

      {/* OUTRO */}
      <div
        ref={outroRef}
        className="rounded-2xl overflow-hidden relative min-h-[300px] sm:min-h-[380px]"
        style={{
          opacity: outroVisible ? 1 : 0,
          transform: outroVisible ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 0.9s ease-out, transform 0.9s ease-out",
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2000"
          alt="The journey continues"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 h-full min-h-[300px] sm:min-h-[380px] flex flex-col justify-center items-center text-center px-8 py-14">
          <p className="text-white/40 text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase mb-4">
            The journey continues
          </p>
          <h3
            className="text-white font-bold tracking-[-0.03em] leading-[1.1] max-w-2xl"
            style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
          >
            Ready to move your cargo<br />with confidence?
          </h3>
          <p className="text-white/60 mt-4 text-[15px] max-w-md leading-relaxed">
            Partner with a logistics team that has spent 15 years earning trust, one shipment at a time.
          </p>
          <Link
            href="/#contact"
            className="mt-8 flex items-center gap-2 bg-white text-neutral-900 text-sm font-semibold px-6 py-3 rounded-full hover:bg-neutral-100 active:scale-95 transition-all group w-fit"
          >
            Get in touch
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

    </section>
  );
}
