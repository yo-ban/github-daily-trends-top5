# リポジトリ解析: googleapis/genai-toolbox

## 基本情報
- リポジトリ名: googleapis/genai-toolbox
- 主要言語: Go
- スター数: 4,255
- フォーク数: 346
- 最終更新: 2024年（活発に開発中）
- ライセンス: Apache License 2.0
- トピックス: MCP, database-tools, ai-agents, genai, database-connectivity

## 概要
### 一言で言うと
AIエージェントとデータベースを安全かつ効率的に接続するためのMCP（Model Context Protocol）サーバー。開発者が10行未満のコードでAIにデータベースアクセス能力を与えることができるツールボックス。

### 詳細説明
MCP Toolbox for Databases（旧称：Gen AI Toolbox for Databases）は、AIアプリケーションとデータベース間の複雑な接続処理を抽象化するオープンソースのMCPサーバーです。コネクションプーリング、認証、ツール管理などの複雑な処理を内部で処理し、開発者はシンプルなYAML設定でAIエージェントにデータベースアクセス機能を提供できます。

元々はMCP登場前に開発が始まったため「Gen AI Toolbox」という名前でしたが、MCP互換性を追加したことで現在の名前に変更されました。Googleが主導で開発しており、プロダクション環境での使用を前提とした設計になっています。

### 主な特徴
- **マルチデータベース対応**: PostgreSQL、MySQL、SQLite、BigQuery、Spanner、Redis、Neo4jなど20種類以上のデータベースをサポート
- **簡単な統合**: 10行未満のコードでAIエージェントにデータベースツールを追加可能
- **MCP対応**: Model Context Protocolに準拠し、Claude DesktopなどのMCP対応ツールと直接統合可能
- **セキュアな設計**: Google Cloud IAM統合、認証・認可機能、環境変数によるシークレット管理
- **動的リロード**: サーバー再起動なしでツール定義の更新が可能
- **本番環境対応**: OpenTelemetry統合、構造化ログ、メトリクス、トレーシング機能を標準搭載
- **複数のSDK**: Python、JavaScript/TypeScript、Go向けの公式SDKを提供

## 使用方法
### インストール
#### 前提条件
- Go 1.21以上（ソースからビルドする場合）
- Docker（コンテナとして実行する場合）
- 対象データベースへのアクセス権限

#### インストール手順
```bash
# 方法1: バイナリとしてインストール
export VERSION=0.8.0
curl -O https://storage.googleapis.com/genai-toolbox/v$VERSION/linux/amd64/toolbox
chmod +x toolbox

# 方法2: Dockerイメージとして使用
export VERSION=0.8.0
docker pull us-central1-docker.pkg.dev/database-toolbox/toolbox/toolbox:$VERSION

# 方法3: ソースからビルド
go install github.com/googleapis/genai-toolbox@v0.8.0
```

### 基本的な使い方
#### Hello World相当の例
```yaml
# tools.yaml - 最小限の設定
sources:
  demo-postgres:
    kind: postgres
    host: localhost
    port: 5432
    database: testdb
    user: postgres
    password: password

tools:
  hello-db:
    kind: postgres-sql
    source: demo-postgres
    description: Get database version
    statement: SELECT version()
```

```bash
# サーバーの起動
./toolbox --tools-file tools.yaml
```

#### 実践的な使用例
```yaml
# tools.yaml - 実践的な設定例
sources:
  production-db:
    kind: postgres
    host: ${DB_HOST}
    port: 5432
    database: ${DB_NAME}
    user: ${DB_USER}
    password: ${DB_PASSWORD}

tools:
  search-users:
    kind: postgres-sql
    source: production-db
    description: Search users by name or email
    parameters:
      - name: search_term
        type: string
        description: Name or email to search
    statement: |
      SELECT id, name, email, created_at
      FROM users
      WHERE name ILIKE '%' || $1 || '%'
         OR email ILIKE '%' || $1 || '%'
      ORDER BY created_at DESC
      LIMIT 10

  create-user:
    kind: postgres-execute-sql
    source: production-db
    description: Create a new user
    parameters:
      - name: name
        type: string
        description: User's full name
      - name: email
        type: string
        description: User's email address
    statement: |
      INSERT INTO users (name, email, created_at)
      VALUES ($1, $2, NOW())
      RETURNING id, name, email, created_at

toolsets:
  user-management:
    - search-users
    - create-user
```

