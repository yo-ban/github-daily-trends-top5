# リポジトリ解析: hyprwm/Hyprland

## 基本情報
- リポジトリ名: hyprwm/Hyprland
- 主要言語: C++
- スター数: 28,133
- フォーク数: 1,191
- 最終更新: 2025年7月（活発に開発中）
- ライセンス: BSD 3-Clause "New" or "Revised" License
- トピックス: wayland-compositor, tiling-window-manager, dynamic-tiling, gpu-acceleration, modern-desktop

## 概要
### 一言で言うと
美しさと機能性を両立した、完全独立型の動的タイリングWaylandコンポジタで、最新のWayland機能と豊富なビジュアルエフェクトを提供。

### 詳細説明
Hyprlandは、見た目の美しさを犠牲にすることなく、高い機能性を提供するように設計された最新のWaylandコンポジタです。wlrootsなどの既存のコンポジタライブラリに依存せず、独自のバックエンド「Aquamarine」を使用する100%独立型のプロジェクトです。グラデーションボーダー、ブラーエフェクト、カスタムベジェ曲線を使ったアニメーション、影、角丸など、豊富なビジュアルエフェクトを提供しながら、実用的なウィンドウ管理機能を備えています。

### 主な特徴
- 独自バックエンド「Aquamarine」による完全独立型アーキテクチャ
- GPU加速による豊富なビジュアルエフェクト（ブラー、グラデーション、アニメーション）
- 動的タイリングレイアウト（dwindleとmaster）
- ウィンドウグループ（タブ機能）対応
- プラグインシステムとプラグインマネージャー（hyprpm）
- ホットリロード対応の設定システム
- ゲーミング最適化（ティアリングサポート）
- ソケットベースのIPC機能
- 包括的なWaylandプロトコルサポート

## 使用方法
### インストール
#### 前提条件
- Wayland対応のLinuxディストリビューション
- C++26対応コンパイラ（GCC 14+またはClang 19+）
- CMake 3.30+ または Meson
- GPUドライバ（NVIDIA、AMD、Intel）
- 必要な依存ライブラリ（aquamarine、hyprlang、hyprcursorなど）

#### インストール手順
```bash
# 方法1: パッケージマネージャー経由
# Arch Linux
sudo pacman -S hyprland
# またはAURから最新版
yay -S hyprland-git

# NixOS
# configuration.nixに追加
programs.hyprland.enable = true;

# FreeBSD
sudo pkg install hyprland

# openSUSE
sudo zypper in hyprland

# 方法2: ソースからビルド
git clone --recursive https://github.com/hyprwm/Hyprland
cd Hyprland

# CMakeを使用
cmake -B build
cmake --build build -j$(nproc)
sudo cmake --install build

# またはMesonを使用
meson setup build
ninja -C build
sudo ninja -C build install
```

### 基本的な使い方
#### Hello World相当の例
```bash
# セッションマネージャーからHyprlandを起動
# またはTTYから
Hyprland

# 基本的なキーバインド（~/.config/hypr/hyprland.conf）
bind = SUPER, Q, exec, kitty  # ターミナル起動
bind = SUPER, C, killactive   # ウィンドウを閉じる
bind = SUPER, M, exit         # Hyprlandを終了
```

#### 実践的な使用例
```bash
# ~/.config/hypr/hyprland.conf
# モニター設定
monitor=,preferred,auto,1

# アニメーション設定
animations {
    enabled = yes
    bezier = myBezier, 0.05, 0.9, 0.1, 1.05
    animation = windows, 1, 7, myBezier
    animation = fade, 1, 7, default
    animation = workspaces, 1, 6, default
}

# ウィンドウルール
windowrule = float, ^(pavucontrol)$
windowrule = opacity 0.8 0.6, ^(kitty)$
windowrulev2 = animation slide, class:^(firefox)$

# ワークスペースのバインド
bind = SUPER, 1, workspace, 1
bind = SUPER, 2, workspace, 2
bind = SUPER SHIFT, 1, movetoworkspace, 1
bind = SUPER SHIFT, 2, movetoworkspace, 2
```

