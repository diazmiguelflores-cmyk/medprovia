import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InfoPage } from "@/data/content";
import { Container, Icon, PageHero, Reveal } from "./primitives";

export function InfoGrid({ items, kind }: { items: InfoPage[]; kind: "services" | "programs" }) {
  return (
    <Container className="grid gap-5 py-12 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((s, i) => (
        <Reveal key={s.slug} delay={i * 0.05}>
          <Link to={kind === "services" ? "/services/$slug" : "/programs/$slug"} params={{ slug: s.slug }} className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 lift">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-sage text-primary"><Icon name={s.icon} className="h-6 w-6" /></span>
            <h2 className="mt-4 text-2xl text-foreground">{s.title}</h2>
            <p className="mt-2 text-muted-foreground">{s.summary}</p>
            <span className="mt-auto pt-4 text-sm font-medium text-primary">Learn more →</span>
          </Link>
        </Reveal>
      ))}
    </Container>
  );
}

export function InfoDetail({ item, eyebrow }: { item: InfoPage; eyebrow: string }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={item.title} sub={item.summary} />
      <Container className="grid gap-10 py-12 lg:grid-cols-[1.4fr_1fr]">
        <ul className="space-y-4">
          {item.points.map((p) => (
            <li key={p} className="flex gap-3 rounded-2xl border border-border bg-card p-5 text-foreground">
              <Check className="h-5 w-5 shrink-0 text-primary" /> {p}
            </li>
          ))}
        </ul>
        <div className="rounded-2xl bg-navy p-8 text-navy-foreground">
          <h2 className="text-2xl">Get started</h2>
          <p className="mt-2 opacity-75">Verify your license to access pricing and programs.</p>
          <div className="mt-6 flex flex-col gap-2">
            <Button variant="gold" asChild><Link to="/register">Get Verified</Link></Button>
            <Button variant="glass" asChild><Link to="/contact">Talk to us</Link></Button>
          </div>
        </div>
      </Container>
    </>
  );
}
