"use client";
import { useEffect, useState } from "react";
import AboutEmbed from "../components/AboutEmbed";
export default function AboutPage() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <main
      className="bg-[#f5f4f0] min-h-screen"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.45s ease-out 0.15s, transform 0.45s ease-out 0.15s",
      }}
    >
      <AboutEmbed />
    </main>
  );
}
