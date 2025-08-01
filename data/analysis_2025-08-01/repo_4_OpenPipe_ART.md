# リポジトリ解析: OpenPipe/ART

## 基本情報
- リポジトリ名: OpenPipe/ART
- 主要言語: Python
- スター数: 1,038
- フォーク数: 131
- 最終更新: 2025年8月（活発に更新中）
- ライセンス: Apache-2.0 License
- トピックス: Reinforcement Learning, Agent Training, GRPO, LLM, Multi-step Agents, RULER

## 概要
### 一言で言うと
GRPO（Generalized Reinforcement Preference Optimization）を使用して、実世界のタスクに対応する複数ステップエージェントを訓練するためのオープンソースRLフレームワーク。RULER（Relative Universal LLM-Elicited Rewards）により、手作業の報酬関数なしで自動的にエージェントの軌跡を評価可能。

### 詳細説明
ART（Agent Reinforcement Trainer）は、LLMが経験から学習できるようにすることで、エージェントの信頼性を向上させるオープンソースのRLフレームワークです。既存のPythonアプリケーションにGRPOを統合するための使いやすいハーネスを提供し、LLMベースのエージェントが実際のタスクで改善できるようにします。

RULER（ゼロショットエージェント報酬）機能により、ラベル付きデータや専門家のフィードバック、報酬エンジニアリングを必要とせず、LLM-as-judgeを使用してエージェントの軌跡を自動的にスコアリングします。これにより、開発時間を2-3倍高速化し、4つのうち3つのベンチマークで手作業の報酬関数と同等以上のパフォーマンスを実現します。

### 主な特徴
- **RULER**: ゼロショット自動報酬生成システム（手作業の報酬関数不要）
- **分散アーキテクチャ**: クライアント・サーバー分離による柔軟な実行環境
- **統合推論・訓練ループ**: vLLMベースの推論とGRPO訓練の統合
- **マルチモデル対応**: vLLM/HuggingFace互換の因果言語モデルをサポート
- **観測性**: W&B、Langfuse、OpenPipeとの統合
- **スケーラブル**: SkyPilotを使用したGPU環境の自動プロビジョニング
- **実績のあるパフォーマンス**: ART·E（メールエージェント）でOpenAI o3を上回る性能

## 使用方法
### インストール
#### 前提条件
- Python 3.10以上
- GPUマシン（訓練用）またはGPUクラウドアクセス（SkyPilot経由）
- 必要なAPIキー（使用するモデルに応じて）

#### インストール手順
```bash
# 方法1: pip経由でインストール
pip install openpipe-art

# 方法2: ソースからインストール（開発用）
git clone https://github.com/openpipe/art
cd art
pip install -e .

### 基本的な使い方
#### Hello World相当の例（RULERを使った基本的な報酬計算）
```python
import art
from art.rewards.ruler import ruler_score_group

# モデルの定義
model = art.Model(
    name="my-agent",
    project="hello-world",
    inference_model_name="openai/gpt-4o-mini"
)

# エージェントの軌跡グループ（複数の実行結果）
group = art.TrajectoryGroup(
    model=model,
    trajectories=[
        # 各軌跡には会話履歴と報酬が含まれる
        art.Trajectory(
            messages_and_choices=[...],
            reward=0  # RULERが自動的に設定
        )
    ]
)

# RULERで自動スコアリング
judged_group = await ruler_score_group(group, "openai/o3")
```

#### 実践的な使用例（2048ゲームエージェントの訓練）
```python
import art
import asyncio
from typing import List

# 訓練可能モデルの定義
model = art.TrainableModel(
    name="2048-agent",
    project="2048",
    base_model="Qwen/Qwen2.5-3B-Instruct",
    inference_engine="vllm",
)

# 訓練ループ
async def train():
    async with art.start(model) as api:
        for step in range(10):  # 10ステップの訓練
            # 並列でロールアウトを実行
            groups = await asyncio.gather(*[
                play_game(api) for _ in range(4)
            ])
            
            # RULERで報酬を自動計算
            judged_groups = await asyncio.gather(*[
                ruler_score_group(g, "openai/gpt-4o-mini")
                for g in groups
            ])
            
            # モデルの訓練
            await api.train(judged_groups)

# ゲームプレイのロールアウト
async def play_game(api: art.Model) -> art.TrajectoryGroup:
    trajectory = art.Trajectory(
        messages_and_choices=[],
        reward=0
    )
    
    # システムプロンプト
    trajectory.messages_and_choices.append({
        "role": "system",
        "content": "You are playing 2048. Make moves to maximize score."
    })
    
    # ゲームループ
    while not game_over:
        # 現在の盤面を送信
        trajectory.messages_and_choices.append({
            "role": "user",
            "content": f"Board: {board_state}"
        })
        
        # AIの手を取得
        response = await api.create_completion(trajectory)
        move = parse_move(response.content)
        
        # 手を実行
        board_state = make_move(board_state, move)
    
    return art.TrajectoryGroup(
        model=api,
        trajectories=[trajectory]
    )
