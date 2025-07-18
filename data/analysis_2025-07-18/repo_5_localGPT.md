# リポジトリ解析: PromtEngineer/localGPT

## 基本情報
- リポジトリ名: PromtEngineer/localGPT
- 主要言語: Python
- スター数: 21,439
- フォーク数: 2,360
- 最終更新: アクティブに開発中（localgpt-v2ブランチで新バージョン開発）
- ライセンス: Apache License 2.0
- トピックス: プライバシー、ローカルLLM、ドキュメントQA、オフラインAI、RAG

## 概要
### 一言で言うと
localGPTは、ローカルデバイス上でGPTモデルを使用してドキュメントと対話できるツールで、データがデバイスから一切外に出ない100%プライベートなソリューションです。

### 詳細説明
localGPTは、privateGPTにインスパイアされたオープンソースプロジェクトで、完全にオフラインで動作するドキュメント質問応答システムを提供します。LangChainとChromaDBを活用したRAG（Retrieval-Augmented Generation）アーキテクチャを採用し、ユーザーのドキュメントをベクトルデータベースに保存し、質問に対して関連するコンテキストを検索してLLMに提供することで、正確な回答を生成します。初回のモデルダウンロード後は、インターネット接続なしで完全に動作します。

### 主な特徴
- 100%オフライン動作（データがデバイスから出ない）
- 多様なドキュメント形式サポート（PDF、Word、Excel、CSV、HTML等）
- 複数のインターフェース（CLI、Web UI、API、Streamlit GUI）
- 幅広いモデルサポート（GGUF/GGML、GPTQ、AWQ、HuggingFace）
- マルチハードウェア対応（CUDA、CPU、Apple Silicon、Intel Gaudi）
- ソースドキュメント表示機能
- チャット履歴の保存
- マルチスレッドによる高速ドキュメント処理
- 柔軟なエンベディングモデル選択

## 使用方法
### インストール
#### 前提条件
- Python 3.10以上
- CUDA対応GPU（推奨）またはCPU
- 8GB以上のRAM（GPU使用時）、16GB以上（CPU使用時）
- Git
- 対応OS: Windows、Linux、macOS（一部制限あり）

#### インストール手順
```bash
# リポジトリのクローン
git clone https://github.com/PromtEngineer/localGPT.git
cd localGPT

# 仮想環境の作成（推奨）
python -m venv venv
source venv/bin/activate  # Linuxの場合
# venv\Scripts\activate  # Windowsの場合

# 依存関係のインストール
pip install -r requirements.txt

# CUDA使用時の追加インストール（GPUの場合）
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu117

# Apple Siliconの場合
pip install torch torchvision torchaudio
```

### 基本的な使い方
#### Hello World相当の例
```bash
# ドキュメントの取り込み（PDFファイルの例）
python ingest.py --device_type cuda  # GPU使用時
# python ingest.py --device_type cpu  # CPU使用時

# 質問応答の実行
python run_localGPT.py --device_type cuda
# 質問例: "What is the main topic of this document?"
```

#### 実践的な使用例
```python
# カスタムドキュメントローダーの例
from langchain.document_loaders import DirectoryLoader, PDFMinerLoader
from constants import SOURCE_DIRECTORY

# 複数形式のドキュメントをロード
loader = DirectoryLoader(
    SOURCE_DIRECTORY,
    glob="**/*.pdf",
    loader_cls=PDFMinerLoader,
    show_progress=True,
    use_multithreading=True
)

documents = loader.load()
print(f"Loaded {len(documents)} documents")

# Web UIの起動
streamlit run localGPT_UI.py
```

