# リポジトリ解析: hyprwm/Hyprland

## 基本情報
- リポジトリ名: hyprwm/Hyprland
- 主要言語: C++
- スター数: 27,227
- フォーク数: 1,153
- 最終更新: 活発に開発中
- ライセンス: BSD 3-Clause "New" or "Revised" License
- トピックス: Wayland compositor, tiling window manager, eyecandy, animations, customizable

## 概要
### 一言で言うと
Hyprlandは、見た目の美しさを犠牲にすることなく、高度なカスタマイズ性を提供する独立型動的タイリングWaylandコンポジターです。

### 詳細説明
Hyprlandは、100%独立した実装により、wlrootsやlibweston、kwin、mutterなどの既存のコンポジターライブラリに依存しない、最新のWaylandコンポジターです。ビジュアルエフェクト（グラデーションボーダー、ぼかし、アニメーション、影など）を重視しつつ、タイリングウィンドウマネージャーとしての実用性も両立させています。高速で活発な開発が行われており、最新のWayland機能をいち早く実装しています。

### 主な特徴
- 100%独立実装によるフレキシビリティ
- 美しいビジュアルエフェクト（グラデーションボーダー、ぼかし、アニメーション、影）
- カスタムベジェ曲線による最高品質のアニメーション
- 最も強力なプラグインシステムと内蔵プラグインマネージャー（hyprpm）
- 簡単なIPC（プロセス間通信）による外部制御
- 設定ファイルの即座のリロード（保存時）
- 完全に動的なワークスペース
- ティアリングサポートによる優れたゲーミングパフォーマンス
- ウィンドウグループ（タブモード）
- 特殊ワークスペース（スクラッチパッド）
- アプリへのグローバルキーバインド
- ネイティブIMEとInput Panelsサポート
- 強力なウィンドウ/モニター/レイヤールール

## 使用方法
### インストール
#### 前提条件
- Waylandをサポートする Linux システム
- C++26対応コンパイラ（GCC 13+、Clang 18+）
- 必要な依存関係（下記参照）

#### インストール手順
```bash
# 方法1: ソースからビルド（推奨）
# 依存関係のインストール（ディストリビューション別にWikiを参照）
# リリースビルド
make release

# インストール
sudo make install

# ヘッダーファイルのインストール（プラグイン開発用）
sudo make installheaders

# 方法2: ディストリビューション固有のパッケージ
# 各ディストリビューションの公式リポジトリまたはAUR等を利用
# 詳細は https://wiki.hypr.land/Getting-Started/Installation/ を参照
```

### 基本的な使い方
#### Hello World相当の例
```bash
# TTYからHyprlandを起動
Hyprland

# 基本的な設定ファイル（~/.config/hypr/hyprland.conf）
$terminal = kitty
$menu = wofi --show drun

# モニター設定
monitor=,preferred,auto,1

# 基本的なキーバインド
bind = SUPER, Q, exec, $terminal
bind = SUPER, R, exec, $menu
bind = SUPER, C, killactive
bind = SUPER, M, exit
```

#### 実践的な使用例
```conf
# ~/.config/hypr/hyprland.conf
# 変数定義
$mainMod = SUPER
$terminal = kitty
$fileManager = dolphin
$menu = rofi -show drun

# 自動起動
exec-once = waybar & mako & hypridle
exec-once = wl-paste --type text --watch cliphist store
exec-once = udiskie &

# 外観設定
general {
    gaps_in = 5
    gaps_out = 10
    border_size = 2
    col.active_border = rgba(33ccffee) rgba(00ff99ee) 45deg
    col.inactive_border = rgba(595959aa)
    layout = dwindle
    allow_tearing = false
}

decoration {
    rounding = 10
    blur {
        enabled = true
        size = 3
        passes = 1
        vibrancy = 0.1696
    }
    drop_shadow = true
    shadow_range = 4
    shadow_render_power = 3
    col.shadow = rgba(1a1a1aee)
}

animations {
    enabled = true
    bezier = myBezier, 0.05, 0.9, 0.1, 1.05
    animation = windows, 1, 7, myBezier
    animation = windowsOut, 1, 7, default, popin 80%
    animation = border, 1, 10, default
    animation = borderangle, 1, 8, default
    animation = fade, 1, 7, default
    animation = workspaces, 1, 6, default
}

# ウィンドウルール
windowrulev2 = float,class:^(pavucontrol)$
windowrulev2 = opacity 0.8,class:^(kitty)$
windowrulev2 = workspace 2,class:^(firefox)$
```

