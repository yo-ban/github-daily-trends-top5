# リポジトリ解析: twentyhq/twenty

## 基本情報
- リポジトリ名: twentyhq/twenty
- 主要言語: TypeScript
- スター数: 30,564
- フォーク数: 3,495
- 最終更新: 活発に更新中
- ライセンス: AGPLv3 (一部Enterprise License)
- トピックス: CRM, open-source, salesforce-alternative, nestjs, react, graphql, postgresql

## 概要
### 一言で言うと
Twenty はオープンソースのモダンなCRMプラットフォームで、Salesforceの代替として設計された、自己ホスト可能でカスタマイズ性の高いソリューションです。

### 詳細説明
Twentyは、従来のCRMの高コストとベンダーロックインの問題を解決するために開発されました。NotionやAirtable、Linearなどの現代的なツールに触発されたUXを持ち、TypeScriptで構築された堅牢なアーキテクチャを特徴としています。マルチテナント対応、リアルタイム更新、柔軟なデータモデル、そして将来的なプラグインエコシステムを見据えた設計となっています。

### 主な特徴
- カスタマイズ可能なデータモデル（カスタムオブジェクト・フィールド）
- リアルタイム更新とコラボレーション機能
- Google/Microsoft統合（メール・カレンダー同期）
- ワークフロー自動化エンジン
- マルチテナント対応のセキュアなアーキテクチャ
- GraphQLとREST APIの両方をサポート
- モダンなReact UI with Recoilステート管理

## 使用方法
### インストール
#### 前提条件
- Node.js v22以上
- Yarn v4以上（npm非推奨）
- PostgreSQL 16
- Redis
- Docker（オプション）

#### インストール手順
```bash
# 方法1: ワンクリックDockerインストール（本番環境推奨）
bash <(curl -sL https://raw.githubusercontent.com/twentyhq/twenty/main/packages/twenty-docker/scripts/install.sh)

# 方法2: Docker Compose（手動設定）
# .envファイルを取得して編集
curl -o .env https://raw.githubusercontent.com/twentyhq/twenty/refs/heads/main/packages/twenty-docker/.env.example
# APP_SECRET、PGPASSWORD_SUPERUSER、SERVER_URLを設定

# docker-compose.ymlを取得
curl -o docker-compose.yml https://raw.githubusercontent.com/twentyhq/twenty/refs/heads/main/packages/twenty-docker/docker-compose.yml

# サービスを起動
docker compose up -d

# 方法3: ローカル開発環境
git clone git@github.com:twentyhq/twenty.git
cd twenty

# PostgreSQLとRedisをDockerで起動
make postgres-on-docker
make redis-on-docker

# 環境ファイルをコピー
cp ./packages/twenty-front/.env.example ./packages/twenty-front/.env
cp ./packages/twenty-server/.env.example ./packages/twenty-server/.env

# 依存関係をインストール
yarn

# データベースを初期化
npx nx database:reset twenty-server

# 全サービスを起動
npx nx start
```

### 基本的な使い方
#### Hello World相当の例
```javascript
// GraphQL APIを使用した基本的なクエリ
const query = `
  query GetPeople {
    people(first: 10) {
      edges {
        node {
          id
          name {
            firstName
            lastName
          }
          email
          company {
            name
          }
        }
      }
    }
  }
`;

// APIキーを使用してリクエスト
fetch('http://localhost:3000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer YOUR_API_KEY`
  },
  body: JSON.stringify({ query })
});
```

#### 実践的な使用例
```javascript
// REST APIを使用した会社の作成
const createCompany = async () => {
  const response = await fetch('http://localhost:3000/rest/companies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer YOUR_API_KEY`
    },
    body: JSON.stringify({
      name: 'Acme Corporation',
      domainName: 'acme.com',
      address: {
        addressStreet1: '123 Main St',
        addressCity: 'San Francisco',
        addressCountry: 'United States'
      }
    })
  });
  
  return response.json();
};

// WebSocketサブスクリプションでリアルタイム更新を受信
import { createClient } from 'graphql-ws';

const client = createClient({
  url: 'ws://localhost:3000/graphql',
  connectionParams: {
    authToken: 'YOUR_API_KEY'
  }
});

// 会社の更新をリアルタイムで監視
client.subscribe({
  query: `
    subscription OnCompanyUpdate {
      onDbEvent(
        action: "updated",
        objectNameSingular: "company"
      ) {
        id
        name
        updatedAt
      }
    }
  `
}, {
  next: (data) => console.log('Company updated:', data),
  error: (err) => console.error('Error:', err),
  complete: () => console.log('Subscription complete')
});
```

### 高度な使い方
```javascript
// カスタムオブジェクトの作成（メタデータAPI）
const createCustomObject = async () => {
  const response = await fetch('http://localhost:3000/rest/metadata/objects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer YOUR_API_KEY`
    },
    body: JSON.stringify({
      nameSingular: 'project',
      namePlural: 'projects',
      labelSingular: 'Project',
      labelPlural: 'Projects',
      icon: 'IconBriefcase',
      description: 'Track your projects'
    })
  });
  
  return response.json();
};

