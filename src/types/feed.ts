export type CategoryType = 'semua' | 'berita' | 'youtube' | 'medsos' | 'tren';

export interface FeedItem {
  id: string;
  source: string;
  source_icon: string;
  title: string;
  content: string;
  author: string;
  timestamp: string; // ISO string or relative time
  image_url: string;
  original_link: string;
  category: 'berita' | 'youtube' | 'medsos' | 'tren';
  readTime?: string;
  likesCount?: number;
  commentsCount?: number;
  viewsCount?: string;
  badge?: string;
}

export interface UserPreferences {
  theme: 'dark';
  bookmarkedIds: string[];
  activeCategory: CategoryType;
  filterSource?: string;
}
