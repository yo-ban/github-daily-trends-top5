# リポジトリ解析: GyulyVGC/sniffnet

## 基本情報
- リポジトリ名: GyulyVGC/sniffnet
- 主要言語: Rust
- スター数: 26,604
- フォーク数: 851
- 最終更新: 活発に開発中（2024年）
- ライセンス: Apache License 2.0
- トピックス: network, monitoring, traffic, packet-capture, rust, gui, cross-platform, security

## 概要
### 一言で言うと
インターネットトラフィックを誰でも簡単に監視できる、直感的なGUIを備えたクロスプラットフォームのネットワーク監視アプリケーションです。

### 詳細説明
Sniffnetは、ネットワークトラフィック分析を技術者・非技術者両方にアクセシブルにすることを目的としたアプリケーションです。リアルタイムでネットワーク接続、データ転送量、通信パターンを可視化し、誰がどこと通信しているかを明確に把握できます。Rustで開発され、Iced GUIフレームワークを使用した美しく快適なユーザーインターフェースを提供します。

### 主な特徴
- クロスプラットフォーム対応（Windows、macOS、Linux）
- リアルタイムトラフィック監視と美しいグラフ表示
- 6000以上のアプリケーション層サービス・プロトコルの識別
- IPアドレスの地理的位置情報と国旗表示
- 高度なフィルタリング機能（IP、ポート、プロトコル、アプリケーション）
- カスタマイズ可能な通知システム（音声アラート付き）
- PCAPファイルのエクスポート/インポート機能
- 8つ以上のビルトインテーマとカスタムテーマサポート
- 22言語対応の多言語サポート
- サムネイルモードによる最小化監視

