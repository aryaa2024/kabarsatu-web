import React from 'react';
import { CategoryType } from '../types/feed';
import { Newspaper, Video, MessageSquare, Flame, LayoutGrid } from 'lucide-react';

interface CategoryBarProps {
  activeCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  activeSourceFilter: string;
  onSelectSourceFilter: (source: string) => void;
}

const CATEGORIES: { id: CategoryType; label: string; icon: React.ReactNode; countLabel?: string }[] = [
  { id: 'semua', label: 'Semua Feed', icon: <LayoutGrid className="w-4 h-4" /> },
  { id: 'berita', label: 'Berita Nasional', icon: <Newspaper className="w-4 h-4" /> },
  { id: 'youtube', label: 'YouTube Video', icon: <Video className="w-4 h-4" /> },
  { id: 'medsos', label: 'Medsos Publik', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'tren', label: 'Tren Terkini', icon: <Flame className="w-4 h-4" /> },
];

const SOURCES = [
  'Semua Sumber',
  'Kompas',
  'Detik',
  'Antara',
  'CNN Indonesia',
  'Tempo',
  'YouTube',
  'Medsos'
];

export const CategoryBar: React.FC<CategoryBarProps> = ({
  activeCategory,
  onSelectCategory,
  activeSourceFilter,
  onSelectSourceFilter
}) => {
  return (
    <div className="w-full py-4 border-b border-subtleGray/40 bg-slateDark/50 backdrop-blur-sm sticky top-16 sm:top-20 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-electricBlue text-white shadow-lg shadow-electricBlue/25 border border-electricBlue'
                    : 'bg-darkCharcoal text-slateGray hover:text-offWhite hover:bg-darkCharcoal/80 border border-subtleGray'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slateGray'}>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Source Dropdown / Filter Bar */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slateGray">
          <span className="hidden md:inline font-medium">Filter Portal:</span>
          <select
            value={activeSourceFilter}
            onChange={(e) => onSelectSourceFilter(e.target.value)}
            className="bg-darkCharcoal border border-subtleGray text-offWhite rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-electricBlue cursor-pointer"
          >
            {SOURCES.map((src) => (
              <option key={src} value={src}>
                {src}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
};
