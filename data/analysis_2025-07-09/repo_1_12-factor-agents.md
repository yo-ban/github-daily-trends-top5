# リポジトリ解析: humanlayer/12-factor-agents

## 基本情報
- リポジトリ名: humanlayer/12-factor-agents
- 主要言語: TypeScript
- スター数: 7,628
- フォーク数: 482
- 最終更新: 2025年頃（バージョン1.0, v1.1ブランチあり）
- ライセンス: Apache License 2.0（コード）、CC BY-SA 4.0（コンテンツ）
- トピックス: AI Agents, LLM Applications, Software Engineering, Agent Frameworks, Context Engineering

## 概要
### 一言で言うと
LLMを使った本番環境で利用可能なアプリケーションを構築するための12の設計原則を提供するガイドおよびフレームワーク。

### 詳細説明
12-Factor Agentsは、HumanLayerの創業者であるDex氏によって作成された、AIエージェント構築のベストプラクティス集です。「12 Factor Apps」の精神に基づき、LLMベースのソフトウェアを本番環境の顧客に提供できる品質まで高めるための実践的な原則を提供します。

多くの開発者がAIエージェントフレームワークを使用して70-80%の品質まで到達するものの、本番環境に必要な品質レベルに達せず、結局ゼロから作り直すという問題を解決することを目的としています。モジュール式のコンセプトを既存のプロダクトに組み込むことで、高品質なAIソフトウェアを迅速に開発できるようになります。

### 主な特徴
- 12の明確な設計原則による体系的なアプローチ
- 実践的なTypeScriptとPythonのコード例
- BAMLとHumanLayerを活用した具体的な実装方法
- ワークショップ形式の段階的なチュートリアル
- フレームワークに依存しない、モジュール式の概念
- コンテキストエンジニアリングの重要性を強調
- 人間とのインタラクションを組み込んだエージェント設計

## 使用方法
### インストール
#### 前提条件
- Node.js/TypeScript環境（サンプルコードの多くがTypeScript）
- npm/pnpm/yarnなどのパッケージマネージャー
- BAMLツールチェーン（プロンプト管理用）
- HumanLayer SDK（人間の承認機能用）

#### インストール手順
```bash
# 方法1: ワークショップの例を使用
cd workshops/2025-05/final
npm install

# 必要な依存関係
npm install baml express humanlayer tsx typescript

# 開発依存関係
npm install -D @types/express @types/node eslint
```

### 基本的な使い方
#### Hello World相当の例
```typescript
// Factor 1: 自然言語をツール呼び出しに変換
import { b } from "./baml_client";

const nextStep = await b.DetermineNextStep(
  "create a payment link for $750 to Jeff for sponsoring the february AI tinkerers meetup"
);

if (nextStep.function === 'create_payment_link') {
    stripe.paymentlinks.create(nextStep.parameters);
}
```

#### 実践的な使用例
```typescript
// Factor 3: コンテキストウィンドウの管理
export class Thread {
    events: Event[] = [];

    serializeForLLM() {
        // カスタムシリアライゼーション（XML形式など）
        return this.events.map(event => 
            `<${event.type}>\n${JSON.stringify(event.data)}\n</${event.type}>`
        ).join('\n\n');
    }
}

// エージェントループ
export async function agentLoop(thread: Thread): Promise<AgentResponse> {
    const nextStep = await b.DetermineNextStep(thread.serializeForLLM());
    thread.events.push(nextStep);
    
    if (nextStep.intent === 'done_for_now') {
        return nextStep;
    }
    
    const result = await executeStep(nextStep);
    thread.events.push(result);
    
    return agentLoop(thread); // 再帰的に実行
}
```

