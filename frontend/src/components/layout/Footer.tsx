"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavLinks, useSiteSettings } from "@/hooks/useSiteContent";
import { Gem, Mail, Phone, MapPin } from "lucide-react";

// Static fallback links if API hasn't loaded yet
const FALLBACK_FOOTER_LINKS = {
  collections: [
    { label: "High Jewelry", href: "/high-jewelry" },
    { label: "Engagement Rings", href: "/jewelry/engagement-rings" },
    { label: "Wedding Bands", href: "/jewelry/wedding-bands" },
    { label: "Bracelets", href: "/jewelry/bracelets" },
  ],
  services: [
    { label: "Loose Diamonds", href: "/diamonds" },
    { label: "Diamond Sourcing", href: "/diamonds" },
    { label: "Partner Portal", href: "/partner/apply" },
    { label: "Bespoke Services", href: "/high-jewelry" },
  ],
  company: [
    { label: "Our Heritage", href: "/maison" },
    { label: "Contact Us", href: "/contact" },
    { label: "Shipping", href: "/support/shipping" },
    { label: "Privacy Policy", href: "/legal/privacy" },
  ],
};

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

  const { data: footerLinks } = useNavLinks("footer");
  const { data: settings } = useSiteSettings();

  if (isPortalRoute) return null;

  const siteName = settings?.site_name || "Om Gems";
  const tagline =
    settings?.tagline || "Exquisite Diamonds & Fine Jewelry Since 1985";
  const contactEmail = settings?.contact_email || "concierge@omgems.com";
  const contactPhone = settings?.contact_phone || "+91 22 2345 6789";
  const address = settings?.address || "Mumbai, India";

  // Group API links by some convention, or use fallback
  const hasApiLinks = footerLinks && footerLinks.length > 0;

  return (
    <footer className="relative bg-zinc-950 text-zinc-400 overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 pointer-events-none" />

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link
                href="/"
                className="inline-flex items-center gap-3 group mb-6"
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
                  <Gem className="h-5 w-5 text-white" />
                </div>
                <span className="font-serif text-2xl tracking-tight text-white">
                  {siteName}
                </span>
              </Link>
              <p className="text-sm leading-relaxed text-zinc-500 max-w-sm mb-8">
                {tagline}
              </p>
              <div className="space-y-3">
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-3 text-sm text-zinc-500 hover:text-amber-400 transition-colors group"
                >
                  <Mail className="h-4 w-4 text-zinc-600 group-hover:text-amber-400 transition-colors" />
                  {contactEmail}
                </a>
                <a
                  href={`tel:${contactPhone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-sm text-zinc-500 hover:text-amber-400 transition-colors group"
                >
                  <Phone className="h-4 w-4 text-zinc-600 group-hover:text-amber-400 transition-colors" />
                  {contactPhone}
                </a>
                <div className="flex items-center gap-3 text-sm text-zinc-500">
                  <MapPin className="h-4 w-4 text-zinc-600" />
                  {address}
                </div>
              </div>
            </div>

            {/* Link Columns — use API links if available, otherwise static fallback */}
            {hasApiLinks ? (
              <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
                {/* Render API footer links grouped by sort_order chunks */}
                {(() => {
                  // Simple split: first third, second third, rest
                  const active = footerLinks.filter((l) => l.is_active);
                  const chunkSize = Math.ceil(active.length / 3);
                  const chunks = [
                    active.slice(0, chunkSize),
                    active.slice(chunkSize, chunkSize * 2),
                    active.slice(chunkSize * 2),
                  ];
                  const titles = ["Collections", "Services", "Company"];
                  return chunks.map((chunk, i) => (
                    <div key={i}>
                      <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold text-zinc-500 mb-6">
                        {titles[i]}
                      </h3>
                      <ul className="space-y-3">
                        {chunk.map((link) => (
                          <li key={link.id}>
                            <Link
                              href={link.url}
                              target={
                                link.open_in_new_tab ? "_blank" : undefined
                              }
                              rel={
                                link.open_in_new_tab
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                              className="text-sm text-zinc-500 hover:text-white transition-colors duration-200"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ));
                })()}
              </div>
            ) : (
              <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold text-zinc-500 mb-6">
                    Collections
                  </h3>
                  <ul className="space-y-3">
                    {FALLBACK_FOOTER_LINKS.collections.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-zinc-500 hover:text-white transition-colors duration-200"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold text-zinc-500 mb-6">
                    Services
                  </h3>
                  <ul className="space-y-3">
                    {FALLBACK_FOOTER_LINKS.services.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-zinc-500 hover:text-white transition-colors duration-200"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold text-zinc-500 mb-6">
                    Company
                  </h3>
                  <ul className="space-y-3">
                    {FALLBACK_FOOTER_LINKS.company.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-zinc-500 hover:text-white transition-colors duration-200"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800/60">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-600">
              © {new Date().getFullYear()} {siteName}. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-zinc-600">
              <Link
                href="/legal/privacy"
                className="hover:text-zinc-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/legal/terms"
                className="hover:text-zinc-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/support/shipping"
                className="hover:text-zinc-400 transition-colors"
              >
                Shipping Info
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
