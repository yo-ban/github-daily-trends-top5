# リポジトリ解析: langchain-ai/open_deep_research

## 基本情報
- リポジトリ名: langchain-ai/open_deep_research
- 主要言語: Python
- スター数: 5,917
- フォーク数: 804
- 最終更新: 2025年（アクティブに開発中）
- ライセンス: MIT License
- トピックス: AI研究アシスタント、LangGraph、自動レポート生成、MCP統合、マルチエージェントシステム

## 概要
### 一言で言うと
LangChainが開発する完全オープンソースのAI研究アシスタントで、複数のAIモデルを活用して任意のトピックについて深い研究を行い、包括的なレポートを自動生成するシステム。

### 詳細説明
Open Deep Researchは、ディープリサーチを自動化し、包括的なレポートを生成する実験的なオープンソースプロジェクトです。複数のモデルプロバイダー、検索ツール、MCPサーバーと連携し、設定可能な研究プロセスを提供します。

このプロジェクトは、AIエージェントアプリケーションの中でも特に人気の高い「ディープリサーチ」分野に焦点を当てており、研究の計画立案、情報収集、分析、レポート作成までの全プロセスを自動化します。LangGraphを基盤として構築され、ワークフロー実装とマルチエージェント実装の2つのアプローチを提供しています。

### 主な特徴
- 複数のAIモデル対応（OpenAI、Anthropic、Google、DeepSeekなど）
- 多様な検索API統合（Tavily、OpenAI/Anthropic ネイティブ検索）
- MCPサーバー対応（ローカル/リモート）
- 並列研究処理（最大20の研究ユニットを同時実行）
- カスタマイズ可能な研究プロセス
- LangGraph Studio統合
- 包括的な評価システム
- ワークフロー実装とマルチエージェント実装の2つのアプローチ

## 使用方法
### インストール
#### 前提条件
- Python 3.10以上（推奨: 3.11）
- UV パッケージマネージャー（推奨）またはpip
- 対応するAIモデルのAPIキー（OpenAI、Anthropic等）
- 検索APIキー（Tavily推奨）

#### インストール手順
```bash
# 方法1: UV経由でのクイックスタート（推奨）
git clone https://github.com/langchain-ai/open_deep_research.git
cd open_deep_research
uv venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
uv pip install -r pyproject.toml

# 環境変数の設定
cp .env.example .env
# .envファイルを編集してAPIキーを設定

# LangGraphサーバーの起動
uvx --refresh --from "langgraph-cli[inmem]" --with-editable . --python 3.11 langgraph dev --allow-blocking
```

### 基本的な使い方
#### Hello World相当の例
```python
# LangGraph Studioで以下のメッセージを入力
"肥満の若者に関する研究レポートを作成してください"

# システムが自動的に：
# 1. 研究テーマの明確化
# 2. 情報収集と分析
# 3. レポート生成
```

#### 実践的な使用例
```python
# 設定のカスタマイズ例
{
  "search_api": "tavily",
  "max_researcher_iterations": 3,
  "max_concurrent_research_units": 5,
  "research_model": "openai:gpt-4o",
  "final_report_model": "openai:gpt-4o"
}

# 研究リクエストの例
"AIインファレンス市場における新興企業（Fireworks.ai、Together.ai、Groq）の
競争力分析レポートを作成してください。技術的優位性、価格戦略、
市場シェアの観点から詳細に分析してください。"
```

