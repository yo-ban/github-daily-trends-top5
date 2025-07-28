# リポジトリ解析: Genesis-Embodied-AI/Genesis

## 基本情報
- リポジトリ名: Genesis-Embodied-AI/Genesis
- 主要言語: Python
- スター数: 26,415
- フォーク数: 2,408
- 最終更新: 最新リリース v0.2.1
- ライセンス: Apache License 2.0
- トピックス: physics-simulation, robotics, embodied-ai, differentiable-simulation, ray-tracing

## 概要
### 一言で言うと
ロボティクスと身体性AI向けの超高速・汎用物理シミュレーションプラットフォーム。リアルタイムの43万倍の速度で動作し、剛体から流体まで多様な物理現象を統一的に扱える。

### 詳細説明
Genesisは、ロボティクス、身体性AI、物理AIアプリケーション向けに設計された包括的な物理シミュレーションプラットフォームです。従来の物理エンジンの限界を克服するため、ゼロから再構築された汎用物理エンジンで、以下の4つの主要コンポーネントを統合しています：

1. **汎用物理エンジン**: 剛体、液体、気体、変形可能オブジェクト、薄殻オブジェクト、粒状材料など、幅広い材料と物理現象をシミュレート
2. **ロボティクスシミュレーションプラットフォーム**: 軽量、超高速、Pythonic、ユーザーフレンドリーな設計
3. **フォトリアリスティックレンダリング**: レイトレーシングベースの高品質な可視化
4. **生成的データエンジン**: 自然言語から様々なデータモダリティへの変換（計画中の機能）

既存のシミュレータの制約（単一の物理ソルバー、限定的な材料サポート、性能の問題）を解決し、研究者が複雑な物理インタラクションを含むロボティクスタスクを効率的に開発・テストできる環境を提供します。

### 主な特徴
- **超高速シミュレーション**: Frankaロボットアームのシミュレーションで4300万FPS以上（リアルタイムの43万倍）
- **マルチバックエンド対応**: CPU、NVIDIA GPU、AMD GPU、Apple Metalをサポート
- **統合物理ソルバー**: 剛体、MPM、SPH、FEM、PBD、Stable Fluidなど複数のソルバーを統一フレームワークで提供
- **豊富な材料モデル**: 剛体、流体、弾性体、塑性体、粒状材料、薄殻構造など
- **ロボット対応**: MJCF、URDF形式のロボットモデルをネイティブサポート
- **並列処理**: マルチGPU対応、バッチ処理による効率的な大規模シミュレーション
- **Pythonネイティブ**: 直感的なAPIと簡潔なコード記述
- **部分的な微分可能性**: 勾配ベースの最適化に対応（完全対応は開発中）

## 使用方法
### インストール
#### 前提条件
- Python 3.10～3.12
- 対応OS: Linux、macOS、Windows
- GPU（オプション）: NVIDIA（CUDA 12.1+）、AMD、Apple Silicon
- PyTorchがインストールされていること（CPUまたはGPU版）

#### インストール手順
```bash
# 方法1: pipでインストール（推奨）
pip install genesis-world

# 方法2: ソースからインストール（開発版）
git clone https://github.com/Genesis-Embodied-AI/Genesis.git
cd Genesis
pip install -e .

# オプション: 追加の依存関係（可視化、モーションプランニングなど）
pip install genesis-world[vis]  # 可視化機能
pip install genesis-world[tools]  # 追加ツール
```

### 基本的な使い方
#### Hello World相当の例
```python
import genesis as gs

# バックエンドを初期化（CPU使用）
gs.init(backend=gs.cpu)

# シーンを作成
scene = gs.Scene()

# 地面とロボットを追加
plane = scene.add_entity(gs.morphs.Plane())
franka = scene.add_entity(
    gs.morphs.MJCF(file="xml/franka_emika_panda/panda.xml")
)

# シーンをビルドして実行
scene.build()

# 1000ステップシミュレーション
for i in range(1000):
    scene.step()
```

#### 実践的な使用例
```python
import genesis as gs
import numpy as np

# GPUバックエンドで初期化、ビューア有効化
gs.init(backend=gs.cuda, logging_level="info")

# インタラクティブビューア付きシーンを作成
scene = gs.Scene(
    viewer_options=gs.options.ViewerOptions(
        camera_pos=(2.0, -2, 1.5),
        camera_lookat=(0.0, 0.0, 0.0),
        max_FPS=60,
    ),
    sim_options=gs.options.SimOptions(
        dt=0.01,  # タイムステップ
    ),
)

# 環境とロボットを追加
plane = scene.add_entity(gs.morphs.Plane())
robot = scene.add_entity(
    gs.morphs.MJCF(
        file="xml/franka_emika_panda/panda.xml",
        pos=(0, 0, 0),
    )
)

# 操作対象のキューブを追加
cube = scene.add_entity(
    gs.morphs.Box(
        size=(0.04, 0.04, 0.04),
        pos=(0.5, 0.0, 0.02),
        euler=(0, 0, 0),
    )
)

# シーンをビルド
scene.build()

# ロボット制御ループ
for i in range(1000):
    # ジョイント位置制御
    if i < 500:
        # 初期位置へ移動
        robot.set_dofs_position([0, -0.5, 0, -2.0, 0, 1.5, 0.785, 0.04, 0.04])
    else:
        # グリッパーを閉じる
        robot.set_dofs_position([0, -0.5, 0, -2.0, 0, 1.5, 0.785, 0.0, 0.0])
    
    scene.step()
```

