# リポジトリ解析: LadybirdBrowser/ladybird

## 基本情報
- リポジトリ名: LadybirdBrowser/ladybird
- 主要言語: C++
- スター数: 44,892
- フォーク数: 1,917
- 最終更新: 2025年7月（非常にアクティブに開発中）
- ライセンス: BSD 2-Clause "Simplified" License
- トピックス: web-browser, browser-engine, javascript-engine, html-parser, css-engine, independent, non-profit

## 概要
### 一言で言うと
ゼロから完全に独立して開発されている新しいWebブラウザエンジンで、Chrome/Firefox/Safariのコードを一切使わず、Web標準の仕様書から直接実装している非営利プロジェクト。

### 詳細説明
Ladybirdは、現在のWebブラウザ市場がChromiumに大きく依存している問題に対処するために生まれたプロジェクトです。Ladybird Browser Initiativeという501(c)(3)非営利団体によって運営され、寄付とスポンサーシップによって資金提供されています。ユーザーのデータを収益化しないことを明言しており、真に独立したWebブラウザの開発を目指しています。

### 主な特徴
- **完全な独立性**: Chrome/WebKit/Firefoxのコードを一切使用せずゼロから実装
- **マルチプロセスアーキテクチャ**: タブごとに独立したレンダラープロセス
- **非営利運営**: ユーザーデータの収益化をしない
- **モダンなC++23**: 最新のC++標準を使用し、Swiftへの移行も計画
- **セキュリティ重視**: プロセス分離とサンドボックス化
- **Web標準準拠**: W3C/WHATWG仕様から直接実装
- **DevToolsサポート**: Firefox DevToolsプロトコルを実装
- **クロスプラットフォーム**: Linux、macOS、Windows (WSL2)、Unix系システム

## 使用方法
### インストール
#### 前提条件
- C++23対応コンパイラ (gcc-14またはclang-20)
- CMake 3.25以上
- Qt6 (クロスプラットフォームUI用)
- nasm (アセンブラ)
- プラットフォーム固有の依存関係

#### インストール手順
```bash
# ソースからビルド
git clone https://github.com/LadybirdBrowser/ladybird.git
cd ladybird

# 依存関係のインストール（Ubuntu/Debianの例）
sudo apt install build-essential cmake cmake-data git ninja-build \
    libgl1-mesa-dev qt6-base-dev qt6-tools-dev-tools \
    qt6-multimedia-dev qt6-wayland-dev ccache

# ビルドと実行
./Meta/ladybird.py run --debug

# リリースビルド
./Meta/ladybird.py build
./Meta/ladybird.py run
```

### 基本的な使い方
#### Hello World相当の例
```bash
# Ladybirdブラウザを起動
./Meta/ladybird.py run

# URLを指定して起動
./Meta/ladybird.py run https://example.com

# JavaScript REPLを起動
./Build/ladybird-debug/bin/js
> console.log("Hello, World!")
```

#### 実践的な使用例
```bash
# DevToolsを有効にしてブラウザを起動
./Meta/ladybird.py run --enable-developer-extras

# 特定のユーザーエージェントで起動
./Meta/ladybird.py run --user-agent "Custom/1.0"

# WebDriverモードで起動
./Build/ladybird-debug/bin/WebDriver --port 9000
```

```javascript
// JavaScriptエンジンの使用例
const js = require('./Build/ladybird-debug/bin/js');

// HTMLパーサーの使用例
const parser = new DOMParser();
const doc = parser.parseFromString('<h1>Hello</h1>', 'text/html');
```

### 高度な使い方
```cpp
// LibWebを使用した基礼組み込み例
#include <LibWeb/HTML/HTMLDocument.h>
#include <LibWeb/HTML/Parser/HTMLParser.h>
#include <LibWeb/Page/Page.h>

auto document = Web::HTML::HTMLDocument::create();
auto parser = Web::HTML::HTMLParser::create(document, html_content);
parser->run();

// DevToolsプロトコル接続
// Firefox Developer Toolsを使用してデバッグ
firefox --start-debugger-server 6080
# Ladybirdで--enable-developer-extrasオプションを使用

# テストの実行
./Meta/ladybird.py test
./Meta/ladybird.py test262  # JavaScript標準テスト
./Meta/ladybird.py wpt      # Web Platform Tests
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、ビルド手順、コミュニティ情報
- **CONTRIBUTING.md**: 貢献ガイドライン、コーディングスタイル
- **Documentation/BuildInstructionsLadybird.md**: 詳細なビルド手順
- **Documentation/FAQ.md**: よくある質問とプロジェクトの哲学
- **Documentation/ProcessArchitecture.md**: マルチプロセスアーキテクチャの説明
- **Documentation/LibWebFromLoadingToPainting.md**: Webページのレンダリングプロセス

### サンプル・デモ
- **Utilities/js.cpp**: JavaScript REPL実装
- **Utilities/wasm.cpp**: WebAssemblyインタープリタ
- **Utilities/image.cpp**: 画像デコーダーユーティリティ
- **Utilities/animation.cpp**: アニメーションテストツール
- **Utilities/test262-runner.cpp**: JavaScript標準テストランナー

### チュートリアル・ガイド
- 公式ブログ: https://ladybird.org/blog/
- Discordコミュニティ: 開発者との直接交流
- YouTubeチャンネル: Andreas Klingによる開発動画

## 技術的詳細
### アーキテクチャ
#### 全体構造
マルチプロセスアーキテクチャを採用し、セキュリティと安定性を重視:

```
┌─────────────────┐
│ Browser Process │ (UI、タブ管理)
└──────┬────────┘
        │
