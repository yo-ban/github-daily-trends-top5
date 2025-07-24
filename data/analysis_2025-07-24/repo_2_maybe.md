# リポジトリ解析: maybe-finance/maybe

## 基本情報
- リポジトリ名: maybe-finance/maybe
- 主要言語: Ruby
- スター数: 51,728
- フォーク数: 3,811
- 最終更新: アクティブに開発中
- ライセンス: GNU Affero General Public License v3.0
- トピックス: personal-finance, wealth-management, fintech, open-source, rails, hotwire

## 概要
### 一言で言うと
完全機能を備えたオープンソースの個人財務管理アプリケーションで、元は$1,000,000をかけて開発された商用プロダクトが現在セルフホスト可能な形で提供されている。

### 詳細説明
Maybeは2021/2022年に開発された個人財務および財産管理アプリケーションで、当初はサブスクリプションベースのビジネスとしてCFP/CFAが直接アドバイスを提供する「Ask an Advisor」機能も含んでいました。ビジネスとしては2023年中ごろに閉鎖しましたが、現在は完全にオープンソースプロジェクトとして復活し、ユーザーが自分でホストして無料で使用できるようになりました。

### 主な特徴
- **完全な財務管理機能**: 銀行口座、クレジットカード、投資、不動産、ローン、暗号資産などの管理
- **リアルタイム同期**: Plaid統合による銀行口座の自動同期
- **AIチャット機能**: OpenAIを使用した財務アドバイザー機能
- **自動カテゴリ分類**: トランザクションの自動分類とルール設定
- **予算管理**: カテゴリ別の予算設定と追跡
- **投資ポートフォリオ管理**: 株式、投資信託、暗号資産のパフォーマンス追跡
- **マルチカレンシー対応**: Synth APIを使用した為替レート変換
- **セルフホスト可能**: Docker Composeを使用した簡単なセットアップ

## 使用方法
### インストール
#### 前提条件
**セルフホスト (Docker):**
- Docker Engine
- Docker Compose

**開発環境:**
- Ruby (ファイル`.ruby-version`で指定されたバージョン)
- PostgreSQL 9.3以上
- Redis
- Node.js（JavaScriptランタイム用）

#### インストール手順
```bash
# 方法1: Dockerでセルフホスト
# 1. ディレクトリ作成
mkdir -p ~/docker-apps/maybe
cd ~/docker-apps/maybe

# 2. Docker Composeファイル取得
curl -o compose.yml https://raw.githubusercontent.com/maybe-finance/maybe/main/compose.example.yml

# 3. 環境設定（オプション）
touch .env
# SECRET_KEY_BASEとPOSTGRES_PASSWORDを設定

# 4. アプリ起動
docker compose up -d

# 方法2: ローカル開発環境
git clone https://github.com/maybe-finance/maybe.git
cd maybe
cp .env.local.example .env.local
bin/setup
bin/dev

# オプション: デモデータをロード
rake demo_data:default
```

### 基本的な使い方
#### Hello World相当の例
1. ブラウザで http://localhost:3000 にアクセス
2. デフォルト認証情報でログイン:
   - Email: `user@maybe.local`
   - Password: `password`
3. ダッシュボードで財務サマリーを確認

#### 実践的な使用例
1. **銀行口座の接続**
   - 「Connect Account」をクリック
   - Plaidを使用して銀行口座を接続
   - トランザクションが自動で同期

2. **予算の設定**
   - 「Budgets」セクションへ移動
   - カテゴリ別に月次予算を設定
   - 実際の支出と比較

3. **投資ポートフォリオの管理**
   - 「Investments」アカウントを作成
   - 保有銘柄を追加
   - パフォーマンスを自動追跡

### 高度な使い方
1. **AIチャット機能の活用**
   - OpenAI APIキーを設定
   - チャットで財務アドバイスを取得
   ```env
   OPENAI_ACCESS_TOKEN=your-api-key
   ```

2. **自動ルールの設定**
   - 特定の商品名を含むトランザクションを自動カテゴリ分類
   - 特定の金額以上の取引にタグ付け

3. **マルチカレンシー設定**
   - Synth APIキーを設定
   - 複数通貨での資産管理

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクトの背景、概要、セットアップ手順
- **CLAUDE.md**: 非常に詳細な開発ガイドライン、アーキテクチャ、コード規約
- **CONTRIBUTING.md**: コントリビューションガイド
- **docs/hosting/docker.md**: Dockerを使用したセルフホストの詳細ガイド
- **Wiki**: https://github.com/maybe-finance/maybe/wiki (各OS別の開発セットアップガイド)

