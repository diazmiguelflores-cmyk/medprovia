import { motion, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ eyebrow, title, sub, center }: { eyebrow?: string; title: string; sub?: string; center?: boolean }) {
  return (
    <Reveal className={cn("mb-10 max-w-2xl", center && "mx-auto text-center")}>
      {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>}
      <h2 className="text-3xl font-medium text-foreground sm:text-4xl lg:text-5xl">{title}</h2>
      {sub && <p className="mt-4 text-base text-muted-foreground sm:text-lg">{sub}</p>}
    </Reveal>
  );
}

export function Icon({ name, className }: { name: string; className?: string }) {
  const C = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Circle;
  return <C className={className} aria-hidden="true" />;
}

export function PageHero({ eyebrow, title, sub, children }: { eyebrow?: string; title: string; sub?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-mesh pb-12 pt-8 lg:pb-16 lg:pt-36">
      <Container>
        <Reveal>
          {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>}
          <h1 className="max-w-3xl text-4xl font-medium text-foreground sm:text-5xl">{title}</h1>
          {sub && <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{sub}</p>}
          {children}
        </Reveal>
      </Container>
    </section>
  );
}

/** Illustrated product vial — no third-party imagery. */
export function VialArt({ hue = 200, label, className }: { hue?: number; label?: string; className?: string }) {
  const c1 = `oklch(0.9 0.06 ${hue})`;
  const c2 = `oklch(0.62 0.11 ${hue})`;
  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden bg-vial", className)}>
      <svg viewBox="0 0 120 160" className="h-4/5 w-auto drop-shadow-xl" role="img" aria-label={label ?? "Product illustration"}>
        <defs>
          <linearGradient id={`v${hue}`} x1="0" x2="1">
            <stop offset="0" stopColor={c2} />
            <stop offset="0.5" stopColor={c1} />
            <stop offset="1" stopColor={c2} />
          </linearGradient>
        </defs>
        <rect x="42" y="8" width="36" height="16" rx="4" fill="var(--navy)" />
        <rect x="46" y="24" width="28" height="10" fill="oklch(0.85 0.01 250)" />
        <rect x="30" y="34" width="60" height="118" rx="14" fill={`url(#v${hue})`} opacity="0.95" />
        <rect x="36" y="70" width="48" height="44" rx="6" fill="oklch(1 0 0 / 0.9)" />
        <rect x="42" y="80" width="36" height="5" rx="2.5" fill="var(--navy)" opacity="0.8" />
        <rect x="42" y="91" width="26" height="4" rx="2" fill="var(--primary)" opacity="0.7" />
        <rect x="42" y="100" width="20" height="4" rx="2" fill="var(--gold)" />
        <rect x="36" y="40" width="6" height="100" rx="3" fill="oklch(1 0 0 / 0.5)" />
      </svg>
    </div>
  );
}
