# リポジトリ解析: linshenkx/prompt-optimizer

## 基本情報
- リポジトリ名: linshenkx/prompt-optimizer
- 主要言語: TypeScript
- スター数: 12,076
- フォーク数: 1,466
- 最終更新: 活発に更新中（MCP Server機能追加など）
- ライセンス: MIT License
- トピックス: AI, LLM, プロンプトエンジニアリング, 提示词优化, Web App, Desktop App, Chrome Extension, Docker, MCP Protocol

## 概要
### 一言で言うと
Prompt Optimizerは、AIプロンプトを自動的に最適化・改善するための包括的なツールセットで、Web版、デスクトップ版、Chrome拡張機能、Docker版の4つの形態で利用可能です。

### 詳細説明
Prompt Optimizerは、LLMアプリケーション開発者とユーザーのためのプロンプト最適化ツールです。単純なプロンプトを構造化された高品質なプロンプトに変換し、AIの出力品質を大幅に向上させます。特に小規模モデルでも高品質な出力を実現できるよう設計されており、ロールプレイング、知識抽出、創造的な執筆などの様々なユースケースに対応します。純粋なフロントエンドアーキテクチャを採用し、データは全てクライアント側で処理されるため、セキュリティとプライバシーが保証されています。

### 主な特徴
- 🎯 **インテリジェント最適化**: ワンクリックでプロンプトを最適化、複数回の反復改善をサポート
- 📝 **デュアルモード最適化**: システムプロンプトとユーザープロンプトの両方の最適化に対応
- 🔄 **比較テスト**: オリジナルと最適化後のプロンプトをリアルタイムで比較
- 🤖 **マルチモデル統合**: OpenAI、Gemini、DeepSeek、智谱AI、SiliconFlowなど主要なAIモデルをサポート
- 🔒 **セキュアアーキテクチャ**: 純粋なクライアントサイド処理、データはAIサービスプロバイダーに直接送信
- 📱 **マルチプラットフォーム**: Web、デスクトップ（Electron）、Chrome拡張機能、Dockerの4つの形態で提供
- 🔐 **アクセス制御**: パスワード保護機能を提供
- 🧩 **MCP Protocol対応**: Model Context Protocol（MCP）をサポートし、Claude Desktopなどと統合可能
- 🌐 **国際化対応**: 中国語と英語の多言語サポート

## 使用方法
### インストール
#### 前提条件
- Node.js 18.0.0以上（開発時）
- pnpm パッケージマネージャー（開発時）
- 各AIサービスのAPIキー（OpenAI、Gemini等）

#### インストール手順
```bash
# 方法1: オンライン版を使用（推奨）
# https://prompt.always200.com にアクセス

# 方法2: Docker経由でセルフホスト
docker run -d -p 8081:80 \
  -e VITE_OPENAI_API_KEY=your_key \
  -e ACCESS_PASSWORD=your_password \
  --name prompt-optimizer \
  linshen/prompt-optimizer

# 方法3: ソースからビルド（開発者向け）
git clone https://github.com/linshenkx/prompt-optimizer.git
cd prompt-optimizer
pnpm install
pnpm dev
```

### 基本的な使い方
#### Hello World相当の例
```typescript
// APIキーを設定画面で入力後、以下のような簡単なプロンプトを入力
"写一首诗"

// 最適化ボタンをクリックすると、以下のような構造化されたプロンプトに変換される：
`# Role: 诗歌创作专家

## Profile
- language: 中文
- description: 精通古今诗词创作的文学艺术家
- background: 深厚的文学素养和诗歌创作经验
- personality: 敏感细腻、富有想象力、追求意境美
- expertise: 诗歌创作、意象运用、韵律把握
- target_audience: 诗歌爱好者、文学创作者

## Skills
1. 诗歌创作技巧
   - 意象构建: 运用生动形象的意象表达情感
   - 韵律掌控: 精通各种诗歌格律和韵脚
   - 情感表达: 将抽象情感具象化
   - 语言凝练: 用最精炼的语言表达深刻含义

...`
```

