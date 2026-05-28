"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Anchor } from "lucide-react";

const NAV_ITEMS = ["Home", "About", "Service", "Fleet", "Clients", "Contact"];

function LogoPlaceholder() {
  return (
    <div className="w-10 h-10 rounded-lg bg-neutral-900 flex items-center justify-center shrink-0">
      <Anchor size={18} className="text-white" strokeWidth={2} />
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [slider, setSlider] = useState({ left: 0, width: 0, opacity: 0 });
  const [isHidden, setIsHidden] = useState(false);
  const navRef = useRef(null);
  const btnRefs = useRef({});
  const pathname = usePathname();
  const router = useRouter();

  const routeToNavItem = (path) => {
    if (!path) return "Home";
    if (path === "/about" || path.startsWith("/about/")) return "About";
    if (path === "/canaan-shipping-services" || path.startsWith("/canaan-shipping-services/")) return "Service";
    return "Home";
  };

  const syncSliderTo = (item) => {
    const nav = navRef.current;
    const btn = btnRefs.current[item];
    if (!nav || !btn) return;
    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setSlider({
      left: Math.round(btnRect.left - navRect.left),
      width: Math.round(btnRect.width),
      opacity: 1,
    });
  };

  useEffect(() => {
    setActiveItem(routeToNavItem(pathname));
  }, [pathname]);

  // Auto-hide when inside scroll-heavy sections
  useEffect(() => {
    let observer;
    const timer = setTimeout(() => {
      const targets = document.querySelectorAll("[data-hide-navbar]");
      if (!targets.length) return;
      observer = new IntersectionObserver(
        (entries) => {
          setIsHidden(entries.some((e) => e.isIntersecting));
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
    const raf = requestAnimationFrame(() => syncSliderTo(activeItem));
    return () => cancelAnimationFrame(raf);
  }, [activeItem]);

  useEffect(() => {
    const onResize = () => syncSliderTo(activeItem);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeItem]);

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

  async function handleLogoClick() {
    if (pathname !== "/") {
      await router.push("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function navigateTo(item) {
    setActiveItem(item);
    const id = item.toLowerCase();

    if (item === "Home") {
      if (pathname !== "/") {
        await router.push("/");
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      setMobileOpen(false);
      return;
    }

    if (item === "About") {
      if (pathname !== "/about") {
        await router.push("/about");
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      setMobileOpen(false);
      return;
    }

    // For in-page sections: if not on home, navigate home first then scroll
    if (pathname !== "/") {
      await router.push("/");
      // small delay to allow DOM to mount and settle
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }

    setMobileOpen(false);
  }

  return (
    <>
      {/* ── TOP LEFT — logo + company name ── */}
      <div 
        onClick={handleLogoClick}
        className={`fixed cursor-pointer z-50 top-0 left-0 bg-white/80 backdrop-blur-xl border-b border-r border-black/[0.06] px-5 py-4 sm:px-6 sm:py-4 rounded-br-2xl flex items-center gap-3 animate-fade-in transition-transform duration-500 ease-in-out ${
          isHidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        {/* Logo */}
        <LogoPlaceholder />

        {/* Company name */}
        <div className="leading-tight">
          <div
            className="font-bold tracking-tight text-neutral-900"
            style={{ fontSize: 15, letterSpacing: "-0.02em" }}
          >
            Canaan
          </div>
          <div
            className="font-semibold tracking-tight text-neutral-500"
            style={{ fontSize: 11, letterSpacing: "0.01em" }}
          >
            Global International
          </div>
        </div>
      </div>

      {/* ── TOP RIGHT — nav (desktop) + hamburger (mobile) ── */}
      <div className={`fixed z-50 top-0 right-0 bg-white/80 backdrop-blur-xl border-b border-l border-black/[0.06] px-5 py-4 sm:px-7 sm:py-5 rounded-bl-2xl flex items-center gap-3 transition-transform duration-500 ease-in-out ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}>

        {/* Desktop nav pill */}
        <nav
          ref={navRef}
          className="hidden sm:flex relative items-center bg-black/[0.07] border border-black/10 rounded-full pl-4 pr-1.5 h-11 gap-0 overflow-hidden"
        >
          <span
            aria-hidden
            className="absolute top-1.5 h-8 rounded-full border border-white/60 bg-white/42 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_6px_16px_rgba(0,0,0,0.10)] transition-all duration-300 ease-out"
            style={{
              left: slider.left,
              width: slider.width,
              opacity: slider.opacity,
            }}
          />
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              ref={(el) => { btnRefs.current[item] = el; }}
              onClick={() => navigateTo(item)}
              className={`relative z-10 bg-transparent border-none font-medium text-[13.5px] tracking-tight px-3 h-8 rounded-full cursor-pointer transition-colors ${
                activeItem === item ? "text-neutral-950" : "text-neutral-900 hover:text-neutral-500"
              }`}
            >
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

        {/* Mobile dropdown nav */}
        {mobileOpen && (
          <div className="absolute top-20 left-4 right-4 z-50 sm:hidden flex flex-col bg-[#f5f4f0] backdrop-blur-md border border-black/10 rounded-xl px-4 py-3 gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => navigateTo(item)}
                className="text-left text-neutral-900 font-medium text-[15px] py-2 border-b border-black/5 last:border-0 hover:text-neutral-500 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
