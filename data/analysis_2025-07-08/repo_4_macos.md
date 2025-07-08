# リポジトリ解析: dockur/macos

## 基本情報
- リポジトリ名: dockur/macos
- 主要言語: Shell (Bash) / Dockerfile
- スター数: 7,723
- フォーク数: 400+
- 最終更新: 2025-05-06
- ライセンス: MIT License
- トピックス: Docker、macOS、仮想化、QEMU、KVM

## 概要
### 一言で言うと
Dockerコンテナ内でmacOSを実行できるようにするソリューションで、ハードウェアアクセラレーションとWebベースアクセスを提供する。

### 詳細説明
このプロジェクトは、QEMU/KVM仮想化技術を使用してmacOS仮想マシンを実行するためのコンテナ化されたソリューションを提供します。開発、テスト、互換性の目的でmacOSを仮想環境で実行したい開発者やユーザーのニーズに対応しています。このソリューションは、OpenCoreブートローダーを活用し、AppleのサーバーからmacOSリカバリイメージを自動ダウンロードします。

解決する問題：
- Dockerを使用してmacOS仮想化のセットアップを簡素化
- インストールと設定の自動化
- noVNC経由でのWebベースアクセスの提供
- 複数のmacOSバージョン（11-15）のサポート
- より良いパフォーマンスのためのKVMアクセラレーションの有効化

### 主な特徴
- **KVMハードウェアアクセラレーション**: ネイティブに近いパフォーマンスを実現
- **Webベースビューア**: ポート8006でWebブラウザ経由でmacOSにアクセス
- **自動ダウンロード**: AppleサーバーからmacOSリカバリイメージを自動ダウンロード
- **複数macOSバージョン**: macOS 11 (Big Sur)からmacOS 15 (Sequoia)までサポート
- **カスタマイズ可能なリソース**: CPUコア、RAMサイズ、ディスクスペースの設定
- **ネットワーク構成**: 個別IPアドレスのためのブリッジネットワーキングとmacvlanサポート
- **USBパススルー**: USBデバイスをmacOS VMに渡す機能
- **ディスクパススルー**: 直接ディスクデバイスパススルー機能
- **ファイル共有**: ホストとmacOS間の9Pファイルシステム共有
- **VNCアクセス**: ポート5900でのリモートデスクトップアクセス
- **永続ストレージ**: コンテナ再起動後もmacOSインストールを維持
- **Kubernetesサポート**: Kubernetes環境へのデプロイ構成

## 使用方法
### インストール
#### 前提条件
- **ホストOS**: KVMサポート付きLinux（Intel VT-xまたはAMD SVM有効）
- **Docker**: Docker CLIまたはDocker Desktop（Windows 11サポート）
- **Podman**: Dockerの代替（LinuxおよびWindows 11でサポート）
- **ハードウェア**: 
  - 最小4GB RAM（8GB推奨）
  - 64GB以上の空きディスクスペース
  - 仮想化拡張機能が有効なCPU
- **カーネルモジュール**: `/dev/kvm`および`/dev/net/tun`デバイスが利用可能
- **権限**: コンテナに`NET_ADMIN`権限が必要

#### インストール手順
1. **Docker Compose** （推奨）:
   - 提供された設定で`compose.yml`ファイルを作成
   - 実行: `docker compose up -d`

2. **Docker CLI**:
   ```bash
   docker run -it --rm --name macos -p 8006:8006 \
     --device=/dev/kvm --device=/dev/net/tun \
     --cap-add NET_ADMIN \
     -v "${PWD:-.}/macos:/storage" \
     --stop-timeout 120 \
     dockurr/macos
   ```

3. **Kubernetes**:
   ```bash
   kubectl apply -f https://raw.githubusercontent.com/dockur/macos/refs/heads/master/kubernetes.yml
   ```

4. **GitHub Codespaces**: GitHub Codespacesボタン経由での直接デプロイ

### 基本的な使い方
#### 最小限の使用例
```yaml
services:
  macos:
    image: dockurr/macos
    container_name: macos
    environment:
      VERSION: "13"
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
```

起動後：
1. http://localhost:8006 に接続
2. ディスクユーティリティを使用して最大のVirtIOディスクをAPFSにフォーマット
3. 「macOSを再インストール」で進む
4. インストール用にフォーマットしたディスクを選択

#### 実践的な使用例
**リソースを増やしてmacOS 14 (Sonoma)を実行**:
```yaml
environment:
  VERSION: "14"
  RAM_SIZE: "8G"
  CPU_CORES: "4"
  DISK_SIZE: "128G"
```

**専用IP用のmacvlan使用**:
```bash
# macvlanネットワーク作成
docker network create -d macvlan \
  --subnet=192.168.0.0/24 \
  --gateway=192.168.0.1 \
  --ip-range=192.168.0.100/28 \
  -o parent=eth0 vlan

# 専用IPでコンテナ設定
services:
  macos:
    networks:
      vlan:
        ipv4_address: 192.168.0.100
```

### 高度な使い方
**USBデバイスパススルー**:
```yaml
environment:
  ARGUMENTS: "-device usb-host,vendorid=0x1234,productid=0x5678"
devices:
  - /dev/bus/usb
```