// ワークフローの実装例
const createWorkflow = {
  name: 'Lead Scoring Workflow',
  trigger: {
    type: 'database-event',
    settings: {
      eventName: 'company.created',
      objectType: 'company'
    }
  },
  steps: [
    {
      id: 'enrich-data',
      type: 'code',
      settings: {
        serverFunction: `
          const { companyId } = event;
          // 外部APIから会社情報を取得
          const enrichedData = await fetchCompanyData(companyId);
          return enrichedData;
        `
      }
    },
    {
      id: 'calculate-score',
      type: 'code',
      settings: {
        serverFunction: `
          const score = calculateLeadScore(previousStep.output);
          return { score };
        `
      }
    },
    {
      id: 'update-record',
      type: 'record-update',
      settings: {
        objectType: 'company',
        updates: {
          leadScore: '{{steps.calculate-score.output.score}}'
        }
      }
    }
  ]
};
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、セットアップ手順、コントリビューションガイド
- **packages/twenty-website**: ドキュメントサイトのソースコード
- **Wiki/サイト**: https://twenty.com/developers (開発者向けドキュメント)

### サンプル・デモ
- **デフォルトログイン**: email: tim@apple.dev, password: tim@apple.dev
- **GraphQL Playground**: http://localhost:3000/graphql
- **REST API Swagger**: http://localhost:3000/rest/open-api/core

### チュートリアル・ガイド
- インストールガイド（Docker、Kubernetes対応）
- API統合ガイド（GraphQL、REST）
- カスタムオブジェクト作成ガイド
- ワークフロー自動化ガイド
- 認証・認可設定ガイド

## 技術的詳細
### アーキテクチャ
#### 全体構造
マイクロサービス指向のモノリシックアーキテクチャを採用。NestJSベースのバックエンドとReactフロントエンドが、GraphQL APIを介して通信。ワーカープロセスが非同期タスクを処理し、Redisがキャッシュとジョブキューを管理。

#### ディレクトリ構成
```
twenty/
├── packages/
│   ├── twenty-server/        # NestJSバックエンド
│   │   ├── src/
│   │   │   ├── engine/      # コアエンジン（認証、API、メタデータ）
│   │   │   ├── modules/     # 機能モジュール（ユーザー、ワークスペース等）
│   │   │   └── database/    # データベース接続・マイグレーション
│   ├── twenty-front/        # Reactフロントエンド
│   │   └── src/
│   │       ├── modules/     # 機能別モジュール
│   │       ├── pages/       # ページコンポーネント
│   │       └── generated/   # GraphQL自動生成型
│   ├── twenty-ui/          # UIコンポーネントライブラリ
│   ├── twenty-emails/      # メールテンプレート
│   └── twenty-docker/      # Docker設定
├── tools/                  # 開発ツール
└── Makefile               # ヘルパーコマンド
```

#### 主要コンポーネント
- **CoreEngineModule**: 認証、API、キャッシュ、メタデータ管理の中核
  - 場所: `packages/twenty-server/src/engine/core-modules`
  - 依存: TypeORM、Apollo Server、BullMQ
  - インターフェース: GraphQL Resolver、REST Controller

- **WorkspaceModule**: マルチテナント機能の実装
  - 場所: `packages/twenty-server/src/engine/workspace-manager`
  - 依存: CoreEngine、TypeORM
  - インターフェース: WorkspaceService、DataSourceService

- **RecordModule**: 汎用レコード管理システム
  - 場所: `packages/twenty-front/src/modules/object-record`
  - 依存: Recoil、Apollo Client
  - インターフェース: useCreateOneRecord、useUpdateOneRecord等のhooks

### 技術スタック
#### コア技術
- **言語**: TypeScript 5.x（厳格な型チェック有効）
- **フレームワーク**: 
  - Backend: NestJS 10.x（モジュラーアーキテクチャ）
  - Frontend: React 18.x + Recoil（状態管理）
- **主要ライブラリ**: 
  - GraphQL Yoga: 高性能GraphQLサーバー
  - TypeORM: データベースORM
  - BullMQ: ジョブキュー管理
  - Emotion: CSS-in-JS

