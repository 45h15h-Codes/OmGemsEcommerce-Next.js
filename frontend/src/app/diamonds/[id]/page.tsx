import Link from "next/link";

const diamonds = [
  { id: "1", title: "1.50 Carat Round", grade: "D", clarity: "VVS1", cut: "Excellent" },
  { id: "2", title: "2.10 Carat Princess", grade: "E", clarity: "VVS1", cut: "Excellent" },
  { id: "3", title: "1.80 Carat Cushion", grade: "F", clarity: "VVS2", cut: "Excellent" },
  { id: "4", title: "2.25 Carat Emerald", grade: "D", clarity: "VS1", cut: "Excellent" },
  { id: "5", title: "1.30 Carat Oval", grade: "E", clarity: "VVS2", cut: "Very Good" },
  { id: "6", title: "1.70 Carat Pear", grade: "F", clarity: "VS1", cut: "Excellent" },
  { id: "7", title: "2.00 Carat Radiant", grade: "E", clarity: "VVS1", cut: "Excellent" },
  { id: "8", title: "1.40 Carat Heart", grade: "D", clarity: "VVS2", cut: "Very Good" },
  { id: "9", title: "1.95 Carat Marquise", grade: "E", clarity: "VS1", cut: "Excellent" },
];

export default async function DiamondDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const diamond = diamonds.find((item) => item.id === id);

  return (
    <main className="min-h-screen pt-36 bg-background pb-24">
      <section className="max-w-5xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="mb-8">
          <Link
            href="/diamonds"
            className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            Back To Inventory
          </Link>
        </div>

        <div className="border border-border p-8 md:p-12 bg-white space-y-8">
          <p className="text-[10px] uppercase tracking-[0.35em] font-bold text-primary">
            Diamond Detail
          </p>

          <h1 className="text-4xl md:text-6xl font-serif tracking-tighter uppercase font-light">
            {diamond?.title ?? `Diamond ${id}`}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-border pt-8">
            <div>
              <p className="text-[8px] uppercase tracking-widest text-muted-foreground">Color</p>
              <p className="text-[10px] uppercase font-bold mt-2">
                {diamond?.grade ?? "Contact Concierge"}
              </p>
            </div>
            <div>
              <p className="text-[8px] uppercase tracking-widest text-muted-foreground">Clarity</p>
              <p className="text-[10px] uppercase font-bold mt-2">
                {diamond?.clarity ?? "Contact Concierge"}
              </p>
            </div>
            <div>
              <p className="text-[8px] uppercase tracking-widest text-muted-foreground">Cut</p>
              <p className="text-[10px] uppercase font-bold mt-2">
                {diamond?.cut ?? "Contact Concierge"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
