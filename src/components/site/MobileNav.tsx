import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Home, LayoutGrid, Mail, Menu, Moon, Search, ShoppingBag, Sun, Tag, User, X, BadgeCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { brands, categories } from "@/data/catalog";
import { contact, programs } from "@/data/content";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { useCartCount, useStore, type Currency } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Logo } from "../brand/Logo";

export function MobileTopBar({ onMenu }: { onMenu: () => void }) {
  const setSearchOpen = useStore((s) => s.setSearchOpen);
  const verified = useStore((s) => s.verified);
  const currency = useStore((s) => s.currency);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="glass sticky top-0 z-40 border-b border-border/70 backdrop-blur-2xl bg-background/90 px-3 pt-2.5 pb-2 lg:hidden space-y-2 shadow-soft w-full max-w-full overflow-hidden">
      {/* Upper row: Native App Header with Menu Hamburger, Brand + PRO badge, and Verification Pill */}
      <div className="flex h-10 items-center justify-between gap-2">
        <button
          onClick={onMenu}
          aria-label="Open menu"
          className="grid h-10 w-10 place-items-center rounded-2xl border border-border/70 bg-card shadow-sm transition active:scale-90"
        >
          <Menu className="h-5 w-5 text-foreground" />
        </button>

        <div className="flex items-center gap-1.5">
          <Logo className="text-lg" />
          <span className="rounded-md border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-primary">
            PRO
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {verified ? (
            <Link
              to="/account"
              className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary transition active:scale-95"
            >
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>Verified</span>
            </Link>
          ) : (
            <Link
              to="/register"
              className="flex items-center gap-1 rounded-full bg-gold-gradient px-3 py-1 text-[11px] font-bold text-gold-foreground shadow-sm transition active:scale-95"
            >
              <BadgeCheck className="h-3.5 w-3.5" />
              <span>Verify</span>
            </Link>
          )}
        </div>
      </div>

      {/* Second row: App-Style Search Pill */}
      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        className="flex h-10 w-full items-center gap-2.5 rounded-2xl border border-border/80 bg-card/90 px-3.5 text-xs text-muted-foreground shadow-inner transition active:scale-[0.99]"
        aria-label="Search products, brands and lot numbers"
      >
        <Search className="h-4 w-4 text-primary shrink-0" />
        <span className="truncate text-left font-normal">Search injectables, brands, lot #...</span>
        <span className="ml-auto rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground">
          {currency}
        </span>
      </button>

      {/* Third row: Quick Category Filter Pills */}
      <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs">
        <Link
          to="/shop"
          className={cn(
            "shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition active:scale-95",
            path === "/shop"
              ? "bg-primary text-primary-foreground font-semibold shadow-sm"
              : "border border-border/60 bg-card/70 text-muted-foreground hover:text-foreground",
          )}
        >
          All
        </Link>
        {categories.slice(0, 8).map((cat) => {
          const isCurrent = path === `/shop/${cat.slug}`;
          return (
            <Link
              key={cat.slug}
              to="/shop/$category"
              params={{ category: cat.slug }}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition active:scale-95",
                isCurrent
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "border border-border/60 bg-card/70 text-muted-foreground hover:text-foreground",
              )}
            >
              {cat.name.split(" ")[0]}
            </Link>
          );
        })}
      </div>
    </header>
  );
}

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/shop", label: "Shop", icon: LayoutGrid },
  { to: "/brands", label: "Brands", icon: Tag },
  { to: "/cart", label: "Cart", icon: ShoppingBag },
  { to: "/account", label: "Account", icon: User },
] as const;

