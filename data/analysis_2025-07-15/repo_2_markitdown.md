# リポジトリ解析: microsoft/markitdown

## 基本情報
- リポジトリ名: microsoft/markitdown
- 主要言語: Python
- スター数: 61,392
- フォーク数: 3,277
- 最終更新: 活発に更新中（最新バージョン0.1.0以降も継続的に改善）
- ライセンス: MIT License
- トピックス: markdown, conversion, LLM, document-processing, text-extraction, PDF, PowerPoint, Word, Excel, OCR

## 概要
### 一言で言うと
MarkItDownは、様々なファイル形式をMarkdownに変換するPython製の軽量ユーティリティで、LLMとの統合やテキスト分析パイプラインでの使用に最適化されています。

### 詳細説明
MarkItDownは、Microsoftのチーム（Built by AutoGen Team）によって開発された文書変換ツールです。LLMおよび関連するテキスト分析パイプラインで使用するために、様々なファイルをMarkdownに変換することを目的としています。textractと比較されることが多いですが、重要な文書構造とコンテンツをMarkdown形式（見出し、リスト、表、リンクなど）として保持することに重点を置いています。人間にとっても読みやすい出力となりますが、主にテキスト分析ツールによる消費を意図しており、人間向けの高忠実度の文書変換には最適ではない場合があります。

### 主な特徴
- 20種類以上のファイル形式に対応（PDF、PowerPoint、Word、Excel、画像、音声、HTML、CSV、JSON、XML、ZIP、YouTube URL、EPubなど）
- 画像のOCRとEXIFメタデータ抽出
- 音声ファイルの文字起こし（Speech-to-Text）
- LLMとの統合（OpenAI GPT-4oなど）による画像説明生成
- Azure Document Intelligenceとの統合
- プラグインシステムによる拡張性
- MCP（Model Context Protocol）サーバー対応でClaude Desktopなどとの統合が可能
- CLIとPython APIの両方を提供
- Dockerサポート
- モジュラーなオプション依存関係（必要な機能のみインストール可能）
- トークン効率の良いMarkdown出力

## 使用方法
### インストール
#### 前提条件
- Python 3.10以上
- 仮想環境の使用を推奨
- オプション：exiftool（画像メタデータ用）、ffmpeg（音声処理用）

#### インストール手順
```bash
# 方法1: PyPIからインストール（全機能を含む）
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
# CLIでPDFをMarkdownに変換
markitdown example.pdf > document.md

# または出力ファイルを指定
markitdown example.pdf -o document.md

# パイプを使用
cat example.pdf | markitdown
```

#### 実践的な使用例
```python
# Python APIを使用した基本的な変換
from markitdown import MarkItDown

md = MarkItDown()
result = md.convert("presentation.pptx")
print(result.text_content)

# 画像からテキストを抽出（OCR）
result = md.convert("screenshot.png")
print(result.text_content)

# YouTubeビデオの文字起こしを取得
result = md.convert("https://www.youtube.com/watch?v=example")
print(result.text_content)
```

### 高度な使い方
```python
# LLMを使用した画像説明の生成
from markitdown import MarkItDown
from openai import OpenAI

client = OpenAI()
md = MarkItDown(llm_client=client, llm_model="gpt-4o")
result = md.convert("complex-diagram.jpg")
print(result.text_content)  # AIが生成した画像の説明を含む

# Azure Document Intelligenceを使用
md = MarkItDown(docintel_endpoint="<your-endpoint>")
result = md.convert("scanned-document.pdf")
print(result.text_content)

# プラグインを有効化
md = MarkItDown(enable_plugins=True)
result = md.convert("custom-format.xyz")  # サードパーティプラグインで処理
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクトの概要、インストール方法、基本的な使用方法、コントリビューション方法
- **packages/markitdown/README.md**: コアパッケージの詳細説明
- **packages/markitdown-mcp/README.md**: MCP（Model Context Protocol）サーバーの設定と使用方法
- **packages/markitdown-sample-plugin/README.md**: プラグイン開発のガイドとサンプル
- **SECURITY.md**: セキュリティポリシー（未編集のテンプレート）
- **CODE_OF_CONDUCT.md**: Microsoft Open Source Code of Conduct

### サンプル・デモ
- **packages/markitdown/tests/test_files/**: 各種フォーマットのテストファイル（PDF、Word、Excel、画像、音声など）
- **packages/markitdown-sample-plugin/**: プラグイン開発のサンプル実装（RTFファイル対応）
- **CLIの使用例**: README内に豊富なCLI使用例
- **Python APIの使用例**: README内にコード例

### チュートリアル・ガイド
- インストールガイド（仮想環境の設定方法を含む）
- オプション依存関係の説明と選択方法
- プラグイン開発ガイド
- Dockerを使用した実行方法
- Claude Desktopとの統合方法
- 開発者向けテスト実行ガイド

## 技術的詳細
### アーキテクチャ
#### 全体構造
MarkItDownは、プラグイン可能なコンバーターアーキテクチャを採用しています。メインのMarkItDownクラスが変換要求を受け取り、登録されたコンバーターの中から適切なものを選択して変換を実行します。各コンバーターは独立したモジュールとして実装され、特定のファイル形式の処理を担当します。

#### ディレクトリ構成
```
markitdown/
├── packages/
│   ├── markitdown/           # コアパッケージ
│   │   ├── src/markitdown/
│   │   │   ├── converters/   # 各種ファイル形式のコンバーター
│   │   │   ├── converter_utils/  # コンバーター用ユーティリティ
│   │   │   ├── _markitdown.py    # メインクラス
│   │   │   ├── _base_converter.py # 基底コンバータークラス
│   │   │   └── __main__.py       # CLIエントリーポイント
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
  - インターフェース: `convert()`, `convert_stream()`, `register_converter()`

