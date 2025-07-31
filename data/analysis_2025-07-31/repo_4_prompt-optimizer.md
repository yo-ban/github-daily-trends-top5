# リポジトリ解析: linshenkx/prompt-optimizer

## 基本情報
- リポジトリ名: linshenkx/prompt-optimizer
- 主要言語: TypeScript
- スター数: 11,535
- フォーク数: 1,405
- 最終更新: 2025年7月（活発に開発中）
- ライセンス: MIT License
- トピックス: プロンプトエンジニアリング、AI、LLM、プロンプト最適化、OpenAI、Gemini、Claude

## 概要
### 一言で言うと
AIプロンプトを自動的に最適化し、高品質な出力を得られるようにするツール。Web版、デスクトップ版、Chrome拡張機能、MCPサーバーなど多様な形態で提供され、様々なAIモデルに対応。

### 詳細説明
prompt-optimizerは、AIモデルへのプロンプトを最適化することで、より良い応答を得られるようにするオープンソースツールです。「一款提示词优化器，助力于编写高质量的提示词」というキャッチフレーズのとおり、曖昧な表現の排除、情報の補完、構造化などを通じてプロンプトの品質を向上させます。特に小さなAIモデルでもより良いパフォーマンスを発揮できるようにし、プロダクション環境での安定した出力を実現します。純粋なクライアントサイド実装により、データは全てローカルに保存され、セキュリティとプライバシーが確保されています。

### 主な特徴
- ワンクリックプロンプト最適化
- システムプロンプトとユーザープロンプトの両方に対応
- 多段階の反復的改善
- リアルタイム比較テスト機能
- 複数AIモデル対応（OpenAI、Gemini、DeepSeek、Zhipu等）
- テンプレート管理システム
- プロンプト履歴管理
- 多言語対応（中国語・英語）
- マルチプラットフォーム（Web、デスクトップ、Chrome拡張機能）
- MCPプロトコル対応（Claude Desktop統合）
- 完全なクライアントサイド処理
- パスワード保護機能

## 使用方法
### インストール
#### 前提条件
- Node.js 18以上（開発時）
- pnpm 10.6以上（開発時）
- 対応ブラウザ（Web版）
- Windows/macOS/Linux（デスクトップ版）

#### インストール手順
```bash
# 方法1: オンライン版（最も簡単）
# https://prompt.always200.com にアクセス

# 方法2: Docker
docker run -d -p 8081:80 --name prompt-optimizer linshen/prompt-optimizer

# 方法3: Dockerとパスワード保護
docker run -d -p 8081:80 \
  -e ACCESS_PASSWORD=your_password \
  --name prompt-optimizer \
  linshen/prompt-optimizer

# 方法4: 開発環境セットアップ
git clone https://github.com/linshenkx/prompt-optimizer.git
cd prompt-optimizer
pnpm install
pnpm dev
```

### 基本的な使い方
#### Hello World相当の例
```javascript
// 最小限の使用例（Web UIから）
// 1. プロンプト入力: "猫について教えて"
// 2. 最適化ボタンをクリック
// 3. 最適化結果: "猫（学名：Felis catus）に関する包括的な情報を提供してください。以下の観点から説明をお願いします：1) 生物学的特徴、2) 歴史と家畜化、3) 行動と習性、4) 人間との関係、5) 品種の多様性"
```

#### 実践的な使用例
```typescript
// MCPサーバー経由での使用
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

const client = new Client({
  name: "my-app",
  version: "1.0.0"
});

// ユーザープロンプトの最適化
const result = await client.callTool({
  name: "optimize-user-prompt",
  arguments: {
    prompt: "JavaScriptのasync/awaitについて説明して",
    template: "user-prompt-professional"
  }
});

// システムプロンプトの最適化
const systemResult = await client.callTool({
  name: "optimize-system-prompt",
  arguments: {
    prompt: "あなたは親切なアシスタントです",
    requirementsOrExamples: "技術的な質問に正確に答える"
  }
});
```