### 高度な使い方
```bash
# グラデーションボーダーとブラー設定
decoration {
    rounding = 10
    
    blur {
        enabled = true
        size = 3
        passes = 1
        vibrancy = 0.1696
    }
    
    drop_shadow = yes
    shadow_range = 4
    shadow_render_power = 3
    col.shadow = rgba(1a1a1aee)
    
    # グラデーションボーダー
    active_opacity = 1.0
    inactive_opacity = 0.9
    col.active_border = rgba(33ccffee) rgba(00ff99ee) 45deg
    col.inactive_border = rgba(595959aa)
}

# プラグインのインストールと使用
# hyprpmを使用してプラグインを管理
hyprpm add https://github.com/hyprwm/hyprland-plugins
hyprpm enable borders-plus-plus

# hyprctlを使った動的制御
hyprctl keyword general:gaps_in 5
hyprctl keyword general:gaps_out 20
hyprctl keyword decoration:rounding 10

# IPCソケット経由での制御
echo "dispatch workspace 2" | socat - UNIX-CONNECT:/tmp/hypr/$HYPRLAND_INSTANCE_SIGNATURE/.socket.sock
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、インストール方法、基本情報
- **Wiki**: https://wiki.hypr.land/ - 包括的なドキュメントとガイド
- **docs/Hyprland.1**: manページ（コマンドラインリファレンス）
- **docs/hyprctl.1**: hyprctlコマンドのmanページ

### サンプル・デモ
- **example/hyprland.conf**: 基本的な設定ファイルのサンプル
- **example/screenShader.frag**: カスタムシェーダーの例
- **example/hyprland.desktop**: デスクトップエントリファイル
- **example/hyprland.service**: systemdサービスファイル

### チュートリアル・ガイド
- **Getting Started Tutorial**: https://wiki.hypr.land/Getting-Started/Master-Tutorial/
- **Configuration Guide**: https://wiki.hypr.land/Configuring/
- **Community Discord**: https://discord.com/invite/hQ9XvMUjjr
- **Forum**: https://forum.hypr.land/
- **GitHub Discussions**: コミュニティサポートと議論

## 技術的詳細
### アーキテクチャ
#### 全体構造
Hyprlandは、独自のバックエンド「Aquamarine」を基盤とした完全独立型のWaylandコンポジタで、マネージャーパターンを活用したモジュラーな設計を採用。OpenGLベースのレンダリングシステムでGPU加速されたビジュアルエフェクトを実現。

#### ディレクトリ構成
```
Hyprland/
├── src/
│   ├── Compositor.{cpp,hpp}  # コアコンポジタロジック
│   ├── config/               # 設定管理システム
│   ├── debug/                # デバッグユーティリティ、クラッシュレポート
│   ├── desktop/              # ウィンドウ、ワークスペース、レイヤー管理
│   ├── devices/              # 入力デバイスハンドリング
│   ├── events/               # イベントハンドリング
│   ├── helpers/              # ユーティリティ（アニメーション、数学など）
│   ├── layout/               # タイリングレイアウト実装
│   ├── managers/             # 各種サブシステムマネージャー
│   ├── plugins/              # プラグインシステム
│   ├── protocols/            # Waylandプロトコル実装
│   ├── render/               # OpenGLレンダリングシステム
│   │   ├── decorations/      # ウィンドウデコレーション
│   │   ├── pass/             # レンダーパスシステム
│   │   └── shaders/          # GLSLシェーダー
│   └── xwayland/             # XWaylandサポート
├── hyprctl/                  # コマンドライン制御ツール
├── hyprpm/                   # プラグインマネージャー
├── protocols/                # WaylandプロトコルXML定義
└── nix/                      # Nixパッケージ定義
```

#### 主要コンポーネント
- **Compositorクラス**: コンポジタの中核
  - 場所: `src/Compositor.cpp`
  - 依存: Aquamarineバックエンド、各種マネージャー
  - インターフェース: startCompositor()、focusWindow()、cleanup()

- **マネージャー群**: 各機能を担当する専門マネージャー
  - AnimationManager: アニメーション制御
  - KeybindManager: キーバインド処理
  - ConfigManager: 設定管理
  - LayoutManager: レイアウト制御
  - CursorManager: カーソル管理

- **Renderer**: OpenGLレンダリングシステム
  - 場所: `src/render/Renderer.cpp`
  - 依存: OpenGL、GLSLシェーダー
  - インターフェース: renderWindow()、renderLayer()、beginRender()

### 技術スタック
#### コア技術
- **言語**: C++26 (最新C++標準、modules、concepts使用)
- **バックエンド**: 
  - Aquamarine (≥ 0.9.0): 独自開発のWaylandバックエンド
  - wlroots非依存の完全独立型アーキテクチャ
- **主要ライブラリ**: 
  - hyprlang (≥ 0.3.2): 設定言語パーサー
  - hyprcursor (≥ 0.1.7): カーソル管理
  - hyprgraphics (≥ 0.1.3): グラフィックスユーティリティ
  - hyprutils (≥ 0.8.1): 汎用ユーティリティ
  - OpenGL: レンダリング
  - pango、cairo: テキストレンダリング

#### 開発・運用ツール
- **ビルドツール**: 
  - CMake 3.30+ および Meson の両方をサポート
  - pkg-configで依存関係管理
  - デフォルトで-O3最適化
- **テスト**: 
  - hyprtester: 専用テストフレームワーク
  - 自動テスト用設定ファイル
- **CI/CD**: 
  - GitHub Actionsで包括的なCI/CDパイプライン
  - 複数のディストリビューション向けビルド
  - Nixビルドサポート
- **デプロイ**: 
  - 各ディストリビューションのパッケージマネージャー経由
  - systemdサービスファイル提供

### 設計パターン・手法
- **マネージャーパターン**: 各機能を専門マネージャーに分離
- **プロトコル指向設計**: 各Waylandプロトコルを独立したモジュールで実装
- **パスベースレンダリング**: レンダーパスをステージごとに分離
- **フックシステム**: プラグインが挙動をカスタマイズできるフックポイント
- **イベント駆動アーキテクチャ**: Waylandイベントを中心とした処理

### データフロー・処理フロー
1. **入力処理**
   - libinputからの入力イベント受信
   - InputManagerでイベントを処理
   - KeybindManagerでキーバインドチェック

2. **ウィンドウ管理**
   - Waylandクライアントからのサーフェス作成要求
   - CWindowオブジェクト生成
   - LayoutManagerで配置決定
   - AnimationManagerでアニメーション適用

3. **レンダリング**
   - Renderer::beginRender()でフレーム開始
   - レンダーパスごとに描画（背景→ウィンドウ→オーバーレイ）
   - GLSLシェーダーでエフェクト適用
   - Aquamarineバックエンドへのフレーム送信

## API・インターフェース
### 公開API
#### IPCソケットAPI
- 目的: 外部アプリケーションからのHyprland制御
- 使用例:
```bash
# コマンド送信
echo "dispatch workspace 2" | socat - UNIX-CONNECT:/tmp/hypr/$HYPRLAND_INSTANCE_SIGNATURE/.socket.sock

