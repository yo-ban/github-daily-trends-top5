# リポジトリ解析: juspay/hyperswitch

## 基本情報
- リポジトリ名: juspay/hyperswitch
- 主要言語: Rust
- スター数: 22,434
- フォーク数: 3,886
- 最終更新: 2025年以降
- ライセンス: Apache License 2.0
- トピックス: ペイメントインフラ、オープンソース、Rust、決済システム

## 概要
### 一言で言うと
決済を高速、信頼性高く、手頃な価格で実現するためにRustで書かれたオープンソースのペイメントスイッチ。モジュラー型の決済インフラで、既存の決済スタックに必要な機能だけを統合できる。

### 詳細説明
Hyperswitchは柔軟性と制御を重視したモジュラーでオープンソースの決済インフラを提供。ペイメントスイートの提供に加え、企業が既存の決済スタックの上に必要なモジュールだけを選んで統合できるように設計されている。各モジュールは独立しており、決済処理の異なる側面を最適化するために特化されている。

### 主な特徴
- **コスト可観性**: 決済コストの監査、監視、最適化のための高度な可観性ツール
- **収益回収**: カードbin、地域、方法などで調整されたインテリジェントなリトライ戦略
- **Vault**: PCIコンプライアンスのVaultサービスでカード、トークン、ウォレット、銀行認証情報を保存
- **インテリジェントルーティング**: 予測承認率が最も高いPSPに各トランザクションをルーティング
- **リコンシリエーション**: 2-wayと3-wayリコンシリエーションの自動化
- **代替決済手段**: PayPal、Apple Pay、Google Pay、Samsung Pay、BNPLプロバイダーのドロップインウィジェット

## 使用方法
### インストール
#### 前提条件
- DockerまたはPodman
- Git
- （ソースからのビルドの場合）Rust 1.80.0以上

#### インストール手順
```bash
# 方法1: Dockerを使用したワンクリックローカルセットアップ
git clone --depth 1 --branch latest https://github.com/juspay/hyperswitch
cd hyperswitch
scripts/setup.sh

# デプロイプロファイルの選択:
# - Standard: アプリサーバー + コントロールセンター
# - Full: 監視 + スケジューラーを含む
# - Minimal: スタンドアロンアプリサーバー

# 方法2: AWSへのクラウドデプロイ
# AWS CloudFormationを使用したデプロイボタンが利用可能
# https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=HyperswitchBootstarp&templateURL=https://hyperswitch-synth.s3.eu-central-1.amazonaws.com/hs-starter-config.yaml
```

### 基本的な使い方
#### Hello World相当の例
```bash
# ホステッドサンドボックスへのアクセス
# https://app.hyperswitch.io

# REST APIを使用した決済リクエストの作成
curl -X POST \
  http://localhost:8080/payments \
  -H 'Content-Type: application/json' \
  -H 'api-key: YOUR_API_KEY' \
  -d '{
    "amount": 100,
    "currency": "USD",
    "payment_method": "card",
    "payment_method_data": {
      "card": {
        "card_number": "4242424242424242",
        "card_exp_month": "12",
        "card_exp_year": "25",
        "card_cvc": "123"
      }
    }
  }'
```

#### 実践的な使用例
```javascript
// SDKを使用した決済の統合
import { loadHyperswitch } from "@juspay/hyperswitch-web";

const hyperswitch = await loadHyperswitch("YOUR_PUBLISHABLE_KEY");

// 決済インテントの作成
const paymentIntent = await fetch("/create-payment-intent", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ amount: 5000, currency: "USD" })
}).then(res => res.json());

// 決済ウィジェットのマウント
const elements = hyperswitch.elements({ clientSecret: paymentIntent.client_secret });
const unifiedCheckout = elements.create("unifiedCheckout");
unifiedCheckout.mount("#unified-checkout");

// 決済の確認
const { error } = await hyperswitch.confirmPayment({
  elements,
  confirmParams: {
    return_url: "https://example.com/checkout/complete"
  }
});
```

