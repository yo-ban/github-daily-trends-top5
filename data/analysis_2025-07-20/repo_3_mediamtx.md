# リポジトリ解析: bluenviron/mediamtx

## 基本情報
- リポジトリ名: bluenviron/mediamtx
- 主要言語: Go
- スター数: 15,332
- フォーク数: 1,860
- 最終更新: 2025年1月（活発に開発中）
- ライセンス: MIT License
- トピックス: リアルタイムメディアサーバー、RTSP、WebRTC、HLS、RTMP、SRT

## 概要
### 一言で言うと
MediaMTXは、ゼロ依存で動作するリアルタイムメディアサーバーで、あらゆるストリーミングプロトコル間の変換とルーティングを行う「メディアルーター」です。

### 詳細説明
MediaMTX（旧rtsp-simple-server）は、Go言語で書かれたリアルタイムメディアサーバーで、単一の実行ファイルで動作し、外部依存関係がありません。様々なプロトコル（SRT、WebRTC、RTSP、RTMP、HLS、UDP/MPEG-TS）をサポートし、それらの間でシームレスな変換を行います。IPカメラのプロキシ、ライブストリーミングサーバー、セキュリティカメラの録画システムなど、幅広い用途に使用できます。

### 主な特徴
- ゼロ依存（単一の実行ファイル）
- マルチプロトコルサポート（SRT、WebRTC、RTSP、RTMP、HLS、UDP/MPEG-TS）
- 自動プロトコル変換
- ストリーム録画機能（fMP4、MPEG-TS形式）
- 再生サーバー機能
- 認証システム（内部、HTTP、JWT）
- コントロールAPI（RESTful）
- Prometheusメトリクス
- ホットリロード対応
- フックシステム（イベント駆動）
- Raspberry Piカメラ直接サポート

## 使用方法
### インストール
#### 前提条件
- 実行ファイルは全ての依存関係を含む（Go 1.24.0でビルド済み）
- 主要ポート:
  - RTSP: 8554 (TCP/UDP)
  - RTMP: 1935 (TCP)
  - HLS: 8888 (HTTP)
  - WebRTC: 8889 (HTTP/UDP)
  - SRT: 8890 (UDP)
  - API: 9997 (HTTP)

#### インストール手順
```bash
# 方法1: バイナリダウンロード
# Linux/macOS
wget https://github.com/bluenviron/mediamtx/releases/latest/download/mediamtx_v1.11.0_linux_amd64.tar.gz
tar -xzf mediamtx_v1.11.0_linux_amd64.tar.gz
./mediamtx

# Windows
# GitHub Releasesからzipファイルをダウンロードして展開

# 方法2: Docker
docker run --rm -it --network=host bluenviron/mediamtx:latest

# 方法3: Docker（ポートマッピング）
docker run --rm -it \
  -e MTX_PROTOCOLS=tcp \
  -p 8554:8554 \
  -p 1935:1935 \
  -p 8888:8888 \
  -p 8889:8889 \
  -p 8890:8890/udp \
  bluenviron/mediamtx:latest
```

### 基本的な使い方
#### Hello World相当の例（ストリームの公開と受信）
```bash
# MediaMTXを起動
./mediamtx

# 別のターミナルでFFmpegを使ってストリームを公開
ffmpeg -re -stream_loop -1 -i sample.mp4 -c copy -f rtsp rtsp://localhost:8554/mystream

# さらに別のターミナルでVLCで再生
vlc rtsp://localhost:8554/mystream

# またはブラウザでHLSで視聴
# http://localhost:8888/mystream/index.m3u8
```

#### 実践的な使用例（Webカメラのストリーミング）
```bash
# mediamtx.ymlに以下を設定
paths:
  webcam:
    # Linux
    runOnInit: ffmpeg -f v4l2 -i /dev/video0 -c:v libx264 -pix_fmt yuv420p -preset ultrafast -b:v 600k -f rtsp rtsp://localhost:8554/webcam
    # Windows
    # runOnInit: ffmpeg -f dshow -i video="USB2.0 HD UVC WebCam" -c:v libx264 -pix_fmt yuv420p -preset ultrafast -b:v 600k -f rtsp rtsp://localhost:8554/webcam
    runOnInitRestart: yes

# MediaMTXを起動すると自動的にWebカメラのストリーミングが開始

# WebRTCでブラウザから直接視聴
# http://localhost:8889/webcam
```

