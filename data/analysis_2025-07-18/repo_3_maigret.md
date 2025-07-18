# リポジトリ解析: soxoj/maigret

## 基本情報
- リポジトリ名: soxoj/maigret
- 主要言語: Python
- スター数: 16,171
- フォーク数: 1,114
- 最終更新: アクティブに開発中（0.5.0a1）
- ライセンス: MIT License
- トピックス: OSINT、ユーザー名検索、ソーシャルメディア調査、プロファイリング

## 概要
### 一言で言うと
Maigretは、ユーザー名だけで3000以上のサイトからアカウントを検索し、個人に関する包括的なドシエ（情報ファイル）を収集するOSINTツールです。

### 詳細説明
Maigretは、オープンソースインテリジェンス（OSINT）分野の強力なツールで、Sherlockプロジェクトのフォークとして開発されました。ユーザー名を入力するだけで、ソーシャルメディア、フォーラム、ゲーミングサイト、開発者プラットフォームなど、世界中の3000以上のウェブサイトから該当するアカウントを検索します。個人情報の抽出、リンクされたアカウントの追跡、視覚的なグラフ生成など、単なるユーザー名検索を超えた高度な機能を提供します。

### 主な特徴
- 3000以上のサイトをサポート
- 非同期処理による高速検索
- 個人情報の自動抽出
- 再帰的検索による関連アカウントの発見
- 複数形式のレポート生成（HTML、PDF、XMind、JSONなど）
- グラフィカルなWebインターフェース
- Tor/I2Pサポート
- タグベースのサイトフィルタリング
- ユーザー名のパーミュテーション生成
- 様々なIDタイプのサポート（username、steam_id、vk_idなど）

## 使用方法
### インストール
#### 前提条件
- Python 3.10以上（Python 3.11推奨）
- インターネット接続
- （オプション）Torプロキシ（Torサイト検索用）

#### インストール手順
```bash
# 方法1: pip経由（推奨）
pip3 install maigret

# 方法2: Docker
docker pull soxoj/maigret

# 方法3: Gitクローン
git clone https://github.com/soxoj/maigret.git
cd maigret
pip3 install -e .

# 方法4: Windows用スタンドアロンEXE
# GitHub Releasesからダウンロード

# 方法5: クラウド環境
# Google Cloud Shell、Replit、Google Colab、Binderで利用可能
```

### 基本的な使い方
#### Hello World相当の例
```bash
# ユーザー名をトップ500サイトで検索
maigret username

# Dockerを使用した場合
docker run -v "$(pwd)"/reports:/reports soxoj/maigret:latest username
```

#### 実践的な使用例
```bash
# すべてのサイトで検索
maigret username -a

# HTMLレポートを生成
maigret username --html --pdf

# 特定のタグでフィルタリング（写真・デートサイト）
maigret username --tags photo,dating

# 国別フィルタリング（アメリカ、日本のサイト）
maigret username --tags us,jp

# 複数のユーザー名を一度に検索
maigret user1 user2 user3

# URLから情報を解析
maigret --parse https://steamcommunity.com/profiles/76561199113454789
```

