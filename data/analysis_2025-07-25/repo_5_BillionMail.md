# リポジトリ解析: aaPanel/BillionMail

## 基本情報
- リポジトリ名: aaPanel/BillionMail
- 主要言語: Go (95.5%), Shell (4.3%)
- スター数: 7,415
- フォーク数: 632
- 最終更新: 2025年7月（V4.0リリース）
- ライセンス: AGPL-3.0 (GNU Affero General Public License)
- トピックス: Email Server, Email Marketing, Newsletter, Self-hosted, Open Source, Mail Server

## 概要
### 一言で言うと
完全無料でセルフホスト可能なオープンソースメールサーバー兼メールマーケティングプラットフォームで、企業や個人が無制限にメール送信できるソリューション。

### 詳細説明
BillionMailは、メールサーバー機能とメールマーケティング機能を統合したオープンソースソフトウェアです。「Billion emails. Any business. Guaranteed.」というキャッチフレーズの通り、大量のメール送信に対応した設計となっています。

多くのメールマーケティングプラットフォームが高額であったり、クローズドソースであったり、必要な機能が不足しているという問題を解決するために開発されました。aaPanel社によって開発・メンテナンスされており、ニュースレター、プロモーションメール、トランザクションメールなど、様々な用途に対応しています。

### 主な特徴
- **完全オープンソース**: 隠れたコストやベンダーロックインなし
- **無制限メール送信**: 送信数に制限なし
- **高度な分析機能**: 配信率、開封率、クリック率の追跡
- **カスタマイズ可能なテンプレート**: プロフェッショナルなマーケティングテンプレート
- **プライバシー重視**: データはユーザーの手元に保持、サードパーティ追跡なし
- **セルフホスト対応**: 自分のサーバーで完全なコントロール
- **8分で即利用可能**: インストールからメール送信までわずか8分
- **マルチインストール方法**: スクリプト、Docker、aaPanel経由

## 使用方法
### インストール
#### 前提条件
- **OS**: Linux (Ubuntu/Debian/CentOS推奨)
- **CPU**: 2コア以上
- **メモリ**: 2GB以上（4GB推奨）
- **ストレージ**: 20GB以上
- **Docker**: インストール済み（スクリプトが自動インストールも可能）
- **ポート**: 25, 80, 110, 143, 443, 465, 587, 993, 995

#### インストール手順
```bash
# 方法1: ワンラインインストール（推奨）
cd /opt && git clone https://github.com/aaPanel/BillionMail && cd BillionMail && bash install.sh

# 方法2: Docker Composeを使用
cd /opt && git clone https://github.com/aaPanel/BillionMail && cd BillionMail && cp env_init .env && docker compose up -d || docker-compose up -d

# 方法3: aaPanel経由でのワンクリックインストール
# aaPanelにログイン → Docker → OneClick install
```

### 基本的な使い方
#### 管理コマンド
```bash
# デフォルトログイン情報の表示
bm default

# DNSレコードの表示
bm show-record

# BillionMailのアップデート
bm update

# ヘルプの表示
bm help
```

#### 3ステップでメール送信
1. **ドメインの接続**
   - 送信ドメインを追加
   - DNSレコードを検証
   - 無料SSLを自動有効化

2. **キャンペーンの作成**
   - メールを作成または貼り付け
   - リストとタグを選択
   - 送信時刻を設定または即時送信

3. **分析と追跡**
   - リアルタイムで配信率を監視
   - 開封率とクリック率を追跡
   - パフォーマンスレポートを生成

