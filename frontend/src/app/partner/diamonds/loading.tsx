export default function PartnerDiamondsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-7 w-48 bg-white/60 animate-pulse rounded" />
        <div className="h-4 w-72 bg-white/40 animate-pulse rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-white border border-[#eaeaea] p-4 space-y-3">
            <div className="aspect-square bg-[#f0f0f0] animate-pulse" />
            <div className="h-3 w-20 bg-[#f0f0f0] animate-pulse rounded" />
            <div className="h-4 w-32 bg-[#f0f0f0] animate-pulse rounded" />
            <div className="h-3 w-24 bg-[#f0f0f0] animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
