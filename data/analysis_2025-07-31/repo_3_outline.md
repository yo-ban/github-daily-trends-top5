# リポジトリ解析: outline/outline

## 基本情報
- リポジトリ名: outline/outline
- 主要言語: TypeScript
- スター数: 33,742
- フォーク数: 2,740
- 最終更新: 2025年7月（活発に開発中）
- ライセンス: Business Source License 1.1（4年後にApache 2.0に移行）
- トピックス: ナレッジベース、Wiki、コラボレーション、ドキュメント管理、リアルタイム編集、Markdown

## 概要
### 一言で言うと
チームのナレッジベースとして機能する、高速でモダンな協調編集可能なWikiアプリケーション。リアルタイムコラボレーション、美しいUIと豊富な機能を備え、Notionのようなオープンソース代替として位置づけられる。

### 詳細説明
Outlineは、成長するチームのための最速のナレッジベースを謳うオープンソースプロジェクトです。従来のWikiの複雑さを排除し、Google Docsのようなリアルタイム編集機能とNotionのような構造化されたドキュメント管理を組み合わせています。React、Node.js、PostgreSQL、Redisを使用して構築され、WebSocketによるリアルタイム同期、CRDT（Conflict-free Replicated Data Type）によるコンフリクトフリーな協調編集を実現。セルフホスティングも可能で、企業内での知識共有、プロジェクトドキュメント、社内Wiki等の用途に最適です。

### 主な特徴
- リアルタイム協調編集（Google Docs風）
- 階層的なドキュメント構造（コレクション）
- 強力な全文検索
- 40種類以上の外部サービス埋め込み対応
- リッチテキストエディタ（ProseMirror）
- マークダウンサポート
- コメント・ディスカッション機能
- バージョン履歴とリビジョン管理
- 多言語対応（i18n）
- グループベースのアクセス制御
- API完備
- プラグインシステム
- 複数の認証プロバイダ対応（Google、Slack、Azure AD等）
- ドキュメントテンプレート
- モバイル対応

## 使用方法
### インストール
#### 前提条件
- Node.js 20または22
- PostgreSQL 12以上
- Redis 4.0以上
- Linux環境（Windows非対応）
- S3互換ストレージ（オプション）

#### インストール手順
```bash
# 方法1: Dockerを使用（推奨）
git clone https://github.com/outline/outline.git
cd outline

# 環境変数設定
cp .env.sample .env
# .envファイルを編集

# Docker Composeで起動
docker-compose up -d

# 方法2: 手動インストール
# 依存関係インストール
yarn install

# データベースマイグレーション
yarn db:migrate

# ビルド
yarn build

# 起動
yarn start
```

### 基本的な使い方
#### Hello World相当の例
```bash
# 最小限の環境変数設定
DATABASE_URL=postgres://user:pass@localhost:5432/outline
REDIS_URL=redis://localhost:6379
URL=http://localhost:3000
SECRET_KEY=$(openssl rand -hex 32)
UTILS_SECRET=$(openssl rand -hex 32)

# 起動
yarn start

# ブラウザでhttp://localhost:3000にアクセス
```

#### 実践的な使用例
```yaml
# docker-compose.yml
version: "3.8"
services:
  outline:
    image: outlinewiki/outline:latest
    environment:
      - DATABASE_URL=postgres://outline:outline@postgres:5432/outline
      - REDIS_URL=redis://redis:6379
      - URL=https://wiki.example.com
      - SECRET_KEY=${SECRET_KEY}
      - UTILS_SECRET=${UTILS_SECRET}
      - SMTP_HOST=smtp.gmail.com
      - SMTP_PORT=587
      - SMTP_USERNAME=your-email@gmail.com
      - SMTP_PASSWORD=your-app-password
      - SMTP_FROM_EMAIL=wiki@example.com
      - SLACK_CLIENT_ID=${SLACK_CLIENT_ID}
      - SLACK_CLIENT_SECRET=${SLACK_CLIENT_SECRET}
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:14
    environment:
      - POSTGRES_USER=outline
      - POSTGRES_PASSWORD=outline
      - POSTGRES_DB=outline
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine

volumes:
  postgres_data:
```

