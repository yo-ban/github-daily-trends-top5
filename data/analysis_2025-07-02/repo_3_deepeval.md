# リポジトリ解析: confident-ai/deepeval

## 基本情報
- リポジトリ名: confident-ai/deepeval
- 主要言語: Python
- スター数: 8,830
- フォーク数: 764
- 最終更新: 2025年7月時点で活発に開発中（バージョン3.2.2）
- ライセンス: Apache License 2.0
- トピックス: llm-evaluation, testing, ai-testing, pytest, rag-evaluation, benchmarks

## 概要
### 一言で言うと
LLM（大規模言語モデル）の出力を評価・テストするためのオープンソースフレームワーク。Pytestに似た使い心地で、LLMアプリケーションのユニットテストを可能にする。

### 詳細説明
DeepEvalは、大規模言語モデルシステムの評価とテストのための使いやすいオープンソースLLM評価フレームワークです。Pytestに特化したLLM出力のユニットテスト版として機能します。G-Eval、ハルシネーション、回答関連性、RAGASなどのメトリクスに基づいてLLM出力を評価する最新の研究を組み込んでおり、評価にはLLMや様々なNLPモデルを使用し、マシン上でローカルに実行されます。

RAGパイプライン、チャットボット、AIエージェントなど、LangChainやLlamaIndexで実装されたLLMアプリケーションに対応。最適なモデル、プロンプト、アーキテクチャを簡単に決定でき、RAGパイプラインやエージェントワークフローの改善、プロンプトドリフトの防止、OpenAIから独自のDeepseek R1ホスティングへの移行も自信を持って行えます。

### 主な特徴
- エンドツーエンドおよびコンポーネントレベルのLLM評価をサポート
- 豊富な評価メトリクス（すべて説明付き）：G-Eval、DAG、RAGメトリクス、エージェントメトリクス、会話メトリクスなど
- カスタムメトリクスの構築が可能
- 評価用の合成データセット生成
- CI/CD環境とのシームレスな統合
- 40以上の安全性脆弱性に対するレッドチーミング機能
- 人気のLLMベンチマーク（MMLU、HellaSwag、HumanEvalなど）での評価
- Confident AIプラットフォームとの100%統合

## 使用方法
### インストール
#### 前提条件
- Python 3.9以上、4.0未満
- OpenAI APIキー（または他のLLMプロバイダー）
- （推奨）Confident AIアカウント

#### インストール手順
```bash
# 方法1: pipでインストール
pip install -U deepeval

# 方法2: Poetryを使用（開発環境）
poetry install
```

### 基本的な使い方
#### Hello World相当の例
```python
import pytest
from deepeval import assert_test
from deepeval.metrics import GEval
from deepeval.test_case import LLMTestCase, LLMTestCaseParams

def test_case():
    correctness_metric = GEval(
        name="Correctness",
        criteria="Determine if the 'actual output' is correct based on the 'expected output'.",
        evaluation_params=[LLMTestCaseParams.ACTUAL_OUTPUT, LLMTestCaseParams.EXPECTED_OUTPUT],
        threshold=0.5
    )
    test_case = LLMTestCase(
        input="What if these shoes don't fit?",
        actual_output="You have 30 days to get a full refund at no extra cost.",
        expected_output="We offer a 30-day full refund at no extra costs."
    )
    assert_test(test_case, [correctness_metric])
```

#### 実践的な使用例
```python
# RAGアプリケーションの評価
from deepeval.metrics import AnswerRelevancyMetric, HallucinationMetric
from deepeval.test_case import LLMTestCase

answer_relevancy = AnswerRelevancyMetric(threshold=0.7)
hallucination = HallucinationMetric(threshold=0.3)

test_case = LLMTestCase(
    input="What are your return policies?",
    actual_output="We offer a 30-day full refund at no extra costs.",
    retrieval_context=["All customers are eligible for a 30 day full refund at no extra costs."]
)

# テストを実行
deepeval test run test_chatbot.py
```

