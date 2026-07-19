"use client";

import AnimeForm from "../../components/ui/AnimeForm";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { MyAnimeData } from "../type";
import { handleDelete, handleUpdate } from "./actions";
import { Home, Pencil, Trash2Icon, TriangleAlertIcon } from "lucide-react";

type EditAnimePageProps = {
  animeData: MyAnimeData;
  savedAnimeList: MyAnimeData[];
};

export default function EditAnimePage({
  animeData,
  savedAnimeList,
}: EditAnimePageProps) {
  const router = useRouter();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-orange-500/30 to-amber-500/20 ring-1 ring-orange-400/30">
            <Pencil className="h-4 w-4 text-orange-300" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Edit form</h2>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Update the saved details
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-orange-500 to-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-orange-500/20 ring-1 ring-orange-300/30 transition hover:brightness-110 hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-orange-300/50"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>

          <button
            type="button"
            disabled={isDeleting}
            onClick={async () => {
              if (isDeleting) return;
              setDeleteError(null);
              setIsDeleting(true);

              const result = await handleDelete(animeData.id);

              if (!result.success) {
                setDeleteError(
                  result.message || "Couldn't delete this anime. Try again.",
                );
                setIsDeleting(false);
                return;
              }

              router.push("/");
              router.refresh();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-red-500 to-rose-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-red-500/20 ring-1 ring-red-300/30 transition hover:brightness-110 hover:shadow-red-500/40 focus:outline-none focus:ring-2 focus:ring-red-300/50 disabled:opacity-60"
          >
            <Trash2Icon className="h-4 w-4" />
            {isDeleting ? "Deleting…" : "Delete Anime"}
          </button>
        </div>
      </div>

      {deleteError && (
        <div
          role="alert"
          className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          <TriangleAlertIcon className="h-5 w-5 shrink-0 text-red-400" />
          <span>{deleteError}</span>
        </div>
      )}

      <AnimeForm
        animeData={animeData}
        onSubmit={async (animeData) => await handleUpdate(animeData)}
        savedAnimeList={savedAnimeList}
      />
    </div>
  );
}
