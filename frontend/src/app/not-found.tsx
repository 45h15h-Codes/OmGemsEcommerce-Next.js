import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background selection:bg-primary/20">
      <div className="text-center space-y-8 px-6">
        {/* Diamond Icon */}
        <div className="w-20 h-20 border border-border rotate-45 mx-auto flex items-center justify-center">
          <span className="text-muted-foreground text-2xl -rotate-45">404</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-serif tracking-tighter uppercase font-light">
            Page Not <span className="italic">Found</span>
          </h1>
          <p className="text-muted-foreground font-light tracking-wide max-w-md mx-auto leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Perhaps you&apos;d like to explore our collections instead.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/"
            className="px-12 py-5 bg-foreground text-background text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-foreground/90 transition-all duration-500"
          >
            Return Home
          </Link>
          <Link
            href="/diamonds"
            className="px-12 py-5 border border-border text-[10px] uppercase font-bold tracking-widest hover:border-foreground transition-all duration-500"
          >
            Browse Diamonds
          </Link>
        </div>
      </div>
    </main>
  );
}