### 高度な使い方
#### コンポーネントレベルの評価
```python
from deepeval.tracing import observe, update_current_span
from deepeval import evaluate

@observe(metrics=[correctness])
def inner_component():
    # LLM呼び出し、リトリーバー、エージェント、ツール使用など
    update_current_span(test_case=LLMTestCase(input="...", actual_output="..."))
    return

@observe
def llm_app(input: str):
    inner_component()
    return

evaluate(observed_callback=llm_app, goldens=[Golden(input="Hi!")])
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: 包括的な使用ガイドとクイックスタート
- **docs/**: Docsifyベースのドキュメントサイト設定
- **CONTRIBUTING.md**: コントリビューションガイドライン
- **deepeval.com/docs**: オンラインドキュメント

### サンプル・デモ
- **examples/create_tests.py**: 評価テストケースの作成例
- **tests/**: 各メトリクスの詳細なテストケース
- **Google Colab**: クイックスタート用のColabノートブック

### チュートリアル・ガイド
- Getting Startedガイド（ドキュメント内）
- 各メトリクスの詳細説明
- 統合ガイド（LlamaIndex、Hugging Face）
- ベンチマークの使用方法

## 技術的詳細
### アーキテクチャ
#### 全体構造
DeepEvalはモジュラーアーキテクチャを採用し、メトリクス、テストケース、評価エンジンが独立して動作します。Pytestプラグインとして統合され、既存のテストワークフローにシームレスに組み込めます。

#### ディレクトリ構成
```
deepeval/
├── deepeval/                    # メインパッケージ
│   ├── metrics/                # 評価メトリクス
│   │   ├── base_metric.py     # 基底クラス
│   │   ├── g_eval/            # G-Evalメトリクス
│   │   ├── rag_metrics/       # RAG関連メトリクス
│   │   └── ...                # その他のメトリクス
│   ├── benchmarks/            # LLMベンチマーク
│   ├── test_case/             # テストケース定義
│   ├── dataset/               # データセット管理
│   ├── synthesizer/           # 合成データ生成
│   ├── tracing/               # コンポーネントトレーシング
│   ├── guardrails/            # 安全性チェック
│   └── integrations/          # 外部ツール統合
├── tests/                     # ユニットテスト
└── examples/                  # 使用例
```

#### 主要コンポーネント
- **メトリクスシステム**: 
  - 場所: `deepeval/metrics/`
  - 依存: BaseMetricクラスからの継承
  - インターフェース: measure()メソッドによる評価

- **テストケース管理**: 
  - 場所: `deepeval/test_case/`
  - 依存: 各種テストケースタイプ（LLM、会話、マルチモーダル）
  - インターフェース: 統一されたテストケースAPI

- **評価エンジン**: 
  - 場所: `deepeval/evaluate/`
  - 依存: Pytestとの統合
  - インターフェース: evaluate()関数とassert_test()

### 技術スタック
#### コア技術
- **言語**: Python 3.9以上
- **フレームワーク**: 
  - pytest: テストフレームワーク
  - typer: CLIフレームワーク
  - rich: リッチテキスト表示
- **主要ライブラリ**: 
  - openai: OpenAI API統合
  - anthropic: Anthropic API統合
  - google-genai (1.9.0): Google AI統合
  - ollama: ローカルLLMサポート
  - requests (2.31.0): HTTP通信
  - tqdm (4.66.1): プログレスバー
  - aiohttp: 非同期HTTP

#### 開発・運用ツール
- **ビルドツール**: Poetry（依存関係管理）
- **テスト**: pytest-xdist（並列実行）、pytest-asyncio（非同期テスト）
- **CI/CD**: GitHub Actions
- **デプロイ**: PyPI（pip install deepeval）
- **監視**: OpenTelemetry統合、Sentry SDK

### 設計パターン・手法
- プラグインアーキテクチャ（Pytestプラグイン）
- ストラテジーパターン（メトリクスの実装）
- デコレーターパターン（@observeトレーシング）
- ファクトリーパターン（モデルの生成）

### データフロー・処理フロー
1. テストケースの定義（入力、期待出力、実際の出力）
2. メトリクスの選択と設定
3. 評価の実行（ローカルまたはクラウド）
4. スコアと説明の生成
5. 結果のレポート（CLI、Confident AI、CI/CD）

## API・インターフェース
### 公開API
#### 評価API
- 目的: LLM出力の評価
- 使用例:
```python
from deepeval import evaluate
from deepeval.metrics import AnswerRelevancyMetric

metric = AnswerRelevancyMetric(threshold=0.7)
evaluate([test_case], [metric])
```

#### トレーシングAPI
- 目的: コンポーネントレベルの評価
- 使用例:
```python
@observe(metrics=[metric])
def my_llm_component():
    # コンポーネントのロジック
    pass
```

### 設定・カスタマイズ
#### 設定ファイル
```python
# 環境変数
export OPENAI_API_KEY="..."
export DEEPEVAL_API_KEY="..."  # Confident AI用

# カスタムモデルの使用
from deepeval.models import DeepEvalBaseLLM
```

#### 拡張・プラグイン開発
カスタムメトリクスの作成：
```python
from deepeval.metrics import BaseMetric

class CustomMetric(BaseMetric):
    def measure(self, test_case):
        # カスタム評価ロジック
        pass
```

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- 並列実行: pytest-xdistによる並列テスト実行
- 非同期処理: aiohttpによる非同期API呼び出し
- キャッシング: テスト結果のキャッシュ機能

### スケーラビリティ
- 大規模データセットの評価に対応
- クラウドベースの評価（Confident AI）
- 分散実行のサポート

### 制限事項
- PythonランタイムAPIレート制限に依存
- ローカル実行時のメモリ使用量
- 一部のメトリクスは計算コストが高い

## 評価・所感
### 技術的評価
#### 強み
- 包括的なメトリクスセット
- Pytestとの優れた統合
- 活発な開発とコミュニティサポート
- エンタープライズ向けのConfident AIプラットフォーム
- 豊富なドキュメントと例

#### 改善の余地
- より多くの言語モデルプロバイダーのサポート
- パフォーマンスの最適化余地
- カスタムメトリクスの作成がやや複雑

### 向いている用途
- LLMアプリケーションの品質保証
- RAGシステムの評価
- プロンプトエンジニアリングの検証
- CI/CDパイプラインでの自動テスト
- モデル比較とベンチマーキング

### 向いていない用途
- リアルタイム評価が必要な場合
- 非常に特殊な評価基準が必要な場合
- 極めて大規模なバッチ処理（コスト面）

### 総評
DeepEvalは、LLM評価の分野で最も包括的で使いやすいフレームワークの1つ。Pytestとの統合により、既存の開発ワークフローに簡単に組み込める。豊富なメトリクスとベンチマーク、そしてConfident AIプラットフォームとの統合により、開発から本番運用まで一貫したLLM品質管理が可能。8,800以上のスターが示すように、LLM開発コミュニティから高い評価を得ている実用的なツール。