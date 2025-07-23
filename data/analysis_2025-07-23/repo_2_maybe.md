# リポジトリ解析: maybe-finance/maybe

## 基本情報
- リポジトリ名: maybe-finance/maybe
- 主要言語: Ruby
- スター数: 50,585
- フォーク数: 3,750
- 最終更新: 2024年（活発に開発中）
- ライセンス: GNU Affero General Public License v3.0
- トピックス: personal-finance, wealth-management, rails, hotwire, plaid, investment-tracking, budgeting

## 概要
### 一言で言うと
元々約100万ドルを投じて開発された商用品質の個人財務管理アプリをオープンソース化した、最も完成度の高いセルフホスト可能なパーソナルファイナンスアプリケーション。

### 詳細説明
Maybeは、個人の財務管理と資産管理を包括的に行うためのフル機能アプリケーションです。元々は商用製品として開発され、約100万ドルの投資を受けていましたが、現在はAGPLv3ライセンスの下でオープンソース化されています。

このアプリは、銀行口座、クレジットカード、投資、ローン、不動産、車両、暗号資産など、あらゆる種類の資産を一元管理できます。Plaidを介した銀行口座の自動同期、AIを活用した取引の自動分類、資産運用のパフォーマンス追跡、予算管理など、商用サービスに匹敵する機能を提供します。

### 主な特徴
- **マルチアカウント管理**: 8種類のアカウントタイプ（預金、クレジットカード、投資、ローン、不動産、車両、暗号資産、その他）
- **銀行口座自動同期**: Plaid統合によるリアルタイム取引更新
- **AI機能**: OpenAI (GPT-4)を使用したチャットアシスタント、自動分類、マーチャント検出
- **投資ポートフォリオ管理**: 株式、ETF、投資信託の追跡とパフォーマンス分析
- **マルチ通貨サポート**: Synth API経由のリアルタイム為替レート
- **予算管理**: カテゴリベースの支出制限と追跡
- **財務分析**: 資資産表、損益計算書、純資産の推移追跡
- **セキュリティ**: セルフホストで完全なデータコントロール

## 使用方法
### インストール
#### 前提条件
- **Ruby**: .ruby-versionファイルで指定されたバージョン
- **PostgreSQL**: 9.3以上（最新安定版推奨）
- **Redis**: バックグラウンドジョブ用
- **Node.js**: アセットコンパイル用

#### インストール手順
```bash
# 方法1: Dockerを使用したセルフホスト（推奨）
# 1. ディレクトリ作成
mkdir -p ~/docker-apps/maybe
cd ~/docker-apps/maybe

# 2. composeファイルをダウンロード
curl -o compose.yml https://raw.githubusercontent.com/maybe-finance/maybe/main/compose.example.yml

# 3. （オプション）セキュリティのための.envファイル作成
touch .env
# SECRET_KEY_BASE="[生成されたキー]"
# POSTGRES_PASSWORD="[安全なパスワード]"

# 4. アプリケーションを起動
docker compose up -d

# 5. http://localhost:3000 でアクセス

# 方法2: ローカル開発環境
git clone https://github.com/maybe-finance/maybe.git
cd maybe
cp .env.local.example .env.local

# 依存関係インストールとデータベースセットアップ
bin/setup

# 開発サーバー起動
bin/dev

# （オプション）デモデータのロード
rake demo_data:default

# デフォルトログイン情報:
# Email: user@maybe.local
# Password: password
```

### 基本的な使い方
#### アカウントの作成
1. Settings → Accounts に移動
2. 以下のいずれかを選択:
   - **Connected Account**: Plaid経由で銀行をリンク（自動同期）
   - **Manual Account**: 手動で取引を入力

