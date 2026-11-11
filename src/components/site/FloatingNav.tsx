import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Moon, Search, ShoppingBag, Sun, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { brands, categories, getProduct, brandName, formatPrice } from "@/data/catalog";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { useCartCount, useStore, type Currency } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Logo } from "../brand/Logo";
import { Icon, VialArt } from "./primitives";

const links = [
  { to: "/shop", label: "Shop", mega: "shop" },
  { to: "/brands", label: "Brands", mega: "brands" },
  { to: "/services", label: "Services" },
  { to: "/programs", label: "Programs" },
  { to: "/blog", label: "Learn" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function FloatingNav() {
  const { hidden, scrolled } = useScrollDirection();
  const [open, setOpen] = useState<null | "shop" | "brands">(null);
  const [hover, setHover] = useState<string | null>(null);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const count = useCartCount();
  const setCartOpen = useStore((s) => s.setCartOpen);
  const setSearchOpen = useStore((s) => s.setSearchOpen);
  const dark = useStore((s) => s.dark);
  const toggleDark = useStore((s) => s.toggleDark);
  const currency = useStore((s) => s.currency);
  const setCurrency = useStore((s) => s.setCurrency);
  const active = links.find((l) => path.startsWith(l.to))?.to ?? null;
  const indicator = hover ?? active;
  const featured = getProduct("profhilo-h-l")!;

  return (
    <motion.header
      className="fixed inset-x-0 top-4 z-50 hidden px-4 lg:block"
      animate={{ y: hidden && !open ? -110 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
      onMouseLeave={() => {
        setOpen(null);
        setHover(null);
      }}
    >
      <nav
        aria-label="Main"
        className={cn(
          "glass mx-auto flex max-w-[1180px] items-center justify-between rounded-full pl-5 pr-2 transition-all duration-300",
          scrolled ? "py-1.5 shadow-lift" : "py-2.5 shadow-soft",
        )}
      >
        <Logo />
        <ul className="flex items-center">
          {links.map((l) => (
            <li
              key={l.to}
              className="relative"
              onMouseEnter={() => {
                setHover(l.to);
                setOpen("mega" in l ? l.mega : null);
              }}
            >
              <Link
                to={l.to}
                className="relative z-10 flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
                aria-haspopup={"mega" in l ? "true" : undefined}
                aria-expanded={"mega" in l ? open === l.mega : undefined}
                onFocus={() => setOpen("mega" in l ? l.mega : null)}
              >
                {l.label}
                {"mega" in l && (
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open === l.mega && "rotate-180")} />
                )}
              </Link>
              {indicator === l.to && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-secondary"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="h-8 rounded-full border border-border/80 bg-background/80 px-2 text-xs font-semibold text-foreground focus:outline-none"
            aria-label="Select currency"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
          <Button variant="ghost" size="icon" aria-label="Toggle dark mode" onClick={toggleDark}>
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" aria-label="Search products" onClick={() => setSearchOpen(true)}>
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Account" asChild>
            <Link to="/account">
              <User className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Cart, ${count} items`}
            className="relative"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Button>
          <Button variant="gold" size="sm" asChild className="ml-1 shadow-sm">
            <Link to="/register">Get Verified</Link>
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            key={open}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="glass mx-auto mt-3 max-w-[1180px] rounded-3xl p-6 shadow-lift"
            role="menu"
          >
            {open === "shop" ? (
              <div className="grid grid-cols-[1fr_270px] gap-6">
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      to="/shop/$category"
                      params={{ category: c.slug }}
                      onClick={() => setOpen(null)}
                      className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-secondary"
                      role="menuitem"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon name={c.icon} className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-foreground">{c.name}</span>
                        <span className="block text-xs text-muted-foreground">{c.blurb}</span>
                      </span>
                    </Link>
                  ))}
                </div>
                <Link
                  to="/product/$slug"
                  params={{ slug: featured.slug }}
                  onClick={() => setOpen(null)}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/40"
                >
                  {featured.image ? (
                    <img src={featured.image} alt={featured.name} className="aspect-[4/3] w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <VialArt hue={featured.hue} className="aspect-[4/3] transition-transform duration-300 group-hover:scale-105" />
                  )}
                  <div className="p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gold">Featured Practitioner Choice</p>
                    <p className="mt-1 font-display text-lg text-foreground">{featured.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {brandName(featured.brand)} · from {formatPrice(featured.tiers[2]?.price ?? featured.price, currency)}
                    </p>
                  </div>
                </Link>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-4 gap-2">
                  {brands.map((b) => (
                    <Link
                      key={b.slug}
                      to="/brands/$slug"
                      params={{ slug: b.slug }}
                      onClick={() => setOpen(null)}
                      className="group flex items-center rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-secondary"
                      role="menuitem"
                    >
                      <span className="mr-2 font-display text-primary font-semibold group-hover:scale-110 transition-transform">{b.name[0]}</span>
                      {b.name}
                    </Link>
                  ))}
                </div>
                <div className="mt-4 border-t border-border pt-3">
                  <Link
                    to="/brands"
                    onClick={() => setOpen(null)}
                    className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
                  >
                    View complete A–Z brand index with filters →
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
