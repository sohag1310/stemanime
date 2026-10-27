import { ScrapedAnime, SeriesDetails, StreamServer } from '../types/anime';

export async function fetchFeed(
  category: string = 'anime',
  page: number = 1,
  search: string = ''
): Promise<{ success: boolean; animes: ScrapedAnime[]; page: number }> {
  try {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('category', category);
    if (search.trim()) params.set('search', search.trim());

    const res = await fetch(`/api/toonstream/feed?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error('Failed to fetch feed:', err);
    return { success: false, animes: [], page: 1 };
  }
}

export async function fetchSeriesDetails(pageUrl: string): Promise<SeriesDetails | null> {
  try {
    const res = await fetch(`/api/toonstream/series?url=${encodeURIComponent(pageUrl)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.success) {
      return {
        title: data.title,
        synopsis: data.synopsis,
        genres: data.genres || [],
        isMovie: data.isMovie || false,
        episodesCount: data.episodesCount || 0,
        episodes: data.episodes || [],
      };
    }
    return null;
  } catch (err: any) {
    console.error('Failed to fetch series details:', err);
    return null;
  }
}

export async function fetchEpisodeServers(
  episodeUrl: string
): Promise<{ success: boolean; servers: StreamServer[]; directUrl?: string }> {
  try {
    const res = await fetch(`/api/toonstream/episode?episodeUrl=${encodeURIComponent(episodeUrl)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      success: data.success,
      servers: data.servers || [],
      directUrl: data.directUrl || episodeUrl,
    };
  } catch (err: any) {
    console.error('Failed to fetch episode servers:', err);
    return {
      success: false,
      servers: [
        { name: 'Backup Server 1', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
      ],
      directUrl: episodeUrl,
    };
  }
}
