# リポジトリ解析: m1k1o/neko

## 基本情報
- リポジトリ名: m1k1o/neko
- 主要言語: Go
- スター数: 13,729
- フォーク数: 859
- 最終更新: アクティブに開発中
- ライセンス: Apache License 2.0
- トピックス: WebRTC、仮想ブラウザ、Docker、リモートデスクトップ、画面共有、コラボレーション

## 概要
### 一言で言うと
Dockerで実行されWebRTCを使用するセルフホスト型仮想ブラウザで、複数のユーザーが同時にブラウザを制御・共有できるプラットフォーム。

### 詳細説明
Nekoは、Dockerコンテナ内でデスクトップをストリーミングするWebRTCベースのアプリケーションです。元々はrabb.itのサービス終了後にアニメを友人と一緒に見るために開発されました。その後、複数人での協調的なブラウザブラウジングというコンセプトに魅力を感じたm1k1oによってフォーク・発展されました。仮想ブラウザとして始まりましたが、現在ではLinux上で動作するあらゆるアプリケーション（VLC、デスクトップ環境など）を実行できます。

### 主な特徴
- WebRTCによる低遅延・高品質なビデオストリーミング
- 複数ユーザーによる同時アクセス・制御
- 10種類以上のブラウザと複数のデスクトップ環境をサポート
- セキュアで隔離された環境での実行
- 音声サポート内蔵
- プラグインシステム（チャット、ファイル転送など）
- APIによる部屋管理（neko-roomsプロジェクト）
- RTMP配信・録画機能
- GPU加速サポート（NVIDIA、Intel QSV、AMD）

## 使用方法
### インストール
#### 前提条件
- Docker および Docker Compose がインストール済み
- WebRTC用のUDPポート（52000-52100）が開放されている
- 十分なメモリとCPU（ブラウザ実行のため）

#### インストール手順
```bash
# 方法1: Docker Composeを使用（推奨）
# docker-compose.yamlファイルを作成または取得
wget https://raw.githubusercontent.com/m1k1o/neko/master/docker-compose.yaml

# 環境変数を設定（必要に応じて）
export NEKO_SCREEN=1920x1080@30
export NEKO_PASSWORD=myneko
export NEKO_PASSWORD_ADMIN=admin

# 起動
docker-compose up -d

# 方法2: Dockerコマンドで直接起動
docker run -d \
  --name neko \
  -p 8080:8080 \
  -p 52000-52100:52000-52100/udp \
  -e NEKO_SCREEN=1920x1080@30 \
  -e NEKO_PASSWORD=neko \
  -e NEKO_PASSWORD_ADMIN=admin \
  ghcr.io/m1k1o/neko/firefox:latest
```

### 基本的な使い方
#### Hello World相当の例
```bash
# 基本的なFirefoxブラウザを起動
docker run -d \
  --name neko \
  -p 8080:8080 \
  -p 52000-52100:52000-52100/udp \
  -e NEKO_SCREEN=1280x720@30 \
  -e NEKO_PASSWORD=neko \
  ghcr.io/m1k1o/neko/firefox:latest

# ブラウザでアクセス
# http://localhost:8080
# パスワード: neko
```

#### 実践的な使用例
```yaml
# docker-compose.yaml - ウォッチパーティー用設定
version: "3.4"
services:
  neko:
    image: ghcr.io/m1k1o/neko/firefox:latest
    restart: unless-stopped
    ports:
      - "8080:8080"
      - "52000-52100:52000-52100/udp"
    environment:
      NEKO_SCREEN: '1920x1080@30'
      NEKO_PASSWORD: watchparty
      NEKO_PASSWORD_ADMIN: admin
      NEKO_EPR: 52000-52100
      NEKO_ICELITE: true
      NEKO_FILE_TRANSFER_ENABLED: true
      NEKO_CHAT_ENABLED: true
```

