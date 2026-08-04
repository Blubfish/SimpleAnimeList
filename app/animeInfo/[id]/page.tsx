import Link from "next/link";
import BackButton from "@/components/ui/BackButton";
import getAnimeList from "@/lib/getMyAnimeList";
import RecommendedAnimeForm from "../RecommendedAnimeForm";
import AnimeInfo from "../AnimeInfo";
import { MyAnimeData } from "@/app/type";
import { Home, Pencil, Plus, List } from "lucide-react";
import { cookies } from "next/headers";

export default async function animeInfo({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const userId = cookieStore.get("userId")?.value;
  const isLoggedIn = Boolean(accessToken);

  const list = isLoggedIn ? await getAnimeList() : [];
  const saved = list.find((a: MyAnimeData) => a.id === Number(id));
  const isOnMyAniList = Boolean(saved);

  const ctaButtonClass =
    "inline-flex items-center justify-center gap-2 rounded-3xl bg-linear-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 shadow-md shadow-orange-500/20 ring-1 ring-orange-300/30 transition hover:brightness-110 hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-orange-300/50";

  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-950 via-slate-950 to-indigo-950 px-4 py-6 sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-800/80 bg-linear-to-br from-slate-900/80 to-slate-950/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs sm:text-sm uppercase tracking-[0.28em] text-orange-300/80">
                Recommended anime detail
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-slate-100">
                  Anime information
                </h1>
                {accessToken && (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                      isOnMyAniList
                        ? "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30"
                        : "bg-slate-700/40 text-slate-300 ring-slate-600/40"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isOnMyAniList ? "bg-emerald-400" : "bg-slate-400"
                      }`}
                    />
                    {isOnMyAniList ? "In your list" : "Not in your list"}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <BackButton />

              {isLoggedIn ? (
                isOnMyAniList ? (
                  <>
                    <Link href="/" className={ctaButtonClass}>
                      <Home className="h-4 w-4" />
                      Back to Home
                    </Link>
                    <Link href={`/editAnime/${id}`} className={ctaButtonClass}>
                      <Pencil className="h-4 w-4" /> Edit Anime
                    </Link>
                  </>
                ) : (
                  <Link
                    href={{ pathname: "/addAnime", query: { id } }}
                    className={ctaButtonClass}
                  >
                    <Plus className="h-4 w-4" /> Add Anime
                  </Link>
                )
              ) : (
                <Link href={`/viewPage/${userId}`} className={ctaButtonClass}>
                  <List className="h-4 w-4" />
                  Back to List
                </Link>
              )}
            </div>
          </div>
        </div>

        <AnimeInfo id={Number(id)} />

        {isLoggedIn && isOnMyAniList ? (
          <RecommendedAnimeForm mediaId={Number(id)} savedAnimeList={list} />
        ) : (
          <RecommendedAnimeForm mediaId={Number(id)} />
        )}
      </div>
    </main>
  );
}
