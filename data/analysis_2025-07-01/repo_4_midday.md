# リポジトリ解析: midday-ai/midday

## 基本情報
- リポジトリ名: midday-ai/midday
- 主要言語: TypeScript
- スター数: 8,517
- フォーク数: 815
- 最終更新: 現在も活発に開発中
- ライセンス: GNU Affero General Public License v3.0（非商用）、商用ライセンス別途提供
- トピックス: フリーランサー向けツール、請求書作成、時間追跡、財務管理、AI統合

## 概要
### 一言で言うと
フリーランサー、コントラクター、コンサルタント、個人事業主向けのオールインワンビジネス管理ツールで、時間追跡、請求書作成、財務管理、ファイル管理を統合したプラットフォーム。

### 詳細説明
Middayは、複数のプラットフォームに分散している様々なビジネス機能を単一の統合システムにまとめたツールです。銀行連携による自動トランザクション取得、AIを活用したレシート・請求書の自動マッチング、リアルタイムコラボレーション対応の時間追跡など、フリーランサーが必要とするあらゆる機能を提供します。

モダンなテクノロジースタック（React 19、Next.js 15、Bun、Turborepo）を採用し、デスクトップアプリ（Tauri）、モバイルアプリ（Expo）、Webダッシュボードなど、マルチプラットフォーム対応を実現。OpenAIやMistralとの統合により、財務状況の分析や支出パターンの洞察などのAI機能も搭載しています。

### 主な特徴
- リアルタイム時間追跡とプロジェクト管理
- AI支援による請求書・レシートの自動マッチング（Magic Inbox）
- 銀行口座連携（Plaid、GoCardless、Teller対応）
- 請求書作成・管理・送信機能
- セキュアなファイルストレージ（Vault）
- 財務分析とAIアシスタント
- マルチプラットフォーム対応（Web、デスクトップ、モバイル）

## 使用方法
### インストール
#### 前提条件
**開発環境**
- Bun（最新版）
- Node.js v22以上
- Supabaseアカウント
- Upstashアカウント（KV storage用）

**必要なサービス**
- Supabase（データベース、認証、ストレージ）
- Vercel（ダッシュボード、ウェブサイトホスティング）
- Fly.io（API/tRPCホスティング）
- Trigger.dev（バックグラウンドジョブ）
- Resend（メール送信）
- Novu（通知）

#### インストール手順
```bash
# 方法1: ローカル開発環境の構築
git clone https://github.com/midday-ai/midday.git
cd midday

# 依存関係のインストール（Bun使用）
bun i

# 環境変数の設定（各サービスのAPIキーが必要）
cp .env.example .env.local
# .env.localファイルを編集してAPIキーを設定

# 開発サーバーの起動
bun dev
```

### 基本的な使い方
#### Hello World相当の例
```bash
# ダッシュボードの起動
bun dev:dashboard
# http://localhost:3000 でアクセス

# APIサーバーの起動
bun dev:api
# http://localhost:4000 でアクセス

# エンジン（銀行接続）の起動
bun dev:engine
# Cloudflare Workersとして実行
```

#### 実践的な使用例
```typescript
// tRPC APIの使用例（時間追跡エントリーの作成）
import { createTRPCClient } from '@midday/api';

const client = createTRPCClient();

// 新しい時間追跡エントリーを作成
const entry = await client.tracker.entries.create.mutate({
  projectId: 'project-123',
  description: 'フロントエンド開発',
  duration: 3600, // 1時間（秒単位）
  date: new Date().toISOString(),
});

// 請求書の作成
const invoice = await client.invoice.create.mutate({
  customerId: 'customer-123',
  items: [
    {
      description: 'Webサイト開発',
      quantity: 40,
      price: 10000, // 円
    }
  ],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30日後
});
```