```python
# Python SDK使用例
from toolbox_langchain import ToolboxClient
from langchain.agents import initialize_agent

async with ToolboxClient("http://localhost:5000") as client:
    tools = await client.load_toolset("user-management")
    
    agent = initialize_agent(
        tools=tools,
        llm=your_llm,
        agent="zero-shot-react-description"
    )
    
    result = await agent.run("Find all users with gmail addresses")
```

### 高度な使い方
```yaml
# 高度な設定例 - 複数データソースとセキュリティ設定
sources:
  analytics-bq:
    kind: bigquery
    project: ${GCP_PROJECT}
    location: us-central1
    
  cache-redis:
    kind: redis
    host: ${REDIS_HOST}
    port: 6379
    password: ${REDIS_PASSWORD}
    
  graph-neo4j:
    kind: neo4j
    host: ${NEO4J_HOST}
    user: neo4j
    password: ${NEO4J_PASSWORD}

tools:
  analyze-user-behavior:
    kind: bigquery-sql
    source: analytics-bq
    description: Analyze user behavior patterns
    authRequired: ["analyst", "admin"]
    parameters:
      - name: start_date
        type: string
        description: Start date (YYYY-MM-DD)
      - name: end_date
        type: string
        description: End date (YYYY-MM-DD)
    statement: |
      WITH user_sessions AS (
        SELECT 
          user_id,
          COUNT(DISTINCT session_id) as session_count,
          AVG(session_duration_seconds) as avg_duration,
          SUM(total_events) as total_events
        FROM `${GCP_PROJECT}.analytics.sessions`
        WHERE date BETWEEN @start_date AND @end_date
        GROUP BY user_id
      )
      SELECT 
        session_count_bucket,
        COUNT(*) as user_count,
        AVG(avg_duration) as avg_session_duration
      FROM (
        SELECT 
          CASE 
            WHEN session_count < 5 THEN '1-4'
            WHEN session_count < 20 THEN '5-19'
            ELSE '20+'
          END as session_count_bucket,
          avg_duration
        FROM user_sessions
      )
      GROUP BY session_count_bucket

  cache-query-result:
    kind: redis-execute
    source: cache-redis
    description: Cache analysis results
    parameters:
      - name: key
        type: string
      - name: value
        type: string
      - name: ttl_seconds
        type: int
    command: SETEX

  find-user-connections:
    kind: neo4j-cypher
    source: graph-neo4j
    description: Find user social connections
    parameters:
      - name: user_id
        type: string
    statement: |
      MATCH (u:User {id: $user_id})-[:FOLLOWS]->(f:User)
      MATCH (f)-[:FOLLOWS]->(ff:User)
      WHERE NOT (u)-[:FOLLOWS]->(ff) AND u <> ff
      RETURN ff.id as suggested_user_id, 
             ff.name as name,
             COUNT(DISTINCT f) as mutual_connections
      ORDER BY mutual_connections DESC
      LIMIT 10
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、クイックスタート、基本的な使い方
- **docs/en/getting-started/**: 導入ガイド、設定方法、ローカル環境でのクイックスタート
- **docs/en/how-to/**: 実践的なハウツーガイド（Docker、GKE、MCP接続など）
- **docs/en/resources/**: リファレンスドキュメント（Sources、Tools、Toolsetsの詳細）
- **公式サイト**: https://googleapis.github.io/genai-toolbox/

### サンプル・デモ
- **docs/en/getting-started/colab_quickstart.ipynb**: Google Colabでの動作確認用ノートブック
- **internal/prebuiltconfigs/tools/**: 各データベース用の事前定義ツール設定
- **tests/**: 統合テストコードから実際の使用パターンを確認可能

### チュートリアル・ガイド
- ローカル環境でのクイックスタート
- Claude Desktop/Cursor/VS Codeとの統合ガイド
- Docker/Kubernetes環境へのデプロイガイド
- テレメトリのエクスポート設定ガイド

## 技術的詳細
### アーキテクチャ
#### 全体構造
Toolboxは、AIアプリケーションとデータベース間のミドルウェアとして機能し、以下の層で構成されています：

1. **APIレイヤー**: HTTP/SSE、stdio（MCP）プロトコルのサポート
2. **ツール管理レイヤー**: ツール定義の読み込み、検証、実行
3. **認証レイヤー**: Google Cloud IAM、カスタム認証の統合
4. **データソースレイヤー**: 各種データベースへの接続管理
5. **テレメトリレイヤー**: メトリクス、トレーシング、ログの収集

#### ディレクトリ構成
```
genai-toolbox/
├── cmd/                  # CLIコマンド実装
│   ├── root.go          # メインコマンド定義
│   └── options.go       # コマンドラインオプション処理
├── internal/            # 内部実装
│   ├── server/         # HTTPサーバーとMCP実装
│   │   ├── api.go     # REST APIハンドラー
│   │   ├── mcp.go     # MCPプロトコル実装
│   │   └── server.go  # サーバー起動・管理
│   ├── sources/        # データソース実装
│   │   ├── postgres/  # PostgreSQL接続
│   │   ├── bigquery/  # BigQuery接続
│   │   └── ...       # 他のデータベース実装
│   ├── tools/         # ツール実装
│   │   ├── postgres/  # PostgreSQL用ツール
│   │   └── ...       # 他のデータベース用ツール
│   ├── auth/         # 認証機能
│   └── telemetry/    # 監視・ログ機能
├── docs/             # ドキュメント
└── tests/            # 統合テスト
```

#### 主要コンポーネント
- **ToolManager**: ツール定義の管理とルーティング
  - 場所: `internal/server/server.go`
  - 依存: Sources、Tools、Auth
  - インターフェース: LoadTools、ExecuteTool、ReloadTools

- **SourceManager**: データソース接続の管理
  - 場所: `internal/sources/sources.go`
  - 依存: 各データベースドライバー
  - インターフェース: Connect、Disconnect、Execute

- **MCPServer**: Model Context Protocol実装
  - 場所: `internal/server/mcp/mcp.go`
  - 依存: ToolManager、Auth
  - インターフェース: ListTools、CallTool、Subscribe

### 技術スタック
#### コア技術
- **言語**: Go 1.21（ジェネリクス、改善されたエラーハンドリングを活用）
- **フレームワーク**: 
  - Cobra（CLI）
  - Echo/Fiber（HTTPサーバー）
  - SSE（Server-Sent Events）
- **主要ライブラリ**: 
  - database/sql（SQL接続）
  - cloud.google.com/go（Google Cloudサービス）
  - go.opentelemetry.io（テレメトリ）
  - github.com/jackc/pgx（PostgreSQL）
  - github.com/go-sql-driver/mysql（MySQL）

#### 開発・運用ツール
- **ビルドツール**: Go Modules、Makefile
- **テスト**: Go標準テストフレームワーク、統合テスト
- **CI/CD**: GitHub Actions（ビルド、テスト、リリース）
- **デプロイ**: バイナリ、Docker、Kubernetes（Helm）

### 設計パターン・手法
- **インターフェース指向設計**: 各データベース実装は共通インターフェースを実装
- **プラグインアーキテクチャ**: 新しいデータベースサポートを容易に追加可能
- **設定駆動開発**: YAML設定でツールの振る舞いを定義
- **エラーハンドリング**: Goのエラー型を活用した明示的なエラー処理

### データフロー・処理フロー
1. クライアントがツール実行をリクエスト
2. 認証・認可チェック
3. パラメータ検証
4. 適切なデータソースへの接続取得（コネクションプール使用）
5. SQLステートメント/コマンドの実行
6. 結果の整形とレスポンス
7. テレメトリデータの記録

## API・インターフェース
### 公開API
#### GET /tools
- 目的: 利用可能なツールのリスト取得
- 使用例:
```bash
curl http://localhost:5000/tools
```

#### POST /tools/{toolName}/invoke
- 目的: ツールの実行
- 使用例:
```bash
curl -X POST http://localhost:5000/tools/search-users/invoke \
  -H "Content-Type: application/json" \
  -d '{"search_term": "john"}'
