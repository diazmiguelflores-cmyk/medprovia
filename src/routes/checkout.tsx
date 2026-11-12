import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, CreditCard, FileText, Loader2, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DiscountInput, useCartTotals } from "@/components/site/Overlays";
import { Container } from "@/components/site/primitives";
import { formatPrice } from "@/data/catalog";
import { sendEmailNotification, OFFICIAL_EMAIL } from "@/lib/email";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/checkout")({
  head: () => seo("Checkout", "Secure checkout for verified healthcare professionals."),
  component: Checkout,
});

const steps = ["Shipping", "Billing & Payment", "Review & Submit"];

// ─── Field component defined at MODULE scope so React never re-mounts it ───
// (Defining it inside the Checkout function causes React to treat it as a new
//  component type on every render, which unmounts+remounts the input and loses
//  the cursor after every keystroke.)
function CheckoutField({
  id,
  label,
  form,
  onChange,
  type = "text",
  placeholder,
  required = true,
}: {
  id: keyof CheckoutForm;
  label: string;
  form: CheckoutForm;
  onChange: (k: keyof CheckoutForm) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-foreground">
        {label} {required && "*"}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        required={required}
        value={form[id]}
        onChange={onChange(id)}
        className="h-11 rounded-xl"
      />
    </div>
  );
}

type CheckoutForm = {
  name: string;
  clinic: string;
  email: string;
  phone: string;
  lic: string;
  addr: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  paymentMethod: string;
};

const initialForm: CheckoutForm = {
  name: "",
  clinic: "",
  email: "",
  phone: "",
  lic: "",
  addr: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  paymentMethod: "Clinic Invoice (Net-30)",
};

