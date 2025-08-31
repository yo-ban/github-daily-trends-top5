# リポジトリ解析: MODSetter/SurfSense

## 基本情報
- リポジトリ名: MODSetter/SurfSense
- 主要言語: Python
- スター数: 7,401
- フォーク数: 549
- 最終更新: 2025年
- ライセンス: Apache License 2.0
- トピックス: AI Research、RAG、Knowledge Management、NotebookLM Alternative、Perplexity Alternative

## 概要
### 一言で言うと
NotebookLMやPerplexityのオープンソース代替として、個人の知識ベースと外部データソースを統合したカスタマイズ可能なAI研究エージェント。

### 詳細説明
SurfSenseは、NotebookLMやPerplexityなどの商用AI研究ツールの高機能なオープンソース代替品として開発されたプラットフォームです。個人の知識ベースと多様な外部データソース（検索エンジン、Slack、Linear、Jira、ClickUp、Confluence、Notion、YouTube、GitHub、Discordなど）を統合し、総合的な研究・情報収集環境を提供します。

50+種類のファイル形式をサポートし、高度なRAG（Retrieval-Augmented Generation）技術、ハイブリッド検索、階層インデックス、リランカーなどの最新AI技術を組み合わせて、引用付き回答生成、ポッドキャスト作成、プライバシー保護（ローカルLLM対応）などの機能を提供しています。

### 主な特徴
- **Multi-format File Support**: 50+種類のファイル形式対応（PDF、Office文書、動画、画像等）
- **External Integrations**: Slack、GitHub、Notion、YouTube等の豊富な外部サービス連携
- **Advanced RAG**: 100+ LLM、6000+ Embedding Models、主要リランカー対応
- **Hybrid Search**: セマンティック検索 + 全文検索のハイブリッドアプローチ
- **Podcast Generation**: 20秒で3分間のポッドキャスト生成が可能
- **Privacy-focused**: Ollama等のローカルLLM完全対応
- **Self-hostable**: Docker完全対応の自己ホスティング環境
- **Browser Extension**: Chrome拡張機能でのワンクリック保存

## 使用方法
### インストール
#### 前提条件
- Docker & Docker Compose
- Python 3.12以上（ローカル開発時）
- Node.js 18以上（フロントエンド開発時）
- PostgreSQL（pgvector拡張）

#### インストール手順
```bash
# 方法1: Docker Compose（推奨）
git clone https://github.com/MODSetter/SurfSense.git
cd SurfSense
docker-compose up -d

# 方法2: マニュアルセットアップ
# Backend
cd surfsense_backend
uv venv
uv pip install -r pyproject.toml

# Frontend  
cd surfsense_web
pnpm install
```

### 基本的な使い方
#### Hello World相当の例
```bash
# Docker環境での起動
docker-compose up -d

# ブラウザで http://localhost:3000 にアクセス
# 1. アカウント作成
# 2. APIキー設定（OpenAI、Anthropic等）
# 3. Search Spaceの作成
# 4. ドキュメントのアップロード
# 5. AI研究開始
```

#### 実践的な使用例
```python
# Backend API の利用例
# チャット機能
POST /api/chats/
{
  "message": "この論文の要点を教えて",
  "search_space_id": "uuid"
}

# 外部コネクタの追加
POST /api/connectors/
{
  "connector_type": "github",
  "config": {...}
}
```

