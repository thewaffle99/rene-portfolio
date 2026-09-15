"use client";

import { CSSProperties, ReactNode } from "react";
import { useInView } from "./useInView";

/** Wraps text that slides up out of a mask when it scrolls into view (or immediately, for `eager`). */
export function RevealLine({
  children,
  delay,
  eager,
  style,
  className,
}: {
  children: ReactNode;
  delay?: 1 | 2;
  eager?: boolean;
  style?: CSSProperties;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const active = eager || inView;
  const delayClass = delay === 1 ? " reveal-delay-1" : delay === 2 ? " reveal-delay-2" : "";
  return (
    <span
      ref={ref}
      className={`reveal-line${delayClass}${active ? " in-view" : ""}${className ? ` ${className}` : ""}`}
      style={style}
    >
      <span>{children}</span>
    </span>
  );
}

export function RevealFade({
  children,
  eager,
  delayMs,
  style,
  className,
}: {
  children: ReactNode;
  eager?: boolean;
  delayMs?: number;
  style?: CSSProperties;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const active = eager || inView;
  return (
    <div
      ref={ref}
      className={`reveal-fade${active ? " in-view" : ""}${className ? ` ${className}` : ""}`}
      style={{ transitionDelay: delayMs ? `${delayMs}ms` : undefined, ...style }}
    >
      {children}
    </div>
  );
}

export function RevealPanel({
  children,
  eager,
  style,
  className,
}: {
  children: ReactNode;
  eager?: boolean;
  style?: CSSProperties;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const active = eager || inView;
  return (
    <div
      ref={ref}
      className={`reveal-panel${active ? " in-view" : ""}${className ? ` ${className}` : ""}`}
      style={style}
    >
      {children}
    </div>
  );
}
