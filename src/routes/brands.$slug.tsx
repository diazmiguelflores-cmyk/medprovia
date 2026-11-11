import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProductCard } from "@/components/site/ProductCard";
import { Container, PageHero } from "@/components/site/primitives";
import { getBrand, products } from "@/data/catalog";
import { trademarkNotice } from "@/data/content";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/brands/$slug")({
  loader: ({ params }) => {
    const b = getBrand(params.slug);
    if (!b) throw notFound();
    return b;
  },
  head: ({ loaderData: b }) => (b ? seo(`${b.name} products`, `Shop ${b.name} products for licensed professionals. Authentic and lot-traceable.`) : { meta: [{ title: "Brand unavailable | Medprovia" }, { name: "robots", content: "noindex" }] }),
  component: BrandPage,
});

function BrandPage() {
  const b = Route.useLoaderData();
  const list = products.filter((p) => p.brand === b.slug);
  return (
    <>
      <PageHero eyebrow={`Brand · ${b.origin}`} title={b.name} sub={trademarkNotice} />
      <Container className="py-12">
        {list.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{list.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
        ) : (
          <p className="text-muted-foreground">Products from this brand are available on request — contact your account manager.</p>
        )}
      </Container>
    </>
  );
}
