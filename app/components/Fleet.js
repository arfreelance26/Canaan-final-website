"use client"
import { useEffect, useRef } from "react";
import { ArrowRight, Weight } from "lucide-react";

const FLEET = [
  {
    name: "Flatbed Truck",
    type: "Heavy Freight",
    capacity: "30 Tons",
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=70&w=900",
    tag: "Most Popular",
  },
  {
    name: "Semi Trailer",
    type: "Long Haul",
    capacity: "40 Tons",
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=70&w=900",
    tag: "Long Distance",
  },
  {
    name: "Box Truck",
    type: "Enclosed Cargo",
    capacity: "10 Tons",
    image: "https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?q=70&w=900",
    tag: "City Delivery",
  },
  {
    name: "Tanker Truck",
    type: "Liquid Freight",
    capacity: "25 Tons",
    image: "https://images.unsplash.com/photo-1545459720-aac8509eb02c?q=70&w=900",
    tag: "Specialized",
  },
  {
    name: "Refrigerated Truck",
    type: "Cold Chain",
    capacity: "15 Tons",
    image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=70&w=900",
    tag: "Temperature Controlled",
  },
  {
    name: "Heavy Hauler",
    type: "Oversized Load",
    capacity: "60 Tons",
    image: "https://images.unsplash.com/photo-1504222490345-c075b7b7b10b?q=70&w=900",
    tag: "Heavy Duty",
  },
];

export default function FleetSection() {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    if (!section || !sticky || !track) return;

    let rafId = null;
    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.offsetHeight;
        const viewportHeight = window.innerHeight;

        // How far we've scrolled into the section (0 → sectionHeight - viewportHeight)
        const scrolled = Math.max(0, -sectionTop);
        const maxScroll = sectionHeight - viewportHeight;
        const progress = Math.min(scrolled / maxScroll, 1);

        // Total scrollable width of the track minus viewport width
        const trackWidth = track.scrollWidth - sticky.offsetWidth;
        track.style.transform = `translateX(-${progress * trackWidth}px)`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Section height = viewport height + extra scroll distance (one card width * cards)
  // We give 150vh extra per card so each card gets enough scroll to reveal cleanly
  const extraScroll = `${FLEET.length * 50}vh`;

  return (
    <section
      ref={sectionRef}
      id="fleet"
      className="relative bg-[#f5f4f0] font-sans"
      style={{ height: `calc(100vh + ${extraScroll})` }}
    >
      {/* ── STICKY CONTAINER — stays pinned while section is in view ── */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen flex flex-col overflow-hidden p-4 sm:p-5 gap-4"
      >
        {/* Header */}
        <p className="text-[22px] sm:text-[40px] text-center font-medium tracking-[0.12em] uppercase text-neutral-500 shrink-0">
          Our Fleet
        </p>

        {/* Progress dots */}
        {/* <div className="flex justify-center gap-2 shrink-0">
          {FLEET.map((v, i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-neutral-300"
              id={`fleet-dot-${i}`}
            />
          ))}
        </div> */}

        {/* Scrolling track */}
        <div className="flex-1 flex items-stretch overflow-visible">
          <div
            ref={trackRef}
            className="flex gap-3 will-change-transform"
            style={{ transition: "none" }}
          >
            {FLEET.map((vehicle) => (
              <div
                key={vehicle.name}
                className="relative rounded-2xl overflow-hidden shrink-0 group cursor-pointer"
                style={{ width: "calc(85vw - 2.5rem)", maxWidth: "520px", minWidth: "280px" }}
              >
                {/* Vehicle image */}
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />

                {/* TOP LEFT — tag badge */}
                <div className="absolute top-0 left-0 bg-[#f5f4f0] px-3 py-2 sm:px-4 sm:py-2.5 rounded-br-2xl z-10">
                  <span className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400">
                    {vehicle.tag}
                  </span>
                </div>

                {/* TOP RIGHT — capacity */}
                <div className="absolute top-0 right-0 bg-[#f5f4f0] px-3 py-2 sm:px-4 sm:py-2.5 rounded-bl-2xl z-10 flex items-center gap-1.5">
                  <Weight size={12} className="text-neutral-400" />
                  <span className="text-[11px] font-semibold text-neutral-900">{vehicle.capacity}</span>
                </div>

                {/* BOTTOM — name + type */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#f5f4f0] px-4 py-4 sm:px-5 sm:py-5 rounded-t-2xl z-10">
                  <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-neutral-400 mb-0.5">
                    {vehicle.type}
                  </p>
                  <h3 className="text-base sm:text-lg font-bold tracking-[-0.02em] text-neutral-900">
                    {vehicle.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tags strip */}
        <div className="flex flex-wrap gap-2 px-1 shrink-0">
          {["Flatbed", "Semi Trailer", "Box Truck", "Tanker", "Refrigerated", "Heavy Hauler", "GPS Tracked", "24/7 Support"].map((tag) => (
            <span
              key={tag}
              className="bg-white/80 border border-black/10 text-neutral-700 text-xs font-medium px-4 py-2 rounded-full tracking-tight"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Mobile CTA */}
        
      </div>
    </section>
  );
}
