# リポジトリ解析: anthropics/prompt-eng-interactive-tutorial

## 基本情報
- リポジトリ名: anthropics/prompt-eng-interactive-tutorial
- 主要言語: Jupyter Notebook
- スター数: 16,240
- フォーク数: 1,489
- 最終更新: 2024年（活発に更新中）
- ライセンス: No license
- トピックス: prompt-engineering, claude, ai, llm, tutorial, interactive-learning

## 概要
### 一言で言うと
AnthropicのClaude向けプロンプトエンジニアリングを体系的に学べる公式インタラクティブチュートリアル。初心者から上級者まで、9章構成で実践的なプロンプト設計技術を習得できる。

### 詳細説明
このチュートリアルは、Claude APIを使用したプロンプトエンジニアリングの包括的なステップバイステップの理解を提供することを目的としています。Jupyter Notebook形式で提供され、各章には理論的な説明、実践的な例、インタラクティブな演習が含まれています。

チュートリアルは初心者向けの基本的なプロンプト構造から始まり、中級者向けの出力制御やfew-shot学習、上級者向けの複雑なプロンプト構築まで段階的に進みます。特に注目すべきは、10要素から成る包括的なプロンプトテンプレート構造を教えている点で、これは実際のプロダクション環境でも使用可能な実践的なパターンです。

### 主な特徴
- **段階的学習構造**: 初心者・中級者・上級者の3レベルに分かれた9章構成
- **インタラクティブな演習**: 各章に自動採点機能付きの実践演習
- **複数の実装形式**: Anthropic API直接利用版とAmazon Bedrock版を提供
- **実践的なユースケース**: 法律、金融、コーディングなど業界別の具体例
- **10要素プロンプトテンプレート**: プロダクション対応の包括的なプロンプト構造
- **ヒントシステム**: 段階的なヒントと完全な解答例を提供
- **Playground環境**: 各レッスンに実験用のプレイグラウンド領域

## 使用方法
### インストール
#### 前提条件
- Python 3.7以上
- Jupyter NotebookまたはJupyterLab
- Anthropic APIキー（またはAWS Bedrockアクセス）

#### インストール手順
```bash
# 方法1: Anthropic API直接利用の場合
git clone https://github.com/anthropics/prompt-eng-interactive-tutorial.git
cd prompt-eng-interactive-tutorial/Anthropic\ 1P/
pip install anthropic==0.21.3 pickleshare==0.7.5

# 方法2: Amazon Bedrock利用の場合
cd prompt-eng-interactive-tutorial/AmazonBedrock/anthropic/
pip install -r requirements.txt
# または
cd prompt-eng-interactive-tutorial/AmazonBedrock/boto3/
pip install -r requirements.txt
```

### 基本的な使い方
#### Hello World相当の例
```python
# 01_Basic_Prompt_Structure.ipynb より
import anthropic
import re

# APIクライアントの初期化
client = anthropic.Anthropic(api_key="YOUR_API_KEY")
MODEL_NAME = "claude-3-haiku-20240307"

# 最もシンプルなプロンプト
response = client.messages.create(
    model=MODEL_NAME,
    max_tokens=2000,
    messages=[
        {"role": "user", "content": "Count to three."}
    ]
)
print(response.content[0].text)
# 出力: One, two, three.
```

#### 実践的な使用例
```python
# 05_Formatting_Output_and_Speaking_for_Claude.ipynb より
# XMLタグを使用した構造化されたプロンプトの例

PROMPT = """Please extract the key details from the following email:

<email>
From: john.doe@company.com
To: jane.smith@company.com
Subject: Q3 Sales Report Summary

Hi Jane,

I wanted to give you a quick update on our Q3 performance. Overall revenue was $4.2M, 
up 15% from Q2. The Eastern region led with $1.8M in sales, followed by Western at $1.5M. 
Customer satisfaction scores averaged 4.7/5.0.

Let's discuss the Q4 strategy in tomorrow's meeting at 2 PM.

Best,
John
</email>

Extract the information in this exact format:
<extracted_info>
- Sender: 
- Recipient: 
- Subject: 
- Revenue: 
- Revenue Growth: 
- Top Region: 
- Customer Satisfaction: 
- Next Meeting: 
</extracted_info>"""

response = client.messages.create(
    model=MODEL_NAME,
    max_tokens=1000,
    temperature=0.0,
    messages=[{"role": "user", "content": PROMPT}]
)
print(response.content[0].text)
```

