# リポジトリ解析: shadps4-emu/shadPS4

## 基本情報
- リポジトリ名: shadps4-emu/shadPS4
- 主要言語: C++
- スター数: 24,601
- フォーク数: 1,585
- 最終更新: 2025年1月（活発に開発中）
- ライセンス: GNU General Public License v2.0
- トピックス: PlayStation 4エミュレータ、ゲームエミュレーション、C++、Vulkan

## 概要
### 一言で言うと
shadPS4はWindows、Linux、macOSで動作するオープンソースのPlayStation 4エミュレータで、Bloodborneなどの人気タイトルが既に動作します。

### 詳細説明
shadPS4は、C++で書かれた初期段階のPlayStation 4エミュレータです。x86-64アーキテクチャを対象とし、PS4のシステムライブラリを高レベルエミュレーション（HLE）で実装しています。Vulkanを使用したグラフィックスレンダリングと、GCN（Graphics Core Next）シェーダーをSPIR-Vに変換する機能を備えています。まだ開発初期段階であるものの、既に多くのPS4タイトルが動作し、活発な開発が続いています。

### 主な特徴
- マルチプラットフォーム対応（Windows、Linux、macOS）
- Vulkanベースのグラフィックスレンダリング
- GCNからSPIR-Vへのシェーダー再コンパイル
- PS4システムライブラリの幅広いHLE実装
- コントローラーサポート（DualShock/Xbox）とキーボードマッピング
- セーブデータ管理とトロフィーシステム
- FFmpegベースのビデオデコーダー
- QtベースのGUIとSDLのミニマルUI
- 30以上の言語に対応したローカライゼーション

## 使用方法
### インストール
#### 前提条件
**システム要件:**
- CPU: 最低4コア/6スレッド、2.5GHz以上、x86-64-v3サポート
- GPU: 1GB以上VRAM、Vulkan 1.3サポート
- RAM: 8GB以上
- OS: Windows 10+、Ubuntu 22.04+、macOS 15.4+

**必要なファームウェアモジュール（sys_modulesフォルダに配置）:**
- libSceCesCs.sprx、libSceFont.sprx、libSceFontFt.sprx
- libSceFreeTypeOt.sprx、libSceJson.sprx、libSceJson2.sprx
- libSceLibcInternal.sprx、libSceNgs2.sprx、libSceRtc.sprx、libSceUlt.sprx

#### インストール手順
```bash
# Windows (Visual Studio 2022)
# 1. C++ Clang Compiler for WindowsとLLVMサポートをインストール
# 2. Qt 6.8.2+をインストール（GUI版の場合）
# 3. CMakeでビルド
cmake -S . -B build/ -DENABLE_QT_GUI=ON
cmake --build build --config Release

# Linux
# 依存パッケージインストール
sudo apt install clang-18 cmake qt6-base-dev qt6-tools-dev \
    libvulkan-dev libsdl3-dev libavcodec-dev

# ビルド
cmake -S . -B build/ -DENABLE_QT_GUI=ON \
    -DCMAKE_C_COMPILER=clang -DCMAKE_CXX_COMPILER=clang++
cmake --build ./build --parallel$(nproc)

# macOS
# Homebrewで依存パッケージインストール
brew install llvm@19 cmake qt@6 vulkan-loader molten-vk sdl3

# ビルド（x86_64アーキテクチャで）
cmake -S . -B build/ -DENABLE_QT_GUI=ON
cmake --build build --parallel$(sysctl -n hw.ncpu)
```

### 基本的な使い方
#### ゲームの起動（コマンドライン）
```bash
# 基本的な起動
./shadPS4.exe <path-to-eboot.bin>

# ゲームIDで起動（設定済みフォルダから検索）
./shadPS4.exe -g CUSA12345

# フルスクリーンで起動
./shadPS4.exe -f true game.bin

# パッチ適用
./shadPS4.exe -p patch.txt game.bin
```

#### 実践的な使用例（ゲームのインストール構造）
```bash
# ゲームフォルダ構成
game_folder/
├── eboot.bin            # メイン実行ファイル
├── sce_sys/
│   ├── param.sfo       # ゲーム情報
│   ├── pic1.png        # ゲーム画像
│   └── trophy/         # トロフィーデータ
└── sce_module/
    └── *.prx           # 追加モジュール

# ゲームフォルダを設定に追加
./shadPS4.exe --add-game-folder /path/to/games
```

