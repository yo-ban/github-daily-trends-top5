# リポジトリ解析: binwiederhier/ntfy

## 基本情報
- リポジトリ名: binwiederhier/ntfy
- 主要言語: Go (Golang)
- スター数: 18,795
- フォーク数: 600+
- 最終更新: アクティブにメンテナンス中
- ライセンス: Apache License 2.0 / GPL v2 (デュアルライセンス)
- トピックス: 通知サービス、pub-sub、プッシュ通知、セルフホスト、HTTP API、WebSocket、Android、iOS

## 概要
### 一言で言うと
シンプルなHTTPベースのpub-sub通知サービスで、サインアップ不要で任意のコンピュータからスマートフォンやデスクトップにプッシュ通知を送信できるオープンソースツール。

### 詳細説明
ntfy（"notify"と発音）は、開発者やシステム管理者が直面する「スクリプトやアプリケーションから簡単に通知を送りたい」という課題を解決するツールです。既存の通知サービスはAPIキーの取得、複雑な設定、アカウント作成などが必要ですが、ntfyはトピック名をURLに含めるだけで即座に使い始められるシンプルさが特徴です。公開インスタンスntfy.shを無料で利用できるほか、セルフホストも可能で、データの完全なコントロールを保持できます。

### 主な特徴
- **シンプルHTTP API**: PUT/POSTリクエストで通知送信
- **登録不要**: トピック名を決めるだけで即利用開始
- **マルチプラットフォーム**: Android、iOS、Web、CLIクライアント
- **リアルタイムメッセージング**: HTTPストリーミング、SSE、WebSocket対応
- **リッチな通知機能**: 優先度、タイトル、タグ、添付ファイル、アクションボタン
- **セルフホスト可能**: 完全なコントロールを保持
- **Firebase統合**: Androidのバッテリー効率的な通知
- **認証・アクセス制御**: ユーザー管理とトピックアクセス制御
- **メッセージキャッシュ**: SQLiteベースの永続化
- **Emailパブリッシング**: メール経由での通知送信
- **Web Pushサポート**: PWA機能でブラウザ通知
- **多言語対応**: 30以上の言語にUIを翻訳

## 使用方法
### インストール
#### 前提条件
- **サーバー側**: Linux/macOS/Windows、Go 1.24+（ビルド時）
- **クライアント**: Android 5.0+、iOS 14+、モダンブラウザ
- **オプション**: Docker、Firebaseアカウント（FCM使用時）

#### インストール手順
```bash
# 方法1: バイナリダウンロード（Linux/macOS）
sudo sh -c 'curl -fsSL https://github.com/binwiederhier/ntfy/releases/latest/download/ntfy_amd64.tar.gz | tar -C /usr/bin -zxf - ntfy && chmod +x /usr/bin/ntfy'

# 方法2: Debian/Ubuntuパッケージ
curl -fsSL https://archive.heckel.io/apt/pubkey.txt | sudo apt-key add -
echo "deb https://archive.heckel.io/apt debian main" | sudo tee /etc/apt/sources.list.d/archive.heckel.io.list
sudo apt update
sudo apt install ntfy

# 方法3: Docker
docker run -p 80:80 -v /var/cache/ntfy:/var/cache/ntfy binwiederhier/ntfy serve

# 方法4: ソースからビルド
git clone https://github.com/binwiederhier/ntfy.git
cd ntfy
make build
sudo make install-linux-amd64
```

### 基本的な使い方
#### Hello World相当の例
```bash
# 最小限の使用例 - コマンドラインから通知送信
curl -d "Backup successful 😀" ntfy.sh/mytopic

# 同じトピックをブラウザで開いて通知を受信
# https://ntfy.sh/mytopic
```

