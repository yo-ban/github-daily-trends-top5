# リポジトリ解析: juspay/hyperswitch

## 基本情報
- リポジトリ名: juspay/hyperswitch
- 主要言語: Rust
- スター数: 23,044
- フォーク数: 3,911
- 最終更新: アクティブに更新中
- ライセンス: Apache License 2.0
- トピックス: payments, rust, payment-gateway, payment-processor, orchestration

## 概要
### 一言で言うと
Rustで構築されたオープンソースのペイメントオーケストレーションプラットフォーム。「ペイメントのLinux」として、企業が自社の決済スタックを完全にコントロールできるようにする。

### 詳細説明
Hyperswitchは、Juspayによって開発されたコンポーザブルなオープンソース決済インフラです。従来の決済ゲートウェイの問題点（ベンダーロックイン、不透明なコスト、限定的な機能）を解決するために設計されています。

このプラットフォームは、企業が必要なコンポーネントだけを選択して使用できるモジュラーアーキテクチャを採用し、既存の決済スタックの上に統合できるように設計されています。現在、400以上の企業が使用しており、150名以上のエンジニアによって積極的に開発されています。

### 主な特徴
- **コネクター非依存**: 50以上のグローバル決済プロセッサーをサポート
- **モジュラーアーキテクチャ**: 必要なコンポーネントのみを選択可能
- **コスト可視性**: 決済コストの監査、監視、最適化ツール
- **インテリジェントルーティング**: MLベースの動的ルーティングで承認率を最大化
- **リトライメカニズム**: パッシブチャーンを減らすインテリジェントリトライ戦略
- **PCIコンプライアンス**: カード、トークン、ウォレットの安全な保管
- **100+通貨サポート**: グローバルな決済に対応
- **Rustによる高パフォーマンス**: 高速、信頼性、メモリ安全性

## 使用方法
### インストール
#### 前提条件
- Rust 1.70以上
- PostgreSQL 14.9以上
- Redis 7.0以上
- DockerとDocker Compose（オプション）
- Node.js 16+（E2Eテスト用）

#### インストール手順
```bash
# 方法1: Docker Composeを使用（推奨）
git clone https://github.com/juspay/hyperswitch
cd hyperswitch
docker compose up -d

# サンドボックス環境へアクセス
# http://localhost:9000 - コントロールセンター
# http://localhost:8080 - APIエンドポイント

# 方法2: ソースからビルド
# 依存関係のインストール
./scripts/setup.sh

# ビルドと実行
cargo build --release
./target/release/hyperswitch
```

### 基本的な使い方
#### Hello World相当の例
```bash
# マーチャントアカウントの作成
curl -X POST http://localhost:8080/accounts \
  -H "Content-Type: application/json" \
  -H "api-key: ${API_KEY}" \
  -d '{
    "merchant_id": "merchant_001",
    "merchant_name": "My Store",
    "merchant_details": {
      "primary_contact_person": "John Doe",
      "primary_email": "john@mystore.com"
    }
  }'

# ペイメントの作成
curl -X POST http://localhost:8080/payments \
  -H "Content-Type: application/json" \
  -H "api-key: ${API_KEY}" \
  -d '{
    "amount": 1000,
    "currency": "USD",
    "confirm": true,
    "payment_method": {
      "type": "card",
      "card": {
        "card_number": "4242424242424242",
        "card_exp_month": "12",
        "card_exp_year": "2025",
        "card_cvc": "123"
      }
    }
  }'
```

#### 実践的な使用例
```javascript
// Node.js SDKを使用したペイメントフロー
const hyperswitch = require('@juspay-tech/hyperswitch-node');

const client = hyperswitch({
  apiKey: process.env.HYPERSWITCH_API_KEY,
  baseUrl: 'http://localhost:8080'
});

// 顧客の作成
const customer = await client.customers.create({
  email: 'customer@example.com',
  name: 'John Doe',
  phone: '+1234567890'
});

// ペイメントメソッドの保存
const paymentMethod = await client.paymentMethods.create({
  customer_id: customer.customer_id,
  payment_method: 'card',
  payment_method_type: 'credit',
  card: {
    card_number: '4242424242424242',
    card_exp_month: '12',
    card_exp_year: '2025',
    card_holder_name: 'John Doe'
  }
});

// リカーリングペイメントの設定
const payment = await client.payments.create({
  amount: 5000,
  currency: 'USD',
  customer_id: customer.customer_id,
  payment_method_id: paymentMethod.payment_method_id,
  setup_future_usage: 'off_session',
  mandate_data: {
    customer_acceptance: {
      acceptance_type: 'online',
      accepted_at: new Date().toISOString(),
      online: {
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0...'
      }
    }
  }
});
```

