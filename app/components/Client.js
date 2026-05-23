"use client";

import { useState, useEffect, useRef } from "react";

const CLIENTS = [
  { name: "Amazon",    domain: "amazon.com" },
  { name: "DHL",       domain: "dhl.com" },
  { name: "Maersk",   domain: "maersk.com" },
  { name: "FedEx",    domain: "fedex.com" },
  { name: "Samsung",  domain: "samsung.com" },
  { name: "Siemens",  domain: "siemens.com" },
  { name: "Nestle",   domain: "nestle.com" },
  { name: "Unilever", domain: "unilever.com" },
  { name: "IKEA",     domain: "ikea.com" },
  { name: "Adidas",   domain: "adidas.com" },
  { name: "Sony",     domain: "sony.com" },
  { name: "Philips",  domain: "philips.com" },
  { name: "Caterpillar", domain: "cat.com" },
  { name: "3M",       domain: "3m.com" },
  { name: "Honeywell",domain: "honeywell.com" },
];

function useFadeIn(ref, threshold = 0.05) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        // Keeps triggering every time it enters/leaves the viewport!
        setVisible(e.isIntersecting);
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

export default function ClientsSection() {
  const sectionRef = useRef(null);
  const isVisible = useFadeIn(sectionRef, 0.05);

  return (
    <section 
      ref={sectionRef}
      id="clients" 
      className="relative bg-[#f5f4f0] font-sans flex flex-col p-4 sm:p-5 gap-4 overflow-hidden"
    >

      {/* ── HEADER ── */}
      <div className={`relative rounded-2xl overflow-hidden bg-white px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 transition-all duration-700 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}>

        {/* Top-left label chip */}
        <div className="absolute top-0 left-0 bg-[#f5f4f0] px-5 py-3 rounded-br-2xl">
          <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-neutral-400">
            Trusted by
          </span>
        </div>

        <div className="mt-8 sm:mt-6">
          <h2 className="text-3xl sm:text-[2.8rem] font-bold tracking-[-0.03em] leading-[1.1] text-neutral-900">
            Brands that ship<br />
            <span className="text-neutral-400 font-normal italic">with confidence.</span>
          </h2>
        </div>

        <p className="text-sm text-neutral-400 leading-relaxed max-w-xs sm:text-right">
          From global enterprises to regional leaders — they trust Canaan Global to move what matters.
        </p>
      </div>

      {/* ── LOGO GRID ── */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {CLIENTS.map(({ name, domain }, i) => (
          <div
            key={name}
            style={{ 
              transitionDelay: isVisible ? `${(i % 5) * 60}ms` : "0ms" 
            }}
            className={`group relative bg-white rounded-2xl flex items-center justify-center p-5 sm:p-7 min-h-[90px] sm:min-h-[110px] overflow-hidden cursor-pointer bento-card transition-all duration-500 ease-out transform ${
              isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-[0.97]"
            }`}
          >
            {/* Corner accent — top-right on even, top-left on odd */}
            <div
              className={`absolute top-0 ${i % 2 === 0 ? "right-0 rounded-bl-xl" : "left-0 rounded-br-xl"} bg-[#f5f4f0] w-3 h-3 transition-colors duration-300 group-hover:bg-neutral-900`}
            />

            <img
              src={`https://img.logo.dev/${domain}?token=pk_TCYqoFGsRJK7RG3c9IqeQQ&size=128`}
              alt={`${name} logo`}
              className="max-h-8 sm:max-h-10 w-auto object-contain opacity-60 group-hover:opacity-0 transition-opacity duration-300 filter grayscale group-hover:scale-95 duration-500"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />

            {/* Fallback text if logo fails */}
            <span
              className="hidden items-center justify-center text-xs font-semibold tracking-widest uppercase text-neutral-300 group-hover:text-white transition-colors duration-300"
            >
              {name}
            </span>

            {/* Hover state — white logo + name */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:scale-105 duration-500">
              <img
                src={`https://img.logo.dev/${domain}?token=pk_TCYqoFGsRJK7RG3c9IqeQQ&size=128`}
                alt={`${name} logo`}
                className="max-h-7 sm:max-h-9 w-auto object-contain brightness-0 invert"
              />
              <span className="text-[9px] font-medium tracking-[0.15em] uppercase text-neutral-400">
                {name}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── BOTTOM STRIP ── */}
      <div className={`rounded-2xl bg-white px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 transition-all duration-700 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-sm font-medium text-neutral-900">
            15+ active global partnerships
          </span>
        </div>
        <p className="text-xs text-neutral-400 tracking-tight text-center sm:text-right">
          Serving clients across 30+ countries · Est. 2009
        </p>
      </div>

    </section>
  );
}