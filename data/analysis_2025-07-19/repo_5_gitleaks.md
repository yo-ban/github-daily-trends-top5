# リポジトリ解析: gitleaks/gitleaks

## 基本情報
- リポジトリ名: gitleaks/gitleaks
- 主要言語: Go
- スター数: 22,030
- フォーク数: 1,703
- 最終更新: 活発に開発中
- ライセンス: MIT License
- トピックス: secret detection, security, git, pre-commit, CI/CD

## 概要
### 一言で言うと
Gitleaksは、Gitリポジトリ、ファイル、その他のソースからパスワード、APIキー、トークンなどの秘密情報を検出するセキュリティツールです。

### 詳細説明
Gitleaksは、開発プロセスにおいて誤ってコミットされる可能性のある機密情報を検出し、セキュリティ侵害を未然に防ぐためのツールです。正規表現とエントロピーチェックを組み合わせた高精度な検出エンジンを搭載し、100以上のプリセットルールによりAWS、Azure、GitHub、Google Cloudなどの主要サービスの認証情報を網羅的に検出できます。GitLabでは公式のSecret Detection機能として採用されています。

### 主な特徴
- 高速な正規表現ベースの検出エンジン（Aho-Corasickアルゴリズム使用）
- 3つのスキャンモード: git（ローカルGitリポジトリ）、dir（ディレクトリとファイル）、stdin（標準入力）
- 100以上のプリセット検出ルール（AWS、Azure、GitHub、Slack、Stripe等）
- カスタマイズ可能な設定（TOML形式）
- 複数の出力フォーマット対応（JSON、CSV、JUnit、SARIF）
- ベースライン機能（既知の問題を無視）
- デコード機能（Base64、HEX、パーセントエンコーディング）
- アーカイブスキャン機能（ZIP、tar等）
- GitHub Action、Pre-commitフック対応
- 柔軟な除外設定（gitleaks:allowコメント、.gitleaksignore）
- エンタープライズライセンスサポート（GitHub Actionで組織向け）

## 使用方法
### インストール
#### 前提条件
- Go 1.23.8以上（ソースからビルドする場合）
- Git（Gitリポジトリをスキャンする場合）
- Docker（Docker版を使用する場合）

#### インストール手順
```bash
# 方法1: Homebrew (macOS)
brew install gitleaks

# 方法2: Docker (DockerHub)
docker pull zricethezav/gitleaks:latest
docker run -v ${path_to_host_folder_to_scan}:/path zricethezav/gitleaks:latest [COMMAND] [OPTIONS] [SOURCE_PATH]

# 方法3: Docker (GitHub Container Registry)
docker pull ghcr.io/gitleaks/gitleaks:latest
docker run -v ${path_to_host_folder_to_scan}:/path ghcr.io/gitleaks/gitleaks:latest [COMMAND] [OPTIONS] [SOURCE_PATH]

# 方法4: ソースからビルド
git clone https://github.com/gitleaks/gitleaks.git
cd gitleaks
make build

# 方法5: Goから直接インストール
go install github.com/gitleaks/gitleaks/v8@latest
```

### 基本的な使い方
#### Hello World相当の例
```bash
# カレントディレクトリのGitリポジトリをスキャン
gitleaks git -v

# 特定のディレクトリをスキャン
gitleaks dir -v --source /path/to/directory

# コミット前のチェック（pre-commitフック用）
gitleaks protect --staged -v
```

#### 実践的な使用例
```bash
# 特定のコミット範囲をスキャン
gitleaks git -v --log-opts="--all commitA..commitB" /path/to/repo

# JSON形式でレポートを出力
gitleaks git --report-path report.json --report-format json -v

# カスタム設定ファイルを使用
gitleaks git -c custom-config.toml -v

# 特定のルールのみ有効化
gitleaks git --enable-rule aws-access-key-id,github-pat -v

# ベースラインを使用して新規問題のみ検出
gitleaks git --baseline-path baseline.json --report-path new-findings.json
```

