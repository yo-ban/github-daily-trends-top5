# リポジトリ解析: srbhr/Resume-Matcher

## 基本情報
- リポジトリ名: srbhr/Resume-Matcher
- 主要言語: TypeScript
- スター数: 11,275
- フォーク数: 3,565
- 最終更新: 2025年7月（活発に開発中）
- ライセンス: Apache License 2.0
- トピックス: resume-optimization, ats-compatibility, ai-powered, local-processing, job-matching

## 概要
### 一言で言うと
AIを活用してレジュメ（履歴書）をATS（応募者追跡システム）に最適化し、求人票とのマッチング率を向上させるオープンソースプラットフォーム。

### 詳細説明
Resume-Matcherは、求職者がATS（Applicant Tracking System）のフィルターを通過しやすいレジュメを作成できるよう支援するツールです。ローカルで動作するAI（Ollama + Gemma3:4bモデル）を使用して、レジュメと求人票を分析し、具体的な改善提案を提供します。プライバシーを重視し、すべての処理をローカルで実行するため、個人情報が外部サーバーに送信されることはありません。最終的には「レジュメ作成のVS Code」となることを目指しています。

### 主な特徴
- ローカルAI処理（Ollama + Gemma3:4bモデル）によるプライバシー保護
- ATS互換性分析とスコアリング（0-100点）
- キーワード最適化と不足要素の特定
- 具体的で実行可能な改善提案の生成
- PDF・DOCX形式のレジュメ対応
- リアルタイムストリーミング対応のAPI
- モダンでレスポンシブなUI（ダークモード対応）

## 使用方法
### インストール
#### 前提条件
- Node.js 18+ および npm/yarn/pnpm
- Python 3.12+
- Git
- Ollama（セットアップスクリプトが自動インストール）
- 4GB以上の空きディスク容量（AIモデル用）

#### インストール手順
```bash
# 方法1: 自動セットアップスクリプト（推奨）
# Linux/macOS
git clone https://github.com/srbhr/Resume-Matcher.git
cd Resume-Matcher
./setup.sh
./setup.sh --start-dev  # 開発サーバー起動

# Windows PowerShell
git clone https://github.com/srbhr/Resume-Matcher.git
cd Resume-Matcher
.\setup.ps1
.\setup.ps1 -StartDev  # 開発サーバー起動

# 方法2: 手動セットアップ
# Ollamaのインストール
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull gemma2:9b

# 依存関係のインストール
npm install
npm run dev  # 開発サーバー起動
```

### 基本的な使い方
#### Hello World相当の例
```python
# APIエンドポイントの使用例
import requests

# レジュメのアップロード
with open('resume.pdf', 'rb') as f:
    response = requests.post(
        'http://localhost:8000/api/v1/resume/upload',
        files={'file': f}
    )
    resume_data = response.json()

# 求人票のアップロード
job_description = {
    "description": "We are looking for a Python developer..."
}
response = requests.post(
    'http://localhost:8000/api/v1/job/upload',
    json=job_description
)
```

#### 実践的な使用例
```python
# レジュメの改善提案を取得
improvement_request = {
    "resume": resume_data['content'],
    "job_description": job_description['description']
}

# ストリーミングレスポンスで改善提案を受信
response = requests.post(
    'http://localhost:8000/api/v1/resume/improve',
    json=improvement_request,
    stream=True
)

for line in response.iter_lines():
    if line:
        # Server-Sent Eventsの処理
        data = line.decode('utf-8')
        if data.startswith('data: '):
            print(data[6:])  # 改善提案をリアルタイム表示
```