### 高度な使い方
#### API統合
```bash
# APIを使用したメール送信例
curl -X POST https://your-billionmail.com/api/v1/mail/send \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "sender@yourdomain.com",
    "to": "recipient@example.com",
    "subject": "Test Email",
    "html": "<h1>Hello World</h1>",
    "text": "Hello World"
  }'

# バッチメールタスクの作成
curl -X POST https://your-billionmail.com/api/v1/batch_mail/create_task \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Newsletter Campaign",
    "template_id": 1,
    "recipient_group_id": 1,
    "send_time": "2025-01-20 10:00:00"
  }'
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、インストール方法、基本使用法
- **README-zh_CN.md**: 中国語ドキュメント
- **README-ja.md**: 日本語ドキュメント
- **公式サイト**: https://www.billionmail.com/
- **Discordコミュニティ**: https://discord.gg/asfXzBUhZr

### サンプル・デモ
- **ライブデモ**: https://demo.billionmail.com/billionmail
  - ユーザー名: `billionmail`
  - パスワード: `billionmail`
- **data/example_recipients.csv**: サンプル受信者リスト
- **template/**: メールテンプレートサンプル

### チュートリアル・ガイド
- YouTubeデモ動画: https://www.youtube.com/embed/UHgxZa_9jGs
- GitHub Issues: 機能リクエストやバグ報告
- コミュニティサポート: Discordチャンネル

## 技術的詳細
### アーキテクチャ
#### 全体構造
BillionMailはマイクロサービスアーキテクチャを採用し、Docker Composeで管理される複数のコンテナで構成されています。各コンポーネントは特定の役割を担い、ネットワークを通じて相互に通信します。

#### ディレクトリ構成
```
BillionMail/
├── core/                  # Goベースのコア管理サービス
│   ├── api/              # APIエンドポイント定義
│   ├── cmd/              # コマンドラインツール
│   ├── frontend/         # Vue3フロントエンド
│   ├── internal/         # 内部パッケージ
│   │   ├── controller/   # HTTPコントローラー
│   │   ├── service/      # ビジネスロジック
│   │   └── model/        # データモデル
│   └── languages/        # i18nファイル
├── Dockerfiles/           # 各サービスのDockerfile
│   ├── core/             # 管理サービス
│   ├── dovecot/          # IMAP/POP3サーバー
│   ├── postfix/          # SMTPサーバー
│   └── rspamd/           # スパムフィルター
├── conf/                  # 各サービスの設定ファイル
├── template/              # メールテンプレート
├── docker-compose.yml     # Docker Compose設定
└── install.sh             # インストールスクリプト
```

#### 主要コンポーネント
- **Core Management Service**: Goで実装された中央管理サービス
  - 場所: `core/`
  - 依存: PostgreSQL, Redis, Docker API
  - インターフェース: REST API, Web UI

- **PostgreSQL**: メインデータベース
  - 場所: `pgsql-billionmail` コンテナ
  - 依存: なし
  - インターフェース: PostgreSQLプロトコル

- **Redis**: キャッシュとジョブキュー
  - 場所: `redis-billionmail` コンテナ
  - 依存: なし
  - インターフェース: Redisプロトコル

- **Postfix**: SMTPサーバー
  - 場所: `postfix-billionmail` コンテナ
  - 依存: PostgreSQL, Redis, Rspamd
  - インターフェース: SMTP (25, 465, 587)

- **Dovecot**: IMAP/POP3サーバー
  - 場所: `dovecot-billionmail` コンテナ
  - 依存: PostgreSQL, Redis
  - インターフェース: IMAP (143, 993), POP3 (110, 995)

- **Rspamd**: スパムフィルタリング
  - 場所: `rspamd-billionmail` コンテナ
  - 依存: Redis
  - インターフェース: Milterプロトコル

- **RoundCube**: Webmailクライアント
  - 場所: `webmail-billionmail` コンテナ
  - 依存: PostgreSQL, Dovecot, Postfix
  - インターフェース: Web UI (/roundcube/)

### 技術スタック
#### コア技術
**バックエンド**
- **言語**: Go 1.22+ (goroutines, channels, ジェネリクス使用)
- **Webフレームワーク**: GoFrame v2.9.0
- **主要ライブラリ**: 
  - **gogf/gf/v2**: Webフレームワーク
  - **docker/docker**: Docker API統合
  - **go-acme/lego**: Let's Encrypt SSL証明書自動発行
  - **panjf2000/ants**: ゴルーチンプール
  - **sashabaranov/go-openai**: AI統合 (OpenAI API)
  - **xuri/excelize**: Excelファイル処理

**フロントエンド**
- **フレームワーク**: Vue 3.5.13 + TypeScript 5.8
- **ビルドツール**: Rsbuild 1.3.22
- **UIライブラリ**: Naive UI 2.41.0
- **状態管理**: Pinia 3.0.1
- **ルーティング**: Vue Router 4.5.0
- **CSS**: UnoCSS, Sass
- **エディタ**: Monaco Editor (nginx設定編集用)
- **チャート**: ECharts 5.6.0

**メールサーバー**
- **SMTP**: Postfix 3.x
- **IMAP/POP3**: Dovecot 2.x
- **スパムフィルタ**: Rspamd
- **Webmail**: RoundCube 1.6.10

#### 開発・運用ツール
- **コンテナ化**: Docker, Docker Compose
- **データベース**: PostgreSQL 17.4
- **キャッシュ**: Redis 7.4.2
- **プロセス管理**: Supervisor
- **セキュリティ**: Fail2ban
- **CI/CD**: GitHub Actions
- **モニタリング**: 内蔵ログシステム

### 設計パターン・手法
- **マイクロサービスアーキテクチャ**: 各コンポーネントが独立したコンテナで動作
- **RESTful API**: コアサービスが提供するAPI
- **MVCパターン**: GoFrameによる実装
- **リポジトリパターン**: データアクセス層の抽象化
- **イベント駆動**: メールイベントの非同期処理
- **コンテナオーケストレーション**: Docker Composeによる管理

### データフロー・処理フロー
**メール送信フロー**
1. **APIリクエスト**: クライアントからREST API経由で送信リクエスト
2. **認証・検証**: JWTトークン検証、送信権限確認
3. **キューイング**: Redisにメールタスクをキューイング
4. **スパムチェック**: Rspamdによるコンテンツ分析
5. **SMTP送信**: Postfix経由でメール送信
6. **ログ記録**: PostgreSQLに送信結果を記録
7. **統計更新**: 配信率、開封率等のメトリクス更新

**メール受信フロー**
1. **SMTP受信**: Postfixが外部からのメールを受信
2. **スパムフィルタリング**: Rspamdでスパム判定
3. **メールボックス配信**: Dovecotがユーザーメールボックスに配信
4. **ストレージ**: メールデータをvmailディレクトリに保存
5. **クライアントアクセス**: IMAP/POP3/Webmail経由でアクセス

## API・インターフェース
### 公開API
#### POST /api/v1/mail/send
- 目的: 単一メールの送信
- 使用例:
```json
{
  "from": "sender@example.com",
  "to": "recipient@example.com",
  "subject": "Hello World",
  "html": "<h1>Hello World</h1>",
  "text": "Hello World",
  "attachments": []
}
```

#### POST /api/v1/batch_mail/create_task
- 目的: バッチメールタスクの作成
- 使用例:
```json
{
  "name": "Newsletter Campaign",
  "template_id": 1,
  "recipient_group_id": 1,
  "send_time": "2025-01-20 10:00:00",
  "send_speed": 100
}
```

#### GET /api/v1/overview/stats
- 目的: メール統計情報の取得
- レスポンス: 配信率、開封率、クリック率等

### 設定・カスタマイズ
#### 環境変数 (.env)
```bash
# データベース設定
DBNAME=billionmail
DBUSER=billionmail
DBPASS=your_password

