import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/site/PostCard";
import { Container, PageHero, VialArt } from "@/components/site/primitives";
import { posts } from "@/data/content";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog/")({
  head: () => seo("Learn & Practitioner Education", "Supply-side education, cold-chain handling, and product authenticity guides for medical aesthetic practices."),
  component: Blog,
});

function Blog() {
  const cats = ["All", ...new Set(posts.map((p) => p.category))];
  const [c, setC] = useState("All");
  const list = posts.filter((p) => c === "All" || p.category === c);
  const featured = posts[0]!;

  return (
    <>
      <PageHero
        eyebrow="Practitioner Education"
        title="Supply-chain intelligence for modern clinics"
        sub="Technical analysis, cold-chain best practices, and authenticity verification checklists for licensed injectors and practices."
      />

      <Container className="py-12">
        {/* Category Filter Chips */}
        <div className="no-scrollbar mb-10 flex gap-2 overflow-x-auto pb-2">
          {cats.map((x) => (
            <button
              key={x}
              onClick={() => setC(x)}
              aria-pressed={c === x}
              className={cn(
                "min-h-10 shrink-0 rounded-full border px-5 text-xs font-semibold uppercase tracking-wider transition-all",
                c === x
                  ? "border-primary bg-primary text-primary-foreground shadow-soft"
                  : "border-border bg-card text-foreground hover:bg-secondary",
              )}
            >
              {x}
            </button>
          ))}
        </div>

        {/* Featured Post Banner (when All is selected) */}
        {c === "All" && (
          <div className="mb-12 overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all hover:border-primary/40">
            <div className="grid gap-6 lg:grid-cols-2">
              <VialArt hue={featured.hue} className="h-64 sm:h-80 w-full" />
              <div className="flex flex-col justify-center p-6 sm:p-10">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">{featured.category}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {featured.minutes} min read
                  </span>
                  <span>{featured.date}</span>
                </div>
                <h2 className="mt-4 font-display text-2xl font-medium text-foreground sm:text-3xl lg:text-4xl">
                  <Link to="/blog/$slug" params={{ slug: featured.slug }} className="hover:text-primary transition">
                    {featured.title}
                  </Link>
                </h2>
                <p className="mt-3 text-muted-foreground line-clamp-3 leading-relaxed">{featured.excerpt}</p>
                <div className="mt-6">
                  <Button asChild size="lg" variant="hero">
                    <Link to="/blog/$slug" params={{ slug: featured.slug }}>
                      Read article <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Card Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <PostCard key={p.slug} p={p} />
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-16 rounded-2xl bg-sage p-5 text-center text-xs text-muted-foreground">
          <BookOpen className="mx-auto mb-2 h-5 w-5 text-primary" />
          <p className="font-semibold text-foreground">Practitioner Supply Information Only</p>
          <p className="mt-1 max-w-2xl mx-auto">
            Content published on Medprovia is intended solely for licensed medical professionals. It covers logistics, packaging, formulation formats, and procurement considerations. Not intended as medical treatment instructions.
          </p>
        </div>
      </Container>
    </>
  );
}
