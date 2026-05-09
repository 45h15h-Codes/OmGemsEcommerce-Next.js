"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/store/useAppStore";
import { useNavLinks, useSiteSettings } from "@/hooks/useSiteContent";
import { catalogApi } from "@/lib/catalogApi";
import { cn } from "@/lib/utils";

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

export const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isCartOpen, toggleCart } = useAppStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch dynamic nav links from CMS API (with 5min staleTime)
  const { data: headerLinks } = useNavLinks("header");
  const { data: settings } = useSiteSettings();
  const { data: catalogCategories } = useQuery({
    queryKey: ["catalog-categories-menu"],
    queryFn: catalogApi.categories,
    staleTime: 1000 * 60 * 5,
  });

  const siteName = settings?.site_name || "Om Gems";

  // Hide Navbar completely on portal routes — they have their own shell
  const isPortalRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/partner/dashboard") ||
    pathname.startsWith("/partner/diamonds") ||
    pathname.startsWith("/partner/orders") ||
    pathname.startsWith("/partner/profile") ||
    pathname.startsWith("/wholesale") ||
    pathname.startsWith("/account");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Build menu link groups — use API links if available, else fallback
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
    // Split into 3 groups by sort_order thirds
    const chunkSize = Math.ceil(active.length / 3);
    const chunks = [
      active.slice(0, chunkSize),
      active.slice(chunkSize, chunkSize * 2),
      active.slice(chunkSize * 2),
    ];
    collectionsLinks =
      chunks[0]?.map((l) => ({ label: l.label, href: l.url })) ||
      FALLBACK_COLLECTIONS;
    b2bLinks =
      chunks[1]?.map((l) => ({ label: l.label, href: l.url })) || FALLBACK_B2B;
    maisonLinks =
      chunks[2]?.map((l) => ({ label: l.label, href: l.url })) ||
      FALLBACK_MAISON;
  }

  if (isPortalRoute) return null;

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 md:px-12 py-6 flex justify-between items-center",
          isScrolled
            ? "bg-background/80 backdrop-blur-md py-4 border-b border-border"
            : "bg-transparent",
        )}
      >
        <div className="flex-1 flex items-center space-x-8">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="group flex items-center space-x-2 text-[10px] uppercase tracking-widest font-semibold"
          >
            <div className="flex flex-col space-y-1 w-4">
              <span
                className={cn(
                  "h-px bg-foreground transition-all duration-300",
                  isMenuOpen ? "translate-y-1 rotate-45" : "",
                )}
              />
              <span
                className={cn(
                  "h-px bg-foreground transition-all duration-300",
                  isMenuOpen ? "opacity-0" : "",
                )}
              />
              <span
                className={cn(
                  "h-px bg-foreground transition-all duration-300",
                  isMenuOpen ? "-translate-y-1 -rotate-45" : "",
                )}
              />
            </div>
            <span>Menu</span>
          </button>

          <Link
            href="/diamonds"
            prefetch={false}
            className="hidden md:block text-[10px] uppercase tracking-widest font-semibold hover:text-primary transition-colors"
          >
            Diamonds
          </Link>
          <Link
            href="/jewelry/engagement-rings"
            prefetch={false}
            className="hidden md:block text-[10px] uppercase tracking-widest font-semibold hover:text-primary transition-colors"
          >
            Jewelry
          </Link>
        </div>

        <Link href="/" className="flex-1 flex justify-center">
          <span className="font-serif text-2xl tracking-tighter uppercase font-light">
            {siteName}
          </span>
        </Link>

        <div className="flex-1 flex items-center justify-end space-x-8">
          <Link
            href="/auth/login"
            prefetch={false}
            className="hidden md:block text-[10px] uppercase tracking-widest font-semibold hover:text-primary transition-colors"
          >
            Account
          </Link>
          <button
            onClick={toggleCart}
            className="text-[10px] uppercase tracking-widest font-semibold hover:text-primary transition-colors"
          >
            Bag (0)
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-40 bg-background pt-32 px-12 md:px-24"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mb-8">
                  Collections
                </h3>
                <ul className="space-y-4">
                  {collectionsLinks.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        prefetch={false}
                        onClick={() => setIsMenuOpen(false)}
                        className="font-serif text-3xl hover:text-primary transition-colors"
                      >
                        {item.label}
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
                  {b2bLinks.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        prefetch={false}
                        onClick={() => setIsMenuOpen(false)}
                        className="font-serif text-3xl hover:text-primary transition-colors"
                      >
                        {item.label}
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
                  {maisonLinks.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        prefetch={false}
                        onClick={() => setIsMenuOpen(false)}
                        className="font-serif text-3xl hover:text-primary transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="absolute bottom-12 left-12 md:left-24 right-12 md:right-24 border-t border-border pt-8 flex justify-between items-center">
              <div className="flex space-x-8 text-[10px] uppercase tracking-widest font-semibold">
                <Link href="/legal/privacy" prefetch={false}>
                  Privacy
                </Link>
                <Link href="/support/shipping" prefetch={false}>
                  Shipping
                </Link>
                <Link href="/contact" prefetch={false}>
                  Contact
                </Link>
              </div>
              <div className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
                © {new Date().getFullYear()} {siteName}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
