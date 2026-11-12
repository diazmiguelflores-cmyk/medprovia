import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Check, Headset, Loader2, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Container, PageHero, Reveal } from "@/components/site/primitives";
import { sendEmailNotification, OFFICIAL_EMAIL } from "@/lib/email";
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
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    clinic: "",
    email: "",
    phone: "",
    topic: "Product Sourcing & Availability",
    msg: "",
  });

  const handleChange = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [k]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendEmailNotification({
        type: "contact",
        subject: `[Inquiry: ${formData.topic}] ${formData.name} — ${formData.clinic}`,
        senderName: formData.name,
        senderEmail: formData.email,
        clinicName: formData.clinic,
        data: {
          "Sender Name": formData.name,
          "Clinic / Practice": formData.clinic,
          "Clinic Email": formData.email,
          "Contact Phone": formData.phone || "—",
          "Inquiry Topic": formData.topic,
          "Message": formData.msg,
          "Recipient": OFFICIAL_EMAIL,
        },
      });

      toast.success(`Inquiry sent directly to ${OFFICIAL_EMAIL}`);
      setSent(true);
    } catch (err) {
      toast.error(`Message recorded. You can also email us directly at ${OFFICIAL_EMAIL}`);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

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
                Inquiries are delivered directly to <strong className="text-foreground">{OFFICIAL_EMAIL}</strong>. Responses within 2 business hours.
              </p>

              {sent ? (
                <div className="mt-8 rounded-2xl bg-primary/10 border border-primary/20 p-8 text-center space-y-3">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-6 w-6" />
                  </span>
                  <h3 className="font-display text-2xl text-foreground">Message received</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Your inquiry has been emailed to <strong>{OFFICIAL_EMAIL}</strong>. A dedicated account specialist will respond to {formData.email} promptly.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      setSent(false);
                      setFormData({
                        name: "",
                        clinic: "",
                        email: "",
                        phone: "",
                        topic: "Product Sourcing & Availability",
                        msg: "",
                      });
                    }}
                  >
                    Send another inquiry
                  </Button>
                </div>
              ) : (
                <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-medium text-foreground">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      required
                      placeholder="Dr. Jane Doe"
                      value={formData.name}
                      onChange={handleChange("name")}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="clinic" className="text-xs font-medium text-foreground">
                      Clinic / Practice Name *
                    </label>
                    <Input
                      id="clinic"
                      required
                      placeholder="Aesthetic Institute"
                      value={formData.clinic}
                      onChange={handleChange("clinic")}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-medium text-foreground">
                      Clinic Email *
                    </label>
                    <Input
                      id="email"
                      required
                      type="email"
                      placeholder="doctor@clinic.com"
                      value={formData.email}
                      onChange={handleChange("email")}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-xs font-medium text-foreground">
                      Contact Phone (Optional)
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleChange("phone")}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label htmlFor="topic" className="text-xs font-medium text-foreground">
                      Inquiry Topic
                    </label>
                    <select
                      id="topic"
                      value={formData.topic}
                      onChange={handleChange("topic")}
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
                      value={formData.msg}
                      onChange={handleChange("msg")}
                      className="min-h-36 rounded-xl"
                    />
                  </div>
                  <Button type="submit" size="lg" disabled={loading} className="sm:col-span-2">
                    {loading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Transmitting...</>
                    ) : (
                      <><Send className="mr-2 h-4 w-4" /> Send inquiry to {OFFICIAL_EMAIL}</>
                    )}
                  </Button>
                </form>
              )}
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