### 高度な使い方
```conf
# マルチモニター設定
monitor = DP-1, 1920x1080@144, 0x0, 1
monitor = HDMI-A-1, 1920x1080@60, 1920x0, 1

# ワークスペースルール
workspace = 1, monitor:DP-1, default:true
workspace = 2, monitor:HDMI-A-1

# ウィンドウグループ（タブ機能）
bind = $mainMod, G, togglegroup
bind = $mainMod, tab, changegroupactive

# 特殊ワークスペース（スクラッチパッド）
bind = $mainMod, S, togglespecialworkspace, magic
bind = $mainMod SHIFT, S, movetoworkspace, special:magic

# カスタムディスパッチャー
bind = $mainMod, P, exec, hyprctl dispatch pseudo

# プラグインの読み込み
plugin = /usr/lib/libhyprland-plugin.so

# 権限管理（新機能）
ecosystem {
    enforce_permissions = 1
}
permission = /usr/bin/grim, screencopy, allow
permission = /usr/lib/xdg-desktop-portal-hyprland, screencopy, allow
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクトの概要、機能一覧、謝辞
- **docs/Hyprland.1.rst**: Hyprlandコマンドのmanページ
- **docs/hyprctl.1.rst**: hyprctlツールのmanページ
- **Wiki/サイト**: https://wiki.hypr.land/ - 包括的な公式ドキュメント

### サンプル・デモ
- **example/hyprland.conf**: デフォルト設定ファイルの完全な例
- **example/hyprland.desktop**: デスクトップエントリーファイル
- **example/screenShader.frag**: カスタムシェーダーの例

### チュートリアル・ガイド
- Getting Started Guide: https://wiki.hypr.land/Getting-Started/
- Master Tutorial: https://wiki.hypr.land/Getting-Started/Master-Tutorial/
- Configuring Guide: https://wiki.hypr.land/Configuring/
- Plugin Development: https://wiki.hypr.land/Plugins/Development/
- Nix Integration: https://wiki.hypr.land/Nix/
- NVIDIA Support: https://wiki.hypr.land/Nvidia/

## 技術的詳細
### アーキテクチャ
#### 全体構造
Hyprlandは、CCompositorクラスを中心とした階層的なアーキテクチャを採用しています。Waylandプロトコルの実装、レンダリング、入力処理、ウィンドウ管理などの機能が、それぞれ独立したマネージャークラスとして実装され、CCompositorによって統合管理されます。Aquamarineバックエンドを使用してハードウェア抽象化を行い、OpenGLベースのレンダリングシステムによって描画を行います。

#### ディレクトリ構成
```
Hyprland/
├── src/                # メインソースコード
│   ├── config/         # 設定管理システム（ConfigManager、ConfigValue等）
│   ├── debug/          # デバッグ・ログシステム（CrashReporter、HyprCtl等）
│   ├── desktop/        # デスクトップコンポーネント（Window、Workspace、LayerSurface等）
│   ├── devices/        # 入力デバイス抽象化（Keyboard、Mouse、Touch、Tablet等）
│   ├── events/         # イベントハンドリング
│   ├── helpers/        # ユーティリティ（AnimatedVariable、Color、Math、Time等）
│   ├── init/           # 初期化ヘルパー
│   ├── layout/         # ウィンドウレイアウトシステム（DwindleLayout、MasterLayout）
│   ├── managers/       # 各種マネージャー（Input、Animation、Cursor、Protocol等）
│   ├── plugins/        # プラグインシステム（HookSystem、PluginAPI）
│   ├── protocols/      # Waylandプロトコル実装
│   ├── render/         # レンダリングシステム（OpenGL、Shader、Texture等）
│   └── xwayland/       # XWaylandサポート
├── hyprctl/            # コントロールツール
├── hyprpm/             # プラグインマネージャー
├── protocols/          # Waylandプロトコル定義（XML）
└── example/            # 設定例とサンプル
```

#### 主要コンポーネント
- **CCompositor**: 中核となるコンポジタークラス
  - 場所: `src/Compositor.cpp`
  - 役割: Waylandディスプレイ管理、各種マネージャーの統合、グローバル状態管理
  - 依存: すべてのマネージャークラス、Aquamarineバックエンド

- **CInputManager**: 入力管理システム
  - 場所: `src/managers/input/InputManager.cpp`
  - 役割: すべての入力イベントの処理とディスパッチ
  - インターフェース: onMouseMoved、onKeyboardKey、onTouchDown等

- **CHyprRenderer**: レンダリングシステム
  - 場所: `src/render/Renderer.cpp`
  - 役割: OpenGLベースの描画、レンダリングパス管理
  - 依存: OpenGL、シェーダーシステム、テクスチャマネージャー

- **CAnimationManager**: アニメーション管理
  - 場所: `src/managers/AnimationManager.cpp`
  - 役割: ベジェ曲線ベースのアニメーション処理
  - インターフェース: tick()、animationPopin()等

- **CProtocolManager**: プロトコル管理
  - 場所: `src/managers/ProtocolManager.cpp`
  - 役割: Waylandプロトコルの登録と管理
  - 依存: IWaylandProtocol派生クラス

### 技術スタック
#### コア技術
- **言語**: C++26（最新規格）、モダンC++機能を積極的に活用
- **グラフィックス**: OpenGL ES 3.2 / OpenGL 3.2
- **主要ライブラリ**: 
  - aquamarine (>= 0.9.0): ハードウェアバックエンド抽象化
  - hyprcursor (>= 0.1.7): カーソル管理
  - hyprlang (>= 0.3.2): 設定言語パーサー
  - hyprutils (>= 0.8.1): ユーティリティライブラリ
  - wayland-server (>= 1.22.90): Waylandサーバー実装
  - re2: 高速正規表現ライブラリ
  - cairo, pango: 描画とテキストレンダリング

#### 開発・運用ツール
- **ビルドツール**: Meson（主要）、CMake（代替）、最適化レベル3のリリースビルド
- **テスト**: hyprtesterフレームワーク、プラグインテスト環境
- **CI/CD**: GitHub Actions、自動ビルドとテスト
- **デプロイ**: システムワイドインストール、Nixサポート

### 設計パターン・手法
- **シングルトン/グローバル管理**: `g_pCompositor`などのグローバルインスタンス
- **スマートポインタ**: `SP<>`, `WP<>`, `UP<>`による自動メモリ管理
- **シグナル/スロット**: `CSignalT<>`テンプレートによるタイプセーフなイベント通知
- **プロトコル抽象化**: `IWaylandProtocol`基底クラスによる統一インターフェース
- **戦略パターン**: `IHyprLayout`によるレイアウトアルゴリズムの切り替え
- **装飾パターン**: `IHyprWindowDecoration`によるウィンドウ装飾の拡張
- **フックシステム**: 実行時の関数フックによる動的な動作変更

### データフロー・処理フロー
1. **入力イベントフロー**:
   ```
   Aquamarine Backend (libinput) → CInputManager::processMouseMotion等
   → フォーカス計算 → CCompositor::focusWindow
   → CWLSeatProtocol::sendPointerMotion → クライアントアプリケーション
   ```

2. **レンダリングフロー**:
   ```
   CEventLoopManager::onTimerFire → CHyprRenderer::renderMonitor
   → レンダリングパス構築 → OpenGL描画コマンド
   → フレームバッファ合成 → Aquamarineへの提示
   ```

3. **設定処理フロー**:
   ```
   設定ファイル変更 → ファイル監視 → CConfigManager::reload
   → Hyprlangパーサー → 設定値更新 → 各マネージャーへの通知
   ```

## API・インターフェース
### 公開API
#### IPC (Inter-Process Communication)
- 目的: 外部からHyprlandを制御・情報取得
- 使用例:
```bash
# ウィンドウ情報の取得
hyprctl clients -j

