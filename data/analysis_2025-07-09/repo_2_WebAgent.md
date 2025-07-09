# リポジトリ解析: Alibaba-NLP/WebAgent

## 基本情報
- リポジトリ名: Alibaba-NLP/WebAgent
- 主要言語: Python
- スター数: 2,389
- フォーク数: 165
- 最終更新: 2025年7月ごろ（WebSailorリリース）
- ライセンス: MIT License
- トピックス: Web Agent, Information Seeking, Autonomous Agent, LLM, Web Traversal, Reinforcement Learning

## 概要
### 一言で言うと
アリババのTongyi Labが開発した、情報検索とWebナビゲーションに特化したAIエージェントフレームワーク。

### 詳細説明
WebAgentは、情報検索とWebナビゲーションタスクを自律的に実行できるAIエージェントを構築するための包括的なプロジェクトです。このプロジェクトは3つの主要なコンポーネントから構成されています：

1. **WebSailor**: 超人的な推論能力を持つWebエージェント。非常に複雑で不確実性の高い情報検索タスクを実行可能。
2. **WebDancer**: 自律的情報検索エージェンシー。ReActフレームワークを使用したネイティブエージェント検索推論モデル。
3. **WebWalker**: LLMのWeb横断ベンチマーク。680のクエリと1,373以上のWebページを含むチャレンジングなデータセット。

これらのプロジェクトは、LLMが自律的に情報を検索し、Webをナビゲートし、複雑な質問に答える能力を向上させることを目的としています。

### 主な特徴
- オープンソースの最先端モデル（WebSailor-72Bなど）を提供
- 4段階のトレーニングパラダイム（データ構築、軌跡サンプリング、SFT、RL）
- 新しいデータ合成パイプライン（SailorFog-QA）による高難易度タスクの生成
- DUPO (Duplicating Sampling Policy Optimization) アルゴリズムによる効率的な強化学習
- BrowseComp、GAIA、WebWalkerQAなどのベンチマークでSOTA性能を達成
- Gradioを使用したインタラクティブなデモアプリケーション
- マルチエージェントフレームワークによる効果的なメモリ管理

## 使用方法
### インストール
#### 前提条件
- Python 3.10以上（WebWalker）またはPython 3.12（WebDancer）
- CUDA対応のGPU（モデルのデプロイ用）
- APIキー:
  - Google Search (SerpAPIまたはSerper)
  - Jina API
  - Dashscope API（アリババクラウド）
  - OpenAI API（または互換）

#### インストール手順
```bash
# WebDancerのインストール
cd WebDancer
conda create -n webdancer python=3.12
conda activate webdancer
pip install -r requirements.txt

# WebWalkerのインストール
cd WebWalker
conda create -n webwalker python=3.10
conda activate webwalker
pip install -r requirements.txt
crawl4ai-setup
crawl4ai-doctor  # インストールの確認
```

### 基本的な使い方
#### Hello World相当の例
```python
# WebWalkerの基本的な使用例
from src.agent import WebWalker
from qwen_agent.llm import get_chat_model

# LLM設定
llm_cfg = {
    'model': 'gpt-4',  # またはQwenモデル
    'api_key': 'YOUR_API_KEY',
    'model_server': 'https://api.openai.com/v1'
}

# エージェントの初期化
agent = WebWalker(llm=llm_cfg, function_list=['search', 'visit', 'navigate'])

# クエリを実行
response = agent.run("What is the latest news about AI agents?")
```

#### 実践的な使用例
```python
# WebDancerのデモ実行
# 1. モデルのデプロイ
cd WebDancer/scripts
bash deploy_model.sh /path/to/WebDancer-32B

# 2. 環境変数の設定
export GOOGLE_SEARCH_KEY="your-google-search-key"
export JINA_API_KEY="your-jina-api-key"
export DASHSCOPE_API_KEY="your-dashscope-api-key"

# 3. デモの起動
bash run_demo.sh
```

