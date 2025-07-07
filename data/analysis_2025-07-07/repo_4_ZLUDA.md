# リポジトリ解析: vosen/ZLUDA

## 基本情報
- リポジトリ名: vosen/ZLUDA
- 主要言語: Rust
- スター数: 12,237
- フォーク数: 770
- 最終更新: 活発に開発中（2024年）
- ライセンス: Apache License 2.0
- トピックス: cuda, gpu, amd, gpgpu, gpu-computing, translation-layer

## 概要
### 一言で言うと
NVIDIA GPU向けに書かれたCUDAアプリケーションを、無変更でAMD GPU上で動作させることを可能にするドロップイン置換ライブラリです。

### 詳細説明
ZLUDAは、CUDAの互換レイヤーとして機能し、NVIDIAのCUDA API呼び出しをインターセプトして、AMD GPUで実行できるように変換します。本プロジェクトは、CUDAエコシステムの膨大なソフトウェア資産をNVIDIA以外のGPUでも活用できるようにすることを目的としています。PTX（NVIDIAの中間表現）をLLVM IRに変換し、AMDのCOMGRコンパイラを使用してAMD GPUバイナリにコンパイルするという高度なコンパイラ技術を使用しています。

### 主な特徴
- CUDAアプリケーションを無変更でAMD GPUで実行可能
- PTXからLLVM IRへの完全なコンパイラ実装
- AMD Radeon RX 5000シリーズ以降のGPUをサポート
- WindowsとLinuxの両方に対応
- ランタイムAPIの透過的な変換（HIPへのマッピング）
- ネイティブに近いパフォーマンス（GeekBenchで実証）
- モジュラーなアーキテクチャ（Rustで実装）
- CUDAライブラリ（cuBLAS、cuDNN等）の部分的サポート

## 使用方法
### インストール
#### 前提条件
- AMD GPU（Radeon RX 5000シリーズ以降）
- 最新のAMD GPUドライバー
- Rustコンパイラ（ソースからビルドする場合）
- CMake、Python 3、C++コンパイラ（ビルド用）
- Git（サブモジュール対応）

#### インストール手順
```bash
# 方法1: ビルド済みバイナリの使用（推奨）
# GitHub Releasesから最新バージョンをダウンロード
# https://github.com/vosen/ZLUDA/releases

# 方法2: ソースからビルド
# リポジトリをクローン（サブモジュール含む）
git clone --recursive https://github.com/vosen/ZLUDA.git
cd ZLUDA

# Rustツールチェーンが未インストールの場合
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# ビルド実行
cargo xtask --release

# ビルド結果はtarget/releaseに生成される
```

### 基本的な使い方
#### Hello World相当の例
```bash
# Windows: CUDAアプリケーションのディレクトリにZLUDAのDLLをコピー
copy zluda\nvcuda.dll "C:\path\to\cuda\app\"
copy zluda\nvml.dll "C:\path\to\cuda\app\"

# アプリケーションを実行
.\cuda_app.exe

# Linux: ライブラリパスを設定して実行
LD_LIBRARY_PATH=/path/to/zluda:$LD_LIBRARY_PATH ./cuda_app
```

#### 実践的な使用例
```bash
# Windows: zluda_withランチャーを使用した実行
zluda_with.exe -- "C:\Program Files\GeekBench\geekbench6.exe" --compute CUDA

# Linux: GeekBenchの実行例
export LD_LIBRARY_PATH=/path/to/zluda:$LD_LIBRARY_PATH
./geekbench6 --compute CUDA

# デバッグ情報を有効にして実行
export ZLUDA_DEBUG=1
export RUST_LOG=debug
./cuda_app
```

