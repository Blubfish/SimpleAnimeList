import { Eye, Star } from "lucide-react";
import Image from "next/image";
import { statusClasses } from "./colorStyles";

type AnimePreviewProps = {
  title: string;
  score: number;
  status: string;
  notes: string;
  episodes: number;
  progress: number | "";
  coverImage: string;
};

export default function AnimePreview({
  title,
  score,
  status,
  notes,
  episodes,
  progress,
  coverImage,
}: AnimePreviewProps) {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 ring-1 ring-slate-800/60">
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-orange-500/30 to-amber-500/20 ring-1 ring-orange-400/30">
          <Eye className="h-3.5 w-3.5 text-orange-300" />
        </span>
        <div>
          <p className="text-xs sm:text-sm font-semibold text-slate-100">
            Live Preview
          </p>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            See how it will look
          </p>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_70px] sm:grid-cols-[1fr_120px] items-start gap-5">
        <div className="space-y-2 text-xs sm:text-sm text-slate-300">
          <p>
            <span className="font-semibold text-slate-100">Name:</span>{" "}
            {title || <span className="text-slate-500">Not set</span>}
          </p>
          <p>
            <span className="font-semibold text-slate-100">Score:</span>{" "}
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/15 px-2 py-0.5 text-xs font-semibold text-orange-300 ring-1 ring-orange-400/20">
              {score === 10 && <Star className="h-3 w-3" fill="orange" />}
              {score}/10
            </span>
          </p>
          <p>
            <span className="font-semibold text-slate-100">Status:</span>{" "}
            <span
              className={`rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium  ${statusClasses[status] ?? "bg-slate-800 text-slate-300 ring-slate-700"}`}
            >
              {status}
            </span>
          </p>
          <p>
            <span className="font-semibold text-slate-100">Notes:</span>{" "}
            {notes || <span className="text-slate-500">No notes yet</span>}
          </p>

          <p>
            <span className="font-semibold text-slate-100">
              Currently watched episode:{" "}
            </span>{" "}
            {episodes ? (
              <span className="rounded-full px-0.5 py-0.5 text-xs font-medium text-slate-200 ">
                {progress}/{episodes}
              </span>
            ) : (
              <span className="text-slate-500">No episode yet</span>
            )}
          </p>
        </div>

        <div className="relative h-[100px] w-[70px] sm:h-[170px] sm:w-[120px] shrink-0 overflow-hidden rounded-xl bg-slate-800 ring-1 ring-slate-700/80 shadow-lg shadow-black/30">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title || "Selected anime cover"}
              width={120}
              height={170}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-3 text-center text-xs font-semibold text-slate-500">
              No image
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
