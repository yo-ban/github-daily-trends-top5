# リポジトリ解析: langchain-ai/open_deep_research

## 基本情報
- リポジトリ名: langchain-ai/open_deep_research
- 主要言語: Python
- スター数: 5,322
- フォーク数: 752
- 最終更新: 2025年1月（活発に開発中）
- ライセンス: MIT License
- トピックス: AI Research Agent, LangGraph, Multi-Agent System, Research Automation

## 概要
### 一言で言うと
open_deep_researchは、任意のトピックについて自動的に深い調査を行い、包括的なレポートを生成するオープンソースのAIリサーチアシスタントです。

### 詳細説明
LangChainが開発した実験的なプロジェクトで、LangGraphフレームワークを基盤とした複数のAIエージェントが協調して動作します。ユーザーが入力した質問に対して、検索エンジン、学術データベース、Webサイトなどから情報を収集し、信頼性の高い引用元を明記した包括的な研究レポートを作成します。Perplexityのような商用AIリサーチツールと同等の機能を、完全にオープンソースで提供することを目指しています。

### 主な特徴
- マルチエージェントアーキテクチャ（スーパーバイザー、リサーチャー、コンプレッサー、レポートライター）
- 複数の検索APIサポート（Tavily、OpenAI、Anthropic）
- Model Context Protocol (MCP)サポートによる拡張性
- 明確化システム（調査前に質問を明確化）
- 最大20の同時並行リサーチユニット
- 高度な評価フレームワーク（多次元スコアリング）
- タスクごとにモデルを柔軟に設定可能

## 使用方法
### インストール
#### 前提条件
- Python 3.10以上
- 主要な依存関係:
  - LangGraph v0.2.55以上
  - LangChainの各種モデル統合パッケージ
  - uv（Pythonパッケージマネージャー）
- APIキー：
  - OpenAI APIキー（必須）
  - Tavily APIキー（推奨）
  - Anthropic/Google APIキー（オプション）

#### インストール手順
```bash
# リポジトリのクローン
git clone https://github.com/langchain-ai/open_deep_research.git
cd open_deep_research

# 仮想環境の作成
uv venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 依存関係のインストール
uv pip install -r pyproject.toml

# 環境変数の設定
cp .env.example .env
# .envファイルを編集してAPIキーを設定
```

### 基本的な使い方
#### Hello World相当の例（LangGraph Studio経由）
```bash
# LangGraphサーバーの起動
uvx --refresh --from "langgraph-cli[inmem]" --with-editable . \
    --python 3.11 langgraph dev --allow-blocking

# ブラウザで以下にaccess:
# Studio UI: https://smith.langchain.com/studio/?baseUrl=http://127.0.0.1:2024
# API: http://127.0.0.1:2024
# API Docs: http://127.0.0.1:2024/docs

# Studio UIで簡単な質問を入力:
# "量子コンピューティングとは何ですか？"
```

#### 実践的な使用例（プログラマティック）
```python
import asyncio
from open_deep_research.deep_researcher import deep_researcher_builder
from langgraph.checkpoint.memory import MemorySaver
import uuid

async def research_medical_topic():
    # グラフのビルド
    graph = deep_researcher_builder.compile(checkpointer=MemorySaver())
    
    # 基本設定
    config = {
        "configurable": {
            "thread_id": str(uuid.uuid4()),
            # 一般設定
            "max_structured_output_retries": 3,
            "allow_clarification": True,
            "max_concurrent_research_units": 5,
            
            # 検索設定
            "search_api": "tavily",
            "max_researcher_iterations": 3,
            "max_react_tool_calls": 5,
            
            # モデル設定
            "research_model": "openai:gpt-4.1",
            "final_report_model": "openai:gpt-4.1",
        }
    }
    
    # リサーチの実行
    query = "糖尿病性腎症の最新の治療法について詳しく教えてください"
    result = await graph.ainvoke(
        {"messages": [{"role": "user", "content": query}]},
        config
    )
    
    # 結果の取得（最後のメッセージがレポート）
    report = result["messages"][-1]["content"]
    print(report)
    
    return report

# 実行
asyncio.run(research_medical_topic())
```

