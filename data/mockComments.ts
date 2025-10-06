import type { Comment } from '../types/demo';

export const mockComments: Omit<Comment, 'id'>[] = [
  { username: 'ダンサーA', text: 'すごい！', emotion: 'positive' },
  { username: 'ユーザーB', text: 'かっこいい！', emotion: 'positive' },
  { username: 'ビギナーC', text: 'リズム感抜群', emotion: 'positive' },
  { username: 'ファンD', text: '投げ銭します！', emotion: 'positive' },
  { username: '視聴者E', text: 'キレッキレ！', emotion: 'positive' },
  { username: '見習いF', text: 'うますぎる…', emotion: 'positive' },
  { username: 'リスナーG', text: 'NICE!', emotion: 'positive' },
  { username: '匿名H', text: '最高です！', emotion: 'positive' },
  { username: 'ダンス好きI', text: '参考にします', emotion: 'neutral' },
  { username: 'ファンJ', text: '見てて楽しい', emotion: 'positive' },
];
