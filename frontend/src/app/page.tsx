"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  useEffect(() => setMounted(true), []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <main ref={containerRef} className="relative min-h-screen bg-background overflow-hidden selection:bg-accent/30">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative h-[100vh] flex flex-col items-center justify-center px-6 text-center">
        {/* Subtle background glow - reduced to clear video haze */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="z-10 w-full flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.2em" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-[10px] uppercase font-bold text-primary tracking-[0.4em] mb-12"
          >
            Maison Of Extraordinary Brilliance
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-6xl md:text-8xl lg:text-9xl font-serif font-extralight tracking-tighter leading-[0.85] text-foreground uppercase"
          >
            Pure <br /> 
            <span className="italic">Luminescence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-12 text-sm md:text-base font-sans font-light tracking-widest text-muted-foreground max-w-lg mx-auto leading-relaxed"
          >
            Since 2026, redefining the standard for high-jewelry craftsmanship. A sanctuary of GIA-certified diamonds and unparalleled artistry.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-12"
          >
            <Link 
              href="/jewelry" 
              className="group relative px-12 py-5 overflow-hidden border border-foreground"
            >
              <span className="absolute inset-0 w-full h-full bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
              <span className="relative z-10 text-[10px] uppercase tracking-[0.2em] font-bold text-foreground group-hover:text-background transition-colors duration-500">
                Explore The Collections
              </span>
            </Link>
            <Link 
              href="/diamonds" 
              className="text-[10px] uppercase tracking-[0.2em] font-bold border-b border-border pb-1 hover:border-foreground transition-all duration-300"
            >
              B2B Diamond Portal
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero Background Video - Fine-tuned for maximum clarity */}
        <div className="absolute inset-0 z-0 opacity-100 pointer-events-none overflow-hidden">
           <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="w-full h-full object-cover scale-105 brightness-[0.98] contrast-[1.02]"
           >
              <source 
                 src="/hero-bg.mp4" 
                 type="video/mp4" 
              />
           </video>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div className="absolute bottom-12 flex flex-col items-center">
          <div className="w-px h-16 bg-border relative overflow-hidden">
            <motion.div 
              animate={{ y: [0, 64] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 w-full h-8 bg-primary"
            />
          </div>
        </motion.div>
      </section>

      {/* 2. BRAND HERITAGE SECTION */}
      <section className="py-maison px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
           <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 50 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="space-y-12"
           >
              <h3 className="text-[10px] uppercase font-bold text-primary tracking-[0.4em]">The Maison</h3>
              <h2 className="text-5xl md:text-7xl uppercase tracking-tighter font-serif leading-[0.9]">Craftsmanship <br /> & <span className="italic">Heritage</span></h2>
              <p className="text-muted-foreground font-light leading-relaxed max-w-md">
                Our artisans combine century-old techniques with pioneering digital innovation to breathe life into every stone. Every piece is a testament to the pursuit of absolute perfection.
              </p>
              <Link href="/maison" className="inline-block text-[10px] uppercase tracking-[0.2em] font-bold border-b border-foreground pb-2 hover:border-primary transition-all duration-300">
                Discover Our Story
              </Link>
           </motion.div>
           <motion.div 
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 1.05 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              className="aspect-[4/5] bg-muted relative overflow-hidden"
           >
              <img 
                src="https://images.unsplash.com/photo-1596944210900-34a5cf8ee198?auto=format&fit=crop&q=80&w=1587" 
                className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 hover:scale-105 transition-all duration-1000" 
                alt="Jewelry Crafting"
              />
           </motion.div>
        </div>
      </section>

      {/* 3. HIGH JEWELRY EDITORIAL SHOWCASE */}
      <section className="bg-muted py-maison">
         <div className="container mx-auto px-6 mb-24 text-center">
            <h2 className="text-4xl md:text-6xl uppercase tracking-tighter font-serif font-light">The Atelier <span className="italic">Edit</span></h2>
         </div>
         <div className="flex flex-col md:flex-row h-auto gap-4 px-4">
            <div className="flex-1 aspect-[16/10] bg-zinc-200 relative group overflow-hidden">
               <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Necklace" />
               <div className="absolute inset-0 bg-background/20 group-hover:bg-background/0 transition-all duration-700" />
               <div className="absolute bottom-12 left-12">
                  <h4 className="text-2xl font-serif text-background uppercase tracking-tight">Celestial High Jewelry</h4>
                  <Link href="/high-jewelry" className="text-[10px] uppercase tracking-widest text-background border-b border-background mt-4 block w-fit">View Story</Link>
               </div>
            </div>
            <div className="flex-1 aspect-[16/10] bg-zinc-300 relative group overflow-hidden">
               <img src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=1587" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Rings" />
               <div className="absolute bottom-12 left-12">
                  <h4 className="text-2xl font-serif text-background uppercase tracking-tight">The Solitaire Series</h4>
                  <Link href="/jewelry/rings" className="text-[10px] uppercase tracking-widest text-background border-b border-background mt-4 block w-fit">Explore Rings</Link>
               </div>
            </div>
         </div>
      </section>

      {/* 4. PROFESSIONAL B2B TERMINAL PREVIEW */}
      <section className="py-maison px-6 md:px-24">
         <div className="max-w-6xl mx-auto border border-border p-12 md:p-24 flex flex-col items-center text-center space-y-12 bg-[#fafafa]">
            <div className="text-[10px] uppercase font-bold text-primary tracking-[0.4em]">B2B Terminal Access</div>
            <h2 className="text-4xl md:text-7xl uppercase tracking-tighter font-serif font-light leading-[0.85]">Global Market <br /> <span className="italic">Intelligence</span></h2>
            <p className="max-w-2xl text-muted-foreground font-light leading-relaxed">
               For institutional partners only. Gain real-time access to our global GIA-certified inventory, wholesale pricing matrix, and specialized memo procurement services.
            </p>
            <div className="flex gap-8">
               <Link href="/diamonds" className="px-12 py-5 bg-foreground text-background text-[10px] uppercase font-bold tracking-widest hover:opacity-90 transition-all">
                  Access Inventory
               </Link>
               <Link href="/partner/apply" className="px-12 py-5 border border-border text-[10px] uppercase font-bold tracking-widest hover:border-foreground transition-all">
                  Partner Application
               </Link>
            </div>
            
            {/* Visual Teaser of Terminal */}
            <div className="w-full mt-24 border border-border bg-white p-4 hidden md:block">
               <div className="flex justify-between border-b pb-4 mb-4 text-[8px] uppercase tracking-widest text-muted-foreground">
                  <span>Stock #9211</span>
                  <span>1.50ct | Round | D | VVS1</span>
                  <span className="text-primary">Verified</span>
               </div>
               <div className="h-2 w-full bg-muted overflow-hidden">
                  <motion.div animate={{ x: [-100, 400] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="w-20 h-full bg-primary" />
               </div>
            </div>
         </div>
      </section>

      {/* 5. NEWSLETTER / MAISON JOURNAL */}
      <section className="py-maison px-6 md:px-12 text-center border-t border-border mt-maison">
         <div className="max-w-xl mx-auto space-y-8">
            <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-primary">The Maison Journal</h3>
            <h4 className="text-3xl font-serif tracking-tighter uppercase font-light">Elegance in Your <span className="italic">Inbox</span></h4>
            <div className="relative group">
               <input type="email" placeholder="Enter Email Address" className="w-full py-6 pr-24 bg-transparent border-b border-border text-[10px] uppercase tracking-[0.2em] font-semibold focus:outline-none focus:border-foreground transition-all" />
               <button className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold tracking-widest hover:text-primary transition-colors">Join Now</button>
            </div>
            <p className="text-[8px] uppercase tracking-widest text-muted-foreground">Receive exclusive invitations, rare stock alerts, and high-jewelry editorials.</p>
         </div>
      </section>

      {/* FOOTER MINI (Main footer in layout later) */}
      <footer className="py-24 px-6 md:px-24 border-t border-border flex flex-col md:flex-row justify-between items-center gap-12">
         <div className="font-serif text-2xl uppercase tracking-tighter">Om Gems</div>
         <div className="flex gap-12 text-[8px] uppercase font-bold tracking-widest">
            <Link href="/legal/privacy">Privacy Policy</Link>
            <Link href="/support/shipping">Shipping & Returns</Link>
            <Link href="/maison">The Maison</Link>
         </div>
      </footer>
    </main>
  );
}
