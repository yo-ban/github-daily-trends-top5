# リポジトリ解析: m1k1o/neko

## 基本情報
- リポジトリ名: m1k1o/neko
- 主要言語: Go
- スター数: 14,067
- フォーク数: GitHubから取得可能
- 最終更新: 高頻度に更新中
- ライセンス: Apache License 2.0
- トピックス: Virtual Browser、WebRTC、Docker、Self-hosted、Collaborative Browser、Screen Sharing、Remote Desktop

## 概要
### 一言で言うと
Nekoは、DockerコンテナでWebRTCを使用して仮想ブラウザをストリーミングする、セルフホスト型のマルチユーザー向けリモートブラウザ環境です。

### 詳細説明
Nekoは、Dockerコンテナ内で動作する完全機能のブラウザを実行し、WebRTC技術を使って複数のユーザーが同時にアクセスできる仮想環境を提供します。元々rabb.itの代替として開発され、友人とアニメを見るために作られたプロジェクトですが、現在では様々な用途に拡張されています。ブラウザだけでなく、Linux上で動作するあらゆるアプリケーション（VLC、デスクトップ環境全体など）を実行できる柔軟性を持ち、リアルタイムの同期と対話性を活用した多様なユースケースに対応しています。

### 主な特徴
- **WebRTCベースのストリーミング**: 低遅延でスムーズなビデオ・オーディオ配信
- **マルチユーザー同時アクセス**: 複数人が同じブラウザ環境を共有・操作可能
- **Docker完全対応**: 簡単なデプロイとスケーラビリティ
- **多様なブラウザサポート**: Firefox、Chrome、Tor Browser、Edgeなど10種類以上
- **セキュアな分離環境**: コンテナ化により安全にブラウジング
- **クロスプラットフォーム**: Windows、Mac、Linuxから利用可能
- **API提供**: プログラマブルな制御とカスタマイズ
- **リアルタイムコラボレーション**: 画面共有だけでなく、マウス・キーボード制御も共有
- **カスタマイズ可能**: 設定、UIテーマ、認証方式などを柔軟に変更可能
- **GPU支援**: NVIDIA、Intel、AMDのハードウェアアクセラレーション対応

## 使用方法
### インストール
#### 前提条件
- Docker または Podman
- Docker Compose（オプション）
- 開放されたポート: 8080（HTTP）、52000-52100（UDP/WebRTC）
- 最小2GBのRAM（推奨4GB以上）
- ソースからビルドする場合：Go 1.21以上、Node.js 16以上

#### インストール手順
```bash
# 方法1: Docker Composeを使用（推奨）
git clone https://github.com/m1k1o/neko.git
cd neko
docker-compose up -d

# 方法2: Dockerコマンドで直接実行
docker run -d \
  --name neko \
  -p 8080:8080 \
  -p 52000-52100:52000-52100/udp \
  -e NEKO_DESKTOP_SCREEN=1920x1080@30 \
  -e NEKO_MEMBER_MULTIUSER_USER_PASSWORD=neko \
  -e NEKO_MEMBER_MULTIUSER_ADMIN_PASSWORD=admin \
  -e NEKO_WEBRTC_EPR=52000-52100 \
  --shm-size="2gb" \
  ghcr.io/m1k1o/neko/firefox:latest

# 方法3: ソースからビルド
# サーバー側
cd server
go build -o neko cmd/neko/main.go

# クライアント側
cd ../client
npm install
npm run build
```

### 基本的な使い方
#### Hello World相当の例
```yaml
# docker-compose.yaml - 最小構成
services:
  neko:
    image: "ghcr.io/m1k1o/neko/firefox:latest"
    ports:
      - "8080:8080"
      - "52000-52100:52000-52100/udp"
    environment:
      NEKO_DESKTOP_SCREEN: 1920x1080@30
      NEKO_MEMBER_MULTIUSER_USER_PASSWORD: neko
      NEKO_MEMBER_MULTIUSER_ADMIN_PASSWORD: admin
```

ブラウザで `http://localhost:8080` にアクセスし、ユーザー名 `neko`、パスワード `neko` でログイン。

