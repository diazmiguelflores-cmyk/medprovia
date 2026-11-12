import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Gem, Globe2, Headset, PiggyBank, RefreshCw, Scale, ShieldCheck, Snowflake, Star, Truck, Users, Layers3, Quote } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { bestSellers, brands, categories, getProduct } from "@/data/catalog";
import { faqs, posts, testimonials, trademarkNotice, complianceNotice } from "@/data/content";
import { PostCard } from "@/components/site/PostCard";
import { ProductCard } from "@/components/site/ProductCard";
import { Container, Icon, Reveal, SectionHeading } from "@/components/site/primitives";
import { sendEmailNotification } from "@/lib/email";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Medprovia — Premium aesthetic & medical supplies for professionals" },
      { name: "description", content: "Authentic, lot-traceable dermal fillers, toxins, skinboosters and orthopedic injectables for licensed healthcare professionals worldwide." },
      { property: "og:title", content: "Medprovia — Premium aesthetic & medical supplies" },
      { property: "og:description", content: "Authentic, traceable products for licensed professionals, delivered with trust." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Categories />
      <BestSellers />
      <Brands />
      <WhyUs />
      <Programs />
      <HowItWorks />
      <Learn />
      <Testimonials />
      <Faq />
      <Cta />
    </>
  );
}

