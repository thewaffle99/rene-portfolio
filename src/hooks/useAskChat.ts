"use client";

import { useState } from "react";
import { useTurnstile } from "./useTurnstile";

export type ChatMessage = { role: "user" | "assistant"; content: string };
export type Usage = { input: number; output: number };

export const MAX_MESSAGE_CHARS = 500;
export const MAX_USER_TURNS = 10;

export function useAskChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUsage, setLastUsage] = useState<Usage | null>(null);
  const { getToken } = useTurnstile(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

  const userTurns = messages.filter((m) => m.role === "user").length;
  const atTurnLimit = userTurns >= MAX_USER_TURNS;

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > MAX_MESSAGE_CHARS || loading || atTurnLimit) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setError(null);
    setLoading(true);

    try {
      const turnstileToken = await getToken();
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, turnstileToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong — please try the contact form.");
        return;
      }
      setMessages([...nextMessages, { role: "assistant", content: data.reply }]);
      setLastUsage({ input: data.usage.input, output: data.usage.output });
    } catch {
      setError("Couldn't reach the assistant — please try the contact form.");
    } finally {
      setLoading(false);
    }
  }

  return { messages, loading, error, lastUsage, atTurnLimit, send };
}

export type AskChatState = ReturnType<typeof useAskChat>;