### 高度な使い方
```javascript
// API使用例 - ドキュメント作成
const response = await fetch('https://wiki.example.com/api/documents.create', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    collectionId: 'collection-uuid',
    title: 'New Document',
    text: '# Document Content\n\nThis is a new document.',
    publish: true
  })
});

// プラグイン開発例
export default class MyPlugin implements Plugin {
  get id() { return "my-plugin"; }
  get name() { return "My Custom Plugin"; }
  
  server() {
    return {
      onRegister: async (server) => {
        server.route({
          method: "GET",
          path: "/api/my-plugin/data",
          handler: async (ctx) => {
            // カスタムロジック
          }
        });
      }
    };
  }
}
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、基本的なセットアップ
- **docs/ARCHITECTURE.md**: アーキテクチャ詳細
- **docs/SERVICES.md**: マイクロサービス構成
- **docs/SECURITY.md**: セキュリティガイドライン
- **docs/TRANSLATION.md**: 翻訳ガイド
- **公式サイト**: https://www.getoutline.com/

### サンプル・デモ
- **公式デモ**: https://app.getoutline.com（サインアップ必要）
- **plugins/**: プラグイン実装例
- **server/routes/api/**: API実装例

### チュートリアル・ガイド
- 公式ドキュメントサイト
- セルフホスティングガイド
- API リファレンス
- 開発者ガイド

## 技術的詳細
### アーキテクチャ
#### 全体構造
マイクロサービス風のモノリシックアーキテクチャを採用。単一のコードベースから複数のサービスを起動可能。フロントエンドはReact + MobXのSPA、バックエンドはKoaベースのREST API、リアルタイム機能はSocket.ioとYjs（CRDT）で実装。

#### ディレクトリ構成
```
outline/
├── app/                    # フロントエンド（React）
│   ├── actions/            # 再利用可能なアクション
│   ├── components/         # 共有Reactコンポーネント
│   ├── editor/             # エディタ関連
│   ├── hooks/              # Reactフック
│   ├── models/             # MobXモデル
│   ├── scenes/             # ページビュー
│   └── stores/             # データストア
├── server/                 # バックエンド（Koa）
│   ├── routes/             # APIルート
│   │   ├── api/            # REST API
│   │   └── auth/           # 認証ルート
│   ├── commands/           # ビジネスロジック
│   ├── models/             # Sequelizeモデル
│   ├── policies/           # 認可ロジック
│   ├── queues/             # ジョブキュー
│   └── services/           # アプリケーションサービス
├── shared/                 # 共有コード
└── plugins/                # プラグインシステム
```

#### 主要コンポーネント
- **Webサービス**: メインアプリケーションとAPI
  - 場所: `server/index.ts`
  - 依存: Koa、Sequelize、Redis
  - インターフェース: REST API、WebSocket

- **Collaborationサービス**: リアルタイム編集
  - 場所: `server/collaboration/`
  - 依存: Hocuspocus、Yjs
  - インターフェース: WebSocket

- **Workerサービス**: バックグラウンドジョブ
  - 場所: `server/queues/`
  - 依存: Bull、Redis
  - インターフェース: ジョブキュー

### 技術スタック
#### コア技術
- **言語**: TypeScript 5.8.3
- **フレームワーク**: 
  - フロントエンド: React 17 + MobX 4
  - バックエンド: Koa 2.16
- **主要ライブラリ**: 
  - ProseMirror: リッチテキストエディタ
  - Sequelize 6.37: ORM
  - Bull 4.16: ジョブキュー
  - Socket.io 4.8: WebSocket
  - Yjs/Hocuspocus: CRDT協調編集
  - Styled Components 5.3: CSS-in-JS

#### 開発・運用ツール
- **ビルドツール**: Vite（rolldown実験版）
- **テスト**: Jest
- **リンター**: OxLint
- **CI/CD**: GitHub Actions
- **デプロイ**: Docker、Kubernetes対応

### 設計パターン・手法
- MobXによるリアクティブ状態管理
- Cancanスタイルの認可（Policies）
- コマンドパターン（複雑な操作の抽象化）
- プラグインアーキテクチャ
- CRDTによるコンフリクトフリー協調編集

### データフロー・処理フロー
1. ユーザーがエディタで編集
2. ProseMirrorがドキュメント変更を検知
3. YjsがCRDT操作に変換
4. WebSocketで他のクライアントに同期
5. バックエンドが変更を永続化
6. ジョブキューが関連タスク（通知等）を処理

## API・インターフェース
### 公開API
#### ドキュメントAPI
- 目的: プログラマティックなドキュメント操作
- 使用例:
```javascript
// ドキュメント一覧取得
GET /api/documents.list
Authorization: Bearer YOUR_TOKEN

