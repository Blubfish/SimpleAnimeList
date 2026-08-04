"use server";

import { MyAnimeData } from "./type";

export default async function getSortAnimeList(
  sort: string,
  animeList: MyAnimeData[],
) {
  switch (sort) {
    case "Score: Low to High":
      return animeList.toSorted((a, b) => a.score - b.score);
    case "Score: High to Low":
      return animeList.toSorted((a, b) => b.score - a.score);
    case "Status: A to Z":
      return animeList.toSorted((a, b) => a.status.localeCompare(b.status));
    case "Status: Z to A":
      return animeList.toSorted((a, b) => b.status.localeCompare(a.status));
    case "Date Added: Oldest First":
      return animeList.toSorted((a, b) => a.createdAt - b.createdAt);
    case "Date Added: Newest First":
      return animeList.toSorted((a, b) => b.createdAt - a.createdAt);
    case "Last Updated: Oldest First":
      return animeList.toSorted((a, b) => a.updatedAt - b.updatedAt);
    case "Last Updated: Newest First":
      return animeList.toSorted((a, b) => b.updatedAt - a.updatedAt);
    case "English Title (A–Z)":
      return animeList.toSorted((a, b) => a.title.localeCompare(b.title));
    case "English Title (Z–A)":
      return animeList.toSorted((a, b) => b.title.localeCompare(a.title));
    case "Popularity: Low to High":
      return animeList.toSorted((a, b) => a.popularity - b.popularity);
    case "Popularity: High to Low":
      return animeList.toSorted((a, b) => b.popularity - a.popularity);
    default:
      return animeList.toSorted((a, b) => b.score - a.score);
  }
}
