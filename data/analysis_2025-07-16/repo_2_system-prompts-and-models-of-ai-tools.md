# リポジトリ解析: x1xhlol/system-prompts-and-models-of-ai-tools

## 基本情報
- リポジトリ名: x1xhlol/system-prompts-and-models-of-ai-tools
- 主要言語: None（テキストファイルのコレクション）
- スター数: 67,933
- フォーク数: 19,612
- 最終更新: 2025年7月4日（最新アップデート）
- ライセンス: GNU General Public License v3.0
- トピックス: system-prompts, ai-tools, ai-models, cursor, v0, devin, replit, windsurf, vscode-agent, dia, trae-ai, cluely, xcode, spawn

## 概要
### 一言で言うと
様々なAIコーディングアシスタントツール（Cursor、v0、Devin、Replit Agent等）のシステムプロンプトとツール定義を収集・公開している、7500行以上に及ぶ包括的なリポジトリ。

### 詳細説明
このリポジトリは、主要なAIコーディングツールやエージェントの内部で使用されているシステムプロンプトとツール定義を収集し、公開しているプロジェクトである。開発者やセキュリティ研究者がこれらのツールの動作原理を理解し、AIシステムの構造と機能性について洞察を得ることを目的としている。また、AIスタートアップに対してセキュリティの重要性を啓発し、システムプロンプトの露出リスクについて警告している。

### 主な特徴
- 15以上の主要AIツールのシステムプロンプトを収録
- 各ツールのツール定義（JSON形式）も含む
- 7500行以上の詳細な内容
- 定期的な更新（最新：2025年7月4日）
- オープンソースプロジェクトのプロンプトも収録
- セキュリティ啓発の側面も持つ
- コミュニティからのフィードバックを受け付ける仕組み

## 使用方法
### インストール
#### 前提条件
- Git（リポジトリのクローン用）
- テキストエディタまたはビューア

#### インストール手順
```bash
# リポジトリのクローン
git clone https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools.git
cd system-prompts-and-models-of-ai-tools
```

### 基本的な使い方
#### Hello World相当の例
```bash
# 特定のツールのプロンプトを閲覧
cat "Cursor Prompts/Agent Prompt.txt"

# ツール定義を確認
cat "Cursor Prompts/Agent Tools v1.0.json"
```

#### 実践的な使用例
```bash
# すべてのCursorプロンプトを一覧表示
ls -la "Cursor Prompts/"

# 特定のキーワードを含むプロンプトを検索
grep -r "tool_calling" .

# JSONツール定義を整形して表示
jq . "Windsurf/Tools.json"
```