```

### 高度な使い方（ART·Eメールエージェント）
```python
import art
from email_search_tools import EmailSearchTool

# カスタム設定付きモデル
model = art.TrainableModel(
    name="email-agent",
    project="art-e",
    base_model="Qwen/Qwen2.5-14B-Instruct",
    inference_engine="vllm",
    config=art.TrainConfig(
        total_steps=100,
        batch_size=8,
        learning_rate=1e-5,
        gradient_accumulation_steps=4,
    )
)

# ツール付きエージェント
async def email_agent_rollout(api: art.Model, query: str):
    trajectory = art.Trajectory(
        messages_and_choices=[],
        tools=[EmailSearchTool.schema()],
        reward=0
    )
    
    # 複数ステップの推論
    for step in range(5):
        response = await api.create_completion(
            trajectory,
            tools=[EmailSearchTool.schema()]
        )
        
        if response.tool_calls:
            # ツール実行
            for tool_call in response.tool_calls:
                result = await EmailSearchTool.execute(
                    tool_call.function.arguments
                )
                trajectory.messages_and_choices.append({
                    "role": "tool",
                    "content": str(result),
                    "tool_call_id": tool_call.id
                })
        else:
            # 最終回答
            break
    
    return trajectory
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、クイックスタート、主要機能の説明
- **docs/**: 詳細なドキュメント（Mintlifyベース）
  - `fundamentals/`: コア概念（訓練ループ、クライアント、バックエンド、RULER）
  - `getting-started/`: インストール、セットアップ、FAQ
  - `features/`: 高度な機能（追加履歴、チェックポイントフォーク）
- **公式サイト**: https://art.openpipe.ai
- **ブログ記事**: 
  - [AutoRL: Zero-Data Training](https://x.com/mattshumer_/status/1950572449025650733)
  - [RULER: Easy Mode for RL Rewards](https://openpipe.ai/blog/ruler-easy-mode-for-rl-rewards)
  - [ART·E: Email Agent that Beats o3](https://openpipe.ai/blog/art-e-mail-agent)

### サンプル・デモ
- **examples/2048/**: 2048ゲームをプレイするエージェント（Qwen 2.5 3B）
- **examples/art-e/**: メール検索エージェント（Qwen 2.5 14B、o3を上回る性能）
- **examples/temporal_clue/**: Temporal Clueパズルを解くエージェント
- **examples/tic_tac_toe/**: 三目並べエージェント
- **examples/codenames/**: Codenamesゲームエージェント
- **examples/auto_rl.ipynb**: RULERを使った任意タスクの自動訓練

### チュートリアル・ガイド
- Google Colabノートブック（各例に付属）
- Discordコミュニティ: https://discord.gg/zbBHRUpwf4
- ステップバイステップチュートリアル（docs/tutorials/）

## 技術的詳細
### アーキテクチャ
#### 全体構造
ARTはクライアント・サーバーアーキテクチャを採用し、推論と訓練を分離しています：

1. **クライアント**: OpenAI互換APIを提供し、ユーザーコードとの統合を簡素化
2. **バックエンド**: GPU上で動作し、vLLMによる推論とGRPOによる訓練を管理
3. **訓練ループ**: 推論→軌跡収集→報酬割り当て→訓練のサイクルを自動化

#### ディレクトリ構成
```
ART/
├── src/art/              # コアライブラリ
│   ├── backend.py        # バックエンドAPIクライアント
│   ├── model.py          # Model/TrainableModelクラス
│   ├── trajectories.py   # 軌跡データ構造
│   ├── openai.py         # OpenAI APIパッチング
│   ├── rewards/          # 報酬関数（RULER）
│   │   └── ruler.py      # RULER実装
│   ├── vllm/             # vLLM統合
│   ├── unsloth/          # Unsloth訓練統合
│   ├── torchtune/        # Torchtune訓練統合
│   ├── skypilot/         # クラウドデプロイ
│   └── utils/            # ユーティリティ関数
├── examples/             # 実装例とベンチマーク
│   ├── 2048/             # 2048ゲームエージェント
│   ├── art-e/            # メールエージェント
│   ├── temporal_clue/    # パズルエージェント
│   └── tic_tac_toe/      # 三目並べエージェント
├── docs/                 # Mintlifyドキュメント
└── scripts/              # デプロイ・管理スクリプト
```

#### 主要コンポーネント
- **Model/TrainableModel**: エージェントモデルの抽象化
  - 場所: `src/art/model.py`
  - 依存: Backend、OpenAI Client
  - インターフェース: `create_completion()`, `train()`

- **Trajectory/TrajectoryGroup**: 会話履歴と報酬のデータ構造
  - 場所: `src/art/trajectories.py`
  - 依存: Pydantic
  - インターフェース: メッセージ管理、メトリクス追跡

- **Backend**: 推論・訓練サーバーとの通信
  - 場所: `src/art/backend.py`
  - 依存: httpx、vLLM/Unsloth
  - インターフェース: `register()`, `_train_model()`, `_log()`

- **RULER**: 自動報酬生成システム
  - 場所: `src/art/rewards/ruler.py`
  - 依存: LiteLLM
  - インターフェース: `ruler()`, `ruler_score_group()`

### 技術スタック
#### コア技術
- **言語**: Python 3.10+ (async/await、型ヒント活用)
- **推論エンジン**: 
  - vLLM 0.9.1: 高速推論、LoRAサポート
  - OpenAI API互換インターフェース
- **訓練フレームワーク**:
  - Unsloth: 効率的なLoRA訓練
  - TorchTune: PyTorch公式の訓練ライブラリ
  - TRL 0.19.0: HuggingFaceのRL訓練ライブラリ
- **主要ライブラリ**: 
  - transformers (4.53.2): モデルとトークナイザー
  - peft (0.14.0): Parameter-Efficient Fine-Tuning
  - litellm (1.63.0): 統一LLM API
  - weave (0.51.51): 実験追跡
  - typer (0.15.2): CLIフレームワーク

#### 開発・運用ツール
- **パッケージ管理**: uv (高速Python環境管理)
- **クラウドデプロイ**: SkyPilot (マルチクラウド対応)
- **観測性**: 
  - Weights & Biases: 実験追跡
  - Langfuse: LLMトレース
  - OpenPipe: データ管理
- **ストレージ**: S3互換ストレージ（チェックポイント、ログ）

### 設計パターン・手法
- **クライアント・サーバー分離**: 推論と訓練の分離により柔軟なデプロイが可能
- **OpenAI APIパッチング**: 既存コードの最小限の変更で統合可能
- **非同期処理**: 並列ロールアウトによる効率的なデータ収集
- **LoRAベースの訓練**: 効率的なパラメータ更新とチェックポイント管理
- **相対的報酬**: RULERによる軌跡グループ内での相対評価

### データフロー・処理フロー
```
1. ロールアウト実行
   ├── クライアントがcreate_completion()を呼び出し
   ├── バックエンドのvLLMが推論実行
   └── 応答をTrajectoryに記録

2. 報酬割り当て
   ├── 手動: trajectory.reward = score
   └── 自動: ruler_score_group()でLLM判定

3. 訓練実行
   ├── TrajectoryGroupをバックエンドに送信
   ├── GRPOアルゴリズムで訓練
   ├── 新しいLoRAチェックポイント保存
   └── vLLMに新モデルをロード

4. 次のイテレーション
   └── 更新されたモデルで1に戻る
```

## API・インターフェース
### 公開API
#### art.start() - 訓練セッション開始
- 目的: モデルの訓練セッションを開始し、APIコンテキストを提供
- 使用例:
```python
async with art.start(model, backend="local") as api:
    # apiを使用してロールアウトを実行
    trajectory = await rollout(api)
    await api.train([trajectory])
```

#### Model.create_completion() - 推論実行
- 目的: OpenAI互換のCompletion APIでモデル推論を実行
- 使用例:
```python
response = await model.create_completion(
    trajectory,  # または直接メッセージリスト
    temperature=0.7,
    max_tokens=100,
    tools=[{"type": "function", "function": {...}}]
)
```

#### ruler_score_group() - 自動報酬計算
- 目的: 軌跡グループをLLMで評価し、相対スコアを割り当て
- 使用例:
```python
judged_group = await ruler_score_group(
    trajectory_group,
    judge_model="openai/o3",
    rubric="Custom evaluation criteria..."
)
```

### 設定・カスタマイズ
#### TrainConfig設定
```python
config = art.TrainConfig(
    # 訓練パラメータ
    total_steps=100,              # 訓練ステップ数
    batch_size=8,                 # バッチサイズ
    gradient_accumulation_steps=4, # 勾配累積
    learning_rate=1e-5,           # 学習率
    
    # 最適化設定
    warmup_steps=10,              # ウォームアップ
    weight_decay=0.01,            # 重み減衰
    
    # LoRA設定
    lora_rank=16,                 # LoRAランク
    lora_alpha=32,                # LoRAアルファ
    lora_dropout=0.1,             # ドロップアウト
    
    # チェックポイント
    save_steps=10,                # 保存間隔
    eval_steps=10,                # 評価間隔
)
```

#### バックエンド設定
```python
# ローカルGPU使用
backend = art.backends.LocalBackend(
    base_url="http://localhost:7999"
)

# SkyPilotクラウド使用
backend = art.backends.SkypilotBackend(
    cluster_name="art-training",
    cloud="gcp",  # または "aws", "azure"
    instance_type="A100:1"
)
```

#### 拡張・プラグイン開発
- **カスタム報酬関数**: `Trajectory.reward`に任意のロジックを実装
- **カスタムツール**: OpenAI関数呼び出し仕様に準拠したツール定義
- **カスタムバックエンド**: `Backend`基底クラスを継承して実装
- **評価メトリクス**: `Trajectory.metrics`に任意のメトリクスを追加

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
#### ベンチマーク結果
- **ART·E (メールエージェント)**: 
  - Qwen 2.5 14BがOpenAI o3を上回る性能
  - 精度: 訓練前30%→訓練後85%以上
- **2048ゲーム**: 
  - Qwen 2.5 3B: 10ステップで高スコア達成率が大幅向上
- **推論速度**: vLLMによる高速推論（バッチ処理対応）
- **訓練効率**: Unslothにより標準実装より2-5倍高速

#### 最適化手法
- LoRAによる効率的なパラメータ更新（フルファインチューニングの10%以下のメモリ）
- Flash Attention 2による高速アテンション計算
- 量子化（QLoRA）オプションによるメモリ削減
- 並列ロールアウトによるデータ収集の高速化

### スケーラビリティ
- **水平スケーリング**: 複数GPUでの並列推論（vLLMテンソル並列）
- **クラウドスケーリング**: SkyPilotによる自動リソース管理
- **チェックポイント管理**: S3ベースの分散チェックポイント保存
- **大規模モデル対応**: 70Bパラメータモデルまでサポート

### 制限事項
#### 技術的な制限
- vLLM/HuggingFace互換の因果言語モデルのみサポート
- Gemma 3は現在非対応
- 訓練中は推論がブロックされる（将来的に改善予定）
- Windows環境は未テスト

#### 運用上の制限
- GPU必須（推論・訓練とも）
- 大規模モデルには相応のVRAMが必要（14Bモデルで24GB+）
- RULERの判定コストが発生（judge_modelの料金）

## 評価・所感
### 技術的評価
#### 強み
- RULERによる革新的な自動報酬生成（手作業の報酬関数が不要）
- 実証済みの性能（ART·Eでo3を上回る）
- エレガントなAPI設計（OpenAI互換で既存コードへの統合が容易）
- 包括的なツールセット（推論、訓練、評価、デプロイ）
- 活発な開発とコミュニティサポート
- 実用的なサンプルと詳細なドキュメント

#### 改善の余地
- 訓練中の推論ブロッキング（並行実行できない）
- Windows環境のサポート不足
- 一部モデル（Gemma 3など）の互換性
- RULERの判定コスト（特に高性能judge_model使用時）
- より多様なベンチマークとユースケースの必要性

### 向いている用途
- 複数ステップの推論を必要とするエージェント開発
- カスタマーサポート、情報検索、タスク自動化
- ゲームAI、パズル解決エージェント
- 既存のプロンプトベースシステムの性能改善
- 研究・実験目的のエージェント開発
- 報酬関数の設計が困難なドメイン

### 向いていない用途
- リアルタイム応答が必要なシステム
- 単一ステップの単純なタスク
- GPUリソースが限られた環境
- 厳密な再現性が要求される用途
- プロプライエタリモデルのみを使用する環境

### 総評
ARTは、LLMベースのエージェント開発における重要なブレークスルーを実現したフレームワークです。特にRULERによる自動報酬生成は、従来のRL開発で最も困難だった報酬関数設計の問題を根本的に解決し、開発速度を劇的に向上させます。

実際にART·Eがo3を上回る性能を示したことは、このアプローチの有効性を実証しています。OpenAI互換APIによる既存システムへの統合の容易さ、包括的なツールセット、活発なコミュニティサポートも大きな強みです。

一方で、訓練中の推論ブロッキングやプラットフォーム制限など、実運用上の課題も存在します。しかし、これらは技術的に解決可能な問題であり、プロジェクトの急速な発展を考慮すると、近い将来改善される可能性が高いでしょう。

総じて、ARTは実用的なマルチステップエージェントを開発したい開発者にとって、現時点で最も有望な選択肢の一つと言えます。