# 情報取得
echo "clients" | socat - UNIX-CONNECT:/tmp/hypr/$HYPRLAND_INSTANCE_SIGNATURE/.socket.sock
```

#### hyprctl CLI
- 目的: コマンドラインからのHyprland制御
- 使用例:
```bash
# ウィンドウ情報取得
hyprctl clients

# 動的設定変更
hyprctl keyword general:border_size 3
hyprctl keyword decoration:rounding 10

# アクティブウィンドウ情報
hyprctl activewindow

# プラグインリスト
hyprctl plugin list
```

### 設定・カスタマイズ
#### 設定ファイル
```bash
# ~/.config/hypr/hyprland.conf

# モニター設定
monitor=DP-1,2560x1440@144,0x0,1
monitor=HDMI-A-1,1920x1080@60,2560x0,1

# 一般設定
general {
    gaps_in = 5
    gaps_out = 20
    border_size = 3
    col.active_border = rgba(33ccffee) rgba(00ff99ee) 45deg
    layout = dwindle
}

# アニメーション設定
animations {
    enabled = yes
    bezier = myBezier, 0.05, 0.9, 0.1, 1.05
    animation = windows, 1, 7, myBezier
}

# 環境変数
env = XCURSOR_SIZE,24
env = QT_QPA_PLATFORMTHEME,qt5ct
```

#### 拡張・プラグイン開発
**プラグインAPI**
```cpp
// プラグインエントリポイント
PLUGININFO {
    API_VERSION = 1,
    name = "My Plugin",
    author = "Author Name",
    version = "1.0"
};