- **DocumentConverter**: 全コンバーターの基底クラス
  - 場所: `_base_converter.py`
  - インターフェース: `accepts()`, `convert()`

- **各種コンバーター**: ファイル形式別の変換実装
  - PdfConverter: PDFMinerを使用
  - DocxConverter: mammothライブラリを使用
  - XlsxConverter: pandasとopenpyxlを使用
  - ImageConverter: EXIFメタデータとOCR（オプション）
  - AudioConverter: 音声文字起こし（SpeechRecognition）
  - その他20種類以上のコンバーター

- **プラグインシステム**: entry_pointsベースの拡張機構
  - 場所: `_markitdown.py`の`_load_plugins()`
  - サードパーティ拡張をサポート

### 技術スタック
#### コア技術
- **言語**: Python 3.10以上（3.10、3.11、3.12、3.13をサポート）
- **パッケージ管理**: Hatchling（PEP 517準拠のビルドバックエンド）
- **主要ライブラリ**: 
  - beautifulsoup4: HTML解析
  - requests: HTTP通信
  - markdownify: HTMLからMarkdownへの変換
  - magika (~0.6.1): ファイルタイプ検出
  - charset-normalizer: 文字エンコーディング検出
  - defusedxml: 安全なXML解析

#### オプション依存関係（機能別）
- **PDF**: pdfminer.six
- **Word文書**: mammoth、lxml
- **Excel**: pandas、openpyxl（xlsx）、xlrd（xls）
- **PowerPoint**: python-pptx
- **画像OCR**: 外部ツール（exiftool）
- **音声**: pydub、SpeechRecognition、ffmpeg
- **YouTube**: youtube-transcript-api (~1.0.0)
- **Azure**: azure-ai-documentintelligence、azure-identity
- **Outlook**: olefile

#### 開発・運用ツール
- **ビルドツール**: Hatch（環境管理、テスト実行、パッケージング）
- **テスト**: pytest（hatchで管理）、カバレッジ測定
- **型チェック**: mypy
- **コード品質**: pre-commit（コミット前チェック）
- **CI/CD**: GitHub Actions（推測）
- **デプロイ**: PyPI、Docker Hub

### 設計パターン・手法
- **Strategy Pattern**: 各コンバーターが独立した戦略として実装
- **Plugin Architecture**: entry_pointsを使用した拡張可能な設計
- **Priority-based Selection**: コンバーターの優先度による選択メカニズム
- **Lazy Loading**: プラグインの遅延読み込み
- **Stream Processing**: ファイルパスではなくストリームで処理（一時ファイル不要）
- **Defensive Programming**: 依存関係の欠如をグレースフルに処理

### データフロー・処理フロー
1. **入力受付**: ファイルパス、URL、またはバイナリストリームを受け取る
2. **ファイルタイプ検出**: Magikaとmetadata（MIME type、拡張子）で判定
3. **コンバーター選択**: 
   - 登録されたコンバーターを優先度順に確認
   - `accepts()`メソッドで処理可能か判定
4. **変換実行**: 
   - 選択されたコンバーターの`convert()`を呼び出し
   - 必要に応じて外部ライブラリやツールを使用
5. **後処理**: 
   - data URIの除去（オプション）
   - LLMによる追加処理（画像説明など）
6. **結果返却**: DocumentConverterResultオブジェクトとして返す

## API・インターフェース
### 公開API
#### Python API (MarkItDown class)
- 目的: プログラムからファイル変換を実行
- 主要メソッド:
```python
# 基本的な変換
md = MarkItDown(enable_plugins=False)
result = md.convert("file.pdf")
print(result.text_content)  # Markdown形式のテキスト

# ストリーム変換
with open("file.pdf", "rb") as f:
    result = md.convert_stream(f, stream_info=StreamInfo(extension=".pdf"))

# カスタムコンバーターの登録
md.register_converter(MyCustomConverter(), priority=5.0)
```

