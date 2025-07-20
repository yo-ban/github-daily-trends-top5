# リポジトリ解析: hyprwm/Hyprland

## 基本情報
- リポジトリ名: hyprwm/Hyprland
- 主要言語: C++
- スター数: 27,813
- フォーク数: 1,176
- 最終更新: 2025年1月（活発に開発中）
- ライセンス: BSD 3-Clause "New" or "Revised" License
- トピックス: Wayland compositor, tiling window manager, dynamic tiling, eye-candy

## 概要
### 一言で言うと
Hyprlandは、美しい見た目と高度なカスタマイズ性を両立した、独立型の動的タイリングWaylandコンポジタです。

### 詳細説明
Hyprlandは、Waylandプロトコル上で動作する次世代のウィンドウマネージャーで、既存のコンポジタライブラリ（wlroots、libweston、kwin、mutterなど）に依存せず、完全に独立した実装となっています。見た目の美しさを重視しており、グラデーションボーダー、ブラーエフェクト、滑らかなアニメーション、シャドウなどの視覚効果を提供しながら、高度な機能性とパフォーマンスを維持しています。動的タイリングレイアウトを採用し、ユーザーの作業効率を最大化します。

### 主な特徴
- 100%独立実装（wlrootsなどに依存しない）
- 高度な視覚効果（グラデーションボーダー、ブラー、アニメーション）
- 動的タイリングレイアウト（dwindleとmasterレイアウト）
- 強力なプラグインシステム（hyprpm）
- ソケットベースのIPC通信
- 即座の設定リロード
- ゲーミング向けのティアリングサポート
- ネイティブIMEサポート
- 包括的なウィンドウルールシステム

## 使用方法
### インストール
#### 前提条件
- C++26対応のコンパイラ
- Wayland 1.22.90以上
- OpenGL ES 3.0
- 主要な依存関係:
  - aquamarine >= 0.9.0（バックエンドライブラリ）
  - hyprlang >= 0.3.2（設定言語）
  - hyprcursor >= 0.1.7（カーソル管理）
  - hyprutils >= 0.8.1（ユーティリティ）
  - hyprgraphics >= 0.1.3（グラフィックスユーティリティ）
  - cairo、pango（テキストレンダリング）
  - libinput >= 1.28（入力処理）

#### インストール手順
```bash
# 方法1: CMakeを使用したビルド
git clone --recursive https://github.com/hyprwm/Hyprland
cd Hyprland
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build
sudo cmake --install build

# 方法2: Mesonを使用したビルド
meson setup build
ninja -C build
sudo ninja -C build install

# 方法3: ディストリビューション固有のパッケージマネージャー
# Arch Linux
sudo pacman -S hyprland

# NixOS
nix-shell -p hyprland
```

### 基本的な使い方
#### Hello World相当の例（最小限の設定）
```bash
# ~/.config/hypr/hyprland.conf

# モニター設定（自動検出）
monitor=,preferred,auto,auto

# 基本的なキーバインド
$mainMod = SUPER

bind = $mainMod, Q, exec, kitty              # ターミナル起動
bind = $mainMod, C, killactive               # ウィンドウを閉じる
bind = $mainMod, M, exit                     # Hyprland終了
bind = $mainMod, V, togglefloating           # フローティング切り替え

# ワークスペース切り替え
bind = $mainMod, 1, workspace, 1
bind = $mainMod, 2, workspace, 2

# 起動時にターミナルを開く
exec-once = kitty
```

