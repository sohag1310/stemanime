import React, { useState, useEffect } from 'react';
import { ScrapedAnime } from '../types/anime';
import { ScrapedAnimeCard } from './ScrapedAnimeCard';
import { Bookmark, ArrowLeft, Trash2 } from 'lucide-react';

interface StreamWatchlistViewProps {
  onSelectAnime: (anime: ScrapedAnime) => void;
  onBack: () => void;
}

export const StreamWatchlistView: React.FC<StreamWatchlistViewProps> = ({ onSelectAnime, onBack }) => {
  const [savedAnimes, setSavedAnimes] = useState<ScrapedAnime[]>(() => {
    try {
      const saved = localStorage.getItem('toonstream_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const clearWatchlist = () => {
    localStorage.removeItem('toonstream_watchlist');
    setSavedAnimes([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-[#1f222a] hover:bg-zinc-800 rounded-xl border border-white/5 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white font-['Outfit']">My Saved Watchlist</h1>
            <p className="text-xs text-gray-400">Keep track of your favorite series and movies</p>
          </div>
        </div>

        {savedAnimes.length > 0 && (
          <button
            onClick={clearWatchlist}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear List</span>
          </button>
        )}
      </div>

      {savedAnimes.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {savedAnimes.map((anime) => (
            <ScrapedAnimeCard key={anime.mal_id} anime={anime} onSelect={onSelectAnime} />
          ))}
        </div>
      ) : (
        <div className="py-24 bg-[#1f222a] border border-white/5 rounded-2xl p-8 text-center space-y-3">
          <Bookmark className="w-12 h-12 text-gray-500 mx-auto" />
          <h3 className="text-base font-bold text-white">Your watchlist is empty</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Browse through the anime catalog and save titles to watch them anytime.
          </p>
          <button
            onClick={onBack}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Browse Anime
          </button>
        </div>
      )}
    </div>
  );
};
