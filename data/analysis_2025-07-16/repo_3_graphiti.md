# リポジトリ解析: getzep/graphiti

## 基本情報
- リポジトリ名: getzep/graphiti
- 主要言語: Python
- スター数: 13,699
- フォーク数: 1,152
- 最終更新: v0.17.4（2025年以降）
- ライセンス: Apache License 2.0
- トピックス: knowledge-graph, ai-agents, rag, temporal-graph, memory-layer, llm, neo4j, falkordb

## 概要
### 一言で言うと
Graphitiは、AIエージェントが動的環境で動作するための時間認識可能なナレッジグラフを構築・クエリするためのフレームワークで、リアルタイムでのインクリメンタルアップデートと履歴クエリをサポートする。

### 詳細説明
Graphitiは、Zep Softwareが開発した時間認識可能なナレッジグラフフレームワークで、特にAIエージェントのメモリ層として設計されている。従来のRAG（Retrieval-Augmented Generation）アプローチがバッチ処理と静的データに依存しているのに対し、Graphitiはユーザーのインタラクション、構造化・非構造化の企業データ、外部情報を継続的に一貫性のあるクエリ可能なグラフに統合する。完全なグラフ再計算を必要とせず、インクリメンタルなデータ更新、効率的な検索、正確な履歴クエリをサポートする。

### 主な特徴
- **リアルタイムインクリメンタル更新**: バッチ再計算なしで新しいデータエピソードを即座に統合
- **バイテンポラルデータモデル**: イベント発生時間と取り込み時間を明示的に追跡
- **効率的なハイブリッド検索**: セマンティック埋め込み、キーワード（BM25）、グラフトラバーサルを組み合わせ
- **カスタムエンティティ定義**: Pydanticモデルで柔軟なオントロジー作成
- **スケーラビリティ**: 並列処理で大規模データセットを効率的に管理
- **論文公開**: "Zep: A Temporal Knowledge Graph Architecture for Agent Memory" (arXiv:2501.13956)

## 使用方法
### インストール
#### 前提条件
- Python 3.10以上
- Neo4j 5.26 / FalkorDB 1.1.2以上（埋め込みストレージバックエンド）
- OpenAI APIキー（デフォルトのLLM推論と埋め込み用）
- オプション: Google Gemini、Anthropic、Groq APIキー

#### インストール手順
```bash
# 基本インストール
pip install graphiti-core
# または
uv add graphiti-core

# FalkorDBサポート付き
pip install graphiti-core[falkordb]

# LLMプロバイダー付き
pip install graphiti-core[anthropic,groq,google-genai]

# FalkorDBをDockerで起動
docker run -p 6379:6379 -p 3000:3000 -it --rm falkordb/falkordb:latest
```

### 基本的な使い方
#### Hello World相当の例
```python
from graphiti_core import Graphiti
from graphiti_core.nodes import EpisodeType
import asyncio

async def main():
    # Graphitiを初期化
    graphiti = Graphiti("bolt://localhost:7687", "neo4j", "password")
    
    # インデックスと制約を構築
    await graphiti.build_indices_and_constraints()
    
    # エピソードを追加
    episode = await graphiti.add_episode(
        content="Kamala Harris is the Attorney General of California.",
        type=EpisodeType.text,
        description="podcast transcript"
    )
    
    # 関係を検索
    edges = await graphiti.search_edges("Who is the Attorney General?")
    for edge in edges:
        print(f"{edge.source} - {edge.relation} - {edge.target}")

asyncio.run(main())
```

#### 実践的な使用例
```python
# 複数のエピソードをバルク追加
episodes = [
    {
        'content': 'Kamala Harris was the AG from January 3, 2011 – January 3, 2017',
        'type': EpisodeType.text,
        'description': 'timeline data',
    },
    {
        'content': {
            'name': 'Gavin Newsom',
            'position': 'Governor',
            'state': 'California',
            'start_date': '2019-01-07'
        },
        'type': EpisodeType.json,
        'description': 'government database',
    }
]

results = await graphiti.add_episodes(episodes)

# ノード検索とグラフ距離によるリランキング
from graphiti_core.search.search_config_recipes import NODE_HYBRID_SEARCH_RRF

nodes = await graphiti.search(
    query="California political figures",
    config=NODE_HYBRID_SEARCH_RRF,
    limit=10
)
```

