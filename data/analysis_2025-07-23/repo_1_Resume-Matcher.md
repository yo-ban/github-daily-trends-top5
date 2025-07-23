# リポジトリ解析: srbhr/Resume-Matcher

## 基本情報
- リポジトリ名: srbhr/Resume-Matcher
- 主要言語: TypeScript
- スター数: 14,646
- フォーク数: 3,769
- 最終更新: 2024年（活発に開発中）
- ライセンス: Apache License 2.0
- トピックス: resume, ats, ai, job-search, resume-optimization, nextjs, fastapi, ollama

## 概要
### 一言で言うと
AIを活用してATS（応募者追跡システム）を突破するために履歴書を最適化する、プライバシー重視のローカルファーストなツール。

### 詳細説明
Resume-MatcherはAIの力を活用して、求職者がATSフィルターを突破できるよう履歴書を最適化するオープンソースプラットフォームです。多くの企業で使用されている自動スクリーニングシステムによる不当な自動拒否を防ぎ、採用アルゴリズムをリバースエンジニアリングして、履歴書をカスタマイズする方法を正確に示します。プロジェクトのビジョンは「履歴書作成のためのVS Code」となることで、包括的な履歴書最適化ツールを目指しています。

### 主な特徴
- **プライバシーファースト**: 完全にローカルで動作し、クラウドへのアップロード不要
- **AIによる履歴書分析**: 職務記述書に対する履歴書のマッチング度をスコア化
- **リアルタイム改善提案**: AIがストリーミングで具体的な改善案を生成
- **複数の職務記述書対応**: 最大3つの求人に対して同時に最適化
- **モダンな技術スタック**: Next.js 15、React 19、FastAPIを使用
- **ローカルAIモデル**: Ollamaを使用してgemma3:4bモデルをローカル実行
- **簡単なセットアップ**: 自動化されたセットアップスクリプトで数分で開始可能

## 使用方法
### インストール
#### 前提条件
- **OS**: Windows (PowerShell 5.1+)、Linux、macOS
- **Node.js**: v18以上
- **Python**: 3.12以上
- **Ollama**: ローカルAIモデル実行用（自動インストール可能）
- **Git**: リポジトリクローン用

#### インストール手順
```bash
# 方法1: 自動セットアップスクリプト（推奨）
git clone https://github.com/srbhr/Resume-Matcher.git
cd Resume-Matcher

# Windows
.\setup.ps1              # 基本セットアップ
.\setup.ps1 -StartDev    # セットアップ後に開発サーバー起動

# Linux/macOS
chmod +x setup.sh
./setup.sh               # 基本セットアップ
./setup.sh --start-dev   # セットアップ後に開発サーバー起動

# 方法2: 手動インストール
# 1. Ollamaをインストール
# 2. Pythonパッケージマネージャuvをインストール
# 3. 依存関係をインストール
npm install
cd apps/backend && uv install && cd ../..
# 4. 環境変数を設定
cp .env.example .env
```

### 基本的な使い方
#### アプリケーションの起動
```bash
# 開発サーバーの起動（フロントエンドとバックエンドを同時に起動）
npm run dev

# ブラウザでアクセス
# フロントエンド: http://localhost:3000
# バックエンドAPI: http://localhost:8000
```

#### 実践的な使用例
```python
# バックエンドAPI経由での履歴書アップロード例
import requests

# 履歴書をアップロード
with open('resume.pdf', 'rb') as f:
    response = requests.post(
        'http://localhost:8000/api/v1/resume/upload',
        files={'file': f}
    )
    resume_id = response.json()['id']

# 職務記述書を追加
job_data = {
    "description": "Looking for a Full Stack Developer with React and Python experience..."
}
response = requests.post(
    'http://localhost:8000/api/v1/job/upload',
    json=job_data
)
job_id = response.json()['id']

# AIによる改善提案を取得
improvement_data = {
    "resume_id": resume_id,
    "job_ids": [job_id]
}
response = requests.post(
    'http://localhost:8000/api/v1/resume/improve',
    json=improvement_data
)
```

