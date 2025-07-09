# リポジトリ解析: th-ch/youtube-music

## 基本情報
- リポジトリ名: th-ch/youtube-music
- 主要言語: TypeScript
- スター数: 10,329
- フォーク数: 不明（README内未記載）
- 最終更新: 2025年7月ごろ（version 3.9.0）
- ライセンス: MIT License
- トピックス: YouTube Music, Electron, Desktop App, Custom Plugins, Ad Blocker, Downloader, Cross-platform

## 概要
### 一言で言うと
YouTube MusicのWebアプリケーションをElectronでラップし、豊富なプラグインシステムでカスタマイズ可能にしたデスクトップアプリケーション。

### 詳細説明
YouTube Musicは、公式のYouTube Music Webアプリケーションにネイティブアプリケーションの利便性を追加したElectronベースのデスクトップクライアントです。オリジナルのインターフェースを維持しつつ、広告ブロック、音楽ダウンロード、Discord Rich Presence、歌詞表示など、多様なプラグインによる機能拡張が可能です。

このプロジェクトは、YouTube Musicのユーザー体験を向上させるために開発されており、特に「Continue Watching?」ポップアップの自動無効化、MP3ダウンロード機能、Last.fm/ListenBrainzへのスクロブリング、動的なアルバムカラーテーマなど、公式アプリでは提供されていない機能を提供します。

### 主な特徴
- オリジナルのYouTube Musicインターフェースを維持したネイティブアプリケーション
- 60以上のプラグインによる豊富なカスタマイズオプション
- 広告ブロッカー（3つの異なる実装方法）
- MP3ダウンロード機能（youtube-dl統合）
- Discord Rich Presenceサポート
- Last.fm/ListenBrainzスクロブリング
- 同期歌詞表示（LRClib等のプロバイダー対応）
- アルバムカラーテーマとアンビエントモード
- クロスフェード再生
- Windows、macOS、Linux対応（ARM版含む）
- 多言語対応（50以上の言語）
- Taskbar Media Control（Windows）
- TouchBar対応（macOS）
- MPRISサポート（Linux）

## 使用方法
### インストール
#### 前提条件
- Node.js 18以上
- pnpm 10以上
- プラットフォーム別の要件:
  - Windows: Visual Studio Build Tools
  - macOS: Xcode Command Line Tools
  - Linux: 各種依存パッケージ（libgtk-3-0、libnss3等）

#### インストール手順
```bash
# 方法1: パッケージマネージャー経由

# macOS (Homebrew)
brew install th-ch/youtube-music/youtube-music

# Windows (Scoop)
scoop bucket add extras
scoop install extras/youtube-music

# Windows (Winget)
winget install th-ch.YouTubeMusic

# Arch Linux (AUR)
yay -S youtube-music-bin

# 方法2: ソースからビルド
git clone https://github.com/th-ch/youtube-music
cd youtube-music
pnpm install --frozen-lockfile
pnpm build
pnpm dist:OS  # OS = win, mac, linux
```

### 基本的な使い方
#### Hello World相当の例
```bash
# アプリケーションの起動
pnpm start

# 開発モードでの起動
pnpm dev
```

#### 実践的な使用例
```typescript
// カスタムプラグインの作成例（src/plugins/my-plugin/index.ts）
import { createPlugin } from '@/utils';

export default createPlugin({
  name: () => 'My Custom Plugin',
  description: () => 'A simple custom plugin example',
  restartNeeded: false,
  config: {
    enabled: false,
    myOption: 'default value'
  },
  renderer: {
    async start(context) {
      console.log('Plugin started in renderer process');
      // DOM操作やYouTube Music APIへのアクセス
      const playerBar = document.querySelector('ytmusic-player-bar');
      if (playerBar) {
        // カスタム機能の実装
      }
    },
    onPlayerApiReady(api, context) {
      // YouTube Player APIが利用可能になった時の処理
      console.log('Current volume:', api.getVolume());
    }
  }
});
```

