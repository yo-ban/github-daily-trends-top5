# リポジトリ解析: Canner/WrenAI

## 基本情報
- リポジトリ名: Canner/WrenAI
- 主要言語: TypeScript
- スター数: 11,130
- フォーク数: 1,118
- 最終更新: 2025年
- ライセンス: GNU Affero General Public License v3.0
- トピックス: GenBI、Text-to-SQL、Business Intelligence、Natural Language、Data Analytics、Chart Generation

## 概要
### 一言で言うと
自然言語でデータベースに問い合わせ、正確なSQL生成・チャート作成・AI分析を数秒で実現するGenBI（Generative BI）エージェント。

### 詳細説明
WrenAIは、データ分析の民主化を目指すGenBI（Generative Business Intelligence）プラットフォームです。ユーザーが自然言語でデータベースに質問すると、AIが文脈を理解して正確なSQLクエリを生成し、結果をチャートとして可視化、さらにAIが生成したインサイトを提供します。

セマンティックレイヤー（MDL: Modeling Definition Language）を採用することで、LLMの出力精度を向上させ、データガバナンスを確保しています。Cannerチームによって開発され、エンタープライズグレードの機能とオープンソースの透明性を両立させた、次世代のビジネスインテリジェンスツールです。

### 主な特徴
- **Natural Language Query**: あらゆる言語での自然な問い合わせに対応
- **Accurate SQL Generation**: セマンティックレイヤーによる高精度なText-to-SQL変換
- **AI-Powered Insights**: 生成されたチャートとレポートによる意思決定支援
- **Semantic Layer (MDL)**: スキーマ、メトリクス、結合を符号化した意味的モデリング
- **Multiple Data Sources**: 11種類の主要データソース対応
- **LLM Integration**: 複数のLLMプロバイダーサポート
- **Cloud & Self-hosted**: クラウドサービスとセルフホスティング両対応
- **API-First Design**: アプリケーション組み込み対応のAPI提供

## 使用方法
### インストール
#### 前提条件
- Docker & Docker Compose
- 4GB以上のメモリ
- サポートされているデータベース（PostgreSQL、BigQuery、Snowflake等）
- LLMプロバイダーのAPIキー（OpenAI、Azure、Google等）

#### インストール手順
```bash
# 方法1: Docker Compose（推奨）
git clone https://github.com/Canner/WrenAI.git
cd WrenAI
cp .env.example .env
# .envファイルでLLM設定を構成
docker-compose up -d

# 方法2: Wren Launcher
curl -L https://github.com/Canner/WrenAI/releases/latest/download/install.sh | bash
wren-ai start
```

### 基本的な使い方
#### Hello World相当の例
```bash
# WrenAI起動後、http://localhost:3000 にアクセス
# 1. データソース接続
# 2. データモデリング（自動/手動）
# 3. 自然言語での質問開始

# 質問例:
# "今月の売上はいくらですか？"
# "部門別の売上を棒グラフで表示して"
# "昨年同期比の成長率を教えて"
```

#### 実践的な使用例
```python
# API経由での使用例
import requests

# SQL生成API
response = requests.post('http://localhost:8000/v1/ask', json={
    "query": "Show me monthly revenue trends",
    "project_id": "your_project_id"
})

# チャート生成API
chart_response = requests.post('http://localhost:8000/v1/chart', json={
    "query": "Create a pie chart of sales by region",
    "sql": generated_sql
})
```

