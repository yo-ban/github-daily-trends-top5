# リポジトリ解析: maybe-finance/maybe

## 基本情報
- リポジトリ名: maybe-finance/maybe
- 主要言語: Ruby
- スター数: 47,958
- フォーク数: 3,565
- 最終更新: 2025年7月（活発に開発中）
- ライセンス: GNU Affero General Public License v3.0
- トピックス: personal-finance, wealth-management, rails, hotwire, self-hosted, open-source

## 概要
### 一言で言うと
約100万ドルの開発費をかけた商用個人資産管理アプリケーションをオープンソース化した、セルフホスト可能な包括的パーソナルファイナンスプラットフォーム。

### 詳細説明
Maybeは、元々商用製品として開発された高機能な個人資産管理アプリケーションで、2023年にオープンソース化されました。銀行口座、投資、不動産、車両、ローンなど、あらゆる資産と負債を一元管理できます。Plaid統合による自動取引同期、AI搭載の財務アシスタント、マルチ通貨対応など、エンタープライズレベルの機能を個人向けに提供します。プライバシーを重視し、セルフホスト可能な設計により、ユーザーは自分の財務データを完全にコントロールできます。

### 主な特徴
- 10,000以上の金融機関との自動同期（Plaid経由）
- AI搭載の財務アシスタント（GPT-4）
- マルチ通貨・マルチアカウント対応
- 取引の自動カテゴリ分類とルールエンジン
- 予算管理と財務目標追跡
- 投資ポートフォリオ管理
- CSVインポート・Mintからの移行サポート
- OAuth2対応のフルAPI
- Dockerによる簡単なセルフホスティング

## 使用方法
### インストール
#### 前提条件
- DockerとDocker Compose（セルフホスト用）
- または Ruby 3.3.6、PostgreSQL 9.3+、Redis（開発用）
- Node.js 20+（JavaScriptランタイム）

#### インストール手順
```bash
# 方法1: Dockerでのセルフホスト（推奨）
# compose.example.ymlをダウンロード
curl -o compose.yml https://raw.githubusercontent.com/maybe-finance/maybe/main/compose.example.yml

# 環境変数設定（オプション）
export SECRET_KEY_BASE=$(openssl rand -hex 64)
export POSTGRES_PASSWORD=$(openssl rand -hex 32)

# 起動
docker compose up -d

# http://localhost:3000 でアクセス

# 方法2: ローカル開発環境
git clone https://github.com/maybe-finance/maybe.git
cd maybe
cp .env.local.example .env.local
bin/setup    # 依存関係インストール、DBセットアップ
bin/dev      # 開発サーバー起動
```

### 基本的な使い方
#### アカウント設定
```ruby
# 初回アクセス時にアカウント作成
# 1. Web UIからサインアップ
# 2. メールアドレスとパスワードを設定

# デモデータのロード（開発用）
rake demo_data:default
# テストログイン: user@maybe.local / password
```

#### 実践的な使用例
```ruby
# APIを使用したアカウント作成
# POST /api/v1/accounts
curl -X POST http://localhost:3000/api/v1/accounts \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "account": {
      "name": "メイン銀行",
      "accountable_type": "Depository",
      "subtype": "checking",
      "currency": "USD",
      "balance": 10000
    }
  }'

# Plaid統合での自動同期
# .envでPLAID_*環境変数を設定後
# Web UIから"アカウントを接続"を選択
```

