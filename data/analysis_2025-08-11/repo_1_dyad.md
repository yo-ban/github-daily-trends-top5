# リポジトリ解析: dyad-sh/dyad

## 基本情報
- リポジトリ名: dyad-sh/dyad
- 主要言語: TypeScript
- スター数: 12,080
- フォーク数: 1,130
- 最終更新: 2025-08-05
- ライセンス: Apache License 2.0
- トピックス: AI app builder, local-first, no-code, Electron app, v0/Lovable/Bolt alternative

## 概要
### 一言で言うと
Dyadは、ローカルで動作する無料のオープンソースAIアプリビルダーで、コーディング不要でフルスタックWebアプリケーションを構築できるElectronベースのデスクトップアプリケーションです。

### 詳細説明
Dyadは、AIを活用してWebアプリケーションを構築するための革新的なローカルファーストのツールです。v0、Lovable、Boltなどのクラウドベースのサービスと異なり、完全にユーザーのマシン上で動作し、プライバシーとコントロールを重視しています。

ユーザーは自然言語でアプリケーションの要件を記述するだけで、AIがReact/TypeScriptベースのフルスタックアプリケーションを生成します。生成されたコードはすべてローカルに保存され、ユーザーが完全に所有・管理できます。

### 主な特徴
- **ローカルファースト**: すべての処理がローカルで実行され、高速でプライベート
- **ベンダーロックインなし**: 自分のAPIキーを使用（OpenAI、Claude、Gemini等に対応）
- **クロスプラットフォーム**: macOSとWindowsに対応
- **フルスタック対応**: React、TypeScript、Tailwind CSS、shadcn/uiを使用
- **Supabase統合**: 認証、データベース、サーバー関数をサポート
- **リアルタイムプレビュー**: 変更を即座に確認可能
- **バージョン管理**: Gitベースのバージョン管理内蔵
- **AIモデル選択**: 複数のAIプロバイダーとモデルに対応
- **Capacitor対応**: モバイルアプリ開発もサポート

## 使用方法
### インストール
#### 前提条件
- macOSまたはWindows
- AI APIキー（OpenAI、Claude、Geminiなど）
- 開発環境の場合: Node.js >= 20

#### インストール手順
```bash
# 方法1: 公式サイトからダウンロード
# https://www.dyad.sh/#download からプラットフォームに合ったインストーラーをダウンロード

# 方法2: ソースからビルド
git clone https://github.com/dyad-sh/dyad.git
cd dyad
npm install
npm start  # 開発モードで起動
npm run package  # パッケージング
```

### 基本的な使い方
#### Hello World相当の例
1. Dyadを起動
2. 新しいアプリを作成
3. チャットで指示: "Create a simple hello world React app with a button that shows an alert when clicked"
4. AIがコードを生成し、リアルタイムでプレビュー
5. 「Approve」をクリックして変更を適用

#### 実践的な使用例
```typescript
// Dyadが生成する典型的なReactコンポーネントの例
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function TodoList() {
  const [todos, setTodos] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, input]);
      setInput("");
    }
  };

  return (
    <Card className="p-4">
      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
        />
        <Button onClick={addTodo}>Add</Button>
      </div>
      <ul className="space-y-2">
        {todos.map((todo, i) => (
          <li key={i} className="p-2 bg-gray-100 rounded">{todo}</li>
        ))}
      </ul>
    </Card>
  );
}
```

### 高度な使い方

#### Supabase統合の例
1. Supabaseプロジェクトに接続
2. チャットで指示: "Create a user authentication system with Supabase including login, signup, and profile pages"
3. Dyadが自動的に:
   - Supabaseクライアントを設定
   - 認証コンポーネントを作成
   - ルーティングを設定
   - プロフィール管理機能を実装

#### カスタムAIモード
- **Architect Mode**: アプリケーションの全体構造を設計
- **Coder Mode**: 詳細なコード実装にフォーカス
- **Designer Mode**: UI/UXの改善に特化

#### コンテキスト管理
- ファイルや画像をドラッグ&ドロップでコンテキストに追加
- 特定のコンポーネントを選択して編集
- バージョン履歴から任意の時点に戻る

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクトの概要とクイックスタート
- **CONTRIBUTING.md**: 貢献方法、開発環境のセットアップ、テスト方法
- **公式サイト**: https://dyad.sh/ - ダウンロード、料金プラン、詳細情報
- **ドキュメント**: https://www.dyad.sh/docs - 詳細な使用方法とAPIドキュメント

