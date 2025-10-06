# Tailwind CSS v4 移行ガイド：PostCSSプラグインエラーの解決法

## 📋 問題の概要

Tailwind CSS v4にアップグレード後、開発サーバー起動時に以下のエラーが発生しました：

```
[plugin:vite:css] [postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. 
The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS 
you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
```

## 🔍 発生した症状

- ✗ Viteの開発サーバーが起動しない
- ✗ PostCSS処理でエラーが発生
- ✗ Tailwind CSSのスタイルが適用されない
- ✗ `node_modules/tailwindcss/dist/lib.js`でエラー

## 💡 原因の詳細

### Tailwind CSS v4の破壊的変更

Tailwind CSS v4では、PostCSSプラグインが**別パッケージに分離**されました：

- **v3まで**: `tailwindcss`パッケージに含まれていた
- **v4から**: `@tailwindcss/postcss`として独立

### 設定ファイルの変更

| 項目 | v3 | v4 |
|------|----|----|
| PostCSSプラグイン | `tailwindcss` | `@tailwindcss/postcss` |
| CSS記述 | `@tailwind base; @tailwind components; @tailwind utilities;` | `@import "tailwindcss";` |
| 設定ファイル | `tailwind.config.js` 必須 | 不要（CSS First Configuration） |

## ✅ 解決方法

### Step 1: パッケージのインストール

```bash
npm install @tailwindcss/postcss
```

### Step 2: `postcss.config.js`の更新

**Before (v3):**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**After (v4):**
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

### Step 3: `index.css`の更新

**Before (v3):**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**After (v4):**
```css
@import "tailwindcss";
```

### Step 4: `tailwind.config.js`の削除

Tailwind CSS v4では設定ファイルが不要になりました（CSS First Configuration）：

```bash
rm tailwind.config.js
```

カスタム設定が必要な場合は、CSS内で`@theme`ディレクティブを使用します：

```css
@import "tailwindcss";

@theme {
  --breakpoint-md: 961px;
  --color-primary: #FF3B5C;
}
```

## 📂 影響を受けたファイル

```
/Users/teradakousuke/Developer/dance-live-stream-demo/
├── postcss.config.js        # ✏️ 更新
├── index.css                # ✏️ 更新
├── tailwind.config.js       # ❌ 削除
└── package.json             # ✏️ 新しい依存関係追加
```

## 🎯 完全な実装例

### package.json

```json
{
  "devDependencies": {
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### postcss.config.js

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

### index.css

```css
@import "tailwindcss";

/* カスタム設定（オプション） */
@theme {
  --font-sans: system-ui, -apple-system, sans-serif;
}
```

## ⚠️ 注意点

1. **既存のカスタムクラス**: `@apply`の使用方法が変更されています
2. **プラグイン**: サードパーティプラグインのv4対応を確認
3. **ビルド時間**: v4はより高速ですが、初回ビルドで最適化されます
4. **ブレイクポイント**: 一部のユーティリティクラス名が変更されています
   - `shadow-sm` → `shadow-xs`
   - `shadow` → `shadow-sm`

## 🔗 参考リンク

- [Tailwind CSS v4 公式ドキュメント](https://tailwindcss.com/docs)
- [Tailwind CSS v4 を導入する手順 - Qiita](https://qiita.com/mamoru2002/items/73c789f96c7cfb0dff75)
- [Tailwind CSS 4系の導入・設定ガイド](https://itokoba.com/archives/13018)
- [PostCSS プラグインの変更について](https://tailwindcss.com/docs/upgrade-guide)

## 📊 トラブルシューティング

### エラーが解決しない場合

1. **キャッシュのクリア**
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

2. **依存関係の再インストール**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Node.jsのバージョン確認**
   - Tailwind CSS v4は Node.js 18以上を推奨

---

**作成日**: 2025年10月6日  
**環境**: Vite + React + TypeScript  
**Tailwind CSS バージョン**: v4.0.0

