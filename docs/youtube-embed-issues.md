# YouTube動画埋め込み問題の解決ガイド

## 📋 問題の概要

React+TypeScriptプロジェクトで`react-youtube`を使用してYouTube動画を埋め込む際、以下の問題が発生しました：

1. **動画が表示されない**（エラーコード 101/150）
2. **postMessageエラー**（origin mismatch）
3. **動画が読み込めない**

## 🔍 発生した症状

### 症状1: 埋め込み拒否エラー

```
YouTube Player Error: 101
動画の所有者が埋め込みを許可していません
```

または

```
YouTube Player Error: 150
動画の所有者が埋め込みを許可していません
```

### 症状2: postMessageエラー

```
Failed to execute 'postMessage' on 'DOMWindow': 
The target origin provided ('https://www.youtube.com') does not match 
the recipient window's origin ('http://localhost:3000').
```

### 症状3: 画面表示

- 動画プレイヤーが真っ黒
- エラーメッセージのみ表示
- 読み込み中から進まない

## 💡 原因の詳細

### 原因1: 動画の埋め込み設定

YouTube動画の所有者が**埋め込みを無効化**している場合、外部サイトでの再生が制限されます。

#### 埋め込み可否の確認方法

1. YouTube動画ページで「共有」→「埋め込む」をクリック
2. エラーが表示される場合は埋め込み不可

### 原因2: Origin設定の不足

YouTube IFrame APIは、セキュリティのため`origin`パラメータを要求します。このパラメータが設定されていない場合、postMessageでエラーが発生します。

### 原因3: JavaScript API未有効化

`enablejsapi`パラメータが設定されていないと、プログラムからのコントロールができません。

## ✅ 解決方法

### Solution 1: 埋め込み可能な動画を使用

**推奨される動画の選択基準:**

1. ✅ 公式ミュージックビデオ（大手レーベル）
2. ✅ Creative Commonsライセンス動画
3. ✅ 自分でアップロードした動画
4. ❌ 個人の著作権管理が厳しい動画
5. ❌ 地域制限がある動画

**埋め込み可能な人気動画例:**

```typescript
// data/mockStreams.ts
export const mockStreams: StreamData[] = [
  {
    id: '1',
    title: 'ヒップホップ初心者講座 🎵',
    youtubeVideoId: 'dQw4w9WgXcQ' // Rick Astley - Never Gonna Give You Up
  },
  {
    id: '2',
    title: 'K-POP完コピチャレンジ 💃',
    youtubeVideoId: 'kJQP7kiw5Fk' // Luis Fonsi - Despacito
  },
  {
    id: '3',
    title: '朝のストレッチ配信',
    youtubeVideoId: '9bZkp7q19f0' // PSY - GANGNAM STYLE
  },
];
```

### Solution 2: YouTubePlayerの正しい設定

```typescript
// components/YouTubePlayerWrapper.tsx
import React, { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';
import type { YouTubeProps } from 'react-youtube';

interface YouTubePlayerWrapperProps {
  videoId: string;
  height: string;
  enablePlayPauseControl?: boolean;
  onPlayerReady?: (player: any) => void;
}

const YouTubePlayerWrapper: React.FC<YouTubePlayerWrapperProps> = ({ 
  videoId, 
  height,
  enablePlayPauseControl = true,
  onPlayerReady
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<any>(null);

  const opts: YouTubeProps['opts'] = {
    height: height,
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 0,
      loop: 1,
      playlist: videoId, // ループに必要
      modestbranding: 1,
      rel: 0,
      origin: window.location.origin, // ✅ 重要: postMessageエラーを防ぐ
      enablejsapi: 1, // ✅ 重要: JavaScript APIを有効化
      iv_load_policy: 3,
      fs: 0,
      disablekb: 1,
    },
  };

  const onReady = (event: any) => {
    console.log('YouTube Player Ready:', event);
    playerRef.current = event.target;
    setIsReady(true);
    event.target.playVideo();
    
    if (onPlayerReady) {
      onPlayerReady(event.target);
    }
  };

  const onError = (event: any) => {
    console.error('YouTube Player Error:', event);
    const errorMessages: { [key: number]: string } = {
      2: 'リクエストに無効なパラメータが含まれています',
      5: 'HTML5プレーヤーのエラー',
      100: '動画が見つかりません',
      101: '動画の所有者が埋め込みを許可していません',
      150: '動画の所有者が埋め込みを許可していません',
    };
    const errorCode = event.data;
    setError(errorMessages[errorCode] || `エラーコード: ${errorCode}`);
  };

  return (
    <div className="w-full bg-black relative" style={{ height: height + 'px' }}>
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/80 text-white p-4 text-center pointer-events-none z-20">
          <div>
            <p className="font-bold mb-2">お手本動画の読み込みに失敗しました</p>
            <p className="text-xs mt-2 opacity-70">Video ID: {videoId}</p>
            <p className="text-xs mt-1 opacity-50">{error}</p>
          </div>
        </div>
      )}
      
      <YouTube 
        videoId={videoId} 
        opts={opts} 
        onReady={onReady}
        onError={onError}
        className="w-full h-full"
      />
    </div>
  );
};

export default YouTubePlayerWrapper;
```

