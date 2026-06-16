"use client";

import { useRef, useState, useEffect } from "react";
import { ArrowRight, FileText, Download, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import useFadeIn from "../hooks/useFadeIn";
import ship1 from "@/app/assets/images/company/ship1.png";
import { API_BASE_URL } from "@/app/lib/api";



export default function UpdatesPage() {
  const ratesRef = useRef(null);
  const areRatesVisible = useFadeIn(ratesRef, 0.05);

  const circularsRef = useRef(null);
  const areCircularsVisible = useFadeIn(circularsRef, 0.05);

  const [exchangeRates, setExchangeRates] = useState([
    { currency: "USD", symbol: "$", rate: "...", trend: "0.00%", isUp: true },
    { currency: "EUR", symbol: "€", rate: "...", trend: "0.00%", isUp: true },
    { currency: "GBP", symbol: "£", rate: "...", trend: "0.00%", isUp: true },
    { currency: "AED", symbol: "د.إ", rate: "...", trend: "0.00%", isUp: true },
  ]);
  const [circulars, setCirculars] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/exchange-rates/`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setExchangeRates([
            { currency: "USD", symbol: "$", rate: data.usd || "0.00", trend: "0.00%", isUp: true },
            { currency: "EUR", symbol: "€", rate: data.eur || "0.00", trend: "0.00%", isUp: true },
            { currency: "GBP", symbol: "£", rate: data.gbp || "0.00", trend: "0.00%", isUp: true },
            { currency: "AED", symbol: "د.إ", rate: data.aed || "0.00", trend: "0.00%", isUp: true },
          ]);
        }
      })
      .catch(err => console.error("Failed to fetch exchange rates", err));

    fetch(`${API_BASE_URL}/api/circulars/`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const dynamicCirculars = data.map(circ => ({
            id: circ.id,
            date: circ.date || "Recent",
            number: circ.circular_name || `Circular No. ${circ.id}`,
            title: circ.title || "Customs Circular",
            description: circ.description || "",
            pdf_url: circ.pdf_url
          }));
          setCirculars(dynamicCirculars);
        }
      })
      .catch(err => console.error("Failed to fetch circulars", err));
  }, []);

  return (
    <main className="font-sans" style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#f5f4f0", overflowX: "hidden", overflowY: "auto" }}>
      {/* ── Image Header ── */}
      <header style={{ position: "relative", height: "40%", overflow: "hidden", flexShrink: 0 }}>
        <img
          src={ship1.src}
          alt="News and Updates"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 45%" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(13,12,10,0.25) 0%, rgba(13,12,10,0.55) 55%, rgba(13,12,10,0.88) 100%)" }} />

        <div style={{ position: "absolute", bottom: 28, left: 40 }}>
          <p style={{ fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "#c8b98a", margin: "0 0 8px", opacity: 0.9 }}>
            Canaan Global International
          </p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4.5vw, 3rem)", fontWeight: 700, color: "#fff", letterSpacing: "-0.035em", margin: 0, lineHeight: 1 }}>
            Updates & Circulars
          </h1>
        </div>
      </header>

      {/* Content wrapper */}
      <div className="flex-1 px-4 py-8 sm:px-10 sm:py-10 flex flex-col items-center">
        <div className="w-full max-w-5xl">

        {/* Exchange Rates Section */}
        <section 
          ref={ratesRef}
          className="mb-16"
        >
          <div className={`flex items-end justify-between mb-5 transition-[opacity,transform] duration-700 ease-out ${areRatesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div>
              <h2 className="text-xl font-semibold tracking-[-0.01em] text-neutral-900">Daily Exchange Rates</h2>
              <p className="text-sm text-neutral-500 mt-1">Indicative rates for major currencies against INR</p>
            </div>
            <p className="text-[11px] font-medium tracking-wide uppercase text-neutral-400 bg-black/[0.04] px-2.5 py-1 rounded-md hidden sm:block">
              Last updated: Today
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {exchangeRates.map((rate, i) => (
              <div 
                key={rate.currency}
                className="bg-white border border-black/[0.08] rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 group"
                style={{
                  transitionProperty: "opacity, transform, box-shadow",
                  transitionDuration: "0.7s, 0.7s, 0.3s",
                  transitionDelay: areRatesVisible ? `${i * 100}ms` : "0ms",
                  opacity: areRatesVisible ? 1 : 0,
                  transform: areRatesVisible ? "translateY(0)" : "translateY(20px)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 border border-black/[0.04] flex items-center justify-center font-medium text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white transition-colors duration-300">
                    {rate.symbol}
                  </div>
                  <span className={`flex items-center gap-1 text-[11px] font-semibold tracking-wide ${rate.isUp ? "text-emerald-600" : "text-rose-500"}`}>
                    {rate.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {rate.trend}
                  </span>
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-neutral-400 mb-0.5">
                    {rate.currency} / INR
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                    ₹{rate.rate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Circulars Section */}
        <section ref={circularsRef}>
          <div className={`mb-6 transition-[opacity,transform] duration-700 ease-out ${areCircularsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <h2 className="text-xl font-semibold tracking-[-0.01em] text-neutral-900">Customs Circulars</h2>
            <p className="text-sm text-neutral-500 mt-1">Official notifications and regulatory updates</p>
          </div>

          <div className="flex flex-col gap-3">
            {circulars.map((circular, i) => (
              <div 
                key={circular.id}
                className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:border-black/[0.15] hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 group cursor-pointer"
                style={{
                  transitionProperty: "opacity, transform, box-shadow, border-color",
                  transitionDuration: "0.7s, 0.7s, 0.3s, 0.3s",
                  transitionDelay: areCircularsVisible ? `${i * 120}ms` : "0ms",
                  opacity: areCircularsVisible ? 1 : 0,
                  transform: areCircularsVisible ? "translateX(0)" : "translateX(-20px)",
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide uppercase text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-md">
                      <Calendar size={12} />
                      {circular.date}
                    </span>
                    <span className="text-[11px] font-semibold tracking-wide text-amber-700/80">
                      {circular.number}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-[17px] font-bold text-neutral-900 tracking-tight mb-1.5 leading-snug group-hover:text-amber-800 transition-colors duration-300">
                    {circular.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed truncate sm:whitespace-normal sm:line-clamp-2">
                    {circular.description}
                  </p>
                </div>
                
                <div className="shrink-0 flex items-center justify-end sm:justify-center">
                  <a href={circular.pdf_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full border border-black/10 bg-[#fbfaf9] text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white group-hover:border-neutral-900 transition-all duration-300 active:scale-95">
                    <Download size={16} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
      </div>
    </main>
  );
}
