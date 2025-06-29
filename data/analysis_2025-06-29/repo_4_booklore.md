# リポジトリ解析: adityachandelgit/BookLore

## 基本情報
- リポジトリ名: adityachandelgit/BookLore
- 主要言語: Java
- スター数: 1,896
- フォーク数: 74
- 最終更新: 活発に更新中
- ライセンス: GNU General Public License v3.0
- トピックス: book-management, digital-library, pdf-reader, epub-reader, spring-boot, angular, self-hosted

## 概要
### 一言で言うと
BookLoreは、PDF、EPUB、コミックファイルをサポートする自己ホスト型のモダンな電子書籍管理・閲覧ウェブアプリケーションで、リッチなメタデータ管理と複数ユーザー対応を特徴としています。

### 詳細説明
BookLoreは、個人の電子書籍コレクションを整理、管理、閲覧するための包括的なソリューションです。Spring Boot 3.5（Java 21）とAngular 20で構築され、PDF、EPUB、CBX/CBZ/CBR形式の書籍をサポートしています。Goodreads、Amazon、Google Books、Hardcoverからのメタデータ自動取得、読書進捗追跡、ブックマーク機能、複数ユーザー対応、OPDS 1.2サーバー機能など、デジタルライブラリ管理に必要な機能を網羅しています。デスクトップとモバイルの両方に対応したレスポンシブデザインで、セルフホスティングによる完全なデータ所有権を提供します。

### 主な特徴
- 複数形式対応（PDF、EPUB、CBX/CBZ/CBR）
- 組み込みリーダー（PDF、EPUB、コミック）
- 自動メタデータ取得（複数プロバイダー対応）
- ライブラリとシェルフによる階層的整理
- リアルタイム通知（WebSocket）
- マルチユーザーサポート（ロールベース認証）
- OPDS 1.2サーバー（外部リーダーアプリ対応）
- 読書進捗とブックマーク管理
- メールによる書籍送信機能
- ダーク/ライトテーマ対応

## 使用方法
### インストール
#### 前提条件
- Docker（推奨）または Java 21 + Node.js 22
- MariaDB 11.4以上
- 最小2GBメモリ、推奨4GB以上
- 書籍ファイル用のストレージ

#### インストール手順
```bash
# 方法1: Docker Compose（推奨）
# docker-compose.ymlを作成
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  booklore:
    image: ghcr.io/adityachandelgit/booklore-app:latest
    container_name: booklore
    environment:
      - DATABASE_URL=jdbc:mariadb://mariadb:3306/booklore
      - DATABASE_USERNAME=booklore
      - DATABASE_PASSWORD=secure_password_here
      - SWAGGER_ENABLED=false
      - AUTHENTICATION_MODE=JWT  # JWT, OIDC, または REMOTE
    ports:
      - "6060:6060"
    volumes:
      - ./booklore/data:/app/data
      - ./booklore/books:/books
    depends_on:
      - mariadb
    restart: unless-stopped

  mariadb:
    image: lscr.io/linuxserver/mariadb:11.4.5
    container_name: booklore-mariadb
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Tokyo
      - MYSQL_ROOT_PASSWORD=root_password_here
      - MYSQL_DATABASE=booklore
      - MYSQL_USER=booklore
      - MYSQL_PASSWORD=secure_password_here
    volumes:
      - ./mariadb:/config
    restart: unless-stopped
EOF

# 起動
docker-compose up -d

# 方法2: 手動インストール（開発用）
# バックエンド
cd booklore-api
./gradlew bootRun

# フロントエンド
cd booklore-ui
npm install
npm run start
```

### 基本的な使い方
#### Hello World相当の例
```text
1. http://localhost:6060 にアクセス
2. 初回起動時に管理者アカウントを作成
3. "Libraries" → "Create Library" でライブラリを作成
4. "Add Path" でローカルフォルダを指定
5. 自動的に書籍がスキャンされライブラリに追加される
6. 書籍をクリックして読書開始
```

#### 実践的な使用例
```javascript
// API経由での書籍メタデータ取得
const fetchBookMetadata = async (bookId, provider) => {
  const response = await fetch(`/api/v1/metadata/fetch/${bookId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      provider: provider, // GOODREADS, AMAZON, GOOGLE_BOOKS, HARDCOVER
      updateCover: true
    })
  });
  return response.json();
};

