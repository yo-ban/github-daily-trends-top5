# リポジトリ解析: snap-stanford/Biomni

## 基本情報
- リポジトリ名: snap-stanford/Biomni
- 主要言語: Python
- スター数: 1,526
- フォーク数: 166
- 最終更新: 2025年4月15日（リリース凍結日）
- ライセンス: Apache License 2.0
- トピックス: 生物医学AI、研究エージェント、バイオインフォマティクス、大規模言語モデル、自動化研究

## 概要
### 一言で言うと
Biomniは、大規模言語モデル（LLM）の推論能力と検索拡張計画、コードベースの実行を統合し、多様な生物医学研究タスクを自律的に実行できる汎用的な生物医学AIエージェントです。

### 詳細説明
Biomniは、Stanford大学のSNAPグループが開発した生物医学研究のためのAIエージェントシステムです。研究者が日常的に行う複雑な生物医学的タスクを自然言語の指示だけで実行できるように設計されています。

このシステムは、最先端のLLMを活用して研究計画を立案し、専門的なツールと大規模なデータレイクを組み合わせて、CRISPR スクリーニング設計、単一細胞RNA-seq解析、ADMET予測、タンパク質構造解析など、幅広い研究タスクを実行できます。

### 主な特徴
- **自然言語インターフェース**: 研究者は専門用語を使った自然な指示でタスクを実行可能
- **包括的なツールセット**: 18の主要カテゴリーにわたる生物医学ツール群を統合
- **大規模データレイク**: 約11GBの生物医学データベースとリソースを内蔵
- **自律的実行**: 複雑なタスクを分解し、適切なツールを選択して実行
- **オープンソース**: Apache 2.0ライセンスで公開され、コミュニティによる拡張が可能
- **Web UIとAPI**: ブラウザベースのUIとPython APIの両方で利用可能

## 使用方法
### インストール
#### 前提条件
- Python 3.11以上
- Conda（環境管理用）
- 30GB以上のディスク容量（フル環境の場合）
- Ubuntu 22.04（フル環境でテスト済み）

#### インストール手順
```bash
# 方法1: 基本環境のインストール（軽量版）
git clone https://github.com/snap-stanford/Biomni.git
cd Biomni/biomni_env
conda env create -f environment.yml
conda activate biomni_e1
pip install biomni --upgrade

# 方法2: フル環境のインストール（E1環境、10時間以上かかる場合あり）
git clone https://github.com/snap-stanford/Biomni.git
cd Biomni/biomni_env
bash setup.sh  # 対話的にコンポーネントを選択
conda activate biomni_e1
pip install biomni --upgrade
```

環境変数の設定（~/.bashrcに追加）:
```bash
export ANTHROPIC_API_KEY="YOUR_API_KEY"
export OPENAI_API_KEY="YOUR_API_KEY"  # オプション（Claudeのみ使用する場合は不要）
```

### 基本的な使い方
#### Hello World相当の例
```python
from biomni.agent import A1

# エージェントの初期化（初回実行時にデータレイクが自動ダウンロードされる）
agent = A1(path='./data', llm='claude-sonnet-4-20250514')

# シンプルなタスクの実行
agent.go("Predict ADMET properties for aspirin (CC(=O)OC1=CC=CC=C1C(=O)O)")
```

#### 実践的な使用例
```python
from biomni.agent import A1

agent = A1(path='./data', llm='claude-sonnet-4-20250514')

# T細胞疲弊を調節する遺伝子を特定するCRISPRスクリーン設計
result = agent.go("""
Plan a CRISPR screen to identify genes that regulate T cell exhaustion,
measured by the change in T cell receptor (TCR) signaling between acute
(interleukin-2 [IL-2] only) and chronic (anti-CD3 and IL-2) stimulation conditions.
Generate 32 genes that maximize the perturbation effect.
""")

# scRNA-seq データの解析と仮説生成
agent.go("Perform scRNA-seq annotation at [PATH] and generate meaningful hypothesis")
```

