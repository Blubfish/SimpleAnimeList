import pool from "./connectDB";
import { animeRecommendation } from "@/app/type";

export async function checkCache(mediaId: number) {
  if (!mediaId) return null;

  const result = await pool.query(
    "SELECT * FROM anime_cache WHERE anilist_id = $1",
    [mediaId],
  );
  const row = result.rows[0];

  if (row) {
    const isFresh =
      Date.now() - row.updated_at.getTime() < 7 * 24 * 60 * 60 * 1000;
    switch (isFresh) {
      case true:
        return result.rows[0];
      case false:
        return null;
    }
  } else {
    return null;
  }
}

export async function updateCache(mediaData: {
  mediaId: number;
  title: string;
  coverImage: {
    large: string;
    extraLarge: string;
  };
  episodes: number | null;
  genres: string[];
  tags: string[];
  isAdult: boolean;
  description: string | null;
  popularity: number;
  averageScore: number;
  bannerImage: string;
  recommendations: animeRecommendation[];
}) {
  await pool.query(
    `INSERT INTO anime_cache (
      anilist_id,
      title,
      cover_image,
      episodes,
      genres,
      tags,
      is_adult,
      description,
      popularity,
      average_score,
      banner_image,
      recommendations,
      updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, now())
    ON CONFLICT (anilist_id) DO UPDATE SET
      title = EXCLUDED.title,
      cover_image = EXCLUDED.cover_image,
      episodes = EXCLUDED.episodes,
      genres = EXCLUDED.genres,
      tags = EXCLUDED.tags,
      is_adult = EXCLUDED.is_adult,
      description = EXCLUDED.description,
      popularity = EXCLUDED.popularity,
      average_score = EXCLUDED.average_score,
      banner_image = EXCLUDED.banner_image,
      recommendations = EXCLUDED.recommendations,
      updated_at = now()`,
    [
      mediaData.mediaId,
      mediaData.title,
      JSON.stringify(mediaData.coverImage),
      mediaData.episodes,
      mediaData.genres,
      mediaData.tags,
      mediaData.isAdult,
      mediaData.description,
      mediaData.popularity,
      mediaData.averageScore,
      mediaData.bannerImage,
      JSON.stringify(mediaData.recommendations),
    ],
  );
}
