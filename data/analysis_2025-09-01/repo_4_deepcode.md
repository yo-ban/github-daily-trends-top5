# リポジトリ解析: HKUDS/DeepCode

## 基本情報
- リポジトリ名: HKUDS/DeepCode  
- 主要言語: Python
- スター数: 4,694
- フォーク数: 525
- 最終更新: 2025年
- ライセンス: MIT License
- トピックス: AI、コード生成、研究自動化、Multi-Agent、Paper2Code、Text2Web、Text2Backend

## 概要
### 一言で言うと
研究論文や自然言語から本格的なコードを自動生成する、マルチエージェントAIシステム。

### 詳細説明
DeepCodeは、研究論文、自然言語記述、URLなどを入力として受け取り、プロダクション対応のコードを自動生成するAI研究エンジンです。Paper2Code（論文からアルゴリズム実装）、Text2Web（自然言語からフロントエンド開発）、Text2Backend（自然言語からバックエンド開発）の3つの主要機能を持ち、香港大学のデータインテリジェンス研究室が開発しています。

複数の専門化されたAIエージェントが協調して動作し、要件理解から設計、実装、テストまでの開発プロセス全体を自動化します。研究者や開発者がアイデアから実装までの時間を大幅に短縮できるツールとして設計されています。

### 主な特徴
- **Paper2Code**: 研究論文から複雑なアルゴリズムを自動実装
- **Text2Web**: 自然言語記述から機能的なフロントエンドWebアプリを生成
- **Text2Backend**: テキスト入力から効率的なバックエンドコードを生成
- **Multi-Agent Architecture**: 7つの専門化されたAIエージェントによる協調処理
- **MCP Protocol Integration**: Model Context Protocol標準による強力な統合機能
- **Web & CLI Interface**: 直感的なWeb UIと高度なCLIの両方を提供
- **Document Intelligence**: PDF、DOC、PPTX等の多様な文書形式に対応
- **CodeRAG System**: コードベース理解のための高度な検索・生成システム

## 使用方法
### インストール
#### 前提条件
- Python 3.9以上
- Node.js（MCP サーバー用）
- 推奨: Python 3.13
- OpenAI APIキーまたはAnthropic APIキー

#### インストール手順
```bash
# 方法1: パッケージマネージャー経由（推奨）
pip install deepcode-hku

# 設定ファイルのダウンロード
curl -O https://raw.githubusercontent.com/HKUDS/DeepCode/main/mcp_agent.config.yaml
curl -O https://raw.githubusercontent.com/HKUDS/DeepCode/main/mcp_agent.secrets.yaml

# 方法2: ソースからビルド（開発者向け）
git clone https://github.com/HKUDS/DeepCode.git
cd DeepCode/
pip install -r requirements.txt
```

### 基本的な使い方
#### Hello World相当の例
```python
# WebインターフェースでDeepCodeを起動
deepcode

# アプリケーションは http://localhost:8501 で起動
```

#### 実践的な使用例
```python
# CLIインターフェースを使用
python cli/main_cli.py

# 研究論文からコード生成の例
# 1. Web UIで論文PDFをアップロード
# 2. "この論文のアルゴリズムを実装してください" と入力
# 3. AIエージェントが自動的に解析・実装を開始
```

