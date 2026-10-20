import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { config } from "@/lib/config";
import { getPoemById, poems } from "@/lib/poems";
import { PoemView } from "./PoemView";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return poems.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Poem ${id} — ${config.appName}` };
}

export default async function PoemPage({ params }: Props) {
  const { id } = await params;
  const poem = getPoemById(id);
  if (!poem) notFound();
  return <PoemView poem={poem} />;
}