### 高度な使い方
```python
import genesis as gs
import numpy as np

# 高精度シミュレーション設定
gs.init(seed=0, precision="64", backend=gs.cuda, logging_level="debug")

# 複数の物理ソルバーを使用するシーン
scene = gs.Scene(
    sim_options=gs.options.SimOptions(
        dt=0.001,
        gravity=(0, 0, -9.81),
    ),
    mpm_options=gs.options.MPMOptions(
        dt=0.0002,
        lower_bound=(-1.0, -1.0, 0.0),
        upper_bound=(1.0, 1.0, 2.0),
    ),
    rigid_options=gs.options.RigidOptions(
        enable_collision=True,
        enable_self_collision=True,
        enable_joint_limit=True,
    ),
    viewer_options=gs.options.ViewerOptions(
        camera_pos=(3.5, 0.0, 2.5),
        camera_lookat=(0.0, 0.0, 0.5),
        camera_fov=40,
        max_FPS=60,
    ),
)

# ロボットアームを追加
robot = scene.add_entity(
    gs.morphs.MJCF(
        file="xml/franka_emika_panda/panda.xml",
        pos=(0, 0, 0),
    )
)

# 柔軟物体（ソフトキューブ）を追加
soft_cube = scene.add_entity(
    gs.morphs.Mesh(
        file="meshes/cube.obj",
        pos=(0.5, 0.0, 0.5),
        scale=0.1,
        soft=gs.options.SoftOptions(
            E=1e5,  # ヤング率
            nu=0.4,  # ポアソン比
            rho=1000,  # 密度
        ),
    )
)

# 流体パーティクルを追加
fluid = scene.add_entity(
    gs.morphs.PBDParticle(
        n_particles=5000,
        lower_bound=(-0.2, -0.2, 1.0),
        upper_bound=(0.2, 0.2, 1.5),
        particle_radius=0.01,
        material=gs.materials.PBD.Liquid,
    )
)

scene.build()

# 逆運動学ソルバーを使用した制御
target_pos = np.array([0.5, 0.0, 0.3])
for i in range(2000):
    # エンドエフェクタの現在位置を取得
    ee_link = robot.get_link("panda_hand")
    current_pos = ee_link.get_pos()
    
    # 簡単なP制御
    error = target_pos - current_pos
    if np.linalg.norm(error) > 0.01:
        # 逆運動学を解く
        success, q_sol = robot.inverse_kinematics(
            link=ee_link,
            pos=target_pos,
            rot=None,
            q_init=robot.get_dofs_position()[:7]
        )
        
        if success:
            # 解を適用（最初の7関節のみ）
            dof_pos = robot.get_dofs_position()
            dof_pos[:7] = q_sol
            robot.set_dofs_position(dof_pos)
    
    scene.step()
    
    # 可視化用にレンダリング
    if i % 10 == 0:
        scene.render()
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクトの概要、インストール方法、基本的な使い方
- **README_CN.md, README_JA.md等**: 多言語対応ドキュメント（中国語、日本語、韓国語、フランス語）
- **RELEASE.md**: リリースノート、バージョン履歴
- **doc/**: 追加ドキュメント（現在整備中）
- **公式サイト**: https://genesis-world.readthedocs.io/（計画中）

### サンプル・デモ
- **examples/tutorials/**: 初心者向けチュートリアル集
  - `hello_genesis.py`: 最初のシミュレーション
  - `control_your_robot.py`: ロボット制御の基礎
  - `interactive_debugging.py`: デバッグ機能の使い方
  - `parallel_simulation.py`: 並列シミュレーション
- **examples/rigid/**: 剛体ダイナミクス例
  - `ik_franka.py`: Frankaアームの逆運動学
  - `grasp_bottle.py`: 物体把持デモ
  - `multi_gpu.py`: マルチGPU並列処理
- **examples/coupling/**: マルチフィジックス結合
  - `cloth_on_rigid.py`: 布と剛体の相互作用
  - `water_wheel.py`: 流体-剛体結合
- **examples/locomotion/**: 歩行ロボット
  - `go2_train.py`: 四足歩行の強化学習
  - `go2_backflip.py`: バク宙動作

### チュートリアル・ガイド
- チュートリアルディレクトリ内の段階的学習コンテンツ
- 各exampleファイル内の詳細なコメント
- GitHub Issuesでのコミュニティサポート
- 計画中: 公式ドキュメントサイト、動画チュートリアル

## 技術的詳細
### アーキテクチャ
#### 全体構造
Genesisは、モジュラーかつ拡張可能なアーキテクチャを採用しています：

1. **コアエンジン層**: 物理シミュレーションの中核となるソルバー群
2. **抽象化層**: 統一的なAPIで異なるソルバーを扱う
3. **エンティティ・マテリアル層**: シミュレーション対象の定義
4. **可視化層**: レンダリングとインタラクティブビューア
5. **ユーティリティ層**: メッシュ処理、ファイル読み込み等の補助機能

#### ディレクトリ構成
```
Genesis/
├── genesis/          # メインパッケージ
│   ├── engine/       # 物理エンジンコア（ソルバー、シーン管理）
│   ├── vis/          # 可視化モジュール（レンダラー、ビューア）
│   ├── utils/        # ユーティリティ（メッシュ、URDF/MJCF処理）
│   ├── options/      # 設定オプションクラス群
│   ├── sensors/      # センサーシミュレーション
│   └── ext/          # 外部ライブラリ統合
├── examples/         # 実例とチュートリアル
│   ├── tutorials/    # 初心者向けチュートリアル
│   ├── rigid/        # 剛体シミュレーション例
│   ├── coupling/     # マルチフィジックス例
│   └── locomotion/   # ロボット歩行例
├── tests/            # ユニットテストとベンチマーク
└── docker/           # Dockerコンテナ設定
```

#### 主要コンポーネント
- **Scene**: シミュレーション環境の管理
  - 場所: `genesis/engine/scene.py`
  - 依存: Simulator、各種ソルバー
  - インターフェース: `add_entity()`, `build()`, `step()`, `reset()`

- **Simulator**: 物理演算の実行エンジン
  - 場所: `genesis/engine/simulator.py`
  - 依存: Taichi、各種ソルバー実装
  - インターフェース: `build()`, `step()`, `reset()`

- **Entity**: シミュレーション対象の基底クラス
  - 場所: `genesis/engine/entities/`
  - 依存: Material、Morph
  - インターフェース: `set_pos()`, `set_vel()`, `get_state()`

- **Viewer**: インタラクティブ可視化
  - 場所: `genesis/vis/viewer.py`
  - 依存: レンダラー、カメラシステム
  - インターフェース: `render()`, `set_camera()`, `record_video()`

### 技術スタック
#### コア技術
- **言語**: Python 3.10-3.12（型ヒント、データクラス活用）
- **コンピューティングバックエンド**: Taichi Lang（JITコンパイル、GPU並列化）
- **主要ライブラリ**: 
  - Taichi (1.7.0+): 高性能計算カーネル
  - PyTorch: テンソル演算、自動微分
  - trimesh: 3Dメッシュ処理
  - numpy: 数値計算
  - transforms3d: 3D変換計算
  - lxml: XML（MJCF/URDF）パース

#### 開発・運用ツール
- **ビルドツール**: setuptools、pyproject.toml（PEP 517準拠）
- **テスト**: pytest、物理精度検証、パフォーマンスベンチマーク
- **CI/CD**: GitHub Actions（マルチプラットフォームテスト）
- **デプロイ**: PyPI配布、Dockerイメージ提供

### 設計パターン・手法
- **Entity-Component-System (ECS)**: エンティティとコンポーネントの柔軟な組み合わせ
- **Builder Pattern**: シーン構築時の段階的な設定
- **Strategy Pattern**: 異なる物理ソルバーの切り替え
- **Facade Pattern**: 複雑な内部実装を隠蔽した簡潔なAPI
- **データ指向設計**: Taichiカーネルでの効率的なメモリレイアウト

### データフロー・処理フロー
1. **初期化**: バックエンド選択、グローバル設定
2. **シーン構築**: エンティティ追加、パラメータ設定
3. **ビルド**: メモリ確保、ソルバー初期化、GPU転送
4. **シミュレーションループ**:
   - 制御入力の適用
   - 物理演算（ソルバー実行）
   - 衝突検出・応答
   - 状態更新
   - センサーデータ生成
5. **可視化/データ出力**: レンダリング、状態取得

## API・インターフェース
### 公開API
#### シーン管理API
- 目的: シミュレーション環境の構築と管理
- 使用例:
```python
# シーン作成と設定
scene = gs.Scene(
    sim_options=gs.options.SimOptions(dt=0.01),
    viewer_options=gs.options.ViewerOptions(max_FPS=60)
)

