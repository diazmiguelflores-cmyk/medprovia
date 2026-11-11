import { createFileRoute } from "@tanstack/react-router";
import { InfoGrid } from "@/components/site/InfoPages";
import { PageHero } from "@/components/site/primitives";
import { services } from "@/data/content";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/services/")({
  head: () => seo("Services", "Wholesale pricing, price match, tracking, verification, shipping and dedicated support."),
  component: () => (
    <>
      <PageHero eyebrow="Services" title="Services built for professional practices" sub="Wholesale pricing, price match, tracking, verification, shipping and dedicated support." />
      <InfoGrid items={services} kind="services" />
    </>
  ),
});