### 高度な使い方
```python
# カスタムプロンプトを使用した分析
advanced_request = {
    "resume": resume_data['content'],
    "job_description": job_description['description'],
    "custom_instructions": "Focus on technical skills gap analysis",
    "model_config": {
        "temperature": 0.7,
        "max_tokens": 2000
    }
}

# バッチ処理での複数レジュメ分析
resumes = ['resume1.pdf', 'resume2.pdf', 'resume3.pdf']
results = []

for resume_path in resumes:
    with open(resume_path, 'rb') as f:
        # アップロードと分析を実行
        upload_resp = requests.post(
            'http://localhost:8000/api/v1/resume/upload',
            files={'file': f}
        )
        
        improve_resp = requests.post(
            'http://localhost:8000/api/v1/resume/improve',
            json={
                "resume": upload_resp.json()['content'],
                "job_description": job_description['description']
            }
        )
        
        results.append({
            "file": resume_path,
            "score": improve_resp.json()['score'],
            "suggestions": improve_resp.json()['suggestions']
        })
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクトの概要、機能、インストール手順、コントリビューション方法
- **SETUP.md**: 詳細なセットアップ手順とトラブルシューティング
- **CONTRIBUTING.md**: コントリビューションガイドライン、コーディング規約、PRプロセス
- **SECURITY.md**: セキュリティポリシーと脆弱性報告方法
- **Discord**: コミュニティサポートと議論のためのDiscordサーバー

### サンプル・デモ
- **setup.sh/setup.ps1**: 自動セットアップスクリプトで環境構築とデモ実行
- **Makefile**: 開発用コマンド集（make dev, make build, make lint）
- **Frontend Demo**: http://localhost:3000 でアクセス可能なWebインターフェース

### チュートリアル・ガイド
- セットアップスクリプトによる自動環境構築
- READMEに記載された使用方法
- Discordコミュニティでのサポート
- GitHubのIssueテンプレートによる質問・バグ報告

## 技術的詳細
### アーキテクチャ
#### 全体構造
モノリポジトリ構成で、フロントエンド（Next.js）とバックエンド（FastAPI）をappsディレクトリ内に配置。ローカルAI処理を中心としたマイクロサービス指向の設計。

#### ディレクトリ構成
```
Resume-Matcher/
├── apps/
│   ├── backend/          # FastAPIバックエンド
│   │   ├── app/
│   │   │   ├── agent/    # AIモデル統合（Ollama/OpenAI）
│   │   │   ├── api/      # APIルート（v1）
│   │   │   ├── core/     # コアユーティリティ（設定、セキュリティ）
│   │   │   ├── models/   # SQLAlchemyデータベースモデル
│   │   │   ├── prompt/   # AIプロンプトテンプレート
│   │   │   ├── schemas/  # Pydanticスキーマ
│   │   │   └── services/ # ビジネスロジック層
│   │   └── pyproject.toml
│   └── frontend/         # Next.jsフロントエンド
│       ├── app/          # App Routerページ
│       ├── components/   # Reactコンポーネント
│       │   ├── common/   # 共通コンポーネント
│       │   ├── dashboard/# ダッシュボードコンポーネント
│       │   └── ui/       # UIプリミティブ
│       └── package.json
├── assets/               # ドキュメント用画像
├── setup.sh/setup.ps1    # セットアップスクリプト
└── Makefile              # 開発用コマンド
```

#### 主要コンポーネント
- **AIエージェントシステム**: ローカルAI処理の中核
  - 場所: `apps/backend/app/agent/`
  - 依存: Ollama、LangChain
  - インターフェース: BaseAgentクラス、analyze_resumeメソッド

- **APIルーター**: RESTful APIエンドポイント
  - 場所: `apps/backend/app/api/v1/`
  - 依存: FastAPI、Pydantic
  - インターフェース: レジュメ/求人票アップロード、改善提案API

- **ドキュメント処理**: PDF/DOCX→Markdown変換
  - 場所: `apps/backend/app/services/document_processor.py`
  - 依存: pdfminer.six、beautifulsoup4、markdownify
  - インターフェース: process_document関数

### 技術スタック
#### コア技術
- **言語**: 
  - Python 3.12+ (バックエンド、非同期処理、型ヒント使用)
  - TypeScript (フロントエンド、完全な型安全性)
- **フレームワーク**: 
  - FastAPI: 高速非同期Web APIフレームワーク
  - Next.js 15: Reactフレームワーク（App Router使用）
- **主要ライブラリ**: 
  - Ollama: ローカルAIモデル実行
  - SQLAlchemy (2.0+): 非同期ORM
  - Pydantic (2.0+): データ検証とシリアライゼーション
  - Radix UI: アクセシブルUIコンポーネント
  - Tailwind CSS v4: ユーティリティファーストCSS

#### 開発・運用ツール
- **ビルドツール**: 
  - uv: 高速Pythonパッケージマネージャー
  - npm/pnpm: Node.jsパッケージ管理
  - Makefile: 統合ビルドコマンド
- **テスト**: 現在テストスイートは未実装（今後の課題）
- **CI/CD**: GitHub Actionsパイプライン未設定
- **デプロイ**: セットアップスクリプトによるローカル実行

### 設計パターン・手法
- **クリーンアーキテクチャ**: レイヤードアーキテクチャ（API、サービス、モデル層）
- **依存性注入**: FastAPIの依存性注入システムを活用
- **プロバイダーパターン**: AIプロバイダーの抽象化（Ollama/OpenAI切り替え）
- **ストリーミングレスポンス**: Server-Sent Eventsを使用したリアルタイム処理

### データフロー・処理フロー
1. **レジュメアップロード**
   - PDF/DOCXファイル受信 → バリデーション
   - ドキュメント解析 → Markdown変換
   - データベース保存（SQLite）

2. **分析処理**
   - レジュメと求人票のペアを取得
   - AIプロンプト生成（テンプレートベース）
   - Ollamaによるローカル推論
   - ストリーミングレスポンス返却

3. **結果処理**
   - スコア算出（0-100点）
   - 改善提案の構造化
   - JSON形式でクライアントに返却

## API・インターフェース
### 公開API
#### POST /api/v1/resume/upload
- 目的: PDF/DOCXレジュメのアップロードとMarkdown変換
- 使用例:
```python
import requests

