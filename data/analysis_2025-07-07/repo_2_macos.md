# リポジトリ解析: dockur/macos

## 基本情報
- リポジトリ名: dockur/macos
- 主要言語: Shell
- スター数: 14,561
- フォーク数: 597
- 最終更新: 活発に更新中（2024年）
- ライセンス: MIT License
- トピックス: docker, macos, qemu, kvm, virtualization, hackintosh, osx-kvm, opencore

## 概要
### 一言で言うと
DockerコンテナでmacOSを実行できるようにするプロジェクトで、QEMU/KVMによる仮想化とWebベースのアクセスを提供します。

### 詳細説明
dockur/macosは、Linux上でDockerコンテナ内でmacOSを動作させることを可能にする革新的なプロジェクトです。QEMU/KVM仮想化技術とOpenCoreブートローダーを組み合わせることで、非Appleハードウェア上でmacOSを実行します。AppleのInternet Recoveryサービスから公式のmacOSリカバリイメージを自動的にダウンロードし、Web VNC経由でアクセス可能な完全なmacOS環境を提供します。教育・開発・テスト目的での使用を想定しています。

### 主な特徴
- macOS 11（Big Sur）から15（Sequoia）までの幅広いバージョンサポート
- 自動的な公式macOSリカバリイメージのダウンロード
- WebベースのVNCアクセス（noVNC）による簡単な操作
- Docker ComposeおよびKubernetesでのデプロイメントサポート
- ユニークなハードウェアIDの自動生成（シリアル番号、UUID、MACアドレス）
- KVMハードウェアアクセラレーションによる高速化
- ファイル共有、USBパススルー、ディスクパススルーなどの高度な機能
- 設定可能なCPUコア数、RAM容量、ディスクサイズ
- OpenCore 1.0.4を使用した安定したブート環境

## 使用方法
### インストール
#### 前提条件
- KVMサポート付きLinuxホスト（Intel VT-xまたはAMD SVM）
- Docker または Podman がインストール済み
- `/dev/kvm` デバイスへのアクセス権限
- `NET_ADMIN` capability（ネットワーキング用）

#### インストール手順
```bash
# 方法1: Docker Compose（推奨）
# compose.ymlファイルを作成
cat << 'EOF' > compose.yml
services:
  macos:
    image: dockurr/macos
    container_name: macos
    environment:
      VERSION: "13"  # macOSバージョン（11-15）
    devices:
      - /dev/kvm
      - /dev/net/tun
    cap_add:
      - NET_ADMIN
    ports:
      - 8006:8006
      - 5900:5900/tcp
      - 5900:5900/udp
    volumes:
      - ./macos:/storage
    restart: always
    stop_grace_period: 2m
EOF

# 起動
docker compose up -d

# 方法2: Docker CLI
docker run -it --rm \
  --name macos \
  -p 8006:8006 \
  --device=/dev/kvm \
  --device=/dev/net/tun \
  --cap-add NET_ADMIN \
  -v "${PWD:-.}/macos:/storage" \
  --stop-timeout 120 \
  dockurr/macos
```

### 基本的な使い方
#### Hello World相当の例
```bash
# 最小限の起動（macOS 13 Ventura、デフォルト設定）
docker run -it --rm -p 8006:8006 --device=/dev/kvm --cap-add NET_ADMIN dockurr/macos

# ブラウザで http://localhost:8006 にアクセス
# 画面の指示に従ってmacOSをインストール
```

#### 実践的な使用例
```yaml
# compose.yml - カスタマイズ設定での起動
services:
  macos:
    image: dockurr/macos
    container_name: macos
    environment:
      VERSION: "14"        # macOS Sonoma
      RAM_SIZE: "8G"       # 8GB RAM
      CPU_CORES: "4"       # 4 CPUコア
      DISK_SIZE: "256G"    # 256GB ディスク
      DHCP: "Y"            # DHCPパススルー有効
    devices:
      - /dev/kvm
      - /dev/net/tun
    cap_add:
      - NET_ADMIN
    ports:
      - 8006:8006
      - 5900:5900/tcp
      - 5900:5900/udp
    volumes:
      - ./macos:/storage
      - ./shared:/shared   # ホストとのファイル共有
    restart: unless-stopped
```

