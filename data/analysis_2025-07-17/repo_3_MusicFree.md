# リポジトリ解析: maotoumao/MusicFree

## 基本情報
- リポジトリ名: maotoumao/MusicFree
- 主要言語: TypeScript
- スター数: 18,319
- フォーク数: 1,158
- 最終更新: 2025年4月4日 (v0.5.1)
- ライセンス: GNU Affero General Public License v3.0
- トピックス: 音楽プレーヤー、プラグインシステム、広告なし、プライバシー重視、React Native、モバイルアプリ

## 概要
### 一言で言うと
プラグインによって様々な音楽ソースに対応できる、広告なし・完全無料のAndroid/HarmonyOS向け音楽プレーヤーです。

### 詳細説明
MusicFreeは、プラグインシステムを採用した革新的な音楽プレーヤーアプリケーションです。本体は純粋な音楽プレーヤーとして機能し、音楽の検索、再生、プレイリスト管理などの機能はすべてプラグインによって提供されます。これにより、インターネット上の様々な音楽ソースに柔軟に対応できるようになっています。

プロジェクトは、既存の音楽アプリの広告や制限に不満を持つ開発者が、自分自身のために開発したものです。完全にオープンソースで、AGPL 3.0ライセンスの下で公開されており、すべてのデータはローカルに保存されるため、プライバシーが完全に保護されます。

### 主な特徴
- プラグイン化：音楽ソースをプラグインとして追加可能
- 完全無料・広告なし：AGPL 3.0ライセンスで永続的に無料
- プライバシー保護：すべてのデータはローカル保存、外部送信なし
- 豊富な機能：音楽・アルバム・アーティスト検索、プレイリスト管理、歌詞表示など
- カスタマイズ可能：テーマ設定、背景画像のカスタマイズ
- 歌詞関連付け：異なる楽曲の歌詞を関連付けて表示可能
- デスクトップ歌詞：フローティングウィンドウで歌詞表示（要権限）
- バックアップ機能：Webdav対応でデータのバックアップ・復元が可能
- 自動更新：プラグインの自動更新機能
- ローカル音楽再生：MP3などのローカルファイル再生対応

## 使用方法
### インストール
#### 前提条件
- Android 7.0以上（v0.5.0以降）
- HarmonyOSにも対応
- 開発環境（ソースからビルドする場合）:
  - Node.js 18以上
  - React Native開発環境
  - Android Studio
  - JDK

#### インストール手順
```bash
# 方法1: APKファイルをダウンロード
# GitHubのReleasesページから最新版をダウンロード
# https://github.com/maotoumao/MusicFree/releases

# 方法2: ソースからビルド
git clone https://github.com/maotoumao/MusicFree.git
cd MusicFree
npm install

# Androidビルド
cd android
./gradlew assembleRelease
# APKは android/app/build/outputs/apk/release/ に生成される
```

### 基本的な使い方
#### アプリの初期設定
1. APKをインストール後、アプリを起動
2. サイドメニューから「設定」→「プラグイン設定」を開く
3. 「ネットワークからインストール」をタップ
4. プラグインのURLを入力（例：https://raw.gitcode.com/maotoumao/MusicFreePlugins/raw/master/plugins.json）
5. インストールされたプラグインから必要なものを有効化

#### 基本的な音楽再生
1. ホーム画面の検索アイコンをタップ
2. 曲名やアーティスト名を入力して検索
3. 検索結果から曲を選択して再生
4. プレイリストに追加する場合は、曲の右側のメニューから「歌単に追加」を選択

