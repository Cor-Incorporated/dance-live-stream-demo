# 技術ドキュメント - Dance Live Stream Demo

このディレクトリには、プロジェクト開発中に直面した技術的な問題とその解決方法をまとめたドキュメントが含まれています。

## 📚 ドキュメント一覧

### 1. [Tailwind CSS v4 移行ガイド](./tailwind-v4-migration.md)
**問題**: PostCSSプラグインエラーで開発サーバーが起動しない

**キーワード**: 
- Tailwind CSS v4
- PostCSS設定
- `@tailwindcss/postcss`
- CSS First Configuration

**対象読者**: Tailwind CSS v3からv4へ移行する開発者

---

### 2. [YouTube動画埋め込み問題の解決ガイド](./youtube-embed-issues.md)
**問題**: YouTube動画が表示されない、postMessageエラー

**キーワード**:
- YouTube IFrame API
- react-youtube
- 埋め込み制限
- origin設定
- enablejsapi

**対象読者**: React/TypeScriptでYouTube動画を埋め込む開発者

---

### 3. [UIレイヤー競合問題の解決ガイド](./ui-layer-conflicts.md)
**問題**: オーバーレイが他のボタンを覆いクリックできない

**キーワード**:
- pointer-events
- z-index
- イベント処理
- React UI設計

**対象読者**: 複雑なUIレイヤーを扱うReact開発者

---

## 🎯 問題の概要マトリックス

| 問題            | 影響度 | 解決難易度 | 所要時間 | ドキュメント                            |
|---------------|-------|-----------|---------|-----------------------------------|
| Tailwind v4移行 | 🔴 高  | 🟡 中      | 30分     | [リンク](./tailwind-v4-migration.md) |
| YouTube埋め込み   | 🔴 高  | 🟢 低      | 20分     | [リンク](./youtube-embed-issues.md)  |
| UIレイヤー競合      | 🟠 中  | 🟢 低      | 40分     | [リンク](./ui-layer-conflicts.md)    |

## 📖 使い方

### 問題に直面した場合

1. **症状を確認**: エラーメッセージやコンソールログを確認
2. **該当ドキュメントを探す**: 上記のキーワードで検索
3. **解決方法を適用**: コード例を参考に実装
4. **トラブルシューティング**: 解決しない場合はトラブルシューティングセクションを確認

### 技術記事として活用

これらのドキュメントは以下の形式で公開できます：

- **Qiita記事**: Markdownをそのまま投稿
- **Zenn記事**: Zenn CLIで管理
- **個人ブログ**: MDXとして活用
- **社内Wiki**: Notion/Confluenceにインポート

## 🔧 技術スタック

このプロジェクトで使用した主要な技術：

- **フレームワーク**: React 19.2.0 + TypeScript
- **ビルドツール**: Vite 6.2.0
- **スタイリング**: Tailwind CSS 4.0.0
- **アニメーション**: Framer Motion 12.23.22
- **動画埋め込み**: react-youtube 10.1.0
- **グラフ**: Chart.js 4.5.0 + react-chartjs-2 5.3.0

## 📝 ドキュメント作成ポリシー

各ドキュメントは以下の構造で統一されています：

1. **問題の概要**: 何が起きたか
2. **発生した症状**: どう見えたか
3. **原因の詳細**: なぜ起きたか
4. **解決方法**: どう直すか
5. **コード例**: 実際の実装
6. **トラブルシューティング**: 解決しない場合の対処法
7. **参考リンク**: 追加情報へのリンク

## 🤝 コントリビューション

新しい問題を発見した場合：

1. 同様の構造でMarkdownドキュメントを作成
2. このREADMEに追加
3. プルリクエストを作成

## 📅 更新履歴

- **2025-10-06**: 初版作成
  - Tailwind CSS v4移行ガイド
  - YouTube埋め込み問題ガイド
  - UIレイヤー競合ガイド

---

**プロジェクト**: Dance Live Stream Demo  
**リポジトリ**: https://github.com/Cor-Incorporated/dance-live-stream-demo  
**作成者**: Cor.Incorporated

