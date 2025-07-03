# リポジトリ解析: NanmiCoder/MediaCrawler

## 基本情報
- リポジトリ名: NanmiCoder/MediaCrawler
- 主要言語: Python
- スター数: 25,067
- フォーク数: 6,726
- 最終更新: アクティブにメンテナンス中
- ライセンス: NON-COMMERCIAL LEARNING LICENSE 1.1（非商業学習使用許諾証）
- トピックス: 自媒体プラットフォームクローラー、小紅書、抖音、快手、B站、微博、貼吧、知乎

## 概要
### 一言で言うと
Playwrightを活用した多プラットフォーム対応の自媒体データ収集ツールで、JS逆向不要で主要なSNSプラットフォームの公開情報を効率的に収集できるシステム。

### 詳細説明
MediaCrawlerは、中国の主要なソーシャルメディアプラットフォーム（小紅書、抖音、快手、B站、微博、貼吧、知乎）から公開データを収集するための教育・学習目的のオープンソースツールです。Playwrightブラウザ自動化フレームワークをベースに、ログイン状態を保持しながらJS表現で署名パラメータを取得することで、複雑な暗号化アルゴリズムの逆向を必要とせず、技術的な敷居を大幅に下げています。

### 主な特徴
- 7つの主要プラットフォームに対応（小紅書、抖音、快手、B站、微博、貼吧、知乎）
- キーワード検索、指定投稿ID収集、クリエイターページクローリング対応
- 二級コメント収集機能
- ログイン状態のキャッシュ機能
- IPプロキシプール対応
- コメントからワードクラウド生成機能
- 複数のデータ保存形式対応（MySQL、CSV、JSON）
- Chrome DevTools Protocol (CDP) モード対応
- QRコード、電話番号、Cookieによるログイン方式
- 断点続爬機能（Pro版）
- マルチアカウント対応（Pro版）

## 使用方法
### インストール
#### 前提条件
- Python 3.9.6+（推奨）
- Node.js >= 16.0.0（抖音、知乎爬取に必要）
- uv（Pythonパッケージ管理ツール、推奨）
- ChromeまたはEdgeブラウザ（CDPモード使用時）

#### インストール手順
```bash
# 方法1: uvを使用（推奨）
# リポジトリをクローン
git clone https://github.com/NanmiCoder/MediaCrawler.git
cd MediaCrawler

# uvで依存関係をインストール
uv sync

# ブラウザドライバーをインストール
uv run playwright install

# 方法2: Python venvを使用（非推奨）
# 仮想環境を作成
python -m venv venv

# 仮想環境を有効化（macOS/Linux）
source venv/bin/activate
# Windowsの場合
venv\Scripts\activate

# 依存関係をインストール
pip install -r requirements.txt

# Playwrightブラウザドライバーをインストール
playwright install
```

### 基本的な使い方
#### Hello World相当の例
```bash
# 最小限の使用例 - 小紅書でキーワード検索
uv run main.py --platform xhs --lt qrcode --type search

# QRコードが表示されるので、小紅書アプリでスキャンしてログイン
# config/base_config.pyのKEYWORDSで指定したキーワードを検索
```

#### 実践的な使用例
```python
# config/base_config.py の設定例
PLATFORM = "xhs"  # プラットフォーム選択
KEYWORDS = "編程副業,編程兼職"  # 検索キーワード
CRAWLER_TYPE = "search"  # 収集タイプ
ENABLE_GET_COMMENTS = True  # コメント収集を有効化
SAVE_DATA_OPTION = "db"  # MySQLに保存

# 指定投稿IDで詳細情報を取得
NOTE_ID_LIST = [
    "665f07cf000000001e01d2e5",
    "663b4b7b000000001a01c6a8"
]
CRAWLER_TYPE = "detail"

# コマンド実行
uv run main.py --platform xhs --lt qrcode --type detail
```

