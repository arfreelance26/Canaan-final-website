"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { getResponse } from "../lib/joshine-engine";

const INITIAL_MESSAGES = [
  {
    id: 1,
    from: "bot",
    text: "Hi! I'm Joshine.\nI can help you explore our services and answer logistics questions.",
    chips: ["Our Services", "Contact Us", "Our Branches"],
  },
];

// Pages where the chatbot should not appear
const HIDDEN_PATHS = ["/cargo"];

export default function ChatbotWidget() {
  const pathname = usePathname();
  const isHidden = HIDDEN_PATHS.includes(pathname);

  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // ── Visibility / intro-pop state ──────────────────────────────
  const [visible, setVisible] = useState(false);
  const [popping, setPopping] = useState(false);
  const [bubbleAuto, setBubbleAuto] = useState(false);

  // All refs — must be before any conditional return
  const hasPopped = useRef(false);
  const isVisibleRef = useRef(false);
  const ctxRef = useRef({});
  const timerRef = useRef(null);

  // ── Session Persistence (Load) ──
  useEffect(() => {
    if (isHidden) return;
    try {
      const storedCtx = sessionStorage.getItem("joshine_ctx");
      const storedMsgs = sessionStorage.getItem("joshine_messages");
      if (storedCtx) ctxRef.current = JSON.parse(storedCtx);
      if (storedMsgs) setMessages(JSON.parse(storedMsgs));
    } catch (e) {
      console.error("Failed to load chat session", e);
    }
  }, [isHidden]);

  // ── Session Persistence (Save) ──
  useEffect(() => {
    if (isHidden) return;
    try {
      sessionStorage.setItem("joshine_ctx", JSON.stringify(ctxRef.current));
      sessionStorage.setItem("joshine_messages", JSON.stringify(messages));
    } catch (e) {
      console.error("Failed to save chat session", e);
    }
  }, [messages, isHidden]);

  // ── Inactivity Nudge ──
  useEffect(() => {
    if (isHidden || !open) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.isNudge || isTyping) return;

    timerRef.current = setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            from: "bot",
            text: "Still exploring? 🤔 Feel free to ask me about our services or what cargo we carry!",
            chips: ["What We Carry", "Our Services", "Get a Quote"],
            isNudge: true,
          }
        ]);
      }, 800);
    }, 90000); // 90 seconds

    return () => clearTimeout(timerRef.current);
  }, [messages, open, isHidden, isTyping]);

  /* Auto-scroll on new message — guarded so it's a no-op on hidden pages */
  useEffect(() => {
    if (isHidden) return;
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, isHidden]);

  /* ── Scroll listener — guarded so it's a no-op on hidden pages ── */
  useEffect(() => {
    if (isHidden) return;
    sessionStorage.removeItem("chatbot_popped");
    hasPopped.current = false;

    const onScroll = () => {
      const pastHero = window.scrollY >= window.innerHeight * 0.9;

      if (pastHero && !isVisibleRef.current) {
        isVisibleRef.current = true;
        setVisible(true);

        if (!hasPopped.current) {
          hasPopped.current = true;
          sessionStorage.setItem("chatbot_popped", "1");

          setTimeout(() => {
            setPopping(true);
            setTimeout(() => {
              setPopping(false);
              setBubbleAuto(true);
              setTimeout(() => setBubbleAuto(false), 4000);
            }, 1200);
          }, 80);
        }
      } else if (!pastHero && isVisibleRef.current) {
        isVisibleRef.current = false;
        setVisible(false);
        setOpen(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHidden]); // eslint-disable-line react-hooks/exhaustive-deps

  // Hide entirely on excluded pages — AFTER all hooks
  if (isHidden) return null;

  function handleSend(e, chipText) {
    if (e) e.preventDefault();
    const text = (chipText ?? input).trim();
    if (!text) return;

    const userMsg = { id: Date.now(), from: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate a short thinking delay, then reply via the engine
    const delay = 600 + Math.random() * 500;
    setTimeout(() => {
      const { text: botText, chips, ctx: newCtx, mapEmbed, contactEmbed, navLink } = getResponse(text, ctxRef.current);
      ctxRef.current = newCtx ?? {};
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: "bot",
          text: botText,
          chips: chips ?? [],
          mapEmbed: !!mapEmbed,
          contactEmbed: !!contactEmbed,
          navLink: navLink ?? null,
        },
      ]);
    }, delay);
  }


  /* Don't render anything while in the hero section */
  if (!visible) return null;

  return (
    <>
      {/* ── Keyframe injection ── */}
      <style>{`
        @keyframes chatbotPop {
          0%   { transform: scale(0.2) rotate(-20deg); opacity: 0; }
          40%  { transform: scale(1.35) rotate(8deg);  opacity: 1; }
          62%  { transform: scale(0.85) rotate(-4deg); opacity: 1; }
          78%  { transform: scale(1.15) rotate(2deg);  opacity: 1; }
          90%  { transform: scale(0.95) rotate(0deg);  opacity: 1; }
          100% { transform: scale(1)   rotate(0deg);  opacity: 1; }
        }
        /* Scrollbar styling for messages */
        .joshine-messages::-webkit-scrollbar { width: 4px; }
        .joshine-messages::-webkit-scrollbar-track { background: transparent; }
        .joshine-messages::-webkit-scrollbar-thumb { background: rgba(15,32,39,0.18); border-radius: 99px; }
      `}</style>

      {/* ── Chat Window ── */}
      <div
        className={`
          fixed bottom-24 right-6 z-[9999]
          w-[360px] max-w-[calc(100vw-2rem)]
          flex flex-col overflow-hidden
          rounded-3xl
          transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
          }
        `}
        style={{
          height: "500px",
          background: "rgba(8, 20, 30, 0.72)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.45), 0 0 0 0.5px rgba(255,255,255,0.06) inset, 0 1px 0 rgba(255,255,255,0.12) inset",
        }}
        aria-hidden={!open}
        aria-label="Joshine — Canaan Chatbot"
      >
        {/* ── Header ── */}
        <div
          className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, rgba(15,32,39,0.95) 0%, rgba(26,58,74,0.90) 60%, rgba(32,58,67,0.90) 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Avatar with glow ring */}
          <div
            className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
            style={{ boxShadow: "0 0 0 2px rgba(110,231,183,0.35), 0 0 12px rgba(56,139,255,0.25)" }}
          >
            <Image src="/Chatbot.png" alt="Joshine" fill className="object-cover" />
          </div>

          {/* Name & subtitle */}
          <div className="flex-1 min-w-0">
            <p className="text-white text-[15px] font-semibold leading-none tracking-tight">Joshine</p>
            <p className="text-emerald-400 text-xs mt-1 flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"
                style={{ boxShadow: "0 0 6px rgba(52,211,153,0.8)", animation: "pulse 2s ease-in-out infinite" }}
              />
              Canaan Assistant
            </p>
          </div>

          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            className="text-white/40 hover:text-white/90 transition-colors p-1.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(8px)" }}
            aria-label="Close chat"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Messages ── */}
        <div
          className="joshine-messages flex-1 overflow-y-auto px-4 py-4"
          style={{ display: "flex", flexDirection: "column", gap: "14px", overscrollBehavior: "contain" }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start", alignItems: "flex-start", gap: "10px" }}
            >
              {/* Bot avatar — top-aligned */}
              {msg.from === "bot" && (
                <div
                  className="relative flex-shrink-0"
                  style={{ width: "30px", height: "30px", borderRadius: "50%", overflow: "hidden", marginTop: "2px", border: "1.5px solid rgba(255,255,255,0.12)" }}
                >
                  <Image src="/Chatbot.png" alt="Joshine" fill className="object-cover" />
                </div>
              )}

              {/* Bubble + chips column */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "76%" }}>
                {/* Bubble */}
                <div
                  style={{
                    padding: msg.from === "user" ? "10px 14px" : "12px 14px",
                    borderRadius: msg.from === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                    fontSize: "13.5px",
                    lineHeight: "1.55",
                    ...(msg.from === "user" ? {
                      background: "linear-gradient(135deg, #1e6fbf 0%, #1a4a8a 100%)",
                      color: "#fff",
                      boxShadow: "0 4px 16px rgba(30,111,191,0.35)",
                    } : {
                      background: "rgba(255,255,255,0.09)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      color: "rgba(255,255,255,0.92)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
                      whiteSpace: "pre-line",
                    }),
                  }}
                >
                  {msg.text}
                </div>

                {/* Google Maps embed */}
                {msg.from === "bot" && msg.mapEmbed && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {/* Responsive iframe wrapper */}
                    <div style={{ position: "relative", width: "100%", paddingBottom: "56%", height: 0, borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3943.5562115789494!2d78.04090921090196!3d8.733620491280172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b03efdb0585f415%3A0x236d4e35580fc822!2sCanaan%20Global%20International!5e0!3m2!1sen!2sin!4v1780548840113!5m2!1sen!2sin"
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Canaan Global International Location"
                      />
                    </div>
                    {/* Open in Maps button */}
                    <a
                      href="https://maps.app.goo.gl/rZhZLTFxqkDDbV6FA"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "7px 14px",
                        borderRadius: "20px",
                        background: "rgba(34,197,94,0.12)",
                        border: "1px solid rgba(34,197,94,0.35)",
                        color: "#4ade80",
                        fontSize: "12px",
                        fontWeight: 600,
                        textDecoration: "none",
                        width: "fit-content",
                        letterSpacing: "0.02em",
                        transition: "all 0.18s ease",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "rgba(34,197,94,0.22)";
                        e.currentTarget.style.borderColor = "rgba(34,197,94,0.6)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "rgba(34,197,94,0.12)";
                        e.currentTarget.style.borderColor = "rgba(34,197,94,0.35)";
                      }}
                    >
                      🗺️ Open in Maps
                    </a>
                  </div>
                )}

                {/* WhatsApp + Email action buttons */}
                {msg.from === "bot" && msg.contactEmbed && (
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {/* WhatsApp */}
                    <a
                      href="https://wa.me/919047012891"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "7px",
                        padding: "8px 15px",
                        borderRadius: "20px",
                        background: "rgba(37,211,102,0.13)",
                        border: "1px solid rgba(37,211,102,0.4)",
                        color: "#25D366",
                        fontSize: "12px",
                        fontWeight: 600,
                        textDecoration: "none",
                        letterSpacing: "0.02em",
                        transition: "all 0.18s ease",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "rgba(37,211,102,0.22)";
                        e.currentTarget.style.borderColor = "rgba(37,211,102,0.7)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "rgba(37,211,102,0.13)";
                        e.currentTarget.style.borderColor = "rgba(37,211,102,0.4)";
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Open in WhatsApp
                    </a>

                    {/* Email */}
                    <a
                      href="mailto:canaanglobal@canaanglobal.com"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "7px",
                        padding: "8px 15px",
                        borderRadius: "20px",
                        background: "rgba(96,165,250,0.12)",
                        border: "1px solid rgba(96,165,250,0.35)",
                        color: "#60a5fa",
                        fontSize: "12px",
                        fontWeight: 600,
                        textDecoration: "none",
                        letterSpacing: "0.02em",
                        transition: "all 0.18s ease",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "rgba(96,165,250,0.22)";
                        e.currentTarget.style.borderColor = "rgba(96,165,250,0.65)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "rgba(96,165,250,0.12)";
                        e.currentTarget.style.borderColor = "rgba(96,165,250,0.35)";
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      Open in Email
                    </a>
                  </div>
                )}

                {/* Page navigation button */}
                {msg.from === "bot" && msg.navLink && (
                  <a
                    href={msg.navLink.href}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "7px",
                      padding: "9px 16px",
                      borderRadius: "20px",
                      background: "rgba(200,185,138,0.12)",
                      border: "1px solid rgba(200,185,138,0.4)",
                      color: "#c8b98a",
                      fontSize: "12px",
                      fontWeight: 600,
                      textDecoration: "none",
                      letterSpacing: "0.02em",
                      transition: "all 0.18s ease",
                      width: "fit-content",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "rgba(200,185,138,0.22)";
                      e.currentTarget.style.borderColor = "rgba(200,185,138,0.7)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "rgba(200,185,138,0.12)";
                      e.currentTarget.style.borderColor = "rgba(200,185,138,0.4)";
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c8b98a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    {msg.navLink.label}
                  </a>
                )}

                {/* Quick-reply chips */}
                {msg.from === "bot" && msg.chips && msg.chips.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {msg.chips.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => handleSend(null, chip)}
                        style={{
                          fontSize: "11.5px",
                          fontWeight: 500,
                          padding: "5px 11px",
                          borderRadius: "20px",
                          border: "1px solid rgba(110,231,183,0.35)",
                          background: "rgba(110,231,183,0.08)",
                          color: "#6ee7b7",
                          cursor: "pointer",
                          transition: "all 0.18s ease",
                          letterSpacing: "0.01em",
                          backdropFilter: "blur(8px)",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = "rgba(110,231,183,0.18)";
                          e.currentTarget.style.borderColor = "rgba(110,231,183,0.6)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = "rgba(110,231,183,0.08)";
                          e.currentTarget.style.borderColor = "rgba(110,231,183,0.35)";
                        }}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}


          {/* Typing indicator */}
          {isTyping && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <div
                className="relative flex-shrink-0"
                style={{ width: "30px", height: "30px", borderRadius: "50%", overflow: "hidden", marginTop: "2px", border: "1.5px solid rgba(255,255,255,0.12)" }}
              >
                <Image src="/Chatbot.png" alt="Joshine" fill className="object-cover" />
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.09)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "4px 18px 18px 18px",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "rgba(255,255,255,0.55)", animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "rgba(255,255,255,0.55)", animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "rgba(255,255,255,0.55)", animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Input ── */}
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2.5 px-4 py-4 flex-shrink-0"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Joshine…"
            className="flex-1 text-sm outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "14px",
              padding: "10px 16px",
              color: "rgba(255,255,255,0.90)",
              fontSize: "13.5px",
            }}
            aria-label="Chat message input"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="flex-shrink-0 flex items-center justify-center active:scale-90 disabled:opacity-30 transition-all duration-200"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "13px",
              background: "linear-gradient(135deg, #1e6fbf 0%, #1a4a8a 100%)",
              boxShadow: input.trim() ? "0 4px 16px rgba(30,111,191,0.45)" : "none",
              border: "none",
              cursor: input.trim() ? "pointer" : "default",
            }}
            aria-label="Send message"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>

      {/* ── Floating Trigger Button + Thought Bubble ── */}
      <div
        className="fixed bottom-6 right-6 z-[9999] flex items-end justify-end"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Thought Bubble Tooltip */}
        <div
          aria-hidden={!(!open && hovered)}
          style={{
            position: "absolute",
            bottom: "calc(100% + 14px)",
            right: "0",
            pointerEvents: "none",
            opacity: !open && (hovered || bubbleAuto) ? 1 : 0,
            transform: !open && (hovered || bubbleAuto) ? "translateY(0) scale(1)" : "translateY(6px) scale(0.96)",
            transition: bubbleAuto
              ? "opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)"
              : "opacity 0.28s cubic-bezier(0.16,1,0.3,1), transform 0.28s cubic-bezier(0.16,1,0.3,1)",
            transformOrigin: "bottom right",
          }}
        >
          {/* Bubble body */}
          <div
            style={{
              background: "linear-gradient(135deg, #0f2027 0%, #1a3a4a 60%, #203a43 100%)",
              borderRadius: "18px 18px 4px 18px",
              padding: "10px 16px",
              boxShadow: "0 8px 32px rgba(15,32,39,0.22), 0 2px 8px rgba(15,32,39,0.12)",
              whiteSpace: "nowrap",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <p style={{ margin: 0, fontSize: "13px", fontWeight: 500, letterSpacing: "0.01em", color: "#fff", lineHeight: 1.4 }}>
              Need Help?{" "}
              <span style={{ color: "#6ee7b7", fontWeight: 600 }}>Ask me anything</span>
            </p>
          </div>

          {/* Thought bubble tail — three diminishing circles */}
          <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: "18px", gap: "4px", marginTop: "4px", alignItems: "flex-end" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#1a3a4a", display: "inline-block", opacity: 0.9 }} />
            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#1a3a4a", display: "inline-block", opacity: 0.7 }} />
            <span style={{ width: "2.5px", height: "2.5px", borderRadius: "50%", background: "#1a3a4a", display: "inline-block", opacity: 0.5 }} />
          </div>
        </div>

        {/* Button */}
        <button
          id="chatbot-trigger"
          onClick={() => setOpen((v) => !v)}
          className={`
            relative w-16 h-16 rounded-full
            shadow-[0_8px_24px_rgba(0,0,0,0.22),0_0_18px_6px_rgba(56,139,255,0.28)]
            hover:shadow-[0_12px_36px_rgba(0,0,0,0.32),0_0_28px_10px_rgba(56,139,255,0.42)]
            focus:outline-none focus-visible:ring-4 focus-visible:ring-[#0f2027]/30
            overflow-visible
            border-2 border-white/80
            ${!popping ? "hover:scale-110 active:scale-95 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" : ""}
          `}
          style={popping ? {
            animation: "chatbotPop 1.2s cubic-bezier(0.34,1.56,0.64,1) both",
          } : {}}
          aria-label={open ? "Close chat" : "Open chat"}
          aria-expanded={open}
        >
          {/* Pulse ring — only after intro pop is done */}
          {!open && !popping && (
            <span
              className="absolute inset-0 rounded-full bg-white/30 animate-ping"
              style={{ animationDuration: "2.5s" }}
            />
          )}
          <Image
            src="/Chatbot.png"
            alt="Chat with Canaan"
            fill
            className="object-cover"
            priority
          />
        </button>
      </div>
    </>
  );
}
