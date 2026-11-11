import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-7 w-7", className)} aria-hidden="true">
      <defs>
        <linearGradient id="mp-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--primary)" />
          <stop offset="1" stopColor="var(--navy)" />
        </linearGradient>
      </defs>
      <path d="M16 2C16 2 6 13.5 6 20a10 10 0 0 0 20 0C26 13.5 16 2 16 2Z" fill="url(#mp-g)" />
      <path d="M14.5 14h3v4h4v3h-4v4h-3v-4h-4v-3h4z" fill="var(--gold)" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-foreground", className)} aria-label="Medprovia home">
      <LogoMark />
      <span>Medprovia</span>
    </Link>
  );
}
