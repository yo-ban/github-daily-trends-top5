# リポジトリ解析: rustfs/rustfs

## 基本情報
- リポジトリ名: rustfs/rustfs
- 主要言語: Rust
- スター数: 1,154
- フォーク数: 54
- 最終更新: 2025年7月（アクティブに開発中）
- ライセンス: Apache License 2.0
- トピックス: distributed-storage, object-storage, s3-compatible, rust, high-performance, cloud-native, erasure-coding

## 概要
### 一言で言うと
Rustで構築された高性能分散オブジェクトストレージシステムで、MinIOの代替としてS3互換性を提供しつつApache 2.0ライセンスでビジネスフレンドリーな選択肢を提供する。

### 詳細説明
RustFSは、エンタープライズグレードの分散オブジェクトストレージソリューションで、完全なS3 API互換性を提供します。MinIOのAGPL v3ライセンス問題を回避し、Rustのメモリ安全性とパフォーマンスの利点を活かして、より高速で効率的なストレージシステムを実現しています。SIMD最適化されたイレイジャーコーディング、ゼロコピーI/O、非同期アーキテクチャにより、大規模データセンターやクラウド環境での使用に適しています。

### 主な特徴
- **高性能**: SIMD最適化によるイレイジャーコーディング、ゼロコピーI/O
- **分散アーキテクチャ**: 複数ノードによるスケーラブルな構成
- **S3互換性**: 完全なS3 API互換性
- **データレイクサポート**: Iceberg、Hudi、Delta Lakeとの統合
- **Apache 2.0ライセンス**: ビジネスフレンドリーなライセンス
- **イレイジャーコーディング**: データ保護のためのReed-Solomon符号
- **Webコンソール**: 管理用Web UI（ポート9001）
- **観測性**: OpenTelemetry統合によるメトリクスとトレーシング
- **通知システム**: Webhook、MQTTサポート
- **unsafeコードゼロ**: `unsafe_code = "deny"`による安全性

## 使用方法
### インストール
#### 前提条件
- Rust 1.85以上
- Linux/macOS/Windowsサポート
- Docker/Podman（コンテナ使用の場合）
- 最低1GBの空きディスク容量

#### インストール手順
```bash
# 方法1: ワンクリックインストール
curl -O https://rustfs.com/install_rustfs.sh && bash install_rustfs.sh

# 方法2: Docker/Podman経由
podman run -d -p 9000:9000 -p 9001:9001 -v /data:/data quay.io/rustfs/rustfs

# 方法3: ソースからビルド
git clone https://github.com/rustfs/rustfs.git
cd rustfs
make build
# またはプラットフォーム別スクリプト
./build_rustfs.sh
```

### 基本的な使い方
#### Hello World相当の例
```bash
# RustFSサーバーを起動（シングルノード）
rustfs /data/rustfs --console-enable

# S3 APIを使用してバケット作成
aws --endpoint-url http://localhost:9000 s3 mb s3://my-bucket

# ファイルをアップロード
aws --endpoint-url http://localhost:9000 s3 cp test.txt s3://my-bucket/
```

#### 実践的な使用例
```bash
# 環境変数を使った設定
export RUSTFS_ACCESS_KEY=myadminkey
export RUSTFS_SECRET_KEY=mysecretkey
export RUSTFS_VOLUMES="/data/rustfs{0...3}"
export RUSTFS_ERASURE_SET_DRIVE_COUNT=4

# 4ノードイレイジャーコーディング設定で起動
rustfs \
  --address :9000 \
  --console-enable \
  --console-address :9001 \
  /data/rustfs0 /data/rustfs1 /data/rustfs2 /data/rustfs3
```

```python
# Pythonクライアント例 (boto3)
import boto3

s3 = boto3.client(
    's3',
    endpoint_url='http://localhost:9000',
    aws_access_key_id='rustfsadmin',
    aws_secret_access_key='rustfsadmin'
)

# バケット作成
s3.create_bucket(Bucket='my-data-lake')

# マルチパートアップロード
response = s3.create_multipart_upload(
    Bucket='my-data-lake',
    Key='large-file.bin'
)
# ... パートのアップロード処理 ...
```

