# リポジトリ解析: kijai/ComfyUI-WanVideoWrapper

## 基本情報
- リポジトリ名: kijai/ComfyUI-WanVideoWrapper
- 主要言語: Python
- スター数: 3,685
- フォーク数: 278
- 最終更新: 進行中のプロジェクト（WIP）
- ライセンス: Apache License 2.0
- トピックス: ComfyUI, WanVideo, Video Generation, AI Video, Deep Learning

## 概要
### 一言で言うと
WanVideo（Alibaba製ビデオ生成モデル）とその関連モデルをComfyUIで使用するための包括的なラッパーノード集。新機能のテストベッドとしても機能する。

### 詳細説明
ComfyUI-WanVideoWrapperは、WanVideoおよび関連するビデオ生成モデルをComfyUIワークフローで使用できるようにするカスタムノードパッケージです。作者は自身のコーディング経験の不足とComfyUIコアコードの複雑さから、スタンドアロンのラッパーとして新機能を実装する方が容易で高速であると述べており、これは新しいリリースや可能性を探求するための個人的なサンドボックスとして機能しています。ネイティブComfyUIで利用できない機能やモデルを試すための環境を提供します。

### 主な特徴
- 複数のWanVideoモデルサイズ（1.3B、5B、14B）のサポート
- 20以上の拡張モデル（SkyReels、ReCamMaster、FantasyTalkingなど）の統合
- メモリ最適化機能（ブロックスワップ、ラジアルアテンション、fp8量子化）
- 長尺ビデオ生成（1000フレーム以上）のサポート
- 多様なスケジューラーとサンプリング手法
- GGUF量子化モデルのサポート
- ビデオ編集機能（Vid2vid、FlowEdit）
- コンテキストウィンドウによる効率的な長尺ビデオ生成

## 使用方法
### インストール
#### 前提条件
- ComfyUIがインストールされていること
- Python 3.8以上
- CUDA対応GPU（推奨）
- 十分なVRAM（モデルサイズに依存、最小8GB推奨）

#### インストール手順
```bash
# 方法1: ComfyUIのcustom_nodesフォルダにクローン
cd ComfyUI/custom_nodes
git clone https://github.com/kijai/ComfyUI-WanVideoWrapper

# 依存関係のインストール
cd ComfyUI-WanVideoWrapper
pip install -r requirements.txt

# 方法2: ポータブル版ComfyUIの場合
# ComfyUI_windows_portableフォルダで実行:
python_embeded\python.exe -m pip install -r ComfyUI\custom_nodes\ComfyUI-WanVideoWrapper\requirements.txt
```

### 基本的な使い方
#### Hello World相当の例（テキストからビデオ生成）
1. WanVideoModelLoaderでトランスフォーマーモデルをロード
2. WanVideoVAELoaderでVAEをロード
3. LoadWanVideoT5TextEncoderでテキストエンコーダーをロード
4. WanVideoTextEncodeでプロンプトをエンコード
5. WanVideoSamplerで生成
6. WanVideoDecodeでビデオにデコード

#### 実践的な使用例
```python
# ワークフローの基本構成（概念的）
# 1. モデルのロード
model = WanVideoModelLoader("wanvideo_1.3B_T2V_diffusion_model.safetensors")
vae = WanVideoVAELoader("wanvideo_vae.safetensors")
text_encoder = LoadWanVideoT5TextEncoder("google_t5-v1_1-xxl_encoder.safetensors")

# 2. テキストプロンプトのエンコード
embeds = WanVideoTextEncode(
    positive="A cat playing piano",
    negative="blurry, low quality"
)

# 3. ビデオ生成
latents = WanVideoSampler(
    model=model,
    embeds=embeds,
    width=512,
    height=512,
    num_frames=49,
    steps=25
)

# 4. デコード
video = WanVideoDecode(vae, latents)
```