### 高度な使い方
```python
# カスタム設定での実行
# mcp_agent.config.yamlでの設定例

# 検索サーバーの変更
default_search_server: "brave"  # または "bocha-mcp"

# 文書セグメンテーション機能
document_segmentation:
  enabled: true
  size_threshold_chars: 50000

# プランニングモードの選択  
planning_mode: "segmented"  # または "traditional"
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: 包括的な機能紹介とセットアップガイド
- **mcp_agent.config.yaml**: MCP設定とエージェント連携設定
- **mcp_agent.secrets.yaml**: API キー設定テンプレート

### サンプル・デモ
- **YouTube Demo**: 実際の動作デモビデオ（Paper2Code、画像処理、Web開発）
- **CLI Demo**: ターミナルベースでの使用例
- **Web UI Demo**: 直感的なブラウザインターフェースデモ

### チュートリアル・ガイド
- 公式YouTube チャンネルでの実演動画
- GitHub Issues での FAQ と使用例
- Discord コミュニティでのサポート

## 技術的詳細
### アーキテクチャ
#### 全体構造
マルチエージェントアーキテクチャを採用し、各エージェントが専門化された役割を持ちます。中央の orchestration engine が全体のワークフローを制御し、MCP（Model Context Protocol）を使用して外部ツールとの統合を実現しています。

#### ディレクトリ構成
```
DeepCode/
├── cli/                    # CLI インターフェース実装
├── config/                 # MCP ツール定義設定
├── prompts/                # エージェント用プロンプト定義
├── tools/                  # 各種ツールサーバー実装
│   ├── code_implementation_server.py
│   ├── document_segmentation_server.py
│   ├── code_indexer.py
│   └── pdf_converter.py
├── ui/                     # Streamlit Web インターフェース
├── utils/                  # 共通ユーティリティ
├── workflows/              # エージェントワークフロー
│   ├── agents/             # 個別エージェント実装
│   └── agent_orchestration_engine.py
└── schema/                 # 設定スキーマ定義
```

#### 主要コンポーネント
- **Central Orchestrating Agent**: 全体ワークフローの戦略的制御
  - 場所: `workflows/agent_orchestration_engine.py`
  - 依存: 各専門エージェント、MCP ツール群
  - インターフェース: async/await ベースの高性能処理

- **Intent Understanding Agent**: 自然言語要件の深い意味解析
  - 場所: `workflows/agents/`
  - 依存: NLP処理エンジン
  - インターフェース: 意図抽出、仕様変換

- **Code Implementation Agent**: 統合情報からのコード合成
  - 場所: `workflows/agents/code_implementation_agent.py`
  - 依存: CodeRAG システム、テストフレームワーク
  - インターフェース: コード生成、テスト作成、文書化

### 技術スタック
#### コア技術
- **言語**: Python 3.13、非同期処理に最適化
- **AI/ML**: OpenAI GPT、Anthropic Claude モデル統合
- **主要ライブラリ**: 
  - mcp-agent (v1.0+): MCP プロトコル実装
  - streamlit: Web インターフェース
  - aiohttp (>=3.8.0): 非同期HTTP通信
  - docling: インテリジェント文書解析

#### 開発・運用ツール
- **ビルドツール**: setuptools、UV パッケージマネージャー対応
- **テスト**: 自動テスト生成機能内蔵
- **CI/CD**: GitHub Actions 対応設計
- **デプロイ**: pip install での簡単デプロイ

### 設計パターン・手法
- **Multi-Agent Coordination**: エージェント間の非同期協調パターン
- **Model Context Protocol**: 標準化されたAIツール統合パターン
- **CodeRAG Architecture**: 検索拡張生成によるコード理解
- **Adaptive Workflow**: 入力複雑度に基づく動的処理戦略選択

### データフロー・処理フロー
1. **入力解析**: 研究論文/自然言語の意図理解
2. **戦略立案**: 中央エージェントによる実装計画策定
3. **並列処理**: 文書解析・参照検索・アーキテクチャ設計の同時実行
4. **コード合成**: 収集情報の統合とコード生成
5. **品質保証**: 自動テスト・検証・文書化
6. **出力配信**: 完全なコードベース、テスト、ドキュメント

## API・インターフェース
### 公開API
#### Web Interface API
- 目的: ブラウザベースの直感的な操作環境
- 使用例:
```python
# Streamlit アプリケーションの起動
streamlit run ui/streamlit_app.py
# または
deepcode  # パッケージインストール後
```

#### CLI Interface API  
- 目的: 高度ユーザー・CI/CD統合向け
- 使用例:
```python
# CLI アプリケーションの実行
python cli/main_cli.py
```

### 設定・カスタマイズ
#### 設定ファイル
```yaml
# mcp_agent.config.yaml
default_search_server: "brave"
planning_mode: "segmented"
document_segmentation:
  enabled: true
  size_threshold_chars: 50000

# API サーバー設定
mcp:
  servers:
    brave:
      command: "npx"
      args: ["-y", "@modelcontextprotocol/server-brave-search"]
```

#### 拡張・プラグイン開発
MCPプロトコルに基づく新しいツールサーバーの追加が可能。カスタムエージェントの実装、専用プロンプトの定義、独自ワークフローの構築をサポート。

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ベンチマーク結果: 中規模論文（20-30ページ）を5-15分で実装可能
- 最適化手法: 非同期処理、並列エージェント実行、インテリジェントキャッシング

### スケーラビリティ
大規模プロジェクトでは文書セグメンテーション機能により、長大な技術文書も効率的に処理可能。複数プロジェクトの同時処理、エンタープライズ環境での利用を想定。

### 制限事項
- APIキー必須（OpenAI または Anthropic）
- 大規模プロジェクトではトークン使用量とコストに注意が必要
- 複雑な数式・図表は文書解析の精度に影響する可能性

## 評価・所感
### 技術的評価
#### 強み
- 研究から実装への画期的なワークフロー自動化
- MCPプロトコル採用による高い拡張性と標準化
- マルチエージェント協調による高品質なコード生成
- Web/CLI両対応による幅広いユーザー層への配慮

#### 改善の余地
- 日本語文書への対応強化
- より詳細なエラーハンドリングとデバッグ機能
- 生成コードの品質評価指標の明確化

### 向いている用途
- 研究論文のアルゴリズム実装自動化
- プロトタイプ開発の高速化
- 教育分野での実装学習支援
- スタートアップでのMVP開発加速

### 向いていない用途
- 機密性の高い企業秘密情報の処理
- リアルタイム性が求められる本番システム
- 高度にカスタマイズされた既存システムの改修

### 総評
DeepCodeは研究開発分野において革命的なツールとなる可能性を秘めています。特にアカデミックな研究から実用的なコードへの橋渡しという、従来手動で時間のかかっていた作業を自動化する点で非常に価値があります。MCPプロトコルの採用により将来的な拡張性も確保されており、AI支援開発ツールとしては先駆的な位置づけです。