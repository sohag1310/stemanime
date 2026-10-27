import React, { useState } from 'react';
import { useAnime } from '../context/AnimeContext';
import { ANIME_DATABASE } from '../data/animeData';
import { AnimeCard } from './AnimeCard';
import { Bookmark, Clock, Heart, Trash2, Play, ArrowRight, Frown } from 'lucide-react';

export const WatchlistView: React.FC = () => {
  const {
    language,
    watchlist,
    favorites,
    history,
    startWatching,
    setActiveTab,
  } = useAnime();

  const [libraryTab, setLibraryTab] = useState<'watchlist' | 'history' | 'favorites'>('watchlist');

  // Map watchlist IDs to anime objects
  const watchlistAnime = ANIME_DATABASE.filter((a) => watchlist.includes(a.id));
  const favoriteAnime = ANIME_DATABASE.filter((a) => favorites.includes(a.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
            {language === 'bn' ? 'আমার ব্যক্তিগত অ্যানিমে লাইব্রেরি' : 'My Anime Library'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            {language === 'bn'
              ? 'আপনার সংরক্ষিত ওয়াচলিস্ট, পছন্দের অ্যানিমে এবং দেখা পর্বের ইতিহাস'
              : 'Keep track of your saved watchlist, favorited series, and viewing progress.'}
          </p>
        </div>
      </div>

      {/* Library Tabs (Segmented Controls) */}
      <div className="flex items-center gap-2 p-1 bg-[#14161f] border border-white/10 rounded-xl w-fit">
        <button
          onClick={() => setLibraryTab('watchlist')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            libraryTab === 'watchlist'
              ? 'bg-[#ff640a] text-white shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'ওয়াচলিস্ট' : 'Watchlist'}</span>
          <span className="px-1.5 py-0.2 bg-black/30 rounded text-[10px] font-mono">
            {watchlistAnime.length}
          </span>
        </button>

        <button
          onClick={() => setLibraryTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            libraryTab === 'history'
              ? 'bg-[#ff640a] text-white shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'দেখা চালিয়ে যান' : 'Watch History'}</span>
          <span className="px-1.5 py-0.2 bg-black/30 rounded text-[10px] font-mono">
            {history.length}
          </span>
        </button>

        <button
          onClick={() => setLibraryTab('favorites')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            libraryTab === 'favorites'
              ? 'bg-[#ff640a] text-white shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'পছন্দের অ্যানিমে' : 'Favorites'}</span>
          <span className="px-1.5 py-0.2 bg-black/30 rounded text-[10px] font-mono">
            {favoriteAnime.length}
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {libraryTab === 'watchlist' && (
        <div>
          {watchlistAnime.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {watchlistAnime.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#14161f] border border-white/5 rounded-2xl p-8 space-y-4">
              <Bookmark className="w-12 h-12 text-neutral-500 mx-auto" />
              <h3 className="text-base font-bold text-white">
                {language === 'bn' ? 'আপনার ওয়াচলিস্ট ফাঁকা' : 'Your watchlist is currently empty'}
              </h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                {language === 'bn'
                  ? 'ক্যাটালগ থেকে যেকোনো অ্যানিমের বুকমার্ক বাটনে ক্লিক করে এখানে যুক্ত করতে পারেন।'
                  : 'Browse the anime catalog and click the bookmark button on any title to save it for later.'}
              </p>
              <button
                onClick={() => setActiveTab('browse')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff640a] hover:bg-[#e05500] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                <span>{language === 'bn' ? 'ক্যাটালগ দেখুন' : 'Browse Anime'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {libraryTab === 'history' && (
        <div className="space-y-4">
          {history.length > 0 ? (
            history.map((hist) => {
              const anime = ANIME_DATABASE.find((a) => a.id === hist.animeId);
              if (!anime) return null;
              const ep = anime.episodes.find((e) => e.id === hist.episodeId) || anime.episodes[0];
              const percent = Math.min(
                100,
                Math.round((hist.progressSeconds / hist.durationSeconds) * 100)
              );

              return (
                <div
                  key={`${hist.animeId}-${hist.episodeId}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#14161f] border border-white/5 hover:border-[#ff640a]/40 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-28 sm:w-36 aspect-video rounded-lg overflow-hidden bg-black shrink-0 border border-white/10">
                      <img
                        src={ep.thumbnail || anime.bannerImage}
                        alt={ep.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/70">
                        <div
                          className="h-full bg-[#ff640a]"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] text-[#ff640a] font-bold">
                        {language === 'bn' ? `পর্ব ${ep.number}` : `Episode ${ep.number}`} · {percent}% Watched
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-white mt-0.5 line-clamp-1">
                        {language === 'bn' ? anime.titleBn : anime.title}
                      </h4>
                      <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
                        {language === 'bn' ? ep.titleBn : ep.title}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => startWatching(anime, ep)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#ff640a] hover:bg-[#e05500] text-white font-bold text-xs rounded-lg transition-transform hover:scale-105 cursor-pointer whitespace-nowrap self-end sm:self-center"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{language === 'bn' ? 'চালিয়ে যান' : 'Resume'}</span>
                  </button>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 bg-[#14161f] border border-white/5 rounded-2xl p-8 space-y-4">
              <Clock className="w-12 h-12 text-neutral-500 mx-auto" />
              <h3 className="text-base font-bold text-white">
                {language === 'bn' ? 'কোনো ইতিহাস নেই' : 'No watch history yet'}
              </h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                {language === 'bn'
                  ? 'আপনি যখন কোনো পর্ব দেখা শুরু করবেন, আপনার অগ্রগতি এখানে স্বয়ংক্রিয়ভাবে সংরক্ষিত হবে।'
                  : 'Start watching episodes and your playback progress will automatically appear here.'}
              </p>
            </div>
          )}
        </div>
      )}

      {libraryTab === 'favorites' && (
        <div>
          {favoriteAnime.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {favoriteAnime.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#14161f] border border-white/5 rounded-2xl p-8 space-y-4">
              <Heart className="w-12 h-12 text-neutral-500 mx-auto" />
              <h3 className="text-base font-bold text-white">
                {language === 'bn' ? 'পছন্দের তালিকায় কিছু নেই' : 'No favorites added yet'}
              </h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                {language === 'bn'
                  ? 'আপনার প্রিয় অ্যানিমে সিরিজগুলোতে স্টার দিয়ে পছন্দের তালিকায় সংরক্ষণ করুন।'
                  : 'Mark your favorite anime series to quickly jump back anytime.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
