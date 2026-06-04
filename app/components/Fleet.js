"use client"
import { useEffect, useRef } from "react";
import { ArrowRight, Weight } from "lucide-react";

const FLEET = [
  {
    name: "20 Feet Trailer",
    type: "Standard Trailer",
    capacity: "15 Tons",
    image: "/company/20feetb.png",
    tag: "Trailer",
    objectFit: "cover",
    objectPosition: "center 65%",
  },
  {
    name: "40 Feet Trailer",
    type: "Standard Trailer",
    capacity: "26 Tons",
    image: "/company/40feetb.png",
    tag: "Trailer",
    objectFit: "cover",
    objectPosition: "center 55%",
  },
  {
    name: "45 Feet Trailer",
    type: "Extended Trailer",
    capacity: "30 Tons",
    image: "/company/45feet.jpeg",
    tag: "Trailer",
    objectFit: "cover",
  },
  {
    name: "6x4 Truck",
    type: "10 Wheeler",
    capacity: "16 Tons",
    image: "/company/10wheeler.png",
    tag: "Truck",
    objectFit: "cover",
  },
  {
    name: "8x4 Truck",
    type: "12 Wheeler",
    capacity: "20 Tons",
    image: "/company/12wheeler.png",
    tag: "Truck",
    objectFit: "cover",
  },
  {
    name: "10x4 Truck",
    type: "14 Wheeler",
    capacity: "25 Tons",
    image: "/company/14wheeler.png",
    tag: "Truck",
    objectFit: "cover",
  },
  {
    name: "Tractor Head",
    type: "4x2 & 6x4 Variants",
    capacity: "Prime Mover",
    image: "/company/tractorhead.png",
    tag: "Tractor",
    objectFit: "cover",
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
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                  style={{ background: vehicle.objectFit === "contain" ? "#e8e7e3" : "transparent" }}
                >
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full"
                    style={{
                      objectFit: vehicle.objectFit || "cover",
                      objectPosition: vehicle.objectPosition || "center",
                    }}
                  />
                </div>
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
          {["20 Ft Trailer", "40 Ft Trailer", "45 Ft Trailer", "Low Bed", "6x4 Truck", "8x4 Truck", "10x4 Truck", "Tractor Head"].map((tag) => (
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
