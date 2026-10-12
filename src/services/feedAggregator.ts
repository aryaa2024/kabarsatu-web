import { FeedItem, CategoryType, TimeFilterType } from '../types/feed';
import { SEED_FEEDS } from '../data/seedFeeds';
import { fetchAllLiveRss } from './rssParser';

export async function getAggregatedFeeds(): Promise<FeedItem[]> {
  try {
    const liveItems = await fetchAllLiveRss();
    if (liveItems && liveItems.length > 0) {
      // De-duplicate by title
      const existingTitles = new Set(liveItems.map(item => item.title.toLowerCase().trim()));
      const filteredSeed = SEED_FEEDS.filter(item => !existingTitles.has(item.title.toLowerCase().trim()));
      
      // Combine live items with non-duplicated rich seed items
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
  searchQuery: string,
  timeFilter: TimeFilterType = 'semua'
): FeedItem[] {
  let result = [...feeds];

  // 1. Category filter
  if (category !== 'semua') {
    result = result.filter(item => item.category === category);
  }

  // 2. Time range filter (Rentang waktu sampai 1 minggu terakhir)
  if (timeFilter === '24-jam') {
    result = result.filter(item => item.daysAgo === undefined || item.daysAgo <= 1);
  } else if (timeFilter === '3-hari') {
    result = result.filter(item => item.daysAgo === undefined || item.daysAgo <= 3);
  } else if (timeFilter === '1-minggu') {
    result = result.filter(item => item.daysAgo === undefined || item.daysAgo <= 7);
  }

  // 3. Search keyword filter across title, content, author, source, and badge
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
