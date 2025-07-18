# リポジトリ解析: maotoumao/MusicFree

## 基本情報
- リポジトリ名: maotoumao/MusicFree
- 主要言語: TypeScript
- スター数: 18,557
- フォーク数: 1,177
- 最終更新: アクティブに開発中（v0.5.1、2025-04-04）
- ライセンス: GNU Affero General Public License v3.0
- トピックス: 音楽プレイヤー、プラグインシステム、React Native、広告なし、カスタマイズ

## 概要
### 一言で言うと
MusicFreeは、プラグイン化、カスタマイズ可能、広告なしの無料音楽プレイヤーで、アプリ自体は音楽ソースを含まず、すべての機能がプラグインで提供される革新的なアーキテクチャを採用しています。

### 詳細説明
MusicFreeは「猫頭猫」開発者によるReact Nativeベースの音楽プレイヤーアプリで、「完全に無料、広告なし、非商用」をポリシーとしています。最大の特徴は、アプリ本体は単なるプレイヤーの殻であり、すべての音楽ソース関連機能（検索、再生、歌詞など）がプラグインとして実装されている点です。これにより、ユーザーは完全に音楽ソースをコントロールし、必要なプラグインのみをインストールして使用できます。

### 主な特徴
- 完全なプラグインアーキテクチャ（アプリはプレイヤーのみ）
- JavaScript CommonJSモジュールでカスタムプラグイン作成可能
- 最大10,000曲までのプレイリストサポート
- デスクトップ/フローティング歌詞表示
- ローカル音楽ファイルの再生とメタデータ管理
- 音楽ダウンロード機能（品質選択可能）
- WebDAVを含むバックアップ・リストア機能
- ライト/ダークテーマ、背景画像などのカスタマイズ
- 再生速度調整（0.5x～2.0x）
- スリープタイマー機能
- 自動ソース切り替え機能

## 使用方法
### インストール
#### 前提条件
- Android 7.0以上またはHarmonyOS
- iOSは現在未サポート（公式配布なし）
- ストレージ容量: アプリ本体約50MB + 音楽ファイル

#### インストール手順
```bash
# 方法1: GitHub ReleasesからAPKダウンロード
# https://github.com/maotoumao/MusicFree/releasesから最新のAPKをダウンロード
# Androidデバイスにインストール

# 方法2: ソースからビルド（開発者向け）
git clone https://github.com/maotoumao/MusicFree.git
cd MusicFree
npm install
# Android開発環境が必要
npm run android # 開発版を実行
npm run build-android # リリースAPKをビルド
```

### 基本的な使い方
#### 初回起動時の設定
1. アプリを起動
2. 「プラグインページ」へ移動
3. プラグインURLを入力またはインポート
4. 音楽を検索して再生

#### 実践的な使用例
```javascript
// プラグインの基本構造例
module.exports = {
    platform: "プラットフォーム名",
    version: "0.0.1",
    author: "作者名",
    
    // 音楽検索機能
    async search(query, page, type) {
        if (type === 'music') {
            // 音楽検索ロジック
            return {
                isEnd: true,
                data: [
                    {
                        id: "unique_id",
                        title: "曲名",
                        artist: "アーティスト",
                        duration: 300, // 秒数
                        album: "アルバム名"
                    }
                ]
            };
        }
    },
    
    // 音楽ソースURL取得
    async getMediaSource(musicItem) {
        return {
            url: "https://example.com/music.mp3"
        };
    }
};
```

### 高度な使い方
```javascript
// 歌詞機能を含むプラグイン例
module.exports = {
    // ... 基本設定
    
    // 歌詞取得機能
    async getLyric(musicItem) {
        return {
            rawLrc: "[00:00.00]歌詞の内容\n[00:05.00]次の行..."
        };
    },
    
    // アルバム情報取得
    async getAlbumInfo(albumItem) {
        return {
            musicList: [
                // アルバム内の曲リスト
            ]
        };
    },
    
    // プレイリストインポート
    async importMusicSheet(urlLike) {
        return {
            title: "プレイリスト名",
            musicList: [
                // インポートした曲リスト
            ]
        };
    }
};
```

## ドキュメント・リソース
### 公式ドキュメント
- **readme.md**: プロジェクト概要、インストール方法、免責事項
- **changelog.md**: 各バージョンの変更履歴
- **release/version.json**: 現在のバージョン情報
- **公式ドキュメントサイト**: https://musicfree.upup.fun
- **プラグイン開発ドキュメント**: https://musicfree.upup.fun/docs/plugin/introduction

### サンプル・デモ
- **WeChat公開アカウント**: 「猫頭猫猛男酆」（デモ動画あり）
- **プラグインリポジトリ**: コミュニティ作成のプラグイン例