### 高度な使い方
```python
# WebWalkerのマルチエージェントフレームワークを使用
from src.agent import WebWalker
from src.utils import extract_critical_information

class AdvancedWebAgent(WebWalker):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.memory = []  # 情報管理用メモリ
    
    def observation_information_extraction(self, query, observation):
        """Webページから重要情報を抽出"""
        critical_info = super().observation_information_extraction(query, observation)
        if critical_info:
            self.memory.append(critical_info)
        return critical_info
    
    def critic_information(self, query, memory):
        """7積み上げた情報から答えを生成"""
        return super().critic_information(query, memory)

# 複雑な情報検索タスクの実行
agent = AdvancedWebAgent(llm=llm_cfg)
result = agent.run(
    "Find the conference paper submission deadline for ACL 2025 "
    "and the venue address"
)
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト全体の概要と各コンポーネントの紹介
- **WebWalker/README.md**: WebWalkerベンチマークの詳細
- **WebDancer/readme.md**: WebDancerの技術的詳細
- **WebSailor/README.md**: WebSailorのアーキテクチャとトレーニング方法
- **arXiv論文**: 
  - WebSailor: https://arxiv.org/abs/2507.02592
  - WebDancer: https://arxiv.org/abs/2505.22648
  - WebWalker: https://arxiv.org/abs/2501.07572

### サンプル・デモ
- **WebDancer/datasets/sample_qa.jsonl**: 質問応答データセットのサンプル
- **WebDancer/datasets/sample_traj.jsonl**: 軌跡データのサンプル
- **WebSailor/dataset/sailorfog-QA.jsonl**: SailorFog-QAデータセット
- **オンラインデモ**: 
  - HuggingFace: https://huggingface.co/spaces/callanwu/WebWalker
  - ModelScope: https://www.modelscope.cn/studios/iic/WebWalker/

### チュートリアル・ガイド
- HuggingFace Model: https://huggingface.co/Alibaba-NLP/WebDancer-32B
- HuggingFace Dataset: https://huggingface.co/datasets/callanwu/WebWalkerQA
- HuggingFace Leaderboard: https://huggingface.co/spaces/callanwu/WebWalkerQALeadeboard
- 各README内のQuick Startセクション

## 技術的詳細
### アーキテクチャ
#### 全体構造
WebAgentプロジェクトは、以下の3つの主要コンポーネントから構成されています：

1. **WebSailor**: ポストトレーニング方法論に特化したエージェント
2. **WebDancer**: ReActフレームワークベースのネイティブエージェント
3. **WebWalker**: マルチエージェントフレームワークとベンチマーク

各コンポーネントは独立して動作し、異なる問題に対するアプローチを提供します。

#### ディレクトリ構成
```
WebAgent/
├── WebSailor/        # 超人的推論Webエージェント
│   ├── assets/       # 論文、パフォーマンス画像
│   └── dataset/      # SailorFog-QAデータセット
├── WebDancer/        # 自律情報検索エージェント
│   ├── demos/        # デモアプリケーション
│   │   ├── agents/   # エージェント実装
│   │   ├── llm/      # LLMインターフェース
│   │   └── tools/    # 検索、訪問ツール
│   ├── datasets/     # サンプルデータ
│   └── scripts/      # デプロイ、実行スクリプト
└── WebWalker/        # Web横断ベンチマーク
    ├── src/          # コア実装
    │   ├── agent.py  # WebWalkerエージェント
    │   ├── app.py    # Streamlitデモ
    │   └── rag_system.py # RAGシステム
    └── assets/       # デモ、ベンチマーク結果
```

#### 主要コンポーネント
- **SearchAgent (WebDancer)**: ReActフレームワークを使用した検索エージェント
  - 場所: `WebDancer/demos/agents/search_agent.py`
  - 依存: qwen_agent, 各種ツール
  - インターフェース: `_run()`, `observation_information_extraction()`

- **WebWalkerエージェント**: マルチエージェントWeb横断フレームワーク
  - 場所: `WebWalker/src/agent.py`
  - 依存: OpenAI API, Crawl4AI
  - インターフェース: `observation_information_extraction()`, `critic_information()`

- **ツールシステム**: 検索、訪問、ナビゲーション機能
  - 場所: `WebDancer/demos/tools/`
  - 依存: Google Search API, Jina API
  - インターフェース: ツール呼び出しAPI

### 技術スタック
#### コア技術
- **言語**: Python 3.10-3.12
- **フレームワーク**: 
  - Qwen-Agent: Alibaba製のエージェントフレームワーク
  - SGLang: モデルサービングフレームワーク
  - Gradio: インタラクティブUI
  - Streamlit: Webデモアプリ
- **主要ライブラリ**: 
  - sglang[all]: モデルサービング
  - qwen-agent[gui,rag,code_interpreter,mcp]: エージェント機能
  - crawl4ai: WebページのMarkdown変換
  - OpenAI API: LLMインターフェース

#### 開発・運用ツール
- **ビルドツール**: pip, conda
- **テスト**: 
  - WebWalkerQAベンチマーク（680クエリ）
  - GAIAベンチマーク
  - BrowseComp-en/zhベンチマーク
- **CI/CD**: GitHub Actions（Star History等）
- **デプロイ**: 
  - SGLangを使用したモデルデプロイ
  - HuggingFace/ModelScopeモデルホスティング

### 設計パターン・手法
- **ReActフレームワーク**: 推論と行動を統合したエージェント設計
- **マルチエージェントアーキテクチャ**: 効果的なメモリ管理と情報抽出
- **4段階トレーニングパラダイム**:
  1. ブラウジングデータ構築
  2. 軌跡サンプリング
  3. 教師ありファインチューニング (SFT)
  4. 強化学習 (RL/DUPO)
- **情報抽出パイプライン**: 重要情報の選別的保存
- **グラフサンプリングと情報難読化**: 高難易度タスクの生成

### データフロー・処理フロー
1. **入力処理**: ユーザークエリの受け取り
2. **情報検索ループ**:
   - 検索クエリ生成
   - Web検索API呼び出し
   - ページ訪問と内容抽出
   - 重要情報の選別
3. **情報管理**:
   - メモリへの情報保存
   - 関連情報の統合
4. **答えの生成**:
   - 蓄積情報の評価
   - 最終回答の生成
5. **評価・フィードバック**:
   - GPT-4を使用した答えの評価
   - RLへのフィードバックループ

## API・インターフェース
### 公開API
#### エージェントAPI
- 目的: Webエージェントの実行
- 使用例:
```python
# WebWalker API
agent = WebWalker(
    llm=llm_config,
    function_list=['search', 'visit', 'navigate', 'extract']
)
result = agent.run(query="Find latest AI research papers")

