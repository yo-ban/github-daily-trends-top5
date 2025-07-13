# リポジトリ解析: getzep/graphiti

## 基本情報
- リポジトリ名: getzep/graphiti
- 主要言語: Python
- スター数: 12,733
- フォーク数: 1,086
- 最終更新: 活発に更新中（2025年7月）
- ライセンス: Apache License 2.0
- トピックス: ナレッジグラフ、AIエージェント、メモリレイヤー、時間認識、グラフデータベース、Neo4j、FalkorDB、RAG、リアルタイム更新

## 概要
### 一言で言うと
Graphitiは、AIエージェント向けの時間認識型ナレッジグラフを構築・クエリするためのフレームワークで、動的な環境で動作するAIアプリケーション用に特化し、従来のRAGよりも効率的なリアルタイム更新と時系列クエリを実現します。

### 詳細説明
Graphitiは、Zep Software社が開発したオープンソースのフレームワークで、動的に変化するデータ環境におけるAIエージェントのためのナレッジグラフを構築します。従来のRAG（Retrieval-Augmented Generation）手法とは異なり、ユーザーのインタラクション、構造化・非構造化のエンタープライズデータ、外部情報を継続的に一貫性のあるクエリ可能なグラフに統合します。

本フレームワークは、バッチ処理に依存せずにインクリメンタルなデータ更新、効率的な検索、正確な履歴クエリをサポートし、対話型でコンテキスト認識型のAIアプリケーション開発に適しています。ZepのAIエージェント向けメモリレイヤーの中核を担っており、エージェントメモリの最先端技術として実証されています。

### 主な特徴
- **リアルタイム増分更新**: バッチ再計算なしで新しいデータエピソードを即座に統合
- **バイテンポラルデータモデル**: イベント発生時刻と取り込み時刻を明示的に追跡し、正確なポイントインタイムクエリを実現
- **効率的なハイブリッド検索**: セマンティック埋め込み、キーワード（BM25）、グラフトラバーサルを組み合わせて低レイテンシクエリを実現
- **カスタムエンティティ定義**: Pydanticモデルによる柔軟なオントロジー作成と開発者定義エンティティのサポート
- **スケーラビリティ**: 並列処理によるエンタープライズ環境向けの大規模データセット管理
- **多様なLLM/埋め込みプロバイダー対応**: OpenAI、Anthropic、Google Gemini、Groq、Azure OpenAI、Ollama（ローカル）など
- **複数のグラフデータベース対応**: Neo4j、FalkorDBをサポート
- **MCPサーバー実装**: Model Context Protocol（MCP）に対応し、ClaudeやCursorなどのMCPクライアントとの統合が可能

## 使用方法
### インストール
#### 前提条件
- Python 3.10以上
- Neo4j 5.26 / FalkorDB 1.1.2以上（グラフデータベースバックエンド）
- OpenAI APIキー（デフォルトのLLM推論と埋め込み用）
- オプション: Google Gemini、Anthropic、Groq APIキー（代替LLMプロバイダー用）

#### インストール手順
```bash
# 基本インストール
pip install graphiti-core
# または
uv add graphiti-core

# FalkorDBサポート付きインストール
pip install graphiti-core[falkordb]

# 複数のLLMプロバイダーとFalkorDBサポート
pip install graphiti-core[falkordb,anthropic,google-genai]

# Neo4jの簡単なセットアップ（Neo4j Desktop推奨）
# または、FalkorDBをDockerで起動
docker run -p 6379:6379 -p 3000:3000 -it --rm falkordb/falkordb:latest
```

