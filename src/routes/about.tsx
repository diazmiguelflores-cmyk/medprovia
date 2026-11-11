import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Clock, FileCheck, Globe2, ShieldCheck, Snowflake, Sparkles, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, PageHero, Reveal, SectionHeading } from "@/components/site/primitives";
import { complianceNotice } from "@/data/content";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () =>
    seo(
      "About Medprovia",
      "Medprovia's mission: authentic, transparent, cold-chain medical and aesthetic supply for licensed healthcare professionals worldwide.",
    ),
  component: About,
});

const values = [
  {
    icon: ShieldCheck,
    title: "Authenticity & Origin",
    desc: "Every product is sourced exclusively through traceable manufacturer distribution with original lot numbers and seals intact.",
  },
  {
    icon: FileCheck,
    title: "Radical Transparency",
    desc: "Transparent tier pricing, no hidden markups, and comprehensive batch lot documentation delivered with every single shipment.",
  },
  {
    icon: Snowflake,
    title: "Cold-Chain Integrity",
    desc: "Validated temperature-controlled packaging and live transit monitoring for toxins, viscosupplements, and sensitive biologics.",
  },
  {
    icon: UserCheck,
    title: "Practitioner-First Service",
    desc: "Dedicated personal account managers accessible via email at info@medprovia.com to support clinic restocking schedules.",
  },
];

const timeline = [
  {
    year: "2021",
    title: "Founded by Clinical Supply Specialists",
    desc: "Established with the vision of solving counterfeit risks and unstable distribution pipelines for independent medical aesthetic practices.",
  },
  {
    year: "2022",
    title: "Validated Cold-Chain Logistics Hubs",
    desc: "Opened specialized climate-controlled fulfillment centers in Europe and North America adhering strictly to Good Distribution Practice (GDP).",
  },
  {
    year: "2023",
    title: "Digital License Verification Engine",
    desc: "Engineered proprietary practitioner credential validation, streamlining verification turnaround to under 24 hours.",
  },
  {
    year: "2024",
    title: "Global Clinic Network Expansion",
    desc: "Expanded delivery routes to serve dermatologists, plastic surgeons, dental injectors, and orthopedic clinics across 40+ countries.",
  },
  {
    year: "2026",
    title: "Enterprise Tiering & Batch Traceability",
    desc: "Launched automated volume tier pricing, direct manufacturer certificate matching, and 100% on-time delivery guarantees.",
  },
];

const team = [
  {
    name: "Dr. Elena Vance, MD",
    role: "Chief Medical Officer & Compliance",
    credential: "Board-Certified Dermatologist",
    bio: "Over 18 years in aesthetic medicine and regulatory clinical affairs. Oversees supplier vetting, licensure protocols, and clinical standards.",
  },
  {
    name: "Marcus Sterling",
    role: "Head of Global Cold-Chain Logistics",
    credential: "Pharmaceutical Logistics Expert",
    bio: "Former lead of temperature-controlled biologics distribution with 15+ years managing cross-border GDP pharmaceutical transit.",
  },
  {
    name: "Sarah Lin, PharmD",
    role: "Director of Quality & Traceability",
    credential: "Clinical Pharmacist",
    bio: "Specializes in counterfeit detection, lot serialization, and manufacturer compliance to ensure 100% genuine inventory.",
  },
  {
    name: "Julian Croft",
    role: "VP of Practitioner Partnerships",
    credential: "B2B Medical Operations",
    bio: "Leads our dedicated account management team, helping med spas and multi-site clinics optimize inventory costs through tier pricing.",
  },
];

function About() {
  return (
    <>
      <PageHero
        eyebrow="Our Mission"
        title="Clinical trust, uncompromising supply"
        sub="Medprovia was founded to provide licensed medical professionals with an authentic, transparent, and dependable supply channel for high-demand injectables and clinic essentials."
      >
        <div className="mt-8 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-xs font-semibold text-foreground">
            <BadgeCheck className="h-4 w-4 text-primary" /> Verified Practitioners Only
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-xs font-semibold text-foreground">
            <Globe2 className="h-4 w-4 text-primary" /> 40+ Countries Served
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-xs font-semibold text-foreground">
            <Clock className="h-4 w-4 text-primary" /> 24h Verification Standard
          </div>
        </div>
      </PageHero>

      {/* Values */}
      <section className="py-20 lg:py-28">
        <Container>
          <SectionHeading
            eyebrow="Core Values"
            title="The principles behind every box we ship"
            sub="In an industry where authenticity is paramount, we hold ourselves to rigorous pharmaceutical distribution standards."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="h-full rounded-3xl border border-border bg-card p-7 lift">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sage text-primary">
                    <v.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-xl text-foreground">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section className="bg-sage py-20 lg:py-28">
        <Container>
          <SectionHeading
            eyebrow="Our Journey"
            title="Milestones in building a trusted supply chain"
            sub="From our first cold-chain shipment to supplying premier medical clinics across continents."
          />
          <div className="relative mt-12 space-y-8 before:absolute before:inset-0 before:left-4 before:h-full before:w-0.5 before:bg-border md:before:left-1/2 md:before:-translate-x-1/2">
            {timeline.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <Reveal key={item.year} delay={idx * 0.1}>
                  <div className={`relative flex flex-col md:flex-row ${isEven ? "md:flex-row-reverse" : ""} items-start gap-8`}>
                    <div className="md:w-1/2" />
                    <div className="absolute left-4 top-1.5 z-10 -ml-2.5 grid h-5 w-5 place-items-center rounded-full bg-primary ring-4 ring-background md:left-1/2" />
                    <div className="ml-10 rounded-3xl border border-border bg-card p-6 shadow-soft md:ml-0 md:w-1/2">
                      <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                        {item.year}
                      </span>
                      <h4 className="mt-2 font-display text-xl text-foreground">{item.title}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Leadership Team */}
      <section className="py-20 lg:py-28">
        <Container>
          <SectionHeading
            eyebrow="Leadership"
            title="Experienced healthcare & supply executives"
            sub="Our leadership combines decades of clinical practice, global pharmaceutical logistics, and compliance expertise."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.08}>
                <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 lift">
                  <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-mesh text-primary font-display text-2xl font-bold">
                    {member.name.split(" ")[1]?.[0] ?? member.name[0]}
                  </div>
                  <h3 className="font-display text-xl text-foreground">{member.name}</h3>
                  <p className="text-xs font-semibold text-primary">{member.role}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground uppercase tracking-wider">{member.credential}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Compliance Notice Banner */}
      <section className="pb-20">
        <Container>
          <div className="rounded-3xl border border-gold/40 bg-mesh p-8 text-center sm:p-12">
            <Sparkles className="mx-auto h-8 w-8 text-gold" />
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl text-foreground sm:text-4xl">
              Join thousands of verified clinics worldwide
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {complianceNotice}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button size="lg" variant="hero" asChild>
                <Link to="/register">
                  Get Verified Now <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Contact Our Advisory Team</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
