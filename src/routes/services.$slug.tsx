import { createFileRoute, notFound } from "@tanstack/react-router";
import { InfoDetail } from "@/components/site/InfoPages";
import { services } from "@/data/content";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const item = services.find((s) => s.slug === params.slug);
    if (!item) throw notFound();
    return item;
  },
  head: ({ loaderData }) => (loaderData ? seo(loaderData.title, loaderData.summary) : { meta: [{ title: "Unavailable | Medprovia" }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

function Page() {
  return <InfoDetail item={Route.useLoaderData()} eyebrow="Services" />;
}
