# リポジトリ解析: NanmiCoder/MediaCrawler

## 基本情報
- リポジトリ名: NanmiCoder/MediaCrawler
- 主要言語: Python
- スター数: 27,388
- フォーク数: 7,022
- 最終更新: 2024年（アクティブに更新中）
- ライセンス: Non-Commercial Learning License 1.1
- トピックス: xiaohongshu, weibo, zhihu, bilibili, douyin, baidu-tieba, kuaishou, web-crawler, social-media-crawler

## 概要
### 一言で言うと
中国の主要なソーシャルメディアプラットフォーム（小紅書、抖音、快手、B站、微博、百度貼吧、知乎）から投稿とコメントデータを収集する統合クローラーツール。

### 詳細説明
MediaCrawlerは、7つの中国の主要ソーシャルメディアプラットフォームからデータを収集するための包括的なPythonベースのクローラーツールです。Playwrightブラウザ自動化を使用することで、複雑なJavaScriptリバースエンジニアリングを回避し、実際のブラウザ環境でデータを収集します。研究者やデータサイエンティストが中国のソーシャルメディアトレンドを分析するための理想的なツールです。

### 主な特徴
- 7つの主要中国ソーシャルメディアプラットフォームをサポート
- キーワード検索、特定投稿の詳細取得、クリエイターページのクロール機能
- コメント（ネストされた返信を含む）の収集機能
- 複数のログイン方法（QRコード、SMS、Cookie）をサポート
- ブラウザ自動化によるアンチ検出機能
- IPプロキシプールのサポート
- 複数のデータ保存形式（CSV、JSON、MySQL）
- コメントのワードクラウド生成機能
- CDP（Chrome DevTools Protocol）モードによる高度なアンチ検出
- ログイン状態の永続化

## 使用方法
### インストール
#### 前提条件
- Python 3.9.6以上（推奨）
- Node.js 16以上（抖音・知乎の場合に必要）
- uvパッケージマネージャー（推奨）またはpip
- 対応OS: Windows、macOS、Linux

#### インストール手順
```bash
# 方法1: uvパッケージマネージャー経由（推奨）
git clone https://github.com/NanmiCoder/MediaCrawler.git
cd MediaCrawler
uv sync
uv run playwright install

# 方法2: pipを使用した従来の方法
git clone https://github.com/NanmiCoder/MediaCrawler.git
cd MediaCrawler
python -m venv venv
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate
pip install -r requirements.txt
playwright install
```

### 基本的な使い方
#### Hello World相当の例
```bash
# 小紅書で「プログラミング」を検索してクロール
uv run main.py --platform xhs --lt qrcode --type search --keywords "プログラミング"
```

#### 実践的な使用例
```bash
# 小紅書で複数キーワードを検索し、コメントも取得してJSONで保存
uv run main.py --platform xhs --lt qrcode --type search \
  --keywords "編程副業,編程兼職" \
  --get_comment yes \
  --save_data_option json

# 特定の投稿IDのデータを取得（config/base_config.pyで事前設定）
uv run main.py --platform dy --lt cookie --type detail \
  --cookies "your_cookie_string"

# クリエイターページの全投稿を取得
uv run main.py --platform bili --lt qrcode --type creator
```

### 高度な使い方
```python
# config/base_config.pyでの高度な設定例

# CDPモードを有効化（高度なアンチ検出）
ENABLE_CDP_MODE = True
CDP_DEBUG_PORT = 9222
CUSTOM_BROWSER_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

# プロキシプールの設定
ENABLE_IP_PROXY = True
IP_PROXY_PROVIDER = "kuaidaili"  # または "jishuhttp"
IP_PROXY_KEY = "your_proxy_key"

# クロール制限の設定
CRAWLER_MAX_NOTES_COUNT = 500  # 最大取得数
CRAWLER_MAX_COMMENTS_COUNT_SINGLENOTES = 50  # 投稿あたりの最大コメント数
MAX_CONCURRENCY_NUM = 5  # 並行処理数

# ワードクラウド生成
ENABLE_GET_WORDCLOUD = True
WORDCLOUD_FONT_PATH = "docs/STZHONGS.TTF"  # 中国語フォント
```