### 高度な使い方
```bash
# エンコードされたシークレットの検出（最大3階層までデコード）
gitleaks git --max-decode-depth 3 -v

# アーカイブファイル内のスキャン（最大2階層まで展開）
gitleaks dir --max-archive-depth 2 -v

# CI/CDパイプライン統合例
#!/bin/bash
# スキャン実行
gitleaks git --source . \
  --report-format sarif \
  --report-path gitleaks-results.sarif \
  --baseline-path gitleaks-baseline.json \
  --max-target-megabytes 100 \
  --redact \
  -v

# 結果を確認
if [ $? -ne 0 ]; then
  echo "シークレットが検出されました"
  exit 1
fi

# カスタムテンプレートでHTMLレポート生成
gitleaks git \
  --report-path report.html \
  --report-format template \
  --report-template custom-report.tmpl
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクトの概要、インストール方法、基本的な使用方法
- **CONTRIBUTING.md**: 新しいルールの追加方法、開発ガイドライン
- **USERS.md**: Gitleaksを使用している企業・組織のリスト
- **Wiki/サイト**: https://github.com/gitleaks/gitleaks/wiki - 詳細なドキュメント

### サンプル・デモ
- **config/gitleaks.toml**: デフォルト設定ファイル（100以上のプリセットルール）
- **cmd/generate/config/rules/**: 各サービス固有のルール定義（AWS、Azure、GitHub等）
- **report_templates/**: カスタムレポートテンプレートのサンプル
- **testdata/**: テスト用の設定ファイルやベースラインの例

### チュートリアル・ガイド
- GitHub Action設定ガイド: https://github.com/gitleaks/gitleaks-action
- Pre-commit設定ガイド: https://github.com/gitleaks/gitleaks#pre-commit
- カスタムルール作成ガイド: CONTRIBUTING.md内の詳細説明
- Docker使用ガイド: README.md内のDockerセクション
- CI/CD統合例: 各種CI/CDプラットフォーム向けの設定例

## 技術的詳細
### アーキテクチャ
#### 全体構造
Gitleaksは、多層的なパイプラインアーキテクチャを採用しています。入力ソースからFragmentを生成し、Aho-Corasickアルゴリズムによる高速プリフィルタリングを経て、正規表現とエントロピーチェックによる精密な検出を行います。さらに、エンコードされたデータの再帰的デコードやアーカイブファイルの展開にも対応し、最終的に様々な形式でレポートを出力します。

#### ディレクトリ構成
```
gitleaks/
├── cmd/                  # コマンドラインインターフェース
│   ├── generate/         # 設定ファイル生成ツール
│   │   └── rules/       # 100以上のサービス固有ルール定義
│   ├── root.go           # Cobraベースのルートコマンド
│   ├── git.go            # Gitリポジトリスキャン
│   ├── directory.go      # ディレクトリスキャン
│   └── stdin.go          # 標準入力スキャン
├── detect/               # 検出エンジンのコア実装
│   ├── detect.go         # 検出ロジックの中核
│   ├── baseline.go       # ベースライン機能
│   ├── location.go       # ファイル内位置特定
│   └── codec/            # エンコーディング検出・デコード
├── config/               # 設定管理システム
│   ├── config.go         # 設定構造体とロードロジック
│   ├── rule.go           # ルール定義の構造体
│   ├── allowlist.go      # 除外設定の実装
│   └── gitleaks.toml     # デフォルト設定ファイル
├── report/               # レポート生成システム
│   ├── finding.go        # 検出結果の構造体
│   ├── json.go           # JSON形式レポート
│   ├── csv.go            # CSV形式レポート
│   ├── sarif.go          # SARIF形式レポート
│   └── junit.go          # JUnit XML形式レポート
└── sources/              # データソース抽象化層
    ├── git.go            # Gitリポジトリからの読み取り
    ├── files.go          # ファイルシステムからの読み取り
    └── fragment.go       # スキャン対象の単位
