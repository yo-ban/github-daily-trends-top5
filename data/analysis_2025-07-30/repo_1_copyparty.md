# リポジトリ解析: 9001/copyparty

## 基本情報
- リポジトリ名: 9001/copyparty
- 主要言語: Python
- スター数: 11,202
- フォーク数: 340
- 最終更新: 2025年7月時点でアクティブ
- ライセンス: MIT License
- トピックス: file-server, webdav, ftp, tftp, smb, resumable-uploads, deduplication, media-indexer, thumbnails, cross-platform

## 概要
### 一言で言うと
ほぼあらゆるデバイスを高機能なファイルサーバーに変換できる、依存関係なしで動作するポータブルなPythonプログラム。

### 詳細説明
copypartyは、Python（2または3）のみで動作し、HTTP/HTTPS、WebDAV、FTP/FTPS、TFTP、SMB/CIFSなど複数のプロトコルをサポートする軽量で高機能なファイルサーバーソフトウェアです。リジューム可能なアップロード・ダウンロード、ファイルの重複排除、メディアインデックス、サムネイル生成、音声トランスコーディング、書き込み専用フォルダなど、多彩な機能を提供します。

主な設計思想は「逆Linuxフィロソフィー」で、すべてのことを実行し、それらを「まあまあ」うまくこなすことを目指しています。緊急時のファイル転送から恒久的なメディアサーバーまで、幅広い用途に対応できます。

### 主な特徴
- ゼロ依存：Python本体のみで動作（すべての追加依存関係はオプション）
- マルチプロトコル：HTTP、WebDAV、FTP、TFTP、SMB/CIFSを単一プロセスで提供
- リジューム可能なアップロード：独自の「up2k」プロトコルによるチャンクベースの転送
- ファイルサイズ制限なし：Cloudflare経由でも動作
- 重複排除：シンボリックリンクベースでストレージを節約
- メディア機能：音声プレーヤー（トランスコーディング付き）、画像ギャラリー、動画プレーヤー
- 検索機能：ファイル名、サイズ、日付、MP3タグ、ファイル内容での検索
- サムネイル生成：画像、動画、音声（スペクトログラム）
- ファイルマネージャー：カット＆ペースト、リネーム、削除
- 「Race the beam」：アップロード中のファイルをダウンロード可能
- 自己破壊アップロード：ファイルに有効期限を設定可能
- クロスプラットフォーム：Windows、Linux、macOS、Android、FreeBSD、ARM、RISC-V等

## 使用方法
### インストール
#### 前提条件
- Python 2.7以降または3.3以降
- オプション：FFmpeg（メディア機能用）、Pillow（画像処理用）

#### インストール手順
```bash
# 方法1: 自己完結型スクリプト（推奨）
wget https://github.com/9001/copyparty/releases/latest/download/copyparty-sfx.py
python copyparty-sfx.py

# 方法2: pip経由
python3 -m pip install --user -U copyparty

# 方法3: Windows実行ファイル
# copyparty.exe（Win8+）またはcopyparty32.exe（Win7+）をダウンロード

# 方法4: パッケージマネージャー
pacman -S copyparty  # Arch Linux
nix profile install github:9001/copyparty  # Nix
```

### 基本的な使い方
#### Hello World相当の例
```bash
# カレントディレクトリを共有（読み書き可能）
python copyparty-sfx.py

# 特定のポートで起動
python copyparty-sfx.py -p 8080

# ファイルインデックスとメディア機能を有効化
python copyparty-sfx.py -e2dsa -e2ts
```

#### 実践的な使用例
```bash
# 読み取り専用の音楽フォルダと書き込み可能なアップロードフォルダを共有
python copyparty-sfx.py \
  -e2dsa -e2ts \
  -v /home/music:/music:r \
  -v /home/uploads:/uploads:w

# ユーザー認証付きで起動
python copyparty-sfx.py \
  -a alice:pass123 \
  -a bob:pass456 \
  -v /shared:/shared:r:rw,alice,bob \
  -v /alice-only:/alice:r,alice:rw,alice
```