#### 開発・運用ツール
- **ビルドツール**: Nx（モノレポ管理）、Vite（フロントエンドビルド）
- **テスト**: Jest（単体テスト）、Playwright（E2E）
- **CI/CD**: GitHub Actions（自動テスト・デプロイ）
- **デプロイ**: Docker、Kubernetes対応

### 設計パターン・手法
- **依存性注入（DI）**: NestJSの標準DI機能を活用
- **リポジトリパターン**: データアクセス層の抽象化
- **イベント駆動アーキテクチャ**: ワークフロー・Webhook対応
- **マルチテナンシー**: ワークスペースレベルでのデータ分離

### データフロー・処理フロー
1. ユーザーリクエスト → Nginx/ALB
2. GraphQL/REST API → 認証ミドルウェア
3. NestJS Resolver/Controller → Service Layer
4. TypeORM Repository → PostgreSQL
5. 非同期処理はBullMQを介してWorkerで実行
6. リアルタイム更新はRedis PubSub経由でWebSocket配信

## API・インターフェース
### 公開API
#### GraphQL API
- 目的: メインのデータアクセスAPI
- 使用例:
```graphql
query GetCompanyWithDeals($companyId: ID!) {
  company(id: $companyId) {
    id
    name
    opportunities {
      edges {
        node {
          id
          name
          amount
          stage
        }
      }
    }
  }
}
```

#### REST API
- 目的: GraphQLの代替、簡易アクセス
- 使用例:
```bash
# 全ての人物を取得
GET /rest/people?filter={"email":{"like":"%@acme.com"}}&orderBy=createdAt[DESC]

# バッチ作成
POST /rest/batch/companies
Content-Type: application/json
[
  {"name": "Company A", "domainName": "companya.com"},
  {"name": "Company B", "domainName": "companyb.com"}
]
```

### 設定・カスタマイズ
#### 設定ファイル
```env
# 主要な設定項目
NODE_ENV=production
SERVER_URL=https://crm.example.com
FRONT_BASE_URL=https://app.example.com

# 認証設定
ACCESS_TOKEN_EXPIRES_IN=30m
REFRESH_TOKEN_EXPIRES_IN=30d
AUTH_GOOGLE_ENABLED=true

# 統合設定
MESSAGING_PROVIDER_GMAIL_ENABLED=true
CALENDAR_PROVIDER_GOOGLE_ENABLED=true

# ストレージ設定
STORAGE_TYPE=s3
STORAGE_S3_BUCKET=twenty-files
```

#### 拡張・プラグイン開発
ワークフローシステムとサーバーレス関数により、カスタムロジックの実装が可能。将来的には本格的なプラグインシステムの導入を予定。

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ページネーション: カーソルベースで効率的
- キャッシング: Redis による積極的なキャッシュ
- 非同期処理: BullMQによるバックグラウンドジョブ

### スケーラビリティ
- 水平スケーリング対応（Kubernetes）
- ワーカープロセスの独立スケーリング
- PostgreSQLのレプリケーション対応
- ClickHouseによる分析ワークロード分離

### 制限事項
- 大規模なバルク操作時のパフォーマンス
- リアルタイムサブスクリプションの同時接続数
- ファイルアップロードサイズ（設定可能）

## 評価・所感
### 技術的評価
#### 強み
- モダンで一貫性のある技術スタック
- 優れたコード構造とTypeScriptの活用
- 包括的なモニタリング・ロギング機能
- 柔軟なデータモデルとカスタマイズ性
- アクティブな開発とコミュニティ

#### 改善の余地
- パフォーマンステストとベンチマークの不足
- より詳細なスケーリングガイドの必要性
- プラグインエコシステムの未成熟
- エンタープライズ機能の一部不足

### 向いている用途
- データ主権を重視する組織
- カスタマイズ要件の高いCRMニーズ
- 開発者フレンドリーな環境を求めるチーム
- オープンソースを活用したい企業
- スタートアップから中規模企業

### 向いていない用途
- 即座に多数の統合が必要な場合
- 非技術者のみでの運用
- 大規模エンタープライズ（現時点）
- レガシーシステムとの密結合が必要な環境

### 総評
Twentyは、技術的に優れた基盤を持つ本番環境対応のCRMプラットフォームです。Salesforceのような既存のCRMに対する不満（高コスト、ベンダーロックイン、カスタマイズの制限）を解決する野心的なプロジェクトで、モダンな技術スタックと優れた開発者体験を提供しています。

アクティブな開発とコミュニティ、そして明確なビジョンにより、今後さらに成熟していくことが期待されます。特に、データの完全な制御とカスタマイズ性を重視する組織にとって、非常に魅力的な選択肢となるでしょう。現時点でのプロダクション準備度は8.5/10と評価でき、適切なユースケースであれば十分に本番環境で使用可能です。