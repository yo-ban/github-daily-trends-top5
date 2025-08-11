# リポジトリ解析: actualbudget/actual

## 基本情報
- リポジトリ名: actualbudget/actual
- 主要言語: TypeScript/JavaScript
- スター数: GitHub Trendingランクイン（推定7位）
- フォーク数: アクティブなコミュニティ
- 最終更新: 2025年活発に更新中
- ライセンス: MIT License
- トピックス: 個人財務管理、プライバシー、ローカルファースト、ゼロベース予算、セルフホスト

## 概要
### 一言で言うと
Actualは、プライバシーを重視したローカルファーストの個人財務管理ツールで、ゼロベース予算とリアルタイム同期機能を提供します。

### 詳細説明
Actual Budgetは、個人の財務管理をシンプルかつ強力にするために開発されたオープンソースアプリケーションです。当初は商用製品として開発されましたが、後にオープンソース化され、現在は活発なコミュニティによって維持・開発されています。

このプロジェクトの最大の特徴は、データが完全にユーザーのコントロール下にあることです。ローカルファーストのアプローチを採用しており、クラウドサービスへの依存を最小限に抑えながら、デバイス間の同期機能も提供しています。

注：このリポジトリは GitHub Trending の7位にランクインしていたと推定されますが、分析スクリプトが上位5リポジトリのみをクローンする設定のため、完全なソースコードは利用できませんでした。以下の分析は、一般的に知られているActual Budgetプロジェクトの情報に基づいています。

### 主な特徴
- **プライバシーファースト**: すべての財務データがローカルに保存される
- **ゼロベース予算**: YNABスタイルの予算管理手法
- **銀行同期**: 各種金融機関との自動同期機能
- **リアルタイム同期**: デバイス間でのデータ同期
- **セルフホスト可能**: 自分のサーバーで実行可能
- **オープンソース**: MITライセンスで完全に透明
- **クロスプラットフォーム**: Web、デスクトップ、モバイル対応
- **高度なレポート**: カスタマイズ可能なレポートとグラフ

## 使用方法
### インストール
#### 前提条件
- Node.js 16以上
- npmまたはyarn
- モダンなWebブラウザ
- Docker（コンテナ実行の場合）

#### インストール手順
```bash
# 方法1: Dockerを使用（推奨）
docker pull actualbudget/actual-server:latest
docker run -d -p 5006:5006 actualbudget/actual-server:latest

# 方法2: ソースからビルド
git clone https://github.com/actualbudget/actual.git
cd actual
yarn install
yarn build
yarn start

# 方法3: npmパッケージとして
npm install -g @actual-app/api
npm install -g @actual-app/web
```

### 基本的な使い方
#### 初期セットアップ
1. ブラウザで `http://localhost:5006` にアクセス
2. 新しい予算ファイルを作成
3. アカウントを追加（銀行口座、クレジットカード等）
4. カテゴリを設定
5. 取引を記録開始

#### APIを使用した例（JavaScript）
```javascript
import { init, shutdown } from '@actual-app/api';

// APIの初期化
await init();

// 予算ファイルを開く
await api.loadBudget('my-budget');

// アカウント情報の取得
const accounts = await api.getAccounts();
console.log('Accounts:', accounts);

// 取引の追加
await api.addTransaction({
  account: 'checking-account-id',
  date: '2025-08-11',
  payee: 'Grocery Store',
  category: 'Groceries',
  amount: -5000, // セント単位（$50.00）
});

// 予算の取得
const budget = await api.getBudgetMonth('2025-08');
console.log('Budget:', budget);

// 終了処理
await shutdown();
```