#### 実践的な使用例（日常使用向け設定）
```bash
# ~/.config/hypr/hyprland.conf

# モニター設定
monitor=DP-1,2560x1440@144,0x0,1
monitor=HDMI-A-1,1920x1080@60,2560x0,1

# 見た目の設定
general {
    gaps_in = 5
    gaps_out = 10
    border_size = 2
    col.active_border = rgba(33ccffee) rgba(00ff99ee) 45deg
    col.inactive_border = rgba(595959aa)
    layout = dwindle
}

decoration {
    rounding = 10
    blur {
        enabled = true
        size = 3
        passes = 1
    }
    drop_shadow = yes
    shadow_range = 4
    shadow_render_power = 3
    col.shadow = rgba(1a1a1aee)
}

animations {
    enabled = yes
    bezier = myBezier, 0.05, 0.9, 0.1, 1.05
    animation = windows, 1, 7, myBezier
    animation = windowsOut, 1, 7, default, popin 80%
    animation = border, 1, 10, default
    animation = fade, 1, 7, default
    animation = workspaces, 1, 6, default
}

# アプリケーション起動
bind = $mainMod, RETURN, exec, kitty
bind = $mainMod, E, exec, dolphin
bind = $mainMod, R, exec, wofi --show drun
bind = $mainMod, B, exec, firefox

# ウィンドウ管理
bind = $mainMod, H, movefocus, l
bind = $mainMod, L, movefocus, r
bind = $mainMod, K, movefocus, u
bind = $mainMod, J, movefocus, d

# 起動時実行
exec-once = waybar
exec-once = hyprpaper
exec-once = nm-applet
exec-once = dunst
```

