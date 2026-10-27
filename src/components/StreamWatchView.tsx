import React, { useState, useEffect } from 'react';
import { ScrapedAnime, ScrapedEpisode, SeriesDetails, StreamServer } from '../types/anime';
import { fetchSeriesDetails, fetchEpisodeServers } from '../services/api';
import { StreamPlayer } from './StreamPlayer';
import { EpisodeGrid } from './EpisodeGrid';
import { ArrowLeft, Star, Film, Sparkles, Share2, Bookmark } from 'lucide-react';

interface StreamWatchViewProps {
  anime: ScrapedAnime;
  onBack: () => void;
}

export const StreamWatchView: React.FC<StreamWatchViewProps> = ({ anime, onBack }) => {
  const [seriesDetails, setSeriesDetails] = useState<SeriesDetails | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<ScrapedEpisode | null>(null);
  const [servers, setServers] = useState<StreamServer[]>([]);
  const [selectedServerIdx, setSelectedServerIdx] = useState(0);
  const [isLoadingStream, setIsLoadingStream] = useState(true);
  const [directUrl, setDirectUrl] = useState<string | undefined>(undefined);
  const [activeAudioTrack, setActiveAudioTrack] = useState<'SUB' | 'DUB' | 'HINDI'>('SUB');
  const [isSaved, setIsSaved] = useState(false);

  // Load series details first
  useEffect(() => {
    let isMounted = true;
    async function loadSeries() {
      const details = await fetchSeriesDetails(anime.pageUrl);
      if (!isMounted) return;

      if (details) {
        setSeriesDetails(details);
        // Default to first episode or movie
        if (details.episodes.length > 0) {
          const firstEp = details.episodes[0];
          setCurrentEpisode(firstEp);
          loadEpisode(firstEp);
        }
      } else {
        // Fallback default episode
        const fallbackEp: ScrapedEpisode = {
          id: 1,
          episode: 1,
          title: anime.isMovie ? 'Full Movie' : 'Episode 1',
          url: anime.firstEpUrl || anime.pageUrl,
        };
        setCurrentEpisode(fallbackEp);
        loadEpisode(fallbackEp);
      }
    }

    loadSeries();
    return () => {
      isMounted = false;
    };
  }, [anime.pageUrl]);

  // Load servers for given episode
  const loadEpisode = async (ep: ScrapedEpisode) => {
    setIsLoadingStream(true);
    setSelectedServerIdx(0);

    const streamData = await fetchEpisodeServers(ep.url);
    setServers(streamData.servers);
    setDirectUrl(streamData.directUrl);
    setIsLoadingStream(false);
  };

  const handleSelectEpisode = (ep: ScrapedEpisode) => {
    setCurrentEpisode(ep);
    loadEpisode(ep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentEpIndex = seriesDetails?.episodes.findIndex((e) => e.episode === currentEpisode?.episode) ?? -1;
  const hasNext = seriesDetails ? currentEpIndex >= 0 && currentEpIndex < seriesDetails.episodes.length - 1 : false;
  const hasPrev = seriesDetails ? currentEpIndex > 0 : false;

  const handleNextEp = () => {
    if (seriesDetails && hasNext) {
      handleSelectEpisode(seriesDetails.episodes[currentEpIndex + 1]);
    }
  };

  const handlePrevEp = () => {
    if (seriesDetails && hasPrev) {
      handleSelectEpisode(seriesDetails.episodes[currentEpIndex - 1]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-20">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#1f222a] hover:bg-zinc-800 text-gray-300 hover:text-white rounded-xl border border-white/5 text-xs font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              isSaved
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : 'bg-zinc-900 border-white/5 text-gray-300 hover:text-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-emerald-400' : ''}`} />
            <span>{isSaved ? 'In Watchlist' : 'Watchlist'}</span>
          </button>
        </div>
      </div>

      {/* Main Stream Player */}
      <section>
        <StreamPlayer
          servers={servers}
          selectedServerIdx={selectedServerIdx}
          setSelectedServerIdx={setSelectedServerIdx}
          isLoadingStream={isLoadingStream}
          directUrl={directUrl}
          onNextEpisode={handleNextEp}
          onPrevEpisode={handlePrevEp}
          hasNextEpisode={hasNext}
          hasPrevEpisode={hasPrev}
          currentEpisodeNum={currentEpisode?.episode || 1}
          animeTitle={anime.title}
          activeAudioTrack={activeAudioTrack}
          setActiveAudioTrack={setActiveAudioTrack}
          onReloadStream={() => {
            if (currentEpisode) loadEpisode(currentEpisode);
          }}
        />
      </section>

      {/* Series Metadata & Details */}
      <section className="bg-[#1f222a] border border-white/5 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ToonStream Direct Scraper Feed</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-300 font-mono">
                {currentEpisode?.title || `Episode ${currentEpisode?.episode || 1}`}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
              {seriesDetails?.title || anime.title}
            </h1>

            {/* Tags line */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300 font-medium pt-1">
              <span className="flex items-center gap-1 text-amber-400 font-bold tabular-nums">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{anime.score ? anime.score.toFixed(1) : '8.8'}</span>
              </span>
              <span className="text-gray-600">·</span>
              <span className="text-gray-300">{anime.type || 'TV Series'}</span>
              <span className="text-gray-600">·</span>
              <span className="text-gray-300">
                {seriesDetails?.episodes.length || anime.episodesCount || 1} Total Episodes
              </span>
              {seriesDetails?.genres && seriesDetails.genres.length > 0 && (
                <>
                  <span className="text-gray-600">·</span>
                  <span className="text-emerald-400">{seriesDetails.genres.join(', ')}</span>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pt-2">
              {seriesDetails?.synopsis ||
                anime.synopsis ||
                'High-speed streaming with multi-server failovers, sub/dub audio tracks, and ad-filtered embed playback.'}
            </p>
          </div>

          {/* Quick Poster Thumbnail */}
          <div className="hidden md:block w-28 aspect-[3/4] rounded-xl overflow-hidden bg-black shrink-0 border border-white/10 shadow-lg">
            <img
              src={
                anime.images?.jpg?.large_image_url ||
                anime.images?.jpg?.image_url ||
                '/src/assets/images/hero_anime_epic_1793052173700.jpg'
              }
              alt={anime.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Episode Selection Grid */}
      {seriesDetails && seriesDetails.episodes.length > 0 && (
        <section>
          <EpisodeGrid
            episodes={seriesDetails.episodes}
            currentEpisodeNum={currentEpisode?.episode || 1}
            onSelectEpisode={handleSelectEpisode}
            isMovie={seriesDetails.isMovie}
          />
        </section>
      )}
    </div>
  );
};
