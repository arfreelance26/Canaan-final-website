import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import ChatbotWidget from "./components/ChatbotWidget";
import AosInit from "./components/AosInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata = {
  title: {
    default: "Canaan Global International — Freight Forwarders, Customs Brokers & Transporters",
    template: "%s | Canaan Global International",
  },
  description:
    "Canaan Global International — Freight Forwarders, Customs Brokers & Transporters. Commit · Endure · Achieve · Satisfy. Serving worldwide from Tuticorin, India.",
  keywords: [
    "Canaan Global International",
    "Freight Forwarders",
    "Customs Brokers",
    "Transporters",
    "International Freight",
    "Tuticorin",
    "Cargo",
    "Logistics",
    "Supply Chain",
  ],
  authors: [{ name: "Arun Samuel Alfred" }],
  creator: "Canaan Global International",
  publisher: "Canaan Global International",
  metadataBase: new URL("https://canaanglobalinternational.com"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Canaan Global International",
    description:
      "Freight Forwarders, Customs Brokers & Transporters. Commit · Endure · Achieve · Satisfy.",
    url: "https://canaanglobalinternational.com",
    siteName: "Canaan Global International",
    locale: "en_IN",
    type: "website",
    images: ["/canaan.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Canaan Global International",
    description:
      "Freight Forwarders, Customs Brokers & Transporters. Commit · Endure · Achieve · Satisfy.",
    images: ["/canaan.png"],
  },
  contact: {
    phone: "+91 90470 12891",
    tel: "0461 2900886",
    email: "canaanglobal@canaanglobal.com",
    website: "canaanglobalinternational.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <head>
        {/* Contact schema — structured data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Canaan Global International",
              alternateName: "Canaan Global",
              url: "https://canaanglobalinternational.com",
              logo: "https://canaanglobalinternational.com/canaan.png",
              slogan: "Commit · Endure · Achieve · Satisfy",
              description:
                "Freight Forwarders, Customs Brokers and Transporters based in Tuticorin, India.",
              foundingDate: "2009",
              founder: {
                "@type": "Person",
                name: "Arun Samuel Alfred",
              },
              address: {
                "@type": "PostalAddress",
                streetAddress:
                  "3/802-124, Opposite Emmanuel Beliver Church, Zion Nagar, Theri Road, Puthukottai",
                addressLocality: "Tuticorin",
                postalCode: "628 103",
                addressCountry: "IN",
              },
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+91-90470-12891",
                  contactType: "sales",
                  availableLanguage: ["English", "Tamil"],
                },
                {
                  "@type": "ContactPoint",
                  telephone: "+91-0461-2900886",
                  contactType: "customer support",
                },
              ],
              email: "canaanglobal@canaanglobal.com",
              sameAs: ["https://canaanglobalinternational.com"],
              serviceArea: {
                "@type": "AdministrativeArea",
                name: "Worldwide",
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Logistics Services",
                itemListElement: [
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Freight Forwarding" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Customs Brokerage" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Transportation" } },
                ],
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AosInit />
        <Navbar />
        {children}
        <ChatbotWidget />
      </body>
    </html>
  );
}