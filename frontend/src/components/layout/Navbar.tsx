"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isCartOpen, toggleCart } = useAppStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const collectionsLinks = [
    { label: "High Jewelry", href: "/high-jewelry" },
    { label: "Engagement Rings", href: "/jewelry/engagement-rings" },
    { label: "Wedding Bands", href: "/jewelry/wedding-bands" },
    { label: "Bracelets", href: "/jewelry/bracelets" },
    { label: "Necklaces", href: "/jewelry/necklaces" },
    { label: "Earrings", href: "/jewelry/earrings" },
  ];

  const b2bLinks = [
    { label: "Loose Diamonds", href: "/diamonds" },
    { label: "Diamond Sourcing", href: "/diamonds" },
    { label: "Partner Portal", href: "/partner/apply" },
  ];

  const maisonLinks = [
    { label: "Our Heritage", href: "/maison" },
    { label: "Craftsmanship", href: "/maison" },
    { label: "Bespoke Services", href: "/high-jewelry" },
  ];

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
            Om Gems
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
                © 2026 Om Gems Luxury
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
