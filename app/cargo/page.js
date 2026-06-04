"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ArrowDown, ZoomIn } from "lucide-react";

// ─── Cargo Categories ─────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: "all",
    label: "All Cargo",
    desc: "Every shipment we've moved — 14 cargo categories, one gallery.",
    photos: [
      "/cargo/c1/1.jpeg",  "/cargo/c1/2.jpeg",
      "/cargo/c2/1.jpeg",  "/cargo/c2/2.jpeg",
      "/cargo/c3/1.jpeg",  "/cargo/c3/2.jpeg",
      "/cargo/c4/p1.jpeg",  "/cargo/c4/p2.jpeg",
      "/cargo/c5/p1.jpeg",  "/cargo/c5/p2.jpeg",
      "/cargo/c6/1.jpeg",  "/cargo/c6/2.jpeg",
      "/cargo/c7/p1.jpeg",  "/cargo/c7/p2.jpeg",
      "/cargo/c8/1.jpeg",  "/cargo/c8/2.jpeg",
      "/cargo/c9/1.jpeg",  "/cargo/c9/2.jpeg",
      "/cargo/c10/1.jpeg", "/cargo/c10/2.jpeg",
      "/cargo/c11/1.jpeg", "/cargo/c11/2.jpeg",
      "/cargo/c12/1.jpeg", "/cargo/c12/2.jpeg",
      "/cargo/c13/1.jpeg", "/cargo/c13/2.jpeg",
      "/cargo/special/s1.jpeg", "/cargo/special/s2.jpeg",
    ],
  },
  {
    id: "c1",
    label: "Coir & Natural Fibre",
    desc: "Coconut-fibre rolls and natural-fibre products containerised for export.",
    photos: [
      "/cargo/c1/1.jpeg",
      "/cargo/c1/2.jpeg",
      "/cargo/c1/3.jpeg",
      "/cargo/c1/4.jpeg",
      "/cargo/c1/5.jpeg",
    ],
  },
  {
    id: "c2",
    label: "Agricultural Machinery",
    desc: "Tractors, farm equipment, and implements loaded and shipped.",
    photos: [
      "/cargo/c2/1.jpeg",
      "/cargo/c2/2.jpeg",
      "/cargo/c2/3.jpeg",
      "/cargo/c2/4.jpeg",
      "/cargo/c2/5.jpeg",
    ],
  },
  {
    id: "c3",
    label: "Palletised Cargo",
    desc: "Shrink-wrapped pallets — general merchandise handled with care.",
    photos: [
      "/cargo/c3/1.jpeg",
      "/cargo/c3/2.jpeg",
      "/cargo/c3/3.jpeg",
      "/cargo/c3/4.jpeg",
    ],
  },
  {
    id: "c4",
    label: "Industrial Rolls & Coils",
    desc: "HDPE rolls, geotextile coils, and industrial reels in high-cube containers.",
    photos: [
      "/cargo/c4/p1.jpeg",
      "/cargo/c4/p2.jpeg",
      "/cargo/c4/p3.jpeg",
      "/cargo/c4/p4.jpeg",
      "/cargo/c4/p5.jpeg",
    ],
  },
  {
    id: "c5",
    label: "Stones & Marbles",
    desc: "Granite blocks, marble slabs, and natural stone cargo handled at port and loaded for export.",
    photos: [
      "/cargo/c5/p1.jpeg",
      "/cargo/c5/p2.jpeg",
      "/cargo/c5/p3.jpeg",
      "/cargo/c5/p4.jpeg",
      "/cargo/c5/p5.jpeg",
      "/cargo/c5/p6.jpeg",
      "/cargo/c5/p7.jpeg",
      "/cargo/c5/p8.jpeg",
      "/cargo/c5/p9.jpeg",
      "/cargo/c5/p10.jpeg",
      "/cargo/c5/p11.jpeg",
    ],
  },
  {
    id: "c6",
    label: "Chemical Drums & Barrels",
    desc: "Regulated liquid cargo in steel drums, handled safely at port.",
    photos: [
      "/cargo/c6/1.jpeg",
      "/cargo/c6/2.jpeg",
      "/cargo/c6/3.jpeg",
    ],
  },
  {
    id: "c7",
    label: "Bulk Grain & Seeds",
    desc: "Bulk grain, rice, and seed cargo loaded in containers.",
    photos: [
      "/cargo/c7/p1.jpeg",
      "/cargo/c7/p2.jpeg",
      "/cargo/c7/p3.jpeg",
      "/cargo/c7/p4.jpeg",
      "/cargo/c7/p5.jpeg",
      "/cargo/c7/p6.jpeg",
    ],
  },
  {
    id: "c8",
    label: "Bagged Cargo",
    desc: "PP-sacked goods — minerals, chemicals, and processed materials.",
    photos: [
      "/cargo/c8/1.jpeg",
      "/cargo/c8/2.jpeg",
      "/cargo/c8/3.jpeg",
    ],
  },
  {
    id: "c9",
    label: "Bale Cargo",
    desc: "Cargo compressed and wrapped in bales for easy handling and transportation.",
    photos: [
      "/cargo/c9/1.jpeg",
      "/cargo/c9/2.jpeg",
      "/cargo/c9/3.jpeg",
      "/cargo/c9/4.jpeg",
      "/cargo/c9/5.jpeg",
      "/cargo/c9/6.jpeg",
      "/cargo/c9/7.jpeg",
      "/cargo/c9/8.jpeg",
    ],
  },
  {
    id: "c10",
    label: "Cashew & Agri Commodities",
    desc: "Jute-sacked cashew nuts and bulk agricultural produce in containers.",
    photos: [
      "/cargo/c10/1.jpeg",
      "/cargo/c10/2.jpeg",
      "/cargo/c10/3.jpeg",
      "/cargo/c10/4.jpeg",
    ],
  },
  {
    id: "c11",
    label: "Pipes",
    desc: "Heavy pipes used for construction and infrastructure projects.",
    photos: [
      "/cargo/c11/1.jpeg",
      "/cargo/c11/2.jpeg",
      "/cargo/c11/3.jpeg",
    ],
  },
  {
    id: "c12",
    label: "Heavy Machinery",
    desc: "JCBs, excavators, bulldozers, and construction equipment transported across India.",
    photos: [
      "/cargo/c12/1.jpeg",
      "/cargo/c12/2.jpeg",
      "/cargo/c12/3.jpeg",
      "/cargo/c12/4.jpeg",
    ],
  },
  {
    id: "c13",
    label: "Bulk Liquid & Gas Cargo",
    desc: "Tankers, ISO tanks, and pressurised vessels carrying liquid and gas commodities.",
    photos: [
      "/cargo/c13/1.jpeg",
      "/cargo/c13/2.jpeg",
      "/cargo/c13/3.jpeg",
      "/cargo/c13/4.jpeg",
      "/cargo/c13/5.jpeg",
    ],
  },
  {
    id: "special",
    label: "Special Cargo",
    desc: "Out-of-gauge, high-value, and unique consignments that needed extra attention.",
    photos: [
      "/cargo/special/s1.jpeg",
      "/cargo/special/s2.jpeg",
    ],
  },
];