### 高度な使い方
```yaml
# docker-compose.yml - 企業向けデプロイメント
version: "3.8"
services:
  prompt-optimizer:
    image: linshen/prompt-optimizer:latest
    environment:
      # APIキー設定（オプション）
      - VITE_OPENAI_API_KEY=${OPENAI_API_KEY}
      - VITE_GEMINI_API_KEY=${GEMINI_API_KEY}
      - VITE_DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
      # アクセス制御
      - ACCESS_PASSWORD=${ACCESS_PASSWORD}
      # カスタムAPI設定
      - VITE_CUSTOM_BASE_URL=https://api.company.com/v1
      - VITE_CUSTOM_API_KEY=${CUSTOM_API_KEY}
    ports:
      - "8080:80"
    volumes:
      - ./data:/app/data  # データ永続化
    restart: unless-stopped

# カスタムテンプレートの作成例
const customTemplate = {
  id: "custom-technical-writing",
  name: "技術文書最適化",
  description: "技術文書向けのプロンプト最適化",
  template: [
    {
      role: "system",
      content: "技術文書のためのプロンプトを最適化してください。"
    },
    {
      role: "user",
      content: `以下のプロンプトを技術文書作成に適した形に最適化してください：
{{originalPrompt}}

要件：
- 明確な構造
- 技術的正確性
- 再現可能性`
    }
  ]
};
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要（中国語）
- **README_EN.md**: プロジェクト概要（英語）
- **docs/**: 開発経験や設計決定の詳細ドキュメント
- **dev.md**: 開発者向けガイド
- **公式サイト**: https://prompt.always200.com

### サンプル・デモ
- **オンラインデモ**: https://prompt.always200.com
- **デモ例**: 
  - ロールプレイ（猫メイド）
  - ナレッジグラフ抽出
  - 詩作成アシスタント

### チュートリアル・ガイド
- セットアップガイド（README内）
- テンプレート作成ガイド
- API統合ガイド
- MCPプロトコル統合ガイド

## 技術的詳細
### アーキテクチャ
#### 全体構造
モノレポ構造を採用し、複数のパッケージで構成。コアロジックを共有しながら、各プラットフォーム向けに最適化されたアプリケーションを提供。

#### ディレクトリ構成
```
prompt-optimizer/
├── packages/               # モノレポパッケージ
│   ├── core/              # ビジネスロジック層
│   │   ├── services/      # コアサービス
│   │   │   ├── prompt/    # 最適化ロジック
│   │   │   ├── llm/       # LLM統合
│   │   │   ├── template/  # テンプレート管理
│   │   │   ├── model/     # モデル設定
│   │   │   └── storage/   # ストレージアダプタ
│   │   └── constants/     # 定数定義
│   ├── ui/                # 共有UIコンポーネント
│   ├── web/               # Webアプリケーション
│   ├── desktop/           # Electronアプリ
│   ├── extension/         # Chrome拡張機能
│   └── mcp-server/        # MCPサーバー
├── api/                   # Vercelプロキシ
└── docs/                  # ドキュメント
```

#### 主要コンポーネント
- **PromptService**: プロンプト最適化のコアロジック
  - 場所: `packages/core/src/services/prompt/`
  - 依存: LLMService、TemplateManager
  - インターフェース: optimizePrompt、iteratePrompt

- **LLMService**: 各種AIプロバイダーとの統合
  - 場所: `packages/core/src/services/llm/`
  - 依存: 各プロバイダーSDK
  - インターフェース: sendMessage、streamMessage

- **MCPServer**: Model Context Protocol実装
  - 場所: `packages/mcp-server/`
  - 依存: Express、MCP SDK
  - インターフェース: 3つのツール（optimize-user-prompt等）

### 技術スタック
#### コア技術
- **言語**: TypeScript 5.8.2
- **フレームワーク**: Vue 3.5.13
- **主要ライブラリ**: 
  - Element Plus 2.3.1: UIコンポーネント
  - Electron 37.1.0: デスクトップアプリ
  - Dexie 4.0.11: IndexedDBラッパー
  - OpenAI SDK 4.83.0: OpenAI API
  - Google Generative AI 0.21.0: Gemini API
  - Handlebars 4.7.8: テンプレート処理

#### 開発・運用ツール
- **ビルドツール**: Vite、pnpm workspaces
- **テスト**: Vitest
- **CI/CD**: GitHub Actions
- **デプロイ**: Docker、Vercel、nginx

### 設計パターン・手法
- サービス層パターン（ビジネスロジックの分離）
- アダプターパターン（ストレージ、LLMプロバイダー）
- テンプレートメソッドパターン（最適化戦略）
- シングルトンパターン（サービスインスタンス）

### データフロー・処理フロー
1. ユーザーがプロンプトを入力
2. 最適化モードとテンプレートを選択
3. PromptServiceが最適化リクエストを処理
4. テンプレートプロセッサがコンテキストを準備
5. LLMServiceが選択されたモデルに送信
6. ストリーミングまたは通常応答で結果を返却
7. 履歴サービスが結果を保存

## API・インターフェース
### 公開API
#### MCPツール
- 目的: プログラマティックなプロンプト最適化
- 使用例:
```json
// optimize-user-prompt
{
  "prompt": "天気を教えて",
  "template": "user-prompt-basic"
}

