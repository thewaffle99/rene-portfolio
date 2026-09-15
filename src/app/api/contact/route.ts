import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { verifyTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";

const MAX_NAME_CHARS = 100;
const MAX_EMAIL_CHARS = 254;
const MAX_MESSAGE_CHARS = 2000;
const MIN_FILL_TIME_MS = 2000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(v: unknown, max: number): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.length <= max;
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { success: withinLimit } = await checkRateLimit("contact", ip, 5, 600);
  if (!withinLimit) {
    return NextResponse.json({ error: "Too many messages — please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { name, email, message, company, renderedAt, turnstileToken } = (body ?? {}) as Record<string, unknown>;

  // Honeypot: a real visitor never fills this hidden field.
  if (typeof company === "string" && company.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  // A submission faster than a human can plausibly type is almost certainly a bot.
  if (typeof renderedAt !== "number" || Date.now() - renderedAt < MIN_FILL_TIME_MS) {
    return NextResponse.json({ error: "Please try again." }, { status: 400 });
  }

  if (
    !isNonEmptyString(name, MAX_NAME_CHARS) ||
    !isNonEmptyString(email, MAX_EMAIL_CHARS) ||
    !EMAIL_RE.test(email) ||
    !isNonEmptyString(message, MAX_MESSAGE_CHARS)
  ) {
    return NextResponse.json({ error: "Please fill out every field with a valid value." }, { status: 400 });
  }

  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return NextResponse.json({ error: "Verification failed — please try again." }, { status: 400 });
  }

  const toEmail = process.env.CONTACT_TO_EMAIL;
  if (!process.env.RESEND_API_KEY || !toEmail) {
    console.error("Contact form is misconfigured: missing RESEND_API_KEY or CONTACT_TO_EMAIL.");
    return NextResponse.json({ error: "Something went wrong — please try again later." }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error } = await resend.emails.send({
      from: "Portfolio contact form <onboarding@resend.dev>",
      to: toEmail,
      replyTo: email,
      subject: `New portfolio message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Something went wrong — please try again later." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unexpected contact form error:", error);
    return NextResponse.json({ error: "Something went wrong — please try again later." }, { status: 500 });
  }
}
