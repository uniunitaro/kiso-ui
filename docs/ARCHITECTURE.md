# 設計

## 三つの層

1. `src/theme/tokens.ts`: Park UI と同じ意味トークン（`fg.default / fg.muted / fg.subtle`・`canvas`・`border`・`error`、Kiso 追加の `fg.error`）と、パレットの別名（`accent`・`gray`・`info`・`success`・`warning`・`danger`）を定義します。
2. `src/theme/recipes`: 単一部品は defineRecipe、複数パーツは defineSlotRecipe。色（colorPalette）・見た目（variant）・大きさ（size）は独立した軸です。レシピは `colorPalette.*` と `gray.*` だけを参照し、特定のパレット名を書きません。
3. `src/components/ui`: Base UI の振る舞いを薄く包みます。UI の状態管理やキーボード処理を独自に再実装しません。レイアウト専用部品では適切なネイティブ要素を使います。

## なぜプリセットにしないか

コピーした後の最終決定権を利用アプリに置くためです。非公開のパッケージを追跡したり複雑な上書きを重ねる必要がなく、ソース・レシピ・トークンを同じ場所で編集できます。レシピの登録ファイルだけは CLI が管理し、部品追加時に必要な登録を維持します。

## 色の流れ

`globalCss` が html に `colorPalette: 'accent'` を置き、部品はそれを継承します。部品の `colorPalette` prop は Root 要素に `css({ colorPalette })` のクラスを付け、その子孫すべてが同じ色になります。Menu・Select・Dialog・Popover・Tooltip・Drawer・Combobox など要素を持たない Root では、`createStyleContext` の `Provider` がパレットのクラスを context で各スロットへ配り、Portal の中にも届けます。

JSX に書いた `colorPalette="red"` は、Panda が各レシピの `jsx`（部品名）から静的に抽出します。そのため `staticCss` で全パレットを生成する必要はありません。値を実行時に決める場合だけ、使う名前を staticCss に列挙します。プレビューはパレット選択のためにこれを使っています。

別名はパレットの役割をそのまま指すだけで、コントラストの自動調整はしません。緑・琥珀の淡い背景の文字や、明るい solid の白文字は4.5:1に届かない場合がありますが、Park UI の見た目を優先します。

## 状態の共通ルール

- disabled: `_disabled: { layerStyle: 'disabled' }`（Park UI と同じ不透明度0.67とグレースケール）。
- hover / active: `conditions.ts` で disabled の要素を除外します。
- フォーカス: Panda の `focusVisibleRing`。ボタン類は `outside`、入力類は `inside`、中の input にフォーカスが入る Combobox・NumberField は `_focusWithin` で枠を示します。色は `globalCss` の `--global-color-focus-ring`（その要素の `colorPalette.solid.bg`）、エラー時は `focusRingColor: 'error'`。
- 文字の大きさと行送りは `textStyles`（Park UI と同じ）で指定します。

## 合成の契約

`style-context.tsx` は Root でスタイルを計算して React context へ渡し、Portal をまたいでも各 slot に届けます。ref は React 19 の props として受け渡します。className が状態関数の場合は、Base UI の state をそのまま受け取った上でレシピのクラスを併合します。スタイル用の props は DOM へ漏らしません。

Select・Combobox・RadioGroup・Slider・Accordion などの Root はジェネリクスを維持します。オーバーレイのハンドルと payload の型も保持します。`ComponentProps<typeof GenericRoot>` だけで包むと推論を失うため、専用の型付き Root が必要です。検証は `tests/type-contracts.tsx` にあります。

## CSS 生成

Park UI と同じく、レシピに `staticCss` は書きません。variant とサイズは、Panda が各レシピの `jsx`（部品名）から使用箇所を抽出し、使われた値だけを CSS にします。`size="lg"` のような直接の値、`size={wide ? 'xl' : 'lg'}` のような三項演算子、`size={{ base: 'sm', md: 'lg' }}` のようなレスポンシブ指定は抽出されます。`size={sizes[key]}` のように変数から決める値や、自作の部品が props をそのまま渡す値は抽出されません。その場合はアプリの `panda.config.ts` の `staticCss.recipes` に、使う値だけを列挙します（例：`{ button: [{ size: ['sm', 'lg'], responsive: true }] }`）。

部品が別のレシピへ props を渡す場合は、受け取る側のレシピの `jsx` に外側の部品名を加えます（Pagination の `size` は button レシピの `jsx` に `Pagination` を含めて抽出させます）。部品内の既定値は `size ?? 'sm'` のようにリテラルで書き、抽出できるようにします。プレビューは実行時に variant を切り替えるため、プレビューの config だけが `staticCss.recipes: '*'` で全 variant を生成します。

`@layer reset, base, tokens, recipes, utilities` が優先順位を決めます。Panda の preflight が全要素に `border-style: solid` と `--global-color-border` を与えるので、境界線は `borderWidth: '1px'` だけで描けます。`border: '1px solid'` のような一括指定は原子的な utilities の出力順によって borderColor をリセットするため避けます。

Base UI は `data-checked`・`data-selected`・`data-starting-style` などの属性を提供します。他のライブラリの `data-state` を流用しません。

## レジストリとプレビュー

catalog が一覧、anatomy、依存レシピ、注意事項の入口です。registry-lib はソースのローカル import をたどり依存閉包を作ります。実行例用の追加依存とコンポーネント自体の依存を区別します。コピー後に全使用例がコンパイルできることを consumer 検証で保証します。

プレビューはライブラリの実物を使い、使い方・ソース・レシピを同じページで比較します。テーマ変更でその場の表現を確認できます。品質画面は48種類をまとめて検査でき、結果には検査時のテーマを記録します。

## 境界

ライブラリは操作部品と見た目を担当します。API 通信、権限、業務ルール、並び替えエンジン、日付の国際化、リッチテキスト編集は利用アプリが担当します。Toast の Provider はアプリの適切な位置へ、テーマは html へ置きます。React Server Components ではインタラクティブな境界にある `use client` を保持してください。

## Park UI のテーマ定義

Park UI と同じく、`panda.config.ts` の `semanticTokens.colors` に使うパレットだけを並べます。`src/theme/colors` の31色はファイルとしてコピーされますが、CSS に出るのは並べた色だけです。`gray` は config で割り当て、Kiso の別名（`accent`・`info`・`success`・`warning`・`danger`）は `aliases()` が作ります。`definePalette('brand', blue)` は参照を付け替えたコピーを作ります。Panda 標準の色は `removePandaPresetColors` で除きます。ランタイムのプレビューにはPanda設定用モジュールをimportせず、名前だけの `src/app/palettes.ts` を使います。

実行時にアクセント・グレー・角丸を切り替える仕組みはプレビュー専用で、`src/app/theme-runtime.ts`（CLI のコピー対象外）にあります。全パレットを登録し、`data-accent` / `data-gray` の条件で別名を切り替えます。

すべての部品の colorPalette は Panda のユーティリティに渡すため、設定に追加されたパレットも使用できます。DOMへpropsを漏らさず、classNameの状態関数・ref・render合成を保持します。catalog.ts の variants / sizes はレシピと一致することを `tests/theme.test.ts` で検証しています。

角丸は入れ子の内側l1・操作部品l2・外側l3。オーバーレイは用途別のzIndexトークンを使い、Dialog内で開くSelectやMenuのPortalはmodalより上のpopover層に置きます。