// optimize-system-prompt
{
  "prompt": "あなたはアシスタントです",
  "requirementsOrExamples": "技術的な質問に答える"
}

// iterate-prompt
{
  "prompt": "現在のプロンプト",
  "requirements": "より詳細に、専門的に"
}
```

### 設定・カスタマイズ
#### 環境変数設定
```bash
# APIキー設定
VITE_OPENAI_API_KEY=sk-xxx
VITE_GEMINI_API_KEY=xxx
VITE_DEEPSEEK_API_KEY=xxx

# カスタムAPI
VITE_CUSTOM_BASE_URL=https://api.example.com/v1
VITE_CUSTOM_API_KEY=xxx
VITE_CUSTOM_MODELS=gpt-4,claude-3

# アクセス制御
ACCESS_PASSWORD=secure_password

# プロキシ設定
VITE_USE_PROXY=true
```

#### 拡張・プラグイン開発
- カスタムテンプレートの作成
- 新しいLLMプロバイダーの追加
- ストレージアダプターの実装
- UIコンポーネントのカスタマイズ

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ストリーミング応答対応（リアルタイムフィードバック）
- 遅延ローディング（テンプレート）
- サービスシングルトン（リソース効率）
- 設定可能なタイムアウト（通常60秒、ストリーミング90秒）
- リトライロジック（通常3回、ストリーミング2回）

### スケーラビリティ
- 完全なクライアントサイド処理（サーバー負荷なし）
- マルチストレージアダプター対応
- 水平スケール可能なMCPサーバー
- CDN対応の静的アセット

### 制限事項
- ブラウザのストレージ容量制限（IndexedDB）
- CORS制限（オンライン版）
- APIレート制限（各プロバイダー依存）

## 評価・所感
### 技術的評価
#### 強み
- 包括的なマルチプラットフォーム対応
- 優れたユーザーインターフェース
- 豊富なテンプレートシステム
- 完全なプライバシー保護（ローカル処理）
- 活発な開発とアップデート
- 良好なドキュメント

#### 改善の余地
- 英語ドキュメントの充実
- より多くのAIプロバイダー対応
- バッチ処理機能
- APIレスポンスのキャッシング

### 向いている用途
- AIプロンプトの品質向上
- 小規模モデルのパフォーマンス改善
- プロダクション環境での安定出力
- プロンプトエンジニアリングの学習
- チームでのプロンプト標準化
- API開発での組み込み（MCPサーバー）

### 向いていない用途
- 大量バッチ処理
- リアルタイムストリーミングアプリケーション
- 極めて低レイテンシーが必要な用途
- オフライン完全対応が必要な環境

### 総評
prompt-optimizerは、AIプロンプトエンジニアリングの民主化を実現する優れたツールです。特に、プロンプト作成に不慣れなユーザーでも高品質なプロンプトを作成できるようにし、小規模なAIモデルでも良好な結果を得られるようにする点が革新的です。マルチプラットフォーム対応により様々な環境で利用でき、MCPプロトコル対応によりClaude Desktopなどとの統合も可能です。オープンソースでありながら商用利用も可能なMITライセンスを採用し、活発なコミュニティによる開発が続けられている点も評価できます。AIアプリケーション開発において、プロンプトの品質向上は必須の要素であり、このツールはその課題に対する実用的なソリューションを提供しています。