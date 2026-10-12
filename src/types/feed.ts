export type CategoryType = 
  | 'semua' 
  | 'berita-umum' 
  | 'politik' 
  | 'kriminal-terorisme' 
  | 'medsos' 
  | 'tren';

export type TimeFilterType = 'semua' | '24-jam' | '3-hari' | '1-minggu';

export interface FeedItem {
  id: string;
  source: string;              // 'Kompas', 'Detik', 'CNN Indonesia', 'Tempo', 'Antara', 'Liputan6', 'Merdeka', 'Republika', 'Sindonews', 'Tribunnews', 'YouTube', 'X (Twitter)', 'Instagram', 'Reddit'
  source_icon: string;         // Favicon / Icon URL
  title: string;               // Headline or post title
  content: string;             // Summary / post content
  author: string;              // Journalist or username
  timestamp: string;           // E.g., '15 menit lalu', '2 hari lalu', '1 minggu lalu'
  image_url: string;           // Media thumbnail
  original_link: string;       // Direct verified working link to portal
  category: 'berita-umum' | 'politik' | 'kriminal-terorisme' | 'medsos' | 'tren';
  readTime?: string;           // E.g. '3 mnt baca' or video duration
  likesCount?: number;
  commentsCount?: number;
  viewsCount?: string;
  badge?: string;              // E.g. 'Investigasi', 'Densus 88', 'KPK', 'Viral'
  mediaType?: 'article' | 'video' | 'social_post';
  daysAgo?: number;            // 0 = today, 1 = 1 day ago, 2 = 2 days ago, ... up to 7
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  isLoggedIn: boolean;
  provider?: 'google' | 'email' | 'guest';
}

export interface UserPreferences {
  theme: 'dark';
  bookmarkedIds: string[];
  activeCategory: CategoryType;
  filterSource?: string;
  timeFilter?: TimeFilterType;
}