### 高度な使い方
```ruby
# カスタムルールエンジンの設定
# app/models/transaction_rule.rbを使用
rule = TransactionRule.create!(
  family: current_family,
  name: "コーヒーショップルール",
  conditions: {
    merchant_contains: ["Starbucks", "Coffee"]
  },
  actions: {
    category: "Food & Drink",
    tag: "coffee"
  }
)

# AIアシスタントAPI
# POST /api/v1/assistant/chat
curl -X POST http://localhost:3000/api/v1/assistant/chat \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "今月の支出を分析してください"
  }'

# Webhook設定（Plaid/Stripe）
# config/routes.rbで定義されたエンドポイント
# POST /webhooks/plaid
# POST /webhooks/stripe
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、セットアップ、機能一覧
- **CLAUDE.md**: AIアシスタント用コンテキストドキュメント
- **docs/**: セルフホスト、API、Plaid統合などの詳細ドキュメント
- **公式サイト**: https://maybefinance.com - 製品紹介とSaaS版

### サンプル・デモ
- **rake demo_data:default**: デモデータ生成コマンド
- **compose.example.yml**: Dockerセットアップのサンプル
- **.env.local.example**: ローカル開発用設定テンプレート

### チュートリアル・ガイド
- GitHub Wiki（作成中）
- Discordコミュニティ（5,400+メンバー）
- docs/ディレクトリ内の各種ガイド
- ブログ記事とチュートリアル（公式サイト）

## 技術的詳細
### アーキテクチャ
#### 全体構造
Maybeは、Ruby on Railsをベースとした典型的なMVCアーキテクチャに、Hotwire（Turbo + Stimulus）を組み合わせたモダンなフルスタックアプリケーションです。セルフホスト可能な設計により、Docker Composeで簡単にデプロイできる構成になっています。

#### ディレクトリ構成
```
project-root/
├── app/              # Railsアプリケーションコア
│   ├── models/       # ActiveRecordモデル（Family, Account, Transaction等）
│   ├── controllers/  # リクエスト処理とレスポンス管理
│   ├── views/        # ERBテンプレート、Turboフレーム
│   ├── javascript/   # Stimulusコントローラー、Turbo設定
│   ├── jobs/         # 非同期ジョブ（同期、カテゴリ分類等）
│   └── assets/       # CSSデザインシステム（Tailwind）
├── config/           # アプリケーション設定、ルーティング
├── db/               # データベーススキーマ、マイグレーション
├── lib/              # カスタムライブラリ、サービスクラス
├── spec/             # RSpecテストスイート
└── docker/           # Dockerイメージ設定
```

#### 主要コンポーネント
- **Familyモデル**: マルチユーザー・マルチアカウント管理の中核
  - 場所: `app/models/family.rb`
  - 依存: User, Account, Transaction, Rule, Budget
  - インターフェース: balance_sheet, income_statement, auto_categorize_transactions

- **Accountモデル**: 金融アカウントの抽象化と統一インターフェース
  - 場所: `app/models/account.rb`
  - 依存: Entry, Transaction, Valuation, Holding
  - インターフェース: AASM状態管理、Syncable、Monetizable、Chartable

- **同期システム**: Plaid/手動データの非同期処理
  - 場所: `app/jobs/`, `app/models/concerns/syncable.rb`
  - 依存: Sidekiq, Redis, ActiveJob
  - インターフェース: sync_later, sync_all

### 技術スタック
#### コア技術
- **言語**: Ruby 3.3.6（最新の構文とパフォーマンス最適化）
- **フレームワーク**: Rails 7.2（Hotwire統合、ActiveRecord暗号化）
- **主要ライブラリ**: 
  - Hotwire (Turbo 8 + Stimulus): SPAライクなUX
  - Tailwind CSS 3: ユーティリティファーストCSS
  - ViewComponent: コンポーネント指向のビュー設計
  - Money-Rails: 多通貨対応の金額処理
  - AASM: 状態管理（アカウントのライフサイクル）
  - Devise: 認証システム
  - Plaid Ruby: 金融機関統合

#### 開発・運用ツール
- **ビルドツール**: 
  - Propshaft: アセットパイプライン
  - esbuild: JavaScript/TypeScriptバンドル
  - PostCSS: Tailwind CSS処理
- **テスト**: 
  - RSpec: BDD テストフレームワーク
  - FactoryBot: テストデータ生成
  - Capybara: 統合テスト
- **CI/CD**: 
  - GitHub Actions: 自動テスト、Lint、セキュリティチェック
  - Rubocop: コードスタイル統一
  - Brakeman: セキュリティ脆弱性スキャン
- **デプロイ**: 
  - Docker Compose: マルチコンテナ構成
  - PostgreSQL + Redis: データ永続化とキャッシュ
  - Caddy: リバースプロキシ（オプション）

### 設計パターン・手法
- **Concerns**: 共通機能のモジュール化（Syncable, Monetizable, Chartable）
- **Service Objects**: 複雑なビジネスロジックの分離（AutoCategorizer, BalanceSheet）
- **Delegated Types**: 多態的なアカウントタイプの実装（Investment, Depository等）
- **Job Pattern**: 重い処理の非同期実行（同期、AI分析）
- **Value Objects**: Money型による金額の厳密な扱い
- **State Machine**: AASMによるアカウント状態の明示的管理

### データフロー・処理フロー
1. **取引データ取得**: Plaid API → WebhookController → SyncJob
2. **データ正規化**: Entry作成 → Transaction/Valuation/Trade分類
3. **自動処理**: AutoCategorizeJob → ルールエンジン → カテゴリ/タグ付与
4. **集計・分析**: BalanceSheet/IncomeStatement → キャッシュ → Turboフレーム更新
5. **AI アシスタント**: ChatController → OpenAI API → 財務インサイト生成

## API・インターフェース
### 公開API
#### RESTful API v1
- 目的: 外部アプリケーション統合、自動化
- 認証: Bearer Token（Settings → API Keys）
- ベースURL: `/api/v1/`

主要エンドポイント:
```bash
# アカウント管理
GET    /api/v1/accounts          # アカウント一覧
POST   /api/v1/accounts          # アカウント作成
PATCH  /api/v1/accounts/:id      # アカウント更新
DELETE /api/v1/accounts/:id      # アカウント削除