### サンプル・デモ
- **rake demo_data:default**: デモデータ生成コマンド
- **Lookbook** (/lookbook): コンポーネント開発用のビジュアルプレビュー
- **compose.example.yml**: Docker Composeセットアップのサンプル

### チュートリアル・ガイド
- GitHub Wiki: Mac/Linux/Windows別の詳細セットアップガイド
- Discordコミュニティ: https://link.maybe.co/discord
- GitHub Discussions: 質問やトラブルシューティング

## 技術的詳細
### アーキテクチャ
#### 全体構造
Ruby on Rails 7.2ベースのモノリシックアプリケーションで、Hotwire（Turbo + Stimulus）を使用してリアクティブなUIを実現。バックグラウンドジョブにSidekiq、データベースにPostgreSQL、キャッシュとジョブキューにRedisを使用。

#### ディレクトリ構成
```
maybe/
├── app/                  # Railsアプリケーションコード
│   ├── controllers/      # APIとWebコントローラー
│   ├── models/           # ActiveRecordモデル（ビジネスロジック含む）
│   ├── views/            # ERBテンプレート
│   ├── components/       # ViewComponent（UIコンポーネント）
│   ├── javascript/       # Stimulusコントローラー
│   ├── jobs/             # バックグラウンドジョブ
│   └── assets/           # CSS、画像、フォント
├── config/               # Rails設定
├── db/                   # データベースマイグレーション
├── test/                 # Minitestテスト
├── bin/                  # 実行スクリプト
└── docs/                 # ドキュメント
```

#### 主要コンポーネント
- **Accountモデル**: 各種金融アカウントの基底クラス
  - 場所: `app/models/account.rb`
  - 依存: Accountable, Syncable, Balance
  - インターフェース: sync, balance_series, current_balance

- **PlaidItem**: Plaid接続管理
  - 場所: `app/models/plaid_item.rb`
  - 依存: Provider::Plaid, PlaidAccount
  - インターフェース: sync, webhook_update

- **Assistant**: AIチャット機能
  - 場所: `app/models/assistant.rb`
  - 依存: Provider::OpenAI
  - インターフェース: create_response, available_functions

### 技術スタック
#### コア技術
- **言語**: Ruby (`.ruby-version`で指定)
- **フレームワーク**: Rails 7.2.2 (Hotwireスタックをフル活用)
- **主要ライブラリ**: 
  - Turbo-Rails: SPA風のインタラクション
  - Stimulus-Rails: JavaScriptフレームワーク
  - ViewComponent: 再利用可能なUIコンポーネント
  - Sidekiq + Sidekiq-Cron: バックグラウンドジョブ
  - Doorkeeper: OAuth2認証
  - Plaid: 銀行口座接続
  - Tailwind CSS: スタイリング
  - D3.js: データビジュアライゼーション

#### 開発・運用ツール
- **ビルドツール**: 
  - Propshaft: アセットパイプライン
  - Importmap: JavaScriptモジュール管理
  - bin/dev: Procfileベースの開発サーバー
- **テスト**: 
  - Minitest: Rails標準テスト
  - Fixtures: テストデータ
  - VCR: 外部APIテスト
- **CI/CD**: GitHub Actions（計画中）
- **デプロイ**: 
  - Docker + Docker Compose
  - ghcr.ioからの公式イメージ

### 設計パターン・手法
- **Skinny Controllers, Fat Models**: ビジネスロジックはモデルに集中
- **Concerns**: 共通機能のモジュール化（Accountable, Syncable等）
- **ViewComponent**: UIロジックのカプセル化
- **Hotwire-First**: JavaScriptを最小限に、サーバーサイドレンダリング優先
- **Query Objects**: 複雑なクエリロジックのカプセル化
- **State Machines**: AASMを使用した状態管理

### データフロー・処理フロー
1. **銀行口座同期**
   - Plaidを通じてアカウント情報を取得
   - SyncJobでバックグラウンド処理
   - トランザクションと残高を更新
   - 自動カテゴリ分類とルール適用

2. **投資ポートフォリオ管理**
   - Securityモデルで証券情報管理
   - Synth APIで価格情報取得
   - Holdingでポジション追跡
   - ポートフォリオパフォーマンス計算

