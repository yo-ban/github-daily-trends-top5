# リポジトリ解析: frappe/hrms

## 基本情報
- リポジトリ名: frappe/hrms
- 主要言語: Python
- スター数: 4,961
- フォーク数: 1,414
- 最終更新: アクティブに更新中
- ライセンス: GNU General Public License v3.0
- トピックス: hr, payroll, employee-management, frappe-framework, erpnext

## 概要
### 一言で言うと
Frappeフレームワーク上に構築されたオープンソースの包括的な人事管理・給与計算システム。入社から退職までの全従業員ライフサイクルを管理できるエンタープライズソリューション。

### 詳細説明
Frappe HR（リポジトリではHRMSとも呼ばれる）は、Frappe Technologies Pvt. Ltd.によって開発されたオープンソースの人事管理システムです。

Frappeフレームワーク上に構築され、ERPNextと緊密に統合されており、企業の人事管理ニーズを包括的にカバーします。特にインドやUAEなどの地域固有の給与計算・税制に対応している点が特徴的です。

また、モバイルファーストのアプローチを採用し、Vue 3とIonicを使用したPWA（Progressive Web App）を提供しており、従業員がスマートフォンから休暇申請、経費精算、勤怠打刻などを行えるセルフサービス機能を実現しています。

### 主な特徴
- **従業員ライフサイクル管理**: オンボーディング、昇進・異動、退職面談まで全てカバー
- **休暇・勤怠管理**: 柔軟な休暇ポリシー、地域別祖日管理、GPSベースの打刻
- **経費管理**: 従業員立替、経費精算、多段階承認ワークフロー
- **パフォーマンス管理**: 目標追跡、KRAの整合、自己評価、評価サイクル
- **給与計算・税務**: 給与構造作成、所得税設定、給与明細生成
- **モバイルアプリ (PWA)**: Vue 3 + Ionicで構築、プッシュ通知対応
- **ERPNext統合**: 会計システムとのシームレスな連携
- **マルチリージョン対応**: インド、UAEの税制・規制に対応

## 使用方法
### インストール
#### 前提条件
- Python 3.10以上
- Frappe Framework 16.0.0-dev以上
- ERPNext 16.0.0-dev以上
- MariaDB
- Redis
- Node.js 18+
- Git

#### インストール手順
```bash
# 方法1: Dockerを使用（開発用に推奨）
git clone https://github.com/frappe/hrms
cd hrms/docker
docker-compose up
# http://localhost:8000 でアクセス
# デフォルト認証情報: Administrator/admin

# 方法2: ローカルセットアップ
bench new-site hrms.local
bench get-app erpnext
bench get-app hrms
bench --site hrms.local install-app hrms
bench --site hrms.local add-to-hosts
bench start
# http://hrms.local:8080 でアクセス
```

### 基本的な使い方
#### Hello World相当の例
```python
# 従業員データの作成
import frappe

# 新しい従業員を作成
def create_employee():
    employee = frappe.get_doc({
        "doctype": "Employee",
        "first_name": "太郎",
        "last_name": "田中",
        "company": "Your Company",
        "date_of_joining": "2024-01-01",
        "department": "Engineering",
        "designation": "Software Developer"
    })
    employee.insert()
    frappe.db.commit()
    return employee.name
```

#### 実践的な使用例
```python
# 休暇申請の作成と承認フロー
import frappe
from frappe import _

class LeaveApplication(Document):
    def validate(self):
        # アクティブな従業員か確認
        validate_active_employee(self.employee)
        
        # 日付の妥当性確認
        self.validate_dates()
        
        # 休暇残日数の確認
        self.validate_balance_leaves()
        
        # 重複チェック
        self.validate_leave_overlap()
    
    def on_submit(self):
        # 勤怠記録を更新
        self.update_attendance()
        
        # 休暇台帳に記録
        self.create_leave_ledger_entry()
        
        # 通知送信
        if frappe.db.get_single_value("HR Settings", "send_leave_notification"):
            self.notify_employee()
            self.notify_approver()

# 使用例
leave_app = frappe.get_doc({
    "doctype": "Leave Application",
    "employee": "EMP-00001",
    "leave_type": "年次休暇",
    "from_date": "2024-12-25",
    "to_date": "2024-12-27",
    "reason": "年末休暇"
})
leave_app.insert()
leave_app.submit()  # 承認ワークフローが開始される
```

