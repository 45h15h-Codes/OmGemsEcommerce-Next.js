"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-8 select-none">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest border border-border hover:border-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
      >
        ← Previous
      </button>

      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest border border-border hover:border-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
      >
        Next →
      </button>
    </div>
  );
}
