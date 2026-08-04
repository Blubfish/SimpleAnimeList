import Link from "next/link";
import AnimeList from "./AnimeList";
import StatPanel from "./StatPanel";
import getAnimeList from "@/lib/getMyAnimeList";
import { LogInIcon, LogOutIcon, Share } from "lucide-react";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const userId = cookieStore.get("userId")?.value;
  const myAnimeList = token ? await getAnimeList() : [];
  const authUrl = `https://anilist.co/api/v2/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URL}&response_type=code`;

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

      {token ? (
        <div className="relative mx-auto w-full max-w-6xl space-y-6">
          <div className="rounded-3xl border border-slate-800/80 bg-linear-to-br from-slate-900/80 to-slate-950/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <p className="text-xs sm:text-sm uppercase tracking-[0.28em] text-orange-300/80">
                  My collection
                </p>
                <h1 className="bg-linear-to-r from-slate-100 to-slate-300 bg-clip-text text-4xl font-bold leading-tight text-transparent">
                  Anime List
                </h1>
                <p className="max-w-2xl text-xs sm:text-sm leading-6 text-slate-400">
                  Keep track of what you watched, how you rated it, and what to
                  explore next.
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/viewPage/${userId}`}
                  className="inline-flex items-center justify-center gap-2 rounded-3xl bg-linear-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 shadow-md shadow-orange-500/20 ring-1 ring-orange-300/30 transition hover:brightness-110 hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-orange-300/50"
                >
                  <Share color="black" />
                  Share List
                </Link>
                <Link
                  href="/logout"
                  className="inline-flex items-center justify-center gap-2 rounded-3xl bg-linear-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 shadow-md shadow-orange-500/20 ring-1 ring-orange-300/30 transition hover:brightness-110 hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-orange-300/50"
                >
                  <LogOutIcon color="black" />
                  Log out
                </Link>
              </div>
            </div>
          </div>
          <StatPanel myAnimeList={myAnimeList} />
          <AnimeList animeList={myAnimeList} />
        </div>
      ) : (
        <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center">
          <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <section className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs sm:text-sm uppercase tracking-[0.28em] text-orange-300/80">
                  My collection
                </p>
                <h1 className="bg-linear-to-r from-slate-100 to-slate-300 bg-clip-text text-5xl font-bold leading-tight text-transparent sm:text-6xl">
                  Anime List
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-400">
                  Sign in with AniList to open your watch library, track your
                  progress, and keep your ratings in one focused place.
                </p>
              </div>
              <Link
                href={authUrl}
                className="inline-flex items-center justify-center gap-2 rounded-3xl bg-linear-to-r from-orange-500 to-amber-500 px-5 py-3 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-orange-500/25 ring-1 ring-orange-300/30 transition hover:brightness-110 hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-orange-300/50"
              >
                <LogInIcon color="black" />
                Log in with AniList
              </Link>
            </section>

            <section className="rounded-3xl border border-slate-800/80 bg-linear-to-br from-slate-900/90 to-slate-950/90 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-orange-300/80">
                    Locked
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-100">
                    Your library is waiting
                  </h2>
                </div>
                <span className="rounded-full bg-orange-500/15 px-3 py-1 text-xs font-semibold text-orange-300 ring-1 ring-orange-400/25">
                  AniList
                </span>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4">
                  <p className="text-xs sm:text-sm font-semibold text-slate-200">
                    Sync your anime
                  </p>
                  <p className="mt-1 text-xs sm:text-sm leading-6 text-slate-500">
                    Connect once to view and manage the list tied to your
                    AniList account.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </main>
  );
}