### 高度な使い方
```python
# 給与計算プロセスの実装
from hrms.payroll.doctype.payroll_entry.payroll_entry import PayrollEntry
import frappe

class CustomPayrollEntry(PayrollEntry):
    def create_salary_slips(self):
        """EmployeeごとにSalary Slipを作成"""
        employees = self.get_employees()
        
        for emp in employees:
            if self.validate_employee(emp):
                salary_slip = frappe.get_doc({
                    "doctype": "Salary Slip",
                    "employee": emp.employee,
                    "salary_structure": emp.salary_structure,
                    "payroll_frequency": self.payroll_frequency,
                    "start_date": self.start_date,
                    "end_date": self.end_date,
                    "posting_date": self.posting_date,
                    "company": self.company
                })
                
                # 給与コンポーネントを計算
                salary_slip.calculate_net_pay()
                
                # 税金計算
                salary_slip.calculate_tax_withheld()
                
                # 保存と承認
                salary_slip.insert()
                salary_slip.submit()
                
    def make_payment_entry(self):
        """Payment Entryを作成して給与支払いを処理"""
        payment_entry = frappe.get_doc({
            "doctype": "Payment Entry",
            "payment_type": "Pay",
            "party_type": "Employee",
            "posting_date": self.posting_date,
            "paid_from": self.payment_account,
            "mode_of_payment": "Bank Transfer"
        })
        
        # 各従業員への支払い明細を追加
        for slip in self.get_salary_slips():
            payment_entry.append("references", {
                "reference_doctype": "Salary Slip",
                "reference_name": slip.name,
                "allocated_amount": slip.net_pay
            })
            
        payment_entry.insert()
        payment_entry.submit()
```

## ドキュメント・リソース
### 公式ドキュメント
- **README.md**: プロジェクトの概要、インストール方法
- **CODE_OF_CONDUCT.md**: コミュニティ行動規範
- **Frappeドキュメント**: https://frappeframework.com/docs
- **ERPNextドキュメント**: https://docs.erpnext.com/