### 高度な使い方
```yaml
# 複数のIPカメラを統合して配信する設定
paths:
  # IPカメラからの取得
  cam1:
    source: rtsp://admin:password@192.168.1.100/stream
    sourceProtocol: tcp
    sourceOnDemand: yes
    sourceOnDemandStartTimeout: 10s
    sourceOnDemandCloseAfter: 10s
  
  cam2:
    source: rtsp://admin:password@192.168.1.101/stream
    sourceProtocol: tcp
  
  # 合成ストリームの作成
  mosaic:
    runOnDemand: >
      ffmpeg -i rtsp://localhost:8554/cam1 -i rtsp://localhost:8554/cam2 
      -filter_complex "[0:v]scale=640:360[v0];[1:v]scale=640:360[v1];
      [v0][v1]hstack=inputs=2[v]" 
      -map "[v]" -c:v libx264 -preset ultrafast -b:v 2M 
      -f rtsp rtsp://localhost:8554/mosaic
    runOnDemandRestart: yes

# アクセス制御と記録
authInternalUsers:
  - user: admin
    pass: admin123
    permissions:
      - action: read
      - action: publish
      - action: api
  
  - user: viewer
    pass: viewer123
    permissions:
      - action: read
        path: cam*

pathDefaults:
  # 全てのストリームを記録
  record: yes
  recordPath: ./recordings/%path/%Y-%m-%d_%H-%M-%S-%f
  recordFormat: fmp4
  recordSegmentDuration: 1h
  recordDeleteAfter: 24h
  
  # フックでWebhook通知
  runOnReady: curl -X POST http://webhook.example.com/stream-ready -d "path=$MTX_PATH"
  runOnNotReady: curl -X POST http://webhook.example.com/stream-stopped -d "path=$MTX_PATH"

# APIとメトリクスを有効化
api: yes
metrics: yes
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、対応プロトコル、インストール方法、使用例
- **mediamtx.yml**: デフォルト設定ファイル（詳細なコメント付き）
- **apidocs/openapi.yaml**: OpenAPI仕様の完全なAPIドキュメント
- **Wiki**: https://github.com/bluenviron/mediamtx のREADMEが最も充実

### サンプル・デモ
- **docker/ディレクトリ**: 各種Dockerイメージの構成ファイル
- **README内の使用例**: FFmpeg、GStreamer、OBS Studioなどでの使用例

### チュートリアル・ガイド
- 各プロトコルごとの詳細な使用手順（README内）
- Dockerでの各種デプロイ方法
- Raspberry Piカメラの統合方法
- 認証とセキュリティの設定方法

## 技術的詳細
### アーキテクチャ
#### 全体構造
MediaMTXは「メディアルーター」として設計され、異なるプロトコル間でメディアストリームをルーティングします。モジュラーアーキテクチャを採用し、各プロトコルは独立したサーバーとして実装され、コアシステムがそれらを統合します。

#### ディレクトリ構成
```
mediamtx/
├── internal/
│   ├── core/             # コアサーバーロジック、パス管理
│   │   ├── core.go      # メインサーバー実装
│   │   ├── path.go      # ストリームパス管理
│   │   └── path_manager.go  # パスマネージャー
│   ├── servers/          # プロトコル別サーバー実装
│   │   ├── rtsp/        # RTSPサーバー
│   │   ├── rtmp/        # RTMPサーバー
│   │   ├── hls/         # HLSサーバー
│   │   ├── webrtc/      # WebRTCサーバー
│   │   └── srt/         # SRTサーバー
│   ├── formatprocessor/  # コーデック別処理
│   │   ├── h264.go      # H.264処理
│   │   ├── h265.go      # H.265処理
│   │   └── av1.go       # AV1処理
│   ├── api/             # コントロールAPI
│   ├── auth/            # 認証システム
│   ├── recorder/        # 録画機能
│   └── playback/        # 再生サーバー
├── apidocs/             # OpenAPIドキュメント
├── docker/              # Dockerイメージ定義
└── scripts/             # ビルド・テストスクリプト
```

#### 主要コンポーネント
- **Core**: メインサーバーロジック
  - 場所: `internal/core/core.go`
  - 役割: 各プロトコルサーバーの統合管理、設定読み込み
  - 主要メソッド: Start(), Stop(), Reload()

- **PathManager**: ストリームパス管理
  - 場所: `internal/core/path_manager.go`
  - 役割: ストリームパスのルーティング、ソースとリーダーの管理
  - 主要機能: オンデマンド起動、アクセス制御

- **RTSPServer**: RTSPプロトコルサーバー
  - 場所: `internal/servers/rtsp/`
  - 役割: RTSP/RTSPSプロトコルの実装
  - 依存: gortsplib（RTSPライブラリ）

- **WebRTCServer**: WebRTCサーバー
  - 場所: `internal/servers/webrtc/`
  - 役割: WHIP/WHEPプロトコルの実装
  - 依存: pion/webrtc

- **FormatProcessor**: コーデック処理
  - 場所: `internal/formatprocessor/`
  - 役割: 各種コーデックのパケット解析、RTPパッケタイジング

### 技術スタック
#### コア技術
- **言語**: Go 1.24.0（ゴルーチン、チャネルを活用した並行処理）
- **フレームワーク**: 
  - gin-gonic/gin: HTTPサーバー（API、HLS、WebRTC）
  - bluenviron/gortsplib: RTSPプロトコル実装
  - bluenviron/gohlslib: HLSプロトコル実装

- **主要ライブラリ**: 
  - pion/webrtc (v4): WebRTC実装
  - datarhei/gosrt: SRTプロトコル
  - notedit/rtmp: RTMPプロトコル
  - fsnotify/fsnotify: 設定ファイル監視
  - stretchr/testify: テストフレームワーク

#### 開発・運用ツール
- **ビルドツール**: 
  - Make（クロスコンパイル対応）
  - Dockerベースのビルドシステム
  - マルチアーキテクチャ対応（amd64、arm64、armv7、armv6）

- **テスト**: 
  - 単体テスト、統合テスト、E2Eテスト
  - Fuzzingテスト（セキュリティ重要コンポーネント）
  - golangci-lintによるコード品質チェック

- **CI/CD**: GitHub Actions
- **デプロイ**: Docker Hubへの自動デプロイ

### 設計パターン・手法
- **パブリッシャー・サブスクライバー**: ストリームの公開者と購読者の分離
- **アダプター**: プロトコル間の変換器として機能
- **シングルトン**: 各サーバーインスタンス
- **ファクトリー**: FormatProcessorの生成
- **オブザーバー**: フックシステムによるイベント通知

### データフロー・処理フロー
1. **ストリーム公開フロー**
   - クライアントがプロトコルサーバーに接続
   - 認証チェック（必要な場合）
   - PathManagerがパスを作成または検索
   - ストリームデータの受信開始
   - runOnReadyフックの実行

2. **ストリーム受信フロー**
   - クライアントがプロトコルサーバーに接続
   - 認証チェック
   - PathManagerがソースを検索
   - オンデマンド起動（必要な場合）
   - プロトコル変換（必要な場合）
   - ストリームデータの配信

3. **プロトコル変換フロー**
   - FormatProcessorがメディアフォーマットを解析
   - ターゲットプロトコルに合わせて再パッケージング
   - 必要に応じてトランスコード（例：HLSのセグメント化）

## API・インターフェース
### 公開API
#### Control API (v3)
- 目的: サーバー制御、パス管理、モニタリング
- 使用例:
```bash
# パス一覧取得
curl http://127.0.0.1:9997/v3/paths/list

