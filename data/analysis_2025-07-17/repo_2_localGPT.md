# リポジトリ解析: PromtEngineer/localGPT

## 基本情報
- リポジトリ名: PromtEngineer/localGPT
- 主要言語: Python
- スター数: 21,154
- フォーク数: 2,342
- 最終更新: 最新の情報は確認が必要
- ライセンス: Apache License 2.0
- トピックス: プライバシー、ローカルLLM、RAG、ドキュメント処理、オープンソース

## 概要
### 一言で言うと
GPTモデルを使用してローカルデバイス上でドキュメントとチャットできるツールで、データが一切デバイスを離れない100%プライベートな環境を提供します。

### 詳細説明
localGPTは、プライバシーを最優先に設計されたオープンソースのドキュメント対話システムです。ユーザーはローカル環境で完全にプライベートかつ安全にドキュメントと対話できます。すべての処理がローカルで実行されるため、データが外部に送信されることはありません。LangChainフレームワークを基盤とし、様々なオープンソースLLMモデルをサポートしています。

プロジェクトは、企業や個人が機密文書を扱う際のセキュリティ懸念に対応するために開発されました。従来のクラウドベースのAIサービスとは異なり、すべての処理をローカルで実行することで、データ漏洩のリスクを完全に排除しています。

### 主な特徴
- 100%プライバシー: すべてのデータがローカルに留まる
- 多様なモデルサポート: HuggingFace、GPTQ、GGML、GGUF形式のモデルに対応
- 複数の埋め込みモデル: オープンソースの埋め込みから選択可能
- LLMの再利用性: 一度ダウンロードしたモデルを繰り返し使用可能
- チャット履歴: セッション内で会話のコンテキストを維持
- REST API: RAGアプリケーション構築用のAPIエンドポイント提供
- デュアルGUI: StreamlitベースのUIとAPIベースのWebインターフェース
- マルチプラットフォーム: CUDA、CPU、HPU（Intel Gaudi）、MPS（Apple Silicon）対応
- 多様なファイル形式: PDF、TXT、MD、CSV、DOCX等をサポート

## 使用方法
### インストール
#### 前提条件
- Python 3.10.0以上
- Conda（仮想環境管理に推奨）
- C++コンパイラ（特定の依存関係のビルドに必要）
- ハードウェア要件:
  - NVIDIA GPU（CUDA対応）
  - Apple Silicon（MPS対応）
  - Intel Gaudi（HPU対応）
  - CPUフォールバック可能

#### インストール手順
```bash
# 方法1: リポジトリのクローンとセットアップ
git clone https://github.com/PromtEngineer/localGPT.git
cd localGPT

# Conda環境の作成
conda create -n localgpt python=3.10.0
conda activate localgpt

# 依存関係のインストール
pip install -r requirements.txt

# PyTorchのインストール（デバイスに応じて選択）
# CUDA 11.8の場合
pip install torch==2.3.0 torchvision==0.18.0 torchaudio==2.3.0 --index-url https://download.pytorch.org/whl/cu118

# MPS（Apple Silicon）の場合
pip install torch==2.1.1 torchvision==0.16.1 torchaudio==2.1.1

# llama-cpp-pythonのインストール（GPUサポート付き）
CMAKE_ARGS="-DGGML_CUDA=on" pip install llama-cpp-python
```

### 基本的な使い方
#### Hello World相当の例
```bash
# 1. ドキュメントの配置
# SOURCE_DOCUMENTSフォルダにファイルを配置
cp your_document.pdf SOURCE_DOCUMENTS/

# 2. ドキュメントの取り込み（埋め込み作成）
python ingest.py --device_type cpu

# 3. 対話の開始
python run_localGPT.py --device_type cpu
# プロンプト例: "What is the document about?"
```

#### 実践的な使用例
```python
# constants.pyでのモデル設定
MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct"
MODEL_BASENAME = None

# APIサーバーの起動と利用
# Terminal 1: APIサーバー起動
python run_localGPT_API.py

# Terminal 2: APIを使用したクエリ
import requests
import json

url = "http://localhost:5110/api/prompt_route"
data = {
    "user_prompt": "Summarize the main points of the document",
    "get_sources": True
}
response = requests.post(url, json=data)
print(json.loads(response.text)["Answer"])
```

