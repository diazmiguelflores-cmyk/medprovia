import { Link, useNavigate } from "@tanstack/react-router";
import { Trash2, Tag, Check, X } from "lucide-react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { brands, categories, products, getProduct, brandName, formatPrice, priceFor } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { QtyStepper } from "./ProductCard";
import { VialArt } from "./primitives";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const FREE_SHIPPING = 500;

export function SearchDialog() {
  const open = useStore((s) => s.searchOpen);
  const setOpen = useStore((s) => s.setSearchOpen);
  const navigate = useNavigate();
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(!useStore.getState().searchOpen);
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [setOpen]);
  const go = (fn: () => void) => {
    setOpen(false);
    fn();
  };
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search products, brands, categories…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Products">
          {products.map((p) => (
            <CommandItem
              key={p.slug}
              value={`${p.name} ${brandName(p.brand)}`}
              onSelect={() => go(() => navigate({ to: "/product/$slug", params: { slug: p.slug } }))}
            >
              {p.name} <span className="ml-auto text-xs text-muted-foreground">{brandName(p.brand)}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Categories">
          {categories.map((c) => (
            <CommandItem
              key={c.slug}
              value={c.name}
              onSelect={() => go(() => navigate({ to: "/shop/$category", params: { category: c.slug } }))}
            >
              {c.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Brands">
          {brands.map((b) => (
            <CommandItem
              key={b.slug}
              value={`brand ${b.name}`}
              onSelect={() => go(() => navigate({ to: "/brands/$slug", params: { slug: b.slug } }))}
            >
              {b.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function useCartTotals() {
  const cart = useStore((s) => s.cart);
  const currency = useStore((s) => s.currency);
  const discountPercent = useStore((s) => s.discountPercent);
  const discountCode = useStore((s) => s.discountCode);

  const lines = cart.flatMap((l) => {
    const p = getProduct(l.slug);
    return p ? [{ ...l, p, unit: priceFor(p, l.qty) }] : [];
  });
  const subtotal = lines.reduce((n, l) => n + l.unit * l.qty, 0);
  const discountAmount = discountPercent > 0 ? subtotal * discountPercent : 0;
  const shippingAmount = subtotal - discountAmount >= FREE_SHIPPING || !subtotal ? 0 : 35;
  const total = subtotal - discountAmount + shippingAmount;

  return { lines, subtotal, discountAmount, discountPercent, discountCode, shippingAmount, total, currency };
}

export function CartLines() {
  const { lines, currency } = useCartTotals();
  const setQty = useStore((s) => s.setQty);
  const remove = useStore((s) => s.remove);
  if (!lines.length) return <p className="py-10 text-center text-muted-foreground">Your cart is empty.</p>;
  return (
    <ul className="divide-y divide-border">
      {lines.map((l) => (
        <li key={l.slug} className="flex gap-3 py-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted/30">
            {l.p.image ? (
              <img src={l.p.image} alt={l.p.name} className="h-full w-full object-contain p-1" />
            ) : (
              <VialArt hue={l.p.hue} className="h-full w-full" />
            )}
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground">{brandName(l.p.brand)}</p>
                <p className="font-medium text-foreground">{l.p.name}</p>
              </div>
              <p className="font-semibold text-foreground">{formatPrice(l.unit * l.qty, currency)}</p>
            </div>
            <div className="flex items-center justify-between">
              <QtyStepper value={l.qty} onChange={(n) => setQty(l.slug, n)} size="sm" />
              <Button variant="ghost" size="icon" aria-label={`Remove ${l.p.name}`} onClick={() => remove(l.slug)}>
                <Trash2 />
              </Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ShippingProgress({ subtotal }: { subtotal: number }) {
  const currency = useStore((s) => s.currency);
  const left = Math.max(0, FREE_SHIPPING - subtotal);
  return (
    <div className="rounded-2xl bg-sage p-4">
      <p className="mb-2 text-sm text-foreground">
        {left > 0 ? (
          <>
            Add <strong>{formatPrice(left, currency)}</strong> for free express shipping
          </>
        ) : (
          "You've unlocked free express shipping"
        )}
      </p>
      <Progress value={Math.min(100, (subtotal / FREE_SHIPPING) * 100)} className="h-2" />
    </div>
  );
}

export function DiscountInput() {
  const [code, setCode] = useState("");
  const discountCode = useStore((s) => s.discountCode);
  const applyDiscount = useStore((s) => s.applyDiscount);
  const removeDiscount = useStore((s) => s.removeDiscount);

  if (discountCode) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs">
        <span className="flex items-center gap-1.5 font-medium text-primary">
          <Check className="h-3.5 w-3.5" /> Code {discountCode} applied (5% off)
        </span>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={removeDiscount}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (applyDiscount(code)) {
          toast.success("5% first-order discount applied!");
          setCode("");
        } else {
          toast.error("Invalid code. Use WELCOME5 for your first order.");
        }
      }}
    >
      <div className="relative flex-1">
        <Tag className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Promo code (e.g. WELCOME5)"
          className="h-10 rounded-xl pl-9 text-xs"
        />
      </div>
      <Button type="submit" size="sm" variant="outline" className="h-10 text-xs">
        Apply
      </Button>
    </form>
  );
}

export function CartSheet() {
  const open = useStore((s) => s.cartOpen);
  const setOpen = useStore((s) => s.setCartOpen);
  const { subtotal, discountAmount, total, lines, currency } = useCartTotals();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Your cart</SheetTitle>
        </SheetHeader>
        <ShippingProgress subtotal={subtotal} />
        <div className="flex-1 overflow-y-auto pr-1">
          <CartLines />
        </div>
        {lines.length > 0 && (
          <div className="space-y-3 border-t border-border pt-4">
            <DiscountInput />
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal, currency)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-primary">
                  <span>First order discount (5%)</span>
                  <span>−{formatPrice(discountAmount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between pt-1 text-lg font-semibold text-foreground">
                <span>Total</span>
                <span>{formatPrice(total, currency)}</span>
              </div>
            </div>
            <Button className="w-full" size="lg" asChild onClick={() => setOpen(false)}>
              <Link to="/checkout">Checkout</Link>
            </Button>
            <Button className="w-full" variant="outline" asChild onClick={() => setOpen(false)}>
              <Link to="/cart">View cart</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
