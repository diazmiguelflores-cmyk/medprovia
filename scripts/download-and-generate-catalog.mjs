import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve("public/products");
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function fetchAllMedicaProducts() {
  const all = [];
  for (let i = 1; i <= 4; i++) {
    const res = await fetch(`https://www.medicadepot.com/wp-json/wp/v2/product?per_page=100&page=${i}`);
    if (!res.ok) break;
    const data = await res.json();
    all.push(...data);
  }
  return all.filter((p) => {
    const img = p.yoast_head_json?.og_image?.[0]?.url;
    return img && !img.includes("placeholder");
  });
}

async function downloadImage(url, filename) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    if (!res.ok) {
      console.warn(`Failed to download ${url}: ${res.status}`);
      return false;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(path.join(OUT_DIR, filename), buf);
    return true;
  } catch (err) {
    console.warn(`Error downloading ${url}:`, err.message);
    return false;
  }
}

function cleanHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8211;/g, "-")
    .replace(/&#8217;/g, "'")
    .replace(/&#215;/g, "x")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  console.log("Fetching Medica Depot products...");
  const rawProducts = await fetchAllMedicaProducts();
  console.log(`Fetched ${rawProducts.length} real products.`);

  // Find products matching our catalog targets
  const targets = [
    // --- DERMAL FILLERS ---
    { find: (p) => p.slug === "juvederm-skinvive" || p.title.rendered.includes("SKINVIVE"), slug: "juvederm-skinvive", brand: "juvederm", category: "dermal-fillers", price: 185, size: "2 x 1 ml", type: ["HA", "FDA-approved"], badges: ["FDA approved"] },
    { find: (p) => p.slug.includes("juvederm-volite"), slug: "juvederm-volite", brand: "juvederm", category: "dermal-fillers", price: 175, size: "2 x 1 ml", type: ["HA", "FDA-approved"], badges: ["FDA approved"] },
    { find: (p) => p.slug === "restylane-eyelight" || p.title.rendered.includes("EYELIGHT"), slug: "restylane-eyelight", brand: "restylane", category: "dermal-fillers", price: 155, size: "1 x 0.5 ml", type: ["HA", "FDA-approved"], badges: ["FDA approved"] },
    { find: (p) => p.slug.includes("belotero-balance-with-lidocaine"), slug: "belotero-balance", brand: "belotero", category: "dermal-fillers", price: 148, size: "1 x 1 ml", type: ["HA", "FDA-approved", "EU-approved"], badges: ["FDA approved", "EU approved"] },
    { find: (p) => p.slug === "stylage-xl-bi-flex-with-lidocaine", slug: "stylage-xl", brand: "stylage", category: "dermal-fillers", price: 168, size: "2 x 1 ml", type: ["HA", "EU-approved"], badges: ["EU approved"] },
    { find: (p) => p.slug === "stylage-m-bi-flex-with-lidocaine", slug: "stylage-m", brand: "stylage", category: "dermal-fillers", price: 135, size: "2 x 1 ml", type: ["HA", "EU-approved"], badges: ["EU approved"] },
    { find: (p) => p.slug === "stylage-xxl-bi-flex-with-mepivacaine", slug: "stylage-xxl", brand: "stylage", category: "dermal-fillers", price: 178, size: "2 x 1 ml", type: ["HA", "EU-approved"], badges: ["EU approved"] },
    { find: (p) => p.title.rendered.includes("TEOSYAL") && p.yoast_head_json?.og_image?.[0]?.url && !p.yoast_head_json.og_image[0].url.includes("placeholder"), slug: "teosyal-rha-4", brand: "teosyal", category: "dermal-fillers", price: 175, size: "2 x 1.2 ml", type: ["HA", "FDA-approved", "EU-approved"], badges: ["FDA approved", "EU approved"] },
    { find: (p) => p.slug.includes("saypha") && !p.slug.includes("placeholder"), slug: "saypha-volume-plus", brand: "saypha", category: "dermal-fillers", price: 125, size: "1 x 1 ml", type: ["HA", "EU-approved"], badges: ["EU approved"] },
    { find: (p) => p.slug.includes("revolax") && !p.slug.includes("placeholder"), slug: "revolax-deep", brand: "revolax", category: "dermal-fillers", price: 62, size: "1 x 1.1 ml", type: ["HA", "Korean"], badges: ["Korean"] },
    { find: (p) => p.slug.includes("neauvia") && p.title.rendered.includes("INTENSE"), slug: "neauvia-intense", brand: "neauvia", category: "dermal-fillers", price: 140, size: "1 x 1 ml", type: ["HA", "EU-approved"], badges: ["EU approved"] },
    { find: (p) => p.slug.includes("filorga-art-filler"), slug: "filorga-art-filler", brand: "filorga", category: "dermal-fillers", price: 130, size: "2 x 1.2 ml", type: ["HA", "EU-approved"], badges: ["EU approved"] },

    // --- BIOSTIMULATORS ---
    { find: (p) => p.slug === "sculptra" || p.title.rendered.includes("SCULPTRA"), slug: "sculptra-aesthetic", brand: "sculptra", category: "biostimulators", price: 395, size: "2 vials", type: ["Biostimulator", "FDA-approved"], badges: ["FDA approved"] },
    { find: (p) => p.slug.includes("radiesse") && !p.slug.includes("placeholder"), slug: "radiesse-1-5", brand: "radiesse", category: "biostimulators", price: 245, size: "1 x 1.5 ml", type: ["Biostimulator", "FDA-approved"], badges: ["FDA approved"] },
    { find: (p) => p.slug.includes("ellanse"), slug: "ellanse-m", brand: "ellanse", category: "biostimulators", price: 215, size: "2 x 1 ml", type: ["Biostimulator", "EU-approved"], badges: ["EU approved"] },
    { find: (p) => p.slug.includes("harmonyca"), slug: "harmonyca-lidocaine", brand: "harmonyca", category: "biostimulators", price: 260, size: "2 x 1.25 ml", type: ["Biostimulator", "EU-approved"], badges: ["EU approved"] },

    // --- SKINBOOSTERS & POLYNUCLEOTIDES ---
    { find: (p) => p.slug.includes("profhilo-structura") || p.title.rendered.includes("PROFHILO"), slug: "profhilo-structura", brand: "profhilo", category: "skinboosters", price: 155, size: "1 x 2 ml", type: ["HA", "EU-approved"], badges: ["EU approved"] },
    { find: (p) => p.slug === "rejuran-healer" || p.title.rendered.includes("REJURAN® HEALER"), slug: "rejuran-healer", brand: "rejuran", category: "skinboosters", price: 118, size: "2 x 2 ml", type: ["Korean"], badges: ["Korean"] },
    { find: (p) => p.slug.includes("rejuran-hb"), slug: "rejuran-hb", brand: "rejuran", category: "skinboosters", price: 125, size: "1 x 1 ml", type: ["Korean"], badges: ["Korean"] },
    { find: (p) => p.slug.includes("nucleofill-25") || p.title.rendered.includes("NUCLEOFILL™ 25"), slug: "nucleofill-25", brand: "nucleofill", category: "skinboosters", price: 110, size: "1 x 1.5 ml", type: ["EU-approved"], badges: ["EU approved"] },
    { find: (p) => p.slug.includes("nucleofill-eyes") || p.title.rendered.includes("NUCLEOFILL™ EYES"), slug: "nucleofill-eyes", brand: "nucleofill", category: "skinboosters", price: 105, size: "1 x 2 ml", type: ["EU-approved"], badges: ["EU approved"] },
    { find: (p) => p.slug.includes("plinest") && !p.slug.includes("placeholder"), slug: "plinest-mastelli", brand: "plinest", category: "skinboosters", price: 98, size: "1 x 2 ml", type: ["EU-approved"], badges: ["EU approved"] },
    { find: (p) => p.slug.includes("sunekos") && !p.slug.includes("placeholder"), slug: "sunekos-200", brand: "sunekos", category: "skinboosters", price: 110, size: "2 vials + 2 ampoules", type: ["HA", "EU-approved"], badges: ["EU approved"] },
    { find: (p) => p.slug.includes("jalupro") && !p.slug.includes("placeholder"), slug: "jalupro-young-eye", brand: "jalupro", category: "skinboosters", price: 92, size: "1 x 1 ml", type: ["EU-approved"], badges: ["EU approved"] },

    // --- MESOTHERAPY ---
    { find: (p) => p.slug.includes("fillmed-nctf") || (p.slug.includes("fillmed") && p.title.rendered.includes("NCTF")), slug: "fillmed-nctf-135ha", brand: "fillmed", category: "mesotherapy", price: 129, size: "5 x 3 ml vials", type: ["HA", "EU-approved"], badges: ["EU approved"] },
    { find: (p) => p.slug.includes("cytocare") && !p.slug.includes("placeholder"), slug: "cytocare-715", brand: "cytocare", category: "mesotherapy", price: 115, size: "5 x 5 ml vials", type: ["HA", "EU-approved"], badges: ["EU approved"] },

    // --- BODY SCULPTING & FAT REMOVAL ---
    { find: (p) => p.slug.includes("lemonbottle") || p.title.rendered.includes("LEMONBOTTLE"), slug: "lemonbottle-ampoules", brand: "lemon-bottle", category: "body-sculpting", price: 120, size: "5 x 10 ml vials", type: ["Korean"], badges: ["Korean"] },
    { find: (p) => p.slug.includes("hyacorp") && p.slug.includes("face"), slug: "hyacorp-face", brand: "hyacorp", category: "body-sculpting", price: 145, size: "2 x 2 ml", type: ["HA", "EU-approved"], badges: ["EU approved"] },
    { find: (p) => p.slug.includes("alidya"), slug: "alidya-anti-cellulite", brand: "alidya", category: "body-sculpting", price: 135, size: "5 vials", type: ["EU-approved"], badges: ["EU approved"] },

    // --- THREADS (PDO/PLA/PCLA) ---
    { find: (p) => p.slug.includes("intraline") && p.title.rendered.includes("Double"), slug: "intraline-pdo-double", brand: "intraline", category: "threads", price: 95, size: "20 threads / pack", type: [], badges: [] },
    { find: (p) => p.slug.includes("rainbow") && p.title.rendered.includes("MONO"), slug: "rainbow-gold-mono", brand: "rainbow", category: "threads", price: 88, size: "20 threads / pack", type: [], badges: [] },

    // --- ORTHOPEDIC INJECTIONS (VISCOSUPPLEMENTS) ---
    { find: (p) => p.slug.includes("synvisc") && !p.slug.includes("placeholder"), slug: "synvisc-one", brand: "synvisc", category: "orthopedic", price: 310, size: "1 x 6 ml syringe", type: ["HA", "FDA-approved"], badges: ["FDA approved"] },
    { find: (p) => p.slug.includes("durolane") && !p.slug.includes("placeholder"), slug: "durolane-3ml", brand: "durolane", category: "orthopedic", price: 210, size: "1 x 3 ml syringe", type: ["HA", "EU-approved"], badges: ["EU approved"] },
    { find: (p) => p.slug.includes("orthovisc") && !p.slug.includes("placeholder"), slug: "orthovisc-syringe", brand: "orthovisc", category: "orthopedic", price: 235, size: "3 x 2 ml syringes", type: ["HA", "FDA-approved"], badges: ["FDA approved"] },
    { find: (p) => p.slug.includes("cingal"), slug: "cingal-syringe", brand: "cingal", category: "orthopedic", price: 265, size: "1 x 4 ml syringe", type: ["HA", "EU-approved"], badges: ["EU approved"] },
    { find: (p) => p.slug.includes("monovisc"), slug: "monovisc-syringe", brand: "monovisc", category: "orthopedic", price: 245, size: "1 x 4 ml syringe", type: ["HA", "FDA-approved"], badges: ["FDA approved"] },

    // --- PEELS & MASKS ---
    { find: (p) => p.slug.includes("biorepeel") && !p.slug.includes("placeholder"), slug: "biorepeelcl3-fnd", brand: "biorepeel", category: "peels", price: 165, size: "5 x 6 ml vials", type: ["EU-approved"], badges: ["EU approved"] },
    { find: (p) => p.slug.includes("prx") && !p.slug.includes("placeholder"), slug: "prx-t33-peel", brand: "prx", category: "peels", price: 180, size: "5 x 4 ml vials", type: ["EU-approved"], badges: ["EU approved"] },
    { find: (p) => p.slug.includes("fillmed") && p.title.rendered.includes("Peel"), slug: "fillmed-time-peel", brand: "fillmed", category: "peels", price: 130, size: "1 x 100 ml", type: ["EU-approved"], badges: ["EU approved"] },

    // --- SKINCARE ---
    { find: (p) => p.slug.includes("sesderma") && !p.slug.includes("placeholder"), slug: "sesderma-c-vit", brand: "sesderma", category: "skincare", price: 48, size: "1 x 30 ml dropper", type: [], badges: [] },
    { find: (p) => p.slug.includes("zo") && !p.slug.includes("placeholder"), slug: "zo-skin-health-serum", brand: "zo-skin-health", category: "skincare", price: 95, size: "1 x 50 ml", type: [], badges: [] },

    // --- PRP KITS & EXOSOMES ---
    { find: (p) => p.slug.includes("exojuv"), slug: "exojuv-exosomes", brand: "exojuv", category: "prp-exosomes", price: 295, size: "20mg powder + 5ml activator", type: ["Korean"], badges: ["Korean"] },
    { find: (p) => p.slug.includes("plasmolifting"), slug: "plasmolifting-prp", brand: "plasmolifting", category: "prp-exosomes", price: 120, size: "Box of 10 vacuum tubes", type: ["EU-approved"], badges: ["EU approved"] },

    // --- CANNULAS & NEEDLES ---
    { find: (p) => p.slug.includes("micronjet") || p.title.rendered.includes("MICRONJET"), slug: "micronjet-30-needles", brand: "micronjet", category: "cannulas-needles", price: 145, size: "Box of 30 microneedles", type: ["FDA-approved"], badges: ["FDA approved"] },
    { find: (p) => p.slug.includes("softfil") && !p.slug.includes("placeholder"), slug: "softfil-precision-cannula", brand: "softfil", category: "cannulas-needles", price: 85, size: "Box of 20 cannulas", type: ["EU-approved"], badges: ["EU approved"] },
    { find: (p) => p.slug.includes("meso-relle") && !p.slug.includes("placeholder"), slug: "meso-relle-32g", brand: "meso-relle", category: "cannulas-needles", price: 42, size: "Box of 100 needles", type: ["EU-approved"], badges: ["EU approved"] },

    // --- GYNECOLOGY ---
    { find: (p) => p.slug.includes("desirial-plus"), slug: "desirial-plus", brand: "desirial", category: "gynecology", price: 195, size: "1 x 2 ml syringe", type: ["HA", "EU-approved"], badges: ["EU approved"] },
    { find: (p) => p.slug.includes("desirial") && !p.slug.includes("plus") && !p.slug.includes("placeholder"), slug: "desirial-original", brand: "desirial", category: "gynecology", price: 145, size: "1 x 1 ml syringe", type: ["HA", "EU-approved"], badges: ["EU approved"] },
  ];

  console.log(`Processing ${targets.length} target products...`);
  const finalProducts = [];

  for (const t of targets) {
    const match = rawProducts.find(t.find);
    if (!match) {
      console.warn(`Could not find live product for target: ${t.slug}`);
      continue;
    }
    const rawImg = match.yoast_head_json?.og_image?.[0]?.url;
    let localImagePath = null;

    if (rawImg) {
      const ext = path.extname(new URL(rawImg).pathname) || ".webp";
      const filename = `${t.slug}${ext}`;
      const ok = await downloadImage(rawImg, filename);
      if (ok) {
        localImagePath = `/products/${filename}`;
        console.log(`✓ Downloaded ${filename} (${match.title.rendered})`);
      }
    }

    // Clean description
    let desc = cleanHtml(match.content?.rendered || match.excerpt?.rendered || "");
    if (desc.length > 250) {
      desc = desc.slice(0, 250).trim() + "...";
    }
    if (!desc) {
      desc = "Authentic manufacturer packaging with verified lot numbers and cold-chain integrity. For licensed practitioners only.";
    }

    const titleClean = match.title.rendered
      .replace(/&amp;/g, "&")
      .replace(/&#8211;/g, "-")
      .replace(/&#215;/g, "x")
      .replace(/<[^>]+>/g, "")
      .trim();

    finalProducts.push({
      slug: t.slug,
      name: titleClean,
      brand: t.brand,
      category: t.category,
      price: t.price,
      size: t.size,
      type: t.type,
      badges: t.badges,
      inStock: true,
      image: localImagePath,
      description: desc,
      hue: Math.floor(Math.random() * 260) + 20,
    });
  }

  // Also include the Botulinum Toxins with direct product photography
  const toxins = [
    {
      slug: "botox-100u",
      name: "Botox 100 Units (OnabotulinumtoxinA)",
      brand: "botox",
      category: "botulinum-toxins",
      price: 385,
      size: "1 vial · 100U",
      type: ["FDA-approved"],
      badges: ["FDA approved"],
      imgUrl: "https://shopme365.com/image/cache/catalog/cosmetology/botox/Allergan100-550x550.webp",
      filename: "botox-100u.webp",
      desc: "Allergan OnabotulinumtoxinA powder for reconstitution. Guaranteed 2°C–8°C validated cold-chain transit from climate-controlled depot to clinic receipt.",
    },
    {
      slug: "dysport-300u",
      name: "Dysport 300 Units (AbobotulinumtoxinA)",
      brand: "dysport",
      category: "botulinum-toxins",
      price: 345,
      size: "1 vial · 300U",
      type: ["EU-approved"],
      badges: ["EU approved"],
      imgUrl: "https://www.revolvemedicare.co.uk/wp-content/uploads/2025/05/DYSPORT300_TOXINS_FRONT.jpg",
      filename: "dysport-300u.jpg",
      desc: "Galderma/Ipsen AbobotulinumtoxinA. Formulated with human albumin and lactose for glabellar line smoothing and therapeutic spasticity indications.",
    },
    {
      slug: "xeomin-100u",
      name: "Xeomin 100 Units (IncobotulinumtoxinA)",
      brand: "xeomin",
      category: "botulinum-toxins",
      price: 299,
      size: "1 vial · 100U",
      type: ["FDA-approved", "EU-approved"],
      badges: ["FDA approved", "EU approved"],
      imgUrl: "https://www.revolvemedicare.co.uk/wp-content/uploads/2025/05/XEOMIN100_TOXINS_FRONT.jpg",
      filename: "xeomin-100u.jpg",
      desc: "Merz IncobotulinumtoxinA purified neurotoxin free of complexing accessory proteins. Convenient room-temperature storage prior to reconstitution.",
    },
    {
      slug: "careprost-bimatoprost",
      name: "Careprost Bimatoprost Ophthalmic Solution 0.03%",
      brand: "careprost",
      category: "eyelash",
      price: 38,
      size: "1 × 3 ml dropper bottle",
      type: [],
      badges: [],
      desc: "Sun Pharma Bimatoprost 0.03% topical solution indicated for practitioner dispensing in eyelash hypotrichosis enhancement.",
    },
  ];

  for (const tox of toxins) {
    let localPath = null;
    if (tox.imgUrl && tox.filename) {
      const ok = await downloadImage(tox.imgUrl, tox.filename);
      if (ok) {
        localPath = `/products/${tox.filename}`;
        console.log(`✓ Downloaded toxin image ${tox.filename}`);
      }
    }
    finalProducts.push({
      slug: tox.slug,
      name: tox.name,
      brand: tox.brand,
      category: tox.category,
      price: tox.price,
      size: tox.size,
      type: tox.type,
      badges: tox.badges,
      inStock: true,
      image: localPath,
      description: tox.desc,
      hue: 220,
    });
  }

  console.log(`\nTotal products collected: ${finalProducts.length}`);
  fs.writeFileSync("scripts/extracted-products.json", JSON.stringify(finalProducts, null, 2));
  console.log("Saved extracted-products.json");
}

main().catch(console.error);

