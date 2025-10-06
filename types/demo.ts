export type AppMode = 'dashboard' | 'streamer' | 'viewer' | 'mypage';

export interface StreamData {
  id: string;
  title: string;
  thumbnail: string;
  viewerCount: number;
  isLive: boolean;
  youtubeVideoId: string;
}

export interface ScoreData {
  timestamp: number;
  score: number;          // 0-100
  donationAmount: number; // 累計¥
  commentCount: number;   // 累計数
  emotionAvg: number;     // 0-1
}

export interface Comment {
  id: string;
  username: string;
  text: string;
  emotion: 'positive' | 'neutral' | 'negative';
}

export interface Donation {
  id: string;
  username: string;
  amount: 100 | 500 | 1000;
  timestamp: number;
}
