import React, { useState } from 'react';
import { FeedItem } from '../types/feed';
import { 
  Bookmark, 
  Share2, 
  ExternalLink, 
  Clock, 
  User, 
  Heart, 
  MessageCircle, 
  Check, 
  Eye, 
  Video,
  Send,
  X
} from 'lucide-react';

interface NewsCardProps {
  item: FeedItem;
  isBookmarked: boolean;
  onToggleBookmark: (item: FeedItem) => void;
  onNotify?: (message: string) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  item,
  isBookmarked,
  onToggleBookmark,
  onNotify
}) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(item.likesCount || 0);
  
  // Interactive comment state
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentsList, setCommentsList] = useState<string[]>([]);
  const [commentInput, setCommentInput] = useState('');

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.content,
          url: item.original_link,
        });
        onNotify?.('Berhasil membagikan kabar!');
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(item.original_link);
      setCopied(true);
      onNotify?.('Tautan berita berhasil disalin ke papan klip!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onNotify?.('Gagal menyalin tautan.');
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) {
      setLiked(false);
      setLikes(prev => prev - 1);
      onNotify?.('Batal menyukai');
    } else {
      setLiked(true);
      setLikes(prev => prev + 1);
      onNotify?.('Menyukai kabar ini ❤️');
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setCommentsList(prev => [...prev, commentInput.trim()]);
    setCommentInput('');
    onNotify?.('Komentar Anda berhasil ditambahkan!');
  };

  return (
    <article className="group flex flex-col justify-between bg-darkCharcoal border border-subtleGray rounded-2xl overflow-hidden hover:border-electricBlue/70 hover:shadow-xl hover:shadow-electricBlue/10 transition-all duration-300 hover:-translate-y-1">
      {/* Top Image / Media Container */}
      <a
        href={item.original_link}
        target="_blank"
        rel="noopener noreferrer"
        className="relative aspect-video w-full overflow-hidden bg-slateDark block cursor-pointer"
        title="Klik untuk membuka tautan asli di tab baru"
      >
        <img
          src={item.image_url}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80';
          }}
        />
        
        {/* Category / Source Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
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
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slateDark/90 text-offWhite border border-subtleGray flex items-center gap-1">
            <Eye className="w-3 h-3 text-cyan-400" />
            <span>{item.viewsCount}</span>
          </div>
        )}

        {/* Video Icon if video */}
        {item.mediaType === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none">
            <div className="w-11 h-11 rounded-full bg-electricBlue/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Video className="w-5 h-5 ml-0.5" />
            </div>
          </div>
        )}
      </a>

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
              title="Buka artikel asli"
            >
              {item.title}
            </a>
          </h2>

          {/* Excerpt / Summary */}
          <p className="text-slateGray text-xs sm:text-sm line-clamp-3 leading-relaxed mb-1">
            {item.content}
          </p>
        </div>

        {/* Interactive Comments Drawer/Accordion */}
        {showCommentBox && (
          <div className="mt-3 p-3 rounded-xl bg-slateDark border border-subtleGray/80 animate-fade-in text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-offWhite">Komentar & Opini Publik:</span>
              <button 
                onClick={() => setShowCommentBox(false)}
                className="text-slateGray hover:text-offWhite"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {/* Added comments */}
            <div className="max-h-24 overflow-y-auto space-y-1.5 mb-2">
              {commentsList.length === 0 ? (
                <p className="text-[11px] text-slateGray italic">Belum ada komentar. Jadilah yang pertama!</p>
              ) : (
                commentsList.map((c, i) => (
                  <div key={i} className="p-1.5 rounded bg-darkCharcoal text-offWhite text-[11px] border border-subtleGray/40">
                    <strong className="text-electricBlue">Anda:</strong> {c}
                  </div>
                ))
              )}
            </div>

            {/* Input form */}
            <form onSubmit={handleAddComment} className="flex gap-1.5">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Tulis pendapat Anda..."
                className="flex-1 px-2.5 py-1 rounded-lg bg-darkCharcoal border border-subtleGray text-offWhite placeholder-slateGray text-xs focus:outline-none focus:border-electricBlue"
              />
              <button
                type="submit"
                className="px-2.5 py-1 rounded-lg bg-electricBlue text-white hover:bg-electricBlue-dark transition-colors flex items-center justify-center"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        )}

        {/* Card Footer Actions */}
        <div className="mt-5 pt-3.5 border-t border-subtleGray/60 flex items-center justify-between">
          {/* Social Stats / Read Time */}
          <div className="flex items-center gap-3 text-xs text-slateGray">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition-all active:scale-95 ${
                liked ? 'text-rose-500 font-bold' : 'hover:text-offWhite'
              }`}
              title="Sukai Artikel"
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current text-rose-500 animate-bounce' : ''}`} />
              <span>{likes}</span>
            </button>

            <button
              onClick={() => setShowCommentBox(prev => !prev)}
              className="flex items-center gap-1 hover:text-offWhite transition-colors"
              title="Buka Komentar"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{(item.commentsCount || 0) + commentsList.length}</span>
            </button>

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
              className="p-1.5 rounded-lg text-slateGray hover:text-offWhite hover:bg-slateDark border border-transparent hover:border-subtleGray transition-all active:scale-95"
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
                onToggleBookmark(item);
              }}
              title={isBookmarked ? 'Hapus dari Bookmark' : 'Simpan ke Bookmark'}
              className={`p-1.5 rounded-lg border transition-all active:scale-95 ${
                isBookmarked
                  ? 'bg-amber-400/10 border-amber-400/40 text-amber-400 shadow-sm'
                  : 'text-slateGray hover:text-offWhite hover:bg-slateDark border-transparent hover:border-subtleGray'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-amber-400' : ''}`} />
            </button>

            {/* Read External Link Button */}
            <a
              href={item.original_link}
              target="_blank"
              rel="noopener noreferrer"
              title="Buka Artikel Asli di Tab Baru"
              className="ml-1 p-1.5 rounded-lg bg-electricBlue/10 hover:bg-electricBlue text-electricBlue hover:text-white border border-electricBlue/30 transition-all flex items-center justify-center active:scale-95"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};