### 高度な使い方
```bash
# グラフ付きWebインターフェースを起動
maigret --web 5000
# ブラウザで http://localhost:5000 にアクセス

# 再帰的検索を無効化
maigret username --no-recursion

# タイムアウトとリトライ回数を調整
maigret username --timeout 30 --retries 2

# XMindマインドマップを生成
maigret username --xmind

# Torプロキシを使用
maigret username --tor-proxy 127.0.0.1:9050

# 動作しないサイトをテストして無効化
maigret --self-check

# ユーザー名のパーミュテーションを生成して検索
maigret john --permute

# 特定のIDタイプで検索（Steam IDの例）
maigret --id-type steam_id 76561199113454789
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、インストール方法、使用例、デモ
- **docs/source/**: 詳細なドキュメント（Sphinx形式）
  - quick-start.rst: クイックスタートガイド
  - usage-examples.rst: 使用例集
  - command-line-options.rst: CLIオプション詳細
  - supported-identifier-types.rst: サポートされるIDタイプ
  - tags.rst: タグシステムの説明
- **公式サイト**: https://maigret.readthedocs.io
- **Telegram Bot**: https://t.me/osint_maigret_bot

### サンプル・デモ
- **example.ipynb**: Jupyter Notebook形式のインタラクティブな使用例
- **sites.md**: サポートされるサイトの一覧
- **レポートサンプル**: static/ディレクトリ内
  - report_alexaimephotography_html_screenshot.png: HTMLレポートのスクリーンショット
  - report_alexaimephotography_xmind_screenshot.png: XMindマインドマップの例
  - web_interface_screenshot.png: Webインターフェースのスクリーンショット

### チュートリアル・ガイド
- GitHub READMEのデモ動画
- Read the Docsのクイックスタートガイド
- 使用例ドキュメント
- クラウド環境での実行方法（Colab、Binder）

## 技術的詳細
### アーキテクチャ
#### 全体構造
Maigretは非同期I/Oを活用した高速スキャンアーキテクチャを採用しています。aiohttpによる非同期HTTPリクエスト、4000サイトの情報を含むJSONデータベース、柔軟なレポート生成システム、Flaskを使用したWebインターフェースなど、モジュラーな設計になっています。

#### ディレクトリ構成
```
maigret/
├── maigret/              # メインパッケージ
│   ├── maigret.py       # メインエントリポイントとオーケストレーション
│   ├── checking.py      # サイトチェックロジック
│   ├── sites.py         # サイトデータベース管理
│   ├── report.py        # レポート生成
│   ├── activation.py    # サイトアクティベーション機能
│   ├── permutator.py    # ユーザー名パーミュテーション
│   ├── result.py        # 結果データ構造
│   ├── settings.py      # 設定管理
│   ├── utils.py         # ユーティリティ関数
│   ├── resources/       # リソースファイル
│   │   ├── data.json    # 4000サイトのデータベース
│   │   ├── settings.json # デフォルト設定
│   │   └── *.tpl        # レポートテンプレート
│   └── web/              # Webインターフェース
│       ├── app.py       # Flaskアプリケーション
│       └── templates/   # HTMLテンプレート
├── docs/                 # Sphinxドキュメント
├── tests/                # pytestテスト
└── utils/                # 開発ユーティリティ
```

#### 主要コンポーネント
- **Main Engine (maigret.py)**: 検索オーケストレーション
  - 場所: `maigret/maigret.py`
  - 依存: checking, sites, reportモジュール
  - インターフェース: `search()`, `self_check()`, `main()`

- **Checking Module**: サイトチェックエンジン
  - 場所: `maigret/checking.py`
  - 依存: aiohttp, cloudscraper
  - インターフェース: `check_username()`, `check_site()`

- **Sites Database**: サイト情報管理
  - 場所: `maigret/sites.py`
  - 依存: data.jsonファイル
  - インターフェース: `MaigretDatabase`, `MaigretSite`

- **Report Generator**: レポート生成
  - 場所: `maigret/report.py`
  - 依存: xhtml2pdf, XMind, jinja2
  - インターフェース: `generate_report_html()`, `generate_report_pdf()`

### 技術スタック
#### コア技術
- **言語**: Python 3.10+ (Python 3.11推奨)、非同期プログラミングを活用
- **フレームワーク**: 
  - Flask: Webインターフェース
  - asyncio: 非同期処理
- **主要ライブラリ**: 
  - aiohttp (3.10.10): 非同期HTTPクライアント
  - requests (2.32.3): 同期HTTPクライアント
  - cloudscraper (1.2.71): Cloudflare対策
  - socid-extractor (0.0.27): ソーシャルID抽出
  - xhtml2pdf (0.2.16): PDFレポート生成
  - XMind (1.2.0): マインドマップ生成
  - stem (1.8.2), torrequest (0.1.0): Torサポート
  - pyvis (0.3.2), networkx (3.3): グラフ可視化
  - Jinja2 (3.1.4): テンプレートエンジン
  - colorama (0.4.6): カラーコンソール出力

#### 開発・運用ツール
- **ビルドツール**: 
  - Poetry: 依存関係管理
  - PyInstaller: Windows用スタンドアロンEXE作成
  - setuptools: Pythonパッケージング
- **テスト**: 
  - pytest: テストフレームワーク
  - flake8: コード品質チェック
  - ユニットテストと統合テスト
- **CI/CD**: 
  - GitHub Actions: 自動テスト、リリース
  - Docker Hub: イメージ自動ビルド
- **デプロイ**: 
  - PyPI: pipインストール
  - Docker: コンテナデプロイ
  - GitHub Releases: バイナリ配布

### 設計パターン・手法
- **プラグインアーキテクチャ**: サイトごとのチェックロジックをプラグイン化
- **非同期I/Oパターン**: aiohttpによる並行リクエスト処理
- **テンプレートパターン**: Jinja2を使用したレポート生成
- **データ駆動設計**: JSONデータベースによるサイト情報管理
- **モジュラー設計**: 機能ごとに分離されたモジュール

### データフロー・処理フロー
1. **初期化**:
   - コマンドライン引数の解析
   - 設定ファイルの読み込み
   - サイトデータベースのロード

2. **フィルタリング**:
   - タグによるサイト選別
   - top_sites_countによる制限
   - ユーザー指定サイトの適用

3. **ユーザー名処理**:
   - パーミュテーション生成（オプション）
   - IDタイプの変換

4. **並行チェック**:
   - 非同期タスクの生成
   - HTTPリクエストの発行
   - レスポンスの解析
   - アカウント存在判定

5. **情報抽出**:
   - 個人情報のスクレイピング
   - リンクの収集
   - IDの抽出

6. **再帰的検索**:
   - 関連ユーザー名の発見
   - 追加検索の実行

7. **レポート生成**:
   - 結果の集約
   - フォーマット変換
   - ファイル出力

## API・インターフェース
### 公開API
#### CLIインターフェース
- 目的: ユーザー名検索、レポート生成、サイト管理
- 使用例:
```bash
# 基本的なオプション
maigret --help
maigret username [OPTIONS]