#### 実践的な使用例
```go
// Goでの実装例
package main

import (
    "log"
    "net/http"
    "strings"
)

func main() {
    // シンプルな通知
    resp, err := http.Post("https://ntfy.sh/mytopic", "text/plain", 
        strings.NewReader("Backup successful 😀"))
    if err != nil {
        log.Fatal(err)
    }
    defer resp.Body.Close()

    // ヘッダー付き通知
    req, _ := http.NewRequest("POST", "https://ntfy.sh/phil_alerts",
        strings.NewReader("Remote access to phils-laptop detected. Act right away."))
    req.Header.Set("Title", "Unauthorized access detected")
    req.Header.Set("Priority", "urgent")
    req.Header.Set("Tags", "warning,skull")
    http.DefaultClient.Do(req)
}
```

### 高度な使い方
```python
# Pythonでの高度な使用例
import requests
import json

# JSONペイロードでの送信
resp = requests.post("https://ntfy.sh", 
    data=json.dumps({
        "topic": "mytopic",
        "message": "Disk space is low",
        "title": "Warning: Low disk space",
        "priority": 4,
        "tags": ["warning", "computer"],
        "actions": [{
            "action": "view",
            "label": "Admin panel",
            "url": "https://admin.example.com"
        }]
    })
)

# 添付ファイル付き通知
resp = requests.put("https://ntfy.sh/mytopic",
    data="Important document attached",
    headers={
        "Title": "Document ready",
        "Attach": "https://example.com/document.pdf",
        "Filename": "document.pdf"
    })

# サブスクライブ例
def subscribe():
    resp = requests.get("https://ntfy.sh/mytopic/json", stream=True)
    for line in resp.iter_lines():
        if line:
            message = json.loads(line)
            print(f"Received: {message['message']}")
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、クイックスタート、主要機能
- **docs.ntfy.sh**: 完全なオンラインドキュメント（MkDocsベース）
- **docs/**: MkDocsソースファイル
- **CONTRIBUTING.md**: コントリビューションガイド

### サンプル・デモ
- **examples/publish-go/**: Go言語での通知送信例
- **examples/publish-python/**: Pythonでの通知送信例  
- **examples/publish-php/**: PHPでの通知送信例
- **examples/subscribe-go/**: Goでのサブスクライブ例
- **examples/web-example-eventsource/**: EventSourceを使ったWeb例
- **examples/web-example-websocket/**: WebSocketを使ったWeb例
- **examples/grafana-dashboard/**: Grafanaダッシュボード統合
- **examples/desktop-notifications/**: Linuxデスクトップ通知
- **examples/ssh-login-alert/**: SSHログインアラート

### チュートリアル・ガイド
- 公式ドキュメントの「Getting Started」セクション
- 各プログラミング言語向けのサンプルコード
- インテグレーションガイド（UnifiedPush、Matrix、Alertmanager等）
- YouTubeチュートリアル動画（コミュニティ提供）

## 技術的詳細
### アーキテクチャ
#### 全体構造
ntfyはシンプルなpub-subモデルに基づいたマイクロサービスアーキテクチャを採用しています。Go言語で書かれたシングルバイナリのサーバーが、HTTP API、WebSocket、SSEのエンドポイントを提供し、ReactベースのWeb UIをホストします。メッセージはSQLiteに保存され、オプションでFirebase Cloud Messagingを使用してAndroidデバイスにプッシュ通知を送信できます。

#### ディレクトリ構成
```
ntfy/
├── cmd/                  # CLIコマンド実装
│   ├── serve.go         # サーバー起動コマンド
│   ├── publish.go       # パブリッシュコマンド
│   └── subscribe.go     # サブスクライブコマンド
├── server/               # サーバー実装
│   ├── server.go        # メインサーバーロジック
│   ├── message.go       # メッセージ処理
│   ├── visitor.go       # レート制限・訪問者管理
│   └── firebase.go      # FCM統合
├── client/               # クライアントライブラリ実装
├── web/                  # React Webアプリケーション
│   ├── src/              # Reactソースコード
│   └── public/           # 静的アセット
├── docs/                 # MkDocsドキュメント
├── examples/             # 使用例・サンプルコード
├── scripts/              # ビルド・メンテナンススクリプト
├── test/                 # テストユーティリティ
├── user/                 # ユーザー管理機能
├── util/                 # ユーティリティ関数
└── log/                  # ログ機能
```

#### 主要コンポーネント
- **Server**: HTTPサーバーとAPIエンドポイント管理
  - 場所: `server/server.go`
  - 依存: gorilla/websocket、mattn/go-sqlite3
  - インターフェース: Run(), handlePublish(), handleSubscribe()

- **Message Cache**: SQLiteベースのメッセージ永続化
  - 場所: `server/message_cache.go`
  - 依存: SQLite3ドライバ
  - インターフェース: AddMessage(), Messages(), Prune()

- **Firebase統合**: FCMを使ったAndroidプッシュ通知
  - 場所: `server/firebase.go`
  - 依存: firebase.google.com/go/v4
  - インターフェース: Send(), SubscribeToTopic()

- **Web UI**: Reactベースのフロントエンド
  - 場所: `web/src/`
  - 依存: React、Material-UI、Vite
  - インターフェース: トピック表示、メッセージ送受信

### 技術スタック
#### コア技術
- **言語**: Go 1.24 (toolchain go1.24.0)
- **Webフレームワーク**: React + Material UI
- **主要ライブラリ**: 
  - gorilla/websocket (v1.5.3): WebSocketサポート
  - mattn/go-sqlite3 (v1.14.28): メッセージキャッシュ
  - urfave/cli/v2 (v2.27.6): CLIフレームワーク
  - firebase.google.com/go/v4 (v4.15.2): FCM統合
  - stripe/stripe-go/v74 (v74.30.0): 支払い処理
  - golang.org/x/crypto (v0.38.0): 暗号化・認証

#### 開発・運用ツール
- **ビルドツール**: 
  - Make: ビルドオーケストレーション
  - GoReleaser: マルチプラットフォームビルド
  - Vite: Webアプリケーションビルド
  - Docker: コンテナ化
- **テスト**: 
  - Go標準テスト: 単体テスト、統合テスト
  - Race detector: 競合状態検出
  - Coverageレポート: カバレッジ測定
- **CI/CD**: 
  - GitHub Actions: 自動ビルド・テスト
  - リリース自動化: タグ付けで自動リリース
- **デプロイ**: 
  - Docker/Docker Compose
  - systemdサービス
  - Debian/RPMパッケージ
  - バイナリ直接配置

### 設計パターン・手法
- **RESTful API設計**: シンプルなHTTPメソッドとURL構造
- **Pub-Subパターン**: トピックベースのメッセージング
- **ストリーミング対応**: SSE、WebSocket、HTTPストリーミング
- **プラグインアーキテクチャ**: Firebase、SMTPなどのオプション機能
- **セキュリティファースト**: トピック名がパスワードとして機能

### データフロー・処理フロー
1. **パブリッシュフロー**:
   - HTTP POST/PUTリクエスト受信
   - メッセージ検証（サイズ、レート制限）
   - SQLiteにメッセージ保存
   - 接続中のサブスクライバーに配信
   - オプションでFCM/APNS経由でプッシュ

2. **サブスクライブフロー**:
   - HTTP GET/WebSocket接続
   - トピック購読登録
   - キャッシュされたメッセージ配信
   - 新規メッセージのリアルタイム配信
   - 接続維持またはpolling

## API・インターフェース
### 公開API
#### パブリッシュAPI
- 目的: メッセージの送信
- 使用例:
```bash
# シンプルな送信
curl -d "Backup complete" ntfy.sh/mytopic

