# CLAUDE.local.md

This file provides guidance to Claude Code (claude.ai/code) when working with the Todo List project.

## プロジェクト概要

Docker化されたシンプルなTodoリストアプリケーション - タスク管理のための基本的なCRUD操作を提供

## アーキテクチャ

- **バックエンド**: Node.js + Express.js
- **フロントエンド**: 静的HTML + Vanilla JavaScript
- **データ永続化**: JSONファイル（`data/todos.json`）
- **コンテナ化**: Docker + Docker Compose

## 開発コマンド

### 通常の開発

```bash
npm install    # 依存関係インストール
npm start      # サーバー起動（ポート3000）
npm run dev    # 開発モード起動
```

### Docker使用時

```bash
# Docker Compose（推奨）
docker-compose up -d     # バックグラウンドで起動
docker-compose logs -f   # ログ確認
docker-compose down      # 停止

# Docker直接使用
docker build -t todo-list-app .
docker run -p 3000:3000 -v $(pwd)/data:/app/data todo-list-app
```

## 技術スタック

- **サーバー**: Express.js 4.x
- **データ形式**: JSON
- **コンテナ**: Docker（マルチステージビルド）
- **オーケストレーション**: Docker Compose

## ファイル構成

```
todo-list/
├── server.js          # Expressサーバー
├── package.json       # Node.js依存関係
├── Dockerfile         # Dockerイメージ定義
├── docker-compose.yml # Docker Compose設定
├── public/           # 静的ファイル
│   ├── index.html
│   ├── script.js
│   └── style.css
└── data/             # データ永続化
    └── todos.json
```

## API エンドポイント

- `GET /api/todos` - 全Todoアイテム取得
- `POST /api/todos` - 新規Todoアイテム作成
- `PUT /api/todos/:id` - Todoアイテム更新
- `DELETE /api/todos/:id` - Todoアイテム削除

## Docker設定

### Dockerfile
- マルチステージビルドで軽量化
- Node.js 14-alpineベースイメージ
- 非rootユーザーで実行

### docker-compose.yml
- ポート3000をマッピング
- dataディレクトリをボリュームマウント
- 自動再起動設定

## 開発上の注意事項

1. **ポート競合**: ポート3000が他のアプリケーションで使用されていないか確認
2. **データ永続化**: Dockerボリュームを使用してデータを保持
3. **セキュリティ**: 本番環境では適切な認証機能を追加
4. **エラーハンドリング**: ファイルI/O操作のエラー処理に注意
5. **環境変数**: 本番環境では`NODE_ENV=production`を設定

## 拡張可能性

- データベース（SQLite/PostgreSQL）への移行
- ユーザー認証機能の追加
- リアルタイム同期（WebSocket）
- タスクのカテゴリ分けや優先度設定