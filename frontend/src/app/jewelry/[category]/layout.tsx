import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const title = category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `${title} Collection | Om Gems`,
    description: `Browse our ${title.toLowerCase()} collection. Fine jewelry handcrafted with certified stones and precious metals.`,
    openGraph: {
      title: `${title} | Om Gems`,
      description: `Explore the ${title.toLowerCase()} collection from Om Gems.`,
    },
  };
}

export default function JewelryCategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
