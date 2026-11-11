import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartLine = { slug: string; qty: number };
export type Currency = "USD" | "EUR" | "GBP";

export const CURRENCY_RATES: Record<Currency, { rate: number; symbol: string; code: Currency }> = {
  USD: { rate: 1, symbol: "$", code: "USD" },
  EUR: { rate: 0.92, symbol: "€", code: "EUR" },
  GBP: { rate: 0.79, symbol: "£", code: "GBP" },
};

type State = {
  cart: CartLine[];
  wishlist: string[];
  verified: boolean;
  dark: boolean;
  currency: Currency;
  cartOpen: boolean;
  searchOpen: boolean;
  discountCode: string | null;
  discountPercent: number;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  toggleWish: (slug: string) => void;
  setVerified: (v: boolean) => void;
  toggleDark: () => void;
  setCurrency: (c: Currency) => void;
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  applyDiscount: (code: string) => boolean;
  removeDiscount: () => void;
};

export const useStore = create<State>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      verified: false,
      dark: false,
      currency: "USD",
      cartOpen: false,
      searchOpen: false,
      discountCode: null,
      discountPercent: 0,
      add: (slug, qty = 1) =>
        set((s) => {
          const found = s.cart.find((l) => l.slug === slug);
          return {
            cart: found
              ? s.cart.map((l) => (l.slug === slug ? { ...l, qty: l.qty + qty } : l))
              : [...s.cart, { slug, qty }],
          };
        }),
      setQty: (slug, qty) =>
        set((s) => ({ cart: s.cart.map((l) => (l.slug === slug ? { ...l, qty: Math.max(1, qty) } : l)) })),
      remove: (slug) => set((s) => ({ cart: s.cart.filter((l) => l.slug !== slug) })),
      clear: () => set({ cart: [] }),
      toggleWish: (slug) =>
        set((s) => ({
          wishlist: s.wishlist.includes(slug) ? s.wishlist.filter((x) => x !== slug) : [...s.wishlist, slug],
        })),
      setVerified: (verified) => set({ verified }),
      toggleDark: () => set((s) => ({ dark: !s.dark })),
      setCurrency: (currency) => set({ currency }),
      setCartOpen: (cartOpen) => set({ cartOpen }),
      setSearchOpen: (searchOpen) => set({ searchOpen }),
      applyDiscount: (code: string) => {
        const clean = code.trim().toUpperCase();
        if (clean === "WELCOME5" || clean === "FIRST5" || clean === "MED5") {
          set({ discountCode: clean, discountPercent: 0.05 });
          return true;
        }
        return false;
      },
      removeDiscount: () => set({ discountCode: null, discountPercent: 0 }),
    }),
    {
      name: "medprovia",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        cart: s.cart,
        wishlist: s.wishlist,
        verified: s.verified,
        dark: s.dark,
        currency: s.currency,
        discountCode: s.discountCode,
        discountPercent: s.discountPercent,
      }),
    },
  ),
);

export const useCartCount = () => useStore((s) => s.cart.reduce((n, l) => n + l.qty, 0));
