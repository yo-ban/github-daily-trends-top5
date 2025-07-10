# リポジトリ解析: putyy/res-downloader

## 基本情報
- リポジトリ名: putyy/res-downloader
- 主要言語: Go
- スター数: 8,408
- フォーク数: 998
- 最終更新: 2024年（活発に開発中）
- ライセンス: Apache License 2.0
- トピックス: resource-downloader, proxy, video-downloader, wechat, cross-platform

## 概要
### 一言で言うと
プロキシ方式でネットワークトラフィックを傍受し、動画・音楽・画像などのリソースを自動検出してダウンロードできるクロスプラットフォーム対応のGUIアプリケーション。WeChat（微信）、抖音、快手などの中国系プラットフォームに特化した機能を持つ。

### 詳細説明
res-downloader（爱享素材下载器）は、Go言語とWailsフレームワークを使用して開発されたデスクトップアプリケーションです。ローカルプロキシサーバーとして動作し、HTTP/HTTPSトラフィックを傍受することで、ブラウザやアプリケーションがアクセスしているリソースを自動的に検出し、ダウンロード可能にします。

特筆すべきは、WeChatビデオチャンネル、ミニプログラム、抖音（Douyin）、快手（Kuaishou）、小紅書（Xiaohongshu）、酷狗音楽（KuGou Music）、QQ音楽などの中国の主要プラットフォームに対応している点です。これらのプラットフォームの多くは、通常の方法ではコンテンツのダウンロードが困難ですが、本ツールは各プラットフォームに特化したプラグインシステムにより、暗号化された動画の復号化まで対応しています。

### 主な特徴
- **シンプルな操作性**: ワンクリックでプロキシを起動し、自動的にリソースを検出
- **クロスプラットフォーム対応**: Windows、macOS、Linux対応
- **多様なリソースタイプ**: 動画、音声、画像、m3u8ストリーム、ライブストリーム対応
- **プラットフォーム特化機能**: 中国系主要プラットフォームへの深い対応
- **暗号化動画の復号化**: WeChatの暗号化動画を自動復号化
- **プラグインアーキテクチャ**: 新しいプラットフォームへの対応を容易に追加可能
- **バッチ処理**: リソースリストのエクスポート/インポート機能
- **品質選択**: 対応プラットフォームでの動画品質選択

## 使用方法
### インストール
#### 前提条件
- Windows 10以降 / macOS 10.15以降 / Linux（最新のディストリビューション）
- 証明書のインストール許可（HTTPS傍受のため）
- ネットワークアクセス許可

#### インストール手順
```bash
# 方法1: GitHubリリースページからダウンロード
# https://github.com/putyy/res-downloader/releases から最新版をダウンロード

# Windows
# .exe インストーラーを実行

# macOS
# .dmg ファイルをマウントしてアプリケーションフォルダにドラッグ

# Linux
# .AppImage ファイルに実行権限を付与
chmod +x res-downloader-*.AppImage
./res-downloader-*.AppImage
```

### 基本的な使い方
#### Hello World相当の例
```text
1. アプリケーションを起動
2. ホーム画面左上の「启动代理」（プロキシ起動）をクリック
3. システムプロキシが自動設定される（127.0.0.1:8899）
4. ブラウザで任意の動画サイトを開く
5. アプリに戻ると、検出されたリソースが一覧表示される
6. ダウンロードしたいリソースをクリック
```

#### 実践的な使用例
```go
// プログラマティックな使用例（core/resource.goより）
package main

import (
    "github.com/putyy/res-downloader/core"
)

func main() {
    // アプリケーションインスタンスの作成
    app := core.NewApp()
    
    // プロキシ設定
    proxyConfig := core.ProxyConfig{
        Port: 8899,
        EnableHTTPS: true,
        CertPath: "./cert.pem",
        KeyPath: "./key.pem",
    }
    
    // プロキシ起動
    app.StartProxy(proxyConfig)
    
    // リソース検出のコールバック設定
    app.OnResourceDetected(func(resource *core.Resource) {
        fmt.Printf("検出: %s (%s)\n", resource.Description, resource.URL)
        
        // 自動ダウンロード（オプション）
        if resource.Type == "video" {
            app.DownloadResource(resource)
        }
    })
    
    // アプリケーション実行
    app.Run()
}
```