### 高度な使い方
```bash
# ZLUDAダンプツールを使用したAPIトレース
# 各CUDA API呼び出しを記録
zluda_dump.exe -- application.exe

# 特定のCUDAライブラリのみを使用
# 例: cuBLASのみをZLUDA経由で使用
copy zluda_blas\cublas64_11.dll "C:\app\"

# 環境変数による詳細設定
export ZLUDA_DUMP_DIR="/path/to/dump"  # ダンプ出力ディレクトリ
export COMGR_SPIRV_OPTIONS="--spirv-max-version=1.6"  # SPIRVオプション
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、インストール方法、使用方法、現状
- **LICENSE-APACHE、LICENSE-MIT**: デュアルライセンスの詳細
- **geekbench.svg**: GeekBenchのパフォーマンス比較グラフ

### サンプル・デモ
- **zluda_inject/tests/**: Windowsでのプロセスインジェクションのテストコード
- **ptx/test/**: PTXコンパイラのテストケース（vectorAddなど）

### チュートリアル・ガイド
- GitHubのIssuesとDiscussionsでのコミュニティサポート
- ソースコード内のコメント（技術的詳細）

## 技術的詳細
### アーキテクチャ
#### 全体構造
ZLUDAは以下のパイプラインでCUDAコードを変換します：
1. CUDA APIインターセプト：ZLUDAの置換ライブラリ（`nvcuda.dll`/`libcuda.so`）がCUDA API呼び出しを捨える
2. PTX抽出：fatbinファイルからPTX（NVIDIAの中間表現）を抽出
3. PTX解析：PTXアセンブリをパースしてASTを構築
4. LLVM IR生成：複数の変換パスを経てPTXをLLVM IRに変換
5. AMD GPUコンパイル：AMDのCOMGRコンパイラでGPUバイナリにコンパイル
6. ランタイム変換：CUDAランタイムAPIをHIP（AMDのCUDA互換API）に変換

#### ディレクトリ構成
```
ZLUDA/
├── zluda/                   # メインCUDAランタイム実装
│   ├── src/
│   │   ├── cuda_impl/      # CUDA Driver API実装
│   │   └── impl/           # コア機能実装
├── ptx/                     # PTXコンパイラ
│   ├── src/
│   │   └── pass/           # コンパイラパス（変換工程）
│   └── lib/                 # PTX実行時ライブラリ
├── ptx_parser/              # PTXパーサー
├── comgr/                   # AMD COMGRラッパー
├── cuda_base/               # CUDA型定義・共通機能
├── cuda_types/              # CUDAデータ型
├── zluda_blas/              # cuBLAS代替
├── zluda_blaslt/            # cuBLASLt代替
├── zluda_dnn/               # cuDNN代替
├── zluda_fft/               # cuFFT代替
├── zluda_sparse/            # cuSPARSE代替
├── zluda_ml/                # NVML代替
├── zluda_dump/              # デバッグ・トレースツール
├── zluda_inject/            # Windowsプロセスインジェクション
└── ext/                     # 外部依存ライブラリ
    ├── hip_runtime-sys/     # HIPバインディング
    └── llvm-project/        # LLVMサブモジュール
```

#### 主要コンポーネント
- **zluda**: CUDA Driver APIのメイン実装
  - 場所: `/zluda/src/`
  - 責務: CUDA APIのHIPへの変換、メモリ管理、カーネル実行
  - 主要API: `cuInit`, `cuMemAlloc`, `cuLaunchKernel`等

- **ptx**: PTXからLLVM IRへのコンパイラ
  - 場所: `/ptx/src/`
  - 責務: PTXアセンブリのLLVM IRへの変換
  - 変換パス: 正規化、関数置換、特殊レジスタ処理等

- **comgr**: AMDコンパイラインターフェース
  - 場所: `/comgr/src/`
  - 責務: LLVM IRからAMD GPU ISAへのコンパイル
  - 依存: AMD COMGRライブラリ

### 技術スタック
#### コア技術
- **言語**: Rust（安全性とパフォーマンスを重視）
- **コンパイラ技術**: LLVM 17.0（PTXからの中間表現生成）
- **主要ライブラリ**: 
  - HIP (AMD): CUDA互換API、GPUランタイム
  - COMGR (AMD): コードオブジェクトマネージャー
  - syn/quote (Rust): マクロとコード生成
  - rustc-hash: 高速ハッシュマップ
  - detours (Windows): APIフッキング

#### 開発・運用ツール
- **ビルドツール**: 
  - cargo + xtask（Rustビルドシステム）
  - CMake（LLVMビルド用）
  - bindgen（C/C++ FFIバインディング生成）
- **テスト**: 
  - 単体テスト（cargo test）
  - PTXコンパイラテスト（vectorAdd等）
  - インジェクションテスト（Windows）
- **デバッグ**: 
  - ZLUDA_DEBUG環境変数
  - zluda_dumpツールによるAPIトレース

### 設計パターン・手法
- **Adapter Pattern**: CUDA APIをHIP APIにアダプト
- **Compiler Pipeline Pattern**: PTX変換の多段階パス構成
- **FFI (Foreign Function Interface)**: RustからC APIの呼び出し
- **Drop-in Replacement**: 既存ライブラリと同名DLL/SOで置換
- **Lazy Loading**: 必要時にのみGPUバイナリをコンパイル

### データフロー・処理フロー
1. **アプリケーション起動**
   - CUDAライブラリ（nvcuda.dll）のロード要求
   - ZLUDAがインターセプト

2. **初期化フェーズ**
   - `cuInit()` 呼び出し
   - HIPランタイム初期化
   - デバイス情報の収集（AMD GPUをCUDAデバイスとして報告）

3. **カーネルロードフェーズ**
   - `cuModuleLoad()` でCUDA fatbinロード
   - FatbinからPTX抽出
   - PTXパース → AST構築
   - AST変換パス適用
   - LLVM IR生成
   - COMGRでAMD GPU ISAにコンパイル

4. **実行フェーズ**
   - メモリ割り当て（cuMemAlloc → hipMalloc）
   - データ転送（cuMemcpy → hipMemcpy）
   - カーネル起動（cuLaunchKernel → hipLaunchKernel）
   - 結果取得

## API・インターフェース
### 公開API
#### CUDA Driver API互換
- 目的: NVIDIA CUDA Driver APIの完全互換実装
- 主要API:
```c
// 初期化
CUresult cuInit(unsigned int Flags);

