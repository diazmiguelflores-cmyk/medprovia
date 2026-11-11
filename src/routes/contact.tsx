import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Headset, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Container, PageHero, Reveal } from "@/components/site/primitives";
import { contact } from "@/data/content";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () =>
    seo(
      "Contact Medprovia",
      "Connect with Medprovia via email at info@medprovia.com or submit an inquiry for clinic restocking and volume pricing.",
    ),
  component: Contact,
});

function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Dedicated Support"
        title="We are here to support your practice"
        sub="Connect directly with account managers for volume tier inquiries, custom sourcing, and cold-chain logistics coordination."
      />

      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          {/* Main contact form */}
          <Reveal>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
              <h2 className="font-display text-2xl text-foreground sm:text-3xl">Send an inquiry</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Our clinical support team typically responds within 2 business hours.
              </p>

              <form
                className="mt-6 grid gap-4 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success("Inquiry received. Your assigned account manager will reach out shortly.");
                  e.currentTarget.reset();
                }}
              >
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-medium text-foreground">
                    Full Name *
                  </label>
                  <Input id="name" required placeholder="Dr. Jane Doe" className="h-12 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="clinic" className="text-xs font-medium text-foreground">
                    Clinic / Practice Name *
                  </label>
                  <Input id="clinic" required placeholder="Aesthetic Institute" className="h-12 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-medium text-foreground">
                    Clinic Email *
                  </label>
                  <Input id="email" required type="email" placeholder="doctor@clinic.com" className="h-12 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-xs font-medium text-foreground">
                    Contact Phone (Optional)
                  </label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="h-12 rounded-xl" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="topic" className="text-xs font-medium text-foreground">
                    Inquiry Topic
                  </label>
                  <select
                    id="topic"
                    className="h-12 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>Product Sourcing & Availability</option>
                    <option>Wholesale Tier Volume Pricing</option>
                    <option>License Verification Support</option>
                    <option>Cold-Chain & International Shipping</option>
                    <option>Price Match Review</option>
                    <option>Other Clinic Request</option>
                  </select>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="msg" className="text-xs font-medium text-foreground">
                    Message Details *
                  </label>
                  <Textarea
                    id="msg"
                    required
                    placeholder="Provide details on products, quantities or specific destination requirements..."
                    className="min-h-36 rounded-xl"
                  />
                </div>
                <Button type="submit" size="lg" className="sm:col-span-2">
                  <Send className="mr-2 h-4 w-4" /> Send message
                </Button>
              </form>
            </div>
          </Reveal>

          {/* Quick contact sidecards */}
          <div className="space-y-6">
            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                <h3 className="font-display text-xl text-foreground">Official Email</h3>
                <p className="mt-1 text-xs text-muted-foreground">For all clinic & procurement inquiries</p>

                <div className="mt-5 space-y-3">
                  <Button variant="outline" size="lg" className="h-14 w-full justify-start rounded-xl px-4" asChild>
                    <a href={`mailto:${contact.email}`} className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <span className="block text-xs text-muted-foreground">General & Procurement</span>
                        <span className="block font-semibold text-foreground text-sm">{contact.email}</span>
                      </div>
                    </a>
                  </Button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="rounded-3xl bg-sage p-6">
                <div className="flex items-center gap-3">
                  <Headset className="h-6 w-6 text-primary" />
                  <div>
                    <h4 className="font-display text-lg text-foreground">Dedicated Support</h4>
                    <p className="text-xs text-muted-foreground">One point of contact for reorders</p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Upon license verification, every clinic is assigned a dedicated specialist for recurring inventory schedules, volume price locks, and expedited customs transit. Reach us anytime at <span className="font-medium text-foreground">{contact.email}</span>.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </>
  );
}
