# リポジトリ解析: mrdoob/three.js

## 基本情報
- リポジトリ名: mrdoob/three.js
- 主要言語: JavaScript
- スター数: 107,286
- フォーク数: 35,857
- 最終更新: アクティブに開発中（v0.178.0）
- ライセンス: MIT License
- トピックス: JavaScript 3D library, WebGL, WebGPU, 3D graphics, visualization, game development

## 概要
### 一言で言うと
Webブラウザ上で3Dグラフィックスを実現するためのデファクトスタンダードJavaScriptライブラリ。

### 詳細説明
three.jsは、使いやすく、軽量で、クロスブラウザ対応の汎用的3Dライブラリを目指して開発されています。現在のビルドにはWebGLおよびWebGPUレンダラーが含まれており、SVGとCSS3Dレンダラーはアドオンとして利用可能です。ゲーム、データ可視化、インタラクティブなウェブアプリケーション、VR/ARコンテンツなど、幅広い用途で3Dグラフィックスを実現できます。

### 主な特徴
- **簡単なAPI**: シンプルで直感的なAPIで、3Dシーンを簡単に構築
- **豊富な機能**: ジオメトリ、マテリアル、ライト、シャドウ、アニメーションなど完全な3D機能
- **モジュラー設計**: Tree-shaking対応で必要な機能のみバンドル可能
- **次世代対応**: WebGPUサポートによる次世代グラフィックスAPI対応
- **大規模なエコシステム**: 400以上のサンプル、活発なコミュニティ、豊富なアドオン
- **WebXR対応**: VR/ARコンテンツの開発が可能
- **クロスブラウザ**: すべてのモダンブラウザで動作

## 使用方法
### インストール
#### 前提条件
- モダンブラウザ（Chrome, Firefox, Safari, Edge）
- WebGL 1.0以上のサポート
- Node.js（npm使用時）

#### インストール手順
```bash
# 方法1: NPM経由
npm install three

# 方法2: CDN経由（HTMLに直接追加）
<script type="module">
  import * as THREE from 'https://unpkg.com/three@0.178.0/build/three.module.js';
</script>

# 方法3: リポジトリのクローン
git clone --depth=1 https://github.com/mrdoob/three.js.git
```

### 基本的な使い方
#### Hello World相当の例
```javascript
import * as THREE from 'three';

// カメラを作成
const camera = new THREE.PerspectiveCamera(
  70,                                     // 視野角
  window.innerWidth / window.innerHeight, // アスペクト比
  0.01,                                  // nearクリップ面
  10                                     // farクリップ面
);
camera.position.z = 1;

// シーンを作成
const scene = new THREE.Scene();

// キューブを作成
const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const material = new THREE.MeshNormalMaterial();
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// レンダラーを作成
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// アニメーションループ
function animate(time) {
  mesh.rotation.x = time / 2000;
  mesh.rotation.y = time / 1000;
  renderer.render(scene, camera);
}
```

#### 実践的な使用例
```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 基本設定
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

// カメラ設定
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5);

// レンダラー設定
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// ライト設定
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// マテリアルとメッシュ
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshStandardMaterial({
  color: 0x0077ff,
  metalness: 0.5,
  roughness: 0.5
});
const sphere = new THREE.Mesh(geometry, material);
sphere.castShadow = true;
scene.add(sphere);

// 床を追加
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -2;
plane.receiveShadow = true;
scene.add(plane);

// コントロール追加
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// アニメーション
function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}
animate();
```

