CREATE TABLE "anime_cache" (
	"anilist_id" integer PRIMARY KEY,
	"title" text NOT NULL,
	"description" text,
	"cover_image" jsonb,
	"genres" text[] DEFAULT '{}' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"episodes" integer,
	"popularity" integer,
	"average_score" integer,
	"is_adult" boolean,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"banner_image" text,
	"recommendations" jsonb
);
CREATE UNIQUE INDEX "anime_cache_pkey" ON "anime_cache" ("anilist_id");