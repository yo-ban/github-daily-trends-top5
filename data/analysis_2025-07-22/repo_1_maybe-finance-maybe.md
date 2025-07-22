# リポジトリ解析: maybe-finance/maybe

## 基本情報
- リポジトリ名: maybe-finance/maybe
- 主要言語: Ruby
- スター数: 49,766
- フォーク数: 3,661
- 最終更新: 2025年（アクティブに開発中）
- ライセンス: GNU Affero General Public License v3.0
- トピックス: 個人財務管理、オープンソース、Ruby on Rails、Hotwire、AI機能

## 概要
### 一言で言うと
元々100万ドル以上の開発費をかけて作られた有料の個人財務管理アプリがオープンソース化され、誰でも無料でセルフホスティングできるようになった高機能な財務管理プラットフォーム。

### 詳細説明
Maybeは2021-2022年にかけて開発された個人財務・資産管理アプリケーションです。元々は「Ask an Advisor」機能を含む有料サービスとして提供されていましたが、2023年にビジネスが終了した後、開発チームはこの100万ドル以上の開発費をかけたアプリケーションを完全にオープンソース化することを決定しました。現在は誰でも無料でセルフホスティングでき、将来的には小額の月額料金でホスティングサービスも提供予定です。

### 主な特徴
- 10,000以上の金融機関との連携（Plaid統合）
- 銀行口座、クレジットカード、投資、暗号資産、不動産など多様な資産の一元管理
- AIアシスタント機能（OpenAI統合）による財務アドバイス
- 自動カテゴリ分類と取引ルール設定
- 予算管理とカテゴリ別支出追跡
- マルチ通貨対応（Synth API経由）
- CSVインポート・エクスポート機能
- モダンなUI/UX（Hotwire + Tailwind CSS）
- OAuth2とAPIキーによる外部連携
- Dockerによる簡単なセルフホスティング

## 使用方法
### インストール
#### 前提条件
- Docker Engine（推奨）またはRuby（.ruby-versionファイル参照）
- PostgreSQL 9.3以上（理想的には最新安定版）
- Redis（バックグラウンドジョブ用）
- オプション：OpenAI APIキー（AI機能用）
- オプション：Synth APIキー（マルチ通貨サポート用）

#### インストール手順
```bash
# 方法1: Docker Compose（推奨）
# ディレクトリ作成
mkdir -p ~/docker-apps/maybe
cd ~/docker-apps/maybe

# Docker Composeファイルをダウンロード
curl -o compose.yml https://raw.githubusercontent.com/maybe-finance/maybe/main/compose.example.yml

# 環境変数の設定（オプション）
touch .env
# .envファイルに以下を追加：
# SECRET_KEY_BASE="生成したシークレットキー"
# POSTGRES_PASSWORD="データベースパスワード"

# アプリケーション起動
docker compose up -d

# 方法2: ローカル開発環境
git clone https://github.com/maybe-finance/maybe.git
cd maybe
cp .env.local.example .env.local
bin/setup
bin/dev

# デモデータのロード（オプション）
rake demo_data:default
```

### 基本的な使い方
#### Hello World相当の例
```bash
# Dockerで起動後、ブラウザでアクセス
http://localhost:3000

# 初回アカウント作成
# 1. "Create your account"をクリック
# 2. メールアドレスとパスワードを入力
# 3. ダッシュボードにアクセス

# 開発環境でのテストユーザー
# Email: user@maybe.local
# Password: password
```

#### 実践的な使用例
```ruby
# APIキーを使用した外部連携例
# 1. 設定画面でAPIキー生成
# 2. curlでアカウント情報取得
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://localhost:3000/api/v1/accounts

# Plaid連携で銀行口座を追加
# 1. アカウント追加画面から「Connect Bank」
# 2. Plaidのセキュアな認証フローで銀行にログイン
# 3. 自動的に取引履歴と残高が同期

# AIアシスタントの使用
# 1. チャット画面を開く
# 2. 「今月の支出を分析して」などの質問を入力
# 3. AIが財務データを分析して回答
```

