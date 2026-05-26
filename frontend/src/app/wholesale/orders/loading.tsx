export default function WholesaleOrdersLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-7 w-48 bg-white/60 animate-pulse rounded" />
        <div className="h-4 w-64 bg-white/40 animate-pulse rounded" />
      </div>
      <div className="bg-white border border-[#eaeaea] overflow-hidden">
        <div className="h-12 bg-[#fafafa] border-b border-[#eaeaea]" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-[#eaeaea]/50">
            <div className="h-4 w-24 bg-[#f0f0f0] animate-pulse rounded" />
            <div className="h-4 w-32 bg-[#f0f0f0] animate-pulse rounded" />
            <div className="h-4 w-20 bg-[#f0f0f0] animate-pulse rounded flex-1" />
            <div className="h-6 w-16 bg-[#f0f0f0] animate-pulse rounded-full" />
            <div className="h-4 w-28 bg-[#f0f0f0] animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
