# リポジトリ解析: better-auth/better-auth

## 基本情報
- リポジトリ名: better-auth/better-auth
- 主要言語: TypeScript
- スター数: 16,871
- フォーク数: 1,222
- 最終更新: 2025年7月（活発に開発中）
- ライセンス: MIT License
- トピックス: authentication, typescript, auth, oauth, 2fa, passkeys, organizations, session-management

## 概要
### 一言で言うと
TypeScript向けの最も包括的な認証・認可フレームワークで、あらゆるフレームワークに対応し、エンタープライズレベルの機能を型安全に提供。

### 詳細説明
Better Authは、フレームワークに依存しない包括的な認証ソリューションです。メール/パスワード認証から、OAuth、2FA、パスキー、組織管理まで、現代のWebアプリケーションに必要なすべての認証機能を提供します。特筆すべきは、完全なTypeScript型安全性と、20以上の公式プラグインによる拡張性です。React、Vue、Svelte、Next.js、Nuxt、SvelteKitなど、主要なフレームワークすべてに公式対応し、エンタープライズグレードの機能を簡単に実装できます。

### 主な特徴
- フレームワーク非依存で、あらゆるTypeScript/JavaScriptフレームワークに対応
- 25以上のソーシャルプロバイダー対応（Google、GitHub、Facebook、Twitter等）
- 包括的なセキュリティ機能（2FA、パスキー、CAPTCHA、パスワード漏洩検出）
- エンタープライズ機能（組織管理、RBAC、SSO、OIDC）
- 20以上の公式プラグインによる機能拡張
- 完全な型安全性とTypeScriptファーストの設計
- 複数のデータベース対応（SQLite、PostgreSQL、MySQL、MongoDB）
- CLI提供による簡単なセットアップとマイグレーション

## 使用方法
### インストール
#### 前提条件
- Node.js 18+
- TypeScript 5.0+（推奨）
- データベース（SQLite/PostgreSQL/MySQL/MongoDB）
- 対応フレームワーク（任意）

#### インストール手順
```bash
# 方法1: npm経由
npm install better-auth

# 方法2: pnpm経由（推奨）
pnpm add better-auth

# 方法3: yarn経由
yarn add better-auth

# CLIツールのインストール（オプション）
npm install -g @better-auth/cli
```

### 基本的な使い方
#### Hello World相当の例
```typescript
// auth.ts - サーバーサイド設定
import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

export const auth = betterAuth({
  database: new Database("./sqlite.db"),
  emailAndPassword: {
    enabled: true,
  },
});

// APIルートのマウント
// Next.jsの例: app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

#### 実践的な使用例
```typescript
// クライアントサイド使用
import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient({
  baseURL: "http://localhost:3000/api/auth",
});

// ユーザー登録
const { data, error } = await authClient.signUp.email({
  email: "user@example.com",
  password: "secure-password",
  name: "John Doe",
});

// ログイン
const { data: session } = await authClient.signIn.email({
  email: "user@example.com",
  password: "secure-password",
});

// ソーシャルログイン
await authClient.signIn.social({
  provider: "google",
  callbackURL: "/dashboard",
});

// セッション取得
const session = await authClient.getSession();
```

### 高度な使い方
```typescript
// プラグインを使用した高度な設定
import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins/organization";
import { twoFactor } from "better-auth/plugins/two-factor";
import { passkey } from "better-auth/plugins/passkey";
import { admin } from "better-auth/plugins/admin";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  
  // 複数の認証方法
  emailAndPassword: { enabled: true },
  phoneNumber: { enabled: true },
  username: { enabled: true },
  
  // ソーシャルプロバイダー
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  
  // プラグイン
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 5,
    }),
    twoFactor({
      issuer: "My App",
    }),
    passkey(),
    admin({
      defaultRole: "admin",
    }),
  ],
  
  // カスタムセッションデータ
  session: {
    cookieName: "my-app-session",
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    freshAge: 60 * 60 * 24, // 1 day
  },
  
  // フック
  hooks: {
    after: [
      {
        matcher: (context) => context.path === "/sign-up",
        handler: async (context) => {
          // ユーザー登録後の処理
          await sendWelcomeEmail(context.body.email);
        },
      },
    ],
  },
});
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、クイックスタート、機能一覧
- **公式サイト**: https://better-auth.com - 包括的なドキュメント
- **docs/ディレクトリ**: Fumadocsを使用したドキュメントサイトのソース
- **APIリファレンス**: 完全なTypeScript型定義付き

