"use client";

import { motion } from "framer-motion";

export default function MaisonPage() {
  return (
    <main className="min-h-screen pt-36 bg-background pb-maison selection:bg-primary/20">
      {/* 1. HERO STORYTELLING */}
      <section className="px-6 md:px-12 lg:px-24 mb-32 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-[10px] uppercase font-bold text-primary tracking-[0.4em] mb-12"
        >
          Since 2026 — The Maison
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-6xl md:text-8xl font-serif tracking-tighter uppercase font-light leading-[0.85]"
        >
          Mastery <br /> <span className="italic">Beyond Time</span>
        </motion.h1>
        <p className="mt-16 text-muted-foreground font-light tracking-widest text-sm leading-relaxed max-w-2xl mx-auto italic">
          "A diamond is a silent poem of light. At Om Gems, we do not just trade gems; we curate the eternal."
        </p>
      </section>

      {/* 2. NARRATIVE SECTION : THE ORIGIN */}
      <section className="grid grid-cols-1 lg:grid-cols-2 bg-muted border-t border-b border-border">
        <div className="aspect-square relative overflow-hidden group">
          <img 
             src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=2069" 
             className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 hover:scale-105 transition-all duration-1000" 
             alt="Diamond Selection"
          />
          <div className="absolute inset-0 bg-background/5 group-hover:bg-transparent transition-all duration-700" />
        </div>
        <div className="px-12 md:px-24 py-maison flex flex-col justify-center space-y-12">
          <h2 className="text-4xl md:text-6xl uppercase tracking-tighter font-serif leading-[0.9]">The Pursuit of <br /> <span className="italic">Perfection</span></h2>
          <div className="space-y-8 max-w-lg">
            <p className="text-muted-foreground font-light leading-relaxed">
               Founded in the heart of the international gem trade, Om Gems was established with a singular vision: to bring the world's most exceptional stones directly to the discerning eye. Our journey is one of relentless curation, spanning continents to identify diamonds of rare provenance.
            </p>
            <p className="text-muted-foreground font-light leading-relaxed">
               For the B2B community, we represent a bridge of integrity—delivering not just inventory, but technical excellence and absolute market transparency.
            </p>
          </div>
          <div className="pt-8 flex space-x-12">
             <div className="text-center">
                <span className="text-2xl font-serif tracking-tighter">100%</span>
                <p className="text-[8px] uppercase tracking-widest font-bold text-muted-foreground mt-2">Ethical Sourcing</p>
             </div>
             <div className="text-center">
                <span className="text-2xl font-serif tracking-tighter">GIA</span>
                <p className="text-[8px] uppercase tracking-widest font-bold text-muted-foreground mt-2">Certified Selection</p>
             </div>
          </div>
        </div>
      </section>

      {/* 3. VALUE PILLARS */}
      <section className="px-6 md:px-24 py-maison text-center">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
            {[
               { id: '01', title: 'Integrity', detail: 'Every transaction is anchored by exhaustive documentation and GIA verification.' },
               { id: '02', title: 'Artistry', detail: 'We blend classical hand-crafting with state-of-the-art 3D interactive configurators.' },
               { id: '03', title: 'Precision', detail: 'Our gemologists select only the top 1% of GIA inventory for the Om Gems label.' }
            ].map(pillar => (
               <div key={pillar.id} className="space-y-8 flex flex-col items-center">
                  <div className="w-12 h-12 border border-primary rotate-45 flex items-center justify-center mb-12 group hover:bg-primary transition-all duration-500 cursor-default">
                     <span className="text-[10px] uppercase font-bold text-primary group-hover:text-background -rotate-45">{pillar.id}</span>
                  </div>
                  <h3 className="text-2xl tracking-tighter uppercase font-serif font-light">{pillar.title}</h3>
                  <p className="text-muted-foreground text-sm font-light leading-relaxed max-w-xs">{pillar.detail}</p>
               </div>
            ))}
         </div>
      </section>

      {/* 4. THE ATELIER VISUAL */}
      <section className="h-[60vh] relative overflow-hidden border-t border-border">
         <img 
            src="https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&q=80&w=2070" 
            className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-1000" 
            alt="Atelier workshop"
         />
         <div className="absolute inset-0 bg-background/30 flex items-center justify-center">
            <div className="text-center space-y-4">
              <span className="text-[10px] uppercase tracking-widest italic font-serif text-background">Inside the Atelier</span>
              <div className="w-16 h-[1px] bg-background mx-auto" />
            </div>
         </div>
      </section>
    </main>
  );
}