### 高度な使い方
```python
# Azure OpenAIとの統合
from openai import AsyncAzureOpenAI
from graphiti_core.llm_client import LLMConfig, OpenAIClient
from graphiti_core.embedder.openai import OpenAIEmbedder, OpenAIEmbedderConfig

llm_client_azure = AsyncAzureOpenAI(
    api_key="<your-api-key>",
    api_version="<your-api-version>",
    azure_endpoint="<your-llm-endpoint>"
)

graphiti = Graphiti(
    "bolt://localhost:7687", "neo4j", "password",
    llm_client=OpenAIClient(
        llm_config=LLMConfig(
            small_model="gpt-4.1-nano",
            model="gpt-4.1-mini",
        ),
        client=llm_client_azure
    ),
    embedder=OpenAIEmbedder(
        config=OpenAIEmbedderConfig(
            embedding_model="text-embedding-3-small-deployment"
        ),
        client=embedding_client_azure
    )
)
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、インストール、使用方法
- **公式ドキュメント**: https://help.getzep.com/graphiti
- **arXiv論文**: "Zep: A Temporal Knowledge Graph Architecture for Agent Memory" (https://arxiv.org/abs/2501.13956)

### サンプル・デモ
- **examples/quickstart/**: Neo4jとFalkorDBのクイックスタート
- **examples/langgraph-agent/**: LangChainのLangGraphとの統合例
- **examples/podcast/**: ポッドキャストトランスクリプトの処理
- **examples/ecommerce/**: Eコマースデータの処理
- **examples/wizard_of_oz/**: テキスト解析の例

### チュートリアル・ガイド
- MCPサーバー実装（Claude、Cursor等との統合）
- REST APIサービス（FastAPIベース）
- LangGraphエージェント構築ガイド

## 技術的詳細
### アーキテクチャ
#### 全体構造
Graphitiは、エピソード（情報の単位）からエンティティと関係を抽出し、時間認識可能なナレッジグラフを構築する。LLMを使用した抽出・重複除去、グラフデータベース（Neo4j/FalkorDB）での保存、ハイブリッド検索の3層構造。

#### ディレクトリ構成
```
graphiti/
├── graphiti_core/       # コアライブラリ
│   ├── llm_client/     # LLMクライアント実装
│   ├── embedder/       # 埋め込みクライアント
│   ├── driver/         # グラフDBドライバー
│   ├── search/         # 検索機能
│   ├── prompts/        # LLMプロンプト
│   ├── cross_encoder/  # リランキング
│   └── utils/          # ユーティリティ
├── mcp_server/          # MCPサーバー実装
├── server/              # REST APIサービス
├── examples/            # 使用例
└── tests/               # テストスイート
```

#### 主要コンポーネント
- **Graphitiクラス**: メインインターフェース
  - 場所: `graphiti_core/graphiti.py`
  - 依存: LLMClient、Embedder、GraphDriver
  - インターフェース: add_episode()、search()、search_edges()

- **ノードタイプ**: EntityNode、EpisodicNode、CommunityNode
  - 場所: `graphiti_core/nodes.py`
  - 機能: グラフ内の異なる情報タイプを表現

- **エッジタイプ**: EntityEdge、EpisodicEdge
  - 場所: `graphiti_core/edges.py`
  - 機能: ノード間の関係を表現

### 技術スタック
#### コア技術
- **言語**: Python 3.10+ (非同期処理、型ヒント使用)
- **フレームワーク**: コア部分はフレームワーク不使用、FastAPI (REST API)
- **主要ライブラリ**: 
  - pydantic (>=2.11.5): データモデル定義
  - neo4j (>=5.26.0): Neo4jドライバー
  - openai (>=1.91.0): LLM/埋め込み
  - tenacity (>=9.0.0): リトライ処理
  - diskcache (>=5.6.3): キャッシュ

#### 開発・運用ツール
- **ビルドツール**: Hatchling、Poetry、uv
- **テスト**: pytest, pytest-asyncio, pytest-xdist
- **CI/CD**: GitHub Actions (リント、型チェック、ユニットテスト)
- **デプロイ**: Docker、PyPIパッケージ

### 設計パターン・手法
- **プラグインアーキテクチャ**: LLM、埋め込み、DBドライバーの差し替え可能
- **バイテンポラルモデリング**: 有効時間とトランザクション時間の明示的管理
- **ハイブリッド検索**: セマンティック、BM25、グラフ距離の組み合わせ
- **エッジの時間的無効化**: 矛盾する情報の自動処理

### データフロー・処理フロー
1. **エピソード取り込み**: テキスト/JSONデータを受け付け
2. **エンティティ抽出**: LLMによるエンティティと関係の抽出
3. **重複除去**: 既存ノード/エッジとの照合と統合
4. **グラフ更新**: Neo4j/FalkorDBへのデータ保存
5. **検索**: ハイブリッド検索とリランキング

## API・インターフェース
### 公開API
#### Graphitiクラスの主要メソッド
- `add_episode()`: 単一エピソードを追加
- `add_episodes()`: 複数エピソードをバルク追加
- `search()`: ノード検索（様々な検索設定可能）
- `search_edges()`: エッジ検索
- `build_indices_and_constraints()`: DB初期化

#### MCPサーバーAPI
```python
# MCPプロトコルで利用可能なツール
- add_episode: エピソード追加
- search_entities: エンティティ検索
- get_related_entities: 関連エンティティ取得
- delete_episode: エピソード削除
```

### 設定・カスタマイズ
#### 環境変数
```bash
# LLM設定
OPENAI_API_KEY=xxx