```

#### 主要コンポーネント
- **Detector** (`detect.Detector`): 検出エンジンの中核
  - 場所: `detect/detect.go`
  - 役割: ルール適用、結果管理、並行処理制御
  - 依存: Config、Rule、Aho-Corasick Trie
  - インターフェース: FromGit()、FromFiles()、Detect()

- **Config** (`config.Config`): 設定管理システム
  - 場所: `config/config.go`
  - 役割: ルール定義とallowlist管理、TOMLファイル解析
  - 依存: viper、Aho-Corasick
  - インターフェース: LoadConfig()、Extend()、validate()

- **Fragment** (`sources.Fragment`): スキャン対象の単位
  - 場所: `sources/fragment.go`
  - 役割: ファイル内容、メタデータ（パス、コミット情報）を保持
  - インターフェース: Raw、FilePath、CommitInfo

- **Reporter** Interface: レポート生成インターフェース
  - 場所: `report/report.go`
  - 役割: 多様な出力形式のサポート
  - 実装: JSONReporter、CSVReporter、SARIFReporter、JUnitReporter

- **Aho-Corasick Trie**: 高速キーワードマッチング
  - 場所: 外部依存 `github.com/BobuSumisu/aho-corasick`
  - 役割: ルールのキーワードによる高速プリフィルタリング

### 技術スタック
#### コア技術
- **言語**: Go 1.23.8、モダンなGo機能を活用
- **CLIフレームワーク**: Cobra - コマンド構築とフラグ管理
- **主要ライブラリ**: 
  - `github.com/BobuSumisu/aho-corasick`: 高速文字列マッチングアルゴリズム
  - `github.com/spf13/cobra`: CLIフレームワーク
  - `github.com/spf13/viper`: 設定管理
  - `github.com/rs/zerolog`: 高速でゼロアロケーションなロガー
  - `github.com/charmbracelet/lipgloss`: ターミナルスタイリング
  - `github.com/gitleaks/go-gitdiff`: Git diff解析
  - `github.com/mholt/archives`: アーカイブ処理
  - `github.com/Masterminds/sprig/v3`: テンプレート機能

#### 開発・運用ツール
- **ビルドツール**: Makefile、Goモジュール
- **テスト**: Go標準テストフレームワーク、ルールごとのテストケース
- **CI/CD**: GitHub Actions、自動リリース、クロスプラットフォームビルド
- **デプロイ**: Homebrew、Docker Hub、GitHub Container Registry、バイナリリリース

### 設計パターン・手法
1. **Strategy Pattern**: 
   - Reporterインターフェースで出力形式を切り替え
   - Sourceインターフェースで入力ソースを抽象化

2. **Builder Pattern**: 
   - Aho-Corasick Trieの構築
   - 設定ファイルの段階的構築（extend機能）

3. **Pipeline Pattern**: 
   - Fragment → Detection → Reporting の処理フロー
   - 再帰的デコードパイプライン

4. **Factory Pattern**: 
   - ルール生成システム（generate/rules）
   - Reporterの動的生成

### データフロー・処理フロー
```
1. 入力ソース判定
   - Git: git log -p実行、コミット履歴取得
   - Directory: ファイルシステム走査
   - Stdin: 標準入力から読み取り

2. Fragment生成
   - ファイル内容、パス、コミット情報を保持
   - 並行処理のためのチャネル传送

3. 検出処理（並行実行）
   a. Aho-Corasickプリフィルタ
      - キーワードが含まれないFragmentを高速に除外
   
   b. ルール適用
      - 正規表現マッチング
      - エントロピーチェック（オプション）
      - Allowlistチェック
   
   c. デコード処理（オプション）
      - Base64、HEX、Unicodeなどをデコード
      - 最大深度まで再帰的に処理

4. 結果集約
   - Finding構造体に検出結果を格納
   - フィンガープリント生成
   - ベースラインとの比較（オプション）

5. レポート生成
   - Reporterインターフェースで出力形式を選択
   - JSON/CSV/SARIF/JUnit/カスタムテンプレート
```

この設計により、Gitleaksは大規模なコードベースでも高速に動作し、多様な環境に柔軟に対応できるセキュリティツールとなっています。

## API・インターフェース
### 公開API
#### CLIコマンド
- 目的: コマンドラインからのシークレット検出
- 使用例:
```bash
# 基本的なスキャン
gitleaks git -v
gitleaks dir -v --source /path/to/scan
gitleaks stdin -v < secret.txt

