import { FeedItem, CategoryType } from '../types/feed';
import { SEED_FEEDS } from '../data/seedFeeds';
import { fetchAllLiveRss } from './rssParser';

export async function getAggregatedFeeds(): Promise<FeedItem[]> {
  try {
    const liveItems = await fetchAllLiveRss();
    if (liveItems && liveItems.length > 0) {
      // Merge live news with seed YouTube, Medsos, and Tren
      const nonBeritaSeed = SEED_FEEDS.filter(item => item.category !== 'berita');
      const seedBerita = SEED_FEEDS.filter(item => item.category === 'berita');
      
      // Combine live items with seed, ensuring all sources are well represented
      return [...liveItems, ...nonBeritaSeed, ...seedBerita.slice(0, 5)];
    }
  } catch (err) {
    console.log('Using robust seed feed data:', err);
  }

  // Fallback to complete seed dataset
  return SEED_FEEDS;
}

export function filterFeeds(
  feeds: FeedItem[],
  category: CategoryType,
  searchQuery: string
): FeedItem[] {
  let result = [...feeds];

  // Category filter
  if (category !== 'semua') {
    result = result.filter(item => item.category === category);
  }

  // Search keyword filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    result = result.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.content.toLowerCase().includes(query) ||
      item.source.toLowerCase().includes(query) ||
      item.author.toLowerCase().includes(query)
    );
  }

  return result;
}
