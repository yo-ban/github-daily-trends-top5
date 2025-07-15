# リポジトリ解析: vercel/commerce

## 基本情報
- リポジトリ名: vercel/commerce
- 主要言語: TypeScript
- スター数: 13,148
- フォーク数: 4,880
- 最終更新: 活発に更新中（Next.js最新版対応）
- ライセンス: MIT License
- トピックス: next.js, e-commerce, shopify, react, typescript, vercel, headless-commerce, server-components

## 概要
### 一言で言うと
Next.js CommerceはVercelが提供する高性能なサーバーレンダリングEコマースアプリケーションのテンプレートで、最新のNext.js App RouterとReact Server Componentsを活用しています。

### 詳細説明
Next.js Commerceは、モダンなEコマースサイトを構築するための包括的なスターターキットです。このテンプレートは、React Server Components、Server Actions、Suspense、useOptimisticなど、React 19とNext.js 15の最新機能を活用して、高速でインタラクティブなショッピング体験を提供します。

主にShopifyをバックエンドとして使用しますが、アーキテクチャは抽象化されており、他のコマースプロバイダー（BigCommerce、Medusa、Saleorなど）にも対応できるよう設計されています。Vercelは、コマースプロバイダーと協力して、同様のテンプレートを開発・公開することを推奨しています。

### 主な特徴
- Next.js App Routerを使用した最新のアーキテクチャ
- React Server Components（RSC）による効率的なサーバーサイドレンダリング
- Server Actionsを使用したフォーム処理とデータ更新
- Suspenseによる段階的なページレンダリング
- useOptimisticによる楽観的UI更新
- Tailwind CSSによるレスポンシブデザイン
- TypeScriptによる型安全性
- ShopifyのStorefront APIとの統合
- カート機能、商品検索、コレクション表示などの基本的なEコマース機能
- 実験的機能（PPR、Inline CSS、useCache）のサポート

## 使用方法
### インストール
#### 前提条件
- Node.js 18.17以上
- pnpm（推奨）またはnpm/yarn
- Shopifyストアとストアフロントアクセストークン
- Vercelアカウント（デプロイ用）

#### インストール手順
```bash
# 方法1: Vercelでワンクリックデプロイ
# https://vercel.com/new/clone から直接デプロイ

# 方法2: ローカル開発環境の構築
# 1. Vercel CLIをインストール
npm i -g vercel

# 2. リポジトリをクローン
git clone https://github.com/vercel/commerce.git
cd commerce

# 3. Vercelプロジェクトとリンク
vercel link

# 4. 環境変数をダウンロード
vercel env pull

# 5. 依存関係をインストール
pnpm install

# 6. 開発サーバーを起動
pnpm dev
```

### 基本的な使い方
#### 環境変数の設定
```bash
# .env.example をコピーして .env を作成
# 以下の必須環境変数を設定
COMPANY_NAME="Your Company"
SITE_NAME="Your Store"
SHOPIFY_STORE_DOMAIN="your-store.myshopify.com"
SHOPIFY_STOREFRONT_ACCESS_TOKEN="your-token"
SHOPIFY_REVALIDATION_SECRET="your-secret"
```

#### 実践的な使用例
```typescript
// 商品一覧の取得例 (lib/shopify/index.ts)
export async function getProducts({
  query,
  reverse,
  sortKey
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    variables: {
      query,
      reverse,
      sortKey
    }
  });
  return reshapeProducts(res.body.data.products);
}

// Server Componentでの使用例
export default async function Page() {
  const products = await getProducts({});
  return <ProductGrid products={products} />;
}
```

