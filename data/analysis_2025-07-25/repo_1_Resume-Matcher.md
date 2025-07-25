# リポジトリ解析: srbhr/Resume-Matcher

## 基本情報
- リポジトリ名: srbhr/Resume-Matcher
- 主要言語: TypeScript
- スター数: 19,024
- フォーク数: 4,052
- 最終更新: 2025年1月（活発に開発中）
- ライセンス: Apache License 2.0
- トピックス: AI, Resume, ATS, Job Matching, Open Source, TypeScript, FastAPI, Next.js

## 概要
### 一言で言うと
AI駆動のレジュメ最適化ツールで、求人情報に対してレジュメを自動的に最適化し、ATS（応募者追跡システム）を通過する確率を大幅に向上させる。

### 詳細説明
Resume Matcherは、求職者がATSボットによる自動却下を回避するために開発されたAI駆動のプラットフォームです。採用アルゴリズムをリバースエンジニアリングし、レジュメを最適化する方法を正確に示します。必要なキーワード、フォーマット、インサイトを提供し、実際に人事担当者の手に届くレジュメ作成を支援します。

開発者は「レジュメ作成のためのVS Code」を目指しており、ローカルで動作するプライバシー重視の設計が特徴です。OllamaによるオープンソースAIモデルを使用し、ユーザーのデータをサーバーにアップロードする必要がありません。

### 主な特徴
- **ローカル動作**: Ollamaを使用し、サーバーへのレジュメアップロード不要
- **ATS互換性分析**: ATSシステムとの互換性を詳細に分析
- **即時マッチスコア**: レジュメと求人情報をアップロードして即座にスコアと改善点を取得
- **キーワード最適化**: 求人キーワードとの整合性を確認し、重要なコンテンツギャップを特定
- **ガイド付き改善**: レジュメを際立たせるための明確な提案を提供
- **マルチフォーマット対応**: PDFとDOCXファイルをサポート
- **リアルタイムプレビュー**: 改善されたレジュメをリアルタイムで確認可能

## 使用方法
### インストール
#### 前提条件
- **Node.js** ≥ v18（npmを含む）
- **Python** ≥ 3.8（python3、pip3）
- **Ollama** 0.6.7（ローカルAIモデルサービング用）
- **Windows**: PowerShell 5.1以降、winget（推奨）
- **Linux/macOS**: Bash 4.4以降、curl、make

#### インストール手順
```bash
# 方法1: クイックスタート（Linux/macOS）
git clone https://github.com/srbhr/Resume-Matcher.git
cd Resume-Matcher
chmod +x setup.sh
./setup.sh
./setup.sh --start-dev  # 開発サーバー起動

# 方法2: Windows PowerShell
git clone https://github.com/srbhr/Resume-Matcher.git
cd Resume-Matcher
.\setup.ps1
.\setup.ps1 -StartDev  # 開発サーバー起動

# 方法3: Makefileを使用（Linux/macOS）
make setup
make run-dev
```

### 基本的な使い方
#### Hello World相当の例
```bash
# 1. レジュメをアップロード（API経由）
curl -X POST http://localhost:8000/api/v1/resumes/upload \
  -F "file=@resume.pdf"

# 2. 求人情報を投稿
curl -X POST http://localhost:8000/api/v1/jobs/upload \
  -H "Content-Type: application/json" \
  -d '{"description": "Software Engineer position...", "title": "Software Engineer"}'

# 3. ブラウザでUIを開く
open http://localhost:3000
```

#### 実践的な使用例
```typescript
// Frontend: レジュメアップロード処理
import { uploadResume } from '@/lib/api/resume';

const handleResumeUpload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/v1/resumes/upload', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    console.log('Resume ID:', data.resume_id);
    
    // レジュメ分析結果を取得
    const analysis = await fetch(`/api/v1/resumes/analyze/${data.resume_id}`);
    return await analysis.json();
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### 高度な使い方
```python
# Backend: カスタムレジュメ改善ロジック
from app.services import ResumeService, ScoreImprovementService
from app.core import get_db_session

async def improve_resume_with_custom_rules(
    resume_id: str, 
    job_id: str,
    custom_keywords: list[str]
):
    async with get_db_session() as db:
        # レジュメとジョブ情報を取得
        resume_service = ResumeService(db)
        improvement_service = ScoreImprovementService(db)
        
        # カスタムキーワードを含めた改善
        improvements = await improvement_service.generate_improvements(
            resume_id=resume_id,
            job_id=job_id,
            additional_keywords=custom_keywords
        )
        
        # 新しいスコアを計算
        new_score = await improvement_service.calculate_match_score(
            resume_id=resume_id,
            job_id=job_id
        )
        
        return {
            "improvements": improvements,
            "new_score": new_score,
            "resume_preview": await resume_service.generate_preview(resume_id)
        }
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクトの概要、主要機能、インストール手順
- **SETUP.md**: 詳細なセットアップガイド（Windows/Linux/macOS対応）
- **公式サイト**: https://resumematcher.fyi - プロジェクトの紹介とコミュニティ情報
- **Discord**: https://dsc.gg/resume-matcher - アクティブな開発コミュニティ

