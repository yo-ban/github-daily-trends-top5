# リポジトリ解析: zaidmukaddam/scira

## 基本情報
- リポジトリ名: zaidmukaddam/scira
- 主要言語: TypeScript
- スター数: 9,032
- フォーク数: 1,103
- 最終更新: アクティブにメンテナンス中
- ライセンス: Apache License 2.0
- トピックス: AI検索エンジン、Vercel AI SDK、Tavily AI、マルチLLM対応、Next.js

## 概要
### 一言で言うと
Vercel AI SDKとTavily AIを活用したミニマリスティックAI検索エンジンで、xAIのGrok 3を含む最新のLLMを統合し、Web検索からコード実行まで幅広い機能を提供するオールインワン検索プラットフォーム。

### 詳細説明
Scira（旧名：MiniPerplx）は、AIを活用した次世代検索エンジンで、単なる情報検索だけでなく、情報の分析、要約、引用元の明示を行います。Vercel AI SDKをベースに、Tavily AIの検索グラウンディング機能を組み合わせ、複数のAIプロバイダー（xAI、Google、Anthropic、OpenAI、Groq）の最新モデルを統合しています。ユーザーは選択したモデルを使用して、Web検索、学術論文検索、コード実行、株価チャート、天気情報、地図検索など、多様な機能を利用できます。

### 主な特徴
- **マルチLLM対応**: xAI Grok 3、Google Gemini 2.5、Anthropic Claude 4、OpenAI o3など最新モデルを統合
- **AIパワード検索**: Tavily APIを使用したWeb検索、ソース引用付き回答
- **特化検索機能**: Reddit、X (Twitter)、YouTube、学術論文検索
- **コードインタープリター**: DaytonaサンドボックスでPythonコード実行
- **金融データ分析**: インタラクティブ株価チャート、通貨変換
- **ロケーションサービス**: 天気情報、地図、近隣検索、フライト追跡
- **エンターテインメント**: 映画・TV番組情報、トレンド検索
- **メモリ管理**: Mem0 AIを使用した個人メモリ機能
- **デフォルト検索エンジン設定**: Chromeブラウザでの設定手順提供
- **ストリーミング対応**: リアルタイムレスポンス表示

## 使用方法
### インストール
#### 前提条件
- Node.js LTS版
- pnpm 10.12.4+
- DockerとDocker Compose（Dockerデプロイの場合）
- 各AIプロバイダーのAPIキー（必須：OpenAI、Anthropic、Tavily）

#### インストール手順
```bash
# 方法1: Vercelへのワンクリックデプロイ
# Deploy with Vercelボタンをクリックし、環境変数を設定

# 方法2: Docker Composeを使用（推奨）
# .envファイルを.env.exampleをベースに作成
cp .env.example .env
# 必要なAPIキーを.envに記入
# Docker Composeで起動
docker compose up

# 方法3: ローカルNode.jsでの起動
# 依存関係のインストール
pnpm install
# .env.localファイルに環境変数を設定
cp .env.example .env.local
# 開発サーバーを起動
pnpm dev
```

### 基本的な使い方
#### Hello World相当の例
```
# ブラウザでhttp://localhost:3000を開く
# 検索ボックスに質問を入力
"What is the weather in Tokyo today?"
# AIモデルを選択（デフォルト：Grok 3）
# Enterキーで検索実行
```

#### 実践的な使用例
```typescript
// 環境変数の設定例 (.env.local)
XAI_API_KEY=your_xai_key
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
TAVILY_API_KEY=your_tavily_key
EXA_API_KEY=your_exa_key

// 検索グループの使用例
- Web: 一般的なWeb検索
- Academic: 学術論文検索
- X: X (Twitter)投稿検索
- Reddit: Reddit投稿検索
- YouTube: 動画検索（字幕付き）
- Analysis: コード実行、株価分析
- Extreme: 複数ソースからの深い分析
```