### 高度な使い方
```python
# MCPサーバーの設定例
{
  "mcp_servers": [
    {
      "url": "https://api.arcade.dev/v1/mcps/ms_0ujssxh0cECutqzMgbtXSGnjorm",
      "tools": ["Search_SearchHotels", "Search_SearchOneWayFlights"],
      "auth_required": false
    }
  ],
  "allow_clarification": true,
  "max_structured_output_retries": 5
}

# カスタム評価の実行
python tests/run_evaluate.py
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、クイックスタート、設定オプション
- **src/legacy/legacy.md**: レガシー実装（ワークフロー/マルチエージェント）の詳細ドキュメント
- **ブログ記事**: https://blog.langchain.com/open-deep-research/
- **紹介動画**: https://www.youtube.com/watch?v=agGiWUpxkhg

### サンプル・デモ
- **examples/arxiv.md**: 学術論文を基にした肥満研究レポートの実例
- **examples/inference-market.md**: AI推論市場の競争分析レポート例
- **examples/pubmed.md**: 医学文献を使用した研究例
- **examples/inference-market-gpt45.md**: GPT-4.5を使用した市場分析例

### チュートリアル・ガイド
- LangGraph Studioでの実行方法
- Open Agent Platform (OAP)での展開ガイド
- カスタムMCPサーバーの統合方法
- 評価システムの使用方法

## 技術的詳細
### アーキテクチャ
#### 全体構造
Open Deep Researchは、LangGraphを基盤としたマルチエージェントアーキテクチャを採用しています。システムは以下の主要コンポーネントで構成されます：

1. **Research Supervisor**: 研究全体を管理し、サブエージェントに研究タスクを割り当てる
2. **Researcher Agents**: 並列で動作し、特定のトピックについて深い研究を実施
3. **Compression Agent**: 各研究者の結果を要約・圧縮
4. **Final Report Generator**: 収集された情報から包括的なレポートを生成

#### ディレクトリ構成
```
open_deep_research/
├── src/
│   ├── open_deep_research/   # メイン実装
│   │   ├── deep_researcher.py # エージェントグラフの定義
│   │   ├── configuration.py   # 設定管理
│   │   ├── state.py          # 状態定義
│   │   ├── prompts.py        # プロンプトテンプレート
│   │   └── utils.py          # ユーティリティ関数
│   ├── legacy/               # レガシー実装（ワークフロー/マルチエージェント）
│   └── security/             # 認証・セキュリティ
├── examples/                 # 実例レポート
├── tests/                    # 評価システム
└── langgraph.json           # LangGraph設定
```

#### 主要コンポーネント
- **deep_researcher.py**: メインのエージェントグラフ定義
  - 場所: `src/open_deep_research/deep_researcher.py`
  - 依存: LangGraph、LangChain
  - インターフェース: clarify_with_user、write_research_brief、supervisor、researcher

- **configuration.py**: 設定管理システム
  - 場所: `src/open_deep_research/configuration.py`
  - 依存: Pydantic
  - インターフェース: Configuration、MCPConfig、SearchAPI

- **state.py**: 状態管理
  - 場所: `src/open_deep_research/state.py`
  - 依存: LangGraph
  - インターフェース: AgentState、SupervisorState、ResearcherState

### 技術スタック
#### コア技術
- **言語**: Python 3.10+ (推奨3.11)
- **フレームワーク**: LangGraph (>=0.2.55) - エージェントオーケストレーション
- **主要ライブラリ**: 
  - langchain-community (>=0.3.9): コミュニティツール統合
  - langchain-openai (>=0.3.7): OpenAI統合
  - langchain-anthropic (>=0.3.15): Anthropic統合
  - langchain-mcp-adapters (>=0.1.6): MCP統合
  - tavily-python (>=0.5.0): 検索API
  - pydantic: データバリデーション
  - asyncio: 非同期処理

#### 開発・運用ツール
- **ビルドツール**: UV/setuptools - 高速な依存関係管理
- **テスト**: pytest、カスタム評価システム
- **CI/CD**: GitHub Actions（推測）
- **デプロイ**: LangGraph Platform、Open Agent Platform対応

### 設計パターン・手法
- **エージェントパターン**: Supervisor-Worker アーキテクチャ
- **状態管理**: Reducer パターンによる状態更新
- **構造化出力**: Pydanticモデルによる型安全な出力
- **リトライ機構**: 構造化出力の失敗時の自動リトライ
- **並列処理**: 最大20の研究ユニットの同時実行

### データフロー・処理フロー
1. **入力処理**: ユーザーからの研究リクエスト受信
2. **明確化フェーズ**: 必要に応じて質問を通じてスコープを明確化
3. **研究計画立案**: Research Supervisorが研究ブリーフを作成
4. **並列研究実行**: 複数のResearcher Agentが同時に情報収集
5. **情報圧縮**: 各研究結果を要約・圧縮
6. **レポート生成**: 最終的な包括的レポートの作成
7. **出力**: Markdown形式でのレポート提供

## API・インターフェース
### 公開API
#### LangGraph Server API
- 目的: 研究リクエストの送信とレポート生成
- エンドポイント: http://127.0.0.1:2024
- 使用例:
```python
# メッセージ送信
{
  "messages": [{
    "role": "user",
    "content": "AI推論市場の競争分析を行ってください"
  }]
}
```

### 設定・カスタマイズ
#### 設定ファイル
```env
# .env ファイルの設定例
OPENAI_API_KEY=your-api-key
ANTHROPIC_API_KEY=your-api-key
TAVILY_API_KEY=your-api-key

