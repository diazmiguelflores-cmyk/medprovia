import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { FileText, Heart, Lock, ShieldAlert, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ApprovalBadges, ProductCard, QtyStepper } from "@/components/site/ProductCard";
import { Container, VialArt } from "@/components/site/primitives";
import { brandName, formatPrice, getCategory, getProduct, priceFor, products } from "@/data/catalog";
import { complianceNotice } from "@/data/content";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const p = getProduct(params.slug);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData: p }) =>
    p
      ? {
          meta: [
            { title: `${p.name} — ${brandName(p.brand)} | Medprovia` },
            { name: "description", content: `${p.name} (${p.size}) by ${brandName(p.brand)}. Authentic, lot-traceable, for licensed professionals.` },
            { property: "og:title", content: `${p.name} | Medprovia` },
            { property: "og:description", content: `${p.name} by ${brandName(p.brand)} for licensed professionals.` },
            { property: "og:type", content: "product" },
            { name: "twitter:card", content: "summary_large_image" },
          ],
          scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Product", name: p.name, brand: { "@type": "Brand", name: brandName(p.brand) }, description: p.description, offers: { "@type": "Offer", priceCurrency: "USD", price: p.price, availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" } }) }],
        }
      : { meta: [{ title: "Product unavailable | Medprovia" }, { name: "robots", content: "noindex" }] },
  component: ProductPage,
});