#### 実践的な使用例
```yaml
# 複数ブラウザとカスタム設定
services:
  firefox:
    image: "ghcr.io/m1k1o/neko/firefox:latest"
    ports:
      - "8080:8080"
      - "52000-52100:52000-52100/udp"
    environment:
      NEKO_DESKTOP_SCREEN: 1920x1080@60
      NEKO_MEMBER_PROVIDER: multiuser
      NEKO_MEMBER_MULTIUSER_ADMIN_PASSWORD: ${ADMIN_PASSWORD}
      NEKO_MEMBER_MULTIUSER_USER_PASSWORD: ${USER_PASSWORD}
      NEKO_WEBRTC_EPR: 52000-52100
      NEKO_WEBRTC_ICELITE: 1
      NEKO_SESSION_MERCIFUL_RECONNECT: true
      NEKO_SESSION_IMPLICIT_HOSTING: false
      NEKO_CAPTURE_PIPELINE: "ximagesrc display=:99.0 use-damage=true ! video/x-raw,framerate=60/1 ! videoconvert"
    shm_size: "2gb"
    volumes:
      - ./data:/home/neko/.mozilla/firefox
```

### 高度な使い方
```go
// APIを使用したプログラマブルな制御
package main

import (
    "fmt"
    "net/http"
    "bytes"
    "encoding/json"
)

type LoginRequest struct {
    Username string `json:"username"`
    Password string `json:"password"`
}

func main() {
    // ログイン
    loginReq := LoginRequest{
        Username: "admin",
        Password: "admin",
    }
    
    jsonData, _ := json.Marshal(loginReq)
    resp, _ := http.Post("http://localhost:8080/api/login", 
        "application/json", bytes.NewBuffer(jsonData))
    
    // セッション情報取得
    client := &http.Client{}
    req, _ := http.NewRequest("GET", "http://localhost:8080/api/sessions", nil)
    // Cookieヘッダーを設定
    
    // クリップボードテキスト設定
    clipboardData := map[string]string{"text": "Hello from API"}
    jsonData, _ = json.Marshal(clipboardData)
    http.Post("http://localhost:8080/api/room/clipboard/text", 
        "application/json", bytes.NewBuffer(jsonData))
}
```

