# リポジトリ解析: twentyhq/twenty

## 基本情報
- リポジトリ名: twentyhq/twenty
- 主要言語: TypeScript
- スター数: 29,504
- フォーク数: 3,425
- 最終更新: 継続的に更新中
- ライセンス: デュアルライセンス（AGPL v3 + 商用ライセンス）
- トピックス: CRM, open-source, salesforce-alternative, react, nestjs, graphql

## 概要
### 一言で言うと
Salesforceのモダンなオープンソース代替品として、完全にカスタマイズ可能でコミュニティ主導で開発されている#1オープンソースCRM。

### 詳細説明
Twentyは、従来のエンタープライズCRMの複雑さと高コストの問題を解決するために設計された、現代的なオープンソースCRMプラットフォームです。NotionやLinearなどの最新のSaaSツールにインスパイアされたUIを持ち、React、NestJS、GraphQLといった最新の技術スタックで構築されています。企業が自社のデータを完全にコントロールし、ベンダーロックインを避けながら、強力なCRM機能を利用できるようにすることを目的としています。

### 主な特徴
- モダンでクリーンなUI（Notion/Linear風）
- 完全なデータ所有権とセルフホスティング
- 動的スキーマとカスタムオブジェクト
- GraphQLファーストAPI設計
- リアルタイム更新とオフラインサポート

## 使用方法
### インストール
#### 前提条件
- Docker 20.10以上（推奨）
- Node.js 18以上（開発環境）
- PostgreSQL 16
- Redis
- 2GB以上のRAM

#### インストール手順
```bash
# 方法1: ワンクリックインストール（推奨）
curl -sL https://raw.githubusercontent.com/twentyhq/twenty/main/packages/twenty-docker/scripts/1-click.sh | bash

# 方法2: Docker Composeを使用
git clone https://github.com/twentyhq/twenty.git
cd twenty
cp packages/twenty-docker/.env.example packages/twenty-docker/.env
# .envファイルを編集して環境変数を設定
docker compose up -d

# 方法3: ローカル開発環境
git clone https://github.com/twentyhq/twenty.git
cd twenty
yarn install
yarn nx start twenty-front
yarn nx start twenty-server
```

### 基本的な使い方
#### Hello World相当の例
```bash
# デモ環境へのアクセス
# URL: https://demo.twenty.com/
# ログイン: [email protected] / [email protected]

# 基本的なCRUD操作（GraphQL）
query {
  companies {
    id
    name
    employees
    address
  }
}

mutation {
  createCompany(data: {
    name: "Acme Corp"
    employees: 100
    address: "123 Main St"
  }) {
    id
    name
  }
}
```

#### 実践的な使用例
```typescript
// REST APIを使用したコンタクト作成
const createContact = async () => {
  const response = await fetch('http://localhost:3000/rest/people', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      firstName: 'John',
      lastName: 'Doe',
      email: '[email protected]',
      phone: '+1234567890',
      companyId: 'company-uuid'
    })
  });
  
  return response.json();
};

// GraphQL Subscriptionでリアルタイム更新
subscription OnCompanyUpdate($companyId: UUID!) {
  companyUpdated(id: $companyId) {
    id
    name
    employees
    lastActivityAt
  }
}
```

