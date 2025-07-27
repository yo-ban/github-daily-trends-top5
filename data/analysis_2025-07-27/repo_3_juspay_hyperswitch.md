# リポジトリ解析: juspay/hyperswitch

## 基本情報
- リポジトリ名: juspay/hyperswitch
- 主要言語: Rust
- スター数: 22,893
- フォーク数: 3,894
- 最終更新: 高頻度に更新中
- ライセンス: Apache License 2.0
- トピックス: Payments Infrastructure、Open Source、Rust、Payment Router、Payment Orchestration

## 概要
### 一言で言うと
Hyperswitchは、Rustで書かれたモジュラー・オープンソースの決済インフラストラクチャで、企業が必要な機能だけを選んでカスタマイズできる決済ルーティングシステムです。

### 詳細説明
Hyperswitchは「決済のLinux」を目指して開発された商用オープンソースの決済スタックです。柔軟性と制御を重視したモジュラーアーキテクチャを採用し、既存の決済スタックに必要なモジュールだけを追加できるよう設計されています。ベンダーロックインや不要な複雑さを避け、各モジュールは独立して動作し、決済処理の異なる側面を最適化するように設計されています。Juspay社によって保守されており、400以上の大手企業の決済インフラをサポートしているチームが開発しています。

### 主な特徴
- **コスト可観性**: AIを活用した高度な可観性ツールで決済コストを監査、監視、最適化
- **収益回復**: カードBIN、地域、方法などで調整されたインテリジェントなリトライ戦略
- **Vault**: PCI準拠のVaultサービスでカード、トークン、ウォレット、銀行認証情報を保存
- **インテリジェントルーティング**: 最高の承認率を予測してPSPにトランザクションをルーティング
- **照合**: バックデートサポート付きの2-way/3-way照合の自動化
- **代替決済手法**: PayPal、Apple Pay、Google Pay、BNPLなどのドロップインウィジェット
- **モジュラーアーキテクチャ**: 必要な機能だけを選んで利用可能
- **Rustで構築**: パフォーマンスと信頼性を重視

## 使用方法
### インストール
#### 前提条件
- DockerまたはPodman
- Git
- Docker Compose
- クラウドデプロイの場合：AWS/GCP/Azureアカウント
- Rust 1.80.0以上（ソースからビルドする場合）

#### インストール手順
```bash
# 方法1: Docker経由のローカルセットアップ（ワンクリック）
git clone --depth 1 --branch latest https://github.com/juspay/hyperswitch
cd hyperswitch
scripts/setup.sh

# 方法2: AWSへのクラウドデプロイ
# AWSコンソールでCloudFormationスタックを起動
# またはHelmチャートを使用

# 方法3: Docker Composeでの詳細設定
docker-compose -f docker-compose.yml up -d
```

### 基本的な使い方
#### Hello World相当の例
```bash
# 決済の作成（シンプルなカード決済）
curl --location 'http://localhost:8080/payments' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'api-key: YOUR_API_KEY' \
--data '{
  "amount": 1000,
  "currency": "USD",
  "payment_method_data": {
    "card": {
      "card_number": "4242424242424242",
      "card_exp_month": "12",
      "card_exp_year": "25",
      "card_holder_name": "John Doe",
      "card_cvc": "123"
    }
  }
}'
```

#### 実践的な使用例
```javascript
// Node.js SDKを使用した決済処理
const hyperswitch = require('@hyperswitch/node');

const client = hyperswitch.Client({
  apiKey: process.env.HYPERSWITCH_API_KEY,
  baseUrl: 'https://api.hyperswitch.io'
});

// コネクターの設定
await client.merchantConnectorAccounts.create({
  connector_name: 'stripe',
  connector_account_details: {
    auth_type: 'HeaderKey',
    api_key: process.env.STRIPE_SECRET_KEY
  },
  payment_methods_enabled: [
    { payment_method: 'card' },
    { payment_method: 'wallet', payment_method_types: ['apple_pay', 'google_pay'] }
  ]
});

// ルーティングルールの設定
await client.routingAlgorithm.create({
  name: 'smart_routing',
  description: 'Route based on success rate',
  algorithm: {
    type: 'priority',
    data: [
      { connector: 'stripe', priority: 1 },
      { connector: 'adyen', priority: 2 }
    ]
  }
});
```