```yaml
# GPUアクセラレーション有効化（NVIDIA）
services:
  neko:
    image: "ghcr.io/m1k1o/neko/firefox:nvidia"
    runtime: nvidia
    environment:
      NVIDIA_VISIBLE_DEVICES: all
      NVIDIA_DRIVER_CAPABILITIES: all
      NEKO_CAPTURE_PIPELINE: "nvh264enc ! h264parse"
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、クイックスタート、対応ブラウザ一覧
- **公式サイト**: https://neko.m1k1o.net/ - 完全なドキュメント
- **APIドキュメント**: OpenAPI仕様（server/openapi.yaml）
- **設定ガイド**: docs/configuration/ - 認証、キャプチャ、デスクトップ、WebRTC設定
- **SECURITY.md**: セキュリティポリシーと脆弱性報告方法

### サンプル・デモ
- **docker-compose.yaml**: 基本的なDocker Compose設定例
- **apps/**: 各種ブラウザ（Firefox、Chrome、Tor等）のDockerfile例
- **ホステッドデモ**: 公式サイトでライブデモ利用可能

### チュートリアル・ガイド
- [クイックスタートガイド](https://neko.m1k1o.net/docs/v3/quick-start)
- [インストールガイド](https://neko.m1k1o.net/docs/v3/installation)
- [設定ガイド](https://neko.m1k1o.net/docs/v3/configuration)
- [トラブルシューティング](https://neko.m1k1o.net/docs/v3/troubleshooting)
- [FAQ](https://neko.m1k1o.net/docs/v3/faq)
- [V2からの移行ガイド](https://neko.m1k1o.net/docs/v3/migration-from-v2)
- Discord: https://discord.gg/3U6hWpC - コミュニティサポート

## 技術的詳細
### アーキテクチャ
#### 全体構造
Nekoは、バックエンドのGoサーバーとフロントエンドのVue.jsクライアントから構成される、WebRTCベースのリモートデスクトップシステムです。Dockerコンテナ内でXvfb（仮想フレームバッファ）上でブラウザやアプリケーションを実行し、GStreamerパイプラインでビデオキャプチャを行い、WebRTC経由でクライアントにストリーミングします。マルチユーザー対応で、各ユーザーの入力（マウス、キーボード）をサーバー側で処理し、画面を全員に同期配信します。

#### ディレクトリ構成
```
neko/
├── server/           # Goバックエンドサーバー
│   ├── cmd/         # CLIエントリーポイント
│   ├── internal/    # 内部パッケージ
│   │   ├── api/     # REST APIハンドラー
│   │   ├── capture/ # GStreamerキャプチャ管理
│   │   ├── desktop/ # X11デスクトップ制御
│   │   ├── webrtc/  # WebRTC接続管理
│   │   └── websocket/ # WebSocketハンドラー
│   └── pkg/         # 公開パッケージ
│       ├── auth/    # 認証ロジック
│       ├── gst/     # GStreamer C bindings
│       └── xorg/    # X11 C bindings
├── client/           # Vue.jsフロントエンド
│   ├── src/         # ソースコード
│   │   ├── components/ # Vueコンポーネント
│   │   ├── neko/    # Nekoクライアントライブラリ
│   │   └── store/   # Vuexストア
│   └── public/      # 静的アセット
├── apps/            # 各種アプリケーションのDockerfile
├── runtime/         # ベースDockerイメージ設定
└── webpage/         # ドキュメントサイト（Docusaurus）
```

#### 主要コンポーネント
- **Capture Manager**: ビデオ/オーディオキャプチャの管理
  - 場所: `server/internal/capture/`
  - 依存: GStreamer、PulseAudio
  - インターフェース: GStreamerパイプライン管理、ストリーム選択

- **Desktop Manager**: X11デスクトップ制御
  - 場所: `server/internal/desktop/`
  - 依存: X11ライブラリ、xorg-server
  - インターフェース: マウス/キーボード入力、クリップボード管理

- **WebRTC Manager**: P2P接続管理
  - 場所: `server/internal/webrtc/`
  - 依存: pion/webrtc
  - インターフェース: ICE候補交換、メディアトラック管理

- **Session Manager**: ユーザーセッション管理
  - 場所: `server/internal/session/`
  - 依存: メンバーマネージャー
  - インターフェース: 認証、権限管理、セッション状態

- **Neko Client Library**: ブラウザ側WebRTCクライアント
  - 場所: `client/src/neko/`
  - 依存: WebRTC API、EventEmitter3
  - インターフェース: 接続管理、イベントハンドリング

### 技術スタック
#### コア技術
- **言語**: 
  - Go 1.21（バックエンド）- 並行処理、低レイテンシー通信
  - TypeScript/JavaScript（フロントエンド）- Vue.js 2.7ベース
  - C言語（低レベルバインディング）- X11、GStreamer統合
- **フレームワーク**: 
  - chi (v1.5.5): 軽量HTTPルーター
  - Vue.js 2.7 + Vuex: リアクティブUI
  - pion/webrtc (v3.2.24): Go製WebRTCスタック
- **主要ライブラリ**: 
  - GStreamer: ビデオ/オーディオパイプライン処理
  - gorilla/websocket (1.5.1): WebSocket通信
  - zerolog (1.31.0): 構造化ログ
  - spf13/cobra + viper: CLI・設定管理
  - prometheus/client_golang (1.18.0): メトリクス収集

#### 開発・運用ツール
- **ビルドツール**: 
  - Goモジュール（go.mod）
  - Vue CLI Service（webpack設定済み）
  - Dockerマルチステージビルド
  - Makeスクリプト（./build）
- **テスト**: 
  - Go標準テストフレームワーク
  - ユニットテスト、統合テスト
  - E2Eテスト未実装
- **CI/CD**: 
  - GitHub Actions（.github/workflows/ghcr.yml）
  - 自動ビルド、Docker イメージプッシュ
  - マルチアーキテクチャビルド（amd64、arm64）
- **デプロイ**: 
  - Docker/Docker Compose
  - Kubernetes（Helm Chart対応）
  - GitHub Container Registry（ghcr.io）

### 設計パターン・手法
- **マネージャーパターン**: 各機能（Desktop、Capture、WebRTC等）をManagerで管理
- **イベント駆動アーキテクチャ**: WebSocketとEventEmitterベースの非同期通信
- **プラグインアーキテクチャ**: チャット、ファイル転送等の機能をプラグインとして実装
- **依存性注入**: インターフェースベースの疎結合設計
- **ストラテジーパターン**: 認証プロバイダー（noauth、multiuser、object、file）の切り替え

### データフロー・処理フロー
1. **初期化フロー**:
   - Dockerコンテナ起動 → Xvfb仮想ディスプレイ作成
   - supervisordでプロセス管理（dbus、pulseaudio、xorg、neko）
   - アプリケーション（ブラウザ等）起動

2. **接続フロー**:
   - クライアントがWebSocketで接続
   - 認証処理（設定されたプロバイダーで）
   - WebRTC接続ネゴシエーション（SDP交換）
   - ICE候補交換で最適な経路確立

3. **ストリーミングフロー**:
   - X11画面をGStreamerでキャプチャ
   - エンコード（VP8/VP9/H264）
   - WebRTC DataChannelでメタデータ送信
   - MediaStreamでビデオ/オーディオ送信

4. **入力処理フロー**:
   - クライアントからマウス/キーボードイベント受信
   - WebSocket経由でサーバーに送信
   - X11 APIで仮想入力イベント生成
   - アプリケーションが入力を処理

5. **同期フロー**:
   - ホスト権限を持つユーザーの入力を優先
   - 全クライアントに画面更新を配信
   - カーソル位置、クリップボード内容も同期

## API・インターフェース
### 公開API
#### セッション管理API
- 目的: ログイン、ログアウト、セッション情報取得
- 使用例:
```bash
# ログイン
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"neko","password":"neko"}'