### 高度な使い方
```bash
# ウィンドウルールの高度な設定
windowrulev2 = float,class:^(pavucontrol)$
windowrulev2 = opacity 0.9 0.8,class:^(kitty)$
windowrulev2 = workspace 2,class:^(firefox)$
windowrulev2 = size 1280 720,title:^(Picture-in-Picture)$
windowrulev2 = move center,title:^(Picture-in-Picture)$
windowrulev2 = pin,title:^(Picture-in-Picture)$

# 特殊ワークスペース（スクラッチパッド）
bind = $mainMod, S, togglespecialworkspace, magic
bind = $mainMod SHIFT, S, movetoworkspace, special:magic

# マルチメディアキー
bindel = ,XF86AudioRaiseVolume, exec, wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%+
bindel = ,XF86AudioLowerVolume, exec, wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-
bindl = ,XF86AudioMute, exec, wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle
bind = ,XF86MonBrightnessUp, exec, brightnessctl set 5%+
bind = ,XF86MonBrightnessDown, exec, brightnessctl set 5%-

# スクリーンショット
bind = ,Print, exec, grim -g "$(slurp)" - | wl-copy
bind = SHIFT, Print, exec, grim - | wl-copy

# ゲーミング設定
misc {
    vrr = 1  # Variable Refresh Rate
    disable_hyprland_logo = true
    enable_swallow = true
    swallow_regex = ^(kitty)$
}

# ワークスペースごとの設定
workspace = 1, monitor:DP-1, default:true
workspace = 2, monitor:DP-1
workspace = 3, monitor:HDMI-A-1, default:true

# hyprctlを使った動的設定変更
bind = $mainMod ALT, G, exec, hyprctl keyword general:gaps_in 5
bind = $mainMod ALT SHIFT, G, exec, hyprctl keyword general:gaps_in 0
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクトの概要、基本的なインストール手順、主要機能の紹介
- **docs/Hyprland.1.rst**: 詳細なマニュアルページ、コマンドラインオプション
- **docs/hyprctl.1.rst**: hyprctlコマンドの詳細な使用方法
- **Wiki/サイト**: https://wiki.hypr.land/ - 包括的な設定ガイド、チュートリアル、トラブルシューティング

### サンプル・デモ
- **example/hyprland.conf**: デフォルトの設定ファイルサンプル、基本的な設定項目の例
- **example/hyprland.desktop**: デスクトップエントリーファイル
- **example/screenShader.frag**: カスタムシェーダーの例

### チュートリアル・ガイド
- 公式Wiki内の「Getting Started」セクション
- 「Master Tutorial」- 初心者向けの包括的なガイド
- Hyprエコシステムのツール群（hyprpaper、hyprpicker、hypridle、hyprlock）のドキュメント
- コミュニティ作成の設定集とdotfiles

## 技術的詳細
### アーキテクチャ
#### 全体構造
Hyprlandは、モジュラーアーキテクチャを採用しており、コアコンポジタ、バックエンド（aquamarine）、レンダリングシステム、プロトコル実装、プラグインシステムが明確に分離されています。Waylandプロトコルを直接実装し、既存のコンポジタライブラリに依存しない独立した設計となっています。

#### ディレクトリ構成
```
Hyprland/
├── src/              # ソースコード
│   ├── Compositor.cpp/hpp    # メインコンポジタクラス
│   ├── config/              # 設定管理システム
│   ├── desktop/             # ウィンドウ、ワークスペース、サーフェス管理
│   ├── render/              # OpenGLレンダリングシステム
│   ├── protocols/           # Waylandプロトコル実装
│   ├── managers/            # 各種サブシステムマネージャー
│   ├── devices/             # 入力デバイス処理
│   ├── layout/              # レイアウトアルゴリズム（dwindle、master）
│   ├── plugins/             # プラグインシステム
│   └── xwayland/            # XWaylandサポート
├── protocols/        # Waylandプロトコルファイル
├── hyprctl/          # コマンドラインツール
├── hyprpm/           # プラグインマネージャー
├── docs/             # ドキュメント
├── example/          # サンプル設定
└── nix/              # Nixパッケージング
```

#### 主要コンポーネント
- **Compositor**: コアコンポジタロジック
  - 場所: `src/Compositor.cpp`
  - 役割: イベントループ、Wayland接続管理、全体的な調整
  - 主要メソッド: startCompositor(), focusWindow(), cleanupExit()

- **ConfigManager**: 設定管理システム
  - 場所: `src/config/ConfigManager.cpp`
  - 役割: hyprlang設定ファイルの解析、動的リロード
  - 依存: hyprlang

- **OpenGL Renderer**: レンダリングエンジン
  - 場所: `src/render/OpenGL.cpp`
  - 役割: OpenGL ES 3.0を使用した描画処理
  - 機能: シェーダー管理、テクスチャ処理、ブラーエフェクト

- **LayoutManager**: レイアウト管理
  - 場所: `src/managers/LayoutManager.cpp`
  - 役割: dwindleとmasterレイアウトの切り替えと管理

- **ProtocolManager**: プロトコル処理
  - 場所: `src/managers/ProtocolManager.cpp`
  - 役割: 各種Waylandプロトコルの登録と処理

### 技術スタック
#### コア技術
- **言語**: C++26（最新の標準機能を積極的に使用）
- **グラフィックスAPI**: OpenGL ES 3.0（クロスプラットフォーム対応）
- **主要ライブラリ**: 
  - aquamarine (>= 0.9.0): DRM/KMSバックエンド、入力処理
  - hyprlang (>= 0.3.2): 設定ファイル解析
  - hyprcursor (>= 0.1.7): カーソーテーマ管理
  - cairo/pango: テキストレンダリング、UI描画
  - libdrm/gbm: Direct Rendering Manager統合
  - libinput (>= 1.28): 入力デバイス処理
  - re2: 正規表現エンジン（ウィンドウルール）

#### 開発・運用ツール
- **ビルドツール**: CMake（主要）、Meson（代替）- 並列ビルド対応
- **テスト**: hyprtester - カスタムテストフレームワーク
- **CI/CD**: GitHub Actions - 自動ビルド、テスト実行
- **パッケージング**: Nix Flakes対応、各種ディストリビューション向けパッケージ

### 設計パターン・手法
- **シングルトン**: Compositorクラス（グローバルインスタンス管理）
- **オブザーバー**: イベントシステム（シグナル/スロット）
- **ファクトリー**: プロトコル実装の動的生成
- **デコレーター**: ウィンドウ装飾とエフェクト
- **プラグインアーキテクチャ**: 動的ロード可能な拡張機能

### データフロー・処理フロー
1. **入力処理**: libinput → デバイスマネージャー → イベントキュー
2. **イベント処理**: Waylandイベント → プロトコルハンドラー → 内部イベント
3. **レイアウト計算**: ウィンドウイベント → レイアウトマネージャー → 位置計算
4. **レンダリング**: ダメージ計算 → OpenGLレンダラー → フレームバッファ → DRM出力
5. **アニメーション**: タイマーベース → ベジェ曲線補間 → プロパティ更新

## API・インターフェース
### 公開API
#### IPC Socket API
- 目的: 外部プログラムからのHyprland制御
- 使用例:
```bash
# hyprctlを使用したコマンド実行
hyprctl dispatch exec kitty
hyprctl activewindow | jq '.title'
hyprctl workspaces -j | jq '.[].id'

