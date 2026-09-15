"use client";

import { useState } from "react";
import { MAX_MESSAGE_CHARS, type AskChatState, type Usage } from "@/hooks/useAskChat";

const HAIKU_INPUT_PER_MTOK = 1;
const HAIKU_OUTPUT_PER_MTOK = 5;

const SUGGESTED_QUESTIONS = ["What's Rene's biggest platform win?", "What roles is he open to?"];

function estimateCost(usage: Usage) {
  const cost = (usage.input / 1_000_000) * HAIKU_INPUT_PER_MTOK + (usage.output / 1_000_000) * HAIKU_OUTPUT_PER_MTOK;
  return cost < 0.0001 ? "<$0.0001" : `$${cost.toFixed(4)}`;
}

export function AskChat({
  chat,
  colors,
}: {
  chat: AskChatState;
  colors: { ink: string; ultramarine: string; paper: string; bodyGrey: string };
}) {
  const [input, setInput] = useState("");
  const { messages, loading, error, lastUsage, atTurnLimit, send } = chat;

  const overChars = input.length > MAX_MESSAGE_CHARS;
  const canSend = input.trim().length > 0 && !overChars && !loading && !atTurnLimit;

  async function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > MAX_MESSAGE_CHARS || loading || atTurnLimit) return;
    setInput("");
    await send(trimmed);
  }

  return (
    <div
      className="flex flex-col rounded-[18px] overflow-hidden"
      style={{ background: "#fff", color: colors.ink, boxShadow: "0 30px 60px rgba(10,10,40,0.25)" }}
    >
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #E6E8EE" }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>Assistant</span>
        <span className="font-mono text-[10px]" style={{ color: "#6A6F80" }}>
          AI · ANSWERS FROM RENE&rsquo;S NOTES
        </span>
      </div>

      <div className="flex flex-col gap-4 px-6 py-6 max-h-[420px] overflow-y-auto">
        {messages.length === 0 && (
          <p style={{ fontSize: 15, lineHeight: 1.65, color: colors.bodyGrey, margin: 0 }}>
            Ask a question about Rene&rsquo;s experience, or try one below.
          </p>
        )}
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div
              key={i}
              className="self-end max-w-[80%] sm:max-w-[70%] px-3.5 py-2.5 rounded-2xl"
              style={{ background: colors.ink, color: "#fff", fontSize: 15, lineHeight: 1.5 }}
            >
              {m.content}
            </div>
          ) : (
            <p key={i} style={{ maxWidth: "95%", fontSize: 15, lineHeight: 1.65, color: "#2A2D36", margin: 0 }}>
              {m.content}
            </p>
          ),
        )}
        {loading && <p style={{ fontSize: 15, lineHeight: 1.65, color: "#8A8E9C", margin: 0 }}>Thinking…</p>}
        {error && <p style={{ fontSize: 14, lineHeight: 1.6, color: "#B3261E", margin: 0 }}>{error}</p>}
        {lastUsage && !loading && (
          <div
            className="font-mono flex flex-col gap-2 rounded-[10px] px-[18px] py-4"
            style={{ background: "#F1F2F6", fontSize: 11, lineHeight: 1.5, color: colors.bodyGrey }}
          >
            <div className="flex justify-between" style={{ color: "#8A8E9C" }}>
              <span>SHOW YOUR WORK</span>
              <span>LIVE</span>
            </div>
            <div className="flex gap-4">
              <span className="w-[68px]" style={{ color: colors.ultramarine }}>
                COST
              </span>
              <span>
                {lastUsage.input + lastUsage.output} tokens · {estimateCost(lastUsage)}
              </span>
            </div>
          </div>
        )}
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => submit(q)}
                className="px-3 py-1.5 rounded-full text-[13px] text-left transition-colors"
                style={{ border: "1px solid #DADCE3", color: colors.bodyGrey }}
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 mx-6 mb-6">
        <div
          className="flex items-center gap-2 h-[52px] pl-4 pr-2 rounded-xl"
          style={{ background: colors.paper, border: "1px solid #DADCE3" }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit(input);
            }}
            disabled={loading || atTurnLimit}
            placeholder={atTurnLimit ? "Conversation limit reached" : "Ask a question"}
            maxLength={MAX_MESSAGE_CHARS + 20}
            className="flex-grow bg-transparent outline-none"
            style={{ fontSize: 15, color: colors.ink }}
          />
          <button
            type="button"
            onClick={() => submit(input)}
            disabled={!canSend}
            className="flex items-center h-[38px] px-4 rounded-lg font-semibold text-sm disabled:opacity-40"
            style={{ background: colors.ultramarine, color: "#fff" }}
          >
            Ask
          </button>
        </div>
        {overChars && (
          <span className="font-mono text-[11px]" style={{ color: "#B3261E" }}>
            {input.length}/{MAX_MESSAGE_CHARS} characters
          </span>
        )}
      </div>
    </div>
  );
}
