// app/canaan-shipping-services/page.jsx
"use client";
import { useState } from "react";
import {
    ArrowRight, ArrowLeft, ArrowDown,
    Anchor, Package, Globe, Truck,
    FileCheck, Warehouse, Ship, Clock,
} from "lucide-react";
import Link from "next/link";

const NAV_ITEMS = ["About", "Service", "Fleet", "Clients", "Contact"];

const SERVICES = [
    {
        icon: Ship,
        tag: "Sea Freight",
        title: "Ocean Freight Forwarding",
        desc: "Full container load (FCL) and less-than-container load (LCL) shipments across all major global trade lanes. We handle booking, documentation, and port coordination end to end.",
        points: ["FCL & LCL shipments", "Multi-port routing", "Bill of lading management", "Port agency coordination"],
    },
    {
        icon: Globe,
        tag: "Air Freight",
        title: "Air Cargo Services",
        desc: "Time-sensitive cargo moved via premium airline partnerships. We manage airway bills, cargo screening, and last-mile delivery at destination.",
        points: ["Express & standard air", "Airway bill handling", "Cargo screening", "Airport-to-door delivery"],
    },
    {
        icon: FileCheck,
        tag: "Customs",
        title: "Customs Clearance",
        desc: "Licensed customs brokerage for all types of cargo. We manage import/export declarations, duty assessments, and liaison with port authorities.",
        points: ["Import & export clearance", "Duty & tariff advisory", "DGFT compliance", "Port authority liaison"],
    },
    {
        icon: Warehouse,
        tag: "Storage",
        title: "Warehousing & Distribution",
        desc: "Secure bonded and non-bonded warehousing near Tuticorin port. Inventory management, pick-and-pack, and last-mile distribution included.",
        points: ["Bonded warehousing", "Inventory management", "Pick, pack & dispatch", "Cold chain available"],
    },
    {
        icon: Truck,
        tag: "Inland",
        title: "Inland Transportation",
        desc: "Door-to-door road freight across Tamil Nadu and pan-India. GPS-tracked fleet with dedicated route managers for every consignment.",
        points: ["Pan-India road freight", "GPS-tracked fleet", "Dedicated route managers", "ODC & heavy haulage"],
    },
    {
        icon: Package,
        tag: "Projects",
        title: "Project Cargo",
        desc: "End-to-end management for oversized, heavy-lift, and high-value project shipments. We handle route surveys, permits, and specialist equipment.",
        points: ["Heavy-lift logistics", "Route & permit surveys", "Specialist equipment", "On-site coordination"],
    },
];

const STATS = [
    { num: "15+", label: "Years of expertise" },
    { num: "50K+", label: "Shipments handled" },
    { num: "30+", label: "Countries served" },
    { num: "98%", label: "On-time delivery" },
];

