"use server";

import { MyAnimeData, SaveResult } from "../type";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { toSavePayload } from "@/lib/animeTransform";

export async function handleGet(mediaId: number) {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;
  const query = `
    query ($mediaId: Int, $userId: Int) {
      MediaList(mediaId: $mediaId, userId: $userId) {
        id
        status
        score
        progress
        notes
        mediaId
        media {
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
          bannerImage
        }
      }
    }
  `;
  const reverseStatusMap: Record<string, string> = {
    CURRENT: "Current",
    PLANNING: "Planning",
    COMPLETED: "Completed",
    REPEATING: "Rewatching",
    PAUSED: "Paused",
    DROPPED: "Dropped",
  };

  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          userId: userId,
          mediaId: mediaId,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || data.errors) {
      console.error("AniList Error details:", data.errors || data);
      return null;
    } else {
      const entry = data.data.MediaList;

      const flattened = entry
        ? {
            id: entry.id,
            mediaId: entry.mediaId,
            status: reverseStatusMap[entry.status],
            score: entry.score,
            progress: entry.progress,
            notes: entry.notes,
            title: entry.media.title.english || entry.media.title.romaji || "",
            coverImage: entry.media.coverImage,
            episodes: entry.media.episodes,
            genres: entry.media.genres,
            tags: entry.media.tags
              .filter((tag: { rank: number }) => tag.rank >= 90)
              .slice(0, 3)
              .map((tag: { name: string }) => tag.name),
            isAdult: entry.media.isAdult,
            description: entry.media.description,
            popularity: entry.media.popularity,
            averageScore: entry.media.averageScore,
            updatedAt: 1,
            createdAt: 1,
            bannerImage: entry.media.bannerImage,
          }
        : null;

      console.log("Successfully Retreive:", flattened);
      return flattened;
    }
  } catch (error) {
    console.error("Request failed:", error);
    return null;
  }
}

export async function handleDelete(id: number): Promise<SaveResult> {
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token")?.value;

  if (!token) {
    return { success: false, message: "Your session expired. Log in again." };
  }

  const query = `
    mutation ($deleteMediaListEntryId: Int) {
        DeleteMediaListEntry(id: $deleteMediaListEntryId) {
          deleted
        }
      }
    `;
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
        variables: {
          deleteMediaListEntryId: id,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || data.errors) {
      console.error("AniList Error details:", data.errors || data);
      return {
        success: false,
        message: data.errors?.[0]?.message || "AniList rejected the delete.",
      };
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Couldn't reach AniList." };
  }
}

export async function handleUpdate(formData: MyAnimeData): Promise<SaveResult> {
  const saveData = toSavePayload(formData);
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token")?.value;

  if (!token) {
    return { success: false, message: "Your session expired. Log in again." };
  }
  const query = `
      mutation ($mediaId: Int, $status: MediaListStatus, $score: Float, $notes: String, $progress: Int) {
        SaveMediaListEntry(mediaId: $mediaId, status: $status, score: $score, notes: $notes, progress: $progress) {
          id
        }
      }
    `;

  try {
    const cleanStatus = (formData.status || "").toLowerCase().trim();
    const statusMap: Record<string, string> = {
      current: "CURRENT",
      planning: "PLANNING",
      completed: "COMPLETED",
      rewatching: "REPEATING",
      paused: "PAUSED",
      dropped: "DROPPED",
    };

    const aniListStatus = statusMap[cleanStatus] || "PLANNING";

    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          status: aniListStatus,
          mediaId: saveData.mediaId,
          score: saveData.score,
          notes: saveData.notes,
          progress: saveData.progress,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || data.errors) {
      console.error("AniList Error details:", data.errors || data);
      return {
        success: false,
        message: data.errors?.[0]?.message || "AniList rejected the save.",
      };
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Request failed:", error);
    return { success: false, message: "Couldn't reach AniList." };
  }
}
