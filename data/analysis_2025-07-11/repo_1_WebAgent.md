# リポジトリ解析: Alibaba-NLP/WebAgent

## 基本情報
- リポジトリ名: Alibaba-NLP/WebAgent
- 主要言語: Python
- スター数: 3,386
- フォーク数: 230
- 最終更新: 2025年7月（最新の更新あり）
- ライセンス: MIT License
- トピックス: Web Agent, Information Seeking, LLM, Autonomous Agent, Deep Research, WebWalker, WebDancer, WebSailor

## 概要
### 一言で言うと
WebAgentは、自律的なWeb情報探索と複雑な推論タスクを実行できる最先端のWebエージェントフレームワークで、AlibabaTongyi Labが開発。WebWalker、WebDancer、WebSailorの3つの革新的なサブプロジェクトを含む。

### 詳細説明
WebAgentは、LLMを活用してWebブラウジング、情報収集、複雑な推論を自動化するための包括的なフレームワーク。従来のRAGシステムでは解決できない、複数ステップの推論と大規模な情報収集が必要なタスクに対応。特に「Level 3」難易度（高い不確実性、非線形な解決パス）のタスクで優れた性能を発揮。学術的にもACL 2025での採択など高い評価を受けている。

### 主な特徴
- **3つの革新的なサブプロジェクト**：WebWalker（ベンチマーク）、WebDancer（自律エージェント）、WebSailor（最先端性能）
- **マルチステップ推論**：複雑なWeb探索と情報収集を自動化
- **最先端の性能**：WebSailor-72BがBrowseComp、GAIA等のベンチマークでSOTA達成
- **革新的な学習手法**：DUPO（Duplicating Sampling Policy Optimization）やDAPO等の新しいRL手法
- **実用的な実装**：Gradio/StreamlitベースのUIとAPIサポート
- **オープンソース**：MITライセンスで商用利用も可能
- **マルチモーダル対応**：テキストだけでなく画像やWebページの視覚的理解も可能

## 使用方法
### インストール
#### 前提条件
- Python 3.12以上
- CUDA対応 GPU（モデル実行時）
- APIキー: Google Search (Serper)、Jina Reader、DashScope
- 十分なメモリ（32Bモデルの場合約40GB以上推奨）

#### インストール手順
```bash
# 方法1: WebDancer/WebSailor用
# 環境セットアップ
conda create -n webdancer python=3.12
conda activate webdancer
pip install -r WebDancer/requirements.txt

# 方法2: WebWalker用
# 依存関係インストール
pip install crawl4ai requests json5 pillow beautifulsoup4 \
           qwen-agent datasets tenacity langchain
```

### 基本的な使い方
#### Hello World相当の例
```python
# WebDancerを使ったシンプルな例
from demos.assistant_qwq_chat import init_dev_search_agent_service

# エージェント初期化
agent = init_dev_search_agent_service(
    name='WebDancer-QwQ-32B',
    port=8004,
    desc='Web search agent',
    tools=['search', 'visit']  # 基本ツール
)

# 質問を実行
messages = [{'role': 'user', 'content': 'Pythonとは何ですか？'}]
for response in agent.run(messages=messages):
    print(response)
```

#### 実践的な使用例
```python
# WebWalkerを使ったマルチステップ探索
from WebWalker.src.agent import WebWalker

# LLM設定
llm_cfg = {
    'model': 'your-model-path',
    'api_key': 'your-api-key',
    'model_server': 'http://127.0.0.1:8002/v1',
    'query': '今年のNobel賞受賞者とその業績を調査して',
    'action_count': 20  # 最大アクション数
}

# エージェント初期化（メモリ機能付き）
agent = WebWalker(
    function_list=['search', 'visit'],
    llm=llm_cfg,
    system_message="Digging through buttons to find quality sources..."
)

# 実行
messages = [Message(role='user', content=llm_cfg['query'])]
for result in agent._run(messages):
    print(result)
```

