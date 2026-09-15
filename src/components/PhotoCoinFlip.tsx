"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function PhotoCoinFlip({
  frontSrc,
  backSrc,
  flipped,
  onToggle,
  accentColor = "#2B3BFF",
}: {
  frontSrc: string;
  backSrc: string;
  flipped: boolean;
  onToggle: () => void;
  accentColor?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [introPlaying, setIntroPlaying] = useState(!reducedMotion);

  useEffect(() => {
    if (reducedMotion) setIntroPlaying(false);
  }, [reducedMotion]);

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={introPlaying}
      aria-pressed={flipped}
      aria-label={flipped ? "Switch back to the photo of Rene" : "Flip to the illustrated version of Rene"}
      className="group relative shrink-0 rounded-full transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ width: "clamp(96px, 9vw, 176px)", height: "clamp(96px, 9vw, 176px)", perspective: 1800 }}
    >
      <style>{`
        @keyframes coin-intro-spin {
          0% { transform: rotateY(0deg) translateY(-10px) scale(0.85); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: rotateY(180deg) translateY(-6px) scale(1.08); opacity: 1; }
          100% { transform: rotateY(360deg) translateY(0) scale(1); opacity: 1; }
        }
        .coin-intro-spin { animation: coin-intro-spin 1.4s cubic-bezier(0.3,0.1,0.3,1) both; }
        .coin-tooltip {
          opacity: 0;
          transform: translate(-50%, 4px) scale(0.85);
          transition: opacity 0.25s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .group:hover .coin-tooltip,
        .group:focus-visible .coin-tooltip {
          opacity: 1;
          transform: translate(-50%, 0) scale(1);
        }
      `}</style>
      <span
        className="coin-tooltip pointer-events-none absolute left-1/2 bottom-full mb-3 whitespace-nowrap rounded-full py-1.5 pl-2 pr-3 font-mono text-[11px] font-medium tracking-[0.08em] uppercase"
        style={{
          background: "#14151A",
          color: "#fff",
          boxShadow: "0 8px 20px rgba(10,10,12,0.28), 0 0 0 1px rgba(255,255,255,0.06) inset",
        }}
      >
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: accentColor }} />
          Flip me
        </span>
        <span
          className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45"
          style={{ background: "#14151A" }}
        />
      </span>
      <div
        className={introPlaying ? "coin-intro-spin" : undefined}
        onAnimationEnd={() => setIntroPlaying(false)}
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: introPlaying ? undefined : `rotateY(${flipped ? 180 : 0}deg)`,
          transition: introPlaying || reducedMotion ? "none" : "transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)",
          boxShadow: "0 2px 10px rgba(10,10,12,0.18)",
          borderRadius: "50%",
        }}
      >
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <Image src={frontSrc} alt="Rene Marino" fill sizes="176px" className="object-cover" priority />
        </div>
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <Image src={backSrc} alt="Rene Marino, illustrated" fill sizes="176px" className="object-cover" />
        </div>
      </div>
    </button>
  );
}