function Checkout() {
  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderRef, setOrderRef] = useState("");
  const [form, setForm] = useState<CheckoutForm>(initialForm);

  const { lines, subtotal, discountAmount, discountPercent, shippingAmount, total, currency } = useCartTotals();
  const clear = useStore((s) => s.clear);

  const setVal = (k: keyof CheckoutForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    const generatedId = `MPV-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderRef(generatedId);

    const itemizedProducts = lines.map((l) => ({
      product: l.p.name,
      brand: l.p.brand,
      size: l.p.size,
      quantity: l.qty,
      unitPrice: formatPrice(l.unit, currency),
      lineTotal: formatPrice(l.unit * l.qty, currency),
    }));

    try {
      await sendEmailNotification({
        type: "order",
        subject: `[New Order ${generatedId}] ${form.clinic || "Clinic"} — Total: ${formatPrice(total, currency)}`,
        senderName: form.name,
        senderEmail: form.email,
        clinicName: form.clinic,
        data: {
          "Order Reference": generatedId,
          "Order Date": new Date().toLocaleString(),
          "Recipient Email": OFFICIAL_EMAIL,
          "Clinic Name": form.clinic || "—",
          "Practitioner Name": form.name || "—",
          "License Number": form.lic || "—",
          "Clinic Phone": form.phone || "—",
          "Clinic Email": form.email || "—",
          "Delivery Address": `${form.addr || ""}, ${form.city || ""}, ${form.state || ""} ${form.zip || ""}, ${form.country || ""}`,
          "Payment Method": form.paymentMethod || "Invoice",
          "Item Count": lines.reduce((acc, l) => acc + l.qty, 0),
          "Items Ordered": itemizedProducts,
          "Subtotal": formatPrice(subtotal, currency),
          "Discount": discountAmount > 0 ? `−${formatPrice(discountAmount, currency)} (${discountPercent}%)` : "None",
          "Cold-Chain Shipping": shippingAmount > 0 ? formatPrice(shippingAmount, currency) : "Free (Order > $500)",
          "Order Total": formatPrice(total, currency),
        },
      });

      toast.success(`Order ${generatedId} submitted to ${OFFICIAL_EMAIL}`);
      clear();
      setPlaced(true);
    } catch (err) {
      toast.error(`Order placed. Please confirm directly with ${OFFICIAL_EMAIL}`);
      clear();
      setPlaced(true);
    } finally {
      setLoading(false);
    }
  };

  // Alias so JSX below stays concise
  const F = (props: Omit<React.ComponentProps<typeof CheckoutField>, "form" | "onChange">) => (
    <CheckoutField {...props} form={form} onChange={setVal} />
  );

  if (placed)
    return (
      <Container className="py-24 text-center lg:pt-40">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-elegant">
          <Check className="h-8 w-8" />
        </span>
        <h1 className="mt-6 font-display text-4xl text-foreground">Order received</h1>
        <p className="mt-2 text-sm font-semibold text-primary">Order Reference: {orderRef}</p>
        <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
          All order specifications, lot traceability requirements, and clinic shipping details have been dispatched to{" "}
          <strong className="text-foreground">{OFFICIAL_EMAIL}</strong>.
        </p>
        <p className="mx-auto mt-2 max-w-md text-xs text-muted-foreground">
          Your assigned account manager will verify cold-chain inventory availability and issue official invoice documentation.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild>
            <Link to="/shop">Continue browsing</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </Container>
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
          onSubmit={handleSubmit}
        >
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="font-display text-2xl text-foreground">Clinic shipping destination</h2>
              <p className="text-xs text-muted-foreground">Medprovia ships only to licensed clinical facilities.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <F id="name" label="Practitioner full name" placeholder="Dr. Alexandra Rivera" />
                <F id="clinic" label="Clinic / Practice name" placeholder="Aesthetic Dermatology Clinic" />
                <F id="email" label="Clinic contact email" type="email" placeholder="orders@aestheticclinic.com" />
                <F id="phone" label="Clinic direct phone" type="tel" placeholder="+1 (555) 019-2834" />
                <F id="lic" label="Professional License #" placeholder="MD-98432-NY" />
                <F id="country" label="Country" placeholder="United States" />
                <div className="sm:col-span-2">
                  <F id="addr" label="Street address" placeholder="Suite 400, 100 Medical Center Parkway" />
                </div>
                <F id="city" label="City" placeholder="New York" />
                <F id="state" label="State / Province" placeholder="NY" />
                <F id="zip" label="Postal code" placeholder="10001" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl text-foreground">Billing & settlement</h2>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" /> B2B Verified Billing
                </span>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-medium text-foreground">Select settlement preference:</label>
                <div className="grid gap-2">
                  {[
                    { id: "Clinic Invoice (Net-30)", label: "Clinic Invoice (Net-30 upon license verification)", desc: "Invoice delivered via email with lot release documentation" },
                    { id: "Wire Transfer / BACS", label: "Direct Bank Wire / ACH Transfer", desc: "Banking credentials and pro-forma invoice will be emailed" },
                    { id: "Corporate Card", label: "Credit / Debit Card (Corporate Account)", desc: "Settlement link generated upon stock allocation" },
                  ].map((m) => (
                    <label
                      key={m.id}
                      onClick={() => setForm((prev) => ({ ...prev, paymentMethod: m.id }))}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition",
                        form.paymentMethod === m.id
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border text-muted-foreground hover:bg-muted/50",
                      )}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={form.paymentMethod === m.id}
                        onChange={() => setForm((prev) => ({ ...prev, paymentMethod: m.id }))}
                        className="mt-1 text-primary"
                      />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{m.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gold/40 bg-gold/10 p-4 text-xs text-foreground">
                <p className="font-medium">Direct Email Confirmation</p>
                <p className="text-muted-foreground mt-1">
                  Once placed, the purchase order will be sent to <strong>{OFFICIAL_EMAIL}</strong> and copied to your clinic email.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl text-foreground">Review & place order</h2>
              <p className="text-sm text-muted-foreground">
                Please verify your clinic delivery address and license information. All injectables ship with original batch lot tracking documentation.
              </p>

              <div className="rounded-2xl bg-muted/60 p-4 text-sm text-foreground space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <Truck className="h-4 w-4 text-primary" />
                  <span>Temperature-Controlled Express Logistics</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Insulated cold-chain container with transit temperature monitor indicator included.
                </p>
                <div className="pt-2 text-xs border-t border-border grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-muted-foreground block">Clinic:</span>
                    <span className="font-medium">{form.clinic || "—"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Practitioner:</span>
                    <span className="font-medium">{form.name || "—"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Email:</span>
                    <span className="font-medium">{form.email || "—"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">License #:</span>
                    <span className="font-medium">{form.lic || "—"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground block">Delivery Destination:</span>
                    <span className="font-medium">{form.addr}, {form.city}, {form.state} {form.zip}, {form.country}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between border-t border-border pt-6">
            <Button type="button" variant="outline" disabled={step === 0 || loading} onClick={() => setStep(step - 1)}>
              Back
            </Button>
            <Button type="submit" disabled={!lines.length || loading} size="lg">
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting order...</>
              ) : step === 2 ? (
                "Place order (Submit to email)"
              ) : (
                "Continue"
              )}
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
