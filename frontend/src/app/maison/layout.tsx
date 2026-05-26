import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Maison — The Story of Om Gems",
  description:
    "Discover the heritage and values behind Om Gems. From our founding principles to our commitment to ethical sourcing and GIA certification.",
  openGraph: {
    title: "Our Maison | Om Gems",
    description:
      "The heritage, values, and vision behind Om Gems fine jewelry.",
  },
};

export default function MaisonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