### 高度な使い方
```javascript
// frontend/src/views/index.vue - フロントエンドからの使用例
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { EventsOn, EventsOff } from '../../wailsjs/runtime/runtime'
import { StartProxy, StopProxy, DownloadResource } from '../../wailsjs/go/core/App'

// リソースリスト
const resources = ref<Resource[]>([])

// 高度なフィルタリング設定
const filterConfig = ref({
  types: ['video', 'audio', 'image'],
  minSize: 1024 * 1024, // 1MB以上
  platforms: ['wechat', 'douyin', 'kuaishou'],
  quality: 'high' // 高品質のみ
})

// プロキシ起動（カスタム設定付き）
async function startAdvancedProxy() {
  const config = {
    port: 8899,
    upstream: '', // 上流プロキシ（オプション）
    filters: filterConfig.value
  }
  
  await StartProxy(JSON.stringify(config))
}

// バッチダウンロード
async function downloadBatch(selectedResources: Resource[]) {
  for (const resource of selectedResources) {
    // WeChatの暗号化動画の場合、復号化オプションを追加
    if (resource.platform === 'wechat' && resource.encrypted) {
      resource.options = {
        decrypt: true,
        decryptKey: resource.metadata.key
      }
    }
    
    await DownloadResource(resource)
  }
}

// リアルタイムリソース検出
onMounted(() => {
  EventsOn('resource:detected', (resource: Resource) => {
    // カスタムフィルタリング
    if (shouldIncludeResource(resource)) {
      resources.value.push(resource)
    }
  })
})

// プラグインによる拡張
async function loadCustomPlugin() {
  // カスタムプラットフォーム対応を追加
  const plugin = {
    name: 'custom-platform',
    domains: ['example.com'],
    handler: (request, response) => {
      // カスタム処理ロジック
      if (response.headers['content-type']?.includes('video')) {
        return {
          type: 'video',
          url: request.url,
          description: 'Custom Video',
          metadata: extractMetadata(response)
        }
      }
    }
  }
  
  await RegisterPlugin(plugin)
}
</script>
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: 中国語版の詳細説明
- **README-EN.md**: 英語版の説明
- **オンラインドキュメント**: https://res.putyy.com/
- **GitHub Issues**: トラブルシューティングとディスカッション

### サンプル・デモ
- **docs/images/**: スクリーンショットとデモ画像
- **frontend/src/views/**: UI実装の参考例
- **core/plugins/**: プラットフォーム別プラグインの実装例

### チュートリアル・ガイド
- インストールガイド（README内）
- よくある質問と解決方法
- プラグイン開発ガイド（ソースコードコメント内）

## 技術的詳細
### アーキテクチャ
#### 全体構造
res-downloaderは、Go言語のバックエンドとVue.jsのフロントエンドを組み合わせた、Wailsフレームワークベースのデスクトップアプリケーションです：

1. **プロキシ層**: HTTP/HTTPSトラフィックの傍受と解析
2. **検出層**: リソースの自動識別とフィルタリング
3. **プラグイン層**: プラットフォーム固有の処理
4. **ダウンロード層**: マルチスレッドダウンロードマネージャー
5. **UI層**: Vue.jsベースのユーザーインターフェース

#### ディレクトリ構成
```
res-downloader/
├── core/                  # Goバックエンド
│   ├── app.go           # メインアプリケーションロジック
│   ├── proxy.go         # プロキシサーバー実装
│   ├── resource.go      # リソース検出・管理
│   ├── downloader.go    # ダウンロードマネージャー
│   ├── storage.go       # データ永続化
│   ├── plugins/         # プラットフォーム別プラグイン
│   │   ├── plugin.default.go  # 汎用プラグイン
│   │   └── plugin.qq.com.go   # WeChatプラグイン
│   └── shared/          # 共通ユーティリティ
├── frontend/            # Vue.jsフロントエンド
│   ├── src/
│   │   ├── views/      # ページコンポーネント
│   │   ├── components/ # 再利用可能コンポーネント
│   │   ├── api/        # バックエンドAPI呼び出し
│   │   └── i18n.ts     # 国際化
│   └── wailsjs/        # Wails自動生成バインディング
├── build/              # ビルド設定・アイコン
└── wails.json         # Wails設定ファイル
```

#### 主要コンポーネント
- **プロキシサーバー**: HTTP/HTTPS傍受の中核
  - 場所: `core/proxy.go`
  - 依存: elazarl/goproxy
  - インターフェース: StartProxy(), StopProxy()

- **リソースマネージャー**: 検出されたリソースの管理
  - 場所: `core/resource.go`
  - 依存: 内部ストレージ
  - インターフェース: AddResource(), GetResources()

- **ダウンローダー**: マルチスレッドダウンロード実装
  - 場所: `core/downloader.go`
  - 依存: 標準HTTPクライアント
  - インターフェース: Download(), Pause(), Resume()

### 技術スタック
#### コア技術
- **言語**: Go 1.21+（バックエンド）、TypeScript（フロントエンド）
- **フレームワーク**: 
  - Wails v2（デスクトップアプリケーション）
  - Vue 3（UI）
  - Tailwind CSS（スタイリング）
- **主要ライブラリ**: 
  - elazarl/goproxy（HTTPプロキシ）
  - Naive UI（UIコンポーネント）
  - Vite（ビルドツール）

#### 開発・運用ツール
- **ビルドツール**: Wails CLI、Vite
- **パッケージ管理**: Go Modules、npm
- **配布**: プラットフォーム別インストーラー

### 設計パターン・手法
- **プラグインアーキテクチャ**: 拡張可能なプラットフォーム対応
- **イベント駆動**: フロントエンド・バックエンド間の通信
- **非同期処理**: ダウンロードとUI更新の分離
- **MITM（Man-in-the-Middle）**: HTTPS通信の傍受

### データフロー・処理フロー
1. プロキシサーバー起動（ポート8899）
2. システムプロキシ設定の自動構成
3. HTTP/HTTPSリクエスト・レスポンスの傍受
4. プラグインによるドメイン別処理
5. Content-Typeに基づくリソース識別
6. フロントエンドへのリアルタイム通知
7. ユーザー選択によるダウンロード開始
8. マルチスレッドダウンロードの実行
9. 必要に応じて復号化処理（WeChatビデオ等）

## API・インターフェース
### 公開API
#### バックエンドAPI（Wailsバインディング経由）
- 目的: フロントエンドからのバックエンド機能呼び出し
- 使用例:
```javascript
// プロキシ制御
import { StartProxy, StopProxy, GetProxyStatus } from 'wailsjs/go/core/App'