### サンプル・デモ
- **docker/**: Dockerを使用したクイックスタート環境
- **frontend/**: 従業員セルフサービスPWAのソースコード
- **roster/**: シフト管理アプリケーション

### チュートリアル・ガイド
- Frappe School: https://frappe.school/
- Frappeフレームワークチュートリアル
- ERPNextユーザーマニュアル
- YouTubeのFrappe公式チャンネル

## 技術的詳細
### アーキテクチャ
#### 全体構造
HRMSは、Frappeフレームワークの上に構築されたモジュラーアーキテクチャを採用しています：

1. **バックエンド**: PythonベースのFrappeフレームワーク
2. **データベース**: MariaDB（トランザクションデータ）
3. **キャッシュ**: Redis（セッション、キャッシュ）
4. **フロントエンド**: 
   - デスクトップ: Frappe UIコンポーネント
   - モバイルPWA: Vue 3 + Ionic + Tailwind CSS
   - ロスターアプリ: Vue 3 + TypeScript

#### ディレクトリ構成
```
hrms/
├── hrms/             # メインアプリケーション
│   ├── hr/           # HRモジュール（コア人事機能）
│   ├── payroll/      # 給与計算モジュール
│   ├── api/          # REST APIエンドポイント
│   ├── config/       # 設定ファイル
│   └── controllers/  # ビジネスロジック
├── frontend/         # 従業員セルフサービスPWA
│   ├── src/          # Vue 3アプリケーション
│   └── public/       # 静的アセット
├── roster/           # シフト管理アプリ
├── docker/           # Docker設定
└── frappe-ui/        # UIコンポーネントライブラリ
```

#### 主要コンポーネント
- **Employee**: 従業員情報の管理
  - 場所: `hrms/hr/doctype/employee/`
  - 依存: User, Company, Department
  - インターフェース: validate(), on_update(), get_timeline_data()

- **Leave Application**: 休暇申請管理
  - 場所: `hrms/hr/doctype/leave_application/`
  - 依存: Employee, Leave Type, Leave Balance
  - インターフェース: validate_dates(), check_balance(), notify_approver()

- **Salary Slip**: 給与明細生成
  - 場所: `hrms/payroll/doctype/salary_slip/`
  - 依存: Employee, Salary Structure, Payroll Entry
  - インターフェース: calculate_net_pay(), calculate_tax(), generate_slip()

- **Attendance**: 勤怠記録
  - 場所: `hrms/hr/doctype/attendance/`
  - 依存: Employee, Shift Type
  - インターフェース: mark_attendance(), validate_duplicate()

### 技術スタック
#### コア技術
- **言語**: Python 3.10+（型ヒント、async/await使用）
- **フレームワーク**: 
  - Frappe Framework: ORM、API、権限管理、ワークフロー
  - ERPNext: 会計統合、マスターデータ
- **主要ライブラリ**: 
  - Vue 3: フロントエンドフレームワーク
  - Ionic: モバイルUIコンポーネント
  - Tailwind CSS: ユーティリティファーストCSS
  - Firebase: プッシュ通知

#### 開発・運用ツール
- **ビルドツール**: 
  - Bench CLI: Frappeアプリ管理
  - Vite: フロントエンドビルド
  - npm/yarn: パッケージ管理
- **テスト**: 
  - Python unittest: バックエンドテスト
  - Cypress: E2Eテスト
- **CI/CD**: 
  - GitHub Actions: 自動テスト、リント
  - Codecov: カバレッジレポート
- **デプロイ**: 
  - Docker Compose
  - Frappe Cloud
  - セルフホスト

### 設計パターン・手法
- **DocTypeパターン**: Frappeのデータモデル定義
- **Controllerパターン**: ビジネスロジックの分離
- **Hooksパターン**: イベントドリブンの統合
- **PWAパターン**: オフライン対応モバイルアプリ
- **RBAC**: 役割ベースのアクセス制御

### データフロー・処理フロー
1. **従業員オンボーディング**:
   - 従業員情報登録 → アカウント作成 → 権限設定 → タスク割り当て

2. **休暇管理フロー**:
   - 申請 → 残日数確認 → 承認者通知 → 承認/却下 → 勤怠更新

3. **給与計算フロー**:
   - 勤怠集計 → 給与構造適用 → 控除計算 → 明細生成 → 支払い処理

4. **モバイルチェックイン**:
   - GPS位置情報 → ジオフェンシング確認 → 打刻記録 → 通知

## API・インターフェース
### 公開API
#### OAuth API
- 目的: ソーシャルログイン統合
- 使用例:
```python
# OAuthエンドポイント
@frappe.whitelist(allow_guest=True)
def oauth_providers():
    providers = frappe.get_all(
        "Social Login Key",
        filters={"enable_social_login": 1},
        fields=["name", "provider_name", "client_id"]
    )
    return providers
```

#### Roster API
- 目的: シフト管理とスケジューリング
- 使用例:
```python
# 従業員のシフト情報取得
@frappe.whitelist()
def get_events(start, end, employee=None):
    events = []
    # 休日、休暇、シフトを統合して返す
    events.extend(get_holidays(start, end))
    events.extend(get_leaves(start, end, employee))
    events.extend(get_shifts(start, end, employee))
    return events
```

### 設定・カスタマイズ
#### 設定ファイル
```python
# hooks.pyの主要設定
app_name = "hrms"
app_title = "Frappe HR"
app_publisher = "Frappe Technologies Pvt. Ltd."
app_version = "16.0.0-dev"

# DocTypeイベントフック
doc_events = {
    "Employee": {
        "validate": "hrms.hr.utils.validate_active_employee",
        "on_update": "hrms.hr.utils.update_user_permissions"
    },
    "User": {
        "validate": "hrms.hr.utils.validate_employee_creation"
    }
}

# スケジュールタスク
scheduler_events = {
    "daily": [
        "hrms.hr.doctype.daily_work_summary_group.daily_work_summary_group.send_summary",
        "hrms.hr.utils.send_birthday_reminders"
    ],
    "weekly": [
        "hrms.hr.utils.send_reminders_in_advance_weekly"
    ]
}
```

#### 拡張・プラグイン開発
- **カスタムDocType**: JSON定義で新しいエンティティを作成
- **カスタムフィールド**: 既存DocTypeにフィールド追加
- **カスタムスクリプト**: フックでカスタムロジック追加
- **カスタムレポート**: Query ReportやScript Reportで作成
- **Frappe App**: 独立したアプリとして拡張

## パフォーマンス・スケーラビリティ
### パフォーマンス特性
- **大量データ処理**: 数千人規模の従業員管理に対応
- **給与計算速度**: 1000件の明細を数分で処理
- **最適化手法**:
  - Redisキャッシュの活用
  - バックグラウンドジョブでの重い処理
  - インデックス最適化

### スケーラビリティ
- マルチテナント対応（Frappeフレームワークの機能）
- 負荷分散が可能なアーキテクチャ
- 大量の同時ユーザーに対応
- データベースパーティショニング対応

### 制限事項
- Frappeフレームワークの習得が必要
- インド、UAE以外の地域の税制対応が限定的
- 大量のカスタマイズには開発知識が必要
- PWAはネイティブアプリではない

## 評価・所感
### 技術的評価
#### 強み
- **包括的な機能**: HR・給与の全プロセスをカバー
- **ERPNext統合**: 会計システムとのシームレス連携
- **モバイル対応**: PWAによる優れたユーザー体験
- **柔軟なカスタマイズ**: Frappeの強力な拡張性
- **オープンソース**: 完全なソースコードアクセス

#### 改善の余地
- ドキュメントの充実（特に英語以外）
- より多くの地域の税制・規制対応
- AI/ML機能の統合
- パフォーマンスレビューの高度化
- グローバル企業向け機能

### 向いている用途
- 中小企業から大企業までの人事管理
- 複雑な給与体系を持つ組織
- モバイルワークが多い企業
- ERPNextを既に使用している組織
- カスタマイズが必要なHRプロセス

### 向いていない用途
- シンプルな勤怠管理のみが必要な場合
- 特殊な地域固有の要件が多い場合
- 既存のERPとの統合が難しい場合
- 技術リソースが限られる小規模組織
- SaaS形式での利用のみを希望する場合

### 総評
Frappe HRMSは、包括的でプロダクションレディなHRソリューションとして非常に優れたプロダクトです。特に、ERPNextとの緊密な統合により、人事・会計の一元管理が可能な点が大きな強みです。

モバイルファーストのアプローチとPWAの採用は、現代的なワークスタイルに対応した先進的な取り組みで、従業員の利便性を大幅に向上させています。Vue 3やIonicなどの最新技術スタックの採用も、将来性を考慮した選択と言えるでしょう。

一方で、Frappeフレームワークの習得が必要な点や、地域固有の税制対応が限定的な点は、導入の障壁になる可能性があります。しかし、オープンソースであることから、コミュニティのサポートやカスタマイズの自由度は高く、組織のニーズに合わせた柔軟な運用が可能です。

総合的に見て、特にERPNextを既に使用している、または統合的な業務管理を求める中大企業にとっては、非常に価値の高いHRソリューションと言えるでしょう。