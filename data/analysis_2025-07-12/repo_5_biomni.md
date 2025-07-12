# リポジトリ解析: snap-stanford/Biomni

## 基本情報
- リポジトリ名: snap-stanford/Biomni
- 主要言語: Python
- スター数: 1,341
- フォーク数: 138
- 最終更新: 継続的に更新中
- ライセンス: Apache License 2.0
- トピックス: バイオメディカルAI、生物医学研究、AIエージェント、LLM、計算生物学

## 概要
### 一言で言うと
Biomniは、幅広いバイオメディカル研究タスクを自律的に実行できる汎用バイオメディカルAIエージェントで、LLMの推論能力と検索拡張計画、コード実行を組み合わせて研究者の生産性を大幅に向上させます。

### 詳細説明
Biomniはスタンフォード大学のSNAPラボが開発した汎用バイオメディカルAIエージェントで、多様なバイオメディカルサブフィールドにわたる研究タスクを自律的に実行します。ClaudeやGPTなどの最新LLMを基盤として、研究特化型のツールセット、データベース、ソフトウェアを統合し、自然言語での指示から複雑な研究タスクを実行します。

システムは「Biomni-A1」エージェントと「Biomni-E1」環境で構成され、E1環境は多様なバイオメディカルツールやデータソース（11GBのデータレイクを含む）を提供します。研究者は、CRISPRスクリーンの設計、scRNA-seqデータの解析、薬物特性の予測など、特定のタスクをプログラミング知識なしに実行できます。

### 主な特徴
- **汎用バイオメディカルAIエージェント**: 多様な研究分野に対応
- **自然言語インターフェース**: 非プログラマーでも使用可能
- **統合ツールセット**: 18分野にわたる200以上のツール
- **11GBのデータレイク**: 豊富なバイオメディカルデータソース
- **オープンソース**: コミュニティ主導の開発
- **Web UIとCLI両対応**: 異なるユーザーニーズに対応
- **拡張可能**: 新しいツールやデータセットの追加が容易

## 使用方法
### インストール
#### 前提条件
- Python 3.11以上
- CondaまたはMiniconda
- Docker（一部のツールで必要）
- GPU（オプション、一部ツールの高速化用）
- APIキー: AnthropicまたはOpenAI

#### インストール手順
```bash
# 方法1: pipでのインストール
# まず環境セットアップ（biomni_env/README.mdを参照）
conda activate biomni_e1

# 最新のbiomniパッケージをインストール
pip install biomni --upgrade

# 方法2: GitHubからソースでインストール
git clone https://github.com/snap-stanford/biomni.git
cd biomni
pip install -e .

# APIキーの設定（~/.bashrcに追加）
export ANTHROPIC_API_KEY="YOUR_API_KEY"
export OPENAI_API_KEY="YOUR_API_KEY"  # オプション
```

### 基本的な使い方
#### Hello World相当の例
```python
from biomni.agent import A1

# エージェントの初期化（初回実行時にデータレイクが自動ダウンロードされます）
agent = A1(path='./data', llm='claude-sonnet-4-20250514')

# シンプルなタスクの実行
agent.go("ADMET特性を予測してください: CC(C)CC1=CC=C(C=C1)C(C)C(=O)O")
```

#### 実践的な使用例
```python
# CRISPRスクリーンの設計
agent.go("""
T細胞消耗を制御する遺伝子を同定するためのCRISPRスクリーンを計画し、
摂動効果を最大化する32個の遺伝子を生成してください。
""")

# scRNA-seqデータの解析
agent.go("""
/path/to/scRNA-seq/data のscRNA-seqデータに対してアノテーションを行い、
意味のある仮説を生成してください。
""")

# 化合物の薬物特性予測
agent.go("""
次の化合物のADMET特性を予測してください:
CC(C)CC1=CC=C(C=C1)C(C)C(=O)O
""")
```

