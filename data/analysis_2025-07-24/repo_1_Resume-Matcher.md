# リポジトリ解析: srbhr/Resume-Matcher

## 基本情報
- リポジトリ名: srbhr/Resume-Matcher
- 主要言語: TypeScript
- スター数: 16,961
- フォーク数: 3,913
- 最終更新: アクティブに開発中
- ライセンス: Apache License 2.0
- トピックス: resume, ats, job-search, ai, career

## 概要
### 一言で言うと
AI駆動の履歴書最適化プラットフォームで、求人票とのマッチングを分析し、ATS（採用管理システム）を通過しやすい履歴書作成を支援するツール。

### 詳細説明
Resume Matcherは、求職者が履歴書を最適化し、企業の採用プロセスで使用されるATS（Applicant Tracking System）を通過する確率を高めるためのオープンソースツールです。ローカルで動作するAIモデル（Ollama）を使用して、履歴書と求人票のマッチング分析、キーワード最適化、改善提案を行います。「履歴書作成のためのVS Code」を目指して開発されています。

### 主な特徴
- **ローカル動作**: Ollamaを使用してローカルでAI分析を実行（プライバシー重視）
- **ATS互換性チェック**: 履歴書がATSシステムとどの程度互換性があるか詳細に分析
- **即座のマッチスコア**: 履歴書と求人票をアップロードすると、マッチング率と改善点を即座に表示
- **キーワード最適化**: 求人票のキーワードと履歴書の整合性を確認し、重要なコンテンツギャップを特定
- **ガイド付き改善提案**: 履歴書を際立たせるための明確な提案を提供
- **100%オープンソース**: 完全無料で透明性のあるコード

## 使用方法
### インストール
#### 前提条件
**Windows:**
- PowerShell 5.1以降
- Node.js v18以上（npmを含む）
- Python 3.8以上
- winget（Ollamaインストール用、推奨）
- uv（セットアップスクリプトで自動インストール）

**Linux/macOS:**
- Bash 4.4以上
- Node.js v18以上（npmを含む）
- Python 3.8以上
- curl（uvとOllamaのインストール用）
- make（Makefile統合用）

#### インストール手順
```bash
# 方法1: Windows (PowerShell)
git clone https://github.com/srbhr/Resume-Matcher.git
cd Resume-Matcher
.\setup.ps1
# 開発サーバーを起動する場合
.\setup.ps1 -StartDev

# 方法2: Linux/macOS (Bash)
git clone https://github.com/srbhr/Resume-Matcher.git
cd Resume-Matcher
chmod +x setup.sh
./setup.sh
# 開発サーバーを起動する場合
./setup.sh --start-dev
# または Makefile を使用
make setup
make run-dev
```

### 基本的な使い方
#### Hello World相当の例
1. アプリケーションを起動
```bash
npm run dev
```
2. ブラウザで http://localhost:3000 を開く
3. 「Get Started」をクリック
4. 履歴書（PDF/DOCX）をアップロード
5. 求人票のテキストを貼り付け
6. 「Analyze」をクリックしてマッチングスコアを確認

#### 実践的な使用例
1. 履歴書のアップロード
   - `/resume` ページで履歴書ファイル（PDF/DOCX）をドラッグ&ドロップ
   - ファイルは自動的にMarkdown形式に変換されて保存

2. 求人票の分析
   - `/jobs` ページで求人票のテキストを貼り付け
   - AIが求人内容を構造化して分析

3. マッチング分析の確認
   - ダッシュボードでマッチングスコアを確認
   - キーワードギャップと改善提案を確認
   - 提案に基づいて履歴書を更新

### 高度な使い方
1. **APIの直接使用**
```bash
# 履歴書のアップロード
curl -X POST http://localhost:8000/api/v1/resumes/upload \
  -F "file=@resume.pdf"

# 求人票の分析
curl -X POST http://localhost:8000/api/v1/jobs/analyze \
  -H "Content-Type: application/json" \
  -d '{"description": "Job description text..."}}'
```

2. **カスタムAIモデルの使用**
   - Ollamaで異なるモデルをインストール
   - 環境変数でモデルを指定
   - OpenAI APIの統合も可能

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、主要機能、インストール手順の概要
- **SETUP.md**: 詳細なセットアップガイド（Windows/macOS/Linux対応）
- **公式サイト**: https://www.resumematcher.fyi（機能紹介とデモ）

### サンプル・デモ
- **モックデータ**: ダッシュボードにAda Lovelaceの履歴書サンプルが含まれている
- **デモビデオ**: hero_video.mp4（ホームページで使用方法を視覚的に説明）