# エンティティ追加
robot = scene.add_entity(gs.morphs.MJCF(file="robot.xml"))

# ビルドと実行
scene.build()
scene.step()
```

#### ロボット制御API
- 目的: ロボットの関節制御と状態取得
- 使用例:
```python
# 位置制御
robot.set_dofs_position([0, -0.5, 0, -2.0, 0, 1.5, 0.785])

# 速度制御
robot.set_dofs_velocity([0.1, 0, 0, 0, 0, 0, 0])

# トルク制御
robot.set_dofs_force([10, 0, 0, 0, 0, 0, 0])

# 状態取得
pos = robot.get_dofs_position()
vel = robot.get_dofs_velocity()
```

### 設定・カスタマイズ
#### 設定ファイル
```python
# Pythonコードで直接設定（設定ファイルは不要）
import genesis as gs

# グローバル設定
gs.init(
    backend=gs.cuda,      # 計算バックエンド
    precision="32",       # 浮動小数点精度
    seed=42,             # 乱数シード
    logging_level="info" # ログレベル
)

# シーン別設定
scene = gs.Scene(
    sim_options=gs.options.SimOptions(
        dt=0.001,                    # タイムステップ
        gravity=(0, 0, -9.81),       # 重力
        requires_grad=False          # 勾配計算
    ),
    rigid_options=gs.options.RigidOptions(
        enable_collision=True,       # 衝突検出
        enable_self_collision=False, # 自己衝突
        solver="TGS",               # ソルバー選択
        iterations=10               # 反復回数
    )
)
```

#### 拡張・プラグイン開発
- カスタムロボットモデル: MJCF/URDF形式で定義
- 新しい材料モデル: Materialクラスを継承して実装
- カスタムソルバー: Solverインターフェースを実装
- センサープラグイン: BaseSensorクラスを継承
- 現在、公式プラグインAPIは整備中

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ベンチマーク結果: 
  - Frankaアーム: 4300万FPS以上（リアルタイムの43万倍）
  - 1000体の剛体: 100万FPS
  - 流体シミュレーション（10万パーティクル）: 1000 FPS
- 最適化手法:
  - Taichiによる自動GPU並列化
  - メモリコアレッシング
  - 空間分割による効率的な衝突検出
  - JITコンパイルによる動的最適化

### スケーラビリティ
- マルチGPU対応による線形スケーリング
- バッチ処理による並列環境実行
- メモリ効率的なデータ構造
- 大規模シーンでの階層的空間分割
- 現在の制限: 単一ノード内でのスケーリングのみ

### 制限事項
- 完全な微分可能性は開発中（部分的にサポート）
- 分散マルチノード実行は未対応
- 一部の高度な接触モデルは実装中
- リアルタイムレンダリングはGPU必須
- Windows版は一部機能制限あり

## 評価・所感
### 技術的評価
#### 強み
- 圧倒的な実行速度（既存エンジンの100-1000倍）
- 統一的なAPIで多様な物理現象を扱える
- Pythonネイティブで学習コストが低い
- アクティブな開発とコミュニティサポート
- 商用利用可能なApache 2.0ライセンス

#### 改善の余地
- ドキュメントの充実（特に日本語）
- より多くのロボットモデルのサポート
- 完全な微分可能性の実装
- GUIベースのシーンエディタ
- より詳細なエラーメッセージ

### 向いている用途
- ロボット制御アルゴリズムの開発・検証
- 強化学習を用いたロボット動作の学習
- マルチフィジックスシミュレーション研究
- 大規模並列シミュレーション
- 物理ベースのデータ生成

### 向いていない用途
- リアルタイムゲームエンジンとしての利用
- CADレベルの精密な機構設計
- 分子動力学などのミクロスケール現象
- 完全に決定論的な物理演算が必要な用途
- Webブラウザ上での実行

### 総評
Genesisは、ロボティクスと身体性AI研究に革新をもたらす可能性を持つ野心的なプロジェクトです。特筆すべきは、その圧倒的な実行速度と、従来は別々のエンジンが必要だった多様な物理現象を統一的に扱える点です。

Pythonネイティブな設計により、研究者が素早くプロトタイピングから本格的な実験まで行えるのも大きな利点です。一方で、まだ開発初期段階にあり、ドキュメントの整備や一部機能の実装が追いついていない面もあります。

しかし、活発な開発ペースと明確なビジョンを持つプロジェクトであり、今後のロボティクス・AI研究において重要なツールになることが期待されます。特に、複雑な物理インタラクションを含むタスクの研究や、大規模な強化学習実験を行う研究者にとっては、非常に価値の高いプラットフォームと言えるでしょう。