### 高度な使い方
```toml
# user/config.toml - 詳細設定

[General]
logType = "sync"                     # ログタイプ
logFilter = "Core:Warning,Lib.Pad:Info,Render.Vulkan:Warning"
isNeo = false                        # PS4 Proモード

[GPU]
screenWidth = 1920                   # 内部解像度
screenHeight = 1080
vblankDiv = 1                        # VBlank分割（FPS制御）
dumpShaders = false                  # シェーダーダンプ

[Vulkan]
validation = false                   # 検証レイヤー
rdocEnable = false                   # RenderDoc統合
gpuId = -1                          # GPU選択 (-1=自動)

[Input]
keyboard_0 = [
    ["A", "Left"],                   # 左スティック左
    ["D", "Right"],                  # 左スティック右
    ["W", "Up"],                     # 左スティック上
    ["S", "Down"],                   # 左スティック下
    ["C", "Triangle"],               # △ボタン
    ["B", "Circle"],                 # ○ボタン
    ["N", "Cross"],                  # ×ボタン
    ["V", "Square"],                 # □ボタン
    ["Q", "L1"],
    ["E", "R1"],
    ["U", "L2"],
    ["O", "R2"],
    ["X", "L3"],
    ["M", "R3"],
    ["Space", "TouchPad"],
    ["Return", "Options"]
]

# 特殊キー：
# F10: FPSカウンター
# F11: フルスクリーン切り替え
# F12: RenderDocキャプチャ
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、現在の状態、基本的な使用方法
- **documents/building-windows.md**: Windowsでの詳細なビルド手順
- **documents/building-linux.md**: Linuxでのビルド手順と依存関係
- **documents/building-macos.md**: macOS固有のビルド手順
- **documents/changelog.md**: バージョン履歴と新機能
- **documents/patching-shader.md**: シェーダーパッチングガイド

### サンプル・デモ
- ゲーム互換性トラッカー: https://github.com/shadps4-compatibility/shadps4-game-compatibility
- Discordサーバーでのコミュニティサポート

### チュートリアル・ガイド
- コマンドライン引数の詳細
- 設定ファイル（config.toml）の完全なリファレンス
- トラブルシューティングガイド

## 技術的詳細
### アーキテクチャ
#### 全体構造
shadPS4はモジュラーアーキテクチャを採用し、PS4のハードウェアアーキテクチャをエミュレートします。CPUはx86-64命令をネイティブ実行し、GPUはVulkanを通じてAMD GCNアーキテクチャをエミュレートします。

#### ディレクトリ構成
```
shadPS4/
├── src/
│   ├── core/               # コアエミュレーション
│   │   ├── libraries/      # PS4システムライブラリHLE実装
│   │   │   ├── kernel/    # カーネルAPI
│   │   │   ├── gnmdriver/ # GPUドライバーAPI
│   │   │   ├── pad/       # コントローラー入力
│   │   │   └── videodec/  # ビデオデコーダー
│   │   ├── aerolib/        # 動的リンキング・モジュールローダー
│   │   ├── devices/        # デバイスエミュレーション
│   │   └── file_format/   # PS4ファイル形式（PKG、PFS等）
│   ├── video_core/         # GPUエミュレーション
│   │   ├── amdgpu/         # Liverpool GPU実装
│   │   ├── renderer_vulkan/# Vulkanレンダラー
│   │   └── texture_cache/ # テクスチャキャッシュ
│   ├── shader_recompiler/  # GCN→SPIR-Vシェーダー変換
│   ├── common/             # 共通ユーティリティ
│   ├── qt_gui/             # QtベースGUI
│   └── emulator.cpp        # メインエミュレータクラス
├── externals/              # サードパーティライブラリ
├── documents/              # ドキュメント
└── scripts/                # ビルド・ユーティリティスクリプト
```

#### 主要コンポーネント
- **Emulator**: メインエミュレータコア
  - 場所: `src/emulator.cpp`
  - 役割: エミュレーションの初期化、ゲームロード、実行制御
  - 主要メソッド: Init(), Load(), Run()

- **Aerolib**: 動的リンカー
  - 場所: `src/core/aerolib/`
  - 役割: PS4実行ファイルとライブラリのロード、シンボル解決
  - 機能: ELFローダー、スタブ生成

- **GPU/Liverpool**: GPUエミュレーション
  - 場所: `src/video_core/amdgpu/`
  - 役割: AMD Liverpool GPUのエミュレーション
  - 機能: コマンドバッファ処理、PM4パケット解析

- **Shader Recompiler**: シェーダー変換器
  - 場所: `src/shader_recompiler/`
  - 役割: AMD GCNシェーダーをSPIR-Vに変換
  - 機能: シェーダー解析、中間表現、最適化

- **Kernel**: カーネルAPI実装
  - 場所: `src/core/libraries/kernel/`
  - 役割: PS4 FreeBSDカーネルAPIのHLE実装
  - 機能: スレッド管理、メモリ管理、同期プリミティブ

### 技術スタック
#### コア技術
- **言語**: C++23（最新のC++標準を使用）
- **グラフィックスAPI**: Vulkan 1.3
- **GUIフレームワーク**: Qt 6.8.2+

- **主要ライブラリ**: 
  - Vulkan SDK: グラフィックスレンダリング
  - SDL3: ウィンドウ管理、入力処理、オーディオ
  - FFmpeg: ビデオデコーディング
  - libcurl: ネットワーク機能
  - zlib-ng: 高速圧縮・展開
  - fmt: フォーマット文字列処理
  - MoltenVK: macOSでのVulkanサポート

#### 開発・運用ツール
- **ビルドツール**: 
  - CMake 3.16+（クロスプラットフォームビルド）
  - Clang 18推奨（Linux）、MSVC/Clang（Windows）、Xcode 16（macOS）
  - CMakeプリセットによる設定管理

- **テスト**: ユニットテスト、ゲーム互換性テスト
- **CI/CD**: GitHub Actionsによる自動ビルド
- **デプロイ**: GitHub Releasesでのバイナリ配布

### 設計パターン・手法
- **ハイレベルエミュレーション（HLE）**: システムライブラリをネイティブ実装で置き換え
- **シングルトン**: Config、Memory等のグローバルマネージャー
- **ファクトリー**: シェーダープログラムの生成
- **オブザーバー**: イベント通知システム
- **テンプレートメタプログラミング**: 型安全なインターフェース

### データフロー・処理フロー
1. **ゲーム起動フロー**
   - eboot.binファイルの読み込み
   - ELFヘッダー解析とメモリマッピング
   - 依存ライブラリの動的ロード
   - エントリポイントの実行

2. **GPUコマンド処理**
   - PM4コマンドバッファの受信
   - コマンドのパースと実行
   - GCNシェーダーのコンパイル
   - Vulkan API呼び出しへの変換

3. **シェーダー変換フロー**
   - GCNバイトコードの解析
   - 中間表現（IR）への変換
   - 最適化パス
   - SPIR-Vコード生成

## API・インターフェース
### 公開API
#### コマンドラインインターフェース
- 目的: ゲームの起動と設定
- 使用例:
```bash
# 基本的な使用法
./shadPS4 [OPTIONS] <game-path>