### 高度な使い方
```yaml
# Docker Compose カスタム設定
# .env ファイルでの環境変数設定
POSTGRES_USER=custom_user
POSTGRES_PASSWORD=secure_password
OPENAI_API_KEY=your_key

# ローカルLLM（Ollama）の利用
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: 包括的なプロジェクト概要と機能紹介
- **DEPLOYMENT_GUIDE.md**: 本格的なデプロイメント手順書
- **DOCKER_SETUP.md**: Docker環境構築ガイド
- **content/docs/**: Next.js製ドキュメントサイト

### サンプル・デモ
- **Video Demo**: GitHub埋め込みデモビデオ
- **Podcast Sample**: AI生成ポッドキャスト実例
- **Browser Extension**: Chrome拡張のデモ機能

### チュートリアル・ガイド
- 詳細なインストールガイド（Docker、マニュアル）
- 各種コネクタ設定チュートリアル
- Discord コミュニティサポート

## 技術的詳細
### アーキテクチャ
#### 全体構造
マイクロサービス指向の3層アーキテクチャを採用。Python（FastAPI）バックエンド、Next.js フロントエンド、Chrome拡張機能から構成され、PostgreSQL（pgvector）でベクトル検索機能を実現しています。

#### ディレクトリ構成
```
SurfSense/
├── surfsense_backend/          # Python FastAPI バックエンド
│   ├── app/                   # アプリケーションコア
│   │   ├── agents/           # AI研究エージェント
│   │   ├── connectors/       # 外部サービス連携
│   │   ├── routes/           # REST API エンドポイント
│   │   ├── services/         # ビジネスロジック
│   │   └── tasks/            # 非同期タスク処理
│   └── alembic/              # データベースマイグレーション
├── surfsense_web/             # Next.js フロントエンド
│   ├── app/                  # App Router ベース
│   ├── components/           # React コンポーネント
│   └── hooks/                # カスタムフック
├── surfsense_browser_extension/ # Chrome拡張機能
└── docker-compose.yml        # コンテナ構成
```

#### 主要コンポーネント
- **Research Agent**: 多段階調査・レポート生成エージェント
  - 場所: `app/agents/researcher/`
  - 依存: LangGraph、LiteLLM
  - インターフェース: 段階的調査実行、ソース統合

- **Podcast Agent**: 高速ポッドキャスト生成システム
  - 場所: `app/agents/podcaster/`
  - 依存: Kokoro TTS、FFmpeg
  - インターフェース: 20秒での音声コンテンツ生成

- **Connector System**: 外部サービス統合フレームワーク
  - 場所: `app/connectors/`
  - 依存: 各種API SDK
  - インターフェース: Slack、GitHub、Notion等との統合

### 技術スタック
#### コア技術
- **Backend**: FastAPI、SQLAlchemy、Alembic、AsyncPG
- **Frontend**: Next.js 14、TypeScript、Tailwind CSS
- **Database**: PostgreSQL + pgvector（ベクトル検索）
- **主要ライブラリ**: 
  - litellm (v1.61.4): 100+ LLM統合
  - langgraph (v0.3.29): エージェント構築
  - sentence-transformers (v3.4.1): 埋め込み生成

#### 開発・運用ツール
- **パッケージ管理**: uv（Python）、pnpm（Node.js）
- **コンテナ**: Docker + Docker Compose
- **コード品質**: Ruff（Python）、Biome（TypeScript）
- **データベース管理**: Alembic migrations、pgAdmin

### 設計パターン・手法
- **Agent-based Architecture**: LangGraphによるマルチエージェントシステム
- **RAG Pipeline**: 階層インデックス + ハイブリッド検索
- **Connector Pattern**: プラグイン式外部サービス統合
- **Event-driven Processing**: 非同期タスク処理による高いスループット

### データフロー・処理フロー
1. **データ収集**: ファイルアップロード・外部コネクタからのデータ取得
2. **前処理**: Docling/Unstructured/LlamaCloudによる多形式解析
3. **インデックス化**: 埋め込み生成・ベクトルDB格納・階層インデックス作成
4. **検索実行**: ハイブリッド検索（セマンティック + 全文）
5. **回答生成**: LLMによる引用付き回答生成
6. **後処理**: リランカーによる結果最適化・ポッドキャスト生成等

## API・インターフェース
### 公開API
#### REST API Backend
- 目的: 全機能のRESTful API提供
- 使用例:
```python
# チャット API
POST /api/chats/
{
  "query": "研究テーマについて教えて",
  "search_space_id": "uuid",
  "chat_type": "qna"
}

# ドキュメント検索
GET /api/documents/search
?query=keyword&search_space_id=uuid
```

#### WebSocket Streaming
- 目的: リアルタイムストリーミング応答
- 使用例:
```javascript
// ストリーミングチャット
const ws = new WebSocket('ws://localhost:8000/api/stream')
ws.send(JSON.stringify({
  query: "質問内容",
  search_space_id: "uuid"
}))
```

### 設定・カスタマイズ
#### 設定ファイル
```yaml
# docker-compose.yml
services:
  db:
    image: ankane/pgvector:latest
    environment:
      - POSTGRES_DB=surfsense
      - POSTGRES_USER=postgres
```

#### 拡張・プラグイン開発
Connectorシステムにより、新しい外部サービスの統合が容易。BaseConnectorクラスを継承してカスタムコネクタを開発可能。

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ポッドキャスト生成: 3分間コンテンツを20秒で生成
- ハイブリッド検索: pgvectorによる高速ベクトル検索
- 非同期処理: FastAPIの非同期アーキテクチャによる高並行性

### スケーラビリティ
Docker Compose構成により、各コンポーネントの独立スケーリングが可能。PostgreSQLクラスタリング、Redis導入、ロードバランサ追加により、エンタープライズレベルの拡張に対応。

### 制限事項
- 大規模ファイル処理時のメモリ使用量
- 外部API依存による応答速度の変動
- ローカルLLM使用時のハードウェアリソース要件

## 評価・所感
### 技術的評価
#### 強み
- 包括的なRAGパイプラインの実装
- 多様な外部サービス統合による高い実用性
- プライバシー重視設計（ローカルLLM対応）
- オープンソースによる透明性と自由度
- 最新AI技術の積極的採用

#### 改善の余地
- 初期セットアップの複雑さ
- 大規模データ処理時のパフォーマンス最適化
- UI/UXの更なる洗練
- エラーハンドリング・ログ機能の強化

### 向いている用途
- 個人・チーム向け知識管理システム
- 研究・調査業務の効率化
- プライバシー重視の組織内情報検索
- NotebookLM/Perplexityの代替ソリューション
- AI技術の学習・実験プラットフォーム

### 向いていない用途
- リアルタイム性が極めて重要なシステム
- 超大規模エンタープライズ環境（要カスタマイズ）
- 高度な専門分野特化機能が必要な用途
- シンプルなチャットボット用途（オーバーエンジニアリング）

### 総評
SurfSenseは、NotebookLMやPerplexityといった商用サービスに匹敵する機能をオープンソースで提供する、非常に価値の高いプロジェクトです。特にRAG技術の実装品質、外部サービスとの豊富な統合、プライバシー保護への配慮は優秀で、個人や組織が自分だけの知識管理システムを構築する上で理想的なソリューションと言えます。

技術的には、最新のAI/ML技術を適切に組み合わせた設計で、FastAPI + Next.js の現代的なスタックを採用している点も評価できます。Docker化による簡単なデプロイメント、ローカルLLM対応によるプライバシー保護、そして活発な開発コミュニティも、このプロジェクトの持続可能性を高める要因です。

一方で、多機能であるがゆえの複雑さや、初期セットアップの難易度などの課題もありますが、それを補って余りある価値を提供するプロジェクトとして、AI研究・知識管理分野において重要な地位を占めていると評価されます。