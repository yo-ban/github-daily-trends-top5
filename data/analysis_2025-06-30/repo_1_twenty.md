# リポジトリ解析: twentyhq/twenty

## 基本情報
- リポジトリ名: twentyhq/twenty
- 主要言語: TypeScript
- スター数: 31,641
- フォーク数: 3,549
- 最終更新: 2025年6月（活発に開発中）
- ライセンス: AGPLv3（一部エンタープライズ機能は商用ライセンス）
- トピックス: CRM, Open-Source, React, NestJS, PostgreSQL, TypeScript, GraphQL, Workflow-Automation

## 概要
### 一言で言うと
Salesforceに代わるモダンなオープンソースCRMで、開発者フレンドリーな設計と優れたUXを特徴とする。

### 詳細説明
TwentyはコミュニティドリブンのオープンソースCRMプラットフォームで、高価な商用CRMソリューションに代わる選択肢を提供する。NotionやLinearのような現代的なUIと、完全なAPI、カスタムオブジェクト、ワークフロー自動化などのエンタープライズ機能を組み合わせている。v1.0リリース（2025年6月）により本番環境対応が完了し、パフォーマンスも2倍向上した。

### 主な特徴
- ランタイムでのカスタムオブジェクト・フィールド作成
- ビジュアルワークフロー自動化エンジン
- 完全なREST/GraphQL API
- モダンなReact UIとリアルタイムコラボレーション
- セルフホスト可能でデータ主権を保持
- マルチテナントアーキテクチャ

## 使用方法
### インストール
#### 前提条件
- Node.js v22以上
- PostgreSQL 16
- Redis
- Yarn v4
- Docker（本番環境推奨）

#### インストール手順
```bash
# 方法1: Docker Compose（本番環境推奨）
bash <(curl -sL https://raw.githubusercontent.com/twentyhq/twenty/main/packages/twenty-docker/scripts/install.sh)

# 方法2: ローカル開発環境
git clone git@github.com:twentyhq/twenty.git
cd twenty
cp ./packages/twenty-front/.env.example ./packages/twenty-front/.env
cp ./packages/twenty-server/.env.example ./packages/twenty-server/.env
yarn
npx nx database:reset twenty-server
npx nx start
```

### 基本的な使い方
#### Hello World相当の例
```typescript
// REST APIでの企業情報取得
const response = await fetch('http://localhost:3000/rest/companies', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});
const companies = await response.json();
```

#### 実践的な使用例
```typescript
// GraphQLでのカスタムオブジェクト作成
const CREATE_CUSTOM_OBJECT = gql`
  mutation CreateObject($input: CreateOneObjectInput!) {
    createOneObject(input: $input) {
      id
      namePlural
      nameSingular
      fields {
        id
        name
        type
      }
    }
  }
`;

await apolloClient.mutate({
  mutation: CREATE_CUSTOM_OBJECT,
  variables: {
    input: {
      object: {
        nameSingular: 'ProjectTask',
        namePlural: 'ProjectTasks',
        labelSingular: 'Project Task',
        labelPlural: 'Project Tasks',
        icon: 'IconCheckbox'
      }
    }
  }
});
```