# 特定パスの情報取得
curl http://127.0.0.1:9997/v3/paths/get/mystream

# 新規パス追加
curl -X POST http://127.0.0.1:9997/v3/config/paths/add/newpath \
  -H "Content-Type: application/json" \
  -d '{"source": "rtsp://camera.local/stream"}'

# RTSPセッション一覧
curl http://127.0.0.1:9997/v3/rtspsessions/list

# WebRTCセッションキック
curl -X POST http://127.0.0.1:9997/v3/webrtcsessions/kick/sessionid
```

### 設定・カスタマイズ
#### 設定ファイル
```yaml
# mediamtx.yml

# グローバル設定
logLevel: debug
logDestinations: [stdout, file]
logFile: mediamtx.log

# API設定
api: yes
apiAddress: :9997

# メトリクス
metrics: yes
metricsAddress: :9998

# プロトコル固有設定
rtspAddress: :8554
rtspEncryption: "no"  # "no", "strict", "optional"
rtspsAddress: :8322
rtspAuthMethods: [basic, digest]

# パスのデフォルト設定
pathDefaults:
  source: publisher
  sourceOnDemand: no
  sourceOnDemandStartTimeout: 10s
  sourceOnDemandCloseAfter: 10s
  record: no
  recordPath: ./recordings/%path/%Y-%m-%d_%H-%M-%S-%f
  recordFormat: fmp4
  recordSegmentDuration: 1h
  recordDeleteAfter: 24h

