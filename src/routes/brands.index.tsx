import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Container, PageHero } from "@/components/site/primitives";
import { brands, products } from "@/data/catalog";
import { trademarkNotice } from "@/data/content";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/brands/")({
  head: () => seo("Brands A–Z", "Browse the aesthetic and medical brands supplied by Medprovia, an independent supplier for licensed professionals."),
  component: BrandsPage,
});

function BrandsPage() {
  const [q, setQ] = useState("");
  const filtered = brands.filter((b) => b.name.toLowerCase().includes(q.toLowerCase()));
  const letters = [...new Set(filtered.map((b) => b.name.charAt(0).toUpperCase()))].sort();
  return (
    <>
      <PageHero eyebrow="Brands" title="Brand index A–Z" sub={trademarkNotice}>
        <div className="relative mt-6 max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search brands" aria-label="Search brands" className="h-12 rounded-full bg-card pl-11" />
        </div>
      </PageHero>
      <Container className="py-12">
        <nav aria-label="Jump to letter" className="no-scrollbar mb-8 flex gap-1 overflow-x-auto">
          {letters.map((l) => <a key={l} href={`#l-${l}`} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border bg-card font-display text-foreground hover:bg-secondary">{l}</a>)}
        </nav>
        <div className="space-y-10">
          {letters.map((l) => (
            <section key={l} id={`l-${l}`} className="scroll-mt-28">
              <h2 className="mb-4 text-3xl text-primary">{l}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {filtered.filter((b) => b.name.charAt(0).toUpperCase() === l).map((b) => (
                  <Link key={b.slug} to="/brands/$slug" params={{ slug: b.slug }} className="rounded-2xl border border-border bg-card p-5 lift">
                    <p className="font-display text-xl text-foreground">{b.name}</p>
                    <p className="text-sm text-muted-foreground">{b.origin} · {products.filter((p) => p.brand === b.slug).length} products</p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
          {!letters.length && <p className="text-muted-foreground">No brands found.</p>}
        </div>
      </Container>
    </>
  );
}