# 取引管理
GET    /api/v1/transactions      # 取引一覧（フィルタ対応）
POST   /api/v1/transactions      # 取引作成
PATCH  /api/v1/transactions/:id  # 取引更新

# AIアシスタント
POST   /api/v1/assistant/chat    # AI財務分析
```

使用例:
```ruby
# Ruby クライアントの例
require 'net/http'
require 'json'

uri = URI('http://localhost:3000/api/v1/accounts')
req = Net::HTTP::Post.new(uri)
req['Authorization'] = 'Bearer YOUR_API_KEY'
req['Content-Type'] = 'application/json'
req.body = {
  account: {
    name: "Savings Account",
    accountable_type: "Depository",
    subtype: "savings",
    currency: "USD",
    balance: 5000
  }
}.to_json

res = Net::HTTP.start(uri.hostname, uri.port) {|http|
  http.request(req)
}
```

#### Webhook受信
- `/webhooks/plaid` - Plaid取引更新通知
- `/webhooks/stripe` - Stripeサブスクリプション管理

### 設定・カスタマイズ
#### 設定ファイル
```yaml
# config/maybe.yml
app:
  # アプリケーションモード
  mode: self_hosted  # self_hosted | managed
  
  # AIアシスタント設定
  assistant:
    enabled: true
    provider: openai
    model: gpt-4-turbo-preview
  
  # 同期設定
  sync:
    interval: 6.hours
    batch_size: 100
  
  # セキュリティ
  security:
    session_timeout: 30.minutes
    require_2fa: false
```

環境変数による設定:
```bash
# .env.local
# 必須設定
SECRET_KEY_BASE=your-secret-key
DATABASE_URL=postgresql://user:pass@localhost/maybe
REDIS_URL=redis://localhost:6379

# Plaid統合（オプション）
PLAID_CLIENT_ID=your-client-id
PLAID_SECRET=your-secret
PLAID_ENV=sandbox  # sandbox | development | production

# OpenAI統合（オプション）
OPENAI_API_KEY=your-api-key
OPENAI_ORGANIZATION=your-org-id

# メール設定（オプション）
SMTP_ADDRESS=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your-username
SMTP_PASSWORD=your-password
```

#### 拡張・プラグイン開発
カスタムルールエンジンの作成:
```ruby
# lib/rules/custom_rule.rb
module Rules
  class CustomRule < BaseRule
    def match?(transaction)
      # カスタムマッチングロジック
      transaction.merchant_name&.include?("特定の文字列")
    end
    
    def apply!(transaction)
      transaction.update!(
        category: find_or_create_category("カスタムカテゴリ"),
        tags: [find_or_create_tag("自動タグ")]
      )
    end
  end
end

# config/initializers/rules.rb
Rails.application.config.after_initialize do
  RuleEngine.register(Rules::CustomRule)
end
```

カスタムインポーターの実装:
```ruby
# app/importers/custom_bank_importer.rb
class CustomBankImporter < BaseImporter
  def parse_file(file)
    # CSVやその他形式のパース
  end
  
  def map_transaction(row)
    {
      date: Date.parse(row['date']),
      amount: row['amount'].to_d,
      name: row['description'],
      pending: false
    }
  end