// リソース管理
import { GetResources, DownloadResource, DeleteResource } from 'wailsjs/go/core/App'

// 設定管理
import { GetConfig, SaveConfig } from 'wailsjs/go/core/App'
```

#### イベントシステム
- 目的: リアルタイム通知とデータ更新
- 使用例:
```javascript
// イベントリスナー
EventsOn('resource:detected', (resource) => {
  console.log('新しいリソース:', resource)
})

EventsOn('download:progress', (progress) => {
  console.log('ダウンロード進捗:', progress)
})

EventsOn('proxy:status', (status) => {
  console.log('プロキシ状態:', status)
})
```

### 設定・カスタマイズ
#### 設定ファイル
```json
// config.json - アプリケーション設定
{
  "proxy": {
    "port": 8899,
    "enableHTTPS": true,
    "upstreamProxy": "",
    "timeout": 30
  },
  "download": {
    "savePath": "~/Downloads/res-downloader",
    "maxThreads": 5,
    "retryCount": 3,
    "chunkSize": 1048576
  },
  "filter": {
    "enabledTypes": ["video", "audio", "image", "m3u8"],
    "minSize": 102400,
    "maxSize": 5368709120,
    "blockedDomains": []
  },
  "ui": {
    "language": "zh-CN",
    "theme": "light",
    "autoStart": false
  }
}
```

#### 拡張・プラグイン開発
新しいプラットフォームプラグインの追加：
```go
// core/plugins/plugin.example.go
package plugins

