# リポジトリ解析: juspay/hyperswitch

## 基本情報
- リポジトリ名: juspay/hyperswitch
- 主要言語: Rust
- スター数: 22,765
- フォーク数: 3,895
- 最終更新: アクティブに開発中
- ライセンス: Apache License 2.0
- トピックス: ペイメントオーケストレーション、オープンソース決済、モジュラーアーキテクチャ、PCIコンプライアンス

## 概要
### 一言で言うと
Rustで書かれたオープンソースのペイメントスイッチで、決済を高速、信頼性が高く、手頃な価格で実現するモジュラーなペイメントインフラストラクチャ。

### 詳細説明
Hyperswitchは、柔軟性と制御を重視して設計されたモジュラーでオープンソースのペイメントインフラストラクチャです。企業は既存のペイメントスタックの上に必要なモジュールだけを選んで統合でき、不要な複雑さやベンダーロックインを回避できます。「Linux for Payments」と呼ばれ、ペイメントスタックを自分たちで管理したいチームにとっての優れたリファレンス実装です。Juspayチームによって開発・維持され、400以上の大手企業のペイメントインフラを支えています。

### 主な特徴
- モジュラーアーキテクチャ（必要なコンポーネントのみ選択可能）
- インテリジェントルーティング（最高の承認率を予測してPSPを選択）
- リベニューリカバリー（インテリジェントなリトライ戦略）
- PCIコンプライアントなVaultサービス
- コスト観測性（隠れた手数料やダウングレードを検出）
- 自動照合（2-way、3-way照合）
- 100+のペイメントコネクターサポート
- グローバルな決済手段（カード、ウォレット、BNPL、UPI、Bank Transfer）

## 使用方法
### インストール
#### 前提条件
- DockerまたはPodman
- Git
- クラウドデプロイの場合: AWS/GCP/Azureアカウント
- Rust 1.80.0以上（ソースからビルドの場合）

#### インストール手順
```bash
# 方法1: Dockerを使用したワンクリックローカルセットアップ
git clone --depth 1 --branch latest https://github.com/juspay/hyperswitch
cd hyperswitch
scripts/setup.sh

# デプロイプロファイルを選択:
# - Standard: App server + Control Center
# - Full: 監視 + スケジューラーを含む
# - Minimal: スタンドアロンApp server

# 方法2: AWS CloudFormationでのクラウドデプロイ
# AWSコンソールでCloudFormationテンプレートを使用
# https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new

# 方法3: ソースからビルド
cargo build --release
```

### 基本的な使い方
#### Hello World相当の例
```bash
# APIキーの作成
curl --location 'http://localhost:8080/api/keys' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'api-key: test_admin' \
--data-raw '{
    "name": "MyAPIKey",
    "description": "My first API key",
    "expiration": "2025-09-23T01:02:03.000Z"
}'

# シンプルな決済作成
curl --location 'http://localhost:8080/payments' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'api-key: YOUR_API_KEY' \
--data '{
    "amount": 1000,
    "currency": "USD",
    "payment_method": "card",
    "payment_method_data": {
        "card": {
            "card_number": "4111111111111111",
            "card_exp_month": "12",
            "card_exp_year": "2025",
            "card_holder_name": "John Doe",
            "card_cvc": "123"
        }
    }
}'
```

#### 実践的な使用例
```javascript
// Node.js SDKを使用した決済フロー
const hyperswitch = require('@juspay/hyperswitch-node')('YOUR_API_KEY');

// 決済の作成
const payment = await hyperswitch.payments.create({
  amount: 5000,
  currency: 'USD',
  customer_id: 'cust_123',
  capture_method: 'automatic',
  authentication_type: 'three_ds',
  return_url: 'https://example.com/success',
  metadata: {
    order_id: 'order_123'
  },
  routing: {
    algorithm: {
      type: 'priority',
      data: ['stripe', 'adyen']
    }
  }
});

// 決済の確認
const confirmedPayment = await hyperswitch.payments.confirm(payment.payment_id, {
  payment_method: 'card',
  payment_method_data: {
    card: {
      card_number: '4242424242424242',
      card_exp_month: '12',
      card_exp_year: '2025',
      card_cvc: '123'
    }
  }
});
```