### 高度な使い方
```typescript
// Factor 7: ツール呼び出しで人間と連絡を取る
class RequestHumanInput {
  intent: "request_human_input"
  question: string
  context: string
  options: {
    urgency: "low" | "medium" | "high"
    format: "free_text" | "yes_no" | "multiple_choice"
    choices?: string[]
  }
}

// HumanLayerを使用した承認フロー
import { HumanLayer } from 'humanlayer';

const hl = new HumanLayer({ apiKey: process.env.HUMANLAYER_API_KEY });

@hl.require_approval()
export async function deployToProduction(version: string) {
    // 本番デプロイの実行
    return await kubernetes.deploy('production', version);
}

// エージェント内での使用
if (nextStep.intent === 'deploy_to_production') {
    const approval = await deployToProduction(nextStep.version);
    thread.events.push({ type: 'deployment_result', data: approval });
}
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクトの概要と12の原則のリスト
- **content/factor-*.md**: 各原則の詳細な説明とコード例
- **content/brief-history-of-software.md**: エージェント開発の歴史的背景
- **Wiki/サイト**: https://humanlayer.dev (HumanLayer公式サイト)

### サンプル・デモ
- **workshops/2025-05/**: 段階的なワークショップチュートリアル
  - 00-hello-world: 基本的なセットアップ
  - 01-cli-and-agent: CLIとエージェントの基本
  - 02-calculator-tools: ツール定義の例
  - 03-tool-loop: エージェントループの実装
  - 11-humanlayer-approval: 人間の承認フローの実装
- **mailcrew agent**: https://github.com/dexhorthy/mailcrew (実践例)

### チュートリアル・ガイド
- AI Engineer World's Fair講演: https://www.youtube.com/watch?v=8kMaTybvDUw
- YouTube詳細解説: https://www.youtube.com/watch?v=yxJDyQ8v6P0
- The Outer Loopブログ: https://theouterloop.substack.com
- Tool Useポッドキャスト出演: https://youtu.be/8bIHcttkOTE

## 技術的詳細
### アーキテクチャ
#### 全体構造
12-Factor Agentsは、エージェントループを中心とした設計パターンを提唱しています。基本的な流れは：
1. LLMが次のステップを決定（ツール呼び出しの生成）
2. 決定論的コードがツールを実行
3. 結果をコンテキストウィンドウに追加
4. 完了まで繰り返し

このループに12の原則を適用することで、本番環境対応のエージェントを構築します。

#### ディレクトリ構成
```
12-factor-agents/
├── content/          # 12の原則の詳細説明
│   ├── factor-01-natural-language-to-tool-calls.md
│   ├── factor-02-own-your-prompts.md
│   └── ... (各factor)
├── workshops/        # 実践的なワークショップ
│   ├── 2025-05/     # 最新のワークショップ
│   │   ├── sections/  # 段階的なチュートリアル
│   │   └── final/     # 完成版のコード
│   └── 2025-05-17/  # 過去のワークショップ
├── img/             # ダイアグラムと画像
└── hack/            # ユーティリティスクリプト
```

#### 主要コンポーネント
- **Thread**: エージェントの状態管理
  - 場所: `workshops/*/src/agent.ts`
  - 依存: Event型、シリアライゼーション機能
  - インターフェース: `serializeForLLM()`, `events[]`

- **BAML Client**: プロンプト管理とLLM呼び出し
  - 場所: `baml_src/*.baml`
  - 依存: OpenAI API、BAML runtime
  - インターフェース: `DetermineNextStep()`, 各種ツール定義

- **Agent Loop**: コアのエージェント実行ロジック
  - 場所: `src/agent.ts`
  - 依存: Thread, BAML Client, Tool実装
  - インターフェース: `agentLoop()`, `executeStep()`

### 技術スタック
#### コア技術
- **言語**: TypeScript 5.x（主要）、Python（サブ）
- **フレームワーク**: Express.js（APIサーバー）、独自のエージェントループ実装
- **主要ライブラリ**: 
  - BAML (^0.0.0): プロンプト管理とLLM呼び出しの構造化
  - HumanLayer (^0.7.7): 人間の承認・フィードバック機能
  - tsx (^4.15.0): TypeScript実行環境
  - Express (^5.1.0): HTTPサーバー実装

#### 開発・運用ツール
- **ビルドツール**: TypeScript Compiler (tsc)、tsx for development
- **テスト**: BAML内蔵のテスト機能、supertest for API testing
- **CI/CD**: 特定のCI/CDパイプラインは提供されていない（プロジェクト依存）
- **デプロイ**: フレームワーク非依存、任意の環境にデプロイ可能

### 設計パターン・手法
- **ステートレスリデューサーパターン**: エージェントをfoldl操作として実装
- **コンテキストエンジニアリング**: LLMへの入力を最適化するカスタムフォーマット
- **ツールとしての構造化出力**: すべての出力をJSON形式で統一
- **イベントソーシング**: すべての操作をイベントとして記録
- **Human-in-the-Loop**: 重要な決定に人間の承認を組み込む

### データフロー・処理フロー
1. **初期イベント**: ユーザー入力、Webhook、Cronなどからトリガー
2. **コンテキスト構築**: Thread内のイベント履歴をLLM用にシリアライズ
3. **LLM決定**: 次のステップ（ツール呼び出し）を決定
4. **ツール実行**: 決定論的コードでツールを実行
5. **結果記録**: 実行結果をThreadに追加
6. **ループ判定**: 完了条件に達するまで2-5を繰り返し
7. **最終応答**: done_for_nowで結果を返す

## API・インターフェース
### 公開API
#### BAML関数定義
- 目的: LLMとの構造化されたやり取り
- 使用例:
```baml
function DetermineNextStep(
    thread: string 
) -> ToolCall | DoneForNow {
    client "openai/gpt-4o"
    prompt #"
        You are working on: {{ thread }}
        What should the next step be?
        {{ ctx.output_format }}
    "#
}
```

#### Express APIエンドポイント
- 目的: Webhookとエージェント実行
- 使用例:
```typescript
app.post('/webhook', async (req, res) => {
  const threadId = req.body.threadId;
  const thread = await loadState(threadId);
  thread.events.push(req.body);
  const result = await agentLoop(thread);
  res.json({ status: 'ok', result });
});
```

### 設定・カスタマイズ
#### 設定ファイル
```typescript
// baml_src/clients.baml
client GPT4 {
  provider "openai"
  options {
    model "gpt-4o"
    api_key env.OPENAI_API_KEY
  }
}

// 環境変数
OPENAI_API_KEY=your-key
HUMANLAYER_API_KEY=your-key
```

#### 拡張・プラグイン開発
- 新しいツールの追加: BAMLファイルに関数定義を追加
- カスタムシリアライゼーション: Thread.serializeForLLM()をオーバーライド
- 承認フローのカスタマイズ: HumanLayerのコールバック実装
- 状態管理の拡張: Threadクラスを継承して機能追加

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ベンチマーク結果: 具体的な数値は提供されていない
- 最適化手法:
  - コンテキストウィンドウの効率的な管理
  - 小さく焦点を絞ったエージェント（Factor 10）
  - エラーのコンパクト化（Factor 9）
  - ステートレス設計による並列処理対応

### スケーラビリティ
- ステートレスリデューサーパターンによる水平スケーリング対応
- 状態管理の外部化（Redis、データベースなど）
- 非同期処理とWebhookベースの統合
- マルチエージェントシステムへの拡張可能

### 制限事項
- LLMのコンテキストウィンドウサイズに依存
- トークンコストの考慮が必要
- リアルタイム性が求められるケースには不向き
- 人間の承認が必要な場合のレイテンシー

## 評価・所感
### 技術的評価
#### 強み
- フレームワークに依存しない、実践的な設計原則
- 段階的に適用可能なモジュール式アプローチ
- 実際の本番環境での経験に基づいた知見
- コンテキストエンジニアリングの重要性を早期から提唱
- 人間とのインタラクションを前提とした現実的な設計

#### 改善の余地
- より多様な言語でのサンプルコード（現在はTypeScript中心）
- パフォーマンスベンチマークやケーススタディの追加
- エンタープライズ環境での適用ガイドライン
- セキュリティやコンプライアンスの考慮事項

### 向いている用途
- SaaSプロダクトへのAI機能の段階的追加
- 既存システムとの統合が必要なエージェント
- 人間の判断が重要な業務プロセスの自動化
- カスタマイズ性と制御性が求められるAIアプリケーション
- プロトタイプから本番環境への移行プロジェクト

### 向いていない用途
- 完全自律型のエージェント（人間の介入なし）
- リアルタイムレスポンスが必須のシステム
- シンプルなチャットボット（オーバーエンジニアリング）
- 標準的なフレームワークで十分なユースケース

### 総評
12-Factor Agentsは、AIエージェント開発の現実的な課題に対する実践的な解決策を提供する優れたリソースです。多くのフレームワークが「魔法の箱」として機能することを目指す中、このプロジェクトは開発者に制御権を与え、段階的に品質を向上させる方法を示しています。特に、既存のプロダクトにAI機能を追加したい開発者や、プロトタイプから本番環境への移行で苦労している開発者にとって非常に価値があります。コンテキストエンジニアリングの概念は業界全体に影響を与えており、先見性のあるプロジェクトと言えるでしょう。