### 高度な使い方
ワークフロー自動化の例：
```typescript
// ワークフローノードの定義
const workflow = {
  name: 'Lead Qualification',
  nodes: [
    {
      id: 'trigger',
      type: 'trigger',
      config: {
        event: 'company.created'
      }
    },
    {
      id: 'enrichment',
      type: 'action',
      config: {
        type: 'enrichCompanyData',
        provider: 'clearbit'
      }
    },
    {
      id: 'scoring',
      type: 'condition',
      config: {
        conditions: [
          { field: 'employees', operator: '>', value: 50 }
        ]
      }
    },
    {
      id: 'notification',
      type: 'action',
      config: {
        type: 'sendSlackMessage',
        channel: '#sales'
      }
    }
  ]
};
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要とクイックスタート
- **docs/developers**: 開発者向け詳細ドキュメント（API、アーキテクチャ、拡張方法）
- **Wiki/サイト**: https://docs.twenty.com - 包括的なユーザーマニュアルとAPIリファレンス

### サンプル・デモ
- **packages/twenty-server/test**: 統合テストから実装例を確認可能
- **packages/twenty-front/src/modules**: 各機能モジュールの実装例

### チュートリアル・ガイド
- Getting Started Guide（公式サイト）
- API Playground（http://localhost:3000/graphql）
- Discord コミュニティでのサポート
- YouTube チュートリアル動画

## 技術的詳細
### アーキテクチャ
#### 全体構造
マルチテナント対応のモノレポアーキテクチャで、フロントエンドとバックエンドが分離されている。各ワークスペースは独自のデータベーススキーマを持ち、完全に分離されたデータ管理を実現。

#### ディレクトリ構成
```
packages/
├── twenty-front/          # React 18フロントエンドアプリケーション
│   ├── src/modules/       # 機能別モジュール（認証、設定、レコード管理等）
│   ├── src/engine/       # コアエンジン（GraphQL、状態管理）
│   └── src/ui/           # 共通UIコンポーネント
├── twenty-server/         # NestJSバックエンドアプリケーション
│   ├── src/engine/       # コアエンジン（メタデータ、認証、ワークスペース）
│   ├── src/modules/      # ドメインモジュール（カレンダー、メッセージング等）
│   └── src/database/     # データベース関連（マイグレーション、シード）
├── twenty-ui/            # 共有UIコンポーネントライブラリ
├── twenty-emails/        # React Emailを使用したメールテンプレート
└── twenty-docker/        # Docker設定とデプロイメントスクリプト
```

#### 主要コンポーネント
- **Metadata Engine**: ランタイムでのスキーマ管理とカスタムオブジェクト作成
  - 場所: `packages/twenty-server/src/engine/metadata-modules/`
  - 依存: TypeORM、GraphQL
  - インターフェース: ObjectMetadataService、FieldMetadataService

- **Workspace Manager**: マルチテナント管理
  - 場所: `packages/twenty-server/src/engine/workspace-manager/`
  - 依存: PostgreSQL schemas、認証モジュール
  - インターフェース: WorkspaceService、WorkspaceMemberService

- **Record Management**: 汎用CRUDシステム
  - 場所: `packages/twenty-front/src/modules/object-record/`
  - 依存: Apollo Client、Recoil
  - インターフェース: useCreateOneRecord、useUpdateOneRecord、useDeleteOneRecord

### 技術スタック
#### コア技術
- **言語**: TypeScript 5.x（厳格な型チェック有効）
- **フレームワーク**: 
  - バックエンド: NestJS 10（モジュラーアーキテクチャ）
  - フロントエンド: React 18（Concurrent Features活用）
- **主要ライブラリ**: 
  - Apollo Client/Server (GraphQL)
  - TypeORM (データベースORM)
  - Recoil (状態管理)
  - Emotion (CSS-in-JS)
  - BullMQ (ジョブキュー)

#### 開発・運用ツール
- **ビルドツール**: Nx（モノレポ管理）、Vite（高速ビルド）
- **テスト**: Jest、Playwright（E2E）、Storybook（コンポーネントテスト）
- **CI/CD**: GitHub Actions（自動テスト、ビルド、デプロイ）
- **デプロイ**: Docker、Kubernetes対応、Render.com統合

### 設計パターン・手法
- イベント駆動アーキテクチャ（NestJS EventEmitter）
- リポジトリパターン（データアクセス層）
- 依存性注入（NestJS DIコンテナ）
- マルチテナント分離（PostgreSQLスキーマ）
- CQRS的アプローチ（読み取りと書き込みの分離）

### データフロー・処理フロー
1. クライアント → GraphQL/REST API → 認証ミドルウェア
2. → ワークスペース解決 → メタデータ検証
3. → ビジネスロジック層 → リポジトリ層
4. → データベース（テナント別スキーマ）
5. → レスポンス変換 → クライアント

## API・インターフェース
### 公開API
#### REST API
- 目的: シンプルなCRUD操作とサードパーティ統合
- 使用例:
```bash
# 全企業の取得
GET /rest/companies?limit=10&orderBy=createdAt[DESC]

