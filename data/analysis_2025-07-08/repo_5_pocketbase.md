# リポジトリ解析: pocketbase/pocketbase

## 基本情報
- リポジトリ名: pocketbase/pocketbase
- 主要言語: Go (Golang)
- スター数: 42,509
- フォーク数: 2,000+
- 最終更新: 2025-06-24
- ライセンス: MIT License
- トピックス: オープンソースバックエンド、SQLiteデータベース、リアルタイムサブスクリプション、ファイル管理、ユーザー管理、管理ダッシュボード、REST API

## 概要
### 一言で言うと
PocketBaseは、SQLiteデータベース、リアルタイムサブスクリプション、認証、ファイル管理、管理ダッシュボードUI、シンプルなREST APIを含む、単一のファイル/実行可能ファイルのGoバックエンドです。

### 詳細説明
PocketBaseは、Webおよびモバイルアプリケーションのための完全なバックエンドインフラを提供するバックエンド・アズ・ア・サービス（BaaS）ソリューションです。複数のサービスを設定する複雑さなしに、フル機能のバックエンドを素早くセットアップする問題を解決します。

このプロジェクトは、FirebaseやSupabaseのようなサービスのよりシンプルでセルフホスト可能な代替手段を目指しており、開発者に以下を提供します：
- どこでも実行できる単一の実行可能ファイル
- 外部依存関係不要
- リアルタイム機能付きの組み込みデータベース
- 完全な認証システム
- ファイルストレージと管理
- データ管理のための管理UI
- GoまたはJavaScriptで拡張可能

### 主な特徴
- **埋め込みSQLiteデータベース**: Server-Sent Events (SSE)を介したリアルタイムサブスクリプション
- **組み込み認証**: メール/パスワード、OAuth2プロバイダー（30以上、Google、GitHub、Apple等）、OTP、MFAサポート
- **ファイルストレージ**: ローカルファイルシステムまたはS3互換ストレージサポート
- **管理ダッシュボード**: コレクション、レコード、設定を管理するための完全なUI
- **REST-ish API**: コレクション用の自動CRUDエンドポイント
- **リアルタイムサブスクリプション**: ライブデータ更新
- **JavaScript VM**: 再コンパイルなしで機能を拡張
- **データベースマイグレーション**: サポート
- **バックアップとリストア**: 機能
- **レート制限**: とセキュリティ機能
- **メールテンプレート**: とSMTP統合
- **バッチAPI操作**
- **Geo-pointフィールド**: 距離計算付き
- **自動生成SDK**: JavaScriptとDart用

## 使用方法
### インストール
#### 前提条件
- **プリビルト実行ファイル使用時**: 前提条件なし、ダウンロードして実行するのみ
- **Go開発用**: Go 1.23+ 
- **UI開発用**: Node.js 18+
- **サポートプラットフォーム**: 
  - darwin (macOS) amd64/arm64
  - linux 386/amd64/arm/arm64/ppc64le/riscv64/s390x
  - windows amd64/arm64
  - freebsd amd64/arm64

#### インストール手順
1. **プリビルトバイナリをダウンロード** （最も簡単）:
```bash
# GitHubリリースからダウンロード
# https://github.com/pocketbase/pocketbase/releases

# 解凍して実行
./pocketbase serve
```

2. **Goを使用**:
```bash
go get github.com/pocketbase/pocketbase
```

3. **ソースからビルド**:
```bash
git clone https://github.com/pocketbase/pocketbase.git
cd pocketbase/examples/base
go build
./base serve
```

### 基本的な使い方
#### 最小限の使用例
```go
package main

import (
    "log"
    "github.com/pocketbase/pocketbase"
    "github.com/pocketbase/pocketbase/core"
)

func main() {
    app := pocketbase.New()

    app.OnServe().BindFunc(func(se *core.ServeEvent) error {
        // カスタムルート追加
        se.Router.GET("/hello", func(re *core.RequestEvent) error {
            return re.String(200, "Hello world!")
        })
        return se.Next()
    })

    if err := app.Start(); err != nil {
        log.Fatal(err)
    }
}
```

