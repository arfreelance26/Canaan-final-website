"use client";
import { useEffect, useRef, useState } from "react";
import { Anchor } from "lucide-react";

// ── SUBTLE CANVAS BACKGROUND ──────────────────────────────────
function BackgroundCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      timeRef.current += 0.002;
      const t = timeRef.current;

      ctx.clearRect(0, 0, w, h);

      // Warm white base
      ctx.fillStyle = "#f5f4f0";
      ctx.fillRect(0, 0, w, h);

      // Soft warm blobs
      const blobs = [
        { x: 0.2 + 0.08 * Math.sin(t * 0.4), y: 0.3 + 0.06 * Math.cos(t * 0.3), r: 0.55, c1: "rgba(210,205,195,0.5)", c2: "rgba(210,205,195,0)" },
        { x: 0.78 + 0.06 * Math.cos(t * 0.5), y: 0.6 + 0.08 * Math.sin(t * 0.4), r: 0.5,  c1: "rgba(200,198,190,0.4)", c2: "rgba(200,198,190,0)" },
        { x: 0.5  + 0.07 * Math.sin(t * 0.3), y: 0.8 + 0.05 * Math.cos(t * 0.6), r: 0.45, c1: "rgba(215,210,200,0.35)", c2: "rgba(215,210,200,0)" },
      ];

      blobs.forEach((blob) => {
        const gx = blob.x * w;
        const gy = blob.y * h;
        const gr = blob.r * Math.max(w, h);
        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
        grad.addColorStop(0, blob.c1);
        grad.addColorStop(1, blob.c2);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });

      // Very subtle grain texture via tiny noise dots
      for (let i = 0; i < 18; i++) {
        const px = (Math.sin(i * 3.1 + t * 0.1) * 0.5 + 0.5) * w;
        const py = (Math.cos(i * 2.3 + t * 0.08) * 0.5 + 0.5) * h;
        const alpha = 0.015 + Math.sin(i + t * 0.3) * 0.008;
        ctx.beginPath();
        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150,145,135,${alpha})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}