## 使用方法
### インストール
#### 前提条件
**Windows**:
- [Npcap](https://npcap.com)のインストールが必要
- 開発時: Npcap SDKも必要

**Linux**:
- 依存パッケージ: `libpcap-dev`, `libasound2-dev`, `libfontconfig1-dev`, `libgtk-3-dev`
- 非rootユーザーは権限設定が必要: `sudo setcap cap_net_raw,cap_net_admin=eip <path>`

**macOS**:
- 追加依存関係なし
- 管理者権限が必要

#### インストール手順
```bash
# 方法1: パッケージマネージャー経由
# Windows (WinGet)
winget install --id GyulyVGC.Sniffnet

# macOS (Homebrew)
brew install sniffnet

# Linux (APT - Debian/Ubuntu)
sudo apt update
sudo apt install sniffnet

# Linux (DNF - Fedora)
sudo dnf install sniffnet

# Arch Linux (AUR)
yay -S sniffnet

# Cargo (全プラットフォーム)
cargo install sniffnet

# 方法2: バイナリダウンロード
# GitHub Releasesからプラットフォーム別バイナリをダウンロード
# Windows: MSIインストーラー (64-bit/32-bit)
# macOS: DMGファイル (Intel/Apple Silicon)
# Linux: DEB/RPMパッケージ

# 方法3: Docker
docker run --rm -it --net=host ghcr.io/gyulyvgc/sniffnet:latest
```

### 基本的な使い方
#### Hello World相当の例
```bash
# GUIを起動してネットワーク監視を開始
sniffnet

# コマンドラインから特定のアダプターで直接開始
sniffnet --adapter eth0

# 設定をデフォルトにリセット
sniffnet --restore-default
```

#### 実践的な使用例
```bash
# 1. GUIでの基本使用
# - アプリケーションを起動
# - ネットワークアダプターを選択
# - フィルターを設定（例: ポート80のHTTPトラフィックのみ）
# - "Start"ボタンをクリック

# 2. トラフィック監視
# Overviewページで：
# - リアルタイムトラフィックグラフを確認
# - ドーナツチャートでプロトコル別のトラフィックを確認
# - トップホストとサービスを確認

# 3. PCAPファイルのエクスポート
# 監視中にメニューから"Export PCAP"を選択
```

### 高度な使い方
```toml
# カスタムテーマの作成
# ~/.config/sniffnet/themes/my_theme.toml (または同等のWindows/macOSパス)
# テーマ設定例
primary = "#1b1b2f"
secondary = "#e94560"
outgoing = "#0f3460"
incoming = "#16213e"
success = "#53bf9d"
warning = "#f94c66"
error = "#c54245"
favorite = "#bd4291aa"

# アラート設定例
# GUIの設定ページで通知をカスタマイズ
# - 特定のホストからの接続を監視
# - データ量が闾値を超えたときに通知
# - 音声アラートを設定

# CLIオプション
sniffnet --help
# オプション:
#   -a, --adapter <name>     使用するネットワークアダプター
#   -r, --restore-default    設定をデフォルトにリセット
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、インストール方法、機能一覧
- **CONTRIBUTING.md**: 貢献ガイドラインと開発環境セットアップ
- **ROADMAP.md**: 将来の開発計画とSniffnet 2.0へのビジョン
- **SECURITY.md**: セキュリティポリシーと脆弱性報告方法
- **Wiki**: https://github.com/GyulyVGC/sniffnet/wiki

### サンプル・デモ
- **services.txt**: 6000以上のサービス/プロトコルのデータベース
- **resources/themes/**: ビルトインテーマのTOMLファイル
- **resources/test/**: テスト用MMDBファイル

### チュートリアル・ガイド
- **公式ウェブサイト**: https://www.sniffnet.net
- **作者の修士論文**: resources/thesis.pdf（技術的詳細）
- **YouTubeデモ動画**: アプリケーションの使用方法デモ

## 技術的詳細
### アーキテクチャ
#### 全体構造
Sniffnetはモジュラーなアーキテクチャを採用し、ネットワーク監視機能、GUI、チャート、通知などが明確に分離されています。パケットキャプチャはpcapライブラリを使用し、非同期チャネルでGUIと通信します。

#### ディレクトリ構成
```
sniffnet/
├── src/
│   ├── main.rs              # エントリーポイント
│   ├── gui/                 # GUI関連
│   │   └── sniffer.rs       # メインGUIコントローラー
│   ├── networking/          # ネットワーク機能
│   │   ├── manage_packets.rs # パケットキャプチャ・管理
│   │   └── parse_packets.rs  # パケット解析
│   ├── chart/               # チャート表示
│   │   └── manage_chart_data.rs
│   ├── countries/           # 国別情報・旗
│   │   ├── country_utils.rs
│   │   └── flags_pictures.rs
│   ├── notifications/       # 通知システム
│   ├── translations/        # 多言語対応
│   ├── report/              # レポート生成
│   ├── configs/             # 設定管理
│   └── utils/               # ユーティリティ
├── resources/               # リソースファイル
│   ├── DB/                  # GeoLite2データベース
│   ├── fonts/               # フォント
│   ├── sounds/              # 通知音
│   ├── themes/              # テーマ定義
│   └── countries_flags/     # 国旗SVG
└── services.txt             # サービスデータベース
```

#### 主要コンポーネント
- **Sniffer**: メインGUIコントローラー
  - 場所: `src/gui/sniffer.rs`
  - 責務: アプリケーション状態管理、イベント処理
  - 主要フィールド: configs, info_traffic, traffic_chart

- **PacketAnalyzer**: パケット解析エンジン
  - 場所: `src/networking/parse_packets.rs`
  - 責務: プロトコル解析、アドレス抽出
  - インターフェース: `analyze_headers()`, `get_address_to_lookup()`

- **TrafficChart**: トラフィック可視化
  - 場所: `src/chart/`
  - 責務: リアルタイムチャート生成
  - 依存: plottersライブラリ

### 技術スタック
#### コア技術
- **言語**: Rust (edition 2024、最新機能を活用)
- **GUIフレームワーク**: Iced 0.13.1（クロスプラットフォームGUIライブラリ）
- **主要ライブラリ**: 
  - pcap (2.2.0): ネットワークパケットキャプチャ
  - etherparse (0.18.0): パケットプロトコル解析
  - maxminddb (0.26.0): 地理位置情報データベース読み取り
  - dns-lookup (2.0.4): DNS逆引き
  - plotters (0.3.7): チャート描画
  - rodio (0.20.1): 音声通知
  - splines (4.3.1): スプライン補間
  - serde (1.0): シリアライゼーション

#### 開発・運用ツール
- **ビルドツール**: 
  - Cargo（Rustパッケージマネージャー）
  - Cross（クロスコンパイル用）
  - Docker（コンテナ化）
- **CI/CD**: GitHub Actions
  - マルチプラットフォームビルド
  - 自動リリース作成
- **テスト**: 
  - 単体テスト（cargo test）
  - パケット解析テスト

### 設計パターン・手法
- **MVU (Model-View-Update) Pattern**: Icedフレームワークによる実装
- **Message Passing**: 非同期チャネルを使用したコンポーネント間通信
- **State Machine**: アプリケーション状態の明確な管理
- **Lazy Loading**: ウィジェットの遅延ロードによるパフォーマンス最適化
- **Observer Pattern**: パケットキャプチャイベントの配信

### データフロー・処理フロー
1. **パケットキャプチャフロー**
   ```rust
   // manage_packets.rsからのフロー
   pub fn analyze_headers(
       headers: LaxPacketHeaders,
       mac_addresses: &mut (Option<String>, Option<String>),
       exchanged_bytes: &mut u128,
       icmp_type: &mut IcmpType,
       arp_type: &mut ArpType,
       packet_filters_fields: &mut PacketFiltersFields,
   ) -> Option<AddressPortPair>
   ```
   - ネットワークインターフェースからパケット取得
   - リンク層（Ethernet）解析
   - ネットワーク層（IPv4/IPv6/ARP）解析
   - トランスポート層（TCP/UDP/ICMP）解析
   - アプリケーション層サービス識別

2. **データ集計フロー**
   - 接続情報の集計（ホスト、ポート、プロトコル）
   - トラフィック量の計測
   - サービス識別（services.txtデータベース参照）
   - DNS逆引きと地理情報付加

3. **GUI更新フロー**
   - 非同期チャネル経由でGUIに通知
   - チャートデータ更新
   - テーブルビュー更新
   - 通知トリガーチェック

## API・インターフェース
### 公開API
#### CLIインターフェース
- 目的: コマンドラインからの操作
- 使用例:
```bash
# 特定のアダプターで起動
sniffnet --adapter eth0

# 設定のリセット
sniffnet --restore-default

# ヘルプ表示
sniffnet --help
```

### 設定・カスタマイズ
#### 設定ファイル
```toml
# カスタムテーマ設定 (themes/custom_theme.toml)
# カラー設定
primary = "#1b1b2f"          # メインカラー
secondary = "#e94560"        # セカンダリカラー
outgoing = "#0f3460"         # 送信トラフィック
incoming = "#16213e"         # 受信トラフィック
success = "#53bf9d"          # 成功表示
warning = "#f94c66"          # 警告表示
error = "#c54245"            # エラー表示
favorite = "#bd4291aa"       # お気に入りマーク

# フォント設定
font = "Sarasa Mono SC"      # メインフォント
font_bold = "Sarasa Mono SC Bold"
```

#### 拡張・プラグイン開発
拡張可能な領域:
1. **カスタムテーマ**: TOMLファイルで新しいテーマを定義
2. **サービス定義**: services.txtに新しいサービスを追加
3. **翻訳**: 新しい言語の追加（src/translations/）
4. **カスタムMMDB**: 独自の地理情報データベースの使用

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- **レンダラー**: wgpu（GPUアクセラレーション）またはtiny-skia（CPUフォールバック）
- **最適化手法**: 
  - Lazy widget loadingによるUIパフォーマンス向上
  - 非同期パケット処理
  - 設定可能なチャート更新間隔
  - Rustの所有権モデルによるメモリ効率

### スケーラビリティ
- 高トラフィック環境でも対応可能なアーキテクチャ
- 設定可能なパケットバッファサイズ
- 複数のネットワークインターフェースの同時監視（将来的に）

### 制限事項
- **プラットフォーム制限**: 
  - Windows: Npcapが必要
  - Linux: root権限またはcapability設定が必要
  - macOS: 管理者権限が必要
- **機能制限**: 
  - 読み取り専用（パケット修正不可）
  - ディープパケットインスペクションは未実装
  - 非暗号化トラフィックのみ解析可能

## 評価・所感
### 技術的評価
#### 強み
- 直感的で美しいGUIによる優れたユーザーエクスペリエンス
- クロスプラットフォーム対応による幅広いユーザー層
- 6000以上のサービス識別による詳細なトラフィック分析
- Rustによる安全性とパフォーマンスの両立
- オープンソースによる透明性と信頼性
- 多言語・マルチテーマサポートによるアクセシビリティ

#### 改善の余地
- プロトコル内容の詳細解析機能（DPI）
- フィルタリングルールの保存・インポート
- 長期的なトラフィック分析・レポート機能
- API提供による他ツールとの連携

### 向いている用途
- ホームネットワークのセキュリティ監視
- 不審な通信の検出とアラート
- ネットワークトラブルシューティング
- 教育目的でのネットワーク学習
- バンドウィドス使用状況の把握

### 向いていない用途
- エンタープライズ級の大規模ネットワーク監視
- 詳細なパケット内容解析が必要な業務
- 自動化されたセキュリティ対応
- コマンドラインでの詳細分析

### 総評
Sniffnetは、ネットワーク監視を誰もがアクセスできるようにするという明確なビジョンを持った優れたプロジェクトです。技術的にはRustとIcedを用いたモダンな実装、ユーザー体験としては美しく直感的なGUIを実現しています。特に、非技術者でも「自分のネットワークで何が起きているか」を理解できるようにするというコンセプトは、プライバシーとセキュリティ意識が高まる現代において非常に価値があります。Sniffnet 2.0へのロードマップも明確で、将来性のあるプロジェクトとして高く評価できます。