### 高度な使い方
```bash
# Tor Browserを使用した匿名ブラウジング
docker run -d \
  --name neko-tor \
  -p 8080:8080 \
  -p 52000-52100:52000-52100/udp \
  -e NEKO_SCREEN=1920x1080@30 \
  -e NEKO_PASSWORD=secure \
  -e NEKO_PASSWORD_ADMIN=admin \
  ghcr.io/m1k1o/neko/tor-browser:latest

# RTMPストリーミング設定（Twitch/YouTube配信用）
docker run -d \
  --name neko-stream \
  -p 8080:8080 \
  -p 52000-52100:52000-52100/udp \
  -e NEKO_SCREEN=1920x1080@30 \
  -e NEKO_BROADCAST_PIPELINE="flvmux name=mux ! rtmpsink location=rtmp://live.twitch.tv/live/YOUR_STREAM_KEY" \
  ghcr.io/m1k1o/neko/firefox:latest
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクトの概要、使用例、サポートされるブラウザとアプリケーション
- **neko.m1k1o.net**: 包括的なドキュメントサイト（Docusaurus 3ベース）
- **server/openapi.yaml**: サーバーAPIのOpenAPI仕様
- **SECURITY.md**: セキュリティポリシーとガイドライン

### サンプル・デモ
- **docker-compose.yaml**: 基本的なデプロイメント設定例
- **apps/**: 各種ブラウザとアプリケーションの設定例
- **webpage/docs/**: 詳細な設定例とチュートリアル

### チュートリアル・ガイド
- [Getting Started](https://neko.m1k1o.net/docs/v3/quick-start)
- [Installation Guide](https://neko.m1k1o.net/docs/v3/installation)
- [Configuration Reference](https://neko.m1k1o.net/docs/v3/configuration)
- [Examples](https://neko.m1k1o.net/docs/v3/installation/examples)
- [Migration from V2](https://neko.m1k1o.net/docs/v3/migration-from-v2)
- [FAQ](https://neko.m1k1o.net/docs/v3/faq)
- [Troubleshooting](https://neko.m1k1o.net/docs/v3/troubleshooting)

## 技術的詳細
### アーキテクチャ
#### 全体構造
Nekoは、GoベースのバックエンドサーバーとVueベースのフロントエンドクライアントで構成される、マイクロサービスアーキテクチャを採用しています。X11仮想ディスプレイ上でアプリケーションを実行し、その画面をWebRTC経由でストリーミングします。WebSocketを使用して制御コマンドを送信し、複数ユーザー間の同期を実現しています。

#### ディレクトリ構成
```
neko/
├── server/               # Goバックエンドサーバー
│   └── internal/         # 内部パッケージ
│       ├── api/          # REST APIエンドポイント
│       ├── webrtc/       # WebRTC接続管理
│       ├── websocket/    # WebSocketハンドラー
│       ├── desktop/      # X11デスクトップ制御
│       ├── capture/      # 画面キャプチャとストリーミング
│       └── plugins/      # プラグインシステム
├── client/               # Vue.jsフロントエンド
│   ├── src/              # ソースコード
│   └── public/           # 静的アセット
├── runtime/              # 実行環境設定
│   ├── Dockerfile*       # 各種Dockerイメージ
│   └── supervisord.conf  # プロセス管理設定
├── apps/                 # アプリケーション別設定
└── webpage/              # Docusaurusドキュメント
```

#### 主要コンポーネント
- **WebRTC Manager**: WebRTC接続の確立と管理
  - 場所: `server/internal/webrtc/`
  - 依存: pion/webrtc
  - インターフェース: CreatePeer、AddICECandidate

- **Desktop Capture**: X11画面のキャプチャとエンコーディング
  - 場所: `server/internal/capture/`
  - 依存: GStreamer、X11
  - インターフェース: Start、Stop、GetPipeline

- **Session Manager**: ユーザーセッションとアクセス制御
  - 場所: `server/internal/session/`
  - 依存: WebSocket、認証プロバイダー
  - インターフェース: Create、Destroy、Authenticate

### 技術スタック
#### コア技術
- **言語**: 
  - Go 1.20（バックエンド）
  - TypeScript/JavaScript（フロントエンド）
- **フレームワーク**: 
  - Chi router（HTTPルーティング）
  - Vue 2.x（UIフレームワーク）
  - Vuex（状態管理）
- **主要ライブラリ**: 
  - pion/webrtc (v3): WebRTC実装
  - gorilla/websocket: WebSocket通信
  - zerolog: 構造化ログ
  - cobra/viper: CLI・設定管理
  - prometheus: メトリクス収集
  - gst1-plugins: GStreamerメディア処理

#### 開発・運用ツール
- **ビルドツール**: 
  - Multi-stage Docker builds
  - Go modules
  - npm/webpack（フロントエンド）
- **CI/CD**: GitHub Actions（自動ビルドとDockerイメージ公開）
- **デプロイ**: 
  - Docker/Docker Compose
  - Kubernetes対応（Helm chartは別プロジェクト）
- **監視**: Prometheusメトリクス内蔵

### 設計パターン・手法
- **マイクロサービスアーキテクチャ**: 各機能を独立したモジュールとして実装
- **プラグインパターン**: チャット、ファイル転送などの機能を拡張可能
- **イベント駆動**: WebSocketによるリアルタイムイベント処理
- **依存性注入**: インターフェースベースの疎結合設計
- **リポジトリパターン**: データアクセス層の抽象化

### データフロー・処理フロー
1. **入力処理**: クライアントからWebSocket経由でマウス/キーボード入力を受信
2. **X11イベント注入**: uinputデバイスを通じてX11サーバーに入力を転送
3. **画面キャプチャ**: X11画面をGStreamerパイプラインでキャプチャ
4. **エンコーディング**: H264/VP8/VP9でビデオをエンコード、Opusで音声をエンコード
5. **WebRTC送信**: エンコードされたメディアをWebRTC経由で配信
6. **クライアント表示**: ブラウザでビデオ/オーディオをデコードして表示
7. **同期制御**: 全クライアント間で画面とカーソル位置を同期

## API・インターフェース
### 公開API
#### REST API
- 目的: セッション管理、メンバー管理、統計情報取得
- エンドポイント例:
  - `POST /api/login` - 認証
  - `GET /api/members` - メンバー一覧
  - `POST /api/room/control` - 制御権の取得/解放
  - `GET /api/stats` - 統計情報

```bash
# 認証APIの使用例
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"password": "neko"}'
```

#### WebSocket API
- 目的: リアルタイム制御とイベント通信
- イベント例:
  - `control/request` - 制御権要求
  - `screen/size` - 画面サイズ変更
  - `broadcast/status` - 配信ステータス

### 設定・カスタマイズ
#### 設定ファイル
```yaml
# config.yml の主要設定
desktop:
  display: :99.0
  screen: 1920x1080@60

