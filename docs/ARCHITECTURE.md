# 設計

## 三つの層

1. `src/theme/tokens.ts`: 表面・文字・境界線・アクセント・状態色という意味を定義します。アクセント色と成功・警告・危険の意味を分離します。
2. `src/theme/recipes`: 単一部品は defineRecipe、複数パーツは defineSlotRecipe。サイズと見た目は独立した軸です。Button は colorPalette も独立しています。
3. `src/components/ui`: Base UI の振る舞いを薄く包みます。UI の状態管理やキーボード処理を独自に再実装しません。レイアウト専用部品では適切なネイティブ要素を使います。

## なぜプリセットにしないか

コピーした後の最終決定権を利用アプリに置くためです。非公開のパッケージを追跡したり複雑な上書きを重ねる必要がなく、ソース・レシピ・トークンを同じ場所で編集できます。レシピの登録ファイルだけは CLI が管理し、部品追加時に必要な登録を維持します。

## 合成の契約

`style-context.tsx` は Root でスタイルを計算して React context へ渡し、Portal をまたいでも各 slot に届けます。ref は React 19 の props として受け渡します。className が状態関数の場合は、Base UI の state をそのまま受け取った上でレシピのクラスを併合します。スタイル用の props は DOM へ漏らしません。

Select・Combobox・RadioGroup・Slider・Accordion などの Root はジェネリクスを維持します。オーバーレイのハンドルと payload の型も保持します。`ComponentProps<typeof GenericRoot>` だけで包むと推論を失うため、専用の型付き Root が必要です。検証は `tests/type-contracts.tsx` にあります。

## CSS 生成

静的な variant 値は各レシピの `staticCss: ['*']` で生成します。size は `responsive: true` で Panda のブレークポイント用 CSS も生成します。したがって実行時のサイズ切り替えや `size={{ base: 'sm', md: 'lg' }}` がコピー先でも動作します。その他のカスタム条件・レスポンシブな variant は Panda が検出できる静的な使用箇所を用意するか、そのレシピの staticCss に必要な条件を追加します。

`@layer reset, base, tokens, recipes, utilities` が優先順位を決めます。部分的な境界線は `borderBottomWidth` と `borderBottomStyle` などで指定します。`borderBottom: '1px solid'` は原子的な utilities の出力順によって borderColor をリセットするため避けます。

Base UI は `data-checked`・`data-selected`・`data-starting-style` などの属性を提供します。他のライブラリの `data-state` を流用しません。

## レジストリとプレビュー

catalog が一覧、anatomy、依存レシピ、注意事項の入口です。registry-lib はソースのローカル import をたどり依存閉包を作ります。実行例用の追加依存とコンポーネント自体の依存を区別します。コピー後に全使用例がコンパイルできることを consumer 検証で保証します。

プレビューはライブラリの実物を使い、使い方・ソース・レシピを同じページで比較します。テーマ変更でその場の表現を確認できます。品質画面は48種類をまとめて検査でき、結果には検査時のテーマを記録します。

## 境界

ライブラリは操作部品と見た目を担当します。API 通信、権限、業務ルール、並び替えエンジン、日付の国際化、リッチテキスト編集は利用アプリが担当します。Toast の Provider はアプリの適切な位置へ、テーマは html へ置きます。React Server Components ではインタラクティブな境界にある `use client` を保持してください。
