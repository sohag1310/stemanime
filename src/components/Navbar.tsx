import React, { useState } from 'react';
import { useAnime, NavigationTab } from '../context/AnimeContext';
import { Search, Bookmark, Play, Globe, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    activeTab,
    setActiveTab,
    watchlist,
    searchQuery,
    setSearchQuery,
    isPlayerOpen,
    closePlayer,
  } = useAnime();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks: { id: NavigationTab; labelEn: string; labelBn: string }[] = [
    { id: 'home', labelEn: 'Home', labelBn: 'হোম' },
    { id: 'browse', labelEn: 'Browse', labelBn: 'ক্যাটালগ' },
    { id: 'schedule', labelEn: 'Simulcasts', labelBn: 'শিডিউল' },
    { id: 'watchlist', labelEn: 'My Library', labelBn: 'আমার তালিকা' },
  ];

  const handleNavClick = (tabId: NavigationTab) => {
    setActiveTab(tabId);
    if (isPlayerOpen) {
      closePlayer();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0b0c10]/95 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element Brand wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:text-[#ff640a] transition-colors whitespace-nowrap cursor-pointer"
            >
              <div className="w-8 h-8 rounded bg-[#ff640a] flex items-center justify-center text-black font-extrabold shadow-lg shadow-[#ff640a]/20">
                <Play className="w-4 h-4 fill-black text-black ml-0.5" />
              </div>
              <span className="font-extrabold font-['Outfit'] text-white">
                ANI<span className="text-[#ff640a]">STREAM</span>
              </span>
            </button>
          </div>

          {/* Zone 2: 4 clean single-line nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id && !isPlayerOpen;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#ff640a] font-semibold'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {language === 'bn' ? link.labelBn : link.labelEn}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff640a] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action & compact tools */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Instant Search Bar */}
            <div className="relative flex items-center">
              {isSearchOpen ? (
                <div className="flex items-center bg-[#151720] border border-white/20 rounded-lg px-2.5 py-1.5 w-48 sm:w-64 transition-all">
                  <Search className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'bn' ? 'অ্যানিমে খুঁজুন...' : 'Search anime, genre...'}
                    className="bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none w-full"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-neutral-400 hover:text-white p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="text-neutral-400 hover:text-white text-xs ml-1.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsSearchOpen(true);
                    setActiveTab('browse');
                  }}
                  className="p-2 text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                  title={language === 'bn' ? 'অনুসন্ধান' : 'Search'}
                  aria-label="Search anime"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white bg-[#151720] hover:bg-[#1f222e] border border-white/10 rounded-lg transition-colors cursor-pointer"
              title="Toggle Bengali / English"
            >
              <Globe className="w-3.5 h-3.5 text-[#ff640a]" />
              <span className="uppercase">{language === 'bn' ? 'বাং' : 'EN'}</span>
            </button>

            {/* Watchlist Primary Shortcut */}
            <button
              onClick={() => handleNavClick('watchlist')}
              className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#ff640a] hover:bg-[#e05500] rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ওয়াচলিস্ট' : 'Watchlist'}</span>
              {watchlist.length > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-black/40 text-[11px] font-bold rounded">
                  {watchlist.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="flex md:hidden border-t border-white/5 px-4 py-2 justify-around bg-[#0e0f14]">
        {navLinks.map((link) => {
          const isActive = activeTab === link.id && !isPlayerOpen;
          return (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`px-2 py-1 text-xs font-medium transition-colors ${
                isActive ? 'text-[#ff640a] font-bold' : 'text-neutral-400'
              }`}
            >
              {language === 'bn' ? link.labelBn : link.labelEn}
            </button>
          );
        })}
      </div>
    </header>
  );
};
