# リポジトリ解析: gitleaks/gitleaks

## 基本情報
- リポジトリ名: gitleaks/gitleaks
- 主要言語: Go
- スター数: 21,037
- フォーク数: 1,654
- 最終更新: 継続的に更新中
- ライセンス: MIT License
- トピックス: secret detection, SAST, security, DevSecOps, git security

## 概要
### 一言で言うと
Gitリポジトリ、ファイル、ディレクトリからハードコードされた秘密情報（パスワード、APIキー、トークン）を検出・防止する最も信頼されているオープンソースSASTツール。

### 詳細説明
Gitleaksは、コードベースに誤ってコミットされた機密情報を検出するための高速で軽量なツールです。正規表現ベースのルールエンジンを使用し、AWS鍵、GitHubトークン、プライベートキーなど、様々な種類の秘密情報を識別できます。CI/CDパイプラインへの統合が容易で、開発プロセスの早い段階でセキュリティリスクを発見・防止することができます。2000万以上のDockerダウンロードと85万以上のHomebrewインストールを誇る、業界標準のツールとなっています。

### 主な特徴
- 業界最高の検出率（リコール率88%）
- 高速スキャンによるCI/CD統合の最適化
- カスタマイズ可能な検出ルール
- 複数の出力形式（JSON、CSV、SARIF、JUnit）
- プリコミットフックとの統合サポート

## 使用方法
### インストール
#### 前提条件
- Go 1.21以上（ソースからビルドする場合）
- Git（リポジトリスキャンの場合）
- Docker（コンテナ使用の場合）

#### インストール手順
```bash
# 方法1: Homebrew (macOS/Linux)
brew install gitleaks

# 方法2: Docker
docker pull zricethezav/gitleaks:latest
docker run -v "${PWD}:/path" zricethezav/gitleaks:latest detect --source="/path"

# 方法3: Go Install
go install github.com/zricethezav/gitleaks/v8@latest

# 方法4: バイナリダウンロード
# GitHubリリースページから直接ダウンロード
wget https://github.com/gitleaks/gitleaks/releases/download/v8.20.1/gitleaks_8.20.1_linux_x64.tar.gz
tar -xzf gitleaks_8.20.1_linux_x64.tar.gz
```

### 基本的な使い方
#### Hello World相当の例
```bash
# カレントディレクトリのGitリポジトリをスキャン
gitleaks detect

# 特定のディレクトリをスキャン
gitleaks detect --source path/to/directory

# 単一ファイルをスキャン
gitleaks detect --source path/to/file.py
```

#### 実践的な使用例
```bash
# 詳細な出力でリポジトリをスキャン
gitleaks detect --source . -v

# JSON形式でレポート出力
gitleaks detect --source . --report-format json --report-path gitleaks-report.json

# カスタム設定ファイルを使用
gitleaks detect --config custom-gitleaks.toml

# 特定のコミット範囲をスキャン
gitleaks detect --source . --log-opts="--since=2024-01-01"

# プリコミットフックとして使用
gitleaks protect --staged
```

### 高度な使い方
```toml
# カスタム .gitleaks.toml 設定例
title = "Company Gitleaks Config"

[extend]
useDefault = true  # デフォルトルールを継承

[allowlist]
description = "グローバル許可リスト"
paths = [
    '''\.gitleaks\.toml$''',
    '''test/fixtures/''',
    '''vendor/'''
]

[[rules]]
id = "company-api-key"
description = "Company API Key"
regex = '''company_key_[a-zA-Z0-9]{32}'''
keywords = ["company_key"]

[rules.allowlist]
description = "テスト用キーを無視"
regexes = ['''TEST_COMPANY_KEY''']

# GitHub Actions統合
# .github/workflows/gitleaks.yml
name: gitleaks
on: [push, pull_request]
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: 包括的な使用ガイドとインストール手順
- **CONTRIBUTING.md**: 貢献者向けガイドライン
- **USERS.md**: Gitleaksを使用している組織のリスト
- **公式サイト**: https://gitleaks.io/
- **設定ドキュメント**: TOML形式の詳細な設定オプション

### サンプル・デモ
- **report_templates/**: カスタムレポートテンプレート例
- **testdata/**: テスト用の設定ファイルサンプル
- **Gitleaks Playground**: ブラウザベースのオンラインテスト環境
- **デフォルト設定**: config/gitleaks.tomlに組み込みルール

### チュートリアル・ガイド
- CI/CD統合ガイド（GitHub Actions、GitLab、Azure DevOps）
- プリコミットフック設定方法
- カスタムルール作成ガイド
- ベースライン機能の使用方法

## 技術的詳細
### アーキテクチャ
#### 全体構造
Gitleaksは、モジュラーアーキテクチャを採用し、異なるソースタイプ（Git、ディレクトリ、標準入力）に対して統一的な検出エンジンを提供します。コアエンジンは正規表現マッチングとエントロピー分析を組み合わせて、高精度な秘密情報検出を実現しています。

#### ディレクトリ構成
```
gitleaks/
├── cmd/                    # CLIコマンド実装
│   ├── detect.go          # 検出コマンド
│   ├── protect.go         # 保護コマンド（プリコミット）
│   └── version.go         # バージョン情報
├── config/                 # 設定管理
│   ├── config.go          # 設定パーサー
│   ├── rule.go            # ルール定義
│   └── gitleaks.toml      # デフォルトルール
├── detect/                 # 検出エンジン
│   ├── detect.go          # コア検出ロジック
│   ├── baseline.go        # ベースライン機能
│   └── codec/             # エンコーディング検出
├── sources/                # ソース処理
│   ├── git.go             # Git履歴スキャン
│   ├── files.go           # ファイルシステムスキャン
│   └── common.go          # 共通処理
└── report/                 # レポート生成
    ├── json.go            # JSON出力
    ├── sarif.go           # SARIF形式
    └── junit.go           # JUnit XML
