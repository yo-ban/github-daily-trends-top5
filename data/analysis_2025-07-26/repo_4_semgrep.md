# リポジトリ解析: semgrep/semgrep

## 基本情報
- リポジトリ名: semgrep/semgrep
- 主要言語: OCaml
- スター数: 12,298
- フォーク数: 749
- 最終更新: アクティブに開発中
- ライセンス: GNU Lesser General Public License v2.1 (LGPL-2.1)
- トピックス: 静的解析、セキュリティ、バグ検出、SAST、パターンマッチング

## 概要
### 一言で言うと
多言語対応の軽量な静的解析ツールで、ソースコードのようなパターンでバグのバリアントを見つけることができる「コードのためのsemantic grep」。

### 詳細説明
Semgrepは、高速でオープンソースの静的解析ツールで、コードを検索し、バグを見つけ、セキュアなガードレールとコーディング標準を強制します、30以上の言語をサポートし、IDE、pre-commitチェック、CI/CDワークフローの一部として実行できます。ルールは通常のコードのように書くことができ、抽象構文木、正規表現、複雑なDSLは不要です。Semgrep, Inc.によって開発・商用サポートされています。

### 主な特徴
- 30以上のプログラミング言語をサポート
- ソースコードのようなパターンでルールを記述
- セマンティックなパターンマッチング（変数名を抽象化したマッチング）
- データフロー解析とテイント解析
- コミュニティ駆動のルールレジストリ（2,000以上のルール）
- CI/CD統合（GitHub, GitLab, CircleCIなど）
- ローカルでの解析（デフォルトでコードはアップロードされない）
- IDEサポートとpre-commitフック

## 使用方法
### インストール
#### 前提条件
- Python 3.8以上（pipインストールの場合）
- macOS（Homebrewインストールの場合）
- Docker（Dockerインストールの場合）
- OCaml 5.3.0以上（ソースからビルドの場合）

#### インストール手順
```bash
# 方法1: Homebrew経由（macOS）
brew install semgrep

# 方法2: pip経由（Ubuntu/WSL/Linux/macOS）
python3 -m pip install semgrep

# 方法3: Docker経由（インストール不要）
docker run -it -v "${PWD}:/src" semgrep/semgrep semgrep login
docker run -e SEMGREP_APP_TOKEN=<TOKEN> --rm -v "${PWD}:/src" semgrep/semgrep semgrep ci

# 方法4: ソースからビルド
# 事前にGitサブモジュールの初期化が必要
make setup
make
```

### 基本的な使い方
#### Hello World相当の例
```bash
# Pythonコードでprint()文を検索
semgrep -e 'print(...)' --lang=py path/to/src

# 左辺と右辺が同じ==比較を検索（バグの可能性）
semgrep -e '$X == $X' --lang=py path/to/src

# レジストリからルールを使用してスキャン
semgrep --config=auto path/to/src
```

#### 実践的な使用例
```yaml
# ルールファイル例: dangerous-exec.yml
rules:
  - id: dangerous-exec
    pattern: exec(...)
    message: "exec() の使用はセキュリティリスクがあります"
    languages: [python]
    severity: WARNING
    metadata:
      category: security
      cwe: CWE-78

# ルールを使用してスキャン
semgrep --config=dangerous-exec.yml

# CIモードでの実行
# Semgrepログイン後
semgrep ci
```