```bash
# 高度な使用例：CDPモードでブラウザを表示しながらクロール
uv run main.py --platform xhs --lt qrcode --type search \
  --keywords "技術ブログ" \
  --get_comment yes \
  --get_sub_comment yes
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクトの概要、インストール方法、基本的な使用方法
- **README_en.md**: 英語版README
- **README_es.md**: スペイン語版README
- **docs/原生環境管理文檔.md**: ネイティブ環境でのセットアップガイド
- **docs/CDP模式使用指南.md**: Chrome DevTools Protocolモードの詳細ガイド
- **docs/常见問題.md**: FAQとトラブルシューティング
- **docs/代理使用.md**: プロキシ設定ガイド
- **docs/詞云圖使用配置.md**: ワードクラウド生成設定
- **docs/項目代碼結構.md**: プロジェクトのコード構造説明

### サンプル・デモ
- 専用のexamplesディレクトリはなし
- docs内のガイドに使用例が記載
- CDPモードの例がドキュメント内で参照されている（/examples/cdp_example.py）

### チュートリアル・ガイド
- コミュニティサポート：WeChatグループ、知識星球（知識共有プラットフォーム）
- ビデオチュートリアルが利用可能（公式ドキュメントに記載）
- MediaCrawlerPro版には追加のサポートと機能あり

## 技術的詳細
### アーキテクチャ
#### 全体構造
レイヤードアーキテクチャを採用し、明確な関心の分離を実現:
- **エントリポイント層**: main.pyによるCLIインターフェース
- **ファクトリ層**: CrawlerFactoryによるプラットフォーム別クローラー生成
- **抽象層**: 基本クラスによるインターフェース定義
- **実装層**: 各プラットフォーム固有の実装
- **インフラ層**: プロキシ、キャッシュ、ストレージ、DB

#### ディレクトリ構成
```
MediaCrawler/
├── base/               # コア抽象インターフェース
│   ├── base_crawler.py # クローラー基本クラス
│   └── __init__.py
├── media_platform/     # プラットフォーム別実装
│   ├── xhs/           # 小紅書
│   ├── douyin/        # 抖音
│   ├── kuaishou/      # 快手
│   ├── bilibili/      # B站
│   ├── weibo/         # 微博
│   ├── tieba/         # 百度貼吧
│   └── zhihu/         # 知乎
├── model/              # ORMモデル
├── store/              # データ保存層
├── proxy/              # IPプロキシ管理
├── cache/              # キャッシュ実装
├── tools/              # ユーティリティ
├── config/             # 設定管理
├── libs/               # JSライブラリ
└── schema/             # DBスキーマ
```

#### 主要コンポーネント
- **AbstractCrawler**: クローラーの基本インターフェース
  - 場所: `base/base_crawler.py`
  - 依存: AbstractLogin, AbstractStore, AbstractApiClient
  - インターフェース: start(), search(), launch_browser()

- **AbstractLogin**: ログイン戦略の抽象クラス
  - 場所: `base/base_crawler.py`
  - メソッド: login_by_qrcode(), login_by_mobile(), login_by_cookies()

- **AbstractStore**: データ保存の抽象クラス
  - 場所: `base/base_crawler.py`
  - メソッド: store_content(), store_comment(), store_creator()

- **CrawlerFactory**: クローラー生成ファクトリ
  - 場所: `main.py`
  - 機能: プラットフォーム名を基に適切なクローラーを生成

### 技術スタック
#### コア技術
- **言語**: Python 3.9.6+（asyncio、型ヒントを活用）
- **フレームワーク**: 
  - Playwright 1.42.0 - ブラウザ自動化
  - FastAPI 0.110.2 - SMS通知API
- **主要ライブラリ**: 
  - httpx (0.24.0): 非同期HTTPクライアント
  - aiomysql (0.2.0): 非同期MySQL接続
  - redis (4.6.0): キャッシュサーバー接続
  - pandas (2.2.3): データ処理・分析
  - wordcloud (1.9.3): ワードクラウド生成
  - PyExecJS: JavaScript実行（暗号化対応）

#### 開発・運用ツール
- **ビルドツール**: uv（高速Pythonパッケージマネージャー）
- **テスト**: unittestフレームワーク（カバレッジは限定的）
- **CI/CD**: 現在は未設定
- **デプロイ**: ローカル実行またはDockerコンテナ（コミュニティ提供）

### 設計パターン・手法
1. **Factoryパターン**: CrawlerFactory、CacheFactoryによるオブジェクト生成
2. **Strategyパターン**: ログイン戦略、ストレージ戦略の切り替え
3. **Template Methodパターン**: 抽象基底クラスによるテンプレート定義
4. **Singletonパターン**: Logger、DBコネクションプール
5. **Proxyパターン**: IPプロキシプール管理

### データフロー・処理フロー
```
ユーザー入力（CLI）
    ↓
プラットフォーム選択（Factory）
    ↓
ブラウザ起動（Playwright）
    ↓
ログイン処理（QR/SMS/Cookie）
    ↓
データ収集
    ├── 検索/一覧表示
    ├── 詳細データ抽出
    └── メディアダウンロード
    ↓
データ処理
    ├── データ整形
    └── フィルタリング
    ↓
ストレージ層
    ├── CSVエクスポート
    ├── JSONエクスポート
    └── MySQLストレージ
