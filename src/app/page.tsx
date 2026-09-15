"use client";

import { useEffect, useState } from "react";
import { RevealFade, RevealLine, RevealPanel } from "@/components/Reveal";
import { PhotoCoinFlip } from "@/components/PhotoCoinFlip";
import { AskChat } from "@/components/AskChat";
import { ContactForm } from "@/components/ContactForm";
import { useAskChat, MAX_MESSAGE_CHARS, type AskChatState } from "@/hooks/useAskChat";

const defaultColors = {
  paper: "#F5F6F8",
  ink: "#0A0A0C",
  ultramarine: "#2B3BFF",
  paleBlue: "#DCE3FF",
  accentOnBlack: "#7C88FF",
  bodyGrey: "#4A4E5C",
  rule: "#D9DBE2",
};

// Playful alternate palette, swapped in when the coin-flip photo lands on its illustrated
// side — warm parchment instead of cool paper, meadow green instead of ultramarine.
const ghibliColors = {
  paper: "#FBF3E1",
  ink: "#3B3123",
  ultramarine: "#5C9B6E",
  paleBlue: "#DCEBD7",
  accentOnBlack: "#8FD0A6",
  bodyGrey: "#6B5F4C",
  rule: "#E4D9BE",
};

const themeTransition = "background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease";

function scrollToAsk() {
  document.getElementById("ask")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function AskPanelBody({ colors, chat }: { colors: typeof defaultColors; chat: AskChatState }) {
  const [heroInput, setHeroInput] = useState("");
  const disabled = chat.loading || chat.atTurnLimit;

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > MAX_MESSAGE_CHARS || disabled) return;
    setHeroInput("");
    scrollToAsk();
    chat.send(trimmed);
  }

  return (
    <>
      <span className="font-mono text-[12px] tracking-wide" style={{ color: colors.paleBlue }}>
        ASK ABOUT MY EXPERIENCE
      </span>
      <p style={{ fontSize: 20, lineHeight: 1.4, color: "#fff", margin: 0 }}>
        An AI assistant that answers from notes I wrote, and tells you when it doesn&rsquo;t know.
      </p>
      <div className="flex items-center gap-2 h-14 pl-5 pr-2 rounded-xl" style={{ background: "#fff" }}>
        <input
          type="text"
          value={heroInput}
          onChange={(e) => setHeroInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit(heroInput);
          }}
          disabled={disabled}
          placeholder={disabled ? "Conversation limit reached" : "Ask about my experience"}
          maxLength={MAX_MESSAGE_CHARS + 20}
          className="flex-grow bg-transparent outline-none text-[15px]"
          style={{ color: "#2A2D36" }}
        />
        <button
          type="button"
          onClick={() => submit(heroInput)}
          disabled={disabled || heroInput.trim().length === 0}
          className="flex items-center h-[42px] px-[18px] rounded-lg font-semibold text-sm disabled:opacity-40"
          style={{ background: colors.ink, color: "#fff", transition: themeTransition }}
        >
          Ask
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => submit("What's Rene's biggest platform win?")}
          className="px-3 py-1.5 rounded-full text-[13px]"
          style={{ border: "1px solid rgba(255,255,255,0.35)", color: "#fff" }}
        >
          What&rsquo;s Rene&rsquo;s biggest platform win?
        </button>
        <button
          type="button"
          onClick={() => submit("What roles is he open to?")}
          className="px-3 py-1.5 rounded-full text-[13px]"
          style={{ border: "1px solid rgba(255,255,255,0.35)", color: "#fff" }}
        >
          What roles is he open to?
        </button>
      </div>
    </>
  );
}

