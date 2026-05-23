"use client";

import { useState } from "react";
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
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogoClick() {
    if (pathname !== "/") {
      await router.push("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function navigateTo(item) {
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
        className="fixed cursor-pointer z-50 top-0 left-0 bg-[#f5f4f0] backdrop-blur-sm px-5 py-4 sm:px-6 sm:py-4 rounded-br-2xl flex items-center gap-3 animate-fade-in"
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
      <div className="fixed z-50 top-0 right-0 bg-[#f5f4f0] backdrop-blur-sm px-5 py-4 sm:px-7 sm:py-5 rounded-bl-2xl flex items-center gap-3 z-50">

        {/* Desktop nav pill */}
        <nav className="hidden sm:flex items-center bg-black/[0.07] border border-black/10 rounded-full pl-4 pr-1.5 h-11 gap-0">
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              onClick={() => navigateTo(item)}
              className="bg-transparent border-none text-neutral-900 font-medium text-[13.5px] tracking-tight px-3 cursor-pointer hover:text-neutral-500 transition-colors"
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
