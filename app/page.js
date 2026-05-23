"use client";
import React, { useState, useEffect } from "react";
import DavidHazHero from "./components/Hero";
import About from "./components/About";
import FleetSection from "./components/Fleet";
import FounderSection from "./components/Founder";
import ClientsSection from "./components/Client";
import TestimonialsSection from "./components/Testimonial";
import TimelineSection from "./components/Timeline";
import FrameScrollSection from "./components/Frame";
import ContactSection from "./components/Contact";
import WorldNetworkSection from "./components/World";
import LoadingPage from "./components/Loading";

export default function Home() {
  const [loaded, setLoaded] = useState(true); // default true = skip loader

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("cgi_loaded");

    if (!hasLoaded) {
      // First visit or refresh — show loader
      setLoaded(false);
      const timer = setInterval(() => {
        setLoaded(true);
        sessionStorage.setItem("cgi_loaded", "true");
        clearInterval(timer);
      }, 4500);
      return () => clearInterval(timer);
    }
    // Navigating back from /about — skip loader, already loaded
  }, []);

  return (
    <div>
      {!loaded && <LoadingPage />}

      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.8s ease",
          visibility: loaded ? "visible" : "hidden",
        }}
      >
        <DavidHazHero />
        <TimelineSection />
        <FrameScrollSection />
        <FleetSection />
        <WorldNetworkSection />
        <ClientsSection />
        <TestimonialsSection />
        <ContactSection />
      </div>
    </div>
  );
}