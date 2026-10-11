import React, { useState, useEffect, useMemo } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Navbar } from './components/Navbar';
import { CategoryBar } from './components/CategoryBar';
import { NewsCard } from './components/NewsCard';
import { BookmarkDrawer } from './components/BookmarkDrawer';
import { LoginModal } from './components/LoginModal';
import { Footer } from './components/Footer';
import { FeedItem, CategoryType } from './types/feed';
import { SEED_FEEDS } from './data/seedFeeds';
import { getAggregatedFeeds, filterFeeds } from './services/feedAggregator';
import { useBookmarks } from './hooks/useBookmarks';
import { RefreshCw, SearchX, Sparkles, Radio } from 'lucide-react';

export const App: React.FC = () => {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Feeds State
  const [feeds, setFeeds] = useState<FeedItem[]>(SEED_FEEDS);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Baru saja');

  // Filter & Search State
  const [category, setCategory] = useState<CategoryType>(() => {
    try {
      const saved = localStorage.getItem('kabarsatu_category_preference');
      return (saved as CategoryType) || 'semua';
    } catch {
      return 'semua';
    }
  });

  const [sourceFilter, setSourceFilter] = useState<string>('Semua Sumber');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers State
  const [isBookmarkOpen, setIsBookmarkOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Bookmarks hook
  const { bookmarkedItems, toggleBookmark, isBookmarked } = useBookmarks(feeds);

  // Save category preference
  useEffect(() => {
    try {
      localStorage.setItem('kabarsatu_category_preference', category);
    } catch (e) {
      console.error(e);
    }
  }, [category]);

  // Load aggregated feeds
  const loadFeeds = async () => {
    setLoading(true);
    try {
      const aggregated = await getAggregatedFeeds();
      setFeeds(aggregated);
      const now = new Date();
      setLastUpdated(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`);
    } catch (err) {
      console.error('Error loading feeds:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeeds();
  }, []);

  // Filtered feeds calculation
  const displayedFeeds = useMemo(() => {
    let result = filterFeeds(feeds, category, searchQuery);

    if (sourceFilter !== 'Semua Sumber') {
      result = result.filter(item => item.source.toLowerCase() === sourceFilter.toLowerCase());
    }

    return result;
  }, [feeds, category, searchQuery, sourceFilter]);

  return (
    <div className="min-h-screen bg-slateDark text-offWhite flex flex-col font-sans">
      {/* 1. Splash Screen Intro */}
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

      {/* 2. Top Navigation */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        bookmarkCount={bookmarkedItems.length}
        onOpenBookmarks={() => setIsBookmarkOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onReplaySplash={() => setShowSplash(true)}
      />

      {/* 3. Category & Portal Filter Bar */}
      <CategoryBar
        activeCategory={category}
        onSelectCategory={setCategory}
        activeSourceFilter={sourceFilter}
        onSelectSourceFilter={setSourceFilter}
      />

      {/* 4. Main Unified Feed Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Feed Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-subtleGray/40 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-offWhite tracking-tight">
                Unified Feed Terpadu
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slateGray mt-1">
              Menampilkan {displayedFeeds.length} kabar terkini dari 5 portal berita nasional, YouTube, & medsos
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <span className="text-xs text-slateGray">
              Diperbarui: <strong className="text-offWhite">{lastUpdated}</strong>
            </span>
            <button
              onClick={loadFeeds}
              disabled={loading}
              title="Segarkan Feed"
              className="p-2 rounded-xl bg-darkCharcoal hover:bg-darkCharcoal/80 border border-subtleGray hover:border-electricBlue text-slateGray hover:text-offWhite transition-all flex items-center gap-1.5 text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-electricBlue' : ''}`} />
              <span className="hidden sm:inline">Segarkan</span>
            </button>
          </div>
        </div>

        {/* Feed Cards Grid */}
        {displayedFeeds.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-darkCharcoal border border-subtleGray flex items-center justify-center mb-4 text-slateGray">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-offWhite mb-1">
              Tidak Ada Kabar Ditemukan
            </h3>
            <p className="text-sm text-slateGray max-w-sm mb-6">
              Tidak ada artikel yang cocok dengan kata kunci "{searchQuery}" atau filter sumber yang dipilih.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setCategory('semua');
                setSourceFilter('Semua Sumber');
              }}
              className="px-4 py-2 rounded-xl bg-electricBlue text-white text-sm font-semibold hover:bg-electricBlue-dark transition-all"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {displayedFeeds.map((feed) => (
              <NewsCard
                key={feed.id}
                item={feed}
                isBookmarked={isBookmarked(feed.id)}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </div>
        )}

      </main>

      {/* 5. Drawers & Modals */}
      <BookmarkDrawer
        isOpen={isBookmarkOpen}
        onClose={() => setIsBookmarkOpen(false)}
        bookmarkedItems={bookmarkedItems}
        onRemoveBookmark={toggleBookmark}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

      {/* 6. Footer Copyright */}
      <Footer />
    </div>
  );
};

export default App;
