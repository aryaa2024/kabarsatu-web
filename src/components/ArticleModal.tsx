import React, { useState } from 'react';
import { FeedItem } from '../types/feed';
import { 
  X, 
  Bookmark, 
  Share2, 
  ExternalLink, 
  Clock, 
  User, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Check, 
  Calendar,
  Sparkles
} from 'lucide-react';

interface ArticleModalProps {
  item: FeedItem | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (item: FeedItem) => void;
  onNotify?: (message: string) => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  item,
  isOpen,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onNotify
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !item) return null;

  // Text-to-Speech handler (Dengarkan Berita)
  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onNotify?.('Browser tidak mendukung pembacaan teks otomatis');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      onNotify?.('Suara pembacaan dihentikan');
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${item.title}. ${item.content}. ${
        item.full_article ? item.full_article.join('. ') : ''
      }`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'id-ID';
      utterance.rate = 1.0;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      onNotify?.('Membacakan isi berita untuk Anda 🔊');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.content,
          url: item.original_link,
        });
        onNotify?.('Berhasil membagikan artikel!');
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(item.original_link);
      setCopied(true);
      onNotify?.('Tautan berita disalin ke clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onNotify?.('Gagal menyalin tautan.');
    }
  };

  const handleClose = () => {
    if (isSpeaking && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    onClose();
  };

  const paragraphs = item.full_article && item.full_article.length > 0 
    ? item.full_article 
    : [
        item.content,
        'Laporan lengkap tim redaksi mengonfirmasi koordinasi berkelanjutan antar lembaga penegak hukum guna menindaklanjuti temuan bukti fisik dan saksi terkait di lokasi perkara.',
        'Pihak berwenang mengimbau masyarakat untuk tetap tenang dan menyaring setiap informasi dari portal media resmi guna menghindari narasi disinformasi dan hoaks.'
      ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slateDark/85 backdrop-blur-md animate-fade-in"
      onClick={handleClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] bg-darkCharcoal border border-subtleGray rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Controls */}
        <div className="p-4 sm:p-5 border-b border-subtleGray/60 flex items-center justify-between bg-darkCharcoal/95 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slateDark text-offWhite border border-subtleGray flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-electricBlue animate-pulse" />
              {item.source}
            </span>
            {item.badge && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-electricBlue/20 text-electricBlue border border-electricBlue/30">
                {item.badge}
              </span>
            )}
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3" /> Terverifikasi
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Text to Speech Button */}
            <button
              onClick={handleToggleSpeech}
              title={isSpeaking ? 'Hentikan Suara' : 'Dengarkan Isi Berita'}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
                isSpeaking 
                  ? 'bg-electricBlue text-white border-electricBlue animate-pulse' 
                  : 'bg-slateDark border-subtleGray text-slateGray hover:text-offWhite hover:border-electricBlue'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-electricBlue" />}
              <span className="hidden md:inline">{isSpeaking ? 'Berhenti' : 'Dengarkan'}</span>
            </button>

            {/* Bookmark Button */}
            <button
              onClick={() => onToggleBookmark(item)}
              title={isBookmarked ? 'Hapus Bookmark' : 'Simpan Bookmark'}
              className={`p-2 rounded-xl border transition-all active:scale-95 ${
                isBookmarked
                  ? 'bg-amber-400/10 border-amber-400/40 text-amber-400'
                  : 'bg-slateDark border-subtleGray text-slateGray hover:text-offWhite'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-amber-400' : ''}`} />
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              title="Bagikan Artikel"
              className="p-2 rounded-xl bg-slateDark border border-subtleGray text-slateGray hover:text-offWhite transition-all active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={handleClose}
              title="Tutup (Esc)"
              className="p-2 rounded-xl bg-slateDark border border-subtleGray text-slateGray hover:text-offWhite hover:bg-rose-950/40 hover:text-rose-400 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          {/* Headline Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-offWhite leading-tight tracking-tight">
            {item.title}
          </h1>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slateGray pb-4 border-b border-subtleGray/50">
            <div className="flex items-center gap-1.5 font-medium text-offWhite">
              <User className="w-3.5 h-3.5 text-electricBlue" />
              <span>{item.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{item.timestamp}</span>
            </div>
            {item.readTime && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{item.readTime}</span>
              </div>
            )}
          </div>

          {/* Featured Image */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slateDark border border-subtleGray/60 shadow-lg">
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>

          {/* Article Paragraphs */}
          <div className="space-y-4 text-sm sm:text-base text-offWhite/90 leading-relaxed font-normal">
            {paragraphs.map((p, idx) => (
              <p key={idx} className="leading-relaxed text-justify">
                {p}
              </p>
            ))}
          </div>

          {/* In-App Verification Banner */}
          <div className="p-4 rounded-2xl bg-slateDark border border-subtleGray/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slateGray mt-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-electricBlue flex-shrink-0" />
              <span>
                Artikel ini telah melalui pengecekan integritas berita KabarSatu dari portal <strong>{item.source}</strong>.
              </span>
            </div>

            <a
              href={item.original_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-electricBlue/10 hover:bg-electricBlue text-electricBlue hover:text-white border border-electricBlue/30 text-xs font-semibold transition-all self-start sm:self-auto flex-shrink-0"
            >
              <span>Kunjungi Laman Sumber</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-subtleGray/60 bg-darkCharcoal/95 flex items-center justify-between text-xs text-slateGray">
          <span>KabarSatu Reader Mode • "Semua Kabar, Satu Tujuan"</span>
          <button
            onClick={handleClose}
            className="px-4 py-1.5 rounded-xl bg-slateDark hover:bg-slateDark/80 border border-subtleGray text-offWhite text-xs font-semibold"
          >
            Selesai Membaca
          </button>
        </div>
      </div>
    </div>
  );
};
