"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, animate } from "motion/react";
import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CarouselItem {
  id: number | string;
  url: string;
  title: string;
  /** Provide if the item is a video, otherwise it is treated as an image */
  type?: "image" | "video";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const VIDEO_EXTENSIONS = /\.(mp4|webm|ogg|mov|avi|mkv)(\?.*)?$/i;
const CLOUDINARY_VIDEO_RE = /\/video\/upload\//i;

function inferType(url: string): "image" | "video" {
  if (VIDEO_EXTENSIONS.test(url)) return "video";
  if (CLOUDINARY_VIDEO_RE.test(url)) return "video";
  return "image";
}

function resolveType(item: CarouselItem): "image" | "video" {
  return item.type ?? inferType(item.url);
}

// ─── Default demo items ───────────────────────────────────────────────────────

export const defaultItems: CarouselItem[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1471899236350-e3016bf1e69e?q=80&w=880&auto=format&fit=crop",
    title: "Misty Mountain Majesty",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1539552678512-4005a33c64db?q=80&w=880&auto=format&fit=crop",
    title: "Winter Wonderland",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1709983966747-58c311fa6976?q=80&w=880&auto=format&fit=crop",
    title: "Autumn Mountain Retreat",
  },
];

// ─── Thumbnail ────────────────────────────────────────────────────────────────

interface ThumbnailProps {
  item: CarouselItem;
  isActive: boolean;
  onClick: () => void;
}

function Thumbnail({ item, isActive, onClick }: ThumbnailProps) {
  const type = resolveType(item);
  return (
    <button
      onClick={onClick}
      className={`relative shrink-0 h-16 w-16 rounded-md overflow-hidden border-2 transition-all duration-200 focus:outline-none ${
        isActive
          ? "border-white shadow-lg scale-105"
          : "border-white/30 opacity-60 hover:opacity-90 hover:border-white/70"
      }`}
      aria-label={`Go to ${item.title}`}
    >
      {type === "video" ? (
        <>
          {/* Video thumbnail: show a black bg + play icon */}
          <div className="w-full h-full bg-black/80 flex items-center justify-center">
            <PlayCircle className="w-7 h-7 text-white opacity-80" />
          </div>
        </>
      ) : (
        <img
          src={item.url}
          alt={item.title}
          className="w-full h-full object-cover"
          draggable={false}
        />
      )}
    </button>
  );
}

// ─── Main Slide ───────────────────────────────────────────────────────────────

interface MainSlideProps {
  item: CarouselItem;
}

function MainSlide({ item }: MainSlideProps) {
  const type = resolveType(item);

  if (type === "video") {
    return (
      <div className="shrink-0 w-full h-[500px] bg-black flex items-center justify-center">
        <video
          key={item.url}
          src={item.url}
          controls
          autoPlay={false}
          className="max-w-full max-h-full rounded-lg object-contain"
          style={{ maxHeight: "500px" }}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div className="shrink-0 w-full h-[500px]">
      <img
        src={item.url}
        alt={item.title}
        className="w-full h-full object-cover rounded-lg select-none pointer-events-none"
        draggable={false}
      />
    </div>
  );
}

// ─── FramerCarousel ───────────────────────────────────────────────────────────

export function FramerCarousel({
  items: propItems,
}: {
  items?: CarouselItem[];
}) {
  const displayItems =
    propItems && propItems.length > 0 ? propItems : defaultItems;

  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  // Sync x position when index changes
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth || 1;
      animate(x, -index * containerWidth, {
        type: "spring",
        stiffness: 300,
        damping: 30,
      });
    }
  }, [index, x]);

  const goTo = useCallback(
    (i: number) => setIndex(Math.max(0, Math.min(displayItems.length - 1, i))),
    [displayItems.length],
  );

  return (
    <div className="lg:p-10 sm:p-4 p-2 max-w-4xl mx-auto w-full">
      <div className="flex flex-col gap-3">
        {/* ── Main slide area ───────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-lg" ref={containerRef}>
          <motion.div className="flex" style={{ x }}>
            {displayItems.map((item) => (
              <MainSlide key={item.id} item={item} />
            ))}
          </motion.div>

          {/* Prev button */}
          <motion.button
            disabled={index === 0}
            onClick={() => goTo(index - 1)}
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform z-10 ${
              index === 0
                ? "opacity-40 cursor-not-allowed"
                : "bg-white hover:scale-110 hover:opacity-100 opacity-70"
            }`}
          >
            <ChevronLeft className="w-6 h-6 text-black" />
          </motion.button>

          {/* Next button */}
          <motion.button
            disabled={index === displayItems.length - 1}
            onClick={() => goTo(index + 1)}
            className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform z-10 ${
              index === displayItems.length - 1
                ? "opacity-40 cursor-not-allowed"
                : "bg-white hover:scale-110 hover:opacity-100 opacity-70"
            }`}
          >
            <ChevronRight className="w-6 h-6 text-black" />
          </motion.button>

          {/* Dot progress indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-white/20 rounded-xl border border-white/30">
            {displayItems.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-8 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── Thumbnail strip ───────────────────────────────────────────── */}
        {displayItems.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
            {displayItems.map((item, i) => (
              <Thumbnail
                key={item.id}
                item={item}
                isActive={i === index}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Keep named export for backwards compat
export { defaultItems as items };
