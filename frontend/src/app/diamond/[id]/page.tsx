import { redirect } from "next/navigation";

export default async function DiamondDetailAliasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/diamonds/${id}`);
}
