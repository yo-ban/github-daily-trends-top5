# リポジトリ解析: soxoj/maigret

## 基本情報
- リポジトリ名: soxoj/maigret
- 主要言語: Python
- スター数: 11,471
- フォーク数: 800+（推定）
- 最終更新: 2024年（活発に開発中）
- ライセンス: MIT License
- トピックス: OSINT、username-search、social-media、reconnaissance、cybersecurity、information-gathering

## 概要
### 一言で言うと
Maigretは、ユーザー名のみから3000以上のサイトでアカウントを検索し、個人情報を収集するOSINTツールです。

### 詳細説明
Maigretは、人気のあるOSINTツール「Sherlock」のパワフルなフォークとして開発されました。ジョルジュ・シムノンの小説に登場する探偵メグレ警視にちなんで名付けられたこのツールは、ユーザー名を元に様々なウェブサイトでアカウントの存在を確認し、プロファイルページから個人情報を抽出します。APIキーは不要で、現在3000以上のサイトをサポートしており、デフォルトでは人気順に上位500サイトで検索を実行します。Torサイト、I2Pサイト、ドメイン（DNS解決経由）のチェックもサポートしています。

### 主な特徴
- 3000以上のサイトでのアカウント検索（デフォルトは人気上位500サイト）
- プロファイルページの解析と個人情報の抽出（socid-extractor使用）
- 発見した新しいユーザー名やIDによる再帰的検索
- タグ（サイトカテゴリー、国）による検索
- 検閲やキャプチャの検出
- リクエストのリトライ機能
- HTML、PDF、TXT、XMind 8マインドマップ、JSONレポート生成
- Webインターフェース（グラフ表示とレポートダウンロード）
- ユーザー名の順列生成
- アーカイブサイトやミラーサイトのチェック
- 自動認証メカニズム（Activation）
- Tor、I2Pサイトのサポート
- Telegram公式ボット対応

## 使用方法
### インストール
#### 前提条件
- Python 3.10以上（Python 3.11推奨）
- pip
- オプション：Docker、Windows用バイナリ、クラウドシェル

#### インストール手順
```bash
# 方法1: PyPIからインストール
pip3 install maigret

# 方法2: ソースからビルド
git clone https://github.com/soxoj/maigret && cd maigret
pip3 install .

# 方法3: Docker使用
docker pull soxoj/maigret
# または手動ビルド
docker build -t maigret .

# 方法4: Windowsバイナリ（GitHub Releasesからダウンロード）
```

### 基本的な使い方
#### Hello World相当の例
```bash
# ユーザー名"machine42"で上位500サイトを検索
maigret machine42
```

#### 実践的な使用例
```bash
# 全サイトで検索
maigret machine42 -a

# HTMLとPDFレポートを生成
maigret user --html --pdf

# タグでフィルタリング（写真・デートサイト）
maigret user --tags photo,dating

# 米国のサイトのみ検索
maigret user --tags us

# 複数のユーザー名を検索
maigret user1 user2 user3 -a

# Dockerでの使用
docker run -v /mydir:/app/reports soxoj/maigret:latest username --html
```

