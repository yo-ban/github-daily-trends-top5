# リポジトリ解析: gitleaks/gitleaks

## 基本情報
- リポジトリ名: gitleaks/gitleaks
- 主要言語: Go
- スター数: 21,769
- フォーク数: 1,700
- 最終更新: アクティブに開発中
- ライセンス: MIT License
- トピックス: セキュリティ、シークレット検出、git、スキャナー、SAST

## 概要
### 一言で言うと
Gitleaksは、gitリポジトリ、ファイル、標準入力からパスワード、APIキー、トークンなどの秘密情報を検出するための高速かつ軽量なセキュリティスキャナーです。

### 詳細説明
Gitleaksは、ソースコードに誤ってコミットされた秘密情報（認証情報、APIキー、秘密鍵など）を検出するためのツールです。開発者やセキュリティチームが、コードベースからセンシティブな情報の漏洩を防ぐために使用します。Aho-Corasickアルゴリズムを使用した高速なパターンマッチングと、150以上の事前定義されたルールにより、多様な秘密情報を効率的に検出できます。

### 主な特徴
- 150以上の事前定義されたルールによる包括的な検出
- 高速なAho-Corasickアルゴリズムによる効率的なスキャン
- 複数の入力ソース対応（git履歴、ディレクトリ、標準入力）
- 柔軟なカスタムルール設定（TOML形式）
- 多様な出力形式（JSON、CSV、SARIF、JUnit、カスタムテンプレート）
- Pre-commitフックとGitHub Actionの公式サポート
- ベースライン機能による既知の検出結果の除外
- エンコードされたコンテンツのデコード機能（Base64、Hex、URLエンコード）
- アーカイブファイルのスキャン対応
- 並行処理による高速スキャン

## 使用方法
### インストール
#### 前提条件
- Go 1.23.8以上（ソースからのビルドの場合）
- Git（gitリポジトリをスキャンする場合）

#### インストール手順
```bash
# 方法1: Homebrew (macOS)
brew install gitleaks

# 方法2: Docker
docker pull zricethezav/gitleaks:latest
# または
docker pull ghcr.io/gitleaks/gitleaks:latest

# 方法3: ソースからビルド
git clone https://github.com/gitleaks/gitleaks.git
cd gitleaks
make build
```

### 基本的な使い方
#### Hello World相当の例
```bash
# カレントディレクトリをスキャン
gitleaks dir .

# gitリポジトリの完全な履歴をスキャン
gitleaks git .

# 最新のコミットのみスキャン
gitleaks git . --log-opts="-1"
```

#### 実践的な使用例
```bash
# JSON形式でレポートを出力
gitleaks git https://github.com/example/repo --report-format json --report-path gitleaks-report.json

# カスタム設定ファイルを使用してスキャン
gitleaks git . --config custom-config.toml

# ベースラインを使用して既知の検出結果を除外
gitleaks git . --baseline-path gitleaks-baseline.json

# Pre-commitフックとして使用
gitleaks protect --staged
```

### 高度な使い方
```bash
# エンコードされたコンテンツをデコードしてスキャン（再帰的）
gitleaks dir . --decode-depth 3

# アーカイブファイル内もスキャン
gitleaks dir . --archive-paths=".*\\.(zip|tar\\.gz|7z|rar)$" --archive-depth 2

# GitHub Actionとしての設定
name: gitleaks
on: [pull_request, push, workflow_dispatch]
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクトの概要、インストール方法、基本的な使用方法
- **CONTRIBUTING.md**: 貢献者向けガイドライン
- **config/gitleaks.toml**: デフォルト設定ファイル（150+のルール定義）
- **GitHub Wiki**: https://github.com/gitleaks/gitleaks/wiki

### サンプル・デモ
- **report_templates/**: HTMLレポートテンプレート（Basic、Windows 98、XPテーマなど）
- **testdata/config/**: 様々な設定ファイルのサンプル
- **実使用例**: GitLab、GoReleaser、Trendyolなど多数のプロジェクトで採用

### チュートリアル・ガイド
- GitHub Actionの公式マーケットプレイス: https://github.com/marketplace/actions/gitleaks
- Pre-commitフックの設定方法
- カスタムルールの作成方法

## 技術的詳細
### アーキテクチャ
#### 全体構造
Gitleaksはコマンドパターンとストラテジーパターンを組み合わせたアーキテクチャを採用しています。コマンドラインインターフェースはCobraフレームワークを使用し、コアの検出エンジンはAho-Corasickアルゴリズムをベースとした高速パターンマッチングを実装しています。

#### ディレクトリ構成
```
gitleaks/
├── cmd/                    # CLIコマンドと設定
│   ├── git.go             # Gitリポジトリスキャン
│   ├── directory.go       # ディレクトリ/ファイルスキャン
│   ├── stdin.go           # 標準入力スキャン
│   ├── root.go            # メインコマンド設定
│   └── generate/          # ルール生成ユーティリティ
├── config/                # 設定ハンドリング
│   ├── config.go          # 設定ローダー
│   ├── gitleaks.toml      # デフォルト設定(150+ルール)
│   └── rule.go            # ルール定義
├── detect/                # コア検出ロジック
│   ├── detect.go          # メイン検出エンジン
│   ├── baseline.go        # ベースライン処理
│   ├── codec/             # エンコーディング/デコーディング
│   └── location.go        # 検出結果の位置情報
├── report/                # レポート生成
│   ├── json.go            # JSONレポート
│   ├── csv.go             # CSVレポート
│   ├── sarif.go           # SARIFレポート
│   └── template.go        # カスタムテンプレート
└── sources/               # 入力ソース抽象化
    ├── git.go             # Git関連操作
    ├── files.go           # ファイルシステム操作
    └── fragment.go        # データフラグメント
