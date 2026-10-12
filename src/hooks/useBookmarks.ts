import { useState, useEffect } from 'react';
import { FeedItem } from '../types/feed';

const STORAGE_KEY = 'kabarsatu_bookmarks_v2';

export function useBookmarks(allFeeds: FeedItem[]) {
  // Store full bookmarked feed items in localStorage for 100% data persistence
  const [bookmarkedItems, setBookmarkedItems] = useState<FeedItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarkedItems));
    } catch (e) {
      console.error('Failed saving bookmarks to localStorage', e);
    }
  }, [bookmarkedItems]);

  const toggleBookmark = (item: FeedItem) => {
    setBookmarkedItems(prev => {
      const exists = prev.some(b => b.id === item.id);
      if (exists) {
        return prev.filter(b => b.id !== item.id);
      } else {
        return [item, ...prev];
      }
    });
  };

  const removeBookmark = (id: string) => {
    setBookmarkedItems(prev => prev.filter(b => b.id !== id));
  };

  const clearAllBookmarks = () => {
    setBookmarkedItems([]);
  };

  const isBookmarked = (id: string) => {
    return bookmarkedItems.some(b => b.id === id);
  };

  return {
    bookmarkedItems,
    toggleBookmark,
    removeBookmark,
    clearAllBookmarks,
    isBookmarked
  };
}
