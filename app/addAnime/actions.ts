"use server";
import { cookies } from "next/headers";

import { MyAnimeData, SaveResult } from "../type";
import { revalidatePath } from "next/cache";
import { toSavePayload } from "@/lib/animeTransform";

const query = `
  mutation ($mediaId: Int, $status: MediaListStatus, $saveMediaListEntryId: Int, $score: Float, $notes: String, $progress: Int) {
    SaveMediaListEntry(mediaId: $mediaId, status: $status, id: $saveMediaListEntryId, score: $score, notes: $notes, progress: $progress) {
      id
    }
  }
`;

export async function handleAdd(formData: MyAnimeData): Promise<SaveResult> {
  const saveData = toSavePayload(formData);
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token")?.value;

  if (!token) {
    return { success: false, message: "Your session expired. Log in again." };
  }

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
  } catch (error) {
    console.error("Request failed:", error);
    return { success: false, message: "Couldn't reach AniList." };
  }

  revalidatePath("/");
  return { success: true };
}
