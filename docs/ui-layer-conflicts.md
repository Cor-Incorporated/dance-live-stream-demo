# UIレイヤー競合問題の解決ガイド：pointer-eventsとz-indexの適切な管理

## 📋 問題の概要

React+TypeScriptのシングルページアプリケーション（SPA）で、複数のインタラクティブUI要素が重なり合った際、以下の問題が発生しました：

1. **視聴者モード**: 動画の再生/一時停止オーバーレイが戻るボタンを覆い、ダッシュボードに戻れない
2. **配信者モード**: 動画の再生/一時停止オーバーレイが「配信終了」「マイページ」ボタンを覆い、操作できない

## 🔍 発生した症状

### 視聴者モードの問題

```
┌─────────────────────────────┐
│ ← [戻るボタン]              │ ← クリックできない！
│                             │
│   [YouTube動画]             │
│   ┌─────────────────┐       │
│   │透明オーバーレイ│       │ ← この層が上にある
│   │（再生/一時停止）│       │
│   └─────────────────┘       │
└─────────────────────────────┘
```

### 配信者モードの問題

```
┌─────────────────────────────┐
│[配信終了] ● LIVE [👤]      │ ← どれもクリックできない！
│                             │
│   [YouTube動画]             │
│   ┌─────────────────┐       │
│   │透明オーバーレイ│       │ ← この層が全てを覆う
│   │（再生/一時停止）│       │
│   └─────────────────┘       │
└─────────────────────────────┘
```

## 💡 原因の詳細

### 1. `pointer-events`の設定ミス

YouTubeプレイヤーのラッパーコンポーネントで、再生/一時停止用のオーバーレイが全画面を覆っていました：

```tsx
// ❌ 問題のあるコード
<div className="absolute inset-0 z-10 cursor-pointer" onClick={togglePlayPause}>
  {/* 透明なオーバーレイが全画面を覆う */}
</div>
```

このオーバーレイが：
- すべてのマウスイベントをキャプチャ
- 下のボタンにイベントが届かない
- `z-index`だけでは解決できない（下の要素も`z-index`が高い）

### 2. コンポーネントの責任分離の欠如

YouTubePlayerWrapperが「常に再生/一時停止機能が必要」と仮定していました。

- **視聴者モード**: タップで再生/一時停止が必要 ✅
- **配信者モード**: 専用ボタンで制御したい ❌（オーバーレイ不要）

## ✅ 解決方法

### Solution 1: 条件付きオーバーレイの実装

`enablePlayPauseControl`プロップスを追加し、オーバーレイの有効/無効を制御します。

#### Step 1: YouTubePlayerWrapperの更新

```tsx
// components/YouTubePlayerWrapper.tsx
interface YouTubePlayerWrapperProps {
  videoId: string;
  height: string;
  enablePlayPauseControl?: boolean; // ← 新しいプロップス
  onPlayerReady?: (player: any) => void;
}

const YouTubePlayerWrapper: React.FC<YouTubePlayerWrapperProps> = ({ 
  videoId, 
  height, 
  enablePlayPauseControl = true, // ← デフォルトはtrue
  onPlayerReady
}) => {
  // ... 状態管理など

  return (
    <div className="w-full bg-black relative" style={{ height: height + 'px' }}>
      {/* ✅ 条件付きオーバーレイ */}
      {enablePlayPauseControl && isReady && !error && (
        <div 
          className="absolute inset-0 z-10 cursor-pointer"
          onClick={togglePlayPause}
        />
      )}

      {/* ✅ 条件付きフィードバックアイコン */}
      {enablePlayPauseControl && showPlayPauseIcon && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          {/* アイコン表示 */}
        </div>
      )}

      {/* YouTube プレイヤー */}
      <div className="pointer-events-none">
        <YouTube videoId={videoId} opts={opts} />
      </div>
    </div>
  );
};
```

#### Step 2: 視聴者モードでの使用

```tsx
// components/ViewerMode.tsx
<YouTubePlayerWrapper 
  videoId={stream.youtubeVideoId} 
  height="250"
  // enablePlayPauseControlは省略（デフォルトでtrue）
/>
```

#### Step 3: 配信者モードでの使用

```tsx
// components/StreamerMode.tsx
<YouTubePlayerWrapper 
  videoId="dQw4w9WgXcQ" 
  height="380" 
  enablePlayPauseControl={false} // ← オーバーレイを無効化
  onPlayerReady={handlePlayerReady}
/>
```

### Solution 2: pointer-eventsの適切な管理

各UI要素に適切な`pointer-events`を設定します。

```tsx
// ✅ 正しい pointer-events の使い方

// 1. クリック可能なボタン
<button className="pointer-events-auto z-50">
  クリック可能
</button>

// 2. 表示のみ（クリック不可）
<div className="pointer-events-none z-20">
  エラーメッセージ
</div>

// 3. 親がpointer-events-noneでも子要素は有効化
<div className="pointer-events-none">
  <button className="pointer-events-auto">
    このボタンはクリック可能
  </button>
</div>
```

### Solution 3: z-indexの階層管理

UIの重なり順を明確に定義します。

```tsx
// z-indexの階層定義
const Z_INDEX = {
  base: 0,           // 基本レイヤー
  video: 1,          // 動画プレイヤー
  overlay: 10,       // 再生/一時停止オーバーレイ
  error: 20,         // エラー表示
  feedback: 30,      // フィードバックアイコン
  controls: 40,      // コントロールパネル
  buttons: 50,       // 重要なボタン（戻る、配信終了など）
  modal: 100,        // モーダル
};
```

## 🎯 完全な実装例

### 配信者モード用の専用コントロール