3. **AIチャット処理**
   - ユーザーメッセージを受信
   - AssistantResponseJobで非同期処理
   - OpenAI APIで応答生成
   - Function Callingでデータアクセス

## API・インターフェース
### 公開API
#### /api/v1/* エンドポイント
- 目的: サードパーティアプリケーション向けREST API
- 認証: OAuth2 (Doorkeeper) または APIキー + JWT
- 使用例:
```bash
# OAuthトークン取得
curl -X POST https://maybe.app/oauth/token \
  -d "grant_type=client_credentials" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET"

# APIアクセス
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://maybe.app/api/v1/accounts
```

### 設定・カスタマイズ
#### 設定ファイル
```env
# .envファイル
# アプリケーションモード
SELF_HOSTED=true          # セルフホストモード

# データベース設定
DB_HOST=localhost
DB_PORT=5432
POSTGRES_USER=maybe_user
POSTGRES_PASSWORD=password

# Redis設定
REDIS_URL=redis://localhost:6379/1

# セキュリティ
SECRET_KEY_BASE=your-secret-key

# 外部APIキー（オプション）
PLAID_CLIENT_ID=your-plaid-id
PLAID_SECRET=your-plaid-secret
OPENAI_ACCESS_TOKEN=your-openai-key
SYNTH_API_KEY=your-synth-key
```

#### 拡張・プラグイン開発
- **新しいProviderの追加**:
  1. `app/models/provider/`に新しいプロバイダークラス作成
  2. Provider::Registryに登録
  3. 必要なインターフェースを実装

- **新しいアカウントタイプ**:
  1. Accountクラスを継承
  2. Accountable concernをinclude
  3. 必要なビューとコントローラーを追加

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- Skylightによるパフォーマンスモニタリング: https://oss.skylight.io/app/applications/XDpPIXEX52oi/recent/6h/endpoints
- Turbo Framesによる部分更新でページ全体の再描画を最小化
- データベースクエリのincludes/joinsでN+1問題を回避
- バックグラウンドジョブで重い処理を非同期化

### スケーラビリティ
- **水平スケーリング**: Docker Composeで複数インスタンスを簡単に起動
- **垂直スケーリング**: PostgreSQL、Redisのスペック向上で対応
- **バックグラウンドジョブ**: Sidekiqのワーカー数調整でスケール

### 制限事項
- **技術的な制限**:
  - Plaid APIのレート制限（プランによる）
  - リアルタイムデータ同期はPlaid対応金融機関のみ
  - 暗号資産の価格情報は限定的
- **運用上の制限**:
  - セルフホスト時はバックアップ、セキュリティ設定がユーザー責任
  - EU外のユーザーのみ対応（Plaidの制限）
  - AI機能はOpenAI APIキーが必要（追加コスト）

## 評価・所感
### 技術的評価
#### 強み
- **完成度の高い機能セット**: $1Mをかけた開発の成果が無料で利用可能
- **モダンなRailsアーキテクチャ**: Hotwireをフル活用したSPA風UI
- **優れた開発ドキュメント**: CLAUDE.mdに詳細な開発ガイドライン
- **セルフホスト容易性**: Docker Composeで簡単に起動
- **リアルタイム同期**: Plaidを使用した自動口座同期

#### 改善の余地
- **テストカバレッジ**: 現状ではテストが限定的
- **国際化対応**: i18nはフォールバックモードで動作
- **モバイル対応**: レスポンシブデザインだが専用アプリはなし
- **マルチテナント**: 現状ではシングルテナント設計

### 向いている用途
- **個人・家族の財務管理**: 包括的な財務管理が可能
- **フリーランサー・小規模事業者**: 複数収入源の管理に最適
- **投資家**: ポートフォリオ管理とパフォーマンス追跡
- **データプライバシー重視ユーザー**: セルフホストで完全なコントロール

### 向いていない用途
- **企業会計**: 個人財務に特化、会計機能は限定的
- **EU圏内ユーザー**: PlaidがEU未対応
- **簡易的な家計簿**: 機能が高度すぎる可能性
- **エンタープライズ**: マルチテナントや監査機能が不足

### 総評
Maybeは非常に完成度の高い個人財務管理アプリケーションで、商用プロダクトとして開発されただけあって機能が充実しています。オープンソース化により、プライバシーを重視するユーザーがセルフホストで使用できる点が大きな魅力です。技術的にはRailsのベストプラクティスに従っており、コード品質も高いです。コミュニティが活発で、今後の発展が期待できるプロジェクトです。