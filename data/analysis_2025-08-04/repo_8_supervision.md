# リポジトリ解析: roboflow/supervision

## 基本情報
- リポジトリ名: roboflow/supervision
- 主要言語: Python
- スター数: 33,043
- フォーク数: 2,649
- 最終更新: 2025年7月（v0.26.1リリース）
- ライセンス: MIT License
- トピックス: コンピュータビジョン、物体検出、トラッキング、アノテーション、データセット管理

## 概要
### 一言で言うと
コンピュータビジョンアプリケーション開発を高速化するための再利用可能なツール集で、データセットのロード、検出結果の描画、ゾーン内のオブジェクト数のカウントなどを簡単に実現できる。

### 詳細説明
supervisionは、Roboflowが開発したオープンソースのコンピュータビジョンフレームワークで、「私たちがあなたの再利用可能なコンピュータビジョンツールを書きます」という理念のもと、モデルに依存しない柔軟な設計を提供している。Ultralytics、Transformers、MMDetectionなどの人気のあるライブラリとのコネクターを提供し、分類、検出、セグメンテーションモデルをプラグインするだけで使用できる。

このフレームワークは、実用的なコンピュータビジョンアプリケーションの開発に必要な多くの機能を網羅しており、特に映像解析、トラッキング、アノテーション、メトリクス計算などの分野で強力な機能を提供する。

### 主な特徴
- **モデルに依存しない設計**: Ultralytics、Transformers、MMDetection等とのコネクター
- **豊富なアノテーター**: 33種類以上の高度にカスタマイズ可能なアノテーター
- **データセットユーティリティ**: COCO、YOLO、Pascal VOC形式をサポート
- **トラッキング機能**: ByteTrackを使用したマルチオブジェクトトラッキング
- **ゾーン解析**: LineZone、PolygonZoneによる領域内オブジェクトカウント
- **メトリクス**: Mean Average Precision (mAP)、Precision、Recall、F1-Scoreの計算
- **ビデオ処理**: フレーム制限、プログレスバー付き動画処理
- **VLMサポート**: Google Gemini、Moondream等のVision Language Model対応

## 使用方法
### インストール
#### 前提条件
- Python 3.9以上（v0.26.0からPython 3.8はサポート終了）
- OpenCVが必要（画像・動画処理用）
- 物体検出モデル（Ultralytics YOLO等）

#### インストール手順
```bash
# 方法1: pipでインストール
pip install supervision

# 方法2: conda/mambaでインストール
conda install -c conda-forge supervision

# 方法3: ソースからインストール
git clone https://github.com/roboflow/supervision.git
cd supervision
pip install -e .
```

### 基本的な使い方
#### Hello World相当の例：検出結果の可視化
```python
import cv2
import supervision as sv
from ultralytics import YOLO

# 画像の読み込みとモデルのロード
image = cv2.imread("path/to/image.jpg")
model = YOLO("yolov8s.pt")

# 検出実行
result = model(image)[0]
detections = sv.Detections.from_ultralytics(result)

# ボックスアノテーターで描画
box_annotator = sv.BoxAnnotator()
annotated_frame = box_annotator.annotate(
    scene=image.copy(),
    detections=detections
)

cv2.imwrite("output.jpg", annotated_frame)
```

#### 実践的な使用例：ゾーン内オブジェクトカウント
```python
import numpy as np
import supervision as sv

# ポリゴンゾーンの定義
polygon = np.array([
    [100, 100],
    [500, 100],
    [500, 400],
    [100, 400]
])
zone = sv.PolygonZone(polygon=polygon)

# 検出結果をゾーンでフィルタリング
trigger = zone.trigger(detections=detections)

# ゾーン内のオブジェクト数を取得
objects_in_zone = detections[trigger]
print(f"ゾーン内のオブジェクト数: {len(objects_in_zone)}")

# ゾーンアノテーターで描画
zone_annotator = sv.PolygonZoneAnnotator(
    zone=zone,
    color=sv.Color.RED
)
annotated_frame = zone_annotator.annotate(scene=image.copy())
```

