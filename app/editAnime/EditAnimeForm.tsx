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
  const [deletingConfirmation, setDeletingConfirmation] = useState(false);

  return (
    <>
      {deletingConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-2xl border border-slate-700/60 bg-slate-900/90 p-8 shadow-2xl shadow-black/60 backdrop-blur-xl">
            <div className="pointer-events-none absolute -top-px left-1/2 h-px w-3/4 -translate-x-1/2 bg-linear-to-r from-transparent via-red-400/60 to-transparent" />

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15 ring-1 ring-red-400/30">
              <Trash2Icon className="h-6 w-6 text-red-400" />
            </div>

            <h2 className="text-center text-xl font-bold text-slate-100">
              Delete This Anime ?
            </h2>
            <p className="mt-1 text-center text-xs text-slate-400 sm:text-sm">
              This anime will be delete permanently.
            </p>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={async () => {
                  if (isDeleting) return;
                  setDeleteError(null);
                  setIsDeleting(true);

                  const result = await handleDelete(animeData.entryId);

                  if (!result.success) {
                    setDeleteError(
                      result.message ||
                        "Couldn't delete this anime. Try again.",
                    );
                    setIsDeleting(false);
                    return;
                  }

                  setDeletingConfirmation(false);
                  router.push("/");
                  router.refresh();
                }}
                className=" flex items-center justify-center w-full rounded-lg bg-linear-to-r from-red-500 to-red-400 py-3 text-xs font-semibold text-white shadow-lg shadow-red-500/25 transition hover:from-red-400 hover:to-red-300 hover:shadow-red-400/30 disabled:opacity-60 sm:text-sm"
              >
                <Trash2Icon className="h-4 w-4" />
                {isDeleting ? "Deleting…" : "Delete Anime"}
              </button>

              <button
                onClick={() => setDeletingConfirmation(false)}
                className="w-full rounded-lg py-2.5 text-xs font-medium text-slate-400 transition hover:text-slate-200 sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-orange-500/30 to-amber-500/20 ring-1 ring-orange-400/30">
              <Pencil className="h-4 w-4 text-orange-300" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-100">
                Edit form
              </h2>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Update the saved details
              </p>
            </div>
          </div>

          <div className="flex flex-col-2 flex-wrap items-center gap-3">
            <Link
              href="/"
              className="text-xs inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-orange-500 to-amber-500 px-4 py-2 sm:text-sm font-semibold text-slate-950 shadow-md shadow-orange-500/20 ring-1 ring-orange-300/30 transition hover:brightness-110 hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-orange-300/50"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>

            <button
              type="button"
              disabled={isDeleting}
              onClick={() => setDeletingConfirmation(true)}
              className="text-xs inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-red-500 to-rose-500 px-4 py-2 sm:text-sm font-semibold text-slate-950 shadow-md shadow-red-500/20 ring-1 ring-red-300/30 transition hover:brightness-110 hover:shadow-red-500/40 focus:outline-none focus:ring-2 focus:ring-red-300/50 disabled:opacity-60"
            >
              <Trash2Icon className="h-4 w-4" />
              {isDeleting ? "Deleting…" : "Delete Anime"}
            </button>
          </div>
        </div>

        {deleteError && (
          <div
            role="alert"
            className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-200 sm:text-sm"
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
    </>
  );
}