### 基本的な使い方
#### Hello World相当の例
```python
import asyncio
from graphiti_core import Graphiti
from datetime import datetime, timezone

# Graphitiの初期化
async def main():
    graphiti = Graphiti(
        "bolt://localhost:7687",
        "neo4j",
        "password"
    )
    
    # インデックスと制約の初期化
    await graphiti.initialize_indices_and_constraints()
    
    # エピソードの追加
    episode = await graphiti.add_episode(
        name="Meeting Notes",
        episode_content="Alice discussed the new AI project with Bob. They agreed to use Graphiti for the knowledge graph.",
        created_at=datetime.now(timezone.utc)
    )
    
    # 関係の検索
    results = await graphiti.search_edges(
        query="AI project discussion",
        limit=10
    )
    
    for result in results:
        print(f"Found edge: {result.fact} (Score: {result.score})")
    
    await graphiti.close()

asyncio.run(main())
```

#### 実践的な使用例
```python
from graphiti_core import Graphiti
from graphiti_core.nodes import EpisodeType
from graphiti_core.search.search_config_recipes import EDGE_HYBRID_SEARCH_RRF
import json

# カスタムデータベースドライバーの使用
from graphiti_core.driver.neo4j_driver import Neo4jDriver

# カスタムデータベース名でドライバーを作成
driver = Neo4jDriver(
    uri="bolt://localhost:7687",
    user="neo4j",
    password="password",
    database="my_knowledge_graph"  # カスタムDB名
)

# ドライバーを渡してGraphitiを初期化
graphiti = Graphiti(graph_driver=driver)

# 構造化データ（JSON）のエピソード追加
json_content = {
    "participants": ["Alice", "Bob", "Charlie"],
    "project": "AI Assistant",
    "decisions": [
        "Use Graphiti for memory layer",
        "Implement MCP server for Claude integration"
    ],
    "deadline": "2025-08-01"
}

episode = await graphiti.add_episode(
    name="Project Planning Session",
    episode_content=json.dumps(json_content),
    episode_type=EpisodeType.json,
    group_id="project-alpha"  # グループ化
)

# ハイブリッド検索（セマンティック + キーワード）
results = await graphiti.search_edges(
    query="deadline for AI project",
    num_results=5,
    search_config=EDGE_HYBRID_SEARCH_RRF  # RRF（Reciprocal Rank Fusion）使用
)

# ノード検索（エンティティ検索）
entities = await graphiti.search_nodes(
    query="Alice",
    num_results=3
)
```