// フック例
void onWindowCreated(PHLWINDOW window) {
    // ウィンドウ作成時の処理
}

// hyprpmでインストール
hyprpm add https://github.com/user/plugin
hyprpm enable plugin-name
```

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- **レンダリング性能**: 
  - GPU加速による60-144+ FPSの滑らかな描画
  - ティアリングサポートでゲーミング最適化
- **最適化手法**: 
  - -O3コンパイル最適化
  - OpenGLバッチ処理
  - ダメージトラッキングによる再描画最小化
  - カスタムベジェ曲線によるアニメーション最適化

### スケーラビリティ
- **ワークスペース**: 無制限の動的ワークスペース作成
- **モニターサポート**: 複数モニターでの異なる解像度・リフレッシュレート
- **プラグインシステム**: 機能を動的に拡張可能

### 制限事項
- **技術的な制限**:
  - Wayland対応アプリケーションが必要（XWaylandで一部互換性提供）
  - NVIDIA GPUではプロプライエタリドライバが必要
  - C++26対応コンパイラが必要
- **運用上の制限**:
  - Linux専用（BSDは一部サポート）
  - メモリ使用量が他の軽量WMより多い
  - 初期設定に学習コスト

## 評価・所感
### 技術的評価
#### 強み
- **完全独立型アーキテクチャ**: wlrootsに依存しない独自実装による高い自由度
- **最先端のビジュアル機能**: GPU加速による豊富なエフェクトと滑らかなアニメーション
- **優れた拡張性**: プラグインシステムとhyprpmによる簡単な機能拡張
- **アクティブな開発**: 頻繁なアップデートと新機能の追加
- **包括的な設定システム**: ホットリロード対応で柔軟なカスタマイズが可能

#### 改善の余地
- **高いシステム要件**: C++26対応コンパイラなど最新の開発環境が必要
- **学習曲線**: 独自の設定構文と豊富な機能により初期学習コストが高い
- **メモリ使用量**: ビジュアルエフェクトのため他の軽量WMより多くのメモリを消費
- **Wayland限定**: X11環境では動作しない（XWaylandで部分的な互換性）

### 向いている用途
- **モダンなデスクトップ環境**: 美しいビジュアルと高機能を求めるパワーユーザー
- **開発者向けワークステーション**: 高度なカスタマイズとプログラマブルな環境
- **ゲーミングPC**: ティアリングサポートによる低遅延ゲーミング
- **マルチモニター環境**: 柔軟なモニター設定と個別のワークスペース管理

### 向いていない用途
- **古いハードウェア**: GPU加速が必須のため低スペックマシンには不向き
- **サーバー環境**: デスクトップ向け機能が中心でヘッドレス運用には不適
- **安定性重視の環境**: 活発な開発により頻繁な変更がある
- **最小構成システム**: 依存関係が多く、軽量システムには不向き

### 総評
Hyprlandは、Waylandコンポジタの新しい可能性を示す野心的なプロジェクトです。既存のライブラリに依存しない独自実装により、他のコンポジタでは実現困難な高度なビジュアルエフェクトと機能を提供しています。美しさと機能性の両立という目標を見事に達成し、モダンなLinuxデスクトップ環境の新たな選択肢となっています。学習コストは高いものの、それに見合う柔軟性とカスタマイズ性を提供し、特にパワーユーザーや開発者にとって魅力的な選択肢です。