// ─── Photo Card ───────────────────────────────────────────────────────────────

function PhotoCard({ src, index, onClick }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClick={() => onClick(index)}
      className="relative overflow-hidden rounded-xl cursor-pointer group"
      style={{
        aspectRatio: index % 5 === 0 ? "4/3" : index % 3 === 0 ? "3/4" : "1/1",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
        transition: `opacity 0.6s ease-out ${(index % 6) * 55}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${(index % 6) * 55}ms`,
      }}
    >
      <Image
        src={src}
        alt={`Cargo photo ${index + 1}`}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
        <ZoomIn
          size={22}
          className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"
        />
      </div>
    </div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ photos, index, onClose, onPrev, onNext }) {
  // Close on Escape, arrow keys for nav
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.94)" }}
      onClick={onClose}
    >
      {/* Counter */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/40 text-xs font-mono tracking-widest select-none">
        {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
      >
        <X size={16} className="text-white" />
      </button>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 sm:left-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
      >
        <ChevronLeft size={20} className="text-white" />
      </button>

      {/* Image */}
      <div
        className="relative max-w-[90vw] max-h-[88vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          key={photos[index]}
          src={photos[index]}
          alt={`Cargo ${index + 1}`}
          width={1200}
          height={900}
          className="object-contain max-h-[88vh] max-w-[90vw] rounded-xl shadow-2xl"
          style={{ width: "auto", height: "auto" }}
          priority
        />
      </div>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 sm:right-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
      >
        <ChevronRight size={20} className="text-white" />
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CargoPage() {
  const [pageVisible, setPageVisible] = useState(false);
  const [activeCat, setActiveCat] = useState("all");
  const [gridKey, setGridKey] = useState(0);
  const [galleryVisible, setGalleryVisible] = useState(true);
  const [lightbox, setLightbox] = useState(null);
  const tabsRef = useRef(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setPageVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const currentCat = CATEGORIES.find((c) => c.id === activeCat) || CATEGORIES[0];

  const switchCat = useCallback((id) => {
    if (id === activeCat) return;
    // Fade gallery out
    setGalleryVisible(false);
    setTimeout(() => {
      setActiveCat(id);
      setGridKey((k) => k + 1);
      requestAnimationFrame(() => setGalleryVisible(true));
    }, 200);
    // Auto-scroll the clicked tab to centre of strip
    const btn = tabsRef.current?.querySelector(`[data-id="${id}"]`);
    btn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeCat]);

  const openLightbox = useCallback((index) => {
    setLightbox({ photos: currentCat.photos, index });
  }, [currentCat]);

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prevPhoto = useCallback(() =>
    setLightbox((lb) => lb ? { ...lb, index: (lb.index - 1 + lb.photos.length) % lb.photos.length } : null),
    []);
  const nextPhoto = useCallback(() =>
    setLightbox((lb) => lb ? { ...lb, index: (lb.index + 1) % lb.photos.length } : null),
    []);

  return (
    <>
      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          photos={lightbox.photos}
          index={lightbox.index}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}

      <main
        className="relative min-h-screen bg-[#f5f4f0] font-sans"
        style={{
          opacity: pageVisible ? 1 : 0,
          transform: pageVisible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.45s ease-out 0.15s, transform 0.45s ease-out 0.15s",
        }}
      >
        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section className="flex flex-col p-4 sm:p-5 gap-3">

          {/* Hero image card */}
          <div
            className="relative rounded-2xl overflow-hidden min-h-[260px] sm:min-h-[340px] flex flex-col justify-end p-6 sm:p-10"
          >
            {/* Background photo */}
            <img
              src="/cargo/trucks2.png"
              alt="Canaan fleet"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: "center 55%" }}
            />

            {/* Multi-stop gradient overlay — dark at bottom-left for text, fades to transparent top-right */}
            <div
              className="absolute inset-0"
              style={{
                background: [
                  "linear-gradient(to top, rgba(5,7,20,0.92) 0%, rgba(5,7,20,0.65) 40%, rgba(5,7,20,0.25) 70%, rgba(5,7,20,0.10) 100%)",
                  "linear-gradient(to right, rgba(5,7,20,0.55) 0%, transparent 65%)",
                ].join(", "),
              }}
            />

            {/* TOP LEFT badge */}
            <div className="absolute top-0 left-0 bg-black/30 backdrop-blur-md px-4 py-3 sm:px-6 sm:py-4 rounded-br-2xl border-r border-b border-white/10">
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">Cargo Gallery</span>
            </div>

            {/* TOP RIGHT — live count */}
            <div className="absolute top-0 right-0 bg-black/30 backdrop-blur-md px-4 py-3 sm:px-6 sm:py-4 rounded-bl-2xl border-l border-b border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-[11px] sm:text-sm font-medium text-white/70 tracking-tight">
                {CATEGORIES.slice(1).length} cargo types · 50+ photos
              </span>
            </div>

            <div className="relative z-10 flex flex-col gap-3 max-w-2xl">
              <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-white/40">
                Canaan Global International
              </p>
              <h1
                className="text-white font-black tracking-[-0.04em] leading-[0.92]"
                style={{ fontSize: "clamp(2.8rem, 9vw, 6.5rem)", textShadow: "0 4px 32px rgba(0,0,0,0.4)" }}
              >
                What we<br />move.
              </h1>
              <p className="text-white/55 text-sm sm:text-base leading-relaxed max-w-md mt-1">
                Real shipments. Real cargo. A living record of every consignment we've moved — from coir to construction machinery.
              </p>
            </div>

            {/* Scroll hint */}
            <div className="absolute bottom-0 right-0 bg-[#f5f4f0] px-5 py-4 rounded-tl-2xl flex items-center gap-2">
              <span className="hidden sm:inline text-[11px] font-medium text-neutral-400 tracking-[0.1em] uppercase">Browse</span>
              <div className="w-7 h-7 rounded-full border-2 border-neutral-300 flex items-center justify-center animate-bounce">
                <ArrowDown size={12} className="text-neutral-500" />
              </div>
            </div>
          </div>
        </section>

        {/* ══ GALLERY ══════════════════════════════════════════════════════ */}
        <section className="flex flex-col p-4 sm:p-5 gap-4 pt-0">

          {/* Category tab strip */}
          <div className="relative">
            {/* Left edge fade */}
            <div className="absolute left-0 top-0 bottom-1 w-10 bg-gradient-to-r from-[#f5f4f0] to-transparent z-10 pointer-events-none" />
            {/* Right edge fade */}
            <div className="absolute right-0 top-0 bottom-1 w-10 bg-gradient-to-l from-[#f5f4f0] to-transparent z-10 pointer-events-none" />

            <div
              ref={tabsRef}
              className="flex gap-2 overflow-x-auto pb-1 px-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {CATEGORIES.map((cat) => {
                const isActive = activeCat === cat.id;
                return (
                  <button
                    key={cat.id}
                    data-id={cat.id}
                    onClick={() => switchCat(cat.id)}
                    style={{
                      transition: "background 0.22s ease, color 0.22s ease, box-shadow 0.22s ease, transform 0.18s ease",
                    }}
                    className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-2xl text-[12px] font-semibold tracking-wide ${
                      isActive
                        ? "bg-neutral-900 text-white shadow-lg scale-[1.04]"
                        : "bg-white text-neutral-500 shadow-sm hover:bg-neutral-100 hover:text-neutral-800 hover:scale-[1.02]"
                    }`}
                  >
                    {/* Thumbnail preview */}
                    <span
                      className="w-5 h-5 rounded-md overflow-hidden flex-shrink-0"
                      style={{ opacity: isActive ? 0.75 : 0.45 }}
                    >
                      <img
                        src={cat.photos[0]}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </span>

                    {cat.label}

                    {/* Count badge */}
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none"
                      style={{
                        background: isActive ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.07)",
                        color: isActive ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.4)",
                      }}
                    >
                      {cat.photos.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gallery fade wrapper — fades out and back in on category switch */}
          <div
            style={{
              opacity: galleryVisible ? 1 : 0,
              transform: galleryVisible ? "translateY(0px)" : "translateY(10px)",
              transition: "opacity 0.22s ease-out, transform 0.22s ease-out",
            }}
          >
            {/* Category descriptor */}
            <div className="flex items-center justify-between px-1 mb-4">
              <div>
                <h2 className="text-base font-bold tracking-tight text-neutral-900">{currentCat.label}</h2>
                <p className="text-xs text-neutral-500 mt-0.5">{currentCat.desc}</p>
              </div>
              <span className="text-xs font-mono text-neutral-400 shrink-0 ml-4">
                {currentCat.photos.length} photos
              </span>
            </div>

            {/* Masonry grid */}
            <div
              key={gridKey}
              className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3"
            >
              {currentCat.photos.map((src, i) => (
                <PhotoCard key={src} src={src} index={i} onClick={openLightbox} />
              ))}
            </div>
          </div>

          <div className="h-4" />
        </section>
      </main>

      <style jsx global>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}
