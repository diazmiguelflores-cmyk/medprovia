import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, CreditCard, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DiscountInput, useCartTotals } from "@/components/site/Overlays";
import { Container } from "@/components/site/primitives";
import { formatPrice } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/checkout")({
  head: () => seo("Checkout", "Secure checkout for verified healthcare professionals (demo mode)."),
  component: Checkout,
});

const steps = ["Shipping", "Payment", "Review"];

function Checkout() {
  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState(false);
  const { lines, subtotal, discountAmount, discountPercent, shippingAmount, total, currency } = useCartTotals();
  const clear = useStore((s) => s.clear);

  if (placed)
    return (
      <Container className="py-24 text-center lg:pt-40">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-elegant">
          <Check className="h-8 w-8" />
        </span>
        <h1 className="mt-6 font-display text-4xl text-foreground">Order received</h1>
        <p className="mt-2 text-muted-foreground">Demo order placed successfully. Your account manager has been assigned.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild>
            <Link to="/account">View order in account</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/shop">Continue shopping</Link>
          </Button>
        </div>
      </Container>
    );

  const F = ({ id, label, type = "text", placeholder }: { id: string; label: string; type?: string; placeholder?: string }) => (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-foreground">
        {label}
      </Label>
      <Input id={id} type={type} placeholder={placeholder} required className="h-11 rounded-xl" />
    </div>
  );

  return (
    <Container className="py-8 lg:pt-36">
      <h1 className="font-display text-4xl text-foreground">Checkout</h1>
      <ol className="mt-6 flex gap-2">
        {steps.map((s, i) => (
          <li
            key={s}
            className={cn(
              "flex-1 rounded-full px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider transition-colors",
              i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
            )}
          >
            {i + 1}. {s}
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <form
          className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            if (step < 2) setStep(step + 1);
            else {
              clear();
              setPlaced(true);
            }
          }}
        >
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="font-display text-2xl text-foreground">Clinic shipping destination</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <F id="name" label="Practitioner full name" placeholder="Dr. Alexandra Rivera" />
                <F id="clinic" label="Clinic / Practice name" placeholder="Aesthetic Dermatology Clinic" />
                <F id="lic" label="Professional License #" placeholder="MD-98432-NY" />
                <F id="phone" label="Clinic direct phone" type="tel" placeholder="+1 (555) 019-2834" />
                <div className="sm:col-span-2">
                  <F id="addr" label="Street address" placeholder="Suite 400, 100 Medical Center Parkway" />
                </div>
                <F id="city" label="City" placeholder="New York" />
                <F id="state" label="State / Province" placeholder="NY" />
                <F id="zip" label="Postal code" placeholder="10001" />
                <F id="country" label="Country" placeholder="United States" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl text-foreground">Payment method</h2>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" /> 256-bit TLS encrypted
                </span>
              </div>
              <p className="flex items-center gap-2 rounded-xl bg-sage p-3 text-xs text-muted-foreground">
                <CreditCard className="h-4 w-4 text-primary" /> Demo mode: No real payment will be charged to your card.
              </p>
              <div className="space-y-4">
                <F id="card" label="Card number" placeholder="4242 •••• •••• 4242" />
                <div className="grid grid-cols-2 gap-4">
                  <F id="exp" label="Expiry (MM/YY)" placeholder="12/28" />
                  <F id="cvc" label="CVC" placeholder="123" />
                </div>
                <F id="cname" label="Cardholder name" placeholder="Alexandra Rivera" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl text-foreground">Review & place order</h2>
              <p className="text-sm text-muted-foreground">
                Please verify that your clinic delivery address and license information are correct. All injectables ship with original batch lot tracking documentation.
              </p>
              <div className="rounded-2xl bg-muted/60 p-4 text-sm text-foreground space-y-1">
                <p className="font-semibold">Temperature-Controlled Express Delivery</p>
                <p className="text-xs text-muted-foreground">Cold-packed insulated shipper with transit temperature monitor indicator.</p>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between border-t border-border pt-6">
            <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>
              Back
            </Button>
            <Button type="submit" disabled={!lines.length} size="lg">
              {step === 2 ? "Place order" : "Continue"}
            </Button>
          </div>
        </form>

        <aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-2xl text-foreground">Order summary</h2>
          <ul className="mt-4 divide-y divide-border text-sm">
            {lines.map((l) => (
              <li key={l.slug} className="flex justify-between py-2.5">
                <span className="text-muted-foreground">
                  {l.qty} × {l.p.name}
                </span>
                <span className="font-medium text-foreground">{formatPrice(l.unit * l.qty, currency)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t border-border pt-4">
            <DiscountInput />
          </div>

          <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <dt>Subtotal</dt>
              <dd className="font-medium text-foreground">{formatPrice(subtotal, currency)}</dd>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-primary">
                <dt>First order discount (5%)</dt>
                <dd className="font-medium">−{formatPrice(discountAmount, currency)}</dd>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <dt>Express cold shipping</dt>
              <dd className="font-medium text-foreground">
                {shippingAmount > 0 ? formatPrice(shippingAmount, currency) : <span className="text-primary font-semibold">Free</span>}
              </dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-lg font-semibold text-foreground">
              <dt>Total</dt>
              <dd>{formatPrice(total, currency)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </Container>
  );
}
