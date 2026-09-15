"use client";

import { useEffect, useRef } from "react";

type TurnstileRenderOptions = {
  sitekey: string;
  size: "invisible";
  callback: (token: string) => void;
  "error-callback"?: () => void;
  "expired-callback"?: () => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
      execute: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";
let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load verification script."));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

// Renders an invisible Turnstile widget and exposes getToken() to fetch a fresh
// token on demand — one widget instance per hook consumer, shared across every
// call site that uses the same hook instance (e.g. every send() in useAskChat).
export function useTurnstile(siteKey: string | undefined) {
  const widgetIdRef = useRef<string | null>(null);
  const readyRef = useRef<Promise<void> | null>(null);
  const pendingRef = useRef<{ resolve: (t: string) => void; reject: (e: Error) => void } | null>(null);

  useEffect(() => {
    if (!siteKey) return;
    const container = document.createElement("div");
    container.style.display = "none";
    document.body.appendChild(container);

    readyRef.current = loadTurnstileScript().then(() => {
      if (!window.turnstile) throw new Error("Verification unavailable.");
      widgetIdRef.current = window.turnstile.render(container, {
        sitekey: siteKey,
        size: "invisible",
        callback: (token) => {
          pendingRef.current?.resolve(token);
          pendingRef.current = null;
        },
        "error-callback": () => {
          pendingRef.current?.reject(new Error("Verification failed — please try again."));
          pendingRef.current = null;
        },
        "expired-callback": () => {
          pendingRef.current?.reject(new Error("Verification expired — please try again."));
          pendingRef.current = null;
        },
      });
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) window.turnstile.remove(widgetIdRef.current);
      container.remove();
    };
  }, [siteKey]);

  async function getToken(): Promise<string> {
    if (!siteKey) return "";
    await readyRef.current;
    if (!window.turnstile || !widgetIdRef.current) throw new Error("Verification unavailable.");
    return new Promise((resolve, reject) => {
      pendingRef.current = { resolve, reject };
      window.turnstile!.execute(widgetIdRef.current!);
    });
  }

  return { getToken };
}
