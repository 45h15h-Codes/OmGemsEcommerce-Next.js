import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loose Diamonds — Browse & Filter | Om Gems",
  description:
    "Browse our certified loose diamonds. Filter by shape, carat, cut, color and clarity. GIA certified with full transparency.",
  openGraph: {
    title: "Loose Diamonds | Om Gems",
    description:
      "Browse certified loose diamonds with advanced filtering. GIA certified.",
    images: ["/og-diamonds.jpg"],
  },
};

export default function DiamondsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