### サンプル・デモ
- **scaffold/**: React + TypeScript + shadcn/uiのテンプレートプロジェクト
- **e2e-tests/fixtures/**: インポート可能なサンプルアプリケーション
  - minimal/: 最小構成のサンプル
  - astro/: Astroフレームワークのサンプル
  - select-component/: コンポーネント選択機能のデモ

### チュートリアル・ガイド
- **AI_RULES.md**: AIがコード生成時に従うルールとベストプラクティス
- **Redditコミュニティ**: r/dyadbuilders - ユーザーコミュニティとサポート

## 技術的詳細
### アーキテクチャ
#### 全体構造
DyadはElectronベースのデスクトップアプリケーションで、以下のコアコンポーネントで構成されています：

- **メインプロセス**: Electronのメインプロセス、IPCハンドラー、ファイルシステム操作
- **レンダラープロセス**: ReactベースのUI、Tanstack Router、Jotaiによる状態管理
- **ワーカープロセス**: TypeScriptコンパイル、プロキシサーバー
- **AIエンジン**: Vercel AI SDKを使用した複数プロバイダー対応

#### ディレクトリ構成
```
dyad/
├── src/              # メインアプリケーションソース
│   ├── atoms/        # Jotaiアトム（グローバル状態管理）
│   ├── components/   # Reactコンポーネント
│   ├── hooks/        # カスタムReactフック
│   ├── ipc/          # Electron IPC通信ロジック
│   ├── pages/        # ルートページコンポーネント
│   ├── prompts/      # AIシステムプロンプト
│   ├── db/           # SQLiteデータベース管理
│   └── utils/        # ユーティリティ関数
├── scaffold/         # テンプレートReactアプリ
├── workers/          # Web Workerスクリプト
├── e2e-tests/        # Playwright E2Eテスト
└── drizzle/          # データベースマイグレーション
```

#### 主要コンポーネント
- **ChatPanel**: ユーザーとAIの対話インターフェース
  - 場所: `src/components/ChatPanel.tsx`
  - 依存: chatAtoms、useStreamChat、DyadMarkdownParser
  - インターフェース: チャット入力、メッセージ表示、コンテキスト管理

- **PreviewPanel**: アプリケーションのリアルタイムプレビュー
  - 場所: `src/components/preview_panel/PreviewPanel.tsx`
  - 依存: PreviewIframe、FileTree、Problems
  - インターフェース: iframe管理、ファイルブラウザ、問題表示

- **IPCハンドラー**: Electronプロセス間通信
  - 場所: `src/ipc/handlers/`
  - 依存: 各種ユーティリティ
  - インターフェース: chat、app、version、settings等のハンドラー

- **AIストリーム処理**: AI応答のストリーミング処理
  - 場所: `src/ipc/handlers/chat_stream_handlers.ts`
  - 依存: Vercel AI SDK、response_processor
  - インターフェース: streamChat、processResponse

### 技術スタック
#### コア技術
- **言語**: TypeScript 5.8.3、ES2022機能を活用
- **フレームワーク**: 
  - Electron 35.1.4: デスクトップアプリケーションフレームワーク
  - React 19.0.0: UIコンポーネント
  - Tanstack Router: ルーティング管理
- **主要ライブラリ**: 
  - Vercel AI SDK (4.3.4): 複数AIプロバイダー対応
  - Jotai (2.12.2): アトミックな状態管理
  - Tailwind CSS (4.1.3): スタイリング
  - shadcn/ui: UIコンポーネントライブラリ
  - Monaco Editor (0.52.2): コードエディター
  - Drizzle ORM (0.41.0): SQLite ORM
  - Better SQLite3 (11.9.1): SQLiteデータベース

#### 開発・運用ツール
- **ビルドツール**: 
  - Vite: 高速ビルドシステム
  - Electron Forge: Electronアプリのパッケージング
- **テスト**: 
  - Vitest: 単体テスト
  - Playwright: E2Eテスト
  - 50+のE2Eテストシナリオ
- **CI/CD**: 
  - GitHub Actions: 自動テストとリリース
  - Electron自動更新機能内蔵
- **デプロイ**: 
  - GitHub Releases: バイナリ配布
  - 自動更新サーバー（api.dyad.sh）

### 設計パターン・手法
- **IPCパターン**: Electron IPCを使用したメイン/レンダラープロセス間通信
- **ストリーム処理**: AI応答をリアルタイムでストリーミング
- **アトミック状態管理**: Jotaiによる細かい状態分割
- **プラグインアーキテクチャ**: AIプロバイダーの動的追加・切り替え

### データフロー・処理フロー
1. **ユーザー入力**: チャットUIからプロンプト入力
2. **コンテキスト収集**: ファイル、画像、選択コンポーネントを追加
3. **AIリクエスト**: IPC経由でメインプロセスにAIリクエスト送信
4. **ストリーム処理**: AI応答をチャンク単位で受信し、パース
5. **Dyadタグ処理**: `<dyad-*>`タグを解析してアクション実行
6. **ファイル操作**: ファイルの作成、編集、削除
7. **プレビュー更新**: iframeでリアルタイムプレビュー
8. **バージョン保存**: Gitで変更をコミット

## API・インターフェース
### 公開API
#### IPCインターフェース
- 目的: レンダラープロセスからメインプロセスへの通信
- 主要なAPI:
  - `streamChat`: AIとのチャットストリーム
  - `loadApp`: アプリケーションの読み込み
  - `runApp`: アプリケーションの実行
  - `checkoutVersion`: バージョンの切り替え
  - `updateFile`: ファイルの更新

#### DyadタグAPI
- 目的: AIが生成するアクションの定義
- 使用例:
```typescript
// AIが生成するタグの例
<dyad-write path="src/App.tsx">
export function App() {
  return <div>Hello World</div>;
}
</dyad-write>

<dyad-edit path="src/index.tsx" startLine={5} endLine={10}>
// 編集内容
</dyad-edit>

<dyad-delete path="src/old-file.ts" />
```

### 設定・カスタマイズ
#### 設定ファイル
```json
// settings.json
{
  "telemetryOptedIn": true,
  "enableAutoUpdate": true,
  "releaseChannel": "stable", // or "beta"
  "autoApprove": false,
  "autoFixProblems": false,
  "chatMode": "architect", // or "coder", "designer"
  "maxChatTurns": 50,
  "thinkingBudget": 50000
}
```

#### 拡張・プラグイン開発
- **カスタムAIプロバイダー**: APIキーとエンドポイントを設定して独自AIを追加
- **AI_RULES.md**: プロジェクト固有のAIルールを定義
- **テンプレートカスタマイズ**: scaffold/ディレクトリを編集

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- **起動時間**: Electronアプリとして標準的
- **メモリ使用量**: 約300-500MB（アプリケーション規模による）
- **リアルタイムプレビュー**: ホットリロードで即座に反映
- **AI応答速度**: 使用するAIプロバイダーに依存

### スケーラビリティ
- **ローカル実行**: マシンの性能に依存
- **プロジェクトサイズ**: Gitで管理可能な範囲内で制限なし
- **同時アプリ数**: 複数アプリを同時管理可能

### 制限事項
- **プラットフォーム**: macOSとWindowsのみ（Linux未対応）
- **AIモデル**: APIキーが必要（無料枠には制限あり）
- **ネットワーク**: AI APIへのアクセスにインターネット接続必要

## 評価・所感
### 技術的評価
#### 強み
- **完全なローカル制御**: コード、データ、APIキーすべてがローカル
- **洗練されたUI/UX**: Reactとshadcn/uiによるモダンなインターフェース
- **即座に動作するアプリ**: 生成されたコードがすぐに実行可能
- **AIモデルの柔軟性**: 複数のプロバイダーとモデルに対応
- **実用的な統合**: Supabase、GitHub、Vercelとのシームレスな連携

#### 改善の余地
- **Linuxサポート**: 現在はmacOS/Windowsのみ
- **チームコラボレーション**: 複数人での同時編集機能
- **カスタムテンプレートの拡充**: より多様なスターターテンプレート

### 向いている用途
- **プロトタイプ開発**: アイデアを素早く形にする
- **MVP作成**: スタートアップや個人プロジェクト
- **学習ツール**: React/TypeScriptの学習や実験
- **社内ツール開発**: 特定の業務用Webアプリ
- **AIアシスト開発**: プロ開発者の生産性向上ツール

### 向いていない用途
- **大規模エンタープライズアプリ**: 複雑なビジネスロジックには限界
- **ネイティブモバイルアプリ**: Capacitor経由でのみ対応
- **リアルタイムコラボレーション**: チーム開発機能は未実装

### 総評
Dyadは、AIを活用したWebアプリケーション開発を民主化する革新的なツールです。v0やBoltなどのクラウドサービスと異なり、完全なローカル制御とプライバシーを提供しながら、プロフェッショナルな品質のアプリケーションを生成できます。

特に注目すべきは、オープンソースでありながら洗練されたUXを実現し、実用的な機能（Supabase統合、バージョン管理、リアルタイムプレビュー）を備えている点です。AIアシスト開発ツールの新しいスタンダードを示しています。