export default async function fetchAnimeByName(title: string) {
  const query = `
      query ($search: String) {
        Page(perPage: 8) {
          media(search: $search, type: ANIME) {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              extraLarge
              large
            }
            isAdult
            episodes
          }
        }
      }
    `;

  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
        variables: { search: title },
      }),
    });

    const data = await response.json();

    const media = data?.data?.Page.media ?? [];
    return media.map((anime: any) => ({
      ...anime,
      title:
        anime.title?.english ??
        anime.title?.romaji ??
        anime.title?.native ??
        "",
      mediaId: anime.id,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}
