import React, { useState } from 'react';
import { StreamServer } from '../types/anime';
import { SkipBack, SkipForward, RefreshCw, ExternalLink, ShieldCheck, Volume2 } from 'lucide-react';

interface StreamPlayerProps {
  servers: StreamServer[];
  selectedServerIdx: number;
  setSelectedServerIdx: (idx: number) => void;
  isLoadingStream: boolean;
  directUrl?: string;
  onNextEpisode?: () => void;
  onPrevEpisode?: () => void;
  hasNextEpisode?: boolean;
  hasPrevEpisode?: boolean;
  currentEpisodeNum?: number;
  animeTitle?: string;
  activeAudioTrack: 'SUB' | 'DUB' | 'HINDI';
  setActiveAudioTrack: (track: 'SUB' | 'DUB' | 'HINDI') => void;
  onReloadStream: () => void;
}

export const StreamPlayer: React.FC<StreamPlayerProps> = ({
  servers,
  selectedServerIdx,
  setSelectedServerIdx,
  isLoadingStream,
  directUrl,
  onNextEpisode,
  onPrevEpisode,
  hasNextEpisode,
  hasPrevEpisode,
  currentEpisodeNum,
  animeTitle,
  activeAudioTrack,
  setActiveAudioTrack,
  onReloadStream,
}) => {
  const [iframeKey, setIframeKey] = useState(0);

  const activeServer = servers[selectedServerIdx] || servers[0];
  const isDirectVideo =
    activeServer?.url &&
    (activeServer.url.endsWith('.mp4') ||
      activeServer.url.endsWith('.webm') ||
      activeServer.url.includes('googlevideo.com') ||
      activeServer.url.includes('commondatastorage.googleapis.com'));

  const handleServerClick = (idx: number) => {
    setSelectedServerIdx(idx);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="w-full">
      {/* 1. Main Responsive Video Container */}
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        {isLoadingStream ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-950 text-white">
            <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-gray-400">Loading stream servers...</p>
          </div>
        ) : activeServer?.url ? (
          isDirectVideo ? (
            <video
              key={`${activeServer.url}-${iframeKey}`}
              src={activeServer.url}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          ) : (
            <iframe
              key={`${activeServer.url}-${iframeKey}`}
              src={activeServer.url}
              className="w-full h-full border-0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            />
          )
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-zinc-950">
            <p className="text-sm text-gray-400 mb-4">No direct embed available. Open source player:</p>
            {directUrl && (
              <a
                href={directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-500 text-black font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 hover:bg-emerald-400 transition-colors"
              >
                <span>Watch on External Server</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        {/* Adblock / Protection Tag */}
        <div className="absolute top-3 right-3 pointer-events-none opacity-70 flex items-center gap-1.5 px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-lg text-[10px] text-emerald-400 font-semibold border border-emerald-500/20">
          <ShieldCheck className="w-3 h-3" />
          <span>Clean Stream (Ad-Filtered)</span>
        </div>
      </div>

      {/* 2. Controls & Server Switcher Bar */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 bg-[#1f222a] border border-white/5 p-3 rounded-xl">
        {/* Left: Server Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs text-gray-400 font-bold uppercase whitespace-nowrap">Servers:</span>
          {servers.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleServerClick(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedServerIdx === idx
                  ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-zinc-900 text-gray-300 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {s.name || `Server ${idx + 1}`}
            </button>
          ))}

          {/* Reload Stream button */}
          <button
            onClick={() => {
              setIframeKey((k) => k + 1);
              onReloadStream();
            }}
            className="p-1.5 text-gray-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            title="Reload Server"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Sub/Dub Switcher & Episode Navigation */}
        <div className="flex items-center gap-3">
          {/* Sub / Dub / Hindi Audio switch */}
          <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-white/5">
            {(['SUB', 'DUB', 'HINDI'] as const).map((track) => (
              <button
                key={track}
                onClick={() => setActiveAudioTrack(track)}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                  activeAudioTrack === track
                    ? 'bg-emerald-500 text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {track}
              </button>
            ))}
          </div>

          {/* Episode Prev / Next */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onPrevEpisode}
              disabled={!hasPrevEpisode}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                hasPrevEpisode
                  ? 'bg-zinc-900 border-white/10 text-gray-300 hover:text-white hover:bg-zinc-800'
                  : 'bg-zinc-900/50 border-transparent text-gray-600 cursor-not-allowed'
              }`}
              title="Previous Episode"
            >
              <SkipBack className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            <button
              onClick={onNextEpisode}
              disabled={!hasNextEpisode}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                hasNextEpisode
                  ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-sm'
                  : 'bg-zinc-900 text-gray-600 cursor-not-allowed'
              }`}
              title="Next Episode"
            >
              <span>Next Ep</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