### 高度な使い方
```typescript
// 複雑なプラグイン例：バックエンド、プリロード、レンダラー間の通信
import { createPlugin } from '@/utils';
import { ipcMain, ipcRenderer } from 'electron';

export default createPlugin({
  name: () => 'Advanced Plugin',
  restartNeeded: true,
  config: { enabled: false },
  
  backend: {
    start({ window, ipc }) {
      // メインプロセスでの処理
      ipc.handle('my-plugin-request', async (event, data) => {
        // バックエンド処理
        const result = await processData(data);
        return result;
      });
      
      // ウィンドウイベントの監視
      window.on('minimize', () => {
        console.log('Window minimized');
      });
    }
  },
  
  preload: {
    // セキュアなブリッジの作成
    start({ getConfig }) {
      contextBridge.exposeInMainWorld('myPlugin', {
        sendRequest: (data) => ipcRenderer.invoke('my-plugin-request', data)
      });
    }
  },
  
  renderer: {
    async start(context) {
      // レンダラーからバックエンドへの通信
      const result = await context.ipc.invoke('my-plugin-request', {
        action: 'process',
        data: 'example'
      });
      
      // CSSの注入
      const style = document.createElement('style');
      style.textContent = `
        ytmusic-player-bar {
          background: linear-gradient(to right, #ff0000, #00ff00);
        }
      `;
      document.head.appendChild(style);
    }
  }
});
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクトの概要、インストール方法、プラグインリスト
- **docs/readme/README-[言語].md**: 各言語の翻訳版README（日本語、韓国語、フランス語等）
- **GitHub Issues**: バグレポート、機能リクエスト、ディスカッション
- **GitHub Wiki**: なし（READMEに情報集約）

### サンプル・デモ
- **src/plugins/*/**: 60以上の実装済みプラグインのソースコード
- **web/screenshot.png**: アプリケーションのスクリーンショット
- **各プラグインディレクトリ**: 実装例とテンプレート
  - adblocker: 広告ブロッカーの実装
  - downloader: ダウンロード機能の実装
  - discord: Discord Rich Presenceの実装
  - synced-lyrics: 同期歌詞表示の実装

### チュートリアル・ガイド
- プラグイン作成ガイド（README内「Build your own plugins」セクション）
- 開発環境セットアップ（README内「Dev」セクション）
- ビルド手順（README内「Build」セクション）
- テーマ作成（https://github.com/kerichdev/themes-for-ytmdesktop-player）

## 技術的詳細
### アーキテクチャ
#### 全体構造
YouTube MusicはElectronベースのアーキテクチャを採用し、メインプロセス（backend）、プリロードスクリプト（preload）、レンダラープロセス（renderer）の3層構造で動作します。プラグインシステムはこの3層すべてで動作可能で、各層間はIPCを通じて安全に通信します。

#### ディレクトリ構成
```
youtube-music/
├── src/
│   ├── index.ts          # メインエントリーポイント
│   ├── preload.ts        # プリロードスクリプト
│   ├── renderer.ts       # レンダラーエントリー
│   ├── config/           # 設定管理
│   │   ├── defaults.ts   # デフォルト設定
│   │   ├── plugins.ts    # プラグイン設定管理
│   │   └── store.ts      # Electron Store設定
│   ├── i18n/             # 国際化
│   │   └── resources/    # 50以上の言語ファイル
│   ├── plugins/          # プラグインディレクトリ
│   │   ├── adblocker/    # 広告ブロッカー
│   │   ├── downloader/   # ダウンローダー
│   │   ├── discord/      # Discord統合
│   │   └── [60+ plugins] # その他のプラグイン
│   ├── providers/        # コアプロバイダー
│   │   ├── song-info.ts  # 曲情報管理
│   │   └── app-controls.ts # アプリ制御
│   └── utils/            # ユーティリティ関数
├── assets/               # アイコン、画像リソース
├── tests/                # Playwrightテスト
└── package.json          # プロジェクト設定
```

#### 主要コンポーネント
- **プラグインシステム**: 動的にロード可能な拡張機能システム
  - 場所: `src/utils/index.ts`
  - 依存: virtual:plugins（Viteによる動的インポート）
  - インターフェース: `createPlugin()`, `startPlugin()`, `stopPlugin()`

- **設定管理システム**: electron-storeベースの永続化設定
  - 場所: `src/config/store.ts`
  - 依存: electron-store, conf
  - インターフェース: `get()`, `set()`, `watch()`

- **国際化システム**: i18nextベースの多言語対応
  - 場所: `src/i18n/index.ts`
  - 依存: i18next
  - インターフェース: `t()`, `changeLanguage()`

- **IPCハンドラー**: プロセス間通信管理
  - 場所: `src/providers/`
  - 依存: electron IPC
  - インターフェース: カスタムイベントハンドラー

### 技術スタック
#### コア技術
- **言語**: TypeScript 5.8.3
  - strict mode有効
  - ES2022ターゲット
  - デコレータサポート
- **フレームワーク**: 
  - Electron 37.1.0: デスクトップアプリケーション基盤
  - Solid.js 1.9.7: UIコンポーネント（一部プラグイン）
  - Vite/Rolldown: ビルドツール
- **主要ライブラリ**: 
  - electron-builder (26.0.12): アプリケーションパッケージング
  - @ghostery/adblocker-electron (2.9.2): 広告ブロック機能
  - @ffmpeg.wasm (0.12.0): 音声処理
  - i18next (25.3.0): 国際化
  - electron-store (10.1.0): 設定管理
  - discord-rpc (1.2.2): Discord統合
  - youtubei.js (14.0.0): YouTube API統合

#### 開発・運用ツール
- **ビルドツール**: 
  - electron-vite: Electronに最適化されたVite設定
  - Rolldown（Viteのフォーク）: 高速ビルド
  - pnpm: パッケージマネージャー
- **テスト**: 
  - Playwright: E2Eテスト
  - `pnpm test`でテスト実行
- **CI/CD**: 
  - GitHub Actions: 自動ビルドとリリース
  - 複数プラットフォーム並列ビルド
- **デプロイ**: 
  - GitHub Releases: バイナリ配布
  - 各種パッケージマネージャー（Homebrew、AUR、Scoop等）

### 設計パターン・手法
- **プラグインアーキテクチャ**: 各プラグインは独立したモジュールとして実装
  - backend/preload/rendererの3層で動作可能
  - ライフサイクルメソッド（start、stop、onConfigChange）
  - 設定の永続化と動的変更

- **イベント駆動設計**: Electronのイベントシステムを活用
  - IPC通信によるプロセス間メッセージング
  - YouTube Player APIイベントの監視と処理

- **依存性注入**: プラグインコンテキストによる依存性提供
  - window、ipc、getConfig等のAPIを注入

- **デコレータパターン**: YouTube Musicの機能を拡張
  - 既存のDOM要素に機能を追加
  - CSSインジェクションによるスタイル拡張

### データフロー・処理フロー
1. **アプリケーション起動**:
   - Electronメインプロセスが起動
   - 設定の読み込み（electron-store）
   - BrowserWindow作成とYouTube Music読み込み

2. **プラグインロード**:
   - 有効なプラグインの検出
   - backend → preload → rendererの順で初期化
   - 各プラグインのstart()メソッド実行

3. **ランタイム処理**:
   - YouTube Player APIイベントの監視
   - ユーザー操作に応じたプラグイン処理
   - IPC経由でのプロセス間通信

4. **設定変更**:
   - 設定UIからの変更検出
   - onConfigChange()コールバック実行
   - 必要に応じてアプリケーション再起動

## API・インターフェース
### 公開API
#### プラグインAPI
- 目的: カスタムプラグインの作成と管理
- 使用例:
```typescript
// プラグイン作成API
import { createPlugin } from '@/utils';

export default createPlugin({
  name: () => 'Plugin Name',
  description: () => 'Plugin description',
  restartNeeded: false,
  config: {
    enabled: false,
    customOption: 'default'
  },
  backend: { /* backend lifecycle */ },
  preload: { /* preload lifecycle */ },
  renderer: { /* renderer lifecycle */ }
});
```

#### YouTube Player API
- 目的: YouTube Musicプレイヤーの制御
- 使用例:
```typescript
// プレイヤー制御API
renderer: {
  onPlayerApiReady(api: YoutubePlayer, context) {
    // 再生制御
    api.playVideo();
    api.pauseVideo();
    api.nextVideo();
    api.previousVideo();
    
    // 音量制御
    api.setVolume(50);
    const volume = api.getVolume();
    
    // 再生情報取得
    const duration = api.getDuration();
    const currentTime = api.getCurrentTime();
  }
}
```

### 設定・カスタマイズ
#### 設定ファイル
```json
// config.json（electron-storeによる永続化）
{
  "options": {
    "tray": true,
    "appVisible": true,
    "autoUpdates": true,
    "hideMenu": false,
    "startAtLogin": false,
    "disableHardwareAcceleration": false
  },
  "plugins": {
    "adblocker": {
      "enabled": true,
      "cache": true,
      "blocker": "InPlayer"
    },
    "downloader": {
      "enabled": true,
      "downloadFolder": "~/Music",
      "selectedPreset": "mp3 (256kbps)"
    }
  }
}
```

#### 拡張・プラグイン開発
1. **プラグイン構造**:
   ```
   src/plugins/my-plugin/
   ├── index.ts      # メインファイル
   ├── style.css     # スタイルシート
   └── templates/    # HTMLテンプレート
   ```

2. **ライフサイクルメソッド**:
   - `start(context)`: プラグイン開始時
   - `stop(context)`: プラグイン停止時
   - `onConfigChange(newConfig)`: 設定変更時
   - `onPlayerApiReady(api, context)`: Player API準備完了時

3. **コンテキストAPI**:
   - `getConfig()`: 現在の設定取得
   - `setConfig()`: 設定の更新
   - `ipc`: IPC通信
   - `window`: BrowserWindowインスタンス（backendのみ）

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- メモリ使用量: 標準的なElectronアプリケーション（200-400MB）
- 起動時間: プラグイン数に依存（通常2-5秒）
- 最適化手法:
  - Vite/Rolldownによる高速ビルド
  - 遅延ロードによるプラグインの最適化
  - WebRequestのキャッシング（広告ブロッカー）
  - CPU Tamerプラグインによるリソース節約

### スケーラビリティ
- プラグインシステムによる機能の水平拡張
- 各プラグインは独立して動作（相互干渉最小）
- 設定の永続化によるユーザー環境の保持
- 多言語対応による国際的な利用

### 制限事項
- Electronベースのためネイティブアプリより大きいメモリ使用量
- YouTube Musicの仕様変更による影響を受ける可能性
- 一部プラグインは相互に競合する可能性
- DRM保護されたコンテンツのダウンロードは不可
- プラグインによってはアプリ再起動が必要

## 評価・所感
### 技術的評価
#### 強み
- 非常に充実したプラグインエコシステム（60以上の公式プラグイン）
- 3層アーキテクチャによる柔軟な拡張性
- 活発な開発とコミュニティ（10,000以上のスター）
- クロスプラットフォーム対応（ARM版も含む）
- 優れた国際化対応（50以上の言語）
- モダンな技術スタック（TypeScript、Vite、Solid.js）

#### 改善の余地
- Electronベースによるリソース消費
- YouTube側の仕様変更への依存性
- プラグイン間の依存関係管理が複雑
- ドキュメントが主にREADMEに集約されている

### 向いている用途
- デスクトップでYouTube Musicを頻繁に利用するユーザー
- 広告なしで音楽を楽しみたいユーザー
- 音楽コレクションをローカルに保存したいユーザー
- Discord等の外部サービスと連携したいユーザー
- カスタマイズ性を重視するパワーユーザー

### 向いていない用途
- モバイルデバイスでの利用
- リソース制約の厳しい環境
- 企業環境での公式サポートが必要な場合
- YouTube Premium機能の完全な代替を求める場合

### 総評
YouTube Musicデスクトップアプリは、Electronベースのアプリケーションとして非常に成熟したプロジェクトです。特筆すべきは、60以上の公式プラグインによる圧倒的なカスタマイズ性と、それを支える優れたプラグインアーキテクチャです。

技術的には、TypeScriptによる型安全性、3層アーキテクチャによる関心の分離、モダンなビルドツールの採用など、現代的なベストプラクティスに従っています。プラグイン開発のためのAPIも well-designed で、開発者にとって拡張しやすい設計になっています。

一方で、Electronアプリケーション共通の課題であるリソース消費や、YouTube側の仕様変更への依存性といった制約もあります。しかし、活発なコミュニティと継続的な開発により、これらの課題に対しても迅速に対応されています。

総じて、YouTube Musicのデスクトップ体験を大幅に向上させる優れたオープンソースプロジェクトと評価できます。