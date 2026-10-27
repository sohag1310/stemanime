import React, { useState, useEffect } from 'react';
import { Anime } from '../types/anime';
import { useAnime } from '../context/AnimeContext';
import { Play, Bookmark, Info, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface HeroBannerProps {
  featuredAnimeList: Anime[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ featuredAnimeList }) => {
  const {
    language,
    startWatching,
    selectAnimeDetails,
    toggleWatchlist,
    isInWatchlist,
  } = useAnime();

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto advance every 8 seconds if not interacted
  useEffect(() => {
    if (featuredAnimeList.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredAnimeList.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [featuredAnimeList.length]);

  if (!featuredAnimeList.length) return null;

  const currentAnime = featuredAnimeList[currentIndex] || featuredAnimeList[0];
  const inWatchlist = isInWatchlist(currentAnime.id);

  const displayTitle = language === 'bn' ? (currentAnime.titleBn || currentAnime.title) : currentAnime.title;
  const displaySynopsis = language === 'bn' ? (currentAnime.synopsisBn || currentAnime.synopsis) : currentAnime.synopsis;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? featuredAnimeList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredAnimeList.length);
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#0c0d12] border-b border-white/10 min-h-[520px] md:min-h-[580px] flex items-center">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentAnime.bannerImage}
          alt={displayTitle}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 transition-all duration-1000 filter brightness-95"
        />
        {/* Measured Scrim for Media Contrast (as mandated by Constitution) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0d12] via-[#0c0d12]/85 to-transparent md:to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-[#0c0d12]/30 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="max-w-2xl">
          {/* Japanese Kanji Kicker */}
          <p className="text-xs tracking-widest text-[#ff640a] font-semibold uppercase mb-2">
            {currentAnime.titleJp} · {currentAnime.season}
          </p>

          {/* Display Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance">
            {displayTitle}
          </h1>

          {/* Zero-Pill Metadata Line */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-neutral-300 mt-3 mb-4 font-medium">
            <span className="flex items-center gap-1 text-amber-400 font-bold tabular-nums">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {currentAnime.score.toFixed(2)}
            </span>
            <span aria-hidden="true" className="text-neutral-500">·</span>
            <span>{currentAnime.format}</span>
            <span aria-hidden="true" className="text-neutral-500">·</span>
            <span>{currentAnime.ageRating}</span>
            <span aria-hidden="true" className="text-neutral-500">·</span>
            <span>{currentAnime.studio}</span>
            <span aria-hidden="true" className="text-neutral-500">·</span>
            <span className="text-neutral-400">
              {currentAnime.genres.slice(0, 3).join(', ')}
            </span>
          </div>

          {/* Synopsis */}
          <p className="text-sm md:text-base text-neutral-300 leading-relaxed line-clamp-3 mb-6 max-w-xl">
            {displaySynopsis}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => startWatching(currentAnime)}
              className="flex items-center gap-2 px-6 py-3 bg-[#ff640a] hover:bg-[#e05500] text-white text-sm font-bold rounded-lg shadow-lg shadow-[#ff640a]/25 transition-transform hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>
                {language === 'bn'
                  ? `এখনই দেখুন: পর্ব ১`
                  : `Watch Now: Episode 1`}
              </span>
            </button>

            <button
              onClick={() => toggleWatchlist(currentAnime.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                inWatchlist
                  ? 'bg-white/20 border-white/40 text-white'
                  : 'bg-black/50 border-white/20 text-white hover:bg-black/70 hover:border-white/40'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${inWatchlist ? 'fill-white' : ''}`} />
              <span>
                {inWatchlist
                  ? (language === 'bn' ? 'ওয়াচলিস্টে সংরক্ষিত' : 'In Watchlist')
                  : (language === 'bn' ? 'ওয়াচলিস্টে যোগ করুন' : 'Add to Watchlist')}
              </span>
            </button>

            <button
              onClick={() => selectAnimeDetails(currentAnime)}
              className="flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-lg border border-white/10 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Info className="w-4 h-4" />
              <span>{language === 'bn' ? 'বিস্তারিত' : 'Details'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      {featuredAnimeList.length > 1 && (
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Previous Featured Anime"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 px-2">
            {featuredAnimeList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex ? 'w-6 bg-[#ff640a]' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Next Featured Anime"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};