# オプション
-g, --game <path|ID>          # ゲームパスまたはID
-p, --patch <file>            # パッチファイル適用
-f, --fullscreen <true|false> # フルスクリーンモード
-i, --ignore-game-patch       # 自動パッチ無効化
--add-game-folder <folder>    # ゲームフォルダ追加
--set-addon-folder <folder>   # アドオンフォルダ設定
-- ...                        # ゲームへの引数
```

### 設定・カスタマイズ
#### 設定ファイル
```toml
# user/config.toml

[General]
# ログ設定
logType = "sync"              # sync/async
logFilter = "Core:Warning"    # モジュール別ログレベル

[GPU]
screenWidth = 1920            # 内部解像度
screenHeight = 1080
vblankDiv = 1                 # FPS制御（1=60fps, 2=30fps）
dumpShaders = false           # シェーダーダンプ

[Vulkan]
validation = false            # 検証レイヤー
rdocEnable = false            # RenderDocサポート

[Features]
trophyNotification = true     # トロフィー通知
enableDiscordRPC = false      # Discord Rich Presence

[Paths]
saveDataPath = "user/game_data/" # セーブデータ保存先
```

#### 拡張・カスタマイズ
- **シェーダーパッチ**: `user/patches/`にゲーム固有のパッチを配置
- **カスタムコントローラー設定**: config.tomlの[Input]セクション
- **デバッグ機能**: RenderDoc統合、シェーダーダンプ
- **ログフィルター**: モジュール別の詳細なログ制御

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ネイティブx86-64実行による高速動作
- Vulkanを使用した効率的なGPUエミュレーション
- 最適化手法:
  - シェーダーキャッシング
  - JITコンパイルによるシェーダー変換
  - マルチスレッド化
  - VBlank分割によるFPS制御

### スケーラビリティ
- CPU: x86-64-v3以上のプロセッサーで最適化
- GPU: Vulkan 1.3対応のモダンGPUで良好なパフォーマンス
- メモリ: ゲームによって異なるが、8GB以上推奨

### 制限事項
- 現在はx86-64アーキテクチャのみサポート（ARM64未対応）
- macOSではIntel MacのGPUに問題あり
- ゲーム互換性は発展途上（完璧な動作保証はなし）
- 一部のシステム機能が未実装

## 評価・所感
### 技術的評価
#### 強み
- 活発な開発と高速な進化
- Vulkanを使用した現代的なグラフィックス実装
- クリーンなコードベースとモジュラー設計
- マルチプラットフォーム対応
- 幅広いシステムライブラリのHLE実装
- オープンソースでコミュニティが活発

#### 改善の余地
- まだ初期開発段階で互換性が限定的
- ARM64アーキテクチャのサポートがない
- 一部のシステム機能が未実装
- パフォーマンス最適化の余地

### 向いている用途
- PS4ゲームの保存やアーカイブ
- ゲーム開発者によるテスト・デバッグ
- 教育・研究目的でのシステム分析
- ホームブリューゲームの開発・テスト

### 向いていない用途
- 商用利用や海賊版ゲームの実行
- パフォーマンスが重要な競技ゲーミング
- ネットワーク機能を多用するゲーム
- ARMベースのデバイスでの使用

### 総評
shadPS4は、PlayStation 4エミュレーションにおいて重要なマイルストーンを達成しています。まだ初期段階でありながら、Bloodborneのような人気タイトルが動作することは、プロジェクトの将来性を示しています。活発な開発チームとコミュニティにより、今後も互換性とパフォーマンスの向上が期待できます。オープンソースプロジェクトとして、ゲーム保存、教育、研究目的において重要な役割を果たしています。