# 新規連絡先作成
POST /rest/people
Content-Type: application/json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "companyId": "uuid-here"
}
```

#### GraphQL API
- 目的: 複雑なクエリとリアルタイム更新
- 使用例:
```graphql
subscription OnCompanyUpdated($companyId: ID!) {
  companyUpdated(where: { id: { equals: $companyId } }) {
    id
    name
    employees
    updatedAt
  }
}
```

### 設定・カスタマイズ
#### 設定ファイル
```yaml
# docker-compose.yml環境変数
SERVER_URL: https://crm.example.com
AUTH_GOOGLE_ENABLED: true
AUTH_GOOGLE_CLIENT_ID: your-client-id
AUTH_GOOGLE_CLIENT_SECRET: your-secret
STORAGE_TYPE: s3
STORAGE_S3_BUCKET: twenty-files
EMAIL_DRIVER: smtp
EMAIL_SMTP_HOST: smtp.gmail.com
```

#### 拡張・プラグイン開発
カスタムフィールドタイプの作成：
```typescript
@FieldMetadataType({
  type: FieldMetadataType.CUSTOM_ADDRESS,
  targetColumnMap: {
    street: 'street',
    city: 'city',
    postalCode: 'postalCode',
    country: 'country'
  }
})
export class AddressFieldType extends BaseFieldType {
  validate(value: any): boolean {
    return value.street && value.city && value.country;
  }
}
```

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ベンチマーク結果: 1秒あたり1000+ API リクエスト処理可能
- 最適化手法: 
  - Redisキャッシング（頻繁にアクセスされるメタデータ）
  - カーソルベースのページネーション
  - GraphQLクエリの深さ制限
  - 非同期ジョブ処理（BullMQ）

### スケーラビリティ
- 水平スケーリング対応（ステートレスアーキテクチャ）
- データベース接続プーリング
- Redisクラスタリング対応
- CDN統合（静的アセット）

### 制限事項
- 単一PostgreSQLインスタンスへの依存
- リアルタイム機能はWebSocketに依存
- ファイルアップロードサイズ制限（デフォルト20MB）

## 評価・所感
### 技術的評価
#### 強み
- モダンで洗練されたアーキテクチャ
- 優れた開発者体験（TypeScript、GraphQL）
- 包括的なテストカバレッジ
- アクティブな開発とコミュニティ
- エンタープライズグレードの機能

#### 改善の余地
- モバイルアプリケーションの不在
- 高度なレポーティング機能の拡充
- より多くのネイティブ統合
- パフォーマンスモニタリングツールの統合

### 向いている用途
- スタートアップ・中小企業のCRM需要
- カスタマイズ性を重視する組織
- データ主権を維持したい企業
- 開発者主導のCRM実装
- ワークフロー自動化が必要な業務

### 向いていない用途
- 大規模エンタープライズ（数万ユーザー規模）
- 複雑なレポーティングが必須の環境
- モバイルファーストの営業チーム
- 技術リソースが限られた組織

### 総評
Twentyは、オープンソースCRM分野において画期的なプロジェクトである。v1.0リリースにより本番環境での利用が現実的になり、モダンな技術スタックと優れたUXにより、従来の商用CRMに対する真の代替選択肢となっている。特に開発者フレンドリーな設計とカスタマイズ性の高さは、技術的に成熟した組織にとって大きな魅力となる。今後のモバイル対応や機能拡充により、さらに幅広い組織での採用が期待される。