type ExamplePlugin struct {
    BasePlugin
}

func (p *ExamplePlugin) Name() string {
    return "example-plugin"
}

func (p *ExamplePlugin) Domains() []string {
    return []string{"example.com", "*.example.com"}
}

func (p *ExamplePlugin) ProcessResponse(req *http.Request, resp *http.Response) *Resource {
    // カスタム処理ロジック
    if isVideoResponse(resp) {
        return &Resource{
            URL:         req.URL.String(),
            Type:        "video",
            Description: extractTitle(resp),
            Size:        extractSize(resp),
            Platform:    "example",
            Metadata:    extractMetadata(resp),
        }
    }
    return nil
}
```

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- プロキシスループット: 通常のブラウジングに影響なし
- リソース検出: リアルタイム（<100ms）
- ダウンロード速度: ネットワーク帯域に依存、マルチスレッド対応

### スケーラビリティ
- 大量リソース対応: 仮想スクロールによる効率的な表示
- 同時ダウンロード: 設定可能な並列数
- メモリ効率: ストリーミング処理による低メモリ使用

### 制限事項
- HTTPS傍受: 証明書インストールが必要
- プラットフォーム依存: 一部機能は特定OSでのみ利用可能
- リソース検出: Content-Typeヘッダーに依存

## 評価・所感
### 技術的評価
#### 強み
- **優れたユーザビリティ**: 技術的知識不要でプロキシ傍受が可能
- **包括的なプラットフォーム対応**: 中国系主要サービスへの深い対応
- **高度な技術実装**: HTTPS傍受、暗号化動画の復号化
- **クロスプラットフォーム**: Wailsによる真のネイティブアプリ
- **拡張性**: プラグインシステムによる容易な機能追加

#### 改善の余地
- **セキュリティ懸念**: MITM方式のため証明書インストールが必要
- **日本語対応**: 現在は中国語と英語のみ
- **ドキュメント**: より詳細な技術文書が必要

### 向いている用途
- **コンテンツアーカイブ**: オンラインコンテンツの保存
- **オフライン視聴**: ストリーミングコンテンツのダウンロード
- **研究・分析**: Webトラフィックの解析
- **バックアップ**: 個人的なコンテンツのバックアップ

### 向いていない用途
- **商用利用**: 著作権保護されたコンテンツの配布
- **大規模スクレイピング**: APIの方が効率的
- **リアルタイム処理**: プロキシ経由のため遅延あり

### 総評
res-downloaderは、技術的に高度な実装でありながら、一般ユーザーでも簡単に使えるよう設計された優れたツールです。特に、中国系プラットフォームへの対応は他に類を見ないレベルで、WeChatの暗号化動画の復号化など、通常は困難な機能を実現しています。Wailsフレームワークの採用により、真のクロスプラットフォーム対応を実現し、ネイティブアプリケーションとしての快適な操作性を提供しています。ただし、HTTPS傍受という性質上、セキュリティ面での配慮が必要であり、使用は個人的な目的に限定すべきでしょう。技術的には非常に興味深い実装で、プロキシベースのアプリケーション開発の良い参考例となります。