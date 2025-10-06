# 🎬 Dance Live Stream Demo

TikTok/YouTube Live風のダンス練習配信アプリ - 営業デモ用プロトタイプ

<div align="center">

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-38B2AC?style=flat-square&logo=tailwind-css)

**[デモ動画](#-デモシナリオ) | [機能一覧](#-主要機能) | [技術スタック](#-技術スタック)**

</div>

---

## 📱 概要

ダンス練習をリアルタイム配信し、視聴者からの投げ銭やコメントを受け取れる、TikTok/YouTube Live風のモバイルアプリのデモ版です。

### 🎯 プロジェクトの目的

- **営業デモ用**: 1-2分の動画でサービスの魅力を伝える
- **モバイルファースト**: iPhone 14 Pro (390×844px) 完全対応
- **フロントエンド完結**: バックエンド不要、全てモックデータで動作

### ✨ 特徴

- 🎥 **配信者モード**: リアルタイムスコア表示、AIフィードバック
- 👀 **視聴者モード**: 投げ銭、コメント、Extraアドバイス
- 📊 **リアルタイムグラフ**: 得点、投げ銭、コメント数を可視化
- 💰 **投げ銭システム**: ¥100/500/1000の3段階、コインアニメーション
- 📱 **完全モバイル対応**: タッチ操作、縦画面固定

---

## 🚀 クイックスタート

### 必要環境

- **Node.js**: v18以上
- **npm**: v9以上
- **ブラウザ**: Chrome / Safari 最新版
- **カメラ**: Webカメラアクセス権限

### インストール

```bash
# 1. リポジトリをクローン（または移動）
cd /Users/teradakousuke/Developer/dance-live-stream-demo

# 2. 依存関係をインストール
npm install

# 3. 開発サーバーを起動
npm run dev
```

### ブラウザで確認

```
http://localhost:5173/
```

**重要**: カメラアクセス権限を許可してください

### ビルド（本番用）

```bash
npm run build
npm run preview
```

---

## 🎨 主要機能

### 1. ダッシュボード

**配信一覧とスタート画面**

- ✅ ライブ配信中のサムネイル一覧（2列グリッド）
- ✅ 視聴者数、LIVE表示
- ✅ 「配信開始」ボタン（TikTokレッド）
- ✅ マイページへのアクセス

```
機能:
- 配信サムネイルタップ → 視聴者モードへ
- 配信開始ボタン → 配信者モードへ
- ユーザーアイコン → マイページへ
```

---

### 2. 配信者モード

**自分の練習を配信する画面**

#### レイアウト
```
┌─────────────────────┐
│  お手本動画（上半分）  │ ← YouTube (380px)
├─────────────────────┤
│  カメラ映像（下半分）  │ ← Webcam (380px)
│                     │
│  📊 [グラフ]         │ ← 右側固定
└─────────────────────┘
```

#### 機能
- ✅ YouTube動画自動再生・ループ
- ✅ Webカメラミラー表示
- ✅ リアルタイムスコア更新（5秒毎）
- ✅ AIフィードバック表示（10秒毎）
- ✅ グラフ表示（得点、投げ銭）
- ✅ 一時停止機能
- ✅ LIVE表示、視聴者数

**スコアロジック**:
- 初期値: 75点
- 変動幅: ±3点/5秒
- 最大: 100点

---

### 3. 視聴者モード

**配信を視聴する画面**

#### レイアウト
```
┌─────────────────────┐
│  お手本動画（小）     │ ← 250px
├─────────────────────┤
│  💬 コメント表示      │
│  📊 グラフ           │
│                     │
├─────────────────────┤
│  [💰 投げ銭する]     │ ← 固定ボタン
└─────────────────────┘
```

#### 機能
- ✅ コメントランダムポップアップ（4秒毎、3秒で消える）
- ✅ 投げ銭ボタン → モーダル表示
- ✅ 金額選択（¥100/500/1000）
- ✅ コインアニメーション（720度回転）
- ✅ Extraフィードバック表示（5秒間）
- ✅ ボーナス得点追加
  - ¥100 → +10点
  - ¥500 → +25点
  - ¥1000 → +50点

**コメント感情分類**:
- 🟢 Positive: 緑色
- ⚪ Neutral: 白色
- 🔴 Negative: 赤色

---

### 4. マイページ

**統計と履歴の確認画面**

#### 表示内容
- ✅ ユーザープロフィール
- ✅ 総獲得投げ銭（累計）
- ✅ 平均スコア
- ✅ 過去配信履歴
  - タイトル
  - スコア
  - 獲得投げ銭

**モックデータ**:
```typescript
過去配信例:
1. ヒップホップ練習 - スコア88 - ¥1,500
2. K-POPチャレンジ - スコア92 - ¥3,200
3. フリースタイル - スコア85 - ¥800
```

---

### 5. リアルタイムグラフ

**Chart.jsによるデータ可視化**

#### 表示データ
- 📈 **得点推移** (0-100点) - ブルー
- 💰 **投げ銭累計額** (¥) - ゴールド
- 💬 **コメント数** (累計) - 非表示
- 😊 **感情平均** (0-1) - 非表示

#### 設定
- 更新頻度: 5秒毎
- 表示期間: 60秒分（12ポイント）
- アニメーション: 500ms、easeInOutQuart
- 2軸グラフ（左: 得点、右: 投げ銭）

---

## 🛠 技術スタック

### フロントエンド

| 技術 | バージョン | 用途 |
|------|-----------|------|
| React | 19.2.0 | UIフレームワーク |
| TypeScript | 5.8.2 | 型安全性 |
| Vite | 6.2.0 | ビルドツール |
| Tailwind CSS | 3.4.0 | スタイリング |

### ライブラリ

| ライブラリ | 用途 |
|-----------|------|
| Framer Motion | ページ遷移・アニメーション |
| Chart.js | リアルタイムグラフ |
| react-chartjs-2 | Chart.jsのReactラッパー |
| react-youtube | YouTube動画埋め込み |

### デバイス対応

- **ターゲット**: iPhone 14 Pro (390px × 844px)
- **画面向き**: 縦固定
- **ブラウザ**: Chrome, Safari

---

## 📂 プロジェクト構成

```
dance-live-stream-demo/
├── components/
│   ├── Dashboard.tsx              # ダッシュボード画面
│   ├── StreamerMode.tsx           # 配信者モード
│   ├── ViewerMode.tsx             # 視聴者モード
│   ├── MyPage.tsx                 # マイページ
│   ├── RealtimeChart.tsx          # リアルタイムグラフ
│   ├── DonationModal.tsx          # 投げ銭モーダル
│   ├── CommentPopup.tsx           # コメントポップアップ
│   ├── FeedbackDisplay.tsx        # フィードバック表示
│   ├── StreamThumbnail.tsx        # 配信サムネイル
│   ├── WebcamView.tsx             # Webカメラ
│   └── YouTubePlayerWrapper.tsx   # YouTube プレーヤー
│
├── hooks/
│   ├── useRealtimeScore.ts        # スコア更新ロジック
│   └── useMockComments.ts         # コメント生成ロジック
│
├── data/
│   ├── mockStreams.ts             # 配信一覧データ
│   ├── mockComments.ts            # コメントデータ
│   └── mockFeedback.ts            # フィードバックテキスト
│
├── types/
│   └── demo.ts                    # 型定義
│
├── App.tsx                        # メインアプリ（ルーティング）
├── index.tsx                      # エントリーポイント
├── index.html                     # HTML
└── package.json                   # 依存関係
```

---

## 🎬 デモシナリオ

### 推奨デモフロー（1分15秒）

#### 1. ダッシュボード表示（10秒）
```
- 配信中サムネイル一覧を表示
- ユーザーアイコンタップ → マイページへ
- マイページの統計確認
- 戻るボタンで戻る
```

#### 2. 配信者モード（30秒）
```
- 「配信開始」ボタンタップ
- YouTube動画が再生開始
- Webカメラが起動
- 5秒後: グラフ更新開始
- 10秒後: フィードバック「ステップのタイミングが良くなってる！」
- 一時停止ボタンで中断デモ
- 再開
```

#### 3. 視聴者モード（30秒）
```
- ダッシュボードに戻る
- サムネイルタップ → 視聴者モード
- コメントがランダムにポップアップ
  例: 「すごい！」「かっこいい！」
- 投げ銭ボタンタップ
- ¥500選択
- コインアニメーション（720度回転）
- Extraフィードバック表示
  「¥500ありがとう！ボーナス+50点🎉」
- グラフに投げ銭が反映される
```

#### 4. 締め（5秒）
```
- 配信終了
- マイページで最終統計表示
  - 総獲得投げ銭
  - 平均スコア
```

---

## 🎨 デザインシステム

### カラーパレット

```css
/* ベースカラー */
--bg-primary: #000000;      /* 黒背景 */
--bg-secondary: #1a1a1a;    /* ダークグレー */
--bg-card: #2a2a2a;         /* カード背景 */

/* アクセントカラー */
--accent-primary: #FF3B5C;  /* TikTokレッド */
--accent-gold: #FFD700;     /* 投げ銭ゴールド */
--accent-blue: #00D9FF;     /* グラフブルー */
--accent-green: #00FF87;    /* 成功グリーン */

/* テキストカラー */
--text-primary: #FFFFFF;
--text-secondary: #A0A0A0;
```

### タイポグラフィ

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

--text-xs: 12px;
--text-sm: 14px;
--text-base: 16px;
--text-lg: 18px;
--text-xl: 24px;
--text-2xl: 32px;
```

---

## 🔧 開発のポイント

### 1. 状態管理

**useState のみ使用**（Redux不要）

```typescript
// App.tsx
const [mode, setMode] = useState<AppMode>('dashboard');
const [selectedStreamId, setSelectedStreamId] = useState<string | null>(null);
```

### 2. カスタムHooks

**useRealtimeScore.ts**
```typescript
// 5秒毎にスコア更新
// 最大12ポイント保持（60秒分）
const { scoreData, addDonation } = useRealtimeScore(isActive);
```

**useMockComments.ts**
```typescript
// 4秒毎にコメント生成
// 3秒後に自動削除
const { activeComments } = useMockComments(isActive);
```

### 3. アニメーション

**ページ遷移（Framer Motion）**
```typescript
const pageVariants = {
  initial: { opacity: 0, x: 300 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -300 },
};
```

**投げ銭コイン**
```typescript
animate={{ 
  y: -300, 
  scale: [1, 1.5, 1], 
  rotate: 720, 
  opacity: [1, 1, 0] 
}}
```

### 4. パフォーマンス最適化

- ✅ `useCallback` でメモ化
- ✅ インターバルのクリーンアップ
- ✅ グラフデータの上限設定（12ポイント）
- ✅ コメント自動削除（メモリリーク防止）

---

## 🎥 デモ動画撮影

### 推奨設定

| 項目 | 設定値 |
|------|--------|
| 解像度 | 1080 × 1920 (縦長) |
| フレームレート | 60fps |
| 録画ツール | QuickTime / OBS |
| 画面サイズ | 390px幅のブラウザ or iPhoneシミュレータ |
| 音声 | BGMのみ or ナレーション付き |

### 録画手順

**Mac (QuickTime)**
```bash
1. QuickTimeを起動
2. ファイル > 新規画面収録
3. ブラウザのウィンドウを390px幅に調整
4. 録画開始
5. デモシナリオに沿って操作
6. 録画停止 → 書き出し
```

**ブラウザ開発者ツール**
```bash
1. Chrome開発者ツールを開く (Cmd+Opt+I)
2. デバイスツールバーを表示 (Cmd+Shift+M)
3. デバイス: iPhone 14 Pro (390×844)
4. 録画ツールで画面キャプチャ
```

---

## 🐛 トラブルシューティング

### カメラが表示されない

**原因**: カメラアクセス権限が拒否されている

**解決策**:
```bash
1. ブラウザの設定を開く
2. プライバシー > カメラ
3. localhost または該当URLを許可
4. ページをリロード
```

### グラフが表示されない

**原因**: Chart.jsの登録エラー

**確認**:
```typescript
// RealtimeChart.tsxで登録されているか確認
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
```

### YouTube動画が再生されない

**原因**: 動画IDが無効 or 埋め込み制限

**解決策**:
```typescript
// mockStreams.ts で動画IDを確認
youtubeVideoId: '5g4lY8Y3eoo' // 有効な動画IDか確認
```

### アニメーションがカクつく

**原因**: パフォーマンス不足

**解決策**:
```bash
- ブラウザの他のタブを閉じる
- GPU加速を有効化
- Chrome: chrome://flags で「Hardware acceleration」有効化
```

---

## 🚀 デプロイ

### Vercel（推奨）

```bash
# 1. Vercelアカウント作成
# 2. プロジェクトをGitHubにpush

# 3. Vercelでインポート
vercel --prod

# または
npm run build
# distフォルダをVercelにデプロイ
```

### Netlify

```bash
npm run build

# Netlify CLIでデプロイ
netlify deploy --prod --dir=dist
```

### GitHub Pages

```bash
# vite.config.ts に base 追加
export default defineConfig({
  base: '/dance-live-stream-demo/',
  // ...
})

npm run build
# distフォルダをgh-pagesブランチにpush
```

---

## 📈 今後の拡張案

### Phase 2: 本格実装
- [ ] バックエンドAPI統合（FastAPI / Node.js）
- [ ] 実際のGemini API連携
- [ ] WebSocket通信（リアルタイム配信）
- [ ] ユーザー認証（Firebase Auth / Clerk）
- [ ] データベース保存（PostgreSQL / Supabase）

### Phase 3: 機能追加
- [ ] 複数配信者同時表示
- [ ] チャット機能
- [ ] リプレイ機能
- [ ] スタンプ・エフェクト
- [ ] プッシュ通知

### Phase 4: プラットフォーム拡大
- [ ] React Nativeでモバイルアプリ化
- [ ] iOS / Androidストア公開
- [ ] Webブラウザ完全対応
- [ ] タブレット対応

---

## 🤝 コントリビューション

このプロジェクトは営業デモ用プロトタイプです。
改善提案やバグ報告は Issue でお知らせください。

---

## 📄 ライセンス

このプロジェクトはデモ用途です。
商用利用の際は別途ライセンス確認をお願いします。

---

## 📞 サポート

### 問い合わせ
- **開発者**: Terisuke
- **プロジェクトタイプ**: 営業デモ用プロトタイプ
- **開発期間**: 2025年10月

### 参考リンク
- [React公式](https://react.dev/)
- [Vite公式](https://vitejs.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [Chart.js](https://www.chartjs.org/)

---

<div align="center">

**Built with ❤️ using React + Vite + TypeScript**

⭐ このプロジェクトが役に立ったらスターをお願いします！

</div>
