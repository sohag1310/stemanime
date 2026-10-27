import React, { useState } from 'react';
import { Anime, Review } from '../types/anime';
import { useAnime } from '../context/AnimeContext';
import { MessageSquare, ThumbsUp, Send, AlertTriangle, Star } from 'lucide-react';

interface EpisodeCommentsProps {
  anime: Anime;
}

export const EpisodeComments: React.FC<EpisodeCommentsProps> = ({ anime }) => {
  const { language, addReview } = useAnime();
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(10);
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [revealedSpoilers, setRevealedSpoilers] = useState<Record<string, boolean>>({});

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addReview(anime.id, newComment.trim(), rating, isSpoiler);
    setNewComment('');
    setIsSpoiler(false);
  };

  const toggleSpoilerReveal = (id: string) => {
    setRevealedSpoilers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-[#14161f] border border-white/5 rounded-2xl p-5">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#ff640a]" />
          <h3 className="font-bold text-lg text-white font-['Outfit']">
            {language === 'bn' ? 'আলোচনা ও রিভিউ' : 'Discussion & Reviews'}
          </h3>
          <span className="text-xs text-neutral-400 font-mono">({anime.reviews.length})</span>
        </div>
      </div>

      {/* Post a Comment Form */}
      <form onSubmit={handlePost} className="mb-6 bg-[#1b1e2b]/60 border border-white/5 rounded-xl p-3.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-neutral-300 font-medium">
            {language === 'bn' ? 'আপনার মতামত লিখুন:' : 'Leave your thoughts:'}
          </span>

          {/* Rating selector */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-neutral-400 mr-1 font-medium">
              {language === 'bn' ? 'রেটিং:' : 'Rating:'}
            </span>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="bg-[#0f1016] text-amber-400 border border-white/10 text-xs rounded px-2 py-1 font-bold focus:outline-none focus:border-[#ff640a]"
            >
              {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  ★ {n}/10
                </option>
              ))}
            </select>
          </div>
        </div>

        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={
            language === 'bn'
              ? 'এই পর্ব সম্পর্কে আপনার মতামত, এনিমেশন কোয়ালিটি অথবা থিওরি লিখুন...'
              : 'Share your reaction to the episode, animation, or theories...'
          }
          rows={3}
          className="w-full bg-[#0e1017] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff640a] resize-none"
        />

        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/5">
          {/* Spoiler toggle */}
          <label className="flex items-center gap-1.5 text-xs text-neutral-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isSpoiler}
              onChange={(e) => setIsSpoiler(e.target.checked)}
              className="rounded bg-neutral-800 border-white/20 text-[#ff640a] focus:ring-0"
            />
            <span>{language === 'bn' ? 'স্পয়লার রয়েছে (Contains Spoilers)' : 'Contains spoilers'}</span>
          </label>

          <button
            type="submit"
            disabled={!newComment.trim()}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#ff640a] hover:bg-[#e05500] disabled:opacity-40 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'পোস্ট করুন' : 'Post Review'}</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3.5">
        {anime.reviews.map((rev) => {
          const isRevealed = revealedSpoilers[rev.id];
          return (
            <div
              key={rev.id}
              className="p-3.5 bg-[#1b1e2b]/40 border border-white/5 rounded-xl space-y-2 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#ff640a] to-amber-500 flex items-center justify-center text-black font-extrabold text-xs">
                    {rev.user.slice(0, 1)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">{rev.user}</span>
                    <span className="text-[11px] text-neutral-500 ml-2 font-mono">{rev.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-400 font-bold text-xs tabular-nums">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{rev.rating}/10</span>
                </div>
              </div>

              {/* Review Content (with Spoiler Shield) */}
              {rev.isSpoiler && !isRevealed ? (
                <div className="flex items-center justify-between p-2.5 bg-black/40 border border-amber-500/20 rounded-lg text-xs text-amber-400">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{language === 'bn' ? 'এই কমেন্টে স্পয়লার রয়েছে।' : 'This comment contains spoilers.'}</span>
                  </div>
                  <button
                    onClick={() => toggleSpoilerReveal(rev.id)}
                    className="underline text-white hover:text-[#ff640a] font-semibold cursor-pointer"
                  >
                    {language === 'bn' ? 'দেখুন' : 'Reveal'}
                  </button>
                </div>
              ) : (
                <p className="text-xs text-neutral-300 leading-relaxed">{rev.content}</p>
              )}

              {/* Likes counter */}
              <div className="flex items-center gap-4 pt-1 text-[11px] text-neutral-400">
                <button className="flex items-center gap-1 hover:text-[#ff640a] transition-colors cursor-pointer">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span className="tabular-nums">{rev.likes}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
