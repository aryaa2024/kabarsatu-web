import React, { useState } from 'react';
import { FeedItem } from '../types/feed';
import { Bookmark, Share2, ExternalLink, Clock, User, Heart, MessageCircle, Check, Eye } from 'lucide-react';

interface NewsCardProps {
  item: FeedItem;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  item,
  isBookmarked,
  onToggleBookmark
}) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(item.likesCount || 0);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.content,
          url: item.original_link,
        });
        return;
      } catch {
        // User cancelled or unsupported, fallback to copy
      }
    }

    try {
      await navigator.clipboard.writeText(item.original_link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log('Copy link failed', err);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) {
      setLiked(false);
      setLikes(prev => prev - 1);
    } else {
      setLiked(true);
      setLikes(prev => prev + 1);
    }
  };

  return (
    <article className="group flex flex-col justify-between bg-darkCharcoal border border-subtleGray rounded-2xl overflow-hidden hover:border-electricBlue/60 hover:shadow-xl hover:shadow-electricBlue/5 transition-all duration-300 hover:-translate-y-1">
      {/* Top Image / Media Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slateDark">
        <img
          src={item.image_url}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // High quality fallback pattern
            e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80';
          }}
        />
        
        {/* Category / Source Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slateDark/90 backdrop-blur-md text-offWhite border border-subtleGray flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-electricBlue animate-pulse" />
            {item.source}
          </span>
          {item.badge && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-electricBlue/80 backdrop-blur-md text-white shadow-sm">
              {item.badge}
            </span>
          )}
        </div>

        {/* Video Views Tag (For YouTube) */}
        {item.viewsCount && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slateDark/85 text-offWhite border border-subtleGray flex items-center gap-1">
            <Eye className="w-3 h-3 text-cyan-400" />
            <span>{item.viewsCount}</span>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Author & Time */}
          <div className="flex items-center justify-between text-xs text-slateGray mb-2.5">
            <div className="flex items-center gap-1.5 truncate max-w-[60%]">
              <User className="w-3.5 h-3.5 text-slateGray flex-shrink-0" />
              <span className="truncate">{item.author}</span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Clock className="w-3.5 h-3.5 text-slateGray" />
              <span>{item.timestamp}</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-base sm:text-lg font-bold text-offWhite leading-snug line-clamp-2 mb-2 group-hover:text-electricBlue-light transition-colors">
            <a
              href={item.original_link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline focus:outline-none"
            >
              {item.title}
            </a>
          </h2>

          {/* Excerpt / Summary */}
          <p className="text-slateGray text-xs sm:text-sm line-clamp-3 leading-relaxed">
            {item.content}
          </p>
        </div>

        {/* Card Footer Actions */}
        <div className="mt-5 pt-3.5 border-t border-subtleGray/60 flex items-center justify-between">
          {/* Social Stats / Read Time */}
          <div className="flex items-center gap-3 text-xs text-slateGray">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition-colors ${
                liked ? 'text-rose-500 font-bold' : 'hover:text-offWhite'
              }`}
              title="Sukai Artikel"
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
              <span>{likes}</span>
            </button>
            {item.commentsCount && (
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{item.commentsCount}</span>
              </span>
            )}
            {item.readTime && (
              <span className="hidden sm:inline text-[11px] text-slateGray/80 font-medium">
                • {item.readTime}
              </span>
            )}
          </div>

          {/* Action Buttons: Share, Bookmark, Read Link */}
          <div className="flex items-center gap-1.5">
            {/* Share Button */}
            <button
              onClick={handleShare}
              title={copied ? 'Tautan disalin!' : 'Bagikan Berita'}
              className="p-1.5 rounded-lg text-slateGray hover:text-offWhite hover:bg-slateDark border border-transparent hover:border-subtleGray transition-all"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>

            {/* Bookmark Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(item.id);
              }}
              title={isBookmarked ? 'Hapus dari Bookmark' : 'Simpan ke Bookmark'}
              className={`p-1.5 rounded-lg border transition-all ${
                isBookmarked
                  ? 'bg-amber-400/10 border-amber-400/40 text-amber-400'
                  : 'text-slateGray hover:text-offWhite hover:bg-slateDark border-transparent hover:border-subtleGray'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Read External Link Button */}
            <a
              href={item.original_link}
              target="_blank"
              rel="noopener noreferrer"
              title="Buka Sumber Asli"
              className="ml-1 p-1.5 rounded-lg bg-electricBlue/10 hover:bg-electricBlue text-electricBlue hover:text-white border border-electricBlue/30 transition-all flex items-center justify-center"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};
