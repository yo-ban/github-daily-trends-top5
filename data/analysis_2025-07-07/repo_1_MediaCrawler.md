# リポジトリ解析: NanmiCoder/MediaCrawler

## 基本情報
- リポジトリ名: NanmiCoder/MediaCrawler
- 主要言語: Python
- スター数: 27,967
- フォーク数: 7,094
- 最終更新: 2024年（活発に更新中）
- ライセンス: Non-Commercial Learning License 1.1
- トピックス: 自媒体爬虫, web-crawler, xiaohongshu, douyin, bilibili, kuaishou, weibo, tieba, zhihu

## 概要
### 一言で言うと
中国の主要なソーシャルメディアプラットフォーム（小紅書、抖音、快手、B站、微博、貼吧、知乎）から公開情報を収集する多機能Webクローラーツールです。

### 詳細説明
MediaCrawlerは、Playwrightブラウザ自動化フレームワークをベースとした、複数のソーシャルメディアプラットフォームに対応したデータ収集ツールです。JavaScriptの逆向工程を必要とせず、ブラウザコンテキストを保持してJavaScript表現式を通じて署名パラメータを取得することで、技術的なハードルを大幅に下げています。教育・研究目的での使用を前提とし、商業利用は禁止されています。

### 主な特徴
- 7つの主要ソーシャルメディアプラットフォームをサポート
- QRコード、電話番号、Cookieの3つのログイン方式に対応
- キーワード検索、特定投稿ID収集、クリエイター主页データ収集の3つのクロールモード
- 一級・二級コメントの収集をサポート
- IPプロキシプールによるアンチブロッキング対策
- ワードクラウド生成機能
- ログイン状態の保存・再利用
- CDP（Chrome DevTools Protocol）モードによる検出回避
- 複数のデータ保存形式（CSV、JSON、MySQL）をサポート

## 使用方法
### インストール
#### 前提条件
- Python 3.9以上
- Node.js 16.0.0以上
- uv（Pythonパッケージマネージャー、推奨）
- Playwrightがサポートするブラウザ環境

#### インストール手順
```bash
# 方法1: uvを使用（推奨）
# リポジトリをクローン
git clone https://github.com/NanmiCoder/MediaCrawler.git
cd MediaCrawler

# uvで依存関係をインストール
uv sync

# ブラウザドライバをインストール
uv run playwright install

# 方法2: 従来のPython venvを使用
# 仮想環境を作成
python -m venv venv

# 仮想環境を有効化（Linux/macOS）
source venv/bin/activate

# 仮想環境を有効化（Windows）
venv\Scripts\activate

# 依存関係をインストール
pip install -r requirements.txt

# ブラウザドライバをインストール
playwright install
```

### 基本的な使い方
#### Hello World相当の例
```bash
# 小紅書でキーワード検索（QRコードログイン）
uv run main.py --platform xhs --lt qrcode --type search --keywords "プログラミング"

# 実行後、QRコードが表示されるのでアプリでスキャンしてログイン
```

#### 実践的な使用例
```bash
# 抖音で特定の投稿IDリストから詳細情報を収集
uv run main.py --platform dy --lt qrcode --type detail

# B站でクリエイターの主页データを収集（Cookieログイン）
uv run main.py --platform bili --lt cookie --type creator --cookies "your_cookie_string"

# 微博でキーワード検索し、コメントも収集（CSV形式で保存）
uv run main.py --platform wb --lt phone --type search --keywords "技術トレンド" --save_data_option csv --get_comment true
```

