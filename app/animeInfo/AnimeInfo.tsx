import Image from "next/image";
import Link from "next/link";
import { genreClasses, tagClasses } from "@/components/ui/colorStyles";
import { Suspense } from "react";
import UserNotes from "./UserNotes";
import { Star, Users } from "lucide-react";
import { sanitizeDescription } from "@/lib/sanitize";
import { MyAnimeData, MyAnimeDataMetaData } from "../type";

type AnimeInfoProps = {
  mediaId: number;
  metadata: MyAnimeDataMetaData | null;
  targetUserId: number;
  isOnMyAniList: boolean;
  isLogIn: boolean;
  logInUserId: number;
  saved?: MyAnimeData;
};

export default async function AnimeInfo({
  mediaId,
  metadata,
  targetUserId,
  isOnMyAniList,
  isLogIn,
  logInUserId,
  saved,
}: AnimeInfoProps) {
  if (!metadata) {
    return (
      <div className="rounded-3xl border border-slate-800/80 bg-linear-to-br from-slate-900/80 to-slate-950/80 p-8 text-slate-300 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <p className="text-center text-lg font-semibold text-slate-100">
          Anime information could not be loaded.
        </p>
        <p className="mt-3 text-center text-xs sm:text-sm text-slate-400">
          Please try again or go back to the main page.
        </p>
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-3xl bg-linear-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 shadow-md shadow-orange-500/20 ring-1 ring-orange-300/30 transition hover:brightness-110 hover:shadow-orange-500/40"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-linear-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 p-4 sm:p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
      {/* Blurred background */}

      {metadata.bannerImage && (
        <Image
          src={metadata.bannerImage}
          alt=""
          fill
          className="object-cover blur-none"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-slate-950/85" />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start relative z-10">
        <div className="relative shrink-0 mx-auto w-64 lg:mx-0 lg:w-70">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-6 rounded-3xl bg-linear-to-br from-orange-500/30 via-pink-500/20 to-indigo-500/30 blur-2xl"
          />
          <div className="relative overflow-hidden rounded-2xl bg-slate-800 ring-1 ring-slate-700/80 shadow-xl shadow-black/40 w-auto h-auto">
            <Image
              src={
                metadata.coverImage.extraLarge ||
                metadata.coverImage.large ||
                ""
              }
              alt={metadata.title || "Anime cover"}
              width={280}
              height={420}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="space-y-3">
            <p className="text-xs sm:text-sm uppercase tracking-[0.28em] text-orange-300/80">
              Anime details
            </p>
            <h1 className="bg-linear-to-r from-slate-100 to-slate-300 bg-clip-text text-4xl font-bold leading-tight text-transparent">
              {metadata.title || metadata.title}
            </h1>
            <p
              className="max-w-3xl text-base leading-8 text-slate-300/90 sm:text-lg"
              dangerouslySetInnerHTML={{
                __html:
                  sanitizeDescription(metadata.description) || "No description",
              }}
            />
          </div>

          {isLogIn && !isOnMyAniList && logInUserId == targetUserId ? null : (
            <Suspense fallback={null}>
              <UserNotes
                mediaId={Number(mediaId)}
                targetUserId={targetUserId}
                saved={saved}
              />
            </Suspense>
          )}

          <div className="h-px w-full bg-linear-to-r from-transparent via-slate-700/60 to-transparent" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-800/60 p-5 ring-1 ring-slate-700/50 transition">
              <p className="text-xs sm:text-sm uppercase tracking-[0.18em] text-slate-400">
                Genres
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {metadata.genres.length > 0 ? (
                  metadata.genres.map((genre: string) => (
                    <span
                      key={genre}
                      className={`rounded-full ${genreClasses[genre] ?? "bg-slate-800 text-slate-300 ring-slate-700"} px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em]`}
                    >
                      {genre}
                    </span>
                  ))
                ) : (
                  <span className="text-xs sm:text-sm text-slate-400">
                    No genres available
                  </span>
                )}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-800/60 p-5 ring-1 ring-slate-700/50 transition">
              <p className="text-xs sm:text-sm uppercase tracking-[0.18em] text-slate-400">
                Tags
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {metadata.tags.length > 0 ? (
                  metadata.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className={`rounded-full ${tagClasses[tag] || "bg-orange-500/10 text-orange-200 ring-orange-500/20"} px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em]`}
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs sm:text-sm text-slate-400">
                    No tags available
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-2">
            <div className="rounded-2xl bg-slate-800/60 p-5 ring-1 ring-slate-700/50 transition">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-orange-300" />
                <p className="text-xs sm:text-sm uppercase tracking-[0.18em] text-slate-400 ">
                  Popularity
                </p>
              </div>
              <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-2">
                <span className="text-2xl font-bold leading-tight text-orange-300 sm:text-3xl">
                  {metadata.popularity
                    ? metadata.popularity.toLocaleString()
                    : "N/A"}
                </span>
                <span className="text-[11px] uppercase tracking-[0.15em] text-slate-500 sm:text-xs">
                  users watched
                </span>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-800/60 p-5 ring-1 ring-slate-700/50">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-emerald-300" fill="lightGreen" />
                <p className="text-xs sm:text-sm uppercase tracking-[0.18em] text-slate-400">
                  Average Score
                </p>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-emerald-300">
                  {metadata.averageScore
                    ? (metadata.averageScore / 10).toFixed(1)
                    : "N/A"}
                </span>
                <span className="text-xs uppercase tracking-[0.15em] text-slate-500">
                  / 10
                </span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-700/80">
                <div
                  className="h-full rounded-full bg-linear-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.45)]"
                  style={{
                    width: `${metadata.averageScore ? metadata.averageScore : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