### 高度な使い方
```python
# CDPモードでローカルChromeを使用した収集
# config/base_config.py
ENABLE_CDP_MODE = True  # CDPモードを有効化
CDP_DEBUG_PORT = 9222
CUSTOM_BROWSER_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# IPプロキシを使用した大量収集
ENABLE_IP_PROXY = True
IP_PROXY_POOL_COUNT = 10
IP_PROXY_PROVIDER_NAME = "kuaidaili"

# クリエイターの全投稿収集
CREATOR_ID_LIST = [
    "5f2ad3d50000000001008fe6",  # クリエイターID
]
CRAWLER_TYPE = "creator"

# バッチ処理で複数プラットフォームを順次収集
for platform in ["xhs", "dy", "ks", "bili"]:
    os.system(f"uv run main.py --platform {platform} --lt cookie --type search")
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、インストール方法、使用例
- **docs/CDPモード使用指南.md**: Chrome DevTools Protocolモードの詳細説明
- **docs/代理使用.md**: IPプロキシプールの設定方法
- **docs/詞云図使用配置.md**: コメントからワードクラウドを生成する方法
- **オンラインドキュメント**: https://nanmicoder.github.io/MediaCrawler/

### サンプル・デモ
- **config/base_config.py**: 設定ファイルのサンプル（中文コメント付き）
- **media_platform/**: 各プラットフォームの実装例

### チュートリアル・ガイド
- **CrawlerTutorial**: https://github.com/NanmiCoder/CrawlerTutorial（無料爬虫教程）
- **微信交流群**: コミュニティサポート
- **知識付費コラム**: MediaCrawlerProのソースコード設計やアーキテクチャの学習

## 技術的詳細
### アーキテクチャ
#### 全体構造
プラグイン可能なモジュラーアーキテクチャを採用し、各プラットフォームの実装が独立したモジュールとして構成されています。Factoryパターンを用いてプラットフォーム固有のクローラーを生成し、抽象基底クラスによる統一されたインターフェースを提供しています。

#### ディレクトリ構成
```
MediaCrawler/
├── main.py           # エントリーポイント
├── base/             # 基底クラスと共通機能
│   └── base_crawler.py  # 抽象基底クラス
├── media_platform/   # プラットフォーム別実装
│   ├── xhs/         # 小紅書
│   ├── douyin/      # 抖音
│   ├── kuaishou/    # 快手
│   ├── bilibili/    # B站
│   ├── weibo/       # 微博
│   ├── tieba/       # 貼吧
│   └── zhihu/       # 知乎
├── config/           # 設定管理
│   └── base_config.py   # メイン設定ファイル
├── store/            # データ保存モジュール
├── tools/            # ユーティリティ
├── cache/            # キャッシュ管理
├── proxy/            # プロキシ管理
├── docs/             # ドキュメント
└── test/             # テストコード
```

#### 主要コンポーネント
- **AbstractCrawler**: クローラー基底クラス
  - 場所: `base/base_crawler.py`
  - 機能: start(), search(), launch_browser()などの抽象メソッド定義
  - 継承: 各プラットフォームクローラーが実装

- **CrawlerFactory**: クローラー生成ファクトリ
  - 場所: `main.py`
  - 機能: プラットフォーム名から適切なクローラーを生成
  - 対応: xhs, dy, ks, bili, wb, tieba, zhihu

- **AbstractLogin**: ログイン機能の抽象クラス
  - 場所: `base/base_crawler.py`
  - 機能: QRコード、携帯番号、Cookieログイン

- **AbstractStore**: データ保存抽象クラス
  - 場所: `base/base_crawler.py`
  - 機能: コンテンツ、コメント、クリエイター情報の保存

### 技術スタック
#### コア技術
- **言語**: Python 3.9.6+（async/await、型ヒント、dataclass等を活用）
- **ブラウザ自動化**: Playwright 1.42.0（クロスブラウザ対応、CDPモードサポート）
- **主要ライブラリ**:
  - httpx (0.24.0): 非同期HTTPクライアント
  - pydantic (2.5.2): データバリデーションと設定管理
  - aiomysql (0.2.0): 非同期MySQLクライアント
  - redis (4.6.0): キャッシュとセッション管理
  - fastapi (0.110.2) + uvicorn (0.29.0): Web APIサーバー
  - pyexecjs (1.5.1): JavaScriptコード実行（抖音、知乎の署名計算）
  - jieba (0.42.1) + wordcloud (1.9.3): 中国語分詞とワードクラウド生成
  - parsel (1.9.1): HTML/XML解析

#### 開発・運用ツール
- **パッケージ管理**: uv（推奨）またはpip + venv
- **ブラウザドライバー**: Playwrightによる自動インストール
- **データ保存**: MySQL、CSV、JSONのマルチフォーマット対応
- **環境設定**: python-dotenvによる.envファイル管理
- **Node.js**: 抖音、知乎のJSコード実行用

### 設計パターン・手法
- **Factoryパターン**: CrawlerFactoryによるプラットフォーム別クローラーの生成
- **Abstract Base Class**: クローラー、ログイン、ストレージの抽象化
- **非同期処理**: asyncioベースの非同期クローリング
- **セッション管理**: Playwrightのブラウザコンテキストによるログイン状態保持
- **モジュール化**: プラットフォームごとに独立したモジュール設計

### データフロー・処理フロー
1. **初期化**: コマンドライン引数解析、設定読み込み
2. **DB初期化**: MySQL使用時のテーブル作成
3. **クローラー生成**: Factoryパターンでプラットフォーム固有クローラーを生成
4. **ブラウザ起動**: PlaywrightまたはCDPモードでブラウザを起動
5. **ログイン処理**: QRコード/電話/Cookieでログイン
6. **クローリング実行**:
   - 検索モード: キーワード検索 → 投稿一覧取得 → 詳細情報収集
   - 詳細モード: 指定IDの投稿詳細とコメント収集
   - クリエイターモード: クリエイターの全投稿収集
7. **データ保存**: MySQL/CSV/JSONへの保存
8. **後処理**: DBクローズ、ブラウザ終了

## API・インターフェース
### 公開API
#### コマンドラインインターフェース
- 目的: クローラーの起動と設定
- 使用例:
```bash
# 基本コマンド
uv run main.py --platform <プラットフォーム> --lt <ログイン方式> --type <クローリングタイプ>

