# リポジトリ解析: SkyworkAI/SkyReels-V2

## 基本情報
- リポジトリ名: SkyworkAI/SkyReels-V2
- 主要言語: Python
- スター数: 3,948
- フォーク数: 492
- 最終更新: 2025年6月（活発に更新中）
- ライセンス: Other (Skywork Community License)
- トピックス: Video Generation, Diffusion Forcing, Text-to-Video, Image-to-Video, AI Film Generation

## 概要
### 一言で言うと
初のオープンソースAutoRegressive Diffusion-Forcingアーキテクチャを採用した無限長ビデオ生成モデル。SOTA性能を達成し、最大30秒以上の高品質なフィルムスタイルビデオ生成が可能。

### 詳細説明
SkyReels-V2は、Skywork AIが開発した世界初の無限長フィルム生成モデルで、Diffusion Forcingフレームワークを活用しています。このモデルは、マルチモーダル大規模言語モデル（MLLM）、マルチステージ事前学習、強化学習、およびDiffusion Forcing技術を統合して包括的な最適化を実現しています。従来のビデオ生成モデルが抱えていた「プロンプト適合性」「視覚品質」「動きのダイナミクス」「動画長」のバランスという課題を克服し、プロフェッショナルな映画スタイルの生成を可能にします。

### 主な特徴
- **無限長ビデオ生成**: Diffusion Forcingで数分間のビデオ生成が可能
- **3つの生成モード**: Diffusion Forcing (DF)、Text-to-Video (T2V)、Image-to-Video (I2V)
- **複数モデルサイズ**: 1.3B、5B、14Bパラメータ
- **高解像度サポート**: 540P (544×960) および 720P (720×1280)
- **SkyCaptioner-V1**: ビデオキャプショニングモデルでショットメタデータを詳細分析
- **マルチGPU対応**: xDiT USPによる効率的な分散推論
- **高度な制御機能**: 開始/終了フレーム制御、ビデオ拡張
- **強化学習による最適化**: 動きの品質向上

## 使用方法
### インストール
#### 前提条件
- Python 3.10.12（テスト済み環境）
- CUDA対応GPU
- 十分なVRAM：
  - 1.3Bモデル: 約14.7GB (540P)
  - 14Bモデル: 約43-51GB (540P)

#### インストール手順
```bash
# リポジトリのクローン
git clone https://github.com/SkyworkAI/SkyReels-V2
cd SkyReels-V2

# 依存関係のインストール
pip install -r requirements.txt
```

### 基本的な使い方
#### Hello World相当の例（T2V基本生成）
```bash
model_id=Skywork/SkyReels-V2-T2V-14B-540P
python3 generate_video.py \
  --model_id ${model_id} \
  --resolution 540P \
  --num_frames 97 \
  --guidance_scale 6.0 \
  --shift 8.0 \
  --fps 24 \
  --prompt "A serene lake surrounded by towering mountains" \
  --offload
```

#### 実践的な使用例（Diffusion Forcingで10秒動画）
```bash
model_id=Skywork/SkyReels-V2-DF-14B-540P
# 同期推論で高品質10秒動画生成
python3 generate_video_df.py \
  --model_id ${model_id} \
  --resolution 540P \
  --ar_step 0 \
  --base_num_frames 97 \
  --num_frames 257 \
  --overlap_history 17 \
  --prompt "A graceful white swan swimming in a serene lake at dawn" \
  --addnoise_condition 20 \
  --offload \
  --teacache \
  --use_ret_steps \
  --teacache_thresh 0.3
```

### 高度な使い方
#### 30秒の長尺ビデオ生成（非同期モード）
```bash
model_id=Skywork/SkyReels-V2-DF-14B-540P
python3 generate_video_df.py \
  --model_id ${model_id} \
  --resolution 540P \
  --ar_step 5 \
  --causal_block_size 5 \
  --base_num_frames 97 \
  --num_frames 737 \
  --overlap_history 17 \
  --prompt "${your_prompt}" \
  --addnoise_condition 20 \
  --offload
```

#### ビデオ拡張
```bash
python3 generate_video_df.py \
  --model_id ${model_id} \
  --video_path ${input_video} \
  --num_frames 120 \
  --overlap_history 17 \
  --prompt "${prompt_describing_extension}"
```