### 高度な使い方
```bash
# USBデバイスのパススルー例
docker run -it --rm \
  --name macos \
  -p 8006:8006 \
  --device=/dev/kvm \
  --device=/dev/net/tun \
  --device=/dev/bus/usb/001/002 \  # USBデバイス
  --cap-add NET_ADMIN \
  -e ARGUMENTS="-device usb-host,vendorid=0x1234,productid=0x5678" \
  -v "${PWD}/macos:/storage" \
  dockurr/macos

# 物理ディスクのパススルー例
docker run -it --rm \
  --name macos \
  -p 8006:8006 \
  --device=/dev/kvm \
  --device=/dev/net/tun \
  --device=/dev/sdb \  # 物理ディスク
  --cap-add NET_ADMIN \
  -e DISK2_SIZE="/dev/sdb" \
  -v "${PWD}/macos:/storage" \
  dockurr/macos
```

## ドキュメント・リソース
### 公式ドキュメント
- **readme.md**: プロジェクトの概要、インストール手順、設定オプション、FAQ
- **license.md**: MITライセンスの詳細
- **Dockerfile**: マルチステージビルドの定義と依存関係

### サンプル・デモ
- **compose.yml**: Docker Compose設定の例
- **kubernetes.yml**: Kubernetes展開用のマニフェスト

### チュートリアル・ガイド
- READMEに含まれる初期設定ガイド
- macOSインストール手順（Disk Utility使用方法含む）
- トラブルシューティングガイド（FAQ形式）

## 技術的詳細
### アーキテクチャ
#### 全体構造
dockur/macosは、QEMU/KVM仮想化層の上にOpenCoreブートローダーを組み合わせ、Dockerコンテナ内でmacOSを実行する多層アーキテクチャを採用しています。ベースイメージは`qemux/qemu:7.12`を使用し、OSX-KVMプロジェクトからUEFIファームウェア（OVMF）を、KVM-OpencoreプロジェクトからOpenCore ISOを取得しています。

#### ディレクトリ構成
```
dockur/macos/
├── src/                    # コアスクリプト
│   ├── entry.sh           # メインエントリーポイント
│   ├── install.sh         # macOSダウンロード・セットアップ
│   └── boot.sh            # ブートプロセス管理
├── assets/                # 設定ファイル
│   └── config.plist       # OpenCore設定テンプレート
├── compose.yml            # Docker Compose設定例
├── kubernetes.yml         # Kubernetes設定
├── Dockerfile             # コンテナビルド定義
├── readme.md              # プロジェクトドキュメント
└── license.md             # ライセンス情報
```

#### 主要コンポーネント
- **entry.sh**: Dockerエントリーポイント
  - 場所: `src/entry.sh`
  - 責務: 環境変数の処理、初期化、他のスクリプトの呼び出し
  - 主要機能: ディスク作成、ネットワーク設定、QEMU起動

- **install.sh**: macOSインストーラー管理
  - 場所: `src/install.sh`
  - 責務: macOSリカバリイメージのダウンロード、ハードウェアID生成
  - インターフェース: `downloadImage()`, `generateSerial()`, `generateMAC()`

- **boot.sh**: ブートプロセス管理
  - 場所: `src/boot.sh`
  - 責務: OpenCore設定、UEFIブート、QEMU引数構築
  - 主要機能: config.plist生成、ブートオプション設定

### 技術スタック
#### コア技術
- **仮想化**: QEMU 7.12 + KVM（ハードウェアアクセラレーション）
- **ブートローダー**: OpenCore 1.0.4（Hackintosh用ブートローダー）
- **ファームウェア**: OVMF（UEFIファームウェア実装）
- **主要ツール**: 
  - macserial: シリアル番号生成ユーティリティ
  - noVNC: WebベースのVNCクライアント
  - websockify: WebSocketからTCPへのプロキシ

#### 開発・運用ツール
- **ベースイメージ**: qemux/qemu:7.12（QEMU仮想化環境）
- **マルチステージビルド**: 効率的なDockerイメージ構築
- **設定管理**: 環境変数による動的設定
- **ネットワーク**: virtio-net（高速仮想ネットワーク）

### 設計パターン・手法
- **Template Pattern**: config.plist生成での動的値の置換
- **Builder Pattern**: QEMU起動引数の段階的構築
- **Facade Pattern**: 複雑な仮想化設定の簡略化されたインターフェース
- **環境変数駆動設定**: 12-Factor App原則に従った設定管理