capture:
  audio_codec: opus
  video_codec: h264
  video_bitrate: 3000
  
server:
  bind: :8080
  static: ./www
  
webrtc:
  ice_servers:
    - urls: ["stun:stun.l.google.com:19302"]
```

#### 拡張・プラグイン開発
プラグインインターフェース（`server/internal/plugins/`）:
- `Plugin` interface の実装
- `Start()`, `Stop()`, `HandleMessage()` メソッドの定義
- WebSocketメッセージのハンドリング
- 例: チャットプラグイン、ファイル転送プラグイン

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- レイテンシ: WebRTC使用により通常50-100ms（ネットワーク依存）
- CPU使用率: 1080p@30fpsで約20-40%（エンコーディング設定による）
- メモリ使用量: 基本構成で約500MB-1GB
- 最適化手法: 
  - ハードウェアアクセラレーション（NVENC、QSV）
  - 適応的ビットレート制御
  - ICE Liteモードでの接続最適化

### スケーラビリティ
- 単一インスタンスで推奨10-20同時接続
- neko-roomsによる複数ルーム管理
- 水平スケーリング可能（各ルームが独立したコンテナ）
- KubernetesやDocker Swarmでのオーケストレーション対応

### 制限事項
- 単一インスタンスでの同時接続数はCPU/帯域幅に依存
- UDPポート範囲（52000-52100）が必要
- X11ベースのため、Windowsネイティブアプリは実行不可
- GPUアクセラレーションはホストGPUドライバに依存

## 評価・所感
### 技術的評価
#### 強み
- WebRTCによる低遅延・高品質なストリーミング
- 豊富なブラウザ・アプリケーションサポート
- 優れたマルチユーザー同期機能
- 活発な開発とコミュニティ（13,729スター）
- セキュアな隔離環境での実行
- プラグインによる拡張性
- 包括的なドキュメントとサンプル

#### 改善の余地
- ネットワーク要件（UDPポート範囲）が厳しい場合がある
- 大規模展開時のリソース管理の複雑さ
- Windows専用アプリケーションの実行不可
- 初期設定の複雑さ（特にネットワーク設定）

### 向いている用途
- リモートワークでのウォッチパーティー
- オンライン教育・トレーニング
- テクニカルサポート・画面共有
- セキュアなブラウジング環境の提供
- 共同作業・ペアプログラミング
- デモンストレーション・プレゼンテーション
- ストリーミング配信のソース

### 向いていない用途
- 低遅延が絶対的に必要なゲーム
- 大量の同時接続が必要なサービス（100+ユーザー）
- Windowsネイティブアプリケーションの実行
- モバイルデバイスでの利用（WebRTC制限）

### 総評
Nekoは、WebRTCを活用した革新的な仮想ブラウザ共有プラットフォームとして、技術的に非常に完成度が高いプロジェクトです。特に、複数人での協調作業やリモートでのコンテンツ共有において、既存のソリューション（VNCやRDP）を大きく上回るユーザー体験を提供しています。Apache License 2.0での公開、活発な開発、充実したドキュメントにより、プロダクション利用にも適しています。一方で、ネットワーク設定の複雑さや、大規模展開時の課題もあるため、用途に応じた適切な設計が必要です。オープンソースの画面共有ソリューションとしては、現時点で最も優れた選択肢の一つと言えるでしょう。