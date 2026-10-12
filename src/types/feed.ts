export type CategoryType = 
  | 'semua' 
  | 'berita-umum' 
  | 'politik' 
  | 'kriminal-terorisme' 
  | 'medsos' 
  | 'tren';

export interface FeedItem {
  id: string;
  source: string;              // 'Kompas', 'Detik', 'CNN Indonesia', 'Tempo', 'Antara', 'Liputan6', 'Merdeka', 'Republika', 'Sindonews', 'Tribunnews', 'YouTube', 'X (Twitter)', 'Instagram', 'Reddit'
  source_icon: string;         // Favicon / Icon URL
  title: string;               // Headline or post title
  content: string;             // Summary / post content
  author: string;              // Journalist or username
  timestamp: string;           // E.g., '5 menit lalu' or formatted time
  image_url: string;           // Media thumbnail
  original_link: string;       // Direct link to article/post
  category: 'berita-umum' | 'politik' | 'kriminal-terorisme' | 'medsos' | 'tren';
  readTime?: string;           // E.g. '3 mnt baca' or video duration
  likesCount?: number;
  commentsCount?: number;
  viewsCount?: string;
  badge?: string;              // E.g. 'Investigasi', 'Viral', 'Eksklusif'
  mediaType?: 'article' | 'video' | 'social_post';
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
}