# 高度なオプション
gitleaks git \
  --config custom-config.toml \
  --baseline-path baseline.json \
  --report-format sarif \
  --report-path results.sarif \
  --enable-rule aws-access-key,github-pat \
  --max-decode-depth 3 \
  --redact \
  -v

# プログラマティックな使用（Go）
import "github.com/gitleaks/gitleaks/v8/detect"
import "github.com/gitleaks/gitleaks/v8/config"

cfg, _ := config.LoadConfig("gitleaks.toml")
detector := detect.NewDetector(cfg)
findings, _ := detector.FromGit("/path/to/repo")
```

### 設定・カスタマイズ
#### 設定ファイル
```toml
# gitleaks.toml
title = "My Custom Gitleaks Config"

# デフォルト設定の拡張
[extend]
useDefault = true
disabledRules = ["generic-api-key"]

# カスタムルール
[[rules]]
id = "company-api-key"
description = "社内APIキーの検出"
regex = '''company_api_key[[:space:]]*[:=][[:space:]]*['"][0-9a-zA-Z]{40}['"]'''
secretGroup = 1
entropy = 4.0
keywords = ["company_api_key"]
tags = ["custom", "api", "company"]

# ルール固有の許可リスト
[[rules.allowlists]]
description = "テストファイルを除外"
paths = ['''test/.*\.go''']

# グローバル許可リスト（v8.25.0から[[allowlists]]へ移行予定）
[allowlist]
description = "Global allowlist"
paths = [
    '''gitleaks\.toml''',
    '''(?i)\.(jpg|gif|png|pdf)$'''
]
regexes = ['''219-09-9999''']
stopwords = ["example", "test"]
commits = ["commit-hash"]
```

#### 拡張・カスタマイズ
1. **カスタムルールの作成**
   ```toml
   [[rules]]
   id = "my-custom-rule"
   description = "カスタムルールの説明"
   regex = '''custom_pattern_[0-9a-f]{32}'''
   keywords = ["custom_pattern"]
   entropy = 3.5
   ```

2. **ルールジェネレータの使用**
   ```go
   // cmd/generate/config/rules/myservice.go
   func MyService() []Rule {
       return []Rule{
           {
               Description: "MyService API Key",
               RuleID:      "myservice-api-key",
               Regex:       GenerateUniqueTokenRegex("myservice_[0-9a-zA-Z]{40}", true),
               Keywords:    []string{"myservice"},
           },
       }
   }
   ```

3. **カスタムテンプレート**
   ```html
   <!-- custom-report.tmpl -->
   <html>
   <body>
   <h1>Gitleaks Report</h1>
   {{range .}}
     <div>
       <h3>{{.RuleID}}</h3>
       <p>File: {{.File}}:{{.StartLine}}</p>
       <p>Match: {{.Match}}</p>
     </div>
   {{end}}
   </body>
   </html>
   ```

### 統合インターフェース

#### GitHub Action
```yaml
- uses: gitleaks/gitleaks-action@v2
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    GITLEAKS_LICENSE: ${{ secrets.GITLEAKS_LICENSE }}
  with:
    config: .gitleaks.toml
```

#### Pre-commit Hook
```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.4
    hooks:
      - id: gitleaks
```

#### Docker API
```bash
# Dockerコンテナとして使用
docker run -v $(pwd):/path \
  ghcr.io/gitleaks/gitleaks:latest \
  git --source "/path" \
  --report-format json \
  --report-path /path/report.json