### 高度な使い方
```yaml
# config.yaml での高度設定
llm:
  provider: openai
  api_key: your_key
  model: gpt-4
  
document_store:
  type: qdrant
  url: http://localhost:6333
  
wren_engine:
  endpoint: http://wren-engine:8080
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: 包括的なプロジェクト概要と導入ガイド
- **docs.getwren.ai**: 詳細なオンラインドキュメント
- **API Documentation**: OpenAPI仕様準拠のAPI仕様書
- **Configuration Guide**: 各種LLMプロバイダー設定例

### サンプル・デモ
- **Live Demo Videos**: GitHub埋め込み実演動画
- **Streamlit Demo**: Hugging Face Spacesでの体験版
- **Sample Datasets**: E-Commerce、HR等のサンプルデータ
- **Cloud Demo**: getwren.ai でのクラウド体験

### チュートリアル・ガイド
- 各種データソース接続ガイド（BigQuery、PostgreSQL等）
- セマンティックモデリング チュートリアル
- Discord コミュニティサポート
- エンタープライズ導入ガイド

## 技術的詳細
### アーキテクチャ
#### 全体構造
マイクロサービス指向のコンテナベース・アーキテクチャを採用。AI Service（Python）、UI（Next.js）、Engine（Java）、Launcher（Go）の4つの主要コンポーネントから構成され、Qdrantでベクトル検索、PostgreSQLでメタデータ管理を行います。

#### ディレクトリ構成
```
WrenAI/
├── wren-ai-service/           # Python FastAPI AIサービス
│   ├── src/                  # コアAI処理
│   │   ├── pipelines/       # GenBI処理パイプライン
│   │   ├── providers/       # LLM・DB・ベクトル DB統合
│   │   └── web/             # REST API実装
│   └── eval/                 # AI品質評価システム
├── wren-ui/                   # Next.js フロントエンド
│   ├── src/                  # React コンポーネント・ページ
│   ├── migrations/          # データベース スキーマ
│   └── e2e/                 # エンドツーエンド テスト
├── wren-engine/               # Java クエリエンジン
├── wren-launcher/             # Go ランチャー・オーケストレータ
├── deployment/                # Kubernetes デプロイメント
└── docker/                   # Docker Compose 構成
```

#### 主要コンポーネント
- **AI Service (wren-ai-service)**: 核となるAI処理エンジン
  - 場所: `wren-ai-service/src/`
  - 依存: FastAPI、Haystack、LiteLLM、Qdrant
  - インターフェース: Text-to-SQL、チャート生成、インサイト生成

- **UI (wren-ui)**: 直感的なWebインターフェース
  - 場所: `wren-ui/src/`
  - 依存: Next.js、Apollo GraphQL、Ant Design
  - インターフェース: データモデリング、ダッシュボード、設定管理

- **Engine (wren-engine)**: 高性能クエリ実行エンジン
  - 言語: Java
  - 依存: Trino、Calcite
  - インターフェース: SQLクエリ最適化・実行

### 技術スタック
#### コア技術
- **AI Service**: Python 3.12、FastAPI、Haystack AI
- **Frontend**: Next.js、TypeScript、Apollo GraphQL
- **Backend Engine**: Java、Trino、Apache Calcite
- **主要ライブラリ**: 
  - litellm (v1.75.2): 複数LLMプロバイダー統合
  - haystack-ai (v2.7.0): AI パイプライン フレームワーク
  - qdrant-client (v1.11.0): ベクトル検索

#### 開発・運用ツール
- **コンテナ化**: Docker、Docker Compose、Kubernetes
- **データベース**: PostgreSQL（メタデータ）、Qdrant（ベクトル）
- **監視**: Langfuse（AI オブザーバビリティ）
- **テスト**: Playwright（E2E）、Jest、PyTest

### 設計パターン・手法
- **Microservices Architecture**: 独立デプロイ可能なサービス分離
- **Semantic Layer Pattern**: MDLによる意味的データモデリング
- **RAG Pipeline**: 検索拡張生成によるSQL精度向上
- **Hamilton Framework**: データパイプライン構築・実行

### データフロー・処理フロー
1. **自然言語入力**: ユーザークエリの受信・前処理
2. **意図理解**: セマンティックレイヤーとの照合
3. **SQL生成**: コンテキスト情報を活用したText-to-SQL変換
4. **クエリ実行**: Wren Engineでの最適化・実行
5. **結果可視化**: AI生成チャート・インサイト
6. **フィードバック学習**: ユーザー評価による継続改善

## API・インターフェース
### 公開API
#### GenBI REST API
- 目的: アプリケーション統合・カスタマイゼーション
- 使用例:
```python
# 自然言語クエリ API
POST /v1/ask
{
  "query": "月次売上のトレンドを表示",
  "project_id": "uuid"
}

