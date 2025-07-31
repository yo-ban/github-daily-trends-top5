# リポジトリ解析: 9001/copyparty

## 基本情報
- リポジトリ名: 9001/copyparty
- 主要言語: Python
- スター数: 14,688
- フォーク数: 463
- 最終更新: 2025年7月30日
- ライセンス: MIT License
- トピックス: ファイルサーバー、レジューマブルアップロード、WebDAV、FTP、TFTP、メディアインデクサー、サムネイル生成

## 概要
### 一言で言うと
どんなデバイスもファイル共有サーバーに変える、ポータブルで多機能なファイルサーバー。Python一つで動作し、レジューマブルアップロード、重複排除、マルチプロトコル対応などエンタープライズ級の機能を提供。

### 詳細説明
copypartyは、Pythonで書かれた軽量で多機能なファイルサーバーです。単一のPythonファイルで動作可能で、依存関係もオプショナルなため、どんな環境でも簡単に起動できます。HTTPだけでなくWebDAV、FTP、TFTP、SMBなど複数のプロトコルに対応し、ファイルサイズの制限なくレジューマブルなアップロード・ダウンロードが可能です。Cloudflareのプロキシ経由でも大容量ファイルを扱えるよう最適化されています。

### 主な特徴
- シングルファイルで動作可能（copyparty-sfx.pyまたはcopyparty.exe）
- マルチプロトコル対応（HTTP、WebDAV、FTP、TFTP、SMB/CIFS）
- レジューマブルアップロード/ダウンロード（up2kプロトコル）
- ファイル重複排除（シンボリックリンクによる）
- リアルタイムファイルストリーミング（「レース・ザ・ビーム」機能）
- メディアプレイヤー内蔵（音楽、動画、画像）
- サムネイル自動生成
- ファイル検索（ファイル名、サイズ、日付、MP3タグ、ファイル内容）
- 多言語UI対応
- 書き込み専用フォルダ
- 自己破壊アップロード（時限ファイル）
- QRコード生成
- ゼロコンフィグレーション起動

## 使用方法
### インストール
#### 前提条件
- Python 3.3以上（Python 2.7も対応だが非推奨）
- オプショナル依存関係：
  - Jinja2（推奨）
  - argon2-cffi（パスワードハッシュ用）
  - Pillow（サムネイル生成用）
  - ffmpeg（動画処理用）
  - mutagen（音楽メタデータ用）

#### インストール手順
```bash
# 方法1: シングルファイル版をダウンロード
wget https://github.com/9001/copyparty/releases/latest/download/copyparty-sfx.py
python3 copyparty-sfx.py

# 方法2: pipでインストール
python3 -m pip install --user -U copyparty
copyparty

# 方法3: Windows実行ファイル（Pythonなしで動作）
# copyparty.exeをダウンロードして実行

# 方法4: パッケージマネージャー
# Arch Linux
pacman -S copyparty

# Nix
nix profile install github:9001/copyparty
```

### 基本的な使い方
#### Hello World相当の例
```bash
# カレントディレクトリを公開
python3 copyparty-sfx.py

# ポート8080で起動
copyparty -p 8080

# 基本認証付き
copyparty -u alice:pass123
```

#### 実践的な使用例
```bash
# ファイルインデックスとメディアインデックスを有効化
copyparty -e2dsa -e2ts -p 80

# 複数のボリュームを設定
copyparty -v /home/music:/music:r -v /home/uploads:/uploads:rw:c,e2d,nodupe

# 設定ファイルを使用
copyparty example.conf
```