```

#### CI/CDパイプラインAPI
```bash
# ジェネリックCI/CDスクリプト
#!/bin/bash
gitleaks_scan() {
  local source=$1
  local report_path=$2
  
  gitleaks git \
    --source "$source" \
    --report-path "$report_path" \
    --report-format sarif \
    --baseline-path baseline.json \
    --exit-code 1
  
  return $?
}
```

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ベンチマーク結果: 大規模リポジトリ（100GB以上）でも数分でスキャン完了
- 最適化手法:
  - Aho-Corasickアルゴリズムによる高速キーワードマッチング
  - 並行処理（デフォルト40スレッド）
  - 効率的なプリフィルタリングによるスキップ最適化
  - Zero-allocationロガー（zerolog）によるオーバーヘッド最小化
  - Git logのストリーミング処理

### スケーラビリティ
- **コミット履歴**: 数十万コミットの大規模リポジトリにも対応
- **ファイルサイズ**: --max-target-megabytesで大きなファイルをスキップ可能
- **並行度**: CPUコア数に応じたスケーリング
- **メモリ使用量**: ストリーミング処理により大規模データでも安定
- **バッチ処理**: CI/CDパイプラインでの大量リポジトリスキャンに対応

### 制限事項
- **技術的な制限**:
  - 正規表現ベースのため、誤検知（false positive）の可能性
  - デコード深度によるパフォーマンスへの影響
  - 非常に大きなバイナリファイルはスキャン対象外
  - メモリ内のシークレットは検出不可（ファイルベースのみ）

- **運用上の制限**:
  - ルールのメンテナンスが必要（新しいサービスのシークレットパターン）
  - プロジェクト固有のシークレットはカスタムルールが必要
  - ベースライン管理での運用負荷
  - Pre-commitでの使用時はコミット時間への影響を考慮必要

## 評価・所感
### 技術的評価
#### 強み
- **高速な検出エンジン**: Aho-Corasickアルゴリズムと並行処理による優れたパフォーマンス
- **包括的なプリセットルール**: 100以上の主要サービスに対応した即戦力のルールセット
- **柔軟な設定システム**: TOML形式の設定ファイルで簡単にカスタマイズ可能
- **多様な統合オプション**: GitHub Action、Pre-commit、Docker、各種CI/CDへの簡単な統合
- **エンタープライズ機能**: ベースライン、デコード、アーカイブスキャンなどの高度な機能
- **アクティブな開発**: 頻繁な更新と新ルールの追加

#### 改善の余地
- **誤検知の可能性**: 正規表現ベースのため、コンテキストによっては誤検知が発生
- **ルール作成の複雑さ**: 精度の高いカスタムルール作成には正規表現の知識が必要
- **メモリ内シークレット**: ファイルベースのため、メモリや環境変数内のシークレットは検出不可
- **パフォーマンスと精度のトレードオフ**: デコード深度を上げると処理時間が増加

### 向いている用途
- **CI/CDパイプライン**: 自動化されたセキュリティチェックの一環として
- **コードレビュー**: プルリクエスト時の自動チェック
- **セキュリティ監査**: コードベースの定期的なセキュリティ監査
- **コンプライアンス**: セキュリティ基準への準拠確認
- **DevSecOps**: 開発プロセスへのセキュリティ統合
- **インシデント対応**: 漏洩インシデント発生時の調査ツール

### 向いていない用途
- **リアルタイム監視**: ファイルベースのためリアルタイム監視には不向き
- **ランタイムシークレット管理**: メモリや環境変数のシークレット管理には別ツールが必要
- **小規模個人プロジェクト**: 設定のオーバーヘッドが大きい可能性
- **非技術者向け**: コマンドラインツールのため、技術的知識が必要

### 総評
Gitleaksは、現代のソフトウェア開発において不可欠なセキュリティツールです。特に、シークレットの誤ったコミットによる被害が増加している現在、予防的な対策として非常に有効です。

技術的には、高速な検出エンジン、豊富なプリセットルール、柔軟な設定システムという三拍子が揃っており、小規模から大規模まで幅広いプロジェクトに対応できます。GitLabが公式のSecret Detection機能として採用していることからも、その信頼性と実績が伺えます。

一方で、誤検知の管理やカスタムルールの作成にはある程度の専門知識が必要であり、導入時にはチューニングが必要になることもあります。しかし、これらの課題は適切な設定と運用で十分に克服可能であり、セキュリティリスクの低減というメリットはそれらを大きく上回ります。

DevSecOpsの実践を目指す組織にとって、Gitleaksは「シフトレフト」の実現に必須のツールと言えるでしょう。