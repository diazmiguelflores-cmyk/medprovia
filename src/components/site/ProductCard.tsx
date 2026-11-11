import { Link } from "@tanstack/react-router";
import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { brandName, formatPrice, type Product } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { VialArt } from "./primitives";

export function QtyStepper({ value, onChange, size = "md" }: { value: number; onChange: (n: number) => void; size?: "sm" | "md" }) {
  const h = size === "sm" ? "h-9" : "h-11";
  return (
    <div className={cn("inline-flex items-center rounded-full border border-border bg-card", h)}>
      <button type="button" aria-label="Decrease quantity" onClick={() => onChange(Math.max(1, value - 1))} className={cn("grid place-items-center rounded-full hover:bg-muted", size === "sm" ? "w-9" : "w-11", h)}>
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-7 text-center text-sm font-semibold tabular-nums" aria-live="polite">{value}</span>
      <button type="button" aria-label="Increase quantity" onClick={() => onChange(value + 1)} className={cn("grid place-items-center rounded-full hover:bg-muted", size === "sm" ? "w-9" : "w-11", h)}>
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ApprovalBadges({ p }: { p: Product }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {p.badges.map((b) => (
        <Badge key={b} variant="outline" className={cn("rounded-full border-gold/50 bg-gold/10 text-[10px] font-semibold text-foreground", b === "Korean" && "border-primary/40 bg-primary/10")}>
          {b}
        </Badge>
      ))}
    </div>
  );
}

export function ProductCard({ p, layout = "grid" }: { p: Product; layout?: "grid" | "list" }) {
  const [qty, setQty] = useState(1);
  const add = useStore((s) => s.add);
  const wished = useStore((s) => s.wishlist.includes(p.slug));
  const toggleWish = useStore((s) => s.toggleWish);
  const currency = useStore((s) => s.currency);

  return (
    <article className={cn("group relative flex overflow-hidden rounded-2xl border border-border bg-card lift", layout === "grid" ? "flex-col" : "flex-row")}>
      <button
        type="button"
        onClick={() => toggleWish(p.slug)}
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wished}
        className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full glass"
      >
        <Heart className={cn("h-4 w-4", wished ? "fill-destructive text-destructive" : "text-foreground")} />
      </button>
      <Link to="/product/$slug" params={{ slug: p.slug }} className={cn("block overflow-hidden rounded-t-2xl bg-slate-50 dark:bg-slate-900", layout === "list" && "w-36 shrink-0 sm:w-48")}>
        {p.image ? (
          <img
            src={p.image}
            alt={p.name}
            loading="lazy"
            className={cn(
              "h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.05]",
              layout === "grid" ? "aspect-[4/3.4]" : "min-h-40",
            )}
          />
        ) : (
          <VialArt hue={p.hue} label={p.name} className={cn("transition-transform duration-500 group-hover:scale-[1.03]", layout === "grid" ? "aspect-[4/3.4]" : "h-full min-h-40")} />
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{brandName(p.brand)}</p>
        <Link to="/product/$slug" params={{ slug: p.slug }} className="font-display text-lg font-medium leading-snug text-foreground hover:text-primary">
          {p.name}
        </Link>
        <ApprovalBadges p={p} />
        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-semibold text-foreground">{formatPrice(p.price, currency)}</span>
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">sample price</span>
          </div>
          <p className="text-xs text-primary">Save more when you buy more</p>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <QtyStepper value={qty} onChange={setQty} size="sm" />
          <Button
            size="sm"
            className="flex-1"
            disabled={!p.inStock}
            onClick={() => {
              add(p.slug, qty);
              toast.success(`${p.name} added to cart`);
            }}
          >
            <ShoppingBag /> {p.inStock ? "Add" : "Out of stock"}
          </Button>
        </div>
      </div>
    </article>
  );
}