### 高度な使い方
```bash
# Webインターフェースの起動
maigret --web 5000
# ブラウザで http://127.0.0.1:5000 にアクセス

# URLから情報を抽出して検索
maigret --parse https://steamcommunity.com/profiles/76561199113454789

# ユーザー名の順列生成
maigret --permute hope dream --timeout 5
# hopedream, _hopedream, hope_dream, hope-dreamなどの12パターンを生成

# 特定サイトでのみ検索
maigret machine42 --site Facebook

# コーディング関連サイトで検索
maigret username --tags coding

# リトライ回数を指定
maigret username --retries 3
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクト概要、インストール方法、使用例
- **docs/source/**: Sphinxベースの詳細ドキュメント
  - features.rst: 機能の詳細説明
  - usage-examples.rst: 使用例集
  - command-line-options.rst: CLIオプション
  - development.rst: 開発者向け情報
  - supported-identifier-types.rst: サポートされる識別子タイプ
- **sites.md**: サポートされる3143サイトの完全リスト
- **CHANGELOG.md**: バージョン履歴
- **公式ドキュメントサイト**: https://maigret.readthedocs.io/

### サンプル・デモ
- **example.ipynb**: Jupyter Notebookの使用例
- **static/ディレクトリ**: レポートサンプル
  - report_alexaimephotographycars.html: HTMLレポート例
  - report_alexaimephotographycars.pdf: PDFレポート例
  - report_alexaimephotography_xmind_screenshot.png: XMindレポート例
- **公式Telegramボット**: https://t.me/osint_maigret_bot

### チュートリアル・ガイド
- YouTubeガイド: https://youtu.be/qIgwTZOmMmM（Windowsバイナリ使用方法）
- クラウドシェルボタン（Google Cloud Shell、Replit、Colab、Binder）
- Asciinemaデモ: ページ解析と再帰検索のデモ

## 技術的詳細
### アーキテクチャ
#### 全体構造
Maigretはモジュラーアーキテクチャを採用し、非同期I/Oを活用して高速な検索を実現しています。サイト情報はJSONデータベースで管理され、柔軟な拡張が可能です。

#### ディレクトリ構成
```
maigret/
├── maigret/              # メインパッケージ
│   ├── __init__.py      # パッケージ初期化
│   ├── maigret.py       # CLIエントリポイント
│   ├── checking.py      # サイトチェックのコアロジック
│   ├── sites.py         # サイト管理クラス
│   ├── report.py        # レポート生成
│   ├── activation.py    # 認証メカニズム
│   ├── permutator.py    # ユーザー名順列生成
│   ├── notify.py        # 通知システム
│   ├── resources/       # リソースファイル
│   │   ├── data.json    # サイトデータベース
│   │   └── settings.json# 設定ファイル
│   └── web/             # Web UI
│       ├── app.py       # Flaskアプリケーション
│       └── templates/   # HTMLテンプレート
├── docs/                 # Sphinxドキュメント
├── tests/                # pytestテスト
├── utils/                # ユーティリティスクリプト
└── pyinstaller/          # スタンドアロンビルド設定
```

#### 主要コンポーネント
- **MaigretEngine**: 検索エンジンのベースクラス
  - 場所: `maigret/sites.py`
  - 役割: HTTPリクエストパターン、レスポンス解析ルールの定義
  - インターフェース: check_data、extract_data

- **MaigretDatabase**: サイトデータベース管理
  - 場所: `maigret/sites.py`
  - 役割: サイト情報の読み込み、フィルタリング、管理
  - 依存: MaigretSite、MaigretEngine

- **QueryNotifyPrint**: 結果通知システム
  - 場所: `maigret/notify.py`
  - 役割: 検索進捗と結果の表示
  - インターフェース: update、warning、error

- **maigret関数**: メイン検索関数
  - 場所: `maigret/checking.py`
  - 役割: 非同期検索のオーケストレーション
  - 依存: aiohttp、async-timeout

### 技術スタック
#### コア技術
- **言語**: Python 3.10+（Poetryでの依存管理）
- **フレームワーク**: Flask（Web UI）、asyncio（非同期処理）
- **主要ライブラリ**: 
  - aiohttp (^3.12.14): 非同期HTTPリクエスト
  - aiohttp-socks (^0.10.1): SOCKSプロキシサポート
  - socid-extractor (^0.0.27): プロファイル情報抽出
  - alive_progress (^3.2.0): プログレスバー表示
  - Jinja2 (^3.1.6): テンプレートエンジン
  - lxml (^5.3.0): HTML/XML解析
  - PyPDF2 (^3.0.1): PDF生成
  - xhtml2pdf (^0.2.11): HTMLからPDF変換
  - XMind (^1.2.0): マインドマップ生成
  - networkx (^2.6.3): グラフデータ構造
  - pyvis (^0.3.2): ネットワーク可視化
  - cloudscraper (^1.2.71): Cloudflare対策
  - torrequest (^0.1.0): Torサポート
  - stem (^1.8.1): Torコントロール

#### 開発・運用ツール
- **ビルドツール**: 
  - Poetry: 依存関係管理とパッケージング
  - PyInstaller: Windows用スタンドアロンバイナリ生成
  - Docker: コンテナ化

- **テスト**: 
  - pytest: ユニットテスト
  - pytest-asyncio: 非同期テスト
  - pytest-cov: カバレッジ測定
  - flake8: コード品質チェック
  - black: コードフォーマッター

- **CI/CD**: GitHub Actionsによる自動テストとリリース
- **デプロイ**: PyPI、Docker Hub、GitHub Releases

### 設計パターン・手法
- **非同期処理**: asyncioを使用した並列HTTPリクエスト
- **プラグインアーキテクチャ**: JSONベースのサイト定義による拡張性
- **Factoryパターン**: レポート生成機能
- **Strategyパターン**: 異なる検出アルゴリズムの実装
- **Observerパターン**: 通知システム（QueryNotify）

### データフロー・処理フロー
1. **初期化フェーズ**
   - コマンドライン引数の解析
   - サイトデータベースの読み込み
   - フィルタリング（タグ、サイト名、エンジンタイプ）

2. **検索フェーズ**
   - 非同期HTTPリクエストの並列実行
   - レスポンス解析（ステータスコード、コンテンツ）
   - アカウント存在の判定
   - エラー処理とリトライ

3. **情報抽出フェーズ**
   - socid-extractorによるプロファイル情報解析
   - 追加ユーザー名/IDの発見
   - 再帰検索のキューイング

4. **レポート生成フェーズ**
   - 結果の集約とソート
   - テンプレートエンジンによるレポート生成
   - 複数フォーマットへの出力

## API・インターフェース
### 公開API
#### Python API
- 目的: MaigretをPythonライブラリとして統合
- 使用例:
```python
from maigret import search
from maigret import MaigretDatabase
from maigret import Notifier

