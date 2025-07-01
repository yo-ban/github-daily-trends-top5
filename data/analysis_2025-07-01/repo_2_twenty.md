# リポジトリ解析: twentyhq/twenty

## 基本情報
- リポジトリ名: twentyhq/twenty
- 主要言語: TypeScript
- スター数: 32,351
- フォーク数: 3,590
- 最終更新: 現在も活発に開発中
- ライセンス: デュアルライセンス（AGPL v3およびTwenty.com商用ライセンス）
- トピックス: CRM、オープンソース、TypeScript、React、NestJS、GraphQL、マルチテナント

## 概要
### 一言で言うと
Salesforceの現代的な代替として開発されている、コミュニティ主導のオープンソースCRM（顧客関係管理）システム。

### 詳細説明
Twentyは、高価で閉鎖的な既存のCRMシステムに対する答えとして開発されました。Notion、Airtable、Linearなどのモダンなツールから着想を得た新しいUXパターンを採用し、より良いユーザー体験を提供します。オープンソースとコミュニティを中心に据え、プラグイン機能により広大なエコシステムの構築を目指しています。

現在バージョン0.2.1（アルファ段階）でありながら、すでに本格的なCRM機能を提供しており、エンタープライズ向けの商用ライセンスオプションも用意されています。マルチテナント対応、カスタムオブジェクト/フィールド、ワークフロー自動化など、エンタープライズグレードの機能を備えています。

### 主な特徴
- カスタマイズ可能なデータモデル（カスタムオブジェクト・フィールド）
- フィルター、ソート、グループ化、カンバン・テーブルビューによるレイアウトのパーソナライズ
- カスタムロールによる権限管理
- トリガーとアクションによるワークフロー自動化
- メール・カレンダー統合、ファイル管理
- REST APIとGraphQL APIの両方をサポート
- マルチワークスペース対応

## 使用方法
### インストール
#### 前提条件
**Docker版（本番環境推奨）**
- Docker
- Docker Compose

**開発環境**
- Node.js v22
- Yarn v4
- PostgreSQL
- Redis（オプション）

#### インストール手順
```bash
# 方法1: Docker Composeによるデプロイ（推奨）
git clone https://github.com/twentyhq/twenty.git
cd twenty/packages/twenty-docker

# 環境変数の設定
cp .env.example .env
# .envファイルを編集して設定をカスタマイズ

# サービスの起動
docker compose up -d

# 方法2: ローカル開発環境
git clone https://github.com/twentyhq/twenty.git
cd twenty

# 依存関係のインストール
yarn install

# データベースの作成
psql postgres -c "CREATE DATABASE \"default\";" -c "CREATE DATABASE test;"

# 開発サーバーの起動
yarn start
```

### 基本的な使い方
#### Hello World相当の例
```javascript
// GraphQL APIを使用したクエリ例
query GetCompanies {
  companies {
    edges {
      node {
        id
        name
        domainName
        address
      }
    }
  }
}

// REST APIを使用した例
GET http://localhost:3000/rest/companies
Authorization: Bearer <jwt-token>
```

#### 実践的な使用例
```javascript
// 新しい会社を作成
mutation CreateCompany {
  createCompany(data: {
    name: "Acme Corp",
    domainName: "acme.com",
    employees: 50
  }) {
    id
    name
  }
}

// ワークフローの自動化例
// 1. 新しい取引が作成されたときにトリガー
// 2. 担当者にメール通知を送信
// 3. Slackチャンネルに通知
```

### 高度な使い方
- **カスタムオブジェクトの作成**: 設定画面から独自のビジネスオブジェクトを定義
- **ワークフローの構築**: ビジュアルワークフロービルダーで複雑な自動化を実現
- **Webhookの設定**: 外部システムとのリアルタイム連携
- **サーバーレス関数**: カスタムビジネスロジックの実装

