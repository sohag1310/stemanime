import React, { useState } from 'react';
import { ScrapedAnime } from './types/anime';
import { StreamNavbar } from './components/StreamNavbar';
import { StreamCatalogView } from './components/StreamCatalogView';
import { StreamWatchView } from './components/StreamWatchView';
import { StreamWatchlistView } from './components/StreamWatchlistView';
import { Play } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'catalog' | 'watch' | 'watchlist'>('catalog');
  const [selectedAnime, setSelectedAnime] = useState<ScrapedAnime | null>(null);

  const handleSelectAnime = (anime: ScrapedAnime) => {
    setSelectedAnime(anime);
    setActiveView('watch');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setSelectedAnime(null);
    setActiveView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#181a20] text-gray-200">
      <StreamNavbar
        onGoHome={handleGoHome}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      <main className="flex-1">
        {activeView === 'watch' && selectedAnime ? (
          <StreamWatchView anime={selectedAnime} onBack={handleGoHome} />
        ) : activeView === 'watchlist' ? (
          <StreamWatchlistView onSelectAnime={handleSelectAnime} onBack={handleGoHome} />
        ) : (
          <StreamCatalogView onSelectAnime={handleSelectAnime} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#14151b] border-t border-white/5 py-10 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-black font-extrabold shadow-sm">
                <Play className="w-3.5 h-3.5 fill-black text-black ml-0.5" />
              </div>
              <span className="font-extrabold font-['Outfit'] text-white text-base">
                TOON<span className="text-emerald-500">STREAM</span>
              </span>
            </div>
            <p className="text-gray-500 text-center sm:text-right">
              Powered by Node.js Express Scraper Engine & React Video Embeds.
            </p>
          </div>
          <div className="pt-4 border-t border-white/5 text-[11px] text-gray-600 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© 2026 ToonStream Pulse. High-speed multi-server streaming.</span>
            <span>Clean Iframe Extraction · Ad-Filtered · Sub & Dub</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