### 高度な使い方
```bash
# GPU層の指定とバッチサイズの最適化
python run_localGPT.py --device_type cuda --gpu_layers 32 --batch_size 512

# 履歴付きチャット
python run_localGPT.py --use_history --device_type cuda

# Streamlit UIの起動（より豊富な機能）
streamlit run localGPT_UI.py -- --device_type cuda

# crawl.pyを使用した自動ドキュメント処理
python crawl.py
# 監視ディレクトリに新しいドキュメントを配置すると
# 自動的に処理・分類される
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクトの概要、インストール方法、基本的な使用方法
- **CONTRIBUTING.md**: 貢献ガイドライン、コード規約
- **ACKNOWLEDGEMENT.md**: 使用しているプロジェクトとライブラリへの謝辞
- **pyproject.toml**: プロジェクト設定とpre-commitフック

### サンプル・デモ
- **SOURCE_DOCUMENTS/Orca_paper.pdf**: テスト用のサンプルドキュメント
- **localGPTUI/**: Webインターフェースの実装例
- **crawl.py**: バッチ処理のサンプル実装

### チュートリアル・ガイド
- プロジェクトREADMEに詳細な手順
- モデル選択ガイド（constants.py内のコメント）
- Docker使用ガイド（Dockerfileに実装例）

## 技術的詳細
### アーキテクチャ
#### 全体構造
localGPTは、LangChainフレームワークを基盤としたモジュラーアーキテクチャを採用しています。ドキュメントの取り込み、埋め込み生成、ベクトルデータベースへの保存、そしてLLMを使用したクエリ応答の各段階が独立したモジュールとして実装されています。

#### ディレクトリ構成
```
localGPT/
├── SOURCE_DOCUMENTS/    # 入力ドキュメントディレクトリ
├── DB/                  # ChromaDBベクトルストア
├── localGPTUI/          # WebUIコンポーネント
│   ├── static/          # CSS、JavaScript、画像
│   └── templates/       # HTMLテンプレート
├── gaudi_utils/         # Intel Gaudi HPUサポート
├── ingest.py            # ドキュメント取り込みパイプライン
├── run_localGPT.py      # CLIインターフェース
├── run_localGPT_API.py  # REST APIサーバー
├── localGPT_UI.py       # Streamlit UI
├── constants.py         # 設定ファイル
├── load_models.py       # モデルローダー
├── utils.py             # ユーティリティ関数
└── crawl.py             # バッチ処理ツール
```

#### 主要コンポーネント
- **ingest.py**: ドキュメント取り込みパイプライン
  - 場所: `/ingest.py`
  - 依存: LangChain、ChromaDB、InstructorEmbeddings
  - インターフェース: `load_documents()`, `split_documents()`, `create_embeddings()`

- **load_models.py**: モデル管理システム
  - 場所: `/load_models.py`
  - 依存: HuggingFace Transformers、llama-cpp-python
  - インターフェース: `load_quantized_model()`, `load_full_model()`

- **constants.py**: 中央設定管理
  - 場所: `/constants.py`
  - 依存: なし
  - インターフェース: モデル設定、パス設定、ハードウェア設定

### 技術スタック
#### コア技術
- **言語**: Python 3.10+ (型ヒント、async/await、モダンPython機能を使用)
- **フレームワーク**: 
  - LangChain: RAGパイプラインの構築
  - Flask: REST APIサーバー
  - Streamlit: インタラクティブUI
- **主要ライブラリ**: 
  - langchain-community: LangChainコミュニティ統合
  - chromadb: ベクトルデータベース
  - InstructorEmbedding: 高品質な埋め込み生成
  - sentence-transformers: 文埋め込みモデル
  - transformers: HuggingFaceモデル
  - llama-cpp-python: GGUF/GGMLモデルサポート
  - torch: ディープラーニングフレームワーク
  - accelerate: モデル最適化
  - bitsandbytes: 量子化サポート

#### 開発・運用ツール
- **ビルドツール**: pip、conda（環境管理）
- **テスト**: ユニットテストは限定的（コミュニティ主導）
- **CI/CD**: pre-commitフック（コード品質チェック）
- **デプロイ**: Docker（GPU/HPUサポート付き）

### 設計パターン・手法
- **パイプラインパターン**: ドキュメント処理の各段階を独立したステップとして実装
- **ファクトリーパターン**: モデルローダーが異なるモデルタイプを動的に生成
- **シングルトン的アプローチ**: ChromaDBインスタンスの共有
- **設定駆動開発**: constants.pyによる集中管理

### データフロー・処理フロー
1. **ドキュメント取り込み**:
   - SOURCE_DOCUMENTSからファイルを読み込み
   - LangChainのDocumentLoaderで解析
   - RecursiveCharacterTextSplitterでチャンク分割

2. **埋め込み生成**:
   - InstructorEmbeddingsで各チャンクを埋め込みベクトルに変換
   - ChromaDBに永続化

3. **クエリ処理**:
   - ユーザークエリを埋め込みに変換
   - ChromaDBで類似度検索
   - 関連ドキュメントチャンクを取得

4. **応答生成**:
   - LLMにコンテキストとクエリを送信
   - RetrievalQAチェーンで応答生成
   - ソースドキュメントを含めて返却

## API・インターフェース
### 公開API
#### REST APIエンドポイント
- 目的: RAGアプリケーション構築のためのHTTP API
- エンドポイント:
  - `GET /api/delete_source`: ソースドキュメントのクリア
  - `POST /api/save_document`: 新規ドキュメントのアップロード
  - `GET /api/run_ingest`: アップロードされたドキュメントの処理
  - `POST /api/prompt_route`: クエリの送信と応答取得

- 使用例:
```python
import requests
import json