### 高度な使い方：ビデオトラッキングと速度推定
```python
# ByteTrackを使用したトラッキング
tracker = sv.ByteTrack()

# ビデオ処理用のコールバック関数
def process_frame(frame: np.ndarray, index: int) -> np.ndarray:
    results = model(frame)[0]
    detections = sv.Detections.from_ultralytics(results)
    
    # トラッキングの更新
    detections = tracker.update_with_detections(detections)
    
    # 軌跡の描画
    trace_annotator = sv.TraceAnnotator(thickness=2)
    annotated_frame = trace_annotator.annotate(
        scene=frame.copy(),
        detections=detections
    )
    
    return annotated_frame

# ビデオの処理
sv.process_video(
    source_path="input_video.mp4",
    target_path="output_video.mp4",
    callback=process_frame
)
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、クイックスタート、使用例
- **公式ドキュメント**: https://supervision.roboflow.com/ - 包括的なAPIリファレンス
- **Google Colabノートブック**: インタラクティブなデモ
- **Hugging Face Spaces**: アノテーターのライブデモ

### サンプル・デモ
- **examples/speed_estimation/**: 車両速度推定システム
- **examples/count_people_in_zone/**: ゾーン内人数カウント
- **examples/traffic_analysis/**: 交通流解析
- **examples/tracking/**: オブジェクトトラッキング
- **examples/time_in_zone/**: ゾーン内滞在時間解析
- **examples/heatmap_and_track/**: ヒートマップとトラッキング

### チュートリアル・ガイド
- **How-toガイド**: https://supervision.roboflow.com/develop/how_to/
- **エンドツーエンドサンプル**: https://github.com/roboflow/supervision/tree/develop/examples
- **Cheatsheet**: https://roboflow.github.io/cheatsheet-supervision/
- **Cookbooks**: https://supervision.roboflow.com/develop/cookbooks/
- **YouTubeチュートリアル**: 滞在時間解析、速度推定等

## 技術的詳細
### アーキテクチャ
#### 全体構造
supervisionはモジュラーな設計を採用し、各機能が独立したコンポーネントとして実装されている。これにより、必要な機能だけを選択して使用でき、プロジェクトの依存関係を最小限に保つことができる。モデルに依存しない設計により、様々な物体検出ライブラリとの統合が容易にできる。

#### ディレクトリ構成
```
supervision/
├── supervision/              # メインパッケージ
│   ├── __init__.py          # 公開インターフェース
│   ├── annotators/          # アノテーション機能
│   │   ├── core.py         # 33種類のアノテーター
│   │   └── utils.py        # 色管理等のユーティリティ
│   ├── detection/           # 検出関連機能
│   │   ├── core.py         # Detectionsクラス
│   │   ├── line_zone.py    # ラインゾーン機能
│   │   └── tools/          # 様々なツール
│   ├── tracker/             # トラッキング機能
│   │   └── byte_tracker/   # ByteTrack実装
│   ├── metrics/             # 評価メトリクス
│   ├── dataset/             # データセット管理
│   ├── classification/      # 分類タスクサポート
│   └── utils/               # 共通ユーティリティ
├── examples/                 # 実用的な使用例
├── docs/                     # MkDocsドキュメント
└── test/                     # ユニットテスト
```

#### 主要コンポーネント
- **Detectionsクラス**: 検出結果を管理する中核クラス
  - 場所: `supervision/detection/core.py`
  - 依存: NumPy、OpenCV
  - インターフェース: from_ultralytics()、from_transformers()、from_vlm()

- **Annotator系クラス**: 33種類の描画機能
  - 場所: `supervision/annotators/core.py`
  - 依存: OpenCV、Pillow
  - インターフェース: annotate(scene, detections)

- **ByteTrack**: マルチオブジェクトトラッキング
  - 場所: `supervision/tracker/byte_tracker/`
  - 依存: SciPy（ハンガリアンアルゴリズム）
  - インターフェース: update_with_detections()

### 技術スタック
#### コア技術
- **言語**: Python 3.9+（v0.26.0からシンタックスに更新）
- **フレームワーク**: 
  - フレームワークに依存しない設計
  - Ultralytics、Transformers、MMDetection等とのコネクター提供
- **主要ライブラリ**: 
  - NumPy: 数値計算、配列操作
  - OpenCV: 画像・動画処理
  - Pillow: 画像描画（フォントサポート）
  - SciPy: ハンガリアンアルゴリズム（トラッキング用）
  - matplotlib: ヒートマップ等の描画
  - tqdm: プログレスバー

#### 開発・運用ツール
- **ビルドツール**: 
  - pyproject.tomlベースのモダンなパッケージ管理
  - uvツールを使用した依存関係管理
  - toxによるマルチバージョンテスト
- **テスト**: 
  - pytestによるユニットテスト
  - 各モジュールごとのテストスイート
  - Snykによるセキュリティチェック
- **CI/CD**: 
  - GitHub Actionsを使用
  - 自動テスト、リント、パッケージビルド
- **デプロイ**: 
  - PyPIへの自動リリース
  - Material for MkDocsによるドキュメント自動デプロイ

### 設計パターン・手法
- **モデルアグノスティック設計**: 様々な物体検出ライブラリとのコネクターパターン
- **コンポジションパターン**: アノテーターを組み合わせて複雑な可視化を実現
- **コールバックパターン**: 動画処理で各フレームごとの処理を定義
- **サブクラス化**: Zone、Annotatorの基底クラスからの拡張
- **Builderパターン**: アノテーターのパラメータ設定

### データフロー・処理フロー
1. **入力受付**: 画像/動画の読み込みまたはフレーム取得
2. **モデル推論**: 外部モデルで物体検出実行
3. **コネクター変換**: モデル固有の出力をDetections形式に変換
4. **トラッキング（オプション）**: ByteTrackによるID割り当て
5. **フィルタリング**: Zoneや信頼度、IOUによるフィルタリング
6. **アノテーション**: 選択したアノテーターで描画
7. **出力**: 描画済みフレームの保存または表示

## API・インターフェース
### 公開API
#### Detections API
- 目的: 検出結果の統一的な管理
- 使用例:
```python
# 様々なモデルからの変換
detections = sv.Detections.from_ultralytics(result)
detections = sv.Detections.from_transformers(result)
detections = sv.Detections.from_vlm(sv.VLM.GOOGLE_GEMINI_2_5, response_text)