# ヘッダー付き送信
curl -H "Title: System Alert" \
     -H "Priority: urgent" \
     -H "Tags: warning,computer" \
     -d "CPU usage above 90%" \
     ntfy.sh/alerts

# JSONペイロード
curl -H "Content-Type: application/json" \
     -d '{"topic":"mytopic","message":"Test","priority":5}' \
     ntfy.sh
```

#### サブスクライブAPI  
- 目的: メッセージの受信
- 使用例:
```bash
# JSONストリーム
curl -s ntfy.sh/mytopic/json

# SSEストリーム
curl -s ntfy.sh/mytopic/sse

# WebSocket
websocat wss://ntfy.sh/mytopic/ws
```

### 設定・カスタマイズ
#### 設定ファイル
```yaml
# /etc/ntfy/server.yml
base-url: "https://ntfy.example.com"
listen-http: ":80"
cache-file: "/var/cache/ntfy/cache.db"
cache-duration: "12h"

# 認証設定
auth-file: "/var/lib/ntfy/user.db"
auth-default-access: "deny-all"

# Firebase設定  
firebase-key-file: "/etc/ntfy/firebase-key.json"

# レート制限
visitor-subscription-limit: 30
visitor-request-limit-burst: 60
visitor-request-limit-replenish: "10s"
```

#### 拡張・プラグイン開発
- UnifiedPushサーバーとしての使用
- Webhook経由での統合（GitHub、Grafana、Alertmanager等）
- カスタムクライアント開発（Go/Python/JavaScript SDK）
- MatrixブリッジによるMatrixネットワークとの統合

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- **メモリ使用量**: 非常に軽量（~30MB RAM）
- **メッセージ処理速度**: 毎秒数千メッセージ処理可能
- **同時接続数**: 数千のWebSocket/SSE接続をサポート
- **スタートアップ時間**: 1秒以内

### スケーラビリティ
- **水平スケーリング**: ロードバランサー背後で複数インスタンス実行
- **ストレージ**: SQLiteは小規模～中規模に適しており、大規模にはPostgreSQLプラグインを開発中
- **マルチアーキテクチャ**: ARM、x86など複数アーキテクチャサポート
- **クラウドネイティブ**: Docker/Kubernetes対応

### 制限事項
- **メッセージサイズ**: デフォルト4KB、最大512KB
- **添付ファイル**: URL参照のみ（直接アップロードはPro版）  
- **キャッシュ期間**: デフォルト12時間
- **トピック名**: 最大256文字、英数字と一部記号のみ
- **SQLite制限**: 大量データではパフォーマンス低下の可能性

## 評価・所感
### 技術的評価
#### 強み
- **極めてシンプルなAPI**: curlコマンド一つで通知送信可能
- **登録不要の手軽さ**: トピック名を決めるだけで即利用開始
- **軽量・高速**: Go言語による効率的な実装
- **セルフホスト可能**: 完全なコントロールとプライバシー
- **マルチプラットフォーム**: Android/iOS/Web/CLI全てサポート
- **リアルタイム性**: WebSocket/SSEによる即座の通知
- **オープンソース**: アクティブな開発とコミュニティ

#### 改善の余地
- **エンドツーエンド暗号化の欠如**: メッセージはHTTPSのみで保護
- **スケーラビリティ制限**: SQLiteは大規模利用に不向き
- **ユーザー管理機能**: 基本的な認証のみ
- **プッシュ通知の信頼性**: FCM/APNS依存で完全ではない

### 向いている用途
- **システム監視・アラート**: サーバーやサービスの状態通知
- **CI/CDパイプライン**: ビルドやデプロイの結果通知
- **IoTデバイス**: センサーからのアラート
- **個人プロジェクト**: ホビープロジェクトの通知
- **チーム内通知**: 小規模チームでの情報共有
- **バックアップ通知**: cronジョブの結果通知

### 向いていない用途
- **機密情報の送信**: エンドツーエンド暗号化がない
- **大規模エンタープライズ**: 高度な管理機能が不足
- **リッチメッセージング**: 画像や動画の直接添付不可
- **双方向コミュニケーション**: 一方向の通知のみ

### 総評
ntfyは「シンプルさは最強の武器」という哲学を体現した優れた通知サービスです。登録不要でURLを決めるだけで使える手軽さ、curlコマンド一つで通知を送れるAPIのシンプルさは、開発者やシステム管理者にとって非常に魅力的です。セルフホスト可能でオープンソースであることも、データの完全なコントロールを求めるユーザーにとって大きな利点です。一方で、エンドツーエンド暗号化の欠如やSQLiteのスケーラビリティ制限など、エンタープライズ利用には考慮が必要な点もあります。それでも、個人プロジェクトや小規模チーム、DevOpsパイプラインなどでの通知ニーズには、現在入手可能な選択肢の中で最もバランスの取れたソリューションの一つと言えるでしょう。