# ドキュメントのアップロード
with open("document.pdf", "rb") as f:
    files = {"document": f}
    response = requests.post("http://localhost:5110/api/save_document", files=files)

# 取り込み実行
requests.get("http://localhost:5110/api/run_ingest")

# クエリ送信
data = {
    "user_prompt": "What are the key points?",
    "get_sources": True,
    "use_history": True
}
response = requests.post("http://localhost:5110/api/prompt_route", json=data)
result = json.loads(response.text)
print(result["Answer"])
print(result["Sources"])
```

### 設定・カスタマイズ
#### 設定ファイル
```python
# constants.py の主要設定項目

# モデル設定
MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct"
MODEL_BASENAME = None  # GGUFファイル名（該当する場合）

# 埋め込みモデル
EMBEDDING_MODEL_NAME = "hkunlp/instructor-large"

# パス設定
PERSIST_DIRECTORY = "DB"
SOURCE_DIRECTORY = "SOURCE_DOCUMENTS"

# ハードウェア設定
N_GPU_LAYERS = 100  # GPUに配置する層数
N_BATCH = 512       # バッチサイズ
MAX_NEW_TOKENS = 2048  # 最大生成トークン数

# ドキュメントタイプ
DOCUMENT_MAP = {
    ".txt": TextLoader,
    ".pdf": PDFMinerLoader,
    ".csv": CSVLoader,
    ".docx": Docx2txtLoader,
    # ... その他の形式
}
```

#### 拡張・プラグイン開発
- 新しいドキュメントローダーの追加: DOCUMENT_MAPに新しいエントリを追加
- カスタム埋め込みモデル: InstructorEmbeddingsを他の埋め込みクラスに置換
- 新しいLLMの統合: load_models.pyに新しいモデルローダーを実装

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ベンチマーク結果: モデルとハードウェアに大きく依存
  - 7Bモデル: RTX 3090で約5-10秒/クエリ
  - 13Bモデル: 要24GB+ VRAM
  - CPU推論: 大幅に遅い（30秒-数分/クエリ）
- 最適化手法:
  - 量子化モデル（GGUF、GPTQ）による省メモリ化
  - GPU層の調整によるメモリ使用量の最適化
  - バッチサイズの調整
  - Flash Attention（サポートされるモデルで）

### スケーラビリティ
- 垂直スケーリング: より高性能なGPU/より多くのVRAM
- 水平スケーリング: APIサーバーの複数インスタンス化（DBは共有）
- ドキュメント数の制限: ChromaDBの性能に依存

### 制限事項
- VRAMサイズによるモデルサイズの制限
- ローカル実行のため、クラウドスケーリングが困難
- 単一ユーザー/小規模チーム向けの設計
- リアルタイムストリーミングレスポンスの未対応

## 評価・所感
### 技術的評価
#### 強み
- 完全なプライバシー保護とデータセキュリティ
- 豊富なモデル選択肢とカスタマイズ性
- 活発なコミュニティとメンテナンス
- 包括的な機能（GUI、API、CLI）
- 多様なハードウェアサポート
- オープンソースで透明性が高い

#### 改善の余地
- セットアップの複雑さ（特に初心者向け）
- ドキュメントの構造化が不十分
- エラーハンドリングの改善余地
- より効率的なメモリ管理

### 向いている用途
- 機密文書を扱う企業や組織
- プライバシー重視の個人ユーザー
- オフライン環境での文書分析
- 小規模チームでのナレッジベース構築
- 研究開発環境でのプロトタイピング

### 向いていない用途
- 大規模な同時アクセスが必要なサービス
- リアルタイムレスポンスが必須のアプリケーション
- クラウドベースのスケーラビリティが必要な場合
- 技術的知識が限定的なエンドユーザー向け製品

### 総評
localGPTは、プライバシーとセキュリティを最優先するユーザーにとって優れた選択肢です。完全にローカルで動作するRAGシステムとして、機密データを扱う企業や個人にとって理想的なソリューションを提供します。技術的な複雑さはあるものの、活発なコミュニティサポートと包括的な機能により、プライベートなAIアシスタントとして高い実用性を持っています。今後、より使いやすいインストーラーやGUIの改善により、さらに広いユーザー層に普及する可能性があります。