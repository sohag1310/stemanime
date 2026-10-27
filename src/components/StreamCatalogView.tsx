import React, { useState, useEffect } from 'react';
import { ScrapedAnime } from '../types/anime';
import { fetchFeed } from '../services/api';
import { ScrapedAnimeCard } from './ScrapedAnimeCard';
import { Search, Flame, Film, Tv, Sparkles, ChevronLeft, ChevronRight, Play, RefreshCw, AlertCircle } from 'lucide-react';

interface StreamCatalogViewProps {
  onSelectAnime: (anime: ScrapedAnime) => void;
}

export const StreamCatalogView: React.FC<StreamCatalogViewProps> = ({ onSelectAnime }) => {
  const [category, setCategory] = useState<'anime' | 'hindi-dubbed'>('anime');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [animes, setAnimes] = useState<ScrapedAnime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'TV' | 'MOVIE'>('ALL');

  // Load feed whenever category, page, or search changes
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const timer = setTimeout(async () => {
      const data = await fetchFeed(category, page, search);
      if (isMounted) {
        setAnimes(data.animes || []);
        setIsLoading(false);
      }
    }, search ? 400 : 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [category, page, search]);

  const filteredAnimes = animes.filter((a) => {
    if (typeFilter === 'MOVIE') return a.type === 'Movie' || a.isMovie;
    if (typeFilter === 'TV') return a.type !== 'Movie' && !a.isMovie;
    return true;
  });

  const featured = animes.length > 0 ? animes[0] : null;

  return (
    <div className="space-y-8 pb-20">
      {/* 1. High-Energy Hero Marquee Feature */}
      {featured && !search && page === 1 && (
        <section className="relative w-full overflow-hidden bg-black border-b border-white/10 min-h-[460px] md:min-h-[520px] flex items-center">
          <div className="absolute inset-0 z-0">
            <img
              src={
                featured.images?.jpg?.large_image_url ||
                featured.images?.jpg?.image_url ||
                '/src/assets/images/hero_anime_epic_1793052173700.jpg'
              }
              alt={featured.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center scale-105 filter brightness-75 transition-all duration-700"
            />
            {/* Scrim */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#181a20] via-[#181a20]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181a20] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
            <div className="max-w-xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured Streaming Premiere</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-['Outfit'] tracking-tight leading-tight">
                {featured.title}
              </h1>

              <p className="text-xs sm:text-sm text-gray-300 line-clamp-3 leading-relaxed">
                {featured.synopsis ||
                  'Stream the latest episodes with verified ad-filtered servers, high-speed CDN playback, and multi-language audio.'}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => onSelectAnime(featured)}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>Start Streaming</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Search & Category Filter Header */}
        <div className="bg-[#1f222a] border border-white/5 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search anime, movie, or Hindi dubs..."
                className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Category Segmented Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => {
                  setCategory('anime');
                  setPage(1);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  category === 'anime'
                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                    : 'bg-zinc-900 text-gray-300 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>All Anime Feed</span>
              </button>

              <button
                onClick={() => {
                  setCategory('hindi-dubbed');
                  setPage(1);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  category === 'hindi-dubbed'
                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                    : 'bg-zinc-900 text-gray-300 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <span>Hindi Dubbed</span>
              </button>
            </div>
          </div>

          {/* Sub-format filter: All, TV, Movies */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-medium">Format:</span>
              <div className="flex items-center gap-1">
                {(['ALL', 'TV', 'MOVIE'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setTypeFilter(fmt)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      typeFilter === fmt
                        ? 'bg-white/15 text-white font-bold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-gray-400 text-[11px]">
              Page {page} · {filteredAnimes.length} titles verified
            </span>
          </div>
        </div>

        {/* 3. Anime Grid */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-gray-400">Scraping ToonStream verified video feeds...</p>
          </div>
        ) : filteredAnimes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredAnimes.map((anime) => (
              <ScrapedAnimeCard key={anime.mal_id || anime.pageUrl} anime={anime} onSelect={onSelectAnime} />
            ))}
          </div>
        ) : (
          <div className="py-20 bg-[#1f222a] border border-white/5 rounded-2xl p-8 text-center space-y-3">
            <AlertCircle className="w-12 h-12 text-gray-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No titles found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              No verified streams found for this query. Try a different title or reset filters.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setTypeFilter('ALL');
              }}
              className="px-4 py-2 bg-emerald-500 text-black font-bold text-xs rounded-xl hover:bg-emerald-400 transition-colors cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* 4. Pagination Bar */}
        {!search && (
          <div className="flex items-center justify-center gap-3 pt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                page > 1
                  ? 'bg-[#1f222a] border-white/10 text-white hover:bg-zinc-800'
                  : 'bg-zinc-900/50 border-transparent text-gray-600 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Page</span>
            </button>

            <span className="px-3.5 py-2 bg-zinc-900 border border-white/5 rounded-xl text-xs font-bold text-emerald-400 font-mono">
              Page {page}
            </span>

            <button
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1f222a] hover:bg-zinc-800 border border-white/10 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
