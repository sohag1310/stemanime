import React, { createContext, useContext, useState, useEffect } from 'react';
import { Anime, Episode, WatchProgress, Review } from '../types/anime';
import { ANIME_DATABASE } from '../data/animeData';

export type AppLanguage = 'bn' | 'en';
export type NavigationTab = 'home' | 'browse' | 'schedule' | 'watchlist';

interface AnimeContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedAnime: Anime | null;
  selectedEpisode: Episode | null;
  isPlayerOpen: boolean;
  watchlist: string[];
  favorites: string[];
  history: WatchProgress[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  selectedFormat: string;
  setSelectedFormat: (format: string) => void;
  selectedAudio: string;
  setSelectedAudio: (audio: string) => void;
  playbackQuality: string;
  setPlaybackQuality: (q: string) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  subtitleLanguage: string;
  setSubtitleLanguage: (sub: string) => void;
  audioTrack: string;
  setAudioTrack: (audio: string) => void;
  ambientLighting: boolean;
  setAmbientLighting: (val: boolean) => void;
  theaterMode: boolean;
  setTheaterMode: (val: boolean) => void;
  
  // Actions
  toggleWatchlist: (animeId: string) => void;
  toggleFavorite: (animeId: string) => void;
  isInWatchlist: (animeId: string) => boolean;
  isFavorite: (animeId: string) => boolean;
  saveProgress: (animeId: string, episodeId: string, episodeNumber: number, progressSeconds: number, durationSeconds: number) => void;
  getProgress: (animeId: string, episodeId?: string) => WatchProgress | undefined;
  startWatching: (anime: Anime, episode?: Episode) => void;
  closePlayer: () => void;
  playNextEpisode: () => void;
  playPreviousEpisode: () => void;
  selectAnimeDetails: (anime: Anime | null) => void;
  detailedAnime: Anime | null;
  addReview: (animeId: string, reviewText: string, rating: number, isSpoiler?: boolean) => void;
}

const AnimeContext = createContext<AnimeContextType | undefined>(undefined);

