# リポジトリ解析: googleapis/genai-toolbox

## 基本情報
- リポジトリ名: googleapis/genai-toolbox
- 主要言語: Go
- スター数: 5,639
- フォーク数: 430
- 最終更新: 2025年1月（アクティブに開発中）
- ライセンス: Apache License 2.0
- トピックス: mcp, database-tools, ai-agents, langchain, llamaindex, genkit

## 概要
### 一言で言うと
MCP Toolbox for Databasesは、AIエージェントがデータベースにアクセスするためのMCP（Model Context Protocol）サーバー。複数のデータベースを統一インターフェースでAIアプリケーションに公開するミドルウェア。

### 詳細説明
genai-toolbox（旧Gen AI Toolbox for Databases）は、AIエージェントや言語モデルがデータベースのデータにアクセスできるようにするオープンソースのMCPサーバーです。コネクションプーリング、認証、クエリ実行などの複雑さを処理し、AIアプリケーションのデータベースアクセスを大幅に簡素化します。LangChain、LlamaIndex、Genkitなどの人気AIフレームワークと統合されており、Claude DesktopやVS CodeなどのMCP対応ツールでも利用できます。

### 主な特徴
- **マルチデータベースサポート**: 17種類以上のデータベースに対応（PostgreSQL、MySQL、BigQuery、Spanner等）
- **MCPプロトコル実装**: 標準化されたプロトコルでAIツールと通信
- **設定ベースのツール定義**: YAMLでデータベースツールを簡単に定義
- **動的リロード**: サーバー再起動なしで設定を更新
- **OAuth 2.0認証**: Google Sign-Inを使用したセキュリティ
- **観測可能性**: OpenTelemetryでメトリクスとトレースを収集
- **複数のプロトコル**: REST APIとMCPプロトコル（stdio、SSE）をサポート
- **SDK提供**: Python、JavaScript/TypeScript、Go用のクライアントライブラリ

## 使用方法
### インストール
#### 前提条件
- Go 1.21+（ソースからビルドする場合）
- 対応データベースのアクセス権限
- オプション: Docker（コンテナ実行の場合）

#### インストール手順
```bash
# 方法1: バイナリダウンロード（推奨）
# Linux/AMD64の例
export VERSION=0.9.0
curl -O https://storage.googleapis.com/genai-toolbox/v$VERSION/linux/amd64/toolbox
chmod +x toolbox

# 他のプラットフォーム: darwin/arm64, darwin/amd64, windows/amd64

# 方法2: Docker
# Docker Hubから
docker pull us-central1-docker.pkg.dev/database-toolbox/toolbox/toolbox:$VERSION

# 方法3: Go install
go install github.com/googleapis/genai-toolbox@v0.9.0
```

### 基本的な使い方
#### Hello World相当の例
```yaml
# tools.yaml - シンプルなツール定義
sources:
  my-sqlite:
    kind: sqlite
    path: ./demo.db

tools:
  get-users:
    kind: sqlite-sql
    source: my-sqlite
    description: Get all users from the database
    statement: SELECT * FROM users;
```

```bash
# サーバー起動
./toolbox --tools-file tools.yaml

# ツール呼び出し
curl -X POST http://127.0.0.1:5000/api/tool/get-users/invoke
```

#### 実践的な使用例
```yaml
# PostgreSQLでのホテル検索ツール
sources:
  hotel-db:
    kind: postgres
    host: ${POSTGRES_HOST}
    port: 5432
    database: hotel_booking
    user: ${POSTGRES_USER}
    password: ${POSTGRES_PASSWORD}

tools:
  search-hotels:
    kind: postgres-sql
    source: hotel-db
    description: Search for hotels by location and date
    parameters:
      - name: location
        type: string
        description: City or area to search
      - name: checkin_date
        type: string
        description: Check-in date (YYYY-MM-DD)
      - name: nights
        type: number
        description: Number of nights
    statement: |
      SELECT h.id, h.name, h.location, h.price_per_night, h.rating
      FROM hotels h
      WHERE h.location ILIKE '%' || $1 || '%'
      AND h.id NOT IN (
        SELECT hotel_id FROM bookings
        WHERE checkin_date <= $2::date + interval '$3 days'
        AND checkout_date >= $2::date
      )
      ORDER BY h.rating DESC;

toolsets:
  hotel-search:
    - search-hotels
```