# SQL生成 API
POST /v1/sql/generate
{
  "question": "部門別売上",
  "context": {...}
}
```

#### GraphQL API
- 目的: フロントエンド・データ管理用統合API
- 使用例:
```graphql
query GetProjectModels($projectId: String!) {
  project(where: {id: $projectId}) {
    models {
      name
      fields {
        name
        type
      }
    }
  }
}
```

### 設定・カスタマイズ
#### 設定ファイル
```yaml
# config.yaml
llm:
  provider: openai
  model: gpt-4-turbo
  api_key: ${OPENAI_API_KEY}

document_store:
  type: qdrant
  host: localhost
  port: 6333

wren_engine:
  endpoint: http://wren-engine:8080
  sql_port: 8081
```

#### 拡張・プラグイン開発
Provider パターンにより、新しいLLMプロバイダーやデータソースの統合が可能。カスタムパイプラインの開発、独自セマンティック関数の追加をサポート。

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- SQL生成速度: 複雑クエリで2-5秒
- クエリ実行: Trinoベースの分散処理により高速化
- 同時接続: FastAPI非同期処理による高い並行性

### スケーラビリティ
Kubernetesネイティブ設計により、各コンポーネントの独立スケーリングが可能。Trinoクラスター、Qdrantクラスター、PostgreSQLレプリケーションによるエンタープライズレベル拡張対応。

### 制限事項
- 複雑なビジネスロジックを含むクエリの精度
- 大規模データセット（TB級）での初期インデックス時間
- LLMプロバイダーのAPI制限とコスト

## 評価・所感
### 技術的評価
#### 強み
- セマンティックレイヤーによる高精度なSQL生成
- 企業レベルのアーキテクチャ設計とスケーラビリティ
- 複数LLMプロバイダー対応による柔軟性
- 包括的なAPIエコシステムとドキュメント
- オープンソースと商用サービスのバランス

#### 改善の余地
- 初期セットアップの複雑さ
- セマンティックレイヤー構築の学習コスト
- 日本語対応の充実化
- よりリッチなチャートライブラリの統合

### 向いている用途
- エンタープライズBIシステムの民主化
- データアナリスト・非技術者向けセルフサービス分析
- アプリケーション組み込み用AI分析機能
- 既存BIツールのAI拡張・代替

### 向いていない用途
- リアルタイムストリーミング分析
- 極めて複雑な統計・機械学習処理
- 超高速レスポンス要求システム
- プライバシー制約が極めて厳しい環境（API依存）

### 総評
WrenAIは、GenBI（Generative Business Intelligence）分野において技術的・商業的両面で非常に高い完成度を誇るプロジェクトです。特にセマンティックレイヤーの採用による高精度なText-to-SQL変換、マイクロサービスアーキテクチャによる拡張性、そして豊富なデータソース対応は、企業レベルでの実用性を十分に証明しています。

技術面では、最新のAI技術（LLM、RAG、ベクトル検索）を適切に組み合わせ、FastAPI、Next.js、Trinoなどの実証済み技術スタックを基盤とした設計は非常に堅実です。また、Cannerのエンタープライズデータプラットフォーム開発経験が活かされており、商用グレードの品質を実現しています。

オープンソース版とクラウドサービスの両立戦略も巧妙で、開発者コミュニティとビジネス持続可能性を両立させている点も評価できます。データ分析の民主化という大きなビジョンに対して、実用的かつスケーラブルなソリューションを提供するWrenAIは、BI業界の未来を形作る重要なプロジェクトとして位置づけられるでしょう。