### データフロー・処理フロー
1. **初期化フェーズ**
   - コンテナ起動時にentry.shが実行される
   - 環境変数の解析と検証
   - ストレージディレクトリの準備

2. **ダウンロードフェーズ**
   - macOSバージョンに応じたボードIDの選択
   - AppleのInternet Recoveryからイメージダウンロード
   - BaseSystemイメージの抽出と準備

3. **設定生成フェーズ**
   - ユニークなハードウェアIDの生成（シリアル、UUID、MAC）
   - OpenCore config.plistの動的生成
   - QEMU起動引数の構築

4. **ブートフェーズ**
   - OVMF UEFIファームウェアの起動
   - OpenCoreブートローダーの実行
   - macOSインストーラーまたはOSの起動

## API・インターフェース
### 公開API
#### Web VNCインターフェース
- 目的: ブラウザからmacOSデスクトップへのアクセス
- URL: http://localhost:8006
- 使用例:
```bash
# コンテナ起動後、ブラウザでアクセス
open http://localhost:8006
```

#### VNC直接接続
- 目的: VNCクライアントからの直接接続
- ポート: 5900/tcp, 5900/udp
- 使用例:
```bash
# VNCクライアントで接続
vncviewer localhost:5900
```

### 設定・カスタマイズ
#### 設定ファイル
```bash
# 環境変数による主要設定項目
VERSION="14"          # macOSバージョン（11-15）
RAM_SIZE="8G"         # RAM容量（例: 4G, 8G, 16G）
CPU_CORES="4"         # CPUコア数（1-64）
DISK_SIZE="256G"      # ディスクサイズ
DHCP="Y"              # DHCPパススルー（Y/N）
DEVICE_MODEL="iMacPro1,1"  # デバイスモデル
SERIAL="changeme"     # カスタムシリアル番号
UUID="changeme"       # カスタムUUID
MAC_ADDRESS="changeme" # カスタムMACアドレス
```

#### 拡張・プラグイン開発
カスタムQEMU引数の追加:
```bash
# ARGUMENTS環境変数で追加のQEMU引数を指定
ARGUMENTS="-device usb-tablet -device usb-kbd"
```

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- KVMハードウェアアクセラレーションによる準ネイティブ性能
- virtio-netによる高速ネットワーク通信
- 9pファイルシステムによる効率的なファイル共有
- noVNCによる低遅延のリモートアクセス

### スケーラビリティ
- 最大64 CPUコアまでの割り当て可能
- RAM容量はホストシステムの制限内で自由に設定
- 複数インスタンスの同時実行（ポート番号の調整必要）
- Kubernetesでのオーケストレーション対応

### 制限事項
- Appleハードウェアでの使用が法的に必要（Apple EULA）
- Windows 10、macOSホスト、多くのクラウドVPSでは動作不可
- macOS 15（Sequoia）ではApple IDサインインが未サポート
- グラフィックスアクセラレーションは限定的

## 評価・所感
### 技術的評価
#### 強み
- 簡単なDockerコマンドでmacOS環境を構築可能
- 公式macOSイメージの自動ダウンロードによる信頼性
- Webベースのアクセスによる利便性
- 豊富な設定オプションと柔軟なカスタマイズ性
- 活発な開発とコミュニティサポート（14,000+スター）

#### 改善の余地
- グラフィックスアクセラレーションの制限
- Apple IDサインインの制限（最新版）
- ホストOS・ハードウェアの制約

### 向いている用途
- macOSアプリケーションの開発・テスト
- CI/CDパイプラインでのmacOSビルド環境
- クロスプラットフォーム開発での互換性テスト
- 教育・学習目的でのmacOS環境体験

### 向いていない用途
- 商用利用（Apple EULAの制限）
- グラフィックス集約的なアプリケーション
- 実機レベルのパフォーマンスが必要な用途
- Apple IDに依存するサービスの利用

### 総評
dockur/macosは、技術的に洗練されたmacOS仮想化ソリューションを提供する画期的なプロジェクトです。Dockerの利便性とQEMU/KVMの強力な仮想化機能を組み合わせることで、開発者やテスターにとって貴重なツールとなっています。法的制約には注意が必要ですが、適切な用途で使用すれば、macOS開発環境の構築と管理を大幅に簡素化できる優れたソリューションです。