"use client"
import React from 'react'
import DavidHazHero from './components/Hero'
import About from './components/About'
import FleetSection from './components/Fleet'
import FounderSection from './components/Founder'
import ClientsSection from './components/Client'
import TestimonialsSection from './components/Testimonial'
import TimelineSection from './components/Timeline'
import FrameScrollSection from './components/Frame'
import ContactSection from './components/Contact'
import WorldNetworkSection from './components/World'

export default function Home() {
  return (
    <div>
      <DavidHazHero/>
      {/* <FounderSection/>
      <About/> */}
      <TimelineSection/>
      <FrameScrollSection/>
      <FleetSection/>
      <WorldNetworkSection/>
      <ClientsSection/>
      <TestimonialsSection/>
      <ContactSection/>
    </div>
  )
}
