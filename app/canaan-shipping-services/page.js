"use client";
import { useState } from "react";
const SERVICES = [
  {
    num: "01",
    image: "/company/service1.png",
    title: "Land Transportation",
    body: "GPS-tracked fleet moving cargo safely from quarry to port of departure and onward to the destination. Computerized dispatch optimizes routing to ensure every shipment arrives on time.",
  },
  {
    num: "02",
    image: "/company/service3.png",
    title: "Customs Clearance",
    body: "We navigate international shipping regulations on your behalf. Our experts keep every shipment compliant with local rules across 30+ countries — minimizing delays at every border.",
  },
  {
    num: "03",
    image: "/company/service2.png",
    title: "Cargo Management",
    body: "Extensive experience handling large, complex, and oversized project shipments. We plan, coordinate, and execute from procurement to final delivery.",
  },

  {
    num: "04",
    image: null,
    title: "Lashing",
    body: "Custom wooden lashing, palletisation, and crating to specification.",
  },
  {
    num: "05",
    image: null,
    title: "Fumigation",
    body: "Heat Treatment and fumigation certified to ISPM international phytosanitary norms.",
  },
  {
    num: "06",
    image: null,
    title: "Warehousing",
    body: "Secure and spacious storage facilities for short and long-term warehousing needs.",
  },
  {
    num: "07",
    image: null,
    title: "NVOCC",
    body: "Comprehensive Non-Vessel Operating Common Carrier services providing flexible ocean freight solutions.",
  },
  {
    num: "08",
    image: null,
    title: "Steamer Agent",
    body: "Professional ship agency services ensuring smooth and efficient port calls for all types of vessels.",
  },
  {
    num: "09",
    image: null,
    title: "RFID E-Seal",
    body: "Authorized dealer for Bolt Seal and Warner. We provide highly secure, tamper-evident electronic seals to ensure your cargo's integrity throughout transit.",
  },
];

export default function ServicesPage() {
  const [hovered, setHovered] = useState(null);

  return (
    <main style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#f5f4f0", overflowX: "hidden", overflowY: "auto", fontFamily: "inherit" }}>
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
          src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=90&w=2400"
          alt="Port"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 38%" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(13,12,10,0.25) 0%, rgba(13,12,10,0.55) 55%, rgba(13,12,10,0.88) 100%)" }} />

        <div style={{ position: "absolute", bottom: 28, left: 40 }}>
          <p style={{ fontFamily: "'Georgia',serif", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "#c8b98a", margin: "0 0 8px", opacity: 0.9 }}>
            Canaan Global International
          </p>
          <h1 style={{ fontFamily: "'Georgia',serif", fontSize: "clamp(1.8rem, 4.5vw, 3rem)", fontWeight: 700, color: "#fff", letterSpacing: "-0.035em", margin: 0, lineHeight: 1 }}>
            Our Services
          </h1>
        </div>
      </header>

      {/* ── Cards ── */}
      <section style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: "min-content", gap: 12, padding: "16px", boxSizing: "border-box" }}>
        {SERVICES.map((svc, i) => {
          const on = hovered === i;
          return (
            <div
              key={svc.num}
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
                  {svc.image ? (
                    <img
                      src={svc.image}
                      alt={svc.title}
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

                {/* Number row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", minHeight: 34 }}>
                  <span style={{ fontFamily: "'Georgia',serif", fontSize: 11, fontWeight: 700, color: on ? "#c8b98a" : "#ccc", letterSpacing: "0.08em", transition: "color 0.3s ease" }}>
                    {svc.num}
                  </span>
                </div>

                {/* Title */}
                <h2 style={{ fontFamily: "'Georgia',serif", fontSize: "0.92rem", fontWeight: 700, color: on ? "#111" : "#333", letterSpacing: "-0.02em", margin: 0, lineHeight: 1.25, transition: "color 0.25s ease" }}>
                  {svc.title}
                </h2>

                {/* Gold rule */}
                <div style={{ height: 1, background: on ? "linear-gradient(to right, #c8b98a, transparent)" : "rgba(0,0,0,0.08)", transition: "background 0.35s ease" }} />

                {/* Body */}
                <p style={{ fontSize: 11.5, color: on ? "#444" : "#888", lineHeight: 1.72, margin: 0, transition: "color 0.3s ease" }}>
                  {svc.body}
                </p>
              </div>
            </div>
          );
        })}
      </section>

    </main>
  );
}