#### 実践的な使用例
**カスタムフラグでサーバー起動**:
```bash
./pocketbase serve --http=0.0.0.0:8080 --dir="./mydata"
```

**スーパーユーザー作成**:
```bash
./pocketbase superuser create email@example.com password123
```

**JavaScriptフック使用** (pb_hooks/main.pb.js):
```javascript
onRecordCreateRequest((e) => {
    console.log("Creating record", e.record)
    e.record.set("created_by", e.auth?.id)
})
```

### 高度な使い方
**カスタム認証ハンドラー**:
```go
app.OnRecordAuthRequest("users").BindFunc(func(e *core.RecordAuthEvent) error {
    // カスタム認証ロジック
    if e.Record.GetString("status") == "suspended" {
        return errors.New("Account suspended")
    }
    return e.Next()
})
```

**S3ストレージ設定**:
```go
app.OnServe().BindFunc(func(e *core.ServeEvent) error {
    app.Settings().S3.Enabled = true
    app.Settings().S3.Bucket = "my-bucket"
    app.Settings().S3.Region = "us-east-1"
    app.Settings().S3.Endpoint = "s3.amazonaws.com"
    return e.Next()
})
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: クイックスタートガイド付きのメインドキュメント
- **CONTRIBUTING.md**: 開発者向け貢献ガイドライン
- **CHANGELOG.md**: 詳細なバージョン履歴（現在のバージョン: v0.28.4）
- **LICENSE.md**: MITライセンステキスト
- **ui/README.md**: 管理UI開発ドキュメント

### サンプル・デモ
- **examples/base/main.go**: すべてのプラグインを有効にした完全な例（プリビルトバイナリに使用）
- ドキュメント内のJavaScriptフックの例
- GoとJavaScript両方のマイグレーションテンプレート

### チュートリアル・ガイド
- 公式ドキュメント: https://pocketbase.io/docs
- APIドキュメント: https://pkg.go.dev/github.com/pocketbase/pocketbase
- JavaScript SDK: https://github.com/pocketbase/js-sdk
- Dart SDK: https://github.com/pocketbase/dart-sdk

## 技術的詳細
### アーキテクチャ
#### 全体構造
PocketBaseはモジュラーアーキテクチャに従っています：
- **コアレイヤー** (`core/`) - ベースアプリ実装、データベースモデル、ビジネスロジック
- **APIレイヤー** (`apis/`) - HTTPハンドラーとRESTエンドポイント
- **ツールレイヤー** (`tools/`) - 認証、ファイルシステム、メーラーなどのユーティリティ
- **フォームレイヤー** (`forms/`) - リクエスト検証とデータ処理
- **プラグイン** (`plugins/`) - JS VMやマイグレーションなどのオプション機能
- **UI** (`ui/`) - Svelteベースの管理ダッシュボード

#### ディレクトリ構成
```
pocketbase/
├── apis/          # HTTP APIエンドポイントとミドルウェア
├── cmd/           # CLIコマンド (serve, superuser)
├── core/          # コアアプリケーションロジックとモデル
├── examples/      # 実装例
├── forms/         # フォーム検証と処理
├── mails/         # メールテンプレート
├── migrations/    # システムマイグレーション
├── plugins/       # プラグインシステム (jsvm, ghupdate, migratecmd)
├── tests/         # テストユーティリティとフィクスチャ
├── tools/         # ユーティリティパッケージ
├── ui/            # 管理ダッシュボード (Svelteアプリ)
└── pocketbase.go  # メインアプリケーションエントリポイント
```

#### 主要コンポーネント
1. **Appインターフェース** (`core.App`) - すべてのサービスを管理する中央アプリケーションインターフェース
2. **コレクション** - データテーブルのスキーマ定義
3. **レコード** - 自動CRUD操作付きのデータエントリ
4. **認証システム** - 複数プロバイダーを持つ完全な認証
5. **ファイルシステム** - 抽象化されたファイルストレージ（ローカル/S3）
6. **リアルタイムブローカー** - SSEベースのサブスクリプションシステム
7. **フックシステム** - 拡張性のためのイベント駆動アーキテクチャ

### 技術スタック
#### コア技術
**バックエンド**:
- 言語: Go 1.23+
- データベース: SQLite (modernc.org/sqlite経由 - 純粋Go実装)
- Webフレームワーク: Echo風APIのカスタムルーター
- 認証: JWTトークン、OAuth2
- JavaScriptランタイム: Goja (ECMAScript 5.1)

**フロントエンド（管理UI）**:
- フレームワーク: Svelte 4
- ビルドツール: Vite 5
- UIライブラリ: Chart.js、Leaflet、CodeMirror
- CSS: CSS変数付きカスタムSCSS
- ルーター: svelte-spa-router

**主要依存関係**:
- `modernc.org/sqlite` - 純粋Go SQLiteドライバー
- `github.com/dop251/goja` - JavaScriptインタープリター
- `golang.org/x/oauth2` - OAuth2クライアント
- `github.com/golang-jwt/jwt` - JWT実装

#### 開発・運用ツール
- **ビルド**: 標準Goツールチェーン、静的バイナリ用CGO_ENABLED=0
- **テスト**: Go組み込みテストフレームワーク
- **リント**: カスタム設定付きgolangci-lint
- **CI/CD**: 自動リリース用GitHub Actions
- **ホットリロード**: JavaScriptフック用の組み込みファイルウォッチャー

### 設計パターン・手法
- **リポジトリパターン** - データアクセス用（コレクション/レコード）
- **イベント駆動アーキテクチャ** - すべての操作用のフックシステム
- **ミドルウェアパターン** - HTTPリクエスト処理用
- **ファクトリパターン** - 認証プロバイダー作成用
- **ビルダーパターン** - データベースクエリ用（dbx経由）

### データフロー・処理フロー
1. HTTPリクエスト → ルーター → ミドルウェア → APIハンドラー
2. APIハンドラー → フォーム（検証） → コアロジック
3. コアロジック → データベース/ファイルシステム → レスポンス
4. フックはカスタムロジック用に任意の段階で働く
5. リアルタイム更新はSSE接続を通じて流れる

## API・インターフェース
### 公開API
#### REST API
すべてのコレクション用の自動生成エンドポイント：
- `GET /api/collections` - コレクション一覧
- `POST /api/collections/:name/records` - レコード作成
- `GET /api/collections/:name/records` - レコード一覧
- `GET /api/collections/:name/records/:id` - レコード表示
- `PATCH /api/collections/:name/records/:id` - レコード更新
- `DELETE /api/collections/:name/records/:id` - レコード削除

#### 認証エンドポイント
- `/api/collections/:name/auth-with-password`
- `/api/collections/:name/auth-with-oauth2`
- `/api/collections/:name/auth-refresh`

#### リアルタイムAPI
- `/api/realtime` - サブスクリプション用SSEエンドポイント

### 設定・カスタマイズ
#### 設定オプション
- データベースの場所と接続設定
- S3ストレージ設定
- メール用SMTP設定
- レート制限ルール
- CORS設定
- バックアップスケジュールと保持
- ログレベルと保持

#### 拡張・プラグイン開発
**Go拡張**:
```go
app.OnServe().BindFunc(func(e *core.ServeEvent) error {
    // カスタムロジック追加
    return e.Next()
})
```

**JavaScriptフック**:
```javascript
// pb_hooks/main.pb.js
onModelCreate((e) => {
    // 任意のモデル作成用のカスタムロジック
})

