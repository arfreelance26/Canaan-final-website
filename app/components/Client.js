"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import useScrollReveal from "../hooks/useScrollReveal";

const CLIENTS = [
  { name: "Maersk",       img: "/clients/MAERSK.jpg" },
  { name: "Hapag-Lloyd",  img: "/clients/Hapag Lloyd.jpg" },
  { name: "MSC",          img: "/clients/MSC.jpg" },
  { name: "Evergreen",    img: "/clients/Evergreen.jpg" },
  { name: "OOCL",         img: "/clients/OOCL.jpg" },
  { name: "ONE",          img: "/clients/ONE.jpg" },
  { name: "COSCO",        img: "/clients/COSCO.jpg" },
  { name: "CMA CGM",      img: "/clients/CMA CGM.jpg" },
  { name: "ZIM",          img: "/clients/ZIM.jpg" },
  { name: "PIL",          img: "/clients/PIL.jpg" },
  { name: "Hyundai MM",   img: "/clients/HYUNDAI.jpg" },
  { name: "SCI",          img: "/clients/SCI.jpg" },
  { name: "Yang Ming",    img: "/clients/YANG MING.jpg" },
  { name: "Hamburg Sud",  img: "/clients/HAMBURG-SUD.jpg" },
  { name: "FESCO",        img: "/clients/FESCO.jpg" },
  { name: "Bertschi",     img: "/clients/BERTSCHI.jpg" },
];

// Last card animation ends at: delay(900ms) + duration(650ms) + buffer(80ms)
const ANIM_DONE_AT = (CLIENTS.length - 1) * 60 + 650 + 80;

// Chebyshev distance in the grid gives the dock scale falloff
function getDockScale(i, hoveredIdx, cols) {
  if (hoveredIdx === null) return 1;
  const dist = Math.max(
    Math.abs(Math.floor(i / cols) - Math.floor(hoveredIdx / cols)),
    Math.abs((i % cols) - (hoveredIdx % cols))
  );
  if (dist === 0) return 1.32;
  if (dist === 1) return 1.14;
  if (dist === 2) return 1.05;
  return 1;
}

