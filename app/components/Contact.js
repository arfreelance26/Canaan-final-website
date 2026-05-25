"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Mail, Phone, MapPin, Clock } from "lucide-react";

const CONTACT_INFO = [
  { icon: Mail, label: "Email us", value: "info@canaanglobal.com" },
  { icon: Phone, label: "Call us", value: "+1 (800) 000-0000" },
  { icon: MapPin, label: "Head office", value: "Dubai, UAE" },
  { icon: Clock, label: "Working hours", value: "Mon–Sat, 8am–6pm" },
];

function useFadeIn(ref, threshold = 0.05) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

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
      className="relative bg-[#f5f4f0] font-sans flex flex-col p-4 sm:p-5 gap-3 overflow-hidden"
    >

      {/* ── HEADER CARD ── */}
      <p className={`text-[22px] sm:text-[40px] text-center font-medium tracking-[0.12em] uppercase text-neutral-500 shrink-0 transition-all duration-700 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
        Contact Us
      </p>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">

        {/* ── LEFT — Contact info cards ── */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-2 gap-3">
          {CONTACT_INFO.map(({ icon: Icon, label, value }, i) => (
            <div
              key={label}
              style={{
                transitionDelay: isVisible ? `${i * 60}ms` : "0ms"
              }}
              className={`group relative rounded-2xl overflow-hidden bg-white/80 border border-black/10 px-4 py-5 sm:px-5 sm:py-6 flex flex-col justify-between min-h-[130px] sm:min-h-[150px] bento-card transition-all duration-500 ease-out transform ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.98]"
                }`}
            >
              {/* Top icon */}
              <div className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center mb-3 group-hover:bg-[#1a1916] group-hover:text-[#f5f4f0] transition-colors duration-300">
                <Icon size={15} className="text-neutral-500 group-hover:text-white transition-colors" />
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

          {/* Map card */}
          <div
            style={{ transitionDelay: isVisible ? "240ms" : "0ms" }}
            className={`col-span-2 relative rounded-2xl overflow-hidden min-h-[200px] sm:min-h-[220px] group bento-card transition-all duration-700 ease-out transform ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.98]"
              }`}
          >
            {/* Google Maps iframe */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3942.3!2d78.1338!3d8.7642!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b03ef3e59a63c97%3A0x8b1e0e1e1e1e1e1e!2sThoothukudi%2C%20Tamil%20Nadu%20628%20103!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{
                position: "absolute",
                inset: 0,
                border: 0,
                filter: "grayscale(20%) contrast(1.05)",
                minHeight: 220,
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
                className="w-8 h-8 rounded-full border border-black/20 flex items-center justify-center shrink-0 hover:bg-neutral-950 hover:text-white hover:border-neutral-950 transition-all duration-300 pointer-events-auto"
              >
                <ArrowRight size={13} className="text-neutral-600 hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* ── RIGHT — Form card ── */}
        <div
          style={{
            transitionDelay: isVisible ? "150ms" : "0ms"
          }}
          className={`lg:col-span-3 relative rounded-2xl overflow-hidden bg-white/80 border border-black/10 transition-all duration-700 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >

          {/* TOP LEFT — label */}
          <div className="absolute top-0 left-0 bg-white/90 backdrop-blur-sm px-4 py-3 sm:px-5 sm:py-4 rounded-br-2xl z-10">
            <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-neutral-400">
              Send a message
            </span>
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
                className="mt-2 flex items-center gap-2 border border-black/15 text-neutral-700 text-sm font-medium px-5 py-2.5 rounded-full hover:bg-black hover:text-white hover:border-black transition-all duration-300 active:scale-95"
              >
                Send another message
              </button>
            </div>
          ) : (
            // ── Form ──
            <div className="flex flex-col gap-0 pt-16 sm:pt-20 pb-6 px-5 sm:px-6">

              {/* Name + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className={`flex flex-col gap-1.5 transition-all duration-500 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`} style={{ transitionDelay: isVisible ? "100ms" : "0ms" }}>
                  <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">
                    Full name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Smith"
                    className="bg-[#f5f4f0] border border-black/10 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-all duration-300"
                  />
                </div>
                <div className={`flex flex-col gap-1.5 transition-all duration-500 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`} style={{ transitionDelay: isVisible ? "150ms" : "0ms" }}>
                  <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">
                    Email address
                  </label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                    className="bg-[#f5f4f0] border border-black/10 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Phone + Service row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className={`flex flex-col gap-1.5 transition-all duration-500 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`} style={{ transitionDelay: isVisible ? "200ms" : "0ms" }}>
                  <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">
                    Phone number
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 (000) 000-0000"
                    className="bg-[#f5f4f0] border border-black/10 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-all duration-300"
                  />
                </div>
                <div className={`flex flex-col gap-1.5 transition-all duration-500 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`} style={{ transitionDelay: isVisible ? "250ms" : "0ms" }}>
                  <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">
                    Service needed
                  </label>
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="bg-[#f5f4f0] border border-black/10 rounded-xl px-4 py-3 text-sm text-neutral-900 outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-all duration-300 appearance-none cursor-pointer"
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
              <div className={`flex flex-col gap-1.5 mb-5 transition-all duration-500 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`} style={{ transitionDelay: isVisible ? "300ms" : "0ms" }}>
                <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">
                  Your message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about your shipment requirements..."
                  className="bg-[#f5f4f0] border border-black/10 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-all duration-300 resize-none"
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                className="group flex items-center justify-center gap-2 bg-neutral-900 text-white text-sm font-semibold px-5 py-3 rounded-full hover:bg-neutral-800 transition-all duration-300 w-full active:scale-98"
              >
                Send message <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>

              <p className="text-[10px] text-neutral-300 text-center mt-3 tracking-tight">
                By submitting, you agree to our privacy policy. No spam, ever.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── BOTTOM STRIP ── */}
      <div className={`flex flex-wrap gap-2 px-1 transition-all duration-700 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`} style={{ transitionDelay: isVisible ? "350ms" : "0ms" }}>
        {[
          "Freight Forwarding", "Customs Clearance", "Warehousing",
          "Air Cargo", "Sea Freight", "Road Transport",
          "24/7 Support", "30+ Countries",
        ].map((tag) => (
          <span
            key={tag}
            className="bg-white/80 border border-black/10 text-neutral-700 text-xs font-medium px-4 py-2 rounded-full tracking-tight hover:bg-[#1a1916] hover:text-[#f5f4f0] hover:border-[#1a1916] transition-all duration-300 cursor-pointer"
          >
            {tag}
          </span>
        ))}
      </div>

    </section>
  );
}