```tsx
// components/StreamerMode.tsx
const StreamerMode: React.FC<StreamerModeProps> = ({ onStop, onGoToMyPage }) => {
  const youtubePlayerRef = useRef<any>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  const handlePlayerReady = (player: any) => {
    youtubePlayerRef.current = player;
  };

  const toggleVideoPlayback = () => {
    if (!youtubePlayerRef.current) return;
    
    if (isVideoPlaying) {
      youtubePlayerRef.current.pauseVideo();
    } else {
      youtubePlayerRef.current.playVideo();
    }
    setIsVideoPlaying(!isVideoPlaying);
  };

  return (
    <div className="relative h-full w-full bg-black flex flex-col">
      <div className="h-[380px] w-full relative">
        {/* YouTube動画（オーバーレイなし） */}
        <YouTubePlayerWrapper 
          videoId="dQw4w9WgXcQ" 
          height="380" 
          enablePlayPauseControl={false} // ← オーバーレイ無効
          onPlayerReady={handlePlayerReady}
        />
        
        {/* 専用コントロールパネル（bottom） */}
        <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/90 p-4">
          {/* シークバー */}
          <div className="mb-3">
            {/* ... */}
          </div>
          
          {/* 再生/一時停止ボタン */}
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={toggleVideoPlayback}
              className="bg-[#FF3B5C] p-3 rounded-full pointer-events-auto"
            >
              {isVideoPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* ヘッダーボタン（最前面） */}
      <div className="absolute top-0 left-0 right-0 z-50 flex justify-between p-4 pointer-events-none">
        <button 
          onClick={onStop} 
          className="bg-red-500 px-4 py-2 rounded-full pointer-events-auto"
        >
          配信終了
        </button>
        <button 
          onClick={onGoToMyPage} 
          className="p-2 pointer-events-auto"
        >
          <UserIcon />
        </button>
      </div>
    </div>
  );
};
```

## 📂 影響を受けたファイル

```
/Users/teradakousuke/Developer/dance-live-stream-demo/
├── components/
│   ├── YouTubePlayerWrapper.tsx  # ✏️ enablePlayPauseControlを追加
│   ├── ViewerMode.tsx            # ✏️ デフォルト設定で使用
│   └── StreamerMode.tsx          # ✏️ enablePlayPauseControl={false}に設定
```

## ⚠️ よくある間違い

### ❌ 間違い1: z-indexだけで解決しようとする

```tsx
// ❌ これでは解決しない
<div className="z-100">
  <button>クリックしたいボタン</button>
</div>
<div className="absolute inset-0 z-50" onClick={...}>
  {/* 透明オーバーレイ */}
</div>
```

z-indexが高くても、`pointer-events`がアクティブな要素が上にあると、クリックイベントがキャプチャされます。

### ❌ 間違い2: すべてにpointer-events-noneを設定

```tsx
// ❌ これでは何もクリックできない
<div className="pointer-events-none">
  <button className="pointer-events-none">
    クリックできない
  </button>
</div>
```

### ✅ 正解: 親はnone、必要な子要素だけauto

```tsx
// ✅ 正しい
<div className="pointer-events-none">
  <button className="pointer-events-auto">
    クリック可能
  </button>
</div>
```

## 🎨 デザインパターン

### パターン1: 条件付きオーバーレイ

```tsx
interface ComponentProps {
  enableInteraction?: boolean;
}

const Component = ({ enableInteraction = true }) => (
  <div>
    {enableInteraction && (
      <div className="interaction-overlay" onClick={...} />
    )}
  </div>
);
```

### パターン2: レイヤー分離

```tsx
<div className="container">
  {/* 背景レイヤー（z-0） */}
  <div className="background" />
  
  {/* コンテンツレイヤー（z-10） */}
  <div className="content pointer-events-none">
    <button className="pointer-events-auto">ボタン</button>
  </div>
  
  {/* オーバーレイレイヤー（z-20） */}
  {showOverlay && <div className="overlay" />}
</div>
```

### パターン3: イベント委譲

```tsx
const Parent = () => {
  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.matches('.clickable')) {
      // クリック処理
    }
  };

  return (
    <div onClick={handleClick}>
      <div className="clickable">クリック可能</div>
      <div>クリック不可</div>
    </div>
  );
};
```

## 📊 トラブルシューティング

### チェックリスト

- [ ] オーバーレイが本当に必要か確認
- [ ] `pointer-events`が適切に設定されているか
- [ ] z-indexの階層が明確か
- [ ] 親要素の`pointer-events-none`が子要素に影響していないか
- [ ] ブラウザの開発者ツールで要素の重なりを確認

### デバッグ方法

```tsx
// 1. オーバーレイを可視化
<div className="absolute inset-0 bg-red-500/20"> {/* 赤い半透明 */}
  オーバーレイの範囲が見える
</div>

// 2. pointer-eventsの状態を確認
<div 
  className="..." 
  style={{ outline: '2px solid blue' }} // 青い枠線で範囲を確認
/>

// 3. クリックイベントをログ
<div onClick={(e) => {
  console.log('Clicked element:', e.currentTarget);
  console.log('Target:', e.target);
}}>
```

## 🔗 参考リンク

- [MDN: pointer-events](https://developer.mozilla.org/ja/docs/Web/CSS/pointer-events)
- [MDN: z-index](https://developer.mozilla.org/ja/docs/Web/CSS/z-index)
- [CSS-Tricks: pointer-events](https://css-tricks.com/almanac/properties/p/pointer-events/)
- [React イベントハンドリング](https://ja.react.dev/learn/responding-to-events)

---

**作成日**: 2025年10月6日  
**環境**: React + TypeScript + Tailwind CSS  
**UIフレームワーク**: Framer Motion