### 高度な使い方
```yaml
# advanced.conf - 高度な設定例
[global]
  p: 80, 443                    # HTTPとHTTPS
  e2dsa                         # ファイルインデックス
  e2ts                          # メディアインデックス
  e2t                           # サムネイル生成
  z, qr                         # Zeroconf、QRコード
  theme: 2                      # ダークテーマ

[accounts]
  admin: $2b$12$hashedpassword
  alice: alicepass
  bob: bobpass

[/public]
  /srv/public
  accs:
    r: *                        # 誰でも読み取り可能

[/music]
  /srv/music
  accs:
    r: alice, bob               # alice、bobが読み取り可能
    rw: admin                   # adminは読み書き可能
  flags:
    e2ts                        # 音楽メタデータインデックス
    dots                        # 隠しファイルを表示

[/uploads]
  /srv/uploads
  accs:
    w: *                        # 誰でもアップロード可能
    rwmd: admin                 # adminは削除可能
  flags:
    e2d                         # アップロードデータベース
    nodupe                      # 重複ファイル拒否
    lifetime: 604800            # 7日後に自動削除
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、基本的な使い方、機能一覧
- **docs/examples/**: 様々な使用例とユースケース
- **docs/example.conf**: 設定ファイルの詳細な例
- **docs/idp.md**: 外部認証プロバイダ（OAuth/SAML）の設定
- **docs/rclone.md**: rcloneとの連携方法
- **Wiki/サイト**: GitHubのリポジトリとリリースページ

### サンプル・デモ
- **contrib/**: 各種Webサーバー（nginx、Apache、HAProxy）との連携設定
- **contrib/plugins/**: UIカスタマイズプラグイン例
- **contrib/systemd/**: systemdサービス設定
- **scripts/**: ビルドスクリプトとDocker設定

### チュートリアル・ガイド
- インストールガイド（README内）
- 設定ファイルの書き方（example.conf）
- プロトコルリファレンス（docs/protocol-reference.sh）
- パフォーマンスチューニング（docs/bufsize.txt）

## 技術的詳細
### アーキテクチャ
#### 全体構造
マルチプロセス・マルチスレッドアーキテクチャを採用し、高い並行性を実現。コアサーバーがHTTPリクエストを処理し、各プロトコルハンドラーがそれぞれのプロトコルに対応。up2kエンジンが高度なアップロード機能を提供。

#### ディレクトリ構成
```
copyparty/
├── copyparty/              # メインパッケージ
│   ├── __main__.py         # エントリーポイント
│   ├── httpsrv.py          # HTTPサーバー実装
│   ├── httpconn.py         # HTTP接続処理
│   ├── authsrv.py          # 認証と設定管理
│   ├── up2k.py             # アップロードエンジン
│   ├── bos/                # 基本オブジェクトストレージ層
│   ├── web/                # Web UI（HTML/CSS/JS）
│   ├── ftpd.py             # FTPサーバー
│   ├── smbd.py             # SMBサーバー
│   └── tftpd.py            # TFTPサーバー
├── docs/                   # ドキュメント
├── contrib/                # 統合例、プラグイン
├── tests/                  # テストスイート
└── scripts/                # ビルド・デプロイスクリプト
```

#### 主要コンポーネント
- **HTTPサーバー（httpsrv.py）**: メインのWebサーバー実装
  - 場所: `copyparty/httpsrv.py`
  - 依存: httpconn、authsrv
  - インターフェース: handle_request、serve_forever

- **up2kエンジン（up2k.py）**: レジューマブルアップロード実装
  - 場所: `copyparty/up2k.py`
  - 依存: bos、u2idx
  - インターフェース: handle_upload、chunk_hash、dedupe

- **認証サーバー（authsrv.py）**: ユーザー認証と権限管理
  - 場所: `copyparty/authsrv.py`
  - 依存: pwhash
  - インターフェース: check_auth、parse_config

### 技術スタック
#### コア技術
- **言語**: Python 3.3+（Python 2.7互換）
- **フレームワーク**: 標準ライブラリベース（外部フレームワークなし）
- **主要ライブラリ**: 
  - Jinja2: テンプレートエンジン
  - argon2-cffi: パスワードハッシュ
  - Pillow: 画像処理
  - mutagen: 音楽メタデータ

#### 開発・運用ツール
- **ビルドツール**: Makefileベース、nuitka/pyinstallerサポート
- **テスト**: pytest、カバレッジ測定
- **CI/CD**: GitHub Actions
- **デプロイ**: Docker、systemd、各種パッケージマネージャー

### 設計パターン・手法
- マルチプロセス・マルチスレッドによる並行処理
- チャンクベースのファイル転送（効率的なレジューム）
- プラグイン可能なアーキテクチャ（イベントフック）
- プロトコル抽象化（複数プロトコルの統一的な扱い）

### データフロー・処理フロー
1. クライアントがファイルをチャンクに分割
2. 各チャンクのハッシュを計算
3. サーバーに既存チャンクを問い合わせ
4. 未アップロードのチャンクのみ送信
5. サーバー側で重複排除とファイル再構築
6. メタデータインデックスの更新

## API・インターフェース
### 公開API
#### ファイル操作API
- 目的: プログラマティックなファイル操作
- 使用例:
```bash
# ファイル一覧取得
curl "http://localhost:3923/?ls"