// ── MAIN LOADING PAGE ─────────────────────────────────────────
export default function LoadingPage({ onComplete, duration = 3200 }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("loading");
  const [statusText, setStatusText] = useState("Initialising...");

  const STATUS_STEPS = [
    { at: 0,    text: "Initialising..." },
    { at: 0.25, text: "Establishing global routes..." },
    { at: 0.5,  text: "Syncing cargo manifests..." },
    { at: 0.75, text: "Connecting worldwide..." },
    { at: 0.95, text: "Almost ready..." },
  ];

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const current = Math.min(elapsed / duration, 1);
      setProgress(current);
      const step = [...STATUS_STEPS].reverse().find((s) => current >= s.at);
      if (step) setStatusText(step.text);
      if (current >= 1) {
        clearInterval(interval);
        setStatusText("Welcome.");
        setPhase("done");
        setTimeout(() => {
          setPhase("exit");
          setTimeout(() => onComplete?.(), 700);
        }, 800);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes softPulse {
          0%, 100% { opacity: 0.5; transform: scale(1);   }
          50%       { opacity: 0.9; transform: scale(1.04); }
        }
      `}</style>

      <div
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "#f5f4f0",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          overflow: "hidden",
          opacity: phase === "exit" ? 0 : 1,
          transition: "opacity 0.7s ease",
        }}
      >
        {/* Animated warm background */}
        <BackgroundCanvas />

        {/* ── TOP LEFT — logo ── */}
        <div
          style={{
            position: "absolute", top: 0, left: 0,
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: "0 0 20px 0",
            border: "1px solid rgba(0,0,0,0.06)",
            borderTop: "none", borderLeft: "none",
            padding: "18px 24px",
            display: "flex", alignItems: "center", gap: 12,
            animation: "fadeUp 0.7s ease 0.1s both",
            zIndex: 10,
          }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: "#1a1916",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <Anchor size={15} color="#f5f4f0" strokeWidth={2} />
          </div>
          <div style={{ lineHeight: 1.15 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1916", letterSpacing: "-0.02em" }}>
              Canaan
            </div>
            <div style={{ fontSize: 10, fontWeight: 500, color: "#a0998c", letterSpacing: "0.02em" }}>
              Global International
            </div>
          </div>
        </div>

        {/* ── TOP RIGHT — est. badge ── */}
        <div
          style={{
            position: "absolute", top: 0, right: 0,
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: "0 0 0 20px",
            border: "1px solid rgba(0,0,0,0.06)",
            borderTop: "none", borderRight: "none",
            padding: "18px 24px",
            animation: "fadeUp 0.7s ease 0.2s both",
            zIndex: 10,
          }}
        >
          <span style={{
            fontSize: 10, fontWeight: 500,
            color: "#a0998c", letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>
            Est. 2009
          </span>
        </div>

        {/* ── CENTRE CONTENT ── */}
        <div
          style={{
            position: "relative", zIndex: 10,
            display: "flex", flexDirection: "column",
            alignItems: "center",
            animation: "fadeUp 0.9s ease 0.05s both",
          }}
        >
          {/* Logo mark */}
          <div
            style={{
              width: 76, height: 76, borderRadius: "50%",
              background: "#ffffff",
              border: "1px solid rgba(0,0,0,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.05)",
              animation: "logoFloat 4s ease-in-out infinite",
              marginBottom: 32,
            }}
          >
            <Anchor size={28} color="#1a1916" strokeWidth={1.5} />
          </div>

          {/* Company name */}
          <h1
            style={{
              fontSize: "clamp(2.6rem, 7vw, 5.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.92,
              color: "#1a1916",
              margin: 0,
              textAlign: "center",
            }}
          >
            Canaan
          </h1>

          <p
            style={{
              fontSize: "clamp(0.65rem, 2vw, 0.9rem)",
              fontWeight: 600,
              letterSpacing: "0.2em",
              color: "#a0998c",
              margin: "8px 0 0",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            Global International
          </p>

          {/* Divider */}
          <div
            style={{
              width: 32, height: 1,
              background: "rgba(0,0,0,0.1)",
              margin: "24px 0",
            }}
          />

          {/* Tagline */}
          <p
            style={{
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#b8b0a4",
              margin: "0 0 40px",
              textAlign: "center",
            }}
          >
            Commit · Endure · Achieve · Satisfy
          </p>

          {/* ── PROGRESS ── */}
          <div style={{ width: "clamp(200px, 32vw, 320px)", display: "flex", flexDirection: "column", gap: 10 }}>

            {/* Status + percent */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{
                fontSize: 10, fontWeight: 500,
                color: "#b8b0a4", letterSpacing: "0.04em",
              }}>
                {statusText}
              </span>
              <span style={{
                fontSize: 10, fontWeight: 600,
                color: phase === "done" ? "#1a1916" : "#c8c0b8",
                letterSpacing: "0.04em",
                fontVariantNumeric: "tabular-nums",
                transition: "color 0.4s",
              }}>
                {Math.round(progress * 100)}%
              </span>
            </div>

            {/* Progress track */}
            <div style={{
              width: "100%", height: 2,
              background: "rgba(0,0,0,0.08)",
              borderRadius: 99, overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: `${progress * 100}%`,
                background: "#1a1916",
                borderRadius: 99,
                transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
              }} />
            </div>

            {/* Milestone dots */}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 2 }}>
              {[0.25, 0.5, 0.75, 1].map((mark, i) => (
                <div
                  key={i}
                  style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: progress >= mark ? "#1a1916" : "rgba(0,0,0,0.1)",
                    transition: "background 0.4s ease",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── BOTTOM LEFT ── */}
        <div
          style={{
            position: "absolute", bottom: 0, left: 0,
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: "0 20px 0 0",
            border: "1px solid rgba(0,0,0,0.06)",
            borderBottom: "none", borderLeft: "none",
            padding: "14px 22px",
            animation: "fadeUp 0.7s ease 0.3s both",
            zIndex: 10,
          }}
        >
          <p style={{
            fontSize: 10, fontWeight: 500,
            color: "#b8b0a4", letterSpacing: "0.12em",
            textTransform: "uppercase", margin: 0,
          }}>
            International Freight Forwarding
          </p>
        </div>

        {/* ── BOTTOM RIGHT ── */}
        <div
          style={{
            position: "absolute", bottom: 0, right: 0,
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: "20px 0 0 0",
            border: "1px solid rgba(0,0,0,0.06)",
            borderBottom: "none", borderRight: "none",
            padding: "14px 22px",
            display: "flex", alignItems: "center", gap: 10,
            animation: "fadeUp 0.7s ease 0.4s both",
            zIndex: 10,
          }}
        >
          <span style={{
            fontSize: 10, fontWeight: 500,
            color: "#b8b0a4", letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>
            30+ Countries
          </span>
          <div style={{ width: 1, height: 10, background: "rgba(0,0,0,0.1)" }} />
          <span style={{
            fontSize: 10, fontWeight: 500,
            color: "#b8b0a4", letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>
            Est. 2009
          </span>
        </div>

      </div>
    </>
  );
}