### 高度な使い方
```rust
// カスタムコネクターの実装例
use hyperswitch_connectors::{
    ConnectorCommon, ConnectorIntegration, 
    types::{PaymentsAuthorizeData, PaymentsResponseData}
};

#[derive(Debug, Clone)]
pub struct MyCustomConnector;

impl ConnectorCommon for MyCustomConnector {
    fn id(&self) -> &'static str {
        "my_custom_connector"
    }
    
    fn get_auth_header(
        &self,
        auth_type: &types::ConnectorAuthType,
    ) -> CustomResult<Vec<(String, request::Maskable<String>)>, errors::ConnectorError> {
        // API認証ヘッダーの構築
        let auth = auth_type
            .as_api_key()
            .ok_or(errors::ConnectorError::FailedToObtainAuthType)?;
        
        Ok(vec![(
            "Authorization".to_string(),
            format!("Bearer {}", auth.api_key).into_masked(),
        )])
    }
}

// ペイメント承認の実装
impl ConnectorIntegration<Authorize, PaymentsAuthorizeData, PaymentsResponseData>
    for MyCustomConnector
{
    fn get_url(
        &self,
        _req: &PaymentsAuthorizeData,
        connectors: &settings::Connectors,
    ) -> CustomResult<String, errors::ConnectorError> {
        Ok(format!("{}/payments", self.base_url(connectors)))
    }
    
    fn get_request_body(
        &self,
        req: &PaymentsAuthorizeData,
    ) -> CustomResult<Option<RequestContent>, errors::ConnectorError> {
        let connector_req = MyConnectorPaymentRequest {
            amount: req.request.amount,
            currency: req.request.currency,
            card: self.get_card_details(&req.request.payment_method_data)?,
        };
        
        Ok(Some(RequestContent::Json(Box::new(connector_req))))
    }
    
    fn handle_response(
        &self,
        data: &PaymentsAuthorizeData,
        res: Response,
    ) -> CustomResult<PaymentsResponseData, errors::ConnectorError> {
        let response: MyConnectorResponse = res
            .response
            .parse_struct("MyConnectorResponse")
            .change_context(errors::ConnectorError::ResponseDeserializationFailed)?;
            
        // レスポンスをHyperswitch形式に変換
        types::RouterData::try_from(ResponseRouterData {
            response,
            data: data.clone(),
            http_code: res.status_code,
        })
    }
}
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、インストール手順
- **docs/**: コントリビューションガイド、セキュリティポリシー
- **api-reference/**: OpenAPI仕様書、APIドキュメント
- **add_connector.md**: 新しい決済コネクターの追加方法
- **公式サイト**: https://hyperswitch.io/

### サンプル・デモ
- **postman/**: Postmanコレクション（全コネクター対応）
- **connector-template/**: 新コネクター追加用テンプレート
- **cypress-tests/**: E2Eテストケース
- **config/config.example.toml**: 設定ファイルのサンプル

### チュートリアル・ガイド
- 公式ドキュメント: https://docs.hyperswitch.io/
- GitHub Discussions: コミュニティサポート
- Slack/Discord: リアルタイムサポート
- YouTube: Hyperswitch公式チャンネル

## 技術的詳細
### アーキテクチャ
#### 全体構造
Hyperswitchは、モジュラーでコンポーザブルなアーキテクチャを採用しています：

1. **コアルーター**: ペイメント処理エンジン
2. **コネクターレイヤー**: 各決済プロセッサーとの統合
3. **データレイヤー**: PostgreSQLでの持続化
4. **キャッシュレイヤー**: Redisでの高速アクセス
5. **監視レイヤー**: Prometheus、Grafana、OTEL

#### ディレクトリ構成
```
hyperswitch/
├── crates/            # Rustワークスペース
│   ├── router/        # コア決済処理エンジン
│   ├── api_models/    # APIモデル定義
│   ├── hyperswitch_connectors/  # コネクター実装
│   ├── diesel_models/ # データベースモデル
│   ├── analytics/     # 分析・レポート
│   └── scheduler/     # タスクスケジューラー
├── migrations/        # データベースマイグレーション
├── config/            # 設定ファイル
├── api-reference/     # APIドキュメント
├── monitoring/        # 監視設定
└── cypress-tests/     # E2Eテスト
```

#### 主要コンポーネント
- **Router**: ペイメントルーティングと処理
  - 場所: `crates/router/`
  - 依存: api_models, diesel_models, connectors
  - インターフェース: payments, refunds, mandates API

- **Connectors**: 決済プロセッサー統合
  - 場所: `crates/hyperswitch_connectors/`
  - 依存: ConnectorCommon, ConnectorIntegration traits
  - インターフェース: authorize, capture, void, refund

- **Analytics**: データ分析エンジン
  - 場所: `crates/analytics/`
  - 依存: ClickHouse, PostgreSQL
  - インターフェース: metrics, reports, dashboards

- **Scheduler**: バックグラウンドタスク処理
  - 場所: `crates/scheduler/`
  - 依存: Redis, PostgreSQL
  - インターフェース: retry, webhook, reconciliation

### 技術スタック
#### コア技術
- **言語**: Rust 1.70+（メモリ安全性、並行処理、async/await）
- **Webフレームワーク**: 
  - Actix-web: 高性能HTTPサーバー
  - Axum: 代替フレームワークオプション
- **主要ライブラリ**: 
  - Diesel: ORMとデータベースアクセス
  - Tokio: 非同期ランタイム
  - Serde: シリアライゼーション
  - Redis-rs: Redisクライアント
  - Reqwest: HTTPクライアント

#### 開発・運用ツール
- **ビルドツール**: 
  - Cargo: Rustパッケージマネージャー
  - Make: ビルドオートメーション
  - Nix: 再現可能な開発環境
- **テスト**: 
  - 単体テスト: cargo test
  - E2Eテスト: Cypress
  - パフォーマンス: locust
- **CI/CD**: 
  - GitHub Actions
  - コードカバレッジレポート
- **デプロイ**: 
  - Docker/Docker Compose
  - Helm charts (K8s)
  - AWS CloudFormation

### 設計パターン・手法
- **モジュラーアーキテクチャ**: 独立したコンポーネントの組み合わせ
- **ストラテジーパターン**: コネクター実装の抽象化
- **リポジトリパターン**: データアクセス層の分離
- **ファサードパターン**: 統一APIインターフェース
- **イベントドリブン**: Webhookを使用した通知

### データフロー・処理フロー
1. **APIリクエスト受信**: 
   - 認証・認可
   - リクエスト検証
   - レート制限確認

2. **ルーティング決定**:
   - ルールエンジン評価
   - MLベースの最適コネクター選択
   - フォールバック処理

3. **コネクター処理**:
   - データ変換（Hyperswitch → コネクター形式）
   - APIコール
   - レスポンス変換（コネクター → Hyperswitch形式）

4. **データ持続化**:
   - PostgreSQLへの保存
   - Redisキャッシュ更新
   - 監査ログ記録

5. **レスポンス返却**:
   - 統一フォーマットでの応答
   - Webhookイベント発火

## API・インターフェース
### 公開API
#### Payments API
- 目的: ペイメントの作成、確認、キャプチャ
- 使用例:
```bash
# ペイメント作成
POST /payments
{
  "amount": 1000,
  "currency": "USD",
  "payment_method": {
    "type": "card",
    "card": {...}
  },
  "routing": {
    "type": "single",
    "data": {"connector": "stripe"}
  }
}
```

#### Routing API
- 目的: 動的ルーティングルールの設定
- 使用例:
```json
// ルーティングルール作成
POST /routing
{
  "name": "high_value_routing",
  "algorithm": {
    "type": "priority",
    "data": [
      {
        "connector": "adyen",
        "merchant_connector_id": "mca_123"
      }
    ]
  },
  "profile_id": "pro_123"
}
```

### 設定・カスタマイズ
#### 設定ファイル
```toml
# config.tomlの例
[server]
host = "0.0.0.0"
port = 8080
workers = 4