// デバイス管理
CUresult cuDeviceGet(CUdevice *device, int ordinal);
CUresult cuDeviceGetAttribute(int *pi, CUdevice_attribute attrib, CUdevice dev);

// コンテキスト管理
CUresult cuCtxCreate(CUcontext *pctx, unsigned int flags, CUdevice dev);

// モジュール・カーネル管理
CUresult cuModuleLoad(CUmodule *module, const char *fname);
CUresult cuModuleGetFunction(CUfunction *hfunc, CUmodule hmod, const char *name);

// メモリ管理
CUresult cuMemAlloc(CUdeviceptr *dptr, size_t bytesize);
CUresult cuMemcpyHtoD(CUdeviceptr dstDevice, const void *srcHost, size_t ByteCount);

// カーネル実行
CUresult cuLaunchKernel(CUfunction f, 
                       unsigned int gridDimX, unsigned int gridDimY, unsigned int gridDimZ,
                       unsigned int blockDimX, unsigned int blockDimY, unsigned int blockDimZ,
                       unsigned int sharedMemBytes, CUstream hStream, void **kernelParams, void **extra);
```

### 設定・カスタマイズ
#### 設定ファイル
```bash
# 環境変数による設定
ZLUDA_DEBUG=1                    # デバッグ情報を有効化
RUST_LOG=debug                   # Rustログレベル
ZLUDA_DUMP_DIR="/path/to/dump"   # APIダンプ出力先
COMGR_SPIRV_OPTIONS="--opt"      # AMDコンパイラオプション
```

#### 拡張・プラグイン開発
新しいCUDAライブラリのサポート追加:
1. `/cuda_types`に型定義追加
2. `/zluda_xxx`として新クレート作成
3. CUDA APIをHIP/ネイティブ実装にマッピング
4. Export tableに関数登録

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- **GeekBenchベンチマーク**: ネイティブに近いパフォーマンスを達成
- **最適化手法**: 
  - アグレッシブなインライン化（10xデフォルト闾値）
  - PTX命令の効率的なLLVM IRへの変換
  - AMD GPU固有最適化の活用

### スケーラビリティ
- カーネルのサイズと複雑さに応じたコンパイル時間
- 初回コンパイルのオーバーヘッドあり（キャッシュ可能）
- 同時実行カーネル数はAMD GPUのハードウェア制限に依存

### 制限事項
- **ハードウェア制限**: AMD Radeon RX 5000シリーズ以降のみサポート
- **OS制限**: WindowsとLinuxのみ（macOSは未サポート）
- **機能制限**: 
  - 現在はGeekBenchのみ完全動作確認
  - CUDAライブラリ（cuBLAS、cuDNN等）は未実装/スタブ
  - 動的パラレリズムなどの高度な機能は未サポート
- **互換性**: Compute Capability 8.8として報告（一部アプリで問題の可能性）

## 評価・所感
### 技術的評価
#### 強み
- 高度なコンパイラ技術によるPTXからLLVM IRへの完全な変換
- Rustによる安全かつモジュラーな実装
- AMDの公式ツールチェーン（HIP、COMGR）の活用
- ドロップイン置換による既存アプリの無変更動作
- GeekBenchで実証されたネイティブに近いパフォーマンス

#### 改善の余地
- CUDAライブラリ（cuBLAS、cuDNN等）の完全な実装
- より幅広いCUDAアプリケーションへの対応
- Intel GPUなど他の非NVIDIA GPUへの拡張
- ドキュメントの充実化

### 向いている用途
- CUDAアプリケーションのAMD GPUでのプロトタイピング
- ベンチマーク・パフォーマンステスト
- NVIDIA GPU不足時の代替ソリューション
- 教育・研究目的でのCUDA学習

### 向いていない用途
- プロダクション環境での即時利用（開発中のため）
- CUDAの全機能を必要とするアプリケーション
- macOSでの利用
- 旧世代AMD GPU（RX 5000以前）での利用

### 総評
ZLUDAは、CUDAエコシステムをNVIDIA以外のGPUに開放する野心的なプロジェクトです。高度なコンパイラ技術とAMDの公式ツールを組み合わせ、実用的なパフォーマンスを達成している点は高く評価できます。現在は開発初期段階で制限が多いものの、GPUコンピューティングのベンダーロックインを解消する可能性を秘めた重要な技術です。特にRustでの実装による安全性と保守性の向上、PTXコンパイラの精巧な設計は、オープンソースGPUコンピューティングの分野における大きな貢献と言えるでしょう。