### 高度な使い方
```rust
// Rustでのカスタムコネクター実装
use hyperswitch_interfaces::api::{ConnectorIntegration, Payment};
use hyperswitch_domain_models::router_data::RouterData;

#[derive(Debug, Clone)]
pub struct CustomConnector;

#[async_trait::async_trait]
impl ConnectorIntegration<api::Authorize, types::PaymentsData, types::PaymentsResponseData>
    for CustomConnector
{
    async fn execute_pretasks(
        &self,
        _router_data: &mut RouterData<api::Authorize, types::PaymentsData, types::PaymentsResponseData>,
        _connectors: &settings::Connectors,
    ) -> CustomResult<(), errors::ConnectorError> {
        Ok(())
    }

    async fn get_headers(
        &self,
        req: &types::PaymentsAuthorizeRouterData,
        _connectors: &settings::Connectors,
    ) -> CustomResult<Vec<(String, request::Maskable<String>)>, errors::ConnectorError> {
        let mut headers = vec![
            ("Content-Type".to_string(), "application/json".to_string().into()),
        ];
        // Add authentication headers
        Ok(headers)
    }

    async fn get_url(
        &self,
        _req: &types::PaymentsAuthorizeRouterData,
        connectors: &settings::Connectors,
    ) -> CustomResult<String, errors::ConnectorError> {
        Ok(format!("{}/payments", connectors.custom.base_url))
    }

    // Implement other required methods...
}
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、クイックスタートガイド、アーキテクチャ
- **docs/**: 貢献ガイドライン、セキュリティポリシー、RFCなど
- **公式ドキュメントサイト**: https://docs.hyperswitch.io
- **APIリファレンス**: api-reference/ディレクトリ内にOpenAPI仕様

### サンプル・デモ
- **ホステッドサンドボックス**: https://app.hyperswitch.io（セットアップ不要）
- **Postmanコレクション**: postman/ディレクトリ
- **ビデオチュートリアル**: Dockerを使用したローカルセットアップ

### チュートリアル・ガイド
- コントロールセンターの使い方
- コネクターの設定方法
- 決済テストの実施方法
- Helmを使ったKubernetesへのデプロイ
- Slackコミュニティ: https://inviter.co/hyperswitch-slack

## 技術的詳細
### アーキテクチャ
#### 全体構造
Hyperswitchはマイクロサービスアーキテクチャを採用し、モジュラーでスケーラブルな設計になっています。コアのルーターサービスを中心に、各種決済モジュールが独立して動作します。データストアにはPostgreSQL、キャッシュとストリーミングにはRedis、非同期タスクにはKafkaを使用しています。

#### ディレクトリ構成
```
hyperswitch/
├── crates/              # Rustクレートのモノリポ
│   ├── router/         # メインのルーターアプリケーション
│   ├── api_models/     # APIモデル定義
│   ├── diesel_models/  # データベースモデル
│   ├── hyperswitch_connectors/ # コネクター実装
│   ├── analytics/      # 分析機能
│   ├── payment_methods/ # 決済手法管理
│   └── storage_impl/   # ストレージ実装
├── config/              # 設定ファイル
├── api-reference/       # APIドキュメント
├── cypress-tests/       # E2Eテスト
└── docker/              # Docker設定
```

#### 主要コンポーネント
- **Router**: メインのルーティングエンジン
  - 場所: `crates/router/`
  - 依存: actix-web、diesel、redis
  - インターフェース: REST API、gRPC

- **Connectors**: 決済ゲートウェイ統合
  - 場所: `crates/hyperswitch_connectors/`
  - 依存: hyperswitch_interfaces
  - インターフェース: ConnectorIntegration trait

- **Analytics**: 分析エンジン
  - 場所: `crates/analytics/`
  - 依存: clickhouse、opensearch
  - インターフェース: メトリクスAPI、レポートAPI

- **Storage**: データベース抽象化層
  - 場所: `crates/storage_impl/`
  - 依存: diesel、redis_interface
  - インターフェース: 非同期CRUD操作

### 技術スタック
#### コア技術
- **言語**: Rust 1.80.0以上（安全性とパフォーマンスを重視）
- **フレームワーク**: 
  - Actix-web 4.11（高性能Webフレームワーク）
  - Diesel 2.2（ORM）
  - Tokio（非同期ランタイム）
- **主要ライブラリ**: 
  - bb8 (0.8): データベースコネクションプール
  - rdkafka (0.36): Kafkaクライアント
  - reqwest (0.11): HTTPクライアント
  - jsonwebtoken (9.3): JWT認証
  - openssl (0.10): 暗号化

#### 開発・運用ツール
- **ビルドツール**: 
  - Cargo（Rust標準）
  - Dockerマルチステージビルド
  - Nix（再現可能なビルド環境）
- **テスト**: 
  - 単体テスト: Rust標準テスト
  - 統合テスト: Cypress
  - APIテスト: Postman/Newman
- **CI/CD**: 
  - GitHub Actions
  - バッジ: CI status、License
- **デプロイ**: 
  - Docker Compose（ローカル）
  - Helm Charts（Kubernetes）
  - AWS CloudFormation
  - CDKスクリプト

### 設計パターン・手法
- **モジュラーアーキテクチャ**: 各決済機能が独立したモジュールとして実装
- **traitベースの抽象化**: Rustのtraitを使用したコネクター抽象化
- **イベント駆動アーキテクチャ**: Kafkaを使用した非同期処理
- **CQRSパターン**: 読み取りと書き込みの分離（master/replica DB）
- **キャッシュファースト**: Redisを使用したアグレッシブキャッシング

### データフロー・処理フロー
1. **決済リクエスト受信**:
   - API Gatewayで認証・認可
   - リクエストバリデーション
   - マーチャント設定の取得（Redisキャッシュ）

2. **ルーティング決定**:
   - ルーティングアルゴリズムの実行
   - 成功率・コスト・レイテンシーを考慮
   - 最適なPSPの選択

3. **コネクター処理**:
   - 選択されたPSPのコネクター呼び出し
   - リクエスト/レスポンスの変換
   - エラーハンドリングとリトライ

4. **レスポンス処理**:
   - トランザクションの保存（PostgreSQL）
   - イベントの発行（Kafka）
   - Webhookの送信
   - クライアントへのレスポンス

## API・インターフェース
### 公開API
#### Payments API
- 目的: 決済の作成、確認、キャンセル
- 使用例:
```json
// POST /payments
{
  "amount": 1000,
  "currency": "USD",
  "capture_method": "automatic",
  "payment_method": {
    "type": "card",
    "card": {
      "number": "4242424242424242",
      "exp_month": "12",
      "exp_year": "2025",
      "cvc": "123"
    }
  },
  "routing": {
    "type": "single",
    "data": {"connector": "stripe"}
  }
}
```

#### Routing API
- 目的: ルーティングルールの管理
- エンドポイント: `/routing`, `/routing_algorithm`

### 設定・カスタマイズ
#### 設定ファイル
```toml
# config.toml
[server]
port = 8080
host = "127.0.0.1"
shutdown_timeout = 30