### 高度な使い方
```typescript
// カスタム検索エンドポイントの実装例
// app/api/search/route.ts
import { searchTool } from '@/ai/tools/search';
import { generateText } from 'ai';

export async function POST(req: Request) {
  const { query } = await req.json();
  
  // Tavilyを使用したWeb検索
  const searchResults = await searchTool({
    query,
    searchDepth: 'advanced',
    maxResults: 10
  });
  
  // AIモデルで結果を分析
  const response = await generateText({
    model: xai('grok-3'),
    messages: [{
      role: 'user',
      content: `Analyze: ${JSON.stringify(searchResults)}`
    }]
  });
  
  return Response.json({ result: response.text });
}

// Chromeデフォルト検索エンジン設定
// 設定 > 検索エンジン > 検索エンジンとサイト検索を管理
// URL: https://scira.ai?q=%s
// ショートカット: sh
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、機能一覧、インストール手順
- **LICENSE**: Apache 2.0ライセンス
- **funding.json**: スポンサー情報
- **デプロイボタン**: Vercelへのワンクリックデプロイ

### サンプル・デモ
- **ライブデモ**: https://scira.ai
- **AIモデルデモ**: 各種AIモデルの切り替えと比較
- **検索グループデモ**: 9つの専門検索グループ

### チュートリアル・ガイド
- Chromeデフォルト検索エンジン設定ガイド
- Dockerデプロイガイド
- ローカル開発セットアップガイド
- APIキー取得ガイド（各プロバイダー）

## 技術的詳細
### アーキテクチャ
#### 全体構造
Next.js 15 App RouterをベースとしたモダンなReactアプリケーション。Vercel AI SDKを中核に、複数のAIプロバイダーと外部APIを統合。ストリーミングレスポンス、リアルタイムデータ処理、高度なUIコンポーネントを組み合わせたフルスタックWebアプリケーション。

#### ディレクトリ構成
```
scira/
├── ai/               # AI関連機能
│   ├── providers.ts # AIプロバイダー設定
│   └── extreme-search.ts # 高度検索機能
├── app/              # Next.js App Router
│   ├── (auth)/      # 認証関連ページ
│   ├── (search)/    # メイン検索ページ
│   ├── api/         # APIエンドポイント
│   └── search/[id]/ # 動的検索結果ページ
├── components/       # Reactコンポーネント
│   ├── ui/          # Shadcn/UIコンポーネント
│   ├── core/        # コアUIコンポーネント
│   └── logos/       # ロゴコンポーネント
├── hooks/            # カスタムReactフック
├── lib/              # ユーティリティ関数
│   ├── auth.ts      # 認証ロジック
│   └── db/          # データベース関連
└── public/           # 静的アセット
```

#### 主要コンポーネント
- **ChatInterface**: メイン検索インターフェース
  - 場所: `components/chat-interface.tsx`
  - 機能: AIモデル選択、検索実行、結果表示
  - 依存: Vercel AI SDK、各種検索ツール

- **MultiSearch**: 複数検索エンジン統合
  - 場所: `components/multi-search.tsx`
  - 機能: 並列検索、結果統合、ソース管理

- **InteractiveCharts**: データ可視化
  - 場所: `components/interactive-charts.tsx`
  - 機能: 株価チャート、気象データ、動的グラフ
  - 依存: ECharts、Recharts

### 技術スタック
#### コア技術
- **言語**: TypeScript 5+、React 19
- **フレームワーク**: Next.js 15.4.0 (App Router, Turbopack)
- **主要ライブラリ**:
  - Vercel AI SDK (4.3.16): AIモデル統合、ストリーミング
  - Tavily Core (0.5.8): Web検索グラウンディング
  - Exa.js (1.8.17): 学術・YouTube検索
  - Shadcn/UI + Radix UI: UIコンポーネント
  - Drizzle ORM (0.44.2): データベース管理
  - Better Auth (1.2.11): 認証システム
  - Mem0 AI (2.1.33): メモリ管理
  - Mapbox GL (3.12.0): 地図表示
  - ECharts (5.6.0): データ可視化

#### 開発・運用ツール
- **ビルドツール**: Next.js Turbopack、pnpm 10.12.4
- **スタイリング**: Tailwind CSS 4.1.11、PostCSS
- **デプロイ**: Vercel、Docker (multi-stage build)
- **データベース**: PostgreSQL (Neon Serverless)
- **アナリティクス**: Vercel Analytics、PostHog
- **コード品質**: ESLint、TypeScript、Knip

### 設計パターン・手法
- **コンポーネントベース設計**: Reactコンポーネントの再利用性
- **ストリーミングアーキテクチャ**: AI SDKのstreaming機能を活用
- **サーバーコンポーネント**: Next.jsのRSCでサーバーサイド処理
- **エッジ関数**: Vercel Edge Functionsで高速化
- **環境変数管理**: @t3-oss/env-nextjsで型安全な設定

### データフロー・処理フロー
1. **ユーザー入力**: 検索クエリ、AIモデル選択、検索グループ選択
2. **リクエスト処理**: APIエンドポイントでパラメータ検証
3. **検索実行**: 
   - Tavily/Exa APIでWeb検索
   - 複数の検索ソースを並列処理
   - 結果のキャッシュ（Redis）
4. **AI処理**:
   - 選択されたLLMで結果を分析
   - ストリーミングでリアルタイム表示
   - ソース引用の生成
5. **結果表示**: 
   - リッチなUIで結果を表示
   - インタラクティブ要素（チャート、地図）
   - 検索履歴の保存

## API・インターフェース
### 公開API
#### 検索API (/api/search)
- 目的: プログラマティックな検索アクセス
- 使用例:
```typescript
// POST /api/search
{
  "query": "xAI Grok 3 vs OpenAI o3 comparison",
  "model": "grok-3",
  "searchGroup": "web",
  "options": {
    "searchDepth": "advanced",
    "includeImages": true
  }
}
```

#### Raycast API (/api/raycast)
- 目的: Raycast拡張機能のサポート
- 機能: デスクトップからの高速検索

### 設定・カスタマイズ
#### 設定ファイル
```bash
# .env.localの主要設定
# AIプロバイダー
XAI_API_KEY=           # xAI (Grok)
OPENAI_API_KEY=        # OpenAI
ANTHROPIC_API_KEY=     # Anthropic Claude
GOOGLE_GENERATIVE_AI_API_KEY= # Google Gemini
GROQ_API_KEY=          # Groq