# パラメータ
--platform: xhs, dy, ks, bili, wb, tieba, zhihu
--lt: qrcode, phone, cookie
--type: search, detail, creator
```

### 設定・カスタマイズ
#### 設定ファイル
```python
# config/base_config.py
PLATFORM = "xhs"  # プラットフォーム選択
KEYWORDS = "キーワード1,キーワード2"  # 検索キーワード
LOGIN_TYPE = "qrcode"  # ログイン方式
CRAWLER_TYPE = "search"  # クローリングタイプ

# 高度な設定
ENABLE_GET_COMMENTS = True  # コメント収集を有効化
ENABLE_IP_PROXY = False  # IPプロキシ使用
ENABLE_CDP_MODE = False  # CDPモード使用
HEADLESS = False  # ヘッドレスモード
SAVE_DATA_OPTION = "json"  # csv, db, json

# CDPモード設定
CDP_DEBUG_PORT = 9222
CUSTOM_BROWSER_PATH = ""  # 空の場合自動検出
```

#### 拡張・プラグイン開発
- 新プラットフォームの追加: AbstractCrawlerを継承して実装
- カスタムストレージ: AbstractStoreを継承して新しい保存形式を追加
- プロキシプロバイダー: proxyモジュールに新しいプロバイダーを追加

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- 非同期処理による効率的なクローリング
- スリープ時間設定可能（CRAWLER_MAX_SLEEP_SEC）
- ブラウザコンテキストの再利用による高速化
- Redisキャッシュによるデータ重複回避

### スケーラビリティ
- IPプロキシプールによる大量クローリング対応
- 複数アカウントの並列処理（Pro版）
- 断点続爬機能による中断・再開対応（Pro版）
- バッチ処理による複数プラットフォーム対応

### 制限事項
- 非商業利用のみ（ライセンスによる制限）
- 大規模クローリングやプラットフォームの運営妨害は禁止
- プラットフォームのrobots.txtルールを遵守する必要あり
- 一部プラットフォームではスライド验証が必要
- Node.js環境が必要（抖音、知乎）

## 評価・所感
### 技術的評価
#### 強み
- Playwrightを活用したJS逆向不要のアプローチにより、技術的敷居が低い
- 7つの主要プラットフォームに統一インターフェースで対応
- モジュラー設計により新プラットフォームの追加が容易
- CDPモードによる反検出対策の強化
- 多様なデータ保存形式と豊富な機能
- 活発なコミュニティと継続的なメンテナンス

#### 改善の余地
- 英語ドキュメントの不足（主に中国語）
- テストカバレッジの向上
- エラーハンドリングの強化
- 国際的なプラットフォームへの対応

### 向いている用途
- ソーシャルメディアのデータ分析や研究
- マーケティングリサーチとトレンド分析
- コンテンツクリエイターのパフォーマンス分析
- クローリング技術の学習と研究
- 中国語コンテンツの収集と分析

### 向いていない用途
- 商業利用（ライセンス制限）
- 大規模クローリングやDDoS攻撃
- プライバシー侵害や不正なデータ収集
- リアルタイムモニタリング

### 総評
MediaCrawlerは、中国の主要ソーシャルメディアプラットフォームに対応した非常に完成度の高いデータ収集ツールです。Playwrightを使用したJS逆向不要のアプローチは革新的で、多くの開発者にとって魅力的です。特に、ログイン状態の保持、IPプロキシ対応、ワードクラウド生成などの機能は実用的です。ただし、ライセンスが非商業学習目的に限定されている点に注意が必要です。コードのアーキテクチャもよく設計されており、拡張性が高く、クローリング技術の学習教材としても優れています。