### 高度な使い方
```python
# Azure OpenAIとの統合例
from openai import AsyncAzureOpenAI
from graphiti_core import Graphiti
from graphiti_core.llm_client import LLMConfig, OpenAIClient
from graphiti_core.embedder.openai import OpenAIEmbedder, OpenAIEmbedderConfig
from graphiti_core.cross_encoder.openai_reranker_client import OpenAIRerankerClient

# Azure設定
llm_client_azure = AsyncAzureOpenAI(
    api_key="<your-api-key>",
    api_version="<your-api-version>",
    azure_endpoint="<your-llm-endpoint>"
)

embedding_client_azure = AsyncAzureOpenAI(
    api_key="<your-api-key>",
    api_version="<your-api-version>",
    azure_endpoint="<your-embedding-endpoint>"
)

# カスタムLLM設定でGraphiti初期化
graphiti = Graphiti(
    "bolt://localhost:7687",
    "neo4j",
    "password",
    llm_client=OpenAIClient(
        llm_config=LLMConfig(
            small_model="gpt-4.1-nano",
            model="gpt-4.1-mini"
        ),
        client=llm_client_azure
    ),
    embedder=OpenAIEmbedder(
        config=OpenAIEmbedderConfig(
            embedding_model="text-embedding-3-small-deployment"
        ),
        client=embedding_client_azure
    ),
    cross_encoder=OpenAIRerankerClient(
        llm_config=LLMConfig(model="gpt-4.1-nano"),
        client=llm_client_azure
    )
)

# 時間ベースのフィルタリングとグラフトラバーサル
from graphiti_core.search.search_filters import SearchFilters
from datetime import datetime, timedelta

# 過去7日間のデータのみ検索
filters = SearchFilters(
    created_after=datetime.now(timezone.utc) - timedelta(days=7),
    group_ids=["project-alpha", "project-beta"]
)

results = await graphiti.search_edges(
    query="project decisions",
    filters=filters,
    search_config=EDGE_HYBRID_SEARCH_NODE_DISTANCE  # ノード距離による再ランキング
)

# エピソードの削除と無効化
await graphiti.delete_episode(
    episode_uuid="episode-uuid-here",
    invalidate_edges=True  # 関連するエッジも無効化
)
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、インストール手順、基本的な使い方
- **公式ドキュメント**: https://help.getzep.com/graphiti - 包括的なAPIドキュメントとガイド
- **arXivペーパー**: https://arxiv.org/abs/2501.13956 - "Zep: A Temporal Knowledge Graph Architecture for Agent Memory"
- **MCPサーバードキュメント**: mcp_server/README.md - Model Context Protocol統合ガイド
- **サーバーAPI**: server/README.md - FastAPI RESTサービスのドキュメント

### サンプル・デモ
- **examples/quickstart/**: Neo4jとFalkorDBを使用した基本的な使用例
- **examples/ecommerce/**: eコマースデータを使用した実践的な例
- **examples/podcast/**: ポッドキャストトランスクリプトの解析例
- **examples/wizard_of_oz/**: テキスト解析とグラフ構築の例
- **examples/langgraph-agent/**: LangGraphエージェントとの統合例

### チュートリアル・ガイド
- クイックスタートガイド: https://help.getzep.com/graphiti/graphiti/quick-start
- LangGraphエージェント構築ガイド: https://help.getzep.com/graphiti/graphiti/lang-graph-agent
- MCP統合ガイド: MCPサーバーを使用したClaudeやCursorとの連携方法
- Discordコミュニティ: https://discord.com/invite/W8Kw6bsgXQ (#Graphitiチャンネル)

## 技術的詳細
### アーキテクチャ
#### 全体構造
Graphitiは、時間認識型ナレッジグラフを構築するためのレイヤードアーキテクチャを採用しています。コアとなるGraphitiクラスが、グラフデータベースドライバー、LLMクライアント、埋め込みクライアント、クロスエンコーダーを統合し、エピソード（データの単位）をノード（エンティティ）とエッジ（関係）に変換してグラフに格納します。バイテンポラルモデルにより、イベント発生時刻と取り込み時刻の両方を追跡し、時系列クエリを可能にします。

#### ディレクトリ構成
```
graphiti/
├── graphiti_core/           # コアライブラリ
│   ├── __init__.py         # パッケージ初期化
│   ├── graphiti.py         # メインGraphitiクラス
│   ├── nodes.py            # ノード定義（Entity、Episode、Community）
│   ├── edges.py            # エッジ定義（EntityEdge、EpisodicEdge）
│   ├── driver/             # データベースドライバー
│   │   ├── neo4j_driver.py # Neo4jドライバー実装
│   │   └── falkordb_driver.py # FalkorDBドライバー実装
│   ├── llm_client/         # LLMクライアント実装
│   │   ├── openai_client.py
│   │   ├── anthropic_client.py
│   │   ├── gemini_client.py
│   │   └── groq_client.py
│   ├── embedder/           # 埋め込みクライアント
│   │   ├── openai.py
│   │   ├── gemini.py
│   │   └── voyage.py
│   ├── cross_encoder/      # リランキングクライアント
│   ├── search/             # 検索機能
│   ├── prompts/            # LLMプロンプトテンプレート
│   ├── models/             # Pydanticデータモデル
│   ├── utils/              # ユーティリティ関数
│   └── telemetry/          # 使用統計収集
├── server/                  # FastAPI RESTサーバー
├── mcp_server/             # MCPサーバー実装
├── examples/               # 使用例とチュートリアル
└── tests/                  # テストスイート
```

#### 主要コンポーネント
- **Graphitiクラス**: 全体的なオーケストレーション
  - 場所: `graphiti_core/graphiti.py`
  - 依存: GraphDriver、LLMClient、EmbedderClient、CrossEncoderClient
  - インターフェース: `add_episode()`, `search_edges()`, `search_nodes()`, `delete_episode()`

- **GraphDriver**: グラフデータベース抽象化層
  - 場所: `graphiti_core/driver/driver.py`
  - 依存: Neo4j/FalkorDBクライアントライブラリ
  - インターフェース: `create_node()`, `create_edge()`, `search()`, `query()`

- **エピソード処理パイプライン**: データ取り込みと変換
  - 場所: `graphiti_core/utils/bulk_utils.py`
  - 依存: LLMClient（エンティティ抽出）、EmbedderClient（ベクトル化）
  - インターフェース: `extract_nodes_and_edges_bulk()`, `dedupe_nodes_bulk()`

- **検索エンジン**: ハイブリッド検索実装
  - 場所: `graphiti_core/search/search.py`
  - 依存: EmbedderClient、CrossEncoderClient、GraphDriver
  - インターフェース: `search()` with SearchConfig

### 技術スタック
#### コア技術
- **言語**: Python 3.10以上（型ヒント、async/await、Pydanticデータモデル使用）
- **非同期処理**: asyncioベースの非同期アーキテクチャ
- **主要ライブラリ**: 
  - pydantic (>=2.11.5): データモデルとバリデーション
  - neo4j (>=5.26.0): Neo4jグラフデータベースドライバー
  - openai (>=1.91.0): OpenAI API統合
  - tenacity (>=9.0.0): リトライロジック
  - numpy (>=1.0.0): ベクトル演算
  - diskcache (>=5.6.3): キャッシング
  - posthog (>=3.0.0): テレメトリ収集

#### 開発・運用ツール
- **ビルドツール**: 
  - Hatchling: モダンなPythonパッケージビルド
  - pyproject.toml: 依存関係とプロジェクト設定
- **テスト**: 
  - pytest + pytest-asyncio: 非同期テストサポート
  - pytest-xdist: 並列テスト実行
  - 包括的な単体テストと統合テスト
- **コード品質**:
  - Ruff: 高速リンター・フォーマッター
  - Pyright: 型チェック（basic mode）
  - MyPy: GitHub Actionsでの型チェック
- **CI/CD**: 
  - GitHub Actions: リント、単体テスト、型チェックの自動化
  - バッジ表示: ビルドステータスの可視化

### 設計パターン・手法
- **Strategyパターン**: LLMクライアント、埋め込みクライアント、データベースドライバーの切り替え
- **Factoryパターン**: 各種クライアントの初期化（OpenAI、Anthropic、Gemini等）
- **Dependency Injection**: コンストラクタでの依存性注入によるテスタビリティ向上
- **Asyncパターン**: 全面的な非同期処理によるI/O効率化
- **Bulkパターン**: 大量データの効率的な処理（`bulk_utils.py`）
- **Recipeパターン**: 事前定義された検索設定（`search_config_recipes.py`）
- **Temporal Design**: バイテンポラルモデルによる時間管理

### データフロー・処理フロー
1. **エピソード投入**:
   - ユーザーが`add_episode()`でテキストまたはJSON形式のエピソードを投入
   - エピソードにメタデータ（作成時刻、グループID等）を付与

2. **エンティティ・関係抽出**:
   - LLMがエピソード内容からエンティティ（人物、組織、概念等）を抽出
   - エンティティ間の関係（エッジ）を識別し、トリプレット形式で表現
   - 時間情報を保持（valid_from、invalid_from）

3. **重複排除と統合**:
   - 既存グラフとの照合により、同一エンティティを識別
   - 類似ノードの統合、矛盾するエッジの無効化処理
   - DUPLICATE_OF関係による履歴保持

4. **埋め込みとインデックス化**:
   - エンティティ名と要約を埋め込みモデルでベクトル化
   - グラフデータベースにノード・エッジとして保存
   - セマンティック検索用のベクトルインデックス構築

5. **検索とリトリーバル**:
   - ハイブリッド検索（セマンティック＋キーワード＋グラフトラバーサル）
   - クロスエンコーダーによる再ランキング
   - 時間フィルタリングによるポイントインタイムクエリ

6. **コミュニティ形成**（オプション）:
   - 関連エンティティのクラスタリング
   - コミュニティノードの生成と要約

## API・インターフェース
### 公開API
#### Graphitiコアメソッド
- 目的: エピソード管理とグラフ操作の主要インターフェース
- 使用例:
```python
# エピソード追加
result = await graphiti.add_episode(
    name="Episode Name",
    episode_content="Content text or JSON",
    episode_type=EpisodeType.text,  # または EpisodeType.json
    group_id="optional-group-id",
    created_at=datetime.now(timezone.utc)
)

