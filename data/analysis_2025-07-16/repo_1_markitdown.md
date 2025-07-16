# リポジトリ解析: microsoft/markitdown

## 基本情報
- リポジトリ名: microsoft/markitdown
- 主要言語: Python
- スター数: 63,385
- フォーク数: 3,379
- 最終更新: 2025年以降（頻繁に更新）
- ライセンス: MIT License
- トピックス: markdown, llm, document-conversion, pdf-to-markdown, word-to-markdown, excel-to-markdown, powerpoint-to-markdown, html-to-markdown, image-to-markdown, audio-transcription

## 概要
### 一言で言うと
MarkItDownは、PDF、Word、Excel、PowerPointなど様々なファイル形式をMarkdownに変換する軽量なPythonユーティリティで、LLMとテキスト分析パイプラインでの利用に最適化されている。

### 詳細説明
MarkItDownは、Microsoftが開発したドキュメント変換ツールで、様々なファイル形式をMarkdownに変換することを目的としている。このツールは、LLM（大規模言語モデル）やテキスト分析ツールでの消費を前提に設計されており、重要なドキュメント構造（見出し、リスト、テーブル、リンクなど）をMarkdownとして保持することに焦点を当てている。出力は人間にとっても読みやすいが、主にテキスト分析ツールでの利用を想定しており、人間向けの高忠実度の文書変換には最適ではない可能性がある。

### 主な特徴
- 多様なファイル形式のサポート（PDF、PowerPoint、Word、Excel、画像、音声、HTML、CSV、JSON、XML、ZIP、YouTube URL、EPub等）
- 最小限のマークアップで重要な文書構造を保持
- LLMとの統合（画像説明生成など）
- Azure Document Intelligenceとの統合
- プラグインアーキテクチャによる拡張可能性
- MCP（Model Context Protocol）サーバーサポート
- トークン効率的なMarkdown出力
- Python 3.10以上対応
- CLIとPython APIの両方を提供

## 使用方法
### インストール
#### 前提条件
- Python 3.10以上
- 仮想環境の使用を推奨（venv、uv、Anaconda等）

#### インストール手順
```bash
# 方法1: pipでインストール（全機能）
pip install 'markitdown[all]'

# 方法2: ソースからインストール
git clone git@github.com:microsoft/markitdown.git
cd markitdown
pip install -e 'packages/markitdown[all]'

# 方法3: 特定の機能のみインストール
pip install 'markitdown[pdf, docx, pptx]'  # PDF、Word、PowerPointのみ
```

### 基本的な使い方
#### Hello World相当の例
```bash
# コマンドラインでPDFをMarkdownに変換
markitdown document.pdf > output.md

# または出力ファイルを指定
markitdown document.pdf -o output.md
```

#### 実践的な使用例
```python
# Python APIを使用した基本的な変換
from markitdown import MarkItDown

md = MarkItDown()
result = md.convert("presentation.pptx")
print(result.text_content)

# 複数のファイル形式に対応
for file in ["report.docx", "data.xlsx", "slides.pptx"]:
    result = md.convert(file)
    with open(f"{file}.md", "w") as f:
        f.write(result.text_content)
```

