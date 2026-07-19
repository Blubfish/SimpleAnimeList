"use client";

import Link from "next/link";
import AnimeForm from "../../components/ui/AnimeForm";
import { handleAdd } from "./actions";
import { MyAnimeData } from "../type";
import { Plus, Home } from "lucide-react";

type AddAnimeFormProps = {
  animeData: MyAnimeData | null;
  savedAnimeList: MyAnimeData[];
};

export default function AddAnimeForm({
  animeData,
  savedAnimeList,
}: AddAnimeFormProps) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-orange-500/30 to-amber-500/20 ring-1 ring-orange-400/30">
            <Plus className="h-4 w-4 text-orange-300" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">New entry</h2>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Fill in your details
            </p>
          </div>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-3xl bg-linear-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 shadow-md shadow-orange-500/20 ring-1 ring-orange-300/30 transition hover:brightness-110 hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-orange-300/50"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <AnimeForm
        onSubmit={handleAdd}
        animeData={animeData ?? undefined}
        savedAnimeList={savedAnimeList}
      />
    </div>
  );
}
