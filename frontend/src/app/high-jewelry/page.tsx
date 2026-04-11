"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HighJewelryPage() {
  const collections = [
    { 
      id: 1, 
      name: "Aurora Solstice", 
      detail: "Deep Canary Yellow Diamonds & Scintillating Platinum", 
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=2070",
      position: "left" 
    },
    { 
      id: 2, 
      name: "The Celestial Pear", 
      detail: "A Masterpiece of Rare 5ct+ VVS1 Selection", 
      image: "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?auto=format&fit=crop&q=80&w=2070",
      position: "right" 
    },
    { 
      id: 3, 
      name: "Ivory Radiance", 
      detail: "Master Crafted Multi-faceted Necklace Collection", 
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=2070",
      position: "left" 
    }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground pt-36">
      {/* 1. ATELIER HERO */}
      <section className="px-6 md:px-24 mb-32 border-b border-border pb-16 max-w-7xl mx-auto">
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-[10px] uppercase font-bold text-primary tracking-[0.4em] mb-12"
          >
            The Atelier of Rare Creations
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-9xl font-serif tracking-tighter uppercase font-light leading-[0.85]"
          >
            Atelier <br /> <span className="italic">Excellence</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-16 text-muted-foreground font-light tracking-widest max-w-md leading-relaxed text-sm"
          >
            A world of singular beauty. Each piece is a one-of-a-kind creation, handcrafted by our master artisans to tell an eternal story of light, provenance, and form.
          </motion.p>
      </section>

      {/* 2. EDITORIAL COLLECTIONS */}
      <section className="space-y-maison pb-maison">
        {collections.map((item, index) => (
          <div key={item.id} className="px-6 md:px-24 container mx-auto">
            <div className={`flex flex-col ${item.position === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 md:gap-24 items-center`}>
              <motion.div 
                whileInView={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 1.05 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="w-full lg:w-3/5 aspect-[16/11] bg-muted relative overflow-hidden group"
              >
                  <img src={item.image} className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" alt={item.name} />
                  <div className="absolute inset-0 bg-background/5 group-hover:bg-transparent transition-all duration-700" />
                  <div className="absolute top-8 left-8 text-[8px] uppercase tracking-[0.5em] font-bold text-background bg-foreground/20 px-4 py-2 backdrop-blur-md">
                     Series {item.id}
                  </div>
              </motion.div>
              
              <div className="w-full lg:w-2/5 space-y-8">
                <h3 className="text-3xl md:text-5xl font-serif tracking-tighter uppercase font-light leading-snug">{item.name}</h3>
                <p className="text-muted-foreground font-light tracking-widest leading-relaxed max-w-xs">{item.detail}</p>
                <div className="pt-8">
                  <button className="group relative px-10 py-4 border border-foreground overflow-hidden">
                    <span className="absolute inset-0 w-full h-full bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
                    <span className="relative z-10 text-[10px] uppercase tracking-[0.3em] font-bold text-foreground group-hover:text-background transition-colors duration-500">
                      Explore Story
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 3. BESPOKE SERVICE STORYBOARD */}
      <section className="bg-foreground text-background py-maison text-center px-6 border-t border-border mt-32">
        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           className="max-w-4xl mx-auto space-y-12"
        >
          <h2 className="text-5xl md:text-8xl font-serif tracking-tighter uppercase leading-[0.85]">Bespoke <br /> <span className="italic">Service</span></h2>
          <p className="max-w-2xl mx-auto text-muted-foreground font-light mb-16 px-12 leading-relaxed text-sm tracking-widest">
            The pinnacle of the craft. Collaborate with our designers and master jewelers to create a piece that is truly yours, from the initial sketch to the final masterstroke. Your legacy, our artistry.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-12 mt-16">
             <Link href="/concierge" className="px-16 py-6 border border-background text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-background hover:text-foreground transition-all duration-500">
                Book Consultation
             </Link>
             <Link href="/bespoke" className="px-16 py-6 bg-background text-foreground text-[10px] uppercase tracking-[0.4em] font-bold hover:opacity-90 transition-all duration-500">
                View Past Works
             </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
