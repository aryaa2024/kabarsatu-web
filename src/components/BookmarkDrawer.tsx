import React, { useState } from 'react';
import { FeedItem } from '../types/feed';
import { X, Bookmark, ExternalLink, Trash2, Search, AlertCircle } from 'lucide-react';

interface BookmarkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedItems: FeedItem[];
  onRemoveBookmark: (id: string) => void;
  onClearAllBookmarks?: () => void;
  onNotify?: (message: string) => void;
}

export const BookmarkDrawer: React.FC<BookmarkDrawerProps> = ({
  isOpen,
  onClose,
  bookmarkedItems,
  onRemoveBookmark,
  onClearAllBookmarks,
  onNotify
}) => {
  const [bookmarkSearch, setBookmarkSearch] = useState('');

  if (!isOpen) return null;

  const filteredItems = bookmarkedItems.filter(item => 
    item.title.toLowerCase().includes(bookmarkSearch.toLowerCase()) ||
    item.source.toLowerCase().includes(bookmarkSearch.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-slateDark/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
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
            title="Tutup Bookmark"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search within bookmarks */}
        {bookmarkedItems.length > 0 && (
          <div className="p-4 border-b border-subtleGray/40">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slateGray" />
              <input
                type="text"
                value={bookmarkSearch}
                onChange={(e) => setBookmarkSearch(e.target.value)}
                placeholder="Cari dalam artikel tersimpan..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slateDark border border-subtleGray text-xs text-offWhite placeholder-slateGray focus:outline-none focus:border-electricBlue"
              />
            </div>
          </div>
        )}

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {bookmarkedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slateGray py-12">
              <div className="w-16 h-16 rounded-2xl bg-slateDark border border-subtleGray flex items-center justify-center mb-4">
                <Bookmark className="w-8 h-8 text-slateGray/40" />
              </div>
              <p className="text-sm font-semibold text-offWhite mb-1">Belum Ada Bookmark</p>
              <p className="text-xs text-slateGray max-w-xs leading-relaxed">
                Klik ikon bookmark pada kartu berita mana pun untuk menyimpannya ke memori browser Anda secara instan.
              </p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-10 text-slateGray text-xs">
              <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slateGray/60" />
              Tidak ada bookmark yang cocok dengan "{bookmarkSearch}".
            </div>
          ) : (
            filteredItems.map((item) => (
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
                    onClick={() => {
                      onRemoveBookmark(item.id);
                      onNotify?.('Bookmark berhasil dihapus');
                    }}
                    className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>

                  <a
                    href={item.original_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-electricBlue hover:underline active:scale-95"
                  >
                    <span>Buka Artikel</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info & Clear All */}
        {bookmarkedItems.length > 0 && (
          <div className="p-4 border-t border-subtleGray bg-slateDark/60 flex items-center justify-between">
            <p className="text-[11px] text-slateGray">
              Tersimpan di LocalStorage
            </p>
            {onClearAllBookmarks && (
              <button
                onClick={() => {
                  if (window.confirm('Kosongkan semua daftar artikel tersimpan?')) {
                    onClearAllBookmarks();
                    onNotify?.('Semua bookmark telah dibersihkan');
                  }
                }}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
              >
                Kosongkan Semua
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
