import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility for conditionally joining classNames and merging Tailwind utilities safely
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