## 🔑 重要なパラメータ解説

| パラメータ | 説明 | 必須度 |
|-----------|------|--------|
| `origin` | 現在のページのオリジンを指定。postMessageエラーを防ぐ | ⭐⭐⭐ |
| `enablejsapi` | JavaScript APIを有効化。プログラム制御に必要 | ⭐⭐⭐ |
| `playlist` | ループ再生に必要（videoIdと同じ値を設定） | ⭐⭐ |
| `autoplay` | 自動再生の有効化 | ⭐ |
| `controls` | プレイヤーコントロールの表示/非表示 | ⭐ |

## 📂 影響を受けたファイル

```
/Users/teradakousuke/Developer/dance-live-stream-demo/
├── components/
│   └── YouTubePlayerWrapper.tsx  # ✏️ 更新
├── data/
│   └── mockStreams.ts           # ✏️ 動画IDを変更
└── components/
    ├── ViewerMode.tsx           # YouTubePlayerWrapperを使用
    └── StreamerMode.tsx         # YouTubePlayerWrapperを使用
```

## 🎯 エラーハンドリングのベストプラクティス

### 1. エラーコードの処理

```typescript
const errorMessages: { [key: number]: string } = {
  2: 'リクエストに無効なパラメータが含まれています',
  5: 'HTML5プレーヤーのエラー',
  100: '動画が見つかりません',
  101: '動画の所有者が埋め込みを許可していません',
  150: '動画の所有者が埋め込みを許可していません',
};
```

### 2. ユーザーフレンドリーなUI

```typescript
{error && (
  <div className="error-overlay">
    <p className="font-bold">お手本動画の読み込みに失敗しました</p>
    <p className="text-xs">Video ID: {videoId}</p>
    <p className="text-xs">{error}</p>
  </div>
)}
```

### 3. 読み込み状態の表示

```typescript
{!isReady && !error && (
  <div className="loading-overlay">
    <div className="animate-pulse">読み込み中...</div>
    <p className="text-xs">Video ID: {videoId}</p>
  </div>
)}
```

## ⚠️ postMessageエラーについて

postMessageの警告は**通常は無視できます**：

```
Failed to execute 'postMessage' on 'DOMWindow': 
The target origin provided ('https://www.youtube.com') does not match...
```

この警告は：
- YouTube IFrame APIの内部通信の問題
- 動画の再生自体には影響しない
- `origin`パラメータを設定することで発生頻度を減らせる

## 🧪 テスト方法

### 埋め込み可能な動画IDでテスト

```typescript
// 確実に動作するテスト用動画ID
const TEST_VIDEO_IDS = {
  rickRoll: 'dQw4w9WgXcQ',
  despacito: 'kJQP7kiw5Fk',
  gangnamStyle: '9bZkp7q19f0',
};
```

### エラーハンドリングのテスト

```typescript
// 埋め込み不可の動画IDでテスト
const BLOCKED_VIDEO_ID = '5g4lY8Y3eoo';
```

## 🔗 参考リンク

- [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference)
- [react-youtube Documentation](https://www.npmjs.com/package/react-youtube)
- [YouTube埋め込みプレーヤーのパラメータ](https://developers.google.com/youtube/player_parameters)
- [YouTube Data API](https://developers.google.com/youtube/v3)

## 📊 トラブルシューティングチェックリスト

- [ ] 動画IDが正しいか確認
- [ ] YouTubeで「埋め込む」が可能か確認
- [ ] `origin`パラメータを設定したか
- [ ] `enablejsapi: 1`を設定したか
- [ ] エラーハンドリングを実装したか
- [ ] 開発者ツールのコンソールでエラーコードを確認
- [ ] 別の埋め込み可能な動画でテスト

---

**作成日**: 2025年10月6日  
**環境**: React + TypeScript + react-youtube  
**YouTube IFrame API バージョン**: 最新

