import { Metadata } from "next";

export const metadata: Metadata = {
  title: "High Jewelry — Exceptional Atelier Pieces | Om Gems",
  description:
    "Discover rare, one-of-a-kind high jewelry pieces from the Om Gems atelier. Exceptional craftsmanship meeting extraordinary stones.",
  openGraph: {
    title: "High Jewelry | Om Gems",
    description:
      "Rare, one-of-a-kind atelier pieces. Exceptional craftsmanship meeting extraordinary stones.",
  },
};

export default function HighJewelryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