### 高度な使い方
```yaml
# ルーティングルールの設定例
name: "High Success Rate Routing"
type: "conditional"
rules:
  - condition:
      payment_method: "card"
      card_network: "visa"
      amount: 
        min: 100
        max: 10000
    connectors:
      - name: "stripe"
        weight: 70
      - name: "adyen" 
        weight: 30
  - condition:
      payment_method: "wallet"
      wallet_type: "apple_pay"
    connectors:
      - name: "cybersource"
        weight: 100

# リトライ設定
retry_config:
  max_attempts: 3
  backoff_strategy: "exponential"
  initial_interval: 1000
  max_interval: 10000
  excluded_error_codes: ["insufficient_funds", "card_declined"]
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、クイックスタート、デプロイ方法
- **docs/architecture.md**: 詳細なアーキテクチャ説明
- **docs/CONTRIBUTING.md**: 貢献ガイドライン
- **add_connector.md**: 新しいペイメントコネクターの追加方法
- **api-reference/**: OpenAPI仕様とAPIドキュメント

### サンプル・デモ
- **Hosted Sandbox**: https://app.hyperswitch.io (セットアップ不要)
- **docker-compose.yml**: ローカル環境の設定例
- **config/deployments/**: 各種環境用の設定サンプル

### チュートリアル・ガイド
- [公式ドキュメント](https://docs.hyperswitch.io/)
- [ビデオチュートリアル](https://docs.hyperswitch.io/hyperswitch-open-source/overview/unified-local-setup-using-docker)
- [ペイメントモジュールの説明](https://docs.hyperswitch.io/about-hyperswitch/payments-modules)
- [Control Center使用ガイド](https://docs.hyperswitch.io/hyperswitch-open-source/account-setup/using-hyperswitch-control-center)

## 技術的詳細
### アーキテクチャ
#### 全体構造
Hyperswitchはマイクロサービスアーキテクチャを採用し、メインコンポーネントとしてRouter（決済処理サービス）とScheduler（タスクスケジューリング）があります。データベースはPostgreSQL（マスター/レプリカ構成）を使用し、Redisでキャッシュとジョブキューを管理します。PCI DSSコンプライアントなLockerで機密性の高い決済データを保存し、OpenTelemetryベースの観測性スタックを備えています。

#### ディレクトリ構成
```
hyperswitch/
├── crates/               # Rustワークスペース
│   ├── router/           # メイン決済ルーティング機能
│   ├── scheduler/        # タスクスケジューラー
│   ├── diesel_models/    # ORMモデル
│   ├── api_models/       # APIリクエスト/レスポンス
│   ├── hyperswitch_connectors/ # 決済コネクター
│   ├── analytics/        # 分析モジュール
│   ├── euclid/           # ルーティングルールDSL
│   └── pm_auth/          # 決済手段認証
├── api-reference/        # OpenAPI仕様
├── config/               # 設定ファイル
├── cypress-tests/        # E2Eテスト
└── migrations/           # DBマイグレーション
```

#### 主要コンポーネント
- **Router**: 決済ルーティングの中核
  - 場所: `crates/router/`
  - 依存: diesel_models, api_models, connectors
  - インターフェース: payments, refunds, customers, mandates

- **Scheduler**: タスク実行エンジン
  - 場所: `crates/scheduler/`
  - 依存: redis_interface, diesel_models
  - インターフェース: Producer/Consumerパターン

- **Euclid**: ルーティングルールDSL
  - 場所: `crates/euclid/`
  - 依存: 独立したロジックエンジン
  - インターフェース: 条件評価、ルール実行

### 技術スタック
#### コア技術
- **言語**: Rust (edition 2021, 最小バージョン1.80.0)
  - unsafeコード禁止の厳格なポリシー
  - 強力なlint設定
- **フレームワーク**: 
  - actix-web 4.x - Webフレームワーク
  - tokio - 非同期ランタイム
  - diesel 2.x - ORM
- **主要ライブラリ**: 
  - serde - シリアライゼーション
  - reqwest - HTTPクライアント
  - redis - Redisクライアント
  - opentelemetry - 観測性
  - jsonwebtoken - JWT処理

#### 開発・運用ツール
- **ビルドツール**: 
  - Cargoワークスペース
  - LTOとコードストリッピングによる最適化
- **テスト**: 
  - 単体テスト、統合テスト
  - Cypress E2Eテスト
- **CI/CD**: GitHub Actions
- **デプロイ**: 
  - Docker/Kubernetes (Helm charts)
  - AWS CloudFormation
  - 監視スタック（Prometheus, Grafana, Loki）

### 設計パターン・手法
- **モジュラーアーキテクチャ**: 各機能が独立したcrateとして実装
- **プラグインパターン**: コネクターをtraitで抽象化
- **CQRSパターン**: コマンドとクエリの分離
- **リポジトリパターン**: データアクセス層の抽象化
- **ストラテジーパターン**: ルーティングアルゴリズムの切り替え

### データフロー・処理フロー
1. **APIリクエスト受信**: actix-webでHTTPリクエストを受付
2. **認証・認可**: APIキーまたはJWTで認証
3. **ビジネスロジック実行**: 
   - ルーティングルール評価
   - 最適なコネクター選択
4. **コネクター呼び出し**: 選択されたPSPのAPIを呼び出し
5. **レスポンス変換**: PSP固有のフォーマットから統一フォーマットへ
6. **データ保存**: PostgreSQLとRedisに保存
7. **Webhook通知**: イベントをマーチャントに通知
8. **監視・ログ**: OpenTelemetryでメトリクスとトレースを送信

## API・インターフェース
### 公開API
#### Payments API
- 目的: 決済の作成、確認、キャプチャ、キャンセル
- エンドポイント:
  - `POST /payments` - 決済作成
  - `POST /payments/{id}/confirm` - 決済確認
  - `POST /payments/{id}/capture` - 決済キャプチャ
  - `POST /payments/{id}/cancel` - 決済キャンセル
  - `GET /payments/{id}` - 決済情報取得

#### Routing API
- 目的: ルーティングルールの管理
- 使用例:
```json
// ルーティングルールの作成
POST /routing
{
  "name": "High Success Rate Routing",
  "description": "Route based on success rates",
  "algorithm": {
    "type": "volume_split",
    "data": {
      "stripe": 60,
      "adyen": 40
    }
  }
}
```

### 設定・カスタマイズ
#### 設定ファイル
```toml
# config.tomlの主要設定
[server]
host = "0.0.0.0"
port = 8080

