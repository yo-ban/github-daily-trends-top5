# データディレクトリ

このディレクトリには、外部サーバーで生成された解析結果が配置されます。

## ディレクトリ構造

```
data/
├── README.md              # このファイル
├── analysis_2025-06-27/   # 日付別の解析結果
│   ├── repo_1_[name].md
│   ├── repo_2_[name].md
│   └── ...
├── analysis_2025-06-28/
└── ...
```

## データ形式

各 `analysis_YYYY-MM-DD` ディレクトリには以下のファイルが含まれます：

- `repo_[番号]_[リポジトリ名].md`: 各リポジトリの詳細解析
- `github_trends_integrated_report_YYYY-MM-DD.md`: 統合レポート（オプション）

## 外部サーバーからのデータ追加

```bash
# 解析結果をこのディレクトリにコピー
cp -r /path/to/analysis_2025-06-27 data/

# Gitにコミット
git add data/analysis_2025-06-27
git commit -m "Add analysis for 2025-06-27"
git push
```

プッシュすると自動的にサイトがビルド・デプロイされます。