import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Details | Om Gems",
  description:
    "View detailed specifications, media gallery, and pricing for this Om Gems piece. Request a private offer or speak with our concierge.",
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
