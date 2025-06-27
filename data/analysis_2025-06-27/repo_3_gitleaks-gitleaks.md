# リポジトリ解析: gitleaks/gitleaks

## 基本情報
- リポジトリ名: gitleaks/gitleaks
- 主要言語: Go
- スター数: 20,965
- フォーク数: 1,651
- 最終更新: アクティブ開発中
- ライセンス: MIT License
- トピックス: セキュリティ、秘密情報検出、DevSecOps

## 概要
### 一言で言うと
Gitリポジトリやファイルからパスワード、APIキー、トークンなどの秘密情報を検出するセキュリティツール

### 詳細説明
Gitleaksは、開発プロセスにおいて誤ってコミットされた秘密情報（シークレット）を検出するためのツールです。正規表現ベースの検出エンジンを使用して、過去のコミット履歴、現在のコード、あるいは標準入力から渡されたデータをスキャンできます。GitHub Actions、pre-commitフック、CI/CDパイプラインに統合可能で、DevSecOpsプラクティスの重要な一部として機能します。Aho-Corasickアルゴリズムを使用した高速な文字列マッチングと、エントロピー計算による秘密情報の判定により、高精度な検出を実現しています。

### 主な特徴
- 100以上の組み込み検出ルール（AWS、Azure、Google Cloud、GitHub、Stripeなど）
- カスタムルールの定義とカスタマイズ可能な設定
- 高速なスキャン性能（Aho-Corasick、並行処理）

## 使用方法
### インストール
#### 前提条件
- Git（gitリポジトリスキャンの場合）
- Docker（Dockerインストールの場合）
- Go 1.23以上（ソースからのビルドの場合）

#### インストール手順
```bash
# 方法1: Homebrew (macOS)
brew install gitleaks

# 方法2: Docker経由
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
# カレントディレクトリのGitリポジトリをスキャン
gitleaks git .

# 特定のファイルをスキャン
echo "api_key = 'sk-1234567890abcdef'" | gitleaks stdin -v
```

#### 実践的な使用例
```bash
# Gitリポジトリの全履歴をスキャン
gitleaks git -v /path/to/repo

# ディレクトリをスキャン（gitなし）
gitleaks dir -v /path/to/directory

# レポートを生成
gitleaks git --report-path gitleaks-report.json

# ベースラインを使用（既知の問題を無視）
gitleaks git --baseline-path baseline.json --report-path findings.json

# 特定のコミット範囲をスキャン
gitleaks git -v --log-opts="--all commitA..commitB" /path/to/repo
```

### 高度な使い方
```bash
# カスタム設定ファイルを使用
gitleaks git --config custom-gitleaks.toml .

# エンコードされたシークレットを検出（Base64、Hex、Percent）
gitleaks git --max-decode-depth 3 .

# アーカイブファイル内のシークレットを検出
gitleaks dir --max-archive-depth 5 .

# 特定のルールのみ有効化
gitleaks git --enable-rule aws-access-token,github-pat .
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: インストール、使用方法、設定の詳細
- **config/gitleaks.toml**: デフォルト設定ファイル（100以上のルール定義）
- **Wiki/サイト**: https://github.com/gitleaks/gitleaks

### サンプル・デモ
- **testdata/**: テスト用のサンプルファイル
- **report_templates/**: カスタムレポートテンプレート例
  - basic.tmpl: 基本的なテンプレート
  - leet.tmpl, myspace.tmpl, w98.tmpl: 楽しいテンプレート

### チュートリアル・ガイド
- Gitleaks Playground: https://gitleaks.io/playground
- ブログ記事: "Regex is (almost) all you need"
- 設定ガイド: 高度な設定のセットアップ方法

## 技術的詳細
### アーキテクチャ
#### 全体構造
コマンドラインツールとして設計され、ライブラリとしても使用可能：
- **cmd/**: CLIコマンド実装
- **detect/**: 検出エンジンのコア
- **config/**: 設定とルール管理
- **sources/**: 入力ソース（Git、ファイル、stdin）
- **report/**: レポート生成

#### ディレクトリ構成
```
project-root/
├── cmd/                 # CLIコマンド実装
│   ├── detect.go       # 検出コマンド（非推奨）
│   ├── git.go          # Gitスキャンコマンド
│   ├── directory.go    # ディレクトリスキャンコマンド
│   └── stdin.go        # 標準入力スキャンコマンド
├── detect/             # 検出エンジン
│   ├── detect.go       # メイン検出ロジック
│   ├── codec/          # エンコーディング検出
│   └── location.go     # 位置情報処理
├── config/             # 設定管理
│   ├── config.go       # 設定構造体
│   ├── rule.go         # ルール定義
│   └── gitleaks.toml   # デフォルトルール
├── sources/            # 入力ソース
│   ├── git.go          # Git履歴スキャン
│   ├── files.go        # ファイルシステムスキャン
│   └── file.go         # 単一ファイルスキャン
└── report/             # レポート生成
    ├── json.go         # JSONレポート
    ├── csv.go          # CSVレポート
    └── sarif.go        # SARIFレポート