### 高度な使い方
```python
# カスタム設定での使用
agent = A1(
    path='./data',
    llm='claude-sonnet-4-20250514',  # または 'gpt-4' など
    use_tool_retriever=True,          # ツール検索を有効化
    timeout_seconds=600               # タイムアウト設定（10分）
)

# 複雑なマルチステップタスク
agent.go("""
1. ターゲットタンパク質EGFRの構造をPDBから取得
2. 既知のEGFR阻害剤のリストを作成
3. ドッキングシミュレーションを実行して結合親和性を予測
4. 最も有望な候補のADMETプロファイルを生成
5. 結果を統合して報告書を作成
""")

# データベースと文献検索の統合
agent.go("""
BRCA1遺伝子変異と乳がん予後に関する最新の研究を検索し、
ClinVarとgnomADのデータを統合して、
臨床的に重要な変異の包括的な分析を行ってください。
""")
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、インストール方法、基本的な使用法
- **CONTRIBUTION.md**: 貢献ガイドライン、ツール追加方法
- **Web UI**: https://biomni.stanford.edu - ブラウザベースのインターフェース
- **bioRxiv論文**: https://www.biorxiv.org/content/10.1101/2025.05.30.656746v1 - システムの詳細な説明
- **Slackコミュニティ**: ユーザーサポートとディスカッション

### サンプル・デモ
- **tutorials/biomni_101.ipynb**: Biomniの基本概念と初めてのステップ
- **tutorials/examples/cloning.ipynb**: クローニング関連の例
- **YouTubeデモ**: https://youtu.be/E0BRvl23hLs - Web UIの使用方法

### チュートリアル・ガイド
- Biomni 101 Jupyter Notebook
- 貢献者向けチュートリアル（近日公開予定）
- ベースラインエージェントのチュートリアル（近日公開予定）

## 技術的詳細
### アーキテクチャ
#### 全体構造
Biomniは、LangChainとLangGraphを基盤としたエージェントアーキテクチャを採用しています。システムは以下の主要コンポーネントで構成されています：

1. **A1エージェント**: LLMベースの意思決定と実行制御
2. **ツールレジストリ**: 200+のバイオメディカルツールの管理
3. **ツールリトリーバー**: タスクに適したツールの検索と選択
4. **データレイク**: 11GBのバイオメディカルデータソース
5. **実行エンジン**: Python/R/Bashコードの安全な実行

#### ディレクトリ構成
```
biomni/
├── biomni/                # メインパッケージ
│   ├── agent/            # エージェント実装
│   │   ├── a1.py        # A1エージェントクラス
│   │   └── react.py     # ReActエージェント
│   ├── tool/             # バイオメディカルツール（18分野）
│   │   ├── biochemistry.py
│   │   ├── genomics.py
│   │   ├── pharmacology.py
│   │   ├── immunology.py
│   │   └── ...
│   ├── model/            # 機械学習モデル
│   │   └── retriever.py # ツール検索モデル
│   ├── task/             # ベンチマークタスク
│   └── utils.py         # ユーティリティ関数
├── biomni_env/           # 環境セットアップスクリプト
├── tutorials/            # チュートリアル
└── data/                 # データレイク（自動ダウンロード）
    └── biomni_data/
        ├── data_lake/    # 11GBのデータソース
        └── benchmark/    # ベンチマークデータ
```

#### 主要コンポーネント
- **A1クラス**: メインエージェント実装
  - 場所: `biomni/agent/a1.py`
  - 役割: タスク実行のオーケストレーション、LLMとの通信
  - 主要メソッド: go(), configure(), plan(), execute()

- **ToolRegistry**: ツール管理システム
  - 場所: `biomni/tool/tool_registry.py`
  - 役割: 200+のバイオメディカルツールの登録と管理
  - 主要メソッド: register_tool(), get_tool_by_name(), validate_tool()

- **ToolRetriever**: ツール検索システム
  - 場所: `biomni/model/retriever.py`
  - 役割: タスクに最適なツールの検索と推薦
  - 依存: ベクトルデータベース、埋め込みモデル

- **分野別ツールモジュール**: 専門ツールの実装
  - 場所: `biomni/tool/[field].py`
  - 例: pharmacology.py (ドッキング、ADMET予測)
  - 例: genomics.py (遺伝子解析、変異予測)
  - 例: immunology.py (免疫解析、T細胞分析)

### 技術スタック
#### コア技術
- **言語**: Python 3.11+
- **LLMフレームワーク**: 
  - LangChain: LLM抽象化とチェーン構築
  - LangGraph: エージェントワークフロー管理
- **主要ライブラリ**: 
  - pydantic: データバリデーション
  - pandas: データ操作
  - numpy: 数値計算
  - TDC (Therapeutics Data Commons): 薬物開発ツール

#### 統合バイオメディカルツール
- **ドッキング**: DiffDock, AutoDock Vina
- **配列解析**: BLAST, MAFFT, MUSCLE
- **構造予測**: AlphaFold, ESMFold
- **薬物特性**: ADMET予測ツール
- **データベース**: UniProt, PDB, ClinVar, gnomAD, KEGGなど

#### 開発・運用ツール
- **ビルド**: setuptools, wheel
- **コード品質**: Ruff (linting, formatting)
- **コンテナ**: Docker（一部ツール用）
- **環境管理**: Conda/Mamba

### 設計パターン・手法
- **エージェントパターン**: LangGraphによるステート管理
- **ツール使用パターン**: ReAct (Reasoning + Acting)
- **モジュラー設計**: 分野別にツールをモジュール化
- **検索拡張生成** (RAG): ツール選択の最適化
- **タイムアウト管理**: 長時間タスクの安全な制御

### データフロー・処理フロー
1. **ユーザー入力**: 自然言語でのタスク記述
2. **タスク解析**: LLMによるタスクの理解と分解
3. **ツール選択**: 
   - ToolRetrieverによる関連ツールの検索
   - LLMによる最適ツールの選択
4. **計画生成**: タスク実行計画の立案
5. **実行**: 
   - Python/R/Bashコードの生成と実行
   - ツール呼び出しと結果取得
6. **結果統合**: LLMによる結果の解釈と統合
7. **出力生成**: ユーザーへの結果報告

## API・インターフェース
### 公開API
#### A1エージェントAPI
- 目的: バイオメディカルタスクの実行
- 主要メソッド:
```python
# エージェントの初期化
agent = A1(
    path="./data",                    # データディレクトリ
    llm="claude-sonnet-4-20250514",   # LLMモデル
    use_tool_retriever=True,           # ツール検索有効化
    timeout_seconds=600                # タイムアウト設定
)

