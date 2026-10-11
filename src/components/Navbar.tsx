import React from 'react';
import { Search, Bookmark, User, Volume2, Sparkles, X } from 'lucide-react';
import { audioService } from '../services/audioService';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  bookmarkCount: number;
  onOpenBookmarks: () => void;
  onOpenLogin: () => void;
  onReplaySplash: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  bookmarkCount,
  onOpenBookmarks,
  onOpenLogin,
  onReplaySplash
}) => {
  const handlePlayChime = () => {
    audioService.playFuturisticChime();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slateDark/90 backdrop-blur-md border-b border-subtleGray/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onReplaySplash} title="Klik untuk putar intro kembali">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-darkCharcoal border border-subtleGray flex items-center justify-center p-1.5 shadow-md group-hover:border-electricBlue transition-all">
            <img
              src="/logo.png"
              alt="Logo KabarSatu"
              className="w-full h-full object-contain filter drop-shadow group-hover:scale-105 transition-transform"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-offWhite group-hover:text-electricBlue transition-colors">
                Kabar<span className="text-electricBlue">Satu</span>
              </span>
              <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-electricBlue/10 text-electricBlue border border-electricBlue/20">
                <Sparkles className="w-2.5 h-2.5" /> PWA
              </span>
            </div>
            <span className="text-[11px] text-slateGray hidden sm:inline font-medium">
              Semua Kabar, Satu Tujuan
            </span>
          </div>
        </div>

        {/* Search Input Bar (Center) */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slateGray">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari berita, YouTube, medsos..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-darkCharcoal border border-subtleGray text-offWhite placeholder-slateGray text-sm focus:outline-none focus:border-electricBlue focus:ring-1 focus:ring-electricBlue transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slateGray hover:text-offWhite"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Chime Button */}
          <button
            onClick={handlePlayChime}
            title="Dengarkan Chime Audio KabarSatu"
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-darkCharcoal hover:bg-darkCharcoal/80 border border-subtleGray hover:border-electricBlue/50 text-slateGray hover:text-offWhite transition-colors flex items-center gap-1.5 text-xs font-medium"
          >
            <Volume2 className="w-4 h-4 text-electricBlue" />
            <span className="hidden lg:inline">Chime</span>
          </button>

          {/* Bookmark Drawer Toggle Button */}
          <button
            onClick={onOpenBookmarks}
            title="Artikel Tersimpan (Bookmark)"
            className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-darkCharcoal hover:bg-darkCharcoal/80 border border-subtleGray hover:border-electricBlue/50 text-slateGray hover:text-offWhite transition-colors flex items-center gap-1.5 text-xs font-medium"
          >
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Bookmark</span>
            {bookmarkCount > 0 && (
              <span className="px-1.5 py-0.2 bg-electricBlue text-white text-[10px] font-bold rounded-full">
                {bookmarkCount}
              </span>
            )}
          </button>

          {/* Optional Guest Login Button */}
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-electricBlue hover:bg-electricBlue-dark text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-electricBlue/20 hover:shadow-electricBlue/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            <User className="w-4 h-4" />
            <span>Masuk</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar below header */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slateGray">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari berita atau isu terkini..."
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-darkCharcoal border border-subtleGray text-offWhite placeholder-slateGray text-sm focus:outline-none focus:border-electricBlue"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slateGray hover:text-offWhite"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