#### 開始/終了フレーム制御
```bash
python3 generate_video_df.py \
  --model_id ${model_id} \
  --image ${start_image} \
  --end_image ${end_image} \
  --prompt "${prompt}" \
  --num_frames 97
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: 詳細な使用方法、モデル一覧、パラメータ説明
- **Technical Report**: https://arxiv.org/pdf/2504.13074
- **Playground**: https://www.skyreels.ai/home
- **Discord**: コミュニティサポート

### モデルリポジトリ
- **Hugging Face**: https://huggingface.co/collections/Skywork/skyreels-v2-6801b1b93df627d441d0d0d9
- **ModelScope**: https://www.modelscope.cn/collections/SkyReels-V2-f665650130b144
- **SkyCaptioner-V1**: https://huggingface.co/Skywork/SkyCaptioner-V1

### チュートリアル・ガイド
- README内の詳細なQuickstartセクション
- 各生成モードのサンプルコマンド
- パラメータ調整ガイド
- マルチGPU使用方法

## 技術的詳細
### アーキテクチャ
#### 全体構造
SkyReels-V2はDiffusion Transformer (DiT)アーキテクチャを基盤とし、AutoRegressive Diffusion-Forcingを実装した初のオープンソースモデルです。包括的なデータ処理パイプライン、ビデオキャプショナー、マルチタスク事前学習、強化学習、高品質SFTを統合しています。

#### ディレクトリ構成
```
SkyReels-V2/
├── skyreels_v2_infer/     # 推論コアモジュール
│   ├── modules/           # モデルコンポーネント
│   │   ├── transformer.py # WanModel実装
│   │   ├── attention.py   # Flash Attention等
│   │   ├── vae.py         # ビデオVAE
│   │   ├── t5.py          # T5テキストエンコーダー
│   │   └── xlm_roberta.py # 多言語サポート
│   ├── pipelines/         # 生成パイプライン
│   │   ├── diffusion_forcing_pipeline.py
│   │   ├── text2video_pipeline.py
│   │   └── image2video_pipeline.py
│   ├── scheduler/         # スケジューラー
│   └── distributed/       # 分散推論
├── skycaptioner_v1/       # ビデオキャプショニング
├── generate_video.py      # T2V/I2V生成スクリプト
├── generate_video_df.py   # Diffusion Forcing生成
└── requirements.txt       # 依存関係

#### 主要コンポーネント
- **WanModel (Transformer)**: ビデオ生成のコアモデル
  - 場所: `skyreels_v2_infer/modules/transformer.py`
  - 依存: VAE, Text Encoders, Attention
  - インターフェース: 3Dパッチ埋め込み、RoPE、RMS正規化

- **WanVAE**: ビデオ用VAE
  - 場所: `skyreels_v2_infer/modules/vae.py`
  - 依存: Causal 3D Convolutions
  - インターフェース: encode/decode, キャッシング機構

- **SkyCaptioner-V1**: ビデオキャプショニング
  - 場所: `skycaptioner_v1/`
  - 依存: Qwen2.5-VL-7B
  - インターフェース: ショットタイプ、アングル、カメラ動き分析

- **Diffusion Forcing**: 無限長生成モジュール
  - 場所: `skyreels_v2_infer/pipelines/diffusion_forcing_pipeline.py`
  - 依存: Transformer, Scheduler
  - インターフェース: 同期/非同期生成、オーバーラップ履歴

### 技術スタック
#### コア技術
- **言語**: Python 3.10.12
- **フレームワーク**: PyTorch 2.0+
- **主要ライブラリ**: 
  - transformers: T5/XLM-RoBERTaテキストエンコーダー
  - einops: テンソル操作
  - flash-attn: 高速アテンション
  - xDiT: 分散推論最適化
  - vllm: 高速推論
  - deepspeed: 分散学習

#### 最適化技術
- **Flow Matching Scheduler**: UniPCマルチステップ
- **TeaCache**: 推論高速化（最大30%高速化）
- **xDiT USP**: マルチGPU分散推論
- **メモリ管理**: CPUオフロード、bfloat16精度

### 設計パターン・手法
- **Diffusion Forcing**: 各トークンに独立したノイズレベルを割り当て
- **マルチステージ学習**: 事前学習→強化学習→DF学習→高品質SFT
- **プロンプトエンハンサー**: Qwen2.5-32Bで詳細化
- **長尺生成**: オーバーラップ履歴とノイズ条件付け

