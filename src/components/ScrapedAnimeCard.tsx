import React, { useState } from 'react';
import { ScrapedAnime } from '../types/anime';
import { Play, Star, Film, Tv, CheckCircle2 } from 'lucide-react';

interface ScrapedAnimeCardProps {
  anime: ScrapedAnime;
  onSelect: (anime: ScrapedAnime) => void;
}

export const ScrapedAnimeCard: React.FC<ScrapedAnimeCardProps> = ({ anime, onSelect }) => {
  const [imgError, setImgError] = useState(false);

  const poster =
    anime.images?.jpg?.large_image_url ||
    anime.images?.jpg?.image_url ||
    '/src/assets/images/hero_anime_epic_1793052173700.jpg';

  return (
    <div
      onClick={() => onSelect(anime)}
      className="group relative flex flex-col bg-[#1f222a] border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer"
    >
      {/* Poster Media Box */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950">
        {!imgError ? (
          <img
            src={poster}
            alt={anime.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-zinc-900 to-zinc-950 text-center">
            <span className="text-emerald-500 font-extrabold text-lg mb-1">ANIME</span>
            <span className="text-xs text-gray-400 line-clamp-2">{anime.title}</span>
          </div>
        )}

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

        {/* Hover Play Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-bold text-gray-200 border border-white/10 flex items-center gap-1">
            {anime.type === 'Movie' ? <Film className="w-3 h-3 text-emerald-400" /> : <Tv className="w-3 h-3 text-emerald-400" />}
            <span>{anime.type || 'TV'}</span>
          </span>
        </div>

        {/* Verified stream badge */}
        {anime.hasVideo && (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-emerald-500/90 text-black font-extrabold text-[10px] flex items-center gap-1 shadow-md">
            <CheckCircle2 className="w-3 h-3" />
            <span>HD Stream</span>
          </div>
        )}

        {/* Bottom floating details */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs font-semibold text-white">
          <span className="flex items-center gap-1 text-amber-400 tabular-nums">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{anime.score ? anime.score.toFixed(1) : '8.5'}</span>
          </span>
          <span className="text-gray-300 text-[11px]">
            {anime.isMovie ? 'Full Movie' : `${anime.episodesCount || 12} Episodes`}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors line-clamp-1" title={anime.title}>
            {anime.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1 line-clamp-1">
            {anime.title_english && anime.title_english !== anime.title ? anime.title_english : 'Sub & Dub Multi-Server'}
          </p>
        </div>

        <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
          <span className="text-emerald-400/90 font-medium">ToonStream Engine</span>
          <span className="text-gray-500">Fast CDN</span>
        </div>
      </div>
    </div>
  );
};