### チュートリアル・ガイド
- Discord コミュニティ: https://dsc.gg/resume-matcher
- LinkedIn ページ: https://www.linkedin.com/company/resume-matcher/
- GitHub Issues: バグ報告と機能リクエスト
- Dev.to ブログ: 開発チームによる技術記事

## 技術的詳細
### アーキテクチャ
#### 全体構造
モノレポ構造を採用し、バックエンド（FastAPI）とフロントエンド（Next.js）を統合。ローカルAIモデル（Ollama）を使用してプライバシーを保護しながら、高度な履歴書分析機能を提供。

#### ディレクトリ構成
```
Resume-Matcher/
├── apps/                    # アプリケーション本体
│   ├── backend/            # FastAPI バックエンド
│   │   ├── app/
│   │   │   ├── agent/      # AI エージェント（Ollama/OpenAI）
│   │   │   ├── api/        # API エンドポイント定義
│   │   │   ├── core/       # コア設定とデータベース
│   │   │   ├── models/     # SQLAlchemy モデル
│   │   │   ├── prompt/     # AI プロンプトテンプレート
│   │   │   ├── schemas/    # Pydantic スキーマ
│   │   │   └── services/   # ビジネスロジック
│   │   └── pyproject.toml  # Python 依存関係
│   └── frontend/           # Next.js フロントエンド
│       ├── app/            # App Router ページ
│       ├── components/     # React コンポーネント
│       ├── hooks/          # カスタムフック
│       └── lib/            # ユーティリティと API クライアント
├── assets/                 # 画像とメディアファイル
├── package.json           # ルートレベルのスクリプト
├── setup.sh               # Linux/macOS セットアップ
└── setup.ps1              # Windows セットアップ
```

#### 主要コンポーネント
- **ResumeService**: 履歴書の変換、保存、分析を担当
  - 場所: `apps/backend/app/services/resume_service.py`
  - 依存: AgentManager, Database
  - インターフェース: convert_and_store_resume, get_resume

- **AgentManager**: AI モデルとの通信を管理
  - 場所: `apps/backend/app/agent/manager.py`
  - 依存: OllamaProvider, OpenAIProvider
  - インターフェース: generate_structured_output

- **ScoreImprovementService**: マッチングスコアと改善提案を生成
  - 場所: `apps/backend/app/services/score_improvement_service.py`
  - 依存: AgentManager, ResumeService, JobService
  - インターフェース: calculate_score_improvements

### 技術スタック
#### コア技術
- **言語**: 
  - Python 3.12+（バックエンド、型ヒント使用）
  - TypeScript 5+（フロントエンド、厳密な型定義）
- **フレームワーク**:
  - FastAPI 0.115+（高速な非同期WebAPI）
  - Next.js 15.3+（App Router、React Server Components）
- **主要ライブラリ**: 
  - Ollama (0.4.7): ローカルAIモデルの実行
  - SQLAlchemy (2.0.40): 非同期ORM
  - Pydantic (2.11.3): データバリデーションとシリアライゼーション
  - markitdown (0.1.1): PDFとDOCXをMarkdownに変換
  - React 19: UI構築
  - Tailwind CSS 4: スタイリング
  - Radix UI: アクセシブルなUIコンポーネント

#### 開発・運用ツール
- **ビルドツール**: 
  - uv: Python依存関係管理（高速）
  - npm/pnpm: Node.js依存関係管理
  - concurrently: 並列プロセス実行
- **テスト**: 現在テストインフラは構築中
- **CI/CD**: 計画中（GitHub Actionsを予定）
- **デプロイ**: 
  - ローカル実行が主要な使用方法
  - Dockerサポート計画中

### 設計パターン・手法
- **レイヤードアーキテクチャ**: API層、サービス層、データ層の明確な分離
- **依存性注入**: FastAPIのDependsを使用したDIパターン
- **Strategy パターン**: AI プロバイダー（Ollama/OpenAI）の切り替え
- **Context パターン**: React Context APIで履歴書データを管理
- **非同期処理**: Python asyncioとFastAPIの非同期サポートを活用

### データフロー・処理フロー
1. **履歴書アップロード**
   - ユーザーがPDF/DOCXファイルをアップロード
   - markitdownでMarkdown形式に変換
   - SQLiteデータベースに保存
   - フロントエンドにresume_idを返却

2. **求人票分析**
   - 求人票のテキストを受信
   - AIモデル（Ollama）で構造化データを抽出
   - キーワードと要件を識別
   - データベースに保存

3. **マッチング分析**
   - 履歴書と求人票のデータを取得
   - AIモデルでマッチングスコアを計算
   - キーワードギャップを特定
   - 改善提案を生成
   - 結果をフロントエンドに返却

