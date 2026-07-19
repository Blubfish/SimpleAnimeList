import { cookies } from "next/headers";
import { updateCache, checkCache } from "./animeCache";

export async function fetchAnimeMetaData(mediaId: number) {
  if (!mediaId) return null;

  const cacheData = await checkCache(mediaId);

  const mediaQuery = `
    query ($mediaId: Int) {
      Media(id: $mediaId, type: ANIME) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
          extraLarge
        }
        episodes
        genres
        tags {
          name
          rank
        }
        isAdult
        description
        popularity
        averageScore
      }
    }
  `;

  try {
    const mediaRes =
      cacheData === null
        ? await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              query: mediaQuery,
              variables: { mediaId },
            }),
          })
        : null;

    let mediaData = null;
    let media = null;

    if (mediaRes) {
      mediaData = await mediaRes.json();
      media = mediaData.data?.Media;

      if (!media) {
        console.error("AniList Media Error:", mediaData.errors || mediaData);
        return null;
      }
    }

    const flattened = {
      mediaId: cacheData?.anilist_id ?? media?.id,
      title:
        cacheData?.title || media?.title?.english || media?.title?.romaji || "",
      coverImage: cacheData?.cover_image ?? media?.coverImage ?? {},
      episodes: cacheData?.episodes ?? media?.episodes ?? null,
      genres: cacheData?.genres ?? media?.genres ?? [],
      tags:
        cacheData?.tags ??
        media?.tags
          ?.filter((tag: { rank: number }) => tag.rank >= 90)
          .slice(0, 3)
          .map((tag: { name: string }) => tag.name) ??
        [],
      isAdult: cacheData?.is_adult ?? media?.isAdult ?? false,
      description: cacheData?.description ?? media?.description ?? "",
      popularity: cacheData?.popularity ?? media?.popularity ?? 0,
      averageScore: cacheData?.average_score ?? media?.averageScore ?? 0,
    };

    if (!cacheData) {
      try {
        await updateCache(flattened);
      } catch (err) {
        console.error("cache update failed", err);
      }
    }

    console.log("Successfully Retrieve:", flattened);
    return flattened;
  } catch (error) {
    console.error("Request failed:", error);
    return null;
  }
}

export async function fetchUserListEntry(mediaId: number) {
  if (!mediaId) return null;
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  const token = cookieStore.get("access_token")?.value;

  const listQuery = `
    query ($mediaId: Int, $userId: Int) {
      MediaList(mediaId: $mediaId, userId: $userId) {
        id
        status
        score
        progress
        notes
      }
    }
  `;

  if (!userId) {
    console.error("userId is not available");
    return null;
  }

  const reverseStatusMap: Record<string, string> = {
    CURRENT: "Current",
    PLANNING: "Planning",
    COMPLETED: "Completed",
    REPEATING: "Rewatching",
    PAUSED: "Paused",
    DROPPED: "Dropped",
  };

  try {
    const listRes = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        query: listQuery,
        variables: {
          userId: Number(userId),
          mediaId: mediaId,
        },
      }),
    });

    let entry = null;

    if (listRes) {
      const listData = await listRes.json();
      entry = listData.data?.MediaList;
    }

    const flattened = {
      id: entry?.id ?? null,
      status: entry ? reverseStatusMap[entry.status] : "",
      score: entry ? entry.score : 0,
      progress: entry ? entry.progress : 0,
      notes: entry ? entry.notes : null,
    };

    console.log("Successfully Retrieve:", flattened);
    return flattened;
  } catch (error) {
    console.error("Request failed:", error);
    return null;
  }
}
