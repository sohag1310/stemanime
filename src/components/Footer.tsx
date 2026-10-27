import React from 'react';
import { useAnime } from '../context/AnimeContext';
import { Play } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, setActiveTab, closePlayer } = useAnime();

  const handleNav = (tab: any) => {
    setActiveTab(tab);
    closePlayer();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#08090d] border-t border-white/10 text-neutral-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/5">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#ff640a] flex items-center justify-center text-black font-extrabold shadow-md">
              <Play className="w-4 h-4 fill-black text-black ml-0.5" />
            </div>
            <div>
              <span className="font-extrabold font-['Outfit'] text-white text-base tracking-tight">
                ANI<span className="text-[#ff640a]">STREAM</span>
              </span>
              <p className="text-[11px] text-neutral-500">
                {language === 'bn'
                  ? 'ক্রাঞ্চিরোল ও অ্যানিমে ওয়ার্ল্ড অনুপ্রাণিত আলটিমেট অ্যানিমে স্ট্রিমিং প্ল্যাটফর্ম'
                  : 'Next-Generation Anime Simulcast & Streaming Experience'}
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
            <button
              onClick={() => handleNav('home')}
              className="text-neutral-300 hover:text-[#ff640a] transition-colors cursor-pointer"
            >
              {language === 'bn' ? 'হোম' : 'Home'}
            </button>
            <button
              onClick={() => handleNav('browse')}
              className="text-neutral-300 hover:text-[#ff640a] transition-colors cursor-pointer"
            >
              {language === 'bn' ? 'ক্যাটালগ' : 'Browse'}
            </button>
            <button
              onClick={() => handleNav('schedule')}
              className="text-neutral-300 hover:text-[#ff640a] transition-colors cursor-pointer"
            >
              {language === 'bn' ? 'সাইমলকাস্ট শিডিউল' : 'Simulcast Schedule'}
            </button>
            <button
              onClick={() => handleNav('watchlist')}
              className="text-neutral-300 hover:text-[#ff640a] transition-colors cursor-pointer"
            >
              {language === 'bn' ? 'আমার লাইব্রেরি' : 'My Library'}
            </button>
          </div>
        </div>

        {/* Quiet disclaimer and copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>
            © 2026 AniStream. Built for anime enthusiasts with Japanese & Bengali dubbing/subtitles.
          </p>
          <div className="flex items-center gap-4">
            <span className="hover:text-neutral-400">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-neutral-400">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-neutral-400">Content Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
