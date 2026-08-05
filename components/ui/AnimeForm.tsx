"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import fetchAnimeByName from "@/lib/fetchAnimeByName";
import Image from "next/image";
import AnimePreview from "./AnimePreview";
import { MyAnimeData, SaveResult } from "../../app/type";
import { TriangleAlertIcon } from "lucide-react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { allStatus } from "@/app/constants/animeOptions";

type AnimeFormProps = {
  animeData?: MyAnimeData;
  onSubmit: (formData: MyAnimeData) => Promise<SaveResult>;
  savedAnimeList?: MyAnimeData[];
};

export default function AnimeForm({
  animeData,
  onSubmit,
  savedAnimeList = [],
}: AnimeFormProps) {
  const [formData, setFormData] = useState({
    id: animeData?.id ?? 0,
    mediaId: animeData?.mediaId ?? 0,
    status: animeData?.status ?? "Planning",
    score: animeData?.score ?? 1,
    progress: animeData?.progress ?? "",
    notes: animeData?.notes ?? "",
    title: animeData?.title ?? "",
    coverImage: animeData?.coverImage ?? { large: "", extraLarge: "" },
    genres: animeData?.genres ?? [],
    episodes: animeData?.episodes ?? 0,
    tags: animeData?.tags ?? [],
    isAdult: animeData?.isAdult ?? false,
    description: "",
    averageScore: 1,
    popularity: 1,
    updatedAt: 1,
    createdAt: 1,
    bannerImage: animeData?.bannerImage ?? "",
  });
  const router = useRouter();
  const [animeOption, setAnimeOption] = useState<MyAnimeData[]>([]);
  const [showOption, setShowOption] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const filterAnime = animeOption.filter(
    (anime) =>
      !anime.isAdult &&
      !savedAnimeList.some((saved) => saved.id === anime.id) &&
      anime.episodes,
  );

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!formData.title.trim()) {
        setAnimeOption([]);
        return;
      }

      const result = await fetchAnimeByName(formData.title);
      setAnimeOption(result);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [formData.title]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSaving) return;

    setSaveError(null);
    setIsSaving(true);

    try {
      const result = await onSubmit({
        ...formData,
        progress: Number(formData.progress) || 0,
      });

      if (!result.success) {
        setSaveError(result.message || "Couldn't save your anime. Try again.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
      setSaveError("Couldn't save your anime. Try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" id="anime-form">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="animeNameInput"
          className="text-xs sm:text-sm font-semibold text-slate-200"
        >
          Anime Name
        </label>
        <input
          id="animeNameInput"
          type="text"
          placeholder="Enter anime name"
          value={formData.title}
          onChange={(e) => {
            setFormData({ ...formData, title: e.target.value });
            setShowOption(true);
          }}
          onFocus={() => setShowOption(true)}
          onBlur={() => {
            setTimeout(() => {
              setShowOption(false);
            }, 150);
          }}
          className="text-xs sm:text-sm w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/25"
        />
      </div>

      {showOption && animeOption.length > 0 && (
        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-3 ring-1 ring-slate-800/60">
          <p className="mb-3 text-xs sm:text-sm uppercase tracking-[0.18em] text-slate-400">
            Suggestions
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {filterAnime.map((anime: MyAnimeData) => (
              <button
                type="button"
                key={anime.id}
                className="group flex w-full flex-col gap-2 rounded-xl border border-transparent p-2 text-left text-slate-300 transition hover:border-orange-400/40 hover:bg-slate-800/80 hover:text-orange-200"
                onClick={() => {
                  setFormData({
                    ...formData,
                    title: anime.title || "",
                    mediaId: anime.id,
                    coverImage: anime.coverImage,
                    episodes: anime.episodes,
                  });
                  setShowOption(false);
                }}
              >
                <div className="overflow-hidden rounded-lg bg-slate-800 ring-1 ring-slate-700/80">
                  <Image
                    src={anime.coverImage.extraLarge || ""}
                    alt={anime.title || "Anime cover"}
                    width={120}
                    height={170}
                    className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                </div>
                <p className="line-clamp-2 text-xs sm:text-sm font-medium text-slate-200 group-hover:text-orange-200">
                  {anime.title}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            Score
          </p>
          <Combobox
            items={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            onValueChange={(score) =>
              setFormData({ ...formData, score: Number(score) })
            }
            value={formData.score}
          >
            <ComboboxInput
              readOnly
              placeholder="Select a score"
              className=" text-xs sm:text-sm min-h-11 w-full border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 shadow-sm has-[[data-slot=input-group-control]:focus-visible]:border-orange-400 has-[[data-slot=input-group-control]:focus-visible]:ring-2 has-[[data-slot=input-group-control]:focus-visible]:ring-orange-400/25"
            />
            <ComboboxContent className="text-xs sm:text-sm min-h-11 w-full border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 shadow-sm focus-within:border-red-400 focus-within:ring-orange-400/25">
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem
                    key={item}
                    value={item}
                    className="text-slate-100 data-highlighted:bg-orange-500/15 data-highlighted:text-orange-200 text-xs sm:text-sm"
                  >
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            Status
          </p>
          <Combobox
            items={allStatus}
            onValueChange={(status) =>
              setFormData({
                ...formData,
                status: status ?? "",
                progress:
                  status === "Completed"
                    ? formData.episodes
                    : status === "Planning"
                      ? 0
                      : formData.progress,
              })
            }
            value={formData.status}
          >
            <ComboboxInput
              readOnly
              placeholder="Select a status"
              className="text-xs sm:text-sm [&_input::placeholder]:text-slate-500 [&_input::placeholder]:opacity-100 min-h-11 w-full border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 shadow-sm has-[[data-slot=input-group-control]:focus-visible]:border-orange-400 has-[[data-slot=input-group-control]:focus-visible]:ring-2 has-[[data-slot=input-group-control]:focus-visible]:ring-orange-400/25"
            />
            <ComboboxContent className="text-xs sm:text-sm min-h-11 w-full border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 shadow-sm focus-within:border-orange-400 focus-within:ring-orange-400/25">
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList className="max-h-64">
                {(item) => (
                  <ComboboxItem
                    key={item}
                    value={item}
                    className="text-slate-100 data-highlighted:bg-orange-500/15 data-highlighted:text-orange-200 text-xs sm:text-sm"
                  >
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </div>

      {["Current", "Dropped", "Paused"].includes(formData.status) && (
        <div className="flex flex-col gap-2">
          <label
            htmlFor="progressInput"
            className="text-xs sm:text-sm font-semibold text-slate-200"
          >
            Episodes Watched
          </label>
          <input
            id="progressInput"
            type="number"
            min={0}
            max={formData.episodes}
            placeholder="Enter episodes here"
            value={formData.progress}
            onChange={(e) => {
              setFormData({
                ...formData,
                progress: e.target.value,
              });
            }}
            className="text-xs sm:text-sm w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/25"
          ></input>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label
          htmlFor="shortNoteForm"
          className="text-xs sm:text-sm font-semibold text-slate-200"
        >
          Extra notes
        </label>
        <textarea
          id="shortNoteForm"
          placeholder="Add a short notes..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={4}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/25"
        />
      </div>

      <AnimePreview
        title={formData.title}
        score={formData.score}
        status={formData.status}
        notes={formData.notes}
        episodes={formData.episodes}
        progress={Number(formData.progress)}
        coverImage={formData.coverImage.large}
      />

      {saveError && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs sm:text-sm text-red-200"
        >
          <TriangleAlertIcon className="h-5 w-5 shrink-0 text-red-400" />
          <span>{saveError}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSaving}
        className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-linear-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 shadow-md shadow-orange-500/20 ring-1 ring-orange-300/30 transition hover:brightness-110 hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-orange-300/50 disabled:opacity-60"
      >
        {isSaving ? "Saving…" : "Save Anime"}
      </button>
    </form>
  );
}
