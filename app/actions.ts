"use server";

import getAnimeList from "@/lib/getMyAnimeList";

export default async function getSortAnimeList(sort: string) {
  if (!sort) return [];
  const myAnimeList = await getAnimeList(sort);
  return myAnimeList;
}