### 高度な使い方
```bash
# FTP、WebDAV、TFTP、mDNSを有効化した完全機能サーバー
python copyparty-sfx.py \
  -e2dsa -e2ts --dedup --ftp 3921 --tftp 3969 \
  --smb 3945 --webdav --mdns --qr \
  -v /storage:/files:r:rw,admin \
  -a admin:securepass \
  --xff-hdr cf-connecting-ip

# 設定ファイルを使用
python copyparty-sfx.py -c /etc/copyparty.conf
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: 包括的なドキュメント（機能説明、設定例、FAQ等）
- **docs/devnotes.md**: 開発者向けドキュメント（API仕様、ビルド手順）
- **docs/versus.md**: 類似ソフトウェアとの比較
- **docs/examples/**: 様々な使用例とシナリオ

### サンプル・デモ
- **contrib/**: システムサービス設定、リバースプロキシ設定、プラグイン例
- **bin/hooks/**: イベントフック実装例（Discord通知、画像処理等）
- **デモサーバー**: https://a.ocv.me/pub/demo/ （読み取り専用）

### チュートリアル・ガイド
- クイックスタートガイド（README内）
- Windows向け完全ガイド（docs/examples/windows.md）
- Synology DSM向けガイド（docs/synology-dsm.md）
- Docker使用ガイド（scripts/docker/）

## 技術的詳細
### アーキテクチャ
#### 全体構造
copypartyはモジュラーアーキテクチャを採用し、コアHTTPサーバーを中心に各種プロトコルハンドラーがプラグイン可能な構造になっています。マルチプロセッシングをサポートし、各プロセスが独立してリクエストを処理できます。

#### ディレクトリ構成
```
copyparty/
├── copyparty/         # メインアプリケーションコード
│   ├── __main__.py    # エントリーポイント
│   ├── httpsrv.py     # HTTPサーバー実装
│   ├── httpconn.py    # HTTP接続処理
│   ├── up2k.py        # アップロード処理、インデックス、重複排除
│   ├── authsrv.py     # 認証とボリューム管理
│   ├── ftpd.py        # FTPサーバー実装
│   ├── tftpd.py       # TFTPサーバー実装
│   ├── smbd.py        # SMBサーバー実装
│   ├── mdns.py        # mDNS/Zeroconf実装
│   └── web/           # ウェブUI資産
├── docs/              # ドキュメント
├── contrib/           # 設定例、統合スクリプト
├── bin/               # ユーティリティスクリプト
└── scripts/           # ビルド・デプロイスクリプト
```

#### 主要コンポーネント
- **HTTPサーバー（httpsrv.py）**: すべてのHTTPリクエストを処理するコアサーバー
  - 場所: `copyparty/httpsrv.py`
  - 依存: httpconn、authsrv
  - インターフェース: start()、stop()、add_handler()

- **up2kエンジン（up2k.py）**: チャンクベースのアップロード処理
  - 場所: `copyparty/up2k.py`
  - 依存: fsutil、u2idx
  - インターフェース: handle_upload()、verify_chunks()、dedupe()

- **認証システム（authsrv.py）**: ユーザー認証とボリューム権限管理
  - 場所: `copyparty/authsrv.py`
  - 依存: pwhash
  - インターフェース: authenticate()、check_access()

### 技術スタック
#### コア技術
- **言語**: Python 2.7+ / 3.3+（両方サポート）
- **HTTPサーバー**: 独自実装（asyncore/asyncioベース）
- **データベース**: SQLite3（ファイルインデックス用）
- **主要ライブラリ**: 
  - Jinja2（必須）: HTMLテンプレート
  - Pillow（オプション）: 画像処理
  - FFmpeg（オプション）: メディア処理
  - mutagen（オプション）: 音楽メタデータ
  - pyftpdlib（オプション）: FTPサーバー

#### 開発・運用ツール
- **ビルドツール**: make-sfx.sh（自己完結型実行ファイル作成）
- **テスト**: pytest、カバレッジ測定
- **CI/CD**: GitHub Actions
- **デプロイ**: systemd、OpenRC、Docker対応

### 設計パターン・手法
- イベント駆動アーキテクチャ（アップロード、リネーム等のフック）
- プラグインシステム（ハンドラー、パーサー、UI拡張）
- チャンクベースのファイル転送（効率的な大容量ファイル処理）
- スパースファイルサポート（ディスク容量の効率的利用）

### データフロー・処理フロー
1. クライアントがファイルをチャンクに分割
2. 各チャンクのハッシュをサーバーに送信
3. サーバーが既存チャンクを確認（重複排除）
4. 不足チャンクのみアップロード
5. サーバーがスパースファイルを作成・結合
6. 完全性検証（SHA512）
7. メタデータインデックス更新

## API・インターフェース
### 公開API
#### アップロードAPI（/up）
- 目的: ファイルアップロード
- 使用例:
```bash
# 基本的なアップロード
curl -F "file=@image.jpg" http://localhost:3923/up

