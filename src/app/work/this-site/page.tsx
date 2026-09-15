import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How this site was built — Rene Marino",
  description: "The AI assistant and contact form behind this site: what they do, and how they're guarded.",
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
    title: "The AI assistant",
    body: [
      "The \"Ask about my experience\" panel is a small Next.js API route that calls Claude Haiku, grounded in a single fact file I wrote about myself — it can't invent experience, employers, or dates I haven't stated.",
      "It answers in third person, briefly, and in plain text (no markdown gets rendered). It's instructed to redirect anything about salary, availability, or relocation to the contact form instead of guessing, and to keep certain employer details anonymized unless asked directly.",
      "Every conversation is capped at 500 characters per message and 10 turns, and there's a kill switch that can take the assistant offline instantly without a redeploy.",
    ],
  },
  {
    title: "The contact form",
    body: [
      "Messages are relayed by email through Resend. My email address never appears in the site's HTML or JavaScript — it's only ever read server-side, from an environment variable the browser never sees.",
      "A hidden honeypot field and a minimum-fill-time check filter out the most common bot submissions before anything gets sent.",
    ],
  },
  {
    title: "Guarded against abuse",
    body: [
      "Both the assistant and the contact form run an invisible Cloudflare Turnstile check before accepting anything, to confirm a real visitor is behind the request rather than a bot.",
      "Both are also rate-limited per visitor (via Upstash Redis) so a burst of requests can't run up the API bill or flood my inbox.",
    ],
  },
  {
    title: "The MCP server",
    body: [
      "The same facts are also available as a read-only MCP resource at /mcp, so tools like Claude Code or Cursor can query them directly instead of reading this page.",
    ],
  },
  {
    title: "Stack",
    body: [
      "Next.js (App Router, TypeScript), Tailwind CSS, the Anthropic SDK (Claude Haiku 4.5), the Model Context Protocol SDK, Resend, Cloudflare Turnstile, and Upstash — hosted on Vercel.",
    ],
  },
];

export default function ThisSiteCaseStudy() {
  return (
    <div style={{ background: colors.paper, minHeight: "100vh" }}>
      <div className="flex items-center px-[5vw] py-6">
        <Link href="/" className="text-[15px] font-medium" style={{ color: colors.ink }}>
          ← Back to site
        </Link>
      </div>

      <main className="mx-auto max-w-[680px] px-[5vw] pb-24">
        <span className="font-mono text-[12px]" style={{ color: colors.bodyGrey }}>
          THIS SITE
        </span>
        <h1
          className="font-display"
          style={{
            marginTop: 10,
            fontSize: 48,
            lineHeight: 1,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: colors.ink,
          }}
        >
          AI assistant &amp; contact form
        </h1>
        <p style={{ marginTop: 16, fontSize: 17, lineHeight: 1.65, color: colors.bodyGrey, margin: "16px 0 0" }}>
          Two small pieces of this site talk to real services: an AI assistant that answers questions about my
          experience, and a contact form that emails me directly. Here&rsquo;s what each one actually does.
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
          href="https://github.com/thewaffle99/rene-portfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center h-[48px] px-5 rounded-full text-[15px] font-semibold"
          style={{ background: colors.ink, color: "#fff" }}
        >
          View source on GitHub
        </a>
      </main>
    </div>
  );
}
