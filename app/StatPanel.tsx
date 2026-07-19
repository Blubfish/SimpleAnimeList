import { MyAnimeData } from "./type";
import {
  Check,
  XIcon,
  RefreshCcw,
  Layers,
  SquareChartGanttIcon,
  Pause,
  EyeIcon,
  SparklesIcon,
} from "lucide-react";

type StatPanelProps = {
  myAnimeList: MyAnimeData[];
};

export default function StatPanel({ myAnimeList }: StatPanelProps) {
  const totalAnime = myAnimeList.length;
  const totalCompleted = myAnimeList.filter(
    (anime) => anime.status === "Completed",
  ).length;
  const totalDropped = myAnimeList.filter(
    (anime) => anime.status === "Dropped",
  ).length;
  const totalPlanned = myAnimeList.filter(
    (anime) => anime.status === "Planning",
  ).length;
  const totalHold = myAnimeList.filter(
    (anime) => anime.status === "Paused",
  ).length;
  const totalWatching = myAnimeList.filter(
    (anime) => anime.status === "Current",
  ).length;
  const totalRewatching = myAnimeList.filter(
    (anime) => anime.status === "Rewatching",
  ).length;
  const totalPerfectScore = myAnimeList.filter(
    (anime) => anime.score === 10,
  ).length;

  return (
    <section className="rounded-3xl border border-slate-800/80 bg-linear-to-br from-slate-900/80 to-slate-950/80 p-4 sm:p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <div className="mb-4 sm:mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs sm:text-sm uppercase tracking-[0.28em] text-orange-300/80">
            Anime summary
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-100">Your stats</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          Total tracked anime and current status breakdown
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-4">
        {[
          {
            label: "Total anime",
            value: totalAnime,
            accent: "bg-orange-500/10 text-orange-300 ring-orange-500/20",
            icon: <Layers />,
            iconColor: "text-orange-300",
          },
          {
            label: "Completed",
            value: totalCompleted,
            accent: "bg-emerald-500/10 text-emerald-200 ring-emerald-500/20",
            icon: <Check />,
            iconColor: "text-emerald-300",
          },
          {
            label: "Dropped",
            value: totalDropped,
            accent: "bg-rose-500/10 text-rose-200 ring-rose-500/20",
            icon: <XIcon />,
            iconColor: "text-rose-300",
          },
          {
            label: "Planning",
            value: totalPlanned,
            accent: "bg-sky-500/10 text-sky-200 ring-sky-500/20",
            icon: <SquareChartGanttIcon />,
            iconColor: "text-sky-300",
          },
          {
            label: "Paused",
            value: totalHold,
            accent: "bg-stone-500/10 text-stone-300 ring-stone-500/20",
            icon: <Pause />,
            iconColor: "text-stone-300",
          },
          {
            label: "Current",
            value: totalWatching,
            accent: "bg-violet-500/10 text-violet-300 ring-violet-500/20",
            icon: <EyeIcon />,
            iconColor: "text-violet-300",
          },
          {
            label: "Rewatching",
            value: totalRewatching,
            accent: "bg-yellow-500/10 text-yellow-300 ring-yellow-500/20",
            icon: <RefreshCcw />,
            iconColor: "text-yellow-300",
          },
          {
            label: "Perfect Score",
            value: totalPerfectScore,
            accent: "bg-pink-500/10 text-pink-300 ring-pink-500/20",
            icon: <SparklesIcon />,
            iconColor: "text-pink-300",
          },
        ].map((item) => (
          <div
            key={item.label}
            className={`rounded-2xl p-3.5 sm:p-5 ring-1 ${item.accent} transition`}
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span
                className={`${item.iconColor} [&_svg]:h-4 [&_svg]:w-4 sm:[&_svg]:h-5 sm:[&_svg]:w-5`}
              >
                {item.icon}
              </span>
              <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.15em] sm:tracking-[0.18em] line-clamp-2 truncate">
                {item.label}
              </p>
            </div>
            <p className="mt-2.5 sm:mt-4 text-2xl sm:text-3xl font-bold text-slate-100">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
