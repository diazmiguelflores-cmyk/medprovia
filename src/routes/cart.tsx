import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Snowflake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartLines, DiscountInput, ShippingProgress, useCartTotals } from "@/components/site/Overlays";
import { Container } from "@/components/site/primitives";
import { formatPrice } from "@/data/catalog";
import { complianceNotice } from "@/data/content";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/cart")({
  head: () => seo("Your cart", "Review your Medprovia order, tier pricing, and temperature-controlled shipping."),
  component: CartPage,
});

function CartPage() {
  const { lines, subtotal, discountAmount, shippingAmount, total, currency } = useCartTotals();

  return (
    <Container className="max-w-4xl py-8 lg:pt-36">
      <div className="flex items-baseline justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-4xl font-medium text-foreground sm:text-5xl">Your order</h1>
          <p className="mt-1 text-sm text-muted-foreground">Prices shown in {currency}. Tier volume discounts applied automatically.</p>
        </div>
        <Link to="/shop" className="text-sm font-semibold text-primary hover:underline">
          Continue shopping
        </Link>
      </div>

      <div className="mt-6">
        <ShippingProgress subtotal={subtotal} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-border bg-card p-6">
          <CartLines />
        </div>

        {lines.length > 0 ? (
          <aside className="space-y-4">
            <div className="space-y-4 rounded-3xl border border-border bg-card p-6">
              <h2 className="font-display text-xl text-foreground">Order summary</h2>
              <DiscountInput />
              <dl className="space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <dt>Subtotal</dt>
                  <dd className="font-medium text-foreground">{formatPrice(subtotal, currency)}</dd>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-primary">
                    <dt>First order discount (5%)</dt>
                    <dd className="font-medium">−{formatPrice(discountAmount, currency)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <dt>Express shipping</dt>
                  <dd className="font-medium text-foreground">
                    {shippingAmount > 0 ? formatPrice(shippingAmount, currency) : <span className="text-primary font-semibold">Free</span>}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-lg font-semibold text-foreground">
                  <dt>Estimated total</dt>
                  <dd>{formatPrice(total, currency)}</dd>
                </div>
              </dl>
              <Button size="lg" className="w-full text-base font-medium" asChild>
                <Link to="/checkout">
                  Proceed to checkout <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="space-y-2 rounded-2xl bg-sage p-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" /> 100% Authentic & Lot Traceable
              </div>
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Snowflake className="h-4 w-4 text-primary" /> Validated Cold-Chain Transit
              </div>
              <p className="pt-1 text-[11px] leading-relaxed">{complianceNotice}</p>
            </div>
          </aside>
        ) : (
          <div className="py-12 text-center lg:col-span-2">
            <Button asChild size="lg" className="mx-auto">
              <Link to="/shop">Browse products</Link>
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
}