```python
# Pythonでの利用例
import asyncio
from toolbox_core import ToolboxClient

async def search_available_hotels():
    async with ToolboxClient("http://127.0.0.1:5000") as client:
        tools = await client.load_toolset("hotel-search")
        search_tool = tools[0]
        
        result = await search_tool.invoke({
            "location": "Tokyo",
            "checkin_date": "2025-02-01",
            "nights": 3
        })
        
        print(f"Found {len(result)} available hotels")
        for hotel in result:
            print(f"- {hotel['name']} ({hotel['rating']}★) - ¥{hotel['price_per_night']}/night")

asyncio.run(search_available_hotels())
```

### 高度な使い方
```yaml
# 認証を使用した高度な設定
authServices:
  google-auth:
    kind: google
    clientId: ${GOOGLE_CLIENT_ID}

sources:
  secure-db:
    kind: cloud-sql-pg
    project: ${GCP_PROJECT}
    region: us-central1
    instance: prod-instance
    database: customer_data
    user: ${DB_USER}
    password: ${DB_PASSWORD}

tools:
  # 認証が必要なツール
  get-customer-data:
    kind: cloud-sql-pg-sql
    source: secure-db
    description: Get customer data (requires authentication)
    authServices: [google-auth]
    parameters:
      - name: customer_id
        type: string
        description: Customer ID
      # 認証されたパラメータ（JWTから自動取得）
      - name: email
        type: string
        fromAuth: email
    statement: |
      SELECT * FROM customers
      WHERE id = $1 AND owner_email = $2;
  
  # テンプレートパラメータを使用
  execute-dynamic-query:
    kind: cloud-sql-pg-execute-sql
    source: secure-db
    description: Execute dynamic SQL queries
    authServices: [google-auth]
    templateParameters:
      table: customers
      columns: "id, name, email"

toolsets:
  customer-management:
    - get-customer-data
    - execute-dynamic-query
```

