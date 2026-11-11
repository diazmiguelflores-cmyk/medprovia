export const contact = {
  email: "info@medprovia.com",
};

export const complianceNotice =
  "Medprovia supplies licensed healthcare professionals only. All products are subject to license verification and local regulations.";

export const trademarkNotice =
  "Third-party brand names are trademarks of their respective owners. Medprovia is an independent supplier and is not affiliated with these manufacturers.";

export type Post = { slug: string; title: string; excerpt: string; category: string; minutes: number; date: string; hue: number; body: string[] };
export const posts: Post[] = [
  { slug: "polynucleotides-under-the-eyes", title: "Polynucleotides under the eyes: what practitioners should know", excerpt: "An overview of product formats, storage considerations and sourcing for PN-based skinboosters.", category: "Skinboosters", minutes: 6, date: "2026-10-02", hue: 160, body: ["Polynucleotide (PN) products have gained attention in professional aesthetic practice. This article summarises product formats and supply considerations for clinics.", "Always consult the manufacturer's instructions for use and local regulations. Storage conditions and lot traceability should be verified on receipt.", "When sourcing, request documentation for each lot and ensure the cold chain is maintained during transit."] },
  { slug: "botulinum-toxin-brands-compared", title: "Botulinum toxin brands compared: formats & storage", excerpt: "A supply-side comparison of common neuromodulator formats, unit sizes and handling.", category: "Toxins", minutes: 8, date: "2026-09-18", hue: 235, body: ["Neuromodulators are supplied in different unit sizes and with differing storage requirements.", "This comparison focuses on packaging, storage and logistics — not on clinical outcomes.", "Refer to each product's official labelling for clinical information."] },
  { slug: "spotting-counterfeit-products", title: "Spotting counterfeit products: a checklist for clinics", excerpt: "Practical checks for packaging, lot numbers and supplier documentation.", category: "Authenticity", minutes: 5, date: "2026-08-30", hue: 82, body: ["Counterfeit injectables are a real risk in the global supply chain.", "Check packaging quality, lot numbers, expiry dates and holograms against manufacturer references.", "Work only with suppliers that provide traceable documentation and verify buyer licenses."] },
  { slug: "cold-chain-shipping-explained", title: "Cold-chain shipping explained", excerpt: "How temperature-controlled logistics protect sensitive products in transit.", category: "Logistics", minutes: 4, date: "2026-08-12", hue: 200, body: ["Temperature-sensitive products require insulated packaging and monitored transit.", "Inspect packaging on arrival and report any concerns promptly."] },
  { slug: "viscosupplement-formats", title: "Viscosupplement formats for orthopedic practices", excerpt: "Single vs. multi-injection formats from a procurement perspective.", category: "Orthopedic", minutes: 5, date: "2026-07-21", hue: 215, body: ["Viscosupplements are available in several syringe volumes and regimens.", "This guide covers ordering and storage considerations only."] },
];

export const testimonials = [
  { name: "Dr. A. Rivera", role: "Dermatologist · Sample review", quote: "Ordering is straightforward and every box arrived with lot numbers we could verify." },
  { name: "S. Okafor, NP", role: "Med spa owner · Sample review", quote: "Tier pricing makes restocking predictable, and the account manager answers quickly." },
  { name: "Dr. L. Chen, DDS", role: "Dental aesthetics · Sample review", quote: "Verification took less than a day. Shipping was cold-packed and tracked end to end." },
  { name: "Dr. M. Haddad", role: "Orthopedic practice · Sample review", quote: "Reliable supply of viscosupplements with clear documentation for our records." },
];

export const faqs = [
  { q: "Who can order from Medprovia?", a: "Only licensed healthcare professionals and registered clinics. Every account is verified before the first order ships." },
  { q: "Which licenses are accepted?", a: "MD, DO, DDS/DMD, NP, PA, RN-level injectors (where permitted locally) and DVM. Requirements may vary by country." },
  { q: "How does verification work?", a: "Register, upload your license and clinic details, and our team reviews it — usually within 24 hours." },
  { q: "Are your products authentic?", a: "Products are sourced through traceable channels and shipped in original packaging with original lot numbers." },
  { q: "How long does shipping take?", a: "Typical express delivery is 2–5 business days depending on destination. Temperature-sensitive items ship cold-packed." },
  { q: "What about returns and replacements?", a: "If a shipment is delayed beyond our guarantee window or arrives damaged, we offer a free replacement. See our Returns policy." },
  { q: "Do you offer discounts?", a: "Yes — tier pricing on volume, a 5% first-order discount, loyalty credits and a price-match program." },
];

export type InfoPage = { slug: string; title: string; summary: string; icon: string; points: string[] };
export const services: InfoPage[] = [
  { slug: "wholesale", title: "Wholesale & tier pricing", icon: "Layers3", summary: "Unit prices drop automatically as quantities grow.", points: ["Transparent tiers on every product", "Volume quotes for multi-site clinics", "Net terms available for qualified accounts (placeholder)"] },
  { slug: "price-match", title: "Price Match", icon: "Scale", summary: "Found a lower verified price? We'll review and aim to match it.", points: ["Submit a competitor quote", "Same product, size and condition", "Reviewed within one business day"] },
  { slug: "order-tracking", title: "Order tracking", icon: "MapPin", summary: "Track every shipment from dispatch to your door.", points: ["Live tracking links", "Cold-chain status notes", "Proactive delay notifications"] },
  { slug: "license-verification", title: "License verification", icon: "BadgeCheck", summary: "A fast, secure check of your professional credentials.", points: ["Upload license once", "Usually reviewed within 24 hours", "Renewal reminders"] },
  { slug: "worldwide-shipping", title: "Worldwide shipping", icon: "Globe2", summary: "Temperature-controlled express shipping to many countries.", points: ["Insulated packaging", "Customs documentation support", "Free replacement on qualifying delays"] },
  { slug: "account-manager", title: "Dedicated account manager", icon: "Headset", summary: "Direct assistance via email at info@medprovia.com.", points: ["Restock reminders", "Product sourcing requests", "Order and invoice support"] },
];

export const programs: InfoPage[] = [
  { slug: "savings", title: "Savings Program", icon: "PiggyBank", summary: "Reduce supply costs significantly with planned, recurring orders.", points: ["Lock in tier pricing", "Scheduled restocks", "Quarterly review with your account manager"] },
  { slug: "loyalty", title: "Loyalty", icon: "Gem", summary: "Earn store credits on every purchase.", points: ["Credits on every order", "Redeem at checkout", "Bonus credits on milestones"] },
  { slug: "referral", title: "Referral", icon: "Users", summary: "Credit for you and the colleague you refer.", points: ["Share your referral link", "Both accounts receive credit after first order", "No limit on referrals"] },
  { slug: "price-match", title: "Price Match", icon: "Scale", summary: "We review verified lower prices and aim to match them.", points: ["Simple submission", "Fast review", "Applies to identical products"] },
];
