# リポジトリ解析: NanmiCoder/MediaCrawler

## 基本情報
- リポジトリ名: NanmiCoder/MediaCrawler
- 主要言語: Python
- スター数: 25,697
- フォーク数: 6,803
- 最終更新: 2024年（アクティブに更新中）
- ライセンス: Non-Commercial Learning License 1.1
- トピックス: 中国SNS, クローラー, 小红书, 抖音, 快手, B站, 微博, 贴吧, 知乎

## 概要
### 一言で言うと
中国の主要SNSプラットフォーム（小红书、抖音、快手、B站、微博、贴吧、知乎）から公開情報を収集する強力なマルチプラットフォームクローラーツール。

### 詳細説明
MediaCrawlerは、中国の主要なソーシャルメディアプラットフォームからデータを収集するためのPythonベースのクローリングツールです。Playwrightブラウザ自動化技術を使用して、JavaScriptリバースエンジニアリングを必要とせずに、ログイン状態を維持しながら効率的にデータを収集できます。教育・研究目的に特化して設計されており、大規模なクローリングやプラットフォームへの運営妨害を防ぐための制限が設けられています。

### 主な特徴
- **JSリバースエンジニアリング不要**: Playwrightによるブラウザ自動化でシンプルな実装
- **複数のクローリングモード**: キーワード検索、投稿詳細、クリエイター主ページデータ収集
- **多様なログイン方法**: QRコード、電話番号、Cookieによるログイン対応
- **柔軟なデータ保存**: MySQL、CSV、JSONフォーマットでのエクスポート
- **高度な機能**: IPプロキシプール、コメント（サブコメント含む）収集、ワードクラウド生成
- **CDP（Chrome DevTools Protocol）モード**: より良いアンチ検出能力
- **7つの主要プラットフォーム対応**: 小红书、抖音、快手、B站、微博、百度贴吧、知乎

## 使用方法
### インストール
#### 前提条件
- Python >= 3.9（3.9.6でテスト済み）
- Node.js >= 16.0.0（抖音と知乎で必要）
- Chrome/Edge ブラウザ（CDP機能使用時）

#### インストール手順
```bash
# 方法1: uv使用（推奨）
# uvをインストール後
cd MediaCrawler
uv sync
uv run playwright install

# 方法2: 従来のpip使用
cd MediaCrawler
python -m venv venv
source venv/bin/activate  # Windowsの場合: venv\Scripts\activate
pip install -r requirements.txt
playwright install
```

### 基本的な使い方
#### Hello World相当の例
```bash
# 小红书でキーワード検索（QRコードログイン）
uv run main.py --platform xhs --lt qrcode --type search --keywords "プログラミング"
```

#### 実践的な使用例
```bash
# 抖音で複数キーワード検索、コメント収集、CSV保存
uv run main.py --platform dy --lt qrcode --type search \
  --keywords "AI,機械学習,Python" \
  --get_comment yes \
  --save_data_option csv

# 特定の投稿詳細を取得（Cookie使用）
uv run main.py --platform xhs --lt cookie --type detail \
  --cookies "a1=xxx; webId=xxx;"

# クリエイターのホームページデータ収集
uv run main.py --platform bili --lt phone --type creator
```