function ProductPage() {
  const p = Route.useLoaderData();
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const verified = useStore((s) => s.verified);
  const setVerified = useStore((s) => s.setVerified);
  const add = useStore((s) => s.add);
  const wished = useStore((s) => s.wishlist.includes(p.slug));
  const toggleWish = useStore((s) => s.toggleWish);
  const currency = useStore((s) => s.currency);
  const cat = getCategory(p.category)!;
  const hues = [p.hue, p.hue + 25, p.hue - 25];
  // Build a gallery: use real photo first (shown for all 3 slots) or fall back to tinted vials
  const hasRealImg = Boolean(p.image);
  const galleryImages = hasRealImg
    ? [p.image!, p.image!, p.image!]
    : (hues as (number | null)[]);
  const related = products.filter((x) => x.category === p.category && x.slug !== p.slug).concat(products.filter((x) => x.brand === p.brand && x.slug !== p.slug)).slice(0, 4);
  const unit = priceFor(p, qty);
  const addToCart = () => { add(p.slug, qty); toast.success(`${p.name} added to cart`); };

  return (
    <>
      <Container className="pb-10 pt-6 lg:pt-32 w-full max-w-7xl overflow-x-hidden">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/shop">Shop</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/shop/$category" params={{ category: cat.slug }}>{cat.name}</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>{p.name}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2 w-full min-w-0">
          <div className="w-full min-w-0">
            <div
              className="relative aspect-square cursor-zoom-in overflow-hidden rounded-3xl border border-border bg-slate-50 dark:bg-slate-900"
              onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }}
              onMouseLeave={() => setZoom(null)}
            >
              <div className="h-full w-full transition-transform duration-200" style={zoom ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}>
                {hasRealImg ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-contain p-6"
                  />
                ) : (
                  <VialArt hue={hues[img] ?? p.hue} label={p.name} className="h-full w-full" />
                )}
              </div>
            </div>
            <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar">
              {galleryImages.map((imgSrc, i) => (
                <button key={i} onClick={() => setImg(i)} aria-label={`View image ${i + 1}`} className={cn("h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-muted/30", img === i ? "border-primary" : "border-transparent")}>
                  {hasRealImg ? (
                    <img src={imgSrc as string} alt={`${p.name} view ${i + 1}`} className="h-full w-full object-contain p-1" />
                  ) : (
                    <VialArt hue={imgSrc as number} className="h-full w-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full min-w-0">
            <Link to="/brands/$slug" params={{ slug: p.brand }} className="text-sm font-semibold uppercase tracking-widest text-primary">{brandName(p.brand)}</Link>
            <h1 className="mt-2 text-xl font-semibold text-foreground sm:text-3xl lg:text-4xl break-words leading-tight">{p.name}</h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground break-words">{p.size} · {p.inStock ? "In stock" : "Out of stock"}</p>
            <div className="mt-4"><ApprovalBadges p={p} /></div>
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-gold/40 bg-gold/10 p-4 text-xs sm:text-sm text-foreground">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-gold" /> Licensed professionals only. {complianceNotice}
            </div>

            {verified ? (
              <div className="mt-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-semibold text-foreground">{formatPrice(unit, currency)}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">per unit · sample price</span>
                </div>
                <div className="mt-4 w-full overflow-x-auto rounded-2xl border border-border">
                  <table className="w-full min-w-[280px] text-sm">
                    <thead className="bg-sage text-left"><tr><th className="p-3 font-medium">Quantity</th><th className="p-3 font-medium">Unit price</th><th className="p-3 font-medium">You save</th></tr></thead>
                    <tbody>
                      {p.tiers.map((t, i) => (
                        <tr key={t.min} className={cn("border-t border-border", unit === t.price && "bg-primary/5 font-semibold")}>
                          <td className="p-3">{t.min}{i === p.tiers.length - 1 ? "+" : `–${(p.tiers[i + 1]?.min ?? 0) - 1}`}</td>
                          <td className="p-3">{formatPrice(t.price, currency)}</td>
                          <td className="p-3 text-primary">{Math.round((1 - t.price / p.price) * 100)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-5 hidden items-center gap-3 sm:flex">
                  <QtyStepper value={qty} onChange={setQty} />
                  <Button size="lg" className="flex-1" disabled={!p.inStock} onClick={addToCart}><ShoppingBag />Add to cart</Button>
                  <Button size="icon" variant="outline" aria-label="Wishlist" aria-pressed={wished} onClick={() => toggleWish(p.slug)}><Heart className={cn(wished && "fill-destructive text-destructive")} /></Button>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-border bg-card p-6 text-center">
                <Lock className="mx-auto h-6 w-6 text-primary" />
                <p className="mt-2 font-display text-xl text-foreground">Verify your license to order</p>
                <p className="mt-1 text-sm text-muted-foreground">Wholesale pricing is unlocked upon professional license submission.</p>
                <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
                  <Button variant="gold" asChild><Link to="/register">Get Verified</Link></Button>
                  <Button variant="outline" onClick={() => setVerified(true)}>Demo: view as verified</Button>
                </div>
              </div>
            )}
            <Button variant="link" className="mt-3 px-0 h-auto whitespace-normal text-left" asChild>
              <Link to="/contact" className="inline-flex items-center gap-1.5 flex-wrap text-sm leading-normal">
                <FileText className="h-4 w-4 shrink-0" />
                <span>Request a custom volume quote for {p.name}</span>
              </Link>
            </Button>

            <Tabs defaultValue="overview" className="mt-6 w-full min-w-0 overflow-hidden">
              <div className="w-full overflow-x-auto no-scrollbar">
                <TabsList className="inline-flex w-max rounded-full">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="usage">Usage info</TabsTrigger>
                  <TabsTrigger value="shipping">Shipping & returns</TabsTrigger>
                  <TabsTrigger value="auth">Authenticity</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="overview" className="pt-3 text-muted-foreground text-sm sm:text-base leading-relaxed">{p.description}</TabsContent>
              <TabsContent value="usage" className="pt-3 text-muted-foreground text-sm sm:text-base leading-relaxed">For professional use only. Refer to the manufacturer's official instructions for use and local regulations. Medprovia does not provide treatment advice.</TabsContent>
              <TabsContent value="shipping" className="pt-3 text-muted-foreground text-sm sm:text-base leading-relaxed">Express shipping, cold-packed when required. Free replacement on qualifying delays or damage. See the <Link to="/legal/$page" params={{ page: "returns" }} className="text-primary underline">Returns policy</Link>.</TabsContent>
              <TabsContent value="auth" className="pt-3 text-muted-foreground text-sm sm:text-base leading-relaxed">Supplied in original packaging with the original manufacturer lot number, which can be verified on receipt.</TabsContent>
            </Tabs>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20 w-full min-w-0">
            <h2 className="mb-6 text-2xl sm:text-3xl text-foreground">Related products</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 w-full min-w-0">{related.map((r) => <ProductCard key={r.slug} p={r} />)}</div>
          </section>
        )}
      </Container>

      {verified && (
        <div className="glass fixed inset-x-3 bottom-24 z-30 flex items-center gap-2 rounded-2xl p-2 shadow-lift sm:hidden">
          <QtyStepper value={qty} onChange={setQty} size="sm" />
          <Button className="flex-1" disabled={!p.inStock} onClick={addToCart}><ShoppingBag />Add · {formatPrice(unit * qty, currency)}</Button>
        </div>
      )}
    </>
  );
}
