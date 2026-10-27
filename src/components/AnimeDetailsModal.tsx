import React, { useState } from 'react';
import { Anime } from '../types/anime';
import { useAnime } from '../context/AnimeContext';
import { X, Play, Bookmark, Star, Users, Film, Sparkles } from 'lucide-react';

interface AnimeDetailsModalProps {
  anime: Anime;
  onClose: () => void;
}

export const AnimeDetailsModal: React.FC<AnimeDetailsModalProps> = ({ anime, onClose }) => {
  const {
    language,
    startWatching,
    toggleWatchlist,
    isInWatchlist,
  } = useAnime();

  const [activeTab, setActiveTab] = useState<'overview' | 'characters' | 'episodes'>('overview');
  const inWatchlist = isInWatchlist(anime.id);

  const displayTitle = language === 'bn' ? (anime.titleBn || anime.title) : anime.title;
  const displaySynopsis = language === 'bn' ? (anime.synopsisBn || anime.synopsis) : anime.synopsis;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      <div
        className="relative w-full max-w-4xl bg-[#12141c] border border-white/10 rounded-2xl overflow-hidden shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner with Scrim */}
        <div className="relative h-56 sm:h-72 w-full bg-[#181a24] overflow-hidden">
          <img
            src={anime.bannerImage}
            alt={displayTitle}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12141c] via-[#12141c]/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors border border-white/10 cursor-pointer z-10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Banner bottom info */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <p className="text-xs text-[#ff640a] font-bold tracking-wider uppercase mb-1">
                {anime.titleJp} · {anime.season}
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {displayTitle}
              </h2>
            </div>

            {/* Score box */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-amber-500/30 text-amber-400 font-bold text-sm">
              <Star className="w-4 h-4 fill-amber-400" />
              <span className="tabular-nums">{anime.score.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Modal Tab Navigator */}
        <div className="flex items-center gap-6 px-6 border-b border-white/10 bg-[#151722] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'overview'
                ? 'border-[#ff640a] text-[#ff640a]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'সারসংক্ষেপ (Overview)' : 'Overview'}
          </button>
          <button
            onClick={() => setActiveTab('episodes')}
            className={`py-3.5 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'episodes'
                ? 'border-[#ff640a] text-[#ff640a]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? `পর্বসমূহ (${anime.episodes.length})` : `Episodes (${anime.episodes.length})`}
          </button>
          <button
            onClick={() => setActiveTab('characters')}
            className={`py-3.5 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'characters'
                ? 'border-[#ff640a] text-[#ff640a]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'চরিত্র ও কণ্ঠশিল্পী (Seiyuu)' : 'Characters & Voice Actors'}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Zero-Pill Metadata row */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 font-medium">
                <span>{anime.format}</span>
                <span aria-hidden="true">·</span>
                <span>{anime.ageRating}</span>
                <span aria-hidden="true">·</span>
                <span>{anime.studio}</span>
                <span aria-hidden="true">·</span>
                <span>{anime.status}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#ff640a]">
                  {anime.audioTracks.join(', ')} Audio
                </span>
              </div>

              {/* Synopsis */}
              <div>
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                  {language === 'bn' ? 'কাহিনী সংক্ষেপ' : 'Synopsis'}
                </h4>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {displaySynopsis}
                </p>
              </div>

              {/* Genres list */}
              <div>
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                  {language === 'bn' ? 'জঁরা (Genres)' : 'Genres'}
                </h4>
                <div className="flex flex-wrap gap-2 text-xs text-neutral-300">
                  {anime.genres.map((g, idx) => (
                    <span key={g}>
                      {g}
                      {idx < anime.genres.length - 1 && <span className="text-neutral-600 ml-2">/</span>}
                    </span>
                  ))}
                </div>
              </div>

              {/* Primary Actions inside modal */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    startWatching(anime);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#ff640a] hover:bg-[#e05500] text-white font-bold text-xs sm:text-sm rounded-lg transition-transform hover:scale-105 cursor-pointer shadow-lg"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>
                    {language === 'bn' ? 'পর্ব ১ থেকে দেখা শুরু করুন' : 'Start Watching Episode 1'}
                  </span>
                </button>

                <button
                  onClick={() => toggleWatchlist(anime.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold border transition-colors cursor-pointer ${
                    inWatchlist
                      ? 'bg-white/20 border-white/40 text-white'
                      : 'bg-white/5 border-white/20 text-neutral-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${inWatchlist ? 'fill-white' : ''}`} />
                  <span>
                    {inWatchlist
                      ? (language === 'bn' ? 'সংরক্ষিত' : 'In Watchlist')
                      : (language === 'bn' ? 'ওয়াচলিস্টে যোগ' : 'Add to Watchlist')}
                  </span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'episodes' && (
            <div className="space-y-3">
              {anime.episodes.map((ep) => (
                <div
                  key={ep.id}
                  onClick={() => {
                    startWatching(anime, ep);
                    onClose();
                  }}
                  className="flex items-center gap-4 p-3 bg-[#171a25] hover:bg-[#1f2231] border border-white/5 hover:border-[#ff640a]/40 rounded-xl transition-all cursor-pointer group"
                >
                  <div className="relative w-28 aspect-video rounded-lg overflow-hidden bg-black shrink-0">
                    <img
                      src={ep.thumbnail || anime.bannerImage}
                      alt={ep.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] text-[#ff640a] font-bold">
                      <span>{language === 'bn' ? `পর্ব ${ep.number}` : `EP ${ep.number}`}</span>
                      <span className="text-neutral-500 font-normal">·</span>
                      <span className="text-neutral-400 font-normal">{ep.duration}</span>
                    </div>
                    <h5 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#ff640a] transition-colors line-clamp-1">
                      {language === 'bn' ? ep.titleBn : ep.title}
                    </h5>
                    <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                      {language === 'bn' ? ep.descriptionBn : ep.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'characters' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {anime.characters.map((char) => (
                <div
                  key={char.name}
                  className="p-3.5 bg-[#171a25] border border-white/5 rounded-xl flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff640a] to-amber-500 flex items-center justify-center text-black font-extrabold text-sm shrink-0">
                    {char.name.slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-white">{char.name}</h5>
                      <span className="text-[10px] text-[#ff640a] font-semibold">{char.role}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      JP: <span className="text-neutral-300">{char.voiceActorJp}</span> · EN: <span className="text-neutral-300">{char.voiceActorEn}</span>
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
          )}
        </div>
      </div>
    </div>
  );
};