# データベース設定
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password

# パフォーマンス
USE_PARALLEL_RUNTIME=false

# テレメトリー
GRAPHITI_TELEMETRY_ENABLED=false
```

#### 拡張・カスタマイズ
- カスタムLLMクライアントの実装
- カスタム埋め込みクライアントの実装
- カスタムエンティティタイプの定義（Pydanticモデル）

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- クエリレイテンシ: 通常サブ秒（GraphRAGの数秒〜数十秒に対して）
- 最適化手法:
  - 並列処理（semaphore_gather）
  - ディスクキャッシュ
  - Neo4jのパラレルランタイム（オプション）
  - バルク処理API

### スケーラビリティ
- 大規模データセットに最適化
- インクリメンタル更新による効率的なスケーリング
- グラフDBのスケーラビリティに依存

### 制限事項
- Structured OutputをサポートするLLMが必要（OpenAI、Gemini推奨）
- Neo4j Community Editionではパラレルランタイム不可
- エッジ数が非常に多い場合の検索パフォーマンス

## 評価・所感
### 技術的評価
#### 強み
- 時間認識可能なナレッジグラフの先駆的実装
- リアルタイムインクリメンタル更新の実現
- GraphRAGより高速で柔軟なアプローチ
- 論文での学術的裏付けとState of the Artの実証
- 多様なLLM/DBバックエンドのサポート
- MCPサーバーによるAIアシスタント統合

#### 改善の余地
- テストカバレッジの拡充（ロードマップに記載）
- より多くのグラフDBバックエンドのサポート
- ビジュアライゼーションツールの欠如
- 日本語ドキュメントの不足

### 向いている用途
- AIエージェントのメモリ層
- 動的な企業データの管理と検索
- チャットボットの会話履歴管理
- 知識ベースのリアルタイム更新
- 時系列データの関係性分析

### 向いていない用途
- 静的な文書のみの処理（GraphRAGが適している）
- 単純なベクトル検索のみが必要な場合
- グラフ構造が不要なシンプルなRAG
- 小規模LLMでの利用（Structured Outputが必要）

### 総評
Graphitiは、AIエージェントのメモリ層として革新的なアプローチを提供する時間認識可能なナレッジグラフフレームワークである。特にリアルタイムインクリメンタル更新とバイテンポラルデータモデルによる正確な履歴クエリは、従来のRAGアプローチでは実現が困難だった機能である。Zep社がオープンソース化したことで、AIメモリ以外の用途でも活用が期待される。現在も活発に開発が続けられており、今後の発展が期待されるプロジェクトである。