[database]
username = "hyperswitch"
password = "password"
host = "localhost"
port = 5432
dbname = "hyperswitch_db"

[redis]
host = "localhost"
port = 6379

[log]
level = "info"
console_enabled = true
```

#### 拡張・プラグイン開発
**新しいコネクターの追加**:
1. テンプレート生成スクリプトを実行
2. ConnectorCommonとConnectorIntegration traitを実装
3. リクエスト/レスポンス変換ロジックを実装
4. テストを追加
5. Control Centerでの設定を追加

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- レイテンシ: 低遅延設計（通常100ms未満のAPIレスポンス）
- スループット: 高スループットを実現
- 最適化手法: 
  - Rustのゼロコスト抽象化
  - 非同期I/Oによる並行処理
  - Redisキャッシュの活用
  - PostgreSQLのコネクションプーリング

### スケーラビリティ
- 水平スケーリング: マイクロサービスアーキテクチャ
- データベース: PostgreSQLマスター/レプリカ構成
- キャッシュ: Redisクラスター
- タスクキュー: プロデューサー/コンシューマーパターン
- Kubernetes対応: Helmチャート提供

### 制限事項
- データベースはPostgreSQLに依存
- リアルタイム処理にはRedisが必須
- PCIコンプライアンスのためセキュアな環境が必要
- 一部のコネクターは特定の地域でのみ利用可能

## 評価・所感
### 技術的評価
#### 強み
- Rustによる高性能・高信頼性の実装
- モジュラー設計による柔軟なシステム構成
- 包括的なAPIドキュメントとOpenAPI仕様
- 活発な開発と大規模コミュニティ（22,765スター）
- PCIコンプライアンスを考慮したセキュリティ設計
- 豊富な決済コネクターサポート
- インテリジェントなルーティングとリトライ機能

#### 改善の余地
- Rustの学習コストが高い
- 初期設定の複雑さ
- ドキュメントの一部が未整備
- UI/UXの改善余地（Control Center）

### 向いている用途
- 大規模ECサイトの決済インフラ
- マルチPSPを活用したい企業
- 決済コストの最適化が重要なビジネス
- グローバル展開を考えている企業
- カスタマイズ可能な決済ソリューションを求める企業

### 向いていない用途
- 小規模・シンプルな決済ニーズ
- 単一PSPで十分な場合
- 技術的リソースが限られている組織
- シンプルなSaaSソリューションを好む場合

### 総評
Hyperswitchは、オープンソースの決済オーケストレーションプラットフォームとして非常に完成度が高く、エンタープライズグレードのソリューションです。Rustでの実装によるパフォーマンスとセキュリティ、モジュラー設計による柔軟性が特徴的です。「Linux for Payments」というコンセプトの通り、決済インフラを自社でコントロールしたい企業にとって理想的な選択肢です。Apache License 2.0の下で公開され、Juspayの実績とコミュニティの支援を背景に、今後も発展が期待されるプロジェクトです。