## API・インターフェース
### 公開API
#### POST /api/v1/resumes/upload
- 目的: 履歴書ファイルをアップロードして保存
- 使用例:
```python
import requests

with open("resume.pdf", "rb") as f:
    response = requests.post(
        "http://localhost:8000/api/v1/resumes/upload",
        files={"file": f}
    )
    resume_id = response.json()["resume_id"]
```

#### POST /api/v1/jobs/analyze
- 目的: 求人票を分析して構造化データを抽出
- 使用例:
```python
response = requests.post(
    "http://localhost:8000/api/v1/jobs/analyze",
    json={"description": "Senior Python Developer..."}
)
job_data = response.json()
```

#### POST /api/v1/resumes/improve
- 目的: 履歴書と求人票のマッチング分析と改善提案
- 使用例:
```python
response = requests.post(
    "http://localhost:8000/api/v1/resumes/improve",
    json={"resume_id": "uuid", "job_id": "uuid"}
)
improvements = response.json()
```

### 設定・カスタマイズ
#### 設定ファイル
```env
# .env ファイル
SYNC_DATABASE_URL=sqlite:///db.sqlite3
ASYNC_DATABASE_URL=sqlite+aiosqlite:///./app.db
SESSION_SECRET_KEY=your-secret-key
NEXT_PUBLIC_API_URL=http://localhost:8000
PYTHONDONTWRITEBYTECODE=1

# AIモデル設定（オプション）
OLLAMA_MODEL=gemma3:4b
OPENAI_API_KEY=your-openai-key  # OpenAI使用時
```

#### 拡張・プラグイン開発
- **新しいAIプロバイダーの追加**:
  1. `apps/backend/app/agent/providers/`に新しいプロバイダークラスを作成
  2. `BaseProvider`を継承して実装
  3. `AgentManager`に登録

- **新しいプロンプトテンプレート**:
  1. `apps/backend/app/prompt/`に新しいプロンプトクラスを追加
  2. `BasePrompt`を継承して実装
  3. サービス層で使用

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ローカルAIモデル（Ollama）使用時: レスポンス時間は2-10秒（モデルとハードウェアに依存）
- PDF変換: 10ページのドキュメントで約1-2秒
- 非同期処理により複数リクエストの並列処理が可能

### スケーラビリティ
- **垂直スケーリング**: より高性能なGPU/CPUでAI処理を高速化
- **水平スケーリング**: 現在はシングルインスタンス設計だが、将来的にはRedisキューを使用した分散処理を計画
- **データベース**: SQLiteを使用しているため、大規模な場合はPostgreSQLへの移行を推奨

### 制限事項
- **技術的な制限**:
  - ローカルモデルの精度はクラウドベースのモデルに劣る場合がある
  - 大きなPDFファイル（50MB以上）の処理に時間がかかる
  - SQLiteのため同時書き込みに制限
- **運用上の制限**:
  - マルチユーザー環境では認証機能が未実装
  - 履歴書のバージョン管理機能なし
  - バックアップ機能は手動で実施する必要あり

## 評価・所感
### 技術的評価
#### 強み
- **プライバシー重視**: ローカルで動作するため、機密性の高い履歴書データが外部に送信されない
- **モダンな技術スタック**: FastAPI、Next.js 15、React 19など最新技術を採用
- **開発者フレンドリー**: セットアップスクリプトが充実しており、環境構築が容易
- **拡張性**: AIプロバイダーやプロンプトを簡単に追加・変更可能な設計

#### 改善の余地
- **テストカバレッジ**: 現在テストが不足しており、品質保証が課題
- **ドキュメント**: API仕様書やアーキテクチャドキュメントが不足
- **エラーハンドリング**: より詳細なエラーメッセージとリトライ機能が必要
- **UI/UX**: モバイル対応やアクセシビリティの改善余地あり

### 向いている用途
- **個人の求職活動**: ATSを意識した履歴書の最適化
- **キャリアコンサルタント**: クライアントの履歴書改善支援
- **教育機関**: 学生の就職活動支援ツールとして
- **中小企業の採用**: 応募者の履歴書を標準化して評価

### 向いていない用途
- **大規模な企業採用システム**: マルチテナント機能やセキュリティ機能が不足
- **リアルタイム処理が必要な環境**: AIモデルの処理に時間がかかる
- **非技術者向けのSaaS**: セットアップに技術的知識が必要

### 総評
Resume Matcherは、ATS時代の求職活動において非常に実用的なツールです。特にプライバシーを重視しながらAIの恩恵を受けたいユーザーにとって価値が高い。技術的にもモダンで拡張性の高い設計となっており、オープンソースコミュニティによる継続的な改善が期待できます。ただし、エンタープライズレベルでの使用にはセキュリティ、スケーラビリティ、認証機能などの追加開発が必要です。