# 現在のセッション取得
curl http://localhost:8080/api/whoami \
  -H "Cookie: <session-cookie>"
```

#### ルーム制御API
- 目的: 画面制御、クリップボード、ブロードキャスト管理
- エンドポイント:
  - `/api/room/control` - コントロール権限管理
  - `/api/room/screen` - 画面設定変更
  - `/api/room/clipboard` - クリップボード操作
  - `/api/room/broadcast` - RTMP配信制御

### 設定・カスタマイズ
#### 設定ファイル
```yaml
# config.yml - 主要設定項目
server:
  bind: "0.0.0.0:8080"     # HTTPサーバーバインドアドレス
  static: "./dist"         # 静的ファイルパス
  
desktop:
  screen: "1920x1080@60"   # 画面解像度@リフレッシュレート
  
member:
  provider: "multiuser"    # 認証プロバイダー
  multiuser:
    admin_password: "admin"
    user_password: "neko"

webrtc:
  epr: "52000-52100"      # WebRTCポート範囲
  ice_lite: true          # ICE-Liteモード
  ice_servers:            # STUNサーバー
    - urls: ["stun:stun.l.google.com:19302"]

capture:
  video_codec: "vp8"      # ビデオコーデック
  video_bitrate: 3072     # ビデオビットレート(kb/s)
  audio_codec: "opus"     # オーディオコーデック
```

#### 拡張・プラグイン開発
```go
// カスタムプラグインの実装例
package myplugin

import (
    "github.com/m1k1o/neko/server/internal/plugins"
)

type MyPlugin struct {
    plugins.Base
}

func (p *MyPlugin) Name() string {
    return "myplugin"
}

func (p *MyPlugin) Config() interface{} {
    return &MyConfig{}
}