```

#### 主要コンポーネント
- **Detector**: メインスキャンエンジン
  - 場所: `detect/detect.go`
  - 依存: Aho-Corasick trie、ルールエンジン
  - インターフェース: `Detect()`, `DetectWithContext()`

- **Config**: 設定管理システム
  - 場所: `config/config.go`
  - 依存: Viper、TOMLパーサー
  - インターフェース: `LoadConfig()`, `BuildConfig()`

- **Sources**: 入力ソース抽象化
  - 場所: `sources/`ディレクトリ
  - 依存: go-git、ファイルシステムAPI
  - インターフェース: `Source`インターフェース

- **Report**: レポート生成システム
  - 場所: `report/`ディレクトリ
  - 依存: テンプレートエンジン（Sprig）
  - インターフェース: 各フォーマットごとの`Write()`メソッド

### 技術スタック
#### コア技術
- **言語**: Go 1.23.8（ジェネリクス、並行処理、インターフェースを活用）
- **フレームワーク**: 
  - Cobra: CLIフレームワーク
  - Viper: 設定管理
- **主要ライブラリ**: 
  - aho-corasick (v1.1.3): 高速文字列マッチング
  - go-gitdiff (v0.9.0): Git diff解析
  - zerolog (v1.33.0): 高速ロギング
  - sprig (v3.3.0): テンプレート関数
  - go-git (v5.12.0): Git操作
  - 圧縮ライブラリ群: 7zip, xz, zstd, bzip2など

#### 開発・運用ツール
- **ビルドツール**: 
  - Makefileベースのビルドシステム
  - Go Modulesによる依存関係管理
  - ldflagsでバージョン情報を埋め込み
- **テスト**: 
  - Go標準テストフレームワーク
  - レースコンディション検出（-raceフラグ）
  - 大量のテストデータとテストケース
- **CI/CD**: 
  - GitHub Actionsによる自動テスト（Ubuntu、Windows）
  - マルチアーキテクチャ対応のリリースビルド
  - Dockerイメージの自動ビルド・プッシュ
- **デプロイ**: 
  - Docker Hub、GitHub Container Registry
  - GitHub Releasesでのバイナリ配布
  - Homebrew、Snapなどのパッケージマネージャー

### 設計パターン・手法
- **コマンドパターン**: Cobraを使用したCLI構築
- **ストラテジーパターン**: 異なるスキャンソースの抽象化
- **ファクトリパターン**: レポートフォーマットの生成
- **セマフォグラウプ**: 並行処理の制御（デフォルト40 goroutines）
- **プラグインパターン**: ルールの拡張・継承システム

### データフロー・処理フロー
1. **入力取得**: 
   - Gitリポジトリ: コミット履歴を反復
   - ファイルシステム: ディレクトリを再帰的に走査
   - 標準入力: ストリーム読み取り

2. **前処理**:
   - アーカイブファイルの展開
   - エンコーディング検出とデコード
   - ファイルサイズチェック

3. **検出処理**:
   - キーワードによる前フィルタリング
   - Aho-Corasick trieでの高速マッチング
   - 正規表現による精密マッチング
   - エントロピー計算による検証

4. **後処理**:
   - ベースラインとの比較
   - .gitleaksignoreの適用
   - 重複除去

5. **レポート生成**:
   - 検出結果のフォーマット
   - テンプレート適用
   - ファイル出力または標準出力

## API・インターフェース
### 公開API
#### CLIコマンド
- 目的: 様々なソースからの秘密情報検出
- 使用例:
```bash
# Gitリポジトリのスキャン
gitleaks git [repository] [flags]

