import { createFileRoute } from "@tanstack/react-router";
import { ShopView } from "@/components/site/ShopView";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/shop/")({
  head: () => seo("Shop professional supplies", "Browse dermal fillers, toxins, skinboosters, biostimulators, orthopedic injections and more for licensed professionals."),
  component: () => <ShopView />,
});