export default function ClientsSection() {
  const sectionRef = useRef(null);
  const gridRef    = useRef(null);
  const isVisible  = useScrollReveal(sectionRef, 0.05);

  const [doneAnimating, setDoneAnimating] = useState(false);
  const [hoveredIdx,    setHoveredIdx]    = useState(null);
  const [cols,          setCols]          = useState(4);

  // Detect actual column count from the CSS grid so mobile (3) and desktop (4) both work
  useEffect(() => {
    const update = () => {
      if (!gridRef.current) return;
      const n = window.getComputedStyle(gridRef.current)
        .gridTemplateColumns.trim().split(/\s+/).length;
      if (n > 0) setCols(n);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // After the last domino card finishes, hand off to hover/dock mode
  useEffect(() => {
    if (isVisible) {
      setDoneAnimating(false);
      const t = setTimeout(() => setDoneAnimating(true), ANIM_DONE_AT);
      return () => clearTimeout(t);
    } else {
      setDoneAnimating(false);
      setHoveredIdx(null);
    }
  }, [isVisible]);

  return (
    <>
      <style>{`
        @keyframes cardSlideLeft {
          0%   { opacity: 0; transform: perspective(1000px) translateX(-100px) rotateY(-18deg) scale(0.95); }
          60%  { opacity: 1; transform: perspective(1000px) translateX(6px)    rotateY(2deg)   scale(1.01); }
          100% { opacity: 1; transform: perspective(1000px) translateX(0)      rotateY(0deg)   scale(1);    }
        }
        @keyframes cardDominoFall {
          0%   { opacity: 0; transform: perspective(800px) translateY(-28px) rotateX(20deg) scale(0.95); }
          55%  { opacity: 1; transform: perspective(800px) translateY(6px)   rotateX(-4deg) scale(1.02); }
          78%  { opacity: 1; transform: perspective(800px) translateY(-2px)  rotateX(1.5deg) scale(1);   }
          100% { opacity: 1; transform: perspective(800px) translateY(0)     rotateX(0deg)   scale(1);    }
        }
      `}</style>

      <section
        ref={sectionRef}
        id="clients"
        className="relative bg-[#f5f4f0] font-sans flex flex-col h-screen p-4 sm:p-5 gap-3 overflow-hidden"
      >
        {/* HEADER */}
        <div
          className="relative shrink-0 rounded-2xl overflow-hidden bg-white px-5 py-5 sm:px-7 sm:py-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div className="absolute top-0 left-0 bg-[#f5f4f0] px-5 py-3 rounded-br-2xl">
            <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-neutral-400">
              Trusted by
            </span>
          </div>
          <div className="mt-6 sm:mt-5">
            <h2 className="text-2xl sm:text-[2.2rem] font-bold tracking-[-0.03em] leading-[1.1] text-neutral-900">
              Brands that ship<br />
              <span className="text-neutral-400 font-normal italic">with confidence.</span>
            </h2>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-xs sm:text-right">
            From global enterprises to regional leaders - they trust Canaan Global to move what matters.
          </p>
        </div>

        {/* LOGO GRID */}
        <div
          ref={gridRef}
          className="grid grid-cols-3 sm:grid-cols-4 grid-rows-6 sm:grid-rows-4 flex-1 min-h-0 gap-3"
        >
          {CLIENTS.map(({ name, img }, i) => {
            const isHovered  = hoveredIdx === i;
            const dockScale  = doneAnimating ? getDockScale(i, hoveredIdx, cols) : 1;
            const zIdx       = doneAnimating
              ? (isHovered ? 20 : dockScale > 1.01 ? 10 : 1)
              : 1;

            return (
              <div
                key={name}
                onMouseEnter={() => doneAnimating && setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="relative rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  opacity:         isVisible ? undefined : 0,
                  transformOrigin: doneAnimating ? "center" : (i > 0 ? "top center" : undefined),
                  animation:       (!doneAnimating && isVisible)
                    ? (i === 0 ? "cardSlideLeft" : "cardDominoFall") +
                      " 0.65s cubic-bezier(0.16,1,0.3,1) " + (i * 60) + "ms both"
                    : "none",
                  transform:       doneAnimating ? `scale(${dockScale})` : undefined,
                  transition:      doneAnimating
                    ? "transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)"
                    : "none",
                  position:        "relative",
                  zIndex:          zIdx,
                  willChange:      doneAnimating && dockScale > 1.01 ? "transform" : "auto",
                }}
              >
                {/* Image — extra inner zoom on direct hover */}
                <Image
                  src={img}
                  alt={name}
                  fill
                  quality={75}
                  priority={i < 8}
                  sizes="(max-width: 640px) 33vw, 25vw"
                  className="object-cover"
                  style={{
                    transform:  isHovered ? "scale(1.09)" : "scale(1)",
                    transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  }}
                />

                {/* Constant soft vignette */}
                <div className="absolute inset-0 bg-white/10 pointer-events-none" />

                {/* Dark gradient — appears on hover */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent pointer-events-none"
                  style={{
                    opacity:    isHovered ? 1 : 0,
                    transition: "opacity 0.28s ease",
                  }}
                />

                {/* Company name — bottom-left, slides up on hover */}
                <span
                  className="absolute bottom-3 left-3 right-3 text-[10px] font-semibold tracking-[0.13em] uppercase text-white leading-tight pointer-events-none"
                  style={{
                    opacity:    isHovered ? 1 : 0,
                    transform:  isHovered ? "translateY(0)" : "translateY(5px)",
                    transition: "opacity 0.25s ease, transform 0.25s ease",
                  }}
                >
                  {name}
                </span>
              </div>
            );
          })}
        </div>

      </section>
    </>
  );
}