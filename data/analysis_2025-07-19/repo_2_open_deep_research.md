# リポジトリ解析: langchain-ai/open_deep_research

## 基本情報
- リポジトリ名: langchain-ai/open_deep_research
- 主要言語: Python
- スター数: 5,086
- フォーク数: 723
- 最終更新: 2025-07-16
- ライセンス: MIT License
- トピックス: AIエージェント、深層調査、レポート生成、LangGraph、MCPサポート

## 概要
### 一言で言うと
Open Deep Researchは、詳細なリサーチと包括的なレポート生成を自動化するマルチエージェントシステムで、様々なLLMプロバイダー、検索ツール、MCPサーバーに対応した完全オープンソースのソリューションです。

### 詳細説明
Open Deep Researchは、LangChainチームが開発した深層調査エージェントで、AIエージェントアプリケーションの中でも最も人気のある分野の一つとして巣立っています。LangGraphをベースに構築され、複数の特化されたモデルを使用して調査タスクを実行します。スーパーバイザーが調査計画を立て、複数のリサーチャーエージェントが並列で調査を実施し、最終的に包括的なレポートを生成するというアーキテクチャを採用しています。

### 主な特徴
- シンプルかつ設定可能な完全オープンソースの深層調査エージェント
- 複数のLLMプロバイダーのサポート（OpenAI、Anthropic、Google Vertex AI等）
- 多様な検索APIサポート（Tavily、OpenAIネイティブ、Anthropicネイティブ）
- MCP（Model Context Protocol）サーバーとの統合
- マルチエージェントによる並列処理で高速な調査
- LangGraph Studioでのビジュアルデバッグ・実行
- 調査プロセスの詳細な設定オプション
- ヒューマンインザループ機能（明確化質問）
- バッチ評価システムによる品質検証
- Open Agent Platform (OAP)へのデプロイ対応

## 使用方法
### インストール
#### 前提条件
- Python 3.10以上（推奨: 3.11）
- uv（Pythonパッケージマネージャー）または仮想環境
- 各種モデルプロバイダーのAPIキー
- （オプション）検索APIのキー（Tavily等）

#### インストール手順
```bash
# リポジトリのクローンと仮想環境の活性化
git clone https://github.com/langchain-ai/open_deep_research.git
cd open_deep_research
uv venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 依存関係のインストール
uv pip install -r pyproject.toml

# 環境設定ファイルの作成
cp .env.example .env
# .envファイルを編集してAPIキーを設定
```

### 基本的な使い方
#### Hello World相当の例
```bash
# LangGraphサーバーの起動
uvx --refresh --from "langgraph-cli[inmem]" --with-editable . --python 3.11 langgraph dev --allow-blocking

# 以下のURLでStudio UIにアクセス
# - API: http://127.0.0.1:2024
# - Studio UI: https://smith.langchain.com/studio/?baseUrl=http://127.0.0.1:2024
# - API Docs: http://127.0.0.1:2024/docs
```

#### 実践的な使用例
```python
# LangGraph Studioでの使用例
# messages入力フィールドに質問を入力
"Obesity among young adults in the United States"

# Submitをクリックして調査を開始
# エージェントが以下のステップを実行:
# 1. 必要に応じて明確化質問
# 2. 調査計画の作成
# 3. 複数エージェントによる並列調査
# 4. 包括的レポートの生成
```

