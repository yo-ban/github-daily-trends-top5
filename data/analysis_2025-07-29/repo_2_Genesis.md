# リポジトリ解析: Genesis-Embodied-AI/Genesis

## 基本情報
- リポジトリ名: Genesis-Embodied-AI/Genesis
- 主要言語: Python
- スター数: 26,684
- フォーク数: 2,421
- 最終更新: 2025年1月8日（v0.2.1リリース）
- ライセンス: Apache License 2.0
- トピックス: Physics Engine, Robotics, Embodied AI, Physical AI, Simulation, Differentiable Physics, Ray-tracing, Multi-physics

## 概要
### 一言で言うと
汎用的なロボティクス/エンボディッドAI/フィジカルAIアプリケーション向けに設計された、超高速でユーザーフレンドリーな統合物理シミュレーションプラットフォーム。様々な物理ソルバーを統合し、フォトリアリスティックレンダリングも提供。

### 詳細説明
Genesisは、物理シミュレーションの参入障壁を下げ、ロボティクス研究を誰もが利用できるようにすることを目指しています。ゼロから再構築された汎用物理エンジンを基盤とし、様々な物理ソルバー（剛体、MPM、SPH、FEM、PBD、流体）とそれらの結合を統一フレームワークに統合しています。さらに、上位レベルで動作する生成エージェントフレームワークによって強化され、ロボティクスなどのための完全自動データ生成を目指しています。

### 主な特徴
- **高速性**: RTX 4090単体でFrankaロボットアームをシミュレートする際、4300万FPS以上（リアルタイムの43万倍高速）
- **クロスプラットフォーム**: Linux、macOS、Windowsで動作し、複数の計算バックエンド（CPU、Nvidia/AMD GPU、Apple Metal）をサポート
- **多様な物理ソルバーの統合**: 剛体、MPM、SPH、FEM、PBD、安定流体
- **幅広い材料モデル**: 剛体、液体、気体、変形可能オブジェクト、薄殻オブジェクト、粒状材料のシミュレーションと結合
- **様々なロボットへの対応**: ロボットアーム、脚型ロボット、ドローン、ソフトロボット、MJCF、URDF、.obj、.glb、.ply、.stl等のファイル形式をサポート
- **フォトリアリスティックレンダリング**: ネイティブのレイトレーシングベースレンダリング
- **微分可能性**: 完全に微分可能に設計（現在MPMとToolソルバーが対応、他のソルバーも今後対応予定）
- **物理ベース触覚シミュレーション**: 微分可能な触覚センサーシミュレーション（v0.3.0で予定）
- **ユーザーフレンドリー**: シンプルなインストールと直感的なAPI

## 使用方法
### インストール
#### 前提条件
- Python 3.10以上3.13未満
- PyTorch（公式手順に従って事前にインストール）
- CUDA対応 GPU（推奨）またはCPU
- 16GB以上のメモリ（推奨）

#### インストール手順
```bash
# 方法1: PyPI経由（安定版）
pip install genesis-world

# 方法2: GitHubから最新版
pip install git+https://github.com/Genesis-Embodied-AI/Genesis.git

# 方法3: ソースコード編集用（開発者向け）
git clone https://github.com/Genesis-Embodied-AI/Genesis.git
cd Genesis
pip install -e ".[dev]"
```

### 基本的な使い方
#### Hello World相当の例
```python
import genesis as gs

# バックエンドの初期化（CPUまたはGPU）
gs.init(backend=gs.cpu)  # または gs.gpu

# シーンの作成
scene = gs.Scene()

# 平面とロボットアームの追加
plane = scene.add_entity(gs.morphs.Plane())
franka = scene.add_entity(
    gs.morphs.MJCF(file="xml/franka_emika_panda/panda.xml")
)

# シーンの構築とシミュレーション実行
scene.build()
for i in range(1000):
    scene.step()
```

