import React, { useMemo, useState } from 'react';
import { useAnime } from '../context/AnimeContext';
import { ANIME_DATABASE, GENRE_LIST } from '../data/animeData';
import { AnimeCard } from './AnimeCard';
import { Search, SlidersHorizontal, RotateCcw, Frown } from 'lucide-react';

export const CatalogView: React.FC = () => {
  const {
    language,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    selectedFormat,
    setSelectedFormat,
    selectedAudio,
    setSelectedAudio,
  } = useAnime();

  const [sortBy, setSortBy] = useState<'popular' | 'score' | 'title'>('popular');

  const filteredAnime = useMemo(() => {
    return ANIME_DATABASE.filter((anime) => {
      // Search matching across English, Bengali, Japanese, studio, synopsis
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle =
          anime.title.toLowerCase().includes(q) ||
          anime.titleBn.toLowerCase().includes(q) ||
          anime.titleJp.toLowerCase().includes(q) ||
          anime.titleRomaji.toLowerCase().includes(q);
        const matchesStudio = anime.studio.toLowerCase().includes(q);
        const matchesGenre = anime.genres.some((g) => g.toLowerCase().includes(q));
        if (!matchesTitle && !matchesStudio && !matchesGenre) return false;
      }

      // Genre filter
      if (selectedGenre !== 'All' && !anime.genres.includes(selectedGenre)) {
        return false;
      }

      // Format filter
      if (selectedFormat !== 'All' && anime.format !== selectedFormat) {
        return false;
      }

      // Audio filter
      if (selectedAudio !== 'All') {
        if (selectedAudio === 'Bengali' && !anime.audioTracks.includes('Bengali')) return false;
        if (selectedAudio === 'English' && !anime.audioTracks.includes('English')) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return a.popularity - b.popularity;
    });
  }, [searchQuery, selectedGenre, selectedFormat, selectedAudio, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('All');
    setSelectedFormat('All');
    setSelectedAudio('All');
  };

  const hasActiveFilters =
    searchQuery !== '' || selectedGenre !== 'All' || selectedFormat !== 'All' || selectedAudio !== 'All';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      {/* Header title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
            {language === 'bn' ? 'অ্যানিমে ক্যাটালগ ও ব্রাউজ' : 'Explore Anime Library'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            {language === 'bn'
              ? 'অ্যাকশন, ফ্যান্টাসি, সাই-ফাই ও রোমান্স সহ শত শত জনপ্রিয় অ্যানিমে সিরিজ ও সিনেমা'
              : 'Browse trending simulcasts, movies, classics, and dubs with crystal clear HD streams.'}
          </p>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs text-neutral-400 font-medium">
            {language === 'bn' ? 'সাজান:' : 'Sort by:'}
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#151720] border border-white/10 text-xs font-semibold text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#ff640a] cursor-pointer"
          >
            <option value="popular">{language === 'bn' ? 'সর্বাধিক জনপ্রিয়' : 'Most Popular'}</option>
            <option value="score">{language === 'bn' ? 'সর্বোচ্চ রেটিং' : 'Highest Rated'}</option>
            <option value="title">{language === 'bn' ? 'নামানুসারে (A-Z)' : 'Alphabetical (A-Z)'}</option>
          </select>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="space-y-4 bg-[#14161f] border border-white/10 rounded-2xl p-5">
        {/* Search input inside catalog */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'bn'
                ? 'অ্যানিমের নাম, স্টুডিও (উদাঃ Ufotable, MAPPA), বা বিষয় দিয়ে খুঁজুন...'
                : 'Search by anime title, studio (e.g. Ufotable, MAPPA), or keyword...'
            }
            className="w-full bg-[#0c0d12] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff640a]"
          />
        </div>

        {/* Genre Selector Buttons (Segmented Controls) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              {language === 'bn' ? 'জঁরা ফিল্টার' : 'Genres'}
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs text-[#ff640a] hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{language === 'bn' ? 'রিসেট' : 'Reset Filters'}</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {GENRE_LIST.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  selectedGenre === genre
                    ? 'bg-[#ff640a] text-white shadow-sm'
                    : 'bg-[#1e212d] text-neutral-300 hover:bg-[#282c3c] hover:text-white'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Format and Audio row */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-white/5">
          {/* Format */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-medium">
              {language === 'bn' ? 'ফরম্যাট:' : 'Format:'}
            </span>
            <div className="flex items-center gap-1">
              {['All', 'TV', 'Movie'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setSelectedFormat(fmt)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    selectedFormat === fmt
                      ? 'bg-white/20 text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Audio */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-medium">
              {language === 'bn' ? 'অডিও:' : 'Audio:'}
            </span>
            <div className="flex items-center gap-1">
              {[
                { id: 'All', labelEn: 'All', labelBn: 'সব' },
                { id: 'Bengali', labelEn: 'Bengali Dub', labelBn: 'বাং ডাবিং' },
                { id: 'English', labelEn: 'English Dub', labelBn: 'ইংলিশ ডাব' },
              ].map((aud) => (
                <button
                  key={aud.id}
                  onClick={() => setSelectedAudio(aud.id)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    selectedAudio === aud.id
                      ? 'bg-[#ff640a]/20 text-[#ff640a] border border-[#ff640a]/30'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {language === 'bn' ? aud.labelBn : aud.labelEn}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span>
          {language === 'bn'
            ? `মোট ${filteredAnime.length}টি অ্যানিমে পাওয়া গেছে`
            : `Showing ${filteredAnime.length} anime results`}
        </span>
      </div>

      {/* Grid of Cards */}
      {filteredAnime.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {filteredAnime.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#14161f] border border-white/5 rounded-2xl p-8 space-y-4">
          <Frown className="w-12 h-12 text-neutral-500 mx-auto" />
          <h3 className="text-base font-bold text-white">
            {language === 'bn' ? 'কোনো অ্যানিমে পাওয়া যায়নি' : 'No anime matched your search'}
          </h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            {language === 'bn'
              ? 'আপনার অনুসন্ধান শব্দ বা ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।'
              : 'Try clearing your filters or searching with a different genre or studio keyword.'}
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-[#ff640a] hover:bg-[#e05500] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            {language === 'bn' ? 'সব ফিল্টার মুছুন' : 'Reset All Filters'}
          </button>
        </div>
      )}
    </div>
  );
};
