"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Anchor } from "lucide-react";
import Image from "next/image";
import companylogo from "../../company photos/companylogo.png";

const NAV_ITEMS = ["Home", "About", "Service", "Cargo", "Clients", "Contact"];

// ── Hot reload for logo position tweak ──
function LogoPlaceholder() {
  return (
    <Image 
      src={companylogo} 
      alt="Canaan Logo" 
      className="h-14 sm:h-[68px] w-auto object-contain ml-2 sm:ml-3"
      priority
    />
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [isHidden, setIsHidden] = useState(false);
  const [isLogoVisible, setIsLogoVisible] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const routeToNavItem = (path) => {
    if (!path) return "Home";
    if (path === "/about" || path.startsWith("/about/")) return "About";
    if (path === "/canaan-shipping-services" || path.startsWith("/canaan-shipping-services/")) return "Service";
    if (path === "/cargo" || path.startsWith("/cargo/")) return "Cargo";
    return "Home";
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

  async function handleLogoClick() {
    if (pathname !== "/") {
      setTransitioning(true);
      setTimeout(() => {
        router.push("/");
        setTimeout(() => setTransitioning(false), 400);
      }, 180);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function navigateTo(item) {
    setActiveItem(item);
    const id = item.toLowerCase();

    if (item === "Home") {
      if (pathname !== "/") {
        setTransitioning(true);
        setTimeout(() => {
          router.push("/");
          setTimeout(() => setTransitioning(false), 400);
        }, 180);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      setMobileOpen(false);
      return;
    }

    if (item === "About") {
      if (pathname === "/about") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setTransitioning(true);
        setTimeout(() => {
          router.push("/about");
          setTimeout(() => setTransitioning(false), 400);
        }, 180);
      }
      setMobileOpen(false);
      return;
    }

    if (item === "Service") {
      if (pathname === "/canaan-shipping-services") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setTransitioning(true);
        setTimeout(() => {
          router.push("/canaan-shipping-services");
          setTimeout(() => setTransitioning(false), 400);
        }, 180);
      }
      setMobileOpen(false);
      return;
    }

    if (item === "Cargo") {
      if (pathname === "/cargo") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setTransitioning(true);
        setTimeout(() => {
          router.push("/cargo");
          setTimeout(() => setTransitioning(false), 400);
        }, 180);
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
        className={`fixed cursor-pointer z-50 top-0 left-0 bg-white/80 backdrop-blur-xl border-b border-r border-black/[0.06] pl-5 pr-10 h-[76px] sm:h-[88px] sm:pl-6 sm:pr-12 rounded-br-2xl flex items-center animate-fade-in transition-[opacity,transform] duration-500 ease-in-out ${
          isHidden || !isLogoVisible ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
        }`}
      >
        {/* Logo */}
        <LogoPlaceholder />
      </div>

      {/* ── TOP RIGHT — nav (desktop) + hamburger (mobile) ── */}
      <div className={`fixed z-50 top-0 right-0 bg-white/80 backdrop-blur-xl border-b border-l border-black/[0.06] px-5 sm:px-7 h-[76px] sm:h-[88px] rounded-bl-2xl flex items-center gap-3 transition-transform duration-500 ease-in-out ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}>

        {/* Desktop nav pill */}
        <nav className="hidden sm:flex items-center bg-black/[0.07] border border-black/10 rounded-full px-1.5 h-11 gap-0.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              onClick={() => navigateTo(item)}
              className={`bg-transparent border-none font-medium text-[13.5px] tracking-tight px-3 h-8 rounded-full cursor-pointer transition-colors ${
                activeItem === item
                  ? "text-neutral-950 font-semibold"
                  : "text-neutral-600 hover:text-neutral-900"
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
