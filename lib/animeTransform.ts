import { MyAnimeData, SaveAnimeData } from "@/app/type";

export function toSavePayload(data: MyAnimeData): SaveAnimeData {
  return {
    mediaId: data.mediaId,
    status: data.status,
    score: data.score,
    progress: data.progress,
    notes: data.notes,
  };
}
