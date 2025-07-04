# リポジトリ解析: LadybirdBrowser/ladybird

## 基本情報
- リポジトリ名: LadybirdBrowser/ladybird
- 主要言語: C++
- スター数: 44,554
- フォーク数: 1,901
- 最終更新: アクティブに開発中
- ライセンス: BSD 2-Clause "Simplified" License
- トピックス: web-browser, browser-engine, independent-browser, web-standards, cross-platform

## 概要
### 一言で言うと
既存のブラウザエンジンに依存せず、Webプラットフォーム標準を独自に実装した真に独立したWebブラウザ。

### 詳細説明
Ladybirdは、Chromium/Blinkのシェルでも、WebKitのポートでも、Firefoxのフォークでもない、完全にゼロから開発されたWebブラウザです。

2019年にSerenityOS向けのHTMLビューアーとして始まり、2022年に独立プロジェクトとしてスピンオフしました。Ladybird Browser Initiative（501(c)(3)非営利団体）により運営され、デフォルト検索契約やユーザーマネタイゼーションから資金を受け取らないことを約束しています。

現在はプレアルファ段階で、2026年のアルファリリース、2028年の安定版リリースを目指しています。

### 主な特徴
- **完全独立実装**: 既存ブラウザエンジンのコードを一切使用せず
- **マルチプロセスアーキテクチャ**: タブごとに独立したWebContentプロセス
- **積極的なサンドボックス化**: 各プロセスは最小限の権限で動作
- **仕様準拠開発**: Web標準仕様のアルゴリズムを正確に実装
- **非営利運営**: 広告や検索契約による収益化を永久に拒否
- **最新のWeb技術対応**: WebGL、WebAssembly、Service Worker等を実装
- **クロスプラットフォーム**: Linux、macOS、Windows（WSL2）対応

## 使用方法
### インストール
#### 前提条件
- C++23対応コンパイラ（gcc-14またはclang-20）
- CMake 3.25以上
- Qt6開発パッケージ
- nasm
- 各種開発ツール（autoconf、ninja等）

#### インストール手順
```bash
# Ubuntu/Debianの場合
sudo apt install autoconf autoconf-archive automake build-essential \
  ccache cmake curl fonts-liberation2 git libgl1-mesa-dev nasm \
  ninja-build pkg-config qt6-base-dev qt6-tools-dev-tools \
  qt6-wayland tar unzip zip

# ソースからビルド
git clone https://github.com/LadybirdBrowser/ladybird.git
cd ladybird
./Meta/ladybird.py run
```

### 基本的な使い方
#### 基本的な起動
```bash
# ブラウザの起動
./Meta/ladybird.py run

# 特定のURLを開く
./Meta/ladybird.py run https://example.com

# デバッグモードでの起動
BUILD_PRESET=Debug ./Meta/ladybird.py run
```

#### JavaScript REPLの使用
```bash
# JavaScript REPLの起動
./Meta/ladybird.py run js

# 対話的なJavaScriptシェルでのテスト
> const greeting = "Hello from Ladybird!";
> console.log(greeting);
Hello from Ladybird!
```