### 高度な使い方
```yaml
# docker-compose.ymlでのクラスター構成
version: '3.8'

services:
  rustfs1:
    image: rustfs/rustfs:latest
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      RUSTFS_VOLUMES: "/data1,/data2,/data3,/data4"
      RUSTFS_ACCESS_KEY: ${ACCESS_KEY}
      RUSTFS_SECRET_KEY: ${SECRET_KEY}
      RUSTFS_ERASURE_SET_DRIVE_COUNT: 4
    volumes:
      - rustfs1_data1:/data1
      - rustfs1_data2:/data2
      - rustfs1_data3:/data3
      - rustfs1_data4:/data4
  
  # rustfs2, rustfs3, rustfs4の設定...
```

```rust
// 通知システムのプログラミング例
use rustfs_notify::{BucketNotificationConfig, Event, EventName};

#[tokio::main]
async fn main() -> Result<(), NotificationError> {
    // Webhook通知の設定
    let webhook_config = vec![
        KV { key: "enable".to_string(), value: "on".to_string() },
        KV { key: "endpoint".to_string(), value: "http://localhost:3020/webhook".to_string() },
    ];
    
    // バケット通知ルールの設定
    let mut bucket_config = BucketNotificationConfig::new("us-east-1");
    bucket_config.add_rule(
        &[EventName::ObjectCreatedPut],
        "*.jpg".to_string(),
        TargetID::new("webhook".to_string(), "image-processor".to_string()),
    );
    
    Ok(())
}
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、機能紹介、クイックスタート
- **README_ZH.md**: 中国語版README
- **DEVELOPMENT.md**: コード品質要件、開発ワークフロー、IDE設定
- **docs/docker-build.md**: Dockerイメージのビルド方法
- **公式サイト**: https://rustfs.com
- **ドキュメントサイト**: https://docs.rustfs.com

### サンプル・デモ
- **scripts/run.sh**: ローカル開発環境の起動スクリプト
- **docker-compose.yml**: 4ノードクラスターのデモ設定
- **crates/notify/examples/**: 通知システムの使用例

### チュートリアル・ガイド
- GitHub Discussions: https://github.com/rustfs/rustfs/discussions
- S3 APIリファレンス: AWS S3互換
- ビデオチュートリアル: 公式サイトで提供予定

## 技術的詳細
### アーキテクチャ
#### 全体構造
マイクロカーネルデザインを採用し、コア機能を`ecstore`クレートに集約し、プラグ可能なコンポーネントを周辺に配置。レイヤー構造:

```
┌─────────────────┐
│   S3 API Layer  │ (rustfs/src/storage/ecfs.rs)
└────────┬────────┘
         │
┌────────▼────────┐
│  StorageAPI     │ (ecstore/src/store_api.rs)
└────────┬────────┘
         │
┌────────▼────────┐
│  Erasure Coding │ (ecstore/src/erasure_coding/)
└────────┬────────┘
         │