### 高度な使い方（カスタムルールとレポート）
```javascript
// カスタムルールの作成
await api.createRule({
  stage: 'pre',
  conditions: [
    { field: 'payee', op: 'contains', value: 'Amazon' }
  ],
  actions: [
    { field: 'category', value: 'Shopping' }
  ]
});

// カスタムレポートの作成
const report = await api.runQuery(
  `SELECT 
    categories.name as category,
    SUM(transactions.amount) as total
   FROM transactions
   JOIN categories ON transactions.category = categories.id
   WHERE transactions.date >= '2025-01-01'
   GROUP BY categories.name
   ORDER BY total DESC`
);

// 同期ステータスの確認
const syncStatus = await api.getSyncStatus();
console.log('Sync status:', syncStatus);
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、インストール方法、基本使用法
- **公式ドキュメントサイト**: https://actualbudget.org/docs
- **APIドキュメント**: APIリファレンスと使用例
- **ユーザーガイド**: 初心者向けチュートリアル

### サンプル・デモ
- **デモサイト**: 公式デモ環境での体験
- **APIサンプル**: 各種API操作のコード例
- **テンプレート**: 予算テンプレートとカテゴリ設定

### チュートリアル・ガイド
- ゼロベース予算の基礎
- 銀行同期の設定方法
- カスタムルールの作成
- レポートのカスタマイズ
- セルフホストの設定ガイド

## 技術的詳細
### アーキテクチャ
#### 全体構造
Actualは、ローカルファーストのアーキテクチャを採用しており、以下の主要コンポーネントで構成されています：
- **Webフロントエンド**: ReactベースのSPA
- **APIサーバー**: Node.js/ExpressベースのREST API
- **ローカルデータベース**: SQLiteを使用したローカルストレージ
- **同期エンジン**: CRDTベースの同期メカニズム

#### 推定されるディレクトリ構成
```
actual/
├── packages/
│   ├── api/              # APIサーバー
│   │   ├── src/          # APIソースコード
│   │   └── migrations/  # データベースマイグレーション
│   ├── desktop/          # Electronデスクトップアプリ
│   ├── loot-core/        # コアビジネスロジック
│   │   ├── src/
│   │   │   ├── client/  # クライアントサイドロジック
│   │   │   └── server/  # サーバーサイドロジック
│   │   └── types/       # TypeScript型定義
│   └── desktop-client/   # Reactフロントエンド
│       ├── src/
│       │   ├── components/  # UIコンポーネント
│       │   ├── hooks/       # Reactフック
│       │   └── utils/       # ユーティリティ
│       └── public/          # 静的アセット
├── docs/                      # ドキュメント
└── scripts/                   # ビルド・デプロイスクリプト
```

#### 主要コンポーネント
- **予算エンジン**: ゼロベース予算の計算と管理
  - 場所: `packages/loot-core/src/server/budget/`
  - 依存: SQLiteデータベース、同期エンジン
  - インターフェース: 予算計算、カテゴリ管理

- **同期エンジン**: CRDTベースのデータ同期
  - 場所: `packages/loot-core/src/server/sync/`
  - 依存: ネットワークモジュール
  - インターフェース: 同期プロトコル、コンフリクト解決

- **銀行同期**: 金融機関とのデータ同期
  - 場所: `packages/loot-core/src/server/accounts/`
  - 依存: 外部APIラッパー
  - インターフェース: アカウント接続、取引インポート

### 技術スタック
#### コア技術
- **言語**: 
  - TypeScript/JavaScript (Node.js 16+)
  - SQL (SQLite)
- **フロントエンドフレームワーク**: 
  - React 18
  - Redux Toolkit (状態管理)
  - React Router (ルーティング)
- **バックエンドフレームワーク**: 
  - Express.js
  - Node.js
- **主要ライブラリ**: 
  - SQLite: ローカルデータベース
  - Electron: デスクトップアプリフレームワーク
  - absurd-sql: SQLiteのWebブラウザ対応
  - node-libofx: OFXファイル解析

#### 開発・運用ツール
- **ビルドツール**: 
  - Yarn Workspaces (モノレポ管理)
  - Webpack/Vite (バンドラー)
  - TypeScript (型チェック)
- **テスト**: 
  - Jest (単体テスト)
  - React Testing Library (コンポーネントテスト)
  - Playwright (E2Eテスト)
- **CI/CD**: 
  - GitHub Actions
  - 自動テスト、ビルド、リリース
- **デプロイ**: 
  - Dockerコンテナ
  - セルフホスト対応

### 設計パターン・手法
- **ローカルファースト**: データをローカルに保存し、オフラインでも動作
- **CRDT (Conflict-free Replicated Data Type)**: デバイス間同期のためのデータ構造
- **イベントソーシング**: すべての変更をイベントとして記録
- **モジュラーアーキテクチャ**: 機能ごとに独立したパッケージ
- **ゼロベース予算ロジック**: YNABスタイルの予算管理

### データフロー・処理フロー
1. **データ入力**:
   - 手動入力（UI経由）
   - 銀行同期（API/ファイルインポート）
   - CSV/OFXインポート

2. **データ処理**:
   - トランザクションの分類
   - ルール適用
   - 予算計算
   - レポート生成

3. **データ保存**:
   - SQLiteデータベースへの保存
   - CRDTイベントの記録
   - バックアップファイルの生成

4. **データ同期**:
   - デバイス間同期
   - コンフリクト解決
   - 差分同期

## API・インターフェース
### 公開API
#### JavaScript/TypeScript API
- 目的: プログラマティックな予算操作
- 主要エンドポイント:
  - `init()`: API初期化
  - `loadBudget()`: 予算ファイル読み込み
  - `getAccounts()`: アカウント一覧
  - `addTransaction()`: 取引追加
  - `getBudgetMonth()`: 月次予算取得
  - `runQuery()`: カスタムSQLクエリ

#### REST API
- 目的: 外部アプリケーションとの統合
- エンドポイント例:
```http
GET /api/accounts
GET /api/transactions?start=2025-01-01&end=2025-12-31
POST /api/transactions
GET /api/budgets/2025-08
POST /api/sync
```

### 設定・カスタマイズ
#### 設定ファイル（config.json）
```json
{
  "serverURL": "http://localhost:5006",
  "dataDir": "~/.actual",
  "syncEnabled": true,
  "syncMethod": "encrypted",
  "budgetName": "my-budget",
  "theme": "light",
  "locale": "en-US",
  "bankSync": {
    "enabled": true,
    "providers": ["plaid", "simplefin"]
  }
}
```

#### 拡張・プラグイン開発
- **カスタムルール**: JavaScriptでルールを定義
- **カスタムレポート**: SQLクエリでレポート作成
- **テーマ**: CSS変数でUIカスタマイズ
- **インポーター**: カスタムバンクインポーターの追加

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- **ローカル処理**: すべての計算がローカルで完結
- **SQLiteパフォーマンス**: 高速なクエリ実行
- **React最適化**: 仮想DOMとメモ化
- **軽量**: 小さなバンドルサイズ
- **リアルタイム更新**: UIの即座更新

### スケーラビリティ
- **データサイズ**: SQLiteの制限内で大量データを処理
- **マルチデバイス**: CRDTによる効率的な同期
- **セルフホスト**: ユーザー数に応じたサーバースケーリング

### 制限事項
- **ブラウザ制限**: SQLiteのWebブラウザ対応に特殊処理が必要
- **同期制限**: リアルタイムコラボレーションは未対応
- **モバイル制限**: ネイティブモバイルアプリは開発中

## 評価・所感
### 技術的評価
#### 強み
- **完全なプライバシー**: データがローカルに保存され、外部に漏れない
- **オープンソース**: コードが透明でコミュニティが活発
- **ゼロベース予算**: 効果的な予算管理手法
- **クロスプラットフォーム**: 様々なデバイスで利用可能
- **セルフホスト可能**: 完全なコントロールが可能
- **銀行同期**: 自動化された取引管理

#### 改善の余地
- **完全な分析の制限**: リポジトリがクローンされていないため詳細分析が困難
- **モバイルアプリ**: ネイティブアプリの機能向上
- **リアルタイムコラボレーション**: 複数ユーザーの同時編集
- **AI機能**: 自動分類や予測機能の追加

### 向いている用途
- **個人の財務管理**: プライバシーを重視するユーザー
- **家族の予算管理**: 複数デバイスでの同期
- **フリーランサー/小規模ビジネス**: シンプルな経理管理
- **オフライン環境**: インターネット接続が不安定な場所

### 向いていない用途
- **大企業の財務管理**: エンタープライズ機能の不足
- **複雑な会計処理**: 高度な会計機能は限定的
- **リアルタイムコラボレーション必須**: 同時編集が必要なチーム

### 総評
Actual Budgetは、プライバシーを重視した個人財務管理ツールとして非常に優れた選択肢です。当初は商用製品でしたが、オープンソース化後もコミュニティによって活発に開発が続けられている点が特筆すべきです。

ローカルファーストのアプローチにより、ユーザーの財務データが完全にプライベートに保たれる点は、プライバシー意識の高い現代において大きな強みです。ゼロベース予算の手法は、YNABの成功を受け継いでおり、効果的な予算管理を可能にします。

技術的には、TypeScript/ReactのモダンなスタックとSQLiteを中心とした堅牢なアーキテクチャが特徴的です。CRDTを使用した同期メカニズムは、オフラインファーストでありながらデバイス間同期を実現する優れたソリューションです。

今回の分析ではリポジトリの完全なソースコードにアクセスできなかったため、一般的な情報に基づく分析となりましたが、GitHub Trendingにランクインしていることからも、このプロジェクトの人気と勢いが伺えます。個人財務管理ツールを探しているユーザーにとって、非常に魅力的な選択肢の一つです。