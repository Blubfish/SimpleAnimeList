"use client";

import Image from "next/image";
import { useState } from "react";
import {
  genreClasses,
  tagClasses,
  statusClasses,
} from "@/components/ui/colorStyles";
import Link from "next/link";
import { allStatus, allGenres, allTags } from "@/app/constants/animeOptions";
import FilterForm from "@/components/ui/FilterForm";
import { MyAnimeData } from "@/app/type";
import { Search, Star } from "lucide-react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import getSortAnimeList from "../actions";

type ViewPageForm = {
  viewAnimeList: MyAnimeData[];
};

export default function ViewPageForm({ viewAnimeList }: ViewPageForm) {
  const [listOrder, setListOrder] = useState("");
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState<string[]>([]);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [currentList, setCurrentList] = useState<MyAnimeData[]>(viewAnimeList);
  const filteredAnimeList = currentList.filter(
    (anime) =>
      anime.title.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter.length === 0 || statusFilter.includes(anime.status)) &&
      (tagFilter.length === 0 ||
        anime.tags.some((tag: string) => tagFilter.includes(tag))) &&
      (genreFilter.length === 0 ||
        anime.genres.some((genre: string) => genreFilter.includes(genre))),
  );
  return (
    <section className="rounded-3xl border border-slate-800/80 bg-linear-to-br from-slate-900/80 to-slate-950/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs sm:text-sm uppercase tracking-[0.28em] text-orange-300/80">
            Library
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-100">All anime</h2>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 ring-1 ring-slate-800/60">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100">Filters</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Refine the list by status, genre, or tag
            </p>
          </div>
          <span className="w-fit rounded-full bg-slate-800/70 px-3 py-1 text-xs font-semibold text-slate-300 ring-1 ring-slate-700/60">
            Showing {filteredAnimeList.length} of {viewAnimeList.length}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="space-y-2 col-span-2 xl:col-span-1">
            <label
              htmlFor="searchAnimeName"
              className="block text-xs sm:text-sm font-semibold text-slate-200"
            >
              Search
            </label>
            <input
              id="searchAnimeName"
              type="text"
              placeholder="Search by anime name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-xs sm:text-sm text-slate-100 shadow-sm outline-none transition placeholder:text-slate-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/25"
            />
          </div>
          <div className="space-y-2">
            <p className="block text-xs sm:text-sm font-semibold text-slate-100 ">
              Order
            </p>
            <Combobox
              items={[
                "Score: Low to High",
                "Score: High to Low",

                "Status: A to Z",
                "Status: Z to A",

                "Date Added: Oldest First",
                "Date Added: Newest First",

                "Last Updated: Oldest First",
                "Last Updated: Newest First",

                "English Title (A–Z)",
                "English Title (Z–A)",

                "Popularity: Low to High",
                "Popularity: High to Low",
              ]}
              onValueChange={async (e) => {
                setListOrder(e ?? "");
                setCurrentList(
                  await getSortAnimeList(
                    e ?? "Score: High to Low",
                    viewAnimeList,
                  ),
                );
              }}
              value={listOrder}
            >
              <ComboboxInput
                readOnly
                placeholder="Select List Order"
                className="[&_input::placeholder]:text-slate-500 [&_input::placeholder]:opacity-100 min-h-11 w-full border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 shadow-sm has-[[data-slot=input-group-control]:focus-visible]:border-orange-400 has-[[data-slot=input-group-control]:focus-visible]:ring-2 has-[[data-slot=input-group-control]:focus-visible]:ring-orange-400/25"
              />
              <ComboboxContent className="min-h-11 w-full border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 shadow-sm focus-within:border-red-400 focus-within:ring-orange-400/25">
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem
                      key={item}
                      value={item}
                      className="text-slate-100 data-highlighted:bg-orange-500/15 data-highlighted:text-orange-200"
                    >
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
          <div className="space-y-2">
            <p className="block text-xs sm:text-sm font-semibold text-slate-200">
              Status
            </p>
            <FilterForm
              filterOption={allStatus}
              filterFunction={setStatusFilter}
              placeholder="Choose status..."
              value={statusFilter}
            />
          </div>

          <div className="space-y-2">
            <p className="block text-xs sm:text-sm font-semibold text-slate-200">
              Genres
            </p>
            <FilterForm
              filterOption={allGenres}
              filterFunction={setGenreFilter}
              placeholder="Choose genres..."
              value={genreFilter}
            />
          </div>

          <div className="space-y-2">
            <p className="block text-xs sm:text-sm font-semibold text-slate-200">
              Tags
            </p>
            <FilterForm
              filterOption={allTags}
              filterFunction={setTagFilter}
              placeholder="Choose tags..."
              value={tagFilter}
            />
          </div>
        </div>
      </div>

      {filteredAnimeList.length === 0 &&
      (filteredAnimeList.join("") as string).trim() !== "" ? (
        <div className="rounded-2xl border border-dashed border-slate-700/70 bg-slate-900/40 p-8 text-center">
          <Search className="mx-auto h-12 w-12 text-slate-500" />
          <p className="mt-4 text-slate-300">No anime found for {search}</p>
          <p className="text-xs sm:text-sm text-slate-500">
            Try a different search term
          </p>
        </div>
      ) : filteredAnimeList.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700/70 bg-slate-900/40 p-8 text-center">
          <p className="text-slate-300">No anime yet</p>
          <p className="text-xs sm:text-sm text-slate-500">
            Add your first anime to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filteredAnimeList.map((anime, index) => {
            const genres = anime.genres.filter(Boolean);
            const tags = anime.tags.filter(Boolean);
            const progress = anime.progress;
            const hasEpisodes = anime.episodes > 0;

            return (
              <Link
                key={anime.id}
                className="group block w-full rounded-2xl border border-slate-800/80 bg-slate-950/70 p-3 text-left text-slate-300 shadow-lg shadow-black/30 ring-1 ring-transparent transition hover:-translate-y-0.5 hover:border-orange-400/50 hover:shadow-orange-500/10 hover:ring-orange-400/20"
                href={`/animeInfo/${anime.id}`}
              >
                <div className="flex gap-3 sm:gap-4">
                  <div className="h-[100px] w-[70px] sm:h-42.5 sm:w-30 shrink-0 overflow-hidden rounded-xl bg-slate-800 ring-1 ring-slate-700/80">
                    {anime.coverImage.large ? (
                      <Image
                        src={anime.coverImage.large}
                        alt={anime.title || "Anime cover"}
                        width={120}
                        height={170}
                        className="h-full w-full object-cover"
                        priority={index === 0}
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-500">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                      <h3 className="text-sm sm:text-lg font-bold text-slate-100 group-hover:text-orange-300 break-words">
                        {anime.title}
                      </h3>

                      <span className="w-fit shrink-0 inline-flex items-center gap-1 rounded-full bg-orange-500/15 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-sm font-semibold text-orange-300 ring-1 ring-orange-400/20">
                        {anime.score === 10 && (
                          <Star fill="orange" className="h-3 w-3" />
                        )}
                        {anime.score}/10
                      </span>
                    </div>

                    <div className="mt-1.5 sm:mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <span
                        className={`rounded-full px-2 py-0.5 sm:px-3 sm:py-1 font-medium bg-slate-800 ${statusClasses[anime.status] ?? "bg-slate-800 text-slate-300 ring-slate-700"}`}
                      >
                        {anime.status}
                      </span>

                      {hasEpisodes && (
                        <span className="rounded-full bg-slate-800 px-2 py-0.5 sm:px-3 sm:py-1 font-medium text-slate-300 ring-1 ring-slate-700">
                          {progress}/{anime.episodes} episodes
                        </span>
                      )}
                    </div>
                    <aside className="hidden lg:block">
                      {(genres.length > 0 || tags.length > 0) && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {genres.map((genre: string) => (
                            <span
                              key={`${genre}`}
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${genreClasses[genre] ?? "bg-slate-800 text-slate-300 ring-slate-700"}`}
                            >
                              {genre}
                            </span>
                          ))}

                          {tags.map((tag: string) => (
                            <span
                              key={`${tag}`}
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${tagClasses[tag] ?? "bg-orange-500/10 text-orange-200 ring-orange-500/20"} truncate`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </aside>

                    {anime.notes && (
                      <p className="mt-2 sm:mt-3 line-clamp-3 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-400">
                        {anime.notes}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