# パス別設定
paths:
  webcam:
    source: rpiCamera
    rpiCameraWidth: 1920
    rpiCameraHeight: 1080
```

#### 拡張・カスタマイズ
- **フックシステム**: 外部コマンド実行による拡張
  - runOnConnect/runOnDisconnect: 接続時
  - runOnReady/runOnNotReady: ストリーム準備時
  - runOnRead/runOnUnread: 読み取り時
  - runOnRecordSegmentComplete: 録画セグメント完了時
- **オンデマンド起動**: runOnDemandで任意のコマンドを実行
- **環境変数**: MTX_プレフィックスで設定を上書き

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ゼロコピーパススルー（プロトコル変換時を除く）
- 低レイテンシ：1フレーム未満の遅延
- 最適化手法:
  - Goのゴルーチンによる効率的な並行処理
  - UDP優先のトランスポート
  - メモリプールの活用
  - 書き込みキューサイズの調整可能

### スケーラビリティ
- ストリーム数: 数千の同時ストリームをサポート
- クライアント数: ストリームあたり数百のクライアント
- 水平スケーリング: ロードバランサーを使用した負荷分散
- マルチプロトコル対応による柔軟性

### 制限事項
- トランスコード時のCPU使用率が高くなる
- サポートされるコーデックはプロトコルごとに異なる
- WebRTCのNATトラバーサルはSTUN/TURNサーバーに依存
- 大量のストリームではメモリ使用量が増加

## 評価・所感
### 技術的評価
#### 強み
- ゼロ依存で単一バイナリで動作
- 幅広いプロトコルサポート（SRT、WebRTC、RTSP、RTMP、HLS）
- 自動プロトコル変換機能
- 詳細な設定オプションと柔軟なフックシステム
- ホットリロードによるダウンタイムなしの設定変更
- 完全なRESTful APIによるプログラマティック制御

#### 改善の余地
- トランスコーディングのサポートが限定的
- クラスタリング機能の不足
- 管理UIがない（APIのみ）
- コーデックサポートの一部不完全さ

### 向いている用途
- IPカメラのプロキシ・集約
- ライブストリーミングサーバー
- セキュリティカメラの録画システム
- プロトコル変換ゲートウェイ
- エッジサーバーでのメディア配信

### 向いていない用途
- 高度なビデオ編集が必要な用途
- エンタープライズ級の管理機能が必要な場合
- トランスコーディングが必須の用途
- DRMや高度なコンテンツ保護が必要な場合

### 総評
MediaMTXは、シンプルさと強力な機能を兼ね備えた優れたリアルタイムメディアサーバーです。ゼロ依存で動作し、幅広いプロトコルをサポートし、それらの間でシームレスな変換を行うことができる点が最大の強みです。特にIPカメラのプロキシ、ライブストリーミング、セキュリティカメラの録画などの用途に最適です。活発な開発が続いており、今後も機能拡張が期待できます。エンタープライズ環境での利用から個人のホームラボまで、幅広いシナリオで活用できるツールです。