import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `${title} Collection | Om Gems`,
    description: `Discover the ${title} collection — curated fine jewelry and certified diamonds from Om Gems.`,
    openGraph: {
      title: `${title} Collection | Om Gems`,
      description: `Explore the ${title} collection from Om Gems.`,
    },
  };
}

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