[master_database]
username = "db_user"
password = "db_pass"
host = "localhost"
port = 5432
dbname = "hyperswitch_db"

[redis]
host = "127.0.0.1"
port = 6379
pool_size = 5

[key_manager]
url = "http://localhost:5000"
```

#### 拡張・プラグイン開発
- **カスタムコネクター**: `ConnectorIntegration` traitを実装
- **ルーティングアルゴリズム**: カスタムアルゴリズムの実装
- **Webhookハンドラー**: イベントハンドラーのカスタマイズ
- **フィーチャーフラグ**: Cargo featureで機能の有効/無効化

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- **レイテンシー**: <100msのAPIレスポンスタイム（キャッシュヒット時）
- **スループット**: 数万TPSをサポート
- **最適化手法**: 
  - Rustのゼロコスト抽象化
  - Redisキャッシュの積極的活用
  - 非同期I/O
  - コネクションプーリング

### スケーラビリティ
- **水平スケーリング**: ステートレス設計により簡単にスケールアウト
- **データベース**: 読み取りレプリカによる負荷分散
- **キャッシュ**: Redisクラスタによる高可用性
- **非同期処理**: Kafkaを使用したイベントストリーミング

### 制限事項
- **メモリ使用量**: Rustのmimallocアロケータを使用して最適化
- **データベース**: PostgreSQLが必須（他DBサポートなし）
- **コネクター数**: 現在約40以上のコネクターをサポート
- **地域制限**: 一部の決済手法は特定地域のみ

## 評価・所感
### 技術的評価
#### 強み
- **完全なオープンソース**: Apache 2.0ライセンスで商用利用も可能
- **モジュラーアーキテクチャ**: 必要な機能だけを選択できる柔軟性
- **Rustによる高性能**: メモリ安全性とパフォーマンスの両立
- **豊富なコネクター**: 40以上の決済ゲートウェイをサポート
- **エンタープライズ級の実績**: Juspayの400社以上の企業での実績
- **充実したモニタリング**: コスト可観性、分析、レポート機能

#### 改善の余地
- **学習曲線**: Rustの知識が必要で、カスタマイズには技術力が必要
- **ドキュメント**: 一部の高度な機能のドキュメントが不足
- **エコシステム**: SDKやプラグインの数がまだ少ない
- **データベースサポート**: PostgreSQL以外の選択肢がない

### 向いている用途
- **マルチPSP管理**: 複数の決済ゲートウェイを使い分けたい企業
- **コスト最適化**: 決済コストを細かく分析・最適化したい企業
- **カスタマイズ重視**: 独自のルーティングロジックを実装したい企業
- **グローバル展開**: 多様な決済手法を必要とする国際的なビジネス
- **ベンダーロックイン回避**: オープンソースで決済システムをコントロールしたい企業

### 向いていない用途
- **小規模事業**: 単一PSPで十分な小規模ビジネス
- **技術リソース不足**: Rustエンジニアがいない組織
- **シンプルな要件**: 基本的な決済機能だけで十分な場合
- **SaaS希望**: マネージドサービスを望む場合（セルフホストが前提）

### 総評
Hyperswitchは、「決済のLinux」というビジョンを体現した優れたオープンソース決済インフラストラクチャです。モジュラーアーキテクチャによる柔軟性、Rustによる高性能、豊富な機能セットが特徴で、企業の決済システムに必要なすべてを提供しています。

特に、コスト可観性、インテリジェントルーティング、収益回復などの高度な機能は、単なる決済ゲートウェイを超えた価値を提供します。Juspayの実績に裏打ちされた信頼性と、オープンソースコミュニティによる継続的な改善が、このプロジェクトの強みです。ただし、Rustの技術力が必要な点が導入のハードルとなる可能性があります。