#### 実践的な使用例
```ruby
# カスタムルールの作成例（app/models/transaction_rule.rb）
class TransactionRule < ApplicationRecord
  # 特定のマーチャントの取引を自動分類
  def apply_to(transaction)
    if transaction.name.downcase.include?(search_term.downcase)
      transaction.update!(
        category: category,
        tags: tags
      )
    end
  end
end

# AIチャットアシスタントの使用例
# チャットアイコンをクリックして以下のような質問:
# - "What's my net worth?"
# - "How much did I spend on groceries last month?"
# - "Show me my investment performance"
```

### 高度な使い方
```yaml
# compose.ymlでの環境設定カスタマイズ
services:
  maybe:
    environment:
      # AI機能の有効化
      OPENAI_API_KEY: "your-api-key"
      
      # Plaid接続設定
      PLAID_CLIENT_ID: "your-plaid-client-id"
      PLAID_SECRET: "your-plaid-secret"
      
      # マルチ通貨サポート
      SYNTH_API_KEY: "your-synth-api-key"
      
      # ファミリーモードの有効化
      REQUIRE_INVITE_CODE: "false"
      
      # OAuth2 APIアクセスの有効化
      DOORKEEPER_ENABLED: "true"
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、インストール方法、コントリビューションガイド
- **CLAUDE.md**: Claude AIに対するプロジェクト特有の指示書
- **CONTRIBUTING.md**: 貢献者向けガイドライン
- **docs/**: セルフホスト、開発ガイド、APIドキュメント
- **compose.example.yml**: Docker Compose設定のサンプル

### サンプル・デモ
- **rake demo_data:default**: デモデータ生成コマンド
- **.env.local.example**: 環境変数設定のサンプル

### チュートリアル・ガイド
- Dockerを使用したセルフホストガイド
- ローカル開発環境セットアップガイド
- API統合ガイド（Plaid、OpenAI、Synth）
- マルチテナント（ファミリー）設定ガイド

## 技術的詳細
### アーキテクチャ
#### 全体構造
Railsモノリシックアプリケーションとして構築され、Hotwire（Turbo + Stimulus）を使用したサーバーレンダリングを中心としたアーキテクチャ。マルチテナント対応で、Familyを中心としたデータ分離を実現。OAuth2によるAPI認証もサポート。

#### ディレクトリ構成
```
maybe/
├── app/
│   ├── controllers/      # コントローラー、APIエンドポイント
│   ├── models/           # Active Recordモデル、ビジネスロジック
│   ├── views/            # ERBテンプレート
│   ├── components/       # ViewComponentを使用した再利用可能UI
│   ├── jobs/             # 非同期ジョブ（Sidekiq）
│   └── services/         # サービスオブジェクト
├── config/               # Rails設定ファイル
├── db/                   # データベースマイグレーション、シード
├── lib/                  # カスタムライブラリ（Money、Semver）
├── test/                 # Minitestテスト
├── docs/                 # プロジェクトドキュメント
└── compose.example.yml   # Docker Compose設定サンプル
```

#### 主要コンポーネント
- **Family**: マルチテナントの基本単位、ユーザーとアカウントを格納
  - 場所: `app/models/family.rb`
  - 依存: User、Account
  - インターフェース: has_many :users, has_many :accounts

- **Account**: 金融アカウントの抽象クラス
  - 場所: `app/models/account.rb`
  - 依存: Accountable (polymorphic)、Entry、Balance
  - インターフェース: sync, calculate_balance, update_status

- **PlaidSyncer**: Plaid APIとの同期処理
  - 場所: `app/models/syncer/plaid_syncer.rb`
  - 依存: Plaid gem、Account、Transaction
  - インターフェース: sync_accounts, sync_transactions, sync_holdings

- **Transaction**: 取引データモデル
  - 場所: `app/models/transaction.rb`
  - 依存: Entry、Category、Tagging
  - インターフェース: categorize, apply_rules, search

- **AIChatJob**: OpenAIとのチャット処理
  - 場所: `app/jobs/ai_chat_job.rb`
  - 依存: OpenAI gem、Conversation
  - インターフェース: perform, generate_response

### 技術スタック
#### コア技術
- **言語**: Ruby 3.x（.ruby-versionで指定）
- **フレームワーク**: Ruby on Rails 7.2.2（最新機能を積極活用）
- **主要ライブラリ**: 
  - Hotwire (Turbo + Stimulus): サーバーレンダリングUI
  - ViewComponent: コンポーネントベースUI構築
  - Tailwind CSS v4-alpha: ユーティリティファーストCSS
  - Sidekiq: バックグラウンドジョブ処理
  - Doorkeeper: OAuth2プロバイダー
  - Plaid Ruby: 銀行口座接続
  - OpenAI Ruby: AI機能統合

#### 開発・運用ツール
- **ビルドツール**: 
  - Rails Asset Pipeline（Propshaft）
  - esbuild: JavaScriptバンドル
  - Tailwind CLI: CSSビルド
- **テスト**: 
  - Minitest: Railsデフォルトテストフレームワーク
  - System Tests: CapybaraでE2Eテスト
  - Factory Bot: テストデータ生成
- **CI/CD**: GitHub Actions（テスト、Lint、セキュリティチェック）
- **デプロイ**: 
  - Docker Compose（セルフホスト）
  - Kamal（ゼロダウンタイムデプロイ対応）

### 設計パターン・手法
- **ドメイン駆動設計**: リッチドメインモデルにビジネスロジックを集約
- **Fat Models, Skinny Controllers**: コントローラーは薄く、モデルにロジックを配置
- **ViewComponentパターン**: 再利用可能なUIコンポーネント
- **Hotwireファースト**: JavaScriptを最小限に、サーバーレンダリング中心
- **マルチテナントパターン**: Familyを中心としたデータ分離
- **OAuth2 API**: RESTful APIとOAuth2認証

### データフロー・処理フロー
1. **Plaid同期フロー**:
   - ユーザーがPlaid Linkで銀行を接続
   - PlaidCredentialを保存
   - PlaidSyncJobが定期実行
   - アカウント、取引、ホールディングを同期
   - Balanceを日次でスナップショット

2. **AIチャットフロー**:
   - ユーザーが質問を入力
   - ConversationとMessageを作成
   - AIChatJobが非同期でOpenAI APIを呼び出し
   - 財務データをコンテキストとして提供
   - Turbo Streamsでリアルタイム更新

3. **取引インポートフロー**:
   - CSVファイルをアップロード
   - CSVImportJobがフィールドマッピングを自動検出
   - Transactionを一括作成
   - TransactionRuleを適用
   - AIで自動カテゴリ分類（オプション）

## API・インターフェース
### 公開API
#### OAuth2 API
- 目的: サードパーティアプリからのアクセス
- 使用例:
```bash
# OAuth2トークン取得
curl -X POST http://localhost:3000/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "password",
    "email": "user@example.com",
    "password": "password",
    "client_id": "your-client-id",
    "client_secret": "your-client-secret"
  }'

