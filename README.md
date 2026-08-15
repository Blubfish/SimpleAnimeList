## SimpleAnimeList

A simpler, more direct anime list built on the AniList API that solely focuses on anime.

Accessed at https://simpleanimelist.vercel.app.

<img width="1689" height="901" alt="Screenshot 2026-08-15 at 10 44 27 AM" src="https://github.com/user-attachments/assets/7c9edab0-034e-4617-944c-b68a7afc9e64" />


## Motivation

I want to learn Next.js and build a simple anime tracker list (replacing my Google Doc).

## Features

- Get anime recommendations based on ones you've already watched
- View anime details and community ratings/review
- Add, edit, and delete anime
- Search and filter based on anime name, title, genres, etc.
- Share list with others (Don't require an Anilist account)
- Sync with AniList

## Tech Stack

- Next.js (App Router) + TypeScript
- Neon PostgreSQL
- AniList GraphQL API
- Deployed on Vercel
- Tailwind

## Get Started

git clone ...

npm install

npm run dev

## Environment Variables

Create a `.env.local` with:

- `DATABASE_URL` — Neon connection string (create a free project at neon.tech, copy the pooled connection string)
- `NEXT_PUBLIC_CLIENT_ID` / `CLIENT_SECRET` — from your AniList API app (register one at anilist.co/settings/developer)
- `NEXT_PUBLIC_REDIRECT_URL` — must match the redirect URL registered in your AniList app
- `NODE_ENV` — `development` or `production`