### 高度な使い方
```yaml
# データフロー解析を使用したルール
# Express.jsでのコマンドインジェクションの検出
rules:
  - id: command-injection
    pattern: |
      const $EXEC = require("child_process").$METHOD;
      ...
      $EXEC(..., <... $REQ.$ACCESSOR ...>, ...)
    message: "User input flows into command execution"
    languages: [javascript]
    severity: ERROR
    mode: taint
    pattern-sources:
      - pattern: $REQ.$ACCESSOR
        pattern-inside: |
          function $FUNC($REQ, $RES) {
            ...
          }
    pattern-sinks:
      - pattern: $EXEC(...)

# 自動修正付きルール
rules:
  - id: use-https
    pattern: http.ListenAndServe(...)
    fix: http.ListenAndServeTLS(...)
    message: "HTTPSを使用してください"
    languages: [go]
    severity: WARNING
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、インストール方法、基本的な使い方
- **INSTALL.md**: 開発者向けビルド手順
- **CONTRIBUTING.md**: 貢献ガイドライン
- **SECURITY.md**: セキュリティポリシー
- **semgrep.dev/docs**: 包括的なオンラインドキュメント

### サンプル・デモ
- **Semgrep Playground**: https://semgrep.dev/editor (オンラインルールエディタ)
- **Semgrep Registry**: https://semgrep.dev/explore (2,000以上のコミュニティルール)
- **ルール例**: ドキュメント内の豊富な使用例

### チュートリアル・ガイド
- [インタラクティブチュートリアル](https://semgrep.dev/learn)
- [Getting Startedガイド](https://semgrep.dev/docs/getting-started/)
- [Rule Writingガイド](https://semgrep.dev/docs/writing-rules/)
- [YouTubeチャンネル](https://www.youtube.com/c/semgrep)
- [Slackコミュニティ](https://go.semgrep.dev/slack) (3.5k+ メンバー)

## 技術的詳細
### アーキテクチャ
#### 全体構造
Semgrepはハイブリッドアーキテクチャを採用し、パフォーマンスクリティカルな解析エンジンはOCamlで実装され、ユーザーインターフェースとエコシステム統合はPythonで提供されています。Generic ASTアプローチにより、31以上の言語を共通の解析インフラストラクチャでサポートしています。

#### ディレクトリ構成
```
semgrep/
├── src/                  # OCamlコアエンジン
│   ├── aliengrep/        # PCREベースのパターンマッチング
│   ├── analyzing/        # 静的解析（データフロー、CFG、IL変換）
│   ├── ast_generic/      # 31+言語を表現できるGeneric AST
│   ├── core/             # コアマッチング機能
│   ├── engine/           # パターンマッチングエンジン
│   ├── il/               # 中間言語表現
│   ├── matching/         # コアマッチングアルゴリズム
│   ├── parsing/          # 言語固有のパーサー
│   ├── tainting/         # テイント解析実装
│   └── osemgrep/         # 新OCaml CLI実装
├── cli/                  # Pythonラッパー
│   ├── src/semgrep/      # メインPythonパッケージ
│   └── src/semdep/       # 依存関係解析
├── interfaces/           # OCamlとPython間のインターフェース定義
└── tests/                # 包括的なテストスイート
```

#### 主要コンポーネント
- **Generic AST**: 言語非依存の抽象構文木
  - 場所: `src/ast_generic/`
  - 依存: 言語固有のパーサー
  - インターフェース: AST変換、パターンマッチング

- **Pattern Matching Engine**: セマンティックパターンマッチング
  - 場所: `src/engine/`
  - 依存: Generic AST、解析モジュール
  - インターフェース: ルール評価、パターンマッチング

- **Taint Analysis**: データフロー解析
  - 場所: `src/tainting/`
  - 依存: IL (中間言語)
  - インターフェース: ソースからシンクへのデータフロー追跡

### 技術スタック
#### コア技術
- **言語**: 
  - OCaml 5.3.0+ (コアエンジン)
  - Python 3.8+ (CLIラッパー)
- **ビルドシステム**: Dune (OCaml)
- **主要ライブラリ**: 
  - pcre (正規表現パターンマッチング)
  - ATD (型安全なインターフェース定義)
  - click (Python CLIフレームワーク)
  - rich (ターミナルUI)

#### 開発・運用ツール
- **ビルドツール**: 
  - Make（ビルドオーケストレーション）
  - Dune（OCamlビルド）
  - pipenv（Python依存関係管理）
- **テスト**: 
  - pytest（Pythonテスト）
  - OCamlの単体テスト
  - E2Eテストスイート
- **CI/CD**: GitHub Actions
- **デプロイ**: 
  - PyPIパッケージ
  - Homebrew formula
  - Dockerイメージ

### 設計パターン・手法
- **Generic ASTパターン**: 言語固有のASTを共通の表現に変換
- **ビジターパターン**: ASTトラバーサルとパターンマッチング
- **プラグインパターン**: 複数のマッチングエンジン（semgrep, aliengrep, spacegrep）
- **インターフェース分離**: ATDによるOCamlとPythonの分離
- **データフロー解析**: CFGとILを使用したテイント解析

### データフロー・処理フロー
1. **ファイルターゲット**: 言語検出とファイルフィルタリング
2. **パーシング**: 言語固有のパーサーでソースコードをASTに変換
3. **AST変換**: 言語固有ASTをGeneric ASTに変換
4. **パターンマッチング**: 
   - セマンティックパターンマッチング
   - メタ変数のバインディング
   - データフロー/テイント解析（必要に応じて）
5. **結果出力**: JSON, SARIF, テキストなど様々なフォーマットで出力
6. **CI統合**: PR差分、アノテーション、レポーティング

## API・インターフェース
### 公開API
#### CLI API
- 目的: コマンドラインからのスキャン実行
- 主要コマンド:
  - `semgrep scan` - ファイル/ディレクトリをスキャン
  - `semgrep ci` - CIモードでの実行
  - `semgrep login` - Semgrep Appへのログイン
  - `semgrep publish` - ルールの公開

#### Python API
```python
# semgrepモジュールの直接利用
from semgrep import semgrep_main
from semgrep.state import SemgrepState

