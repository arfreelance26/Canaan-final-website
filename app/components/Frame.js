"use client";

import { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 500;
const SCROLL_MULTIPLIER = 5; // how many viewport heights the scroll section takes

// Preload all frame images
function preloadFrames(basePath, total) {
  const images = [];
  for (let i = 1; i <= total; i++) {
    const img = new Image();
    img.src = `${basePath}/${String(i).padStart(3, "0")}.png`;
    images.push(img);
  }
  return images;
}

export default function FrameScrollSection() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const frameRef = useRef(0);
  const rafRef = useRef(null);
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const FRAME_BASE = "/frames"; // resolves to canaan2/app/frame at runtime via public or app dir

  const COPY_STEPS = [
    { frame: 0,  heading: "Global Reach",        sub: "Connecting 30+ countries with precision freight solutions." },
    { frame: 100, heading: "Customs Cleared",      sub: "Expert documentation, duties, and compliance at every border." },
    { frame: 250, heading: "Last Mile Delivered",  sub: "End-to-end tracking from origin to final destination." },
    { frame: 400, heading: "Built for Scale",      sub: "Your logistics partner for any volume, any route, any time." },
  ];

  // Draw a specific frame index onto the canvas
  function drawFrame(index) {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete) return;

    const ctx = canvas.getContext("2d");
    const { width: cw, height: ch } = canvas;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // cover-fit the image
    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const ox = (cw - sw) / 2;
    const oy = (ch - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, ox, oy, sw, sh);
  }

  // Resize canvas to match display size
  function resizeCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    const ctx = canvas.getContext("2d");
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    drawFrame(frameRef.current);
  }

  // Load all frames
  useEffect(() => {
    let loadedCount = 0;
    const images = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const src = `${FRAME_BASE}/${String(i).padStart(3, "0")}.png`;
      img.src = src;
      img.onload = () => {
        loadedCount++;
        setLoaded(loadedCount);
        if (loadedCount === TOTAL_FRAMES) {
          setReady(true);
          drawFrame(0);
        }
      };
      img.onerror = () => {
        loadedCount++;
        setLoaded(loadedCount);
        if (loadedCount === TOTAL_FRAMES) setReady(true);
      };
      images.push(img);
    }
    imagesRef.current = images;
  }, []);

  // Canvas resize
  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [ready]);

  // Scroll handler
  useEffect(() => {
    if (!ready) return;

    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewH = window.innerHeight;

      // progress: 0 when section top hits viewport top → 1 when section bottom hits viewport bottom
      const scrolled = -rect.top;
      const scrollable = sectionHeight - viewH;
      const progress = Math.max(0, Math.min(1, scrolled / scrollable));

      const targetFrame = Math.min(
        TOTAL_FRAMES - 1,
        Math.round(progress * (TOTAL_FRAMES - 1))
      );

      if (targetFrame !== frameRef.current) {
        frameRef.current = targetFrame;
        drawFrame(targetFrame);

        // Determine active copy step
        let stepIndex = 0;
        for (let i = COPY_STEPS.length - 1; i >= 0; i--) {
          if (targetFrame >= COPY_STEPS[i].frame) {
            stepIndex = i;
            break;
          }
        }
        setActiveIndex(stepIndex);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, [ready]);

  const loadPercent = Math.round((loaded / TOTAL_FRAMES) * 100);
  const activeStep = COPY_STEPS[activeIndex];

  return (
    <section
      ref={sectionRef}
      id="service"
      style={{ height: `${SCROLL_MULTIPLIER * 100}vh` }}
      className="relative"
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0d0c0a]">

        {/* Loading bar */}
        {!ready && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0c0a] gap-4">
            <p
              style={{ fontFamily: "Georgia, serif", letterSpacing: "0.15em" }}
              className="text-[11px] uppercase text-neutral-500 tracking-widest"
            >
              Loading
            </p>
            <div className="w-48 h-[1px] bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-[#c8b98a] transition-all duration-150"
                style={{ width: `${loadPercent}%` }}
              />
            </div>
            <p
              style={{ fontFamily: "Georgia, serif" }}
              className="text-[11px] text-neutral-600"
            >
              {loadPercent}%
            </p>
          </div>
        )}

        {/* Canvas — fills full sticky viewport */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ display: "block" }}
        />

        {/* Subtle dark vignette overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* Bottom gradient for text legibility */}
        <div
          className="absolute bottom-0 left-0 right-0 h-2/5 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(13,12,10,0.92) 0%, transparent 100%)",
          }}
        />

        {/* Top label */}
        <div className="absolute top-6 left-6 z-10">
          <span
            className="text-[10px] uppercase tracking-[0.18em] text-neutral-500"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Canaan Global International
          </span>
        </div>

        {/* Frame counter top-right */}
        <div className="absolute top-6 right-6 z-10 flex items-center gap-2">
          <span
            className="text-[11px] text-neutral-600 tabular-nums"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {String(frameRef.current + 1).padStart(3, "0")} /{" "}
+            {String(TOTAL_FRAMES).padStart(3, "0")}
          </span>
        </div>

        {/* Copy overlay — bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-8 pb-12 sm:px-14 sm:pb-14">

          {/* Step dots */}
          <div className="flex gap-2 mb-6">
            {COPY_STEPS.map((_, i) => (
              <div
                key={i}
                className="transition-all duration-500"
                style={{
                  width: i === activeIndex ? "28px" : "6px",
                  height: "3px",
                  borderRadius: "2px",
                  background: i === activeIndex ? "#c8b98a" : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>

          {/* Heading */}
          <h2
            key={activeStep.heading}
            className="text-white leading-[1.1] mb-3 animate-fade-in"
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            {activeStep.heading}
          </h2>

          {/* Sub */}
          <p
            key={activeStep.sub}
            className="text-neutral-400 max-w-md animate-fade-in"
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(13px, 1.5vw, 16px)",
              lineHeight: 1.65,
            }}
          >
            {activeStep.sub}
          </p>

          {/* Scroll hint — fades once scrolled */}
          <div
            className="mt-8 flex items-center gap-2 transition-opacity duration-500"
            style={{ opacity: activeIndex === 0 ? 1 : 0 }}
          >
            <div
              className="animate-bounce"
              style={{ color: "#c8b98a", fontSize: "18px" }}
            >
              ↓
            </div>
            <span
              className="text-[10px] uppercase tracking-[0.16em] text-neutral-600"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Scroll to explore
            </span>
          </div>
        </div>

        {/* Grain texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Keyframe animation for copy fade-in */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeInUp 0.45s ease forwards;
        }
      `}</style>
    </section>
  );
}