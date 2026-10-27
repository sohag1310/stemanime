import React, { useState } from 'react';
import { ScrapedEpisode } from '../types/anime';
import { Play, Search, Film } from 'lucide-react';

interface EpisodeGridProps {
  episodes: ScrapedEpisode[];
  currentEpisodeNum: number;
  onSelectEpisode: (ep: ScrapedEpisode) => void;
  isMovie?: boolean;
}

export const EpisodeGrid: React.FC<EpisodeGridProps> = ({
  episodes,
  currentEpisodeNum,
  onSelectEpisode,
  isMovie,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEpisodes = episodes.filter(
    (ep) =>
      ep.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ep.episode.toString().includes(searchTerm)
  );

  return (
    <div className="bg-[#1f222a] border border-white/5 rounded-2xl p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/5 mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Film className="w-4 h-4 text-emerald-500" />
            <span>{isMovie ? 'Movie Player' : 'Episodes List'}</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {isMovie ? 'Direct Feature Stream' : `Total ${episodes.length} Episodes available`}
          </p>
        </div>

        {/* Filter input if series has more than 10 episodes */}
        {episodes.length > 8 && (
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter episode..."
              className="bg-zinc-900 border border-white/10 text-xs text-white rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500 w-36 sm:w-44"
            />
          </div>
        )}
      </div>

      {/* Grid of Episodes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
        {filteredEpisodes.map((ep) => {
          const isCurrent = ep.episode === currentEpisodeNum;
          return (
            <button
              key={ep.url || ep.id}
              onClick={() => onSelectEpisode(ep)}
              className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer group ${
                isCurrent
                  ? 'bg-emerald-500 text-black border-emerald-400 font-bold shadow-lg shadow-emerald-500/20'
                  : 'bg-zinc-900/80 border-white/5 text-gray-300 hover:text-white hover:bg-zinc-800 hover:border-white/20'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-xs font-black ${
                  isCurrent ? 'bg-black text-emerald-400' : 'bg-zinc-800 text-gray-400 group-hover:text-white'
                }`}
              >
                {isCurrent ? <Play className="w-3 h-3 fill-current ml-0.5" /> : ep.episode}
              </div>
              <span className="text-xs truncate flex-1">{ep.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
