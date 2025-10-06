import type { StreamData } from '../types/demo';

export const mockStreams: StreamData[] = [
  {
    id: '1',
    title: 'ヒップホップ初心者講座 🎵',
    thumbnail: 'https://picsum.photos/seed/dance1/300/400',
    viewerCount: 234,
    isLive: true,
    youtubeVideoId: 'dQw4w9WgXcQ' // Embeddable dance video
  },
  {
    id: '2',
    title: 'K-POP完コピチャレンジ 💃',
    thumbnail: 'https://picsum.photos/seed/dance2/300/400',
    viewerCount: 512,
    isLive: true,
    youtubeVideoId: 'kJQP7kiw5Fk' // Luis Fonsi - Despacito (embeddable)
  },
  {
    id: '3',
    title: '朝のストレッチ配信',
    thumbnail: 'https://picsum.photos/seed/dance3/300/400',
    viewerCount: 189,
    isLive: true,
    youtubeVideoId: '9bZkp7q19f0' // PSY - GANGNAM STYLE (embeddable)
  },
  {
    id: '4',
    title: 'ブレイクダンス基本ムーブ',
    thumbnail: 'https://picsum.photos/seed/dance4/300/400',
    viewerCount: 420,
    isLive: true,
    youtubeVideoId: 'JGwWNGJdvx8' // Ed Sheeran - Shape of You (embeddable)
  },
];