# 主要なオプション
--all-sites         # すべてのサイトで検索
--tags TAG          # タグでフィルタリング
--site SITE_NAME    # 特定サイトのみ
--timeout SEC       # タイムアウト設定
--id-type TYPE      # IDタイプ指定
--parse URL         # URL解析
--submit URL        # 新サイト追加
```

#### Web API (Flask)
- 目的: インタラクティブな検索インターフェース
- 使用例:
```python
# Webサーバー起動
maigret --web 5000

# エンドポイント
# GET /       - メインページ
# POST /search - 検索実行
# GET /status  - 検索ステータス
# GET /results - 結果取得
```

### 設定・カスタマイズ
#### 設定ファイル (settings.json)
```json
{
  "timeout": 30,                    // リクエストタイムアウト（秒）
  "max_connections": 100,           // 最大同時接続数
  "top_sites_count": 500,           // デフォルト検索サイト数
  "recursive_search": true,         // 再帰的検索の有効化
  "info_extracting": true,          // 情報抽出の有効化
  "proxy_url": null,                // HTTPプロキシ
  "tor_proxy_url": "socks5://127.0.0.1:9050", // Torプロキシ
  "reports_path": "reports",        // レポート保存先
  "tags": {                         // タグシステム
    "type": ["forum", "gaming", "photo", "video", "blog", "news"],
    "countries": ["us", "ru", "jp", "cn", "kr"]
  }
}
```

#### 拡張・プラグイン開発
**新サイトの追加**:
1. `--submit URL`で新サイトを提案
2. data.jsonにサイト定義を追加
3. テストユーザー名の設定

**カスタムチェッカー**:
- `checkType`: "status_code" または "message"
- `presenseStrs`: アカウント存在を示す文字列
- `absenceStrs`: アカウント不在を示す文字列
- `engine`: プラットフォームタイプ

**Activationメカニズム**:
- 認証が必要なサイト向け
- cookies.txtファイルのサポート
- セッション管理

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ベンチマーク結果: 
  - 500サイトで約2-3分
  - 全サイト（3000+）で約10-15分
  - 100同時接続での並行処理
- 最適化手法: 
  - 非同期I/Oによる並行処理
  - キーワードフィルタリングでサイト数削減
  - Alexaランキングによる優先度付け
  - タイムアウトとリトライの調整

### スケーラビリティ
- **同時接続数**: max_connectionsパラメータで調整可能
- **メモリ使用量**: サイト数に比例して増加（通常200-500MB）
- **ネットワーク帯域**: 同時接続数に依存
- **プロキシサポート**: HTTP/SOCKSプロキシ経由での分散

### 制限事項
- **技術的な制限**:
  - Cloudflare保護サイトでの検出精度低下
  - CAPTCHAやIPブロックによる制限
  - JavaScriptレンダリングが必要なサイトは未対応
  - 動的コンテンツの取得が困難
- **運用上の制限**:
  - レート制限による一時的なブロック
  - サイトの仕様変更による検出失敗
  - ネットワーク接続の安定性要求
  - 大量検索時の倖理的配慮

## 評価・所感
### 技術的評価
#### 強み
- **包括的なサイトカバレッジ**: 4000サイトを超える圧倒的なデータベース
- **高度な機能**: 単なるユーザー名検索を超えた情報抽出、再帰的検索
- **柔軟なレポート生成**: 多様な出力形式と視覚的なグラフ表現
- **非同期処理**: 高速な並行スキャン
- **アクティブな開発**: 定期的なサイトデータベースの更新
- **充実したフィルタリング**: タグベースの柔軟な検索

#### 改善の余地
- **JavaScriptレンダリング対応**: 動的なコンテンツへの対応
- **誤検知の削減**: より高度なチェックロジック
- **GUIの提供**: コマンドラインに慣れないユーザー向け
- **APIサーバー**: RESTful APIの提供

### 向いている用途
- **OSINT調査**: 個人や組織のオンラインプレゼンス調査
- **セキュリティ監査**: 内部監査、ペネトレーションテストの事前調査
- **ブランド保護**: オンラインでのブランド侵害の監視
- **デジタルフットプリント調査**: 個人のオンライン活動の把握
- **採用候補者調査**: バックグラウンドチェックの一環
- **法執行機関**: 合法的な捜査活動

### 向いていない用途
- **大量の自動化スキャン**: API制限に引っかかる可能性
- **リアルタイム監視**: 定期実行には別途工夫が必要
- **完全な匿名性**: ネットワークレベルでの追跡が可能
- **法的制約のある地域**: プライバシー保護法が厳しい地域での使用

### 総評
Maigretは、OSINT分野における最も包括的で強力なユーザー名検索ツールの一つです。Sherlockプロジェクトの優れた基盤を受け継ぎ、さらに発展させた本ツールは、豊富な機能と高いパフォーマンスを兼ね備えています。特に、再帰的検索や情報抽出機能は他の類似ツールと一線を画しています。ただし、利用に際しては倖理的・法的な配慮が必要であり、合法的かつ倖理的な目的での使用が求められます。