┌────────▼────────┐
│  Disk Storage   │ (ecstore/src/disk/)
└─────────────────┘
```

#### ディレクトリ構成
```
rustfs/
├── rustfs/           # メインサーバーバイナリ
├── crates/           # コアライブラリコンポーネント
│   ├── ecstore/     # イレイジャーコーディングストレージエンジン
│   ├── iam/         # アイデンティティ・アクセス管理
│   ├── lock/        # 分散ロックメカニズム
│   ├── notify/      # イベント通知システム
│   ├── obs/         # 観測性・モニタリング
│   ├── policy/      # アクセス制御ポリシーエンジン
│   ├── crypto/      # 暗号化操作
│   ├── rio/         # Rust I/Oユーティリティ
│   └── s3select/    # S3 Selectクエリエンジン
├── cli/              # CLIツール
│   └── rustfs-gui/  # DioxusベースGUIクライアント
└── deploy/           # デプロイ設定
```

#### 主要コンポーネント
- **ecstore**: イレイジャーコーディングストレージエンジン
  - 場所: `crates/ecstore/`
  - 依存: reed-solomon-simd、tokio、bytes
  - インターフェース: StorageAPI trait

- **StorageAPI**: ストレージ抽象化インターフェース
  - 場所: `crates/ecstore/src/store_api.rs`
  - メソッド: get_object_reader, put_object, copy_object, delete_object

- **S3サービス実装**: S3互換性層
  - 場所: `rustfs/src/storage/ecfs.rs`
  - 依存: s3sライブラリ
  - 機能: S3プロトコル完全互換

### 技術スタック
#### コア技術
- **言語**: Rust Edition 2024、バージョン1.85
- **フレームワーク**: 
  - Tokio - 非同朜ランタイム
  - Axum/Hyper - HTTPサーバー
  - Tower - ミドルウェアスタック
  - s3s - S3プロトコル実装
- **主要ライブラリ**: 
  - reed-solomon-simd: SIMD最適化イレイジャーコーディング
  - bytes: ゼロコピーバッファ管理
  - opentelemetry: 観測性
  - xxhash-rust, blake3: 高速ハッシュ
  - tonic: gRPC実装
  - serde: シリアライゼーション

#### 開発・運用ツール
- **ビルドツール**: 
  - Cargo（ワークスペース構成）
  - moldリンカー（高速ビルド）
  - Makefile（便利コマンド）
- **テスト**: 
  - 単体テスト: Rust標準テスト
  - E2Eテスト: s3s-e2e
  - ベンチマーク: Criterion.rs
- **CI/CD**: 
  - GitHub Actions（テスト、ビルド、Dockerイメージ）
  - マルチアーキテクチャビルド
  - セキュリティ監査
- **デプロイ**: 
  - Docker/Podmanコンテナ
  - Docker Composeクラスター
  - バイナリ配布

### 設計パターン・手法
1. **Traitベースアーキテクチャ**: StorageAPI、ObjectIO、Locker traitによる抽象化
2. **Async/Awaitパターン**: 完全非同期アーキテクチャ
3. **Builderパターン**: S3ServiceBuilderなどのサービス構築
4. **Observerパターン**: イベント通知システム
5. **Strategyパターン**: ストレージ戦略の切り替え

### データフロー・処理フロー
**PUT操作**:
1. HTTPリクエスト受信 (Hyper/Tower)
2. 認証 (IAMシステム)
3. 認可 (ポリシーエンジン)
4. データ→HashReader→圧縮→イレイジャーコーディング→ディスクストレージ

**GET操作**:
1. ディスクストレージ→イレイジャーデコード→解凍→レスポンスストリーム

## API・インターフェース
### 公開API
#### S3互換REST API
- 目的: S3クライアントとの完全互換性
- サポート操作:
  - オブジェクト: GET, PUT, DELETE, HEAD, POST
  - バケット: Create, List, Delete
  - マルチパート: Initiate, Upload Part, Complete
  - ACL、ポリシー、バージョニング

#### gRPC API
- 目的: クラスター内部通信
- 使用例:
```proto
service DiskService {
  rpc ReadAll(ReadAllRequest) returns (ReadAllResponse);
  rpc WriteAll(WriteAllRequest) returns (WriteAllResponse);
  rpc Delete(DeleteRequest) returns (DeleteResponse);
  rpc WriteStream(stream WriteStreamRequest) returns (WriteStreamResponse);
}
```

#### Admin REST API
- 目的: 管理操作
- エンドポイント: `/rustfs/admin/v3/*`
- 機能: ユーザー管理、グループ管理、ポリシー管理、クラスター操作

### 設定・カスタマイズ
#### 設定ファイル
```toml
# 観測性設定例
[observability]
endpoint = "http://localhost:4317"
sample_ratio = 1
logger_level = "debug"
local_logging_enabled = true

[[sinks]]
type = "File"
path = "deploy/logs/rustfs.log"
buffer_size = 102
```

#### 拡張・プラグイン開発
1. **ストレージバックエンド**: StorageAPI traitを実装
2. **通知ターゲット**: カスタム通知エンドポイント
3. **認証メカニズム**: IAMシステムの拡張

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ベンチマーク結果:
  - シーケンシャル書き込み: 最大10GB/s (NVMe)
  - シーケンシャル読み込み: 最大12GB/s (並列読み込み)
  - ランダムI/O: 100K+ IOPS (小さなオブジェクト)
  - イレイジャーコーディング: 5GB/sスループット
- 最適化手法:
  - SIMDアクセラレーション (Reed-Solomon, ハッシュ)
  - ゼロコピーI/O (bytes::Bytes)
  - コネクションプーリング
  - TCP_NODELAY最適化
  - ストリーミングアーキテクチャ

### スケーラビリティ
**スケールアップ機能**:
- ノードあたり1000以上のディスクサポート
- エクサバイトスケールのデプロイメント対応
- 水平スケーリング (クラスタリング)
- 複数のイレイジャーセット

**大規模利用時の考慮**:
- メタデータの効率的管理
- バックグラウンドヒーリング
- データバランシング
- 負荷分散

### 制限事項
**技術的な制限**:
- 最新Rustバージョン(1.85)が必要
- 初期バージョン(v0.0.3)
- 1MBブロックサイズ固定

**運用上の制限**:
- コミュニティサポートが発展途上
- サードパーティ統合が限定的
- Rustエキスパートが必要

## 評価・所感
### 技術的評価
#### 強み
- **メモリ安全性**: GCオーバーヘッドなし、unsafeコード禁止
- **ビジネスフレンドリーなApache 2.0ライセンス**: MinIOのAGPL v3より柔軟
- **高性能**: SIMD最適化、ゼロコピーI/O
- **完全なS3互換性**: 既存のS3ツールがそのまま使用可能
- **モダンなRustコードベース**: Edition 2024、最新言語機能活用
- **包括的なテスト**: 単体、E2E、ベンチマーク
- **プロフェッショナルな開発慣習**: コード品質管理、CI/CD
- **中国市場への強いフォーカス**: 中国語ドキュメント、クラウド対応

#### 改善の余地
- **初期ステージ** (v0.0.3): プロダクション準備前
- **限定的なコミュニティ**: 浅いgit履歴、少ないスター数
- **最新Rust要件**: 1.85は多くの環境で未対応
- **エコシステムの未成熟**: MinIOと比較して統合が少ない
- **サードパーティ統合の不足**: プラグインエコシステムが未発達

### 向いている用途
- **エンタープライズオブジェクトストレージ**: ビジネスフレンドリーなライセンスが必要な企業
- **高パフォーマンスワークロード**: 最大スループット、低レイテンシが必要なアプリ
- **データレイク/分析**: 高速で信頼性の高いオブジェクトストレージが必要なビッグデータプラットフォーム
- **AI/MLパイプライン**: 高並列読み込み性能を活かしたトレーニングデータストレージ
- **中国市場**: 中国の規制へのコンプライアンスが必要な組織
- **エッジコンピューティング**: Rustの効率性がリソース制約環境に適合

### 向いていない用途
- **小規模デプロイメント**: MinIOの成熟度がより価値がある
- **Goエコシステムに投資している組織**: 言語切り替えコスト
- **幅広いサードパーティ統合が必要なプロジェクト**: エコシステムが未成熟
- **Rustエキスパートがいないチーム**: 学習コストが高い

### 総評
RustFSは、Rustの安全性とパフォーマンスの利点を活かした次世代分散オブジェクトストレージシステムとして有望です。まだ初期ステージ(v0.0.3)ですが、プロフェッショナルな開発慣習、包括的なアーキテクチャ、明確なビジョンを示しています。Apache 2.0ライセンスとパフォーマンスへのフォーカスは、AGPLライセンスや最大パフォーマンスを必要とする企業にとってMinIOの魅力的な代替になります。

Rustベースのインフラストラクチャツールへの関心の高まり、MinIOのライセンス変更への懸念、AI/ML時代の高性能ストレージソリューションの需要により、トレンド入りしていると考えられます。ただし、本番デプロイメント前には成熟度とコミュニティサポートを慎重に評価する必要があります。