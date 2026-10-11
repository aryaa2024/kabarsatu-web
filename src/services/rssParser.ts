import { FeedItem } from '../types/feed';

interface RSSSourceConfig {
  source: string;
  source_icon: string;
  feedUrl: string;
  category: 'berita';
  badge: string;
}

const RSS_SOURCES: RSSSourceConfig[] = [
  {
    source: 'Antara',
    source_icon: 'https://www.antaranews.com/img/antaranews.png',
    feedUrl: 'https://www.antaranews.com/rss/terkini.xml',
    category: 'berita',
    badge: 'Antara Terkini'
  },
  {
    source: 'CNN Indonesia',
    source_icon: 'https://cdn.cnnindonesia.com/cnnindonesia/images/favicon.ico',
    feedUrl: 'https://www.cnnindonesia.com/nasional/rss',
    category: 'berita',
    badge: 'CNN Nasional'
  },
  {
    source: 'Tempo',
    source_icon: 'https://statik.tempo.co/images/favicon.ico',
    feedUrl: 'https://rss.tempo.co/nasional',
    category: 'berita',
    badge: 'Tempo Update'
  },
  {
    source: 'Detik',
    source_icon: 'https://cdn.detik.net.id/assets/images/favicon.ico',
    feedUrl: 'https://rss.detik.com/index.php/detikcom',
    category: 'berita',
    badge: 'Detik News'
  },
  {
    source: 'Kompas',
    source_icon: 'https://asset.kompas.com/data/2023/wp/images/favicon.ico',
    feedUrl: 'https://news.kompas.com/feed',
    category: 'berita',
    badge: 'Kompas News'
  }
];

export async function fetchLiveRssFeed(sourceConfig: RSSSourceConfig): Promise<FeedItem[]> {
  try {
    // Use fast public rss2json converter with a short timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(sourceConfig.feedUrl)}`;
    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) return [];
    const data = await response.json();

    if (data.status !== 'ok' || !Array.isArray(data.items)) {
      return [];
    }

    return data.items.slice(0, 4).map((item: any, index: number): FeedItem => {
      // Clean up description / content HTML tags
      const rawContent = item.description || item.content || '';
      const cleanContent = rawContent.replace(/<[^>]*>?/gm, '').trim();

      // Find image in enclosure or content regex
      let imageUrl = item.enclosure?.link || item.thumbnail || '';
      if (!imageUrl) {
        const imgMatch = rawContent.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (imgMatch && imgMatch[1]) {
          imageUrl = imgMatch[1];
        }
      }

      if (!imageUrl) {
        imageUrl = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80';
      }

      return {
        id: `live-${sourceConfig.source.toLowerCase()}-${index}-${Date.now()}`,
        source: sourceConfig.source,
        source_icon: sourceConfig.source_icon,
        title: item.title || 'Kabar Berita Terkini',
        content: cleanContent.slice(0, 180) + (cleanContent.length > 180 ? '...' : ''),
        author: item.author || `Redaksi ${sourceConfig.source}`,
        timestamp: item.pubDate ? formatTimeAgo(new Date(item.pubDate)) : 'Baru saja',
        image_url: imageUrl,
        original_link: item.link || item.guid || '#',
        category: 'berita',
        readTime: '3 mnt baca',
        badge: sourceConfig.badge,
        likesCount: Math.floor(Math.random() * 200) + 50,
        commentsCount: Math.floor(Math.random() * 40) + 10
      };
    });
  } catch {
    // If CORS or offline, return empty to trigger fallback gracefully
    return [];
  }
}

export async function fetchAllLiveRss(): Promise<FeedItem[]> {
  try {
    const promises = RSS_SOURCES.map(source => fetchLiveRssFeed(source));
    const results = await Promise.allSettled(promises);
    
    const combined: FeedItem[] = [];
    results.forEach(res => {
      if (res.status === 'fulfilled' && res.value.length > 0) {
        combined.push(...res.value);
      }
    });

    return combined;
  } catch {
    return [];
  }
}

function formatTimeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit lalu`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} hari lalu`;
}
