import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ShieldAlert, FileText, CheckCircle2 } from "lucide-react";
import { Container, PageHero } from "@/components/site/primitives";
import { complianceNotice, trademarkNotice } from "@/data/content";
import { seo } from "@/lib/seo";

type LegalDoc = {
  title: string;
  updated: string;
  sections: { heading: string; content: string[] }[];
};

const documents: Record<string, LegalDoc> = {
  terms: {
    title: "Terms of Service",
    updated: "Updated October 2026",
    sections: [
      {
        heading: "1. B2B Practitioner Eligibility & License Verification",
        content: [
          "Medprovia operates strictly as a Business-to-Business (B2B) supply platform. We do not sell to individual consumers, patients, or unlicensed entities under any circumstance.",
          "To purchase prescription or medical device products (including dermal fillers, botulinum neurotoxins, biostimulators, and viscosupplements), the account holder must possess and maintain an active, valid medical license (MD, DO, DDS/DMD, NP, PA, or registered aesthetic injector where permitted by local law).",
          "We reserve the right to audit, re-verify, or suspend accounts at any time if license validity, clinic registration, or authorization cannot be confirmed.",
        ],
      },
      {
        heading: "2. Product Authenticity & Original Lot Serialization",
        content: [
          "All products supplied through Medprovia are sourced through authorized, traceable channels and delivered in original manufacturer packaging with unaltered batch lot numbers and holographic seals.",
          "Medprovia is an independent supplier and does not manufacture pharmaceutical or medical products. Brand trademarks belong to their respective owners.",
        ],
      },
      {
        heading: "3. Orders, Pricing & Volume Tiers",
        content: [
          "All orders submitted through the platform are offers to purchase subject to license re-verification and inventory confirmation by your account manager.",
          "Tier volume pricing is calculated dynamically based on package quantities. Quotations provided by account managers are valid for 14 calendar days unless otherwise stated in writing.",
        ],
      },
      {
        heading: "4. Professional Storage & Clinical Use Disclaimer",
        content: [
          "The purchaser assumes full responsibility for inspecting all shipments immediately upon delivery and adhering to proper pharmaceutical storage temperatures (such as 2°C–8°C cold chain for neurotoxins).",
          "Medprovia does not provide clinical guidance, patient treatment advice, or dosage instructions. Purchasers must strictly follow the official manufacturer Instructions For Use (IFU) and applicable local laws.",
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    updated: "Updated October 2026",
    sections: [
      {
        heading: "1. Information We Collect from Healthcare Providers",
        content: [
          "To establish a verified practitioner account, we collect practitioner full names, professional medical license numbers, issuing state or national boards, clinic business names, physical clinic addresses, and professional contact details.",
          "We never request or store patient medical records, protected health information (PHI), or patient identification data. Our platform is strictly designed for clinic inventory management.",
        ],
      },
      {
        heading: "2. Use of Licensure & Order Information",
        content: [
          "Verification data is used solely to authenticate eligibility with relevant regulatory databases, prevent illicit diversion of pharmaceuticals, and facilitate legitimate order fulfillment.",
          "We do not sell, rent, or monetize your professional data. Information is shared only with verified logistics and courier partners for physical delivery and customs clearance.",
        ],
      },
      {
        heading: "3. Data Security & Encryption Standards",
        content: [
          "Uploaded license certificates and clinic documentation are encrypted in transit using 256-bit TLS protocols and stored within SOC-2 compliant, access-restricted repositories.",
          "Access to practitioner verification records is strictly limited to authorized compliance and legal verification personnel.",
        ],
      },
    ],
  },
  shipping: {
    title: "Shipping & Cold-Chain Policy",
    updated: "Updated October 2026",
    sections: [
      {
        heading: "1. Validated Cold-Chain Transit",
        content: [
          "Temperature-sensitive pharmaceuticals (including Botulinum Toxins, Polynucleotides, and select Biologics) are packed in certified multi-barrier vacuum-insulated shippers with pharmaceutical-grade cooling elements.",
          "Shipments maintain validated temperatures (2°C–8°C) for up to 96 hours, significantly exceeding typical express transit windows.",
        ],
      },
      {
        heading: "2. Dispatch Schedules & Delivery Guarantees",
        content: [
          "Orders verified before 14:00 EST on business days are dispatched same-day. Cold-chain items are dispatched Monday through Thursday to prevent weekend courier depot storage.",
          "Standard express transit takes 2–5 business days depending on clinic location. Real-time temperature monitoring tags and end-to-end tracking numbers are provided upon dispatch.",
        ],
      },
      {
        heading: "3. Customs & International Regulatory Documentation",
        content: [
          "International shipments include full commercial invoices, certificate of origin copies, and lot traceability records to ensure compliant clearance through customs.",
          "In the unlikely event of an unforeseen courier delay beyond our guaranteed delivery window, our Free Replacement Guarantee covers immediate re-dispatch at zero cost to your clinic.",
        ],
      },
    ],
  },
  returns: {
    title: "Returns & Replacement Policy",
    updated: "Updated October 2026",
    sections: [
      {
        heading: "1. Temperature-Controlled Replacement Guarantee",
        content: [
          "If an order of temperature-sensitive items experiences an unresolvable transit delay beyond our safe packaging tolerance window, or if a temperature indicator arrives triggered, Medprovia will issue a free expedited replacement immediately.",
          "Your account manager coordinates the replacement batch before return transit is resolved, ensuring minimal disruption to clinic treatment schedules.",
        ],
      },
      {
        heading: "2. Damaged or Discrepant Deliveries",
        content: [
          "Practices must inspect outer packaging and manufacturer seals upon receipt. Any shipping damage, seal tampering, or discrepancy must be reported to your account manager within 48 hours of delivery with photographic documentation.",
          "Approved damaged goods will be credited to your account or replaced via next-flight express shipping.",
        ],
      },
      {
        heading: "3. Safety & Biologic Return Restrictions",
        content: [
          "Due to strict healthcare distribution safety laws and cold-chain integrity regulations, we cannot accept elective returns or exchanges on opened injectable products once custody has transferred to the clinic.",
          "All approved replacements and credits are processed through our compliance department within 1 business day of case submission.",
        ],
      },
    ],
  },
};

export const Route = createFileRoute("/legal/$page")({
  loader: ({ params }) => {
    const doc = documents[params.page];
    if (!doc) throw notFound();
    return { doc, slug: params.page };
  },
  head: ({ loaderData }) =>
    loaderData
      ? seo(loaderData.doc.title, `Medprovia ${loaderData.doc.title} for verified healthcare providers.`)
      : { meta: [{ title: "Policy Unavailable | Medprovia" }, { name: "robots", content: "noindex" }] },
  component: Legal,
});

function Legal() {
  const { doc, slug } = Route.useLoaderData();
  const allPages = [
    { slug: "terms", name: "Terms of Service" },
    { slug: "privacy", name: "Privacy Policy" },
    { slug: "shipping", name: "Shipping & Cold-Chain" },
    { slug: "returns", name: "Returns & Replacement" },
  ];

  return (
    <>
      <PageHero eyebrow="Legal & Regulatory" title={doc.title} sub={doc.updated} />

      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
          {/* Navigation Sidebar */}
          <aside aria-label="Legal document navigation" className="space-y-2">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Policies</p>
            {allPages.map((p) => (
              <Link
                key={p.slug}
                to="/legal/$page"
                params={{ page: p.slug }}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  slug === p.slug ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>{p.name}</span>
              </Link>
            ))}
            <div className="mt-8 rounded-2xl border border-gold/40 bg-gold/10 p-4 text-xs text-foreground">
              <ShieldAlert className="mb-2 h-5 w-5 text-gold" />
              <p className="font-semibold">Compliance Notice</p>
              <p className="mt-1 text-muted-foreground leading-relaxed">{complianceNotice}</p>
            </div>
          </aside>

          {/* Document Content */}
          <main className="space-y-8 rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-soft">
            <div className="border-b border-border pb-4">
              <h2 className="font-display text-3xl text-foreground">{doc.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{doc.updated} · Official Regulatory Document</p>
            </div>

            <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
              {doc.sections.map((sec) => (
                <section key={sec.heading} className="space-y-3">
                  <h3 className="font-display text-xl text-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>{sec.heading}</span>
                  </h3>
                  {sec.content.map((p, idx) => (
                    <p key={idx} className="pl-6">{p}</p>
                  ))}
                </section>
              ))}
            </div>

            <div className="border-t border-border pt-6 text-xs text-muted-foreground space-y-2">
              <p>{trademarkNotice}</p>
              <p>For legal inquiries, contact compliance@medprovia.com.</p>
            </div>
          </main>
        </div>
      </Container>
    </>
  );
}