export default function CanaanShippingServicesPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        if (!formData.name || !formData.email) return;
        setSubmitted(true);
    };

    return (
        <main className="relative min-h-screen bg-[#f5f4f0] font-sans">

            {/* ══ HERO SECTION ══════════════════════════════════════════ */}
            <section className="relative h-screen flex flex-col p-4 sm:p-5 gap-3">

                {/* Hero image card */}
                <div className="relative flex-1 rounded-2xl overflow-hidden min-h-[380px]">
                    <img
                        src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=2070"
                        alt="Canaan Shipping Services"
                        className="w-full h-full object-cover absolute inset-0"
                        style={{ objectPosition: "center 50%" }}
                    />
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.75) 100%)",
                        }}
                    />

                    {/* TOP LEFT — back + logo */}


                    {/* TOP RIGHT — nav */}


                    {/* BOTTOM LEFT — hero text */}
                    <div className="absolute bottom-0 left-0 z-10 px-6 py-7 sm:px-10 sm:py-10 flex flex-col gap-3 max-w-[680px]">
                        <p className="text-[10px] sm:text-xs font-medium uppercase text-white/50 tracking-[0.18em]">
                            Canaan Global International · Est. 2009
                        </p>
                        <h1
                            style={{
                                fontSize: "clamp(2.4rem, 9vw, 6.5rem)",
                                fontWeight: 800,
                                letterSpacing: "-0.04em",
                                lineHeight: 0.92,
                                color: "#ffffff",
                                margin: 0,
                                textShadow: "0 4px 40px rgba(0,0,0,0.3)",
                            }}
                        >
                            Shipping
                        </h1>
                        <p
                            style={{
                                fontSize: "clamp(1rem, 3vw, 2rem)",
                                fontWeight: 600,
                                letterSpacing: "0.06em",
                                color: "rgba(255,255,255,0.6)",
                                textTransform: "uppercase",
                                margin: 0,
                            }}
                        >
                            Services
                        </p>
                        <div className="w-8 h-px bg-white/25 my-1" />
                        <p className="text-sm text-white/60 leading-relaxed max-w-sm">
                            Full-service freight forwarding and end-to-end logistics management from Tuticorin to the world.
                        </p>
                    </div>

                    {/* BOTTOM RIGHT — scroll */}
                    <div className="absolute bottom-0 right-0 z-10 bg-[#f5f4f0] px-5 py-4 sm:px-7 sm:py-5 rounded-tl-2xl flex items-center gap-2.5">
                        <span className="hidden sm:inline text-[11px] font-medium text-neutral-400 tracking-[0.1em] uppercase">
                            Scroll
                        </span>
                        <div className="w-8 h-8 rounded-full border-2 border-neutral-300 flex items-center justify-center animate-bounce">
                            <ArrowDown size={13} className="text-neutral-500" />
                        </div>
                    </div>
                </div>

                {/* Stats strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {STATS.map(({ num, label }) => (
                        <div
                            key={label}
                            className="bg-white/80 border border-black/10 rounded-2xl px-4 py-4 sm:px-5 sm:py-5 flex flex-col gap-1"
                        >
                            <span className="text-2xl sm:text-3xl font-bold tracking-[-0.04em] text-neutral-900 leading-none">
                                {num}
                            </span>
                            <span className="text-[10px] font-medium tracking-[0.08em] uppercase text-neutral-400">
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══ SERVICES SECTION ══════════════════════════════════════ */}
            <section className="relative bg-[#f5f4f0] flex flex-col p-4 sm:p-5 gap-3 pt-0">

                {/* Services header card */}
                <div className="relative rounded-2xl overflow-hidden min-h-[160px] sm:min-h-[180px]">
                    <img
                        src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070"
                        alt="Our Services"
                        className="w-full h-full object-cover absolute inset-0"
                    />
                    <div className="absolute inset-0 bg-black/50" />

                    {/* TOP LEFT */}
                    <div className="absolute top-0 left-0 bg-white/90 backdrop-blur-sm px-4 py-3 sm:px-7 sm:py-5 rounded-br-2xl z-10">
                        <span className="text-[10px] sm:text-xs font-medium tracking-[0.12em] uppercase text-neutral-400">
                            What we do
                        </span>
                    </div>

                    {/* TOP RIGHT */}
                    <div className="absolute top-0 right-0 bg-white/90 backdrop-blur-sm px-4 py-3 sm:px-7 sm:py-5 rounded-bl-2xl z-10 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        <span className="text-[11px] sm:text-sm font-medium text-neutral-900 tracking-tight">
                            {SERVICES.length} core services
                        </span>
                    </div>

                    {/* BOTTOM */}
                    <div className="absolute bottom-0 left-0 right-0 sm:right-auto bg-white/90 backdrop-blur-sm px-5 py-5 sm:px-7 sm:py-6 rounded-tr-2xl z-10">
                        <h2 className="text-2xl sm:text-3xl lg:text-[2.4rem] font-bold tracking-[-0.03em] leading-[1.18] text-neutral-900">
                            End-to-end logistics,<br className="hidden sm:block" />
                            <span className="text-neutral-400"> handled with precision.</span>
                        </h2>
                    </div>
                </div>

                {/* Services grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {SERVICES.map((svc, i) => {
                        const Icon = svc.icon;
                        return (
                            <div
                                key={i}
                                className="relative bg-white/80 border border-black/10 rounded-2xl overflow-hidden flex flex-col group hover:bg-white transition-colors duration-300"
                                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                            >
                                {/* Shimmer */}
                                <div className="absolute top-0 left-0 right-0 h-[45%] pointer-events-none"
                                    style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)", borderRadius: "20px 20px 0 0" }}
                                />

                                {/* TOP LEFT — tag */}
                                <div className="absolute top-0 left-0 bg-[#f5f4f0]/95 backdrop-blur-sm border border-black/[0.06] border-t-0 border-l-0 rounded-br-2xl px-3 py-2 z-10">
                                    <span className="text-[9px] font-600 tracking-[0.12em] uppercase text-neutral-400">
                                        {svc.tag}
                                    </span>
                                </div>

                                {/* TOP RIGHT — icon */}
                                <div className="absolute top-0 right-0 bg-[#f5f4f0]/95 backdrop-blur-sm border border-black/[0.06] border-t-0 border-r-0 rounded-bl-2xl px-3 py-2.5 z-10">
                                    <Icon size={13} className="text-neutral-400" strokeWidth={1.8} />
                                </div>

                                <div className="flex flex-col flex-1 p-5 pt-12 gap-3 relative z-[1]">

                                    {/* Title */}
                                    <h3 className="text-base font-bold tracking-tight text-neutral-900 leading-snug">
                                        {svc.title}
                                    </h3>

                                    {/* Divider */}
                                    <div className="w-6 h-px bg-black/15 rounded" />

                                    {/* Description */}
                                    <p className="text-xs text-neutral-500 leading-relaxed flex-1">
                                        {svc.desc}
                                    </p>

                                    {/* Bullet points */}
                                    <ul className="flex flex-col gap-1.5">
                                        {svc.points.map((pt) => (
                                            <li key={pt} className="flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-neutral-400 shrink-0" />
                                                <span className="text-[11px] text-neutral-500 tracking-tight">{pt}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA row */}
                                    <div className="flex items-center justify-between pt-2 border-t border-black/5">
                                        <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-neutral-400 group-hover:text-neutral-700 transition-colors">
                                            Learn more
                                        </span>
                                        <div className="w-7 h-7 rounded-full border border-black/10 flex items-center justify-center bg-transparent group-hover:bg-neutral-900 group-hover:border-neutral-900 transition-all duration-300">
                                            <ArrowRight size={11} className="text-neutral-400 group-hover:text-white transition-colors duration-300" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ══ CTA SECTION ═══════════════════════════════════════════ */}
            <section className="relative bg-[#f5f4f0] flex flex-col p-4 sm:p-5 gap-3 pt-0">

                {/* ── HEADER CARD ── */}
                <div className="relative rounded-2xl overflow-hidden min-h-[160px] sm:min-h-[180px]">
                    <img
                        src="https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=2070"
                        alt="Contact Canaan Shipping Services"
                        className="w-full h-full object-cover absolute inset-0"
                    />
                    <div className="absolute inset-0 bg-black/45" />

                    {/* TOP LEFT */}


                    {/* TOP RIGHT */}


                    {/* BOTTOM */}
                    <div className="absolute bottom-0 left-0 right-0 sm:right-auto bg-white/90 backdrop-blur-sm px-5 py-5 sm:px-7 sm:py-6 rounded-tr-2xl z-10">
                        <h2 className="text-2xl sm:text-3xl lg:text-[2.4rem] font-bold tracking-[-0.03em] leading-[1.18] text-neutral-900">
                            Ready to ship with<br className="hidden sm:block" />
                            <span className="text-neutral-400"> Canaan?</span>
                        </h2>
                    </div>
                </div>

                {/* ── CONTACT GRID ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

                    {/* Dark info card */}
                    <div className="lg:col-span-2 relative bg-neutral-900 rounded-2xl overflow-hidden p-6 sm:p-8 flex flex-col justify-between min-h-[260px]">

                        {/* Shimmer */}
                        <div
                            className="absolute top-0 left-0 right-0 h-[40%] pointer-events-none"
                            style={{
                                background: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)",
                                borderRadius: "20px 20px 0 0",
                            }}
                        />

                        {/* TOP LEFT label */}
                        <div className="absolute top-0 left-0 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-br-2xl z-10">
                            <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-white/40">
                                Canaan Shipping Services
                            </span>
                        </div>

                        <div className="pt-10 flex flex-col sm:flex-row gap-8 flex-1">

                            {/* Left — tagline + CTA */}
                            <div className="flex flex-col justify-between gap-6 sm:w-[45%]">
                                <div>
                                    <p className="text-white/40 text-xs tracking-[0.1em] uppercase mb-3">
                                        Full-service freight forwarding
                                    </p>
                                    <p className="text-sm text-white/60 leading-relaxed">
                                        Our team handles every step — from booking to final delivery. Reach us directly and we'll get back to you within 24 hours.
                                    </p>
                                </div>
                                <button className="flex items-center gap-2 bg-white text-neutral-900 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-neutral-100 transition-colors self-start">
                                    Request a quote <ArrowRight size={13} />
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="hidden sm:block w-px bg-white/10 self-stretch" />
                            <div className="sm:hidden h-px bg-white/10 w-full" />

                            {/* Right — contact details */}
                            <div className="flex flex-col gap-4 flex-1">
                                {[
                                    { label: "Mobile", value: "+91 90470 12891" },
                                    { label: "Landline", value: "0461 2900886" },
                                    { label: "Email", value: "canaanglobal@canaanglobal.com" },
                                    { label: "Address", value: "3/802-124, Zion Nagar, Theri Road, Puthukottai, Tuticorin — 628 103" },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex items-start gap-4">
                                        <span className="text-[9px] font-medium tracking-[0.12em] uppercase text-white/30 pt-0.5 w-12 shrink-0">
                                            {label}
                                        </span>
                                        <span className="text-sm font-medium text-white/75 tracking-tight leading-snug">
                                            {value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Map / location card */}
                    <div className="relative rounded-2xl overflow-hidden min-h-[260px]">

                        {/* Google Maps iframe */}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3942.3526!2d78.1304!3d8.7612!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b03ef5555555555%3A0x1!2sZion+Nagar%2C+Puthukottai%2C+Tuticorin%2C+Tamil+Nadu+628103!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{
                                position: "absolute",
                                inset: 0,
                                border: 0,
                                minHeight: 260,
                                filter: "grayscale(15%) contrast(1.05) brightness(0.98)",
                            }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Canaan Shipping Services — Tuticorin Head Office"
                        />

                        {/* Subtle overlay so overlays stay readable */}
                        <div className="absolute inset-0 bg-white/5 pointer-events-none" />

                        {/* TOP LEFT */}
                        <div className="absolute top-0 left-0 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-br-2xl z-10 pointer-events-none">
                            <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-neutral-400">
                                Our location
                            </span>
                        </div>

                        {/* BOTTOM */}
                        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm px-5 py-5 rounded-t-2xl z-10 flex items-end justify-between">
                            <div className="pointer-events-none">
                                <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400 mb-1">
                                    Head office
                                </p>
                                <p className="text-base font-bold tracking-[-0.02em] text-neutral-900 leading-tight">
                                    Tuticorin, Tamil Nadu
                                </p>
                                <p className="text-xs text-neutral-400 mt-0.5 leading-snug">
                                    3/802-124, Zion Nagar, Theri Road<br />
                                    Puthukottai — 628 103
                                </p>
                            </div>
                            <a
                                href="https://maps.google.com/?q=Zion+Nagar+Puthukottai+Tuticorin+Tamil+Nadu+628103"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full border border-black/15 flex items-center justify-center shrink-0 hover:bg-neutral-900 hover:border-neutral-900 transition-all duration-300 ml-3"
                            >
                                <ArrowRight size={13} className="text-neutral-500 hover:text-white transition-colors" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* ── BOTTOM STRIP ── */}
                <div className="flex flex-wrap gap-2 px-1">
                    {[
                        "Ocean Freight", "Air Cargo", "Customs Clearance",
                        "Warehousing", "Inland Transport", "Project Cargo",
                        "FCL & LCL", "Bonded Storage", "Pan-India Delivery",
                    ].map((tag) => (
                        <span
                            key={tag}
                            className="bg-white/80 border border-black/10 text-neutral-700 text-xs font-medium px-4 py-2 rounded-full tracking-tight"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

            </section>

        </main>
    );
}