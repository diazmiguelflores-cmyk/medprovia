import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, CheckCircle2, ChevronRight, MapPin, Package, Snowflake, ThermometerSnowflake, Truck, User, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/site/ProductCard";
import { Container } from "@/components/site/primitives";
import { getProduct } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/account")({
  head: () => seo("Practitioner Account", "Manage orders, lot tracking, saved wishlists, and clinic delivery addresses."),
  component: Account,
});

const orders = [
  {
    id: "MP-10482",
    date: "Oct 28, 2026",
    total: "$1,240",
    status: "In transit",
    step: 2,
    carrier: "DHL Express Medical Cold-Chain",
    trackingNo: "9482-0192-3841",
    tempStatus: "Optimal (3.8°C)",
    items: ["2 × Juvéderm Voluma XC", "1 × Botox 100U", "1 × Profhilo H+L"],
  },
  {
    id: "MP-10377",
    date: "Sep 14, 2026",
    total: "$865",
    status: "Delivered",
    step: 3,
    carrier: "FedEx Temperature Assured",
    trackingNo: "7721-0043-9182",
    tempStatus: "Validated at Delivery (4.1°C)",
    items: ["2 × Sculptra Aesthetic", "1 × TSK STERiGLIDE Cannulas"],
  },
];

const trackSteps = [
  { label: "Order Confirmed", sub: "License verified" },
  { label: "Packed & Certified", sub: "Cold-chain validated" },
  { label: "In Express Transit", sub: "Temperature monitored" },
  { label: "Delivered to Clinic", sub: "Signed receipt" },
];