[database]
username = "hyperswitch"
password = "secure_password"
host = "localhost"
port = 5432
dbname = "hyperswitch_db"
pool_size = 20

[redis]
host = "localhost"
port = 6379
pool_size = 10
reconnect_max_attempts = 5

[jwekey]
vault_encryption_key = "..."
vault_private_key = "..."
vault_public_key = "..."

[connectors.supported]
wallets = ["applepay", "googlepay", "paypal"]
cards = ["credit", "debit"]
bank_transfers = ["ach", "sepa", "bacs"]
```

#### 拡張・プラグイン開発
- **新コネクター追加**: 
  - connector-template/をコピー
  - ConnectorCommon、ConnectorIntegration traitを実装
  - transformersでデータ変換定義
- **カスタムルーティング**: 
  - ルールエンジンAPIを使用
  - カスタムアルゴリズムの実装
- **Webhookハンドラー**: 
  - イベントタイプごとのハンドラー定義
- **カスタム認証**: 
  - AuthN/AuthZプロバイダーの統合

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- **レイテンシ**: API応答 <50ms (p99)
- **スループット**: 10,000+ TPS
- **最適化手法**:
  - Rustのゼロコスト抽象化
  - 非同期I/O (Tokio)
  - コネクションプーリング
  - Redisキャッシュの活用
  - データベースクエリ最適化

### スケーラビリティ
- 水平スケーリング: ステートレスアーキテクチャ
- マルチテナント対応: マーチャントごとの分離
- データベースシャーディング対応
- ロードバランサー対応
- リージョン別デプロイメント

### 制限事項
- Rustの学習曲線が急峻
- 一部のコネクターは地域制限あり
- リアルタイム分析はClickHouseが必要
- 完全なSaaS版は提供されていない

## 評価・所感
### 技術的評価
#### 強み
- **ベンダー非依存**: ロックインなしで柔軟な決済スタック
- **完全なコントロール**: ソースコードとデータの完全な所有権
- **コスト最適化**: 詳細なコスト分析と最適化ツール
- **高パフォーマンス**: Rustによる優れた性能
- **活発なコミュニティ**: 150+名のエンジニアによる開発

#### 改善の余地
- ドキュメントのさらなる充実
- より多くのコネクターサポート
- GUIベースの管理ツール
- マネージドサービスオプション
- ノーコード統合ツール

### 向いている用途
- 複数の決済プロセッサーを使用する企業
- 決済コストの最適化が必要な企業
- ベンダーロックインを避けたい組織
- 高度なルーティング機能が必要なケース
- セルフホストを好む企業

### 向いていない用途
- 単一の決済プロセッサーで十分な場合
- 技術リソースが限られる小規模企業
- フルマネージドサービスを望む場合
- Rustの学習が困難なチーム
- シンプルな決済ゲートウェイが必要な場合

### 総評
Hyperswitchは、「ペイメントのLinux」というコンセプトを見事に実現した、革新的なオープンソース決済プラットフォームです。特に、ベンダーロックインからの解放と、完全なコントロールを企業に提供する点が大きな価値です。

Rustでの実装による高パフォーマンスと信頼性、モジュラーアーキテクチャによる柔軟性、そして活発なコミュニティによる継続的な改善は、このプロジェクトの強みです。現在400以上の企業が利用していることからも、その実用性が証明されています。

一方で、Rustの学習コストの高さや、セルフホストの複雑さは、一部の組織にとって導入の障壁になる可能性があります。しかし、決済スタックへの完全なコントロールを求める企業にとっては、これらの課題を上回る価値があると言えるでしょう。

総合的に見て、Hyperswitchはエンタープライズ向けの次世代決済インフラとして、特にコスト最適化やマルチベンダー戦略を重視する組織にとって非常に魅力的な選択肢です。