```typescript
// TypeScriptでLangChain統合
import { ToolboxClient } from '@toolbox-sdk/langchain';
import { ChatVertexAI } from '@langchain/google-vertexai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';

async function runCustomerSupportAgent() {
  const model = new ChatVertexAI({
    model: 'gemini-2.0-flash-001'
  });
  
  const client = new ToolboxClient('http://127.0.0.1:5000');
  const tools = await client.loadToolset('customer-management');
  
  const agent = createReactAgent({
    llm: model,
    tools: tools
  });
  
  const response = await agent.invoke({
    messages: [{
      role: 'user',
      content: 'Find information about customer ID 12345'
    }]
  });
  
  console.log(response.messages.at(-1).content);
}
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、クイックスタート、基本的な使い方
- **DEVELOPER.md**: 開発者向けガイド、ビルド方法、テスト実行
- **CONTRIBUTING.md**: コントリビューションガイドライン
- **docs/en/_index.md**: 詳細なドキュメントのエントリポイント
- **公式サイト**: https://github.com/googleapis/genai-toolbox/tree/main/docs

### サンプル・デモ
- **tests/**: 各データベース用の統合テスト（実装例を含む）
- **internal/prebuiltconfigs/**: 事前構築された設定ファイル
- **Quick Start例**: README内のPostgreSQLホテル検索の完全な例

### チュートリアル・ガイド
- **MCP統合ガイド**: MCP対応エディタでの使用方法
- **フレームワーク統合**: LangChain、LlamaIndex、Genkitの例
- **データベース別ガイド**: 各データベース固有の設定方法
- **FAQ**: よくある質問とトラブルシューティング

## 技術的詳細
### アーキテクチャ
#### 全体構造
プラグインアーキテクチャを採用し、新しいデータベースやツールを簡単に追加できる拡張性の高い設計。ファクトリパターンとレジストリを使用して、起動時にコンポーネントが自己登録する。

```
┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│ AI Agent/App    │────▶│ Toolbox Server  │────▶│ Databases       │
│ (LangChain等)   │ MCP │ (Goサーバー)      │     │ (17+種類)       │
└───────────────────┘     └───────────────────┘     └───────────────────┘
```

#### ディレクトリ構成
```
genai-toolbox/
├── cmd/                      # CLIコマンド
│   ├── root.go              # メインコマンドとサーバー初期化
│   └── options.go           # CLIオプション定義
├── internal/                 # コアアプリケーションコード
│   ├── server/              # HTTP/MCPサーバー実装
│   │   ├── server.go        # サーバー構造体と初期化
│   │   ├── config.go        # 設定パースと検証
│   │   ├── api.go           # REST APIエンドポイント
│   │   └── mcp.go           # MCPプロトコルHTTPエンドポイント
│   ├── sources/             # データベース抽象化レイヤ
│   │   ├── sources.go       # Sourceインターフェースとレジストリ
│   │   └── [database]/      # 各データベースドライバ
│   ├── tools/               # ツール実装
│   │   ├── tools.go         # Toolインターフェースとレジストリ
│   │   └── toolsets.go      # ツールセット管理
│   ├── auth/                # 認証サービス
│   ├── telemetry/           # OpenTelemetry統合
│   └── log/                 # 構造化ログ
├── tests/                    # 統合テスト
└── main.go                   # エントリポイント
```

#### 主要コンポーネント
- **Server**: HTTPサーバーとMCPプロトコルの実装
  - 場所: `internal/server/server.go`
  - 依存: ResourceManager, SSEManager, chi router
  - インターフェース: Start(), Stop(), handleAPI(), handleMCP()

- **ResourceManager**: スレッドセーフなリソース管理
  - 場所: `internal/server/server.go`
  - 依存: Sources, Tools, AuthServices
  - インターフェース: GetSource(), GetTool(), Reload()

- **Source**: データベース接続抽象化
  - 場所: `internal/sources/sources.go`
  - 依存: 各データベースドライバ
  - インターフェース: SourceKind(), Initialize()

- **Tool**: データベース操作の抽象化
  - 場所: `internal/tools/tools.go`
  - 依存: Source, Parameters
  - インターフェース: Invoke(), Manifest(), McpManifest()

### 技術スタック
#### コア技術
- **言語**: Go 1.21+（ジェネリクス、コンテキスト使用）
- **HTTPフレームワーク**: chi/v5（軽量ルーター）
- **主要ライブラリ**: 
  - pgx/v5: PostgreSQLドライバ（高性能コネクションプール）
  - go-sql-driver/mysql: MySQLドライバ
  - Google Cloud SDK: BigQuery、Spanner、Cloud SQLサポート
  - neo4j-go-driver: Neo4jグラフDBドライバ
  - goccy/go-yaml: YAMLパーサ（高速、アンカーサポート）
  - spf13/cobra: CLIフレームワーク

#### 開発・運用ツール
- **ビルドツール**: 
  - Go modulesで依存管理
  - Makeファイルでビルドタスク管理
  - クロスコンパイルサポート
- **テスト**: 
  - 単体テスト: 標準のtestingパッケージ
  - 統合テスト: 各データベース用の実際のインスタンスでテスト
  - カバレッジ: go test -coverで測定
- **CI/CD**: 
  - GitHub Actions: マルチプラットフォームビルド
  - Cloud Build: Google Cloudでのビルドとリリース
  - 自動バージョニングとリリース
- **デプロイ**: 
  - Dockerイメージとして配布
  - バイナリをGoogle Cloud Storageでホスト
  - Kubernetes/Cloud Runでの実行サポート

### 設計パターン・手法
1. **プラグインレジストリパターン**: 
init()関数でコンポーネントが自己登録
```go
func init() {
    sources.Register("postgres", newPostgresConfig)
    tools.Register("postgres-sql", newPostgresSQLTool)
}
```

2. **インターフェースベースのデータベース抽象化**: 
互換性のあるデータベース間でツールを共有

3. **遅延YAMLアンマーシャリング**: 
動的な型処理で柔軟な設定読み込み

4. **コンテキストベースのログとトレース**: 
context.Contextでロガーとトレーサーを伝搬

5. **ホットリロード機能**: 
ファイル監視で設定を動的に更新

### データフロー・処理フロー
```
1. クライアントリクエスト
    ↓