### 高度な使い方
```javascript
// インスタンスドメッシュの例（パフォーマンス最適化）
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// インスタンスドメッシュで大量のオブジェクトを効率的に描画
const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const mesh = new THREE.InstancedMesh(geometry, material, 10000);

// 各インスタンスの位置を設定
const matrix = new THREE.Matrix4();
for (let i = 0; i < 10000; i++) {
  matrix.setPosition(
    Math.random() * 40 - 20,
    Math.random() * 40 - 20,
    Math.random() * 40 - 20
  );
  mesh.setMatrixAt(i, matrix);
}
mesh.instanceMatrix.needsUpdate = true;
scene.add(mesh);

// ポストプロセッシングの例
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,  // 強度
  0.4,  // 半径
  0.85  // 闾値
);
composer.addPass(bloomPass);
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要と基本的な使用例
- **Documentation**: https://threejs.org/docs/ - 包括的なAPIドキュメント
- **Manual**: https://threejs.org/manual/ - 初心者向けチュートリアル
- **Wiki**: https://github.com/mrdoob/three.js/wiki - 移行ガイド等
- **Forum**: https://discourse.threejs.org/ - コミュニティフォーラム

### サンプル・デモ
- **Examples**: https://threejs.org/examples/ - 400以上の実動サンプル
- **webgl_animation_skinning_blending**: スキニングアニメーション
- **webgl_effects_**シリーズ: 様々なエフェクトのデモ
- **webgl_postprocessing_**シリーズ: ポストプロセッシングエフェクト
- **webxr_**シリーズ: VR/ARコンテンツのサンプル

### チュートリアル・ガイド
- **Three.js Manual**: 基本概念から高度なテクニックまでカバー
- **Discover Three.js**: 外部の優れた学習リソース
- **Three.js Journey**: 人気の有料コース
- **Stack Overflow**: three.jsタグで豊富なQ&A
- **YouTubeチュートリアル**: 多数の動画チュートリアル

## 技術的詳細
### アーキテクチャ
#### 全体構造
three.jsはオブジェクト指向設計に基づいたシーングラフ構造を採用しています。Object3Dを基底クラスとした階層構造で、3Dオブジェクトを管理し、レンダラーがシーンを描画します。

#### ディレクトリ構成
```
three.js/
├── src/              # ソースコード
│   ├── core/         # コア機能（Object3D, BufferGeometry等）
│   ├── math/         # 数学関連（Vector3, Matrix4, Quaternion等）
│   ├── materials/    # マテリアル実装
│   ├── geometries/   # ジオメトリ実装  
│   ├── lights/       # ライト実装
│   ├── cameras/      # カメラ実装
│   ├── renderers/    # レンダラー実装
│   └── nodes/        # WebGPUノードシステム
├── examples/         # サンプルコード
│   └── jsm/          # ESモジュール形式のアドオン
├── build/            # ビルド済みファイル
├── docs/             # APIドキュメント
└── test/             # ユニットテスト
```

#### 主要コンポーネント
- **Scene**: すべての3Dオブジェクトを含むコンテナ
  - 場所: `src/scenes/Scene.js`
  - 依存: Object3D
  - インターフェース: `add()`, `remove()`, `traverse()`

- **Object3D**: すべての3Dオブジェクトの基底クラス
  - 場所: `src/core/Object3D.js`
  - 依存: EventDispatcher, Matrix4
  - インターフェース: `position`, `rotation`, `scale`, `updateMatrix()`

- **WebGLRenderer**: WebGLレンダリングエンジン
  - 場所: `src/renderers/WebGLRenderer.js`
  - 依存: WebGLProgram, WebGLShader
  - インターフェース: `render()`, `setSize()`, `setAnimationLoop()`

- **BufferGeometry**: 頂点データを効率的に管理
  - 場所: `src/core/BufferGeometry.js`
  - 依存: BufferAttribute
  - インターフェース: `setAttribute()`, `setIndex()`, `computeBoundingBox()`

### 技術スタック
#### コア技術
- **言語**: JavaScript (ES6+)、TypeScript定義ファイル提供
- **グラフィックスAPI**: WebGL 1.0/2.0、WebGPU（実験的）
- **主要機能**: 
  - シェーダーシステム: GLSLベース、Three Shading Language (TSL)
  - 数学ライブラリ: ベクトル、行列、クォータニオン
  - アニメーション: Tween、キーフレーム、スケルタル

#### 開発・運用ツール
- **ビルドツール**: Rollup.js（ESモジュールバンドル）
- **テスト**: 
  - ユニットテスト: QUnit
  - E2Eテスト: Puppeteer
  - スクリーンショット比較
- **CI/CD**: GitHub Actionsによる自動テスト・ビルド
- **パッケージ配布**: npm、各種 CDN

### 設計パターン・手法
- **シーングラフパターン**: 階層構造による3Dオブジェクト管理
- **コンポジットパターン**: Geometry + Material = Mesh
- **フライウェイトパターン**: 軽量なObject3D基底クラス
- **ストラテジーパターン**: レンダラーの切り替え（WebGL/WebGPU）
- **モジュールパターン**: Tree-shaking対応のESモジュール構成

### データフロー・処理フロー
1. **シーン構築**: Object3DをSceneに追加
2. **アップデートフェーズ**: 
   - アニメーション更新
   - 物理シミュレーション
   - オブジェクト変換更新
3. **レンダリングフェーズ**:
   - フラスタムカリング
   - マトリクス計算
   - シェーダープログラム実行
   - フレームバッファへの描画
4. **ポストプロセッシング**: エフェクト適用（オプション）

## API・インターフェース
### 公開API
#### コアAPI
- 目的: 3Dシーンの構築とレンダリング
- 基本クラス:
```javascript
// Scene: シーンコンテナ
const scene = new THREE.Scene();
scene.add(object);
scene.remove(object);

