import React, { useState, useRef, useEffect } from 'react';
import { useAnime } from '../context/AnimeContext';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipForward,
  SkipBack,
  Settings,
  ArrowLeft,
  Tv,
  Subtitles,
  Sparkles,
} from 'lucide-react';

export const AnimePlayer: React.FC = () => {
  const {
    language,
    selectedAnime,
    selectedEpisode,
    closePlayer,
    playNextEpisode,
    playPreviousEpisode,
    saveProgress,
    getProgress,
    playbackQuality,
    setPlaybackQuality,
    playbackSpeed,
    setPlaybackSpeed,
    subtitleLanguage,
    setSubtitleLanguage,
    audioTrack,
    setAudioTrack,
    ambientLighting,
    setAmbientLighting,
  } = useAnime();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1440); // default fallback duration ~24 mins
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showSubtitlesMenu, setShowSubtitlesMenu] = useState(false);
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const [showIntroSkip, setShowIntroSkip] = useState(false);
  const [showOutroSkip, setShowOutroSkip] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (!selectedAnime || !selectedEpisode) return null;

  const currentEpIndex = selectedAnime.episodes.findIndex((e) => e.id === selectedEpisode.id);
  const hasNext = currentEpIndex < selectedAnime.episodes.length - 1;
  const hasPrev = currentEpIndex > 0;

  // Restore previous progress if any
  useEffect(() => {
    const existingProgress = getProgress(selectedAnime.id, selectedEpisode.id);
    if (existingProgress && videoRef.current) {
      videoRef.current.currentTime = Math.min(
        existingProgress.progressSeconds,
        existingProgress.durationSeconds - 10
      );
    }
  }, [selectedAnime.id, selectedEpisode.id]);

  // Handle auto hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        if (!isSettingsOpen && !showSubtitlesMenu && !showAudioMenu) {
          setShowControls(false);
        }
      }, 3500);
    }
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight' || e.code === 'KeyL') {
        e.preventDefault();
        seekBy(10);
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyJ') {
        e.preventDefault();
        seekBy(-10);
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.code === 'Escape') {
        if (isFullscreen) {
          document.exitFullscreen?.();
        } else {
          closePlayer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isFullscreen, isMuted, volume]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const seekBy = (seconds: number) => {
    if (!videoRef.current) return;
    const newTime = Math.max(0, Math.min(videoRef.current.duration || duration, videoRef.current.currentTime + seconds));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    showToast(seconds > 0 ? `+${seconds}s` : `${seconds}s`);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
    setCurrentTime(time);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 1800);
  };

  // Video timeupdate handler
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    const total = videoRef.current.duration || selectedEpisode.durationSeconds || duration;
    setCurrentTime(time);
    setDuration(total);

    // Save progress periodically
    if (Math.floor(time) % 5 === 0) {
      saveProgress(selectedAnime.id, selectedEpisode.id, selectedEpisode.number, time, total);
    }

    // Check Skip Intro / Outro windows
    const introStart = selectedEpisode.introStart || 0;
    const introEnd = selectedEpisode.introEnd || 85;
    const outroStart = selectedEpisode.outroStart || total - 90;

    setShowIntroSkip(time >= introStart && time <= introEnd);
    setShowOutroSkip(time >= outroStart && time < total - 5);
  };

  const handleSkipIntro = () => {
    if (!videoRef.current) return;
    const target = (selectedEpisode.introEnd || 85) + 1;
    videoRef.current.currentTime = target;
    setCurrentTime(target);
    showToast(language === 'bn' ? 'ইন্ট্রো বাদ দেওয়া হলো' : 'Skipped Intro');
  };

  const handleSkipOutro = () => {
    if (hasNext) {
      playNextEpisode();
      showToast(language === 'bn' ? 'পরবর্তী পর্বে যাওয়া হচ্ছে...' : 'Loading next episode...');
    }
  };

  const handleSpeedChange = (spd: number) => {
    setPlaybackSpeed(spd);
    if (videoRef.current) {
      videoRef.current.playbackRate = spd;
    }
    setIsSettingsOpen(false);
    showToast(`${spd}x Speed`);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Synchronized dynamic subtitles
  const getActiveSubtitle = (time: number) => {
    if (subtitleLanguage === 'Off') return null;

    // Subtitle script simulation based on time intervals
    const script: { start: number; end: number; en: string; bn: string; jp: string }[] = [
      {
        start: 2,
        end: 7,
        en: 'In the year 2099, the ancient curse breached the final defense line.',
        bn: '২০৯৯ সালে প্রাচীন অভিশাপ চূড়ান্ত প্রতিরক্ষা বলয় ভেদ করে ঢুকে পড়েছে।',
        jp: '西暦2099年、古代の呪縛が最終防衛線を突破した。',
      },
      {
        start: 8,
        end: 15,
        en: 'Renjiro... do not draw the celestial blade unless you are ready to pay the price.',
        bn: 'রেঞ্জিরো... চরম মূল্য দিতে প্রস্তুত না হলে মহাজাগতিক ব্লেড উন্মুক্ত করো না।',
        jp: 'レンジロー、覚悟なき者に星光の刃は抜けぬ。',
      },
      {
        start: 17,
        end: 24,
        en: 'I know the cost. But I won\'t let Tokyo burn tonight!',
        bn: 'আমি মূল্য জানি। কিন্তু আজকের রাতে আমি টোকিওকে ভস্মীভূত হতে দেব না!',
        jp: '分かっている。だが今夜、この東京を灰にはさせない！',
      },
      {
        start: 26,
        end: 32,
        en: 'The astral anomaly is expanding! All combat units, retreat!',
        bn: 'মহাজাগতিক ফাটল দ্রুত ছড়িয়ে পড়ছে! সব কমব্যাট ইউনিট, দ্রুত পিছু হটো!',
        jp: 'アストラル異常が拡大している！全隊、直ちに退避せよ！',
      },
      {
        start: 35,
        end: 42,
        en: 'Azure Starlight Katana: First Seal... RELEASE!',
        bn: 'নীল তারকা তরবারি: প্রথম মোহর... উন্মুক্ত!',
        jp: '青嵐星光刀・第一封印――解放！',
      },
      {
        start: 45,
        end: 54,
        en: 'Witness the power that defies the synthetic destiny.',
        bn: 'কৃত্রিম ভাগ্যকে অস্বীকারকারী অপার্থিব শক্তির প্রত্যক্ষদর্শী হও।',
        jp: '運命を拒絶する力、その目に焼き付けるがいい。',
      },
    ];

    const currentSub = script.find((s) => time >= s.start && time <= s.end);
    if (!currentSub) return null;

    if (subtitleLanguage === 'Bengali') return currentSub.bn;
    if (subtitleLanguage === 'Japanese Romaji') return currentSub.jp;
    return currentSub.en;
  };

  const activeSub = getActiveSubtitle(currentTime);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full bg-black select-none overflow-hidden ${
        isFullscreen ? 'h-screen' : 'aspect-video max-h-[82vh] rounded-2xl border border-white/10'
      }`}
    >
      {/* Ambient Lighting Effect (Cinematic Theater glow behind the video) */}
      {ambientLighting && (
        <div
          className="absolute -inset-4 opacity-40 blur-3xl pointer-events-none transition-colors duration-1000 z-0"
          style={{
            background: isPlaying
              ? 'radial-gradient(circle at center, #ff640a 0%, #3b82f6 50%, transparent 80%)'
              : 'radial-gradient(circle at center, #ff640a 0%, #151720 70%, transparent 90%)',
          }}
        />
      )}

      {/* Real HTML5 Video element with sample stream */}
      <video
        ref={videoRef}
        src={selectedEpisode.videoUrl}
        poster={selectedEpisode.thumbnail}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          if (hasNext) playNextEpisode();
        }}
        playsInline
        className="relative z-10 w-full h-full object-contain cursor-pointer"
      />

      {/* Stylized Anime Subtitle Overlay */}
      {activeSub && (
        <div className="absolute bottom-20 left-0 right-0 z-25 flex justify-center px-4 pointer-events-none">
          <div className="bg-black/80 backdrop-blur-sm text-yellow-300 font-bold px-4 py-1.5 rounded-lg text-sm sm:text-base md:text-lg text-center shadow-lg border border-yellow-400/20 max-w-2xl transition-all">
            {activeSub}
          </div>
        </div>
      )}

      {/* Skip Intro Button (Crunchyroll Style) */}
      {showIntroSkip && (
        <button
          onClick={handleSkipIntro}
          className="absolute bottom-24 right-6 z-30 flex items-center gap-2 px-4 py-2 bg-black/80 hover:bg-[#ff640a] text-white font-bold text-xs sm:text-sm rounded-lg border border-white/30 hover:border-[#ff640a] backdrop-blur-md transition-all shadow-xl cursor-pointer group"
        >
          <Sparkles className="w-4 h-4 text-[#ff640a] group-hover:text-white" />
          <span>{language === 'bn' ? 'ইন্ট্রো বাদ দিন (Skip Intro)' : 'Skip Intro'}</span>
        </button>
      )}

      {/* Skip Outro / Next Episode Button */}
      {showOutroSkip && hasNext && (
        <button
          onClick={handleSkipOutro}
          className="absolute bottom-24 right-6 z-30 flex items-center gap-2 px-4 py-2.5 bg-[#ff640a] hover:bg-[#e05500] text-white font-bold text-xs sm:text-sm rounded-lg shadow-xl transition-all cursor-pointer"
        >
          <span>{language === 'bn' ? 'পরবর্তী পর্ব (Next Episode)' : 'Next Episode'}</span>
          <SkipForward className="w-4 h-4" />
        </button>
      )}

      {/* Center Toast notification */}
      {toastMessage && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-black/85 backdrop-blur-md border border-white/20 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-2xl pointer-events-none transition-all">
          {toastMessage}
        </div>
      )}

      {/* Top Header Bar inside Video Container */}
      <div
        className={`absolute top-0 left-0 right-0 z-30 p-4 bg-gradient-to-b from-black/90 via-black/40 to-transparent transition-opacity duration-300 flex items-center justify-between ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={closePlayer}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'bn' ? 'ফিরে যান' : 'Back'}</span>
          </button>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white line-clamp-1">
              {language === 'bn' ? selectedAnime.titleBn : selectedAnime.title}
            </h2>
            <p className="text-xs text-neutral-300">
              {language === 'bn' ? selectedEpisode.titleBn : selectedEpisode.title} ·{' '}
              <span className="text-[#ff640a] font-semibold">{audioTrack} Audio</span>
            </p>
          </div>
        </div>

        {/* Ambient Mode Toggle */}
        <button
          onClick={() => setAmbientLighting(!ambientLighting)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-md border transition-colors cursor-pointer ${
            ambientLighting
              ? 'bg-[#ff640a]/20 border-[#ff640a] text-white'
              : 'bg-black/50 border-white/10 text-neutral-400 hover:text-white'
          }`}
          title="Ambient Lighting"
        >
          <Tv className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {language === 'bn' ? 'অ্যাম্বিয়েন্ট' : 'Ambient'}
          </span>
        </button>
      </div>

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 flex flex-col gap-2 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Scrubber Progress Bar */}
        <div className="relative flex items-center group/scrubber cursor-pointer">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 group-hover/scrubber:h-2.5 bg-neutral-700 accent-[#ff640a] rounded-lg cursor-pointer transition-all appearance-none"
            style={{
              background: `linear-gradient(to right, #ff640a ${(currentTime / (duration || 1)) * 100}%, #333 ${(currentTime / (duration || 1)) * 100}%)`,
            }}
          />
        </div>

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between text-white text-xs pt-1">
          {/* Left Controls: Play, Prev, Next, Seek, Volume, Timers */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-1.5 hover:text-[#ff640a] transition-colors cursor-pointer"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            {/* Prev Episode */}
            <button
              onClick={playPreviousEpisode}
              disabled={!hasPrev}
              className={`p-1.5 transition-colors cursor-pointer ${
                hasPrev ? 'hover:text-[#ff640a]' : 'opacity-30 cursor-not-allowed'
              }`}
              title="Previous Episode"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Next Episode */}
            <button
              onClick={playNextEpisode}
              disabled={!hasNext}
              className={`p-1.5 transition-colors cursor-pointer ${
                hasNext ? 'hover:text-[#ff640a]' : 'opacity-30 cursor-not-allowed'
              }`}
              title="Next Episode"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* 10s Rewind */}
            <button
              onClick={() => seekBy(-10)}
              className="p-1.5 hover:text-[#ff640a] transition-colors cursor-pointer"
              title="Rewind 10s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* 10s Forward */}
            <button
              onClick={() => seekBy(10)}
              className="p-1.5 hover:text-[#ff640a] transition-colors cursor-pointer"
              title="Forward 10s"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2 group/vol">
              <button
                onClick={toggleMute}
                className="p-1.5 hover:text-[#ff640a] transition-colors cursor-pointer"
                aria-label="Mute toggle"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-neutral-700 accent-[#ff640a] rounded cursor-pointer hidden sm:block"
              />
            </div>

            {/* Time Stamp (Tabular Numerals) */}
            <div className="text-[12px] text-neutral-300 font-medium tabular-nums ml-1">
              <span>{formatTime(currentTime)}</span>
              <span className="text-neutral-500 mx-1">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls: Subtitles, Audio, Quality, Speed, Fullscreen */}
          <div className="flex items-center gap-2 relative">
            {/* Subtitle Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSubtitlesMenu(!showSubtitlesMenu);
                  setShowAudioMenu(false);
                  setIsSettingsOpen(false);
                }}
                className={`p-1.5 hover:text-[#ff640a] transition-colors cursor-pointer flex items-center gap-1 ${
                  subtitleLanguage !== 'Off' ? 'text-[#ff640a]' : 'text-neutral-400'
                }`}
                title="Subtitles"
              >
                <Subtitles className="w-4 h-4" />
                <span className="text-[11px] font-semibold hidden md:inline">{subtitleLanguage}</span>
              </button>

              {showSubtitlesMenu && (
                <div className="absolute bottom-10 right-0 bg-[#161822] border border-white/10 rounded-xl p-2 w-44 shadow-2xl z-40">
                  <p className="text-[11px] font-bold text-neutral-400 px-2 py-1 uppercase tracking-wider">
                    {language === 'bn' ? 'সাবটাইটেল' : 'Subtitles'}
                  </p>
                  {['Bengali', 'English', 'Japanese Romaji', 'Off'].map((sub) => (
                    <button
                      key={sub}
                      onClick={() => {
                        setSubtitleLanguage(sub);
                        setShowSubtitlesMenu(false);
                        showToast(`Subtitles: ${sub}`);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        subtitleLanguage === sub
                          ? 'bg-[#ff640a] text-white'
                          : 'text-neutral-300 hover:bg-white/10'
                      }`}
                    >
                      {sub === 'Bengali' ? 'বাংলা (Bengali)' : sub}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Audio Track Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowAudioMenu(!showAudioMenu);
                  setShowSubtitlesMenu(false);
                  setIsSettingsOpen(false);
                }}
                className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[11px] font-bold transition-colors cursor-pointer"
                title="Audio Language"
              >
                {audioTrack.slice(0, 3).toUpperCase()}
              </button>

              {showAudioMenu && (
                <div className="absolute bottom-10 right-0 bg-[#161822] border border-white/10 rounded-xl p-2 w-44 shadow-2xl z-40">
                  <p className="text-[11px] font-bold text-neutral-400 px-2 py-1 uppercase tracking-wider">
                    {language === 'bn' ? 'অডিও ট্র্যাক' : 'Audio Track'}
                  </p>
                  {selectedAnime.audioTracks.map((trk) => (
                    <button
                      key={trk}
                      onClick={() => {
                        setAudioTrack(trk);
                        setShowAudioMenu(false);
                        showToast(`Audio: ${trk}`);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        audioTrack === trk
                          ? 'bg-[#ff640a] text-white'
                          : 'text-neutral-300 hover:bg-white/10'
                      }`}
                    >
                      {trk === 'Bengali' ? 'বাংলা (Bengali Dub)' : trk === 'Japanese' ? 'Japanese (Original)' : 'English Dub'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Settings (Quality & Speed) */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsSettingsOpen(!isSettingsOpen);
                  setShowSubtitlesMenu(false);
                  setShowAudioMenu(false);
                }}
                className="p-1.5 hover:text-[#ff640a] transition-colors cursor-pointer"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>

              {isSettingsOpen && (
                <div className="absolute bottom-10 right-0 bg-[#161822] border border-white/10 rounded-xl p-3 w-48 shadow-2xl z-40 space-y-3">
                  {/* Quality */}
                  <div>
                    <p className="text-[11px] font-bold text-neutral-400 mb-1.5 uppercase tracking-wider">
                      {language === 'bn' ? 'ভিডিও কোয়ালিটি' : 'Quality'}
                    </p>
                    <div className="grid grid-cols-3 gap-1">
                      {['1080p', '720p', '480p'].map((q) => (
                        <button
                          key={q}
                          onClick={() => {
                            setPlaybackQuality(q);
                            setIsSettingsOpen(false);
                            showToast(`Quality: ${q}`);
                          }}
                          className={`px-2 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                            playbackQuality === q
                              ? 'bg-[#ff640a] text-white'
                              : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Speed */}
                  <div>
                    <p className="text-[11px] font-bold text-neutral-400 mb-1.5 uppercase tracking-wider">
                      {language === 'bn' ? 'গতি (Speed)' : 'Speed'}
                    </p>
                    <div className="grid grid-cols-4 gap-1">
                      {[0.75, 1, 1.25, 1.5].map((spd) => (
                        <button
                          key={spd}
                          onClick={() => handleSpeedChange(spd)}
                          className={`px-1 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                            playbackSpeed === spd
                              ? 'bg-[#ff640a] text-white'
                              : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 hover:text-[#ff640a] transition-colors cursor-pointer"
              title="Fullscreen (f)"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
