import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Navbar } from './components/Navbar';
import { CategoryBar } from './components/CategoryBar';
import { NewsCard } from './components/NewsCard';
import { BookmarkDrawer } from './components/BookmarkDrawer';
import { LoginModal } from './components/LoginModal';
import { Footer } from './components/Footer';
import { FeedItem, CategoryType, TimeFilterType, UserProfile } from './types/feed';
import { SEED_FEEDS } from './data/seedFeeds';
import { getAggregatedFeeds, filterFeeds } from './services/feedAggregator';
import { useBookmarks } from './hooks/useBookmarks';
import { 
  RefreshCw, 
  SearchX, 
  CheckCircle, 
  Clock, 
  Layers, 
  ChevronDown, 
  SlidersHorizontal 
} from 'lucide-react';

export const App: React.FC = () => {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Feeds State
  const [feeds, setFeeds] = useState<FeedItem[]>(SEED_FEEDS);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Baru saja');
  const [countdown, setCountdown] = useState<number>(60);
  
  // Pagination / Load More limit (show 12 initially, +12 each load more)
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // Filter & Search State
  const [category, setCategory] = useState<CategoryType>(() => {
    try {
      const saved = localStorage.getItem('kabarsatu_category_preference');
      return (saved as CategoryType) || 'semua';
    } catch {
      return 'semua';
    }
  });

  const [timeFilter, setTimeFilter] = useState<TimeFilterType>('semua');
  const [sourceFilter, setSourceFilter] = useState<string>('Semua Sumber');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers State
  const [isBookmarkOpen, setIsBookmarkOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // User Authentication / Guest Session State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem('kabarsatu_user_session');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Toast Notification System
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  // Bookmarks Hook
  const { 
    bookmarkedItems, 
    toggleBookmark, 
    removeBookmark, 
    clearAllBookmarks, 
    isBookmarked 
  } = useBookmarks(feeds);

  // Save Category Preference to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kabarsatu_category_preference', category);
    } catch (e) {
      console.error(e);
    }
  }, [category]);

  // Reset pagination when category, time, or search changes
  useEffect(() => {
    setVisibleCount(12);
  }, [category, timeFilter, sourceFilter, searchQuery]);

  // Handle User Login & Logout
  const handleLogin = (profile: UserProfile) => {
    setCurrentUser(profile);
    try {
      localStorage.setItem('kabarsatu_user_session', JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('kabarsatu_user_session');
    } catch (e) {
      console.error(e);
    }
  };

  // Load Aggregated Feeds
  const loadFeeds = useCallback(async (isManual = false) => {
    setLoading(true);
    try {
      const aggregated = await getAggregatedFeeds();
      setFeeds(aggregated);
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;
      setLastUpdated(timeStr);
      setCountdown(60);
      if (isManual) {
        showToast('Feed berita & medsos berhasil disegarkan! ⚡');
      }
    } catch (err) {
      console.error('Error loading feeds:', err);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Initial Load
  useEffect(() => {
    loadFeeds(false);
  }, [loadFeeds]);

  // Auto-Refresh Every 60 Seconds (1 Minute) with countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          loadFeeds(false);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loadFeeds]);

  // Category Counts Calculation
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryType, number> = {
      'semua': feeds.length,
      'berita-umum': feeds.filter(f => f.category === 'berita-umum').length,
      'politik': feeds.filter(f => f.category === 'politik').length,
      'kriminal-terorisme': feeds.filter(f => f.category === 'kriminal-terorisme').length,
      'medsos': feeds.filter(f => f.category === 'medsos').length,
      'tren': feeds.filter(f => f.category === 'tren').length,
    };
    return counts;
  }, [feeds]);

  // Filtered Feeds Calculation
  const displayedFeeds = useMemo(() => {
    let result = filterFeeds(feeds, category, searchQuery, timeFilter);

    if (sourceFilter !== 'Semua Sumber') {
      result = result.filter(item => item.source.toLowerCase() === sourceFilter.toLowerCase());
    }

    return result;
  }, [feeds, category, searchQuery, timeFilter, sourceFilter]);

  // Feeds sliced by visibleCount for fast rendering and infinite feel
  const paginatedFeeds = useMemo(() => {
    return displayedFeeds.slice(0, visibleCount);
  }, [displayedFeeds, visibleCount]);

  // Bookmark Toggle Handler with Toast
  const handleToggleBookmarkItem = (item: FeedItem) => {
    const wasBookmarked = isBookmarked(item.id);
    toggleBookmark(item);
    if (wasBookmarked) {
      showToast('Artikel dihapus dari Bookmark');
    } else {
      showToast('Artikel berhasil disimpan ke Bookmark! 📌');
    }
  };

  return (
    <div className="min-h-screen bg-slateDark text-offWhite flex flex-col font-sans selection:bg-electricBlue selection:text-white">
      {/* 1. Splash Screen Intro (Auto-transitions to Beranda) */}
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
        currentUser={currentUser}
        onNotify={showToast}
      />

      {/* 3. Category & Filter Bar */}
      <CategoryBar
        activeCategory={category}
        onSelectCategory={setCategory}
        activeSourceFilter={sourceFilter}
        onSelectSourceFilter={setSourceFilter}
        activeTimeFilter={timeFilter}
        onSelectTimeFilter={setTimeFilter}
        categoryCounts={categoryCounts}
      />

      {/* 4. Main Unified Feed Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Feed Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-subtleGray/40 gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-offWhite tracking-tight">
                Unified Feed Terpadu
              </h1>
              {sourceFilter !== 'Semua Sumber' && (
                <span className="px-2.5 py-0.5 rounded-lg bg-electricBlue/20 border border-electricBlue/40 text-electricBlue text-xs font-bold">
                  {sourceFilter}
                </span>
              )}
              {timeFilter !== 'semua' && (
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-400/10 border border-amber-400/40 text-amber-400 text-xs font-bold">
                  {timeFilter === '24-jam' ? '24 Jam Terakhir' : timeFilter === '3-hari' ? '3 Hari Terakhir' : '7 Hari Terakhir'}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slateGray mt-1">
              Menampilkan {displayedFeeds.length} kabar terverifikasi (arsip 1 minggu terakhir) dari 10 portal berita nasional terpercaya, YouTube & medsos
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Auto Refresh Status Counter */}
            <div className="flex items-center gap-1.5 text-xs text-slateGray bg-darkCharcoal px-3 py-1.5 rounded-xl border border-subtleGray">
              <Clock className="w-3.5 h-3.5 text-electricBlue" />
              <span>Diperbarui: <strong className="text-offWhite">{lastUpdated}</strong></span>
              <span className="text-[10px] text-slateGray/70">({countdown}s)</span>
            </div>

            {/* Manual Refresh Button */}
            <button
              onClick={() => loadFeeds(true)}
              disabled={loading}
              title="Segarkan Feed Secara Manual"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-electricBlue/10 hover:bg-electricBlue border border-electricBlue/40 text-electricBlue hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
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
            <p className="text-sm text-slateGray max-w-sm mb-6 leading-relaxed">
              Tidak ada artikel yang cocok dengan kata kunci "{searchQuery}" atau filter yang dipilih.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setCategory('semua');
                setSourceFilter('Semua Sumber');
                setTimeFilter('semua');
                showToast('Filter telah direset ke Semua Feed');
              }}
              className="px-4 py-2 rounded-xl bg-electricBlue text-white text-sm font-semibold hover:bg-electricBlue-dark transition-all active:scale-95 shadow-md shadow-electricBlue/20"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {paginatedFeeds.map((feed) => (
                <NewsCard
                  key={feed.id}
                  item={feed}
                  isBookmarked={isBookmarked(feed.id)}
                  onToggleBookmark={handleToggleBookmarkItem}
                  onNotify={showToast}
                />
              ))}
            </div>

            {/* Load More Button */}
            {visibleCount < displayedFeeds.length && (
              <div className="mt-10 flex flex-col items-center justify-center gap-2">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                  className="px-6 py-3 rounded-2xl bg-darkCharcoal hover:bg-darkCharcoal/80 border border-subtleGray hover:border-electricBlue text-offWhite text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-black/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                >
                  <Layers className="w-4 h-4 text-electricBlue" />
                  <span>Muat Lebih Banyak Berita ({displayedFeeds.length - visibleCount} tersisa)</span>
                  <ChevronDown className="w-4 h-4 text-slateGray" />
                </button>
                <p className="text-xs text-slateGray">
                  Menampilkan {paginatedFeeds.length} dari {displayedFeeds.length} artikel terpercaya
                </p>
              </div>
            )}
          </div>
        )}

      </main>

      {/* 5. Drawers & Modals */}
      <BookmarkDrawer
        isOpen={isBookmarkOpen}
        onClose={() => setIsBookmarkOpen(false)}
        bookmarkedItems={bookmarkedItems}
        onRemoveBookmark={removeBookmark}
        onClearAllBookmarks={clearAllBookmarks}
        onNotify={showToast}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onNotify={showToast}
      />

      {/* 6. Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-darkCharcoal border border-electricBlue text-offWhite text-xs sm:text-sm font-medium shadow-2xl animate-slide-up backdrop-blur-md">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 7. Footer Copyright */}
      <Footer />
    </div>
  );
};

export default App;
