import React from 'react';
import { Play, Flame, Film, Tv, Bookmark } from 'lucide-react';

interface StreamNavbarProps {
  onGoHome: () => void;
  activeView: 'catalog' | 'watch' | 'watchlist';
  setActiveView: (view: 'catalog' | 'watch' | 'watchlist') => void;
}

export const StreamNavbar: React.FC<StreamNavbarProps> = ({
  onGoHome,
  activeView,
  setActiveView,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#181a20]/95 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onGoHome}
              className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-black font-extrabold shadow-lg shadow-emerald-500/20">
                <Play className="w-4 h-4 fill-black text-black ml-0.5" />
              </div>
              <span className="font-extrabold font-['Outfit'] text-white">
                TOON<span className="text-emerald-500">STREAM</span>
              </span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveView('catalog');
                onGoHome();
              }}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeView === 'catalog' ? 'text-emerald-400 font-bold' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-emerald-400" />
              <span>Anime Feed</span>
            </button>

            <button
              onClick={() => {
                setActiveView('catalog');
                onGoHome();
              }}
              className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <Tv className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hindi Dubs</span>
            </button>

            <button
              onClick={() => {
                setActiveView('catalog');
                onGoHome();
              }}
              className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <Film className="w-3.5 h-3.5 text-emerald-400" />
              <span>Movies</span>
            </button>
          </nav>

          {/* Right Action: Watchlist */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('watchlist')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                activeView === 'watchlist'
                  ? 'bg-emerald-500 text-black border-emerald-400'
                  : 'bg-[#1f222a] border-white/10 text-gray-300 hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Watchlist</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