```

#### 主要コンポーネント
- **検出エンジン**: 正規表現とエントロピー分析を組み合わせた検出
  - 場所: `detect/detect.go`
  - 依存: Goの正規表現ライブラリ、シャノンエントロピー計算
  - インターフェース: `Detect()` メソッド

- **ルールシステム**: カスタマイズ可能な検出パターン
  - 場所: `config/rule.go`
  - 機能: 正規表現、キーワード、許可リスト管理
  - デフォルトルール: 165以上の組み込みルール

- **ソース処理**: 様々な入力ソースの統一処理
  - Git: go-gitライブラリを使用した効率的な履歴スキャン
  - ファイル: 並行処理による高速スキャン
  - アーカイブ: 自動展開とネスト処理

### 技術スタック
#### コア技術
- **言語**: Go 1.21+
- **フレームワーク**: 
  - cobra（CLIフレームワーク）
  - viper（設定管理）
  - go-git（Git操作）
- **主要ライブラリ**: 
  - regexp（正規表現処理）
  - encoding/json（レポート生成）
  - github.com/h2non/filetype（ファイルタイプ検出）

#### 開発・運用ツール
- **ビルドツール**: Go Modules、Make
- **テスト**: Go testing framework、テストカバレッジ分析
- **CI/CD**: GitHub Actions、Goreleaser
- **デプロイ**: Docker、各種パッケージマネージャー

### 設計パターン・手法
- **コマンドパターン**: Cobraを使用したCLI設計
- **ストラテジーパターン**: 異なるソースタイプの処理
- **ビルダーパターン**: 設定とルールの構築
- **並行処理**: Goルーチンによる高速スキャン

### データフロー・処理フロー
1. コマンドライン引数の解析
2. 設定ファイルの読み込みとルールの初期化
3. ソースの識別（Git/ディレクトリ/stdin）
4. ファイル/コミットの反復処理
5. 各コンテンツに対する正規表現マッチング
6. エントロピー分析（設定時）
7. 許可リストによるフィルタリング
8. 結果の集約とレポート生成

## API・インターフェース
### 公開API
#### CLIコマンド
- 目的: 秘密情報の検出と防止
- 主要コマンド:
```bash
# detect: 秘密情報を検出
gitleaks detect [flags]

# protect: プリコミットモードで実行
gitleaks protect [flags]

# version: バージョン情報表示
gitleaks version
```

#### 主要フラグ
```bash
--source          # スキャン対象のパス
--config          # カスタム設定ファイル
--report-format   # 出力形式 (json, csv, junit, sarif)
--report-path     # レポート出力先
--baseline-path   # ベースラインファイル
--redact          # 秘密情報をマスク
--verbose         # 詳細出力
--no-banner       # バナー非表示
--exit-code       # カスタム終了コード
```

### 設定・カスタマイズ
#### 設定ファイル
```toml
# 完全な設定例
title = "gitleaks config"

[extend]
useDefault = true
path = "base-config.toml"

[allowlist]
description = "global allow lists"
paths = [
    '''\.gitleaksignore$''',
    '''(.*?)(png|jpg|gif|doc|docx|pdf|bin|xls|pyc|zip)$'''
]
regexTarget = "match"
regexes = [
    '''219-09-9999''',
    '''078-05-1120'''
]
stopwords = [
    "example",
    "test"
]

[[rules]]
id = "aws-access-key"
description = "AWS Access Key"
regex = '''(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}'''
secretGroup = 1
keywords = ["akia", "agpa", "aida", "aroa", "aipa", "anpa", "anva", "asia"]
entropy = 3.5
```

#### 拡張・プラグイン開発
- カスタムルールの追加
- 出力フォーマットのカスタマイズ
- 統合スクリプトの作成
- Webhookによる通知

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- 大規模リポジトリでも高速スキャン
- メモリ効率的な処理
- 並行処理による最適化
- インクリメンタルスキャンサポート

### スケーラビリティ
- 数百万行のコードベースに対応
- Git履歴全体のスキャン可能
- ベースライン機能による差分検出
- 分散実行可能（複数インスタンス）

### 制限事項
- 秘密情報の検証機能なし
- バイナリファイルのスキャン制限
- 大きなファイルでのメモリ使用量
- 正規表現の複雑さによる性能影響

## 評価・所感
### 技術的評価
#### 強み
- 業界最高の検出率（リコール88%）
- 優れたパフォーマンスと低リソース消費
- 豊富なデフォルトルール（165以上）
- 柔軟な設定とカスタマイズ性
- 広範なCI/CD統合サポート

#### 改善の余地
- 秘密情報の有効性検証機能の欠如
- 中程度の誤検出率（精度46%）
- より高度なコンテキスト分析
- インシデント管理機能の追加

### 向いている用途
- CI/CDパイプラインでの自動スキャン
- プリコミットフックでの予防的検出
- 定期的なセキュリティ監査
- コンプライアンス要件の充足
- 開発チームのセキュリティ意識向上

### 向いていない用途
- リアルタイム監視が必要な環境
- 秘密情報の自動修復が必要な場合
- 複雑なコンテキスト分析が必要な場合
- エンタープライズレベルの管理機能が必要な場合

### 総評
Gitleaksは、秘密情報検出ツールの中で最も信頼性が高く、実用的なオープンソースソリューションです。高い検出率、優れたパフォーマンス、簡単な統合性により、DevSecOpsプラクティスの重要な要素となっています。特に、開発プロセスの早い段階でセキュリティリスクを特定し、防止したい組織にとって理想的なツールです。継続的な開発と活発なコミュニティサポートにより、セキュリティ脅威の進化に対応し続けています。