### 高度な使い方
```python
# 09_Complex_Prompts_from_Scratch.ipynb より
# 10要素の包括的プロンプトテンプレート

def create_career_coach_prompt(user_input):
    # 1. APIの要件：ユーザーロール
    USER_ROLE = "user"
    
    # 2. タスクコンテキスト（役割と目標）
    TASK_CONTEXT = """You are Terry, an upbeat and friendly career coach who helps users with their job search."""
    
    # 3. トーンコンテキスト
    TONE_CONTEXT = """Maintain a conversational, encouraging tone throughout. Use casual language and show enthusiasm."""
    
    # 4. 詳細なタスク説明とルール
    TASK_DESCRIPTION = """
    <task_description>
    Help users with their job search by:
    1. Reviewing resumes and cover letters
    2. Providing interview tips
    3. Suggesting job search strategies
    4. Offering career advice
    
    Important rules:
    - Always be encouraging and positive
    - If you can't help with something, explain why and suggest alternatives
    - Personalize advice based on the user's situation
    </task_description>
    """
    
    # 5. 例
    EXAMPLES = """
    <examples>
    <example>
    <user_query>I'm nervous about my upcoming interview</user_query>
    <assistant_response>Hey there! It's totally normal to feel nervous before an interview - 
    it shows you care! Let me share some tips that have helped many of my clients...</assistant_response>
    </example>
    </examples>
    """
    
    # 6. 入力データ
    INPUT_DATA = f"""
    <user_message>
    {user_input}
    </user_message>
    """
    
    # 7. 即座のタスク
    IMMEDIATE_TASK = """Please respond to the user's message as Terry the career coach."""
    
    # 8. 思考のステップ（プレコグニション）
    PRECOGNITION = """
    <thinking>
    Before responding, consider:
    1. What is the user's main concern or question?
    2. What specific advice would be most helpful?
    3. How can I make my response encouraging and actionable?
    </thinking>
    """
    
    # 9. 出力フォーマット
    OUTPUT_FORMATTING = """Remember to maintain Terry's friendly, encouraging personality."""
    
    # 10. プレフィル（アシスタントの応答開始）
    PREFILL = "Hey there! "
    
    # 完全なプロンプトの組み立て
    full_prompt = f"""
    {TASK_CONTEXT}
    
    {TONE_CONTEXT}
    
    {TASK_DESCRIPTION}
    
    {EXAMPLES}
    
    {INPUT_DATA}
    
    {IMMEDIATE_TASK}
    
    {PRECOGNITION}
    
    {OUTPUT_FORMATTING}
    """
    
    return full_prompt, PREFILL

# 使用例
user_query = "I've been applying to jobs for 3 months with no responses. What am I doing wrong?"
prompt, prefill = create_career_coach_prompt(user_query)

response = client.messages.create(
    model=MODEL_NAME,
    max_tokens=2000,
    temperature=0.7,
    messages=[
        {"role": "user", "content": prompt},
        {"role": "assistant", "content": prefill}  # プレフィルを使用
    ]
)
print(prefill + response.content[0].text)
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: コースの概要と目標
- **各章のNotebook**: 詳細な説明と実践例
- **hints.py**: 段階的なヒントと完全な解答
- **Answer Key**: [Google Sheets形式の解答集](https://docs.google.com/spreadsheets/d/1jIxjzUWG-6xBVIa2ay6yDpLyeuOh_hR_ZB75a47KX_E/edit?usp=sharing)

### サンプル・デモ
- **Chapter 9 - Career Coach**: キャリアコーチチャットボットの完全実装
- **Chapter 9 - Legal Services**: 法的文書分析の実装例
- **Chapter 9 - Financial Services**: 税務分析の演習
- **Chapter 9 - Coding**: コードレビューボットの演習

### チュートリアル・ガイド
- 章ごとの学習パス（初級→中級→上級）
- Google Sheets版チュートリアル（よりユーザーフレンドリー）
- AWSユーザー向けBedrock実装ガイド

## 技術的詳細
### アーキテクチャ
#### 全体構造
チュートリアルは、理論学習と実践演習を組み合わせた構造化されたアプローチを採用：

1. **レッスン構造**: 説明→例→演習→プレイグラウンド
2. **自動評価システム**: 正規表現ベースの回答検証
3. **段階的複雑性**: 単純なAPIコールから複雑な10要素プロンプトまで
4. **マルチプラットフォーム**: Anthropic直接/AWS Bedrock対応

#### ディレクトリ構成
```
prompt-eng-interactive-tutorial/
├── Anthropic 1P/              # Anthropic API直接版
│   ├── 00_Tutorial_How-To.ipynb
│   ├── 01_Basic_Prompt_Structure.ipynb
│   ├── ...
│   ├── 09_Complex_Prompts_from_Scratch.ipynb
│   ├── 10.1_Appendix_Chaining Prompts.ipynb
│   ├── 10.2_Appendix_Tool Use.ipynb
│   ├── 10.3_Appendix_Search & Retrieval.ipynb
│   └── hints.py              # ヒントシステム
├── AmazonBedrock/            # AWS Bedrock版
│   ├── anthropic/           # Anthropic SDK使用
│   ├── boto3/              # boto3 SDK使用
│   ├── cloudformation/     # デプロイテンプレート
│   └── utils/              # 共通ユーティリティ
└── README.md
```

#### 主要コンポーネント
- **評価システム**: 自動採点機能
  - 場所: 各Notebookの演習セクション
  - 依存: 正規表現パターンマッチング
  - インターフェース: grade_exercise関数

- **ヒントシステム**: 段階的学習支援
  - 場所: `hints.py`
  - 依存: なし
  - インターフェース: get_hint(exercise_number)

- **APIラッパー**: 統一的なAPI呼び出し
  - 場所: 各Notebookのセットアップセル
  - 依存: anthropic SDK
  - インターフェース: client.messages.create()

### 技術スタック
#### コア技術
- **言語**: Python 3.7+
- **実行環境**: Jupyter Notebook/JupyterLab
- **主要ライブラリ**: 
  - anthropic (0.21.3): Claude API SDK
  - boto3 (1.34.74): AWS SDK（Bedrock版）
  - re: 正規表現（演習評価用）

#### 開発・運用ツール
- **バージョン管理**: requirements.txt
- **配布形式**: GitHubリポジトリ、Google Sheets版
- **デプロイ**: CloudFormationテンプレート（AWS版）

### 設計パターン・手法
- **段階的開示**: 概念を徐々に複雑化させる教育設計
- **実践重視**: すべての概念に即座の実践機会
- **構造化プロンプティング**: XMLタグによる明確な区分
- **10要素テンプレート**: 再利用可能なプロンプト構造

### データフロー・処理フロー
1. ユーザーがNotebookでレッスンを読む
2. 例を確認し、概念を理解
3. 演習問題でプロンプトを作成
4. APIを通じてClaudeに送信
5. 自動評価システムが回答を検証
6. 必要に応じてヒントを参照
7. プレイグラウンドで自由に実験

## API・インターフェース
### 公開API
#### Claude Messages API
- 目的: Claudeとの対話的なやり取り
- 使用例:
```python
# 基本的なAPI呼び出し
response = client.messages.create(
    model="claude-3-haiku-20240307",
    max_tokens=2000,
    temperature=0.0,
    messages=[
        {"role": "user", "content": "Your prompt here"}
    ]
)
```

#### Tool Use (Function Calling)
- 目的: 外部ツールとの統合
- 使用例:
```python
# Appendix 10.2より
tools = [{
    "name": "get_weather",
    "description": "Get weather for a location",
    "input_schema": {
        "type": "object",
        "properties": {
            "location": {"type": "string"}
        }
    }
}]

