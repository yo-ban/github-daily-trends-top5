# リポジトリ解析: gorhill/uBlock

## 基本情報
- リポジトリ名: gorhill/uBlock
- 主要言語: JavaScript
- スター数: 56,024
- フォーク数: 3,581
- 最終更新: 活発に更新中（継続的なリリース）
- ライセンス: GNU General Public License v3.0
- トピックス: ad-blocker, content-blocker, privacy-protection, browser-extension, firefox, chromium, ublock-origin

## 概要
### 一言で言うと
uBlock OriginはCPUとメモリ効率に優れた広範囲コンテンツブロッカーで、広告、トラッカー、マルウェアなどをブロックしつつ、ユーザーのプライバシーを保護するブラウザ拡張機能です。

### 詳細説明
uBlock Origin（uBO）は、ChromiumおよびFirefoxブラウザ向けの効率的なコンテンツブロッカーです。デフォルトでEasyList、EasyPrivacy、Peter Loweのブロックリスト、オンライン悪意のあるURLブロックリスト、およびuBOフィルタリストを使用して、広告、トラッカー、コインマイナー、ポップアップ、迷惑なアンチブロッカー、マルウェアサイトなどをブロックします。EasyListフィルタ構文を使用し、カスタムルールとフィルタで動作するように構文を拡張しています。

プロジェクトの中心的な理念は「ユーザーが自分のブラウザで受け入れるWebコンテンツを決定する」というもので、Adblock Plusの「Acceptable Ads」マニフェストを支持せず、ユーザーに選択の手段を提供することを唯一の目的としています。

### 主な特徴
- CPU・メモリ効率に優れた設計（他の人気ブロッカーと同等以上のパフォーマンス）
- 広範囲なコンテンツブロック（広告、トラッカー、マルウェア、ポップアップなど）
- 豊富なフィルタリストのサポート（EasyList、EasyPrivacy等）
- カスタムフィルタルールの作成が可能
- 動的フィルタリング機能（サイト単位でのファイアウォール設定）
- 要素選択ツール（特定の要素を手動でブロック）
- ネットワークリクエストロガー（詳細なトラフィック監視）
- 多言語対応（70以上の言語をサポート）
- 複数のブラウザ対応（Firefox、Chrome、Edge、Opera、Thunderbird）
- オープンソース・無料（寄付も求めない）

## 使用方法
### インストール
#### 前提条件
- 対応ブラウザ：Firefox 52+、Chrome/Chromium、Edge、Opera、Thunderbird
- 開発者向け：Node.js 22+、npm 11+、git

#### インストール手順
```bash
# 方法1: ブラウザの公式ストアから（推奨）
# Firefox: https://addons.mozilla.org/addon/ublock-origin/
# Chrome: https://chromewebstore.google.com/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm
# Edge: https://microsoftedge.microsoft.com/addons/detail/ublock-origin/odfafepnkmbhccpbejgmiehpchacaeak
# Opera: https://addons.opera.com/extensions/details/ublock/

# 方法2: 手動インストール（開発版）
# 1. リリースページからzipファイルをダウンロード
# 2. 解凍してブラウザの拡張機能管理ページで「展開して読み込む」

# 方法3: ソースからビルド（開発者向け）
git clone https://github.com/gorhill/uBlock.git
cd uBlock
# Chromium用
make chromium
# Firefox用
make firefox
```

### 基本的な使い方
#### 初期設定と基本操作
```text
1. インストール後、ブラウザのツールバーにuBOアイコンが表示される
2. アイコンをクリックしてポップアップパネルを開く
3. 大きな電源ボタンでサイト単位でのオン/オフを切り替え
4. ダッシュボードボタン（歯車アイコン）で詳細設定へアクセス
```

#### 実践的な使用例
```text
# カスタムフィルタの追加
1. ダッシュボード → マイフィルター
2. 以下のような形式でルールを追加：
   ||example.com/ads/*
   example.com##.advertisement
   @@||example.com/important-content.js

# 特定の要素をブロック
1. uBOアイコンをクリック
2. スポイトアイコン（要素選択モード）をクリック
3. ブロックしたい要素をクリックして選択
4. 「作成」ボタンでフィルタを保存
```