# ディスパッチャーの実行
hyprctl dispatch exec kitty
hyprctl dispatch movetoworkspace 2

# 設定の動的変更
hyprctl keyword general:gaps_in 10
hyprctl keyword bind "SUPER,T,exec,alacritty"

# バッチ実行
hyprctl --batch "keyword general:border_size 2 ; keyword general:gaps_out 20"
```

#### プラグインAPI
- 目的: Hyprlandの機能を拡張
- 使用例:
```cpp
#include <src/plugins/PluginAPI.hpp>

// プラグイン初期化
APICALL EXPORT PLUGIN_DESCRIPTION_INFO PLUGIN_INIT(HANDLE handle) {
    PHANDLE = handle;
    
    // カスタムディスパッチャーの追加
    HyprlandAPI::addDispatcherV2(PHANDLE, "custom_action", 
        [](std::string args) -> SDispatchResult {
            // カスタム処理
            return {.success = true};
        });
    
    // イベントコールバックの登録
    HyprlandAPI::registerCallbackDynamic(PHANDLE, "openWindow",
        [](void* self, SCallbackInfo& info, std::any data) {
            auto* pWindow = std::any_cast<PHLWINDOW>(data);
            // ウィンドウ作成時の処理
        });
    
    return {"MyPlugin", "Description", "Author", "1.0"};
}