# エッジ（関係）検索
edges = await graphiti.search_edges(
    query="search query",
    num_results=10,
    filters=SearchFilters(group_ids=["group1"]),
    search_config=EDGE_HYBRID_SEARCH_RRF
)

# ノード（エンティティ）検索
nodes = await graphiti.search_nodes(
    query="entity name",
    num_results=5,
    search_config=NODE_HYBRID_SEARCH_RRF
)

# エピソード削除
await graphiti.delete_episode(
    episode_uuid="uuid-string",
    invalidate_edges=True
)
```

#### RESTful API（サーバー実装）
- 目的: HTTPエンドポイント経由でのGraphiti操作
- エンドポイント例:
```bash
# エピソード作成
POST /episodes
Content-Type: application/json
{
  "name": "Meeting Notes",
  "content": "Discussion content...",
  "type": "text"
}

# 検索
GET /search/edges?query=keyword&limit=10
GET /search/nodes?query=entity&limit=5

# エピソード削除
DELETE /episodes/{episode_id}
```

### 設定・カスタマイズ
#### 環境変数設定
```bash
# 必須
export OPENAI_API_KEY=your_api_key

# Neo4j設定（デフォルト値）
export NEO4J_URI=bolt://localhost:7687
export NEO4J_USER=neo4j
export NEO4J_PASSWORD=password

