# リポジトリ解析: stenzek/duckstation

## 基本情報
- リポジトリ名: stenzek/duckstation
- 主要言語: C++
- スター数: 8,700
- フォーク数: 786
- 最終更新: 活発に開発中（自動ビルドでリリースを更新）
- ライセンス: Other (CC-BY-NC-ND 4.0)
- トピックス: PlayStation emulator, PS1 emulator, gaming, retro gaming, emulation

## 概要
### 一言で言うと
高速化と精度を両立したクロスプラットフォームのPlayStation 1エミュレータ。低スペックPCでも快適に動作し、現代的なグラフィックエンハンスメント機能を提供する。

### 詳細説明
DuckStationは、ソニーのPlayStation（PS1/PSX）コンソールのエミュレータ/シミュレータで、プレイのしやすさ、速度、長期的な保守性に焦点を当てて開発されています。低スペックデバイスでも適切なパフォーマンスを維持しながら、可能な限り正確なエミュレーションを目指しています。「ハック」オプションは推奨されず、デフォルト設定でほとんどのゲームが動作するよう設計されています。Connor McLaughlin（@stenzek）が開発を主導し、コミュニティの貢献を受けています。

### 主な特徴
- x86-64、ARM、RISC-Vの複数アーキテクチャ対応のCPUリコンパイラ/JIT
- D3D11/12、OpenGL、Vulkan、Metalに対応したハードウェアレンダラー
- 最大32倍までの解像度アップスケーリング
- PGXP（ジオメトリ精度向上・テクスチャ補正）
- テクスチャ置換システム
- ベクトル化・マルチスレッド対応のソフトウェアレンダラー
- ポストプロセシングシェーダー（GLSL、ReShade FX）
- セーブステート（ルーンアヘッド、リワインド機能付き）
- RetroAchievements対応
- Discord Rich Presence対応
- ビデオキャプチャ機能
- 豊富なコントローラーサポート（ガンコン、NeGcon等）

## 使用方法
### インストール
#### 前提条件
- **CPU**: x86_64、AArch32/armv7、AArch64/ARMv8、またはRISC-V/RV64
- **GPU**: OpenGL 3.1/ES 3.1/D3D11 FL 10.0以上（過去10年以内のもの）
- **OS**:
  - Windows 10/11 (1809以降)
  - Linux (Ubuntu 22.04相当以降)
  - macOS 11.0以降
  - Android (armv7/AArch64/x86_64)
- **BIOS ROM**: PS1/PS2のBIOSイメージが必要

#### インストール手順
```bash
# Windowsの場合
# 1. https://github.com/stenzek/duckstation/releases/tag/latest からダウンロード
# 2. zipをサブディレクトリに展開
# 3. duckstation-qt-x64-ReleaseLTCG.exeを実行

# Linux AppImageの場合
wget https://github.com/stenzek/duckstation/releases/download/latest/duckstation-x64.AppImage
chmod a+x duckstation-x64.AppImage
./duckstation-x64.AppImage

# macOSの場合
# 1. duckstation-mac-release.zipをダウンロード
# 2. DuckStation.appを実行

# Androidの場合
# Google PlayからインストールまたはAPKを直接ダウンロード
```

### 基本的な使い方
#### 初回起動時のセットアップ
1. 起動後、セットアップウィザードが表示される
2. BIOSイメージを指定（ユーザーディレクトリ/biosに配置）
3. ゲームディレクトリを追加
4. コントローラーを設定

#### ゲームの起動
```
# ディスクイメージから：
1. メニューから「Start File」を選択
2. BIN/CUE、CHD、ISO等のイメージファイルを選択

# ゲームリストから：
1. ゲームリストでタイトルをダブルクリック

# CD-ROMから直接：
1. メニューから「Start Disc」を選択
```

### 高度な使い方
#### グラフィックエンハンスメント
```
# 設定 > グラフィックス
- レンダラー: Vulkan/OpenGL/D3D11を選択
- 解像度スケール: 1x～32x
- PGXP: ジオメトリ補正を有効化
- テクスチャフィルタリング: Bilinear/xBR等
```

