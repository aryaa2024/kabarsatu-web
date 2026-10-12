import React, { useState } from 'react';
import { Search, Bookmark, User, Volume2, Sparkles, X, Check } from 'lucide-react';
import { audioService } from '../services/audioService';
import { UserProfile } from '../types/feed';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  bookmarkCount: number;
  onOpenBookmarks: () => void;
  onOpenLogin: () => void;
  onReplaySplash: () => void;
  currentUser: UserProfile | null;
  onNotify?: (message: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  bookmarkCount,
  onOpenBookmarks,
  onOpenLogin,
  onReplaySplash,
  currentUser,
  onNotify
}) => {
  const [isPlayingChime, setIsPlayingChime] = useState(false);

  const handlePlayChime = async () => {
    setIsPlayingChime(true);
    await audioService.playFuturisticChime();
    onNotify?.('Memutar nada chime intro KabarSatu 🎶');
    setTimeout(() => setIsPlayingChime(false), 1200);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slateDark/95 backdrop-blur-md border-b border-subtleGray/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={onReplaySplash} 
          title="Klik untuk melihat animasi intro & identitas pembuat"
        >
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
              placeholder="Cari berita, isu politik, kriminal, YouTube, medsos..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-darkCharcoal border border-subtleGray text-offWhite placeholder-slateGray text-sm focus:outline-none focus:border-electricBlue focus:ring-1 focus:ring-electricBlue transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slateGray hover:text-offWhite"
                title="Hapus pencarian"
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
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-darkCharcoal hover:bg-darkCharcoal/80 border border-subtleGray hover:border-electricBlue/60 text-slateGray hover:text-offWhite transition-all flex items-center gap-1.5 text-xs font-semibold active:scale-95"
          >
            <Volume2 className={`w-4 h-4 ${isPlayingChime ? 'text-cyan-400 animate-spin' : 'text-electricBlue'}`} />
            <span className="hidden lg:inline">{isPlayingChime ? 'Memutar...' : 'Chime'}</span>
          </button>

          {/* Bookmark Drawer Toggle Button */}
          <button
            onClick={onOpenBookmarks}
            title="Buka Artikel Tersimpan"
            className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-darkCharcoal hover:bg-darkCharcoal/80 border border-subtleGray hover:border-amber-400/60 text-slateGray hover:text-offWhite transition-all flex items-center gap-1.5 text-xs font-semibold active:scale-95"
          >
            <Bookmark className={`w-4 h-4 ${bookmarkCount > 0 ? 'text-amber-400 fill-current' : 'text-amber-400'}`} />
            <span className="hidden sm:inline">Bookmark</span>
            {bookmarkCount > 0 && (
              <span className="px-1.5 py-0.2 bg-electricBlue text-white text-[10px] font-bold rounded-full animate-fade-in">
                {bookmarkCount}
              </span>
            )}
          </button>

          {/* User Account / Login Button */}
          {currentUser && currentUser.isLoggedIn ? (
            <button
              onClick={onOpenLogin}
              title={`Akun: ${currentUser.name}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-darkCharcoal hover:bg-slateDark border border-electricBlue text-offWhite text-xs font-semibold transition-all active:scale-95 shadow-sm"
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="hidden sm:inline truncate max-w-[100px]">{currentUser.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              title="Buka Menu Masuk"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-electricBlue hover:bg-electricBlue-dark text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-electricBlue/20 hover:shadow-electricBlue/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            >
              <User className="w-4 h-4" />
              <span>Masuk</span>
            </button>
          )}
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
            placeholder="Cari berita, politik, kriminal, medsos..."
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-darkCharcoal border border-subtleGray text-offWhite placeholder-slateGray text-xs sm:text-sm focus:outline-none focus:border-electricBlue"
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
