"use client";
import { ArrowDown } from "lucide-react";

export default function DavidHazHero() {
  return (
    <section className="relative min-h-screen bg-[#f5f4f0] font-sans flex flex-col p-4 sm:p-5 gap-3">

      {/* ── HERO IMAGE CARD ── */}
      <div className="relative flex-1 rounded-2xl overflow-hidden min-h-[380px] sm:min-h-[460px] lg:min-h-[520px]">

        {/* Background image */}
        <img
          src="https://plus.unsplash.com/premium_photo-1661884720911-91cd3f823298?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FyZ28lMjBib2F0fGVufDB8fDB8fHww"
          alt="Canaan Global International — cargo vessel at sea"
          className="w-full h-full object-cover absolute inset-0"
          style={{ objectPosition: "center 60%" }}
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
        <div className="absolute bottom-0 left-0 z-10 px-6 py-7 sm:px-10 sm:py-10 flex flex-col gap-3 sm:gap-4 max-w-[700px]">

          {/* Eyebrow */}
          <p
            style={{ letterSpacing: "0.18em" }}
            className="text-[10px] sm:text-xs font-medium uppercase text-white/50"
          >
            Est. 2009 · International Freight Forwarding
          </p>

          {/* Company name — large display */}
          <div>
            <h1
              style={{
                fontSize: "clamp(3.2rem, 12vw, 8rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 0.92,
                color: "#ffffff",
                margin: 0,
                textShadow: "0 2px 32px rgba(0,0,0,0.25)",
              }}
            >
              Canaan
            </h1>
            <p
              style={{
                fontSize: "clamp(1rem, 3.5vw, 2.2rem)",
                fontWeight: 600,
                letterSpacing: "0.08em",
                lineHeight: 1.2,
                color: "rgba(255,255,255,0.65)",
                margin: "4px 0 0",
                textTransform: "uppercase",
                textShadow: "0 2px 16px rgba(0,0,0,0.2)",
              }}
            >
              Global International
            </p>
          </div>

          {/* Divider */}
          <div className="w-10 h-px bg-white/30 my-1" />

          {/* Tagline */}
          <p
            style={{ letterSpacing: "0.22em" }}
            className="text-[11px] sm:text-sm font-semibold uppercase text-white/70"
          >
            Commit · Endure · Achieve · Satisfy
          </p>
        </div>

        {/* ── BOTTOM RIGHT — scroll indicator ── */}
        <div className="absolute bottom-0 right-0 z-10 bg-[#f5f4f0] backdrop-blur-sm px-5 py-4 sm:px-7 sm:py-5 rounded-tl-2xl flex items-center gap-2.5">
          <span className="hidden sm:inline text-[11px] font-medium text-neutral-400 tracking-[0.1em] uppercase">
            Scroll
          </span>
          <div className="w-8 h-8 rounded-full border-2 border-neutral-300 flex items-center justify-center animate-bounce">
            <ArrowDown size={13} className="text-neutral-500" />
          </div>
        </div>

      </div>
    </section>
  );
}