export function BottomNav() {
  const { hidden } = useScrollDirection();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const count = useCartCount();
  const isActive = (to: string) => (to === "/" ? path === "/" : path.startsWith(to));
  return (
    <motion.nav
      aria-label="Primary"
      animate={{ y: hidden ? 120 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-3 z-40 lg:hidden left-3 right-3 max-w-md mx-auto"
    >
      <ul className="glass pb-safe flex items-stretch justify-between rounded-3xl px-2 pt-2 shadow-lift">
        {tabs.map(({ to, label, icon: I }) => {
          const active = isActive(to);
          return (
            <li key={to} className="flex-1">
              <Link to={to} aria-current={active ? "page" : undefined} className="relative flex min-h-12 flex-col items-center justify-center gap-0.5 text-[11px] font-medium">
                {active && <motion.span layoutId="tab-pill" className="absolute inset-x-2 inset-y-0 rounded-2xl bg-primary/12 bg-primary/10" transition={{ type: "spring", stiffness: 500, damping: 30 }} />}
                <span className="relative">
                  <I className={cn("h-5 w-5", active ? "text-primary" : "text-muted-foreground")} />
                  {to === "/cart" && count > 0 && (
                    <span className="absolute -right-2.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">{count}</span>
                  )}
                </span>
                <span className={cn("relative", active ? "text-primary" : "text-muted-foreground")}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}

export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dark = useStore((s) => s.dark);
  const toggleDark = useStore((s) => s.toggleDark);
  const verified = useStore((s) => s.verified);
  const currency = useStore((s) => s.currency);
  const setCurrency = useStore((s) => s.setCurrency);
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => { onClose(); }, [path]); // close on navigation
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [open, onClose]);

  const simple = [
    { to: "/services", label: "Services" },
    { to: "/blog", label: "Learn" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ] as const;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-navy/40 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-sm flex-col bg-background shadow-lift lg:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.4, right: 0 }}
            onDragEnd={(_, info) => info.offset.x < -80 && onClose()}
          >
            <div className="flex items-center justify-between p-4">
              <Logo />
              <Button variant="ghost" size="icon" aria-label="Close menu" onClick={onClose}><X /></Button>
            </div>
            <div className="mx-4 rounded-2xl bg-mesh p-4 border border-border">
              <p className="font-display text-lg text-foreground">{verified ? "You're verified" : "Welcome, practitioner"}</p>
              <p className="text-sm text-muted-foreground">Submit your medical license for wholesale pricing.</p>
              <div className="mt-3">
                <Button size="sm" variant="gold" className="w-full" asChild><Link to="/register">Get Verified</Link></Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="shop">
                  <AccordionTrigger className="min-h-12 text-base">Shop</AccordionTrigger>
                  <AccordionContent>
                    <Link to="/shop" className="block min-h-11 py-2.5 font-medium text-primary">All products</Link>
                    {categories.map((c) => (
                      <Link key={c.slug} to="/shop/$category" params={{ category: c.slug }} className="block min-h-11 py-2.5 text-foreground">{c.name}</Link>
                    ))}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="brands">
                  <AccordionTrigger className="min-h-12 text-base">Brands</AccordionTrigger>
                  <AccordionContent>
                    {brands.slice(0, 8).map((b) => (
                      <Link key={b.slug} to="/brands/$slug" params={{ slug: b.slug }} className="block min-h-11 py-2.5 text-foreground">{b.name}</Link>
                    ))}
                    <Link to="/brands" className="block min-h-11 py-2.5 font-medium text-primary">View all brands</Link>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="programs">
                  <AccordionTrigger className="min-h-12 text-base">Programs</AccordionTrigger>
                  <AccordionContent>
                    {programs.map((p) => (
                      <Link key={p.slug} to="/programs/$slug" params={{ slug: p.slug }} className="block min-h-11 py-2.5 text-foreground">{p.title}</Link>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              {simple.map((l) => (
                <Link key={l.to} to={l.to} className="flex min-h-12 items-center border-b border-border text-base font-medium text-foreground">{l.label}</Link>
              ))}
            </div>
            <div className="border-t border-border p-4 pb-safe">
              <Button variant="outline" size="sm" className="w-full justify-center" asChild>
                <a href={`mailto:${contact.email}`}><Mail className="mr-2 h-4 w-4" />{contact.email}</a>
              </Button>
              <div className="mt-3 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="sr-only">Currency</span>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="h-11 rounded-full border border-border bg-card px-3 text-sm text-foreground">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </label>
                <Button variant="ghost" size="icon" aria-label="Toggle dark mode" onClick={toggleDark}>{dark ? <Sun /> : <Moon />}</Button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