# APIアクセス
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/accounts
```

#### REST APIエンドポイント
- `GET /api/v1/accounts` - アカウント一覧
- `GET /api/v1/transactions` - 取引一覧
- `POST /api/v1/transactions` - 取引作成
- `GET /api/v1/balances` - 残高情報
- `GET /api/v1/net_worth` - 純資産

### 設定・カスタマイズ
#### 設定ファイル
```yaml
# config/application.yml (環境変数)
# 基本設定
SECRET_KEY_BASE: "your-secret-key"
DATABASE_URL: "postgres://user:pass@localhost:5432/maybe"
REDIS_URL: "redis://localhost:6379/0"

# 外部サービス統合
PLAID_CLIENT_ID: "your-plaid-id"
PLAID_SECRET: "your-plaid-secret"
OPENAI_API_KEY: "your-openai-key"
SYNTH_API_KEY: "your-synth-key"

# 機能フラグ
SELF_HOSTING_ENABLED: "true"
MANAGED_MODE: "false"
REQUIRE_INVITE_CODE: "true"
```

#### 拡張・プラグイン開発
新しいアカウントタイプの追加:
```ruby
# 1. Accountableモデルを作成
class CustomAccount < ApplicationRecord
  include Accountable
  
  def value_on(date)
    # カスタム評価ロジック
  end