### 高度な使い方
```python
# MCPサーバーとの統合例
# .envでMCP設定を追加
"""
MCP_CONFIG='{
  "url": "https://api.arcade.dev/v1/mcps/ms_0ujssxh0cECutqzMgbtXSGnjorm",
  "tools": ["Search_SearchHotels", "Search_SearchOneWayFlights"]
}'
"""

# カスタム設定での使用
# UIまたは環境変数で以下を設定:
# - 同時実行リサーチユニット数: 1-20
# - リサーチャーの反復回数: 1-10
# - ツール呼び出しの最大回数: 1-30
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、クイックスタート、設定オプション
- **src/legacy/legacy.md**: レガシー実装の詳細ドキュメント
- **ブログ**: https://blog.langchain.com/open-deep-research/
- **動画**: https://www.youtube.com/watch?v=agGiWUpxkhg

### サンプル・デモ
- **examples/arxiv.md**: 肥満に関する調査レポートのサンプル
- **examples/inference-market.md**: AI推論市場に関するレポート
- **examples/pubmed.md**: PubMedデータを使用したレポート
- **OAPデモ**: https://oap.langchain.com

### チュートリアル・ガイド
- LangGraph Studioチュートリアル
- 設定カスタマイズガイド
- MCPサーバー統合ガイド
- OpenRouter、Ollama等の特殊設定ガイド

## 技術的詳細
### アーキテクチャ
#### 全体構造
Open Deep Researchは、LangGraphを基盤としたマルチエージェントアーキテクチャを採用しています。スーパーバイザーエージェントが全体の調査計画を管理し、複数のリサーチャーエージェントをコーディネートして並列調査を実施します。状態管理にはLangGraphのStateGraphを使用し、エージェント間の通信はCommandパターンで実現されています。

#### ディレクトリ構成
```
open_deep_research/
├── src/
│   ├── open_deep_research/  # メイン実装
│   │   ├── deep_researcher.py  # メインのエージェントグラフ
│   │   ├── state.py  # 状態管理クラス
│   │   ├── configuration.py  # 設定管理
│   │   ├── prompts.py  # プロンプトテンプレート
│   │   └── utils.py  # ユーティリティ関数
│   ├── legacy/  # レガシー実装（別アプローチ）
│   └── security/
│       └── auth.py  # 認証システム
├── tests/  # テストと評価システム
├── examples/  # サンプルレポート
└── langgraph.json  # LangGraph設定
```

#### 主要コンポーネント
- **Deep Researcher Graph**: メインのエージェントグラフ
  - 場所: `deep_researcher.py`
  - 依存: LangGraph、Stateクラス群、Configuration
  - インターフェース: clarify_with_user、write_research_brief、supervisor、researcher

- **Stateクラス群**: エージェント間の状態管理
  - 場所: `state.py`
  - 依存: Pydantic、LangGraph
  - インターフェース: AgentState、SupervisorState、ResearcherState等

- **Configuration**: 柔軟な設定管理システム
  - 場所: `configuration.py`
  - 依存: Pydantic
  - インターフェース: from_runnable_config、各種設定フィールド

### 技術スタック
#### コア技術
- **言語**: Python 3.10以上（型ヒント、async/await使用）
- **フレームワーク**: LangGraph (エージェントワークフロー管理)
- **主要ライブラリ**: 
  - langgraph (>=0.2.55): エージェントグラフの構築
  - langchain-* (various): LLMプロバイダー統合
  - tavily-python: Web検索API
  - mcp (>=1.9.4): Model Context Protocolサポート
  - pydantic: データモデルとバリデーション

#### 開発・運用ツール
- **ビルドツール**: setuptools、pyproject.tomlベース
- **テスト**: pytest、バッチ評価システム
- **CI/CD**: LangGraph Platformへのデプロイ対応
- **デプロイ**: LangGraph Studio、OAP、Docker対応

### 設計パターン・手法
- **マルチエージェントパターン**: スーパーバイザーとワーカーの階層構造
- **ステートマシンパターン**: LangGraphのStateGraphによる状態管理
- **コマンドパターン**: エージェント間の通信と制御
- **Strategyパターン**: 異なる検索APIやモデルの交換可能性
- **構成可能パターン**: 実行時の動的設定変更

### データフロー・処理フロー
1. ユーザーからの質問受付
2. 必要に応じて明確化質問を生成
3. 調査課題の作成（Research Brief）
4. スーパーバイザーが調査計画を立案
5. 複数のリサーチャーエージェントを生成
6. 各エージェントが並列で調査実施
   - 検索APIの呼び出し
   - MCPツールの使用
   - 結果の要約と圧縮
7. スーパーバイザーが結果を集約、必要に応じて追加調査
8. 最終レポートの生成
9. ユーザーへの結果返却

## API・インターフェース
### 公開API
#### LangGraph API
- 目的: Deep Researchエージェントの実行
- 使用例:
```python
# LangGraph Studio経由での使用
import requests