# モデル設定
RESEARCH_MODEL=openai:gpt-4o
SUMMARIZATION_MODEL=openai:gpt-4o-mini
COMPRESSION_MODEL=openai:gpt-4o-mini
FINAL_REPORT_MODEL=openai:gpt-4o

# 研究設定
MAX_RESEARCHER_ITERATIONS=3
MAX_CONCURRENT_RESEARCH_UNITS=5
SEARCH_API=tavily
```

#### 拡張・プラグイン開発
- **カスタムツール追加**: utils.pyのget_all_tools関数を拡張
- **新しい検索API統合**: SearchAPI enumに追加し、対応する実装を追加
- **MCPサーバー統合**: MCPConfig経由でカスタムサーバーを設定
- **プロンプトカスタマイズ**: prompts.pyのテンプレートを修正

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- 並列処理能力: 最大20の研究ユニットを同時実行
- トークン処理: 1日あたり数百万トークンの処理が可能
- レポート生成時間: トピックの複雑さにより5-30分程度
- 最適化手法:
  - 非同期処理による効率化
  - トークン制限管理による安定性確保
  - 構造化出力のリトライメカニズム

### スケーラビリティ
- 水平スケーリング: 複数のワーカーインスタンスで対応
- APIレート制限: 並列度の調整により対応
- メモリ管理: ストリーミング処理とバッファ管理
- キャッシング: 研究結果の効率的な再利用

### 制限事項
- モデル依存: 構造化出力とツール呼び出しをサポートするモデルが必要
- APIレート制限: 高並列度設定時にプロバイダーの制限に到達する可能性
- コスト: 大規模な研究では相当量のAPIトークンを消費
- 言語サポート: 主に英語での研究に最適化

## 評価・所感
### 技術的評価
#### 強み
- 完全オープンソースでカスタマイズ可能
- 複数のAIモデル・検索APIに対応した柔軟なアーキテクチャ
- LangGraphによる堅牢なエージェントオーケストレーション
- 並列処理による高速な研究実行
- 包括的な評価システムによる品質保証
- 実用的なサンプルとドキュメントの充実

#### 改善の余地
- 日本語などの非英語言語への対応強化
- ローカルモデルのサポート拡充（Ollamaは実験的）
- コスト最適化機能の追加
- 研究結果のバージョン管理機能

### 向いている用途
- 市場調査・競合分析レポートの作成
- 学術研究のサーベイ論文作成支援
- 技術トレンドの包括的な分析
- 新規事業企画のための情報収集
- 投資判断のためのデューデリジェンス

### 向いていない用途
- リアルタイムの情報が必要な用途
- 極めて専門的で狭い分野の深い研究
- 法的拘束力のある文書作成
- 個人情報を含む研究

### 総評
Open Deep Researchは、AIエージェントによる自動研究という新しい分野を開拓する野心的なプロジェクトです。LangChainのエコシステムを活用し、実用的なレベルの研究レポート生成を実現しています。特に並列処理による高速化と、複数のモデル・APIへの対応による柔軟性が印象的です。完全オープンソースであることから、企業での採用も進みやすく、今後の発展が期待されます。