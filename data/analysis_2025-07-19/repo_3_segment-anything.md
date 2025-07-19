# リポジトリ解析: facebookresearch/segment-anything

## 基本情報
- リポジトリ名: facebookresearch/segment-anything
- 主要言語: Jupyter Notebook
- スター数: 51,135
- フォーク数: 5,995
- 最終更新: 2024-09-18
- ライセンス: Apache License 2.0
- トピックス: 画像セグメンテーション、コンピュータビジョン、ゼロショット学習、Foundation Model

## 概要
### 一言で言うと
Segment Anything Model (SAM)は、ポイントやボックスなどのプロンプトから高品質なオブジェクトマスクを生成できる、Meta AI Researchが開発した汎用セグメンテーションのFoundation Modelです。

### 詳細説明
Segment Anything Model (SAM)は、Meta AI ResearchのFAIRチームが開発した画期的な画像セグメンテーションモデルです。1100万枚の画像と111億個のマスクで構成される大規模データセット（SA-1B）で訓練され、多様なセグメンテーションタスクにおいて強力なゼロショット性能を示します。ユーザーがポイント、ボックス、テキストなどのプロンプトを入力することで、対象オブジェクトの正確なセグメンテーションマスクを生成できます。また、画像全体のすべてのオブジェクトを自動的にセグメント化する機能も提供しています。

最新のアップデートでは、SAM 2がリリースされ、画像だけでなく動画にも対応したより高度なセグメンテーション機能を提供しています。

### 主な特徴
- ポイント、ボックス、テキストなど様々なプロンプトに対応
- 1100万枚の画像と111億個のマスクで訓練された大規模モデル
- 強力なゼロショット性能
- 画像全体の自動セグメンテーション機能
- 3つのモデルサイズ（ViT-B、ViT-L、ViT-H）を提供
- ONNXエクスポート対応でブラウザ上でも動作可能
- Webデモアプリケーションの提供
- 高速な推論速度
- SA-1Bデータセットの公開

## 使用方法
### インストール
#### 前提条件
- Python >= 3.8
- PyTorch >= 1.7
- TorchVision >= 0.8
- CUDAサポート付きのPyTorchを強く推奨

#### インストール手順
```bash
# 方法1: pipで直接インストール
pip install git+https://github.com/facebookresearch/segment-anything.git

# 方法2: ソースからインストール
git clone git@github.com:facebookresearch/segment-anything.git
cd segment-anything
pip install -e .

# オプショナル依存関係（マスク処理、可視化、ONNXエクスポート用）
pip install opencv-python pycocotools matplotlib onnxruntime onnx jupyter
```

### 基本的な使い方
#### Hello World相当の例
```python
# プロンプトを使ったセグメンテーション
from segment_anything import SamPredictor, sam_model_registry

# モデルのロード
sam = sam_model_registry["vit_h"](checkpoint="sam_vit_h_4b8939.pth")
predictor = SamPredictor(sam)

# 画像を設定
predictor.set_image(image)

# ポイントプロンプトでマスクを生成
masks, scores, logits = predictor.predict(
    point_coords=np.array([[100, 200]]),
    point_labels=np.array([1]),  # 1=前景, 0=背景
)
```

#### 実践的な使用例
```python
# 画像全体の自動セグメンテーション
from segment_anything import SamAutomaticMaskGenerator, sam_model_registry

sam = sam_model_registry["vit_h"](checkpoint="sam_vit_h_4b8939.pth")
mask_generator = SamAutomaticMaskGenerator(sam)

# 画像からすべてのマスクを生成
masks = mask_generator.generate(image)

# マスク情報を取得
for i, mask in enumerate(masks):
    print(f"Mask {i}: area={mask['area']}, confidence={mask['predicted_iou']:.2f}")
```