### 高度な使い方
```python
# カスタムモデルの使用例
from constants import MODEL_ID, MODEL_BASENAME

# モデルの設定を変更
MODEL_ID = "TheBloke/Llama-2-7B-Chat-GGUF"  # 使用するモデル
MODEL_BASENAME = "llama-2-7b-chat.Q4_K_M.gguf"  # 量子化されたモデルファイル

# カスタムプロンプトテンプレートの設定
system_prompt = """あなたは日本語に特化したアシスタントです。
提供されたコンテキストを使用して、ユーザーの質問に日本語で回答してください。"""

# APIサーバーとして起動
python localGPT_API.py --port 5111 --device_type cuda

# APIエンドポイントの使用
import requests
response = requests.post(
    "http://localhost:5111/api/prompt_route",
    json={
        "user_prompt": "ドキュメントの要約を教えてください",
        "get_sources": True
    }
)
print(response.json())
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクトの概要、インストール方法、基本的な使用方法
- **constants.py**: モデル設定、パス設定、パラメータ設定の定義
- **SOURCE_DOCUMENTS/**: インジェストするドキュメントを配置するディレクトリ
- **Wiki/Issues**: GitHubのIssuesでコミュニティがサポートとFAQを提供

### サンプル・デモ
- **localGPT_UI.py**: Streamlitを使用したWeb UIの実装例
- **localGPT_API.py**: REST APIサーバーの実装例
- **run_localGPT.py**: CLIインターフェースの実装例

### チュートリアル・ガイド
- YouTubeチャンネル "Prompt Engineer" によるビデオチュートリアル
- GitHub Issues内のコミュニティ提供のカスタマイズ例
- Dockerコンテナを使用したデプロイガイド

## 技術的詳細
### アーキテクチャ
#### 全体構造
localGPTはRAG（Retrieval-Augmented Generation）アーキテクチャを採用し、以下のフローで動作します：

1. **ドキュメントインジェスト**: ドキュメントをチャンクに分割し、エンベディングを生成
2. **ベクトルストア**: ChromaDBを使用してエンベディングを保存
3. **検索**: ユーザーの質問に基づいて関連ドキュメントを検索
4. **生成**: 検索結果をコンテキストとしてLLMに提供し、回答を生成

#### ディレクトリ構成
```
localGPT/
├── SOURCE_DOCUMENTS/   # 取り込みドキュメントの配置場所
├── DB/                 # ChromaDBのデータベースファイル
├── models/             # ダウンロードされたモデルの保存先
├── コアスクリプト/
│   ├── ingest.py       # ドキュメントインジェスト処理
│   ├── run_localGPT.py # CLIインターフェース
│   ├── localGPT_UI.py  # Streamlit Web UI
│   └── localGPT_API.py # REST APIサーバー
├── モジュール/
│   ├── load_models.py  # モデルローダー
│   ├── utils.py        # ユーティリティ関数
│   └── prompt_template_utils.py # プロンプトテンプレート
└── constants.py        # 設定定数
```

#### 主要コンポーネント
- **モデルローダー (load_models.py)**: 様々な形式のLLMのロードを担当
  - 場所: `load_models.py`
  - 依存: transformers, auto_gptq, llama-cpp-python
  - インターフェース: load_quantized_model_gguf_ggml(), load_quantized_model_qptq(), load_full_model()

- **ドキュメントインジェスター (ingest.py)**: ドキュメントの処理とベクトル化
  - 場所: `ingest.py`
  - 依存: LangChain, ChromaDB
  - インターフェース: load_documents(), split_documents(), create_embeddings()

- **プロンプトマネージャー (prompt_template_utils.py)**: モデル別のプロンプトテンプレート管理
  - 場所: `prompt_template_utils.py`
  - 依存: LangChain
  - インターフェース: get_prompt_template()

### 技術スタック
#### コア技術
- **言語**: Python 3.10+（型ヒント、async/await、データクラスを使用）
- **フレームワーク**: 
  - LangChain: RAGパイプラインの構築
  - FastAPI: REST APIサーバー
  - Streamlit: Web UIの構築
- **主要ライブラリ**: 
  - langchain (0.0.267+): RAGアーキテクチャの実装
  - chromadb (0.3.22+): ベクトルデータベース
  - sentence-transformers: エンベディング生成
  - torch: ディープラーニングフレームワーク
  - transformers: Hugging Faceモデルの使用
  - llama-cpp-python: GGUF/GGMLモデルの実行
  - auto-gptq: GPTQ量子化モデルのサポート

#### 開発・運用ツール
- **ビルドツール**: pip/requirements.txt、Dockerコンテナサポート
- **テスト**: コミュニティ主導のテスト、ユーザーからのフィードバック
- **CI/CD**: GitHub Actionsでの基本的なリント・テスト
- **デプロイ**: Docker、ローカルインストール、クラウドVMへのデプロイ

### 設計パターン・手法
- **ファクトリーパターン**: モデルローダーがモデルタイプに応じて適切なローダーを選択
- **テンプレートメソッドパターン**: プロンプトテンプレートの管理
- **シングルトンパターン**: データベース接続の管理
- **パイプラインパターン**: LangChainのChainを使用した処理フロー

### データフロー・処理フロー
1. **ドキュメントインジェストフロー**:
   - SOURCE_DOCUMENTS/からドキュメントを読み込み
   - ドキュメントをチャンクに分割（デフォルト500トークン）
   - 各チャンクのエンベディングを生成
   - ChromaDBに保存

2. **質問応答フロー**:
   - ユーザーの質問を受け取り
   - 質問のエンベディングを生成
   - ChromaDBで類似度検索（デフォルト上位4件）
   - 検索結果をコンテキストとしてLLMに提供
   - LLMが回答を生成
   - ソースドキュメント情報を付与

## API・インターフェース
### 公開API
#### REST APIエンドポイント
- 目的: WebアプリケーションからのlocalGPTの利用
- 使用例:
```python
# POST /api/prompt_route
import requests

response = requests.post(
    "http://localhost:5111/api/prompt_route",
    json={
        "user_prompt": "What is the main topic of this document?",
        "get_sources": True,  # ソースドキュメント情報を含む
        "history": []  # 会話履歴
    }
)

