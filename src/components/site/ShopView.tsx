import { Link } from "@tanstack/react-router";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { brands, categories, products, getCategory, formatPrice, type Product } from "@/data/catalog";
import { cn } from "@/lib/utils";
import { ProductCard } from "./ProductCard";
import { Container } from "./primitives";

const TYPES: Product["type"][number][] = ["HA", "Biostimulator", "Korean", "FDA-approved", "EU-approved"];
const MAX = 400;
const PAGE = 9;

type F = { cats: string[]; brands: string[]; types: string[]; price: [number, number]; stock: boolean };

export function ShopView({ category, brand }: { category?: string; brand?: string }) {
  const [f, setF] = useState<F>({ cats: category ? [category] : [], brands: brand ? [brand] : [], types: [], price: [0, MAX], stock: false });
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setF((x) => ({ ...x, cats: category ? [category] : [], brands: brand ? [brand] : [] })); }, [category, brand]);
  useEffect(() => { setLoading(true); setPage(1); const t = setTimeout(() => setLoading(false), 350); return () => clearTimeout(t); }, [f, sort]);

  const list = useMemo(() => {
    let r = products.filter((p) =>
      (!f.cats.length || f.cats.includes(p.category)) &&
      (!f.brands.length || f.brands.includes(p.brand)) &&
      (!f.types.length || f.types.some((t) => p.type.includes(t as never))) &&
      p.price >= f.price[0] && p.price <= f.price[1] && (!f.stock || p.inStock));
    if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "name") r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    return r;
  }, [f, sort]);
  const pages = Math.max(1, Math.ceil(list.length / PAGE));
  const shown = list.slice((page - 1) * PAGE, page * PAGE);
  const cat = category ? getCategory(category) : undefined;

  const toggle = (k: "cats" | "brands" | "types", v: string) =>
    setF((x) => ({ ...x, [k]: x[k].includes(v) ? x[k].filter((y) => y !== v) : [...x[k], v] }));

  const filters = (
    <div className="space-y-7">
      <FilterGroup title="Category">
        {categories.map((c) => <Check key={c.slug} label={c.name} checked={f.cats.includes(c.slug)} onChange={() => toggle("cats", c.slug)} />)}
      </FilterGroup>
      <FilterGroup title="Brand">
        {brands.map((b) => <Check key={b.slug} label={b.name} checked={f.brands.includes(b.slug)} onChange={() => toggle("brands", b.slug)} />)}
      </FilterGroup>
      <FilterGroup title="Product type">
        {TYPES.map((t) => <Check key={t} label={t} checked={f.types.includes(t)} onChange={() => toggle("types", t)} />)}
      </FilterGroup>
      <FilterGroup title="Price range">
        <Slider min={0} max={MAX} step={10} value={f.price} onValueChange={(v) => setF((x) => ({ ...x, price: [v[0] ?? 0, v[1] ?? MAX] }))} aria-label="Price range" />
        <p className="mt-3 text-sm text-muted-foreground">{formatPrice(f.price[0])} – {formatPrice(f.price[1])}</p>
      </FilterGroup>
      <label className="flex min-h-11 items-center justify-between text-sm font-medium text-foreground">In stock only <Switch checked={f.stock} onCheckedChange={(v) => setF((x) => ({ ...x, stock: v }))} /></label>
      <Button variant="outline" className="w-full" onClick={() => setF({ cats: [], brands: [], types: [], price: [0, MAX], stock: false })}>Reset filters</Button>
    </div>
  );

  return (
    <Container className="pb-10 pt-6 lg:pt-32">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          {cat ? (
            <>
              <BreadcrumbItem><BreadcrumbLink asChild><Link to="/shop">Shop</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>{cat.name}</BreadcrumbPage></BreadcrumbItem>
            </>
          ) : <BreadcrumbItem><BreadcrumbPage>Shop</BreadcrumbPage></BreadcrumbItem>}
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="mt-4 text-4xl font-medium text-foreground sm:text-5xl">{cat?.name ?? "All products"}</h1>
      <p className="mt-2 text-muted-foreground">Prices are sample data. Ordering requires license verification.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block" aria-label="Filters">{filters}</aside>
        <div>
          <div className="mb-5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild><Button variant="outline" className="lg:hidden"><SlidersHorizontal />Filters</Button></SheetTrigger>
                <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl">
                  <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                  <div className="p-4">{filters}</div>
                </SheetContent>
              </Sheet>
              <span className="hidden text-sm text-muted-foreground sm:inline">{list.length} products</span>
            </div>
            <div className="flex items-center gap-2">
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="h-11 w-40 rounded-full" aria-label="Sort"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: low to high</SelectItem>
                  <SelectItem value="price-desc">Price: high to low</SelectItem>
                  <SelectItem value="name">Name A–Z</SelectItem>
                </SelectContent>
              </Select>
              <div className="hidden rounded-full border border-border p-1 sm:flex" role="group" aria-label="View">
                {(["grid", "list"] as const).map((v) => (
                  <button key={v} aria-pressed={view === v} aria-label={`${v} view`} onClick={() => setView(v)} className={cn("grid h-9 w-9 place-items-center rounded-full", view === v && "bg-primary text-primary-foreground")}>
                    {v === "grid" ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className={cn("grid gap-5", view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-96 rounded-2xl" />)
              : shown.map((p) => <ProductCard key={p.slug} p={p} layout={view} />)}
          </div>
          {!loading && !list.length && <p className="py-16 text-center text-muted-foreground">No products match these filters.</p>}
          {pages > 1 && (
            <nav className="mt-10 flex justify-center gap-2" aria-label="Pagination">
              {Array.from({ length: pages }).map((_, i) => (
                <Button key={i} variant={page === i + 1 ? "default" : "outline"} size="icon" aria-current={page === i + 1 ? "page" : undefined} onClick={() => { setPage(i + 1); window.scrollTo({ top: 0 }); }}>{i + 1}</Button>
              ))}
            </nav>
          )}
        </div>
      </div>
    </Container>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</legend>
      <div className="max-h-60 space-y-1 overflow-y-auto pr-1">{children}</div>
    </fieldset>
  );
}
function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm text-foreground">
      <Checkbox checked={checked} onCheckedChange={onChange} /> {label}
    </label>
  );
}
