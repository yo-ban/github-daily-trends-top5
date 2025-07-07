# リポジトリ解析: anthropics/prompt-eng-interactive-tutorial

## 基本情報
- リポジトリ名: anthropics/prompt-eng-interactive-tutorial
- 主要言語: Jupyter Notebook
- スター数: 14,891
- フォーク数: 1,377
- 最終更新: 活発に更新中（2024年）
- ライセンス: No license
- トピックス: prompt-engineering, claude, tutorial, jupyter-notebook, ai, llm, anthropic

## 概要
### 一言で言うと
Anthropicが公式に提供する、Claudeを効果的に使用するためのプロンプトエンジニアリング技術を体系的に学べる対話型Jupyterノートブックチュートリアルです。

### 詳細説明
このリポジトリは、AI言語モデルClaudeを最大限に活用するためのプロンプトエンジニアリング技術を、実践的かつ段階的に学習できる公式チュートリアルです。基本的なプロンプト構造から始まり、高度なテクニックまでを9つの章と4つの補足資料でカバーしています。各レッスンは対話型のJupyterノートブック形式で提供され、概念の説明、実例、練習問題、実験用プレイグラウンドが含まれています。Anthropic APIとAmazon Bedrockの両方のバージョンが用意されており、様々な環境での学習が可能です。

### 主な特徴
- 初心者から上級者まで対応する段階的な学習カリキュラム
- 対話型Jupyterノートブックによる実践的な学習体験
- 自動採点機能付きの練習問題
- ヒントシステムによる段階的な学習支援
- 実際の産業ユースケースに基づいた実例
- Anthropic APIとAmazon Bedrock両方のバージョンを提供
- 10要素から成る包括的なプロンプトテンプレート
- 最新のClaude 3モデル（Haiku、Sonnet、Opus）に対応
- ツール使用、プロンプトチェーン、RAGなどの高度なトピックをカバー

## 使用方法
### インストール
#### 前提条件
- Python 3.7以上
- Jupyter Notebook または JupyterLab
- APIキー（Anthropic ConsoleまたはAWS Bedrockアクセス）
- Git（リポジトリのクローン用）

#### インストール手順
```bash
# 方法1: Anthropic API版のセットアップ
# リポジトリをクローン
git clone https://github.com/anthropics/prompt-eng-interactive-tutorial.git
cd prompt-eng-interactive-tutorial/"Anthropic 1P"

# 依存関係をインストール
pip install anthropic jupyter

# 環境変数にAPIキーを設定
export ANTHROPIC_API_KEY="your-api-key-here"

# Jupyter Notebookを起動
jupyter notebook

# 方法2: Amazon Bedrock版のセットアップ
cd prompt-eng-interactive-tutorial/AmazonBedrock

# 依存関係をインストール
pip install -r requirements.txt

# AWS認証情報を設定
aws configure

# Jupyter Notebookを起動
jupyter notebook
```

### 基本的な使い方
#### Hello World相当の例
```python
# 最初のレッスン: 基本的なプロンプト構造
from anthropic import Anthropic

client = Anthropic()

# システムプロンプトとユーザーメッセージの基本構造
response = client.messages.create(
    model="claude-3-haiku-20240307",
    max_tokens=1000,
    system="You are a helpful assistant.",
    messages=[
        {"role": "user", "content": "Hello, Claude!"}
    ]
)

print(response.content[0].text)
```

#### 実践的な使用例
```python
# レッスン4: データと指示の分離（XMLタグを使用）
prompt = """Please analyze the sentiment of the product reviews below.
For each review, indicate whether the sentiment is positive, negative, or neutral.

<reviews>
<review id="1">The product arrived quickly and works great!</review>
<review id="2">Completely disappointed. It broke after one day.</review>
<review id="3">It's okay, nothing special but does the job.</review>
</reviews>
"""

response = client.messages.create(
    model="claude-3-haiku-20240307",
    max_tokens=1000,
    messages=[{"role": "user", "content": prompt}]
)
```

