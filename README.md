# Todo List Application

ブラウザで動作するシンプルなTodoリストアプリケーションです。Docker上で実行できます。

## 機能

- ✅ タスクの追加・削除・編集
- ✅ タスクの完了/未完了切り替え
- ✅ フィルタリング（すべて/未完了/完了済み）
- ✅ タスク数カウント
- ✅ レスポンシブデザイン

## 技術スタック

- **フロントエンド**: HTML, CSS, JavaScript (Vanilla JS)
- **バックエンド**: Node.js + Express
- **データ保存**: JSON ファイル
- **コンテナ**: Docker + Docker Compose

## 実行方法

### Docker Composeを使用（推奨）

```bash
# アプリケーションの起動
docker-compose up -d

# ログの確認
docker-compose logs -f

# アプリケーションの停止
docker-compose down
```

### Dockerを直接使用

```bash
# イメージのビルド
docker build -t todo-list-app .

# コンテナの実行
docker run -p 3000:3000 -v $(pwd)/data:/app/data todo-list-app
```

### ローカル環境での実行

```bash
# 依存関係のインストール
npm install

# アプリケーションの起動
npm start
```

## アクセス

アプリケーションが起動したら、ブラウザで以下のURLにアクセスしてください：

http://localhost:3000

## API エンドポイント

- `GET /api/todos` - すべてのTodoを取得
- `POST /api/todos` - 新しいTodoを追加
- `PUT /api/todos/:id` - Todoを更新
- `DELETE /api/todos/:id` - Todoを削除

## データの永続化

Todoデータは `todos.json` ファイルに保存されます。Docker Composeを使用する場合、データは `./data` ディレクトリにマウントされ、コンテナを再起動してもデータが保持されます。