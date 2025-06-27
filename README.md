# GitHub Daily Trends サイト

GitHubのトレンドリポジトリを日次で自動公開するWebサイトシステム

## 🚀 クイックスタート

### 1. セットアップ

```bash
# リポジトリの初期化
git init
git add .
git commit -m "Initial commit"

# GitHubで新しいリポジトリを作成後
git remote add origin https://github.com/[username]/github-trends-site.git
git push -u origin main
```

### 2. GitHub Pages を有効化

1. Settings → Pages → Source: "GitHub Actions"を選択

### 3. 初回テスト

```bash
# サンプルデータを作成
mkdir -p data/analysis_2025-06-27
echo "# リポジトリ解析: owner/sample-repo

## 基本情報
- リポジトリ名: owner/sample-repo
- 主要言語: JavaScript
- スター数: 1,234

## 概要
サンプルリポジトリです。" > data/analysis_2025-06-27/repo_1_sample-repo.md

# プッシュして自動デプロイ
git add data/
git commit -m "Add sample data"
git push
```

## 📁 プロジェクト構成

```
/                           # リポジトリルート
├── .github/workflows/      # GitHub Actions（自動デプロイ）
├── data/                   # 解析結果データ（外部から追加）
│   └── analysis_YYYY-MM-DD/
├── src/                    # Webサイトソース
│   ├── _data/             # グローバルデータ
│   ├── _includes/         # テンプレート
│   ├── assets/            # CSS/JS
│   └── *.njk              # ページファイル
├── scripts/               # ビルドスクリプト
├── dist/                  # ビルド出力（自動生成）
└── package.json
```

## 🔄 データ連携

### 外部サーバーからデータを追加

```bash
# サイトリポジトリをクローン
git clone https://github.com/[username]/github-trends-site.git
cd github-trends-site

# 解析結果をコピー
cp -r /path/to/analysis_2025-06-27 data/

# プッシュ（自動でサイトがビルドされます）
git add data/analysis_2025-06-27
git commit -m "Add analysis for 2025-06-27"
git push
```

### 自動化スクリプト例

```bash
#!/bin/bash
DATE=$(date +%Y-%m-%d)
SITE_REPO="/path/to/github-trends-site"

# 解析実行（外部サーバー）
./run-analysis.sh

# サイトリポジトリ更新
cd $SITE_REPO
git pull
cp -r /path/to/analysis_${DATE} data/
git add data/analysis_${DATE}
git commit -m "Add analysis for ${DATE}"
git push
```

## 💻 ローカル開発

```bash
# 依存関係インストール
npm install

# データ生成
npm run generate-data

# 開発サーバー起動
npm run serve
# → http://localhost:8080

# 本番ビルド
npm run build
```

## 🎨 カスタマイズ

- **デザイン**: `/src/assets/css/main.css`
- **テンプレート**: `/src/_includes/layouts/`
- **データ処理**: `/scripts/generate-site-data.js`

## 📋 技術仕様

- **静的サイトジェネレーター**: 11ty (Eleventy)
- **ホスティング**: GitHub Pages  
- **CI/CD**: GitHub Actions
- **スタイル**: モノクロームモダンデザイン

## 🔧 トラブルシューティング

### ビルドが失敗する
- Actions タブでエラーログを確認
- ローカルで `npm run build` を実行してエラーを確認

### ページが表示されない
- Settings → Pages で GitHub Actions が選択されているか確認
- URLが正しいか確認: `https://[username].github.io/[repository-name]/`

## 📝 開発者向け情報

詳細な技術情報は [DEVELOPMENT.md](DEVELOPMENT.md) を参照してください。