"use client";
import { useState, useEffect } from "react";
import { Award, ShieldCheck, Building2, IdCard, FileSignature, MapPin, Lock } from "lucide-react";
import { API_BASE_URL } from "@/app/lib/api";

export default function AccreditationsPage() {
  const [hovered, setHovered] = useState(null);
  const [accreditations, setAccreditations] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/licenses/`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const ICONS = [IdCard, Award, FileSignature, Building2, MapPin, Lock, ShieldCheck];
          const dynamicAccs = data.map((lic, i) => ({
            Icon: ICONS[i % ICONS.length],
            num: String(i + 1).padStart(2, '0'),
            image: lic.image_url || null,
            title: lic.title || "License",
            body: lic.description || ""
          }));
          setAccreditations(dynamicAccs);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <main className="font-sans" style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#f5f4f0", overflowX: "hidden", overflowY: "auto" }}>
      <style>{`
        @keyframes slideInFromLeft {
          0% {
            opacity: 0;
            transform: translateX(-100px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      {/* ── Image Header ── */}
      <header style={{ position: "relative", height: "40%", overflow: "hidden", flexShrink: 0 }}>
        <img
          src="/company/cgi2.png"
          alt="Accreditations"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 50%" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(13,12,10,0.25) 0%, rgba(13,12,10,0.55) 55%, rgba(13,12,10,0.88) 100%)" }} />

        <div style={{ position: "absolute", bottom: 28, left: 40 }}>
          <p style={{ fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "#c8b98a", margin: "0 0 8px", opacity: 0.9 }}>
            Canaan Global International
          </p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4.5vw, 3rem)", fontWeight: 700, color: "#fff", letterSpacing: "-0.035em", margin: 0, lineHeight: 1 }}>
            Accreditations & Licenses
          </h1>
          <p style={{ fontStyle: "italic", fontSize: "1.1rem", color: "rgba(255,255,255,0.8)", margin: "12px 0 0 0", letterSpacing: "0.02em" }}>
            Nothing to Hide. Everything to Prove.
          </p>
        </div>
      </header>

      {/* ── Cards ── */}
      <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-min gap-3 p-4 box-border">
        {accreditations.map((acc, i) => {
          const on = hovered === i;
          return (
            <div
              key={acc.num}
              style={{
                animation: `slideInFromLeft 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.2}s both`,
                display: "flex",
              }}
            >
              <div
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  flex: 1,
                  background: "#fff",
                  borderRadius: 16,
                  padding: "22px 22px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  border: `1px solid ${on ? "rgba(200,185,138,0.4)" : "rgba(0,0,0,0.07)"}`,
                  boxShadow: on
                    ? "0 8px 24px rgba(0,0,0,0.08), 0 24px 48px rgba(200,185,138,0.18)"
                    : "0 2px 8px rgba(0,0,0,0.05)",
                  transform: on ? "translateY(-6px)" : "translateY(0)",
                  transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease, border-color 0.3s ease",
                  cursor: "default",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Underglow blob */}
                <div style={{
                  position: "absolute",
                  bottom: -30,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80%",
                  height: 60,
                  borderRadius: "50%",
                  background: "rgba(200,185,138,0.22)",
                  filter: "blur(24px)",
                  opacity: on ? 1 : 0,
                  transition: "opacity 0.4s ease",
                  pointerEvents: "none",
                }} />

                {/* Card image */}
                <div style={{ position: "relative", height: 280, borderRadius: 10, overflow: "hidden", flexShrink: 0, marginBottom: 5, background: "#f0efeb" }}>
                  {acc.image ? (
                    <img
                      src={acc.image}
                      alt={acc.title}
                      style={{
                        width: "100%", height: "100%",
                        objectFit: "cover",
                        transform: on ? "scale(1.05)" : "scale(1)",
                        transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%", height: "100%",
                        background: "linear-gradient(135deg, #e8e6e1 0%, #dcdad4 100%)",
                        transform: on ? "scale(1.05)" : "scale(1)",
                        transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
                      }}
                    />
                  )}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.25) 100%)", opacity: on ? 1 : 0.5, transition: "opacity 0.35s ease" }} />
                </div>

                {/* Number + Icon row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: on ? "#c8b98a" : "#ccc", letterSpacing: "0.08em", transition: "color 0.3s ease" }}>
                    {acc.num}
                  </span>
                  <div style={{
                    width: 34, height: 34, borderRadius: 9,
                    background: on ? "rgba(200,185,138,0.12)" : "#f5f4f0",
                    border: `1px solid ${on ? "rgba(200,185,138,0.35)" : "rgba(0,0,0,0.07)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.3s ease, border-color 0.3s ease",
                  }}>
                    <acc.Icon size={14} color={on ? "#c8b98a" : "#999"} />
                  </div>
                </div>

                {/* Title */}
                <h2 style={{ fontSize: "0.92rem", fontWeight: 700, color: on ? "#111" : "#333", letterSpacing: "-0.02em", margin: 0, lineHeight: 1.25, transition: "color 0.25s ease" }}>
                  {acc.title}
                </h2>

                {/* Gold rule */}
                <div style={{ height: 1, background: on ? "linear-gradient(to right, #c8b98a, transparent)" : "rgba(0,0,0,0.08)", transition: "background 0.35s ease" }} />

                {/* Body */}
                <p style={{ fontSize: 11.5, color: on ? "#444" : "#888", lineHeight: 1.72, margin: 0, transition: "color 0.3s ease" }}>
                  {acc.body}
                </p>
              </div>
            </div>
          );
        })}
      </section>

    </main>
  );
}