response = client.messages.create(
    model=MODEL_NAME,
    tools=tools,
    messages=[{"role": "user", "content": "What's the weather in Tokyo?"}]
)
```

### 設定・カスタマイズ
#### 設定ファイル
```python
# 各Notebookの設定セクション
MODEL_NAME = "claude-3-haiku-20240307"
TEMPERATURE = 0.0  # 決定的な出力のため
MAX_TOKENS = 2000

# APIキー設定
# 方法1: 環境変数
import os
api_key = os.environ.get("ANTHROPIC_API_KEY")

# 方法2: 直接指定（非推奨）
api_key = "sk-ant-..."
```

#### 拡張・プラグイン開発
新しい演習やレッスンの追加パターン：
```python
# カスタム評価関数
def grade_custom_exercise(response_text, expected_pattern):
    pattern = re.compile(expected_pattern, re.DOTALL | re.IGNORECASE)
    return bool(pattern.match(response_text))

# カスタムヒント関数
def get_custom_hint(attempt_number):
    hints = [
        "ヒント1: まず基本構造を確認してください",
        "ヒント2: XMLタグを使用してみてください",
        "完全な解答: <answer>...</answer>"
    ]
    return hints[min(attempt_number - 1, len(hints) - 1)]
```

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- モデル選択: Claude 3 Haiku（最速・最安価）を使用
- レスポンス時間: 通常1-2秒（Haikuモデル）
- 決定的出力: temperature=0.0で一貫性のある結果

### スケーラビリティ
- 個人学習用: 単一ユーザーのローカル実行
- チーム研修: Google Sheets版で共有可能
- 企業導入: AWS Bedrock版でスケーラブルなデプロイ

### 制限事項
- APIレート制限: Anthropicのティアに依存
- トークン制限: 最大2000トークン/レスポンス
- ライセンス: 明示的なライセンスなし（使用前に確認推奨）

## 評価・所感
### 技術的評価
#### 強み
- **体系的なカリキュラム**: 初心者から上級者まで段階的に学習可能
- **実践的な内容**: 実際のユースケースに基づいた演習
- **インタラクティブ性**: 即座のフィードバックと実験環境
- **公式チュートリアル**: Anthropic直営による信頼性の高い内容
- **10要素テンプレート**: プロダクション利用可能な包括的フレームワーク

#### 改善の余地
- **ライセンス未定義**: 商用利用や再配布の条件が不明確
- **日本語対応なし**: 英語のみのコンテンツ
- **更新頻度**: 新しいモデルやAPIの機能への対応が必要

### 向いている用途
- **プロンプトエンジニアリング入門**: 体系的に基礎から学びたい開発者
- **チーム研修**: 組織全体でプロンプティングスキルを標準化
- **プロダクト開発**: 実践的なプロンプトパターンの習得
- **教育コンテンツ開発**: 教育設計の参考例として

### 向いていない用途
- **最新機能の学習**: 最新のClaude機能がすぐに反映されない可能性
- **非技術者向け**: プログラミング知識が前提
- **他のLLM**: Claude特化のため他のモデルには直接適用できない

### 総評
Anthropicの公式プロンプトエンジニアリングチュートリアルは、Claude APIを使用したプロンプト設計を学ぶための最も包括的で実践的なリソースの1つです。特に印象的なのは、単なる技術的な使い方だけでなく、実際のビジネスシーンで使える10要素のプロンプトテンプレートを教えている点です。段階的な学習構造、インタラクティブな演習、実践的なユースケースの組み合わせにより、学習者は理論と実践の両方を効果的に習得できます。ライセンスが明確でない点は懸念事項ですが、教育的価値は非常に高く、Claudeを使用する開発者にとって必須の学習リソースと言えるでしょう。