// Camera: 視点制御
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(x, y, z);
camera.lookAt(target);

// Renderer: 描画エンジン
const renderer = new THREE.WebGLRenderer(options);
renderer.render(scene, camera);
renderer.setSize(width, height);
```

### 設定・カスタマイズ
#### レンダラー設定
```javascript
const renderer = new THREE.WebGLRenderer({
  antialias: true,           // アンチエイリアス
  alpha: true,               // 透明背景
  powerPreference: "high-performance", // GPU優先度
  preserveDrawingBuffer: false,  // 描画バッファ保持
  logarithmicDepthBuffer: false  // 対数深度バッファ
});

// シャドウ設定
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// トーンマッピング
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
```

#### 拡張・プラグイン開発
```javascript
// カスタムシェーダーマテリアル
const customMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShaderCode,
  fragmentShader: fragmentShaderCode,
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color(0xff0000) }
  }
});

// カスタムジオメトリ
class CustomGeometry extends THREE.BufferGeometry {
  constructor(parameters) {
    super();
    // カスタム実装
  }
}

// アドオンとしての拡張
// examples/jsm/に多数のアドオンが利用可能
```

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- **シェーダーコンパイル**: `renderer.compileAsync()`で事前コンパイル
- **インスタンスドレンダリング**: InstancedMeshで最大10万オブジェクト描画可能
- **バッチング**: BatchedMeshで動的バッチング
- **LOD**: 距離に応じた詳細度切り替え
- **フラスタムカリング**: 自動的に視錘外オブジェクトを除外

### スケーラビリティ
- **大量オブジェクト**: InstancedMesh、BatchedMesh、Points使用
- **テクスチャ管理**: 圧縮テクスチャ（KTX2）使用
- **メモリ管理**: 不要なリソースの`dispose()`呼び出し
- **Web Workers**: OffscreenCanvasでバックグラウンドレンダリング
- **最適化ツール**: Three.js Inspector、Stats.jsでパフォーマンス監視

### 制限事項
- **技術的な制限**:
  - WebGLコンテキスト数の制限（通常8-16）
  - テクスチャサイズ制限（デバイス依存）
  - シェーダー精度の差異（モバイル等）
  - ブラウザメモリ制限
- **ブラウザサポート**:
  - IE11: サポート終了
  - Opera Mini: 非対応
  - WebGL 2.0: 一部機能で必須

## 評価・所感
### 技術的評価
#### 強み
- **成熟したエコシステム**: 10年以上の開発実績、大規模コミュニティ
- **完全な機能セット**: 3Dグラフィックスに必要なすべての機能をカバー
- **優れたドキュメント**: 豊富なサンプル、詳細なAPIドキュメント
- **モジュラー設計**: Tree-shakingで最小バンドルサイズ実現
- **幅広いプラットフォーム対応**: デスクトップ、モバイル、VR/AR

#### 改善の余地
- **学習曲線**: 3Dグラフィックスの知識が必要
- **パフォーマンス最適化**: 手動での最適化が必要な場合が多い
- **TypeScriptサポート**: 外部型定義に依存
- **メモリ管理**: 明示的なリソース解放が必要

### 向いている用途
- **インタラクティブな3Dウェブアプリケーション**
- **データ可視化・ダッシュボード**
- **オンラインゲーム・カジュアルゲーム**
- **製品ビジュアライゼーション・CADビューア**
- **VR/ARコンテンツ**
- **教育コンテンツ・シミュレーション**

### 向いていない用途
- **ハイエンドAAAゲーム**: 専用ゲームエンジンに劣る
- **CAD/CAMアプリケーション**: 精度・機能が不足
- **大規模シミュレーション**: 物理エンジン非搭載
- **リアルタイムレイトレーシング**: 専用GPU APIが必要

### 総評
three.jsはWeb上で3Dグラフィックスを実現するためのデファクトスタンダードとしての地位を確立しています。シンプルなAPI、豊富な機能、活発なコミュニティにより、初心者から上級者まで幅広い開発者に支持されています。WebGPUサポートなど次世代技術への対応も積極的に進められており、今後もWeb 3Dグラフィックスの中心的存在であり続けることが予想されます。