### 高度な使い方
```python
# config/base_config.pyでの詳細設定例
PLATFORM = "xhs"
KEYWORDS = "プログラミング副業,プログラミング兼業"
LOGIN_TYPE = "qrcode"
CRAWLER_TYPE = "search"

# 高度な設定
ENABLE_GET_COMMENTS = True  # コメント収集有効化
ENABLE_GET_SUB_COMMENTS = True  # サブコメント収集有効化
CRAWLER_MAX_NOTES_COUNT = 1000  # 最大収集投稿数
CRAWLER_MAX_SLEEP_SEC = 2  # リクエスト間隔（秒）

# プロキシ設定
ENABLE_IP_PROXY = True
IP_PROXY_POOL_COUNT = 5
IP_PROXY_PROVIDER_NAME = "kuaidaili"

# CDP モード設定（アンチ検出強化）
ENABLE_CDP_MODE = True
CDP_DEBUG_PORT = 9222
CDP_HEADLESS = False
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要と基本的な使用方法（中国語）
- **README_en.md**: 英語版ドキュメント
- **README_es.md**: スペイン語版ドキュメント
- **CLAUDE.local.md**: Claude AI向け開発ガイド
- **docs/CDP模式使用指南.md**: CDPモードの詳細な使用ガイド
- **docs/代理使用.md**: プロキシ設定と使用方法
- **docs/項目代码结构.md**: プロジェクトコード構造の詳細説明
- **docs/常見問題.md**: よくある質問とトラブルシューティング

### サンプル・デモ
- **test/test_utils.py**: ユーティリティ関数のテストコード
- **test/test_proxy_ip_pool.py**: プロキシプールのテスト実装
- **test/test_redis_cache.py**: Redisキャッシュのテスト実装

### チュートリアル・ガイド
- **docs/原生環境管理文档.md**: ネイティブ環境のセットアップガイド
- **docs/手机号登录説明.md**: 電話番号ログインの詳細手順
- **docs/词云图使用配置.md**: ワードクラウド生成の設定方法
- **MediaCrawlerPro訂閲**: エンタープライズ版の機能紹介

## 技術的詳細
### アーキテクチャ
#### 全体構造
MediaCrawlerは抽象ファクトリーパターンを採用し、プラットフォームごとに独立したクローラー実装を提供します。Playwrightによるブラウザ自動化を基盤とし、非同期処理で効率的なデータ収集を実現しています。

#### ディレクトリ構成
```
MediaCrawler/
├── base/                 # 抽象基底クラス
│   └── base_crawler.py   # AbstractCrawler定義
├── media_platform/       # プラットフォーム別実装
│   ├── xhs/             # 小红书クローラー
│   ├── douyin/          # 抖音クローラー
│   ├── kuaishou/        # 快手クローラー
│   ├── bilibili/        # B站クローラー
│   ├── weibo/           # 微博クローラー
│   ├── tieba/           # 贴吧クローラー
│   └── zhihu/           # 知乎クローラー
├── config/              # 設定ファイル
│   ├── base_config.py   # 基本設定
│   └── db_config.py     # データベース設定
├── model/               # データモデル定義
├── tools/               # ユーティリティ関数
├── cache/               # キャッシュ実装
├── proxy/               # プロキシ管理
├── store/               # データストレージ
└── libs/                # 外部ライブラリ（JS等）
```

#### 主要コンポーネント
- **CrawlerFactory**: プラットフォーム別クローラーのファクトリークラス
  - 場所: `main.py`
  - 依存: 各プラットフォームのクローラー実装
  - インターフェース: `create_crawler(platform: str)`

- **AbstractCrawler**: すべてのクローラーの基底クラス
  - 場所: `base/base_crawler.py`
  - 依存: Playwright、httpx
  - インターフェース: `start()`, `search()`, `get_note_detail()`

- **AbstractStore**: データストレージの抽象インターフェース
  - 場所: `store/`ディレクトリ
  - 依存: aiomysql、aiofiles
  - インターフェース: `save_data()`, `store_content()`

### 技術スタック
#### コア技術
- **言語**: Python >= 3.9（非同期プログラミング、型ヒント使用）
- **フレームワーク**: FastAPI 0.110.2（WebAPI提供）
- **主要ライブラリ**: 
  - Playwright (1.42.0): ブラウザ自動化、アンチ検出回避
  - httpx (0.24.0): 非同期HTTPクライアント
  - Pydantic (2.5.2): データバリデーション、型安全性
  - aiomysql (0.2.0): 非同期MySQLクライアント
  - Redis (4.6.0): キャッシュ、セッション管理
  - jieba (0.42.1): 中国語テキスト分析
  - wordcloud (1.9.3): ワードクラウド生成

#### 開発・運用ツール
- **パッケージ管理**: uv（高速Python パッケージマネージャー）またはpip
- **テスト**: pytest（ユニットテスト）
- **コード品質**: mypy（型チェック）
- **ブラウザ**: Chrome/Edge（CDPモード対応）

### 設計パターン・手法
- **抽象ファクトリーパターン**: `CrawlerFactory`でプラットフォーム別クローラーを生成
- **テンプレートメソッドパターン**: `AbstractCrawler`で共通処理を定義
- **シングルトンパターン**: 設定管理とキャッシュインスタンス
- **非同期プログラミング**: asyncio使用で並行処理を実現
- **依存性注入**: 設定とサービスの疎結合

### データフロー・処理フロー
1. **初期化**: コマンドライン引数解析 → 設定読み込み → クローラー生成
2. **認証**: ログイン方法選択（QRコード/電話/Cookie） → セッション確立
3. **データ収集**: 
   - 検索モード: キーワード入力 → 検索実行 → 結果解析
   - 詳細モード: URL/ID入力 → 投稿詳細取得
   - クリエイターモード: プロフィール → 投稿一覧取得
4. **データ処理**: レスポンス解析 → データモデル変換 → 重複チェック
5. **保存**: フォーマット選択（CSV/JSON/DB） → データ永続化

## API・インターフェース
### 公開API
#### コマンドラインインターフェース
- 目的: クローラーの実行と制御
- 使用例:
```bash
# 基本的な使用方法
python main.py [OPTIONS]