### サンプル・デモ
- **ライブデモ**: https://resumematcher.fyi で基本的な機能を体験可能
- **モックデータ**: Ada Lovelaceの履歴書を使用したデモデータが組み込まれている
- **ビデオデモ**: hero_video.mp4でUIの動作を確認可能

### チュートリアル・ガイド
- GitHubのREADMEに基本的な使用方法
- SETUP.mdに詳細なインストール手順
- Discordコミュニティでの活発な議論とサポート
- LinkedInページでの更新情報とチュートリアル

## 技術的詳細
### アーキテクチャ
#### 全体構造
モノレポ構造を採用し、フロントエンドとバックエンドを統合管理。FastAPIによるRESTful APIサーバーとNext.jsによるモダンなフロントエンドで構成。Ollamaを使用してローカルでAIモデルを実行し、プライバシーを保護しながら高度な分析機能を提供。

#### ディレクトリ構成
```
Resume-Matcher/
├── apps/                  # アプリケーションコード
│   ├── backend/          # FastAPIバックエンド
│   │   ├── app/         # アプリケーションコア
│   │   │   ├── api/     # APIエンドポイント定義
│   │   │   ├── core/    # 設定、DB接続、ロギング
│   │   │   ├── models/  # SQLAlchemyモデル
│   │   │   ├── schemas/ # Pydanticスキーマ
│   │   │   └── services/# ビジネスロジック
│   │   └── pyproject.toml
│   └── frontend/         # Next.jsフロントエンド
│       ├── app/         # App Routerページ
│       ├── components/  # Reactコンポーネント
│       ├── hooks/       # カスタムフック
│       └── lib/         # ユーティリティ、API呼び出し
├── assets/              # 画像、アイコンなどのリソース
├── scripts/             # セットアップ、ビルドスクリプト
├── package.json         # ルートパッケージ設定
├── setup.sh            # Linux/macOSセットアップ
└── setup.ps1           # Windowsセットアップ
```

#### 主要コンポーネント
- **ResumeService**: レジュメの解析、保存、変換処理
  - 場所: `apps/backend/app/services/resume.py`
  - 依存: markitdown、SQLAlchemy、Ollama
  - インターフェース: convert_and_store_resume(), get_resume()

- **ScoreImprovementService**: レジュメと求人のマッチング分析
  - 場所: `apps/backend/app/services/score_improvement.py`
  - 依存: Ollama LLM、ResumeService、JobService
  - インターフェース: generate_improvements(), calculate_match_score()

- **FileUpload Component**: ドラッグ&ドロップファイルアップロード
  - 場所: `apps/frontend/components/common/file-upload.tsx`
  - 依存: React、カスタムフック
  - インターフェース: onFileSelect, acceptedFormats props

- **Dashboard Components**: レジュメ分析結果の表示
  - 場所: `apps/frontend/components/dashboard/`
  - 依存: React Context、Tailwind CSS
  - インターフェース: ResumeAnalysis, JobListings, ResumePreview

### 技術スタック
#### コア技術
- **言語**: 
  - Python 3.12+ (バックエンド) - 型ヒント、非同期処理
  - TypeScript (フロントエンド) - 型安全性
- **フレームワーク**: 
  - FastAPI - 高性能な非同期APIサーバー
  - Next.js 15+ - App Router、Turbopack対応
- **主要ライブラリ**: 
  - Ollama (0.4.7): ローカルLLM実行（gemma3:4bモデル使用）
  - SQLAlchemy (2.0.40): 非同期ORMとデータベース管理
  - markitdown (0.1.1): ドキュメント変換（PDF/DOCX→Markdown）
  - Tailwind CSS (v4): UIスタイリング
  - Radix UI: アクセシブルなUIコンポーネント

#### 開発・運用ツール
- **ビルドツール**: 
  - uv: 高速なPython依存関係管理
  - npm/pnpm: Node.js依存関係管理
  - concurrently: 並列プロセス実行
- **テスト**: 現在はテストコードなし（開発中）
- **CI/CD**: 現時点では未実装
- **デプロイ**: 
  - ローカル実行が主要な使用方法
  - Dockerサポートは計画中

### 設計パターン・手法
- **レイヤードアーキテクチャ**: API層、サービス層、データ層の明確な分離
- **依存性注入**: FastAPIのDependsを使用したDB接続管理
- **非同期処理**: async/awaitによる高効率な並行処理
- **コンテキストプロバイダー**: Reactでのグローバル状態管理
- **モノレポ構造**: フロントエンドとバックエンドの統合管理