export const AnimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>('bn');
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState<boolean>(false);
  const [detailedAnime, setDetailedAnime] = useState<Anime | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [selectedAudio, setSelectedAudio] = useState('All');

  // Player preferences
  const [playbackQuality, setPlaybackQuality] = useState('1080p');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [subtitleLanguage, setSubtitleLanguage] = useState('Bengali');
  const [audioTrack, setAudioTrack] = useState('Japanese');
  const [ambientLighting, setAmbientLighting] = useState(true);
  const [theaterMode, setTheaterMode] = useState(false);

  // Local storage state
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('anistream_watchlist');
      return saved ? JSON.parse(saved) : ['vortex-katana', 'echoes-neo-kyoto'];
    } catch {
      return ['vortex-katana', 'echoes-neo-kyoto'];
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('anistream_favorites');
      return saved ? JSON.parse(saved) : ['dragons-crown'];
    } catch {
      return ['dragons-crown'];
    }
  });

  const [history, setHistory] = useState<WatchProgress[]>(() => {
    try {
      const saved = localStorage.getItem('anistream_history');
      return saved ? JSON.parse(saved) : [
        {
          animeId: 'vortex-katana',
          episodeId: 'vk-ep-1',
          episodeNumber: 1,
          progressSeconds: 720,
          durationSeconds: 1455,
          lastWatchedAt: Date.now() - 3600000,
        },
        {
          animeId: 'echoes-neo-kyoto',
          episodeId: 'enk-ep-1',
          episodeNumber: 1,
          progressSeconds: 430,
          durationSeconds: 1410,
          lastWatchedAt: Date.now() - 86400000,
        }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('anistream_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('anistream_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('anistream_history', JSON.stringify(history));
  }, [history]);

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    if (lang === 'bn') {
      setSubtitleLanguage('Bengali');
    } else {
      setSubtitleLanguage('English');
    }
  };

  const toggleWatchlist = (animeId: string) => {
    setWatchlist(prev => 
      prev.includes(animeId) ? prev.filter(id => id !== animeId) : [...prev, animeId]
    );
  };

  const toggleFavorite = (animeId: string) => {
    setFavorites(prev => 
      prev.includes(animeId) ? prev.filter(id => id !== animeId) : [...prev, animeId]
    );
  };

  const isInWatchlist = (animeId: string) => watchlist.includes(animeId);
  const isFavorite = (animeId: string) => favorites.includes(animeId);

  const saveProgress = (
    animeId: string,
    episodeId: string,
    episodeNumber: number,
    progressSeconds: number,
    durationSeconds: number
  ) => {
    setHistory(prev => {
      const filtered = prev.filter(h => h.animeId !== animeId);
      return [
        {
          animeId,
          episodeId,
          episodeNumber,
          progressSeconds,
          durationSeconds,
          lastWatchedAt: Date.now(),
        },
        ...filtered,
      ];
    });
  };

  const getProgress = (animeId: string, episodeId?: string) => {
    if (episodeId) {
      return history.find(h => h.animeId === animeId && h.episodeId === episodeId);
    }
    return history.find(h => h.animeId === animeId);
  };

  const startWatching = (anime: Anime, episode?: Episode) => {
    const epToPlay = episode || anime.episodes[0];
    setSelectedAnime(anime);
    setSelectedEpisode(epToPlay);
    setIsPlayerOpen(true);
    setDetailedAnime(null); // Close details modal if open
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closePlayer = () => {
    setIsPlayerOpen(false);
  };

  const playNextEpisode = () => {
    if (!selectedAnime || !selectedEpisode) return;
    const currentIndex = selectedAnime.episodes.findIndex(e => e.id === selectedEpisode.id);
    if (currentIndex >= 0 && currentIndex < selectedAnime.episodes.length - 1) {
      setSelectedEpisode(selectedAnime.episodes[currentIndex + 1]);
    }
  };

  const playPreviousEpisode = () => {
    if (!selectedAnime || !selectedEpisode) return;
    const currentIndex = selectedAnime.episodes.findIndex(e => e.id === selectedEpisode.id);
    if (currentIndex > 0) {
      setSelectedEpisode(selectedAnime.episodes[currentIndex - 1]);
    }
  };

  const selectAnimeDetails = (anime: Anime | null) => {
    setDetailedAnime(anime);
  };

  const addReview = (animeId: string, reviewText: string, rating: number, isSpoiler: boolean = false) => {
    const anime = ANIME_DATABASE.find(a => a.id === animeId);
    if (!anime) return;
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      user: 'You (AnimeOtaku)',
      avatarSeed: 'CurrentUser',
      rating,
      timestamp: 'Just now',
      content: reviewText,
      likes: 1,
      isSpoiler,
    };
    anime.reviews.unshift(newRev);
    // force re-render
    if (selectedAnime?.id === animeId) {
      setSelectedAnime({ ...anime });
    }
    if (detailedAnime?.id === animeId) {
      setDetailedAnime({ ...anime });
    }
  };

  return (
    <AnimeContext.Provider
      value={{
        language,
        setLanguage,
        activeTab,
        setActiveTab,
        selectedAnime,
        selectedEpisode,
        isPlayerOpen,
        watchlist,
        favorites,
        history,
        searchQuery,
        setSearchQuery,
        selectedGenre,
        setSelectedGenre,
        selectedFormat,
        setSelectedFormat,
        selectedAudio,
        setSelectedAudio,
        playbackQuality,
        setPlaybackQuality,
        playbackSpeed,
        setPlaybackSpeed,
        subtitleLanguage,
        setSubtitleLanguage,
        audioTrack,
        setAudioTrack,
        ambientLighting,
        setAmbientLighting,
        theaterMode,
        setTheaterMode,
        toggleWatchlist,
        toggleFavorite,
        isInWatchlist,
        isFavorite,
        saveProgress,
        getProgress,
        startWatching,
        closePlayer,
        playNextEpisode,
        playPreviousEpisode,
        selectAnimeDetails,
        detailedAnime,
        addReview,
      }}
    >
      {children}
    </AnimeContext.Provider>
  );
};

export const useAnime = () => {
  const context = useContext(AnimeContext);
  if (!context) {
    throw new Error('useAnime must be used within an AnimeProvider');
  }
  return context;
};
