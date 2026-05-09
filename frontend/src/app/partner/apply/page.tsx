"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function PartnerApplyPage() {
  const [step, setStep] = useState(1);

  return (
    <main className="min-h-screen pt-32 bg-background pb-24">
      {/* Editorial Title */}
      <section className="px-6 md:px-12 lg:px-24 mb-16 text-center">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-[10px] uppercase font-bold text-primary tracking-[0.3em] mb-4"
        >
          Exclusive Partnership
        </motion.div>
        <motion.h1
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.2 }}
           className="text-5xl md:text-7xl font-serif tracking-tighter uppercase font-light"
        >
          Elevate Your <br /> <span className="italic">Inventory</span>
        </motion.h1>
        <p className="mt-8 text-muted-foreground font-light tracking-wide max-w-xl mx-auto leading-relaxed">
          Join the Om Gems international network of jewelers. Gain direct access to premium GIA global inventory with absolute transparency and bespoke support.
        </p>
      </section>

      {/* Multistep Application Form */}
      <section className="max-w-2xl mx-auto px-6">
        <div className="flex justify-between mb-12 border-b border-border pb-4">
           {[1, 2, 3].map((s) => (
             <div key={s} className="flex items-center space-x-4">
                <div className={`w-6 h-6 border flex items-center justify-center text-[10px] transform rotate-45 transition-all duration-500 ${
                  step === s ? 'border-primary bg-primary text-background' : 'border-border text-muted-foreground'
                }`}>
                  <span className="-rotate-45">{s}</span>
                </div>
                <span className={`text-[10px] uppercase tracking-widest font-bold ${step === s ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {s === 1 ? 'Business' : s === 2 ? 'Documents' : 'Verification'}
                </span>
             </div>
           ))}
        </div>

        <motion.div
           key={step}
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5 }}
           className="space-y-8"
        >
          {step === 1 && (
            <>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Entity Name</label>
                    <input type="text" placeholder="Official Business Name" className="w-full bg-muted border-none p-4 text-[12px] focus:outline-none focus:ring-1 focus:ring-primary transition-all uppercase" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Tax ID / GST</label>
                    <input type="text" placeholder="Registration Number" className="w-full bg-muted border-none p-4 text-[12px] focus:outline-none focus:ring-1 focus:ring-primary transition-all uppercase" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Primary Contact</label>
                    <input type="text" placeholder="Full Name of Principal" className="w-full bg-muted border-none p-4 text-[12px] focus:outline-none focus:ring-1 focus:ring-primary transition-all uppercase" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Business Type</label>
                    <select className="w-full bg-muted border-none p-4 text-[12px] focus:outline-none focus:ring-1 focus:ring-primary appearance-none uppercase">
                       <option>Retail Jeweler</option>
                       <option>Wholesale Broker</option>
                       <option>Diamond Manufacturer</option>
                    </select>
                  </div>
               </div>
               <button onClick={() => setStep(2)} className="w-full py-5 bg-foreground text-background text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-foreground/90 transition-all duration-500">
                  Save & Continue
               </button>
            </>
          )}

          {step === 2 && (
             <div className="text-center py-12 space-y-8">
                <p className="text-muted-foreground font-light italic">&quot;Transparency is our foundation. Please prepare your business certificates for digital verification.&quot;</p>
                <div className="border-2 border-dashed border-border py-16 px-12 flex flex-col items-center space-y-4 hover:border-primary transition-colors cursor-pointer">
                   <div className="w-12 h-12 border border-border rotate-45 flex items-center justify-center text-[10px] text-muted-foreground">+</div>
                   <p className="text-[10px] uppercase tracking-widest font-bold">Upload KYC Documents (PDF/JPG)</p>
                </div>
                <div className="flex gap-4">
                   <button onClick={() => setStep(1)} className="flex-1 py-4 border border-border text-[10px] uppercase font-bold tracking-widest hover:border-foreground transition-all">Back</button>
                   <button onClick={() => setStep(3)} className="flex-1 py-4 bg-foreground text-background text-[10px] uppercase font-bold tracking-widest hover:bg-foreground/90 transition-all">Submit for Review</button>
                </div>
             </div>
          )}

          {step === 3 && (
            <div className="text-center py-24 space-y-8">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-16 h-16 border border-primary rotate-45 mx-auto flex items-center justify-center">
                 <span className="text-primary text-xl -rotate-45">✓</span>
              </motion.div>
              <h3 className="text-2xl font-serif tracking-tighter uppercase font-light">Application <span className="italic">Received</span></h3>
              <p className="text-muted-foreground font-light leading-relaxed max-w-md mx-auto">
                A Maison Concierge will review your application. We prioritize long-term, high-integrity partnerships within the jewelry council. Expect a response within 48 business hours.
              </p>
              <button onClick={() => setStep(1)} className="px-12 py-4 border border-border text-[10px] uppercase font-bold tracking-widest hover:border-foreground transition-all">Return Home</button>
            </div>
          )}
        </motion.div>
      </section>
    </main>
  );
}