### 高度な使い方
```typescript
// フロントエンドでのストリーミングレスポンス処理
const improveResume = async (resumeId: string, jobIds: string[]) => {
  const response = await fetch('/api/v1/resume/improve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume_id: resumeId, job_ids: jobIds })
  });
  
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));
        // リアルタイムで改善提案を表示
        updateUI(data);
      }
    }
  }
};
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクトの概要、インストール手順、基本的な使用方法
- **SETUP.md**: 詳細なセットアップガイド、トラブルシューティング
- **apps/backend/**: FastAPIバックエンドのドキュメント
- **apps/frontend/README.md**: Next.jsフロントエンドの開発ガイド

### サンプル・デモ
- **assets/**: スクリーンショットとデモ画像
- **Landing Page**: インタラクティブなデモ機能を含むランディングページ

### チュートリアル・ガイド
- セットアップスクリプトの使用方法
- 環境変数の設定ガイド
- APIエンドポイントのドキュメント
- Ollamaモデルの設定と最適化

## 技術的詳細
### アーキテクチャ
#### 全体構造
モノレポ構造を採用し、フロントエンドとバックエンドを明確に分離。APIファーストデザインにより、フロントエンドとバックエンドの疎結合を実現。ローカルファーストアーキテクチャにより、プライバシーを保護しながら高性能なAI処理を提供。

#### ディレクトリ構成
```
Resume-Matcher/
├── apps/
│   ├── backend/          # FastAPIベースのPythonバックエンド
│   │   ├── src/          # ソースコード
│   │   ├── scripts/      # ユーティリティスクリプト
│   │   └── tests/        # バックエンドテスト
│   └── frontend/         # Next.js 15ベースのフロントエンド
│       ├── src/          # Reactコンポーネントとページ
│       ├── components/   # UIコンポーネント
│       └── lib/          # ユーティリティ関数
├── assets/               # 画像、スクリーンショット
├── scripts/              # セットアップスクリプト
├── setup.sh              # Linux/macOSセットアップ
├── setup.ps1             # Windowsセットアップ
└── package.json          # ルートpackage.json（Workspaces設定）
```

#### 主要コンポーネント
- **FileUpload**: ドラッグ&ドロップ対応の履歴書アップロードコンポーネント
  - 場所: `apps/frontend/src/components/FileUpload.tsx`
  - 依存: React Hooks、アップロードAPI
  - インターフェース: onFileUpload、supportedFormats（PDF、DOCX）

- **ResumeService**: 履歴書の処理と保存を担当
  - 場所: `apps/backend/src/services/resume_service.py`
  - 依存: SQLAlchemy、markitdown、pdfminer
  - インターフェース: upload_resume、get_resume、process_resume

- **ScoreImprovementService**: AI分析と改善提案の生成
  - 場所: `apps/backend/src/services/score_improvement_service.py`
  - 依存: AgentManager、PromptTemplates
  - インターフェース: improve_resume、calculate_ats_score

- **AgentManager**: AIプロバイダーの抽象化レイヤー
  - 場所: `apps/backend/src/ai/agent_manager.py`
  - 依存: OllamaProvider、OpenAIProvider
  - インターフェース: get_provider、generate_response

### 技術スタック
#### コア技術
- **言語**: 
  - TypeScript 5.x（フロントエンド、型安全性とモダンな機能）
  - Python 3.12+（バックエンド、AIインテグレーション）
- **フレームワーク**: 
  - Next.js 15（App Router、React Server Components）
  - FastAPI（高性能な非同期Pythonフレームワーク）
- **主要ライブラリ**: 
  - React 19: 最新のReact機能を活用したUI構築
  - Tailwind CSS 4.0-alpha: ユーティリティファーストCSS
  - SQLAlchemy: ORMとデータベース管理
  - markitdown: ドキュメントからMarkdownへの変換
  - pdfminer: PDF解析とテキスト抽出
  - Ollama Python SDK: ローカルLLMインテグレーション

#### 開発・運用ツール
- **ビルドツール**: 
  - npm workspaces（モノレポ管理）
  - uv（高速Pythonパッケージマネージャー）
- **テスト**: 
  - Jest（フロントエンドユニットテスト）
  - pytest（バックエンドテスト）
- **CI/CD**: GitHubリポジトリでの開発（CI/CD設定は今後追加予定）
- **デプロイ**: 
  - ローカル開発環境での実行が主
  - Dockerサポート検討中

### 設計パターン・手法
- **レイヤードアーキテクチャ**: プレゼンテーション層（React）、API層（FastAPI）、ビジネスロジック層、データアクセス層の明確な分離
- **ストラテジーパターン**: AIプロバイダーの切り替え（Ollama/OpenAI）を抽象化
- **ファクトリーパターン**: AgentManagerでのプロバイダーインスタンス生成
- **リポジトリパターン**: データベースアクセスの抽象化
- **Server-Sent Events**: リアルタイムストリーミングレスポンス

### データフロー・処理フロー
1. **履歴書アップロード**:
   - ユーザーがPDF/DOCXファイルをアップロード
   - FileUploadコンポーネントがAPIに送信
   - バックエンドでファイルを受信、検証
   - markitdownでMarkdown形式に変換
   - SQLiteデータベースに保存

2. **職務記述書の処理**:
   - テキストエリアに職務記述書を入力
   - APIに送信して構造化データとして解析
   - キーワードと要件を抽出

3. **AI分析フロー**:
   - 履歴書と職務記述書のIDを受信
   - プロンプトテンプレートで分析リクエスト生成
   - Ollama/OpenAI APIを呼び出し
   - ストリーミングレスポンスをSSE経由で送信
   - フロントエンドでリアルタイム表示

## API・インターフェース
### 公開API
#### Resume Upload API
- 目的: 履歴書ファイルのアップロードと処理
- 使用例:
```bash
curl -X POST http://localhost:8000/api/v1/resume/upload \
  -F "file=@resume.pdf" \
  -H "accept: application/json"
