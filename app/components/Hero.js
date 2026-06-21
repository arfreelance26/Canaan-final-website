"use client";
import { useRef, useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "@/app/lib/api";

// Only allow http/https URLs from API data to prevent javascript: URI injection
function safeUrl(url) {
  if (!url || typeof url !== "string") return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

export default function DavidHazHero() {
  const imgRef = useRef(null);
  const cardRef = useRef(null);
  const sectionRef = useRef(null);
  const rafRef = useRef(null);
  const scrollRaf = useRef(null);

  const [rates, setRates] = useState({ usd: "-", eur: "-", gbp: "-", aed: "-" });
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/hero-video/`)
      .then((res) => res.json())
      .then((data) => {
        if (data && safeUrl(data.video_url)) {
          setVideoUrl(data.video_url);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/exchange-rates/`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.detail) {
          setRates({
            usd: data.usd || "-",
            eur: data.eur || "-",
            gbp: data.gbp || "-",
            aed: data.aed || "-",
          });
        }
      })
      .catch(() => {});
  }, []);

  // ── #2 Cursor micro-parallax ──────────────────────────────────
  const handleMouseMove = useCallback((e) => {
    // Capture before rAF — React nullifies currentTarget after the handler returns
    const card = e.currentTarget;
    const clientX = e.clientX;
    const clientY = e.clientY;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = ((clientX - left) / width - 0.5) * 2;
      const y = ((clientY - top) / height - 0.5) * 2;
      if (imgRef.current) {
        imgRef.current.style.transform = `scale(1.06) translate(${x * -14}px, ${y * -10}px)`;
      }
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (imgRef.current) {
      imgRef.current.style.transition = "transform 0.9s cubic-bezier(0.16,1,0.3,1)";
      imgRef.current.style.transform = "scale(1.06) translate(0px, 0px)";
      setTimeout(() => { if (imgRef.current) imgRef.current.style.transition = ""; }, 900);
    }
  }, []);

  // ── #3 Scroll parallax + #4 Hero exit fade ───────────────────
  useEffect(() => {
    const onScroll = () => {
      if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current);
      scrollRaf.current = requestAnimationFrame(() => {
        const sy = window.scrollY;
        // #3 — background moves at 0.45× scroll speed (feels deeper)
        if (imgRef.current) {
          imgRef.current.style.transform = `scale(1.06) translateY(${sy * 0.45}px)`;
        }
        // #4 — card fades as user scrolls past fold (no scale — avoids GPU cache miss
        // on overflow:hidden + border-radius composite layer)
        if (cardRef.current) {
          const progress = Math.min(sy / (window.innerHeight * 0.6), 1);
          cardRef.current.style.opacity = (1 - progress * 0.35).toFixed(4);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(scrollRaf.current);
    };
  }, []);

  // ── Scroll snap: hero ↔ Group section ────────────────────────
  useEffect(() => {
    let isSnapping = false;
    let touchStartY = 0;

    const snapTo = (target) => {
      isSnapping = true;
      window.scrollTo({ top: target, behavior: "smooth" });
      setTimeout(() => { isSnapping = false; }, 900);
    };

    const handleWheel = (e) => {
      const sy = window.scrollY;
      const vh = window.innerHeight;
      if (isSnapping) { e.preventDefault(); return; }
      if (sy < vh && e.deltaY > 0) { e.preventDefault(); snapTo(vh); }
      else if (sy > 0 && sy <= vh && e.deltaY < 0) { e.preventDefault(); snapTo(0); }
    };

    const handleTouchStart = (e) => { touchStartY = e.touches[0].clientY; };

    const handleTouchEnd = (e) => {
      if (isSnapping) return;
      const diff = touchStartY - e.changedTouches[0].clientY;
      const sy = window.scrollY;
      const vh = window.innerHeight;
      if (sy < vh && diff > 30) snapTo(vh);
      else if (sy > 0 && sy <= vh && diff < -30) snapTo(0);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="sticky top-0 h-screen bg-[#f5f4f0] font-sans flex flex-col z-[1]"
    >
      {/* ── HERO IMAGE CARD ── */}
      <div
        
        className="relative h-screen overflow-hidden"
        
      >

        {/* Background video — sourced from the backend only */}
        {videoUrl && (
          <video
            ref={imgRef}
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover absolute inset-0"
            style={{ objectPosition: "center", transform: "scale(1.06)", willChange: "transform" }}
          />
        )}

        {/* Gradient scrim */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.18) 40%, rgba(0,0,0,0.72) 100%)",
          }}
        />

        {/* ── BOTTOM LEFT — company name + tagline ── */}
        <div className="absolute bottom-0 left-0 z-10 px-6 pt-8 pb-16 sm:px-10 sm:pt-12 sm:pb-24 flex flex-col max-w-[700px]">

          {/* Eyebrow */}
          

          {/* Company name — unified two-line wordmark */}
          <h1 style={{ margin: 0, padding: 0 }}>
            <span
              style={{
                display: "block",
                fontSize: "clamp(3.2rem, 12vw, 8rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 0.9,
                color: "#ffffff",
                paddingLeft: "0.045em",
                textTransform: "uppercase",
                textShadow: "0 4px 40px rgba(0,0,0,0.3)",
                animation: "heroRevealLeft 1.0s cubic-bezier(0.16,1,0.3,1) 0.35s both",
              }}
            >
              Canaan
            </span>
            <span
              style={{
                display: "block",
                fontSize: "clamp(1.1rem, 3.8vw, 3rem)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                color: "rgba(255,255,255,0.70)",
                paddingLeft: "0.045em",
                marginTop: "0.04em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                animation: "heroRevealLeft 1.0s cubic-bezier(0.16,1,0.3,1) 0.58s both",
              }}
            >
              Global International
            </span>
          </h1>

          {/* Gold accent bar — draws from left */}
          <div style={{
            width: "2.5rem",
            height: "2px",
            background: "rgba(210,165,45,0.85)",
            margin: "1.2rem 0 1rem",
            transformOrigin: "left center",
            animation: "goldBarDraw 0.55s cubic-bezier(0.16,1,0.3,1) 0.78s both",
          }} />

          {/* Tagline — each word slides in one by one */}
          <p
            className="text-[12px] sm:text-[16px] md:text-[18px] font-medium uppercase text-white/75 flex flex-wrap items-center gap-x-[0.5em] gap-y-1 tracking-[0.1em] sm:tracking-[0.18em]"
          >
            {["Commit", "·", "Endure", "·", "Achieve", "·", "Satisfy"].map((word, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  animation: `heroRevealLeft 0.6s cubic-bezier(0.16,1,0.3,1) ${0.92 + i * 0.07}s both`,
                }}
              >
                {word}
              </span>
            ))}
          </p>
        </div>

        {/* ── BOTTOM RIGHT — scroll indicator ── */}


        {/* ── EXCHANGE RATE MARQUEE ── */}
        <div className="absolute bottom-0 left-0 w-full h-[36px] flex items-center bg-white/5 backdrop-blur-xl border-t border-white/10 overflow-hidden z-20 shadow-[0_-4px_30px_rgba(0,0,0,0.1)]">

          {/* Static Title */}
          <div className="flex items-center h-full px-3 sm:px-8 bg-black/80 backdrop-blur-xl border-r border-white/10 z-30 relative shrink-0 shadow-[4px_0_16px_rgba(0,0,0,0.4)] whitespace-nowrap">
            <span className="text-white/90 font-bold tracking-[0.1em] sm:tracking-[0.2em] text-[9px] sm:text-[11px] uppercase drop-shadow-md">
              <span className="sm:hidden">Exchange Rates</span>
              <span className="hidden sm:inline">Today's Custom Exchange Rates</span>
            </span>
          </div>

          <style>{`
            @keyframes marqueeSlide {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .marquee-content {
              display: flex;
              white-space: nowrap;
              animation: marqueeSlide 35s linear infinite;
            }
            .marquee-content:hover {
              animation-play-state: paused;
            }
          `}</style>
          <div className="flex-1 overflow-hidden h-full flex items-center">
            <div className="marquee-content" style={{ width: "max-content" }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-12 sm:gap-20 px-6 sm:px-10 items-center">
                  <span className="text-white/90 font-medium tracking-widest flex items-center gap-2 drop-shadow-sm text-[13px] sm:text-[14px]">
                     USD - <span className="text-amber-400 font-semibold drop-shadow-none">₹{rates.usd}</span>
                  </span>
                  <span className="text-white/90 font-medium tracking-widest flex items-center gap-2 drop-shadow-sm text-[13px] sm:text-[14px]">
                     EUR - <span className="text-amber-400 font-semibold drop-shadow-none">₹{rates.eur}</span>
                  </span>
                  <span className="text-white/90 font-medium tracking-widest flex items-center gap-2 drop-shadow-sm text-[13px] sm:text-[14px]">
                     GBP - <span className="text-amber-400 font-semibold drop-shadow-none">₹{rates.gbp}</span>
                  </span>
                  <span className="text-white/90 font-medium tracking-widest flex items-center gap-2 drop-shadow-sm text-[13px] sm:text-[14px]">
                     AED - <span className="text-amber-400 font-semibold drop-shadow-none">₹{rates.aed}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}