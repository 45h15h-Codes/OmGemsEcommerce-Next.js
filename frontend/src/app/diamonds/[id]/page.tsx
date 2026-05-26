import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

// ─── Fetch diamond data from Laravel API ─────────────────────────────────────
async function getDiamond(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/diamonds/${id}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data ?? data;
  } catch {
    return null;
  }
}

// ─── Dynamic SEO metadata ────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const diamond = await getDiamond(id);

  if (!diamond) {
    return { title: 'Diamond Not Found | Om Gems' };
  }

  const title = `${diamond.carat ?? ''}ct ${diamond.shape ?? 'Diamond'} ${diamond.color ?? ''} ${diamond.clarity ?? ''} | Om Gems`;
  const description = `${diamond.carat ?? ''} carat ${diamond.cut ?? ''} cut ${diamond.color ?? ''} color ${diamond.clarity ?? ''} clarity certified diamond. View details, certification, and pricing.`;

  return {
    title: title.trim(),
    description: description.trim(),
    openGraph: {
      title: title.trim(),
      description: description.trim(),
      images: diamond.image_url ? [diamond.image_url] : [],
    },
  };
}

// ─── Diamond detail page ─────────────────────────────────────────────────────
export default async function DiamondDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const diamond = await getDiamond(id);

  if (!diamond) notFound();

  return (
    <main className="min-h-screen pt-36 bg-background pb-24 selection:bg-primary/20">
      {/* Breadcrumb */}
      <nav className="px-6 md:px-12 lg:px-24 mb-8">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/diamonds" className="hover:text-foreground transition-colors">Diamonds</Link>
          <span>/</span>
          <span className="text-foreground">{diamond.stock_number ?? id}</span>
        </div>
      </nav>

      {/* Diamond Detail */}
      <section className="px-6 md:px-12 lg:px-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image / Video */}
          <div className="aspect-square bg-muted border border-border flex items-center justify-center overflow-hidden">
            {diamond.image_url ? (
              <img
                src={diamond.image_url}
                alt={`${diamond.carat}ct ${diamond.shape} Diamond`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border border-border rotate-45 mx-auto flex items-center justify-center">
                  <span className="text-muted-foreground text-xl -rotate-45">◆</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Diamond Image</p>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div>
              <p className="text-[10px] uppercase font-bold text-primary tracking-[0.3em] mb-4">
                {diamond.shape ?? 'Diamond'} • {diamond.stock_number ?? id}
              </p>
              <h1 className="text-4xl md:text-5xl font-serif tracking-tighter uppercase font-light leading-tight">
                {diamond.carat ?? '--'}ct {diamond.shape ?? 'Diamond'}
              </h1>
            </div>

            {/* 4C Specs */}
            <div className="grid grid-cols-2 gap-6 py-8 border-t border-b border-border">
              {[
                { label: 'Carat', value: diamond.carat ?? '--' },
                { label: 'Cut', value: diamond.cut ?? '--' },
                { label: 'Color', value: diamond.color ?? '--' },
                { label: 'Clarity', value: diamond.clarity ?? '--' },
              ].map((spec) => (
                <div key={spec.label} className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{spec.label}</p>
                  <p className="text-lg font-serif tracking-tight">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              {diamond.certificate_number && (
                <div className="flex justify-between py-3 border-b border-border/50">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Certificate</span>
                  <span className="text-sm">{diamond.lab ?? 'GIA'} #{diamond.certificate_number}</span>
                </div>
              )}
              {diamond.measurements && (
                <div className="flex justify-between py-3 border-b border-border/50">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Measurements</span>
                  <span className="text-sm">{diamond.measurements}</span>
                </div>
              )}
              {diamond.fluorescence && (
                <div className="flex justify-between py-3 border-b border-border/50">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Fluorescence</span>
                  <span className="text-sm">{diamond.fluorescence}</span>
                </div>
              )}
            </div>

            {/* Price / CTA */}
            <div className="pt-4 space-y-4">
              {diamond.price && (
                <p className="text-2xl font-serif tracking-tight">
                  ${Number(diamond.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              )}
              <Link
                href="/contact"
                className="block w-full py-5 bg-foreground text-background text-center text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-foreground/90 transition-all duration-500"
              >
                Inquire About This Diamond
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