# オプション:
--platform: プラットフォーム選択 (xhs|dy|ks|bili|wb|tieba|zhihu)
--lt: ログインタイプ (qrcode|phone|cookie)
--type: クローラータイプ (search|detail|creator)
--keywords: 検索キーワード（カンマ区切り）
--get_comment: コメント収集 (yes|no)
--save_data_option: 保存形式 (csv|db|json)
```

### 設定・カスタマイズ
#### 設定ファイル
```python
# config/base_config.py の主要設定項目
PLATFORM = "xhs"  # デフォルトプラットフォーム
KEYWORDS = "キーワード1,キーワード2"  # 検索キーワード
LOGIN_TYPE = "qrcode"  # ログイン方法
CRAWLER_TYPE = "search"  # クローリングタイプ

# 高度な設定
ENABLE_GET_COMMENTS = True  # コメント収集
CRAWLER_MAX_NOTES_COUNT = 1000  # 最大収集数
HEADLESS = False  # ヘッドレスモード

# プロキシ設定
ENABLE_IP_PROXY = False  # プロキシ使用
IP_PROXY_POOL_COUNT = 2  # プロキシプール数

# CDP設定
ENABLE_CDP_MODE = False  # CDPモード有効化
CDP_DEBUG_PORT = 9222  # デバッグポート
```

#### 拡張・プラグイン開発
新しいプラットフォームを追加する場合：
1. `media_platform/`に新しいディレクトリを作成
2. `AbstractCrawler`を継承したクラスを実装
3. 必要なメソッドを実装（`start()`, `search()`, `get_note_detail()`等）
4. `CrawlerFactory`に新しいプラットフォームを登録

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- 非同期処理による高速化: 複数リクエストの並行処理
- レート制限: `CRAWLER_MAX_SLEEP_SEC`で調整可能（デフォルト2秒）
- 並行実行数: `MAX_CONCURRENCY_NUM`で制御
- キャッシュ: LocalCacheとRedisCacheによる重複処理削減

### スケーラビリティ
- プロキシプール: 大規模収集時のIP分散対応
- データベース保存: MySQLによる大量データの効率的管理
- 非同期アーキテクチャ: I/O待機時間の最小化
- CDP モード: 複数ブラウザインスタンスの並行実行可能

### 制限事項
- **技術的な制限**:
  - Playwrightの依存によるメモリ使用量
  - ブラウザベースのため、APIベースより処理速度が劣る
  - 各プラットフォームのレート制限
- **運用上の制限**:
  - ライセンス: 商用利用不可、教育・研究目的のみ
  - 大規模クローリング禁止
  - プラットフォームのToSとrobots.txt遵守必須
  - 運営妨害となる行為の禁止

## 評価・所感
### 技術的評価
#### 強み
- **統一インターフェース**: 7つの異なるプラットフォームを同一のAPIで操作可能
- **アンチ検出対策**: Playwrightとstealth.jsによる検出回避、CDPモード対応
- **柔軟な認証**: QRコード、電話番号、Cookieの3つのログイン方法
- **充実した機能**: コメント収集、ワードクラウド生成、プロキシ対応
- **優れた拡張性**: 抽象化設計により新プラットフォームの追加が容易

#### 改善の余地
- **パフォーマンス**: ブラウザベースのため、APIベースより処理速度が遅い
- **リソース消費**: Playwrightによるメモリ使用量が大きい
- **ドキュメント**: 主に中国語で、英語ドキュメントが限定的
- **エラーハンドリング**: プラットフォーム固有のエラーへの対応が不十分な場合がある

### 向いている用途
- **学術研究**: ソーシャルメディアデータの収集と分析
- **市場調査**: トレンド分析、消費者行動の理解
- **コンテンツ分析**: 人気コンテンツの傾向把握
- **教育目的**: Webスクレイピング技術の学習

### 向いていない用途
- **商用利用**: ライセンスで明確に禁止
- **大規模データ収集**: プラットフォームへの負荷を考慮した制限
- **リアルタイム監視**: レート制限により不向き
- **非中国語圏のSNS**: 中国プラットフォーム特化設計

### 総評
MediaCrawlerは、中国の主要SNSプラットフォームからデータを収集するための包括的なツールとして優れています。統一されたインターフェースと豊富な機能により、研究者や学生にとって価値の高いツールです。ただし、商用利用の制限と中国プラットフォーム特化という点で用途は限定的です。技術的には、Playwrightベースの実装により安定性は高いものの、パフォーマンスとリソース効率の面で改善の余地があります。