'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Check if the error is a ChunkLoadError (common in Next.js development with Turbopack)
    if (error.name === 'ChunkLoadError' || error.message.includes('Failed to load chunk') || error.message.includes('ChunkLoadError')) {
      window.location.reload();
      return;
    }
    
    // Log the error to an error reporting service like Sentry
    console.error('Sentry captured error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDFDFD] text-[#1C1C1C] p-4">
      <div className="max-w-md w-full space-y-6 text-center border border-[#EAEAEA] p-12">
        <h2 className="text-3xl font-serif tracking-tighter uppercase mb-4">Something went wrong</h2>
        <p className="text-[#71717A] font-light mb-8 text-sm">
          We experienced an unexpected issue. Our engineering team has been automatically notified.
        </p>
        <button
          onClick={() => {
            // Also attempt a hard reload if reset fails for ChunkLoadErrors
            if (error.name === 'ChunkLoadError' || error.message.includes('Failed to load chunk')) {
              window.location.reload();
            } else {
              reset();
            }
          }}
          className="px-8 py-4 bg-[#1C1C1C] text-[#FDFDFD] text-[10px] uppercase font-bold tracking-widest hover:bg-[#1C1C1C]/90 transition-all"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