with open('resume.pdf', 'rb') as f:
    response = requests.post(
        'http://localhost:8000/api/v1/resume/upload',
        files={'file': ('resume.pdf', f, 'application/pdf')}
    )
    resume_data = response.json()
    # {"content": "Markdown形式のレジュメ", "file_name": "resume.pdf"}
```

#### POST /api/v1/resume/improve
- 目的: レジュメと求人票のマッチング分析と改善提案
- 使用例:
```python
data = {
    "resume": "Markdown形式のレジュメ内容",
    "job_description": "求人票の内容"
}

# ストリーミングレスポンス
response = requests.post(
    'http://localhost:8000/api/v1/resume/improve',
    json=data,
    stream=True
)

for line in response.iter_lines():
    if line and line.startswith(b'data: '):
        content = line[6:].decode('utf-8')
        print(content)  # リアルタイムで改善提案を表示
```

### 設定・カスタマイズ
#### 設定ファイル
```.env
# バックエンド設定
FASTAPI_ENV=development
DATABASE_URL=sqlite+aiosqlite:///./resume_matcher.db
OLLAMA_BASE_URL=http://localhost:11434
MODEL_NAME=gemma2:9b

# フロントエンド設定
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### 拡張・プラグイン開発
**AIプロバイダーの追加**
```python
# apps/backend/app/agent/base.py
from abc import ABC, abstractmethod

class BaseAgent(ABC):
    @abstractmethod
    async def analyze_resume(self, resume: str, job_desc: str) -> dict:
        pass

# 新しいプロバイダーの実装
class CustomAgent(BaseAgent):
    async def analyze_resume(self, resume: str, job_desc: str) -> dict:
        # カスタム実装
        pass
```

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- レスポンス時間: 
  - レジュメアップロード: 1-2秒（ファイルサイズに依存）
  - AI分析: 10-30秒（Gemma2:9bモデル使用時）
- 最適化手法: 
  - 非同期処理（FastAPI + aiosqlite）
  - Server-Sent Eventsによるストリーミング
  - ローカルAI処理によるレイテンシ削減

### スケーラビリティ
- **水平スケーリング**: 
  - 複数のOllamaインスタンスへのロードバランシング可能
  - バックエンドAPIの複数インスタンス化可能
- **ローカルファースト**: 
  - 各ユーザーが自分のマシンで実行するためサーバー負荷が分散

### 制限事項
- **技術的な制限**:
  - GPU搭載マシンでの実行が推奨（AI推論速度向上）
  - Gemma2:9bモデルは約4GBのメモリが必要
  - SQLiteの同時接続制限
- **運用上の制限**:
  - 現在テストスイートが存在しない
  - CI/CDパイプラインが未設定
  - プロダクションデプロイ手順が未整備

## 評価・所感
### 技術的評価
#### 強み
- **プライバシー重視**: すべての処理がローカルで完結し、個人情報の外部送信なし
- **モダンな技術スタック**: FastAPI + Next.js 15による最新のWebアプリケーション構成
- **優れたDX**: 自動セットアップスクリプトによる簡単な環境構築
- **リアルタイム処理**: Server-Sent Eventsによるストリーミングレスポンス
- **拡張性**: AI プロバイダーの抽象化により、新しいモデルの追加が容易

#### 改善の余地
- **テスト不足**: 単体テスト、統合テスト、E2Eテストが未実装
- **CI/CD未整備**: 自動化されたビルド・デプロイプロセスがない
- **ドキュメント不足**: API仕様書やアーキテクチャドキュメントが不十分
- **エラーハンドリング**: より詳細なエラーメッセージとリトライ機構が必要

### 向いている用途
- **個人の就職活動支援**: プライバシーを重視する求職者のレジュメ最適化
- **企業の採用支援ツール**: 社内でのレジュメスクリーニング効率化
- **教育機関での利用**: 学生のキャリア支援ツールとして
- **AI活用のPoC**: ローカルLLMを使ったアプリケーション開発の参考実装

### 向いていない用途
- **大規模SaaS**: マルチテナント対応やスケーラビリティに課題
- **リアルタイム要求**: AI推論に10-30秒かかるため、即時応答が必要な用途には不向き
- **モバイルアプリ**: ローカルAIモデルの実行にはデスクトップ環境が必要
- **低スペック環境**: GPUと4GB以上のメモリが必要

### 総評
Resume-Matcherは、プライバシーを重視しながらAIを活用してレジュメを最適化する革新的なツールです。ローカルでのAI処理という技術的なチャレンジに挑戦し、実用的なソリューションを提供しています。セットアップの簡便性とモダンな技術スタックは評価できますが、プロダクション利用にはテストとCI/CDの整備が必要です。オープンソースプロジェクトとして活発に開発が進んでおり、今後の成長が期待できます。