**ディスクパススルー**:
```yaml
devices:
  - /dev/sdb:/disk1    # メインドライブ
  - /dev/sdc1:/disk2   # セカンダリドライブ
```

**ホストとのファイル共有**:
```yaml
volumes:
  - ./shared:/shared
# macOS内: sudo -S mount_9p shared
```

**ルータIP用のDHCP設定**:
```yaml
environment:
  DHCP: "Y"
devices:
  - /dev/vhost-net
device_cgroup_rules:
  - 'c *:* rwm'
```

## ドキュメント・リソース
### 公式ドキュメント
- **readme.md**: 包括的なドキュメント
  - インストール手順
  - 設定オプション
  - 一般的なシナリオのFAQセクション
  - トラブルシューティングガイド
  - 法的免責事項
- **license.md**: MITライセンス条項

### 設定ファイル
- **compose.yml**: Docker Composeサンプル設定
- **kubernetes.yml**: Kubernetesデプロイマニフェスト
- **assets/config.plist**: OpenCoreブートローダー設定テンプレート

### チュートリアル・ガイド
- README内のFAQセクションが主要な学習リソース
- 具体的な使用例とトラブルシューティングが含まれる

## 技術的詳細
### アーキテクチャ
#### 全体構造
マルチレイヤーアーキテクチャを使用：
1. **コンテナレイヤー**: Alpine LinuxベースにQEMUランタイム
2. **仮想化レイヤー**: KVMアクセラレーション付きQEMU
3. **ブートレイヤー**: macOS互換性のためのOpenCoreブートローダー
4. **ゲストOSレイヤー**: 仮想マシンとして実行されるmacOS

#### ディレクトリ構成
```
/home/alma/auto-web/analysis_2025-07-08/macos/
├── Dockerfile          # マルチステージビルド設定
├── assets/            
│   └── config.plist   # OpenCore設定テンプレート
├── compose.yml        # Docker Compose設定
├── kubernetes.yml     # Kubernetesデプロイマニフェスト
├── license.md         # MITライセンス
├── readme.md          # プロジェクトドキュメント
└── src/               # コアスクリプト
    ├── boot.sh        # ブート設定スクリプト
    ├── entry.sh       # コンテナエントリポイント
    └── install.sh     # macOSインストールハンドラ
```

#### 主要コンポーネント
1. **entry.sh**: VM起動をオーケストレーションするメインエントリポイント
2. **install.sh**: macOSリカバリイメージのダウンロードとシリアル番号生成を処理
3. **boot.sh**: UEFI/OVMFブート、OpenCore、CPU設定を設定
4. **QEMU**: ハードウェア仮想化を提供
5. **OpenCore**: 非AppleハードウェアでmacOSを可能にするEFIブートローダー
6. **noVNC**: ブラウザアクセス用のWebベースVNCクライアント

### 技術スタック
#### コア技術
- **ベースイメージ**: Alpine Linux 3.21（ビルダー）、QEMU 7.12（ランナー）
- **仮想化**: QEMU-KVM
- **ブートローダー**: KVMパッチ付きOpenCore v21
- **UEFI**: OVMF（Open Virtual Machine Firmware）
- **言語**: Bashスクリプティング、Dockerfile
- **ツール**: 
  - macserial（シリアル番号生成）
  - mtools（FATファイルシステムユーティリティ）
  - fdisk（ディスクパーティショニング）
  - wget（リカバリイメージダウンロード）

#### 開発・運用ツール
- **ビルドシステム**: Dockerマルチステージビルド
- **バージョン管理**: Git
- **CI/CD**: GitHub Actions（自動依存関係更新）
- **コンテナレジストリ**: Docker Hub、GitHub Container Registry

### 設計パターン・手法
- **マルチステージDockerビルド**: ビルドとランタイム環境を分離
- **スクリプトモジュール化**: 異なる関心事項用の別々のスクリプト
- **環境ベースの設定**: 環境変数の幅広い使用
- **テンプレートベースの設定**: 動的OpenCore設定生成

### データフロー・処理フロー
1. コンテナ起動 → entry.sh実行
2. システム初期化（reset.sh）
3. macOSリカバリイメージのダウンロード/検証（install.sh）
4. ディスク初期化（disk.sh）
5. ディスプレイ設定（display.sh）
6. ネットワークセットアップ（network.sh）
7. OpenCoreでのブート設定（boot.sh）
8. CPU/ハードウェア設定（proc.sh）
9. QEMU引数アセンブリ（config.sh）
10. 設定されたパラメータでQEMU VM起動

## API・インターフェース
### 設定オプション（環境変数）
#### 基本設定
- `VERSION`: macOSバージョン（11-15）
- `RAM_SIZE`: メモリ割り当て（例: "8G"）
- `CPU_CORES`: CPUコア数（1-64）
- `DISK_SIZE`: 仮想ディスクサイズ（例: "256G"）

#### ディスプレイ設定
- `WIDTH`/`HEIGHT`: ディスプレイ解像度