function Account() {
  const wishlist = useStore((s) => s.wishlist);
  const verified = useStore((s) => s.verified);
  const setVerified = useStore((s) => s.setVerified);
  const [selectedOrder, setSelectedOrder] = useState(orders[0]!);

  const [addresses, setAddresses] = useState([
    {
      id: "1",
      name: "Main Practice & Treatment Rooms",
      street: "Suite 400, 100 Medical Center Parkway",
      city: "New York, NY 10001",
      country: "United States",
      isPrimary: true,
    },
    {
      id: "2",
      name: "Aesthetic Surgery Suite",
      street: "Building B, 450 Lexington Ave",
      city: "New York, NY 10017",
      country: "United States",
      isPrimary: false,
    },
  ]);

  return (
    <Container className="py-8 lg:pt-36">
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft sm:flex-row sm:items-center sm:p-8">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
            <User className="h-8 w-8" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Practitioner Portal</p>
            <h1 className="font-display text-2xl font-medium text-foreground sm:text-3xl">Dr. Alexandra Rivera, MD</h1>
            <div className="mt-1 flex items-center gap-2 text-xs">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-semibold ${
                  verified ? "bg-primary/10 text-primary" : "bg-gold/10 text-gold"
                }`}
              >
                <BadgeCheck className="h-3.5 w-3.5" />
                {verified ? "License Active (NY-MD-98432)" : "License Pending Verification"}
              </span>
              <span className="text-muted-foreground">· Tier 3 Wholesale Pricing</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {verified ? (
            <Button variant="outline" size="sm" onClick={() => setVerified(false)}>
              Demo: Set Unverified
            </Button>
          ) : (
            <>
              <Button variant="gold" size="sm" asChild>
                <Link to="/register">Complete Verification</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => setVerified(true)}>
                Demo: Set Verified
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="orders" className="mt-8">
        <TabsList className="no-scrollbar w-full justify-start overflow-x-auto rounded-full bg-muted/60 p-1">
          <TabsTrigger value="orders">Order History</TabsTrigger>
          <TabsTrigger value="tracking">Live Shipment Tracking</TabsTrigger>
          <TabsTrigger value="wishlist">Saved Wishlist ({wishlist.length})</TabsTrigger>
          <TabsTrigger value="addresses">Clinic Addresses</TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders" className="mt-6 space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="flex flex-col justify-between gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft transition-all hover:border-primary/40 sm:flex-row sm:items-center"
            >
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sage text-primary">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-display text-lg font-semibold text-foreground">{o.id}</p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        o.status === "Delivered" ? "bg-primary/10 text-primary" : "bg-gold/10 text-gold"
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Placed on {o.date} · {o.carrier}
                  </p>
                  <ul className="mt-2 text-xs text-foreground list-disc list-inside space-y-0.5">
                    {o.items.map((it, idx) => (
                      <li key={idx}>{it}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-border pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                <div className="sm:text-right">
                  <p className="font-display text-xl font-bold text-foreground">{o.total}</p>
                  <p className="text-[11px] text-muted-foreground">Invoice paid via Card</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedOrder(o);
                    const el = document.querySelector('[data-value="tracking"]') as HTMLButtonElement | null;
                    el?.click();
                  }}
                >
                  Track shipment <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Tracking Tab */}
        <TabsContent value="tracking" className="mt-6">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft space-y-6">
            <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Shipment Inspection</p>
                <h3 className="font-display text-2xl text-foreground flex items-center gap-2">
                  <Truck className="h-6 w-6 text-primary" /> {selectedOrder.id}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Carrier: <strong>{selectedOrder.carrier}</strong> · Tracking #:{" "}
                  <span className="font-mono">{selectedOrder.trackingNo}</span>
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-sage p-3.5 text-xs text-foreground">
                <ThermometerSnowflake className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="font-semibold">Cold-Chain Monitor</p>
                  <p className="text-primary font-medium">{selectedOrder.tempStatus}</p>
                </div>
              </div>
            </div>

            {/* Stepper */}
            <ol className="grid gap-4 sm:grid-cols-4">
              {trackSteps.map((st, i) => (
                <li key={st.label} className="relative flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2 w-full">
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${
                        i <= selectedOrder.step
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i <= selectedOrder.step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                    </span>
                    {i < trackSteps.length - 1 && (
                      <div
                        className={`hidden sm:block h-1 flex-1 rounded-full ${
                          i < selectedOrder.step ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        i <= selectedOrder.step ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {st.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{st.sub}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="rounded-2xl border border-dashed border-border p-4 text-xs text-muted-foreground flex items-center gap-3">
              <Snowflake className="h-5 w-5 text-primary shrink-0" />
              <span>
                Temperature records are synchronized with our centralized GDP monitoring hub. Batch certificate and lot traceability PDF are attached to your invoice.
              </span>
            </div>
          </div>
        </TabsContent>

        {/* Wishlist Tab */}
        <TabsContent value="wishlist" className="mt-6">
          {wishlist.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {wishlist
                .map((s) => getProduct(s))
                .filter(Boolean)
                .map((p) => (
                  <ProductCard key={p!.slug} p={p!} />
                ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-soft">
              <p className="font-display text-xl text-foreground">Your saved wishlist is empty</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Tap the heart icon on any product card in the catalog to pin items for quick clinic restocks.
              </p>
              <Button asChild className="mt-6">
                <Link to="/shop">Browse Catalog</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Addresses Tab */}
        <TabsContent value="addresses" className="mt-6 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-display text-xl text-foreground">Registered Clinic Delivery Locations</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const name = prompt("Enter location name (e.g. Branch Clinic):");
                if (name) {
                  setAddresses((prev) => [
                    ...prev,
                    {
                      id: String(Date.now()),
                      name,
                      street: "789 Medical Ave",
                      city: "New York, NY 10022",
                      country: "United States",
                      isPrimary: false,
                    },
                  ]);
                  toast.success("Clinic address added");
                }
              }}
            >
              <Plus className="mr-1 h-3.5 w-3.5" /> Add New Clinic Address
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {addresses.map((addr) => (
              <div key={addr.id} className="relative rounded-3xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold text-foreground">{addr.name}</h4>
                  </div>
                  {addr.isPrimary && (
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                      Primary
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{addr.street}</p>
                <p className="text-sm text-muted-foreground">{addr.city}</p>
                <p className="text-sm text-muted-foreground">{addr.country}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
