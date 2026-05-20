"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useNavLinks, useSiteSettings } from "@/hooks/useSiteContent";
import { catalogApi } from "@/lib/catalogApi";
import { Mail, Phone, MapPin } from "lucide-react";

// ─── Static Fallback Links ──────────────────────────────────
const FALLBACK_COLLECTIONS = [
  { label: "High Jewelry", href: "/high-jewelry" },
  { label: "Engagement Rings", href: "/jewelry/engagement-rings" },
  { label: "Wedding Bands", href: "/jewelry/wedding-bands" },
  { label: "Bracelets", href: "/jewelry/bracelets" },
  { label: "Necklaces", href: "/jewelry/necklaces" },
  { label: "Earrings", href: "/jewelry/earrings" },
];

const FALLBACK_B2B = [
  { label: "Loose Diamonds", href: "/diamonds" },
  { label: "Diamond Sourcing", href: "/diamonds" },
  { label: "Partner Portal", href: "/partner/apply" },
];

const FALLBACK_MAISON = [
  { label: "Our Heritage", href: "/maison" },
  { label: "Craftsmanship", href: "/maison" },
  { label: "Bespoke Services", href: "/high-jewelry" },
];

export const Footer = () => {
  const pathname = usePathname();

  // Hide Footer on portal routes — they have their own shell
  const isPortalRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/partner/dashboard") ||
    pathname.startsWith("/partner/diamonds") ||
    pathname.startsWith("/partner/orders") ||
    pathname.startsWith("/partner/profile") ||
    pathname.startsWith("/wholesale") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/auth");

  // Use 'header' links for perfect consistency with Navbar
  const { data: headerLinks } = useNavLinks("header");
  const { data: settings } = useSiteSettings();
  const { data: catalogCategories } = useQuery({
    queryKey: ["catalog-categories-menu"],
    queryFn: catalogApi.categories,
    staleTime: 1000 * 60 * 5,
  });

  if (isPortalRoute) return null;

  const siteName = settings?.site_name || "Om Gems";
  const tagline = settings?.tagline || "Exquisite Diamonds & Fine Jewelry Since 1985";
  const contactEmail = settings?.contact_email || "concierge@omgems.com";
  const contactPhone = settings?.contact_phone || "+91 22 2345 6789";
  const address = settings?.address || "Mumbai, India";

  const hasApiLinks = headerLinks && headerLinks.length > 0;

  let collectionsLinks = FALLBACK_COLLECTIONS;
  let b2bLinks = FALLBACK_B2B;
  let maisonLinks = FALLBACK_MAISON;

  if (catalogCategories?.data?.length) {
    const storefrontCategories = catalogCategories.data.filter((category) => category.slug !== "diamonds");
    collectionsLinks = storefrontCategories.map((category) => ({
      label: category.name,
      href: category.slug === "high-jewelry" ? "/high-jewelry" : `/jewelry/${category.slug}`,
    }));
    b2bLinks = [
      { label: "Loose Diamonds", href: "/diamonds" },
      { label: "Diamond Sourcing", href: "/diamonds" },
      { label: "Partner Portal", href: "/partner/apply" },
    ];
  } else if (hasApiLinks) {
    const active = headerLinks.filter((l) => l.is_active);
    const chunkSize = Math.ceil(active.length / 3);
    const chunks = [
      active.slice(0, chunkSize),
      active.slice(chunkSize, chunkSize * 2),
      active.slice(chunkSize * 2),
    ];
    collectionsLinks = chunks[0]?.map((l) => ({ label: l.label, href: l.url })) || FALLBACK_COLLECTIONS;
    b2bLinks = chunks[1]?.map((l) => ({ label: l.label, href: l.url })) || FALLBACK_B2B;
    maisonLinks = chunks[2]?.map((l) => ({ label: l.label, href: l.url })) || FALLBACK_MAISON;
  }

  return (
    <footer className="bg-background text-foreground border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-8">
              <span className="font-serif text-2xl tracking-tighter uppercase font-light">
                {siteName}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-sm mb-10">
              {tagline}
            </p>
            <div className="space-y-4">
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-4 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <Mail className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                {contactEmail}
              </a>
              <a
                href={`tel:${contactPhone.replace(/\s/g, "")}`}
                className="flex items-center gap-4 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <Phone className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                {contactPhone}
              </a>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {address}
              </div>
            </div>
          </div>

          {/* Link Columns */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-12">
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mb-8">
                Collections
              </h3>
              <ul className="space-y-4">
                {collectionsLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mb-8">
                B2B Terminal
              </h3>
              <ul className="space-y-4">
                {b2bLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mb-8">
                The Maison
              </h3>
              <ul className="space-y-4">
                {maisonLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
            <Link
              href="/legal/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/legal/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/support/shipping"
              className="hover:text-foreground transition-colors"
            >
              Shipping Info
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
