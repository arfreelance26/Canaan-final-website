"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight, Mail, Phone, MapPin, Clock } from "lucide-react";
import useFadeIn from "../hooks/useFadeIn";
import { API_BASE_URL } from "@/app/lib/api";

const CONTACT_INFO = [
  { icon: Mail, label: "Email us", value: "canaanglobal@canaanglobal.com" },
  { icon: Phone, label: "Call us", value: "+91 90470 12891" },
  { icon: MapPin, label: "Head office", value: "Tuticorin, India" },
  { icon: Clock, label: "Working hours", value: "Mon–Sat, 9am–6pm" },
];

function CustomSelect({ value, onChange, options, placeholder, name }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left bg-[#f5f4f0] border border-black/10 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-all duration-300 flex items-center justify-between outline-none"
      >
        <span className={value ? "text-neutral-900" : "text-neutral-500"}>
          {value || placeholder}
        </span>
        <svg className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      
      {open && (
        <div className="absolute z-[100] w-full mt-2 bg-white border border-black/5 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] py-1 overflow-hidden"
             style={{ animation: "fadeSlideIn 0.2s ease-out forwards" }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange({ target: { name, value: opt } }); setOpen(false); }}
              className="w-full text-left px-5 py-2.5 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-[#f5f4f0] transition-colors outline-none"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FileUpload({ value, onChange, name }) {
  return (
    <div className="relative group w-full">
      <input 
        type="file" 
        name={name} 
        onChange={onChange} 
        accept=".pdf" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
      />
      <div className="bg-[#f5f4f0] border border-black/10 rounded-xl px-4 py-3 text-sm text-neutral-500 flex items-center justify-between group-hover:bg-white group-hover:border-neutral-900 group-hover:ring-4 group-hover:ring-neutral-900/5 transition-all duration-300">
        <span className="truncate pr-4">{value ? value.name : "Upload PDF..."}</span>
        <svg className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
      </div>
    </div>
  );
}

export default function ContactSection() {
  const sectionRef = useRef(null);
  const isVisible = useFadeIn(sectionRef, 0.05);

  const INQUIRY_TYPES = ["Shipping", "Transportation", "RFID Seals"];
  const [inquiryType, setInquiryType] = useState("Shipping");
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });
  const typeRefs = useRef({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    shippingMode: "Import",
    portOfOrigin: "",
    portOfDestination: "",
    pickupLocation: "",
    deliveryLocation: "",
    quantity: "",
    deliveryAddress: "",
    companyName: "",
    orgType: "",
    orgStatus: "",
    portOfLoading: "",
    portOfDischarge: "",
    commodity: "",
    dgStatus: "",
    containerType: "",
    weight: "",
    factoryLocation: "",
    transportCargoType: "",
    transportExportImport: "",
    rfidOrgName: "",
    rfidSelfSealing: null,
    rfidIec: null,
    rfidGst: null,
    rfidPan: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState({});

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE_RE = /^[+]?[\d\s\-().]{7,20}$/;

  useEffect(() => {
    const updateSlider = () => {
      const el = typeRefs.current[inquiryType];
      if (el) {
        setSliderStyle({ left: el.offsetLeft, width: el.offsetWidth });
      }
    };
    updateSlider();
    const timer = setTimeout(updateSlider, 100);
    window.addEventListener("resize", updateSlider);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateSlider);
    };
  }, [inquiryType]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async () => {
    const next = {};
    if (!form.name.trim())                        next.name    = "Name is required.";
    if (!form.email.trim())                       next.email   = "Email is required.";
    else if (!EMAIL_RE.test(form.email.trim()))   next.email   = "Enter a valid email address.";
    if (form.phone && !PHONE_RE.test(form.phone)) next.phone   = "Enter a valid phone number.";
    if (!form.message.trim())                     next.message = "Message is required.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const payload = new FormData();
      payload.append("inquiry_type", inquiryType);
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          payload.append(key, value);
        }
      });

      const res = await fetch(`${API_BASE_URL}/api/contact/`, {
        method: "POST",
        body: payload,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      setSubmitted(true);
    } catch (err) {
      setSubmitError("Failed to send your message. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-[#f5f4f0] font-sans flex flex-col p-4 sm:p-5 gap-4 lg:gap-2 pb-10 lg:pb-5 lg:h-screen lg:overflow-hidden"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 shrink-0">
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
            <div className="flex flex-col flex-1 min-h-0 pt-0 pb-4 overflow-y-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              
              {/* Neumorphic Segmented Control */}
              <div className={`mx-5 sm:mx-6 mb-3 p-1 bg-[#f0eee9] rounded-xl flex relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)] border border-black/5 transition-[opacity,transform] duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: isVisible ? "50ms" : "0ms" }}>
                <div
                  className="absolute top-1 bottom-1 rounded-lg bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ left: sliderStyle.left, width: sliderStyle.width }}
                />
                {INQUIRY_TYPES.map((type) => (
                  <button
                    key={type}
                    ref={(el) => (typeRefs.current[type] = el)}
                    onClick={() => setInquiryType(type)}
                    className={`relative z-10 flex-1 py-2 text-[11.5px] font-semibold tracking-wide transition-colors duration-300 ${
                      inquiryType === type ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="px-5 sm:px-6 flex flex-col flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                <style>{`
                  @keyframes fieldEnter {
                    from { opacity: 0; transform: translateY(12px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                  }
                  .field-animate {
                    animation: fieldEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
                  }
                `}</style>

                {/* Name */}
                <div className={`relative flex flex-col gap-1.5 z-[60] transition-[opacity,transform] duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: isVisible ? "100ms" : "0ms" }}>
                  <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">Full name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" className={`bg-[#f5f4f0] border rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-[background-color,border-color,box-shadow] duration-300 ${errors.name ? "border-red-400 bg-red-50/40" : "border-black/10"}`} />
                  {errors.name && <p className="text-[11px] text-red-500 mt-0.5">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className={`relative flex flex-col gap-1.5 z-[59] transition-[opacity,transform] duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: isVisible ? "120ms" : "0ms" }}>
                  <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">Email address {inquiryType !== "Transportation" ? "*" : ""}</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Your Email" className={`bg-[#f5f4f0] border rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-[background-color,border-color,box-shadow] duration-300 ${errors.email ? "border-red-400 bg-red-50/40" : "border-black/10"}`} />
                  {errors.email && <p className="text-[11px] text-red-500 mt-0.5">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div className={`relative flex flex-col gap-1.5 z-[58] transition-[opacity,transform] duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: isVisible ? "140ms" : "0ms" }}>
                  <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">Phone number *</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Your Phone Number" className={`bg-[#f5f4f0] border rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-[background-color,border-color,box-shadow] duration-300 ${errors.phone ? "border-red-400 bg-red-50/40" : "border-black/10"}`} />
                  {errors.phone && <p className="text-[11px] text-red-500 mt-0.5">{errors.phone}</p>}
                </div>

                {/* ── SHIPPING FIELDS ── */}
                {inquiryType === "Shipping" && (
                  <>
                    <div className="relative flex flex-col gap-1.5 z-[57] field-animate" style={{ animationDelay: "0ms" }}>
                      <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">Company Name *</label>
                      <input name="companyName" value={form.companyName} onChange={handleChange} placeholder="e.g. Acme Corp" className="bg-[#f5f4f0] border border-black/10 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-[background-color,border-color,box-shadow] duration-300" />
                    </div>
                    <div className="relative flex flex-col gap-1.5 z-[56] field-animate" style={{ animationDelay: "40ms" }}>
                      <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">Trade Type *</label>
                      <div className="p-1 bg-[#f0eee9] rounded-xl flex relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)] border border-black/5">
                        <div className="absolute top-1 bottom-1 rounded-lg bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ left: form.shippingMode === "Export" ? "calc(50% + 2px)" : "4px", width: "calc(50% - 6px)" }} />
                        <button type="button" onClick={() => setForm(f => ({...f, shippingMode: "Import"}))} className={`relative z-10 flex-1 py-2 text-[11.5px] font-semibold tracking-wide transition-colors duration-300 ${form.shippingMode !== "Export" ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-700"}`}>Import</button>
                        <button type="button" onClick={() => setForm(f => ({...f, shippingMode: "Export"}))} className={`relative z-10 flex-1 py-2 text-[11.5px] font-semibold tracking-wide transition-colors duration-300 ${form.shippingMode === "Export" ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-700"}`}>Export</button>
                      </div>
                    </div>
                    <div className="relative flex flex-col gap-1.5 z-[55] field-animate" style={{ animationDelay: "80ms" }}>
                      <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">Port of loading *</label>
                      <input name="portOfLoading" value={form.portOfLoading} onChange={handleChange} placeholder="e.g. Shanghai" className="bg-[#f5f4f0] border border-black/10 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-all duration-300" />
                    </div>
                    <div className="relative flex flex-col gap-1.5 z-[54] field-animate" style={{ animationDelay: "120ms" }}>
                      <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">Port of discharge *</label>
                      <input name="portOfDischarge" value={form.portOfDischarge} onChange={handleChange} placeholder="e.g. Tuticorin" className="bg-[#f5f4f0] border border-black/10 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-all duration-300" />
                    </div>
                    <div className="relative flex flex-col gap-1.5 z-[53] field-animate" style={{ animationDelay: "160ms" }}>
                      <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">Container Type & Size *</label>
                      <CustomSelect name="containerType" value={form.containerType} onChange={handleChange} placeholder="Select type" options={["20 FT", "40 FT", "40 RF", "Other"]} />
                    </div>
                    <div className="relative flex flex-col gap-1.5 z-[52] field-animate" style={{ animationDelay: "200ms" }}>
                      <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">Weight</label>
                      <input name="weight" value={form.weight} onChange={handleChange} placeholder="e.g. 20 Tons" className="bg-[#f5f4f0] border border-black/10 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-all duration-300" />
                    </div>
                    <div className="relative flex flex-col gap-1.5 z-[51] field-animate" style={{ animationDelay: "240ms" }}>
                      <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">Factory location</label>
                      <input name="factoryLocation" value={form.factoryLocation} onChange={handleChange} placeholder="City, Country" className="bg-[#f5f4f0] border border-black/10 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-all duration-300" />
                    </div>
                  </>
                )}

                {/* ── TRANSPORTATION FIELDS ── */}
                {inquiryType === "Transportation" && (
                  <>
                    <div className="relative flex flex-col gap-1.5 z-[57] field-animate" style={{ animationDelay: "0ms" }}>
                      <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">Trade Type *</label>
                      <div className="p-1 bg-[#f0eee9] rounded-xl flex relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)] border border-black/5">
                        <div className="absolute top-1 bottom-1 rounded-lg bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ left: form.transportExportImport === "Export" ? "calc(50% + 2px)" : "4px", width: "calc(50% - 6px)" }} />
                        <button type="button" onClick={() => setForm(f => ({...f, transportExportImport: "Import"}))} className={`relative z-10 flex-1 py-2 text-[11.5px] font-semibold tracking-wide transition-colors duration-300 ${form.transportExportImport !== "Export" ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-700"}`}>Import</button>
                        <button type="button" onClick={() => setForm(f => ({...f, transportExportImport: "Export"}))} className={`relative z-10 flex-1 py-2 text-[11.5px] font-semibold tracking-wide transition-colors duration-300 ${form.transportExportImport === "Export" ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-700"}`}>Export</button>
                      </div>
                    </div>
                    <div className="relative flex flex-col gap-1.5 z-[56] field-animate" style={{ animationDelay: "40ms" }}>
                      <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">Pickup</label>
                      <input name="pickupLocation" value={form.pickupLocation} onChange={handleChange} placeholder="City or Address" className="bg-[#f5f4f0] border border-black/10 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-all duration-300" />
                    </div>
                    <div className="relative flex flex-col gap-1.5 z-[55] field-animate" style={{ animationDelay: "80ms" }}>
                      <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">Delivery</label>
                      <input name="deliveryLocation" value={form.deliveryLocation} onChange={handleChange} placeholder="City or Address" className="bg-[#f5f4f0] border border-black/10 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-all duration-300" />
                    </div>
                    <div className="relative flex flex-col gap-1.5 z-[54] field-animate" style={{ animationDelay: "120ms" }}>
                      <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">Type of Cargo</label>
                      <CustomSelect name="transportCargoType" value={form.transportCargoType} onChange={handleChange} placeholder="Select type" options={["Open-Load", "Container"]} />
                    </div>
                    {form.transportCargoType === "Container" && (
                      <div className="relative flex flex-col gap-1.5 z-[53] field-animate" style={{ animationDelay: "160ms" }}>
                        <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">Container Type</label>
                        <CustomSelect name="containerType" value={form.containerType} onChange={handleChange} placeholder="Select size" options={["20 FT", "40 FT"]} />
                      </div>
                    )}
                    <div className="relative flex flex-col gap-1.5 z-[52] field-animate" style={{ animationDelay: "200ms" }}>
                      <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">Weight *</label>
                      <input name="weight" value={form.weight} onChange={handleChange} placeholder="e.g. 20 Tons" className="bg-[#f5f4f0] border border-black/10 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-all duration-300" />
                    </div>
                  </>
                )}

                {/* ── RFID SEALS FIELDS ── */}
                {inquiryType === "RFID Seals" && (
                  <>
                    <div className="relative flex flex-col gap-1.5 z-[57] field-animate" style={{ animationDelay: "0ms" }}>
                      <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">Quantity Required *</label>
                      <input name="quantity" type="number" value={form.quantity} onChange={handleChange} placeholder="e.g. 500" className="bg-[#f5f4f0] border border-black/10 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-[background-color,border-color,box-shadow] duration-300" />
                    </div>
                    <div className="relative flex flex-col gap-1.5 z-[56] field-animate" style={{ animationDelay: "40ms" }}>
                      <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">Organisation Name *</label>
                      <input name="rfidOrgName" value={form.rfidOrgName} onChange={handleChange} placeholder="Company Name" className="bg-[#f5f4f0] border border-black/10 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-all duration-300" />
                    </div>
                  </>
                )}
              </div>

              {/* Message */}
              <div className={`flex flex-col gap-1.5 mb-3 transition-[opacity,transform] duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: isVisible ? "300ms" : "0ms" }}>
                <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">
                  Your message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tell us about your shipment requirements..."
                  className={`bg-[#f5f4f0] border rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-300 outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-[background-color,border-color,box-shadow] duration-300 resize-none ${errors.message ? "border-red-400 bg-red-50/40" : "border-black/10"}`}
                />
                {errors.message && <p className="text-[11px] text-red-500 mt-0.5">{errors.message}</p>}
              </div>

              {/* Submit */}
              {submitError && (
                <p className="text-[12px] text-red-500 mb-2 text-center">{submitError}</p>
              )}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="group flex items-center justify-center gap-2 bg-neutral-900 text-white text-sm font-semibold px-5 py-3 rounded-2xl hover:bg-neutral-800 transition-colors duration-300 w-full active:scale-[0.98] mt-auto disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending…" : <><span>Send message</span><ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" /></>}
              </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}