### 高度な使い方
```python
# レッスン9: 複雑なプロンプトの構築（10要素テンプレート）
complex_prompt = """You are an AI career coach created by a career development company. 
Your goal is to provide personalized career advice in a supportive and constructive tone.

Task: Review the user's resume and provide specific, actionable feedback to improve their 
job prospects. Follow these rules:
1. Be specific - avoid generic advice
2. Prioritize the most impactful changes
3. Be encouraging while honest about areas for improvement
4. Consider industry standards for their field

<example>
User Resume: [Entry-level software engineer with 6 months experience...]
Your feedback: 
1. Quantify your achievements - instead of "improved performance", say "improved API response time by 25%"
2. Add specific technologies to each project - employers search for keywords like "React", "Python", etc.
3. Your education section is strong - keep it concise as is
</example>

<resume>
[User's actual resume content here]
</resume>

Please analyze this resume step by step:
1. First, identify the person's career level and target role
2. Evaluate the overall structure and formatting
3. Assess the content quality and relevance
4. Identify the top 3 areas for improvement

Provide your feedback in the following format:
<feedback>
<strengths>[List 2-3 key strengths]</strengths>
<improvements>[List top 3 specific improvements with examples]</improvements>
<quick-wins>[List 2-3 changes they can make in under 30 minutes]</quick-wins>
</feedback>
"""

# プリフィリング（出力の開始を指定）
response = client.messages.create(
    model="claude-3-sonnet-20240229",
    max_tokens=2000,
    messages=[
        {"role": "user", "content": complex_prompt},
        {"role": "assistant", "content": "I'll analyze this resume systematically to provide you with actionable feedback.\n\n<feedback>"}
    ]
)
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクトの概要、セットアップ手順、学習目標
- **00_Tutorial_How-To.ipynb**: チュートリアルの使い方、環境設定、APIキーの設定方法
- **各章のノートブック**: 01から09まで、および10.1から10.4の補足資料

### サンプル・デモ
- **キャリアコーチングチャットボット**: 会話型AIの実装例（第9章）
- **法律文書分析**: 契約書レビューの自動化例（第9章）
- **税務コード解釈**: 複雑な規則の解釈例（第9章）
- **コードレビューアシスタント**: プログラミング支援の例（補足資料）

### チュートリアル・ガイド
- 完全な回答キー（Google Sheetsで提供）
- プログレッシブヒントシステム（hints.py）
- 各レッスン末尾の実験用プレイグラウンド
- CloudFormationテンプレート（AWS環境での大規模ワークショップ用）

## 技術的詳細
### アーキテクチャ
#### 全体構造
チュートリアルは、段階的な学習を促進する構造化されたJupyterノートブックのコレクションとして設計されています。各ノートブックは独立して実行可能でありながら、前のレッスンで学んだ概念を積み上げていく構成になっています。バックエンドはAnthropic APIまたはAmazon Bedrockを通じてClaude 3モデルと通信します。

#### ディレクトリ構成
```
prompt-eng-interactive-tutorial/
├── Anthropic 1P/           # Anthropic API直接版
│   ├── 00_Tutorial_How-To.ipynb
│   ├── 01_Basic_Prompt_Structure.ipynb
│   ├── 02_Being_Clear_and_Direct.ipynb
│   ├── 03_Assigning_Roles_Role_Prompting.ipynb
│   ├── 04_Separating_Data_and_Instructions.ipynb
│   ├── 05_Formatting_Output_and_Speaking_for_Claude.ipynb
│   ├── 06_Precognition_Thinking_Step_by_Step.ipynb
│   ├── 07_Using_Examples_Few-Shot_Prompting.ipynb
│   ├── 08_Avoiding_Hallucinations.ipynb
│   ├── 09_Complex_Prompts_from_Scratch.ipynb
│   ├── 10.1_Appendix_Chaining Prompts.ipynb
│   ├── 10.2_Appendix_Tool Use.ipynb
│   ├── 10.3_Appendix_Search & Retrieval.ipynb
│   └── hints.py           # ヒントシステム
├── AmazonBedrock/         # Amazon Bedrock版
│   ├── anthropic/         # Anthropic SDK使用版
│   ├── boto3/             # Boto3 SDK使用版
│   ├── cloudformation/    # AWSデプロイメント用
│   ├── utils/             # ユーティリティ関数
│   └── requirements.txt   # Python依存関係
└── README.md              # プロジェクト概要
```

#### 主要コンポーネント
- **hints.py**: ヒントシステム
  - 場所: `Anthropic 1P/hints.py`、`AmazonBedrock/utils/hints.py`
  - 責務: 練習問題の段階的なヒント提供
  - インターフェース: `print(hints.exercise_x_x)` 形式でアクセス

- **各章のノートブック**: 学習モジュール
  - 責務: 特定のプロンプトエンジニアリング技術の教授
  - 構成: 概念説明 → 実例 → 練習問題 → 解答確認 → プレイグラウンド

- **自動採点システム**: 練習問題の評価
  - 実装: 各ノートブック内に埋め込まれた正規表現ベースの検証
  - 機能: リアルタイムフィードバックと正解判定

### 技術スタック
#### コア技術
- **言語**: Python 3.7+（型ヒント、f-strings使用）
- **ノートブック環境**: Jupyter Notebook/JupyterLab
- **主要ライブラリ**: 
  - anthropic (最新版): Anthropic API クライアント
  - boto3 (AWS SDK): Amazon Bedrock統合用
  - re (標準ライブラリ): 練習問題の自動採点
  - IPython.display: リッチコンテンツ表示

#### 開発・運用ツール
- **モデル**: Claude 3ファミリー
  - Claude 3 Haiku: 高速・低コストな基本レッスン用
  - Claude 3 Sonnet: ツール使用などの高度な機能用
  - Claude 3 Opus: 最高性能が必要な場合（オプション）
- **API環境**: 
  - Anthropic Console (console.anthropic.com)
  - AWS Bedrock (us-east-1, us-west-2)
- **デプロイメント**: CloudFormationテンプレート（大規模ワークショップ用）

### 設計パターン・手法
- **Progressive Disclosure Pattern**: 基礎から高度な内容へ段階的に情報を開示
- **Learning by Doing**: 理論説明の直後に実践的な練習を配置
- **Immediate Feedback**: 正規表現による即時の解答検証
- **Scaffolding**: ヒントシステムによる段階的な学習支援
- **Experimentation Encouragement**: 各レッスン末尾のプレイグラウンドセクション

### データフロー・処理フロー
1. **学習フロー**
   - コンセプト導入（マークダウンセル）
   - APIセットアップ（コードセル）
   - 実例デモンストレーション（API呼び出し）
   - 練習問題提示（指示と期待される出力）
   - 学習者の解答入力
   - 自動評価（正規表現マッチング）
   - フィードバック表示
   - 自由実験（プレイグラウンド）

2. **API通信フロー**
   - プロンプト構築
   - API呼び出し（Anthropic/Bedrock）
   - レスポンス解析
   - 結果表示

## API・インターフェース
### 公開API
#### Anthropic Messages API
- 目的: Claudeとの対話的なやり取り
- 使用例:
```python
client.messages.create(
    model="claude-3-haiku-20240307",
    max_tokens=1000,
    temperature=0.0,  # 決定論的な出力用
    system="You are a helpful assistant",
    messages=[
        {"role": "user", "content": "Your prompt here"},
        {"role": "assistant", "content": "Prefilled response start..."}  # プリフィリング
    ]
)
```

#### Tool Use API（ベータ）
- 目的: Claudeに外部ツールを使用させる
- 使用例:
```python
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
    model="claude-3-sonnet-20240229",
    max_tokens=4096,
    tools=tools,
    messages=[{"role": "user", "content": "What's the weather in Tokyo?"}]
)
```

### 設定・カスタマイズ
#### 設定ファイル
```python
# 環境変数設定
ANTHROPIC_API_KEY="sk-ant-..."

