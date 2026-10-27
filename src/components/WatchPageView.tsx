import React from 'react';
import { useAnime } from '../context/AnimeContext';
import { ANIME_DATABASE } from '../data/animeData';
import { AnimePlayer } from './AnimePlayer';
import { EpisodeList } from './EpisodeList';
import { EpisodeComments } from './EpisodeComments';
import { AnimeCard } from './AnimeCard';
import { Bookmark, Heart, Share2, Star, Sparkles } from 'lucide-react';

export const WatchPageView: React.FC = () => {
  const {
    language,
    selectedAnime,
    selectedEpisode,
    startWatching,
    toggleWatchlist,
    toggleFavorite,
    isInWatchlist,
    isFavorite,
  } = useAnime();

  if (!selectedAnime || !selectedEpisode) return null;

  const inWatchlist = isInWatchlist(selectedAnime.id);
  const favorited = isFavorite(selectedAnime.id);

  const displayTitle = language === 'bn' ? (selectedAnime.titleBn || selectedAnime.title) : selectedAnime.title;
  const displayEpTitle = language === 'bn' ? (selectedEpisode.titleBn || selectedEpisode.title) : selectedEpisode.title;
  const displaySynopsis = language === 'bn' ? (selectedAnime.synopsisBn || selectedAnime.synopsis) : selectedAnime.synopsis;

  const relatedAnime = ANIME_DATABASE.filter(
    (a) => a.id !== selectedAnime.id && a.genres.some((g) => selectedAnime.genres.includes(g))
  ).slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert(language === 'bn' ? 'লিঙ্ক কপি করা হয়েছে!' : 'Link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-20">
      {/* 1. Main Streaming Video Player */}
      <section className="relative">
        <AnimePlayer />
      </section>

      {/* 2. Episode & Anime Primary Information */}
      <section className="bg-[#14161f] border border-white/10 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            {/* Japanese Kicker & Season */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#ff640a]">
              <span>{selectedAnime.titleJp}</span>
              <span className="text-neutral-500">·</span>
              <span>{selectedAnime.season}</span>
              <span className="text-neutral-500">·</span>
              <span className="text-neutral-400">{selectedAnime.studio}</span>
            </div>

            {/* Anime & Episode Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
                {displayTitle}
              </h1>
              <h2 className="text-base sm:text-lg font-bold text-[#ff640a] mt-1">
                {language === 'bn'
                  ? `সিজন ${selectedEpisode.season} · পর্ব ${selectedEpisode.number}: ${displayEpTitle}`
                  : `Season ${selectedEpisode.season} · Episode ${selectedEpisode.number}: ${displayEpTitle}`}
              </h2>
            </div>

            {/* Zero-Pill Metadata Line */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-300 font-medium">
              <span className="flex items-center gap-1 text-amber-400 font-bold tabular-nums">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {selectedAnime.score.toFixed(2)}
              </span>
              <span aria-hidden="true" className="text-neutral-500">·</span>
              <span>{selectedAnime.format}</span>
              <span aria-hidden="true" className="text-neutral-500">·</span>
              <span>{selectedAnime.ageRating}</span>
              <span aria-hidden="true" className="text-neutral-500">·</span>
              <span>{selectedAnime.status}</span>
              <span aria-hidden="true" className="text-neutral-500">·</span>
              <span className="text-neutral-400">
                {selectedAnime.genres.join(', ')}
              </span>
            </div>

            {/* Synopsis */}
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed pt-1">
              {displaySynopsis}
            </p>
          </div>

          {/* User Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start">
            <button
              onClick={() => toggleWatchlist(selectedAnime.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                inWatchlist
                  ? 'bg-[#ff640a] border-[#ff640a] text-white'
                  : 'bg-white/5 border-white/10 text-neutral-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${inWatchlist ? 'fill-white' : ''}`} />
              <span>
                {inWatchlist
                  ? (language === 'bn' ? 'ওয়াচলিস্টে সংরক্ষিত' : 'In Watchlist')
                  : (language === 'bn' ? 'ওয়াচলিস্ট' : 'Watchlist')}
              </span>
            </button>

            <button
              onClick={() => toggleFavorite(selectedAnime.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                favorited
                  ? 'bg-rose-600/30 border-rose-500 text-rose-400'
                  : 'bg-white/5 border-white/10 text-neutral-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-400' : ''}`} />
              <span>{favorited ? (language === 'bn' ? 'পছন্দের' : 'Favorited') : (language === 'bn' ? 'পছন্দ' : 'Favorite')}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Share Anime"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Two-Column Layout: Left for Discussion, Right for Episodes Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Episode Reviews & Voice Actors */}
        <div className="lg:col-span-2 space-y-8">
          {/* Discussion */}
          <EpisodeComments anime={selectedAnime} />

          {/* Voice Cast & Characters */}
          <div className="bg-[#14161f] border border-white/5 rounded-2xl p-5">
            <h3 className="font-bold text-lg text-white font-['Outfit'] mb-4">
              {language === 'bn' ? 'প্রধান চরিত্র ও কণ্ঠশিল্পী' : 'Cast & Voice Actors (Seiyuu)'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {selectedAnime.characters.map((char) => (
                <div
                  key={char.name}
                  className="p-3 bg-[#1b1e2b]/50 border border-white/5 rounded-xl flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#ff640a] to-amber-500 flex items-center justify-center text-black font-extrabold text-xs shrink-0">
                    {char.name.slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">{char.name}</h4>
                      <span className="text-[10px] text-[#ff640a] font-semibold">{char.role}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      JP: {char.voiceActorJp} · EN: {char.voiceActorEn}
                    </p>
                    {char.voiceActorBn && (
                      <p className="text-[11px] text-[#ff640a]/90">
                        বাং ডাবিং: {char.voiceActorBn}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Episode Navigator & Related Picks */}
        <div className="space-y-8">
          {/* Episodes Rail */}
          <EpisodeList
            anime={selectedAnime}
            activeEpisode={selectedEpisode}
            onSelectEpisode={(ep) => startWatching(selectedAnime, ep)}
          />

          {/* Recommended Anime Rail */}
          <div className="bg-[#14161f] border border-white/5 rounded-2xl p-5">
            <h3 className="font-bold text-base text-white font-['Outfit'] mb-3">
              {language === 'bn' ? 'সংশ্লিষ্ট প্রস্তাবিত অ্যানিমে' : 'More Like This'}
            </h3>
            <div className="space-y-3">
              {relatedAnime.map((item) => (
                <div
                  key={item.id}
                  onClick={() => startWatching(item)}
                  className="flex items-center gap-3 p-2 rounded-xl bg-[#1b1e2b]/40 hover:bg-[#1b1e2b] border border-white/5 hover:border-[#ff640a]/40 transition-all cursor-pointer group"
                >
                  <div className="w-14 aspect-[3/4] rounded-lg overflow-hidden bg-black shrink-0">
                    <img
                      src={item.posterImage}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white group-hover:text-[#ff640a] transition-colors line-clamp-1">
                      {language === 'bn' ? item.titleBn : item.title}
                    </h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {item.genres[0]} · {item.score.toFixed(1)} ★
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
