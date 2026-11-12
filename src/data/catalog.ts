// Typed mock catalog — structured for future Supabase & Stripe synchronization.
// All prices are SAMPLE DATA.

import { CURRENCY_RATES, type Currency, useStore } from "@/lib/store";

export type Category = { slug: string; name: string; icon: string; blurb: string };
export type Brand = { slug: string; name: string; origin: string; categories: string[] };
export type Approval = "FDA approved" | "EU approved" | "Korean";
export type Product = {
  slug: string;
  name: string;
  brand: string; // brand slug
  category: string; // category slug
  type: ("HA" | "Biostimulator" | "Korean" | "FDA-approved" | "EU-approved")[];
  badges: Approval[];
  price: number;
  tiers: { min: number; price: number }[];
  size: string;
  inStock: boolean;
  hue: number; // used to tint the illustrated vial
  image?: string; // local path under /products/ for real product photos
  description: string;
};

export const categories: Category[] = [
  { slug: "dermal-fillers", name: "Dermal Fillers", icon: "Droplet", blurb: "Hyaluronic acid fillers" },
  { slug: "botulinum-toxins", name: "Botulinum Toxins", icon: "FlaskConical", blurb: "Neuromodulators" },
  { slug: "skinboosters", name: "Skinboosters & Polynucleotides", icon: "Sparkles", blurb: "Hydration & quality" },
  { slug: "biostimulators", name: "Biostimulators", icon: "Atom", blurb: "PLLA, CaHA, PCL" },
  { slug: "mesotherapy", name: "Mesotherapy", icon: "Syringe", blurb: "Cocktails & solutions" },
  { slug: "body-sculpting", name: "Body Sculpting & Fat Removal", icon: "Waves", blurb: "Lipolytics & contouring" },
  { slug: "threads", name: "Threads (PDO/PLA/PCLA)", icon: "Spline", blurb: "Lifting & mono threads" },
  { slug: "orthopedic", name: "Orthopedic Injections", icon: "Bone", blurb: "Viscosupplements" },
  { slug: "peels", name: "Peels & Masks", icon: "Layers", blurb: "Chemical peels & post-care" },
  { slug: "skincare", name: "Skincare", icon: "Leaf", blurb: "Professional clinical skincare" },
  { slug: "prp-exosomes", name: "PRP Kits & Exosomes", icon: "TestTube", blurb: "Regenerative solutions" },
  { slug: "eyelash", name: "Eyelash Enhancers", icon: "Eye", blurb: "Lash growth serums" },
  { slug: "cannulas-needles", name: "Cannulas & Needles", icon: "Pipette", blurb: "Precision injection supplies" },
  { slug: "gynecology", name: "Gynecology", icon: "HeartPulse", blurb: "Intimate rejuvenation" },
];

const b = (name: string, origin: string, cats: string[]): Brand => ({
  slug: name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-"),
  name,
  origin,
  categories: cats,
});

export const brands: Brand[] = [
  b("Belotero", "Germany", ["dermal-fillers"]),
  b("Botox", "USA", ["botulinum-toxins"]),
  b("Durolane", "Sweden", ["orthopedic"]),
  b("Dysport", "France", ["botulinum-toxins"]),
  b("Fillmed", "France", ["skinboosters", "mesotherapy", "peels"]),
  b("Filorga", "France", ["skincare", "mesotherapy"]),
  b("Intraline", "UK", ["threads"]),
  b("Juvéderm", "USA", ["dermal-fillers"]),
  b("Neauvia", "Switzerland", ["dermal-fillers", "gynecology"]),
  b("Orthovisc", "USA", ["orthopedic"]),
  b("Plinest", "Italy", ["skinboosters"]),
  b("Profhilo", "Italy", ["skinboosters", "body-sculpting"]),
  b("Radiesse", "USA", ["biostimulators"]),
  b("Rejuran", "South Korea", ["skinboosters"]),
  b("Restylane", "Sweden", ["dermal-fillers"]),
  b("Revolax", "South Korea", ["dermal-fillers"]),
  b("Saypha", "Austria", ["dermal-fillers"]),
  b("Sculptra", "USA", ["biostimulators"]),
  b("Sesderma", "Spain", ["skincare", "peels"]),
  b("Stylage", "France", ["dermal-fillers"]),
  b("Sunekos", "Italy", ["skinboosters"]),
  b("Synvisc", "USA", ["orthopedic"]),
  b("Teosyal", "Switzerland", ["dermal-fillers"]),
  b("Xeomin", "Germany", ["botulinum-toxins"]),
  b("TSK Laboratory", "Japan", ["cannulas-needles"]),
  b("Aqualyx", "Italy", ["body-sculpting"]),
  b("Lemon Bottle", "South Korea", ["body-sculpting"]),
  b("Novo Nordisk", "Denmark", ["body-sculpting"]),
  b("Eli Lilly", "USA", ["body-sculpting"]),
  b("Cellenis", "USA", ["prp-exosomes"]),
  b("Desirial", "France", ["gynecology"]),
  b("Careprost", "India", ["eyelash"]),
];

