import { cookies } from "next/headers";
import { MyAnimeData } from "@/app/type";

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

export default async function getAnimeList() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const userId = Number(cookieStore.get("userId")?.value);

  if (!token || !userId) return [];

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
        variables: { userId, type: "ANIME" },
      }),
    });
    if (!response.ok) {
      console.error("Anilist API error:", response.status);
      return [];
    }

    const data = await response.json();

    if (data.errors) {
      console.error("AniList GraphQL error:", data.errors);
      return [];
    }

    if (!data.data?.MediaListCollection) {
      console.error("Unexpected AniList response shape:", data);
      return [];
    }

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