```

#### 主要コンポーネント
- **Detector**: 検出エンジンのメイン構造体
  - 場所: `detect/detect.go`
  - 依存: config.Config, ahocorasick.Trie
  - インターフェース: DetectSource, DetectChunk

- **Rule**: 検出ルール定義
  - 場所: `config/rule.go`
  - 依存: regexp
  - インターフェース: 正規表現、エントロピー、キーワード

- **Sources**: 入力ソースインターフェース
  - 場所: `sources/source.go`
  - 依存: なし
  - インターフェース: ChunkReader

### 技術スタック
#### コア技術
- **言語**: Go 1.23（高性能、並行処理）
- **フレームワーク**: Cobra（CLI）、Viper（設定）
- **主要ライブラリ**: 
  - github.com/BobuSumisu/aho-corasick: 高速文字列マッチング
  - github.com/gitleaks/go-gitdiff: Git差分解析
  - github.com/wasilibs/go-re2: 正規表現エンジン

#### 開発・運用ツール
- **ビルドツール**: Make、Go Modules
- **テスト**: Go標準テストフレームワーク
- **CI/CD**: GitHub Actions
- **デプロイ**: バイナリリリース、Docker Hub、GitHub Container Registry

### 設計パターン・手法
- Aho-Corasickアルゴリズムによる効率的なキーワードマッチング
- 並行処理による高速スキャン（semgroup）
- エントロピー計算による秘密情報の判定
- プラガブルな入力ソースとレポート形式

### データフロー・処理フロー
1. 入力ソースから「チャンク」を読み取り
2. プレフィルター（キーワードマッチング）で候補を絞り込み
3. 正規表現マッチングで秘密情報を抽出
4. エントロピー計算で誤検出をフィルタリング
5. 許可リストチェック
6. 検出結果をレポートに追加

## API・インターフェース
### 公開API
ライブラリとして使用する場合：
```go
import (
    "github.com/zricethezav/gitleaks/v8/config"
    "github.com/zricethezav/gitleaks/v8/detect"
    "github.com/zricethezav/gitleaks/v8/sources"
)

// 検出器の作成
cfg, _ := config.LoadDefault()
detector := detect.NewDetector(cfg)

// Gitリポジトリのスキャン
findings, err := detector.DetectSource(ctx, &sources.Git{
    Config: &cfg,
    Path:   "/path/to/repo",
})
```

### 設定・カスタマイズ
#### 設定ファイル形式（TOML）
```toml
[[rules]]
id = "custom-api-key"
description = "カスタムAPIキー検出"
regex = '''company_api_key_[a-zA-Z0-9]{32}'''
entropy = 3.5
keywords = ["company_api_key"]

    [[rules.allowlists]]
    description = "テストファイルを無視"
    paths = ['''test/.*\.json$''']
```

#### 拡張・プラグイン開発
設定ファイルで新しいルールを定義することで、独自の検出パターンを追加可能

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- Aho-Corasickによる高速プレフィルタリング
- 並行処理による複数ファイル同時スキャン
- 大規模リポジトリでも実用的な速度

### スケーラビリティ
- 数万コミットのリポジトリでも動作
- メモリ効率的なストリーミング処理
- 進捗表示と中断可能

### 制限事項
- 正規表現エンジンはlookaheadをサポートしない
- 非常に大きなファイル（数GB）はスキップされる場合がある
- バイナリファイルは検出対象外

## 評価・所感
### 技術的評価
#### 強み
- 包括的なデフォルトルールセット
- 高速で効率的なスキャン性能
- 柔軟な設定とカスタマイズ性

#### 改善の余地
- 誤検出の可能性（エントロピーや許可リストで調整可能）
- 正規表現の複雑さによる保守性の課題

### 向いている用途
- CI/CDパイプラインでの自動セキュリティチェック
- コミット前のpre-commitフック
- 定期的なセキュリティ監査
- コンプライアンス要件への対応

### 向いていない用途
- リアルタイムの秘密情報検出（コミット後のスキャンのため）
- 暗号化されたコンテンツの検出
- 構造化されていないバイナリデータの分析

### 総評
Gitleaksは、DevSecOpsプラクティスにおいて不可欠なツールです。20,000以上のスターが示すように、開発者コミュニティから高い評価を受けています。デフォルトで100以上の検出ルールを提供し、主要なクラウドプロバイダーやSaaSサービスのAPIキーを網羅的にカバーしています。GitHub Actionsやpre-commitフックとの統合により、開発ワークフローにシームレスに組み込むことができ、秘密情報の漏洩を未然に防ぐことができます。