end
```

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- **レスポンス速度**: Hotwireによるページ更新で50-200msの高速レスポンス
- **リアルタイム更新**: Turbo Streamsによる部分更新で帯域幅を最小化
- **データベース最適化**: 
  - インデックス最適化済みのスキーマ設計
  - N+1クエリ防止（includes、preload活用）
  - キャッシュキーによる集計クエリの最適化
- **バックグラウンド処理**: Sidekiqによる重い処理の非同期化

### スケーラビリティ
- **水平スケーリング**: 
  - Railsアプリケーションの複数インスタンス対応
  - Redisによるセッション・キャッシュ共有
  - PostgreSQLのコネクションプーリング
- **データ量対応**:
  - 数十万件の取引データを想定した設計
  - 日付範囲によるクエリ最適化
  - アーカイブ機能による古いデータの分離（計画中）
- **マルチテナント**: Family単位での完全なデータ分離

### 制限事項
- **Plaid API制限**: 
  - 1秒あたり10リクエストの制限
  - Webhook遅延（最大数分）
- **セルフホスト時の考慮事項**:
  - SSL証明書の自己管理が必要
  - バックアップ戦略の独自実装
  - Plaid APIキーの取得が必要（有料）
- **AIアシスタント**: OpenAI APIの利用制限とコストに依存

## 評価・所感
### 技術的評価
#### 強み
- **成熟したコードベース**: 商用製品として開発されただけあり、コード品質が高く、テストカバレッジも充実
- **モダンなRails実装**: Hotwireを活用したSPA体験、ViewComponentによる保守性の高い設計
- **優れたUX/UI**: プロフェッショナルなデザインシステム、直感的な操作性
- **包括的な機能**: 個人資産管理に必要な機能が網羅的に実装済み
- **高い拡張性**: ルールエンジン、インポーター、APIなど拡張ポイントが明確
- **セキュリティ**: 金融データを扱うための適切なセキュリティ対策（暗号化、監査ログ等）

#### 改善の余地
- **日本市場対応**: 日本の金融機関APIとの直接統合は未対応（CSVインポートは可能）
- **モバイルアプリ**: Web版のみでネイティブアプリは提供されていない
- **ドキュメント**: セルフホスト向けの詳細なドキュメントがまだ発展途上
- **初期設定の複雑さ**: Plaid統合やOpenAI設定など、フル機能利用には多くの外部サービス設定が必要

### 向いている用途
- **プライバシー重視の個人資産管理**: セルフホストにより完全なデータコントロールが可能
- **複数資産の統合管理**: 銀行、投資、不動産、車両など多様な資産を一元管理したい場合
- **家族・小規模チームでの資産共有**: マルチユーザー対応で家族間での資産情報共有
- **開発者向けカスタマイズ**: APIやルールエンジンを活用した独自機能の追加
- **Mintからの移行**: 専用のインポート機能で簡単に移行可能

### 向いていない用途
- **会計・税務処理**: 個人資産管理に特化しており、本格的な会計機能は含まれない
- **リアルタイムトレーディング**: 投資管理機能はあるが、取引執行機能はない
- **大規模企業での利用**: エンタープライズ向けの権限管理やワークフロー機能は限定的
- **技術的知識のないユーザーのセルフホスト**: Dockerやデータベース管理の知識が必要

### 総評
Maybeは、約100万ドルの開発投資が生きている高品質な個人資産管理ソフトウェアです。商用製品レベルの完成度を持ちながら、オープンソース化によりプライバシーを重視するユーザーや開発者にとって理想的な選択肢となっています。

特筆すべきは、Railsエコシステムの最新技術（Hotwire、ViewComponent）を効果的に活用し、SPAのようなユーザー体験を提供している点です。金融データを扱うアプリケーションとして必要なセキュリティ対策も適切に実装されており、実用性が高いです。

一方で、セルフホストには技術的なハードルがあり、Plaid APIの利用には費用もかかるため、誰にでも推奨できるわけではありません。しかし、プライバシーを重視し、自分のデータを完全にコントロールしたいユーザーや、カスタマイズして独自の資産管理システムを構築したい開発者にとっては、非常に価値の高いプロジェクトと言えるでしょう。

コミュニティも活発で、継続的な開発が行われているため、今後さらなる機能拡張や改善が期待できます。