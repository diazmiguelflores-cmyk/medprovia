import { createFileRoute, notFound } from "@tanstack/react-router";
import { InfoDetail } from "@/components/site/InfoPages";
import { programs } from "@/data/content";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/programs/$slug")({
  loader: ({ params }) => {
    const item = programs.find((s) => s.slug === params.slug);
    if (!item) throw notFound();
    return item;
  },
  head: ({ loaderData }) => (loaderData ? seo(loaderData.title, loaderData.summary) : { meta: [{ title: "Unavailable | Medprovia" }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

function Page() {
  return <InfoDetail item={Route.useLoaderData()} eyebrow="Programs" />;
}