### 高度な使い方
```typescript
// AI機能を使った財務分析
const insights = await client.ai.getInsights.query({
  type: 'spending_patterns',
  period: 'last_3_months',
});

// 銀行口座の接続（Plaid使用）
const linkToken = await client.bankConnections.createPlaidLink.mutate();
// Plaid Link UIを表示してユーザーが銀行を選択

// トランザクションの自動カテゴライズ
const categorized = await client.transactions.categorize.mutate({
  transactionId: 'txn-123',
  useAI: true,
});
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要とアーキテクチャ
- **apps/docs/**: APIリファレンスとガイド
- **local-development.mdx**: ローカル開発環境のセットアップ
- **self-hosting.mdx**: セルフホスティングガイド（準備中）

### サンプル・デモ
- **apps/dashboard/**: メインアプリケーションのソースコード
- **apps/engine/**: 銀行接続エンジンの実装
- **packages/ui/**: 再利用可能なUIコンポーネントライブラリ

### チュートリアル・ガイド
- ローカル開発ガイド（docs.midday.ai）
- APIドキュメント（準備中）

## 技術的詳細
### アーキテクチャ
#### 全体構造
Turborepoを使用したモノレポ構造を採用。アプリケーションとパッケージが明確に分離され、コードの再利用性と保守性を向上させています。

#### ディレクトリ構成
```
midday/
├── apps/                    # アプリケーション群
│   ├── api/                 # バックエンドAPI（tRPC/REST）
│   ├── dashboard/           # メインWebアプリケーション
│   ├── desktop/             # デスクトップアプリ（Tauri）
│   ├── docs/                # ドキュメントサイト
│   ├── engine/              # 銀行接続エンジン（Cloudflare Workers）
│   └── website/             # マーケティングサイト
├── packages/                # 共有パッケージ
│   ├── app-store/           # アプリストア統合
│   ├── documents/           # OCR処理（レシート・請求書）
│   ├── email/               # メールテンプレート
│   ├── encryption/          # 暗号化ユーティリティ
│   ├── events/              # 分析イベント
│   ├── import/              # CSVインポート機能
│   ├── inbox/               # メール受信処理
│   ├── invoice/             # 請求書生成
│   ├── jobs/                # バックグラウンドジョブ
│   ├── supabase/            # Supabaseクライアント
│   └── ui/                  # UIコンポーネントライブラリ
└── types/                   # 型定義
```

#### 主要コンポーネント
- **APIサーバー**: tRPCとRESTエンドポイントを提供、Drizzle ORMでPostgreSQL管理
  - 場所: `apps/api/`
  - 依存: Supabase、Upstash Redis
  - インターフェース: tRPC、REST API

- **ダッシュボード**: Next.js 15ベースのメインアプリケーション
  - 場所: `apps/dashboard/`
  - 依存: API、Supabase Auth
  - インターフェース: Webブラウザ

- **エンジン**: 銀行接続とトランザクション処理
  - 場所: `apps/engine/`
  - 依存: Plaid、GoCardless、Teller API
  - インターフェース: Cloudflare Workers

### 技術スタック
#### コア技術
- **言語**: TypeScript（全体）
- **フレームワーク**: 
  - Next.js 15（Web）
  - Tauri（デスクトップ）
  - Expo（モバイル）
  - Hono（APIエンドポイント）
- **主要ライブラリ**: 
  - tRPC: タイプセーフなAPI通信
  - Drizzle ORM: データベース管理
  - Shadcn/ui: UIコンポーネント
  - React Hook Form + Zod: フォーム処理とバリデーション

#### 開発・運用ツール
- **ビルドツール**: Bun、Turborepo
- **テスト**: Vitest（単体テスト）
- **CI/CD**: GitHub Actions
- **デプロイ**: Vercel、Fly.io、Cloudflare Workers

### 設計パターン・手法
- モノレポアーキテクチャによるコード共有
- tRPCによるタイプセーフなAPI通信
- Zodスキーマによる実行時型検証
- React Server Components活用
- オプティミスティックUIアップデート

### データフロー・処理フロー
1. ユーザー操作 → Next.jsアプリケーション
2. tRPCクライアント → APIサーバー
3. ビジネスロジック実行 → データベース更新
4. バックグラウンドジョブトリガー（Trigger.dev）
5. 外部サービス連携（銀行API、AI処理など）
6. リアルタイム更新（Supabase Realtime）

## API・インターフェース
### 公開API
#### tRPC API
- 目的: タイプセーフなAPIアクセス
- 使用例:
```typescript
// クライアント初期化
import { createTRPCClient } from '@midday/api';

const api = createTRPCClient({
  url: 'https://api.midday.ai',
  headers: {
    'x-api-key': 'your-api-key'
  }
});

// トランザクション取得
const transactions = await api.transactions.list.query({
  limit: 50,
  offset: 0,
  filter: { status: 'completed' }
});
```

#### REST API
```bash
# トランザクション一覧取得
curl -X GET https://api.midday.ai/v1/transactions \
  -H "Authorization: Bearer YOUR_API_KEY"

# 請求書作成
curl -X POST https://api.midday.ai/v1/invoices \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "cus_123",
    "items": [...]
  }'
```

### 設定・カスタマイズ
#### 設定ファイル
```typescript
// apps/dashboard/.env.local
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

// 銀行接続設定
PLAID_CLIENT_ID=your-plaid-client-id
PLAID_SECRET=your-plaid-secret
GOCARDLESS_CLIENT_ID=your-gocardless-id
GOCARDLESS_SECRET=your-gocardless-secret

// AI設定
OPENAI_API_KEY=your-openai-key
MISTRAL_API_KEY=your-mistral-key
```

#### 拡張・プラグイン開発
アプリストアフレームワークを通じて、SlackやZapierなどの外部サービスとの統合が可能。

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- React 19とServer Componentsによる高速レンダリング
- Edgeランタイム（Cloudflare Workers）での銀行接続処理
- Redisキャッシングによるレスポンス高速化
- 並列処理によるバックグラウンドジョブの効率化

### スケーラビリティ
- マルチテナント対応アーキテクチャ
- エッジコンピューティング活用
- 水平スケーリング可能なAPIサーバー

### 制限事項
- セルフホスティングのドキュメントが未完成
- 一部の銀行接続は地域限定（US、EU、カナダ）
- 商用利用には別途ライセンスが必要

## 評価・所感
### 技術的評価
#### 強み
- 最新技術スタックの採用（React 19、Next.js 15、Bun）
- 包括的な機能セット（時間追跡から財務管理まで）
- 優れたDX（開発者体験）とタイプセーフティ
- マルチプラットフォーム対応
- AI統合による付加価値

#### 改善の余地
- セルフホスティングドキュメントの充実
- より多くの銀行・決済プロバイダー対応
- エンタープライズ機能の拡充

### 向いている用途
- フリーランサー・個人事業主の業務管理
- 小規模コンサルティング会社
- クリエイター・デザイナーの請求管理
- リモートワーカーの時間・財務管理

### 向いていない用途
- 大企業の会計システム
- 複雑な在庫管理が必要な業務
- 規制の厳しい業界（医療、金融など）

### 総評
Middayは、フリーランサー市場の実際のニーズに応える実用的で革新的なソリューションです。最新の技術スタックと優れたUX設計により、複雑なビジネス管理をシンプルにします。オープンソースでありながら持続可能なビジネスモデルを採用し、活発な開発が続いています。特に個人事業主やフリーランサーにとって、業務効率化の強力なツールとなるでしょう。