### 高度な使い方
```typescript
// Server Actionsを使用したカート操作の例
// components/cart/actions.ts
'use server';

export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined
) {
  let cartId = cookies().get('cartId')?.value;

  if (!cartId || !selectedVariantId) {
    return 'Error adding item to cart';
  }

  try {
    await addToCart(cartId, [{ 
      merchandiseId: selectedVariantId, 
      quantity: 1 
    }]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error adding item to cart';
  }
}

// クライアントコンポーネントでの使用
const [message, formAction] = useActionState(addItem, null);
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクトの概要、セットアップ手順、プロバイダー情報
- **Vercel Integration Guide**: https://vercel.com/docs/integrations/ecommerce/shopify - Shopifyとの統合ガイド
- **デモサイト**: https://demo.vercel.store - 実際に動作するデモ
- **.env.example**: 環境変数の設定例

### サンプル・デモ
- **メインデモ**: https://demo.vercel.store - Shopify版の公式デモ
- **代替プロバイダーのデモ**: 各プロバイダーのGitHubリポジトリに記載
- **統合デモ**: Orama（検索強化）、React Bricks（CMS統合）

### チュートリアル・ガイド
- Vercel & Shopify統合ガイド
- Next.js App Routerドキュメント
- React Server Componentsガイド
- Tailwind CSS設定とカスタマイズ

## 技術的詳細
### アーキテクチャ
#### 全体構造
Next.js Commerceは、モジュラーでスケーラブルなアーキテクチャを採用しています：
- **フロントエンド**: Next.js App Router、React Server Components
- **スタイリング**: Tailwind CSS、CSS Modules
- **データ層**: Shopify Storefront API（GraphQL）
- **状態管理**: React Context API（カート管理）
- **最適化**: 画像最適化、フォント最適化、キャッシング戦略

#### ディレクトリ構成
```
commerce/
├── app/                    # Next.js App Routerページ
│   ├── [page]/            # 動的CMSページ
│   ├── api/               # APIルート
│   ├── product/           # 商品詳細ページ
│   ├── search/            # 検索・コレクションページ
│   └── layout.tsx         # ルートレイアウト
├── components/            # Reactコンポーネント
│   ├── cart/              # カート関連コンポーネント
│   ├── grid/              # グリッドレイアウト
│   ├── layout/            # レイアウトコンポーネント
│   ├── product/           # 商品関連コンポーネント
│   └── icons/             # SVGアイコン
├── lib/                   # ユーティリティとAPI統合
│   ├── shopify/           # Shopify API統合
│   │   ├── fragments/     # GraphQLフラグメント
│   │   ├── mutations/     # GraphQLミューテーション
│   │   └── queries/       # GraphQLクエリ
│   ├── constants.ts       # 定数定義
│   └── utils.ts           # ユーティリティ関数
└── public/                # 静的アセット
```

#### 主要コンポーネント
- **CartProvider**: カート状態の管理
  - 場所: `components/cart/cart-context.tsx`
  - 依存: Shopify API、React Context
  - インターフェース: useCart()、addToCart()、removeFromCart()
  
- **ProductGrid**: 商品グリッド表示
  - 場所: `components/layout/product-grid-items.tsx`
  - 依存: Product型、Grid Layout
  - インターフェース: products prop
  
- **Navbar**: ナビゲーションバー
  - 場所: `components/layout/navbar/`
  - 依存: Menu API、Search、Cart
  - インターフェース: メニュー、検索、カート統合

### 技術スタック
#### コア技術
- **言語**: TypeScript 5.8.2（厳格な型チェック）
- **フレームワーク**: Next.js 15.3.0-canary（App Router、実験的機能含む）
- **主要ライブラリ**: 
  - React 19.0.0: 最新のReact機能
  - Tailwind CSS 4.0.14: ユーティリティファーストCSS
  - @headlessui/react 2.2.0: アクセシブルUIコンポーネント
  - @heroicons/react 2.2.0: SVGアイコンセット
  - clsx 2.1.1: 条件付きクラス名
  - sonner 2.0.1: トースト通知
  - geist 1.3.1: Vercelのフォント

#### 開発・運用ツール
- **ビルドツール**: Next.js内蔵（Turbopack開発モード対応）
- **パッケージマネージャー**: pnpm（推奨）
- **フォーマッター**: Prettier（Tailwind CSS プラグイン付き）
- **デプロイ**: Vercel（ワンクリックデプロイ対応）
- **CI/CD**: GitHub Actions経由でVercel自動デプロイ

### 設計パターン・手法
- **コンポーネント駆動開発**: 再利用可能なUIコンポーネント
- **Server Components優先**: パフォーマンスとSEO最適化
- **Suspenseバウンダリー**: 段階的レンダリング
- **楽観的更新**: useOptimisticフックによるUX向上
- **型安全なAPI統合**: GraphQLとTypeScriptの型生成

### データフロー・処理フロー
1. **データ取得**: Server ComponentsでShopify APIを直接呼び出し
2. **キャッシング**: Next.jsのキャッシュ機能とrevalidateTag
3. **状態管理**: カートはReact Context、その他はサーバー側で管理
4. **更新処理**: Server Actionsで非同期処理とrevalidation

## API・インターフェース
### 公開API
#### Shopify Storefront API統合
- 目的: 商品データ、カート管理、注文処理
- 使用例:
```typescript
// GraphQLクエリの実行
export async function shopifyFetch<T>({
  query,
  variables
}: {
  query: string;
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T }> {
  const result = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': key
    },
    body: JSON.stringify({
      query,
      variables
    }),
    next: { tags: [TAGS.collections, TAGS.products] }
  });
  
  return {
    status: result.status,
    body: await result.json()
  };
}
```

### 設定・カスタマイズ
#### 設定ファイル（next.config.ts）
```typescript
export default {
  experimental: {
    ppr: true,          // Partial Pre-Rendering
    inlineCss: true,    // CSS最適化
    useCache: true      // キャッシュ機能
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{
      protocol: 'https',
      hostname: 'cdn.shopify.com'
    }]
  }
};
```

#### 拡張・プラグイン開発
- 新しいコマースプロバイダー: lib/shopifyディレクトリを置換
- カスタムコンポーネント: componentsディレクトリに追加
- APIエンドポイント: app/api/に新規ルート追加

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- Server Componentsによる初期表示の高速化
- 画像の自動最適化（AVIF、WebP対応）
- Edge Runtimeでの動的レンダリング
- Partial Pre-Rendering（実験的機能）
- インラインCSS（実験的機能）による初期レンダリング最適化

### スケーラビリティ
- Vercelのエッジネットワークでグローバル配信
- 自動スケーリング（サーバーレス）
- CDNキャッシングによる負荷分散
- インクリメンタル静的再生成（ISR）対応

### 制限事項
- Shopify APIレート制限への対応が必要
- 大規模カタログでのパフォーマンス考慮
- カスタムチェックアウトフローは別途実装要

## 評価・所感
### 技術的評価
#### 強み
- 最新のReact/Next.js機能を活用した先進的な実装
- 優れた開発者体験とドキュメント
- プロダクション対応の最適化とパフォーマンス
- Vercelとの深い統合による簡単なデプロイ
- 型安全性と保守性の高いコード

#### 改善の余地
- 実験的機能への依存（安定性の懸念）
- Shopify以外のプロバイダーサポートの改善
- テストカバレッジの追加

### 向いている用途
- ヘッドレスコマースのプロトタイピング
- 中小規模のECサイト構築
- パフォーマンス重視のオンラインストア
- Shopifyを利用した新規EC立ち上げ
- Next.jsの最新機能を活用したい開発者

### 向いていない用途
- 複雑なカスタマイズが必要な大規模ECサイト
- Shopify以外のレガシーシステムとの統合
- B2B向けの複雑な価格設定や承認フロー

### 総評
Next.js Commerceは、モダンなEコマースサイトを構築するための優れたスターターキットです。React 19とNext.js 15の最新機能を積極的に採用し、開発者に最先端の開発体験を提供しています。特にServer Components、Server Actions、Suspenseなどの活用により、高速でインタラクティブなユーザー体験を実現しています。Vercelとの深い統合により、デプロイも簡単で、スケーラビリティも確保されています。ただし、実験的機能への依存や、主にShopifyに最適化されている点は考慮が必要です。中小規模のECサイトや、最新技術を活用したい開発者にとっては最適な選択肢となるでしょう。