#### 実践的な使用例
```typescript
// Vue 3 Composition APIでの使用例
import { usePromptOptimizer } from '@prompt-optimizer/ui'

export default {
  setup() {
    const services = ref(appServices)
    const optimizationMode = ref('system')
    const optimizeModel = ref('openai')
    
    const {
      prompt,
      optimizedPrompt,
      isOptimizing,
      handleOptimizePrompt
    } = usePromptOptimizer(services, optimizationMode, optimizeModel)
    
    // プロンプトを設定して最適化
    prompt.value = "Create a chatbot that helps users"
    await handleOptimizePrompt()
    
    console.log(optimizedPrompt.value) // 最適化されたプロンプト
  }
}
```

### 高度な使い方
```typescript
// MCP Serverを使用したClaude Desktop統合
// 1. Docker でMCP Serverを起動
// 2. Claude Desktopの設定ファイルに追加
{
  "services": [
    {
      "name": "Prompt Optimizer",
      "url": "http://localhost:8081/mcp"
    }
  ]
}

// 3. Claude内で使用
// @prompt-optimizer optimize-system-prompt "AI assistant that helps with coding"
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要と基本的な使用方法
- **docs/README.md**: 文書インデックス、全ドキュメントへのナビゲーション
- **docs/developer/technical-development-guide.md**: 技術スタックと開発規範の詳細
- **docs/user/mcp-server.md**: MCP Server統合ガイド
- **docs/user/deployment/vercel.md**: Vercelデプロイメント詳細ガイド

### サンプル・デモ
- **オンラインデモ**: https://prompt.always200.com
- **packages/core/src/services/template/default-templates/**: デフォルトテンプレート集
- **images/demo/**: 機能デモのスクリーンショット

### チュートリアル・ガイド
- 開発ガイド: dev.md
- Chrome拡張機能ガイド: packages/extension/chrome.md
- プロジェクト状態: docs/project/project-status.md

## 技術的詳細
### アーキテクチャ
#### 全体構造
Monorepoアーキテクチャを採用し、pnpm workspaceで管理。コア機能をパッケージとして分離し、各プラットフォーム（Web、Desktop、Extension）で共有。純粋なフロントエンドアーキテクチャにより、サーバーレスでの動作を実現。

#### ディレクトリ構成
```
prompt-optimizer/
├── packages/                 # Monorepo パッケージ
│   ├── core/                # コアビジネスロジック
│   │   ├── src/
│   │   │   ├── services/    # 各種サービス実装
│   │   │   │   ├── llm/     # LLMサービス層
│   │   │   │   ├── model/   # モデル管理
│   │   │   │   ├── prompt/  # プロンプト処理
│   │   │   │   ├── template/# テンプレート管理
│   │   │   │   └── history/ # 履歴管理
│   │   │   └── types/       # TypeScript型定義
│   │   └── tests/           # 単体・統合テスト
│   ├── ui/                  # 共有UIコンポーネント
│   │   ├── src/
│   │   │   ├── components/  # Vue 3コンポーネント
│   │   │   ├── composables/ # Composition API hooks
│   │   │   └── i18n/        # 国際化リソース
│   ├── web/                 # Webアプリケーション
│   ├── desktop/             # Electronデスクトップアプリ
│   ├── extension/           # Chrome拡張機能
│   └── mcp-server/          # MCP Protocol Server
├── docs/                    # プロジェクトドキュメント
├── docker/                  # Docker設定
└── scripts/                 # ビルド・デプロイスクリプト
```

#### 主要コンポーネント
- **PromptService**: プロンプト最適化のコアロジック
  - 場所: `packages/core/src/services/prompt/service.ts`
  - 依存: LLMService, TemplateManager
  - インターフェース: optimize(), iterate(), compare()

- **ModelManager**: AIモデル設定と管理
  - 場所: `packages/core/src/services/model/manager.ts`
  - 依存: StorageService
  - インターフェース: addModel(), getModel(), validateConfig()

- **TemplateManager**: 最適化テンプレートの管理
  - 場所: `packages/core/src/services/template/manager.ts`
  - 依存: StorageService, LanguageService
  - インターフェース: getTemplate(), createTemplate(), getBuiltinTemplates()

### 技術スタック
#### コア技術
- **言語**: TypeScript 5.8.2、厳格な型チェックとモダンJS機能
- **フレームワーク**: Vue 3.5.x（Composition API、Script Setup）
- **主要ライブラリ**: 
  - OpenAI SDK (^4.83.0): OpenAI API統合
  - Google Generative AI SDK (^0.21.0): Gemini API統合
  - Zod (^3.22.4): ランタイム型検証
  - uuid (^11.0.5): ユニークID生成

#### 開発・運用ツール
- **ビルドツール**: Vite 6.0.x（高速HMR、最適化されたビルド）
- **テスト**: Vitest 3.0.x（単体テスト）、Playwright（E2Eテスト）
- **CI/CD**: GitHub Actions
- **デプロイ**: Vercel、Docker、GitHub Releases

### 設計パターン・手法
- サービス指向アーキテクチャ（SOA）
- Composition APIによる機能の分離と再利用
- ストラテジーパターン（複数のLLMプロバイダー対応）
- ファクトリーパターン（ストレージプロバイダーの生成）

### データフロー・処理フロー
1. ユーザーがプロンプトを入力
2. 選択されたテンプレートとプロンプトを組み合わせ
3. LLMサービスにAPIリクエストを送信
4. ストリーミングレスポンスを受信・処理
5. 最適化結果を表示・保存

## API・インターフェース
### 公開API
#### optimize-prompt（プロンプト最適化）
- 目的: プロンプトを構造化・改善
- 使用例:
```typescript
const request: OptimizationRequest = {
  prompt: "シンプルなプロンプト",
  mode: "system",
  modelId: "openai",
  templateId: "general-optimize"
}
const result = await promptService.optimize(request)
```

### 設定・カスタマイズ
#### 設定ファイル
```javascript
// config.js - 環境変数による設定
{
  VITE_OPENAI_API_KEY: "your-key",
  VITE_OPENAI_API_BASE_URL: "https://api.openai.com",
  VITE_GEMINI_API_KEY: "your-key",
  ACCESS_PASSWORD: "your-password", // アクセス制限
  MCP_DEFAULT_MODEL_PROVIDER: "openai" // MCPデフォルトモデル
}
```

#### 拡張・プラグイン開発
新しいLLMプロバイダーの追加、カスタムテンプレートの作成、UIテーマのカスタマイズが可能

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ストリーミングレスポンス: リアルタイムでの結果表示
- クライアントサイド処理: サーバーレスで高速レスポンス
- 最適化されたバンドルサイズ: Viteによる効率的なコード分割

### スケーラビリティ
純粋なフロントエンドアーキテクチャにより、CDNでの配信が可能。ユーザー数に関わらず一定のパフォーマンスを維持

### 制限事項
- ブラウザのCORS制限により、一部のAPIは直接アクセスできない
- ローカルストレージの容量制限（通常5-10MB）
- APIプロバイダーのレート制限に依存

## 評価・所感
### 技術的評価
#### 強み
- 包括的なマルチプラットフォーム対応（Web、Desktop、Extension、Docker）
- セキュアなクライアントサイドアーキテクチャ
- 優れたユーザビリティと直感的なUI
- 活発な開発とコミュニティ（12,000+スター）
- MCP Protocol対応による拡張性

#### 改善の余地
- より多くのLLMプロバイダーのネイティブサポート
- バックエンドAPIオプションの提供（エンタープライズ向け）
- より高度なプロンプトエンジニアリング機能

### 向いている用途
- AI開発者のプロンプト最適化ワークフロー
- 小規模モデルでの高品質出力の実現
- プロダクション環境での安定したAI出力の確保
- 創造的な執筆やロールプレイングアプリケーション

### 向いていない用途
- 大規模なプロンプト履歴の管理（ローカルストレージ制限）
- エンタープライズレベルの集中管理が必要な場合
- オフライン環境での使用

### 総評
Prompt Optimizerは、AIプロンプトエンジニアリングの民主化を実現する優れたツールです。特に、複数のデプロイメントオプション、セキュアなアーキテクチャ、直感的なUIを提供することで、初心者から上級者まで幅広いユーザーに価値を提供しています。活発な開発コミュニティと継続的な機能改善により、AIアプリケーション開発の必須ツールとして位置づけられています。