state = SemgrepState()
results = semgrep_main.main(
    argv=["--config=auto", "path/to/code"],
    state=state
)
```

### 設定・カスタマイズ
#### 設定ファイル
```yaml
# .semgrep.yml - ルール設定ファイル
rules:
  - id: example-rule
    pattern: $FUNC(...)
    message: "この関数の使用を確認してください"
    languages: [python]
    severity: WARNING
    
# .semgrepignore - スキャン除外設定
node_modules/
*.min.js
vendor/
```

#### 拡張・プラグイン開発
**カスタムルールの作成**:
- YAMLフォーマットでルールを定義
- パターン、メッセージ、メタデータを指定
- データフロー/テイント解析の設定
- 自動修正 (fix) の定義

**統合**:
- pre-commitフック
- IDEプラグイン (VS Code, IntelliJ)
- CI/CDプラットフォーム統合

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- スキャン速度: 「ludicrous speed」（非常に高速）
- 大規模コードベース対応: 数十万行のコードでも高速スキャン
- 最適化手法: 
  - OCamlによる高性能実装
  - プリフィルタリングによる対象ファイル絞り込み
  - 並列処理
  - インクリメンタルスキャン（CIでの差分解析）

### スケーラビリティ
- 水平スケーリング: 複数プロセスでの並列実行
- 大規模モノレポ対応: 数千のルールでも高速動作
- CI/CD統合: PR差分のみのスキャンで高速化
- メモリ効率: Generic ASTによるメモリ使用量の最適化

### 制限事項
- 単一関数/ファイル境界内での解析（Community Edition）
- クロスファイル/クロス関数解析はPro版が必要
- 一部の言語では部分的なサポート
- カスタムパーサーの追加は困難（OCaml知識が必要）

## 評価・所感
### 技術的評価
#### 強み
- 直感的なルール記述（ソースコードのようなパターン）
- 30以上の言語サポート
- 高速なスキャン性能
- 活発なコミュニティとルールレジストリ
- CI/CDとのシームレスな統合
- データフロー/テイント解析機能
- オープンソースで無料利用可能

#### 改善の余地
- Community Editionではクロスファイル解析ができない
- 誤検知率が高い場合がある（特にセキュリティ用途）
- カスタムパーサーの追加が困難
- ドキュメントが一部不十分

### 向いている用途
- コーディング標準の強制
- CI/CDでの自動コードレビュー
- セキュリティ脆弱性の早期発見
- リファクタリングの支援
- コードベース全体のパターン検索
- 技術的負債の管理

### 向いていない用途
- 高精度なセキュリティ解析（Pro版が必要）
- 複雑なプログラムフロー解析
- ランタイムセキュリティ監視
- コンパイルエラーの検出

### 総評
Semgrepは、「コードのためのsemantic grep」というコンセプトを見事に実現した静的解析ツールです。特に、直感的なルール記述と多言語サポートにより、開発チームが簡単に導入・活用できる点が優れています。OCamlとPythonのハイブリッドアーキテクチャにより、高性能と使いやすさを両立しています。LGPL-2.1ライセンスの下でオープンソースとして公開され、活発なコミュニティに支えられていることも大きな強みです。一方で、高度なセキュリティ解析には有料版が必要な点は、企業利用時の考慮事項となるでしょう。