## ドキュメント・リソース
### 公式ドキュメント
- **開発者ドキュメント**: https://twenty.com/developers - API、セルフホスティング、開発ガイド
- **APIドキュメント**: 
  - GraphQL Playground: http://localhost:3000/graphql
  - REST API: http://localhost:3000/rest/open-api/core
- **Storybook**: UIコンポーネントのドキュメント

### サンプル・デモ
- **Chrome拡張機能**: packages/twenty-chrome-extension/ - API統合の実例
- **E2Eテスト**: packages/twenty-e2e-testing/ - 実際の使用パターン
- **Zapier統合**: packages/twenty-zapier/ - 外部サービス連携の例

### チュートリアル・ガイド
- クイックスタートガイド（公式サイト）
- Discord コミュニティ（https://discord.gg/cx5n4Jzs57）
- GitHub Issues での技術サポート

## 技術的詳細
### アーキテクチャ
#### 全体構造
NxモノレポアーキテクチャでNestJSバックエンドとReactフロントエンドを統合管理しています。

#### ディレクトリ構成
```
twenty/
├── packages/
│   ├── twenty-server/         # NestJSバックエンド
│   │   ├── src/engine/       # コアエンジン
│   │   ├── src/modules/      # ビジネスロジック
│   │   └── src/database/     # データベース層
│   ├── twenty-front/          # Reactフロントエンド
│   │   ├── src/modules/      # 機能モジュール
│   │   ├── src/pages/        # ページコンポーネント
│   │   └── src/generated/    # GraphQL型定義
│   ├── twenty-ui/            # 共有UIコンポーネント
│   ├── twenty-shared/        # 共有ユーティリティ
│   └── twenty-docker/        # Docker設定
└── tools/                    # ビルドツール
```

#### 主要コンポーネント
- **TwentyORM**: TypeORMラッパーによる動的エンティティ管理
  - 場所: `packages/twenty-server/src/engine/twenty-orm/`
  - 依存: TypeORM、メタデータシステム
  - インターフェース: ワークスペース固有のリポジトリパターン

- **メタデータエンジン**: 動的スキーマ管理
  - 場所: `packages/twenty-server/src/engine/metadata-modules/`
  - 依存: PostgreSQL、GraphQL
  - インターフェース: ObjectMetadata、FieldMetadata API

- **ワークフローエンジン**: ビジュアルワークフロー実行
  - 場所: `packages/twenty-server/src/modules/workflow/`
  - 依存: BullMQ、サーバーレス関数
  - インターフェース: トリガー、アクション、条件分岐

### 技術スタック
#### コア技術
- **言語**: TypeScript（フロントエンド・バックエンド共通）
- **フレームワーク**: 
  - NestJS 9.0（バックエンド）: エンタープライズグレードNode.jsフレームワーク
  - React 18.2（フロントエンド）: UIライブラリ
- **主要ライブラリ**: 
  - Apollo（GraphQL）: GraphQLクライアント/サーバー
  - TypeORM（ORM）: データベースアクセス
  - Recoil（状態管理）: フロントエンド状態管理
  - BullMQ（ジョブキュー）: 非同期処理

#### 開発・運用ツール
- **ビルドツール**: Nx（モノレポ管理）、Vite（フロントエンドビルド）
- **テスト**: Jest（単体テスト）、Playwright（E2Eテスト）
- **CI/CD**: GitHub Actions（複数のワークフロー）
- **デプロイ**: Docker、Kubernetes対応

### 設計パターン・手法
- **マルチテナントアーキテクチャ**: ワークスペースベースの分離
- **メタデータ駆動設計**: 動的なスキーマとGraphQL API生成
- **リポジトリパターン**: データアクセスの抽象化
- **イベント駆動アーキテクチャ**: モジュール間の疎結合
- **モジュラーモノリス**: 明確なモジュール境界

