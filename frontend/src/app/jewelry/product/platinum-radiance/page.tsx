"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState("Details");

  const productImages = [
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=2070",
    "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?auto=format&fit=crop&q=80&w=2070",
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=2070",
    "https://images.unsplash.com/photo-1626248801379-317424fb8798?auto=format&fit=crop&q=80&w=2070"
  ];

  return (
    <main className="min-h-screen pt-36 bg-background pb-32 overflow-x-hidden selection:bg-primary/20">
      
      {/* 1. PRODUCT NARRATIVE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 px-6 md:px-12 lg:px-24 mb-maison container mx-auto">
        
        {/* LEFT COLUMN: MEDIA GALLERY (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="aspect-square bg-muted relative overflow-hidden group cursor-crosshair border border-border"
          >
            <img 
               src={productImages[0]} 
               className="w-full h-full object-cover grayscale brightness-95 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" 
               alt="Platinum Radiance"
            />
            <div className="absolute top-8 left-8 px-5 py-2 bg-foreground/20 backdrop-blur-md text-background text-[10px] uppercase font-bold tracking-[0.4em]">
              Individual Creation
            </div>
            <div className="absolute inset-0 border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          </motion.div>

          <div className="grid grid-cols-4 gap-6">
            {productImages.map((img, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.05 }}
                className="aspect-square bg-muted opacity-60 hover:opacity-100 transition-opacity cursor-pointer border border-border group overflow-hidden"
              >
                 <img src={img} className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-500" alt={`View ${i+1}`} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: REFINED DETAILS (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-16">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-[10px] uppercase font-bold text-primary tracking-[0.4em] mb-4"
            >
              Master Edition Series
            </motion.div>
            <h1 className="text-5xl md:text-8xl font-serif tracking-tighter uppercase font-light leading-[0.82]">
              Ivory <br /> <span className="italic underline decoration-1 decoration-border underline-offset-8">Radiance</span>
            </h1>
            <p className="text-2xl font-sans font-light tracking-tighter pt-8 text-foreground">$12,400 <span className="text-sm font-mono text-muted-foreground ml-4 uppercase tracking-widest">(Inclusive of all taxes)</span></p>
          </div>

          <div className="space-y-12 pb-16 border-b border-border">
            <p className="text-muted-foreground font-light leading-relaxed max-w-md tracking-widest text-sm italic">
               “A celebration of pure geometry. Meticulously handcrafted in 950 Platinum, featuring a 1.50ct round brilliant D-grade stone of incomparable fire.”
            </p>
            
            <div className="space-y-6">
              <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground">Precious Metal Selection</h3>
              <div className="flex flex-wrap gap-4">
                {['Platinum 950', '18k Yellow Gold', 'Everose Gold'].map((metal, idx) => (
                  <button key={metal} className={`px-8 py-3 border text-[10px] uppercase tracking-widest font-bold transition-all duration-500 ${idx === 0 ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground'}`}>
                    {metal}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 lg:gap-8">
            <button className="flex-1 py-6 bg-foreground text-background text-[10px] uppercase font-bold tracking-[0.4em] hover:bg-foreground/90 transition-all duration-700 shadow-xl shadow-foreground/5">
              Acquire To Bag
            </button>
            <button className="px-16 py-6 border border-border text-[10px] uppercase font-bold tracking-[0.4em] hover:border-foreground transition-all duration-700">
              Private Concierge
            </button>
          </div>

          <div className="pt-12 text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground space-y-6 border-t border-border mt-12 bg-muted/5 p-8">
            <div className="flex items-center space-x-6 group cursor-pointer hover:text-foreground transition-colors">
              <div className="w-4 h-4 border border-border rotate-45 group-hover:bg-primary group-hover:border-primary transition-all duration-500" />
              <span>Priority International Logistics</span>
            </div>
            <div className="flex items-center space-x-6 group cursor-pointer hover:text-foreground transition-colors">
              <div className="w-4 h-4 border border-border rotate-45 group-hover:bg-primary group-hover:border-primary transition-all duration-500" />
              <span>Full Maison Guarantee & Certificate</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TECHNICAL SPECIFICATIONS & STORY */}
      <section className="px-6 md:px-12 lg:px-24 py-maison border-t border-border mt-maison bg-muted/5">
        <div className="flex flex-col md:flex-row justify-center space-y-8 md:space-y-0 md:space-x-16 mb-24 border-b border-border max-w-3xl mx-auto">
          {['Details', 'Technical Data', 'The Craft'].map((tab) => (
            <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`pb-4 text-[10px] uppercase font-bold tracking-[0.4em] transition-all duration-500 border-b-2 ${
                 activeTab === tab ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
               }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="max-w-5xl mx-auto py-12">
            {activeTab === 'Details' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col md:flex-row gap-24 items-center">
                 <div className="flex-1 space-y-8">
                    <h4 className="text-4xl font-serif tracking-tighter uppercase font-light">Ethereal <br /><span className="italic">Light</span></h4>
                    <p className="text-muted-foreground font-light leading-relaxed text-sm tracking-widest italic">
                       Each Ivory Radiance ring begins with the search for a singular stone. Our gemologists analyze the precise atomic structure to ensure the refraction of light is mathematically perfect.
                    </p>
                 </div>
                 <div className="flex-1 aspect-video bg-muted overflow-hidden border border-border">
                    <img src={productImages[2]} className="w-full h-full object-cover grayscale brightness-90 transition-all duration-1000" alt="Detail view" />
                 </div>
              </motion.div>
            )}
            {activeTab === 'Technical Data' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-4 gap-12 text-left">
                  {[
                    { l: 'Setting', v: '950 Platinum' },
                    { l: 'Primary Stone', v: 'Natural Diamond' },
                    { l: 'Weight', v: '1.50 Carat' },
                    { l: 'Cut Grade', v: 'Excellent' },
                    { l: 'Color Grade', v: 'D (Colorless)' },
                    { l: 'Clarity', v: 'VVS1' },
                    { l: 'Fluorescence', v: 'None' },
                    { l: 'Internal Ref', v: 'OM-RAD-9211' }
                  ].map((spec) => (
                    <div key={spec.l} className="border-b border-border pb-6 hover:bg-muted/10 p-4 transition-colors">
                       <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-4 block">{spec.l}</span>
                       <p className="text-sm font-sans font-medium uppercase tracking-tighter text-foreground">{spec.v}</p>
                    </div>
                  ))}
              </motion.div>
            )}
        </div>
      </section>

      {/* 3. SIMILAR PIECES / SUGGESTIONS */}
      <section className="px-6 md:px-12 lg:px-24 py-maison text-center">
         <h3 className="text-[10px] uppercase font-bold tracking-[0.5em] text-primary mb-16 underline underline-offset-8">Complementary Creations</h3>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[1, 2, 3, 4].map(idx => (
               <Link href={`#`} key={idx} className="group space-y-6">
                  <div className="aspect-square bg-muted overflow-hidden border border-border">
                     <img src={productImages[(idx % 4)]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Suggested product" />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest font-bold group-hover:text-primary transition-colors">Maison Ring Series {idx}</p>
               </Link>
            ))}
         </div>
      </section>
    </main>
  );
}
