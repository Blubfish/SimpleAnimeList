import { cookies } from "next/headers";
import { getViewAnimeList } from "../actions";
import ViewPageForm from "../ViewPageForm";
import CopyUrlButton from "@/components/ui/CopyURLButton";
import { Home, LogInIcon } from "lucide-react";
import Link from "next/link";
import StatPanel from "@/app/StatPanel";

export default async function ViewPage({
  params,
}: {
  params: Promise<{ viewedUserId: string }>;
}) {
  const { viewedUserId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const viewAnimeList = await getViewAnimeList(Number(viewedUserId));

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
      <div className="relative mx-auto w-full max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-800/80 bg-linear-to-br from-slate-900/80 to-slate-950/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs sm:text-sm uppercase tracking-[0.28em] text-orange-300/80">
                Collection
              </p>
              <h1 className="bg-linear-to-r from-slate-100 to-slate-300 bg-clip-text text-4xl font-bold leading-tight text-transparent">
                Anime List
              </h1>
              <p className="max-w-2xl text-xs sm:text-sm leading-6 text-slate-400">
                Viewing other people list. Log in with anilist to start your
                list today.
              </p>
            </div>
            <div className="flex gap-2">
              {token ? (
                <>
                  <Link
                    href={"/"}
                    className="inline-flex items-center justify-center gap-2 rounded-3xl bg-linear-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 shadow-md shadow-orange-500/20 ring-1 ring-orange-300/30 transition hover:brightness-110 hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-orange-300/50"
                  >
                    <Home className="h-4 w-4" />
                    Back to Home
                  </Link>
                  <CopyUrlButton />
                </>
              ) : (
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-3xl bg-linear-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 shadow-md shadow-orange-500/20 ring-1 ring-orange-300/30 transition hover:brightness-110 hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-orange-300/50"
                >
                  <LogInIcon className="h-4 w-4" />
                  Log in
                </Link>
              )}
            </div>
          </div>
        </div>
        <StatPanel myAnimeList={viewAnimeList} />
        <ViewPageForm viewAnimeList={viewAnimeList} />
      </div>
    </main>
  );
}
