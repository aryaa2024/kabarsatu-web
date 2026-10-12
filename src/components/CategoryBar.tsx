import React from 'react';
import { CategoryType } from '../types/feed';
import { 
  LayoutGrid, 
  Newspaper, 
  Landmark, 
  ShieldAlert, 
  Share2, 
  Flame,
  Filter
} from 'lucide-react';

interface CategoryBarProps {
  activeCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  activeSourceFilter: string;
  onSelectSourceFilter: (source: string) => void;
  categoryCounts?: Record<CategoryType, number>;
}

const CATEGORIES: { id: CategoryType; label: string; icon: React.ReactNode; description: string }[] = [
  { 
    id: 'semua', 
    label: 'Semua Feed', 
    icon: <LayoutGrid className="w-4 h-4" />,
    description: 'Gabungan seluruh berita & medsos'
  },
  { 
    id: 'berita-umum', 
    label: 'Berita Umum', 
    icon: <Newspaper className="w-4 h-4" />,
    description: 'General News nasional'
  },
  { 
    id: 'politik', 
    label: 'Politik', 
    icon: <Landmark className="w-4 h-4" />,
    description: 'Kebijakan, DPR & pemerintahan'
  },
  { 
    id: 'kriminal-terorisme', 
    label: 'Kriminal & Terorisme', 
    icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
    description: 'Hukum, investigasi, Densus 88 & KPK'
  },
  { 
    id: 'medsos', 
    label: 'YouTube & Medsos Publik', 
    icon: <Share2 className="w-4 h-4 text-cyan-400" />,
    description: 'YouTube, X, Instagram, Reddit'
  },
  { 
    id: 'tren', 
    label: 'Tren Terkini', 
    icon: <Flame className="w-4 h-4 text-amber-400" />,
    description: 'Trending topik & viral'
  },
];

const SOURCES = [
  'Semua Sumber',
  'Kompas',
  'Detik',
  'CNN Indonesia',
  'Tempo',
  'Antara',
  'Liputan6',
  'Merdeka',
  'Republika',
  'Sindonews',
  'Tribunnews',
  'YouTube',
  'X (Twitter)',
  'Instagram',
  'Reddit'
];

export const CategoryBar: React.FC<CategoryBarProps> = ({
  activeCategory,
  onSelectCategory,
  activeSourceFilter,
  onSelectSourceFilter,
  categoryCounts
}) => {
  return (
    <div className="w-full py-3.5 border-b border-subtleGray/50 bg-slateDark/80 backdrop-blur-md sticky top-16 sm:top-20 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 lg:pb-0 scrollbar-none no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = categoryCounts ? categoryCounts[cat.id] : undefined;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                title={cat.description}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap active:scale-95 ${
                  isActive
                    ? 'bg-electricBlue text-white shadow-lg shadow-electricBlue/25 border border-electricBlue'
                    : 'bg-darkCharcoal text-slateGray hover:text-offWhite hover:bg-darkCharcoal/90 border border-subtleGray'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slateDark text-slateGray'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Source Dropdown / Portal Filter */}
        <div className="flex items-center gap-2 self-start lg:self-auto text-xs text-slateGray">
          <Filter className="w-3.5 h-3.5 text-electricBlue hidden sm:inline" />
          <span className="font-semibold text-slateGray">Portal:</span>
          <select
            value={activeSourceFilter}
            onChange={(e) => onSelectSourceFilter(e.target.value)}
            className="bg-darkCharcoal border border-subtleGray text-offWhite rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-electricBlue cursor-pointer hover:border-slateGray transition-colors"
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
