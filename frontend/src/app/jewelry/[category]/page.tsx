"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function JewelryCategoryPage() {
  const { category } = useParams();
  
  const formattedCategory = typeof category === 'string' 
    ? category.replace('-', ' ').toUpperCase() 
    : "COLLECTIONS";

  const products = [
    { id: 1, name: "Solitaire Platinum Ring", price: "4,500", detail: "1.50ct D VVS1", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=2070" },
    { id: 2, name: "Pavé Diamond Band", price: "2,800", detail: "Multi-stone Platinum", img: "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?auto=format&fit=crop&q=80&w=2070" },
    { id: 3, name: "Halo Engagement Ring", price: "6,200", detail: "2.0ct Center Stone", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=2070" },
    { id: 4, name: "Vintage Emerald Cut", price: "5,400", detail: "Classic Sourcing", img: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=1587" },
    { id: 5, name: "Ivory Radiance Solitaire", price: "12,400", detail: "Atelier Limited", img: "https://images.unsplash.com/photo-1596944210900-34a5cf8ee198?auto=format&fit=crop&q=80&w=1587" },
    { id: 6, name: "Art Deco Band", price: "3,800", detail: "Hand-engraved", img: "https://images.unsplash.com/photo-1626248801379-317424fb8798?auto=format&fit=crop&q=80&w=2070" },
  ];

  return (
    <main className="min-h-screen pt-36 bg-background pb-32">
      {/* 1. CATEGORY HEADER */}
      <section className="px-6 md:px-12 lg:px-24 mb-24 border-b border-border pb-16 flex flex-col md:flex-row justify-between items-end gap-12 max-w-[1600px] mx-auto">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[10px] uppercase font-bold text-primary tracking-[0.4em] mb-6"
          >
            The Collection Matrix
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-serif tracking-tighter uppercase font-light leading-[0.85]"
          >
            {formattedCategory}
          </motion.h1>
        </div>
        
        <div className="flex flex-col items-end gap-6">
           <div className="flex items-center space-x-12 text-[10px] uppercase font-bold tracking-[0.3em] text-muted-foreground">
               <span>{products.length} Curated Pieces</span>
               <div className="w-px h-6 bg-border" />
               <button className="hover:text-foreground transition-colors group flex items-center gap-2">
                  <span>Refine Selections</span>
                  <div className="w-3 h-3 border border-border rotate-45 group-hover:bg-primary transition-all duration-500" />
               </button>
           </div>
        </div>
      </section>

      {/* 2. PRODUCT GRID */}
      <section className="px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-32">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <Link href={`/jewelry/product/platinum-radiance`}>
                 <div className="aspect-[4/5] bg-muted mb-10 relative overflow-hidden group/img shadow-sm">
                   <img src={product.img} className="w-full h-full object-cover grayscale brightness-95 group-hover/img:grayscale-0 group-hover/img:scale-110 group-hover/img:brightness-105 transition-all duration-1000" alt={product.name} />
                   <div className="absolute inset-0 bg-background/5 group-hover/img:bg-transparent transition-all duration-700" />
                   
                   {/* Hover Interaction Layer */}
                   <div className="absolute inset-0 border border-primary/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-700" />
                   <div className="absolute bottom-8 left-8 right-8 py-4 bg-background/80 backdrop-blur-md opacity-0 translate-y-4 group-hover/img:opacity-100 group-hover/img:translate-y-0 transition-all duration-700 flex justify-center">
                       <span className="text-[10px] uppercase font-bold tracking-[0.3em]">View Detail</span>
                   </div>
                 </div>

                 <div className="space-y-4 text-center">
                   <h3 className="text-2xl font-serif tracking-tighter uppercase group-hover:text-primary transition-colors duration-500">
                     {product.name}
                   </h3>
                   <div className="flex justify-center items-center space-x-4">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest italic">{product.detail}</p>
                      <div className="w-1 h-1 bg-border rounded-full" />
                      <p className="text-sm font-sans font-medium tracking-tighter">${product.price}</p>
                   </div>
                 </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. CTA BOTTOM */}
      <section className="mt-48 py-32 bg-muted text-center border-t border-border">
         <div className="max-w-2xl mx-auto space-y-12 px-6">
            <h2 className="text-4xl md:text-6xl font-serif tracking-tighter uppercase font-light italic leading-none">Bespoke Curation</h2>
            <p className="text-muted-foreground font-light leading-relaxed tracking-widest text-sm">Can't find exactly what you're looking for? Our concierge team specializes in sourcing rare stones and custom jewelry design for our B2B and institutional clients.</p>
            <Link href="/concierge" className="inline-block px-16 py-6 border border-foreground text-[10px] uppercase font-bold tracking-[0.4em] hover:bg-foreground hover:text-background transition-all duration-700">
               Inquire Privately
            </Link>
         </div>
      </section>
    </main>
  );
}
