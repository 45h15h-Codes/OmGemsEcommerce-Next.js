"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

export default function DiamondsPage() {
  const [activeShape, setActiveShape] = useState("Round");

  const shapes = ["Round", "Princess", "Cushion", "Emerald", "Oval", "Pear", "Radiant", "Heart", "Marquise"];
  const filters = ["Price", "Carat", "Color", "Clarity", "Cut", "Polish", "Symmetry", "Fluorescence"];

  const diamondImg = "/diamond.png";

  return (
    <main className="min-h-screen pt-36 bg-background pb-32">
      {/* 1. SEARCH TERMINAL HEADER */}
      <section className="px-6 md:px-12 lg:px-24 mb-16 border-b border-border pb-16 max-w-[1600px] mx-auto">
        <motion.div
           initial={{ opacity: 0, x: -10 }}
           animate={{ opacity: 1, x: 0 }}
           className="text-[10px] uppercase font-bold text-primary tracking-[0.4em] mb-4"
        >
          Professional Diamond Terminal
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-serif tracking-tighter uppercase font-light mb-8 group"
        >
          Global <span className="italic">Inventory</span>
        </motion.h1>
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-12">
           <p className="text-muted-foreground text-[10px] uppercase tracking-[0.3em] font-semibold border-l border-primary pl-4">
              Real-time Market Access
           </p>
           <p className="text-muted-foreground text-[10px] uppercase tracking-[0.3em] font-semibold border-l border-border pl-4">
              GIA Certified Stones Only
           </p>
        </div>
      </section>

      {/* 2. MAIN TERMINAL INTERFACE */}
      <div className="px-6 md:px-12 lg:px-24 grid grid-cols-1 lg:grid-cols-12 gap-16 max-w-[1600px] mx-auto">
        
        {/* FACETED FILTERS SIDEBAR */}
        <aside className="lg:col-span-3 space-y-12 pr-8 border-r border-border h-fit sticky top-40 hidden lg:block">
          <div>
            <h3 className="text-[10px] uppercase font-bold text-foreground tracking-[0.2em] mb-8 border-b border-border pb-2 inline-block">Shape Library</h3>
            <div className="grid grid-cols-3 gap-1">
              {shapes.map((shape) => (
                <button
                  key={shape}
                  onClick={() => setActiveShape(shape)}
                  className={`aspect-square border border-border flex items-center justify-center text-[8px] uppercase tracking-widest transition-all duration-300 ${
                    activeShape === shape ? 'bg-foreground text-background border-foreground font-bold' : 'hover:border-primary hover:bg-muted'
                  }`}
                >
                  <span className="-rotate-12">{shape}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] uppercase font-bold text-foreground tracking-[0.2em] mb-8 border-b border-border pb-2 inline-block">Advanced Selection</h3>
            {filters.map((filter) => (
              <div key={filter} className="border-b border-border pb-4 group last:border-0 hover:bg-muted/5 transition-colors cursor-default">
                <div className="flex justify-between items-center cursor-pointer">
                  <span className="text-[10px] uppercase font-bold text-foreground tracking-[0.1em]">{filter}</span>
                  <span className="text-muted-foreground text-[12px] group-hover:text-primary transition-colors">+</span>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full py-5 bg-foreground text-background text-[10px] uppercase font-bold tracking-[0.4em] mt-16 hover:bg-foreground/90 transition-all duration-500 shadow-sm">
            Reset Selection
          </button>
        </aside>

        {/* RESULTS GRID AREA */}
        <div className="lg:col-span-9">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-border pb-8 gap-6">
            <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-muted-foreground">
               Currently Viewing <span className="text-foreground">1,420 Certified Results</span>
            </div>
            <div className="flex items-center space-x-12 text-[10px] uppercase font-bold tracking-[0.3em]">
              <div className="flex items-center space-x-4">
                 <span className="text-muted-foreground">Grid View</span>
                 <div className="w-8 h-px bg-foreground" />
                 <span>List View</span>
              </div>
              <select className="bg-transparent border-none focus:outline-none cursor-pointer text-foreground">
                <option>Sort: Price (Low to High)</option>
                <option>Sort: Carat (High to Low)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 * (item % 3) }}
                className="group border border-border p-8 hover:border-primary transition-all duration-700 flex flex-col justify-between h-[580px] bg-white hover:shadow-2xl hover:shadow-primary/5"
              >
                <div className="flex-1 flex flex-col">
                  {/* REAL DIAMOND IMAGE PREVIEW */}
                  <div className="aspect-square bg-[#f9f9f9] flex items-center justify-center mb-10 relative overflow-hidden group/img">
                    <img src={diamondImg} className="w-full h-full object-contain mix-blend-multiply opacity-80 group-hover/img:scale-110 transition-transform duration-1000 grayscale group-hover/img:grayscale-0" alt="Diamond" />
                    <div className="absolute top-6 left-6 text-[8px] uppercase font-bold text-background bg-foreground px-3 py-1 tracking-[0.4em]">GIA 1.50ct</div>
                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="text-[8px] uppercase tracking-widest text-primary font-bold">In Stock</span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <h4 className="text-2xl font-serif tracking-tighter uppercase mb-4 leading-none">1.50 Carat Round</h4>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-t border-border pt-6">
                      <div className="space-y-1">
                        <p className="text-[8px] uppercase tracking-widest text-muted-foreground">Color</p>
                        <p className="text-[10px] font-bold uppercase transition-colors group-hover:text-primary">D Grade</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] uppercase tracking-widest text-muted-foreground">Clarity</p>
                        <p className="text-[10px] font-bold uppercase transition-colors group-hover:text-primary">VVS1</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] uppercase tracking-widest text-muted-foreground">Cut</p>
                        <p className="text-[10px] font-bold uppercase transition-colors group-hover:text-primary">Excellent</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] uppercase tracking-widest text-muted-foreground">Symmetry</p>
                        <p className="text-[10px] font-bold uppercase transition-colors group-hover:text-primary">Excellent</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 border-t border-border pt-8 flex justify-between items-center">
                   <div className="flex flex-col">
                      <span className="text-[8px] uppercase tracking-widest text-muted-foreground">Wholesale Pricing</span>
                      <p className="text-[10px] font-bold font-mono tracking-tighter text-foreground mt-1 group-hover:text-primary transition-colors">Access Limited to Partners</p>
                   </div>
                   {/* FIX: prefetch={false} prevents Next.js from aggressively prefetching
                       all 9 detail routes simultaneously when the grid mounts/scrolls into view.
                       Without this, Next.js fires 9 concurrent RSC requests causing repeated
                       HMR websocket reconnects and apparent "reload" behavior in dev. */}
                   <Link
                     href={`/diamonds/${item}`}
                     prefetch={false}
                     className="text-[10px] font-bold uppercase tracking-widest border-b border-foreground pb-1 hover:border-primary transition-all"
                   >
                     Details
                   </Link>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-32 text-center">
            <button className="group relative px-24 py-6 border border-border overflow-hidden">
               <span className="absolute inset-0 w-full h-full bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
               <span className="relative z-10 text-[10px] uppercase font-bold tracking-[0.4em] text-foreground group-hover:text-background transition-colors duration-500">
                  Request Custom Inventory Pull
               </span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}