### 高度な使い方
```python
# LLMを使用した画像説明生成
from markitdown import MarkItDown
from openai import OpenAI

client = OpenAI()
md = MarkItDown(llm_client=client, llm_model="gpt-4o")
result = md.convert("complex_diagram.jpg")
print(result.text_content)  # 画像の詳細な説明を含むMarkdown

# Azure Document Intelligenceを使用
md = MarkItDown(docintel_endpoint="<your_endpoint>")
result = md.convert("scanned_document.pdf")
print(result.text_content)

# プラグインを有効化
md = MarkItDown(enable_plugins=True)
result = md.convert("custom_format.xyz")
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクトの概要、インストール手順、基本的な使用方法
- **packages/markitdown-mcp/README.md**: MCP（Model Context Protocol）サーバーの説明
- **packages/markitdown-sample-plugin/README.md**: プラグイン開発ガイド
- **GitHub Issues**: コミュニティサポートと機能リクエスト

### サンプル・デモ
- **tests/test_files/**: 各種ファイル形式のテストファイル
- **tests/test_module_misc.py**: 実際の使用例を含むテストコード
- **Docker例**: `docker run --rm -i markitdown:latest < ~/your-file.pdf > output.md`

### チュートリアル・ガイド
- プラグイン開発: markitdown-sample-pluginディレクトリ参照
- Azure Document Intelligence設定: Microsoft公式ドキュメント参照
- 貢献ガイド: CONTRIBUTING情報（README内）

## 技術的詳細
### アーキテクチャ
#### 全体構造
MarkItDownは、プラグイン可能なコンバーターアーキテクチャを採用している。中心となるMarkItDownクラスが、登録された複数のDocumentConverterを管理し、ファイルタイプに応じて適切なコンバーターを選択して変換を実行する。

#### ディレクトリ構成
```
markitdown/
├── packages/
│   ├── markitdown/           # メインパッケージ
│   │   ├── src/markitdown/
│   │   │   ├── converters/   # 各種ファイル形式のコンバーター
│   │   │   ├── converter_utils/  # コンバーター用ユーティリティ
│   │   │   ├── _markitdown.py    # メインクラス
│   │   │   └── _base_converter.py # 基底クラス
│   │   └── tests/            # テストスイート
│   ├── markitdown-mcp/       # MCPサーバー実装
│   └── markitdown-sample-plugin/  # プラグインサンプル
├── Dockerfile                # Dockerイメージ定義
└── README.md                 # プロジェクトドキュメント
```

#### 主要コンポーネント
- **MarkItDown**: メインクラス、コンバーターの登録と実行を管理
  - 場所: `_markitdown.py`
  - 依存: DocumentConverter、StreamInfo、各種コンバーター
  - インターフェース: convert()、convert_local()、convert_stream()、convert_url()

- **DocumentConverter**: 全コンバーターの基底クラス
  - 場所: `_base_converter.py`
  - インターフェース: accepts()、convert()

- **各種Converter**: ファイル形式別の変換実装
  - 場所: `converters/`ディレクトリ内
  - 例: PdfConverter、DocxConverter、XlsxConverter等

### 技術スタック
#### コア技術
- **言語**: Python 3.10+ (型ヒント、データクラス使用)
- **フレームワーク**: なし（軽量ライブラリとして実装）
- **主要ライブラリ**: 
  - beautifulsoup4: HTML解析
  - markdownify: HTMLからMarkdownへの変換
  - magika (~0.6.1): ファイルタイプ検出
  - charset-normalizer: 文字エンコーディング検出
  - defusedxml: 安全なXML解析

#### 開発・運用ツール
- **ビルドツール**: hatchling（モダンなPythonビルドシステム）
- **テスト**: pytest、hatch test（包括的なテストスイート）
- **CI/CD**: GitHub Actions（自動テスト実行）
- **デプロイ**: PyPI、Docker、ソースインストール対応

### 設計パターン・手法
- **Strategy Pattern**: DocumentConverterインターフェースによる変換戦略の切り替え
- **Plugin Architecture**: エントリーポイントを使用したプラグインシステム
- **Lazy Loading**: 依存関係の遅延読み込みによる起動時間の最適化
- **Priority-based Selection**: 優先度に基づくコンバーター選択メカニズム

### データフロー・処理フロー
1. 入力受付: ファイルパス、URL、ストリーム、requests.Responseを受け付け
2. ストリーム情報推測: Magikaによるファイルタイプ検出、MIME型、拡張子の確認
3. コンバーター選択: accepts()メソッドで適切なコンバーターを選択
4. 変換実行: 選択されたコンバーターのconvert()メソッドを実行
5. 結果返却: DocumentConverterResultオブジェクトとしてMarkdownを返却

## API・インターフェース
### 公開API
#### MarkItDown.convert()
- 目的: 汎用的なファイル変換メソッド
- 使用例:
```python
md = MarkItDown()
result = md.convert("file.pdf")  # ファイルパス
result = md.convert("https://example.com/doc.pdf")  # URL
result = md.convert(file_stream)  # バイナリストリーム
```

#### DocumentConverter インターフェース
- 目的: カスタムコンバーターの実装
- 使用例:
```python
class MyConverter(DocumentConverter):
    def accepts(self, file_stream, stream_info, **kwargs):
        return stream_info.extension == ".myformat"
    
    def convert(self, file_stream, stream_info, **kwargs):
        content = file_stream.read()
        # 変換ロジック
        return DocumentConverterResult(markdown="# Converted content")
```

### 設定・カスタマイズ
#### 設定ファイル
設定ファイルは使用せず、コンストラクタ引数で設定:
```python
md = MarkItDown(
    enable_plugins=True,
    llm_client=openai_client,
    llm_model="gpt-4o",
    docintel_endpoint="https://...",
    exiftool_path="/usr/bin/exiftool"
)
```

#### 拡張・プラグイン開発
プラグインは`markitdown.plugin`エントリーポイントに登録:
```python
# pyproject.toml
[project.entry-points."markitdown.plugin"]
my_plugin = "my_package:MyConverter"
```

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ベンチマーク結果: 具体的な数値は公開されていない
- 最適化手法:
  - 依存関係の遅延読み込み
  - ストリーミング処理（大きなファイルでもメモリ効率的）
  - シークできないストリームはメモリにバッファリング

### スケーラビリティ
- ファイルサイズ: ストリーミング処理により大きなファイルも処理可能
- 並列処理: 複数のMarkItDownインスタンスで並列処理可能
- プラグインシステムによる機能拡張

### 制限事項
- スタイル情報の多くは無視される（プレーンテキストに近い出力）
- 複雑なレイアウトや書式は正確に再現されない
- 画像やメディアファイルは外部サービス（LLM等）が必要
- Windows環境でonnxruntimeのバージョン制限（<=1.20.1）

## 評価・所感
### 技術的評価
#### 強み
- 幅広いファイル形式のサポート（20種類以上）
- 軽量で依存関係が少ない（コア機能のみなら最小限の依存）
- 拡張性の高いプラグインアーキテクチャ
- LLMとの統合が容易（OpenAI等）
- 活発な開発とMicrosoftによるメンテナンス
- CLIとPython APIの両方を提供

#### 改善の余地
- 複雑な書式やレイアウトの再現性が低い
- 一部の変換は外部ツール（exiftool等）に依存
- ドキュメントが主にREADMEに集中
- テスト以外の実装例が少ない

### 向いている用途
- LLMへの入力データ準備（RAG、文書分析等）
- 大量の文書をMarkdownに一括変換
- テキスト分析パイプラインの前処理
- 文書アーカイブのテキスト抽出
- チャットボットやAIアシスタントの知識ベース構築

### 向いていない用途
- 高忠実度の文書変換（印刷用等）
- 複雑なレイアウトの保持が必要な用途
- リアルタイムの大量処理（同期処理のため）
- スタイル情報の保持が重要な用途

### 総評
MarkItDownは、LLM時代に最適化された実用的な文書変換ツールである。多様なファイル形式をサポートし、拡張性も高く、Microsoftによる活発な開発が続いている。特にRAGシステムやAIアプリケーションの開発において、文書の前処理ツールとして非常に有用である。ただし、レイアウトやスタイル情報の保持には限界があるため、用途を選んで使用する必要がある。