### サンプル・デモ
- **examples/nextjs-example**: Next.js App Router統合例
- **examples/remix-example**: Remixフレームワーク統合
- **examples/sveltekit-example**: SvelteKit統合
- **examples/solid-start-example**: SolidStart統合
- **examples/nuxt-example**: Nuxt 3統合
- **examples/expo-example**: React Native/Expo統合
- **demo/**: 完全機能デモアプリケーション

### チュートリアル・ガイド
- クイックスタートガイド
- フレームワーク別統合ガイド
- プラグイン使用ガイド
- データベースアダプターガイド
- Discordコミュニティサポート

## 技術的詳細
### アーキテクチャ
#### 全体構造
Better Authはモノリポ構成で、コアライブラリ、CLI、フレームワーク統合、プラグインを別パッケージとして管理。プラグインアーキテクチャにより、コア機能を最小限に保ちながら、必要な機能を柔軟に追加可能。

#### ディレクトリ構成
```
better-auth/
├── packages/
│   ├── better-auth/      # コア認証ライブラリ
│   │   ├── src/
│   │   │   ├── auth/     # 認証コアロジック
│   │   │   ├── client/   # クライアントSDK
│   │   │   ├── db/       # データベースアダプター
│   │   │   ├── plugins/  # プラグインシステム
│   │   │   ├── social/   # ソーシャルプロバイダー
│   │   │   └── utils/    # ユーティリティ
│   │   └── plugins/      # 公式プラグイン集
│   ├── cli/              # CLIツール
│   ├── expo/             # Expo/React Native統合
│   ├── sso/              # SSO機能
│   └── stripe/           # Stripe課金統合
├── examples/             # フレームワーク別サンプル
├── demo/                 # フル機能デモ
└── docs/                 # ドキュメントサイト
```

#### 主要コンポーネント
- **Auth Core**: 認証ロジックの中核
  - 場所: `packages/better-auth/src/auth/`
  - 依存: Zod（バリデーション）、Jose（JWT）
  - インターフェース: createAuth()、handleRequest()

- **Client SDK**: クライアントサイドSDK
  - 場所: `packages/better-auth/src/client/`
  - 依存: nanostores（状態管理）、better-fetch
  - インターフェース: createAuthClient()、useSession()

- **Plugin System**: プラグインアーキテクチャ
  - 場所: `packages/better-auth/src/plugins/`
  - 依存: コアAPI、フックシステム
  - インターフェース: definePlugin()、hooks API

### 技術スタック
#### コア技術
- **言語**: TypeScript 5.6.1-rc (完全な型安全性、ジェネリック活用)
- **ランタイム**: Node.js 18+ （ESMサポート）
- **主要ライブラリ**: 
  - Zod (3.23.8): スキーマ検証と型生成
  - Jose (5.9.6): JWTハンドリング
  - nanostores (0.11.3): 軽量状態管理
  - better-fetch (2.0.2): TypeScript対応 HTTPクライアント
  - @noble/hashes: 暗号化ユーティリティ
  - @simplewebauthn/server: WebAuthn/パスキーサポート

#### 開発・運用ツール
- **ビルドツール**: 
  - pnpmワークスペース（モノリポ管理）
  - Turbo（ビルドキャッシュと並列化）
  - tsup（TypeScriptバンドル）
  - Biome（リントとフォーマット）
- **テスト**: 
  - Vitest（単体テスト）
  - 統合テスト（各フレームワーク統合）
  - E2Eテスト（デモアプリケーション）
- **CI/CD**: 
  - GitHub Actions（テスト、ビルド、リリース）
  - Changesets（バージョン管理）
- **デプロイ**: 
  - npmパッケージレジストリ
  - Dockerサポート（開発環境）

### 設計パターン・手法
- **プラグインアーキテクチャ**: コア機能を最小限にし、プラグインで拡張
- **アダプターパターン**: データベースやフレームワークの抽象化
- **フックシステム**: 認証フローの各ポイントでカスタマイズ可能
- **ファクトリーパターン**: 各プロバイダーの生成
- **ミドルウェアパターン**: リクエスト/レスポンスの処理パイプライン

### データフロー・処理フロー
1. **認証フロー**
   - クライアントから認証リクエスト
   - ミドルウェアでリクエスト検証
   - プロバイダーによる認証処理
   - セッション/トークン生成
   - データベース保存
   - フック実行（afterフック）

2. **セッション管理**
   - Cookieベースセッション
   - JWTトークン（オプション）
   - セッションリフレッシュ
   - マルチセッションサポート

3. **プラグインパイプライン**
   - プラグイン初期化
   - ルート拡張
   - スキーマ拡張
   - フック登録
   - クライアント拡張

## API・インターフェース
### 公開API
#### サーバーAPI
- 目的: 認証インスタンスの作成と設定
- 使用例:
```typescript
import { betterAuth } from "better-auth";

const auth = betterAuth({
  database: databaseAdapter,
  // オプション
});

// APIルートへのマウント
app.all("/api/auth/*", (req, res) => {
  return auth.handler(req, res);
});
```

#### クライアントAPI
- 目的: フロントエンドからの認証操作
- 使用例:
```typescript
import { createAuthClient } from "better-auth/client";

const client = createAuthClient();

// Reactフック
const { data: session, error } = client.useSession();

// メソッド呼び出し
await client.signIn.email({ email, password });
await client.signOut();
```

### 設定・カスタマイズ
#### 設定ファイル
```typescript
// auth.config.ts
export const authConfig = {
  // データベース
  database: {
    type: "postgresql",
    url: process.env.DATABASE_URL,
  },
  
  // セッション設定
  session: {
    cookieName: "auth-session",
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 24 hours
  },
  
  // メール設定
  email: {
    from: "noreply@example.com",
    sendVerificationEmail: true,
  },
  
  // レート制限
  rateLimit: {
    window: 15 * 60, // 15 minutes
    max: 10,
  },
};
```

#### 拡張・プラグイン開発
```typescript
// カスタムプラグインの作成
import { definePlugin } from "better-auth";

export const myPlugin = definePlugin({
  id: "my-plugin",
  init(ctx) {
    // 初期化処理
  },
  hooks: {
    before: [
      {
        matcher: (ctx) => ctx.path === "/sign-up",
        handler: async (ctx) => {
          // サインアップ前の処理
        },
      },
    ],
    after: [
      {
        matcher: (ctx) => ctx.path === "/sign-in",
        handler: async (ctx) => {
          // サインイン後の処理
        },
      },
    ],
  },
  // ルート拡張
  routes: [
    {
      path: "/custom-endpoint",
      method: "POST",
      handler: async (ctx) => {
        // カスタムエンドポイント
      },
    },
  ],
});
```

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- **軽量コア**: プラグイン非使用時は最小バンドルサイズ
- **最適化手法**: 
  - Tree-shaking対応で未使用コード除去
  - 遅延ロードによるプラグイン
  - データベースクエリ最適化
  - セッションキャッシュ

### スケーラビリティ
- **水平スケーリング**: 
  - ステートレス設計で複数インスタンス対応
  - Redisセッションストア対応（プラグイン）
- **マルチテナント**: 
  - 組織プラグインで完全分離
  - テナントごとのセッション管理
- **データベース対応**: 
  - 複数DB対応で柔軟なスケーリング
  - コネクションプーリング対応

### 制限事項
- **技術的な制限**:
  - Node.js環境が必須（ブラウザのみでは動作不可）
  - TypeScriptファーストのためJavaScriptのみのプロジェクトでは型情報が失われる
  - セッションベース認証がデフォルト（JWTはオプション）
- **運用上の制限**:
  - プラグインの組み合わせによっては設定が複雑化
  - マイグレーションはCLIサポートあるが手動確認が必要
  - エンタープライズサポートはコミュニティ版のみ

## 評価・所感
### 技術的評価
#### 強み
- **包括的な機能セット**: 認証に必要なすべての機能を1つのパッケージで提供
- **優れた開発体験**: 完全な型安全性とTypeScriptファーストの設計
- **真のフレームワーク非依存**: あらゆるJavaScript/TypeScriptフレームワークで動作
- **豊富なプラグインエコシステム**: 20以上の公式プラグインで機能拡張が容易
- **エンタープライズ対応**: 組織管理、SSO、RBAC等の高度な機能を標準提供

#### 改善の余地
- **ドキュメントの成熟度**: 比較的新しいプロジェクトのため、一部ドキュメントが不足
- **コミュニティサイズ**: Auth0やFirebase Authと比較してコミュニティが小規模
- **マイグレーション管理**: データベーススキーマの変更管理がやや手動的
- **パフォーマンス最適化**: 大規模環境での実績がまだ限定的

### 向いている用途
- **新規プロジェクト**: TypeScriptベースの新規Webアプリケーション
- **マルチテナントSaaS**: 組織管理機能が必要なB2Bアプリケーション
- **フルスタック開発**: フロントエンド・バックエンド統合が必要なプロジェクト
- **セキュリティ重視**: 2FA、パスキー等の高度なセキュリティが必要な場合
- **カスタマイズ重視**: 認証フローを細かくカスタマイズしたい場合

### 向いていない用途
- **レガシーシステム**: JavaScript/TypeScript以外の言語がメインの環境
- **サーバーレス限定**: Vercel Edge Functions等の制限された環境
- **最小構成**: 単純なメール/パスワード認証のみで十分な場合
- **エンタープライズ統合**: 既存のSAML/LDAP等との複雑な統合が必要な場合

### 総評
Better Authは、現代のWebアプリケーション開発に必要な認証機能を包括的に提供する優れたフレームワークです。TypeScriptファーストの設計により、型安全性を保ちながら複雑な認証要件を実装できます。特に注目すべきは、フレームワーク非依存でありながら主要なフレームワークすべてに公式対応している点です。プラグインシステムにより、必要な機能だけを選択的に使用でき、バンドルサイズの最適化も可能です。比較的新しいプロジェクトですが、活発な開発と充実した機能セットにより、Auth0やSupabase Authの有力な代替となる可能性を秘めています。