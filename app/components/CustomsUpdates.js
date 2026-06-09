"use client";
import { useRef } from "react";
import useFadeIn from "../hooks/useFadeIn";

export default function CustomsUpdatesSection() {
  const sectionRef = useRef(null);
  const isVisible = useFadeIn(sectionRef, 0.1);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white py-24 sm:py-32 font-sans overflow-hidden min-h-[80vh] flex flex-col justify-center items-center"
    >
      <div
        className={`transition-all duration-1000 ease-out transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 mb-6 text-center">
          Daily Customs Updates
        </h2>
        <p className="text-lg text-neutral-600 max-w-2xl text-center mx-auto">
          We will build out the daily customs circulars and updates here.
        </p>
      </div>
    </section>
  );
}