2. エンドポイントルーティング (REST/MCP)
    ↓
3. 認証チェック (オプショナル)
    ↓
4. ツール検索とパラメータ検証
    ↓
5. ソース（DB接続）取得
    ↓
6. SQL/クエリ実行
    ↓
7. 結果のシリアライズ
    ↓
8. レスポンス返却 (JSON/MCP)
```

コネクションプールやトランザクション管理は各データベースドライバが担当。

## API・インターフェース
### 公開API
#### REST API
- 目的: ツールのメタデータ取得と実行
- エンドポイント:
  - `GET /api/toolset` - デフォルトツールセット取得
  - `GET /api/toolset/{name}` - 特定ツールセット取得
  - `GET /api/tool/{name}` - ツールメタデータ取得
  - `POST /api/tool/{name}/invoke` - ツール実行

```bash
# ツール情報取得
curl http://localhost:5000/api/tool/search-hotels

# ツール実行
curl -X POST http://localhost:5000/api/tool/search-hotels/invoke \
  -H "Content-Type: application/json" \
  -d '{"location": "Tokyo"}'
```

#### MCPプロトコル
- 目的: AIツールとの標準化された通信
- バージョン: v2024-11-05, v2025-03-26
- トランスポート: STDIO, SSE (Server-Sent Events)

```json
// MCPリクエスト例
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "search-hotels",
    "arguments": {"location": "Tokyo"}
  },
  "id": 1
}
```

### 設定・カスタマイズ
#### 設定ファイル形式
```yaml
# 環境変数サポート
sources:
  prod-db:
    kind: postgres
    host: ${DB_HOST}                  # 環境変数
    port: ${DB_PORT:5432}              # デフォルト値付き
    database: ${DB_NAME}
    user: ${DB_USER}
    password: ${DB_PASSWORD}
    # SSL設定
    sslmode: ${SSL_MODE:prefer}
    
# 認証サービス
authServices:
  google:
    kind: google
    clientId: ${GOOGLE_CLIENT_ID}

# ツール定義
tools:
  my-tool:
    kind: postgres-sql
    source: prod-db
    description: Tool description
    authServices: [google]            # 認証要求
    parameters:
      - name: param1
        type: string
        required: true
        description: Parameter description
    templateParameters:               # テンプレート置換
      schema: ${DEFAULT_SCHEMA:public}
    statement: SELECT * FROM {{.schema}}.table WHERE col = $1;

# ツールセット
toolsets:
  default:
    - my-tool
```

#### サーバー起動オプション
```bash
# 基本起動
./toolbox --tools-file config.yaml

# 詳細オプション
./toolbox \
  --address "0.0.0.0" \             # リスンアドレス
  --port 8080 \                     # ポート番号
  --tools-files "a.yaml,b.yaml" \   # 複数設定ファイル
  --log-level debug \               # ログレベル
  --telemetry-gcp \                 # GCPテレメトリ
  --disable-reload                   # ホットリロード無効

