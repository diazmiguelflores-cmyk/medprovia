import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, ShieldAlert, Calendar, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/site/PostCard";
import { Container, PageHero, VialArt } from "@/components/site/primitives";
import { posts } from "@/data/content";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const p = posts.find((x) => x.slug === params.slug);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData: p }) =>
    p
      ? seo(p.title, p.excerpt, "article")
      : { meta: [{ title: "Article unavailable | Medprovia" }, { name: "robots", content: "noindex" }] },
  component: Article,
});

function Article() {
  const p = Route.useLoaderData();
  const related = posts.filter((x) => x.slug !== p.slug).slice(0, 3);

  const copyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Article link copied to clipboard");
    }
  };

  return (
    <>
      <PageHero
        eyebrow={`${p.category} · Supply Intelligence`}
        title={p.title}
        sub={p.excerpt}
      />

      <Container className="max-w-3xl py-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/blog">Learn</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{p.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Published {p.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {p.minutes} min read
            </span>
            <span className="font-semibold text-primary">Medprovia Clinical Regulatory Team</span>
          </div>
          <Button variant="ghost" size="sm" onClick={copyLink} className="h-8 gap-1.5 text-xs">
            <Share2 className="h-3.5 w-3.5" /> Share
          </Button>
        </div>

        <div className="my-8 overflow-hidden rounded-3xl border border-border">
          <VialArt hue={p.hue} className="h-72 w-full" label={p.title} />
        </div>

        <article className="space-y-6 text-base leading-relaxed text-foreground sm:text-lg">
          {p.body.map((t, i) => (
            <p key={i} className="leading-relaxed">
              {t}
            </p>
          ))}

          <div className="mt-10 rounded-2xl border border-gold/40 bg-gold/10 p-5 text-sm text-foreground">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="font-semibold text-foreground">Medical Information & Regulatory Notice</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  This publication is prepared exclusively for licensed healthcare practitioners. It discusses distribution logistics, packaging specifications, and procurement considerations. It does not constitute diagnosis, clinical treatment protocols, or medical guidance. Always follow official manufacturer labeling and local jurisdiction requirements.
                </p>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          <Button variant="outline" asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to all articles
            </Link>
          </Button>
          <Button variant="gold" asChild>
            <Link to="/register">Get Verified to Order</Link>
          </Button>
        </div>

        {related.length > 0 && (
          <section className="mt-16 border-t border-border pt-12">
            <h3 className="font-display text-2xl text-foreground">Related articles</h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {related.map((r) => (
                <PostCard key={r.slug} p={r} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