### 高度な使い方
```ruby
# カスタムルールの設定例
# app/models/rule.rbの拡張
class Rule < ApplicationRecord
  # Amazon取引を自動的に「ショッピング」カテゴリに分類
  def self.create_amazon_rule(family)
    family.rules.create!(
      name: "Amazon purchases",
      conditions: {
        merchant_contains: "Amazon"
      },
      actions: {
        category: "Shopping"
      }
    )
  end
end

# バックグラウンドジョブのカスタマイズ
# app/jobs/custom_sync_job.rb
class CustomSyncJob < ApplicationJob
  def perform(account)
    # カスタム同期ロジック
    account.sync_transactions
    account.calculate_metrics
    account.notify_if_unusual_activity
  end
end

# ViewComponentのカスタマイズ例
# app/components/custom_chart_component.rb
class CustomChartComponent < ApplicationComponent
  def initialize(data:, type: :line)
    @data = data
    @type = type
  end

  private

  attr_reader :data, :type
end
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、セットアップ手順、貢献ガイドへのリンク
- **CLAUDE.md**: Claude Code向けの詳細な開発ガイドライン（アーキテクチャ、規約、テスト方針）
- **docs/hosting/docker.md**: Dockerを使用したセルフホスティングの完全ガイド
- **docs/api/chats.md**: チャットAPI（AIアシスタント）の詳細仕様
- **CONTRIBUTING.md**: 貢献者向けガイドライン
- **Wiki**: https://github.com/maybe-finance/maybe/wiki（開発セットアップガイド）
- **公式サイト**: https://maybefinance.com

### サンプル・デモ
- **compose.example.yml**: Docker Composeの設定例
- **rake demo_data:default**: デモデータ生成タスク
- **.env.local.example**: 環境変数の設定例
- **Lookbook（/lookbook）**: ViewComponentsのライブプレビュー

### チュートリアル・ガイド
- Mac開発セットアップガイド（Wiki内）
- Linux開発セットアップガイド（Wiki内）
- Windows開発セットアップガイド（Wiki内）
- Dev Containers対応ガイド
- Discordコミュニティ: https://link.maybe.co/discord

## 技術的詳細
### アーキテクチャ
#### 全体構造
Maybeは、モノリシックなRailsアプリケーションとして設計されており、Hotwireを使用してSPA風のインタラクティブなUIを実現しています。バックエンドはRailsのMVCパターンに従い、フロントエンドはTurboとStimulusで構築されています。データの永続化にはPostgreSQL、キャッシュとジョブキューにはRedis、バックグラウンド処理にはSidekiqを使用しています。

#### ディレクトリ構成
```
maybe/
├── app/              # Railsアプリケーションのコア
│   ├── assets/       # CSS、画像、フォント
│   ├── channels/     # ActionCable（WebSocket）
│   ├── components/   # ViewComponents（再利用可能なUI）
│   ├── controllers/  # MVCのコントローラー
│   ├── helpers/      # ビューヘルパー
│   ├── javascript/   # Stimulusコントローラー、チャート
│   ├── jobs/         # バックグラウンドジョブ（Sidekiq）
│   ├── mailers/      # メール送信
│   ├── models/       # ActiveRecordモデル（ビジネスロジック）
│   ├── services/     # サービスクラス（APIレート制限など）
│   └── views/        # ERBテンプレート
├── config/           # 設定ファイル
├── db/               # データベース関連
├── docs/             # ドキュメント
├── lib/              # カスタムライブラリ
├── public/           # 静的ファイル
└── test/             # テストスイート
```

#### 主要コンポーネント
- **Account**: 金融アカウント（銀行、投資、暗号資産など）の基底クラス
  - 場所: `app/models/account.rb`
  - 依存: Balance、Entry、Syncable concern
  - インターフェース: sync、calculate_balance、create_transfer

- **Family**: ユーザーグループ（家族）を管理
  - 場所: `app/models/family.rb`
  - 依存: User、Account、Category、Rule
  - インターフェース: sync_all、auto_categorize、calculate_net_worth

- **PlaidItem**: Plaid APIとの連携を管理
  - 場所: `app/models/plaid_item.rb`
  - 依存: Provider::Plaid、Account、Sync
  - インターフェース: sync_accounts、handle_webhook、refresh_access_token

- **Assistant**: AI機能を提供
  - 場所: `app/models/assistant.rb`
  - 依存: Provider::OpenAI、Chat、Message
  - インターフェース: generate_response、execute_function_calls

### 技術スタック
#### コア技術
- **言語**: Ruby（.ruby-versionで指定）、Rails 7.2.2
- **フレームワーク**: 
  - Rails 7.2.2（APIモード非使用、フルスタック）
  - Hotwire（Turbo + Stimulus）for リアクティブUI
  - ViewComponent for コンポーネントベースUI
- **主要ライブラリ**: 
  - Plaid Ruby SDK: 銀行口座連携
  - Stripe Ruby SDK: 決済処理
  - ruby-openai: AI機能統合
  - Sidekiq + sidekiq-cron: バックグラウンドジョブ
  - Doorkeeper: OAuth2認証プロバイダー
  - Pagy: ページネーション
  - Tailwind CSS v4.x: スタイリング
  - D3.js: データビジュアライゼーション

#### 開発・運用ツール
- **ビルドツール**: 
  - Importmap Rails（JavaScriptバンドリング不要）
  - Propshaft（アセットパイプライン）
  - Biome（JavaScript/TypeScriptのリンティング）
- **テスト**: 
  - Minitest（Rails標準）
  - Fixtures（FactoryBot不使用）
  - VCR（外部API呼び出しの記録・再生）
  - SimpleCov（カバレッジ測定）
- **CI/CD**: 
  - GitHub Actions（推測）
  - Rubocop（Ruby静的解析）
  - Brakeman（セキュリティスキャン）
  - erb_lint（ERBテンプレートのリンティング）
- **デプロイ**: 
  - Docker + Docker Compose（公式推奨）
  - GitHub Container Registry（Docker イメージ配布）
  - 環境変数による設定管理

### 設計パターン・手法
- **Skinny Controllers, Fat Models**: ビジネスロジックはモデルに集約、コントローラーは薄く
- **Concerns**: 共通機能をモジュール化（Syncable、Monetizable、Enrichableなど）
- **ViewComponents**: 再利用可能なUIコンポーネント（DS/とUI/ディレクトリ）
- **Service Objects最小化**: app/services/は最小限、モデルに責務を持たせる
- **Background Jobs**: 重い処理は非同期化（Sidekiq）
- **State Machines**: AASM gemによる状態管理（Import、Syncなど）
- **Hotwire First**: JavaScriptは最小限、サーバーサイドレンダリング優先

### データフロー・処理フロー
1. **アカウント同期フロー**:
   - ユーザーがPlaid連携を開始 → PlaidItemを作成
   - PlaidItem::Syncer → 各アカウントのAccount::Syncer呼び出し
   - トランザクション取得 → Entry作成 → Balance更新
   - SyncCompleteEventで完了通知

2. **AI処理フロー**:
   - ユーザーがチャットでメッセージ送信
   - CreateChatResponseJob（非同期）実行
   - Assistant::Responderがコンテキスト構築
   - OpenAI APIコール → FunctionToolCaller（必要に応じて）
   - レスポンスをTurbo Streamsでリアルタイム配信

3. **インポート処理フロー**:
   - CSVアップロード → Import作成
   - ImportJobでCSV解析 → Import::Row作成
   - マッピング設定 → データ変換
   - publish実行 → Account/Entry作成

## API・インターフェース
### 公開API
#### REST API (v1)
- 目的: 外部アプリケーションからのデータアクセス
- 認証: OAuth2（Doorkeeper）またはAPIキー + JWT
- エンドポイント例:
```bash
# アカウント一覧取得
GET /api/v1/accounts
Authorization: Bearer YOUR_API_KEY

