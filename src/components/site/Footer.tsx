import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Youtube, ShieldCheck } from "lucide-react";
import { categories } from "@/data/catalog";
import { complianceNotice, contact, trademarkNotice } from "@/data/content";
import { Logo } from "../brand/Logo";
import { Container } from "./primitives";

const pay = ["Visa", "Mastercard", "Amex", "Apple Pay", "Google Pay"];

export function Footer() {
  return (
    <footer className="mt-24 bg-navy text-navy-foreground">
      <Container className="py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="[&_a]:text-navy-foreground">
              <Logo />
            </div>
            <p className="mt-4 text-sm opacity-75">
              Authentic, lot-traceable aesthetic & medical supplies for licensed professionals worldwide.
            </p>
            <div className="mt-5 flex gap-2">
              {[Instagram, Linkedin, Facebook, Youtube].map((I, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link (placeholder)"
                  className="grid h-10 w-10 place-items-center rounded-full border border-navy-foreground/20 hover:bg-navy-foreground/10 transition-colors"
                >
                  <I className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="Company"
            links={[
              ["About Medprovia", "/about"],
              ["Education & Blog", "/blog"],
              ["Practitioner Programs", "/programs"],
              ["Clinical Services", "/services"],
              ["Get Verified", "/register"],
            ]}
          />

          <FooterCol
            title="Customer Service"
            links={[
              ["Shipping & Cold-Chain", "/legal/shipping"],
              ["Returns & Replacement", "/legal/returns"],
              ["Terms of Service", "/legal/terms"],
              ["Privacy Policy", "/legal/privacy"],
              ["Order Tracking", "/services/order-tracking"],
            ]}
          />

          <div>
            <h3 className="mb-4 font-sans text-xs font-semibold uppercase tracking-widest text-gold">Top Categories</h3>
            <ul className="space-y-2 text-sm opacity-80">
              {categories.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/shop/$category"
                    params={{ category: c.slug }}
                    className="transition hover:opacity-100 hover:text-gold"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-sans text-xs font-semibold uppercase tracking-widest text-gold">Contact</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <a href={`mailto:${contact.email}`} className="hover:text-gold transition font-medium">
                  {contact.email}
                </a>
              </li>
            </ul>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-gold">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Licensed Clinicians Only</span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-navy-foreground/15 pt-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs opacity-70 mr-1">Accepted Payment Methods:</span>
            {pay.map((p) => (
              <span key={p} className="rounded-md border border-navy-foreground/20 px-2.5 py-1 text-xs font-semibold">
                {p}
              </span>
            ))}
          </div>
          <p className="text-xs opacity-70">© {new Date().getFullYear()} Medprovia. All rights reserved.</p>
        </div>

        <div className="mt-6 space-y-2 text-xs opacity-70 leading-relaxed">
          <p>{complianceNotice}</p>
          <p>{trademarkNotice}</p>
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h3 className="mb-4 font-sans text-xs font-semibold uppercase tracking-widest text-gold">{title}</h3>
      <ul className="space-y-2 text-sm opacity-80">
        {links.map(([l, h]) => (
          <li key={h}>
            <Link to={h} className="transition hover:opacity-100 hover:text-gold">
              {l}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