### 高度な使い方
```python
# MCPサーバーを使用した拡張例
async def advanced_research_with_mcp():
    graph = deep_researcher_builder.compile(checkpointer=MemorySaver())
    
    config = {
        "configurable": {
            "thread_id": str(uuid.uuid4()),
            # パラレルリサーチを最大化
            "max_concurrent_research_units": 20,
            
            # 各タスクに異なるモデルを使用
            "summarization_model": "openai:gpt-4.1-nano",
            "summarization_model_max_tokens": 8192,
            "research_model": "anthropic:claude-3.5-haiku",
            "research_model_max_tokens": 10000,
            "compression_model": "openai:gpt-4.1-mini",
            "compression_model_max_tokens": 8192,
            "final_report_model": "anthropic:claude-3.5-sonnet",
            "final_report_model_max_tokens": 15000,
            
            # MCPサーバー設定
            "mcp_config": {
                "url": "https://api.arcade.dev/v1/mcps/your_server",
                "tools": ["Search_SearchAcademic", "Search_SearchPatents"],
                "auth_required": True
            },
            
            # 検索APIを無効化してMCPのみ使用
            "search_api": "none",
        }
    }
    
    # 複雑な質問で詳細なレポートを作成
    complex_query = """
    過去5年間の量子コンピューティングにおけるエラー訂正技術の進化を分析し、
    特にトポロジカル量子コンピューティングのブレークスルーと
    実用化への課題について詳細に報告してください。
    主要な研究グループとその成果、特許出願状況も含めてください。
    """
    
    result = await graph.ainvoke(
        {"messages": [{"role": "user", "content": complex_query}]},
        config
    )
    
    return result["messages"][-1]["content"]

# 評価システムを使用した品質チェック
import subprocess

def run_evaluation():
    """レポートの品質を評価"""
    # 評価スクリプトの実行
    subprocess.run(["python", "tests/run_evaluate.py"])
    
    # 評価項目:
    # - Groundedness: 情報の根拠の確かさ
    # - Completeness: レポートの完全性
    # - Structure: 構造の質
    # - Relevance: 関連性
    # - Correctness: 正確性
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、セットアップ手順、基本的な使用方法
- **langgraph.json**: LangGraph設定ファイル、各種パラメータの定義
- **APIドキュメント**: http://127.0.0.1:2024/docs （サーバー起動後）

### サンプル・デモ
- **examples/arxiv.md**: 学術研究の例（米国若年層の肥満問題）
- **examples/pubmed.md**: 医学研究の例（糖尿病性腎症の治療）
- **examples/inference-market-gpt45.md**: LLM推論市場の競争分析
- **examples/inference-market.md**: 詳細な市場分析レポート

### チュートリアル・ガイド
- LangGraph Studioの使用方法
- 環境変数の設定ガイド
- 評価システムの使用方法（tests/ディレクトリ）
- MCPサーバー統合ガイド

## 技術的詳細
### アーキテクチャ
#### 全体構造
LangGraphを基盤としたステートベースのマルチエージェントアーキテクチャを採用。各エージェントは特定の役割を持ち、グラフ構造で接続されています。

```
ユーザー入力 → 明確化ノード → リサーチブリーフ作成 → スーパーバイザー
                                                    ↓
