import poemsData from "@/data/poems.json";
import type { Poem } from "./types";

export const poems = poemsData as Poem[];

export function getRandomPoem(excludeId?: string | null): Poem {
  const pool = excludeId ? poems.filter((p) => p.id !== excludeId) : poems;
  const source = pool.length > 0 ? pool : poems;
  return source[Math.floor(Math.random() * source.length)];
}

export function getPoemById(id: string): Poem | undefined {
  return poems.find((p) => p.id === id);
}