// WebSocketによるリアルタイム通知の受信
const connectWebSocket = () => {
  const socket = new SockJS('/ws');
  const stompClient = Stomp.over(socket);
  
  stompClient.connect({}, (frame) => {
    // 書籍追加通知の購読
    stompClient.subscribe('/topic/books/added', (message) => {
      const book = JSON.parse(message.body);
      console.log('New book added:', book.title);
    });
    
    // 読書進捗の更新
    stompClient.subscribe('/user/queue/progress', (message) => {
      const progress = JSON.parse(message.body);
      console.log('Reading progress:', progress);
    });
  });
};
```

### 高度な使い方
```bash
# OPDS Catalog経由でのアクセス
# Moon+ Reader、Librera等のOPDS対応リーダーで設定：
# URL: http://your-server:6060/api/v1/opds
# 認証: ユーザー名とパスワード

# バルクメタデータ更新
curl -X POST http://localhost:6060/api/v1/metadata/bulk-update \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookIds": [1, 2, 3],
    "provider": "GOODREADS",
    "updateCover": true
  }'

# ライブラリ監視設定（ファイル変更の自動検知）
curl -X PUT http://localhost:6060/api/v1/libraries/1/monitor \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"enabled": true, "interval": 300}'
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: 基本的なセットアップと機能概要
- **Swagger UI**: http://localhost:6060/swagger-ui.html（開発環境）
- **Wiki**: 詳細な設定ガイド（GitHub Wiki）

