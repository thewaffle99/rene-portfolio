"use client";

import { useState } from "react";
import { useTurnstile } from "@/hooks/useTurnstile";

const MAX_MESSAGE_CHARS = 2000;

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm({ colors }: { colors: { ink: string; ultramarine: string } }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot — kept empty by real visitors
  const [renderedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useTurnstile(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    try {
      const turnstileToken = await getToken();
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, company, renderedAt, turnstileToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong — please try again later.");
        setStatus("error");
        return;
      }
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setError("Couldn't send — please try again later.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        className="flex flex-col justify-center h-[58px] px-5 rounded-xl text-[16px] font-semibold"
        style={{ background: colors.ink, color: "#fff" }}
      >
        Thanks — message sent. I&rsquo;ll get back to you soon.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        required
        maxLength={100}
        className="h-[52px] px-4 rounded-xl text-[15px] outline-none"
        style={{ border: "1px solid #DADCE3", color: "#2A2D36" }}
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        required
        maxLength={254}
        className="h-[52px] px-4 rounded-xl text-[15px] outline-none"
        style={{ border: "1px solid #DADCE3", color: "#2A2D36" }}
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="What are you building?"
        required
        maxLength={MAX_MESSAGE_CHARS}
        rows={4}
        className="px-4 py-3 rounded-xl text-[15px] outline-none resize-none"
        style={{ border: "1px solid #DADCE3", color: "#2A2D36" }}
      />
      {error && <p style={{ fontSize: 14, color: "#B3261E", margin: 0 }}>{error}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="flex items-center justify-between h-[58px] px-5 rounded-xl text-[16px] font-semibold disabled:opacity-60"
        style={{ background: colors.ink, color: "#fff" }}
      >
        <span>{status === "sending" ? "Sending…" : "Send message"}</span>
        <span>→</span>
      </button>
    </form>
  );
}