#### 実践的な使用例（ロボット制御）
```python
import genesis as gs
import numpy as np

gs.init(backend=gs.gpu)

# ビューア設定
viewer_options = gs.options.ViewerOptions(
    camera_pos=(0, -3.5, 2.5),
    camera_lookat=(0.0, 0.0, 0.5),
    camera_fov=40,
    max_FPS=60,
)

# シミュレーション設定付きシーン作成
scene = gs.Scene(
    viewer_options=viewer_options,
    sim_options=gs.options.SimOptions(dt=0.01),
    show_viewer=True,
)

# エンティティ追加
plane = scene.add_entity(gs.morphs.Plane())
franka = scene.add_entity(
    gs.morphs.MJCF(file="xml/franka_emika_panda/panda.xml")
)

scene.build()

# ジョイント制御
joint_names = [f"joint{i}" for i in range(1, 8)]
for i in range(1000):
    # PD制御の例
    target_pos = np.sin(i * 0.01) * 0.5
    franka.set_dofs_position(target_pos, joint_names)
    scene.step()
```

### 高度な使い方（マルチ物理シミュレーション）
```python
import genesis as gs

gs.init(backend=gs.gpu)
scene = gs.Scene(show_viewer=True)

# 様々な物理ソルバーの統合
# 剛体
robot = scene.add_entity(gs.morphs.URDF(file="robot.urdf"))

# 液体（SPH）
water = scene.add_entity(
    gs.morphs.Box(
        size=(0.5, 0.5, 0.5),
        pos=(0, 0, 1),
        material=gs.materials.SPH.Water(),
    )
)

# 変形可能オブジェクト（FEM）
soft_cube = scene.add_entity(
    gs.morphs.Box(
        size=(0.2, 0.2, 0.2),
        pos=(0.5, 0, 0.5),
        material=gs.materials.FEM.Elastic(),
    )
)

# 布（PBD）
cloth = scene.add_entity(
    gs.morphs.Mesh(
        file="cloth.obj",
        pos=(0, 0, 2),
        material=gs.materials.PBD.Cloth(),
    )
)

scene.build()

# 統合シミュレーション
for i in range(10000):
    scene.step()
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、インストール方法、主要機能の紹介
- **公式ドキュメント**: https://genesis-world.readthedocs.io/（英語、中国語、日本語対応）
- **プロジェクトページ**: https://genesis-embodied-ai.github.io/
- **Discord**: コミュニティサポート
- **WeChatグループ**: 中国語コミュニティ

### サンプル・デモ
- **examples/tutorials/**: 基本チュートリアル（hello_genesis.py、control_your_robot.py等）
- **examples/rigid/**: 剛体シミュレーション例（ロボット制御、IK、把持等）
- **examples/coupling/**: 異なる物理ソルバーの結合例
- **examples/differentiable_push.py**: 微分可能シミュレーション
- **examples/locomotion/**: 移動ロボットの制御例（go2ロボット、バックフリップ等）
- **examples/drone/**: ドローン制御シミュレーション
- **examples/speed_benchmark/**: パフォーマンスベンチマーク

### チュートリアル・ガイド
- 基本操作チュートリアル（examples/tutorials/内）
- 各物理ソルバー別チュートリアル（MPM、SPH、PBD等）
- ロボット制御チュートリアル
- マルチGPU・並列シミュレーションチュートリアル
- Docker使用ガイド

## 技術的詳細
### アーキテクチャ
#### 全体構造
Genesisは多層アーキテクチャを採用しています：
1. **物理エンジン層**: 様々な物理ソルバー（剛体、MPM、SPH、FEM、PBD、流体）を統合
2. **シミュレーションプラットフォーム層**: Python API、シーン管理、エンティティ管理
3. **レンダリング層**: ラスタライズ（PyRender）とレイトレーシング（LuisaRender）
4. **生成エージェントフレームワーク層**: 自動データ生成（現在部分的にオープンソース化）

#### ディレクトリ構成
```
Genesis/
├── genesis/            # メインパッケージ
│   ├── __init__.py     # APIエクスポート
│   ├── _main.py        # CLIエントリポイント
│   ├── constants.py    # 定数定義
│   ├── datatypes.py    # データ型定義
│   ├── ext/            # 外部依存モジュール
│   └── [physics modules] # 物理ソルバー実装
├── examples/           # サンプルコード
│   ├── tutorials/      # 基本チュートリアル
│   ├── rigid/          # 剛体シミュレーション例
│   ├── coupling/       # 結合シミュレーション例
│   ├── locomotion/     # 移動ロボット例
│   ├── drone/          # ドローン制御例
│   └── sensors/        # センサーシミュレーション
├── tests/             # テストスイート
├── docker/            # Docker設定
└── imgs/              # ドキュメント用画像
```

#### 主要コンポーネント
- **Scene**: シミュレーション環境の管理
  - 場所: `genesis.Scene`
  - 依存: Entity、Viewer、物理ソルバー
  - インターフェース: add_entity()、build()、step()、reset()

- **Entity**: シミュレーションオブジェクトの抽象化
  - 場所: `genesis.Entity`
  - 依存: Morph、Material、State
  - インターフェース: set_dofs_position()、get_state()、apply_force()

- **Morphs**: 形状・ジオメトリ定義
  - 場所: `genesis.morphs`
  - 依存: Meshローダー、プリミティブ形状
  - インターフェース: Plane()、Box()、MJCF()、URDF()、Mesh()

- **Materials**: 物理特性定義
  - 場所: `genesis.materials`
  - 依存: 各物理ソルバー
  - インターフェース: Rigid()、SPH.Water()、FEM.Elastic()、PBD.Cloth()

- **物理ソルバー**: 各種物理シミュレーションエンジン
  - 場所: 内部実装
  - 依存: Taichiフレームワーク
  - インターフェース: 各ソルバー固有のAPI

### 技術スタック
#### コア技術
- **言語**: Python 3.10-3.12（型ヒント、async/await、データクラス使用）
- **フレームワーク**: 
  - Taichi: 高性能クロスプラットフォーム計算バックエンド
  - Pydantic: データ検証と設定管理
- **主要ライブラリ**: 
  - taichi (>=1.7.2): 物理シミュレーションのコア計算
  - mujoco (3.3.0-3.4.0): 剛体動力学参照実装
  - trimesh: 3Dメッシュ処理
  - PyRender: ラスタライズレンダリング
  - OpenEXR: レイトレーシング用テクスチャ
  - coacd: 凸分解
  - tetgen: 四面体メッシュ生成
  - OMPL: モーションプランニング（Windows以外）

#### 開発・運用ツール
- **ビルドツール**: setuptools、wheel、Cython
- **テスト**: pytest、pytest-xdist（並列テスト）
- **コード品質**: Black（コードフォーマッター）
- **デプロイ**: PyPI、Docker、CLIツール (gsコマンド)

### 設計パターン・手法
- **Entity-Component-System (ECS)**: エンティティとコンポーネントの分離
- **プラグインアーキテクチャ**: 物理ソルバー、レンダラーのモジュラー設計
- **バックエンド抽象化**: CPU/GPU/Metalの透過的な切り替え
- **バッチ処理**: 複数環境の並列シミュレーション
- **遅延評価**: Scene.build()での一括初期化

### データフロー・処理フロー
1. **初期化**: gs.init()でバックエンド選択
2. **シーン構築**: 
   - Sceneオブジェクト作成
   - Entity追加（形状、材料、位置指定）
   - build()で物理シミュレーション初期化
3. **シミュレーションループ**: 
   - 制御入力（力、トルク、位置指令）
   - step()で物理計算
   - 状態更新と衝突処理
   - レンダリング（オプション）
4. **データ取得**: get_state()、get_qpos()等で状態取得

## API・インターフェース
### 公開API
#### シーン管理API
- 目的: シミュレーション環境の作成と管理
- 使用例:
```python
import genesis as gs