### 高度な使い方
```python
from biomni.agent import A1

# カスタムモデルサーバーの使用
agent = A1(
    path='./data',
    llm='custom-model',
    base_url='http://localhost:8000/v1',
    api_key='your-api-key',
    use_tool_retriever=True,
    timeout_seconds=600
)

# 複数ステップの複雑なワークフロー
workflow = """
1. Identify potential drug targets for Alzheimer's disease using GWAS data
2. Perform protein structure prediction for top 5 candidates
3. Design small molecule inhibitors for the most promising target
4. Predict ADMET properties and toxicity for designed compounds
5. Suggest optimization strategies for lead compounds
"""

result = agent.go(workflow)
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、インストール方法、基本的な使用方法
- **CONTRIBUTION.md**: 新しいツール、データ、ベンチマークの追加方法
- **biomni_env/README.md**: 環境セットアップの詳細手順
- **Web UI**: https://biomni.stanford.edu （ブラウザベースのインターフェース）
- **論文**: https://www.biorxiv.org/content/10.1101/2025.05.30.656746v1

### サンプル・デモ
- **tutorials/biomni_101.ipynb**: 基本概念と最初のステップを学ぶJupyterノートブック
- **tutorials/examples/cloning.ipynb**: クローニング実験のデザイン例
- **YouTube動画**: Web UIのデモンストレーション

### チュートリアル・ガイド
- Biomni 101チュートリアル（基本的な使い方）
- コントリビューターガイド（ツール追加方法）
- ベースラインエージェントのチュートリアル（予定）
- Slack コミュニティ: https://join.slack.com/t/biomnigroup/shared_invite/zt-38dat07mc-mmDIYzyCrNtV4atULTHRiw

## 技術的詳細
### アーキテクチャ
#### 全体構造
Biomniは、LLMベースの推論エンジン、ツール実行環境、データレイクの3層アーキテクチャで構成されています。エージェントは自然言語の指示を受け取り、タスクを分解し、適切なツールを選択して実行します。LangChainとLangGraphを使用してエージェントのワークフローを管理しています。

#### ディレクトリ構成
```
Biomni/
├── biomni/               # メインパッケージ
│   ├── agent/           # エージェント実装（A1クラス）
│   ├── tool/            # 生物医学ツール群
│   │   ├── biochemistry.py      # 生化学ツール
│   │   ├── genetics.py          # 遺伝学ツール
│   │   ├── database.py          # データベースクエリツール
│   │   └── tool_description/    # ツール記述メタデータ
│   ├── model/           # 検索・推論モデル
│   └── task/            # タスク定義とベンチマーク
├── biomni_env/          # 環境セットアップスクリプト
├── tutorials/           # チュートリアルとサンプル
└── biorxiv_scripts/     # bioRxivタスク抽出用スクリプト
```

#### 主要コンポーネント
- **A1 (Agent)**: メインのエージェントクラス
  - 場所: `biomni/agent/a1.py`
  - 依存: LangChain、LangGraph、ToolRegistry
  - インターフェース: `go()` - 自然言語タスクの実行

- **ToolRegistry**: ツール管理システム
  - 場所: `biomni/tool/tool_registry.py`
  - 依存: 各種ツールモジュール
  - インターフェース: ツールの登録、検索、実行

- **ToolRetriever**: 関連ツールの検索・選択
  - 場所: `biomni/model/retriever.py`
  - 依存: 埋め込みモデル、ベクトルデータベース
  - インターフェース: タスクに適したツールの推薦

### 技術スタック
#### コア技術
- **言語**: Python 3.11以上（型ヒント、async/await使用）
- **フレームワーク**: 
  - LangChain: エージェントのチェーン構築
  - LangGraph: 状態管理とワークフロー制御
- **主要ライブラリ**: 
  - pydantic: データバリデーションとスキーマ定義
  - anthropic/openai: LLM API クライアント
  - pandas: データ処理と解析
  - numpy/scipy: 科学計算
  - BioPython: 生物情報学ツール

#### 開発・運用ツール
- **ビルドツール**: setuptools、pip
- **コード品質**: Ruff（リンター、フォーマッター）
- **環境管理**: Conda（複雑な依存関係の管理）
- **デプロイ**: PyPI パッケージ、Docker サポート（Web UI）

### 設計パターン・手法
- **エージェントパターン**: 自律的なタスク実行とツール選択
- **レジストリパターン**: ツールの動的登録と管理
- **検索拡張生成（RAG）**: ツール選択の最適化
- **モジュール設計**: 生物医学分野ごとのツール整理
- **タイムアウト制御**: 長時間実行タスクの安全な管理

### データフロー・処理フロー
1. **入力処理**: 自然言語の研究タスクを受信
2. **タスク分解**: LLMがタスクを実行可能なステップに分解
3. **ツール選択**: ToolRetrieverが関連ツールを検索・推薦
4. **実行計画**: エージェントが実行順序を決定
5. **ツール実行**: 選択されたツールを順次実行
6. **結果統合**: 各ツールの出力を統合して解釈
7. **応答生成**: 最終的な研究結果を自然言語で返答

## API・インターフェース
### 公開API
#### A1.go() - メインエージェントAPI
- 目的: 自然言語で記述された生物医学研究タスクの実行
- 使用例:
```python
from biomni.agent import A1