### チュートリアル・ガイド
- プラグイン開発ガイド
- FAQセクション
- QQグループでのサポート
- デスクトップ版: https://github.com/maotoumao/MusicFreeDesktop

## 技術的詳細
### アーキテクチャ
#### 全体構造
MusicFreeはReact Nativeベースのモバイルアプリケーションで、プラグインアーキテクチャを採用しています。アプリ本体はプレイヤーインターフェースとプラグイン実行環境のみを提供し、すべての音楽関連機能はプラグインが担当します。

#### ディレクトリ構成
```
MusicFree/
├── src/              # メインソースコード
│   ├── core/         # コア機能
│   │   ├── pluginManager.ts    # プラグイン管理
│   │   ├── trackPlayer/        # 音楽再生エンジン
│   │   ├── musicSheet/         # プレイリスト管理
│   │   ├── download.ts         # ダウンロード機能
│   │   └── localMusicSheet.ts  # ローカル音楽管理
│   ├── components/   # UIコンポーネント
│   │   ├── base/              # 基本コンポーネント
│   │   ├── dialogs/           # ダイアログ
│   │   ├── panels/            # パネル
│   │   └── musicBar/          # 音楽バー
│   ├── pages/        # アプリ画面
│   │   ├── home/              # ホーム画面
│   │   ├── musicDetail/       # 音楽詳細画面
│   │   ├── searchPage/        # 検索画面
│   │   └── setting/           # 設定画面
│   ├── native/       # ネイティブモジュール
│   │   ├── lyricUtil/         # 歌詞表示
│   │   ├── mp3Util/           # MP3メタデータ
│   │   └── utils/             # システムユーティリティ
│   └── utils/        # ユーティリティ関数
├── android/           # Androidプロジェクト
└── ios/               # iOSプロジェクト（未完成）
```

#### 主要コンポーネント
- **プラグインマネージャー**: プラグインのロード、実行、管理
  - 場所: `src/core/pluginManager.ts`
  - 依存: pluginMeta, network
  - インターフェース: `installPlugin()`, `uninstallPlugin()`, `callPluginMethod()`

- **トラックプレイヤー**: 音楽再生エンジン
  - 場所: `src/core/trackPlayer/`
  - 依存: react-native-track-player
  - インターフェース: `play()`, `pause()`, `setQueue()`, `seekTo()`

- **音楽シート管理**: プレイリストの管理
  - 場所: `src/core/musicSheet/`
  - 依存: storage, sortedMusicList
  - インターフェース: `addMusic()`, `removeMusic()`, `exportMusicSheet()`

### 技術スタック
#### コア技術
- **言語**: TypeScript、JavaScript
- **フレームワーク**: 
  - React Native 0.76.5
  - React 18.3.1
- **主要ライブラリ**: 
  - react-native-track-player (2.6.1): 音楽再生エンジン
  - jotai (1.11.2): 状態管理
  - react-native-mmkv (2.11.0): 高速ストレージ
  - react-native-fs (2.20.0): ファイルシステム操作
  - axios (1.5.0), cheerio (0.22.0): プラグイン用HTTP/HTML解析
  - react-native-webview (13.12.3): Webコンテンツ表示
  - react-native-svg (15.8.0): SVGアイコン
  - react-native-gesture-handler (2.21.1): ジェスチャー制御
  - react-native-reanimated (3.16.1): アニメーション
  - expo-file-system (17.0.1): ファイル操作

#### 開発・運用ツール
- **ビルドツール**: 
  - Metro: React Nativeバンドラー
  - Gradle: Androidビルド
  - Android Studio: Android開発
- **テスト**: 
  - Jest: テストフレームワーク
- **CI/CD**: 
  - GitHub Releases: リリース配布
- **デプロイ**: 
  - APK直接配布
  - フェイシュクラウドドキュメント

### 設計パターン・手法
- **プラグインアーキテクチャ**: コア機能と拡張機能の分離
- **コンポーネントベース設計**: Reactコンポーネントの再利用
- **状態管理**: Jotaiによるアトミックな状態管理
- **非同期処理**: Promiseとasync/awaitの活用
- **モジュラー設計**: 機能ごとに分離されたモジュール

### データフロー・処理フロー
1. **音楽検索フロー**:
   - ユーザーが検索クエリ入力
   - プラグインマネージャーが各プラグインのsearchメソッド呼び出し
   - 結果を統合してUIに表示

2. **音楽再生フロー**:
   - 音楽選択時にプラグインのgetMediaSource呼び出し
   - 取得したURLをTrackPlayerに設定
   - 再生コントロールと状態管理