# タスク実行
result = agent.go("Your biomedical task description")

# 計画モード（実行前に計画を確認）
plan = agent.plan("Your task")

# コード実行
result = agent.execute("Python code to run")
```

#### ツールインターフェース
- 各ツールは統一されたAPIスキーマに従う:
```python
{
    "name": "tool_name",
    "description": "What the tool does",
    "required_parameters": ["param1", "param2"],
    "optional_parameters": ["param3"],
    "returns": "Description of return value"
}
```

### 設定・カスタマイズ
#### 環境変数
```bash
# 必須
ANTHROPIC_API_KEY="your_api_key"

# オプション
OPENAI_API_KEY="your_api_key"

# データパスカスタマイズ
BIOMNI_DATA_PATH="/custom/path/to/data"
```

#### 新しいツールの追加
1. **ツール関数の定義**:
```python
# biomni/tool/my_field.py
def my_new_tool(param1, param2, optional_param=None):
    """
    Tool description for LLM to understand.
    
    Args:
        param1: Description
        param2: Description
        optional_param: Optional description
    
    Returns:
        Result description
    """
    # Implementation
    return result
```

2. **ツールの登録**:
   - 関数に適切なdocstringを追加
   - CONTRIBUTION.mdのガイドラインに従う

3. **プルリクエストの提出**

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- **タスク実行時間**: 
  - シンプルタスク: 10-30秒
  - 複雑なタスク: 1-10分（ツールとデータサイズに依存）
- **データレイク**: 11GB（初回ダウンロード時）
- **最適化手法**:
  - ツール検索のキャッシュ
  - バッチ処理の活用
  - GPU利用（一部ツール）

### スケーラビリティ
- **水平スケーリング**: APIキーの追加で並列処理可能
- **ツール拡張**: コミュニティでのツール追加が容易
- **データレイク拡張**: 新しいデータソースの統合可能

### 制限事項
- **技術的制限**:
  - LLMのAPIレート制限
  - メモリ集約的なタスクでは大容量メモリが必要
  - 一部ツールはDockerが必要
  - タイムアウト設定（デフォルト10分）
- **運用上の制限**:
  - APIキーの管理が必要
  - 一部ツールの商用利用制限
  - データレイクの更新頻度

## 評価・所感
### 技術的評価
#### 強み
- **包括的なツールセット**: 18分野200+ツールの統合
- **自然言語インターフェース**: 非プログラマーでもアクセス可能
- **最新LLMの活用**: Claude SonnetやGPT-4の推論能力
- **オープンソース**: コミュニティ主導の開発
- **実用的なデータレイク**: 11GBのキュレートされたデータ
- **柔軟なアーキテクチャ**: 新ツールの追加が容易

#### 改善の余地
- **ドキュメント化**: より詳細なAPIドキュメントが必要
- **テストカバレッジ**: 各ツールの単体テストが不足
- **エラーハンドリング**: より堅牢なエラー処理
- **バージョン管理**: ツールの依存関係管理
- **パフォーマンス最適化**: 大規模データ処理の効率化

### 向いている用途
- **バイオメディカル研究**: 仮説生成、データ解析、実験計画
- **薬物開発**: ADMET予測、ドッキング、ターゲット同定
- **ゲノム解析**: 遺伝子解析、変異予測、CRISPR設計
- **タンパク質研究**: 構造予測、機能解析、相互作用予測
- **文献調査**: 包括的な文献検索と分析
- **教育・トレーニング**: バイオインフォマティクスの学習

### 向いていない用途
- **臨床診断**: 医療機器としての認証がない
- **リアルタイム処理**: 緊急性の高いタスク
- **大規模な商用利用**: 一部ツールのライセンス制限
- **機密データ処理**: API経由でのLLM利用

### 総評
Biomniは、バイオメディカル研究におけるAIエージェントの可能性を示す画期的なプロジェクトです。200以上の専門ツールを統合し、自然言語での指示から複雑な研究タスクを実行できる能力は、研究者の生産性を大幅に向上させる可能性を秘めています。

特に注目すべきは、オープンソースとコミュニティ主導の開発アプローチです。Biomni-E2の開発に向けて、貢献者を積極的に募集し、共著者としての参加機会を提供している点は、学術コミュニティとの強い連携を示しています。

今後の課題としては、ドキュメントの充実、テストの強化、パフォーマンスの最適化などが挙げられますが、バイオメディカルAIエージェントの分野をリードするプロジェクトとして、大きなポテンシャルを持っています。