```

## API・インターフェース
### 公開API
#### SMS通知API（recv_sms.py）
- 目的: SMS認証コードの自動取得
- 使用例:
```python
# POST / エンドポイント
{
    "platform": "xhs",
    "current_number": "+1234567890",
    "from_number": "+0987654321",
    "sms_content": "Your verification code is 123456",
    "timestamp": "2024-01-01 12:00:00"
}
```

### 設定・カスタマイズ
#### 設定ファイル
```python
# config/base_config.pyの主要設定項目

PLATFORM = "xhs"  # プラットフォーム選択
LOGIN_TYPE = "qrcode"  # ログイン方式
CRAWLER_TYPE = "search"  # クロールタイプ

# クロール設定
KEYWORDS = "編程,Python"  # 検索キーワード
CRAWLER_MAX_NOTES_COUNT = 200  # 最大取得数
MAX_CONCURRENCY_NUM = 5  # 並行数

# プロキシ設定
ENABLE_IP_PROXY = False
IP_PROXY_PROVIDER = "kuaidaili"

# CDPモード設定
ENABLE_CDP_MODE = False
CDP_DEBUG_PORT = 9222
```

#### 拡張・プラグイン開発
1. **新プラットフォーム追加**:
   - `AbstractCrawler`を継承して実装
   - `media_platform/`下に新ディレクトリ作成
   - `CrawlerFactory`に登録

2. **新ストレージバックエンド**:
   - `AbstractStore`を継承
   - `store/`下に実装追加

3. **カスタムログイン方法**:
   - `AbstractLogin`のメソッドを実装

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ベンチマーク結果: ブラウザ自動化のため、API直接呼び出しより低速
- 最適化手法:
  - 非同朜ascyncioによる並行処理
  - Semaphoreによる同時実行数制御
  - ローカル/Redisキャッシュによる重複リクエスト削減
  - ヘッドレスモードでの実行可能

### スケーラビリティ
**スケールアウト機能**:
- IPプロキシプールによる分散クロール
- Redisキャッシュによる分散セットアップ対応
- 設定可能な同時実行数と遅延
- データベースによる大量データ保存

**大規模利用時の考慮**:
- ブラウザメモリ使用量が高い
- プラットフォームのレート制限に注意
- 複数アカウントの使用（Pro版機能）

### 制限事項
**技術的な制限**:
- シングルスレッド非同朜設計
- ブラウザ自動化のオーバーヘッド
- Playwrightドライバのセットアップが必要
- CPU/メモリリソースを多く消費

**運用上の制限**:
- 各プラットフォームの利用規約遵守が必要
- ライセンスにより商用利用不可
- 大規模クロールは禁止
- プラットフォームの仕様変更に脆弱

## 評価・所感
### 技術的評価
#### 強み
- **包括的なプラットフォームカバレッジ**: 7つの主要中国ソーシャルメディアを統一APIでサポート
- **優れたアンチ検出機能**: CDPモード、stealth.js、プロキシサポート
- **柔軟なアーキテクチャ**: 抽象化がよくされ、新プラットフォーム追加が容易
- **活発な開発とコミュニティ**: 定期更新、Pro版提供
- **多様なデータ出力形式**: JSON、CSV、MySQL対応
- **豊富な機能**: コメント収集、ワードクラウド、クリエイターページ対応

#### 改善の余地
- **テストカバレッジの不足**: ユニットテストが限定的で、CI/CDが未設定
- **リソース消費が大きい**: ブラウザ自動化の宿命
- **APIドキュメントの欠如**: 開発者向けドキュメントが不足
- **エラーハンドリングの改善余地**: より詳細なエラー情報が必要

### 向いている用途
- **学術研究**: ソーシャルメディアトレンド、ユーザー行動分析
- **市場調査**: 消費者センチメント分析（非商用）
- **コンテンツ分析**: バイラルコンテンツパターンの研究
- **個人プロジェクト**: Webスクレイピング技術の学習
- **データサイエンス教育**: データ収集手法の教育

### 向いていない用途
- **商用利用**: ライセンス制限により不可
- **大規模データ収集**: パフォーマンスと倫理的問題
- **リアルタイム監視**: リソース消費が大きすぎる
- **プロダクションシステム**: テスト不足
- **ミッションクリティカルなアプリケーション**: 信頼性の懸念

### 総評
MediaCrawlerは、中国のソーシャルメディアからデータを収集したい研究者や学生にとって非常に印象的な技術的成果です。統一されたアプローチ、活発なコミュニティ、革新的な機能により、クローラーエコシステムで際立っています。

しかし、このツールは明らかに学習/研究用ツールとして位置づけられており、プロダクション対応のソリューションではありません。制限的なライセンス、最小限のテスト、リソース消費の大きさなどが、より幅広い使用を制限しています。意図された対象者—中国のソーシャルメディアを研究する研究者や学生—にとっては、データ収集の技術的障壁を大幅に下げる優れたツールです。

**全体評価: 7/10** - 意図された目的には優れているが、より幅広い使用には明確な制限がある