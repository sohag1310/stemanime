import React from 'react';
import { useAnime } from '../context/AnimeContext';
import { ANIME_DATABASE } from '../data/animeData';
import { HeroBanner } from './HeroBanner';
import { AnimeCard } from './AnimeCard';
import { Play, Flame, Sparkles, Clock, Calendar, ArrowRight } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { language, history, startWatching, setActiveTab } = useAnime();

  const featured = ANIME_DATABASE.filter((a) => a.isFeatured);
  const trending = ANIME_DATABASE.filter((a) => a.isTrending);
  const topRated = [...ANIME_DATABASE].sort((a, b) => b.score - a.score);

  // Resume watching item
  const recentHistory = history.length > 0 ? history[0] : null;
  const recentAnime = recentHistory ? ANIME_DATABASE.find((a) => a.id === recentHistory.animeId) : null;
  const recentEpisode = recentAnime && recentHistory ? recentAnime.episodes.find((e) => e.id === recentHistory.episodeId) : null;

  return (
    <div className="space-y-10 pb-16">
      {/* Featured Marquee Hero */}
      <HeroBanner featuredAnimeList={featured} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Continue Watching Section (if active history exists) */}
        {recentAnime && recentEpisode && recentHistory && (
          <section className="bg-[#14161f] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-28 sm:w-36 aspect-video rounded-xl overflow-hidden bg-black shrink-0 border border-white/10">
                  <img
                    src={recentEpisode.thumbnail || recentAnime.bannerImage}
                    alt={recentEpisode.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/70">
                    <div
                      className="h-full bg-[#ff640a]"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((recentHistory.progressSeconds / recentHistory.durationSeconds) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs text-[#ff640a] font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'দেখা চালিয়ে যান' : 'Continue Watching'}</span>
                    <span className="text-neutral-500">·</span>
                    <span className="text-neutral-400 font-normal">
                      {language === 'bn' ? `পর্ব ${recentEpisode.number}` : `Episode ${recentEpisode.number}`}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5 line-clamp-1">
                    {language === 'bn' ? recentAnime.titleBn : recentAnime.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
                    {language === 'bn' ? recentEpisode.titleBn : recentEpisode.title}
                  </p>
                </div>
              </div>

              <button
                onClick={() => startWatching(recentAnime, recentEpisode)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#ff640a] hover:bg-[#e05500] text-white font-bold text-xs sm:text-sm rounded-lg transition-transform hover:scale-105 shadow-md cursor-pointer whitespace-nowrap self-stretch sm:self-center justify-center"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{language === 'bn' ? 'প্লে করুন' : 'Resume'}</span>
              </button>
            </div>
          </section>
        )}

        {/* Top Trending This Season */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#ff640a]" />
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
                {language === 'bn' ? 'এই সিজনের শীর্ষ ট্রেন্ডিং' : 'Top Trending This Season'}
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('browse')}
              className="flex items-center gap-1 text-xs text-[#ff640a] hover:underline font-semibold cursor-pointer"
            >
              <span>{language === 'bn' ? 'সব দেখুন' : 'View All'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {trending.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </section>

        {/* Simulcast Schedule Teaser Strip (Crunchyroll Style) */}
        <section className="bg-gradient-to-r from-[#14161f] via-[#1a1c29] to-[#14161f] border border-white/10 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#ff640a] uppercase tracking-wider mb-1">
                <Calendar className="w-4 h-4" />
                <span>{language === 'bn' ? 'সাপ্তাহিক সম্প্রচার সূচি' : 'Simulcast Schedule'}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {language === 'bn'
                  ? 'জাপানের সাথে একই দিনে নতুন পর্বের প্রিমিয়ার'
                  : 'New Episodes Dropping Same Day As Japan'}
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('schedule')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg border border-white/10 transition-colors whitespace-nowrap self-start md:self-center cursor-pointer"
            >
              <span>{language === 'bn' ? 'পূর্ণাঙ্গ ক্যালেন্ডার খুলুন' : 'Open Weekly Calendar'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick day cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {ANIME_DATABASE.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => startWatching(item)}
                className="flex items-center gap-3 p-3 bg-black/40 hover:bg-black/60 border border-white/5 hover:border-[#ff640a]/40 rounded-xl transition-all cursor-pointer group"
              >
                <div className="w-12 h-16 rounded-lg overflow-hidden bg-neutral-900 shrink-0">
                  <img
                    src={item.posterImage}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] text-[#ff640a] font-bold block">
                    {item.releaseScheduleDay} · {item.releaseScheduleTime}
                  </span>
                  <h4 className="text-xs font-bold text-white group-hover:text-[#ff640a] transition-colors line-clamp-1">
                    {language === 'bn' ? item.titleBn : item.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                    {item.audioTracks.includes('Bengali') ? 'Sub · Dub · বাং ডাবিং' : 'Sub · Dub'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Rated Masterpieces */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
                {language === 'bn' ? 'সর্বোচ্চ রেটিংপ্রাপ্ত অ্যানিমে' : 'Top Rated Masterpieces'}
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('browse')}
              className="flex items-center gap-1 text-xs text-[#ff640a] hover:underline font-semibold cursor-pointer"
            >
              <span>{language === 'bn' ? 'সব দেখুন' : 'View All'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {topRated.slice(0, 4).map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
