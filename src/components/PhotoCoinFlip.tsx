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
}: {
  frontSrc: string;
  backSrc: string;
  flipped: boolean;
  onToggle: () => void;
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
      title="Flip me"
      className="relative w-14 h-14 md:w-16 md:h-16 md:ml-[5vw] shrink-0 rounded-full transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ perspective: 800 }}
    >
      <style>{`
        @keyframes coin-intro-spin {
          0% { transform: rotateY(0deg) translateY(-10px) scale(0.85); opacity: 0; }
          35% { transform: rotateY(200deg) translateY(0) scale(1); opacity: 1; }
          65% { transform: rotateY(330deg); }
          100% { transform: rotateY(360deg); }
        }
        .coin-intro-spin { animation: coin-intro-spin 1s cubic-bezier(0.3,0.1,0.3,1) both; }
      `}</style>
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
          <Image src={frontSrc} alt="Rene Marino" fill sizes="64px" className="object-cover" priority />
        </div>
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <Image src={backSrc} alt="Rene Marino, illustrated" fill sizes="64px" className="object-cover" />
        </div>
      </div>
    </button>
  );
}