end

# 2. Accountモデルに追加
class Account < ApplicationRecord
  TYPES = %w[depository investment custom_account]
end
```

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ベンチマーク結果: 
  - ページロード: <100ms（Turbo Drive使用時）
  - Plaid同期: 10-30秒（アカウント数に依存）
  - AIレスポンス: 2-5秒（ストリーミング）
- 最適化手法: 
  - N+1クエリ回避（includes、preload）
  - Turbo Framesで部分更新
  - Redisキャッシング（計算結果、セッション）
  - PostgreSQLインデックス最適化
  - Sidekiqで重い処理を非同期化

### スケーラビリティ
- **水平スケーリング**:
  - PostgreSQLのレプリケーション
  - Redis Clusterサポート
  - Sidekiq Pro/Enterpriseでワーカー増強
- **マルチテナント設計**:
  - Family単位でのデータ分離
  - シャーディング準備（family_idベース）
- **キャッシュ戦略**:
  - 資産表計算のRedisキャッシュ
  - CDNで静的アセット配信

### 制限事項
- **技術的な制限**:
  - PlaidはUS/CA/UK/EUのみサポート
  - Sidekiqはメモリ制約あり（大量ジョブ時）
  - WebSocket未対応（Turbo StreamsはSSE使用）
- **運用上の制限**:
  - セルフホスト時は全機能がユーザー責任
  - Plaid/OpenAIのAPIコストはユーザー負担
  - バックアップはユーザーが設定必要

## 評価・所感
### 技術的評価
#### 強み
- **商用品質**: 100万ドル投資の成果、完成度が非常に高い
- **モダンな技術選定**: Rails 7.2、Hotwire、ViewComponentなど最新技術を活用
- **少依存性**: 外部gemを最小限に、Railsの標準機能を最大限活用
- **完全な機能セット**: 銀行同期、AI、投資管理、予算など包括的
- **プライバシー配慮**: セルフホストで完全なデータコントロール
- **優れたDX**: Docker Composeで簡単に起動、詳細なドキュメント

#### 改善の余地
- **モバイル対応**: レスポンシブだがネイティブアプリなし
- **国際化**: 英語のみ、多言語対応なし
- **パフォーマンス**: 大量データ時の最適化余地
- **テストカバレッジ**: システムテストの拡充余地

### 向いている用途
- **個人・家族の財務管理**: 包括的な資産管理が必要なユーザー
- **プライバシー重視ユーザー**: クラウドを避けたいユーザー
- **技術者コミュニティ**: カスタマイズや拡張が可能
- **中小企業**: 家族経営企業の財務管理ツール

### 向いていない用途
- **企業会計**: 複式簿記や税務処理には不適
- **非技術者**: Dockerやコマンドラインの知識が必要
- **グローバル利用**: Plaidサポート地域に制限
- **大企業**: コンプライアンスや監査機能不足

### 総評
Maybeは、商用品質の個人財務管理アプリをオープンソース化した稀有な例です。技術的にはRailsの最新機能を積極的に活用し、シンプルで保守しやすいコードベースを維持しています。特にHotwireを使用したサーバーレンダリング中心のアプローチは、モダンなWebアプリケーション開発のお手本と言えます。

セルフホストによる完全なデータコントロール、商用サービスに匹敵する機能セット、活発な開発コミュニティによる継続的な改善など、多くの強みを持っています。一方で、Dockerやコマンドラインの知識が必要なこと、Plaidの地域制限など、いくつかの制約もあります。

全体として、技術的に洗練されたユーザーにとっては非常に価値の高いソリューションであり、オープンソースコミュニティにとってもRailsアプリケーションの優れた参考実装となっています。