# データベース読み込み
db = MaigretDatabase()
db.load_from_file("data.json")

# 検索実行
results = await search(
    username="example_user",
    site_dict=db.sites,
    query_notify=Notifier(),
    timeout=5
)

# 結果処理
for site_name, site_data in results.items():
    if site_data['status'].is_found():
        print(f"Found: {site_data['url_user']}")
```

### 設定・カスタマイズ
#### 設定ファイル
```json
# resources/settings.json
{
  "supported_identifier_patterns": {
    "username": "{username}",
    "yandex_public_id": "yandex_public_id",
    "vk_id": "id{vk_id}"
  },
  "tags": {
    "coding": ["プログラミング", "開発"],
    "photo": ["写真", "イメージ"],
    "us": ["アメリカ", "USA"]
  }
}
```

#### 拡張・プラグイン開発
**新しいサイトの追加**
```json
// data.jsonにサイト定義を追加
{
  "MySite": {
    "tags": ["social", "jp"],
    "checkType": "status_code",
    "absenceStrs": ["404", "Not Found"],
    "presenseStrs": ["@{username}"],
    "url": "https://mysite.com/{username}",
    "urlMain": "https://mysite.com/",
    "usernameClaimed": "test",
    "usernameUnclaimed": "noonewouldeverusethis7",
    "engine": "MaigretSite"
  }
}
```

**カスタムエンジンの作成**
- MaigretEngineクラスを継承
- check_dataメソッドをオーバーライド
- extract_dataメソッドで情報抽出ロジック実装

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- ベンチマーク結果: 
  - デフォルト500サイト検索: 約10-30秒
  - 全サイト検索（3000+）: 2-5分
  - 並列リクエスト数: デフォルト300
- 最適化手法: 
  - aiohttpによる非同期I/O
  - コネクションプーリング
  - タイムアウト制御
  - エラー時の自動リトライ
  - キャッシュ機構（activation）

### スケーラビリティ
- **水平スケーリング**: 複数ユーザー名の並列検索対応
- **サイト拡張**: JSONファイルへのサイト追加で簡単に拡張
- **プロキシサポート**: HTTP/SOCKSプロキシ経由でのアクセス
- **Tor対応**: .onionサイトの検索

### 制限事項
- **技術的な制限**
  - 一部サイトのCAPTCHAやWAFによるブロック
  - 動的コンテンツ（JavaScriptレンダリング）の制限
  - APIキー不要のため、一部サイトでは詳細情報取得不可
  - レート制限による一時的なブロック

- **運用上の制限**
  - 大量検索時はIPブロックの可能性
  - サイト仕様変更による誤検出
  - 法的・倫理的配慮が必要（免責事項参照）

## 評価・所感
### 技術的評価
#### 強み
- 3000以上のサイトをサポートする大規模データベース
- 非同期I/Oによる高速検索
- APIキー不要で即座に使用可能
- 豊富なレポート形式（HTML、PDF、XMind、JSON）
- プロファイル情報の自動抽出と再帰検索
- Web UIとCLIの両方を提供
- 活発な開発とコミュニティ
- クロスプラットフォーム対応

#### 改善の余地
- JavaScriptレンダリングサイトへの対応
- 一部サイトの誤検出率
- CAPTCHA回避機能の向上
- GUIアプリケーションの提供

### 向いている用途
- セキュリティ監査やペネトレーションテスト
- デジタルフットプリントの調査
- OSINT調査や脅威インテリジェンス
- 紛失アカウントの発見
- ブランド保護やモニタリング
- 法執行機関や捜査機関での使用
- ジャーナリズムや調査報道

### 向いていない用途
- ストーキングやハラスメント
- 違法な目的での使用
- プライバシー侵害
- 大量の自動化されたスキャン（サイトに負荷をかける行為）

### 総評
Maigretは、OSINTコミュニティにおいて非常に人気のあるユーザー名検索ツールです。Sherlockをベースに大幅に機能拡張され、プロファイル情報の抽出、再帰検索、豊富なレポート形式など、プロフェッショナルな調査に必要な機能を備えています。

特に、APIキー不要で3000以上のサイトをサポートし、非同期処理による高速検索が可能な点は大きな強みです。一方で、適切な法的・倫理的配慮の下で使用することが重要であり、ツール自体も明確な免責事項を設けています。セキュリティ専門家、法執行機関、ジャーナリストなど、正当な目的でOSINTを必要とするユーザーにとって非常に価値のあるツールと言えます。