import { useState, useEffect } from 'react';
import { FeedItem } from '../types/feed';

const STORAGE_KEY = 'kabarsatu_bookmarks_v1';

export function useBookmarks(allFeeds: FeedItem[]) {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.error('Failed saving bookmarks to localStorage', e);
    }
  }, [bookmarkedIds]);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isBookmarked = (id: string) => bookmarkedIds.includes(id);

  const bookmarkedItems = allFeeds.filter(feed => bookmarkedIds.includes(feed.id));

  return {
    bookmarkedIds,
    bookmarkedItems,
    toggleBookmark,
    isBookmarked
  };
}