function Hero() {
  const cards = [
    { cls: "left-0 top-10", icon: ShieldCheck, t: "100% authentic", s: "Lot-number traceable" },
    { cls: "right-0 bottom-16", icon: Truck, t: "Worldwide express", s: "Temperature-controlled" },
  ];
  return (
    <section className="relative overflow-hidden bg-mesh">
      <Container className="grid items-center gap-12 pb-20 pt-10 lg:grid-cols-2 lg:pb-28 lg:pt-40">
        <Reveal>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-card/70 px-3 py-1.5 text-xs font-semibold text-foreground">
            <BadgeCheck className="h-4 w-4 text-gold" /> For licensed healthcare professionals
          </p>
          <h1 className="text-[2.6rem] font-semibold leading-[1.08] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Premium aesthetic & medical supplies, <span className="text-primary">delivered with trust.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Authentic, traceable products for clinics, med spas and practices worldwide — with tier pricing and cold-chain express shipping.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="hero" size="lg" asChild><Link to="/shop">Shop Products <ArrowRight /></Link></Button>
            <Button variant="gold" size="lg" asChild><Link to="/register">Get Verified</Link></Button>
          </div>
        </Reveal>
        <div className="relative mx-auto h-[380px] w-full max-w-md sm:h-[460px]">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="absolute inset-x-10 inset-y-6 overflow-hidden rounded-[2.5rem] border border-border bg-muted/20 shadow-lift">
            <img src="/products/profhilo-structura.webp" alt="Profhilo skinbooster" className="h-full w-full object-contain p-8" />
          </motion.div>
          <div className="absolute right-4 top-0 h-32 w-24 overflow-hidden rounded-3xl border border-border bg-muted/20 shadow-soft animate-floaty sm:right-0">
            <img src="/products/botox-100u.webp" alt="Botox 100U" className="h-full w-full object-contain p-2" />
          </div>
          {cards.map((c, i) => (
            <motion.div key={c.t} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.2 }} className={`glass absolute ${c.cls} flex items-center gap-3 rounded-2xl p-3 pr-5 shadow-lift animate-floaty`} style={{ animationDelay: `${i * 1.5}s` }}>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground"><c.icon className="h-5 w-5" /></span>
              <span><span className="block text-sm font-semibold text-foreground">{c.t}</span><span className="block text-xs text-muted-foreground">{c.s}</span></span>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function TrustBar() {
  const items = [
    [ShieldCheck, "Original lot numbers"], [BadgeCheck, "License-verified buyers only"], [Snowflake, "Cold-chain express shipping"], [RefreshCw, "Free replacement on delays"], [Scale, "Price-match promise"],
  ] as const;
  return (
    <section className="border-y border-border bg-card">
      <Container className="no-scrollbar flex gap-8 overflow-x-auto py-5 lg:justify-between">
        {items.map(([I, t]) => (
          <div key={t} className="flex shrink-0 items-center gap-2 text-sm font-medium text-foreground"><I className="h-5 w-5 text-primary" />{t}</div>
        ))}
      </Container>
    </section>
  );
}

function Categories() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionHeading eyebrow="Catalog" title="Shop by category" sub="Fourteen professional categories, all sourced through traceable channels." />
        <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-5 xl:grid-cols-7">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 7) * 0.04} className="w-36 shrink-0 snap-start sm:w-auto">
              <Link to="/shop/$category" params={{ category: c.slug }} className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-4 lift">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-sage text-primary"><Icon name={c.icon} className="h-5 w-5" /></span>
                <span className="text-sm font-medium leading-snug text-foreground">{c.name}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function BestSellers() {
  const items = bestSellers.map((s) => getProduct(s)!);
  return (
    <section className="bg-sage py-20 lg:py-28">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <SectionHeading eyebrow="Best sellers" title="Trusted by practices" sub="Prices shown are sample data. Tier pricing applies automatically." />
          <Button variant="outline" asChild className="mb-10 hidden sm:inline-flex"><Link to="/shop">View all</Link></Button>
        </div>
        <Carousel opts={{ align: "start" }} className="relative">
          <CarouselContent>
            {items.map((p) => (
              <CarouselItem key={p.slug} className="basis-[78%] sm:basis-1/2 lg:basis-1/4"><ProductCard p={p} /></CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 hidden lg:flex" />
          <CarouselNext className="-right-4 hidden lg:flex" />
        </Carousel>
      </Container>
    </section>
  );
}

function Brands() {
  const row = [...brands, ...brands];
  return (
    <section className="overflow-hidden py-20 lg:py-28">
      <Container><SectionHeading eyebrow="Brands" title="Featured brands" center /></Container>
      <div className="relative">
        <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
          {row.map((b, i) => (
            <Link key={i} to="/brands/$slug" params={{ slug: b.slug }} className="flex h-20 min-w-44 items-center justify-center rounded-2xl border border-border bg-card px-6 font-display text-xl text-foreground lift">
              {b.name}
            </Link>
          ))}
        </div>
      </div>
      <Container><p className="mt-6 text-center text-xs text-muted-foreground">{trademarkNotice}</p></Container>
    </section>
  );
}

function WhyUs() {
  const items = [
    [Layers3, "Wholesale tier pricing", "Unit prices drop as your order grows."],
    [Scale, "Price-match program", "Send a verified lower quote and we'll review it."],
    [ShieldCheck, "Authenticity & traceability", "Original packaging with original lot numbers."],
    [Snowflake, "Cold-chain express", "Temperature-controlled with a delivery guarantee."],
    [Headset, "Dedicated account manager", "Responsive support via info@medprovia.com."],
  ] as const;
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionHeading eyebrow="Why Medprovia" title="Clinical trust, effortless supply" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {items.map(([I, t, s], i) => (
            <Reveal key={t} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 lift">
                <I className="h-7 w-7 text-gold" />
                <h3 className="mt-4 text-lg font-medium text-foreground">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Programs() {
  const items = [
    [PiggyBank, "Savings Program", "Reduce supply costs significantly.", "savings"],
    [Gem, "Loyalty", "Store credits on every purchase.", "loyalty"],
    [Users, "Referral", "Credit for you and your referral.", "referral"],
    [Scale, "Price Match", "We aim to match verified prices.", "price-match"],
  ] as const;
  return (
    <section className="py-10">
      <Container>
        <div className="rounded-[2rem] bg-navy p-6 text-navy-foreground sm:p-12">
          <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Programs</p>
              <h2 className="mt-3 text-3xl sm:text-4xl">Rewards built for repeat buyers</h2>
            </div>
            <div className="rounded-full bg-gold-gradient px-5 py-2.5 text-sm font-semibold text-gold-foreground">5% off your first order</div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map(([I, t, s, slug]) => (
              <Link key={slug} to="/programs/$slug" params={{ slug }} className="rounded-2xl border border-navy-foreground/15 bg-navy-foreground/5 p-6 transition hover:bg-navy-foreground/10">
                <I className="h-6 w-6 text-gold" />
                <h3 className="mt-4 text-xl">{t}</h3>
                <p className="mt-1 text-sm opacity-75">{s}</p>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function HowItWorks() {
  const steps = [["Register", "Create your professional account."], ["License verification", "Usually within 24 hours."], ["Order with tier pricing", "Volume savings apply automatically."], ["Tracked delivery", "Cold-chain, worldwide, tracked."]];
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionHeading eyebrow="How it works" title="From sign-up to delivery in four steps" center />
        <ol className="grid gap-6 md:grid-cols-4">
          {steps.map(([t, s], i) => (
            <Reveal key={t} delay={i * 0.12}>
              <li className="relative rounded-2xl border border-border bg-card p-6 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary font-display text-2xl text-primary-foreground shadow-elegant">{i + 1}</span>
                <h3 className="mt-4 text-lg font-medium text-foreground">{t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}

function Learn() {
  return (
    <section className="bg-sage py-20 lg:py-28">
      <Container>
        <SectionHeading eyebrow="Learn" title="Education for practitioners" />
        <div className="grid gap-5 md:grid-cols-3">
          {posts.slice(0, 3).map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}><PostCard p={p} /></Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionHeading eyebrow="Testimonials" title="What practitioners say" sub="Sample content — replace with verified reviews." />
        <Carousel opts={{ align: "start", loop: true }}>
          <CarouselContent>
            {testimonials.map((t) => (
              <CarouselItem key={t.name} className="basis-[88%] md:basis-1/2 lg:basis-1/3">
                <figure className="h-full rounded-2xl border border-border bg-card p-6">
                  <Quote className="h-6 w-6 text-gold" />
                  <blockquote className="mt-3 font-display text-lg text-foreground">"{t.quote}"</blockquote>
                  <figcaption className="mt-4 text-sm"><span className="font-semibold text-foreground">{t.name}</span><span className="block text-muted-foreground">{t.role}</span></figcaption>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          <span className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-gold text-gold" />)}</span>
          Review platform rating — placeholder, connect your real reviews
        </div>
      </Container>
    </section>
  );
}

function Faq() {
  return (
    <section className="py-20 lg:py-28">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" sub={complianceNotice} />
        <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card px-5">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`f${i}`}>
              <AccordionTrigger className="min-h-12 text-left text-base">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}

function Cta() {
  const [email, setEmail] = useState("");
  return (
    <section className="pt-10">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-mesh border border-border p-8 text-center sm:p-14">
          <Globe2 className="mx-auto h-8 w-8 text-primary" />
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl text-foreground sm:text-5xl">Ready to restock with confidence?</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">Get verified in about a day and enjoy 5% off your first order.</p>
          <Button variant="hero" size="lg" asChild className="mt-6"><Link to="/register">Get Verified</Link></Button>
          <form
            className="mx-auto mt-8 flex max-w-md flex-col gap-2 sm:flex-row"
            onSubmit={async (e) => {
              e.preventDefault();
              if (email) {
                await sendEmailNotification({
                  type: "newsletter",
                  subject: `[Subscriber Alert] New clinic newsletter signup: ${email}`,
                  senderEmail: email,
                  data: {
                    "Subscriber Email": email,
                    "Subscription Time": new Date().toLocaleString(),
                  },
                });
                toast.success("Subscribed! Restock & tier price updates will be sent to your email.");
                setEmail("");
              }
            }}
          >
            <label htmlFor="nl" className="sr-only">Email</label>
            <Input id="nl" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your clinic email" className="h-12 rounded-full bg-card px-5" />
            <Button type="submit" size="lg">Subscribe</Button>
          </form>
        </div>
      </Container>
    </section>
  );
}
