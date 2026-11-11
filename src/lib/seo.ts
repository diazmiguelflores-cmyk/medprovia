export const seo = (title: string, description: string, type = "website") => ({
  meta: [
    { title: `${title} | Medprovia` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} | Medprovia` },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});
