# リポジトリ解析: microsoft/markitdown

## 基本情報
- リポジトリ名: microsoft/markitdown
- 主要言語: Python
- スター数: 67,984
- フォーク数: 3,598
- 最終更新: 2025-06-03
- ライセンス: MIT License
- トピックス: ファイル変換、Markdown、LLM、ドキュメント処理、テキスト抽出

## 概要
### 一言で言うと
MarkItDownは、PDF、Word、PowerPoint、Excel、画像、音声など様々な形式のファイルをMarkdownに変換する軽量Pythonユーティリティで、LLMやテキスト分析パイプラインでの利用に最適化されています。

### 詳細説明
MarkItDownは、Microsoft AutoGenチームによって開発された、ドキュメント変換ツールです。LLMが「理解しやすい」Markdown形式への変換に特化しており、見出し、リスト、テーブル、リンクなどの重要な文書構造を保持しながら変換を行います。textractに似ていますが、Markdown形式での構造保持に重点を置いている点が特徴です。出力は人間にとっても読みやすい形式ですが、主にテキスト分析ツールでの利用を想定しています。

### 主な特徴
- 多様なファイル形式のサポート（PDF、Office文書、画像、音声、HTML、CSV、JSON、XMLなど）
- 画像のOCRと音声の文字起こし機能
- EXIF メタデータの抽出
- ZIPファイルの再帰的処理
- YouTube URLからの字幕抽出
- EPub形式のサポート
- Azure Document Intelligenceとの統合
- LLMを使った画像の説明生成機能
- プラグインシステムによる拡張性
- MCP（Model Context Protocol）サーバーの提供
- 依存関係の柔軟な管理（オプショナルな機能群）

## 使用方法
### インストール
#### 前提条件
- Python 3.10以上
- 仮想環境の使用を推奨
- （オプション）ExifToolのインストール（画像メタデータ抽出用）
- （オプション）各種ファイル形式用の追加依存関係

#### インストール手順
```bash
# 方法1: pipでインストール（全機能を含む）
pip install 'markitdown[all]'

# 方法2: 特定の機能のみインストール
pip install 'markitdown[pdf, docx, pptx]'

# 方法3: ソースからインストール
git clone git@github.com:microsoft/markitdown.git
cd markitdown
pip install -e 'packages/markitdown[all]'
```

### 基本的な使い方
#### Hello World相当の例
```bash
# コマンドラインから使用
markitdown example.pdf > output.md

# またはファイルに直接出力
markitdown example.pdf -o output.md

# 標準入力から読み込み
cat example.pdf | markitdown
```

#### 実践的な使用例
```python
# Python APIを使用した基本的な変換
from markitdown import MarkItDown

md = MarkItDown()
result = md.convert("test.xlsx")
print(result.text_content)

# プラグインを有効化して使用
md = MarkItDown(enable_plugins=True)
result = md.convert("document.pdf")
```

### 高度な使い方
```python
# LLMを使用した画像の説明生成
from markitdown import MarkItDown
from openai import OpenAI

client = OpenAI()
md = MarkItDown(llm_client=client, llm_model="gpt-4o")
result = md.convert("example.jpg")
print(result.text_content)

# Azure Document Intelligenceを使用
md = MarkItDown(docintel_endpoint="<your-endpoint>")
result = md.convert("complex-document.pdf")

# ストリームからの変換
with open("document.pdf", "rb") as f:
    result = md.convert_stream(f)
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクトの概要、インストール方法、基本的な使用方法
- **CONTRIBUTING.md**: 貢献方法、プルリクエストの作成ガイド
- **packages/markitdown-mcp/README.md**: MCPサーバーの使用方法
- **packages/markitdown-sample-plugin/README.md**: プラグイン開発ガイド

### サンプル・デモ
- **tests/test_files/**: 各種フォーマットのテストファイル
- **Docker対応**: Dockerfileによるコンテナ化されたデモ環境
- **CLIヘルプ**: `markitdown --help`で詳細なコマンドオプション確認

### チュートリアル・ガイド
- GitHub Issuesの「open for contribution」ラベル付き課題
- プラグイン開発用のサンプルプラグイン実装
- GitHubでの#markitdown-pluginハッシュタグ検索

## 技術的詳細
### アーキテクチャ
#### 全体構造
MarkItDownは、プラガブルなコンバーターアーキテクチャを採用しています。各ファイル形式に対応する個別のコンバーターがDocumentConverterインターフェースを実装し、MarkItDownクラスがこれらを統合管理します。ファイル形式の検出にはmagikaライブラリを使用し、優先度ベースのコンバーター選択システムにより最適な変換方法を自動選択します。

#### ディレクトリ構成
```
markitdown/
├── packages/
│   ├── markitdown/           # メインパッケージ
│   │   ├── src/markitdown/   # ソースコード
│   │   │   ├── converters/   # 各種ファイル形式のコンバーター
│   │   │   └── converter_utils/  # 変換用ユーティリティ
│   │   └── tests/            # テストスイート
│   ├── markitdown-mcp/       # MCPサーバー実装
│   └── markitdown-sample-plugin/ # プラグインサンプル
├── .github/workflows/        # CI/CDパイプライン
└── scripts/                  # ユーティリティスクリプト
```

#### 主要コンポーネント
- **MarkItDown**: メインクラス、コンバーターの登録と実行を管理
  - 場所: `_markitdown.py`
  - 依存: DocumentConverter、StreamInfo、各種コンバーター
  - インターフェース: convert()、convert_local()、convert_stream()、register_converter()

- **DocumentConverter**: 全コンバーターの基底クラス
  - 場所: `_base_converter.py`
  - 依存: StreamInfo
  - インターフェース: accepts()、convert()

- **StreamInfo**: ファイルストリーム情報の管理
  - 場所: `_stream_info.py`
  - 依存: なし
  - インターフェース: copy_and_update()、get_filename_stem()

### 技術スタック
#### コア技術
- **言語**: Python 3.10以上（型ヒント、dataclasses使用）
- **フレームワーク**: なし（軽量ライブラリとして実装）
- **主要ライブラリ**: 
  - beautifulsoup4: HTML解析
  - markdownify: HTMLからMarkdownへの変換
  - magika (~0.6.1): ファイルタイプの自動検出
  - charset-normalizer: 文字エンコーディング検出
  - requests: HTTPリクエスト処理
  - defusedxml: 安全なXML解析

#### 開発・運用ツール
- **ビルドツール**: Hatchling（pyproject.toml設定）
- **テスト**: Hatchテストランナー、テストベクター方式
- **CI/CD**: GitHub Actions（tests.yml、pre-commit.yml）
- **デプロイ**: PyPI、Docker、ソースインストール対応

### 設計パターン・手法
- **Strategy パターン**: DocumentConverterインターフェースによる変換戦略の切り替え
- **Chain of Responsibility**: 優先度ベースのコンバーター選択
- **Factory パターン**: コンバーターの動的登録と生成
- **Plugin アーキテクチャ**: entry_pointsを使用したプラグインシステム
- **Lazy Loading**: 依存関係の遅延読み込みによる起動時間の最適化

### データフロー・処理フロー
1. ファイル/URL/ストリームの入力受付
2. StreamInfoによるメタデータ収集（拡張子、MIME型、文字セット）
3. magikaによるファイルタイプの自動検出
4. 優先度順にコンバーターのaccepts()メソッドを呼び出し
5. 適合するコンバーターのconvert()メソッドで変換実行
6. DocumentConverterResultとしてMarkdownテキストを返却
7. CLIの場合は標準出力またはファイルに出力

## API・インターフェース
### 公開API
#### MarkItDownクラス
- 目的: ファイル変換のメインインターフェース
- 使用例:
```python
from markitdown import MarkItDown