#### カスタム設定例
```
# パフォーマンス向上:
- CPUオーバークロック: 200%まで
- ファストブート: BIOSスキップ
- プリロードディスク: RAMにイメージをロード

# レトロ感の保持:
- CRTシェーダーを適用
- アスペクト比をオリジナルに設定
- スキャンラインを有効化
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: 詳細なインストール手順、システム要件、機能一覧
- **公式サイト**: https://www.duckstation.org/
- **互換性リスト**: https://docs.google.com/spreadsheets/d/e/2PACX-1vRE0jjiK_aldpICoy5kVQlpk2f81Vo6P4p9vfg4d7YoTOoDlH4PQHoXjTD2F7SdN8SSBLoEAItaIqQo/pubhtml
- **Discordサーバー**: コミュニティサポート

### コントローラーデータベース
- **SDL Game Controller DB**: resources/gamecontrollerdb.txt
- **カスタムマッピング**: ユーザーディレクトリにコピーして編集可能

### チュートリアル・ガイド
- セットアップウィザードが初回起動時にガイド
- ゲームごとの設定プロファイル機能
- チート・パッチデータベース内蔵

## 技術的詳細
### アーキテクチャ
#### 全体構造
DuckStationはモジュラー設計で構築され、各PlayStationコンポーネントを独立したモジュールとしてエミュレートします。CPUエミュレーションは動的リコンパイルを使用し、GPUはハードウェアアクセラレーションとソフトウェアレンダリングの両方をサポートします。

#### ディレクトリ構成
```
duckstation/
├── src/
│   ├── core/         # PlayStationエミュレーションコア
│   │   ├── cpu_*     # MIPS R3000A CPUエミュレーション
│   │   ├── gpu_*     # GPUエミュレーション（HW/SWレンダラー）
│   │   ├── spu.*     # SPU（サウンド処理）
│   │   ├── cdrom.*   # CD-ROMドライブ
│   │   └── bus.*     # システムバス・メモリ管理
│   ├── common/       # 共通ユーティリティ
│   ├── util/         # CDイメージ、オーディオ/ビデオ処理
│   ├── duckstation-qt/  # QtベースGUI
│   └── duckstation-mini/ # ミニマルSDLフロントエンド
├── dep/              # サードパーティ依存関係
├── data/             # リソースファイル
└── scripts/          # ビルド・パッケージングスクリプト
```

#### 主要コンポーネント
- **CPUエミュレータ**: MIPS R3000Aプロセッサの完全エミュレーション
  - 場所: `src/core/cpu_*`
  - 依存: Bus, Memory Management
  - インターフェース: Recompiler (JIT), Interpreter, PGXP

- **GPUエミュレータ**: ハードウェア/ソフトウェアレンダリング
  - 場所: `src/core/gpu_*`
  - 依存: GPU Backend (D3D/OpenGL/Vulkan/Metal)
  - インターフェース: Hardware renderer, Software rasterizer

- **SPU**: サウンド処理ユニット
  - 場所: `src/core/spu.*`
  - 依存: Audio Stream, DMA
  - インターフェース: ADSR envelope, reverb, voices

- **System Bus**: メモリマッピングとI/O
  - 場所: `src/core/bus.*`
  - 依存: 全コンポーネント
  - インターフェース: Memory access, DMA transfers

### 技術スタック
#### コア技術
- **言語**: C++20 (MSVC 2022, Clang 19+, GCC 14+)
- **GUIフレームワーク**: 
  - Qt6 6.9.0+ (メインGUI)
  - Dear ImGui (フルスクリーンUI)
- **主要ライブラリ**: 
  - SDL3 3.2.16+: 入力/ウィンドウ管理
  - SPIRV-Cross/Shaderc: シェーダーコンパイル
  - SoundTouch: オーディオタイムストレッチ
  - libchdr: CHDイメージサポート
  - rapidyaml: 設定ファイル処理

#### 開発・運用ツール
- **ビルドツール**: 
  - CMake 3.19+ (クロスプラットフォーム)
  - Visual Studio 2022 (Windows)
  - Ninja (Linux/macOS)
- **CI/CD**: GitHub Actionsで自動ビルド・リリース
- **テスト**: リグレッションテストフレームワーク
- **デプロイ**: 各プラットフォーム向けバイナリを自動配布

### 設計パターン・手法
- **モジュラー設計**: 各ハードウェアコンポーネントを独立モジュール化
- **ジャストインタイムコンパイル**: 複数アーキテクチャ対応のCPUリコンパイラ
- **マルチレンダリングAPI**: 抽象化されたGPUバックエンド
- **イベント駆動**: タイミングイベントシステム
- **ページフォルトハンドラ**: 高速メモリアクセス

### データフロー・処理フロー
1. **ゲーム起動**: BIOSロード → ディスクイメージ読み込み
2. **CPU実行**: 命令フェッチ → デコード → JITコンパイル/実行
3. **GPUコマンド**: GP0/GP1コマンド → レンダリングパイプライン
4. **オーディオ**: SPU処理 → ミキシング → 出力
5. **入力**: コントローラー入力 → SIOエミュレーション
6. **同期**: V-Blank/H-Blankタイミング

## API・インターフェース
### 公開API
#### デバッグAPI
- **GDBサーバー**: リモートデバッグサポート
- **メモリスキャナーAPI**: チート検索・作成
- **GPUダンプAPI**: グラフィックコマンドの記録・再生

### 設定・カスタマイズ
#### 設定ファイル
```ini
# duckstation.iniの主要設定
[GPU]
Renderer = Vulkan
ResolutionScale = 4
PGXPEnable = true
TextureFiltering = xBR

