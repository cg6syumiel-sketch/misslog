# MissLog 📝

学習効率を最大化する**ミス記録・復習管理アプリ**。
SRS（間隔反復）アルゴリズムで最適なタイミングに復習を促します。

---

## スクリーンショット

```
[一覧タブ]       [今日の復習タブ]     [統計タブ]
 - キーワード検索   - 今日やるべき問題   - 総ミス数
 - 教科フィルター   - 進捗バー          - 教科別グラフ
 - タグフィルター   - 1タップで復習完了  - タグ分布
 - 優先度ソート                        - CSVエクスポート
```

---

## セットアップ

```bash
# 1. 依存関係インストール
npm install

# 2. 開発サーバー起動
npm run dev
# → http://localhost:3000

# 3. ビルド
npm run build
npm start
```

---

## 必要な依存パッケージ

```bash
npm install zustand uuid date-fns lucide-react
npm install -D @types/uuid
```

---

## ディレクトリ構成

```
src/
├── app/
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # タブナビゲーション本体
│   └── globals.css         # CSS変数・ダークモード対応テーマ
├── components/
│   ├── mistakes/
│   │   ├── ListPage.tsx    # 一覧・検索・フィルター・ソート
│   │   ├── MistakeCard.tsx # ミスカード（復習・解決トグル）
│   │   └── MistakeForm.tsx # 登録・編集ボトムシート
│   ├── review/
│   │   └── TodayPage.tsx   # 今日の復習（進捗バー付き）
│   ├── dashboard/
│   │   └── DashboardPage.tsx # 統計・タグ分析・エクスポート
│   └── ui/
│       └── Tag.tsx         # タグコンポーネント（色分け）
├── store/
│   └── useMistakeStore.ts  # Zustand（localStorageに永続化）
├── types/
│   └── index.ts            # Mistake型・MistakeTag型
└── lib/
    ├── srs.ts              # SRS復習スケジューリングロジック
    ├── csv.ts              # CSVエクスポート（BOM付UTF-8）
    ├── seed.ts             # デモ用サンプルデータ
    └── repository.ts       # 将来のFirebase移行用抽象化レイヤー
```

---

## SRS（間隔反復）ロジック

| 復習回数 | 次回復習まで |
|---------|------------|
| 1回目   | 翌日（1日後）|
| 2回目   | 3日後      |
| 3回目   | 7日後      |
| 4回目以降| 14日後     |

`nextReviewDate <= 今日` かつ `未解決` のものが「今日の復習」に表示されます。

---

## データ型

```typescript
interface Mistake {
  id: string;
  subject: string;        // 教科（自由追加可能）
  page: string;           // ページ番号
  question: string;       // 問題番号
  comment: string;        // メモ・コメント
  tags: MistakeTag[];     // ミスの種類タグ
  isImportant: boolean;   // 重要フラグ
  reviewCount: number;    // 復習回数
  lastReviewedAt: string | null;  // 最終復習日
  nextReviewDate: string | null;  // 次回復習日（SRS自動算出）
  isResolved: boolean;    // 解決済みフラグ
  image: string | null;   // 添付画像（base64）
  createdAt: string;
  updatedAt: string;
}
```

---

## Firebase移行手順

1. `src/lib/repository.ts` の `FirebaseRepository` を実装
2. `src/store/useMistakeStore.ts` の `persist` を削除
3. 各アクション（add/update/delete）を `repo.*` 経由に変更
4. `useEffect` で初期ロード（`repo.getAll()`）を実装

---

## 今後の拡張案

- [ ] PWA化・プッシュ通知（今日の復習リマインダー）
- [ ] SM-2アルゴリズム（難易度評価付き高精度SRS）
- [ ] 音声入力でコメント記録
- [ ] ミス傾向AI分析（「計算ミスが最多です」）
- [ ] Firebase連携・複数デバイス同期
- [ ] 共有機能（先生・塾講師が生徒のミスを確認）
- [ ] 連続学習ストリーク表示
- [ ] Notion / Anki エクスポート

---

## ライセンス

MIT