# ディレクトリツリー取得
curl "http://localhost:3923/?tree"

# ファイルアップロード
curl -F "file=@image.jpg" http://localhost:3923/uploads/

# ファイル削除
curl -X POST "http://localhost:3923/file.txt?delete"
```

### 設定・カスタマイズ
#### 設定ファイル
```yaml
# YAML形式の設定
[global]
  name: My File Server        # サーバー名
  theme: 2                    # UIテーマ
  e2dsa                       # 各種機能フラグ

[/volume-name]
  /actual/path                # 実際のパス
  accs:                       # アクセス制御
    r: *                      # 読み取り権限
    rw: user1, user2          # 読み書き権限
  flags:                      # ボリューム固有の設定
    e2d                       # アップロードDB
    lifetime: 86400           # ファイル有効期限
```

#### 拡張・プラグイン開発
- JavaScriptプラグイン（contrib/plugins/）
- イベントフック（on-upload、on-delete等）
- カスタムテーマ（CSS）

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ダウンロード速度: 最大8 GiB/s
- アップロード速度: 最大1 GiB/s
- チャンクサイズ: 1 MiB〜8 GiB（ファイルサイズに応じて自動調整）
- 並列処理: マルチコアCPUを活用したハッシュ計算

### スケーラビリティ
- マルチプロセスモードで負荷分散
- ファイルシステムベースなのでNFS/SANとの相性良好
- SQLiteデータベースは数百万ファイルまで対応

### 制限事項
- 単一サーバーインスタンス（クラスタリング未対応）
- ファイルシステムの制限に依存
- メモリ使用量はアクティブな接続数に比例

## 評価・所感
### 技術的評価
#### 強み
- 極めて高いポータビリティ（単一ファイルで動作）
- 豊富な機能（エンタープライズ級）を軽量に実装
- 優れたパフォーマンス（特に大容量ファイル）
- 柔軟な権限管理システム
- AI/LLMを使わない100%人間による開発

#### 改善の余地
- クラスタリング機能の欠如
- WebUI のモダン化（バニラJSは長所でもあり短所でもある）
- ドキュメントの構造化（情報は豊富だが散在）

### 向いている用途
- 一時的なファイル共有サーバー
- ホームメディアサーバー
- 開発環境でのファイル交換
- 緊急時のデータレスキュー（ブータブル版）
- 既存ファイル構造の公開（インポート不要）

### 向いていない用途
- 大規模エンタープライズのメインストレージ
- 高可用性が必要なシステム
- リアルタイムコラボレーション
- バージョン管理が必要な用途

### 総評
copypartyは、シンプルなHTTPファイルサーバーとNextcloudのような重量級ソリューションの間を埋める優れたプロジェクトです。単一ファイルで動作する軽量さと、レジューマブルアップロード、マルチプロトコル対応などの高度な機能を両立させている点が特に優れています。緊急時のデータ救出からホームメディアサーバーまで、幅広い用途に対応できる柔軟性も魅力です。プロジェクトがAIを使わず人間によって書かれていることを誇りとしている点も、品質へのこだわりを感じさせます。