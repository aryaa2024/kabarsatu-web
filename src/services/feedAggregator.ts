import { FeedItem, CategoryType, TimeFilterType } from '../types/feed';
import { SEED_FEEDS } from '../data/seedFeeds';
import { fetchAllLiveRss } from './rssParser';

/**
 * Quality-Check & Content Integrity Filter:
 * Ensures only articles with complete headlines, substantial readable content,
 * valid sources, and functional media links are displayed in KabarSatu.
 */
export function validateFeedItem(item: FeedItem): boolean {
  if (!item) return false;

  // 1. Must have a valid, meaningful headline (min 8 characters)
  if (!item.title || item.title.trim().length < 8) return false;

  // 2. Must have substantial summary content (min 25 characters)
  if (!item.content || item.content.trim().length < 25) return false;

  // 3. Must have a reputable source name
  if (!item.source || item.source.trim().length < 2) return false;

  // 4. Must have a valid image URL
  if (!item.image_url || (!item.image_url.startsWith('http') && !item.image_url.startsWith('/'))) {
    return false;
  }

  // 5. Must have a valid destination URL
  if (!item.original_link || !item.original_link.startsWith('http')) {
    return false;
  }

  return true;
}

export async function getAggregatedFeeds(): Promise<FeedItem[]> {
  try {
    const liveItems = await fetchAllLiveRss();
    
    // Filter live items with strict validation check
    const validLiveItems = liveItems.filter(validateFeedItem);

    if (validLiveItems && validLiveItems.length > 0) {
      const existingTitles = new Set(validLiveItems.map(item => item.title.toLowerCase().trim()));
      const filteredSeed = SEED_FEEDS.filter(item => 
        validateFeedItem(item) && !existingTitles.has(item.title.toLowerCase().trim())
      );
      
      return [...validLiveItems, ...filteredSeed];
    }
  } catch (err) {
    console.log('Using robust curated seed data:', err);
  }

  // Fallback to validated seed dataset
  return SEED_FEEDS.filter(validateFeedItem);
}

export function filterFeeds(
  feeds: FeedItem[],
  category: CategoryType,
  searchQuery: string,
  timeFilter: TimeFilterType = 'semua'
): FeedItem[] {
  // Always ensure only validated articles are processed
  let result = feeds.filter(validateFeedItem);

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