```

#### Job Upload API
- 目的: 職務記述書のアップロードと解析
- 使用例:
```bash
curl -X POST http://localhost:8000/api/v1/job/upload \
  -H "Content-Type: application/json" \
  -d '{"description": "Senior Python Developer with AI experience..."}'
```

#### Resume Improvement API（SSE）
- 目的: AIによる履歴書改善提案のストリーミング
- 使用例:
```javascript
const eventSource = new EventSource(
  `/api/v1/resume/improve?resume_id=${resumeId}&job_ids=${jobIds.join(',')}`
);

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Improvement suggestion:', data);
};
```

### 設定・カスタマイズ
#### 設定ファイル
```env
# .env ファイルの設定例
# AI Provider設定
AI_PROVIDER=ollama  # ollama または openai

# Ollama設定
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=gemma3:4b

# OpenAI設定（オプション）
OPENAI_API_KEY=your-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# データベース設定
DATABASE_URL=sqlite:///./resume_matcher.db

# サーバー設定
BACKEND_PORT=8000
FRONTEND_PORT=3000
```

#### 拡張・プラグイン開発
新しいAIプロバイダーの追加方法:
```python
# 1. BaseProviderを継承
from ai.base_provider import BaseProvider

class CustomProvider(BaseProvider):
    def generate_response(self, prompt: str) -> str:
        # カスタムAI実装
        pass

# 2. AgentManagerに登録
if provider_name == "custom":
    return CustomProvider()
```

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ベンチマーク結果: 
  - gemma3:4bモデルでの推論時間: 5-10秒（ローカル実行）
  - ファイルアップロード処理: 1-3秒（2MBファイル）
  - Markdown変換: 1秒未満
- 最適化手法: 
  - ストリーミングレスポンスによるUX改善
  - SQLiteの効率的なインデックス設計
  - Next.jsのサーバーコンポーネントによる初期レンダリング高速化

### スケーラビリティ
- 現在はシングルユーザー向けのローカル実行を想定
- 将来的な拡張性:
  - PostgreSQLへの移行でマルチユーザー対応
  - RedisによるAIレスポンスのキャッシング
  - バックグラウンドジョブ処理（Celery等）

### 制限事項
- **技術的な制限**:
  - ファイルサイズ上限: 2MB
  - 同時処理可能な職務記述書: 最大3つ
  - ローカルAIモデルはGPUなしでは処理が遅い
- **運用上の制限**:
  - 現在はローカル実行のみ（クラウドデプロイ未対応）
  - ユーザー認証機能は未実装
  - 履歴書のバージョン管理機能なし

## 評価・所感
### 技術的評価
#### 強み
- **最新技術の採用**: Next.js 15、React 19など最先端の技術スタック
- **プライバシー重視**: 完全ローカル実行でデータ漏洩の心配なし
- **優れた開発体験**: 自動セットアップスクリプトで簡単に開始可能
- **拡張性の高い設計**: AIプロバイダーの追加が容易なアーキテクチャ
- **実用的な機能**: ATSを実際に突破するための具体的な提案

#### 改善の余地
- **UI/UXの洗練**: まだ開発初期段階でデザインの改善余地あり
- **パフォーマンス**: GPUなしでのローカルAI実行は遅い
- **機能の充実**: バージョン管理、エクスポート機能などが未実装
- **ドキュメント**: APIドキュメントやアーキテクチャ図が不足

### 向いている用途
- **個人の転職活動**: ATSを突破したい求職者の履歴書最適化
- **キャリアコンサルタント**: クライアントの履歴書改善支援ツール
- **企業の採用担当**: 自社ATSとの相性確認ツール
- **開発者の学習**: モダンなフルスタックアプリケーションの参考実装

### 向いていない用途
- **大規模な商用サービス**: 現状はシングルユーザー向け設計
- **クラウドベースのSaaS**: ローカル実行前提の設計
- **リアルタイム共同編集**: マルチユーザー機能が未実装
- **モバイルアプリ**: デスクトップ環境での使用を想定

### 総評
Resume-Matcherは、ATS対策という明確な問題解決に焦点を当てた実用的なツールです。最新の技術スタックを採用し、プライバシーを重視したローカルファーストのアプローチは評価できます。セットアップの簡便性も優れており、開発者フレンドリーです。一方で、まだ開発初期段階（v0.1）であり、UI/UXの改善や機能の充実が今後の課題です。個人利用や小規模チームでの使用には十分実用的ですが、大規模な商用利用にはさらなる開発が必要でしょう。オープンソースプロジェクトとして、コミュニティの貢献により今後の発展が期待できます。