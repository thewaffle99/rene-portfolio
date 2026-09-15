import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy — Rene Marino",
  description: "What this site collects and why, in plain language.",
};

const colors = {
  paper: "#F5F6F8",
  ink: "#0A0A0C",
  ultramarine: "#2B3BFF",
  bodyGrey: "#4A4E5C",
  rule: "#D9DBE2",
};

const sections: { title: string; body: string[] }[] = [
  {
    title: "The short version",
    body: [
      "This site doesn't have accounts, doesn't sell anything, and doesn't run ad trackers. The only place it handles any data from you is the “Ask about my experience” assistant.",
    ],
  },
  {
    title: "The AI assistant",
    body: [
      "Questions you ask are sent to Anthropic's Claude API to generate an answer, drawn only from a fact file I wrote about myself. If the answer isn't in there, it says so and points you to me directly instead of guessing.",
      "What's kept afterward: the text of the question only, anonymized — no IP address, no name, nothing that identifies you. It's kept for 30 days, and only used to see what people commonly ask so I can improve the content.",
      "Before your first message, a quick bot check (Cloudflare Turnstile) runs to keep the assistant from being spammed or abused. It doesn't track you across other sites.",
    ],
  },
  {
    title: "Fonts",
    body: [
      "Typefaces load from Google Fonts. That's the one third-party request this site makes in the normal course of loading a page, and it's subject to Google's own privacy policy, not mine.",
    ],
  },
  {
    title: "Hosting",
    body: [
      "The site is hosted on Vercel, which keeps standard server logs (timestamps, request paths) for security and reliability. I don't use those logs to track visitors.",
    ],
  },
  {
    title: "Questions",
    body: ["If anything here is unclear, message me on LinkedIn and I'll answer directly."],
  },
];

export default function Privacy() {
  return (
    <div style={{ background: colors.paper, minHeight: "100vh" }}>
      <div className="flex items-center px-[5vw] py-6">
        <a href="/" className="text-[15px] font-medium" style={{ color: colors.ink }}>
          ← Back to site
        </a>
      </div>

      <main className="mx-auto max-w-[680px] px-[5vw] pb-24">
        <h1
          className="font-display"
          style={{ fontSize: 48, lineHeight: 1, fontWeight: 800, letterSpacing: "-0.03em", color: colors.ink, margin: 0 }}
        >
          Privacy
        </h1>
        <p className="font-mono" style={{ marginTop: 14, fontSize: 12, letterSpacing: 0.5, color: colors.bodyGrey }}>
          LAST UPDATED SEPTEMBER 2026
        </p>

        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 36 }}>
          {sections.map((s) => (
            <section key={s.title} style={{ borderTop: `1px solid ${colors.rule}`, paddingTop: 24 }}>
              <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: colors.ink, margin: 0 }}>
                {s.title}
              </h2>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                {s.body.map((p) => (
                  <p key={p} style={{ fontSize: 16, lineHeight: 1.65, color: colors.bodyGrey, margin: 0 }}>
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <a
          href="https://www.linkedin.com/in/rene-marino-597b2665/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center h-[48px] px-5 rounded-full text-[15px] font-semibold"
          style={{ background: colors.ink, color: "#fff" }}
        >
          Message me on LinkedIn
        </a>
      </main>
    </div>
  );
}