### 高度な使い方
```python
# WebSailorを使った複雑な推論タスク
from WebSailor.src.react_agent import MultiTurnReactAgent

# 設定と初期化
agent = MultiTurnReactAgent(
    function_list=['search', 'visit'],
    llm={
        'model': 'websailor-72b-model-path',
        'generate_cfg': {
            'temperature': 0.6,
            'top_p': 0.95,
            'max_new_tokens': 8192
        }
    }
)

# SailorFog-QAのような難易度の高いタスク
complex_data = {
    'item': {
        'question': '''
        ある都市には1980年に完成したモニュメントがあり、
        その設計者は同じ年に別の都市で走る赤い車を
        デザインしました。その車のモデル名は？
        ''',
        'answer': 'Model X'
    },
    'rollout_id': 'unique-123'
}

result = agent._run(
    complex_data, 
    model='websailor-72b',
    user_prompt='Let\'s think step by step to solve this problem.'
)

# エージェントの思考プロセスと結果を出力
print(f"Thinking: {result['thinking']}")
print(f"Answer: {result['answer']}")
print(f"Tool calls: {result['tool_calls']}")
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト全体の概要、クイックスタートガイド
- **WebWalker/README.md**: ベンチマークフレームワークとデータセットの詳細
- **WebDancer/readme.md**: 自律エージェントの実装と訓練手法
- **WebSailor/README.md**: 最先端性能の実現方法と評価
- **論文**: [arXiv:2507.02592](https://arxiv.org/abs/2507.02592) (WebSailor), [arXiv:2505.22648](https://arxiv.org/abs/2505.22648) (WebDancer), [arXiv:2501.07572](https://arxiv.org/abs/2501.07572) (WebWalker)

### サンプル・デモ
- **WebDancer/datasets/**: sample_qa.jsonl、sample_traj.jsonl（データ形式の例）
- **WebDancer/demos/assistant_qwq_chat.py**: QwQモデルを使ったチャットインターフェース
- **WebWalker/src/app.py**: StreamlitベースのデモUI
- **WebSailor/dataset/sailorfog-QA.jsonl**: 難易度の高いQAデータセットの例

### チュートリアル・ガイド
- **クイックスタート**: README内のステップバイステップガイド
- **ビデオデモ**: BrowseComp-en/zh、GAIA、日常使用の実例
- **HuggingFaceモデル**: [🤗 WebSailor-3B](https://huggingface.co/Alibaba-NLP/WebSailor-3B)、[🤗 WebDancer-32B](https://huggingface.co/Alibaba-NLP/WebDancer-32B)
- **ModelScope**: 中国向けのモデルホスティング

## 技術的詳細
### アーキテクチャ
#### 全体構造
WebAgentはReAct（Reasoning + Acting）フレームワークをベースに、マルチエージェントアーキテクチャを採用。各エージェントは思考プロセス(think)、ツール実行(tool_call)、結果処理(tool_response)を繰り返しながらタスクを実行。

#### ディレクトリ構成
```
WebAgent/
├── WebWalker/           # ベンチマークフレームワーク
│   ├── src/             # エージェント実装（agent.py, rag_system.py等）
│   ├── assets/          # デモ画像、結果
│   └── requirements.txt
├── WebDancer/           # 自律情報探索エージェント
│   ├── demos/           # デモ実装（assistant_qwq_chat.py）
│   ├── datasets/        # サンプルデータ
│   └── scripts/         # デプロイ・実行スクリプト
├── WebSailor/           # 最先端性能モデル
│   ├── src/             # Reactエージェント実装
│   └── dataset/         # SailorFog-QAデータセット
└── assets/              # プロジェクト全体のリソース
```

#### 主要コンポーネント
- **Search Tool**: バッチWeb検索をサポート、Google Search API経由
  - 場所: `tool_search.py`
  - 依存: Serper API
  - インターフェース: `search(query: list[str])`

- **Visit Tool**: Webページコンテンツ抽出
  - 場所: `tool_visit.py`
  - 依存: Jina Reader API
  - インターフェース: `visit(url: str)`

- **WebWalker Agent**: メモリと批判機能付きエージェント
  - 場所: `WebWalker/src/agent.py`
  - 依存: Qwen-Agent, LangChain
  - インターフェース: `_run(messages)`, `observation_information_extraction()`, `critic_information()`

- **MultiTurnReactAgent**: マルチターン対話対応エージェント
  - 場所: `WebSailor/src/react_agent.py`
  - 依存: Qwen-Agent
  - インターフェース: `_run(data, model, user_prompt)`

### 技術スタック
#### コア技術
- **言語**: Python 3.12以上
- **フレームワーク**: 
  - ReAct (Reasoning + Acting)フレームワーク
  - Qwen-Agents: エージェント基盤
  - LangChain: チェーン処理（WebWalker）
- **主要ライブラリ**: 
  - sglang[all]: 高性能モデルサービング
  - crawl4ai: WebページのMarkdown変換
  - qwen-agent[gui,rag,code_interpreter,mcp]: エージェント機能
  - Gradio/Streamlit: UIフレームワーク

#### 開発・運用ツール
- **モデルサービング**: SGLangを使用した高性能APIサーバー
- **評価フレームワーク**: GPT-4ベースの自動評価
- **ベンチマーク**: GAIA、BrowseComp、WebWalkerQA、SimpleQA等
- **デプロイ**: Dockerコンテナ、ローカルサーバー、APIサービス

### 設計パターン・手法
- **ReActパターン**: Reasoning（思考）とActing（行動）を交互に実行
- **ツール抽象化**: BaseToolクラスを継承した統一インターフェース
- **マルチエージェントアーキテクチャ**: メモリエージェントと批判エージェントの協調
- **スレッドプール**: 並列検索でパフォーマンス向上
- **学習パラダイム**: 4段階訓練（データ構築→軌跡サンプリング→SFT→RL）

### データフロー・処理フロー
```
1. ユーザー質問受付
   ↓
2. エージェント思考（<think>タグ）
   ↓
3. ツール選択・実行（<tool_call>タグ）
   ↓  ↓
   Search  Visit
   ↓  ↓
4. 結果受信（<tool_response>タグ）
   ↓
5. 情報統合・判断
   ↓
