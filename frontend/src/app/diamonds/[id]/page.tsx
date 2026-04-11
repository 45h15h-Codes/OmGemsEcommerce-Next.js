import Link from "next/link";

const diamonds = [
  {
    id: "1",
    title: "1.50 Carat Round",
    grade: "D",
    clarity: "VVS1",
    cut: "Excellent",
  },
  {
    id: "2",
    title: "2.10 Carat Princess",
    grade: "E",
    clarity: "VVS1",
    cut: "Excellent",
  },
  {
    id: "3",
    title: "1.80 Carat Cushion",
    grade: "F",
    clarity: "VVS2",
    cut: "Excellent",
  },
  {
    id: "4",
    title: "2.25 Carat Emerald",
    grade: "D",
    clarity: "VS1",
    cut: "Excellent",
  },
  {
    id: "5",
    title: "1.30 Carat Oval",
    grade: "E",
    clarity: "VVS2",
    cut: "Very Good",
  },
  {
    id: "6",
    title: "1.70 Carat Pear",
    grade: "F",
    clarity: "VS1",
    cut: "Excellent",
  },
  {
    id: "7",
    title: "2.00 Carat Radiant",
    grade: "E",
    clarity: "VVS1",
    cut: "Excellent",
  },
  {
    id: "8",
    title: "1.40 Carat Heart",
    grade: "D",
    clarity: "VVS2",
    cut: "Very Good",
  },
  {
    id: "9",
    title: "1.95 Carat Marquise",
    grade: "E",
    clarity: "VS1",
    cut: "Excellent",
  },
];

export default async function DiamondDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const diamond = diamonds.find((item) => item.id === id);
  const diamondImg = "/diamond.png";

  return (
    <main className="min-h-screen pt-36 bg-background pb-24">
      <section className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="mb-8 border-b border-border pb-6 flex items-center justify-between">
          <Link
            href="/diamonds"
            className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            <span>&larr;</span> Back To Inventory
          </Link>
          <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground">
             GIA Certified
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* IMAGE GALLERY SECTION */}
          <div className="space-y-4 sticky top-32">
            {/* MAIN IMAGE */}
            <div className="bg-[#f9f9f9] aspect-square flex items-center justify-center p-8 relative group overflow-hidden border border-border">
              <img 
                 src={diamondImg} 
                 alt="Diamond"
                 className="w-full h-full object-contain mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0"
              />
              <div className="absolute top-6 left-6 text-[8px] uppercase font-bold text-background bg-foreground px-3 py-1 tracking-[0.4em]">
                 GIA Certified
              </div>
            </div>
            {/* THUMBNAILS */}
            <div className="grid grid-cols-4 gap-4">
               {[1, 2, 3, 4].map((i) => (
                 <div key={i} className="bg-[#f9f9f9] aspect-square flex items-center justify-center p-4 cursor-pointer border border-border hover:border-primary transition-colors opacity-70 hover:opacity-100">
                   <img 
                     src={diamondImg} 
                     alt={`Thumbnail ${i}`}
                     className="w-full h-full object-contain mix-blend-multiply grayscale hover:grayscale-0 transition-all"
                   />
                 </div>
               ))}
            </div>
          </div>

          {/* DETAILS SECTION */}
          <div className="border border-border p-8 md:p-12 bg-white space-y-12">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] font-bold text-primary mb-4">
                Diamond Detail
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tighter uppercase font-light leading-none mb-6">
                {diamond?.title ?? `Diamond ${id}`}
              </h1>
              <p className="text-[12px] text-muted-foreground uppercase tracking-widest leading-loose">
                 Exceptional cut and polish. This exquisite piece exhibits maximum brilliance and fire, curated for those who demand uncompromising quality.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-y-8 gap-x-12 border-t border-border pt-8">
              <div>
                <p className="text-[8px] uppercase tracking-widest text-muted-foreground">Color Grade</p>
                <p className="text-[12px] uppercase font-bold mt-2 tracking-widest">
                  {diamond?.grade ?? "D"}
                </p>
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-widest text-muted-foreground">Clarity Grade</p>
                <p className="text-[12px] uppercase font-bold mt-2 tracking-widest">
                  {diamond?.clarity ?? "FL"}
                </p>
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-widest text-muted-foreground">Cut Grade</p>
                <p className="text-[12px] uppercase font-bold mt-2 tracking-widest">
                  {diamond?.cut ?? "Excellent"}
                </p>
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-widest text-muted-foreground">Carat Weight</p>
                <p className="text-[12px] uppercase font-bold mt-2 tracking-widest">
                  {diamond?.title ? diamond.title.split(' ')[0] : '1.00'} CT
                </p>
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-widest text-muted-foreground">Polish</p>
                <p className="text-[12px] uppercase font-bold mt-2 tracking-widest">
                  Excellent
                </p>
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-widest text-muted-foreground">Symmetry</p>
                <p className="text-[12px] uppercase font-bold mt-2 tracking-widest">
                  Excellent
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-8 flex flex-col space-y-6">
               <div className="flex justify-between items-center bg-muted/20 p-6 border border-border">
                  <div className="flex flex-col">
                     <span className="text-[8px] uppercase tracking-widest text-muted-foreground mb-1">Pricing</span>
                     <p className="text-[14px] font-bold font-mono tracking-tighter text-foreground">Available to Partners</p>
                  </div>
                  <button className="px-6 py-3 bg-foreground text-background text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-foreground/90 transition-colors">
                     Request Price
                  </button>
               </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