onRecordListRequest((e) => {
    // リストクエリ修正
    e.options.AddFilter("status = 'active'")
})
```

**利用可能なフック**:
- `OnModelCreate/Update/Delete`
- `OnRecordAuth/Create/Update/Delete`
- `OnFileServe/Upload`
- `OnMailerSend`
- その他多数

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- **単一ファイル実行可能**: 高速起動時間で約30MB
- **SQLiteパフォーマンス**: 読み込み重視のワークロードで最大約100Kリクエスト/秒まで良好
- **組み込み接続プーリング**: 設定可能な制限付き
- **効率的なリアルタイム**: SSEを使用したサブスクリプション
- **低メモリフットプリント**: 小さなVPSインスタンスで実行可能
- **JavaScript VMプーリング**: より良いフックパフォーマンスのため

### スケーラビリティ
- **垂直スケーリング推奨**: SQLiteは単一マシンデプロイから恩恵を受ける
- **読み取りレプリカ**: SQLiteの組み込みレプリケーション経由で可能
- **S3ストレージ**: 無制限のファイルストレージ容量用
- **レート制限**: 乱用を防ぐための組み込み
- **バックアップ/リストア**: 災害復旧用

### 制限事項
- **書き込み同時実行性**: SQLiteによる制限（一度に1つの書き込み）
- **組み込みクラスタリングなし**: 単一インスタンスデプロイモデル
- **データベースサイズ**: SQLite実用的な制限約1TB
- **同時接続**: OSファイルディスクリプタによる制限
- **ネイティブ水平スケーリングなし**: 読み取りトラフィックのロードバランシングにリバースプロキシを使用
- **JavaScriptフック**: ECMAScript 5.1環境で実行（モダンJS機能なし）

## 評価・所感
### 技術的評価
#### 強み
- **単一ファイルアーキテクチャ**: デプロイと管理が非常にシンプル
- **完全な機能セット**: バックエンドに必要なものがすべて含まれる
- **優れた開発者体験**: 管理UI、自動API生成、リアルタイムサポート
- **拡張性**: GoとJavaScript両方でのカスタマイズオプション
- **ゼロ依存関係**: 外部サービスに依存せず完全にセルフホスト

#### 改善の余地
- **水平スケーリング**: SQLiteの制限により大規模アプリケーションでは課題
- **モダンJavaScriptサポート**: フックがES5.1に制限
- **型安全性**: APIクライアントのTypeScriptサポートが限定的
- **データベース移行**: 他のデータベースシステムへの移行が困難

### 向いている用途
- **プロトタイプとMVP**: 素早くアイデアを検証
- **小中規模Webアプリ**: スタートアップから中規模サービスまで
- **モバイルアプリバックエンド**: リアルタイム同期とオフラインサポート
- **社内ツール**: セルフホストでセキュリティを完全制御
- **教育目的**: バックエンド開発の学習

### 向いていない用途
- **大規模エンタープライズ**: 書き込みスケーラビリティの制限
- **マイクロサービス**: 分散アーキテクチャをサポートしない
- **リアルタイム分析**: SQLiteはOLAPワークロードに不適
- **高度なクエリ要求**: 複雑なJOINや分析関数が限定的

### 総評
PocketBaseは、バックエンド開発の複雑さを大幅に削減し、開発者がビジネスロジックに集中できるようにする優れたプロジェクトです。単一ファイルで完全なバックエンドを提供するというコンセプトは革新的で、デプロイや運用の簡素化に大きく貢献しています。

特に、リアルタイムサブスクリプション、統合認証システム、ファイル管理、管理UIなど、現代のアプリケーションに必須の機能がすべて含まれており、それらが高度に統合されている点が魅力です。また、GoとJavaScript両方での拡張性は、様々なスキルセットを持つ開発者にとってアクセシブルです。

一方で、SQLiteベースであることによるスケーラビリティの制限は明確で、大規模アプリケーションや高い書き込みスループットが必要なケースでは適しません。しかし、多くのアプリケーションにとってはこの制限は問題にならず、それよりもシンプルさと開発速度の利点が上回るでしょう。

プロジェクトは活発にメンテナンスされ、定期的なアップデートがあり、包括的なドキュメントを提供し、大半の小中規模アプリケーションを効率的に処理できる完全なバックエンドソリューションを提供しています。FirebaseやSupabaseのセルフホスト代替として、非常に有力な選択肢です。