### 高度な使い方
```yaml
# ルーティングルールの設定例
rules:
  - name: "High Value Routing"
    description: "Route high value payments to premium processors"
    algorithm:
      type: "priority"
      data:
        - if:
            payment_method: ["card"]
            amount: { min: 10000 }
          then:
            connectors:
              - "stripe"
              - "adyen"
        - else:
            connectors:
              - "paypal"
              - "checkout"

# リトライ戦略の設定
retry_config:
  max_attempts: 3
  algorithms:
    - type: "exponential_backoff"
      base_delay_ms: 1000
      max_delay_ms: 60000
    - type: "card_bin_based"
      rules:
        - bin_range: "400000-499999"
          max_attempts: 5
          delay_pattern: [1000, 2000, 5000, 10000, 20000]
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、インストール方法、アーキテクチャ
- **docs/CONTRIBUTING.md**: 貢献ガイドライン
- **公式ドキュメントサイト**: https://docs.hyperswitch.io/
- **APIリファレンス**: api-reference/ディレクトリ

### サンプル・デモ
- **ホステッドサンドボックス**: https://app.hyperswitch.io
- **ローカルセットアップスクリプト**: scripts/setup.sh
- **connector-template**: コネクタ実装のボイラープレートコード

### チュートリアル・ガイド
- ビデオチュートリアル（Dockerセットアップ）
- コネクタ設定ガイド
- 決済テストガイド
- Helm/CDKデプロイガイド

## 技術的詳細
### アーキテクチャ
#### 全体構造
Hyperswitchはモジュラーアーキテクチャを採用し、モノレポワークスペース構造で組織された複数のクレートで構成。主要コンポーネントはアプリサーバー（コア決済エンジン）、WebクライアントSDK、コントロールセンター（管理ダッシュボード）。

#### ディレクトリ構成
```
hyperswitch/
├── crates/                      # Rustクレート集
│   ├── router/                 # メインアプリケーション
│   │   ├── src/
│   │   │   ├── connector/     # 決済ゲートウェイ実装
│   │   │   ├── core/          # コアロジック
│   │   │   ├── routes/        # APIエンドポイント
│   │   │   └── types/         # 型定義
│   ├── api_models/             # APIモデル
│   ├── diesel_models/          # DBモデル
│   ├── analytics/              # 分析機能
│   ├── euclid/                 # ルーティングエンジン
│   ├── drainer/                # Redisストリーム処理
│   └── masking/                # PII保護
├── config/                      # 設定ファイル
├── scripts/                     # セットアップスクリプト
└── docs/                        # ドキュメント
```

#### 主要コンポーネント
- **Router**: コア決済エンジン/オーケストレータ
  - 場所: `crates/router/`
  - 役割: 決済フロー管理、コネクタ統合、ルーティング
  - インターフェース: REST API (actix-web)

- **Euclid**: ルーティングエンジン
  - 場所: `crates/euclid/`
  - 役割: 動的ルーティングロジック、スマートルーティング
  - 依存: router

- **Analytics**: 分析モジュール
  - 場所: `crates/analytics/`
  - 役割: 決済分析、メトリクス収集
  - 依存: ClickHouse, OpenSearch

- **Drainer**: 非同期タスク処理
  - 場所: `crates/drainer/`
  - 役割: Redisストリームからのデータ処理
  - 依存: Redis, データベース

### 技術スタック
#### コア技術
- **言語**: Rust (1.80.0+)
  - `unsafe_code = "forbid"` - 安全性を重視
  - 厳格なlint設定による高品質コード
- **Webフレームワーク**: actix-web (REST API)
- **主要ライブラリ**: 
  - diesel: ORM/データベースアクセス
  - redis: キャッシュ/キューイング
  - serde: シリアライゼーション
  - tracing: ログ/トレーシング
  - tokio: 非同期ランタイム

#### 開発・運用ツール
- **ビルドツール**: Cargo (モノレポワークスペース)
- **テスト**: 
  - 単体テスト、統合テスト
  - Newmanを使用したAPIテスト
- **CI/CD**: GitHub Actions
- **デプロイ**: 
  - Docker/Podman
  - Kubernetes (Helmチャート)
  - AWS CloudFormation/CDK

### 設計パターン・手法
- **モジュラーアーキテクチャ**: 各機能を独立したクレートとして分離
- **プラグインアーキテクチャ**: コネクタをプラグインとして実装
- **イベント駆動**: Redisストリームを使用した非同期処理
- **レイヤードアーキテクチャ**: API層、ビジネスロジック層、データ層の分離

### データフロー・処理フロー
1. APIリクエスト受信 (actix-web)
2. 認証・認可チェック
3. ルーティングエンジンによるコネクタ選択
4. コネクタ固有のデータ変換
5. 外部PSPへのAPIコール
6. レスポンスの正規化
7. イベントのRedisストリームへの発行
8. Webhook通知（必要に応じて）

## API・インターフェース
### 公開API
#### Payment API
- 目的: 決済の作成、確認、キャンセル
- エンドポイント:
  - POST /payments - 決済の作成
  - GET /payments/:id - 決済情報の取得
  - POST /payments/:id/confirm - 決済の確認
  - POST /payments/:id/cancel - 決済のキャンセル

```rust
// APIクライアントの使用例
let client = HyperswitchClient::new("sk_test_...");