const tiers = (p: number) => [
  { min: 1, price: p },
  { min: 5, price: Math.round(p * 0.95) },
  { min: 10, price: Math.round(p * 0.9) },
  { min: 25, price: Math.round(p * 0.85) },
];

const P = (
  slug: string,
  name: string,
  brand: string,
  category: string,
  price: number,
  opts: Partial<Product> = {},
): Product => ({
  slug,
  name,
  brand,
  category,
  price,
  tiers: tiers(price),
  type: ["HA"],
  badges: [],
  size: "1 × 1 ml",
  inStock: true,
  hue: 200,
  description:
    "Supplied in original manufacturer packaging with the original lot number, stored and shipped under temperature-controlled conditions. For use by licensed healthcare professionals only.",
  ...opts,
});

export const products: Product[] = [
  // --- TOP DEMAND GLP-1 & GIP INJECTABLES ---
  P("ozempic-1mg", "Ozempic 1 mg (Semaglutide 4 mg/3 ml)", "novo-nordisk", "body-sculpting", 289, {
    badges: ["FDA approved", "EU approved"],
    type: ["FDA-approved", "EU-approved"],
    size: "1 Pre-filled Multi-Dose Pen (4 doses × 1 mg)",
    hue: 205,
    image: "/products/ozempic-1mg.jpg",
    description: "Once-weekly GLP-1 receptor agonist (semaglutide 1.34 mg/mL) pre-filled multi-dose pen. Subcutaneous administration for metabolic and medical body weight management. Ships with 4 disposable NovoFine Plus needles under continuous 2°C–8°C cold-chain logistics with verified lot traceability.",
  }),
  P("mounjaro-5mg", "Mounjaro 5 mg (Tirzepatide 5 mg/0.5 ml)", "eli-lilly", "body-sculpting", 329, {
    badges: ["FDA approved", "EU approved"],
    type: ["FDA-approved", "EU-approved"],
    size: "4 × 0.5 ml Single-Dose Autoinjector Pens",
    hue: 280,
    image: "/products/mounjaro-5mg.jpg",
    description: "First-in-class dual GIP and GLP-1 receptor agonist (tirzepatide 5 mg/0.5 mL) pre-filled single-dose autoinjector pens with hidden-needle safety mechanism. Engineered for once-weekly subcutaneous injection. Full cold-chain insulated transit guaranteed.",
  }),

  // --- DERMAL FILLERS ---
  P("juvederm-voluma-xc", "Juvéderm Voluma XC", "juvederm", "dermal-fillers", 189, {
    badges: ["FDA approved"],
    type: ["HA", "FDA-approved"],
    size: "2 × 1 ml",
    hue: 205,
    image: "/products/juvederm-voluma.webp",
    description: "Deep injection for cheek augmentation and mid-face volume restoration. Cross-linked hyaluronic acid with 0.3% lidocaine.",
  }),
  P("juvederm-volift-retouch", "Juvéderm Volift Retouch", "juvederm", "dermal-fillers", 145, {
    badges: ["FDA approved", "EU approved"],
    type: ["HA", "FDA-approved", "EU-approved"],
    size: "2 × 0.55 ml",
    hue: 200,
    image: "/products/juvederm-volite.jpg",
    description: "Targeted contouring for nasolabial folds and deep skin depressions. Features Vycross technology.",
  }),
  P("restylane-lyft-lidocaine", "Restylane Lyft Lidocaine", "restylane", "dermal-fillers", 165, {
    badges: ["FDA approved"],
    type: ["HA", "FDA-approved"],
    size: "1 × 1 ml",
    hue: 195,
    image: "/products/restylane-eyelight.webp",
    description: "Structural mid-face filler designed for high G-prime lifting, cheek contouring, and dorsal hand rejuvenation.",
  }),
  P("restylane-kysse", "Restylane Kysse", "restylane", "dermal-fillers", 155, {
    badges: ["FDA approved"],
    type: ["HA", "FDA-approved"],
    size: "1 × 1 ml",
    hue: 340,
    image: "/products/restylane-eyelight.webp",
    description: "Optimal balance of flexibility and natural movement for lip enhancement and perioral line smoothing.",
  }),
  P("belotero-balance", "Belotero Balance (+ Lidocaine)", "belotero", "dermal-fillers", 148, {
    badges: ["FDA approved", "EU approved"],
    type: ["HA", "FDA-approved", "EU-approved"],
    size: "1 × 1 ml",
    hue: 210,
    image: "/products/belotero-balance.webp",
    description: "CPM technology for seamless tissue integration without the Tyndall effect. Excellent for delicate superficial lines.",
  }),
  P("belotero-volume", "Belotero Volume", "belotero", "dermal-fillers", 175, {
    badges: ["EU approved"],
    type: ["HA", "EU-approved"],
    size: "2 × 1 ml",
    hue: 215,
    image: "/products/belotero-balance.webp",
    description: "High volumizing capacity formulated for deep cheeks, temples, and chin definition.",
  }),
  P("stylage-m-lidocaine", "Stylage M Lidocaine", "stylage", "dermal-fillers", 135, {
    badges: ["EU approved"],
    type: ["HA", "EU-approved"],
    size: "2 × 1 ml",
    hue: 190,
    image: "/products/stylage-m.webp",
    description: "IPN-like cross-linked hyaluronic acid enriched with natural antioxidant mannitol to reduce post-treatment swelling.",
  }),
  P("stylage-xl", "Stylage XL Lidocaine", "stylage", "dermal-fillers", 168, {
    badges: ["EU approved"],
    type: ["HA", "EU-approved"],
    size: "2 × 1 ml",
    hue: 185,
    image: "/products/stylage-xl.webp",
    description: "Concentrated structural gel for deep facial fat pad restoration and jawline definition.",
  }),
  P("teosyal-rha-4", "Teosyal RHA 4", "teosyal", "dermal-fillers", 175, {
    badges: ["FDA approved", "EU approved"],
    type: ["HA", "FDA-approved", "EU-approved"],
    size: "2 × 1.2 ml",
    hue: 200,
    image: "/products/harmonyca-lidocaine.webp",
    description: "Resilient Hyaluronic Acid designed specifically for dynamic volume in mobile facial zones.",
  }),
  P("revolax-deep", "Revolax Deep with Lidocaine", "revolax", "dermal-fillers", 62, {
    badges: ["Korean"],
    type: ["HA", "Korean"],
    size: "1 × 1.1 ml",
    hue: 185,
    image: "/products/revolax-deep.webp",
    description: "High-viscoelasticity monophasic HA filler developed in South Korea for deep wrinkles, cheeks, and lips.",
  }),
  P("saypha-volume-plus", "Saypha Volume Plus Lidocaine", "saypha", "dermal-fillers", 125, {
    badges: ["EU approved"],
    type: ["HA", "EU-approved"],
    size: "1 × 1 ml",
    hue: 210,
    image: "/products/saypha-volume-plus.webp",
    description: "Austrian engineered cross-linked gel for severe facial volume loss and reconstructive tissue augmentation.",
  }),
  P("neauvia-intense-flux", "Neauvia Intense Flux", "neauvia", "dermal-fillers", 140, {
    badges: ["EU approved"],
    type: ["HA", "EU-approved"],
    size: "1 × 1 ml",
    hue: 225,
    image: "/products/neauvia-intense.webp",
    description: "PEG cross-linked biocompatible hydrogel with low extrusion force and superior thermoresistance.",
  }),

  // --- BOTULINUM TOXINS ---
  P("botox-100u", "Botox 100U", "botox", "botulinum-toxins", 385, {
    badges: ["FDA approved"],
    type: ["FDA-approved"],
    size: "1 vial · 100U",
    hue: 230,
    image: "/products/botox-100u.webp",
    description: "OnabotulinumtoxinA powder for injection. Cold-chain guaranteed at 2°C–8°C from manufacturer warehouse to clinic door.",
  }),
  P("xeomin-100u", "Xeomin 100U", "xeomin", "botulinum-toxins", 299, {
    badges: ["FDA approved", "EU approved"],
    type: ["FDA-approved", "EU-approved"],
    size: "1 vial · 100U",
    hue: 250,
    image: "/products/xeomin-100u.webp",
    description: "IncobotulinumtoxinA purified neurotoxin free of complexing accessory proteins. Convenient room-temperature storage prior to reconstitution.",
  }),
  P("dysport-300u", "Dysport 300U", "dysport", "botulinum-toxins", 345, {
    badges: ["EU approved"],
    type: ["EU-approved"],
    size: "1 vial · 300U",
    hue: 240,
    image: "/products/dysport-300u.png",
    description: "AbobotulinumtoxinA for temporary improvement in the appearance of moderate to severe glabellar lines.",
  }),

  // --- SKINBOOSTERS & POLYNUCLEOTIDES ---
  P("profhilo-h-l", "Profhilo H+L", "profhilo", "skinboosters", 142, {
    badges: ["EU approved"],
    type: ["HA", "EU-approved"],
    size: "1 × 2 ml",
    hue: 175,
    image: "/products/profhilo-structura.webp",
    description: "High and low molecular weight hybrid cooperative complexes of ultrapure hyaluronic acid for bio-remodeling skin laxity.",
  }),
  P("rejuran-healer", "Rejuran Healer", "rejuran", "skinboosters", 118, {
    badges: ["Korean"],
    type: ["Korean"],
    size: "2 × 2 ml",
    hue: 160,
    image: "/products/rejuran-healer.webp",
    description: "Salmon DNA-derived Polynucleotide (PN) formulation for intradermal cellular repair, elasticity, and dermal density.",
  }),
  P("plinest-eye", "Plinest Eye", "plinest", "skinboosters", 96, {
    badges: ["EU approved"],
    type: ["EU-approved"],
    size: "1 × 2 ml",
    hue: 150,
    image: "/products/plinest-mastelli.webp",
    description: "Purified polynucleotide gel specifically indicated for periorbital brightening, micro-wrinkles, and under-eye hollows.",
  }),
  P("sunekos-200", "Sunekos 200", "sunekos", "skinboosters", 110, {
    badges: ["EU approved"],
    type: ["HA", "EU-approved"],
    size: "2 vials + 2 ampoules",
    hue: 140,
    image: "/products/jalupro-young-eye.webp",
    description: "Patented formula of Hyaluronic Acid and 6 specific Amino Acids to stimulate physiological collagen and elastin production.",
  }),

  // --- BIOSTIMULATORS ---
  P("sculptra-2-vials", "Sculptra Aesthetic", "sculptra", "biostimulators", 395, {
    badges: ["FDA approved"],
    type: ["Biostimulator", "FDA-approved"],
    size: "2 vials",
    hue: 60,
    image: "/products/sculptra-aesthetic.png",
    description: "Poly-L-lactic acid (PLLA-SCA) micro-particle injectable that stimulates gradual neocollagenesis over months.",
  }),
  P("radiesse-1-5", "Radiesse 1.5 ml (+ Lidocaine)", "radiesse", "biostimulators", 245, {
    badges: ["FDA approved"],
    type: ["Biostimulator", "FDA-approved"],
    size: "1 × 1.5 ml syringe",
    hue: 40,
    image: "/products/radiesse-1-5.webp",
    description: "Calcium Hydroxylapatite (CaHA) microspheres suspended in aqueous gel carrier for immediate lift and sustained structural regeneration.",
  }),

  // --- MESOTHERAPY ---
  P("fillmed-nctf-135ha", "Fillmed NCTF 135HA", "fillmed", "mesotherapy", 129, {
    badges: ["EU approved"],
    type: ["HA", "EU-approved"],
    size: "5 × 3 ml vials",
    hue: 170,
    image: "/products/fillmed-nctf-135ha.webp",
    description: "Gold standard poly-revitalizing mesotherapy cocktail with 5mg/ml HA plus 59 active nutrients (vitamins, amino acids, minerals, coenzymes).",
  }),
  P("filorga-mha-10", "Filorga M-HA 10", "filorga", "mesotherapy", 115, {
    badges: ["EU approved"],
    type: ["HA", "EU-approved"],
    size: "3 × 3 ml vials",
    hue: 165,
    image: "/products/filorga-art-filler.webp",
    description: "Pure hyaluronic acid mesotherapy treatment for radiant superficial dermal hydration and prevention of photo-aging.",
  }),

  // --- BODY SCULPTING & FAT REMOVAL ---
  P("lemon-bottle-ampoules", "Lemon Bottle Lipolysis Solution", "lemon-bottle", "body-sculpting", 120, {
    badges: ["Korean"],
    type: ["Korean"],
    size: "5 × 10 ml vials",
    hue: 95,
    image: "/products/lemonbottle-ampoules.webp",
    description: "Premium South Korean fat-dissolving solution combining Riboflavin (Vitamin B2), Lecithin, and Bromelain for localized adiposity reduction.",
  }),
  P("aqualyx-solution", "Aqualyx Fat Dissolving Solution", "aqualyx", "body-sculpting", 165, {
    badges: ["EU approved"],
    type: ["EU-approved"],
    size: "10 × 8 ml vials",
    hue: 105,
    image: "/products/alidya-anti-cellulite.webp",
    description: "Micro-gelatinous aqueous deoxycholic acid solution for intralipotherapy treatment of localized fat pockets (submental, abdomen, flanks).",
  }),

  // --- THREADS (PDO/PLA/PCLA) ---
  P("intraline-pdo-mono", "Intraline PDO Mono Threads 29G", "intraline", "threads", 85, {
    type: [],
    size: "20 threads / pack",
    hue: 280,
    image: "/products/rainbow-gold-mono.webp",
    description: "Polydioxanone bio-absorbable mono threads on precision Japanese surgical steel needles for skin tightening and collagen induction.",
  }),
  P("intraline-pdo-cog", "Intraline PDO 4D Cog Barb Threads", "intraline", "threads", 165, {
    type: [],
    size: "16 threads / pack",
    hue: 275,
    image: "/products/intraline-pdo-cog.jpg",
    description: "360-degree helical barbed threads in blunt cannulas for immediate mechanical tissue suspension and jawline vector lifting.",
  }),

  // --- ORTHOPEDIC INJECTIONS (VISCOSUPPLEMENTS) ---
  P("synvisc-one", "Synvisc-One (Hylan G-F 20)", "synvisc", "orthopedic", 310, {
    badges: ["FDA approved"],
    type: ["HA", "FDA-approved"],
    size: "1 × 6 ml syringe",
    hue: 215,
    image: "/products/synvisc-one.png",
    description: "High molecular weight cross-linked hylan fluid and gel regimen for single intra-articular injection relief of osteoarthritic knee pain.",
  }),
  P("durolane-3ml", "Durolane 3 ml", "durolane", "orthopedic", 210, {
    badges: ["EU approved"],
    type: ["HA", "EU-approved"],
    size: "1 × 3 ml syringe",
    hue: 220,
    image: "/products/durolane-3ml.webp",
    description: "Single-injection NASHA stabilized non-animal hyaluronic acid for symptomatic management of osteoarthritis in knee or hip joints.",
  }),
  P("orthovisc-syringe", "Orthovisc High Molecular Weight HA", "orthovisc", "orthopedic", 235, {
    badges: ["FDA approved"],
    type: ["HA", "FDA-approved"],
    size: "3 × 2 ml syringes",
    hue: 225,
    image: "/products/orthovisc-syringe.webp",
    description: "High molecular weight bacterial fermentation sodium hyaluronate providing joint lubrication and shock absorption across multi-injection courses.",
  }),

  // --- PEELS & MASKS ---
  P("sesderma-mandelac-peel", "Sesderma Mandelac Peel", "sesderma", "peels", 58, {
    type: [],
    size: "1 × 60 ml bottle",
    hue: 30,
    inStock: true,
    image: "/products/sesderma-cream.webp",
    description: "Professional mandelic acid formulation designed for sensitive, dyschromic, or acne-prone skin with minimal erythema.",
  }),
  P("fillmed-time-peel", "Fillmed Time Peel", "fillmed", "peels", 130, {
    badges: ["EU approved"],
    type: ["EU-approved"],
    size: "1 × 100 ml",
    hue: 35,
    image: "/products/biorepeelcl3-fnd.webp",
    description: "Medical chemical peel combining Gluconolactone and Glycolic Acid for anti-wrinkle and firmness renewal on mature skin.",
  }),

  // --- SKINCARE ---
  P("filorga-b3-recovery", "Filorga Skin Perfusion B3-Recovery Cream", "filorga", "skincare", 72, {
    badges: ["EU approved"],
    type: ["EU-approved"],
    size: "1 × 50 ml",
    hue: 155,
    image: "/products/zo-skin-health-serum.webp",
    description: "Post-aesthetic procedure soothing cream formulated with Vitamin B3, Mirabilis Jalapa extract, and rhamnose to rapidly restore barrier integrity.",
  }),
  P("sesderma-c-vit-serum", "Sesderma C-Vit Liposomal Serum", "sesderma", "skincare", 48, {
    type: [],
    size: "1 × 30 ml dropper",
    hue: 45,
    image: "/products/sesderma-cream.webp",
    description: "Stabilized lipid-encapsulated 3-O-ethyl ascorbic acid antioxidant serum for radiant clinical skin brightening and free radical neutralization.",
  }),

  // --- PRP KITS & EXOSOMES ---
  P("cellenis-prp-kit", "Cellenis PRP 22ml Separation Kit", "cellenis", "prp-exosomes", 280, {
    badges: ["FDA approved"],
    type: ["FDA-approved"],
    size: "2 kit pack (22 ml)",
    hue: 15,
    image: "/products/plasmolifting-prp.webp",
    description: "Closed single-spin separation gel technology yielding concentrated autologous platelet-rich plasma with optimal leukocyte control.",
  }),

  // --- EYELASH ENHANCERS ---
  P("careprost-bimatoprost", "Careprost Ophthalmic Solution 0.03%", "careprost", "eyelash", 38, {
    type: [],
    size: "1 × 3 ml dropper",
    hue: 180,
    image: "/products/jalupro-young-eye.webp",
    description: "Prostaglandin analog solution (Bimatoprost 0.03%) for practitioner dispensing to treat eyelash hypotrichosis.",
  }),

  // --- CANNULAS & NEEDLES ---
  P("tsk-steriglide-cannulas", "TSK STERiGLIDE Cannulas 25G × 50mm", "tsk-laboratory", "cannulas-needles", 95, {
    badges: ["EU approved", "FDA approved"],
    type: ["FDA-approved", "EU-approved"],
    size: "Box of 20 cannulas",
    hue: 200,
    image: "/products/softfil-precision-cannula.webp",
    description: "Patented dome-shaped tip with surface treatment resulting in up to 50% less glide resistance and significantly reduced bruising.",
  }),
  P("tsk-invisible-needle", "TSK The Invisible Needle 34G × 9mm", "tsk-laboratory", "cannulas-needles", 115, {
    badges: ["EU approved"],
    type: ["EU-approved"],
    size: "Box of 100 needles",
    hue: 210,
    image: "/products/meso-relle-32g.webp",
    description: "The slimmest hypodermic needle available on the market for botulinum toxin delivery, providing near-painless patient comfort.",
  }),

  // --- GYNECOLOGY ---
  P("neauvia-intense-rose", "Neauvia Intense Rose Intimate HA", "neauvia", "gynecology", 155, {
    badges: ["EU approved"],
    type: ["HA", "EU-approved"],
    size: "1 × 1 ml",
    hue: 330,
    image: "/products/desirial-original.webp",
    description: "Specifically formulated cross-linked hyaluronic acid with optimal viscoelastic properties for labia majora volume augmentation and contouring.",
  }),
  P("desirial-plus", "Desirial Plus Intimate Rejuvenation", "desirial", "gynecology", 195, {
    badges: ["EU approved"],
    type: ["HA", "EU-approved"],
    size: "1 × 2 ml",
    hue: 320,
    image: "/products/desirial-plus.webp",
    description: "IPN-like cross-linked antioxidant gel dedicated to reconstructive and functional aesthetics of the female intimate area.",
  }),
];

export const bestSellers = [
  "ozempic-1mg",
  "mounjaro-5mg",
  "botox-100u",
  "juvederm-voluma-xc",
  "profhilo-h-l",
  "synvisc-one",
  "rejuran-healer",
  "intraline-pdo-mono",
  "sculptra-2-vials",
  "teosyal-rha-4",
  "lemon-bottle-ampoules",
  "tsk-steriglide-cannulas",
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getBrand = (slug: string) => brands.find((x) => x.slug === slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const brandName = (slug: string) => getBrand(slug)?.name ?? slug;

export const formatPrice = (n: number, currencyOverride?: Currency) => {
  const curr = currencyOverride ?? (typeof window !== "undefined" ? useStore.getState().currency : "USD");
  const rate = CURRENCY_RATES[curr]?.rate ?? 1;
  const converted = Math.round(n * rate);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: curr,
    maximumFractionDigits: 0,
  }).format(converted);
};

export const priceFor = (p: Product, qty: number) =>
  [...p.tiers].reverse().find((t) => qty >= t.min)?.price ?? p.price;