最終レポート ← レポート生成 ← リサーチ圧縮 ← 複数のリサーチャー
```

#### ディレクトリ構成
```
open_deep_research/
├── src/
│   └── open_deep_research/
│       ├── __init__.py
│       ├── deep_researcher.py  # メイングラフ定義
│       ├── state.py            # ステート定義
│       ├── nodes/              # 各ノード実装
│       │   ├── clarification.py
│       │   ├── research_brief.py
│       │   ├── supervisor.py
│       │   ├── researcher.py
│       │   ├── compressor.py
│       │   └── report_generator.py
│       ├── tools/              # ツール実装
│       └── utils/              # ユーティリティ
├── examples/         # 実例レポート
├── tests/            # 評価システム
├── langgraph.json    # LangGraph設定
└── pyproject.toml    # プロジェクト設定
```

#### 主要コンポーネント
- **Clarification Node**: ユーザー質問の明確化
  - 場所: `nodes/clarification.py`
  - 役割: 曖昧な質問を明確化し、調査範囲を特定
  - オプション設定で無効化可能

- **Research Brief Writer**: リサーチブリーフ作成
  - 場所: `nodes/research_brief.py`
  - 役割: ユーザー入力を詳細な研究質問に変換
  - 複数の研究観点を生成

- **Research Supervisor**: リサーチ管理
  - 場所: `nodes/supervisor.py`
  - 役割: 複数のリサーチャーをオーケストレーション
  - Map-Reduceパターンで並列実行

- **Researcher Agents**: 実際の調査実行
  - 場所: `nodes/researcher.py`
  - 役割: ツールを使用して情報収集
  - ReActパターンで動作

- **Research Compressor**: 情報圧縮
  - 場所: `nodes/compressor.py`
  - 役割: 複数のリサーチャーからの情報を統合

- **Final Report Generator**: 最終レポート作成
  - 場所: `nodes/report_generator.py`
  - 役割: 包括的なMarkdownレポートを生成

### 技術スタック
#### コア技術
- **言語**: Python 3.10+（型ヒント、async/awaitを活用）
- **フレームワーク**: 
  - LangGraph v0.2.55+（グラフベースエージェントフレームワーク）
  - LangChain（LLMオーケストレーション）

- **主要ライブラリ**: 
  - langchain-openai: OpenAIモデル統合
  - langchain-anthropic: Anthropicモデル統合
  - langchain-google-vertexai: Googleモデル統合
  - PyMuPDF: PDF解析
  - BeautifulSoup4: HTMLパーシング
  - markdownify: HTML→Markdown変換
  - rich: ターミナルUI

#### 開発・運用ツール
- **パッケージ管理**: uv（高速Pythonパッケージマネージャー）
- **テスト**: バッチ評価システム（多次元評価）
- **トレーシング**: LangSmith統合
- **デプロイ**: 
  - LangGraph Studio（ローカル開発）
  - LangGraph Platform（ホスティング）
  - Open Agent Platform（ノーコードUI）

### 設計パターン・手法
- **ステートマシン**: LangGraphのグラフ構造で状態管理
- **Map-Reduce**: スーパーバイザーが複数リサーチャーを並列実行し結果を統合
- **ReAct**: リサーチャーがReasoningとActionを交互に実行
- **ストラテジーパターン**: タスクごとに異なるモデルを使用
- **チェックポイントパターン**: 各ノード実行後に状態を保存

### データフロー・処理フロー
1. **ユーザー入力受付**
   - 質問をAgentStateのmessagesに格納

2. **明確化フェーズ** (オプション)
   - 曖昧な質問に対して追加質問を生成
   - ユーザー応答を受けて次のステップへ

3. **リサーチブリーフ作成**
   - 質問を詳細な研究質問に分解
   - 複数の観点を含むブリーフを生成

4. **並列リサーチ実行**
   - スーパーバイザーが複数のリサーチャーを生成
   - 各リサーチャーがツールを使用して調査
   - 最大max_concurrent_research_unitsまで並列実行

5. **情報圧縮**
   - 各リサーチャーからの結果を受け取り
   - 重複を除去し重要情報を抽出

6. **最終レポート生成**
   - 圧縮された情報を基に包括的レポート作成
   - Markdown形式で出力、引用元を明記

## API・インターフェース
### 公開API
#### RESTful API
- 目的: プログラマティックなリサーチ実行
- 使用例:
```python
import httpx
import asyncio