### データフロー・処理フロー
1. **レジュメアップロード**: ユーザーがPDF/DOCXファイルをアップロード
2. **ファイル変換**: markitdownでMarkdown形式に変換
3. **データ保存**: SQLiteデータベースに保存
4. **求人情報入力**: ユーザーが求人情報をテキストで入力
5. **AI分析**: Ollama経由でローカルLLMが分析実行
6. **キーワード抽出**: レジュメと求人情報からキーワード抽出
7. **マッチング計算**: スコアと改善提案を生成
8. **結果表示**: ダッシュボードで結果をリアルタイム表示

## API・インターフェース
### 公開API
#### POST /api/v1/resumes/upload
- 目的: レジュメファイルのアップロードと解析
- 使用例:
```javascript
const formData = new FormData();
formData.append('file', resumeFile);

const response = await fetch('/api/v1/resumes/upload', {
  method: 'POST',
  body: formData
});
```

#### POST /api/v1/jobs/upload
- 目的: 求人情報の登録
- 使用例:
```javascript
const response = await fetch('/api/v1/jobs/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    description: jobDescription,
    title: jobTitle
  })
});
```

#### GET /api/v1/jobs?job_id={id}
- 目的: 求人情報の取得
- 使用例:
```javascript
const response = await fetch(`/api/v1/jobs?job_id=${jobId}`);
const jobData = await response.json();
```

### 設定・カスタマイズ
#### 設定ファイル
```env
# .env (ルート)
NEXT_PUBLIC_API_URL=http://localhost:8000

# apps/backend/.env
SYNC_DATABASE_URL=sqlite:///db.sqlite3
ASYNC_DATABASE_URL=sqlite+aiosqlite:///./app.db
SESSION_SECRET_KEY=your-secret-key
PYTHONDONTWRITEBYTECODE=1
ALLOWED_ORIGINS=["http://localhost:3000"]
```

#### 拡張・プラグイン開発
現在のバージョンでは正式なプラグインシステムは未実装。ただし、以下の拡張が可能：
- カスタムAIモデルの追加（Ollama経由）
- 新しいファイル形式のサポート（markitdownの拡張）
- カスタムスコアリングアルゴリズムの実装
- 新しいUIコンポーネントの追加

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ベンチマーク結果: 
  - レジュメ解析: 2-5秒（ローカルLLM使用時）
  - ファイル変換: 1秒以下（通常のPDF/DOCX）
- 最適化手法: 
  - 非同期処理による並行実行
  - ローカルLLM使用によるレイテンシ削減
  - SQLiteによる高速ローカルストレージ

### スケーラビリティ
現在はローカル実行を前提としたシングルユーザー向け設計。将来的な拡張計画：
- マルチユーザーサポート
- クラウドデプロイメント対応
- 分散処理によるスケールアウト
- より大規模なLLMモデルのサポート

### 制限事項
- 対応ファイル形式: PDFとDOCXのみ
- ローカルリソース依存: Ollamaの実行に相応のCPU/メモリが必要
- シングルユーザー: 現在はマルチユーザー非対応
- 言語サポート: 主に英語（他言語は部分的サポート）

## 評価・所感
### 技術的評価
#### 強み
- **プライバシー重視**: 完全ローカル実行でデータ漏洩リスクなし
- **オープンソース**: 透明性が高く、カスタマイズ可能
- **モダンな技術スタック**: FastAPI、Next.js、TypeScriptなど最新技術を採用
- **使いやすいUI**: 直感的なドラッグ&ドロップインターフェース
- **高速処理**: ローカルLLMによる低レイテンシ

#### 改善の余地
- テストカバレッジの不足
- CI/CDパイプラインの未実装
- ドキュメントの充実度（APIドキュメントなど）
- エラーハンドリングの統一性
- マルチ言語サポートの強化

### 向いている用途
- 個人の求職活動でのレジュメ最適化
- キャリアコンサルタントのクライアント支援
- 大学のキャリアセンターでの学生支援
- プライバシーを重視する組織での内部利用
- レジュメ作成サービスのプロトタイプ開発

### 向いていない用途
- 大規模な企業の採用システムとしての利用
- リアルタイムマルチユーザー環境
- 非英語圏での本格的な利用
- モバイルアプリケーションとしての利用
- 商用クラウドサービスとしての展開（現状）

### 総評
Resume Matcherは、ATS対策という現代の求職活動における重要な課題に対する優れたオープンソースソリューションです。ローカル実行によるプライバシー保護、最新の技術スタック、直感的なUIなど、多くの強みを持っています。

特に注目すべきは、「レジュメ作成のVS Code」というビジョンです。現在はまだ開発初期段階ですが、活発なコミュニティと明確な方向性により、将来的には求職者にとって必須のツールになる可能性があります。

技術的には、FastAPIとNext.jsの組み合わせによるモダンなアーキテクチャ、Ollamaを使用したローカルAI実行など、最新のトレンドを押さえた実装となっています。ただし、テストの不足やドキュメントの改善余地など、プロダクション利用に向けてはまだ課題も残されています。

総じて、個人利用や小規模組織での利用には十分実用的であり、今後の発展が大いに期待できるプロジェクトと評価できます。