# WebDancer SearchAgent API 
agent = SearchAgent(
    llm=llm_config,
    extra={'reasoning': True, 'max_llm_calls': 20}
)
response = agent._run(messages)
```

#### ツールAPI
- 目的: 検索、Webページ訪問、情報抽出
- 使用例:
```python
# 検索ツール
tool_result = self._call_tool(
    'search', 
    {'query': 'AI agents 2025'}
)

# 訪問ツール
tool_result = self._call_tool(
    'visit',
    {'url': 'https://example.com'}
)
```

### 設定・カスタマイズ
#### 設定ファイル
```bash
# 環境変数設定
export OPEN_AI_API_KEY="your-api-key"
export OPEN_AI_API_BASE_URL="https://api.openai.com/v1"
export DASHSCOPE_API_KEY="your-dashscope-key"
export GOOGLE_SEARCH_KEY="your-search-key"
export JINA_API_KEY="your-jina-key"

# LLM設定
llm_cfg = {
    'model': 'gpt-4',  # またはqwen-maxなど
    'api_key': os.getenv('OPEN_AI_API_KEY'),
    'model_server': os.getenv('OPEN_AI_API_BASE_URL'),
    'generate_cfg': {
        'temperature': 0.7,
        'max_tokens': 2048
    }
}
```

#### 拡張・プラグイン開発
- カスタムツールの追加: BaseToolクラスを継承
- エージェントの拡張: WebWalker/SearchAgentクラスを継承
- 新しい情報抽出ロジックの実装
- カスタムプロンプトテンプレートの作成

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ベンチマーク結果:
  - **WebSailor-72B**: BrowseComp-en 12.0%, BrowseComp-zh 30.1%, GAIA 55.4%
  - **WebDancer-32B**: GAIA Pass@3 64.1%, WebWalkerQA 62.0%
  - **WebWalker**: マルチエージェントが単一エージェントを上回る性能
- 最適化手法:
  - 効率的な軌跡圧縮と再構築
  - DUPOアルゴリズムによる効率的なRL
  - 情報抽出とメモリ管理の最適化
  - 小さいモデルでも高性能（WebSailor-7B > 大規模モデル）

### スケーラビリティ
- マルチエージェントアーキテクチャによる並列処理
- SGLangを使用した効率的なモデルサービング
- メモリ管理による長いコンテキストの処理
- APIベースのスケーラブルなアーキテクチャ

### 制限事項
- 大規模モデルはGPUメモリが必要（32Bモデルで約40GB）
- 外部API依存（検索、Webページ抽出）
- リアルタイム性能はWebページの読み込み速度に依存
- 現在のベンチマークは英語・中国語中心

## 評価・所感
### 技術的評価
#### 強み
- オープンソースで初めてプロプライエタリシステムに匹敵する性能
- 包括的なトレーニングパラダイムと手法論の公開
- 複数のアプローチ（WebSailor、WebDancer、WebWalker）の提供
- データセット、モデル、コードの完全なオープンソース化
- 実用的なデモアプリケーションの提供

#### 改善の余地
- WebSailorのモデルチェックポイントが未公開
- 英語・中国語以外の言語サポート
- より詳細なドキュメントとチュートリアル
- エンドツーエンドのパイプライン自動化

### 向いている用途
- 複雑な情報検索タスクの自動化
- 研究・分析作業の支援
- 複数ソースにまたがる情報収集
- Webベースのカスタマーサポート
- 情報検索エージェントの研究開発

### 向いていない用途
- リアルタイム性が厳しいアプリケーション
- シンプルなQ&A（オーバースペック）
- オフライン環境での使用
- リソース制約の厳しい環境

### 総評
WebAgentプロジェクトは、情報検索とWebナビゲーションに特化したAIエージェントの最先端研究です。アリババのTongyi Labによるこのプロジェクトは、オープンソースモデルがプロプライエタリシステムに匹敵できることを示した点で特に意義深いです。

3つの異なるアプローチ（WebSailor、WebDancer、WebWalker）を提供することで、様々なユースケースや研究目的に対応しています。特に、トレーニングパラダイムや新しいアルゴリズム（DUPO）の提案は、今後のAIエージェント研究に大きな影響を与える可能性があります。研究者や開発者にとって非常に価値のあるリソースです。