### 高度な使い方
```python
# config/base_config.pyでの詳細設定例

# CDP（Chrome DevTools Protocol）モードを有効化
ENABLE_CDP_MODE = True
CDP_DEBUG_PORT = 9222

# IPプロキシを有効化
ENABLE_IP_PROXY = True
IP_PROXY_POOL_COUNT = 5
IP_PROXY_PROVIDER_NAME = "kuaidaili"

# データ収集の詳細設定
CRAWLER_MAX_NOTES_COUNT = 500  # 最大収集数
CRAWLER_MAX_COMMENTS_COUNT_SINGLENOTES = 50  # 投稿あたりの最大コメント数
ENABLE_GET_SUB_COMMENTS = True  # 二級コメントも収集

# 並行処理の設定
MAX_CONCURRENCY_NUM = 3  # 並行クローラー数
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクトの概要、インストール方法、基本的な使用方法
- **docs/index.md**: MediaCrawlerの公式ドキュメントサイトのエントリーポイント
- **docs/項目代码结构.md**: プロジェクトのディレクトリ構造とモジュールの説明
- **docs/CDP模式使用指南.md**: Chrome DevTools Protocolモードの使用ガイド
- **docs/常见问题.md**: よくある質問と解決方法
- **docs/代理使用.md**: IPプロキシの設定と使用方法
- **docs/词云图使用配置.md**: ワードクラウド生成機能の設定方法
- **オンラインドキュメント**: https://nanmicoder.github.io/MediaCrawler/

### サンプル・デモ
- **test/**: ユニットテストコード（キャッシュ、プロキシプール、ユーティリティ関数のテスト）
- **schema/tables.sql**: データベーススキーマの定義（MySQL使用時の参考）

### チュートリアル・ガイド
- **CrawlerTutorial**: https://github.com/NanmiCoder/CrawlerTutorial （無料のクローラー開発チュートリアル）
- **MediaCrawlerPro**: 商用版の紹介（より高度な機能と企業級のコード品質）
- **作者の知識付費コラム**: 詳細な使用方法とソースコードアーキテクチャの解説

## 技術的詳細
### アーキテクチャ
#### 全体構造
MediaCrawlerは、抽象基底クラスを中心としたオブジェクト指向設計を採用しています。各プラットフォームのクローラーは`AbstractCrawler`を継承し、共通のインターフェースを提供します。Playwrightによるブラウザ自動化を基盤とし、非同期処理（asyncio）で高効率なデータ収集を実現しています。

#### ディレクトリ構成
```
MediaCrawler/
├── base/                    # 抽象基底クラスと共通機能
│   └── base_crawler.py      # AbstractCrawlerクラス定義
├── media_platform/          # 各プラットフォーム実装
│   ├── xhs/                 # 小紅書クローラー
│   ├── douyin/              # 抖音クローラー
│   ├── kuaishou/            # 快手クローラー
│   ├── bilibili/            # B站クローラー
│   ├── weibo/               # 微博クローラー
│   ├── tieba/               # 貼吧クローラー
│   └── zhihu/               # 知乎クローラー
├── config/                  # 設定管理
│   ├── base_config.py       # 基本設定
│   ├── account_config.py    # アカウント・プロキシ設定
│   └── db_config.py         # データベース設定
├── model/                   # データモデル定義
├── tools/                   # ユーティリティツール
│   ├── crawler_util.py      # クローラー関連ユーティリティ
│   ├── slider_util.py       # スライダー認証対策
│   └── words.py             # ワードクラウド生成
├── libs/                    # JavaScript関連
│   ├── douyin.js            # 抖音署名関数
│   ├── zhihu.js             # 知乎署名関数
│   └── stealth.min.js       # ブラウザ自動化検出回避
└── cache/                   # キャッシュ実装
```

#### 主要コンポーネント
- **AbstractCrawler**: 全クローラーの基底クラス
  - 場所: `base/base_crawler.py`
  - 責務: ログイン、データ収集、保存の共通インターフェース定義
  - 主要メソッド: `start()`, `login()`, `search()`, `get_comments()`

- **CrawlerFactory**: クローラーインスタンス生成
  - 場所: `main.py`
  - 責務: プラットフォームに応じた適切なクローラーインスタンスの生成
  - インターフェース: `create_crawler(platform: str)`

- **各プラットフォームクローラー**: プラットフォーム固有の実装
  - 場所: `media_platform/[platform]/`
  - 構成: `client.py`（API通信）、`core.py`（ビジネスロジック）、`login.py`（認証）

### 技術スタック
#### コア技術
- **言語**: Python 3.9+（async/await、型ヒント使用）
- **ブラウザ自動化**: Playwright 1.42.0（Chromium、Firefox、WebKitサポート）
- **主要ライブラリ**: 
  - httpx (0.24.0): 非同期HTTPクライアント
  - pydantic (2.5.2): データバリデーションとモデル定義
  - aiomysql (0.2.0): 非同期MySQLクライアント
  - redis (4.6.0): キャッシュとセッション管理
  - fastapi (0.110.2): Web APIフレームワーク（補助機能用）
  - jieba (0.42.1): 中国語分詞処理
  - wordcloud (1.9.3): ワードクラウド生成
  - pyexecjs (1.5.1): JavaScript実行環境

#### 開発・運用ツール
- **パッケージ管理**: uv（高速な依存関係解決）、従来のpip/venvもサポート
- **テスト**: unittestベースのテストスイート（キャッシュ、プロキシ、ユーティリティのテスト）
- **ドキュメント**: VitePress（静的サイト生成）
- **データ保存**: CSV、JSON、MySQL（スキーマ定義付き）

### 設計パターン・手法
- **Factory Pattern**: `CrawlerFactory`によるプラットフォーム別インスタンス生成
- **Template Method Pattern**: `AbstractCrawler`で共通フローを定義、各プラットフォームで具体実装
- **Strategy Pattern**: ログイン方式（QRコード、電話、Cookie）の切り替え
- **Singleton Pattern**: 設定管理とデータベース接続
- **Async/Await Pattern**: 非同期I/O処理による効率的なデータ収集

### データフロー・処理フロー
1. **初期化フェーズ**
   - コマンドライン引数の解析
   - 設定ファイルの読み込み
   - データベース接続（必要な場合）

2. **認証フェーズ**
   - Playwrightブラウザインスタンスの起動
   - 選択されたログイン方式での認証
   - セッション情報の保存

3. **データ収集フェーズ**
   - 検索/詳細/クリエイターモードに応じた処理
   - ページネーション処理
   - コンテンツとコメントの抽出
   - 画像ダウンロード（設定による）

4. **データ保存フェーズ**
   - 選択された形式（CSV/JSON/DB）での保存
   - 重複チェック（DB使用時）
   - ワードクラウド生成（設定による）

## API・インターフェース
### 公開API
#### AbstractCrawler インターフェース
- 目的: 全プラットフォーム共通のクローラーインターフェース
- 主要メソッド:
```python
# クローラーの開始
async def start()

