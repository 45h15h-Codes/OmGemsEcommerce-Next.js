export default function CollectionsLoading() {
  return (
    <div className="min-h-screen pt-36 bg-background pb-24">
      <div className="px-6 md:px-12 lg:px-24">
        <div className="text-center mb-16 space-y-4">
          <div className="h-3 w-32 bg-muted animate-pulse rounded mx-auto" />
          <div className="h-10 w-72 bg-muted animate-pulse rounded mx-auto" />
          <div className="h-4 w-96 bg-muted animate-pulse rounded mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-square bg-muted animate-pulse border border-border" />
              <div className="space-y-2 px-2">
                <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                <div className="h-3 w-32 bg-muted animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
