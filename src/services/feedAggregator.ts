import { FeedItem, CategoryType } from '../types/feed';
import { SEED_FEEDS } from '../data/seedFeeds';
import { fetchAllLiveRss } from './rssParser';

export async function getAggregatedFeeds(): Promise<FeedItem[]> {
  try {
    const liveItems = await fetchAllLiveRss();
    if (liveItems && liveItems.length > 0) {
      // De-duplicate by title
      const existingTitles = new Set(liveItems.map(item => item.title.toLowerCase().trim()));
      const filteredSeed = SEED_FEEDS.filter(item => !existingTitles.has(item.title.toLowerCase().trim()));
      
      // Combine live items with non-duplicated seed items
      return [...liveItems, ...filteredSeed];
    }
  } catch (err) {
    console.log('Using robust curated seed data:', err);
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

  // Search keyword filter across title, content, author, source, and badge
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    result = result.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.content.toLowerCase().includes(query) ||
      item.source.toLowerCase().includes(query) ||
      item.author.toLowerCase().includes(query) ||
      (item.badge && item.badge.toLowerCase().includes(query))
    );
  }

  return result;
}
