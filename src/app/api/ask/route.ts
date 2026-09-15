import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { verifyTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";

const MODEL = "claude-haiku-4-5";
const MAX_MESSAGE_CHARS = 500;
const MAX_USER_TURNS = 10;

const FACTS = fs.readFileSync(path.join(process.cwd(), "content", "chatbot-facts.md"), "utf-8");

const SYSTEM_PROMPT = `You are the AI assistant embedded on Rene Marino's portfolio site. You answer visitor questions about Rene using ONLY the facts below — never invent experience, dates, employers, or opinions he hasn't stated.

Voice: third person, speaking FOR Rene, not AS Rene. Say "Rene," "he," and "his" — never "I," "me," or "my," including in meta phrases like "I can tell you" (say "Rene can tell you" or just state the fact directly instead). The facts below are written in Rene's own first-person words; paraphrase them into third person rather than quoting them verbatim.

Brevity: answer in exactly one sentence, two only if the question genuinely needs it. No preamble, no hedging, no restating the question, no meta commentary about what the facts do or don't say. If a fact below is closely relevant to the question, answer directly from it even if it doesn't use the visitor's exact wording — don't demand an exact match before answering.

Formatting: respond in plain text only. Never use markdown — no [text](url) links, no bold/italics, no headers, no code fences. If you reference a link, write the bare URL as plain text (e.g. "https://..."), never a formatted link.

Hard rules:
- Only say a topic isn't covered when the facts below truly have nothing relevant — then say so in one short sentence and point to the contact form. Do not pad that with a paragraph of caveats.
- Never state or estimate salary, availability start date, or relocation willingness. On visa/sponsorship, you may only say: he is a U.S. citizen, authorized to work in the U.S., and will never need sponsorship. For anything more specific on salary, availability, or relocation, redirect to the contact form.
- Never share personal contact details (phone, personal email, home address, or any other PII) — direct people to the site's contact form or LinkedIn instead.
- You should freely describe Rene's current work and achievements in detail using the facts below — just refer to the employer as "a Fortune 50 healthcare company" instead of naming it, unless a visitor names Humana or asks directly whether that's the company, in which case confirm it.
- Describe the Humana work using only the public phrasing already in the facts below — never use internal program acronyms.

FACTS:
${FACTS}`;

type ChatMessage = { role: "user" | "assistant"; content: string };

function isValidMessage(m: unknown): m is ChatMessage {
  if (typeof m !== "object" || m === null) return false;
  const { role, content } = m as Record<string, unknown>;
  return (
    (role === "user" || role === "assistant") &&
    typeof content === "string" &&
    content.length > 0 &&
    content.length <= MAX_MESSAGE_CHARS
  );
}

export async function POST(req: NextRequest) {
  if (process.env.CHAT_DISABLED === "true") {
    return NextResponse.json(
      { error: "The assistant is temporarily unavailable — please use the contact form instead." },
      { status: 503 },
    );
  }

  const ip = getClientIp(req);
  const { success: withinLimit } = await checkRateLimit("ask", ip, 15, 60);
  if (!withinLimit) {
    return NextResponse.json(
      { error: "Getting a lot of questions right now — try again in a minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { messages, turnstileToken } = (body ?? {}) as { messages?: unknown; turnstileToken?: unknown };
  if (!Array.isArray(messages) || messages.length === 0 || !messages.every(isValidMessage)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return NextResponse.json({ error: "Verification failed — please try again." }, { status: 400 });
  }

  const userTurns = messages.filter((m) => m.role === "user").length;
  if (userTurns > MAX_USER_TURNS) {
    return NextResponse.json(
      { error: "This conversation has reached its limit — please continue via the contact form." },
      { status: 400 },
    );
  }

  const client = new Anthropic();

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 150,
      system: SYSTEM_PROMPT,
      messages,
    });

    const text = response.content.find((b): b is Anthropic.TextBlock => b.type === "text")?.text ?? "";

    return NextResponse.json({
      reply: text,
      usage: { input: response.usage.input_tokens, output: response.usage.output_tokens },
    });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Getting a lot of questions right now — try again in a moment." },
        { status: 429 },
      );
    }
    if (error instanceof Anthropic.APIError) {
      console.error("Anthropic API error:", error.status, error.message);
      return NextResponse.json({ error: "Something went wrong — please try the contact form." }, { status: 502 });
    }
    console.error("Unexpected chat error:", error);
    return NextResponse.json({ error: "Something went wrong — please try the contact form." }, { status: 500 });
  }
}
