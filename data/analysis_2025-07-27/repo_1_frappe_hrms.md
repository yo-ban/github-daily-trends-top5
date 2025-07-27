# リポジトリ解析: frappe/hrms

## 基本情報
- リポジトリ名: frappe/hrms
- 主要言語: Python
- スター数: 4,665
- フォーク数: 1,386
- 最終更新: 定期的に更新されている
- ライセンス: GNU General Public License v3.0
- トピックス: HR、Payroll、Human Resources、HRMS、Open Source、Frappe Framework、ERPNext

## 概要
### 一言で言うと
Frappe HRは、Frappe FrameworkとERPNext上に構築されたオープンソースの総合的な人事管理・給与計算システムです。

### 詳細説明
Frappe HRは、当初ERPNext内のモジュールとして開発されていましたが、成熟度が高まったことから独立したプロダクトとして分離されました。Frappeチームが自社の成長に伴い、真のオープンソースHRソフトウェアが市場に存在しないことから、自ら開発を始めたという背景があります。13以上の異なるモジュールを含み、従業員管理、オンボーディング、休暇管理から給与計算、税務処理まで、HRMSに必要な機能を網羅しています。

### 主な特徴
- **従業員ライフサイクル管理**: オンボーディングから昇進・異動管理、退職面談まで従業員のライフサイクル全体をサポート
- **休暇・勤怠管理**: 休暇ポリシーの設定、地域の祝日の自動取得、位置情報付きチェックイン/チェックアウト、休暇残高と出勤状況のレポート
- **経費請求と前払い管理**: 従業員の前払い管理、経費請求、多段階承認ワークフロー設定、ERPNext会計との完全統合
- **パフォーマンス管理**: 目標追跡、KRAとの目標整合、従業員の自己評価機能、評価サイクルの管理
- **給与計算と税務**: 給与構造の作成、所得税スラブ設定、標準給与計算実行、追加給与とオフサイクル支払い対応
- **モバイルアプリ（PWA）**: 外出先での休暇申請・承認、チェックイン/チェックアウト、従業員プロファイルへのアクセス

## 使用方法
### インストール
#### 前提条件
- Python 3.10以上
- Node.js（Frappe Frameworkの要件に準拠）
- MariaDB/MySQL
- Redis
- Frappe Framework v16.0.0-dev以上
- ERPNext v16.0.0-dev以上

#### インストール手順
```bash
# 方法1: Docker経由（推奨）
git clone https://github.com/frappe/hrms
cd hrms/docker
docker-compose up

# 方法2: ローカルインストール
# 1. Bench環境のセットアップ
bench start

# 2. 新しいサイトの作成とアプリのインストール
bench new-site hrms.local
bench get-app erpnext
bench get-app hrms
bench --site hrms.local install-app hrms
bench --site hrms.local add-to-hosts
```

### 基本的な使い方
#### Hello World相当の例
```python
# 新しい従業員の作成
import frappe

employee = frappe.get_doc({
    "doctype": "Employee",
    "first_name": "John",
    "last_name": "Doe",
    "company": "Your Company",
    "designation": "Software Engineer",
    "department": "Engineering",
    "date_of_joining": "2024-01-01",
    "status": "Active"
})
employee.insert()
```

#### 実践的な使用例
```python
# 従業員オンボーディングプロセスの作成
from hrms.hr.doctype.employee_onboarding.employee_onboarding import make_employee

# オンボーディングテンプレートから新しいオンボーディングを作成
onboarding = frappe.get_doc({
    "doctype": "Employee Onboarding",
    "job_applicant": "JA-00001",
    "employee_name": "Jane Smith",
    "company": "Your Company",
    "department": "Sales",
    "designation": "Sales Executive",
    "employee_grade": "A",
    "boarding_begins_on": frappe.utils.today(),
    "employee_onboarding_template": "Standard Onboarding"
})
onboarding.insert()
onboarding.submit()

# タスクが完了したら従業員レコードを作成
employee = make_employee(onboarding.name)
```

