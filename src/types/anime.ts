export type AnimeFormat = 'TV' | 'Movie' | 'OVA' | 'Special';
export type AnimeStatus = 'Airing' | 'Completed' | 'Upcoming';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface Episode {
  id: string;
  number: number;
  season: number;
  title: string;
  titleBn: string;
  duration: string;
  durationSeconds: number;
  thumbnail: string;
  description: string;
  descriptionBn: string;
  videoUrl: string;
  introStart: number;
  introEnd: number;
  outroStart: number;
  releaseDate: string;
}

export interface Character {
  name: string;
  role: 'Main' | 'Supporting';
  voiceActorJp: string;
  voiceActorEn: string;
  voiceActorBn?: string;
  avatarSeed: string;
}

export interface Review {
  id: string;
  user: string;
  avatarSeed: string;
  rating: number;
  timestamp: string;
  content: string;
  likes: number;
  isSpoiler?: boolean;
}

export interface Anime {
  id: string;
  title: string;
  titleBn: string;
  titleJp: string;
  titleRomaji: string;
  bannerImage: string;
  posterImage: string;
  synopsis: string;
  synopsisBn: string;
  score: number;
  ranked: number;
  popularity: number;
  format: AnimeFormat;
  status: AnimeStatus;
  season: string;
  studio: string;
  genres: string[];
  ageRating: string;
  audioTracks: ('Japanese' | 'English' | 'Bengali')[];
  subtitles: string[];
  totalEpisodes: number;
  currentEpisodeCount: number;
  releaseScheduleDay: DayOfWeek;
  releaseScheduleTime: string;
  isFeatured: boolean;
  isTrending: boolean;
  episodes: Episode[];
  characters: Character[];
  reviews: Review[];
}

export interface WatchProgress {
  animeId: string;
  episodeId: string;
  episodeNumber: number;
  progressSeconds: number;
  durationSeconds: number;
  lastWatchedAt: number;
}

// Scraper Engine Types (ToonStream & AniWatch pattern)
export interface ScrapedAnime {
  mal_id: string;
  slug: string;
  title: string;
  title_english?: string;
  pageUrl: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
  };
  score: number;
  type: string;
  category?: string;
  hasVideo?: boolean;
  isMovie?: boolean;
  episodesCount?: number;
  firstEpUrl?: string;
  synopsis?: string;
  genres?: string[];
}

export interface StreamServer {
  name: string;
  url: string;
}

export interface ScrapedEpisode {
  id: number;
  episode: number;
  title: string;
  url: string;
  servers?: StreamServer[];
}

export interface SeriesDetails {
  title: string;
  synopsis: string;
  genres: string[];
  isMovie: boolean;
  episodesCount: number;
  episodes: ScrapedEpisode[];
}
