import React from 'react';
import { CategoryType, TimeFilterType } from '../types/feed';
import { 
  LayoutGrid, 
  Newspaper, 
  Landmark, 
  ShieldAlert, 
  Share2, 
  Flame,
  Filter,
  Calendar
} from 'lucide-react';

interface CategoryBarProps {
  activeCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  activeSourceFilter: string;
  onSelectSourceFilter: (source: string) => void;
  activeTimeFilter: TimeFilterType;
  onSelectTimeFilter: (time: TimeFilterType) => void;
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

const TIME_FILTERS: { id: TimeFilterType; label: string }[] = [
  { id: 'semua', label: '1 Minggu Terakhir (Lengkap)' },
  { id: '24-jam', label: '24 Jam Terakhir' },
  { id: '3-hari', label: '3 Hari Terakhir' },
  { id: '1-minggu', label: '7 Hari Terakhir' }
];

export const CategoryBar: React.FC<CategoryBarProps> = ({
  activeCategory,
  onSelectCategory,
  activeSourceFilter,
  onSelectSourceFilter,
  activeTimeFilter,
  onSelectTimeFilter,
  categoryCounts
}) => {
  return (
    <div className="w-full py-3.5 border-b border-subtleGray/50 bg-slateDark/90 backdrop-blur-md sticky top-16 sm:top-20 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        
        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 xl:pb-0 scrollbar-none no-scrollbar">
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

        {/* Filter Controls (Portal & Rentang Waktu) */}
        <div className="flex flex-wrap items-center gap-2.5 self-start xl:self-auto text-xs text-slateGray">
          {/* Time Range Selector */}
          <div className="flex items-center gap-1.5 bg-darkCharcoal border border-subtleGray rounded-xl px-2.5 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={activeTimeFilter}
              onChange={(e) => onSelectTimeFilter(e.target.value as TimeFilterType)}
              className="bg-transparent text-offWhite text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {TIME_FILTERS.map((tf) => (
                <option key={tf.id} value={tf.id} className="bg-darkCharcoal text-offWhite">
                  {tf.label}
                </option>
              ))}
            </select>
          </div>

          {/* Portal Source Dropdown */}
          <div className="flex items-center gap-1.5 bg-darkCharcoal border border-subtleGray rounded-xl px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-electricBlue" />
            <select
              value={activeSourceFilter}
              onChange={(e) => onSelectSourceFilter(e.target.value)}
              className="bg-transparent text-offWhite text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {SOURCES.map((src) => (
                <option key={src} value={src} className="bg-darkCharcoal text-offWhite">
                  {src}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>
    </div>
  );
};