### 高度な使い方
```python
# 給与計算の実行
from hrms.payroll.doctype.payroll_entry.payroll_entry import get_employees

# 給与エントリーの作成
payroll_entry = frappe.get_doc({
    "doctype": "Payroll Entry",
    "company": "Your Company",
    "payroll_frequency": "Monthly",
    "start_date": "2024-01-01",
    "end_date": "2024-01-31",
    "posting_date": "2024-01-31",
    "payment_account": "Cash - YC"
})

# 従業員の取得と給与スリップの作成
employees = get_employees(payroll_entry)
payroll_entry.create_salary_slips()
payroll_entry.submit_salary_slips()
payroll_entry.make_payment_entry()
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクトの概要、主要機能、インストール手順、コミュニティ情報
- **公式ウェブサイト**: https://frappe.io/hr
- **ドキュメント**: https://docs.frappe.io/hr - 包括的なドキュメント
- **Frappe School**: https://frappe.school - Frappe FrameworkとERPNextのコース

### サンプル・デモ
- **Docker Compose設定**: docker/ディレクトリ内にDocker環境の設定
- **フロントエンドアプリ**: frontend/ディレクトリにVue3 + Ionicのモバイルアプリ
- **Rosterアプリ**: roster/ディレクトリにシフト管理用のフロントエンド

### チュートリアル・ガイド
- ユーザーフォーラム: https://discuss.erpnext.com/
- Telegramグループ: https://t.me/frappehr
- GitHub Issues: バグレポートと機能リクエスト
- Frappe Cloud: https://frappecloud.com - マネージドホスティングサービス

## 技術的詳細
### アーキテクチャ
#### 全体構造
Frappe HRはFrappe Frameworkのアーキテクチャに従い、MVCパターンをベースとしたモジュラー構造を採用しています。ERPNextに依存し、その会計・在庫管理機能と統合されています。フロントエンドは標準的なFrappe UIに加え、モバイル向けにVue3 + IonicのPWAアプリケーションを提供しています。

#### ディレクトリ構成
```
hrms/
├── hrms/                 # メインアプリケーションディレクトリ
│   ├── api/             # REST APIエンドポイント（OAuth、Roster）
│   ├── config/          # アプリケーション設定
│   ├── controllers/     # ビジネスロジックコントローラー
│   ├── hr/              # HRモジュール（主要機能）
│   │   ├── doctype/     # 各種DocType定義（従業員、休暇、評価等）
│   │   ├── report/      # レポート定義
│   │   └── workspace/   # ワークスペース設定
│   ├── payroll/         # 給与計算モジュール
│   ├── regional/        # 地域別カスタマイズ（インド、UAE）
│   └── public/          # 静的アセット（JS、CSS、画像）
├── frontend/            # Vue3 + IonicのPWAアプリ
├── roster/              # シフト管理用フロントエンドアプリ
└── docker/              # Docker設定ファイル
```

#### 主要コンポーネント
- **EmployeeBoardingController**: 従業員のオンボーディング/オフボーディングの基底クラス
  - 場所: `hrms/controllers/employee_boarding_controller.py`
  - 依存: Frappe Document
  - インターフェース: create_project_and_tasks(), create_task_and_notify_user()

- **Employee Onboarding**: 新入社員のオンボーディングプロセス管理
  - 場所: `hrms/hr/doctype/employee_onboarding/`
  - 依存: EmployeeBoardingController
  - インターフェース: make_employee(), mark_onboarding_as_completed()

- **Payroll Entry**: 給与計算バッチ処理
  - 場所: `hrms/payroll/doctype/payroll_entry/`
  - 依存: ERPNext Accounting
  - インターフェース: create_salary_slips(), submit_salary_slips(), make_payment_entry()

### 技術スタック
#### コア技術
- **言語**: Python 3.10以上、JavaScript（ES6+）
- **フレームワーク**: 
  - Frappe Framework v16.0.0以上（バックエンド）
  - Vue 3 + Ionic 7（モバイルPWA）
  - Frappe UI 0.1.105（UIコンポーネント）
- **主要ライブラリ**: 
  - dayjs: 日付処理
  - Firebase: プッシュ通知（PWA）
  - Workbox: PWAのオフライン機能
  - html2canvas: PDFエクスポート機能

#### 開発・運用ツール
- **ビルドツール**: 
  - Vite 5（フロントエンドビルド）
  - flit_core（Pythonパッケージビルド）
- **テスト**: 
  - Python unittest（統合テスト）
  - Codecovでカバレッジ追跡
- **CI/CD**: 
  - GitHub Actions（CIパイプライン）
  - バッジ: CI status、Codecov coverage
- **デプロイ**: 
  - Frappe Cloud（推奨）
  - Docker Compose（開発・セルフホスト）
  - 手動インストール（Bench経由）

### 設計パターン・手法
- **DocTypeベースアーキテクチャ**: Frappe Frameworkの中核概念で、各エンティティ（従業員、休暇申請等）をDocTypeとして定義
- **イベント駆動**: hooks.pyでイベントハンドラを定義し、ドキュメントのライフサイクルに応じて処理を実行
- **権限ベースアクセス制御**: 役割ベースの権限システムで、各DocTypeへのアクセスを制御
- **マルチテナンシー**: サイトベースの分離で複数の組織を単一インスタンスでサポート

### データフロー・処理フロー
1. **従業員オンボーディングフロー**:
   - 求人応募者（Job Applicant）の作成
   - 内定通知（Job Offer）の発行
   - オンボーディングテンプレートに基づくタスク生成
   - タスク完了後、従業員（Employee）レコードの自動作成

2. **給与計算フロー**:
   - 給与構造（Salary Structure）の定義
   - 給与エントリー（Payroll Entry）でバッチ処理開始
   - 各従業員の給与スリップ（Salary Slip）自動生成
   - 承認後、会計仕訳（Journal Entry）の作成
   - 銀行振込データの生成

## API・インターフェース
### 公開API
#### OAuth API
- 目的: 外部アプリケーションからの認証とアクセス
- 使用例:
```python
# hrms/api/oauth.py経由でOAuth認証を実装
import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def authorize():
    # OAuth認証フロー
    pass