```

#### MCP over SSE
- 目的: Model Context Protocol経由でのツール実行
- 使用例:
```json
// Claude Desktop設定
{
  "mcpServers": {
    "database-toolbox": {
      "type": "sse",
      "url": "http://localhost:5000/mcp/sse"
    }
  }
}
```

### 設定・カスタマイズ
#### 設定ファイル
```yaml
# tools.yaml - 完全な設定例
server:
  port: 5000
  auth:
    enabled: true
    providers:
      - google-iam
  telemetry:
    enabled: true
    exporter: google-cloud

sources:
  main-db:
    kind: postgres
    host: ${DB_HOST}
    port: 5432
    database: ${DB_NAME}
    user: ${DB_USER}
    password: ${DB_PASSWORD}
    pool:
      maxConnections: 10
      idleTimeout: 30s

tools:
  custom-query:
    kind: postgres-sql
    source: main-db
    description: Execute custom SQL query
    parameters:
      - name: query
        type: string
        authenticated: true  # 認証されたユーザーのみ
    statement: "{{.query}}"  # テンプレート使用
```

#### 拡張・プラグイン開発
新しいデータベースサポートの追加：
1. `internal/sources/`に新しいソース実装を追加
2. `internal/tools/`に対応するツール実装を追加
3. `internal/sources/sources.go`にファクトリー関数を登録

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ベンチマーク結果: 1インスタンスで秒間1000+リクエスト処理可能
- 最適化手法: 
  - コネクションプーリング
  - 準備済みステートメントのキャッシュ
  - 非同期処理

### スケーラビリティ
- 水平スケーリング対応（ステートレス設計）
- Kubernetes環境でのオートスケーリング
- 負荷分散対応

### 制限事項
- 単一ツール実行の最大時間: 30秒（設定可能）
- 最大レスポンスサイズ: 10MB（設定可能）
- 同時接続数: データベースの制限に依存

## 評価・所感
### 技術的評価
#### 強み
- **豊富なデータベースサポート**: 20種類以上のデータベースに対応
- **プロダクション対応**: Google主導で開発され、エンタープライズ利用を想定した設計
- **MCP標準準拠**: 業界標準プロトコルに対応し、将来性が高い
- **優れた抽象化**: 複雑なデータベース接続を簡潔なYAML設定で実現

#### 改善の余地
- **ベータ版**: まだv1.0に達しておらず、破壊的変更の可能性あり
- **Go言語依存**: サーバー自体の拡張にはGoの知識が必要
- **ドキュメント**: 一部の高度な機能についてのドキュメントが不足

### 向いている用途
- **AIアシスタントのデータベース統合**: ChatGPT、Claude等のAIにデータベースアクセス機能を追加
- **マルチデータベース環境**: 複数の異なるデータベースを統一的に扱う必要がある場合
- **エンタープライズ環境**: セキュリティ、監視、スケーラビリティが重要な本番環境
- **開発効率化**: IDEと統合してAIによるデータベース操作を実現

### 向いていない用途
- **超低レイテンシが必要**: 中間層を経由するため、直接接続より遅延が発生
- **複雑なトランザクション**: 複数データソースにまたがる分散トランザクション
- **リアルタイムストリーミング**: 大量のストリーミングデータ処理

### 総評
MCP Toolbox for Databasesは、AIエージェントとデータベースを接続する際の複雑さを大幅に軽減する優れたツールです。Googleが主導で開発していることもあり、コード品質が高く、プロダクション利用を前提とした設計になっています。特に、多様なデータベースのサポート、セキュリティ機能、MCPプロトコル対応など、エンタープライズ環境での利用に必要な機能が網羅されています。ベータ版であることを考慮する必要がありますが、AIアプリケーションにデータベースアクセス機能を追加したい開発者にとって、非常に価値の高いツールと言えるでしょう。