# Bedrock設定
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."

# モデル選択
DEFAULT_MODEL="claude-3-haiku-20240307"  # 高速・低コスト
ADVANCED_MODEL="claude-3-sonnet-20240229"  # 高性能
```

#### 拡張・プラグイン開発
チュートリアルは以下の方法で拡張可能：
1. 新しい練習問題の追加（既存のパターンに従う）
2. カスタムヒントの追加（hints.pyを拡張）
3. 業界特化型の例題追加
4. 自動評価ロジックのカスタマイズ

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- **応答速度**: 
  - Haiku: 平均 1-2秒（シンプルなプロンプト）
  - Sonnet: 平均 3-5秒（複雑なタスク）
- **コスト最適化**: 
  - チュートリアルの大部分でHaikuを使用（Sonnetの1/10のコスト）
  - 高度な機能のみSonnetに切り替え

### スケーラビリティ
- CloudFormationによる大規模ワークショップ環境の自動構築
- 参加者ごとのAPI使用量制限設定可能
- リージョン別のデプロイメントサポート（レイテンシ最適化）
- バッチ処理による効率的な評価システム

### 制限事項
- APIレート制限（Anthropicプランによる）
- 単語カウントなどの正確性に課題（LLMの一般的な制限）
- ツール使用機能は開発中でアップデート予定
- ライセンスが明記されていない（商用利用時は要確認）

## 評価・所感
### 技術的評価
#### 強み
- 体系的かつ実践的なカリキュラム設計
- 公式チュートリアルとしての信頼性と正確性
- 対話型学習による高い学習効果
- 実際の産業ユースケースに基づいた実例
- 段階的なヒントシステムによる自立学習支援
- 10要素プロンプトテンプレートという包括的なフレームワーク

#### 改善の余地
- ライセンスが未定義（法的な利用条件が不明確）
- 日本語などの非英語言語でのサンプルが少ない
- より高度なプロンプトエンジニアリング技術（Constitutional AI等）のカバー
- コミュニティ貢献の仕組みが未整備

### 向いている用途
- 開発者のClaudeスキル向上トレーニング
- 企業でのAI活用ワークショップ
- 大学・教育機関でのAI教育カリキュラム
- プロンプトエンジニアリング初心者の体系的学習
- Claude APIの機能理解と実装練習

### 向いていない用途
- 他のLLM（GPT、Gemini等）への直接的な技術転用
- 商用製品への組み込み（ライセンス未定義）
- リアルタイムパフォーマンスが重要なアプリケーション
- 完全にオフラインでの学習環境

### 総評
Anthropic公式のプロンプトエンジニアリングチュートリアルは、Claude利用者にとって必須の学習リソースといえます。初心者から上級者まで、段階的に高度な技術を習得できる構成は教育設計として秀逸です。特に10要素のプロンプトテンプレートは、複雑なタスクに対するアプローチを体系化した価値ある貢献です。対話型のJupyterノートブック形式により、理論と実践のバランスが取れた学習体験を提供しています。ライセンスの明確化など改善点はあるものの、AI時代のスキル向上に欠かせない高品質な教育コンテンツとして高く評価できます。