### 高度な使い方
```text
# 動的フィルタリング（中級者向け）
1. 設定で「私は上級者です」を有効化
2. ポップアップパネルに詳細なマトリックスが表示
3. ドメイン/タイプ別にリクエストを許可/ブロック：
   - 緑：許可
   - 赤：ブロック
   - グレー：デフォルト動作

# スクリプトレット注入（上級者向け）
example.com##+js(set-constant, adBlockDetected, false)
example.com##+js(remove-attr, oncontextmenu)
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクトの概要、インストール方法、基本的な使い方
- **Wiki**: https://github.com/gorhill/uBlock/wiki - 詳細なドキュメント、チュートリアル、FAQ
- **MANIFESTO.md**: プロジェクトの理念と方針
- **docs/tests/**: テストページとベンチマーク用リソース

### サンプル・デモ
- **ポップアップUI**: 基本モードと上級モードのインターフェース例
- **要素選択ツール**: インタラクティブな要素ブロック機能
- **ネットワークロガー**: リアルタイムのリクエスト監視ツール

### チュートリアル・ガイド
- クイックガイド：ポップアップユーザーインターフェース
- 動的フィルタリング：クイックガイド
- ブロッキングモード（Very Easy、Easy、Medium、Hard、Nightmare）
- フィルタリスト管理ガイド
- カスタムフィルタ作成チュートリアル

## 技術的詳細
### アーキテクチャ
#### 全体構造
uBlock Originは、ブラウザ拡張機能として動作し、以下の主要なレイヤーで構成されています：
- **バックグラウンドプロセス**: ネットワークリクエストの監視とフィルタリング
- **コンテンツスクリプト**: ページ内の要素操作とコスメティックフィルタリング
- **ユーザーインターフェース**: ポップアップ、ダッシュボード、設定画面
- **フィルタリングエンジン**: 静的・動的フィルタリングの処理

#### ディレクトリ構成
```
uBlock/
├── src/                    # ソースコード
│   ├── js/                 # JavaScriptコード
│   │   ├── background.js   # バックグラウンドプロセスのエントリポイント
│   │   ├── contentscript.js # コンテンツスクリプト
│   │   ├── static-*.js     # 静的フィルタリング関連
│   │   └── dynamic-*.js    # 動的フィルタリング関連
│   ├── css/                # スタイルシート
│   ├── img/                # アイコン、画像リソース
│   ├── lib/                # 外部ライブラリ
│   ├── _locales/           # 多言語対応ファイル（70言語以上）
│   └── web_accessible_resources/ # Webページからアクセス可能なリソース
├── platform/               # プラットフォーム固有のコード
│   ├── chromium/           # Chromium用
│   ├── firefox/            # Firefox用
│   └── common/             # 共通コード
├── assets/                 # フィルタリスト設定
├── dist/                   # ビルド設定と配布用ファイル
└── tools/                  # ビルドツール、スクリプト
```

#### 主要コンポーネント
- **static-net-filtering.js**: ネットワークリクエストの静的フィルタリング
  - 場所: `src/js/static-net-filtering.js`
  - 依存: HNTrieContainer、BidiTrieContainer
  - インターフェース: matchRequest()、compile()、serialize()
  
- **cosmetic-filtering.js**: ページ内要素の非表示・削除
  - 場所: `src/js/cosmetic-filtering.js`
  - 依存: static-ext-filtering
  - インターフェース: compile()、retrieve()
  
- **dynamic-net-filtering.js**: 動的ルールベースのフィルタリング
  - 場所: `src/js/dynamic-net-filtering.js`
  - 依存: filtering-context
  - インターフェース: evaluateCellZY()、addRule()

### 技術スタック
#### コア技術
- **言語**: JavaScript (ES6+)、WebAssembly（パフォーマンスクリティカルな部分）
- **フレームワーク**: ブラウザ拡張機能APIをベースにした独自アーキテクチャ
- **主要ライブラリ**: 
  - CodeMirror: フィルタエディタのシンタックスハイライト
  - lz4: データ圧縮（キャッシュストレージ最適化）
  - punycode: 国際化ドメイン名の処理
  - publicsuffixlist: ドメイン検証
  - diff: フィルタリスト更新の差分処理

#### 開発・運用ツール
- **ビルドツール**: GNU Make、Pythonスクリプト（プラットフォーム別ビルド）
- **テスト**: ベンチマークテスト、手動テスト（docs/tests/）
- **リンター**: ESLint（コード品質管理）
- **バージョン管理**: Git、GitHub（Issues、Pull Requests）

### 設計パターン・手法
- **モジュラー設計**: 機能ごとに独立したモジュール
- **イベント駆動**: ブラウザAPIのイベントベースアーキテクチャ
- **Trie データ構造**: 高速なパターンマッチング（HNTrie、BidiTrie）
- **遅延評価**: 必要な時にのみフィルタを評価
- **メモリプール**: オブジェクトの再利用によるガベージコレクション最小化

### データフロー・処理フロー
1. **リクエスト発生**: ウェブページがリソースを要求
2. **フィルタリング判定**: 
   - ネットワークレベル：URLパターンマッチング
   - コスメティック：DOM要素の選択と非表示
3. **ルール適用**: ブロック/許可/リダイレクト
4. **結果の反映**: ページレンダリングへの影響

## API・インターフェース
### 公開API
#### ブラウザ拡張機能API
- 目的: ブラウザとの通信、リクエストインターセプト
- 使用例:
```javascript
// webRequest APIでリクエストをインターセプト
chrome.webRequest.onBeforeRequest.addListener(
  onBeforeRequest,
  { urls: ["<all_urls>"] },
  ["blocking"]
);
```

### 設定・カスタマイズ
#### 設定ファイル
```json
// 高度な設定例（advanced settings）
{
  "autoUpdatePeriod": 7,          // フィルタリスト更新周期（時間）
  "cacheStorageAPI": "unset",     // キャッシュストレージAPI選択
  "cloudStorageEnabled": false,   // クラウド同期
  "hyperlinkAuditingDisabled": true, // ping属性の無効化
  "ignoreGenericCosmeticFilters": false // 汎用コスメティックフィルタ
}
```

#### 拡張・プラグイン開発
- スクリプトレット（scriptlets）: カスタムJavaScript注入
- 手続き型コスメティックフィルタ: 複雑なDOM操作
- リソースリダイレクト: 広告スクリプトをダミーに置換

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- メモリ使用量: 約50-100MB（フィルタリスト数による）
- CPU使用率: 低負荷（トライ構造による高速マッチング）
- ページロード時間: 広告ブロックにより20-40%高速化
- フィルタ処理速度: 数万のルールを数ミリ秒で処理

### スケーラビリティ
- 数十万のフィルタルールを効率的に処理
- WebAssemblyによる計算集約的な処理の高速化
- インクリメンタルなフィルタリスト更新

### 制限事項
- Manifest V3による制限（Chrome）: 動的フィルタリングの制約
- モバイルブラウザのサポート限定（Firefox for Androidのみ）
- 一部のウェブサイトでの互換性問題

## 評価・所感
### 技術的評価
#### 強み
- 優れたパフォーマンス（メモリ・CPU効率）
- 豊富な機能と柔軟なカスタマイズ性
- 活発な開発とコミュニティサポート
- プライバシー重視の設計思想
- 完全無料・オープンソース

#### 改善の余地
- UIの学習曲線（上級機能が複雑）
- モバイル対応の限定性
- Manifest V3への完全対応（進行中）

### 向いている用途
- プライバシーを重視するユーザー
- 広告やトラッカーを完全にブロックしたい場合
- カスタマイズ可能な広告ブロッカーが必要な場合
- 技術的な知識があり、詳細な制御を求めるユーザー

### 向いていない用途
- 「許容可能な広告」を表示したい場合
- 最小限の設定で使いたい初心者（ただし、デフォルト設定でも十分機能する）
- 特定の広告収入に依存するコンテンツクリエイター

### 総評
uBlock Originは、現在利用可能な広告ブロッカーの中で最も効率的で強力なツールの一つです。オープンソースで完全無料、寄付すら求めないという姿勢は、純粋にユーザーの利益を第一に考えたプロジェクトであることを示しています。技術的にも、Trieデータ構造やWebAssemblyの活用など、パフォーマンスを追求した実装が評価できます。Manifest V3への移行という課題はありますが、コミュニティと開発者の努力により、今後も広告ブロッカーの最前線に立ち続けることが期待されます。