# 直接ソケット通信
echo "dispatch exec firefox" | socat - UNIX-CONNECT:/tmp/hypr/$HYPRLAND_INSTANCE_SIGNATURE/.socket.sock
```

#### プラグインAPI (C++)
- 目的: Hyprlandの機能拡張
- 使用例:
```cpp
#include <hyprland/src/plugins/PluginAPI.hpp>

class MyPlugin : public IHyprlandPlugin {
public:
    virtual void onWindowCreated(CWindow* pWindow) {
        // ウィンドウ作成時の処理
    }
};

EXPORT_PLUGIN(MyPlugin)
```

### 設定・カスタマイズ
#### 設定ファイル
```bash
# ~/.config/hypr/hyprland.conf

# 変数定義
$terminal = kitty
$menu = wofi --show drun

# セクション形式の設定
general {
    gaps_in = 5          # ウィンドウ間の隙間
    border_size = 2      # ボーダーの太さ
    resize_on_border = true  # ボーダーでリサイズ可能
}

# ルールベースの設定
windowrulev2 = float, class:^(calc)$
workspace = 1, monitor:DP-1, default:true
```

#### 拡張・プラグイン開発
- **開発方法**: C++ APIを使用、ヘッダーファイルは`/usr/include/hyprland/`に配置
- **プラグイン管理**: `hyprpm`コマンドでインストール/更新/削除
- **フック可能なイベント**: ウィンドウ作成/破棄、フォーカス変更、レイアウト変更、レンダリング前後
- **公開インターフェース**: `IHyprlandPlugin`基底クラスを継承

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- レンダリング: 144Hz+のリフレッシュレートに対応
- メモリ使用量: 通常50-150MB（プラグイン、設定により変動）
- 最適化手法:
  - ダメージトラッキングによる部分レンダリング
  - GPUアクセラレーション（OpenGL ES 3.0）
  - 非同期アニメーション処理
  - VRR（可変リフレッシュレート）サポート

### スケーラビリティ
- マルチモニター: 制限なし（GPU性能に依存）
- ウィンドウ数: 数百のウィンドウでも安定動作
- ワークスペース: 実質無制限（メモリに依存）
- 4K/8K解像度対応

### 制限事項
- NVIDIAプロプライエタリドライバーでの一部機能制限
- Waylandプロトコルの制約（スクリーン録画ツールの互換性など）
- 一部のXorgアプリケーションはXWayland経由での動作
- プラグインAPIの後方互換性は保証されない（開発中）

## 評価・所感
### 技術的評価
#### 強み
- 完全独立実装による柔軟性と最適化の自由度
- 美しいビジュアルエフェクトとスムーズなアニメーション
- 高度にカスタマイズ可能な設定システム
- 活発な開発とコミュニティサポート
- 優れたパフォーマンスと低レイテンシ

#### 改善の余地
- ドキュメントが開発速度に追いついていない場合がある
- プラグインAPIがまだ安定していない
- 一部のレガシーアプリケーションとの互換性
- NVIDIAドライバーでの制限

### 向いている用途
- 開発者やパワーユーザーのデスクトップ環境
- ゲーミングPC（ティアリングサポート、低レイテンシ）
- 高度にカスタマイズされた作業環境を求めるユーザー
- タイリングウィンドウマネージャーを好むユーザー

### 向いていない用途
- 企業の標準デスクトップ環境
- Linux初心者のメイン環境
- レガシーXorgアプリケーションに大きく依存する環境
- 設定をGUIで行いたいユーザー

### 総評
Hyprlandは、Waylandコンポジタの中でも特に革新的なプロジェクトです。既存のライブラリに依存しない独立実装により、他のコンポジタでは実現困難な機能や最適化を実現しています。見た目の美しさと機能性を両立させており、カスタマイズ性も非常に高いです。まだ開発中のプロジェクトですが、日常使用には十分な安定性があり、活発なコミュニティによるサポートも充実しています。タイリングウィンドウマネージャーに慣れたユーザーや、最新技術を積極的に取り入れたいユーザーには特におすすめです。