# チャンクアップロード
curl -X POST http://localhost:3923/up \
  -H "Content-Range: bytes 0-1048575/2097152" \
  --data-binary @chunk1
```

#### 検索API（/.cpr/search）
- 目的: ファイル検索
- 使用例:
```bash
# ファイル名検索
curl "http://localhost:3923/.cpr/search?q=filename:*.mp3"

# メタデータ検索
curl "http://localhost:3923/.cpr/search?q=artist:Beatles"
```

### 設定・カスタマイズ
#### 設定ファイル
```yaml
[global]
  p: 8080, 3923    # リスンポート
  e2dsa            # ファイルインデックス有効化
  e2ts             # メディアインデックス有効化
  j: 4             # ワーカープロセス数

[accounts]
  alice: $hash$salt$... # ハッシュ化パスワード

[/shared]
  /home/shared
  accs:
    r: *           # 全員読み取り可
    rw: alice      # aliceは読み書き可
  flags:
    e2d            # アップロードDB有効
    nodupe         # 重複拒否
```

#### 拡張・プラグイン開発
プラグインはPythonスクリプトとして実装し、指定ディレクトリに配置することで自動的にロードされます。イベントフック、カスタムハンドラー、UIプラグインなどが作成可能です。

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ダウンロード: 最大8 GiB/s
- アップロード: 最大1 GiB/s
- インデックス性能: `-j2`で4倍、`-j4`で16倍高速化
- メモリ使用量: 基本的に低い（大容量ファイルでもストリーミング処理）

### スケーラビリティ
- マルチプロセッシング対応（CPUコア数に応じて自動調整）
- 大容量ストレージ対応（ファイルサイズ制限なし）
- 多数の同時接続対応（epoll/kqueue使用）

### 制限事項
- WebDAVでの大容量ファイル処理は一部制限あり
- SMBサーバーは実験的実装で性能・互換性に制限
- ファイル同期は片方向のみ（双方向同期は未サポート）

## 評価・所感
### 技術的評価
#### 強み
- 完全にポータブルで依存関係が最小限
- 多様なプロトコルを単一プロセスでサポート
- 高度なアップロード機能（リジューム、重複排除、並列転送）
- 豊富なメディア機能（トランスコーディング、サムネイル、プレーヤー）
- 柔軟な権限システムとイベント駆動の拡張性

#### 改善の余地
- UIが機能的だが洗練されていない（ユーザーフィードバックより）
- 双方向同期の未サポート
- ドキュメントが充実しているが、初心者には情報過多

### 向いている用途
- 緊急時のファイル転送（古いシステム間でも動作）
- 一時的なファイル共有サーバー
- 個人・小規模チームのメディアサーバー
- 自動化ツールのアップロード先
- 組み込みシステムでのファイルサーバー

### 向いていない用途
- エンタープライズレベルのファイル共有（NextcloudやOwnCloudが適切）
- リアルタイムコラボレーション（同時編集等）
- 厳密なコンプライアンス要件がある環境

### 総評
copypartyは「スイスアーミーナイフ」的なファイルサーバーで、様々な状況で「とりあえず動く」ことを重視した実用的なツールです。特に異種システム間でのファイル転送や、素早くファイルサーバーを立ち上げたい場合に威力を発揮します。高度な機能を持ちながら依存関係が最小限で、Pythonさえあれば動作する点は大きな強みです。一方で、エンタープライズ向けの洗練されたUIや管理機能を求める場合は、他の選択肢を検討すべきでしょう。