// ドキュメント作成
POST /api/documents.create
{
  "collectionId": "uuid",
  "title": "Document Title",
  "text": "# Content\n\nMarkdown supported",
  "publish": true
}

// ドキュメント更新
POST /api/documents.update
{
  "id": "document-uuid",
  "text": "Updated content"
}
```

### 設定・カスタマイズ
#### 環境変数設定
```bash
# 基本設定
URL=https://wiki.example.com
SECRET_KEY=32-64バイトのランダム文字列
UTILS_SECRET=cronエンドポイント用シークレット

# データベース
DATABASE_URL=postgres://user:pass@host:5432/outline
REDIS_URL=redis://localhost:6379

# 認証プロバイダ（複数設定可能）
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
SLACK_CLIENT_ID=xxx
SLACK_CLIENT_SECRET=xxx

# ファイルストレージ
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_S3_UPLOAD_BUCKET_NAME=outline-uploads
```

#### 拡張・プラグイン開発
- 認証プロバイダプラグイン
- ストレージプロバイダプラグイン
- 埋め込みプロバイダプラグイン
- Webhookによる外部連携

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- リアルタイム同期: WebSocketとCRDTで低レイテンシー
- データベース: PostgreSQLの全文検索を活用
- キャッシング: Redisによる積極的なキャッシュ
- フロントエンド: コード分割とLazy Loading

### スケーラビリティ
- サービスの水平スケール対応
- Redisクラスタ対応
- PostgreSQLレプリケーション対応
- CDN対応（静的アセット）
- マルチプロセス対応（WEB_CONCURRENCY）

### 制限事項
- Windows非対応（Linux/Unix系OS必須）
- リアルタイム編集は同じドキュメントで同時20-30人程度が実用的
- 大規模な添付ファイルは外部ストレージ必須

## 評価・所感
### 技術的評価
#### 強み
- モダンな技術スタックと優れたアーキテクチャ
- 充実したリアルタイムコラボレーション機能
- 豊富な埋め込みサポート（40種類以上）
- 完全なAPI対応
- 活発な開発とコミュニティ
- エンタープライズ対応のセキュリティ機能

#### 改善の余地
- セットアップの複雑さ（多くの環境変数）
- Windows非対応
- オフライン編集のサポート不足
- モバイルアプリの欠如（PWAのみ）

### 向いている用途
- 社内Wiki・ナレッジベース
- プロジェクトドキュメント管理
- チームのドキュメントコラボレーション
- 技術文書の共同執筆
- 社内情報共有ポータル
- APIドキュメント管理

### 向いていない用途
- 個人的なメモ取り（オーバースペック）
- 完全なオフライン使用
- 超大規模な公開Wiki（Wikipedia規模）
- Windows環境での運用

### 総評
Outlineは、モダンなチームコラボレーションのニーズに応える優れたナレッジベースソリューションです。Google DocsのようなリアルタイムコラボレーションとNotionのような構造化されたドキュメント管理を組み合わせ、オープンソースで提供している点が特に価値があります。技術的にも最新のツールを採用し、拡張性も考慮された設計になっています。BSLライセンスは商用利用に制限があるものの、社内利用や非競合用途では問題なく、4年後にはApache 2.0になるため長期的にも安心です。セルフホスティングの選択肢としては、現時点で最も完成度の高いソリューションの一つと言えるでしょう。