response = requests.post(
    "http://127.0.0.1:2024/runs",
    json={
        "input": {
            "messages": [{"content": "Research topic...", "type": "human"}]
        },
        "config": {
            "configurable": {
                "max_concurrent_research_units": 10,
                "search_api": "tavily"
            }
        }
    }
)
```

### 設定・カスタマイズ
#### 設定ファイル
```.env
# モデル設定
SUMMARIZATION_MODEL="openai:gpt-4.1-nano"
RESEARCH_MODEL="openai:gpt-4.1"
COMPRESSION_MODEL="openai:gpt-4.1-mini"
FINAL_REPORT_MODEL="openai:gpt-4.1"

# 検索API設定
SEARCH_API="tavily"
TAVILY_API_KEY="your-key"

# MCP設定
MCP_CONFIG='{"url": "...", "tools": [...]}'
```

#### 拡張・プラグイン開発
- カスタム検索APIの追加: utils.pyのget_all_toolsを拡張
- 新しいモデルプロバイダー: init_chat_modelを使用
- MCPサーバーの追加: MCPConfigで設定

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ベンチマーク結果: 同時実行数に応じて調査速度が向上
- 最適化手法: 
  - 複数エージェントの並列実行（最大20ユニット）
  - 異なるモデルの特化使用（要約、圧縮、最終レポート）
  - 検索結果のキャッシュ機能

### スケーラビリティ
- 水平スケール: 同時実行ユニット数の調整で対応
- モデルの選択: 要件に応じて高性能/低コストモデルを選択
- LangGraph Platformへのデプロイでエンタープライズ対応

### 制限事項
- 技術的な制限:
  - モデルの構造化出力サポートが必須
  - 検索APIとモデルの互換性制約
  - レートリミットによる同時実行数の上限
- 運用上の制限:
  - 各種LLMプロバイダーのAPIキーが必要
  - 検索APIの利用コスト

## 評価・所感
### 技術的評価
#### 強み
- 完全オープンソースでカスタマイズ性が高い
- 複数LLMプロバイダーへの対応
- LangGraphを活用した洗練されたマルチエージェント実装
- MCPサポートによる拡張性
- バッチ評価システムによる品質保証
- LangChainチームによる積極的なメンテナンス

#### 改善の余地
- 日本語ドキュメントの不足
- セットアップの複雑さ
- モデル間の互換性制約
- コスト最適化の余地

### 向いている用途
- 深層的な調査タスクの自動化
- 学術研究や市場調査
- 技術ドキュメントの作成
- 情報収集・分析タスク
- カスタムAIエージェントのベース実装

### 向いていない用途
- リアルタイム性が要求されるタスク
- 単純なQ&Aタスク
- コスト意識が厚い用途
- オフライン環境での利用

### 総評
Open Deep Researchは、AIエージェントアプリケーションの中でも特に人気のある「深層調査」分野において、実用的で高機能なソリューションを提供しています。LangGraphをベースにした洗練されたアーキテクチャ、複数のLLMプロバイダーへの対応、MCPサポートなど、最新の技術トレンドを取り入れている点が特徴的です。完全オープンソースであるため、研究者や開発者が独自のニーズに合わせてカスタマイズできる柔軟性も備えています。今後、AIエージェント技術の発展とともに、さらに重要なツールとなることが期待されます。