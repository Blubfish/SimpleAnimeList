import fetchRecommendations from "@/lib/fetchRecommendations";
import Image from "next/image";
import Link from "next/link";
import { MyAnimeData } from "../type";
import { Star } from "lucide-react";
import { sanitizeDescription } from "@/lib/sanitize";

type RecommendedAnimeFormProps = {
  mediaId: number;
  savedAnimeList?: MyAnimeData[];
};
export default async function RecommendedAnimeForm({
  mediaId,
  savedAnimeList = [],
}: RecommendedAnimeFormProps) {
  const recommendedAnime = (await fetchRecommendations(mediaId)) ?? [];

  const mappedRecommendations = (recommendedAnime ?? [])
    .filter((anime: MyAnimeData) => anime !== null)
    .map((anime: MyAnimeData) => ({
      ...anime,
    }));

  const filterRecommendation = mappedRecommendations
    .filter(
      (anime: MyAnimeData) =>
        !anime.isAdult &&
        !savedAnimeList.some((saved) => saved.id === anime.id),
    )
    .slice(0, 12);

  return (
    <section className="rounded-3xl border border-slate-800/80 bg-linear-to-br from-slate-900/80 to-slate-950/80 p-4 sm:p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-orange-500/30 to-amber-500/20 ring-1 ring-orange-400/30">
            <Star className="h-4 w-4 text-orange-300" fill="orange" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">
              You might also like
            </h2>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Based on this anime
            </p>
          </div>
        </div>
        {filterRecommendation.length > 0 && (
          <span className="rounded-full bg-slate-800/70 px-3 py-1 text-xs font-semibold text-slate-300 ring-1 ring-slate-700/60">
            {filterRecommendation.length} suggestions
          </span>
        )}
      </div>

      {filterRecommendation.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6">
          {filterRecommendation.map((anime: MyAnimeData) => (
            <Link
              href={`/animeInfo/${anime.id}`}
              key={anime.id}
              className="group relative rounded-2xl border border-slate-800/80 bg-slate-950/80 p-2 text-left text-slate-300 shadow-lg shadow-black/30 ring-1 ring-transparent transition hover:-translate-y-0.5 hover:border-orange-400/50 hover:shadow-orange-500/10 hover:ring-orange-400/20"
            >
              <div className="relative overflow-hidden rounded-xl bg-slate-800 w-auto h-auto">
                <Image
                  src={
                    anime.coverImage.large || anime.coverImage.extraLarge || ""
                  }
                  alt={anime.title || "Anime cover"}
                  width={120}
                  height={180}
                  className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
              </div>

              <p className="mt-2 line-clamp-2 text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400 group-hover:text-orange-300">
                {anime.title}
              </p>

              <div className="pointer-events-none absolute left-1/2 top-0 z-10 hidden w-60 -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-2xl border border-slate-700/80 bg-slate-950/95 p-3 text-xs text-slate-100 shadow-2xl shadow-black/50 ring-1 ring-black/30 backdrop-blur transition duration-200 group-hover:block">
                <p className="text-xs sm:text-sm font-semibold text-orange-300">
                  {anime.title}
                </p>
                <p
                  className="line-clamp-5 leading-5 text-slate-300"
                  dangerouslySetInnerHTML={{
                    __html:
                      sanitizeDescription(anime.description) ||
                      "No description",
                  }}
                />

                <span
                  aria-hidden
                  className="absolute left-1/2 top-full -mt-px h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-slate-700/80 bg-slate-950/95"
                />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-700/70 bg-slate-900/40 p-8 text-center">
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            No recommendations yet
          </p>
          <p className="mt-1 text-xs text-slate-400">
            We couldn&rsquo;t find similar anime right now. Try again later.
          </p>
        </div>
      )}
    </section>
  );
}