# 基本的な使用
md = MarkItDown()
result = md.convert("file.pdf")

# オプション付き
md = MarkItDown(
    enable_plugins=True,
    llm_client=openai_client,
    llm_model="gpt-4o",
    exiftool_path="/usr/bin/exiftool"
)
```

#### DocumentConverterインターフェース
- 目的: カスタムコンバーターの実装用
- 使用例:
```python
class MyConverter(DocumentConverter):
    def accepts(self, file_stream, stream_info, **kwargs):
        return stream_info.extension == ".myformat"
    
    def convert(self, file_stream, stream_info, **kwargs):
        # 変換ロジック
        return DocumentConverterResult(markdown="...")
```

### 設定・カスタマイズ
#### 環境変数
```bash
# ExifToolのパス指定
export EXIFTOOL_PATH="/path/to/exiftool"
```

#### 拡張・プラグイン開発
プラグインはPythonパッケージとしてentry_pointsを使用して登録:
```python
# pyproject.toml
[project.entry-points."markitdown.plugin"]
my_plugin = "my_package.plugin:MyPlugin"

# プラグインクラス
class MyPlugin:
    def register_converters(self, markitdown, **kwargs):
        markitdown.register_converter(MyConverter())
```

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ベンチマーク結果: ファイルサイズに依存、PDFminerやmammothなど外部ライブラリの性能に準拠
- 最適化手法: 
  - 依存関係の遅延読み込み
  - ストリーミング処理対応
  - メモリ効率的な変換（一時ファイル不使用）

### スケーラビリティ
- バッチ処理: 複数ファイルの並列処理は外部で実装必要
- メモリ使用: ファイルサイズに比例、大規模ファイルはストリーミングで対応
- 拡張性: プラグインシステムによる機能追加

### 制限事項
- 技術的な制限:
  - 書式情報の多くは失われる（プレーンテキスト化）
  - 複雑なレイアウトの完全な再現は不可
  - バイナリファイルのサイズ制限はメモリに依存
- 運用上の制限:
  - Windows環境でonnxruntimeのバージョン制限（<=1.20.1）
  - 一部機能は追加依存関係のインストールが必要

## 評価・所感
### 技術的評価
#### 強み
- 幅広いファイル形式のサポート（20種類以上）
- LLMフレンドリーなMarkdown出力
- 優れた拡張性（プラグインシステム）
- Microsoftによる開発とメンテナンス
- 依存関係の柔軟な管理（必要な機能のみインストール可能）
- CLIとPython API両方の提供
- MCPサーバー対応によるLLMアプリケーションとの統合

#### 改善の余地
- 書式情報の保持が限定的
- 日本語ドキュメントの不足
- 並列処理のネイティブサポートなし
- エラーハンドリングの詳細度

### 向いている用途
- LLMへの入力データ準備
- 大量ドキュメントのテキスト抽出とインデックス化
- RAG（Retrieval-Augmented Generation）システムのデータ前処理
- 様々な形式のドキュメントの統一的な処理
- 自動文書分析パイプラインの構築

### 向いていない用途
- 高精度な書式保持が必要な変換
- DTP（Desktop Publishing）用途
- 複雑なレイアウトの完全再現
- リアルタイム変換が必要な用途

### 総評
MarkItDownは、LLM時代に最適化された実用的なドキュメント変換ツールです。特にMicrosoftのAutoGenチームが開発していることから、LLMとの統合を前提とした設計になっており、RAGシステムやドキュメント分析パイプラインでの利用に優れています。プラグインシステムとオプショナルな依存関係により、必要な機能だけを選択して使用できる柔軟性も魅力です。67,000以上のスターが示すように、コミュニティからの支持も厚く、今後のLLMアプリケーション開発において重要なツールとなるでしょう。