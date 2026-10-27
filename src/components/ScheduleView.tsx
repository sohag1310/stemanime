import React, { useState } from 'react';
import { useAnime } from '../context/AnimeContext';
import { ANIME_DATABASE, SCHEDULE_DAYS } from '../data/animeData';
import { DayOfWeek } from '../types/anime';
import { Calendar, Play, Clock, Sparkles } from 'lucide-react';

export const ScheduleView: React.FC = () => {
  const { language, startWatching } = useAnime();

  // Current day calculation
  const todayIndex = new Date().getDay(); // 0 is Sunday
  const dayNames: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = dayNames[todayIndex];

  const [selectedDay, setSelectedDay] = useState<DayOfWeek | 'All'>('All');

  const dayTranslations: Record<DayOfWeek, { bn: string; en: string }> = {
    Monday: { bn: 'সোমবার', en: 'Monday' },
    Tuesday: { bn: 'মঙ্গলবার', en: 'Tuesday' },
    Wednesday: { bn: 'বুধবার', en: 'Wednesday' },
    Thursday: { bn: 'বৃহস্পতিবার', en: 'Thursday' },
    Friday: { bn: 'শুক্রবার', en: 'Friday' },
    Saturday: { bn: 'শনিবার', en: 'Saturday' },
    Sunday: { bn: 'রবিবার', en: 'Sunday' },
  };

  const scheduledAnime = ANIME_DATABASE.filter((anime) => {
    if (selectedDay === 'All') return true;
    return anime.releaseScheduleDay === selectedDay;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      {/* Title */}
      <div className="pb-6 border-b border-white/10">
        <div className="flex items-center gap-2 text-xs font-bold text-[#ff640a] uppercase tracking-wider mb-1">
          <Calendar className="w-4 h-4" />
          <span>{language === 'bn' ? 'সাপ্তাহিক রিলিজ সূচি' : 'Weekly Broadcast Timetable'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
          {language === 'bn' ? 'অ্যানিমে সাইমলকাস্ট শিডিউল' : 'Simulcast Release Calendar'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          {language === 'bn'
            ? 'টোকিও ও জাপানি টিভি চ্যানেলে সম্প্রচারের সাথে সাথেই নতুন পর্বের সাবটাইটেল ও ডাবিং রিলিজ'
            : 'Track live episode air times synchronized directly with Tokyo Japanese broadcast schedules.'}
        </p>
      </div>

      {/* Day Selector Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedDay('All')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
            selectedDay === 'All'
              ? 'bg-[#ff640a] text-white shadow-lg shadow-[#ff640a]/20'
              : 'bg-[#151720] text-neutral-400 hover:text-white hover:bg-[#1f222e]'
          }`}
        >
          {language === 'bn' ? 'পুরো সপ্তাহ' : 'Full Week'}
        </button>

        {SCHEDULE_DAYS.map((day) => {
          const isToday = day === todayName;
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`relative px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#ff640a] text-white shadow-lg shadow-[#ff640a]/20'
                  : 'bg-[#151720] text-neutral-400 hover:text-white hover:bg-[#1f222e]'
              }`}
            >
              <span>{language === 'bn' ? dayTranslations[day].bn : dayTranslations[day].en}</span>
              {isToday && (
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded font-mono">
                  {language === 'bn' ? 'আজ' : 'Today'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Schedule Grid */}
      <div className="space-y-4">
        {scheduledAnime.map((anime) => (
          <div
            key={anime.id}
            className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 bg-[#14161f] border border-white/5 hover:border-[#ff640a]/40 rounded-2xl transition-all"
          >
            {/* Left Info: Poster, Titles, Release day */}
            <div className="flex items-center gap-4">
              <div className="relative w-20 sm:w-24 aspect-[3/4] rounded-xl overflow-hidden bg-black shrink-0 border border-white/10">
                <img
                  src={anime.posterImage}
                  alt={anime.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs text-[#ff640a] font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {language === 'bn'
                      ? dayTranslations[anime.releaseScheduleDay].bn
                      : anime.releaseScheduleDay}
                  </span>
                  <span className="text-neutral-500">·</span>
                  <span className="text-neutral-300 font-mono">{anime.releaseScheduleTime}</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white mt-1 group-hover:text-[#ff640a] transition-colors">
                  {language === 'bn' ? (anime.titleBn || anime.title) : anime.title}
                </h3>

                <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
                  {anime.studio} · {anime.genres.slice(0, 3).join(', ')}
                </p>

                <div className="flex items-center gap-2 mt-2 text-[11px] text-neutral-400">
                  <span className="font-semibold text-white">
                    {language === 'bn'
                      ? `পরবর্তী রিলিজ: পর্ব ${anime.currentEpisodeCount + 1}`
                      : `Upcoming: Episode ${anime.currentEpisodeCount + 1}`}
                  </span>
                  <span className="text-neutral-600">|</span>
                  <span className="text-amber-400 font-semibold">
                    {anime.audioTracks.includes('Bengali') ? 'Subbed & Bengali Dub' : 'Subbed & Dubbed'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Action: Play Latest Episode */}
            <div className="flex items-center gap-3 self-end md:self-center">
              <button
                onClick={() => startWatching(anime)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#ff640a] hover:bg-[#e05500] text-white font-bold text-xs sm:text-sm rounded-lg shadow-md transition-transform hover:scale-105 cursor-pointer whitespace-nowrap"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>
                  {language === 'bn' ? 'সর্বশেষ পর্ব দেখুন' : 'Watch Latest'}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