# FalkorDB設定
export FALKORDB_URI=falkor://localhost:6379

# パフォーマンス設定
export USE_PARALLEL_RUNTIME=true  # Neo4j並列処理（Community版では使用不可）

# テレメトリ無効化
export GRAPHITI_TELEMETRY_ENABLED=false
```

#### カスタムLLM/埋め込みプロバイダー
```python
# カスタムプロバイダーの使用例
from graphiti_core.llm_client import LLMConfig
from graphiti_core.llm_client.anthropic_client import AnthropicClient

custom_llm = AnthropicClient(
    config=LLMConfig(
        api_key="your-key",
        model="claude-3-5-sonnet-20241022"
    )
)

graphiti = Graphiti(
    graph_driver=driver,
    llm_client=custom_llm,
    embedder=custom_embedder
)
```

#### 拡張・プラグイン開発
Graphitiは以下の拡張ポイントを提供:

1. **カスタムLLMクライアント**: `LLMClient`基底クラスを継承
2. **カスタム埋め込みクライアント**: `EmbedderClient`インターフェースを実装
3. **カスタムグラフドライバー**: `GraphDriver`抽象クラスを実装
4. **カスタムエンティティタイプ**: Pydanticモデルで定義
5. **検索設定のカスタマイズ**: `SearchConfig`でカスタム検索戦略を定義

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- **クエリレイテンシ**: 通常サブ秒レベル（従来のRAGの数秒〜数十秒と比較）
- **インクリメンタル更新**: リアルタイムでの新規データ統合（バッチ処理不要）
- **並列処理**: `semaphore_gather`による非同期並列処理で大量エピソード処理を効率化
- **キャッシング**: diskcacheによる埋め込みとLLM応答のキャッシュ
- **最適化手法**:
  - バルク処理による効率的なノード・エッジ作成
  - ベクトルインデックスによる高速類似検索
  - グラフ距離計算による効率的な再ランキング
  - Neo4j並列ランタイム（Enterprise版）のサポート

### スケーラビリティ
- **大規模データセット対応**: エンタープライズ環境向けに設計
- **水平スケーリング**: グラフデータベースのクラスタリングサポート
- **エピソードウィンドウ管理**: 関連エピソードの効率的な取得（EPISODE_WINDOW_LEN）
- **非同期アーキテクチャ**: 高い同時実行性とスループット
- **複数グループ管理**: group_idによる論理的なデータ分離

### 制限事項
- **技術的な制限**:
  - 構造化出力をサポートするLLMが推奨（OpenAI、Gemini）
  - 小規模モデルでは出力スキーマエラーが発生する可能性
  - グラフサイズに応じたメモリ要件
  - 埋め込みモデルの次元数による制約
- **運用上の制限**:
  - LLM APIの利用制限とコスト
  - グラフデータベースのライセンス要件（Neo4j Community版の制限等）
  - 初期セットアップの複雑さ（複数コンポーネントの設定）
  - バックアップとリカバリの計画が必要

## 評価・所感
### 技術的評価
#### 強み
- **時間認識型アーキテクチャ**: バイテンポラルモデルによる履歴追跡が独自の強み
- **リアルタイム性**: インクリメンタル更新により、常に最新の知識を反映
- **ハイブリッド検索**: セマンティック、キーワード、グラフベースの統合検索
- **柔軟な統合**: 多様なLLM/埋め込みプロバイダーとデータベースのサポート
- **エンタープライズ対応**: Zepの商用製品で実証済みの信頼性
- **MCPサポート**: 最新のAIツールとの標準的な統合方法を提供
- **活発な開発**: arXiv論文発表、頻繁な更新、コミュニティサポート

#### 改善の余地
- **初期学習曲線**: グラフデータベースとLLMの知識が必要
- **セットアップの複雑さ**: 複数のコンポーネント（DB、LLM、埋め込み）の設定
- **ドキュメント**: 高度な使用例やベストプラクティスの充実が必要
- **コスト**: LLM APIの利用コスト、特に大規模データでの処理
- **デバッグ**: グラフ構造の可視化ツールの不足

### 向いている用途
- **AIエージェントのメモリレイヤー**: 長期記憶と文脈保持が必要なAIアプリ
- **カスタマーサポートボット**: 顧客インタラクションの履歴管理と文脈理解
- **ナレッジマネジメント**: 企業知識の動的な構造化と検索
- **研究・分析ツール**: 時系列データの関係性分析
- **パーソナルアシスタント**: ユーザーの好みや履歴を記憶するAI
- **コンプライアンス・監査**: 時間軸での変更履歴追跡が必要なシステム

### 向いていない用途
- **静的データのみの処理**: 更新頻度が低い場合は過剰
- **シンプルなQ&A**: 単純な検索には複雑すぎる
- **リアルタイム処理**: ミリ秒単位の応答が必要な用途
- **小規模プロジェクト**: セットアップコストが利益を上回る
- **構造化データのみ**: 従来のRDBMSで十分な場合

### 総評
Graphitiは、AIエージェントのメモリレイヤーとして革新的なソリューションを提供する優れたフレームワークです。特に、時間認識型のナレッジグラフという独自のアプローチにより、従来のRAGシステムでは困難だった動的な知識管理とコンテキスト保持を実現しています。

Zepによる商用実装での実証と、arXiv論文での学術的な裏付けもあり、エンタープライズレベルでの採用に適しています。また、MCPサポートにより、ClaudeやCursorなどの最新AIツールとの統合も容易で、将来性も高いと評価できます。

一方で、初期セットアップの複雑さやLLMコストは考慮事項です。しかし、動的な知識管理が必要なAIアプリケーションにとっては、これらのコストを上回る価値を提供します。特に、エージェントの長期記憶、顧客インタラクションの管理、時系列での知識追跡が重要な用途では、Graphitiは最適な選択肢の一つと言えるでしょう。

コミュニティも活発で、継続的な改善が期待できることから、AIメモリシステムの新しいスタンダードとなる可能性を秘めています。