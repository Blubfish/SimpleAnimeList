"use server";

import { MyAnimeData } from "@/app/type";

export async function getViewAnimeList(userId: number) {
  const query = `
    query MediaListCollection($type: MediaType, $userId: Int) {
      MediaListCollection(type: $type, userId: $userId) {
        lists {
          entries {
            media {
              id
              title {
                romaji
                english
              }
              episodes
              isAdult
              coverImage {
                large
              }
              averageScore
              popularity
              description
              genres
              tags {
                rank
                name
              }
              bannerImage
            }
            score
            progress
            status
            notes
            createdAt
            updatedAt
          }
        }
      }
    }
    `;

  if (!userId) return [];

  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { userId, type: "ANIME" },
      }),
    });
    if (!response.ok) {
      console.error("Anilist API error:", response.status);
      return [];
    }

    const data = await response.json();
    const allAnime: MyAnimeData[] = data.data.MediaListCollection.lists.flatMap(
      (list: { entries: any[] }) =>
        list.entries.map((entry) => ({
          title: entry.media.title.english || entry.media.title.romaji || "",
          score: entry.score,
          status: entry.status
            ? entry.status === "REPEATING"
              ? "Rewatching"
              : entry.status.charAt(0).toUpperCase() +
                entry.status.slice(1).toLowerCase()
            : "",
          coverImage: entry.media.coverImage,
          genres: entry.media.genres,
          mediaId: entry.media.id,
          episodes: entry.media.episodes,
          tags: (entry.media.tags ?? [])
            .filter((tag: { rank: number }) => tag.rank >= 90)
            .slice(0, 3)
            .map((tag: { name: string }) => tag.name),
          progress: entry.progress,
          notes: entry.notes,
          popularity: entry.media.popularity,
          updatedAt: entry.updatedAt,
          createdAt: entry.createdAt,
          bannerImage: entry.media.bannerImage,
        })),
    );
    return allAnime.sort((a, b) => (b.score ?? 0) - (a.score ?? 0)) ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getSortAnimeList(sort: string, animeList: MyAnimeData[]) {
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
