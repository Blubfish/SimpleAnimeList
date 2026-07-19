CREATE TABLE anime_cache (
    anilist_id INTEGER PRIMARY KEY,   -- unique key, no separate auto-generated id needed
    title TEXT NOT NULL,
    description TEXT,
    image JSONB,
    genres TEXT[] NOT NULL DEFAULT '{}'::text[],
    tags TEXT[] NOT NULL DEFAULT '{}'::text[],
    episodes INTEGER,
    popularity INTEGER,
    average_score INTEGER,
    is_adult BOOLEAN,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);