func (p *MyPlugin) Start() error {
    // プラグイン初期化
    return nil
}
```

環境変数での設定:
```bash
NEKO_SERVER_BIND=":8080"
NEKO_DESKTOP_SCREEN="1920x1080@60"
NEKO_MEMBER_MULTIUSER_ADMIN_PASSWORD="secure_password"
NEKO_WEBRTC_EPR="52000-52100"
```

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- **レイテンシ**: WebRTC使用により50-100ms程度の低遅延を実現
- **フレームレート**: 最大60fps（ネットワーク帯域に依存）
- **最適化手法**: 
  - ハードウェアエンコーディング（NVENC、QSV、VAAPI）
  - 適応的ビットレート調整
  - 効率的なGStreamerパイプライン
  - damage-based capture（変更部分のみキャプチャ）

### スケーラビリティ
- **垂直スケーリング**: CPUコア数、GPU性能に比例してパフォーマンス向上
- **水平スケーリング**: [neko-rooms](https://github.com/m1k1o/neko-rooms)による複数ルーム管理
- **推奨スペック**:
  - 10ユーザーまで: 2 vCPU、4GB RAM
  - 50ユーザーまで: 4 vCPU、8GB RAM、GPU推奨
  - 100ユーザー以上: 8 vCPU、16GB RAM、専用GPU必須

### 制限事項
- **技術的な制限**:
  - 単一インスタンスの同時接続数は帯域幅とCPU性能に依存
  - WebRTCのNATトラバーサル失敗時はTURNサーバーが必要
  - ブラウザのWebRTC実装差異による互換性問題
- **運用上の制限**:
  - UDPポート範囲（52000-52100）の開放が必要
  - ファイアウォール/プロキシ環境では追加設定必要
  - 大量のビデオストリーミングによる帯域消費

## 評価・所感
### 技術的評価
#### 強み
- **WebRTCによる高品質ストリーミング**: 画像転送方式より圧倒的にスムーズ
- **真のマルチユーザー対応**: Apache GuacamoleやnoVNCにない同時制御機能
- **柔軟なアーキテクチャ**: ブラウザだけでなく任意のLinuxアプリに対応
- **優れたDocker統合**: コンテナ化により簡単なデプロイと管理
- **活発な開発**: フォーク元の停滞後も継続的に機能追加・改善
- **豊富なブラウザサポート**: 主要ブラウザからTor Browserまで幅広く対応
- **GPU支援**: NVIDIA、Intel、AMDのハードウェアアクセラレーション

#### 改善の余地
- **スケーラビリティ**: 単一インスタンスの限界（neko-roomsで一部解決）
- **モバイル対応**: タッチ操作の最適化が不十分
- **セキュリティ**: エンタープライズレベルの認証・監査機能が限定的
- **ドキュメント**: 高度な設定やカスタマイズの文書が不足

### 向いている用途
- **ウォッチパーティー**: 友人と動画を一緒に視聴（元々の用途）
- **インタラクティブプレゼンテーション**: 参加者が操作可能なデモ
- **テクニカルサポート**: 画面共有だけでなく直接操作支援
- **ブラウザテスト環境**: クリーンな環境での動作確認
- **教育・トレーニング**: 講師と生徒の対話的な学習
- **匿名ブラウジング**: Tor Browserの共有利用
- **内部アプリケーションゲートウェイ**: VPN不要のセキュアアクセス

### 向いていない用途
- **大規模配信**: 数百人以上への一方向配信（RTMPの方が効率的）
- **高セキュリティ環境**: 金融・医療等の厳格な規制環境
- **低帯域環境**: WebRTCは一定の帯域幅が必要
- **レガシーブラウザ対応**: WebRTC非対応ブラウザでは利用不可

### 総評
Nekoは、WebRTCを活用した革新的なリモートブラウザソリューションとして、特にコラボレーティブな用途において優れた価値を提供します。「友人とアニメを見る」という個人的なニーズから生まれたプロジェクトが、エンタープライズレベルでも活用可能な柔軟なツールに成長した点は印象的です。

技術的には、Go言語による堅牢なバックエンドとWebRTCの低遅延通信の組み合わせが秀逸で、既存のVNCベースのソリューションを大きく上回るユーザー体験を実現しています。特に、複数人が同時に操作できる真のコラボレーション機能は、他のリモートデスクトップソリューションにはない独自の強みです。

ただし、エンタープライズ利用を考える場合、認証・監査機能の強化やスケーラビリティの改善が必要でしょう。とはいえ、オープンソースの利点を活かし、コミュニティと共に継続的に改善されている点は高く評価できます。小〜中規模のチームでのコラボレーションツールとして、あるいは特定用途のブラウザ環境として、非常に有用なソリューションと言えるでしょう。