# 検索・APIサービス
TAVILY_API_KEY=        # Web検索
EXA_API_KEY=           # 学術・YouTube検索
TMDB_API_KEY=          # 映画・TV情報

# インフラ
DATABASE_URL=          # PostgreSQL
REDIS_URL=             # キャッシュ
```

#### 拡張・プラグイン開発
- 新しいAIモデルの追加: `ai/providers.ts`にプロバイダー追加
- 新しい検索ソース: `ai/tools/`にツール実装
- UIコンポーネント: `components/`に追加

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- Next.js Turbopackによる高速ビルド
- Vercel Edge Functionsで低レイテンシ
- AI SDKのストリーミングで即座に結果表示
- Redisキャッシュで重複検索を高速化
- React 19の最適化機能を活用

### スケーラビリティ
- VercelのグローバルCDNで世界中からアクセス可能
- サーバーレスアーキテクチャで自動スケーリング
- NeonのサーバーレスPostgreSQLでデータベースもスケーラブル
- 複数のAIプロバイダーで負荷分散可能

### 制限事項
- 各AIプロバイダーのAPIキーが必要
- APIレート制限はプロバイダーに依存
- 一部の検索機能は特定のAPIキーが必要
- リアルタイムデータは外部APIの可用性に依存

## 評価・所感
### 技術的評価
#### 強み
- 最新のAIモデル（xAI Grok 3、Claude 4 Opus、o3等）を統合
- 豊富な検索機能と専門化された検索グループ
- 優れたUX/UIとリアルタイムレスポンス
- オープンソースでカスタマイズ可能
- モダンな技術スタックと良いコード構造
- Vercelへのワンクリックデプロイ

#### 改善の余地
- 複数のAPIキー設定が煩雑
- ドキュメントの不足（特に開発者向け）
- テストの不足
- セルフホスト時のコスト管理

### 向いている用途
- AIを活用した高度な情報検索
- 研究・学術目的の情報収集
- データ分析と可視化
- AIモデルの比較・評価
- デフォルト検索エンジンとしての日常利用

### 向いていない用途
- APIキーを持たないユーザー
- オフライン環境での利用
- 機密情報を扱う用途
- 大量の自動検索処理

### 総評
Sciraは、最新のAI技術を統合した非常に印象的なAI検索エンジンです。特にxAIのGrok 3を含む最新LLMの統合、多様な検索グループ、リッチなUIは、従来の検索エンジンを超える体験を提供しています。Vercel AI SDKを中核としたモダンなアーキテクチャ、Next.js 15の最新機能を活用した実装は、技術的にも非常に洗練されています。オープンソースであることも大きな強みで、開発者にとっては学習教材としても価値があります。ただし、複数のAPIキーが必要な点やコスト管理の課題はあるため、商用利用や大規模展開には注意が必要です。