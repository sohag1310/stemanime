import React from 'react';
import { Anime, Episode } from '../types/anime';
import { useAnime } from '../context/AnimeContext';
import { Play, CheckCircle2 } from 'lucide-react';

interface EpisodeListProps {
  anime: Anime;
  activeEpisode: Episode | null;
  onSelectEpisode: (episode: Episode) => void;
}

export const EpisodeList: React.FC<EpisodeListProps> = ({
  anime,
  activeEpisode,
  onSelectEpisode,
}) => {
  const { language, getProgress } = useAnime();

  return (
    <div className="bg-[#14161f] border border-white/5 rounded-2xl p-5">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
        <div>
          <h3 className="font-bold text-lg text-white font-['Outfit']">
            {language === 'bn' ? 'পর্বসমূহ' : 'Episodes'}
          </h3>
          <p className="text-xs text-neutral-400">
            {language === 'bn'
              ? `সিজন ১ · মোট ${anime.episodes.length}টি পর্ব উপলব্ধ`
              : `Season 1 · ${anime.episodes.length} Episodes Available`}
          </p>
        </div>

        <span className="text-xs font-semibold text-[#ff640a] bg-[#ff640a]/10 px-2.5 py-1 rounded-md">
          {anime.status === 'Completed'
            ? (language === 'bn' ? 'সমাপ্ত' : 'Completed')
            : (language === 'bn' ? 'সাপ্তাহিক রিলিজ' : 'Simulcasting')}
        </span>
      </div>

      {/* Episode items */}
      <div className="grid grid-cols-1 gap-3 max-h-[520px] overflow-y-auto pr-1">
        {anime.episodes.map((ep) => {
          const isActive = activeEpisode?.id === ep.id;
          const prog = getProgress(anime.id, ep.id);
          const percent = prog
            ? Math.min(100, Math.round((prog.progressSeconds / prog.durationSeconds) * 100))
            : 0;
          const isFinished = percent >= 90;

          return (
            <div
              key={ep.id}
              onClick={() => onSelectEpisode(ep)}
              className={`group flex items-center gap-3.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#ff640a]/15 border-[#ff640a] text-white shadow-md'
                  : 'bg-[#1b1e2b]/50 border-white/5 hover:border-white/20 hover:bg-[#1b1e2b]'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative w-28 sm:w-36 aspect-video rounded-lg overflow-hidden shrink-0 bg-[#0e1017]">
                <img
                  src={ep.thumbnail || anime.bannerImage}
                  alt={ep.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />

                {/* Scrim */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                      isActive
                        ? 'bg-[#ff640a] text-white scale-110'
                        : 'bg-black/60 text-white/90 group-hover:bg-[#ff640a] group-hover:scale-110'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Episode Duration badge */}
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-[10px] text-neutral-300 font-mono rounded">
                  {ep.duration}
                </span>

                {/* Finished checkmark */}
                {isFinished && (
                  <span className="absolute top-1 left-1 p-0.5 bg-emerald-500 rounded-full text-black">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </span>
                )}

                {/* Progress bar */}
                {percent > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/70">
                    <div
                      className="h-full bg-[#ff640a]"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Episode Title & Description */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-[11px] text-[#ff640a] font-bold">
                  <span>{language === 'bn' ? `পর্ব ${ep.number}` : `EPISODE ${ep.number}`}</span>
                  <span className="text-neutral-500 font-normal">·</span>
                  <span className="text-neutral-400 font-normal">{ep.releaseDate}</span>
                </div>

                <h4
                  className={`font-semibold text-xs sm:text-sm line-clamp-1 mt-0.5 ${
                    isActive ? 'text-[#ff640a]' : 'text-white'
                  }`}
                >
                  {language === 'bn' ? (ep.titleBn || ep.title) : ep.title}
                </h4>

                <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                  {language === 'bn' ? (ep.descriptionBn || ep.description) : ep.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