### データフロー・処理フロー
```
1. テキスト入力 → T5/XLM-RoBERTaエンコード
2. （I2Vの場合）画像入力 → VAEエンコード
3. ノイズスケジューリング
   - Diffusion Forcing: タイムステップマトリックス生成
   - 標準: 全トークン同一ノイズ
4. Transformer推論
   - Classifier-free guidance
   - 反復デノイジング
5. VAEデコード → ビデオフレーム
6. 後処理・保存
```

## API・インターフェース
### 公開API
#### 生成スクリプトインターフェース
- **generate_video.py**: T2V/I2V標準生成
- **generate_video_df.py**: Diffusion Forcing長尺生成

### 設定・カスタマイズ
#### 主要パラメータ
```python
# 基本パラメータ
--prompt: テキストプロンプト
--resolution: 540Pまたは720P
--num_frames: 97 (540P) または 121 (720P)
--guidance_scale: 6.0 (T2V) または 5.0 (I2V)
--shift: 8.0 (T2V) または 5.0 (I2V)

# Diffusion Forcing特有
--ar_step: 0 (同期) または 5+ (非同期)
--base_num_frames: 基本フレーム数
--overlap_history: 17 (推奨)
--addnoise_condition: 20 (推奨)
--causal_block_size: 5 (非同期時)

# 最適化
--offload: CPUオフロード
--teacache: 高速化有効
--teacache_thresh: 0.1-0.3
--use_usp: マルチGPU使用
```

#### フレーム数設定
- 10秒: `--num_frames 257`
- 15秒: `--num_frames 377`
- 30秒: `--num_frames 737`
- 60秒: `--num_frames 1457`

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
#### VBenchベンチマーク結果
- 総合スコア: 83.9% (SOTA among open-source)
- 品質スコア: 84.7%
- セマンティックスコア: 80.8%

#### 人間評価 (SkyReels-Bench)
- 指示適合性: 3.15/5 (T2V最高)
- 一貫性: 3.35/5
- 視覚品質: 3.34/5
- 動きの品質: 2.74/5

### スケーラビリティ
- **無限長生成**: Diffusion Forcingで数分間のビデオが可能
- **マルチGPU**: xDiT USPで効率的な分散推論
- **メモリ効率**: CPUオフロード、TeaCache高速化

### 制限事項
- **技術的制限**:
  - 大きな変形動きの処理が苦手
  - 物理法則に反する動画が生成される場合あり
  - 非同期モードは同期モードより低速
- **運用上の制限**:
  - 高VRAM要求 (14Bモデルで43GB+)
  - Skywork Community Licenseによる利用制限
  - 5Bモデル、カメラディレクターモデルは未公開

## 評価・所感
### 技術的評価
#### 強み
- 初のオープンソースAutoRegressive Diffusion-Forcing実装
- オープンソースモデルでSOTA性能を達成
- 無限長ビデオ生成の実現
- SkyCaptionerによる高度なショット分析
- 強化学習による動きの品質向上
- 実用的なビデオ拡張・フレーム制御機能

#### 改善の余地
- 大きな変形動きの処理
- 物理法則の遵守
- メモリ効率（特に14Bモデル）
- 生成速度（特に非同期モード）

### 向いている用途
- 映画・ビデオコンテンツ制作
- ストーリーテリング・ナラティブ生成
- 教育コンテンツ制作
- ビジュアルエフェクト・アニメーション
- プロトタイピング・コンセプトアート

### 向いていない用途
- リアルタイム生成が必要な用途
- 低VRAM環境での利用
- 精密な物理シミュレーション
- 商用利用（ライセンス確認必要）

### 総評
SkyReels-V2はビデオ生成分野における大きなブレークスルーで、特にDiffusion Forcingによる無限長ビデオ生成の実現は画期的です。オープンソースモデルとしてはHunyuanVideoやWanVideoを上回るSOTA性能を達成し、商用モデルに近い品質を実現しています。SkyCaptionerによるショット分析や強化学習による最適化など、技術的な工夫も充実しています。一方で、高いVRAM要求や生成速度の課題はあるものの、映画制作やコンテンツクリエイションの分野で大きな可能性を示すモデルです。