import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Calendar, Clock, Headset, Mail, MessageCircle, Phone, Send, ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Container, PageHero, Reveal } from "@/components/site/primitives";
import { contact } from "@/data/content";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () =>
    seo(
      "Contact Medprovia",
      "Connect with your dedicated Medprovia account manager via phone, WhatsApp, email, or schedule a 1-on-1 clinic consultation.",
    ),
  component: Contact,
});

function Contact() {
  const [callOpen, setCallOpen] = useState(false);
  const [scheduled, setScheduled] = useState(false);

  return (
    <>
      <PageHero
        eyebrow="Dedicated Support"
        title="We are here to support your practice"
        sub="Connect directly with licensed account managers for volume tier inquiries, custom sourcing, and cold-chain logistics coordination."
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
                    Phone / Mobile (WhatsApp)
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
                <h3 className="font-display text-xl text-foreground">Direct Channels</h3>
                <p className="mt-1 text-xs text-muted-foreground">Available Mon–Fri · 8:00–18:00 (EST)</p>

                <div className="mt-5 space-y-3">
                  <Button variant="outline" size="lg" className="h-12 w-full justify-start rounded-xl" asChild>
                    <a href={`tel:${contact.phone}`} className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>Phone: {contact.phone}</span>
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="h-12 w-full justify-start rounded-xl" asChild>
                    <a
                      href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3"
                    >
                      <MessageCircle className="h-4 w-4 text-primary" />
                      <span>WhatsApp: {contact.whatsapp}</span>
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="h-12 w-full justify-start rounded-xl" asChild>
                    <a href={`mailto:${contact.email}`} className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>Email: {contact.email}</span>
                    </a>
                  </Button>
                </div>

                <div className="mt-6 border-t border-border pt-6">
                  <Dialog open={callOpen} onOpenChange={setCallOpen}>
                    <DialogTrigger asChild>
                      <Button variant="gold" size="lg" className="w-full">
                        <Calendar className="mr-2 h-4 w-4" /> Schedule a practitioner call
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="font-display text-2xl">Schedule a consultation</DialogTitle>
                        <DialogDescription>
                          Book a 15-minute briefing with a senior medical account manager.
                        </DialogDescription>
                      </DialogHeader>
                      {!scheduled ? (
                        <form
                          className="space-y-4 pt-2"
                          onSubmit={(e) => {
                            e.preventDefault();
                            setScheduled(true);
                            toast.success("Call scheduled! Calendar invitation sent to your email.");
                          }}
                        >
                          <div className="space-y-1">
                            <label className="text-xs font-medium">Your Name</label>
                            <Input required placeholder="Dr. Sarah Miller" className="h-10 rounded-lg" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium">Clinic Email</label>
                            <Input required type="email" placeholder="smiller@practice.com" className="h-10 rounded-lg" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-xs font-medium">Preferred Date</label>
                              <Input required type="date" defaultValue="2026-11-12" className="h-10 rounded-lg" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-medium">Time Window</label>
                              <select className="h-10 w-full rounded-lg border border-border bg-background px-2 text-xs">
                                <option>09:00 - 10:00 EST</option>
                                <option>11:00 - 12:00 EST</option>
                                <option>14:00 - 15:00 EST</option>
                                <option>16:00 - 17:00 EST</option>
                              </select>
                            </div>
                          </div>
                          <Button type="submit" className="w-full">
                            Confirm Appointment
                          </Button>
                        </form>
                      ) : (
                        <div className="py-6 text-center space-y-3">
                          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground">
                            <Clock className="h-6 w-6" />
                          </span>
                          <p className="font-display text-lg text-foreground">Appointment confirmed</p>
                          <p className="text-xs text-muted-foreground">
                            Check your inbox for the calendar invite and direct dial credentials.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setScheduled(false);
                              setCallOpen(false);
                            }}
                          >
                            Close
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="rounded-3xl bg-sage p-6">
                <div className="flex items-center gap-3">
                  <Headset className="h-6 w-6 text-primary" />
                  <div>
                    <h4 className="font-display text-lg text-foreground">Assigned Account Manager</h4>
                    <p className="text-xs text-muted-foreground">One point of contact for reorders</p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Upon license verification, every clinic is assigned a dedicated specialist for recurring inventory schedules, volume price locks, and expedited customs transit.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </>
  );
}