export default function Home() {
  const [ghibli, setGhibli] = useState(false);
  const colors = ghibli ? ghibliColors : defaultColors;
  const chat = useAskChat();
  const [host, setHost] = useState("your-domain.com");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- window.location is only available client-side, after mount
    setHost(window.location.host);
  }, []);

  return (
    <div style={{ background: colors.paper, transition: themeTransition }}>
      {/* HERO */}
      <section
        className="relative overflow-hidden pb-10 md:pb-16 md:min-h-[820px]"
        style={{ background: colors.paper, transition: themeTransition }}
      >
        <nav className="relative z-10 flex items-center px-[5vw] md:px-0 py-6">
          {/* This cluster's width matches the blue panel's exactly (min(42vw,480px)), right-flush
              at md+, so the links always sit on the blue and are never split across the paper
              edge — the white text stays readable at every screen width. */}
          <div className="ml-auto flex items-center gap-6 md:w-[min(42vw,480px)] md:justify-end md:pr-10 lg:pr-12">
            <div className="hidden md:flex items-center gap-6 lg:gap-7 text-[15px] font-medium">
              <a href="#work" style={{ color: "#fff" }}>
                Work
              </a>
              <a href="#about" style={{ color: "#fff" }}>
                About
              </a>
              <a href="#ask" style={{ color: "#fff" }}>
                Ask
              </a>
              <a href="/resume" style={{ color: "#fff" }}>
                Resume
              </a>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center justify-center h-[42px] px-4 rounded-full text-[15px] font-bold tracking-[0.02em] transition-transform duration-200 hover:-translate-y-0.5"
              style={{ background: colors.ink, color: "#fff", boxShadow: "0 12px 28px rgba(10,10,12,0.18)", transition: themeTransition }}
            >
              Contact
            </a>
          </div>
        </nav>

        {/* Two real grid columns at md+, so the copy can never run under the panel's space.
            Below md it's just two stacked blocks. */}
        <div className="px-[5vw] pt-10 md:pt-16 md:grid md:grid-cols-[minmax(0,1fr)_min(42vw,480px)] md:gap-10 md:items-stretch">
          <div>
            <div className="flex items-center">
              <h1
                className="font-display"
                style={{
                  fontSize: "clamp(64px, 12vw, 200px)",
                  lineHeight: 0.84,
                  fontWeight: 800,
                  letterSpacing: "-0.045em",
                  color: colors.ink,
                  margin: 0,
                }}
              >
                <RevealLine eager>Rene</RevealLine>
                <RevealLine eager delay={1}>
                  Marino
                </RevealLine>
              </h1>
              {/* Spacers split the leftover row width evenly, so the coin sits in the
                  middle of the gap between the name and the column's right edge. */}
              <div className="flex-1" />
              <PhotoCoinFlip
                frontSrc="/headshot.jpg"
                backSrc="/headshot-ghibli.jpg"
                flipped={ghibli}
                onToggle={() => setGhibli((g) => !g)}
                accentColor={colors.ultramarine}
              />
              <div className="flex-1" />
            </div>

            <RevealFade
              eager
              delayMs={1100}
              className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-[160px_minmax(0,1fr)] gap-6 md:gap-8"
            >
              <span className="font-mono text-[12px] leading-[1.8]" style={{ color: "#55596A" }}>
                PRODUCT MANAGER
                <br />
                AI &amp; API PLATFORMS
                <br />
                ORANGE COUNTY, CA
              </span>
              <div className="flex flex-col gap-4">
                <p
                  className="font-display"
                  style={{ fontSize: 30, lineHeight: 1.16, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}
                >
                  I build the platforms <span style={{ color: colors.ultramarine }}>AI agents</span> run on.
                </p>
                <p style={{ fontSize: 17, lineHeight: 1.6, color: colors.bodyGrey, margin: 0, maxWidth: "48ch" }}>
                  Leading product for self-service MCP infrastructure at a Fortune 50 healthcare company, turning
                  4,000+ internal APIs into tools AI agents can safely use. Before product, I was a full-stack
                  engineer.
                </p>
              </div>
            </RevealFade>
          </div>

          {/* Mobile-only stacked card. Hidden at md+, where the full-bleed panel below takes over —
              but as an empty grid cell it still reserves this column's width, so the text in the
              left column can never run under that panel. */}
          <RevealPanel
            eager
            className="md:hidden relative mt-10 rounded-2xl overflow-hidden flex flex-col"
            style={{ background: colors.ultramarine, color: "#fff", transition: themeTransition }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 90% 60% at 70% 20%, rgba(255,255,255,0.18) 0%, rgba(43,59,255,0) 70%)",
              }}
            />
            <RevealFade eager delayMs={1300} className="relative flex flex-col gap-4 p-6">
              <AskPanelBody colors={colors} chat={chat} />
            </RevealFade>
          </RevealPanel>
        </div>

        {/* Desktop-only: the blue runs the full height of the hero, right edge to edge. It's a
            separate absolutely-positioned layer sized to match the grid's reserved column above,
            so it can never collide with the text — it just fills the space already set aside. */}
        <RevealPanel
          eager
          className="hidden md:flex md:absolute md:inset-y-0 md:right-0 md:w-[min(42vw,480px)] flex-col justify-end overflow-hidden"
          style={{ background: colors.ultramarine, color: "#fff", transition: themeTransition }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 90% 60% at 70% 20%, rgba(255,255,255,0.18) 0%, rgba(43,59,255,0) 70%)",
            }}
          />
          <RevealFade eager delayMs={1300} className="relative flex flex-col gap-4 p-10">
            <AskPanelBody colors={colors} chat={chat} />
          </RevealFade>
        </RevealPanel>
      </section>

      {/* SELECTED WORK */}
      <section
        id="work"
        className="px-[5vw] py-16 md:py-24"
        style={{ background: colors.ink, color: colors.paper, transition: themeTransition }}
      >
        <div
          className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pb-7"
          style={{ borderBottom: "1px solid #26272E" }}
        >
          <span className="font-mono text-[12px]" style={{ color: "#8C8FA0" }}>
            SELECTED WORK
          </span>

        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-10 md:gap-14 items-start">
          <h2
            className="font-display flex flex-col"
            style={{
              fontSize: "clamp(38px, 6vw, 84px)",
              lineHeight: 0.94,
              fontWeight: 700,
              letterSpacing: "-0.036em",
              margin: 0,
              rowGap: "0.12em",
            }}
          >
            <RevealLine>Self-service MCP</RevealLine>
            <RevealLine delay={1}>
              servers, <span style={{ color: colors.accentOnBlack }}>governed</span>
            </RevealLine>
            <RevealLine delay={2}>by design.</RevealLine>
          </h2>
          <div className="flex flex-col gap-5 pt-2">
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "#B4B7C4", margin: 0 }}>
              Developers used to wait on the platform team for every new MCP
              server. I led the product that moved that work into the enterprise API catalog, so teams can create,
              subscribe to and retire servers on their own.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "#B4B7C4", margin: 0 }}>
              Security, architecture and governance approvals are part of the flow, not a separate queue. The
              result: <strong style={{ color: "#fff", fontWeight: 600 }}>4,000+ APIs</strong> available to agents,{" "}
              <strong style={{ color: "#fff", fontWeight: 600 }}>zero manual provisioning</strong>, delivered across
              three engineering teams.
            </p>
          </div>
        </div>

        <div className="mt-16 md:mt-24 flex flex-col" style={{ borderTop: "1px solid #26272E" }}>
          <a
            href="https://github.com/thewaffle99/ai-website-builder-pipeline"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col gap-2 py-8 md:grid md:grid-cols-[170px_minmax(0,1fr)_minmax(0,360px)_28px] md:items-center md:gap-8"
            style={{ borderBottom: "1px solid #26272E", color: colors.paper }}
          >
            <span className="font-mono text-[11px]" style={{ color: "#8C8FA0" }}>
              PERSONAL PROJECT
            </span>
            <span className="font-display text-[32px] md:text-[38px] leading-none font-bold" style={{ letterSpacing: "-0.03em" }}>
              Web Builder
            </span>
            <span className="text-[15px] leading-relaxed" style={{ color: "#B4B7C4" }}>
              A multi-agent pipeline where product, engineering and QA agents turn a written brief into a tested
              website.
            </span>
            <span className="hidden md:inline text-[22px] justify-self-end" style={{ color: colors.accentOnBlack }}>
              →
            </span>
          </a>
          <a
            href="/work/this-site"
            className="group relative flex flex-col gap-2 py-8 md:grid md:grid-cols-[170px_minmax(0,1fr)_minmax(0,360px)_28px] md:items-center md:gap-8"
            style={{ borderBottom: "1px solid #26272E", color: colors.paper }}
          >
            <span className="font-mono text-[11px]" style={{ color: "#8C8FA0" }}>
              THIS SITE
            </span>
            <span className="font-display text-[32px] md:text-[38px] leading-none font-bold" style={{ letterSpacing: "-0.03em" }}>
              AI assistant &amp; MCP server
            </span>
            <span className="text-[15px] leading-relaxed" style={{ color: "#B4B7C4" }}>
              A chatbot and read-only MCP server grounded in my own notes, hardened against prompt injection and
              abuse.
            </span>
            <span className="hidden md:inline text-[22px] justify-self-end" style={{ color: colors.accentOnBlack }}>
              →
            </span>
          </a>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="px-[5vw] py-16 md:py-28" style={{ background: colors.paper, transition: themeTransition }}>
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 md:gap-14 items-start">
          <div className="flex flex-col gap-5">
            <span className="font-mono text-[12px]" style={{ color: "#55596A" }}>
              ABOUT
            </span>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(34px, 5vw, 68px)",
                lineHeight: 0.94,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              <RevealLine>Engineer first.</RevealLine>
              <RevealLine delay={1}>
                <span style={{ color: colors.ultramarine }}>Product now.</span>
              </RevealLine>
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: colors.bodyGrey, margin: 0 }}>
              I spent four years managing international touring productions, taught myself to code, shipped
              AI-driven software as an engineer, and now lead product for AI infrastructure. The common thread is
              getting complex systems, and the teams behind them, to deliver on schedule.
            </p>
            <p className="font-mono text-[11px] leading-[1.8]" style={{ color: "#55596A", margin: 0 }}>
              CERTIFIED SCRUM PRODUCT OWNER · ANTHROPIC CLAUDE ACADEMY
            </p>
          </div>

          <div className="flex flex-col" style={{ borderTop: `2px solid ${colors.ink}`, transition: themeTransition }}>
            {[
              { name: "Humana", role: "Product Manager", when: "2025–NOW", dot: true },
              { name: "Dark Matter Technologies", role: "Software Engineer", when: "2022–2025" },
              { name: "Coding Dojo", role: "Software Teaching Assistant", when: "2022" },
              { name: "SAM Artist Management", role: "Stage Manager — Nine Inch Nails, Foo Fighters, The Lonely Island", when: "2017–2020" },
              { name: "Cal State Fullerton", role: "B.A., Communications", when: "2015" },
            ].map((row) => (
              <div
                key={row.name}
                className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_100px] gap-1.5 sm:gap-5 sm:items-center py-6"
                style={{ borderBottom: "1px solid #D9DBE2" }}
              >
                <span
                  className="font-display flex items-center gap-3"
                  style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em" }}
                >
                  {row.dot && (
                    <span style={{ width: 9, height: 9, borderRadius: "50%", background: colors.ultramarine }} />
                  )}
                  {row.name}
                </span>
                <span style={{ fontSize: 16, color: "#2A2D36" }}>{row.role}</span>
                <span className="font-mono text-[11px] sm:justify-self-end" style={{ color: "#55596A" }}>
                  {row.when}
                </span>
              </div>
            ))}
            <a href="/resume" className="mt-6 text-[15px] font-semibold">
              View full resume →
            </a>
          </div>
        </div>
      </section>

      {/* ASK */}
      <section
        id="ask"
        className="relative overflow-hidden px-[5vw] py-16 md:py-28"
        style={{ background: colors.ultramarine, color: "#fff", transition: themeTransition }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 70% at 15% 10%, rgba(255,255,255,0.14) 0%, rgba(43,59,255,0) 70%)",
          }}
        />
        <div className="relative grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 md:gap-14 items-start">
          <div className="flex flex-col gap-5">
            <span className="font-mono text-[12px]" style={{ color: colors.paleBlue }}>
              ASK
            </span>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(34px, 5vw, 68px)",
                lineHeight: 0.94,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              <RevealLine>Ask about my</RevealLine>
              <RevealLine delay={1}>experience.</RevealLine>
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: "#E4E8FF", margin: 0 }}>
              An AI assistant answers from notes I wrote. When the answer isn&rsquo;t there, it says so and points
              you to me.
            </p>
            <div className="mt-2 flex flex-col gap-3 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.3)" }}>
              <span style={{ fontSize: 16, fontWeight: 600 }}>Connect your own AI</span>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "#E4E8FF", margin: 0 }}>
                My experience is also available as a read-only MCP server for Claude, Cursor and other MCP clients.
              </p>
              <div
                className="font-mono text-[12px] leading-[1.6] rounded-[10px] px-[18px] py-4 overflow-x-auto whitespace-nowrap"
                style={{ background: colors.ink, color: "#E6E7EC" }}
              >
                <span style={{ color: colors.accentOnBlack }}>$</span> claude mcp add --transport http rene
                https://{host}/mcp
              </div>
            </div>
          </div>

          <AskChat colors={colors} chat={chat} />
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="px-[5vw] pt-16 md:pt-28 pb-10"
        style={{ background: colors.paper, transition: themeTransition }}
      >
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-8 md:gap-12 items-end">
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(56px, 12vw, 200px)",
              lineHeight: 0.84,
              fontWeight: 800,
              letterSpacing: "-0.045em",
              margin: 0,
            }}
          >
            <RevealLine>Let&rsquo;s</RevealLine>
            <RevealLine delay={1}>
              <span style={{ color: colors.ultramarine }}>talk.</span>
            </RevealLine>
          </h2>
          <div className="flex flex-col gap-5 pb-3">
            <p style={{ fontSize: 17, lineHeight: 1.55, color: "#2A2D36", margin: 0 }}>
              Hiring for AI or platform product roles? I&rsquo;d like to hear what you&rsquo;re building.
            </p>
            <ContactForm colors={colors} />
          </div>
        </div>
        <div
          className="mt-16 md:mt-24 flex flex-wrap gap-4 justify-between items-center pt-6"
          style={{ borderTop: "1px solid #D9DBE2" }}
        >
          <span className="font-mono text-[11px]" style={{ color: "#55596A" }}>
            © 2026 RENE MARINO · ORANGE COUNTY, CA
          </span>
          <div className="flex flex-wrap gap-6 text-sm">
            <a href="https://www.linkedin.com/in/rene-marino-597b2665/" style={{ color: "#2A2D36" }}>
              LinkedIn
            </a>
            <a href="https://github.com/thewaffle99" style={{ color: "#2A2D36" }}>
              GitHub
            </a>
            <a href="/privacy" style={{ color: "#2A2D36" }}>
              Privacy
            </a>
            <a href="/work/this-site" style={{ color: "#2A2D36" }}>
              How this site was built
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