# シーン作成と設定
scene = gs.Scene(
    viewer_options=gs.options.ViewerOptions(
        camera_pos=(2, -3, 3),
        camera_lookat=(0, 0, 0.5),
        max_FPS=60,
    ),
    sim_options=gs.options.SimOptions(
        dt=0.01,
        gravity=(0, 0, -9.8),
    ),
    renderer_options=gs.options.RendererOptions(
        renderer_type="rasterizer",  # または "ray_tracer"
    ),
    show_viewer=True,
)
```

#### エンティティ操作API
- 目的: シミュレーションオブジェクトの制御
- 使用例:
```python
# ロボットの制御
robot.set_dofs_position([0.1, 0.2, 0.3], ["joint1", "joint2", "joint3"])
robot.set_dofs_velocity([0.5, 0.5, 0.5])
robot.control_dofs_position([1.0, 1.0, 1.0], stiffness=100, damping=10)

# 力の適用
entity.apply_force([10, 0, 0], link="end_effector")
entity.apply_torque([0, 0, 5])

# 状態取得
state = entity.get_state()
qpos = entity.get_qpos()
qvel = entity.get_qvel()
```

### 設定・カスタマイズ
#### シミュレーションオプション
```python
sim_options = gs.options.SimOptions(
    dt=0.01,                    # タイムステップ
    gravity=(0, 0, -9.8),       # 重力
    floor_height=0.0,           # 床の高さ
    requires_grad=False,        # 微分可能性
    collision_detection="fcl",   # 衝突検出方法
)
```

#### 拡張・プラグイン開発
- カスタム物理ソルバーの追加
- 新しい材料モデルの実装
- カスタムセンサーの統合
- レンダリングバックエンドの拡張

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- **Frankaロボットアーム**: 4300万FPS以上 (RTX 4090)
- **Anymal-Cロボット**: 複数ロボットの並列シミュレーション対応
- **最適化手法**: 
  - TaichiのJITコンパイル最適化
  - GPU並列化
  - バッチ処理最適化
  - メモリレイアウト最適化

### スケーラビリティ
- **マルチGPUサポート**: DDPを使用した複数GPUでの分散シミュレーション
- **バッチ処理**: 数千環境の同時シミュレーション
- **メモリ効率**: 大規模シーンでも効率的なメモリ使用
- **並列化**: CPU/GPUの自動最適化

### 制限事項
- Python 3.10-3.12のみサポート
- WindowsではOMPL（モーションプランニング）が利用不可
- 現在微分可能なのはMPMとToolソルバーのみ
- レイトレーシングレンダリングはGPUメモリを大量に使用
- 生成エージェントフレームワークはまだ完全にはオープンソース化されていない

## 評価・所感
### 技術的評価
#### 強み
- **圧倒的な速度**: リアルタイムの数十万倍の高速シミュレーション
- **統合物理エンジン**: 様々な物理現象を一つのフレームワークでシミュレート
- **ユーザーフレンドリー**: Pythonネイティブで直感的なAPI
- **クロスプラットフォーム**: 主要OSと計算バックエンドをサポート
- **フォトリアリスティックレンダリング**: 高品質なビジュアル出力
- **アクティブな開発**: 頻繁なアップデートとコミュニティサポート

#### 改善の余地
- ドキュメントの充実（特にAPIリファレンス）
- 完全な微分可能性の実現（現在一部のみ）
- より多くの事前学習済みロボットモデル
- GUIエディタの提供
- プラグインシステムの正式化

### 向いている用途
- ロボティクス研究・開発
- 強化学習の高速シミュレーション環境
- マルチ物理シミュレーション（液体、ソフトボディ、布等）
- シンセティックデータ生成
- フィジカルAIの研究開発
- シミュレーションベースのロボット学習

### 向いていない用途
- リアルタイムシステム（実機制御）
- 極めて高精度な物理シミュレーションが必要な分野
- メモリ制約の厳しい環境
- 商用製品の直接的な組み込み（Apache 2.0ライセンスに注意）

### 総評
Genesisは、ロボティクスとエンボディッドAI分野における画期的な物理シミュレーションプラットフォームです。特にその速度性能は驚異的で、従来のシミュレータでは不可能だった大規模な学習や実験を可能にします。また、様々な物理ソルバーを統合したことで、複雑な物理現象のシミュレーションが一つのフレームワークで可能になりました。現在も活発に開発が進められており、今後さらなる機能拡張が期待されます。特に完全な微分可能性や触覚シミュレーションなどの機能が追加されれば、さらに幅広い応用が可能になるでしょう。