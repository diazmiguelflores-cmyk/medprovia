import { Link } from "@tanstack/react-router";
import type { Post } from "@/data/content";

export function PostCard({ p }: { p: Post }) {
  return (
    <Link to="/blog/$slug" params={{ slug: p.slug }} className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card lift">
      <div className="aspect-[16/9]" style={{ background: `linear-gradient(135deg, oklch(0.92 0.05 ${p.hue}), oklch(0.6 0.1 ${p.hue}))` }} />
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{p.category} · {p.minutes} min read</p>
        <h3 className="mt-2 text-xl font-medium text-foreground">{p.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
      </div>
    </Link>
  );
}