3. **プラグイン管理**:
   - URLまたはファイルからプラグインコード取得
   - 動的ロードとサンドボックス実行
   - メタデータと設定の保存

## API・インターフェース
### 公開API
#### プラグインAPI
- 目的: 音楽ソースの検索、再生、管理機能の提供
- 主要メソッド:
  - `search(query, page, type)`: 検索機能
  - `getMediaSource(musicItem)`: 再生URL取得
  - `getLyric(musicItem)`: 歌詞取得
  - `getAlbumInfo(albumItem)`: アルバム情報
  - `getArtistWorks(artistItem, page, type)`: アーティスト作品
  - `importMusicSheet(urlLike)`: プレイリストインポート
  - `getComments(musicItem, page)`: コメント取得

### 設定・カスタマイズ
#### アプリ設定
- **テーマ設定**: ライト/ダーク/システム追従
- **背景設定**: カスタム画像、透明度、ブラー
- **再生設定**: 
  - 再生モード（リピート、シャッフル、単曲リピート）
  - 音質選択
  - 速度調整（0.5x-2.0x）
  - スリープタイマー
- **歌詞設定**: フォントサイズ、デスクトップ/フローティング表示
- **バックアップ設定**: JSON/WebDAVエクスポート

#### 拡張・プラグイン開発
**プラグイン利用可能API**:
- axios: HTTPリクエスト
- cheerio: HTMLパーシング
- crypto-js: 暗号化
- dayjs: 日付操作
- qs: クエリストリング操作
- he: HTMLエンティティデコード
- big-integer: 大整数演算
- webdav: WebDAVクライアント

**プラグイン配布方法**:
- URL直接指定
- ファイルインポート
- プラグインリポジトリ

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ベンチマーク結果: 
  - プレイリスト上限: 10,000曲（以前の1,500曲から大幅向上）
  - メモリ使用量: 通常100-200MB
  - 起動時間: 2-3秒（プラグイン数に依存）
- 最適化手法: 
  - react-native-mmkvによる高速ストレージ
  - 音楽リストの遅延ロード
  - React NativeのHermesエンジン使用

### スケーラビリティ
- **プラグインシステム**: 無制限のプラグイン追加可能
- **ローカルストレージ**: デバイス容量に依存
- **並行処理**: 複数プラグインの同時検索対応
- **バックアップ**: WebDAVでのクラウド同期

### 制限事項
- **技術的な制限**:
  - iOS未サポート（公式配布なし）
  - プラグインのJavaScript実行環境制限
  - ネットワークリクエストはCORS制約あり
- **運用上の制限**:
  - プラグインの品質は開発者に依存
  - 音楽ソースの安定性は保証されない
  - 公式アプリストア配布なし

## 評価・所感
### 技術的評価
#### 強み
- **革新的なプラグインアーキテクチャ**: アプリとコンテンツの完全分離
- **高いカスタマイズ性**: ユーザーが必要な機能のみ選択可能
- **完全無料・広告なし**: オープンソースで透明性高い
- **豊富な機能**: デスクトップ歌詞、ダウンロード、バックアップなど
- **React Nativeの優れた活用**: クロスプラットフォーム対応の基盤
- **アクティブな開発**: 頒繁な更新とバグ修正

#### 改善の余地
- **iOSサポート**: 現在Androidのみ対応
- **プラグインエコシステム**: 公式プラグインストアの欠如
- **ドキュメント**: プラグイン開発ドキュメントの充実
- **国際化**: 現在中国語のみ

### 向いている用途
- **プライバシー重視の音楽リスニング**: ローカルで完結
- **多様な音楽ソースを統合管理**: 一つのアプリですべて
- **カスタマイズ好きなユーザー**: 自由度の高い設定
- **オフライン音楽管理**: ローカルファイルの統合管理
- **オープンソース愛好者**: ソースコード公開で透明性高い

### 向いていない用途
- **初心者ユーザー**: プラグイン設定が必要
- **公式サービス利用**: Spotifyなどの公式アプリ代替ではない
- **商用利用**: AGPLライセンスで商用利用禁止
- **iOSユーザー**: 現在サポートなし

### 総評
MusicFreeは、プラグインアーキテクチャという革新的なアプローチで、音楽プレイヤーの新しい形を提示しています。アプリ本体は単なるプレイヤーの殻とし、すべての機能をプラグインで実現することで、法的リスクを回避しつつ、ユーザーに最大限の自由度を提供しています。「完全無料、広告なし、非商用」というポリシーも評価できます。技術的にはReact Nativeを巧みに活用し、優れたユーザー体験を提供しています。プラグインの設定が初心者にはハードルとなる可能性がありますが、その柔軟性と拡張性は他の音楽プレイヤーでは得られない大きな強みです。