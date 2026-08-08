type AnimeListCore = {
  entryId: number; // list-entry id
  mediaId: number; // media id
  status: string;
  score: number;
  progress: number;
  notes: string | null;
};

export type SaveAnimeData = Omit<AnimeListCore, "entryId">;

export type SaveResult = {
  success: boolean;
  message?: string;
};

export type MyAnimeData = AnimeListCore & {
  title: string;
  coverImage: { large: string; extraLarge: string };
  genres: string[];
  episodes: number;
  tags: string[];
  isAdult: boolean;
  description: string;
  popularity: number;
  averageScore: number;
  createdAt: number;
  updatedAt: number;
  bannerImage: string;
};