### データフロー・処理フロー
1. クライアント → GraphQL/REST API リクエスト
2. API Gateway → 認証・認可チェック
3. GraphQLリゾルバー/RESTコントローラー → ビジネスロジック実行
4. TwentyORM → ワークスペース固有のデータアクセス
5. PostgreSQL → データ永続化
6. イベントエミッター → 非同期処理（Webhook、ワークフロー）
7. レスポンス → クライアントに返送

## API・インターフェース
### 公開API
#### GraphQL API
- 動的スキーマ生成（ワークスペースごと）
- 標準CRUD操作 + 複雑なクエリ
- リアルタイムサブスクリプション
- 使用例:
```graphql
mutation CreatePerson($data: PersonCreateInput!) {
  createPerson(data: $data) {
    id
    name {
      firstName
      lastName
    }
  }
}
```

#### REST API
- GraphQLのRESTラッパー
- OpenAPIドキュメント自動生成
- バッチ操作サポート
- エンドポイント: `/rest/*`

### 設定・カスタマイズ
#### 設定ファイル
```bash
# 主要な環境変数
NODE_ENV=production
PG_DATABASE_URL=postgres://user:pass@host:5432/db
REDIS_URL=redis://localhost:6379
APP_SECRET=<32文字のランダム文字列>
SERVER_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001

# 認証設定
AUTH_PASSWORD_ENABLED=true
AUTH_GOOGLE_ENABLED=true
AUTH_MICROSOFT_ENABLED=true

# トークン有効期限
ACCESS_TOKEN_EXPIRES_IN=30m
REFRESH_TOKEN_EXPIRES_IN=60d
```

#### 拡張・プラグイン開発
- **サーバーレス関数**: Node.js 18/22ランタイム対応
- **Webhook**: HMAC署名による安全な外部連携
- **カスタムオブジェクト**: メタデータAPIによる動的定義
- **ワークフローアクション**: カスタムアクションの追加

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ワークスペースレベルのキャッシング（無限TTL）
- カーソルベースのページネーション（60レコード/ページ）
- Redis分散キャッシング
- TypeORMクエリ最適化

### スケーラビリティ
- 水平スケーリング対応（コンテナオーケストレーション）
- マルチテナント分離によるワークスペース独立性
- 非同期ジョブ処理（BullMQ）
- ClickHouse統合による分析ワークロード分離

### 制限事項
- アルファ版のためAPI変更の可能性
- 一部エンタープライズ機能は商用ライセンスが必要
- カスタムフィールドの型に一部制限

## 評価・所感
### 技術的評価
#### 強み
- 優れたアーキテクチャ設計（DDD、クリーンアーキテクチャ）
- 包括的なテストインフラ（240以上のテストファイル）
- エンタープライズグレードの機能（マルチテナント、RBAC、ワークフロー）
- 高度なキャッシング戦略とパフォーマンス最適化
- 活発な開発とコミュニティ

#### 改善の余地
- セキュリティヘッダーの実装（helmet.js等）
- インラインドキュメントの充実
- CORS設定の厳格化（現在ワイルドカード）
- エラーハンドリングの細分化

### 向いている用途
- 中小企業から大企業までのCRMニーズ
- カスタマイズが必要な業界特化型CRM
- データ主権を重視する組織
- 開発者フレンドリーなCRM統合
- コスト削減を目指す組織

### 向いていない用途
- 即座に安定版が必要な本番環境（現在アルファ版）
- 非技術者のみでの運用（セルフホスティングには技術知識が必要）
- 特殊な業界規制への完全準拠が必要な場合

### 総評
Twenty CRMは、モダンな技術スタックと優れたアーキテクチャ設計により、既存の高価なCRMに対する真の代替となる可能性を秘めています。エンタープライズグレードの機能と開発者体験を両立させており、特に技術力のある組織にとって魅力的な選択肢です。

現在アルファ版ですが、コードベースの品質は非常に高く、本番環境での利用も視野に入るレベルです。活発なコミュニティと継続的な開発により、今後さらなる成長が期待できるプロジェクトです。総合評価: **8.5/10**