#### ハードウェア識別子
- `MODEL`: Macモデル識別子（デフォルト: "iMacPro1,1"）
- `SN`/`MLB`/`MAC`/`UUID`: ハードウェア識別子（未指定の場合自動生成）

#### ネットワーク設定
- `DHCP`: DHCPネットワーキングを有効化（"Y"）

#### 高度な設定
- `ARGUMENTS`: 追加のQEMU引数
- `SECURE`: セキュアブート設定
- `BOOT_MODE`: ブートモード設定

### ネットワークインターフェース
- **ポート8006**: WebベースnoVNCインターフェース
- **ポート5900**: VNCサーバー（TCP/UDP）

### ボリュームマウント
- `/storage`: macOSインストールとデータの永続ストレージ

### 設定例
```yaml
# Docker Composeでの完全な設定例
services:
  macos:
    image: dockurr/macos
    environment:
      VERSION: "14"        # macOS Sonoma
      RAM_SIZE: "8G"       # 8GB RAM
      CPU_CORES: "4"       # 4 CPUコア
      DISK_SIZE: "256G"    # 256GBディスク
      WIDTH: "1920"        # Full HD解像度
      HEIGHT: "1080"
      MODEL: "MacBookPro15,1"  # 特定のMacモデル
```

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- **KVMアクセラレーション**: ハードウェア仮想化によるネイティブに近いCPUパフォーマンス
- **メモリオーバーヘッド**: 最小限のコンテナオーバーヘッド、ほとんどのRAMをVMに割り当て
- **I/Oパフォーマンス**: 最適化されたディスクとネットワークI/O用のVirtIOドライバー
- **グラフィックス**: 基本的なVGA/VMware SVGAエミュレーション（GPUアクセラレーションなし）

### スケーラビリティ
- **シングルインスタンス**: コンテナごとに単一のmacOSインスタンス用に設計
- **リソーススケーリング**: 環境変数を通じた垂直スケーリング
- **ストレージ拡張**: 動的ディスク拡張サポート
- **ネットワーク分離**: macvlan経由で各インスタンスが専用ネットワークを持てる

### 制限事項
- **ホストOS**: KVMサポート付きLinuxのみ（ネイティブWindows/macOSホストサポートなし）
- **GPUアクセラレーション**: ハードウェアグラフィックスアクセラレーションなし
- **オーディオ**: 限定的なオーディオサポート
- **iCloud/Apple ID**: 機能が限定、特にmacOS 15 (Sequoia)で
- **ネスト化された仮想化**: VM内で実行した場合のパフォーマンス低下
- **CPUアーキテクチャ**: x86_64のみ（ARM/Apple Siliconサポートなし）
- **法的**: EULAに従いAppleハードウェア上で実行する必要がある

## 評価・所感
### 技術的評価
#### 強み
- **簡単なセットアップ**: Dockerコマンド一つでmacOS環境が構築できる
- **自動化されたプロセス**: macOSイメージのダウンロードから設定まで全自動
- **Webアクセシビリティ**: ブラウザ経由でアクセス可能、専用クライアント不要
- **柔軟な設定**: 環境変数で幅広いカスタマイズが可能
- **マルチプラットフォーム対応**: Docker Compose、Kubernetes、Podmanサポート

#### 改善の余地
- **GPUサポート**: グラフィックスアクセラレーションがない
- **オーディオ機能**: 音声サポートが制限的
- **Appleサービス統合**: iCloudやApple ID連携が不完全
- **ドキュメント**: より詳細な技術ドキュメントがあると良い

### 向いている用途
- **macOSアプリケーションの開発/テスト**: CI/CDパイプラインでの自動テスト
- **クロスプラットフォーム開発**: Linux環境でmacOSアプリを開発
- **互換性テスト**: WebアプリケーションのSafariでの動作確認
- **教育/学習目的**: macOS環境の学習やデモンストレーション

### 向いていない用途
- **プロダクション環境**: 性能や安定性の問題
- **グラフィックス集約的アプリ**: GPUアクセラレーションがない
- **Appleエコシステム依存アプリ**: iCloud、Apple Musicなど
- **セキュリティクリティカルな用途**: 仮想化環境のセキュリティ制約

### 総評
dockur/macosは、コンテナ化されたmacOS仮想化ソリューションとして、使いやすさと技術的能力のバランスを巧みに取った優れたプロジェクトです。特に、複雑なmacOS仮想化のセットアップをDockerコマンド一つにまで簡略化した点は革新的です。

Webベースのアクセス、自動化されたインストールプロセス、柔軟な設定オプションなど、開発者のニーズをよく理解した設計が光ります。また、Docker ComposeからKubernetesまで幅広いデプロイ方法に対応している点も、様々な環境での利用を可能にしています。

一方で、GPUアクセラレーションの欠如、Appleサービスとの統合の制限など、技術的な制約も存在します。また、法的にはAppleハードウェア上での実行が要求される点にも注意が必要です。

それでも、開発・テスト環境としての価値は非常に高く、特にCI/CDパイプラインでのmacOSテスト自動化や、クロスプラットフォーム開発においては、非常に役立つツールと言えるでしょう。