### サンプル・デモ
- **example-docker/**: Docker Compose設定例
- **デモGIF**: assets/demo.gif（UI操作例）
- **テストデータ**: src/test/resources/

### チュートリアル・ガイド
- Docker設定ガイド
- 認証モード設定（JWT、OIDC、Remote Auth）
- メタデータプロバイダー設定
- OPDSサーバー設定
- バックアップとリストア手順

## 技術的詳細
### アーキテクチャ
#### 全体構造
マイクロサービス対応のモノリシックアーキテクチャ。Spring Bootバックエンドがビジネスロジックとデータ管理を担当し、Angular SPAがリッチなユーザーインターフェースを提供。Nginxがリバースプロキシとして機能。

#### ディレクトリ構成
```
BookLore/
├── booklore-api/           # Spring Bootバックエンド
│   └── src/
│       ├── main/
│       │   ├── java/       # Javaソースコード
│       │   │   ├── controller/  # REST APIエンドポイント
│       │   │   ├── service/     # ビジネスロジック
│       │   │   ├── repository/  # データアクセス層
│       │   │   ├── entity/      # JPAエンティティ
│       │   │   └── security/    # 認証・認可
│       │   └── resources/
│       │       └── db/migration/  # Flywayマイグレーション
├── booklore-ui/            # Angularフロントエンド
│   └── src/
│       ├── app/
│       │   ├── core/       # コアサービス・ガード
│       │   ├── shared/     # 共有コンポーネント
│       │   ├── features/   # 機能モジュール
│       │   └── readers/    # リーダーコンポーネント
│       └── styles/         # グローバルスタイル
├── Dockerfile              # マルチステージビルド
└── nginx.conf             # Nginxリバースプロキシ設定
```

#### 主要コンポーネント
- **BookService**: 書籍管理の中核サービス
  - 場所: `booklore-api/src/main/java/com/booklore/service/`
  - 依存: BookRepository、FileService、MetadataService
  - 機能: CRUD操作、ファイル管理、メタデータ処理

- **AuthenticationService**: 認証システム
  - 場所: `booklore-api/src/main/java/com/booklore/security/`
  - 対応: JWT、OIDC、Remote Auth
  - 機能: ログイン、トークン管理、権限チェック

- **ReaderComponents**: 書籍リーダー
  - 場所: `booklore-ui/src/app/readers/`
  - 種類: PDFReader、EPUBReader、CBXReader
  - 機能: 表示、ナビゲーション、設定保存

### 技術スタック
#### コア技術
- **言語**: Java 21（バックエンド）、TypeScript（フロントエンド）
- **フレームワーク**: 
  - Backend: Spring Boot 3.5、Spring Security
  - Frontend: Angular 20（スタンドアロンコンポーネント）
- **主要ライブラリ**: 
  - PDFBox 3.0（PDF処理）
  - epub4j（EPUB処理）
  - PrimeNG 18（UIコンポーネント）
  - ngx-extended-pdf-viewer（PDFビューア）

#### 開発・運用ツール
- **ビルドツール**: Gradle 8（バックエンド）、Node 22/npm（フロントエンド）
- **データベース**: MariaDB 11.4+、Flyway（マイグレーション）
- **CI/CD**: GitHub Actions、Docker multi-stage build
- **デプロイ**: Docker、Nginx（リバースプロキシ）

### 設計パターン・手法
- **レイヤードアーキテクチャ**: Controller → Service → Repository
- **DTOパターン**: MapStructによる自動マッピング
- **アスペクト指向**: セキュリティチェック、ロギング
- **リアクティブプログラミング**: RxJS（フロントエンド）

### データフロー・処理フロー
1. ユーザーリクエスト → Nginx（ポート6060）
2. API呼び出し → Spring Boot（内部ポート8080）
3. 認証・認可チェック → ビジネスロジック実行
4. データベースアクセス → レスポンス生成
5. WebSocket通知 → リアルタイムUI更新

## API・インターフェース
### 公開API
#### REST API
- 目的: 書籍管理、メタデータ操作、ユーザー管理
- 使用例:
```javascript
// 書籍一覧取得
GET /api/v1/books?libraryId=1&page=0&size=20

// 読書進捗更新
PUT /api/v1/books/{bookId}/progress
{
  "currentPage": 42,
  "totalPages": 200,
  "percentage": 21.0
}

// メタデータ検索
POST /api/v1/metadata/search
{
  "query": "1984 George Orwell",
  "provider": "GOODREADS"
}
```

#### OPDS API
- 目的: 外部リーダーアプリとの連携
- エンドポイント: `/api/v1/opds/*`
- 仕様: OPDS 1.2準拠

### 設定・カスタマイズ
#### 設定ファイル
```properties
# 主要な環境変数
DATABASE_URL=jdbc:mariadb://localhost:3306/booklore
DATABASE_USERNAME=booklore
DATABASE_PASSWORD=password

# 認証モード
AUTHENTICATION_MODE=JWT  # JWT, OIDC, REMOTE

# OIDCの場合
OIDC_ISSUER_URI=https://auth.example.com
OIDC_CLIENT_ID=booklore
OIDC_CLIENT_SECRET=secret

# ファイルパス
DATA_PATH=/app/data
BOOKS_PATH=/books

# オプション
SWAGGER_ENABLED=true
EMAIL_ENABLED=true
```

#### 拡張・プラグイン開発
- カスタムメタデータプロバイダーの追加
- 新しいファイル形式のサポート
- カスタム認証プロバイダー
- UIテーマのカスタマイズ

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- 画像遅延読み込み（カバー画像）
- 仮想スクロール（大規模ライブラリ）
- ページネーション（API）
- WebSocket接続プーリング
- ブラウザキャッシュ活用

### スケーラビリティ
- 水平スケーリング対応（ステートレス設計）
- データベース接続プーリング
- ファイルストレージの外部化対応
- 非同期処理（メタデータ取得）

### 制限事項
- 最大アップロードサイズ: 1GB
- 同時WebSocket接続数の制限
- 大規模PDFのメモリ使用量
- CBZ/CBRの解凍処理時間

## 評価・所感
### 技術的評価
#### 強み
- モダンな技術スタック（Spring Boot 3.5、Angular 20）
- 包括的な機能セット
- 優れたUIデザイン（PrimeNG）
- 活発な開発とメンテナンス
- 詳細なデータベース設計
- マルチユーザー対応

#### 改善の余地
- テストカバレッジの向上
- パフォーマンスベンチマーク不足
- ドキュメントの充実
- 国際化対応（i18n）
- モバイルアプリの不在

### 向いている用途
- 個人・家庭の電子書籍ライブラリ
- 小規模組織の文書管理
- 研究資料の整理・閲覧
- 漫画・コミックコレクション管理
- 家族での書籍共有

### 向いていない用途
- 大規模な商用図書館システム
- DRM保護されたコンテンツ
- リアルタイム協働編集
- 音声書籍（オーディオブック）
- 高度な学術文献管理

### 総評
BookLoreは、セルフホスト型の電子書籍管理システムとして非常に完成度の高いプロジェクトです。特に、複数の書籍形式への対応、リッチなメタデータ管理、組み込みリーダーの品質において、同種のオープンソースプロジェクト（Calibre-Web、Kavita等）と比較しても優位性があります。

技術的には、最新のSpring Boot 3.5とAngular 20を採用し、マイクロサービス対応の設計、WebSocketによるリアルタイム機能、複数の認証方式のサポートなど、エンタープライズレベルの実装品質を持っています。

GPLv3ライセンスであることから商用利用には注意が必要ですが、個人使用や非営利組織での利用には最適です。1,896のスター数が示すように、コミュニティからの支持も高く、今後の発展が期待できるプロジェクトです。