agent = A1(path='./data', llm='claude-sonnet-4-20250514')
result = agent.go("Find potential drug targets for diabetes")
```

#### ツールAPI
- 各ツールは標準化されたインターフェースを持つ
- 例（UniProtクエリ）:
```python
from biomni.tool.database import query_uniprot

result = query_uniprot(
    prompt="Find information about human insulin",
    max_results=5
)
```

### 設定・カスタマイズ
#### 環境変数
```bash
# 必須
export ANTHROPIC_API_KEY="your-key"
# オプション
export OPENAI_API_KEY="your-key"
```

#### 拡張・プラグイン開発
新しいツールの追加方法:
1. `biomni/tool/[category].py`に関数を実装
2. `biomni/tool/tool_description/[category].py`に記述を追加
3. 必要に応じて`biomni_env/new_software_*.sh`に依存関係を追加
4. プルリクエストでコントリビュート

ツール記述の自動生成:
```python
from biomni.utils import function_to_api_schema
from biomni.llm import get_llm

llm = get_llm('claude-sonnet-4-20250514')
desc = function_to_api_schema(your_function_code, llm)
```

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- データレイクサイズ: 約11GB（初回ダウンロード時）
- タイムアウト設定: デフォルト600秒（調整可能）
- ツール実行: 並列実行対応（複数ツールの同時実行）
- メモリ使用: タスクの複雑さに依存（通常2-8GB）

### スケーラビリティ
- LLM APIの並列呼び出しによるスループット向上
- ツールの動的ロードによるメモリ効率化
- カスタムモデルサーバー対応（ローカルLLMの使用可能）
- 分散実行は現在未対応

### 制限事項
- **技術的な制限**:
  - Python 3.11以上が必要
  - フル環境は30GB以上のディスク容量が必要
  - 一部のツールはUbuntu 22.04でのみテスト済み
- **運用上の制限**:
  - LLM APIキーが必要（Claude/OpenAI）
  - 長時間実行タスクはタイムアウトの調整が必要
  - 一部の統合ツールに商用ライセンス制限がある可能性

## 評価・所感
### 技術的評価
#### 強み
- **包括的なツールセット**: 18カテゴリーにわたる生物医学ツールを統合
- **自然言語インターフェース**: 研究者が専門知識なしでも複雑なタスクを実行可能
- **オープンソース**: コミュニティによる拡張が活発（E2版の開発中）
- **実践的**: Stanford大学の研究グループが実際の研究で使用・検証
- **柔軟な設計**: 新しいツールやデータソースの追加が容易

#### 改善の余地
- **セットアップの複雑さ**: フル環境のインストールに10時間以上かかる
- **データレイクのサイズ**: 11GBのダウンロードが初回必要
- **LLM依存**: 高品質なLLM（Claude/GPT-4）へのアクセスが必要
- **ドキュメント**: より詳細なAPIドキュメントやユースケース例が必要

### 向いている用途
- **探索的研究**: 新しい仮説生成や研究方向の探索
- **マルチオミクス解析**: 複数のデータタイプを統合した解析
- **創薬研究**: ターゲット探索からADMET予測まで一貫したワークフロー
- **教育・トレーニング**: 生物医学研究手法の学習ツール
- **ラピッドプロトタイピング**: 研究アイデアの迅速な検証

### 向いていない用途
- **臨床診断**: 医療機器として承認されていない
- **リアルタイム処理**: バッチ処理向けで、低レイテンシ要求には不適
- **商用製品開発**: 一部ツールのライセンス制限に注意が必要
- **機密データ処理**: クラウドLLM使用時のデータプライバシー

### 総評
Biomniは、生物医学研究の民主化と効率化を目指す野心的なプロジェクトです。LLMの推論能力と専門的なバイオインフォマティクスツールを巧みに統合し、研究者が自然言語で複雑なタスクを実行できる点が革新的です。特に、探索的研究や仮説生成において強力なツールとなり得ます。

一方で、セットアップの複雑さやLLMコストなどの実用上の課題もあります。しかし、活発なコミュニティと継続的な開発（E2版）により、これらの課題は徐々に解決されていくと期待されます。生物医学研究におけるAIエージェントの可能性を示す重要なプロジェクトと評価できます。