### 高度な使い方
#### プラグイン開発の基本構造
```javascript
// plugin.js - 最小限のプラグイン例
module.exports = {
  platform: "My Music Source",
  version: "0.0.1",
  
  // 音楽検索機能
  async search(query, page, type) {
    if (type === 'music') {
      // 検索ロジックの実装
      return {
        isEnd: false,
        data: [
          {
            id: "unique-id",
            title: "曲名",
            artist: "アーティスト名",
            album: "アルバム名",
            duration: 240 // 秒
          }
        ]
      };
    }
  },
  
  // 音楽のソースURL取得
  async getMediaSource(musicItem) {
    return {
      url: "https://example.com/music.mp3"
    };
  }
};
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクトの概要、特徴、インストール方法、使用上の注意
- **changelog.md**: バージョンごとの詳細な変更履歴
- **公式サイト**: https://musicfree.catcat.work - プラグイン開発ドキュメント、使用ガイド
- **WeChat公式アカウント**: 「一只猫头猫」- 最新情報、詳細ガイド

### サンプル・デモ
- **MusicFreePlugins**: https://github.com/maotoumao/MusicFreePlugins - 公式プラグインサンプル集
- **プラグインテンプレート**: 公式サイトで提供される開発テンプレート
- **スクリーンショット**: READMEに主要画面のスクリーンショットあり

### チュートリアル・ガイド
- プラグイン使用ガイド: WeChat公式記事およびhttps://musicfree.catcat.work/usage/mobile/install-plugin.html
- プラグイン開発ドキュメント: https://musicfree.catcat.work/plugin/introduction.html
- Q&A: https://musicfree.catcat.work/qa/common.html
- 技術交流QQグループ: 683467814
- QQチャンネル: https://pd.qq.com/s/cyxnf0jj1

## 技術的詳細
### アーキテクチャ
#### 全体構造
MusicFreeは、React Nativeベースのモバイルアプリケーションで、プラグインアーキテクチャを中心に設計されています。コアアプリケーションは音楽プレーヤーの基本機能（再生、プレイリスト管理、UI）を提供し、音楽ソースへのアクセスはすべてプラグインを通じて行われます。状態管理にはJotai、音楽再生にはreact-native-track-playerを使用しています。

#### ディレクトリ構成
```
MusicFree/
├── src/                    # ソースコード
│   ├── core/              # コア機能（プラグイン管理、設定、プレーヤー制御）
│   │   ├── pluginManager.ts    # プラグインの読み込み・実行管理
│   │   ├── trackPlayer/        # 音楽再生制御
│   │   ├── musicSheet/         # プレイリスト管理
│   │   └── config.ts           # アプリ設定管理
│   ├── components/        # 再利用可能なUIコンポーネント
│   │   ├── base/              # 基本UIコンポーネント
│   │   ├── dialogs/           # ダイアログコンポーネント
│   │   └── panels/            # パネルコンポーネント
│   ├── pages/             # 画面コンポーネント
│   │   ├── home/              # ホーム画面
│   │   ├── searchPage/        # 検索画面
│   │   └── musicDetail/       # 再生画面
│   ├── hooks/             # カスタムReactフック
│   ├── utils/             # ユーティリティ関数
│   └── entry/             # アプリのエントリーポイント
├── android/               # Android固有の設定
├── ios/                   # iOS固有の設定（未使用）
└── release/               # リリース関連ファイル
```

#### 主要コンポーネント
- **PluginManager**: プラグインの読み込み、実行、管理
  - 場所: `src/core/pluginManager.ts`
  - 依存: axios、react-native-fs、各種ユーティリティ
  - インターフェース: `installPlugin()`, `getValidPlugins()`, `getByHash()`

- **TrackPlayer**: 音楽再生の制御と管理
  - 場所: `src/core/trackPlayer/`
  - 依存: react-native-track-player、プレイリスト管理
  - インターフェース: `play()`, `pause()`, `skip()`, `setPlayList()`

- **MusicSheet**: プレイリストとお気に入りの管理
  - 場所: `src/core/musicSheet/`
  - 依存: jotai（状態管理）、MMKV（ストレージ）
  - インターフェース: `addMusic()`, `removeMusic()`, `createSheet()`

- **Config**: アプリケーション設定の管理
  - 場所: `src/core/config.ts`
  - 依存: MMKV、StateMapper
  - インターフェース: `getConfig()`, `setConfig()`, `setup()`

### 技術スタック
#### コア技術
- **言語**: TypeScript (v5.3.3) - 型安全性とモダンなJavaScript機能を活用
- **フレームワーク**: React Native (v0.76.5) - クロスプラットフォームモバイル開発
- **主要ライブラリ**: 
  - react-native-track-player (v4.1.1): 音楽再生機能の実装
  - jotai (v2.9.1): アトミックな状態管理
  - react-native-mmkv (v2.12.2): 高性能なKey-Valueストレージ
  - axios (v1.7.4): HTTPクライアント（プラグイン内で使用）
  - cheerio (v1.0.0-rc.12): HTML解析（プラグイン内で使用）
  - react-navigation (v6系): 画面遷移管理
  - react-native-reanimated (v3.16.6): 高性能アニメーション
  - webdav (v5.7.0): WebDAVバックアップ機能
  - @shopify/flash-list (v1.7.1): 高性能リスト表示

#### 開発・運用ツール
- **ビルドツール**: 
  - Metro: React Nativeバンドラー
  - Gradle: Androidビルドシステム
  - Babel: JavaScriptトランスパイラー
- **テスト**: Jest（設定あり、テストカバレッジは限定的）
- **CI/CD**: 手動リリースプロセス（GitHub Releases）
- **デプロイ**: APKファイルの直接配布（Google Play非対応）
- **品質管理**:
  - ESLint: コード品質チェック
  - Prettier: コードフォーマット
  - Husky + lint-staged: プリコミットフック
  - commitlint: コミットメッセージ規約

### 設計パターン・手法
- **プラグインアーキテクチャ**: 音楽ソースを独立したモジュールとして実装
- **シングルトンパターン**: Config、PluginManagerなどのコアサービス
- **Observerパターン**: EventBusを使用したコンポーネント間通信
- **Stateパターン**: 再生状態の管理（playing、paused、stopped）
- **Facadeパターン**: TrackPlayerがreact-native-track-playerをラップ
- **Repositoryパターン**: MusicSheetがデータ永続化を抽象化

### データフロー・処理フロー
1. **プラグイン読み込み**:
   - アプリ起動時にPluginManagerがプラグインディレクトリをスキャン
   - 各プラグインのJSファイルを動的に読み込み、評価
   - プラグインメタデータを検証し、有効なプラグインを登録

2. **音楽検索フロー**:
   - ユーザーが検索クエリを入力
   - 有効な各プラグインのsearch()メソッドを並列実行
   - 結果を統合してUIに表示

3. **音楽再生フロー**:
   - ユーザーが曲を選択
   - 該当プラグインのgetMediaSource()でソースURLを取得
   - TrackPlayerに曲情報を渡して再生開始
   - 再生状態の変更をUIに反映

4. **データ永続化フロー**:
   - プレイリストや設定の変更
   - JotaiのatomでReact状態を更新
   - MMKVストレージに自動的に永続化
   - 次回起動時に自動復元

## API・インターフェース
### プラグインAPI
#### 必須メソッド
- **search(query, page, type)**: 音楽、アルバム、アーティストの検索
- **getMediaSource(musicItem)**: 音楽の再生URLを取得
- 使用例:
```javascript
// プラグインでの実装例
module.exports = {
  platform: "Example Music",
  version: "0.0.1",
  
  async search(query, page, type) {
    // type: 'music' | 'album' | 'artist'
    const results = await fetchSearchResults(query, page, type);
    return {
      isEnd: results.length < 20,
      data: results
    };
  },
  
  async getMediaSource(musicItem) {
    const url = await fetchStreamUrl(musicItem.id);
    return { url };
  }
};
```

#### オプションメソッド
- **getAlbumInfo(albumItem)**: アルバム詳細情報の取得
- **getArtistWorks(artistItem)**: アーティストの作品一覧取得
- **getLyric(musicItem)**: 歌詞の取得
- **importMusicSheet(urlLike)**: プレイリストのインポート
- **getTopLists()**: ランキング一覧の取得
- **getMusicComments(musicItem)**: コメントの取得（v0.4.0以降）

### 設定・カスタマイズ
#### アプリケーション設定項目
```typescript
// 主要な設定項目
{
  "basic": {
    "autoPlayWhenAppStart": boolean,      // 起動時自動再生
    "showExitOnNotification": boolean,    // 通知に終了ボタン表示
    "autoUpdatePlugin": boolean,          // プラグイン自動更新
    "notCheckPluginVersion": boolean,     // バージョンチェック無効化
    "maxCacheSize": number,              // キャッシュサイズ（バイト）
    "notAllowToUseDataNetwork": boolean  // モバイルデータ使用制限
  },
  "theme": {
    "mode": "light" | "dark",           // テーマモード
    "background": string,                // 背景画像パス
    "colors": object                     // カラー設定
  }
}
```

#### プラグイン開発
1. **開発環境セットアップ**:
   - 公式テンプレートをクローン
   - npm installで依存関係インストール
   - TypeScriptで開発（型定義あり）

2. **ビルドとテスト**:
   - npm run buildでプラグインをビルド
   - 生成されたplugin.jsをアプリにインストール
   - デバッグはconsole.logで実施（アプリ内で確認可能）

3. **配布方法**:
   - GitHubなどでJSファイルをホスト
   - plugins.jsonマニフェストファイルで複数プラグインを管理
   - ユーザーはURLからダイレクトインストール可能

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- プレイリスト容量: v0.4.0で10,000曲まで対応（以前は1,500曲）
- 最適化手法:
  - @shopify/flash-listによる仮想化リスト
  - react-native-reanimatedでのハードウェアアクセラレーション
  - MMKVによる高速データ読み書き
  - 画像キャッシュ（react-native-fast-image）
  - 音楽ファイルのローカルキャッシュ機能

### スケーラビリティ
- ローカルファースト設計のため、ユーザー数に制限なし
- プラグインは独立して動作するため、追加による性能劣化は最小限
- 大量の楽曲管理にも対応（10,000曲以上のプレイリスト）
- WebDAVバックアップで複数デバイス間のデータ同期が可能

### 制限事項
- iOS非対応（React Native設定はあるが、実装なし）
- Google Play Store非対応（AGPL 3.0と音楽著作権の関係）
- プラグインのネイティブ依存は不可（Pure JavaScript only）
- リアルタイムストリーミングは各プラグインの実装に依存
- デスクトップ歌詞機能は悬浮窗権限が必要

## 評価・所感
### 技術的評価
#### 強み
- 優れたプラグインアーキテクチャ設計により高い拡張性を実現
- React Native 0.76.5採用で最新の開発環境を維持
- プライバシーファーストの設計思想
- 活発な開発とコミュニティ（18k+ スター）
- 軽量で高速な動作（ネイティブモジュール活用）
- 完全なオープンソースで透明性が高い

#### 改善の余地
- テストカバレッジの向上が必要
- プラグイン開発ドキュメントの充実化
- エラーハンドリングの統一化
- TypeScript型定義の完全性向上
- iOS対応の実装

### 向いている用途
- 複数の音楽ソースを統合して使いたいユーザー
- 広告なしの音楽体験を求めるユーザー
- プライバシーを重視するユーザー
- カスタマイズ可能な音楽プレーヤーを求める開発者
- 中国語圏のユーザー（ドキュメントが充実）

### 向いていない用途
- iOSユーザー
- 技術的知識のない一般ユーザー（プラグイン設定が必要）
- 公式音楽ストリーミングサービスの全機能を求めるユーザー
- 商用利用（AGPL 3.0ライセンスの制約）

### 総評
MusicFreeは、プラグインアーキテクチャを中心に据えた革新的な音楽プレーヤーアプリです。完全無料・広告なし・プライバシー重視という理念を技術的に実現し、ユーザーに音楽体験の自由を提供しています。特に、様々な音楽ソースを統合できる柔軟性は他のプレーヤーにはない大きな強みです。

技術的には、最新のReact Nativeを採用し、パフォーマンスとユーザビリティのバランスを上手く取っています。ただし、プラグインのインストールや設定が必要なため、ある程度の技術的理解が必要です。AGPL 3.0ライセンスの採用は、プロジェクトの持続可能性を保証する一方で、商用利用には制約があります。

中国発のプロジェクトですが、コードの品質は高く、活発なコミュニティに支えられて継続的に改善されています。音楽プレーヤーアプリのオープンソース実装として、また、プラグインアーキテクチャの実例として、非常に価値のあるプロジェクトと言えるでしょう。