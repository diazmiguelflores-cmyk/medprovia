import { createFileRoute, notFound } from "@tanstack/react-router";
import { ShopView } from "@/components/site/ShopView";
import { getCategory } from "@/data/catalog";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/shop/$category")({
  loader: ({ params }) => {
    const c = getCategory(params.category);
    if (!c) throw notFound();
    return c;
  },
  head: ({ loaderData }) =>
    loaderData ? seo(loaderData.name, `Shop ${loaderData.name.toLowerCase()} for licensed professionals — authentic, lot-traceable products.`) : { meta: [{ title: "Category not found | Medprovia" }, { name: "robots", content: "noindex" }] },
  component: Page,
});

function Page() {
  const { category } = Route.useParams();
  return <ShopView category={category} />;
}
