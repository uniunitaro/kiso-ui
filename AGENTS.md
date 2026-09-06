# Kiso UI の作業規約

- 回答とコミットメッセージは日本語。コミットは Conventional Commits。Node.js の作業は pnpm。
- まず README.md と docs/ARCHITECTURE.md を確認する。部品を探すときは src/app/catalog.ts と `pnpm ui inspect NAME` を入口にする。
- 振る舞いは Base UI、表現は Panda のローカルレシピ、全体の意味はトークンに置く。
- ref、render 合成、className の state callback、値と payload のジェネリクスを壊さない。
- レシピの変更をデモ専用の上書きで隠さない。実物のコンポーネントで見た目と操作を確認する。
- Base UI の属性をローカル型定義または公式資料で確認する。別ライブラリの data-state を持ち込まない。
- 新しい部品はソース、レシピ、index、catalog、使用例、デモ、registry-lib のレシピ情報を揃える。複数部品を import するなら CLI の依存情報も更新する。
- サイズは responsive staticCss を維持する。グローバル CSS の変更はコピーされる src/theme/global.css とプレビューの整合を確認する。
- スタイル変更はライト・ダークと狭い画面を in-app browser で表示し、スクリーンショットを見て確認する。
- 型や合成に関わる変更は typecheck と関連テスト。コピー内容や使用例を変更したら test:consumer。公開物の検証は build。
- styled-system、dist、public の生成レジストリを手編集しない。元のソースを変更して再生成する。
- CLI は既存の所有ソースを維持する。無断の上書きやネットワークインストールを追加しない。
