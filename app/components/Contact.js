"use client";

import { useState, useRef } from "react";
import { ArrowRight, Mail, Phone, MapPin, Clock } from "lucide-react";
import useFadeIn from "../hooks/useFadeIn";

const CONTACT_INFO = [
  { icon: Mail, label: "Email us", value: "canaanglobal@canaanglobal.com" },
  { icon: Phone, label: "Call us", value: "+91 90470 12891" },
  { icon: MapPin, label: "Head office", value: "Tuticorin, India" },
  { icon: Clock, label: "Working hours", value: "Mon–Sat, 9am–6pm" },
];

export default function ContactSection() {
  const sectionRef = useRef(null);
  const isVisible = useFadeIn(sectionRef, 0.05);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-[#f5f4f0] font-sans flex flex-col h-screen p-4 sm:p-5 gap-2 overflow-hidden"
    >

      {/* ── HEADER ── */}
      <div className={`text-center shrink-0 transition-[opacity,transform] duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-amber-700/60 mb-1">
          — Get in Touch
        </p>
        <p className="text-[18px] sm:text-[26px] font-medium tracking-[0.08em] uppercase text-neutral-500">
          Contact Us
        </p>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 flex-1 min-h-0">

        {/* ── LEFT — Contact info cards ── */}
        <div className="lg:col-span-2 flex flex-col gap-2 min-h-0">
          <div className="grid grid-cols-2 gap-2 shrink-0">
            {CONTACT_INFO.map(({ icon: Icon, label, value }, i) => (
              <div
                key={label}
                style={{
                  borderLeft: "2px solid rgba(210,165,45,0.35)",
                  transitionProperty: "opacity, transform",
                  transitionDuration: "0.75s, 0.75s",
                  transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1), cubic-bezier(0.34, 1.56, 0.64, 1)",
                  transitionDelay: isVisible ? `${i * 110}ms` : "0ms",
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateX(0px)" : "translateX(-60px)",
                }}
                className="group relative rounded-2xl overflow-hidden bg-white border border-black/[0.08] px-4 py-4 flex flex-col justify-between bento-card"
              >
                {/* Top icon */}
                <div className="w-9 h-9 rounded-full bg-neutral-50 border border-black/[0.08] flex items-center justify-center mb-3 group-hover:bg-[#1a1916] transition-colors duration-300">
                  <Icon size={15} className="text-neutral-400 group-hover:text-white transition-colors" />
                </div>

                <div>
                  <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400 mb-0.5">
                    {label}
                  </p>
                  <p className="text-sm font-semibold text-neutral-900 tracking-tight leading-snug">
                    {value}
                  </p>
                </div>
              </div>
            ))}

          </div>
          {/* Map card */}
          <div
            style={{
              transitionProperty: "opacity, transform",
              transitionDuration: "1.1s, 1.1s",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1), cubic-bezier(0.22, 1, 0.36, 1)",
              transitionDelay: isVisible ? "480ms" : "0ms",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0px) scale(1)" : "translateY(36px) scale(0.93)",
            }}
            className="flex-1 min-h-0 relative rounded-2xl overflow-hidden group bento-card"
          >
            {/* Google Maps iframe */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3943.5562115789494!2d78.04090921090196!3d8.733620491280172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b03efdb0585f415%3A0x236d4e35580fc822!2sCanaan%20Global%20International!5e0!3m2!1sen!2sin!4v1780553582286!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{
                position: "absolute",
                inset: 0,
                border: 0,
                filter: "grayscale(20%) contrast(1.05)",
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Canaan Global International — Tuticorin Head Office"
            />

            {/* Light overlay so overlays are readable */}
            <div className="absolute inset-0 bg-white/10 pointer-events-none" />

            {/* TOP LEFT */}


            {/* BOTTOM */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm px-4 py-4 rounded-t-2xl z-10 flex items-center justify-between pointer-events-none">
              <div>
                <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400 mb-0.5">
                  Head office
                </p>
                <p className="text-base font-bold tracking-[-0.02em] text-neutral-900">
                  Tuticorin, Tamil Nadu
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5 tracking-tight">
                  3/802-124, Zion Nagar, Puthukottai — 628 103
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=Tuticorin,Tamil+Nadu+628103"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-black/20 flex items-center justify-center shrink-0 hover:bg-neutral-950 hover:text-white hover:border-neutral-950 transition-[background-color,border-color,color] duration-300 pointer-events-auto"
              >
                <ArrowRight size={13} className="text-neutral-600 hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* ── RIGHT — Form card ── */}
        <div
          style={{
            transitionProperty: "opacity, transform",
            transitionDuration: "0.9s, 0.9s",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1), cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDelay: isVisible ? "80ms" : "0ms",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateX(0px)" : "translateX(70px)",
          }}
          className="lg:col-span-3 flex flex-col rounded-2xl overflow-hidden bg-white border border-black/[0.08] min-h-0"
        >

          {/* Form card header */}
          <div className="px-5 sm:px-6 pt-4 pb-3 border-b border-black/[0.06] shrink-0">
            <p className="text-[9px] font-semibold tracking-[0.18em] uppercase text-amber-700/60 mb-1">
              — Direct inquiry
            </p>
            <p className="text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">
              Tell us what you need — we handle the rest.
            </p>
          </div>

          {submitted ? (
            // ── Success state ──
            <div className="flex flex-col items-center justify-center h-full min-h-[460px] px-8 text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-2 animate-bounce">
                <span className="text-2xl text-emerald-600">✓</span>
              </div>
              <h3 className="text-xl font-bold tracking-[-0.02em] text-neutral-900">
                Message received!
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed max-w-xs">
                Thank you for reaching out to Canaan Global International.
                Our team will get back to you within 24 hours.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", service: "", message: "" }); }}
                className="mt-2 flex items-center gap-2 border border-black/15 text-neutral-700 text-sm font-medium px-5 py-2.5 rounded-full hover:bg-black hover:text-white hover:border-black transition-[background-color,color,border-color] duration-300 active:scale-95"
              >
                Send another message
              </button>
            </div>
          ) : (
            // ── Form ──
            <div className="flex flex-col flex-1 min-h-0 px-5 sm:px-6 pt-4 pb-4">

              {/* Name + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                <div className={`flex flex-col gap-1.5 transition-[opacity,transform] duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`} style={{ transitionDelay: isVisible ? "100ms" : "0ms" }}>
                  <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">
                    Full name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Smith"
                    className="bg-[#f5f4f0] border border-black/10 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-[background-color,border-color,box-shadow] duration-300"
                  />
                </div>
                <div className={`flex flex-col gap-1.5 transition-[opacity,transform] duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`} style={{ transitionDelay: isVisible ? "150ms" : "0ms" }}>
                  <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">
                    Email address
                  </label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                    className="bg-[#f5f4f0] border border-black/10 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-[background-color,border-color,box-shadow] duration-300"
                  />
                </div>
              </div>

              {/* Phone + Service row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                <div className={`flex flex-col gap-1.5 transition-[opacity,transform] duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`} style={{ transitionDelay: isVisible ? "200ms" : "0ms" }}>
                  <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">
                    Phone number
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 (000) 000-0000"
                    className="bg-[#f5f4f0] border border-black/10 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-[background-color,border-color,box-shadow] duration-300"
                  />
                </div>
                <div className={`flex flex-col gap-1.5 transition-[opacity,transform] duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`} style={{ transitionDelay: isVisible ? "250ms" : "0ms" }}>
                  <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">
                    Service needed
                  </label>
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="bg-[#f5f4f0] border border-black/10 rounded-xl px-4 py-3 text-sm text-neutral-900 outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-[background-color,border-color,box-shadow] duration-300 appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select a service</option>
                    <option>Freight Forwarding</option>
                    <option>Customs Clearance</option>
                    <option>Warehousing</option>
                    <option>Air Cargo</option>
                    <option>Sea Freight</option>
                    <option>Road Transport</option>
                    <option>Supply Chain</option>
                    <option>Last-Mile Delivery</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className={`flex flex-col gap-1.5 mb-3 transition-[opacity,transform] duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`} style={{ transitionDelay: isVisible ? "300ms" : "0ms" }}>
                <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">
                  Your message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tell us about your shipment requirements..."
                  className="bg-[#f5f4f0] border border-black/10 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-[background-color,border-color,box-shadow] duration-300 resize-none"
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                className="group flex items-center justify-center gap-2 bg-neutral-900 text-white text-sm font-semibold px-5 py-3 rounded-2xl hover:bg-neutral-800 transition-colors duration-300 w-full active:scale-[0.98] mt-1"
              >
                Send message <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>

              {/* Trust row */}
              <div className="flex items-center gap-6 pt-3 mt-2 border-t border-black/[0.06]">
                {[["\u003c 4 hrs", "Avg. response"], ["30+", "Countries"], ["50K+", "Shipments"]].map(([num, label]) => (
                  <div key={label}>
                    <p className="text-[13px] font-bold text-neutral-900 tracking-tight">{num}</p>
                    <p className="text-[10px] text-neutral-400 tracking-tight">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── BOTTOM STRIP ── */}
      <div className={`flex flex-wrap gap-1.5 px-1 shrink-0 transition-[opacity,transform] duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`} style={{ transitionDelay: isVisible ? "350ms" : "0ms" }}>
        {[
          "Freight Forwarding", "Customs Clearance", "Warehousing",
          "Air Cargo", "Sea Freight", "Road Transport",
          "24/7 Support", "30+ Countries",
        ].map((tag) => (
          <span
            key={tag}
            className="bg-white/80 border border-black/10 text-neutral-700 text-xs font-medium px-4 py-2 rounded-full tracking-tight hover:bg-[#1a1916] hover:text-[#f5f4f0] hover:border-[#1a1916] transition-[background-color,color,border-color] duration-300 cursor-pointer"
          >
            {tag}
          </span>
        ))}
      </div>

    </section>
  );
}