### 高度な使い方
#### 長尺ビデオ生成（コンテキストウィンドウ使用）
```python
# 1025フレームの生成例
context_options = WanVideoContextOptions(
    context_size=81,
    context_overlap=16,
    context_stride=1
)

# ラジアルアテンションで効率化
model = WanVideoSetRadialAttention(
    model=model,
    dense_attention_mode="sageattn",
    dense_blocks=1,
    decay_factor=0.2
)

# 生成実行
latents = WanVideoSampler(
    model=model,
    embeds=embeds,
    context_options=context_options,
    num_frames=1025
)
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: インストール方法、基本的な使い方、サポートモデル一覧
- **モデルリポジトリ**: https://huggingface.co/Kijai/WanVideo_comfy/
- **fp8量子化モデル**: https://huggingface.co/Kijai/WanVideo_comfy_fp8_scaled

### サンプル・デモ
- **example_workflows/**: 20以上の実例ワークフロー
  - T2V（テキストからビデオ）
  - I2V（画像からビデオ）
  - Vid2vid（ビデオからビデオ）
  - ControlNet統合
  - 長尺ビデオ生成
  - 各拡張モデルの使用例

### チュートリアル・ガイド
- example_workflowsディレクトリ内のJSONファイルをComfyUIにロード可能
- 各ワークフローには対応するexample_inputs/フォルダ内のサンプル入力あり

## 技術的詳細
### アーキテクチャ
#### 全体構造
ComfyUIのカスタムノードシステムを利用し、WanVideoモデルとその派生モデルをラップする構造。各モデルは独立したモジュールとして実装され、共通のインターフェースを通じて統合される。メモリ管理はComfyUIのmodel_managementシステムを活用し、効率的なGPUメモリ使用を実現。

#### ディレクトリ構成
```
ComfyUI-WanVideoWrapper/
├── wanvideo/         # コアWanVideo実装
│   ├── configs/      # モデル設定ファイル
│   ├── modules/      # モデルコンポーネント（attention, vae, clip等）
│   ├── schedulers/   # 各種スケジューラー実装
│   └── radial_attention/  # ラジアルアテンション実装
├── nodes.py          # メインノード定義
├── nodes_model_loading.py  # モデルロード関連ノード
├── nodes_utility.py  # ユーティリティノード
├── fp8_optimization.py  # fp8量子化実装
├── cache_methods/    # キャッシング戦略
├── enhance_a_video/  # Enhance-A-Video統合
├── fantasytalking/   # FantasyTalking統合
├── multitalk/        # MultiTalk統合
├── skyreels/         # SkyReels統合
├── uni3c/            # Uni3C統合
└── example_workflows/  # サンプルワークフロー
```

#### 主要コンポーネント
- **WanVideoModelLoader**: トランスフォーマーモデルのロードと管理
  - 場所: `nodes_model_loading.py`
  - 依存: wanvideo.modules.model
  - インターフェース: loadmodel(), 各種モデル形式（safetensors, GGUF）のサポート

- **WanVideoSampler**: ビデオ生成の中核サンプリング処理
  - 場所: `nodes.py`
  - 依存: schedulers, model, vae
  - インターフェース: sample(), 多様なスケジューラーオプション

- **RadialAttention**: 長尺ビデオ用のスパースアテンション
  - 場所: `wanvideo/radial_attention/`
  - 依存: sparse_sage attention実装
  - インターフェース: 動的マスク生成、ブロックサイズ設定

- **BlockSwap**: メモリ最適化のためのブロック交換機構
  - 場所: `cache_methods/`
  - 依存: ComfyUI model_management
  - インターフェース: ブロック単位のCPU/GPU転送

### 技術スタック
#### コア技術
- **言語**: Python 3.8+
- **フレームワーク**: ComfyUI（カスタムノードシステム）
- **主要ライブラリ**: 
  - accelerate (>=1.2.1): GPU高速化とメモリ管理
  - diffusers (>=0.33.0): 拡散モデルコンポーネント
  - peft (>=0.15.0): LoRAサポート
  - einops: テンソル操作
  - gguf (>=0.14.0): 量子化モデルサポート
  - ftfy: テキスト修正
  - sentencepiece (>=0.2.0): T5トークナイザー
  - pyloudnorm: オーディオ正規化（音声同期用）

#### 開発・運用ツール
- **パッケージ管理**: pyproject.toml（Comfy Registry対応）
- **メモリ最適化**: 
  - fp8量子化
  - ブロックスワップ
  - ラジアルアテンション
  - GGUF量子化フォーマット
- **パフォーマンス**: 
  - PyTorchコンパイル対応
  - Flash Attention 2/3サポート
  - SageAttentionサポート

### 設計パターン・手法
- **モジュラー設計**: 各拡張モデルが独立したモジュールとして実装
- **パッチャーパターン**: ComfyUIのモデルパッチングシステムを活用
- **遅延ロード**: 必要時のみモデルをGPUにロード
- **コンテキストマネージャー**: メモリ管理とクリーンアップの自動化

### データフロー・処理フロー
1. **入力処理**: テキスト/画像/ビデオ入力をエンコード
2. **埋め込み生成**: T5/CLIPによるテキスト埋め込み、画像エンコード
3. **潜在空間処理**: VAEによる潜在表現への変換
4. **拡散プロセス**: スケジューラーに従ったノイズ除去
5. **デコード**: 潜在表現からビデオフレームへの変換
6. **後処理**: オプショナルな品質向上処理

## API・インターフェース
### 公開API
#### 主要ノードクラス
- **WanVideoSampler**: メインサンプリングノード
  - 入力: model, embeds, width, height, num_frames, steps等
  - 出力: LATENT（潜在表現）
  
- **WanVideoTextEncode**: テキストエンコーディング
  - 入力: text_encoder, positive_prompt, negative_prompt
  - 出力: WANVIDEOEMBEDS

### 設定・カスタマイズ
#### モデル配置
```
ComfyUI/models/
├── text_encoders/    # T5/CLIPテキストエンコーダー
├── clip_vision/      # CLIPビジョンモデル
├── diffusion_models/ # トランスフォーマーモデル
└── vae/              # VAEモデル
```

#### 拡張・プラグイン開発
新しいモデルの統合には以下が必要：
1. モジュールディレクトリの作成
2. ノードクラスの実装（INPUT_TYPES, RETURN_TYPES, FUNCTION定義）
3. __init__.pyへのNODE_CLASS_MAPPINGS追加

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- 1.3Bモデルで1025フレーム生成: 約5GB VRAM使用、RTX 5090で10分
- 14Bモデル: 20/40ブロックオフロードで約16GB VRAM使用
- コンテキストウィンドウ: 81フレーム窓、16フレームオーバーラップで効率的な長尺生成

### スケーラビリティ
- ラジアルアテンション: O(n)の計算量で長尺ビデオに対応
- ブロックスワップ: 大規模モデルの部分的GPU/CPU転送
- fp8/GGUF量子化: メモリ使用量を最大50%削減

### 制限事項
- 技術的制限:
  - 最大フレーム数はVRAMに依存
  - 一部の拡張モデルは特定の解像度のみサポート
  - GGUFモデルは若干の品質低下の可能性
- 運用上の制限:
  - 作者自身が「永続的なWIP」と明記
  - ネイティブComfyUI実装より安定性が劣る可能性
  - 互換性の問題が発生する可能性

## 評価・所感
### 技術的評価
#### 強み
- 非常に包括的なビデオ生成エコシステム（20以上のモデル統合）
- 優れたメモリ最適化技術（ラジアルアテンション、ブロックスワップ）
- 活発な開発と新モデルの迅速な統合
- 豊富な実例とワークフロー
- 長尺ビデオ生成の実用的なソリューション

#### 改善の余地
- コードの複雑性（作者自身が認める）
- ドキュメンテーションの不足（READMEは基本的な情報のみ）
- 安定性の懸念（「永続的なWIP」として開発）
- ネイティブComfyUI実装との重複

### 向いている用途
- 最新のビデオ生成モデルの実験と評価
- 長尺ビデオ（数百〜千フレーム）の生成
- 特殊なビデオ生成タスク（トーキングヘッド、カメラ制御など）
- メモリ制限のある環境での大規模モデル実行
- 研究開発やプロトタイピング

### 向いていない用途
- プロダクション環境での安定運用が必要な場合
- シンプルで基本的なビデオ生成のみが必要な場合
- ComfyUIの学習初期段階のユーザー

### 総評
ComfyUI-WanVideoWrapperは、ビデオ生成分野の最先端モデルを統合した野心的なプロジェクトです。特に長尺ビデオ生成やメモリ最適化の実装は技術的に優れており、研究者や先進的なユーザーにとって価値あるツールとなっています。一方で、「個人的なサンドボックス」として開発されているため、安定性や保守性には課題があります。ネイティブComfyUIで利用できない新機能を試したい場合や、最新のビデオ生成技術を探求したいユーザーには最適ですが、安定した運用を求める場合は注意が必要です。