### 高度な使い方
```python
# 複数のプロンプトを組み合わせた使用例
from segment_anything import SamPredictor, sam_model_registry

sam = sam_model_registry["vit_h"](checkpoint="sam_vit_h_4b8939.pth")
predictor = SamPredictor(sam)
predictor.set_image(image)

# ポイントとボックスの組み合わせ
input_point = np.array([[500, 375]])
input_label = np.array([1])
input_box = np.array([425, 600, 700, 875])

masks, scores, logits = predictor.predict(
    point_coords=input_point,
    point_labels=input_label,
    box=input_box,
    multimask_output=True,
)

# 最もスコアの高いマスクを選択
best_mask_idx = np.argmax(scores)
best_mask = masks[best_mask_idx]
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、インストール方法、使用例
- **公式プロジェクトページ**: https://segment-anything.com/
- **論文**: https://ai.facebook.com/research/publications/segment-anything/
- **ブログ**: https://ai.facebook.com/blog/segment-anything-foundation-model-image-segmentation/

### サンプル・デモ
- **notebooks/predictor_example.ipynb**: プロンプトを使ったSAMの使用例
- **notebooks/automatic_mask_generator_example.ipynb**: 自動マスク生成の例
- **notebooks/onnx_model_example.ipynb**: ONNXモデルの使用例
- **demo/**: Reactを使ったWebデモアプリケーション
- **オンラインデモ**: https://segment-anything.com/demo

### チュートリアル・ガイド
- Jupyterノートブックによる詳細な使用例
- コマンドラインスクリプトの使用方法
- ONNXエクスポートとWebデプロイのガイド

## 技術的詳細
### アーキテクチャ
#### 全体構造
SAMは3つの主要コンポーネントから構成されています：
1. **Image Encoder**: Vision Transformer (ViT)ベースの画像エンコーダー
2. **Prompt Encoder**: ポイント、ボックス、マスクなどのプロンプトをエンコード
3. **Mask Decoder**: 軽量なTransformerベースのデコーダー

これらのコンポーネントが連携して、入力プロンプトから高品質なセグメンテーションマスクを生成します。

#### ディレクトリ構成
```
segment-anything/
├── segment_anything/    # メインパッケージ
│   ├── modeling/       # モデルアーキテクチャ
│   │   ├── image_encoder.py   # ViTベース画像エンコーダー
│   │   ├── prompt_encoder.py  # プロンプトエンコーダー
│   │   ├── mask_decoder.py    # マスクデコーダー
│   │   ├── sam.py             # SAMモデル本体
│   │   └── transformer.py     # Transformerブロック
│   ├── utils/          # ユーティリティ関数
│   ├── predictor.py    # プロンプトベース予測
│   ├── automatic_mask_generator.py  # 自動マスク生成
│   └── build_sam.py    # モデル構築関数
├── notebooks/          # チュートリアルノートブック
├── scripts/            # コマンドラインツール
└── demo/               # Webデモアプリ
```

#### 主要コンポーネント
- **ImageEncoderViT**: Vision Transformerベースの画像エンコーダー
  - 場所: `modeling/image_encoder.py`
  - 依存: PyTorch、位置埋め込み
  - インターフェース: forward()、パッチ埋め込み

- **PromptEncoder**: 様々なプロンプトを統一形式にエンコード
  - 場所: `modeling/prompt_encoder.py`
  - 依存: 位置埋め込み、学習可能トークン
  - インターフェース: _embed_points()、_embed_boxes()、_embed_masks()

- **MaskDecoder**: マスク予測とIoUスコア予測
  - 場所: `modeling/mask_decoder.py`
  - 依存: TwoWayTransformer、MLP
  - インターフェース: forward()、predict_masks()

### 技術スタック
#### コア技術
- **言語**: Python 3.8以上
- **フレームワーク**: PyTorch >= 1.7、TorchVision >= 0.8
- **主要ライブラリ**: 
  - PyTorch: ディープラーニングフレームワーク
  - OpenCV: 画像処理とマスク操作
  - pycocotools: COCO形式のマスク処理
  - matplotlib: 可視化
  - ONNX Runtime: ブラウザ実行用

#### 開発・運用ツール
- **ビルドツール**: setuptools、pip
- **テスト**: flake8、mypy、black、isort
- **CI/CD**: Meta内部システム
- **デプロイ**: ONNXエクスポート、Webデモ、モデルチェックポイント配布

### 設計パターン・手法
- **Encoder-Decoderアーキテクチャ**: 画像とプロンプトを別々にエンコード
- **Vision Transformer (ViT)**: 画像エンコーダーの基盤
- **Attentionメカニズム**: グローバルアテンションとウィンドウアテンションの組み合わせ
- **マルチマスク出力**: 曖昧なケースに対応するための複数マスク出力
- **効率的な推論**: 画像エンコードは1回、プロンプト毎にデコード

### データフロー・処理フロー
1. 入力画像を正規化・リサイズ（1024x1024）
2. Vision Transformerで画像エンコード（64x64の特徴マップ）
3. プロンプト（ポイント、ボックス、マスク）をエンコード
4. 画像特徴とプロンプト特徴を統合
5. Two-Way Transformerで特徴を処理
6. マスクデコーダーでセグメンテーションマスクを生成
7. IoU予測ヘッドでマスクの品質スコアを予測
8. 最終的な256x256マスクを元画像サイズにリサイズ

## API・インターフェース
### 公開API
#### SamPredictor
- 目的: プロンプトベースのセグメンテーション
- 使用例:
```python
predictor = SamPredictor(sam_model)
predictor.set_image(image)  # 画像を一度エンコード
masks, scores, logits = predictor.predict(
    point_coords=points,
    point_labels=labels,
    box=box,
    mask_input=mask,
    multimask_output=True,
    return_logits=False,
)
```

#### SamAutomaticMaskGenerator
- 目的: 画像全体の自動セグメンテーション
- 使用例:
```python
mask_generator = SamAutomaticMaskGenerator(
    model=sam,
    points_per_side=32,
    pred_iou_thresh=0.86,
    stability_score_thresh=0.92,
    crop_n_layers=1,
    crop_n_points_downscale_factor=2,
    min_mask_region_area=100,
)
masks = mask_generator.generate(image)
```

### 設定・カスタマイズ
#### 主要パラメータ
```python
# 自動マスク生成の設定
points_per_side=32  # グリッドポイント数
pred_iou_thresh=0.86  # IoU闾値
stability_score_thresh=0.92  # 安定性スコア闾値
crop_n_layers=1  # クロップレイヤー数
min_mask_region_area=100  # 最小マスク面積
```

#### 拡張・プラグイン開発
- カスタムプロンプトエンコーダーの実装
- 新しいデコーダーアーキテクチャの統合
- ポスト処理フィルターの追加

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ベンチマーク結果: 
  - 画像エンコード時間: ~0.15秒（ViT-H、GPU）
  - プロンプトあたりのマスク生成: ~50ms
  - ゼロショットmIoU: 58.9 (COCO)
- 最適化手法: 
  - 画像エンコードのキャッシュ化
  - 軽量マスクデコーダー
  - ONNX変換による高速化

### スケーラビリティ
- バッチ処理対応
- 複数GPUでの並列処理
- WebスケールでのONNXランタイム利用
- モデルサイズの選択（ViT-B/L/H）

### 制限事項
- 技術的な制限:
  - 入力画像は1024x1024にリサイズされる
  - ビデオのリアルタイム処理は別モデル（SAM 2）が必要
  - セマンティックセグメンテーションではない
- 運用上の制限:
  - モデルサイズが大きい（ViT-H: 2.4GB）
  - GPUメモリ要件が高い

## 評価・所感
### 技術的評価
#### 強み
- 卓越したゼロショット性能
- プロンプトの柔軟性（ポイント、ボックス、マスク）
- 高速な推論速度
- 大規模データセットによる汎化性能
- ONNX対応によるデプロイの容易さ
- Metaによる積極的なサポート

#### 改善の余地
- セマンティック情報の不足
- ビデオ対応は別モデルが必要
- メモリ使用量の最適化
- 複雑なシーンでの精度

### 向いている用途
- インタラクティブな画像編集アプリケーション
- 医療画像解析
- 自動アノテーションツール
- AR/VRアプリケーション
- ロボティクスの視覚認識

### 向いていない用途
- リアルタイム動画処理（SAM 1の場合）
- クラス分類が必要なタスク
- エッジデバイスでの実行
- 3Dセグメンテーション

### 総評
Segment Anything Modelは、コンピュータビジョン分野における画期的なFoundation Modelです。その汎用性と柔軟性は、様々なアプリケーションにおいて新たな可能性を開きました。特に、ゼロショットでの高精度なセグメンテーションと、直感的なプロンプトインターフェースは、従来のセグメンテーション手法を大きく上回るものです。Metaの継続的な開発（SAM 2のリリースなど）により、今後もこの分野のスタンダードとして発展し続けることが期待されます。