async def call_research_api():
    async with httpx.AsyncClient() as client:
        # リサーチの開始
        response = await client.post(
            "http://127.0.0.1:2024/runs/stream",
            json={
                "assistant_id": "open_deep_research",
                "input": {
                    "messages": [{
                        "role": "user",
                        "content": "量子コンピューティングの最新動向"
                    }]
                },
                "config": {
                    "configurable": {
                        "search_api": "tavily",
                        "max_concurrent_research_units": 10
                    }
                },
                "stream_mode": "messages"
            }
        )
        
        # ストリーミングレスポンスの処理
        async for line in response.aiter_lines():
            if line.startswith("data: "):
                print(line[6:])  # JSONデータ

asyncio.run(call_research_api())
```

### 設定・カスタマイズ
#### 設定ファイル
```json
// langgraph.jsonの主要設定
{
  "configuration_schema": {
    // 一般設定
    "max_structured_output_retries": {
      "type": "integer",
      "minimum": 1,
      "maximum": 10,
      "default": 3
    },
    "allow_clarification": {
      "type": "boolean",
      "default": true
    },
    
    // 検索設定
    "search_api": {
      "type": "string",
      "enum": ["tavily", "openai", "anthropic", "none"],
      "default": "tavily"
    },
    
    // モデル設定
    "research_model": {
      "type": "string",
      "default": "openai:gpt-4.1"
    }
  }
}
```

#### 拡張・カスタマイズ
- **MCPサーバー統合**: カスタムツールをMCP経由で追加
- **カスタムツール**: tools/ディレクトリに新規ツールを実装
- **ノード拡張**: nodes/ディレクトリに新規ノードを追加
- **評価メトリクスカスタマイズ**: tests/evaluators.pyを編集

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- レスポンス時間: シンプルな質問で2-3分、複雑な質問で5-10分
- 並列化効果: max_concurrent_research_unitsを増やすことで約N倍高速化
- 最適化手法:
  - タスク別モデル選択（要約は軽量モデル、分析は高性能モデル）
  - ストリーミング出力で逐次結果表示
  - チェックポイントによる中断・再開可能

### スケーラビリティ
- 水平スケーリング: 最大20の並列リサーチユニット
- APIレート制限対応: 各APIプロバイダーの制限に準拠
- メモリ使用量: ステートサイズに依存（通常1-2GB）
- 複数スレッド対応: 異なるthread_idで同時実行可能

### 制限事項
- APIキーが必須（最低OpenAIまたはAnthropic）
- 検索APIとモデルの互換性（例：OpenAIネイティブ検索は特定モデルのみ）
- トークン制限（各モデルのmax_tokens設定に依存）
- 現在は英語と日本語が主要対応言語

## 評価・所感
### 技術的評価
#### 強み
- 完全オープンソースでカスタマイズ可能
- 複数のモデルプロバイダーと検索ツールを柔軟に切り替え可能
- 高度な並列化による高速処理
- 組み込みの評価システムで品質保証
- MCPサポートによる拡張性
- LangGraphの強力なステート管理とチェックポイント機能

#### 改善の余地
- セットアップがやや複雑（環境変数、APIキーの設定が必須）
- ドキュメントがまだ少ない
- コストが高くなる可能性（複数のLLM呼び出し）
- ローカルモデルのサポートが限定的

### 向いている用途
- 学術研究や市場調査などの深いリサーチが必要なタスク
- 複数の情報源から包括的なレポートを作成したい場合
- 引用元を明確にした信頼性の高いレポートが必要な場合
- 研究開発チームでの情報収集・分析業務
- 企業の競争分析や技術調査

### 向いていない用途
- リアルタイムな応答が必要なチャットボット
- シンプルな質問応答のみが必要な場合
- コストを極力抑えたい用途
- オフライン環境での使用（Web検索が必須）

### 総評
open_deep_researchは、商用AIリサーチツールに匹敵する機能をオープンソースで実現した野心的なプロジェクトです。LangGraphの強力なグラフ構造とマルチエージェントアーキテクチャにより、複雑なリサーチタスクを効率的に処理できます。特に、複数のモデルプロバイダーや検索ツールを柔軟に組み合わせられる点が大きな強みです。現在は実験的なプロジェクトですが、活発な開発が続いており、今後の発展が期待されます。