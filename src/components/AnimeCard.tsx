import React, { useState } from 'react';
import { Anime } from '../types/anime';
import { useAnime } from '../context/AnimeContext';
import { Play, Bookmark, Star, Info } from 'lucide-react';

interface AnimeCardProps {
  anime: Anime;
  aspect?: 'portrait' | 'landscape';
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, aspect = 'portrait' }) => {
  const {
    language,
    startWatching,
    selectAnimeDetails,
    toggleWatchlist,
    isInWatchlist,
    getProgress,
  } = useAnime();

  const [imageError, setImageError] = useState(false);
  const inWatchlist = isInWatchlist(anime.id);
  const progress = getProgress(anime.id);

  const displayTitle = language === 'bn' ? (anime.titleBn || anime.title) : anime.title;
  const progressPercent = progress
    ? Math.min(100, Math.round((progress.progressSeconds / progress.durationSeconds) * 100))
    : 0;

  return (
    <div className="group relative flex flex-col bg-[#14161f] border border-white/5 rounded-xl overflow-hidden hover:border-[#ff640a]/40 transition-all duration-300">
      {/* Media Container */}
      <div
        className={`relative w-full overflow-hidden bg-[#1d202d] ${
          aspect === 'landscape' ? 'aspect-video' : 'aspect-[3/4]'
        }`}
      >
        {!imageError ? (
          <img
            src={aspect === 'landscape' ? anime.bannerImage : anime.posterImage}
            alt={displayTitle}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#1a1c26] to-[#0c0d12] text-center">
            <span className="text-[#ff640a] font-black text-xl mb-1">ANI</span>
            <span className="text-xs text-neutral-400 line-clamp-2">{displayTitle}</span>
          </div>
        )}

        {/* Measured Scrim for Media Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

        {/* Quick action overlay on hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={() => startWatching(anime)}
            className="w-12 h-12 rounded-full bg-[#ff640a] hover:bg-[#e05500] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
            title={language === 'bn' ? 'চালিয়ে দেখুন' : 'Watch Now'}
            aria-label="Play anime"
          >
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </button>
          <button
            onClick={() => selectAnimeDetails(anime)}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
            title={language === 'bn' ? 'বিস্তারিত' : 'Details'}
            aria-label="Anime details"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Bookmark Quick Toggle in Corner */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWatchlist(anime.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer ${
            inWatchlist
              ? 'bg-[#ff640a] text-white'
              : 'bg-black/60 text-white/80 hover:bg-black/80 hover:text-white'
          }`}
          title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          aria-label="Toggle Watchlist"
        >
          <Bookmark className={`w-4 h-4 ${inWatchlist ? 'fill-white' : ''}`} />
        </button>

        {/* Watch Progress bar if in progress */}
        {progressPercent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60">
            <div
              className="h-full bg-[#ff640a]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Info Body */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Zero-Pill Metadata line with separators */}
          <div className="flex items-center gap-2 text-[12px] text-neutral-400 mb-1.5 font-medium">
            <span>{anime.format}</span>
            <span aria-hidden="true">·</span>
            <span>{anime.genres[0]}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-amber-400 font-semibold tabular-nums">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {anime.score.toFixed(1)}
            </span>
          </div>

          {/* Anime Title */}
          <h3
            onClick={() => selectAnimeDetails(anime)}
            className="font-bold text-sm text-white group-hover:text-[#ff640a] transition-colors line-clamp-1 cursor-pointer"
            title={displayTitle}
          >
            {displayTitle}
          </h3>

          {/* Subtitle / Season info */}
          <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
            {anime.studio}
          </p>
        </div>

        {/* Quiet audio & episode status line */}
        <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
          <span>
            {anime.status === 'Completed'
              ? (language === 'bn' ? `${anime.totalEpisodes} পর্ব সমাপ্ত` : `${anime.totalEpisodes} Ep Completed`)
              : (language === 'bn' ? `পর্ব ${anime.currentEpisodeCount}/${anime.totalEpisodes}` : `Ep ${anime.currentEpisodeCount}/${anime.totalEpisodes}`)}
          </span>
          <span className="text-neutral-500">
            {anime.audioTracks.includes('Bengali') ? 'Sub · Dub · বাং' : 'Sub · Dub'}
          </span>
        </div>
      </div>
    </div>
  );
};
