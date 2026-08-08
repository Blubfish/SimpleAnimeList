import { fetchUserListEntry } from "@/lib/fetchAnimeById";
import { PencilIcon, Star } from "lucide-react";

type UserNotesProps = {
  mediaId: number;
};

export default async function UserNotes({ mediaId }: UserNotesProps) {
  const entry = await fetchUserListEntry(mediaId);

  if (!entry) return null;

  const hasNotes = Boolean(entry?.notes?.trim());
  const hasScore = Boolean(entry?.score || entry.score == 0);

  if (!hasNotes && !hasScore) return null;

  if (entry?.score > 10) {
    entry.score = entry.score / 10;
  }

  return (
    <div className="rounded-2xl border border-orange-400/20 bg-linear-to-br from-orange-500/10 via-slate-800/60 to-slate-800/60 p-5 ring-1 ring-orange-400/20 shadow-lg shadow-orange-500/10">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-orange-500/30 to-amber-500/20 ring-1 ring-orange-400/30">
            <PencilIcon className="h-3.5 w-3.5 text-orange-300" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-orange-300/80">
              Personal thoughts
            </p>
          </div>
        </div>
        {hasScore && (
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/15 px-2.5 py-1 text-xs sm:text-sm font-semibold text-orange-300 ring-1 ring-orange-400/25">
            {entry.score === 10 && (
              <Star className="h-3.5 w-3.5 fill-current" />
            )}
            {entry.score}/10
          </span>
        )}
      </div>
      {hasNotes && (
        <p className="whitespace-pre-wrap text-base leading-7 text-slate-200">
          {entry.notes}
        </p>
      )}
    </div>
  );
}