# ディレクトリのスキャン
gitleaks dir [directory] [flags]

# 標準入力のスキャン
cat file.txt | gitleaks stdin [flags]
```

### 設定・カスタマイズ
#### 設定ファイル
```toml
# .gitleaks.tomlの例
title = "Custom Gitleaks Config"

# グローバル設定
[allowlists]
paths = [
  '''gitleaks\\.toml''',
  '''test/.*'''
]

# カスタムルールの定義
[[rules]]
id = "my-custom-rule"
description = "Custom API key detection"
regex = '''(?i)custom[_-]?api[_-]?key[[:space:]]*[:=][[:space:]]*['"][0-9a-zA-Z]{32,}['"]'''
secretGroup = 1
entropy = 4.5
keywords = ["custom", "api", "key"]
tags = ["api", "custom"]

# 既存ルールの拡張
[extend]
path = "gitleaks.toml"
[[rules]]
id = "github-pat"
keywords = ["ghp_", "github"]
```

#### 拡張・プラグイン開発
**ルールの拡張**:
- 既存ルールの継承とオーバーライド
- 新規ルールの追加
- キーワード、正規表現、エントロピーのカスタマイズ

**統合オプション**:
- Pre-commitフック
- GitHub Action
- GitLab CI/CD
- CI/CDパイプラインへの組み込み

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ベンチマーク結果: 
  - Aho-CorasickアルゴリズムによるO(n)の検索時間
  - 大規模リポジトリでも数分でスキャン完了
  - メモリ使用量はファイルサイズに比例
- 最適化手法: 
  - キーワードによる前フィルタリング
  - 並行処理（セマフォグラウプ）
  - ファイルサイズ制限による大きなファイルのスキップ
  - プロファイリングサポート（CPU、メモリ、トレース）

### スケーラビリティ
- **並行処理**: デフォルト40 goroutines、調整可能
- **メモリ効率**: ストリーミング処理による低メモリ使用
- **大規模リポジトリ**: 履歴全体または特定コミット範囲のスキャン
- **ネットワーク利用**: リモートGitリポジトリの直接スキャン

### 制限事項
- **技術的な制限**:
  - バイナリファイルはスキャン対象外
  - 暗号化されたコンテンツは検出不可
  - 誤検知の可能性（ルールの調整が必要）
- **運用上の制限**:
  - 初回スキャン時は大量の検出結果が出る可能性
  - ルールのカスタマイズにはTOML形式の理解が必要
  - ベースラインの管理が必要

## 評価・所感
### 技術的評価
#### 強み
- **高速なパフォーマンス**: Aho-Corasickアルゴリズムと並行処理による優れた速度
- **包括的なルールセット**: 150以上の事前定義ルールで即座に使用可能
- **柔軟なカスタマイズ**: TOMLベースの設定で簡単にルール追加・変更
- **優れた統合性**: Pre-commit、GitHub Action、CI/CDパイプラインへの簡単な組み込み
- **成熟したエコシステム**: GitLab等大手プラットフォームでの採用実績

#### 改善の余地
- **誤検知の削減**: よりコンテキストを考慮した検出ロジック
- **UI/UXの改善**: インタラクティブな結果表示や修正支援
- **プログラマティックAPI**: Goライブラリとしての提供

### 向いている用途
- **CI/CDパイプラインでの自動セキュリティチェック**
- **ソースコード監査・コンプライアンス確認**
- **開発者のローカル環境での事前チェック**
- **セキュリティ監査や侵入テストの一環**
- **SAST（静的アプリケーションセキュリティテスト）ツールチェーンの一部**

### 向いていない用途
- **完全なセキュリティソリューションとしての単独使用**
- **動的なセキュリティテストやランタイム監視**
- **暗号化されたコンテンツの解析**
- **バイナリファイル内の秘密情報検出**

### 総評
Gitleaksは、ソースコードからの秘密情報漏洩を防ぐための成熟した、高速かつ実用的なツールです。特に開発プロセスの早い段階での統合が容易で、シフトレフトのセキュリティ実践に大きく貢献します。Aho-Corasickアルゴリズムの採用や、柔軟な設定システムなど、技術的にも優れた設計が光ります。セキュリティ意識の高まりとともに、今後も重要性が増していくツールと言えるでしょう。