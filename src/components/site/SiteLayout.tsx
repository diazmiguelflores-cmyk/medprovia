import { useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useStore } from "@/lib/store";
import { FloatingNav } from "./FloatingNav";
import { BottomNav, MobileDrawer, MobileTopBar } from "./MobileNav";
import { CartSheet, SearchDialog } from "./Overlays";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  const [drawer, setDrawer] = useState(false);
  const close = useCallback(() => setDrawer(false), []);
  const dark = useStore((s) => s.dark);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => { useStore.persist.rehydrate(); }, []);
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);

  return (
    <div className="min-h-screen pb-28 lg:pb-0">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">Skip to content</a>
      <FloatingNav />
      <MobileTopBar onMenu={() => setDrawer(true)} />
      <MobileDrawer open={drawer} onClose={close} />
        <motion.main id="main" key={path} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
          {children}
        </motion.main>
      <Footer />
      <BottomNav />
      <CartSheet />
      <SearchDialog />
      <Toaster position="top-center" />
    </div>
  );
}