### 高度な使い方
```yaml
# Docker Compose設定例（production.yml）
version: '3.8'

services:
  twenty-server:
    image: twentycrm/twenty:latest
    environment:
      APP_SECRET: ${APP_SECRET}
      DATABASE_URL: postgres://user:pass@db:5432/twenty
      REDIS_URL: redis://redis:6379
      STORAGE_TYPE: s3
      STORAGE_S3_BUCKET: ${S3_BUCKET}
      EMAIL_DRIVER: gmail
      EMAIL_FROM: ${EMAIL_FROM}
    depends_on:
      - db
      - redis
    ports:
      - "3000:3000"

  twenty-worker:
    image: twentycrm/twenty-worker:latest
    environment:
      # 同じ環境変数
    depends_on:
      - twenty-server

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: twenty
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: twenty
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:

# カスタムオブジェクトの作成
mutation {
  createCustomObject(data: {
    nameSingular: "project"
    namePlural: "projects"
    labelSingular: "Project"
    labelPlural: "Projects"
    icon: "IconBriefcase"
  }) {
    id
    nameSingular
  }
}
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要とクイックスタート
- **開発者ドキュメント**: https://twenty.com/developers
- **APIドキュメント**: GraphQL PlaygroundとOpenAPI仕様
- **セルフホスティングガイド**: 詳細なデプロイメント手順
- **コントリビューションガイド**: 開発参加方法

### サンプル・デモ
- **ライブデモ**: https://demo.twenty.com/
- **Chrome拡張機能**: LinkedInからのデータ取り込み
- **Docker Compose例**: packages/twenty-docker/
- **Kubernetes設定**: packages/twenty-k8s/
- **Terraformモジュール**: packages/twenty-terraform/

### チュートリアル・ガイド
- ローカル開発環境のセットアップ
- カスタムオブジェクトとフィールドの作成
- ワークフロー自動化の設定
- APIを使用した統合開発
- Chrome拡張機能の使用方法

## 技術的詳細
### アーキテクチャ
#### 全体構造
Twentyはモノレポアーキテクチャを採用し、Nxで管理されています。フロントエンドとバックエンドが明確に分離され、GraphQL APIを介して通信します。マルチテナンシーをワークスペースベースで実現し、各ワークスペースは独立したデータとカスタマイゼーションを持ちます。

#### ディレクトリ構成
```
packages/
├── twenty-front/              # Reactフロントエンド
│   ├── src/
│   │   ├── modules/          # 機能モジュール
│   │   ├── pages/            # ページコンポーネント
│   │   └── __generated__/    # GraphQL型定義
├── twenty-server/             # NestJSバックエンド
│   ├── src/
│   │   ├── core/             # コア機能
│   │   ├── metadata/         # メタデータエンジン
│   │   └── workspace/        # ワークスペース管理
├── twenty-ui/                 # 共有UIコンポーネント
├── twenty-emails/             # メールテンプレート
├── twenty-chrome-extension/   # Chrome拡張
├── twenty-docker/             # Docker設定
├── twenty-zapier/             # Zapier統合
└── twenty-website/            # ドキュメントサイト
```

#### 主要コンポーネント
- **メタデータエンジン**: 動的なスキーマ管理
  - 場所: `twenty-server/src/metadata/`
  - 機能: カスタムオブジェクト、フィールド、リレーション管理
  - データベース: 専用のメタデータスキーマ

- **APIレイヤー**: GraphQLファーストAPI
  - 場所: `twenty-server/src/core/api/`
  - 技術: Apollo Server、TypeGraphQL
  - 特徴: 自動生成されたCRUD操作、サブスクリプション

- **ワークスペース管理**: マルチテナンシー
  - 場所: `twenty-server/src/workspace/`
  - 機能: テナント分離、権限管理、使用量追跡

### 技術スタック
#### コア技術
- **言語**: TypeScript（フロントエンド/バックエンド）
- **フレームワーク**: 
  - React 18.2（フロントエンド）
  - NestJS 9.0（バックエンド）
  - Next.js（ドキュメントサイト）
- **主要ライブラリ**: 
  - Apollo Client/Server（GraphQL）
  - TypeORM（ORM）
  - Recoil（状態管理）
  - Emotion（CSS-in-JS）
  - BullMQ（ジョブキュー）

#### 開発・運用ツール
- **ビルドツール**: Nx、Webpack、Vite
- **テスト**: Jest、React Testing Library
- **CI/CD**: GitHub Actions
- **デプロイ**: Docker、Kubernetes、Render

### 設計パターン・手法
- **Domain-Driven Design**: ビジネスドメインに基づくモジュール設計
- **Event-Driven Architecture**: イベントエミッターとWebhook
- **CQRS Pattern**: コマンドとクエリの分離
- **Repository Pattern**: データアクセス層の抽象化

### データフロー・処理フロー
1. ユーザーリクエスト（UI操作）
2. GraphQLクエリ/ミューテーション
3. 認証・認可チェック（JWT）
4. ビジネスロジック処理
5. データベース操作（TypeORM）
6. イベント発行（該当する場合）
7. レスポンス返却
8. UIの自動更新（Apollo Cache）

## API・インターフェース
### 公開API
#### GraphQL API
- 目的: メインのデータ操作インターフェース
- エンドポイント: `/graphql`
- 主要操作:
```graphql
# スキーマ例
type Company {
  id: UUID!
  name: String!
  employees: Int
  people: [Person!]!
  opportunities: [Opportunity!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

# クエリ例
query GetCompaniesWithDeals {
  companies(
    filter: { employees: { gte: 100 } }
    orderBy: { createdAt: DESC }
    limit: 20
  ) {
    id
    name
    opportunities {
      id
      amount
      stage
    }
  }
}
```

#### REST API
- 目的: GraphQLのRESTラッパー
- ベースURL: `/rest`
- 認証: Bearer Token（JWTと同じ）

### 設定・カスタマイズ
#### 環境変数
```env
# 必須設定
APP_SECRET=your-secret-key
DATABASE_URL=postgres://user:pass@localhost:5432/twenty
REDIS_URL=redis://localhost:6379

# ストレージ設定
STORAGE_TYPE=s3
STORAGE_S3_BUCKET=twenty-files
STORAGE_S3_REGION=us-east-1

# メール設定
EMAIL_DRIVER=gmail
EMAIL_FROM=noreply@company.com

# OAuth設定
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```

#### 拡張・プラグイン開発
- カスタムフィールドタイプの追加
- ワークフロートリガーの作成
- サーバーレス関数（実験的）
- Webhook統合
- カスタムUIコンポーネント

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- GraphQL DataLoaderによるN+1問題の解決
- Redisキャッシング
- データベースインデックスの最適化
- フロントエンドのコード分割

### スケーラビリティ
- 水平スケーリング対応（ステートレス設計）
- ワーカープロセスの分離
- データベースコネクションプーリング
- CDN対応の静的アセット

### 制限事項
- バージョン0.2.1（プレ1.0）
- 一部のエンタープライズ機能は商用ライセンスが必要
- Salesforceと比較して統合が限定的
- 大規模デプロイメントの実績が少ない

## 評価・所感
### 技術的評価
#### 強み
- 最新の技術スタックと優れたアーキテクチャ
- 完全なソースコードアクセスとカスタマイズ性
- モダンで使いやすいUI/UX
- 強力なAPIとリアルタイム機能
- アクティブな開発とコミュニティ

#### 改善の余地
- プレ1.0バージョンによる安定性の懸念
- エンタープライズ機能の成熟度
- サードパーティ統合の拡充
- パフォーマンスの最適化

### 向いている用途
- 中小企業のCRMニーズ
- カスタムCRMソリューションの基盤
- データ所有権を重視する組織
- 開発者フレンドリーなCRM環境
- コスト効率的なCRM導入

### 向いていない用途
- 大規模エンタープライズの複雑な要件
- 豊富な既成統合が必要な場合
- 技術的なサポートが限定的な組織
- 即座の本番導入が必要な場合

### 総評
Twentyは、オープンソースCRM分野において非常に有望なプロジェクトです。最新の技術スタック、優れたアーキテクチャ、モダンなUI/UXにより、Salesforceの真の代替品となる可能性を秘めています。特に、データの完全な所有権、カスタマイズの自由度、ユーザーあたりのライセンス費用なしという点で、多くの組織にとって魅力的な選択肢となるでしょう。プレ1.0版であることを考慮する必要がありますが、活発な開発とコミュニティの成長により、近い将来、エンタープライズレベルのCRMソリューションとして成熟することが期待されます。