# ログイン処理
async def login()

# キーワード検索
async def search()

# 詳細情報取得
async def get_specified_notes()

# コメント取得
async def get_comments(note_id: str)
```

### 設定・カスタマイズ
#### 設定ファイル
```python
# config/base_config.py の主要設定項目

# プラットフォーム選択
PLATFORM = "xhs"  # xhs|dy|ks|bili|wb|tieba|zhihu

# クロールタイプ
CRAWLER_TYPE = "search"  # search|detail|creator

# ログインタイプ
LOGIN_TYPE = "qrcode"  # qrcode|phone|cookie

# データ保存形式
SAVE_DATA_OPTION = "json"  # csv|db|json

# 並行処理数
MAX_CONCURRENCY_NUM = 1

# コメント収集設定
ENABLE_GET_COMMENTS = True
ENABLE_GET_SUB_COMMENTS = False

# CDPモード設定
ENABLE_CDP_MODE = False
CDP_DEBUG_PORT = 9222
```

#### 拡張・プラグイン開発
新しいプラットフォームのサポートを追加する場合：
1. `media_platform/`に新しいディレクトリを作成
2. `AbstractCrawler`を継承したクラスを実装
3. `client.py`、`core.py`、`login.py`を実装
4. `CrawlerFactory`に新しいプラットフォームを登録

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- 非同期処理による効率的なI/O処理
- ブラウザコンテキストの再利用によるメモリ使用量の最適化
- キャッシュ機能（Redis/ローカル）によるAPI呼び出しの削減
- 並行処理数の調整可能（`MAX_CONCURRENCY_NUM`）

### スケーラビリティ
- IPプロキシプールによる大規模収集のサポート
- 複数アカウントによる負荷分散（MediaCrawlerPro版）
- データベース使用時の重複排除による効率化
- 断点続爬機能（MediaCrawlerPro版）

### 制限事項
- 商業利用は禁止（ライセンス制限）
- 各プラットフォームのrate limitとrobot.txtの遵守が必要
- Playwrightの依存によるメモリ使用量（ブラウザインスタンス）
- 大規模クロールは対象プラットフォームへの負荷を考慮する必要あり

## 評価・所感
### 技術的評価
#### 強み
- JavaScriptの逆向工程が不要で、技術的ハードルが低い
- 7つの主要プラットフォームをサポートし、統一されたインターフェースを提供
- 非同期処理による高効率なデータ収集
- CDPモードによる高度な検出回避機能
- 活発な開発とコミュニティサポート（27,000+スター）
- 詳細なドキュメントとチュートリアルの提供

#### 改善の余地
- Playwrightへの依存によるリソース使用量
- 商業版（MediaCrawlerPro）でのみ利用可能な高度な機能
- 中国のプラットフォームに特化しており、国際的なプラットフォームのサポートは限定的

### 向いている用途
- ソーシャルメディアのトレンド分析と研究
- マーケティングリサーチとコンテンツ分析
- 学術研究におけるデータ収集
- プログラミング学習とWebスクレイピング技術の習得

### 向いていない用途
- 商業目的でのデータ収集
- 大規模な自動化ビジネス
- プラットフォームの利用規約に反する活動
- リアルタイムデータストリーミング

### 総評
MediaCrawlerは、中国の主要ソーシャルメディアプラットフォームに対する包括的なデータ収集ソリューションを提供する優れたオープンソースプロジェクトです。技術的なハードルを下げつつ、実用的な機能を豊富に備えており、研究・学習目的には最適なツールといえます。活発なコミュニティと継続的な開発により、将来性も期待できるプロジェクトです。