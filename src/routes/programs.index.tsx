import { createFileRoute } from "@tanstack/react-router";
import { InfoGrid } from "@/components/site/InfoPages";
import { PageHero } from "@/components/site/primitives";
import { programs } from "@/data/content";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/programs/")({
  head: () => seo("Programs", "Savings, loyalty credits, referrals and price match — rewards for repeat buyers."),
  component: () => (
    <>
      <PageHero eyebrow="Programs" title="Programs built for professional practices" sub="Savings, loyalty credits, referrals and price match — rewards for repeat buyers." />
      <InfoGrid items={programs} kind="programs" />
    </>
  ),
});