6. ループ継続 or 最終回答
```

## API・インターフェース
### 公開API
#### ツールAPI
- **Search Tool**
  - 目的: Web検索（シングル/バッチ対応）
  - 使用例:
```python
@register_tool("search")
class Search(BaseTool):
    parameters = {
        "properties": {
            "query": {
                "type": "array",
                "items": {"type": "string"}
            }
        }
    }
    
    # 使用
    search({"query": ["Pythonとは", "AI最新動向"]})
```

- **Visit Tool**
  - 目的: Webページコンテンツ抽出
  - 使用例:
```python
@register_tool("visit")
class Visit(BaseTool):
    parameters = {
        "properties": {
            "url": {"type": "string"}
        }
    }
    
    # 使用
    visit({"url": "https://example.com/article"})
```

### 設定・カスタマイズ
#### 設定ファイル
```bash
# 環境変数設定
export GOOGLE_SEARCH_KEY="your-serper-api-key"
export JINA_API_KEY="your-jina-api-key"
export DASHSCOPE_API_KEY="your-dashscope-api-key"

# モデル設定
export MODEL_PATH="/path/to/model"
export TEMPERATURE=0.6
export TOP_P=0.95
export MAX_NEW_TOKENS=8192

# システム設定
export MAX_LLM_CALL_PER_RUN=40
export MAX_TOKEN_LENGTH=31744  # 31KB - 500
export MAX_MULTIQUERY_NUM=3
export WEBCONTENT_MAXLENGTH=150000
```

#### 拡張・プラグイン開発
```python
# カスタムツールの作成
from qwen_agent.tools import BaseTool, register_tool

@register_tool("custom_tool")
class CustomTool(BaseTool):
    name = "custom_tool"
    description = "カスタムツールの説明"
    parameters = {
        "type": "object",
        "properties": {
            "param": {"type": "string"}
        }
    }
    
    def call(self, params: str, **kwargs) -> str:
        # カスタム処理
        return "result"
```

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- **ベンチマーク結果**:
  - WebSailor-72B: BrowseComp-en 12.0%, BrowseComp-zh 30.1%, GAIA 55.4%
  - WebDancer-32B: GAIA Pass@3 64.1%, WebWalkerQA Pass@3 62.0%
  - オープンソースSOTA達成、プロプライエタリシステムとのギャップを縮小

- **最適化手法**:
  - スレッドプールによる並列検索（最大3スレッド）
  - トークン長管理（31KBコンテキストウィンドウ）
  - SGLangによる高性能モデルサービング
  - DUPO/DAPOによる効率的な強化学習

### スケーラビリティ
- **モデルサイズ**: 3B、3B、32B、72Bパラメータバージョン対応
- **並列処理**: 複数リクエストの同時処理対応
- **キャッシュ**: 15分間の自動クリーニングキャッシュ
- **APIサービス**: OpenAI互換 APIでの提供可能

### 制限事項
- **技術的な制限**:
  - トークン長制限（31KB）
  - 1回の実行あたり最大40回のLLM呼び出し
  - Webコンテンツ最大150KB

- **運用上の制限**:
  - 外部APIキーが必須（Google Search、Jina Reader）
  - GPUメモリ要求（32Bモデルで40GB以上）
  - 現在は英語・中国語主体

## 評価・所感
### 技術的評価
#### 強み
- **最先端の性能**: オープンソースでSOTA達成、特に難易度の高いタスクで優れた性能
- **完全なフレームワーク**: ベンチマークから実装、デプロイまで一貫したソリューション
- **革新的な学習手法**: DUPO、DAPO等の新しいRL手法でエージェント性能を大幅改善
- **学術的貢献**: ACL 2025採択、複数の論文公開で研究コミュニティに貢献
- **実用的な実装**: UI、API、デモなど即座に使えるコンポーネント

#### 改善の余地
- **メモリ効率**: 大規模モデルのGPUメモリ要求が高い
- **言語対応**: 現在は英語・中国語中心、日本語等他言語への拡張余地
- **API依存**: 外部API（Google Search、Jina）への依存度が高い
- **ドキュメント**: 英語ドキュメント中心、日本語ドキュメントが少ない

### 向いている用途
- **複雑な情報探索タスク**: 複数の情報源から情報を収集・統合が必要なタスク
- **Deep Research**: 学術研究、市場調査等の深い分析が必要な業務
- **自動化ワークフロー**: Webベースの情報収集・処理の自動化
- **Q&Aシステム**: 最新情報を含む質問応答システム
- **競合分析**: 複数のWebサイトから情報を収集して分析

### 向いていない用途
- **リアルタイム処理**: 遅延が許容されないシステム
- **オフライン環境**: インターネット接続が必須
- **軽量アプリケーション**: モバイル等のリソース制約環境
- **単純なFAQ**: 固定情報のみで対応可能なタスク

### 総評
WebAgentは、LLMを活用した自律的Web情報探索の分野で画期的な成果を上げたフレームワーク。特に「Level 3」の複雑なタスクで従来の手法を大きく上回る性能を実現し、オープンソースで商用システムに迫る性能を達成。学術的にも工学的にも価値の高いプロジェクトで、今後のWebエージェント研究の基礎となる可能性が高い。