# MCPモード（stdio）
./toolbox --stdio --tools-file config.yaml
```

#### 拡張・プラグイン開発
```go
// 新しいデータベースソースの追加
package mydb

type Config struct {
    Host string `yaml:"host"`
    Port int    `yaml:"port"`
}

func (c *Config) SourceConfigKind() string {
    return "mydb"
}

func (c *Config) Initialize(ctx context.Context, tracer trace.Tracer) (sources.Source, error) {
    // 接続初期化
    return &Source{...}, nil
}

func init() {
    sources.Register("mydb", func(...) (sources.SourceConfig, error) {
        var config Config
        // YAMLパース
        return &config, nil
    })
}
```

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- **Go言語による高性能**: ネイティブコンパイルで高速処理
- **コネクションプーリング**: 各データベースドライバの最適化
- **最適化手法**: 
  - pgxのプリペアドステートメント
  - コンテキストによる効率的なキャンセル処理
  - 非同期I/Oによる並列処理

### スケーラビリティ
- **水平スケーリング**: 複数インスタンスをロードバランサー後に配置
- **コネクションプール設定**: データベースごとに調整可能
- **動的リロード**: ダウンタイムなしで設定更新
- **OpenTelemetry**: 分散トレーシングでボトルネック特定

### 制限事項
- **技術的な制限**:
  - ベータ版（v0.9.0）のため、API変更の可能性
  - MCPプロトコルは新しく、エコシステムが発展中
  - バッチ処理APIは未サポート
  - カスタム認証は実装が必要
  - SDKはPython、JS、Goのみ
- **運用上の制限**:
  - データベースツールに特化（他のツールは限定的）
  - SQLインジェクション防止はパラメータ化クエリに依存
  - リアルタイムストリーミングは未サポート

## 評価・所感
### 技術的評価
#### 強み
- **優れたアーキテクチャ**: プラグインシステムで高い拡張性
- **統一インターフェース**: 17種類以上のデータベースを一元管理
- **プロダクション準備**: テレメトリ、認証、ホットリロードなど
- **MCP標準化**: AIツールエコシステムへの統合
- **優れたドキュメント**: 詳細なガイドと例
- **Googleサポート**: Google Cloud製品との緊密な統合

#### 改善の余地
- **ベータステータス**: v1.0までAPI変更の可能性
- **認証の柔軟性**: Google以外の認証方式の拡充
- **バッチ処理**: 複数ツールの一括実行
- **リアルタイム機能**: ストリーミング対応
- **エラーハンドリング**: リトライ機構の追加

### 向いている用途
- **AIエージェントのデータベースアクセス**: 主要な目的
- **複数AIフレームワーク間でのツール共有**: LangChain、LlamaIndex等
- **中央集権的なデータベースアクセス管理**: セキュリティとガバナンス
- **MCP対応 IDEでの利用**: Claude Desktop、VS Codeなど
- **マイクロサービスアーキテクチャ**: データアクセスレイヤとして

### 向いていない用途
- **汎用ツールサーバー**: データベース以外のツールには不向き
- **高度なカスタム認証が必要な場合**: 現状Google OAuthのみ
- **リアルタイム分析**: ストリーミング未サポート
- **複雑なツールオーケストレーション**: 単純なツール呼び出しのみ
- **組み込みシステム**: スタンドアロンサーバーとして設計

### 総評
genai-toolbox（MCP Toolbox for Databases）は、AIエージェントにデータベースアクセスを提供するための非常によく設計されたミドルウェアです。複数のデータベースを統一インターフェースで抽象化し、YAMLベースの簡単な設定でツールを定義できる点が特に優れています。MCPプロトコルの採用により、AIツールエコシステムへの統合もスムーズです。ベータ版であることを考慮しても、ドキュメントの充実度、テストの網羅性、プロダクション機能（テレメトリ、認証など）から、実用に耐える品質であることがうかがえます。AIアプリケーションがデータベースにアクセスする必要がある場合、最初に検討すべきソリューションです。