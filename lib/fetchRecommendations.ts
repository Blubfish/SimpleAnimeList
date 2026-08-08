export type animeRecommendation = {
  mediaRecommendation: {
    id: number;
    title: {
      romanji?: string;
      english?: string;
    };
    coverImage: {
      large: string;
    };
    genres: string;
  };
};

export default async function fetchRecommendations(mediaId: number) {
  const query = `
    query ($id: Int) {
            Media(id: $id, type: ANIME) {
                id
                title {
                    romaji
                    english
                }
                coverImage {
                    large
                }
                recommendations {
                    nodes {
                        mediaRecommendation {
                            id
                            description(asHtml: true)
                            title {
                                romaji
                                english
                            }
                            coverImage {
                                large
                            }
                            genres
                        }
                    }
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
        variables: { id: mediaId },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error("AniList GraphQL error:", data.errors);
      return [];
    }

    if (!data?.data?.Media) {
      console.error("Unexpected AniList response shape:", data);
      return [];
    }

    const entry = data?.data?.Media?.recommendations?.nodes;

    if (!entry) {
      return [];
    }

    const list = entry
      .map((n: animeRecommendation) => n.mediaRecommendation)
      .filter(Boolean);

    const flattened = list.map((anime: any) => ({
      ...anime,
      title: anime.title.english || anime.title.romaji || "",
      mediaId: anime.id,
    }));

    return flattened;
  } catch (error) {
    console.error(error);
    return [];
  }
}