# トランザクション作成
POST /api/v1/accounts/:account_id/transactions
Content-Type: application/json
{
  "amount": 100.50,
  "date": "2025-01-01",
  "merchant": "Coffee Shop",
  "category_id": "uuid"
}

# AIチャット
POST /api/v1/chats
{
  "message": "今月の支出を分析して",
  "model": "gpt-4"
}
```

### 設定・カスタマイズ
#### 設定ファイル
```yaml
# config/settings.yml (rails-settings-cached)
defaults: &defaults
  app_name: "Maybe"
  require_invite_for_signup: false
  ai_enabled: true
  max_accounts_per_family: 50
  
# .env ファイル
SECRET_KEY_BASE=your_secret_key
OPENAI_ACCESS_TOKEN=your_openai_key
PLAID_CLIENT_ID=your_plaid_id
PLAID_SECRET_KEY=your_plaid_secret
SYNTH_API_KEY=your_synth_key  # 通貨変換用
```

#### 拡張・プラグイン開発
- **カスタムプロバイダー追加**: `app/models/provider/`に新規クラス作成
- **新しい金融機関連携**: Provider::Registryに登録
- **カスタムルールアクション**: Rule::Registryに追加
- **ViewComponentの拡張**: ApplicationComponentを継承
- **Stimulusコントローラー**: `app/javascript/controllers/`に配置

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ベンチマーク結果: Skylight.ioで公開監視（https://oss.skylight.io/app/applications/XDpPIXEX52oi）
- 最適化手法:
  - N+1クエリ防止（includes/joins使用）
  - インデックス最適化
  - Turbo Framesによる部分更新
  - バックグラウンドジョブによる重い処理の非同期化
  - Redisキャッシュ活用
  - 画像処理はActive Storage + 遅延処理

### スケーラビリティ
- 水平スケーリング: Dockerコンテナで複数インスタンス起動可能
- データベース: PostgreSQLのレプリケーション対応
- バックグラウンドジョブ: Sidekiqの並列度調整可能
- ファイルストレージ: S3対応でスケーラブル
- キャッシュ: Redis Clusterでスケール可能

### 制限事項
- 技術的な制限:
  - Plaid APIのレート制限に依存
  - OpenAI APIの利用量制限
  - 大量データのリアルタイム処理には工夫が必要
- 運用上の制限:
  - セルフホスティングの場合、Plaid APIキーの取得が必要
  - AI機能使用にはOpenAI APIキー必須（有料）
  - マルチ通貨機能にはSynth APIキー必要

## 評価・所感
### 技術的評価
#### 強み
- 非常に高品質なコードベース（100万ドルの開発投資の成果）
- モダンなRailsアプリケーションのベストプラクティスを体現
- 包括的なドキュメント（特にCLAUDE.md）
- Hotwireによる優れたUX（SPAライクな操作感）
- セキュリティ重視の設計（Brakeman、強力なパラメータ、CSRF保護）
- テスト可能な設計（Concernsの活用、依存性注入）
- プロダクションレディ（エラー追跡、パフォーマンス監視）

#### 改善の余地
- i18n（国際化）が未実装
- モバイルアプリが存在しない（Webのみ）
- 一部の金融機関連携は米国中心
- セルフホスティング時の初期設定がやや複雑

### 向いている用途
- 個人・家族の総合的な財務管理
- プライバシー重視のユーザー（セルフホスティング）
- 複数の金融機関にまたがる資産管理
- AIを活用した財務分析と意思決定支援
- 開発者向けの財務管理プラットフォーム構築のベース

### 向いていない用途
- 企業会計・業務会計（個人向け特化）
- リアルタイムトレーディング（投資管理は記録中心）
- 日本の金融機関との直接連携（Plaidは主に米国）
- オフライン専用環境（クラウドサービス連携前提）

### 総評
Maybeは、商用グレードの品質を持つオープンソースの個人財務管理アプリケーションとして、非常に高い完成度を誇ります。元々有料サービスとして開発されただけあって、UIの洗練度、機能の充実度、コードの品質すべてが高水準です。特にRails開発者にとっては、モダンなRailsアプリケーションの優れた実装例として学習価値も高いでしょう。セルフホスティング可能な点は、財務データのプライバシーを重視するユーザーにとって大きな魅力です。今後のコミュニティによる発展が期待される、注目のプロジェクトです。