let payment = client
    .payments()
    .create(CreatePaymentRequest {
        amount: 1000,
        currency: "USD".to_string(),
        payment_method: PaymentMethod::Card,
        ..Default::default()
    })
    .await?;
```

### 設定・カスタマイズ
#### 設定ファイル
```toml
# config/development.toml
[server]
host = "0.0.0.0"
port = 8080

[database]
username = "hyperswitch"
password = "hyperswitch"
host = "localhost"
port = 5432
dbname = "hyperswitch_db"

[redis]
host = "localhost"
port = 6379

[jwekey]
vault_encryption_key = "..."
```

#### 拡張・プラグイン開発
新しいコネクタの追加:
1. connector-templateを使用してボイラープレートを生成
2. `Connector`トレイトを実装
3. データ変換ロジックを実装
4. テストを作成
5. コネクタリストに登録

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- Rustによる高速処理と低メモリフットプリント
- 非同期I/Oによる高スループット
- Redisを使用したキャッシング最適化
- コネクタプールによる接続管理

### スケーラビリティ
- 水平スケーリング対応
- Kubernetes上でのオートスケーリング
- ステートレスアーキテクチャ
- マルチテナント対応

### 制限事項
- 現在のPostgreSQL専用（他のDB対応は今後）
- 一部の決済メソッドは特定地域のみ対応
- コミュニティ版では一部エンタープライズ機能が制限

## 評価・所感
### 技術的評価
#### 強み
- モジュラーアーキテクチャによる柔軟性
- Rustによる高いパフォーマンスと安全性
- 包括的な決済機能（ルーティング、リトライ、分析等）
- ベンダーロックインなし
- 活発な開発（150人以上のエンジニア）
- 実戦的なエンタープライズ経験（Juspayによる400以上の企業での実績）

#### 改善の余地
- ドキュメントの充実（特に日本語）
- コミュニティの拡大
- データベースの選択肢拡充
- エコシステムの成熟

### 向いている用途
- 複数のPSPを使用する企業
- グローバルな決済が必要なビジネス
- 決済コストの最適化が重要な企業
- 既存システムをモジュール単位で強化したい企業
- オープンソースで完全な制御を望む企業

### 向いていない用途
- 単一PSPで十分な小規模ビジネス
- シンプルな決済機能のみ必要な場合
- マネージドサービスを望む企業

### 総評
Hyperswitchは「決済のLinux」を目指す野心的なプロジェクト。モジュラーアーキテクチャにより、企業が必要な機能だけを選んで導入できる柔軟性が魅力。Rustで書かれており、パフォーマンスと信頼性が高い。特にコスト可観性、収益回収、インテリジェントルーティングなどの高度な機能は、大規模な決済を扱う企業にとって大きな価値を提供する。Apache 2.0ライセンスで商用利用も容易。今後のエコシステムの成長が期待される。