# Redis設定
REDISPASS=your_redis_password

# メールサーバー設定
BILLIONMAIL_HOSTNAME=mail.example.com

# ポート設定
HTTP_PORT=80
HTTPS_PORT=443
SMTP_PORT=25
IMAP_PORT=143

# タイムゾーン
TZ=Asia/Tokyo
```

#### 設定ファイル構造
- **conf/postfix/**: Postfix設定
- **conf/dovecot/**: Dovecot設定
- **conf/rspamd/**: Rspamd設定
- **conf/core/**: コアサービス設定
- **conf/php/**: RoundCube PHP設定

#### 拡張・カスタマイズ
- **メールテンプレート**: `template/`ディレクトリにカスタムテンプレートを追加
- **AIプロバイダー**: `conf/supplier/template/`にOpenAI、Gemini等の設定テンプレート
- **SSL証明書**: Let's Encryptによる自動発行または手動設定
- **スパムフィルタ**: Rspamdのルールカスタマイズ

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- **インストール時間**: 8分以内で完全動作
- **メール送信速度**: 設定可能（デフォルト100通/分）
- **同時接続数**: Dovecot/Postfixのulimit設定による
- **最適化手法**: 
  - Goのgoroutineによる並行処理
  - Redisキャッシュ
  - PostgreSQLインデックス最適化
  - Dockerコンテナ間通信の最適化

### スケーラビリティ
- **水平スケーリング**: 
  - Postfix/Dovecotの複数インスタンス対応
  - ロードバランサー経由での負荷分散
- **垂直スケーリング**: 
  - CPU/メモリの増強による性能向上
  - ストレージの拡張
- **バッチ処理**: 
  - 大量メールの非同期処理
  - キューベースのタスク管理

### 制限事項
- **技術的な制限**:
  - SMTPポートが多くのISPでブロックされている可能性
  - メールサーバーの設定に専門知識が必要
  - DNS設定（SPF/DKIM/DMARC）が必須
- **運用上の制限**:
  - IPレピュテーション管理が重要
  - スパム対策の継続的なメンテナンス
  - バックアップの定期実施が必要

## 評価・所感
### 技術的評価
#### 強み
- **完全無料・オープンソース**: AGPLライセンスで完全な自由
- **オールインワンソリューション**: メールサーバーとマーケティング機能を統合
- **簡単なインストール**: 8分で完全動作
- **モダンな技術スタック**: Go + Vue3 + Docker
- **プライバシー重視**: セルフホストで完全コントロール
- **活発な開発**: 2025年7月にV4.0リリース

#### 改善の余地
- ドキュメントの充実（現在はREADME中心）
- エンタープライズ機能の拡充
- クラスタリング機能の強化
- プラグインシステムの整備
- モバイルアプリの提供

### 向いている用途
- **中小企業のメールマーケティング**: コストを抑えたメール配信
- **ニュースレター配信**: 定期的な情報配信
- **トランザクションメール**: システム通知の送信
- **プライベートメールサーバー**: 完全なコントロールが必要な組織
- **開発・テスト環境**: メール機能の検証

### 向いていない用途
- **超大規模配信**: 数千万通レベルの配信
- **エンタープライズサポート**: 24/7サポートが必要な場合
- **初心者向け**: メールサーバー設定に専門知識が必要
- **マネージドサービス希望**: セルフホストが前提

### 総評
BillionMailは、「完全無料で無制限のメール送信」という明確な価値提案を持つ優れたオープンソースプロジェクトです。特に、高額なメールマーケティングサービスに不満を持つ中小企業や、データプライバシーを重視する組織にとって魅力的な選択肢です。

技術的には、Go言語による高性能なバックエンド、Vue3によるモダンなフロントエンド、Dockerによる簡単なデプロイなど、現代的な技術スタックを採用しています。また、Postfix、Dovecot、Rspamdなどの実績あるメールサーバーコンポーネントを統合しており、信頼性も高いです。

「8分でインストールからメール送信まで」というキャッチフレーズが示す通り、導入の簡便さも大きな強みです。aaPanel社による開発で、既に7,400以上のスターを獲得しており、コミュニティも活発です。

一方で、メールサーバーの運用には専門知識が必要であり、DNS設定やIPレピュテーション管理など、技術的なハードルがあることも事実です。しかし、これらの課題を乗り越えれば、完全にコントロール可能なメールマーケティングプラットフォームを無料で手に入れることができます。

オープンソースメールマーケティングソリューションを探している方には、強くお勧めできるプロジェクトです。