[CPU]
OverclockEnable = true
OverclockNumerator = 200
OverclockDenominator = 100
```

#### ユーザーディレクトリ構成
```
~/.[local/share/]duckstation/
├── bios/             # BIOSイメージ
├── cache/            # シェーダーキャッシュ
├── cheats/           # チートコード
├── covers/           # ゲームカバー画像
├── memcards/         # メモリカード
├── savestates/       # セーブステート
└── textures/         # テクスチャ置換
```

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- **CPUリコンパイラ**: ネイティブコードに近いパフォーマンス
- **GPUアップスケーリング**: 4K解像度でも快適に動作（適切なGPU使用時）
- **メモリ使用量**: 約200-500MB（ゲームによる）
- **フレームレート**: オリジナルの60fps（NTSC）/50fps（PAL）を維持

### 最適化手法
- SIMD命令の活用（SSE4.1+、NEON）
- マルチスレッドソフトウェアレンダリング
- コードキャッシュによるJIT最適化
- GPUコマンドバッチング

### 制限事項
- **技術的制限**:
  - SSE4.1以上のCPUが必要（x86版）
  - 一部の特殊チップを使用したゲームの完全エミュレーションが困難
- **運用上の制限**:
  - BIOSイメージが必須（ユーザーが用意）
  - Android版はサポートなし

## 評価・所感
### 技術的評価
#### 強み
- 優れたパフォーマンスと互換性のバランス
- 幅広いプラットフォームサポート（x86、ARM、RISC-V）
- 現代的なエンハンスメント機能（PGXP、アップスケーリング）
- 活発な開発とコミュニティサポート
- ユーザーフレンドリーなGUIと設定システム

#### 改善の余地
- CC-BY-NC-NDライセンスによる商用利用の制限
- Android版のサポートが限定的
- 一部の特殊な周辺機器のエミュレーションが不完全

### 向いている用途
- レトロゲーム愛好家のPlayStationゲームプレイ
- ゲーム保存・アーカイブ
- ストリーミング・実況配信
- ゲーム開発・デバッグ用途

### 向いていない用途
- 商用利用（ライセンス制限）
- 古いOSでの使用（Windows 7/8等）
- 低スペックAndroidデバイスでの使用

### 総評
DuckStationは現在最も優れたPlayStationエミュレータの一つで、高い互換性とパフォーマンスを両立しています。現代的なエンハンスメント機能により、オリジナルよりも美しいグラフィックでゲームを楽しむことができ、同時にレトロ感を保つオプションも提供しています。クロスプラットフォーム対応とユーザーフレンドリーなインターフェースにより、初心者から上級者まで幅広いユーザーにお勧めできるエミュレータです。