### 高度な使い方
```bash
# GDBでのデバッグ
./Meta/ladybird.py gdb ladybird

# テストの実行
./Meta/ladybird.py test

# 特定のテストスイートの実行
./Meta/ladybird.py test LibWeb

# ベンチマークの実行
./Meta/ladybird.py benchmark
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要とクイックスタート
- **Documentation/BuildInstructionsLadybird.md**: 詳細なビルド手順
- **Documentation/ProcessArchitecture.md**: マルチプロセスアーキテクチャの説明
- **Documentation/FAQ.md**: よくある質問と回答
- **Documentation/GettingStartedContributing.md**: 貢献者向けガイド
- **CONTRIBUTING.md**: 貢献ガイドラインとプロジェクトガバナンス
- **ISSUES.md**: 詳細なissue報告ガイドライン

### コミュニティ
- **Discord**: https://discord.gg/nvfjVJ4Svh - 開発議論とサポート
- **Webサイト**: https://ladybird.org/ - 公式サイト
- **GitHub**: https://github.com/LadybirdBrowser/ladybird - ソースコードとissue管理

### チュートリアル・ガイド
- Web Platform Tests (WPT)の実行方法
- ブラウザエンジン開発の学習リソース
- コミュニティメンバーによるブログ投稿と講演

## 技術的詳細
### アーキテクチャ
#### 全体構造
マルチプロセスアーキテクチャを採用し、以下のプロセスで構成：
- **Browser**: メインUIプロセス
- **WebContent**: 各タブごとのレンダラープロセス（HTML/CSS/JSエンジンをホスト）
- **RequestServer**: ネットワーク通信を処理
- **ImageDecoder**: 画像デコードを隔離実行

#### ディレクトリ構成
```
ladybird/
├── AK/                    # Ladybird標準ライブラリ
├── Libraries/             # コアライブラリ群
│   ├── LibWeb/           # Webレンダリングエンジン
│   ├── LibJS/            # JavaScriptエンジン
│   ├── LibWasm/          # WebAssembly実装
│   ├── LibCore/          # イベントループ、OS抽象化層
│   ├── LibGfx/           # 2Dグラフィックスライブラリ
│   ├── LibCrypto/        # 暗号化プリミティブ
│   ├── LibTLS/           # TLS実装
│   └── ...               # その他のライブラリ
├── Services/              # バックグラウンドサービス
├── UI/                    # プラットフォーム別UI
└── Tests/                 # テストスイート
```

#### 主要コンポーネント
- **LibWeb**: Webレンダリングエンジン
  - 場所: `Libraries/LibWeb/`
  - 役割: HTML/CSSパース、DOM構築、レイアウト、ペイント
  - 主要機能: Web標準の完全な実装

- **LibJS**: JavaScriptエンジン
  - 場所: `Libraries/LibJS/`
  - 役割: JavaScriptの解析と実行
  - 特徴: ES2024相当の機能をサポート

- **LibCore**: コアユーティリティ
  - 場所: `Libraries/LibCore/`
  - 役割: イベントループ、ファイルシステム抽象化
  - 特徴: プラットフォーム中立的なAPI

### 技術スタック
#### コア技術
- **言語**: C++23（一部Swiftへ移行中）
- **グラフィックス**: Skia（Googleの2Dグラフィックスライブラリ）
- **ネットワーク**: libcurl、OpenSSL
- **主要ライブラリ**: 
  - Skia: レンダリングエンジン
  - FFmpeg: メディア再生
  - ICU: 国際化サポート
  - HarfBuzz: テキストシェーピング
  - OpenSSL: TLS/SSL通信
  - libcurl: HTTP通信
  - 各種画像フォーマットライブラリ

#### 開発・運用ツール
- **ビルドツール**: CMake 3.25+、Ninja
- **パッケージマネージャ**: vcpkg（依存関係管理）
- **テスト**: Web Platform Tests (WPT)、独自テストスイート
- **CI/CD**: GitHub Actions、Azure Pipelines
- **UIフレームワーク**: Qt6（Linux/Windows）、AppKit（macOS）

### 設計パターン・手法
- **マルチプロセスアーキテクチャ**: セキュリティと安定性のためのプロセス分離
- **仕様駆動開発**: Web標準仕様書のアルゴリズムを忠実に実装
- **サンドボックス化**: 各プロセスを最小権限で実行
- **モジュラー設計**: ライブラリを明確に分離した設計

### データフロー・処理フロー
1. **URL入力**: ユーザーがURLを入力またはリンクをクリック
2. **ネットワークリクエスト**: RequestServerプロセスがHTTP/HTTPS通信を処理
3. **HTMLパース**: WebContentプロセスがHTMLを解析しDOMを構築
4. **CSSパースとスタイル計算**: CSSルールを解析し、各要素のスタイルを計算
5. **レイアウト**: ボックスモデルに基づいて要素を配置
6. **JavaScript実行**: LibJSエンジンがJavaScriptコードを実行
7. **レンダリング**: Skiaを使用して画面に描画
8. **画像デコード**: ImageDecoderプロセスが各種画像フォーマットを処理

## API・インターフェース
### 実装されているWeb技術
#### Web標準API
- HTML5、CSS3、JavaScript（ES2024相当）
- DOM、イベント処理
- WebGL、WebGPU（開発中）
- WebAssembly
- Service Worker、Web Worker
- IndexedDB、Web Storage
- Fetch API、WebSocket
- WebAudio、WebRTC（部分的）
- SVG、Canvas、MathML

### 設定・カスタマイズ
#### ビルド設定
```cmake
# CMakePresets.jsonでの設定例
{
  "version": 6,
  "configurePresets": [
    {
      "name": "default",
      "binaryDir": "${sourceDir}/Build/ladybird",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Release",
        "ENABLE_QT": "ON"
      }
    }
  ]
}
```

#### 拡張・プラグイン開発
現在はエクステンションAPIが開発中で、将来的には以下が計画されています：
- WebExtensions APIの部分的サポート
- カスタムテーマとUI拡張
- プラグインアーキテクチャ

## パフォーマンス・スケーラビリティ
### 現在の状態
- **プレアルファ段階**: 日常使用には未対応
- **パフォーマンス最適化**: 現時点では優先事項ではない
- **Web Platform Testsの合格率**: 継続的に向上中
- **JavaScript JITコンパイラ**: 未実装（インタープリタのみ）

### スケーラビリティ
- **マルチプロセスアーキテクチャ**: タブごとの独立プロセスでスケール
- **サンドボックス化**: セキュリティと安定性を優先
- **メモリ効率**: 将来的には他のブラウザより少ないメモリ使用を目指す

### 制限事項
- **セキュリティ機能**: 多くが未実装
- **Web API**: 一部が未実装または部分実装
- **エクステンション**: 開発中
- **プラットフォームサポート**: Windowsネイティブ、Androidが不完全

## 評価・所感
### 技術的評価
#### 強み
- **完全独立実装**: 既存エンジンの制約から自由で、技術的な負債がない
- **仕様準拠の厳密な実装**: Web標準の正確な実装を目指す
- **クリーンなコードベース**: 1/50のコード量でChromium相当の機能を目指す
- **非営利運営**: 利益相反がなく、純粋な技術的判断が可能
- **活発なコミュニティ**: 透明な開発プロセスとオープンな議論

#### 改善の余地
- **プレアルファ段階**: 実用レベルに達していない
- **JavaScript性能**: JITコンパイラ未実装
- **セキュリティ機能**: 多くの保護機能が未実装
- **プラットフォームサポート**: Windowsネイティブ、Androidが不完全

### 向いている用途
- **ブラウザエンジン開発の学習**: ゼロからの実装を学ぶ最適な教材
- **Web標準の理解と研究**: 仕様に忠実な実装の参考
- **独立ブラウザエコシステムへの貢献**: オープンソース開発の実践
- **将来的な代替ブラウザ**: 2028年以降の選択肢

### 向いていない用途
- **現時点での日常使用**: 多くの機能が未実装または不完全
- **商用利用や本番環境**: プレアルファ状態
- **高度なWebアプリケーション**: 互換性の問題がある可能性
- **モバイルデバイス**: Android/iOSサポート未完成

### 総評
Ladybirdは、Webブラウザの多様性を守り、Web標準の独立した実装を提供するという重要な使命を持つプロジェクトです。現在はまだ開発初期段階ですが、既存のブラウザエンジンに依存しない真に独立した実装は技術的に大きな意義があります。非営利運営とコミュニティ主導の開発により、商業的利益に左右されない純粋な技術的判断が可能な点も評価できます。2028年の安定版リリースに向けて、今後の発展が期待されるプロジェクトです。