```

#### Roster API  
- 目的: シフト管理機能へのアクセス
- エンドポイント: `/api/method/hrms.www.roster`

### 設定・カスタマイズ
#### 設定ファイル
```python
# hooks.py - アプリケーション設定
app_name = "hrms"
app_title = "Frappe HR"
required_apps = ["frappe/erpnext"]

# DocTypeへのカスタムスクリプト注入
doctype_js = {
    "Employee": "public/js/erpnext/employee.js",
    "Company": "public/js/erpnext/company.js"
}

# カレンダー統合
calendars = ["Leave Application"]

# ウェブサイトジェネレーター
website_generators = ["Job Opening"]
```

#### 拡張・プラグイン開発
- **カスタムDocType**: 新しいHR機能をDocTypeとして追加
- **カスタムレポート**: SQLベースまたはスクリプトレポートの作成
- **ワークフロー**: 承認フローのカスタマイズ
- **地域別カスタマイズ**: regional/ディレクトリに地域固有の機能を追加
- **フックの活用**: hooks.pyでイベントハンドラを定義して機能を拡張

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- **キャッシング**: Redisベースのキャッシングでクエリパフォーマンスを向上
- **バックグラウンドジョブ**: RQ（Redis Queue）を使用した非同期処理
- **データベース最適化**: 適切なインデックス設定とクエリ最適化

### スケーラビリティ
- **水平スケーリング**: Frappe Cloudでの自動スケーリング対応
- **マルチテナント**: 単一インスタンスで複数組織をサポート
- **ロードバランシング**: リバースプロキシ経由での負荷分散
- **データベース**: MariaDB/MySQLのレプリケーション対応

### 制限事項
- **依存関係**: ERPNextが必須（単独では動作しない）
- **Python要件**: Python 3.10以上が必要
- **ブラウザサポート**: モダンブラウザのみ対応（IE非対応）
- **モバイルアプリ**: PWAのため、ネイティブアプリの一部機能に制限

## 評価・所感
### 技術的評価
#### 強み
- **完全なオープンソース**: GPLv3ライセンスで、ベンダーロックインなし
- **統合性**: ERPNextとの深い統合により、会計・在庫管理との連携がスムーズ
- **カスタマイズ性**: Frappe Frameworkの柔軟性により、高度なカスタマイズが可能
- **モバイル対応**: PWAによる優れたモバイル体験
- **国際化対応**: 多言語サポートと地域別カスタマイズ

#### 改善の余地
- **学習曲線**: Frappe Frameworkの理解が必要で、初期学習コストが高い
- **ドキュメント**: 一部の高度な機能についてドキュメントが不足
- **ERPNext依存**: 単独での使用ができず、ERPNextのインストールが必須
- **パフォーマンス**: 大規模データでのレポート生成に時間がかかる場合がある

### 向いている用途
- **中小企業のHRMS**: 統合的なHR・給与管理が必要な組織
- **ERPNext利用企業**: 既にERPNextを使用している企業のHR部門
- **カスタマイズが必要な組織**: 独自の人事プロセスを持つ企業
- **オープンソース重視**: ベンダーロックインを避けたい組織

### 向いていない用途
- **HR機能のみ必要**: ERPは不要で、純粋なHRMSのみを求める場合
- **大企業の複雑な要件**: 数万人規模の従業員管理や複雑な組織構造
- **SaaS志向**: クラウドネイティブなSaaS型HRMSを求める場合
- **最小限の技術リソース**: 技術サポートが限定的な小規模組織

### 総評
Frappe HRは、ERPNextエコシステム内で動作する包括的なHRMSソリューションとして、中小企業に最適な選択肢です。完全なオープンソースであることと、高いカスタマイズ性が大きな強みです。ただし、ERPNextへの依存と学習曲線の高さは導入の障壁となる可能性があります。既にERPNextを使用している、または統合的な業務システムを求める組織には強く推奨できる一方、純粋なHR機能のみを求める場合は他の選択肢を検討すべきでしょう。