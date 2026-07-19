import { cookies } from "next/headers";
import { MyAnimeData } from "@/app/type";

const query = `
query MediaListCollection($type: MediaType, $userId: Int, $sort: [MediaListSort]) {
  MediaListCollection(type: $type, userId: $userId, sort: $sort) {
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
        }
        score
        progress
        status
        notes
      }
    }
  }
}
`;

export default async function getAnimeList(sort: string) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token")?.value;
  const userId = Number((await cookieStore).get("userId")?.value);

  if (!token || !userId) return [];

  const sortOptions: Record<string, string> = {
    "Score: Low to High": "SCORE",
    "Score: High to Low": "SCORE_DESC",

    "Status: A to Z": "STATUS",
    "Status: Z to A": "STATUS_DESC",

    "Date Added: Oldest First": "ADDED_TIME",
    "Date Added: Newest First": "ADDED_TIME_DESC",

    "Last Updated: Oldest First": "UPDATED_TIME",
    "Last Updated: Newest First": "UPDATED_TIME_DESC",

    "English Title (A–Z)": "MEDIA_TITLE_ENGLISH",
    "English Title (Z–A)": "MEDIA_TITLE_ENGLISH_DESC",

    "Popularity: Low to High": "MEDIA_POPULARITY",
    "Popularity: High to Low": "MEDIA_POPULARITY_DESC",
  };

  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { userId, type: "ANIME", sort: sortOptions[sort] },
      }),
    });

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
          id: entry.media.id,
          episodes: entry.media.episodes,
          tags: entry.media.tags
            .filter((tag: { rank: number }) => tag.rank >= 90)
            .slice(0, 3)
            .map((tag: { name: string }) => tag.name),
          progress: entry.progress,
          notes: entry.notes,
        })),
    );
    return allAnime ?? [];
  } catch (error) {
    console.log(error);
    return [];
  }
}
