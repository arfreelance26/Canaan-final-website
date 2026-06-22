"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import companylogo from "@/app/assets/images/company/companylogo.png";
import { API_BASE_URL } from "@/app/lib/api";

const ALL_NAV_ITEMS = ["Home", "About", "Service", "Cargo", "Accreditations", "Updates", "Clients", "Contact"];

// ── Hot reload for logo position tweak ──
function LogoPlaceholder() {
  return (
    <Image 
      src={companylogo} 
      alt="Canaan Global Logo"
      className="h-14 sm:h-[68px] w-auto object-contain ml-2 sm:ml-3"
      priority
    />
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [isHidden, setIsHidden] = useState(false);
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRefs = useRef({});
  const [isLogoVisible, setIsLogoVisible] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [hasAccreditations, setHasAccreditations] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/licenses/`)
      .then((res) => res.json())
      .then((data) => setHasAccreditations(Array.isArray(data) && data.length > 0))
      .catch(() => {});
  }, []);

  const NAV_ITEMS = ALL_NAV_ITEMS.filter((item) => item !== "Accreditations" || hasAccreditations);

  const routeToNavItem = (path) => {
    if (!path) return "Home";
    if (path === "/about" || path.startsWith("/about/")) return "About";
    if (path === "/services" || path.startsWith("/services/")) return "Service";
    if (path === "/cargo" || path.startsWith("/cargo/")) return "Cargo";
    if (path === "/accreditations" || path.startsWith("/accreditations/")) return "Accreditations";
    if (path === "/updates" || path.startsWith("/updates/")) return "Updates";
    return "Home";
  };

  useEffect(() => {
    setActiveItem(routeToNavItem(pathname));
  }, [pathname]);

  useEffect(() => {
    const updateSlider = () => {
      const el = navRefs.current[activeItem];
      if (el) {
        setSliderStyle({
          left: el.offsetLeft,
          width: el.offsetWidth,
          opacity: 1,
        });
      }
    };
    updateSlider();
    const timer = setTimeout(updateSlider, 150); // allow fonts to render
    window.addEventListener("resize", updateSlider);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateSlider);
    };
  }, [activeItem]);

  // Auto-hide when inside scroll-heavy sections
  useEffect(() => {
    const hiddenStates = new Map();
    let observer;
    const timer = setTimeout(() => {
      const targets = document.querySelectorAll("[data-hide-navbar]");
      if (!targets.length) return;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => hiddenStates.set(e.target, e.isIntersecting));
          setIsHidden(Array.from(hiddenStates.values()).some(Boolean));
        },
        { threshold: 0.12 }
      );
      targets.forEach((el) => observer.observe(el));
    }, 60);
    return () => {
      clearTimeout(timer);
      observer?.disconnect();
      setIsHidden(false);
    };
  }, [pathname]);

  useEffect(() => {
    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        setIsLogoVisible(window.scrollY < window.innerHeight * 0.5);
        rafId = null;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;

    const onScroll = () => {
      const sections = Array.from(document.querySelectorAll("[data-nav-item]"));
      if (!sections.length) return;

      const scrollY = window.scrollY;
      const firstTop = sections[0].getBoundingClientRect().top + scrollY;
      if (scrollY + 20 < firstTop) {
        setActiveItem((prev) => (prev === "Home" ? prev : "Home"));
        return;
      }

      const probeY = scrollY + window.innerHeight * 0.35;
      let current = "Home";

      for (const el of sections) {
        const top = el.getBoundingClientRect().top + scrollY;
        if (probeY >= top - 40) current = el.getAttribute("data-nav-item") || current;
      }

      setActiveItem((prev) => (prev === current ? prev : current));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Navigating to a new route should always land at its top — reset scroll
  // before the push so it happens behind the opaque transition overlay.
  function goToRoute(path) {
    window.scrollTo(0, 0);
    setTransitioning(true);
    setTimeout(() => {
      router.push(path);
      setTimeout(() => setTransitioning(false), 400);
    }, 180);
  }

  // Sections like Fleet reserve their height based on an async fetch, so they
  // can grow taller *after* the initial scroll already landed — leaving the
  // user inside Fleet instead of at the next section's top. Re-correct for a
  // short window after layout settles, but back off as soon as the user scrolls.
  function scrollToAnchor(id) {
    let cancelled = false;
    const stop = () => { cancelled = true; cleanup(); };
    const cleanup = () => {
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
    };
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchmove", stop, { passive: true });

    let attempts = 0;
    const tick = () => {
      if (cancelled) return;
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      attempts += 1;
      if (attempts < 4) setTimeout(tick, 350);
      else cleanup();
    };
    tick();
  }

  async function handleLogoClick() {
    if (pathname !== "/") {
      goToRoute("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function navigateTo(item) {
    setActiveItem(item);
    const id = item.toLowerCase();

    const ROUTES = {
      Home: "/",
      About: "/about",
      Service: "/services",
      Cargo: "/cargo",
      Accreditations: "/accreditations",
      Updates: "/updates",
    };

    if (ROUTES[item]) {
      const path = ROUTES[item];
      if (pathname === path) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        goToRoute(path);
      }
      setMobileOpen(false);
      return;
    }

    // For in-page sections: if not on home, navigate home first then scroll
    if (pathname !== "/") {
      await router.push("/");
      // small delay to allow DOM to mount and settle
      setTimeout(() => scrollToAnchor(id), 150);
    } else {
      scrollToAnchor(id);
    }

    setMobileOpen(false);
  }

  return (
    <>
      {/* ── PAGE TRANSITION OVERLAY ── */}
      <div
        className="fixed inset-0 z-[200] pointer-events-none bg-[#f5f4f0]"
        style={{
          opacity: transitioning ? 1 : 0,
          transition: transitioning
            ? "opacity 0.22s ease-in"
            : "opacity 0.28s ease-out",
        }}
      />

      {/* ── TOP LEFT — logo + company name ── */}
      <div 
        onClick={handleLogoClick}
        className={`fixed cursor-pointer z-50 top-0 left-0 bg-[#f5f4f0] pl-5 pr-10 h-[76px] sm:h-[88px] sm:pl-6 sm:pr-12 rounded-br-2xl flex items-center animate-fade-in transition-[opacity,transform] duration-500 ease-in-out ${
          isHidden || !isLogoVisible ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
        }`}
      >
        {/* Logo */}
        <LogoPlaceholder />
      </div>

      {/* ── TOP RIGHT — nav (desktop) + hamburger (mobile) ── */}
      <div className={`fixed z-50 top-0 right-0 bg-[#f5f4f0] px-5 sm:px-7 h-[76px] sm:h-[88px] rounded-bl-2xl flex items-center gap-3 transition-transform duration-500 ease-in-out ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}>

        {/* Desktop nav pill */}
        <nav className="hidden sm:flex relative items-center bg-black/[0.07] rounded-full px-1.5 h-11 gap-0.5">
          {/* Active Slider */}
          <div
            className="absolute h-8 rounded-full bg-[#f5f4f0] shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
            style={{
              left: sliderStyle.left,
              width: sliderStyle.width,
              opacity: sliderStyle.opacity,
            }}
          />
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              ref={(el) => (navRefs.current[item] = el)}
              onClick={() => navigateTo(item)}
              className={`relative z-10 bg-transparent border-none font-medium text-[12.5px] tracking-tight px-3 h-8 rounded-full cursor-pointer transition-colors ${
                item === "Updates"
                  ? `text-white ${activeItem === item ? "font-semibold" : "hover:text-white"}`
                  : activeItem === item
                    ? "text-neutral-950 font-semibold"
                    : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {item === "Updates" && (
                <span 
                  className={`absolute inset-0 bg-red-500/60 border border-red-500 rounded-full -z-10 pointer-events-none shadow-[0_0_8px_rgba(239,68,68,0.5)] ${pathname === "/" && isLogoVisible ? "animate-pulse" : ""}`}
                  style={pathname === "/" && isLogoVisible ? { animationDuration: '1s' } : {}}
                />
              )}
              {item}
            </button>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-5 bg-neutral-900 transition-all duration-200 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-0.5 w-5 bg-neutral-900 transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 bg-neutral-900 transition-all duration-200 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* ── Mobile dropdown nav ── */}
      {mobileOpen && (
        <div className={`fixed top-[84px] left-4 right-4 z-40 sm:hidden flex flex-col bg-[#f5f4f0] rounded-2xl px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-black/5 transition-all duration-300 ${
          isHidden ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
        }`}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              onClick={() => navigateTo(item)}
              className="text-left text-neutral-900 font-semibold text-[15px] py-3.5 border-b border-black/5 last:border-0 hover:text-neutral-500 transition-colors flex justify-between items-center"
            >
              <span>{item}</span>
              {item === "Updates" && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2" />
              )}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