result = response.json()
print("Answer:", result["Answer"])
print("Sources:", result["Sources"])
```

#### Python API
```python
from run_localGPT import load_model
from langchain.chains import RetrievalQA

# モデルとQAチェーンの初期化
llm = load_model(device_type="cuda")
qa = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever
)

# 質問応答
result = qa({"query": "Your question here"})
```

### 設定・カスタマイズ
#### 設定ファイル (constants.py)
```python
# モデル設定
MODEL_ID = "TheBloke/Llama-2-7B-Chat-GGUF"
MODEL_BASENAME = "llama-2-7b-chat.Q4_K_M.gguf"

# エンベディングモデル
EMBEDDING_MODEL_NAME = "hkunlp/instructor-large"

# データベース設定
PERSIST_DIRECTORY = "DB"
CHROMA_SETTINGS = Settings(
    anonymized_telemetry=False,
    persist_directory=PERSIST_DIRECTORY
)

# 処理パラメータ
CONTEXT_WINDOW_SIZE = 4096
MAX_NEW_TOKENS = 2048
N_GPU_LAYERS = 100  # GPUレイヤー数
N_BATCH = 512      # バッチサイズ
```

#### 拡張・カスタマイズ
- **カスタムローダーの追加**: `ingest.py`に新しいドキュメントローダーを追加
- **プロンプトテンプレートのカスタマイズ**: `prompt_template_utils.py`で新しいモデル用テンプレートを定義
- **新しいモデルのサポート**: `load_models.py`にローダー関数を追加

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- **インジェスト速度**: 
  - マルチスレッド処理により高速化
  - 100ページのPDF: 約2-5分（GPU使用時）
- **クエリ応答時間**:
  - 初回クエリ: 5-10秒（モデルロード含む）
  - 以降のクエリ: 1-3秒
- **メモリ使用量**:
  - エンベディングモデル: 1-2GB
  - LLM: 4-8GB（量子化モデル使用時）
- **最適化手法**: 
  - モデル量子化（4-bit、8-bit）
  - GPUアクセラレーション
  - バッチ処理

### スケーラビリティ
- **ドキュメント数**: ChromaDBは数万件のドキュメントを処理可能
- **同時ユーザー**: APIサーバーで複数ユーザーに対応可能
- **モデルサイズ**: 7Bから70Bパラメータまでサポート
- **水平スケーリング**: 複数のインスタンスをロードバランサーで分散可能

### 制限事項
- **技術的な制限**:
  - コンテキストウィンドウサイズ（デフォルト4096トークン）
  - GPUメモリによるモデルサイズ制限
  - macOSでのGPTQ/AWQモデル非サポート
- **運用上の制限**:
  - 初回のモデルダウンロードに時間がかかる
  - メモリ要件が高い（最低8GB RAM推奨）
  - リアルタイム処理にはGPUがほぼ必須

## 評価・所感
### 技術的評価
#### 強み
- **完全なプライバシー保護**: データがローカルから一切外に出ない設計
- **幅広いモデルサポート**: GGUF、GPTQ、AWQ、HuggingFaceモデルに対応
- **柔軟なアーキテクチャ**: LangChainベースで拡張が容易
- **複数のインターフェース**: CLI、Web UI、APIを提供
- **アクティブなコミュニティ**: 問題解決や機能追加が活発

#### 改善の余地
- **セットアップの複雑さ**: 初心者には設定が難しい場合がある
- **ドキュメントの不足**: 詳細なドキュメントが限定的
- **テストカバレッジ**: 自動テストが少ない
- **エラーハンドリング**: 一部のエラーメッセージが不親切

### 向いている用途
- **企業内文書の検索・分析**: 機密情報を含む文書の処理
- **研究・教育機関**: 論文や教材の質問応答システム
- **法務・医療分野**: プライバシーが重要な分野での活用
- **個人の知識管理**: プライベートなデジタルアシスタント

### 向いていない用途
- **リアルタイムチャットボット**: 応答速度に制限がある
- **大規模マルチユーザーサービス**: スケーラビリティに工夫が必要
- **クラウドサービス**: オフライン動作が前提のため不適
- **リソース制約環境**: メモリやGPU要件が高い

### 総評
localGPTは、プライバシーを最優先に考えたドキュメントQAシステムとして非常に優れたプロジェクトです。特に企業や研究機関で機密情報を扱う場合に最適です。

設定の複雑さやドキュメントの不足といった課題はあるものの、活発なコミュニティによるサポートと継続的な改善が行われています。オープンソースであるため、カスタマイズも柔軟に対応でき、特定のニーズに合わせた拡張が可能です。

今後はlocalgpt-v2ブランチでの新バージョン開発が進んでおり、さらなる機能強化と使いやすさの向上が期待されます。