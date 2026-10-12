import { FeedItem } from '../types/feed';

interface RSSSourceConfig {
  source: string;
  source_icon: string;
  feedUrl: string;
  defaultBadge: string;
}

export const RSS_SOURCES: RSSSourceConfig[] = [
  {
    source: 'Kompas',
    source_icon: 'https://asset.kompas.com/data/2023/wp/images/favicon.ico',
    feedUrl: 'https://news.kompas.com/feed',
    defaultBadge: 'Kompas News'
  },
  {
    source: 'Detik',
    source_icon: 'https://cdn.detik.net.id/assets/images/favicon.ico',
    feedUrl: 'https://rss.detik.com/index.php/detikcom',
    defaultBadge: 'Detik Terkini'
  },
  {
    source: 'CNN Indonesia',
    source_icon: 'https://cdn.cnnindonesia.com/cnnindonesia/images/favicon.ico',
    feedUrl: 'https://www.cnnindonesia.com/nasional/rss',
    defaultBadge: 'CNN Nasional'
  },
  {
    source: 'Tempo',
    source_icon: 'https://statik.tempo.co/images/favicon.ico',
    feedUrl: 'https://rss.tempo.co/nasional',
    defaultBadge: 'Tempo Update'
  },
  {
    source: 'Antara',
    source_icon: 'https://www.antaranews.com/img/antaranews.png',
    feedUrl: 'https://www.antaranews.com/rss/terkini.xml',
    defaultBadge: 'Antara Terkini'
  },
  {
    source: 'Liputan6',
    source_icon: 'https://cdn.liputan6.com/assets/images/favicon.ico',
    feedUrl: 'https://www.liputan6.com/feed/rss',
    defaultBadge: 'Liputan6 Aktual'
  },
  {
    source: 'Merdeka',
    source_icon: 'https://cdns.klimg.com/merdeka.com/v2/i/favicon.ico',
    feedUrl: 'https://www.merdeka.com/feed',
    defaultBadge: 'Merdeka News'
  },
  {
    source: 'Republika',
    source_icon: 'https://static.republika.co.id/files/images/favicon.ico',
    feedUrl: 'https://www.republika.co.id/rss',
    defaultBadge: 'Republika News'
  },
  {
    source: 'Sindonews',
    source_icon: 'https://asset.sindonews.net/dyn/16/favicon.ico',
    feedUrl: 'https://nasional.sindonews.com/rss',
    defaultBadge: 'Sindo Nasional'
  },
  {
    source: 'Tribunnews',
    source_icon: 'https://t-2.tstatic.net/tribun/images/favicon.ico',
    feedUrl: 'https://www.tribunnews.com/rss',
    defaultBadge: 'Tribun Terkini'
  }
];

/**
 * Intelligent categorization based on title and content keywords
 */
function determineCategory(text: string): 'politik' | 'kriminal-terorisme' | 'berita-umum' | 'tren' {
  const lower = text.toLowerCase();

  // Kriminal & Terorisme keywords
  if (
    lower.includes('teror') ||
    lower.includes('densus') ||
    lower.includes('kpk') ||
    lower.includes('korupsi') ||
    lower.includes('polisi') ||
    lower.includes('tersangka') ||
    lower.includes('narkoba') ||
    lower.includes('siber') ||
    lower.includes('penipuan') ||
    lower.includes('vonis') ||
    lower.includes('sidang perkara') ||
    lower.includes('kejahatan') ||
    lower.includes('radikal') ||
    lower.includes('bareskrim')
  ) {
    return 'kriminal-terorisme';
  }

  // Politik keywords
  if (
    lower.includes('presiden') ||
    lower.includes('dpr') ||
    lower.includes('mpr') ||
    lower.includes('menteri') ||
    lower.includes('partai') ||
    lower.includes('pemilu') ||
    lower.includes('pilkada') ||
    lower.includes('kpu') ||
    lower.includes('bawaslu') ||
    lower.includes('kebijakan') ||
    lower.includes('kabinet') ||
    lower.includes('diplomasi') ||
    lower.includes('ruu') ||
    lower.includes('undang-undang') ||
    lower.includes('pemerintahan')
  ) {
    return 'politik';
  }

  // Tren keywords
  if (
    lower.includes('viral') ||
    lower.includes('tren') ||
    lower.includes('gempa') ||
    lower.includes('bmkg') ||
    lower.includes('rekor') ||
    lower.includes('heboh')
  ) {
    return 'tren';
  }

  return 'berita-umum';
}

export async function fetchLiveRssFeed(sourceConfig: RSSSourceConfig): Promise<FeedItem[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(sourceConfig.feedUrl)}`;
    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) return [];
    const data = await response.json();

    if (data.status !== 'ok' || !Array.isArray(data.items)) {
      return [];
    }

    return data.items.slice(0, 4).map((item: any, index: number): FeedItem => {
      const rawContent = item.description || item.content || '';
      const cleanContent = rawContent.replace(/<[^>]*>?/gm, '').trim();

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

      const fullText = `${item.title || ''} ${cleanContent}`;
      const category = determineCategory(fullText);

      return {
        id: `live-${sourceConfig.source.toLowerCase().replace(/\s+/g, '')}-${index}-${Date.now()}`,
        source: sourceConfig.source,
        source_icon: sourceConfig.source_icon,
        title: item.title || `Kabar Terkini dari ${sourceConfig.source}`,
        content: cleanContent.slice(0, 180) + (cleanContent.length > 180 ? '...' : ''),
        author: item.author || `Redaksi ${sourceConfig.source}`,
        timestamp: item.pubDate ? formatTimeAgo(new Date(item.pubDate)) : 'Baru saja',
        image_url: imageUrl,
        original_link: item.link || item.guid || 'https://news.google.com',
        category,
        readTime: '3 mnt baca',
        badge: sourceConfig.defaultBadge,
        likesCount: Math.floor(Math.random() * 250) + 40,
        commentsCount: Math.floor(Math.random() * 45) + 8,
        mediaType: 'article'
      };
    });
  } catch {
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
