"use client";
import { useRef, useCallback, useEffect } from "react";
import { ArrowDown } from "lucide-react";

export default function DavidHazHero() {
  const imgRef    = useRef(null);
  const cardRef   = useRef(null);
  const sectionRef = useRef(null);
  const rafRef    = useRef(null);
  const scrollRaf = useRef(null);

  // ── #2 Cursor micro-parallax ──────────────────────────────────
  const handleMouseMove = useCallback((e) => {
    // Capture before rAF — React nullifies currentTarget after the handler returns
    const card = e.currentTarget;
    const clientX = e.clientX;
    const clientY = e.clientY;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = ((clientX - left) / width  - 0.5) * 2;
      const y = ((clientY - top)  / height - 0.5) * 2;
      if (imgRef.current) {
        imgRef.current.style.transform = `scale(1.06) translate(${x * -14}px, ${y * -10}px)`;
      }
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (imgRef.current) {
      imgRef.current.style.transition = "transform 0.9s cubic-bezier(0.16,1,0.3,1)";
      imgRef.current.style.transform  = "scale(1.06) translate(0px, 0px)";
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
      if (sy < vh && e.deltaY > 0)          { e.preventDefault(); snapTo(vh); }
      else if (sy > 0 && sy <= vh && e.deltaY < 0) { e.preventDefault(); snapTo(0);  }
    };

    const handleTouchStart = (e) => { touchStartY = e.touches[0].clientY; };

    const handleTouchEnd = (e) => {
      if (isSnapping) return;
      const diff = touchStartY - e.changedTouches[0].clientY;
      const sy   = window.scrollY;
      const vh   = window.innerHeight;
      if      (sy < vh && diff > 30)           snapTo(vh);
      else if (sy > 0 && sy <= vh && diff < -30) snapTo(0);
    };

    window.addEventListener("wheel",      handleWheel,      { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true  });
    window.addEventListener("touchend",   handleTouchEnd,   { passive: true  });
    return () => {
      window.removeEventListener("wheel",      handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend",   handleTouchEnd);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="sticky top-0 h-screen bg-[#f5f4f0] font-sans flex flex-col p-4 sm:p-5 gap-3 z-[1]"
    >
      {/* ── HERO IMAGE CARD ── */}
      <div
        ref={cardRef}
        className="relative flex-1 rounded-2xl overflow-hidden min-h-[380px] sm:min-h-[460px] lg:min-h-[520px]"
        style={{ willChange: "opacity" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >

        {/* Background image */}
        <img
          ref={imgRef}
          src="https://plus.unsplash.com/premium_photo-1661884720911-91cd3f823298?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FyZ28lMjBib2F0fGVufDB8fDB8fHww"
          alt="Canaan Global International — cargo vessel at sea"
          className="w-full h-full object-cover absolute inset-0"
          style={{ objectPosition: "center 60%", transform: "scale(1.06)", willChange: "transform" }}
        />

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
          <p
            style={{
              letterSpacing: "0.18em",
              marginBottom: "1.1rem",
              animation: "heroRevealRight 0.75s cubic-bezier(0.16,1,0.3,1) 0.1s both",
            }}
            className="text-[10px] sm:text-[11px] font-medium uppercase text-white/55"
          >
            Est. 2009 · International Freight Forwarding
          </p>

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
                animation: "heroRevealRight 1.05s cubic-bezier(0.16,1,0.3,1) 0.2s both",
              }}
            >
              Canaan
            </span>
            <span
              style={{
                display: "block",
                fontSize: "clamp(1.5rem, 5.5vw, 3.8rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                color: "rgba(255,255,255,0.70)",
                paddingLeft: "0.045em",
                marginTop: "0.04em",
                textTransform: "uppercase",
                animation: "heroRevealRight 1.05s cubic-bezier(0.16,1,0.3,1) 0.36s both",
              }}
            >
              Global
            </span>
          </h1>

          {/* Gold accent bar — draws from left */}
          <div style={{
            width: "2.5rem",
            height: "2px",
            background: "rgba(210,165,45,0.85)",
            margin: "1.2rem 0 1rem",
            transformOrigin: "left center",
            animation: "goldBarDraw 0.55s cubic-bezier(0.16,1,0.3,1) 0.55s both",
          }} />

          {/* Tagline — each word slides in one by one */}
          <p className="text-[16px] sm:text-[18px] font-medium uppercase text-white/75 flex items-center gap-[0.55em]" style={{ letterSpacing: "0.18em" }}>
            {["Commit", "·", "Endure", "·", "Achieve", "·", "Satisfy"].map((word, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  animation: `heroRevealRight 0.55s cubic-bezier(0.16,1,0.3,1) ${0.68 + i * 0.1}s both`,
                }}
              >
                {word}
              </span>
            ))}
          </p>
        </div>

        {/* ── BOTTOM RIGHT — scroll indicator ── */}
        <div className="absolute bottom-0 right-0 z-10 bg-[#f5f4f0] backdrop-blur-sm px-5 py-4 sm:px-7 sm:py-5 rounded-tl-2xl flex items-center gap-2.5">
          <span className="hidden sm:inline text-[11px] font-medium text-neutral-400 tracking-[0.1em] uppercase">
            Scroll
          </span>
          <div className="w-8 h-8 rounded-full border-2 border-neutral-300 flex items-center justify-center" style={{ animation: "heroPulseDown 2s cubic-bezier(0.45,0,0.55,1) infinite" }}>
            <ArrowDown size={13} className="text-neutral-500" />
          </div>
        </div>

      </div>

    </section>
  );
}