#### CLI インターフェース
- 目的: コマンドラインからの変換実行
- 主要オプション:
```bash
markitdown [filename] [options]
  -o, --output         出力ファイル名
  -x, --extension      ファイル拡張子のヒント
  -m, --mime-type      MIMEタイプのヒント
  -c, --charset        文字セットのヒント
  -d, --use-docintel   Document Intelligenceを使用
  -p, --use-plugins    サードパーティプラグインを使用
  --list-plugins       インストール済みプラグインをリスト
  --keep-data-uris     data URIを保持
```

### 設定・カスタマイズ
#### 環境変数
```bash
# exiftoolのパスを指定
export EXIFTOOL_PATH=/usr/bin/exiftool

# ffmpegのパスを指定（Dockerfileで設定）
export FFMPEG_PATH=/usr/bin/ffmpeg
```

#### 拡張・プラグイン開発
1. **プラグインの作成**:
   - DocumentConverterを継承したクラスを実装
   - `accepts()`と`convert()`メソッドを実装
   - pyproject.tomlでentry_pointとして登録

2. **プラグインの例**:
```python
# _plugin.py
from markitdown import DocumentConverter, DocumentConverterResult

class RtfConverter(DocumentConverter):
    def accepts(self, file_stream, stream_info, **kwargs):
        return stream_info.extension == ".rtf"
    
    def convert(self, file_stream, stream_info, **kwargs):
        # RTFをMarkdownに変換する処理
        return DocumentConverterResult(markdown="# Converted RTF")
```

3. **entry_point登録**:
```toml
[project.entry-points."markitdown.plugin"]
rtf = "markitdown_sample_plugin:RtfConverter"
```

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- 軽量設計：コア依存関係を最小限に抑制
- モジュラー依存：必要な機能のみをインストール可能
- ストリーム処理：大きなファイルでもメモリ効率的
- 一時ファイル不要：すべての処理をメモリ内で実行

### スケーラビリティ
- バッチ処理：複数ファイルの連続処理が可能
- ZIPファイル対応：アーカイブ内の全ファイルを再帰的に処理
- MCP/SSEサーバー：複数クライアントからの同時リクエストに対応
- Dockerコンテナ：スケーラブルなデプロイメント

### 制限事項
- 高忠実度変換には不向き（構造保持を優先）
- 一部の複雑なレイアウトは正確に再現されない
- 外部ツール（exiftool、ffmpeg）への依存
- LLM機能使用時はAPIレート制限の影響を受ける
- Windows環境でonnxruntimeのバージョン制限（<=1.20.1）
- MCPサーバーは認証機能なし（localhostでの実行を推奨）

## 評価・所感
### 技術的評価
#### 強み
- 豊富なファイル形式サポート（20種類以上）
- 優れた拡張性（プラグインシステム、MCP対応）
- LLM最適化されたMarkdown出力
- モジュラーな依存関係管理
- 活発な開発とコミュニティ（6万以上のスター）
- Microsoftによる開発で信頼性が高い
- Docker対応によるポータビリティ
- ストリーム処理による効率的なメモリ使用

#### 改善の余地
- SUPPORT.mdが未編集のテンプレート状態
- 一部のコンバーターで外部ツール依存
- 高忠実度の文書変換には限界
- MCPサーバーの認証機能が未実装
- ドキュメントの一部が不完全

### 向いている用途
- LLMへの文書入力準備
- 大量文書の一括テキスト抽出
- 異種文書形式の統一的な処理
- テキスト分析パイプラインの前処理
- チャットボットやAIアシスタントとの統合
- 文書検索システムのインデックス作成
- 自動文書要約システムの入力処理

### 向いていない用途
- 印刷品質の文書変換
- 複雑なレイアウトの完全保持が必要な場合
- リアルタイム変換が必要な高負荷環境
- セキュリティが極めて重要な環境（認証機能なし）
- オフライン完結が必須の環境（一部機能は外部API依存）

### 総評
MarkItDownは、LLM時代に最適化された優れた文書変換ツールです。特に、様々なファイル形式をLLMが理解しやすいMarkdown形式に変換する点で、他のツールと一線を画しています。Microsoftの支援による活発な開発、6万を超えるGitHubスター、豊富な機能と拡張性により、AIアプリケーション開発において重要なツールとなっています。特にMCP対応によりClaude Desktopなどとのシームレスな統合が可能な点は、実用性の高さを示しています。ただし、レイアウト保持よりもコンテンツ抽出を重視する設計のため、用途を選ぶ点には注意が必要です。