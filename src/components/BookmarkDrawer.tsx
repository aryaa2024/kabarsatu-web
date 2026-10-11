import React from 'react';
import { FeedItem } from '../types/feed';
import { X, Bookmark, ExternalLink, Trash2, ArrowRight } from 'lucide-react';

interface BookmarkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedItems: FeedItem[];
  onRemoveBookmark: (id: string) => void;
}

export const BookmarkDrawer: React.FC<BookmarkDrawerProps> = ({
  isOpen,
  onClose,
  bookmarkedItems,
  onRemoveBookmark
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slateDark/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-darkCharcoal border-l border-subtleGray h-full flex flex-col shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-subtleGray flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400 fill-current" />
            <h3 className="text-base font-bold text-offWhite">
              Artikel Tersimpan ({bookmarkedItems.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slateGray hover:text-offWhite hover:bg-slateDark transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {bookmarkedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slateGray py-12">
              <div className="w-16 h-16 rounded-2xl bg-slateDark border border-subtleGray flex items-center justify-center mb-4">
                <Bookmark className="w-8 h-8 text-slateGray/50" />
              </div>
              <p className="text-sm font-semibold text-offWhite mb-1">Belum Ada Bookmark</p>
              <p className="text-xs text-slateGray max-w-xs">
                Klik ikon bookmark pada artikel mana pun untuk menyimpannya ke memori lokal browser Anda.
              </p>
            </div>
          ) : (
            bookmarkedItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slateDark border border-subtleGray hover:border-electricBlue/50 transition-all flex flex-col gap-2 group"
              >
                <div className="flex items-center justify-between text-[11px] text-slateGray">
                  <span className="font-semibold text-electricBlue">{item.source}</span>
                  <span>{item.timestamp}</span>
                </div>

                <h4 className="text-sm font-semibold text-offWhite line-clamp-2 group-hover:text-electricBlue-light transition-colors">
                  <a href={item.original_link} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                </h4>

                <div className="flex items-center justify-between pt-2 border-t border-subtleGray/40 mt-1">
                  <button
                    onClick={() => onRemoveBookmark(item.id)}
                    className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>

                  <a
                    href={item.original_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-electricBlue hover:underline"
                  >
                    <span>Buka Artikel</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-subtleGray bg-slateDark/60 text-center">
          <p className="text-[11px] text-slateGray">
            Tersimpan secara aman di browser (LocalStorage)
          </p>
        </div>
      </div>
    </div>
  );
};