// APIバージョン（必須）
APICALL EXPORT std::string PLUGIN_API_VERSION() {
    return HYPRLAND_API_VERSION;
}
```

### 設定・カスタマイズ
#### 設定ファイル
```conf
# ~/.config/hypr/hyprland.conf
# 基本設定
general {
    sensitivity = 1.0          # マウス感度
    border_size = 2           # ボーダーサイズ
    gaps_in = 5               # ウィンドウ間のギャップ
    gaps_out = 10             # モニター端とのギャップ
    col.active_border = rgba(33ccffee) rgba(00ff99ee) 45deg
    col.inactive_border = rgba(595959aa)
    layout = dwindle          # dwindle または master
}

# 入力設定
input {
    kb_layout = us            # キーボードレイアウト
    kb_variant =
    kb_model =
    kb_options =
    kb_rules =
    follow_mouse = 1          # フォーカスがマウスに追従
    touchpad {
        natural_scroll = false
        disable_while_typing = true
    }
}

# プラグイン設定
plugin:my_plugin {
    custom_option = value
}
```

#### 拡張・プラグイン開発
1. **開発環境のセットアップ**:
   ```bash
   # ヘッダーファイルのインストール
   sudo make installheaders
   ```

2. **プラグインの構造**:
   - `PLUGIN_INIT()`: 初期化エントリーポイント
   - `PLUGIN_API_VERSION()`: APIバージョン確認
   - `PLUGIN_EXIT()`: クリーンアップ（オプション）

3. **利用可能な拡張ポイント**:
   - カスタムディスパッチャー
   - イベントフック（40種類以上）
   - レイアウトアルゴリズム
   - ウィンドウデコレーション
   - hyprctlコマンド拡張
   - 内部関数フック

4. **プラグイン管理**:
   ```bash
   # プラグインのインストール
   hyprpm add https://github.com/user/plugin
   
   # プラグインの有効化
   hyprpm enable plugin-name
   
   # プラグインの更新
   hyprpm update
   ```

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ベンチマーク結果: 一般的なハードウェアで60-144FPSを安定して維持
- 最適化手法:
  - ダメージトラッキングによる部分的な再描画
  - OpenGL ES 3.2による効率的なGPU利用
  - スマートポインタによるメモリ管理の最適化
  - アニメーションの補間計算の最適化
  - ティアリングサポートによるゲーミングパフォーマンスの向上

### スケーラビリティ
- マルチモニター対応（制限なし）
- 大量のウィンドウ処理（数百のウィンドウでも安定動作）
- 動的ワークスペース（必要に応じて自動作成・削除）
- プラグインによる機能の段階的な追加
- 設定の部分的なリロードによる中断のない運用

### 制限事項
- **技術的な制限**:
  - C++26準拠のコンパイラが必要（比較的新しいツールチェーン）
  - Waylandネイティブのため、X11専用アプリケーションはXWayland経由
  - NVIDIAプロプライエタリドライバーでは一部機能に制限
  - 一部の古いグラフィックスカードでOpenGL ES 3.2サポートが必要

- **運用上の制限**:
  - スクリーンキャプチャソフトウェアはWayland対応版が必要
  - 一部のグローバルホットキーアプリケーションは動作しない可能性
  - ゲームのフルスクリーン動作は個別に調整が必要な場合がある
  - リモートデスクトップはWayland対応のソリューションが必要

## 評価・所感
### 技術的評価
#### 強み
- **100%独立実装**: wlrootsなどに依存しない完全独自実装により、高い自由度と革新的な機能実装が可能
- **優れたビジュアル**: グラデーション、ぼかし、アニメーションなど、他のタイリングWMでは見られない美しいエフェクト
- **強力なプラグインシステム**: 最も包括的なAPIを提供し、コア機能の深い部分まで拡張可能
- **活発な開発**: 高速な開発サイクルで新機能が継続的に追加
- **優れた設定システム**: ライブリロード、分かりやすい設定構文
- **包括的なドキュメント**: 充実したWikiとコミュニティサポート

#### 改善の余地
- **C++26要件**: 最新のコンパイラが必要で、一部の安定志向のディストリビューションでは課題
- **独立実装ゆえの互換性**: 一部のWaylandアプリケーションで想定外の動作をする可能性
- **メモリ使用量**: 豊富な機能とエフェクトにより、軽量WMと比較してメモリ使用量が多い
- **学習曲線**: 豊富な機能ゆえに、初心者には設定が複雑に感じられる可能性

### 向いている用途
- **デスクトップカスタマイズ愛好家**: 見た目と機能性の両方を追求するユーザー
- **開発者・パワーユーザー**: 高度なワークフロー自動化とカスタマイズを求める用途
- **ゲーミング**: ティアリングサポートとパフォーマンス最適化により快適なゲーム体験
- **マルチモニター環境**: 柔軟なモニター管理と個別設定
- **コンテンツクリエイター**: 美しいデスクトップ環境での作業や配信

### 向いていない用途
- **サーバー環境**: デスクトップ向けに特化しており、ヘッドレス運用は想定外
- **古いハードウェア**: OpenGL ES 3.2とある程度のGPU性能が必要
- **極限の安定性重視**: 活発な開発により、頻繁なアップデートで動作が変わる可能性
- **ミニマリスト**: シンプルで軽量なWMを求める場合は機能過多

### 総評
Hyprlandは、タイリングウィンドウマネージャーの実用性と、モダンなデスクトップ環境の美しさを見事に融合させた、革新的なWaylandコンポジターです。100%独立実装による自由度の高さ、強力なプラグインシステム、美しいビジュアルエフェクトなど、他のWMでは実現できない独自の価値を提供しています。

特に、「タイリングWMは地味で実用一辺倒」という従来の常識を覆し、機能性と審美性の両立を実現している点は高く評価できます。活発な開発コミュニティと充実したドキュメントにより、今後もさらなる発展が期待できるプロジェクトです。

一方で、最新技術への依存や独自実装ゆえの互換性の課題もあり、安定性を最重視する環境や保守的なシステムには向かない面もあります。しかし、これらの制限を理解した上で使用すれば、最高のデスクトップ体験を提供してくれる優れたソフトウェアと言えるでしょう。