### 高度な使い方
```bash
# プロンプトの差分を比較（バージョン間の違いを確認）
diff "Cursor Prompts/Agent Prompt v1.0.txt" "Cursor Prompts/Agent Prompt v1.2.txt"

# すべてのプロンプトファイルの行数をカウント
find . -name "*.txt" -exec wc -l {} + | sort -n

# 特定のツールパターンを分析
grep -h "function" */Tools.json | sort | uniq -c
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクトの概要、収録内容、サポート方法
- **LICENSE.md**: GNU GPL v3.0ライセンスの全文
- **各フォルダ内のPrompt.txt**: 各ツールのシステムプロンプト
- **Tools.json**: 各ツールが使用するツール定義

### サンプル・デモ
- **Cursor Prompts/**: 複数バージョンのプロンプトとツール定義
- **Open Source prompts/**: Bolt、Cline、Codex CLI、RooCodeのプロンプト
- **Xcode/**: 異なるアクション用の複数のプロンプトファイル

### チュートリアル・ガイド
- System Prompts Roadmap & Feedback: https://systemprompts.featurebase.app/
- セキュリティ監査サービス: ZeroLeaks (https://zeroleaks.io/)

## 技術的詳細
### アーキテクチャ
#### 全体構造
このリポジトリは、各AIツールごとにフォルダで整理されたフラットな構造を採用している。各フォルダには、そのツールのシステムプロンプト（.txt）とツール定義（.json）が含まれている。

#### ディレクトリ構成
```
system-prompts-and-models-of-ai-tools/
├── Cursor Prompts/        # Cursorの各種プロンプトとツール
│   ├── Agent Prompt*.txt  # エージェントプロンプト（複数バージョン）
│   ├── Chat Prompt.txt    # チャットプロンプト
│   └── Agent Tools*.json  # ツール定義
├── v0 Prompts and Tools/  # Vercel v0のプロンプト
├── Devin AI/              # Devinのプロンプト
├── Replit/                # Replit Agentのプロンプトとツール
├── Windsurf/              # Windsurf Agentのプロンプトとツール
├── Open Source prompts/   # オープンソースツールのプロンプト
│   ├── Bolt/
│   ├── Cline/
│   ├── Codex CLI/
│   └── RooCode/
└── [その他のツール]/      # 各種AIツールのフォルダ
```

#### 主要コンポーネント
- **システムプロンプト（.txt）**: 各AIツールの振る舞いを定義するテキスト
  - 場所: 各ツールフォルダ内
  - 内容: ツールの役割、制約、ガイドライン
  - 形式: プレーンテキスト

- **ツール定義（.json）**: AIが使用できる機能の定義
  - 場所: 一部のツールフォルダ内
  - 内容: 関数名、説明、パラメータ定義
  - 形式: JSON Schema形式

### 技術スタック
#### コア技術
- **言語**: 該当なし（プレーンテキストとJSONファイルのコレクション）
- **フォーマット**: 
  - プレーンテキスト（.txt）: システムプロンプト
  - JSON: ツール定義
- **収録AIツール**: 
  - Cursor（Microsoft/Anysphere）
  - v0（Vercel）
  - Devin（Cognition AI）
  - Replit Agent
  - Windsurf Agent（Codeium）
  - その他15以上のツール

#### 開発・運用ツール
- **バージョン管理**: Git/GitHub
- **更新管理**: 手動更新（最終更新：2025年7月4日）
- **フィードバック**: https://systemprompts.featurebase.app/
- **ライセンス**: GNU GPL v3.0

### 設計パターン・手法
- **フォルダベースの組織化**: 各ツールごとに独立したフォルダ
- **バージョン管理**: 一部のプロンプトで複数バージョンを保持（例：Cursor Agent Prompt v1.0, v1.2）
- **標準的な命名規則**: Prompt.txt、Tools.json
- **オープンソースとプロプライエタリの分離**: Open Source promptsフォルダで区別

### データフロー・処理フロー
1. AIツールのシステムプロンプトを何らかの方法で取得
2. テキストファイルとして整形・保存
3. ツール定義がある場合はJSON形式で保存
4. GitHubリポジトリに追加・更新
5. コミュニティからのフィードバックを受け付け
6. 定期的な更新とメンテナンス

## API・インターフェース
### 公開API
該当なし（静的なテキストファイルのコレクション）

### ツール定義の構造
#### JSONツール定義の共通フォーマット
```json
[
    {
        "name": "tool_name",
        "description": "ツールの説明",
        "parameters": {
            "type": "object",
            "properties": {
                "param_name": {
                    "type": "string",
                    "description": "パラメータの説明"
                }
            },
            "required": ["param_name"]
        }
    }
]
```

### 収録されているツールタイプ
- **コード検索**: codebase_search、grep_search、file_search
- **ファイル操作**: read_file、edit_file、delete_file、create_file
- **ターミナル操作**: run_terminal_cmd
- **Web検索**: web_search
- **その他**: diff_history、list_dir、reapply

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ファイルサイズ: 各プロンプトファイルは数KB〜数十KB
- 総容量: 7500行以上のテキストコンテンツ
- アクセス速度: 静的ファイルのため高速

### スケーラビリティ
- GitHubの制限内で無制限にスケール可能
- フォーク数19,612が示す高い再利用性
- 静的コンテンツのため同時アクセスに制限なし

### 制限事項
- プロンプトの取得方法は明記されていない
- 更新は手動で不定期
- 一部のツールはプロンプトのみでツール定義がない
- ライセンス（GPL v3.0）による利用制限

## 評価・所感
### 技術的評価
#### 強み
- 業界最大規模のAIシステムプロンプトコレクション
- 67,000以上のスターが示す高い関心度
- 定期的な更新と新しいツールの追加
- 実際のプロダクションで使用されているプロンプトを収録
- オープンソースとプロプライエタリ両方をカバー
- セキュリティ意識の向上に貢献

#### 改善の余地
- プロンプトの取得方法や正確性の検証プロセスが不透明
- 構造化されたドキュメントやAPIの欠如
- 各プロンプトのバージョン履歴や変更点の記録が不完全
- 法的・倫理的な懸念事項への対応

### 向いている用途
- AIツールの動作原理の研究・学習
- 自社AIシステムのプロンプト設計の参考
- AIセキュリティの脆弱性研究
- 競合分析とベンチマーキング
- プロンプトエンジニアリングの教育

### 向いていない用途
- そのまま商用利用（GPL v3.0ライセンス）
- 公式ドキュメントとしての利用
- プロンプトの正確性が保証される用途
- リアルタイムの最新情報が必要な用途

### 総評
このリポジトリは、AIコーディングアシスタントの内部動作を理解したい開発者や研究者にとって貴重なリソースである。特に、複数の主要ツールのプロンプトを横断的に比較できる点は他に類を見ない。一方で、これらのプロンプトがどのように取得されたか、正確性がどの程度保証されるかは不明確であり、参考資料として活用する際は注意が必要である。また、AIスタートアップへのセキュリティ啓発という側面も持ち、システムプロンプトの露出リスクについて業界全体の意識向上に貢献している。