# NMS/NMMの適用
detections = detections.with_nms(threshold=0.5)
detections = detections.with_nmm(threshold=0.5, match_metric=sv.OverlapMetric.IOS)

# フィルタリング
filtered = detections[detections.confidence > 0.7]
filtered = detections[detections.class_id == 0]
```

#### Annotator API
- 目的: 柔軟な描画機能
- 使用例:
```python
# 複数のアノテーターを組み合わせ
box_annotator = sv.BoxAnnotator(thickness=2, color=sv.Color.RED)
label_annotator = sv.LabelAnnotator(text_scale=0.5, smart_position=True)

# チェーン式に適用
annotated = box_annotator.annotate(scene=image, detections=detections)
annotated = label_annotator.annotate(scene=annotated, detections=detections, labels=labels)
```

### 設定・カスタマイズ
#### アノテーター設定
```python
# 色設定
color_lookup = sv.ColorLookup.CLASS  # クラスごとに色分け
color_lookup = sv.ColorLookup.TRACK  # トラッキIDごとに色分け

# テキスト設定
label_annotator = sv.LabelAnnotator(
    text_scale=0.5,
    text_thickness=1,
    text_padding=5,
    max_line_length=30,  # テキストの折り返し
    smart_position=True  # フレーム内に収まるよう自動調整
)
```

#### 拡張・プラグイン開発
- **カスタムアノテーター**: BaseAnnotatorを継承して作成
- **カスタムZone**: PolygonZoneを継承して特殊なゾーン実装
- **新しいモデルコネクター**: from_xxxメソッドの追加
- **カスタムトラッカー**: BaseTrackerインターフェースの実装

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- **処理速度**: 
  - process_videoでのフレーム制限とプログレスバー表示
  - バッチ処理による高速化（box_iou_batch、mask_iou_batch）
  - NumPyベースの効率的な演算
- **最適化手法**: 
  - ベクトル化された座標計算
  - 遂次描画ではなくバッチ処理でのアノテーション
  - with_nms、with_nmmでの効率的な重複除去

### スケーラビリティ
- **大量データ処理**: DetectionDatasetによるオンデマンド読み込み
- **マルチオブジェクトトラッキング**: ByteTrackの効率的な実装
- **バッチアノテーション**: 複数検出の同時描画
- **InferenceSlicer**: 大きな画像のタイル分割処理

### 制限事項
- **技術的な制限**:
  - GPUアクセラレーションはモデル側に依存
  - 3D検出は未サポート
  - リアルタイム処理はモデル速度に依存
- **運用上の制限**:
  - Pythonのみサポート（C++バインディングなし）
  - メモリ使用量は追跡するオブジェクト数に比例
  - フレームレートは処理内容に大きく依存

## 評価・所感
### 技術的評価
#### 強み
- モデルに依存しない柔軟な設計
- 33種類の豊富なアノテーター
- 高度にカスタマイズ可能な描画機能
- 実用的なサンプルコードの提供
- 活発なコミュニティと開発（TrendShiftでトレンド入り）
- MITライセンスによる自由な利用

#### 改善の余地
- 3D物体検出のサポート
- GPUアクセラレーションの直接サポート
- C++/Rustバインディングの提供
- リアルタイム最適化の強化

### 向いている用途
- 映像解析システム（交通量調査、速度推定等）
- 小売分析（店内人流、滞在時間解析）
- スポーツ分析（選手追跡、動作解析）
- セキュリティ・監視システム
- コンピュータビジョンのプロトタイピング
- 研究・教育用途

### 向いていない用途
- エッジデバイスでの実行（Python依存）
- 超低レイテンシ要求のシステム
- 3D物体検出が必須のアプリケーション
- モデル開発自体（推論専用）

### 総評
supervisionは、コンピュータビジョンアプリケーション開発における「スイスアーミーナイフ」のような存在である。モデルに依存しない設計が最大の特徴で、様々な物体検出ライブラリと組み合わせて使用できる点が非常に実用的である。

特に、豊富なアノテーターと柔軟なカスタマイズ性は、プロトタイプからプロダクションまで幅広いシーンで活躍する。実際の使用例（速度推定、人流解析など）が豊富に提供されている点も、初心者にとっては学習しやすく、経験者にとっては参考になる。

さらに、MITライセンスで提供され、活発なコミュニティが存在することも、長期的な利用を考える上で重要なポイントである。コンピュータビジョンを使ったアプリケーション開発を行う人にとって、まず最初に検討すべきライブラリの一つと言えるだろう。