┌───────▼────────┐  ┌───────────────┐
│WebContent Process│  │RequestServer  │
│ (レンダラー)      │  │ (ネットワーク)   │
└─────────────────┘  └───────────────┘
┌─────────────────┐  ┌───────────────┐
│ImageDecoder      │  │WebDriver      │
│ (画像処理)       │  │ (自動化)       │
└─────────────────┘  └───────────────┘
```

#### ディレクトリ構成
```
ladybird/
├── AK/               # カスタム標準ライブラリ
├── Libraries/        # コアライブラリ
│   ├── LibWeb/      # Webレンダリングエンジン
│   ├── LibJS/       # JavaScriptエンジン
│   ├── LibWasm/     # WebAssembly実装
│   ├── LibCore/     # イベントループ、OS抽象化
│   ├── LibGfx/      # 2Dグラフィックス
│   ├── LibHTTP/     # HTTP/1.1クライアント
│   ├── LibTLS/      # TLS実装
│   ├── LibCrypto/   # 暗号化プリミティブ
│   └── LibIPC/      # プロセス間通信
├── UI/               # UI実装
│   ├── AppKit/      # macOSネイティブUI
│   ├── Qt/          # QtベースUI
│   └── Android/     # AndroidUI（現在壊れている）
├── Services/         # サービスプロセス
├── Tests/            # テストスイート
└── Utilities/        # ユーティリティツール
```

#### 主要コンポーネント
- **LibWeb**: Webレンダリングエンジン
  - 場所: `Libraries/LibWeb/`
  - 機能: HTML/CSS/DOM実装、レイアウト、ペインティング
  - インターフェース: Document, Element, Window

- **LibJS**: JavaScriptエンジン
  - 場所: `Libraries/LibJS/`
  - 機能: ES2023+対応、バイトコードインタープリタ
  - インターフェース: VM, Interpreter, Object

- **AK**: Andreas KlingのカスタムSTL
  - 場所: `AK/`
  - 機能: コンテナ、スマートポインタ、ユーティリティ
  - 特徴: 組み込み環境対応、高性能

### 技術スタック
#### コア技術
- **言語**: C++23 (モダンC++の最新機能を活用)
- **フレームワーク**: 
  - Qt6 (クロスプラットフォームUI)
  - AppKit (macOSネイティブUI)
  - カスタムフレームワーク (AKライブラリ)
- **主要ライブラリ**: 
  - nasm: アセンブリコードのため
  - OpenSSL: TLS/SSLサポート (LibTLSのバックエンド)
  - 独自実装: ほとんどの機能をゼロから実装

#### 開発・運用ツール
- **ビルドツール**: 
  - CMake 3.25+ (ビルドシステム)
  - Ninja (高速ビルド)
  - ccache (コンパイルキャッシュ)
  - Meta/ladybird.py (ビルドスクリプト)
- **テスト**: 
  - 単体テスト: LibTestフレームワーク
  - Web Platform Tests (WPT)
  - test262 (JavaScript標準テスト)
  - レイアウトテスト
  - Sanitizers (ASAN, UBSAN)
- **CI/CD**: 
  - GitHub Actions (マルチプラットフォームCI)
  - ナイトリービルド
  - ベンチマーク自動実行
- **デプロイ**: 
  - バイナリ配布 (将来予定)
  - 現在はソースからビルドのみ

### 設計パターン・手法
1. **マルチプロセスアーキテクチャ**: セキュリティと安定性のためのプロセス分離
2. **メッセージパッシング**: LibIPCを使用したプロセス間通信
3. **抽象化**: プラットフォーム固有機能の抽象化
4. **RAII**: リソース管理にスマートポインタを活用
5. **ビジターパターン**: DOMトリーの操作

### データフロー・処理フロー
**Webページのロードから描画まで**:
1. URL入力 → Browser Process
2. RequestServerへのネットワークリクエスト
3. HTML/CSS/JSのダウンロード
4. WebContent ProcessでHTMLパース
5. DOMツリー構築
6. CSSパースとスタイル計算
7. レイアウト計算
8. JavaScript実行 (LibJS)
9. ペイントコマンド生成
10. GPU/ソフトウェアレンダリング

## API・インターフェース
### 公開API
#### DevTools Server
- 目的: ブラウザのデバッグと検査
- Firefox DevToolsプロトコルを実装
- 使用例:
```bash
# Firefox Developer Toolsを使用して接続
firefox --start-debugger-server 6080
# Ladybirdを--enable-developer-extrasで起動
```

#### WebDriver API
- 目的: ブラウザ自動化
- W3C WebDriver標準実装
- Seleniumなどのツールと互換

#### ライブラリインターフェース
- LibWeb: DOM操作、レンダリングAPI
- LibJS: JavaScriptランタイムAPI
- LibCore: イベントループ、ファイルI/O

### 設定・カスタマイズ
#### 設定ファイル
```cpp
// CMakeLists.txtでの設定例
set(ENABLE_ADDRESS_SANITIZER ON)  # ASAN有効化
set(ENABLE_UNDEFINED_SANITIZER ON) # UBSAN有効化
set(BUILD_LAGOM ON)  # ホストビルド有効化
```

#### 拡張・プラグイン開発
現在は伝統的なブラウザ拡張機能は未実装。ただし:
- モジュラーなライブラリ構造により拡張が容易
- DevToolsプロトコルを使用したツール統合が可能
- カスタムUIの実装が可能 (Qt/AppKit)

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ベンチマーク結果: 
  - JavaScript: JIT未実装のため現在は低速
  - レンダリング: 基本的な最適化のみ
  - メモリ使用量: 数百MB程度と軽量
- 最適化手法:
  - カスタムSTL (AK)による高速化
  - ゼロコピー文字列操作
  - スマートポインタによるメモリ管理

### スケーラビリティ
**マルチプロセスアーキテクチャ**:
- タブごとに独立プロセス
- プロセス間通信のオーバーヘッド
- 将来的にはGPUアクセラレーション対応予定

### 制限事項
**技術的な制限**:
- JITコンパイラ未実装
- GPUアクセラレーション未対応
- 多くのWeb APIが未実装
- HTTP/2サポートなし

**運用上の制限**:
- プレアルファ版（日常使用には不適）
- WindowsはWSL2経由のみ
- Android版は現在動作しない
- 拡張機能システム未実装

## 評価・所感
### 技術的評価
#### 強み
- **真の独立性**: 既存ブラウザのコードを一切使わない完全なゼロ実装
- **クリーンなアーキテクチャ**: マルチプロセス設計による優れたセキュリティ
- **モダンC++**: C++23とSwiftへの移行計画
- **活発な開発**: 非常にアクティブなコミュニティと定期的な更新
- **非営利モデル**: ユーザーデータの収益化をしない
- **標準準拠**: W3C/WHATWG仕様からの直接実装
- **教育的価値**: ブラウザ内部を学ぶのに最適

#### 改善の余地
- **プレアルファ状態**: 日常使用には未成熟
- **パフォーマンス**: JIT未実装、最適化不足
- **機能ギャップ**: 多くのWeb機能が未実装
- **プラットフォームサポート**: WindowsはWSL2のみ、Android壊れている
- **小規模チーム**: リソースが主要ブラウザと比較して限定的

### 向いている用途
- **ブラウザエンジンの研究・学習**: クリーンな実装が学習に最適
- **プライバシー重視のユーザー**: データ収益化しない方針
- **セキュリティ重視の用途**: 強固なサンドボックス化
- **組み込みシステム**: 軽量でカスタマイズ可能
- **開発者ツール**: 特定用途のWebビューア

### 向いていない用途
- **日常のメインブラウザ**: 機能不足、パフォーマンス不足
- **エンタープライズ利用**: 成熟度が不十分
- **複雑なWebアプリ**: 多くのAPIが未実装
- **モバイルブラウジング**: Android版が動作しない

### 総評
Ladybirdは、ブラウザエンジンの多様性を保つための重要なプロジェクトであり、Chromiumの対抑馬となる可能性を秘めています。ゼロからの新しいブラウザエンジン開発が可能であることを証明し、優れたエンジニアリングプラクティス、クリーンなアーキテクチャ、真の独立性を示しています。

現在はプロダクション使用には適しませんが、その教育的価値とコミュニティ主導の開発は、ブラウザの内部動作を理解したい開発者にとって特に興味深いものです。2028年の安定版リリースを目指しており、将来的には真のブラウザ選択肢となる可能性を秘めています。