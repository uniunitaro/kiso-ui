# Kiso UI

Base UI の振る舞いと Panda CSS のレシピを組み合わせた、ソースを所有する React コンポーネント集です。48種類の部品、実際に操作できるプレビュー、使用例、レシピ、ローカルコピー用 CLI を収録しています。

Park UI の「パレット（colorPalette）× 見た目（variant）× 大きさ（size）」という考え方を採用し、Base UI の render 合成・状態コールバック・値のジェネリクスを保持しています。配色・意味トークン・状態色・主要部品のサイズ・角丸・影・重なり順・textStyles・disabled の表現は Park UI の定義に準拠しています。

## 起動

Node.js 24 以上、pnpm 10 を使用します。

```sh
pnpm install
pnpm dev
```

表示先は `http://127.0.0.1:5173`。Overview は実際の部品による作例、Components は48種類の検索、各詳細ページはサイズ・見た目・ソースの確認、Theming は配色と角丸の調整、Quality checks は axe の検査画面です。

## アプリへコピー

コピー先は React 19 / TypeScript / Panda CSS のアプリを想定します。CLI はこのリポジトリから実行します。

```sh
pnpm ui list
pnpm ui inspect dialog
pnpm ui init --target ../your-app --dry-run
pnpm ui init --target ../your-app
pnpm ui add button input field dialog --target ../your-app
```

コピー先で依存を入れ、Panda の PostCSS 統合を設定します。

```sh
pnpm add @base-ui/react@^1.8.0 react@^19 react-dom@^19
pnpm add -D @pandacss/dev@^1.12.1
pnpm exec panda init --postcss
```

既存の設定を維持しながら `panda.config.ts` へ追加します。

```ts
import { defineConfig } from '@pandacss/dev'
import { tokens, semanticColors, aliases, radii, removePandaPresetColors } from './src/theme/tokens'
import { shadows } from './src/theme/shadows'
import { iris } from './src/theme/colors/iris'
import { neutral } from './src/theme/colors/neutral'
import { blue } from './src/theme/colors/blue'
import { green } from './src/theme/colors/green'
import { amber } from './src/theme/colors/amber'
import { red } from './src/theme/colors/red'
import { conditions } from './src/theme/conditions'
import { globalCss } from './src/theme/global-css'
import { textStyles } from './src/theme/text-styles'
import { layerStyles } from './src/theme/layer-styles'
import { keyframes } from './src/theme/keyframes'
import { recipes, slotRecipes } from './src/theme/recipes'

export default defineConfig({
  preflight: true,
  jsxFramework: 'react',
  include: ['./src/**/*.{ts,tsx}'],
  outdir: 'styled-system',
  conditions: { extend: conditions },
  globalCss: { extend: globalCss },
  theme: {
    extend: {
      tokens,
      semanticTokens: {
        colors: {
          ...semanticColors,
          // Only the palettes listed here exist. Add one: import it and list it.
          iris,
          blue,
          green,
          amber,
          red,
          gray: neutral,
          ...aliases({ accent: iris, info: blue, success: green, warning: amber, danger: red }),
        },
        radii,
        shadows,
      },
      textStyles,
      layerStyles,
      keyframes,
      recipes,
      slotRecipes,
    },
  },
  plugins: [removePandaPresetColors],
})
```

アプリのエントリーで `import './theme/global.css'`（src 内の場合。カスケードレイヤーの宣言だけを持ちます）。`pnpm exec panda codegen` を実行し、prepare スクリプトにも登録してください。PostCSS が CSS を生成します。PostCSS を使わない構成では `panda cssgen` の出力をアプリへ読み込みます。コピー時の `KISO-SETUP.md` も参照できます。

```tsx
import { Button } from './components/ui/button'
import * as Dialog from './components/ui/dialog'

export function Example() {
  return (
    <Dialog.Root size="md">
      <Dialog.Trigger render={<Button variant="outline" colorPalette="neutral" />}>
        Open
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <Dialog.Title>Your next idea</Dialog.Title>
          <Dialog.Description>A place to start.</Dialog.Description>
          <Dialog.Close render={<Button />}>Done</Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

CLI は依存ファイルとレシピを追跡し、ページ分割の Button 依存などもコピーします。未知の名前や新規ファイルの衝突は書き込み前に止め、すでに所有する部品の編集内容は維持します。パッケージのインストールや通信は行いません。`src/components/ui`・`src/theme`・ルートの `styled-system` という配置に対応しています。`src/theme/recipes/index.ts` は CLI 管理ファイルで、個々のレシピは自由に編集できます。

## カスタマイズ

- **全体**: `panda.config.ts` の `semanticTokens.colors`。使うパレットを並べ、`gray` と別名（`aliases`）を決めます。`src/theme/colors/` には Park UI と同じ31色（ライト・ダーク）がありますが、CSS に出るのは並べた色だけです。
- **色**: すべての部品は `colorPalette.*` だけを参照します。既定は html に設定した `accent` を継承し、部品の `colorPalette` prop、または祖先の `css({ colorPalette })` で差し替えます。
- **部品**: `src/theme/recipes/*.ts` の `defineRecipe` / `defineSlotRecipe`。サイズ、バリアント、状態、各スロットの見た目を変更できます。
- **局所**: `className={css({ ... })}`。utilities レイヤーが recipes レイヤーより後に適用されます。
- **合成**: Base UI の `render`、`ref`、状態を受ける `className`、controlled / uncontrolled の props を利用できます。

```tsx
<Button variant="outline" colorPalette="danger" size={{ base: 'sm', md: 'lg' }}>
  Remove
</Button>
<Checkbox.Root colorPalette="success" variant="surface" />
<Tabs.Root colorPalette="gray" variant="enclosed">…</Tabs.Root>
<section className={css({ colorPalette: 'brand' })}>{/* 中の部品がすべて brand 色 */}</section>
```

```html
<html data-theme="dark"></html>
```

`data-theme` は html に設定すると Portal 内にも継承されます。`colorPalette` は DOM で継承されるため、Portal で描画する Menu・Select・Dialog などは Root の `colorPalette` prop で指定します（部品側でポップアップへ届けます）。フォントの追加は任意で、標準ではシステムフォントへフォールバックします。プレビューは Geist を同梱しています。

## 開発と検証

```sh
pnpm typecheck
pnpm test
pnpm test:consumer
pnpm build
pnpm preview
```

`test:consumer` は別ディレクトリに全コンポーネントをインストールし、48種類の使用例、型、Panda 生成、レスポンシブなサイズの CSS を検証します。初回の `pnpm install` 後、キャッシュ済み依存を使うオフライン検証です。

`pnpm registry:build` は `public/registry.json`・`public/r/*.json`・`public/llms*.txt` を生成します。これは Kiso のスキーマで、shadcn CLI との互換性を謳うものではありません。実行例と依存情報を人にも AI にも同じソースから提供します。

設計の詳細は [設計ガイド](docs/ARCHITECTURE.md)、作業の規約は [AGENTS.md](AGENTS.md)、検証記録は [品質記録](docs/QUALITY.md) にあります。

## 対応範囲

Base UI のフォーム、選択、オーバーレイ、ナビゲーションに加え、Card・Table・Breadcrumb・Pagination などを収録しています。Drawer の既定レシピは下から開く構成です。日付処理、データテーブルのソートエンジン、グラフ描画、サービスへの送信はアプリ側で合成してください。アクセシビリティは実際のラベルと使い方にも依存し、自動検査だけで適合を保証するものではありません。

## Park UI テーマ

配色と状態色の参照元は [Park UI](https://park-ui.com/docs/theming) です。取り込み元のコミットは `src/theme/park-source.json`、ライセンスは `src/theme/PARK-UI-LICENSE` に保存しています。Ark UI の実装は取り込まず、Base UI の状態属性と合成契約を維持します。

色は Park UI と同じく、`panda.config.ts` の `semanticTokens.colors` に使うものだけを並べます。並べた色だけが CSS に出力され、`colorPalette` にも使えます。Panda 標準の 50〜950 の色は `removePandaPresetColors` で取り除きます。

```ts
import { tomato } from './src/theme/colors/tomato'
import { definePalette } from './src/theme/tokens'

const brand = definePalette('brand', blue) // 既存パレットを別名でコピー（brand.9 を上書きすれば役割も追従）

semanticTokens: {
  colors: {
    ...semanticColors,
    iris, blue, green, amber, red,
    tomato, // 色を足す: import して1行
    brand,
    gray: neutral, // グレーの差し替え: slate / mauve / olive / sage / sand
    ...aliases({ accent: brand, info: blue, success: green, warning: tomato, danger: red }),
  },
  radii,
  shadows,
}
```

`aliases()` は Kiso の別名 `accent`・`info`・`success`・`warning`・`danger` を作ります（Park UI にはない Kiso の追加です）。渡す色は、同じ `colors` に並べたものにしてください。部品は `accent` を継承し、Alert・Toast・`fg.error` などは状態の別名を参照します。追加色は `<Button colorPalette="brand" variant="surface" />` のように使えます。設定変更後に Panda を再生成してください。

`colorPalette="red"` のように JSX に書いた値は、Panda が部品名（各レシピの `jsx`）から静的に抽出するため `staticCss` は不要です。変数で色を決める場合だけ、使う名前を `staticCss.css[].properties.colorPalette` に列挙します。プレビューの Theming ページはアクセントとグレーを実行時に切り替えるため、全パレットを登録しています（`src/app/theme-runtime.ts`、コピー対象外）。

各パレットは `1`〜`12`、透過色 `a1`〜`a12`、`solid / subtle / surface / outline / plain` の背景・文字・境界線・状態色を持ちます。

意味トークンは Park UI と同じ `fg.default / fg.muted / fg.subtle`、`canvas`、`border`、`error` です。Kiso は読みやすいエラー文用に `fg.error`（danger の11番）を足しています。パレットの別名は `gray`（Park UI と同じく config で `gray: neutral` のように割り当て）と、`aliases()` で作る `accent`・`info`・`success`・`warning`・`danger` です。

主な操作部品の `xs / sm / md / lg / xl / 2xl` は高さ32 / 36 / 40 / 44 / 48 / 64px。Select・Combobox・Menu の size はポップアップ内の項目の高さと文字にも効きます。Checkbox・Radio・Switchは16 / 18 / 20 / 22 / 24 / 32pxです。Badgeは公式レシピに合わせて sm〜2xl が18 / 20 / 22 / 24 / 28pxです。Button・Inputには公式の2xs（24 / 28px）もあります。Slider は Park UI では3サイズが同じ値ですが、Kiso ではつまみと溝の太さが変わります。Park UIにない部品や追加サイズはKiso側の拡張です。

バリアントは Park UI に合わせています。色を持つ部品は `solid / surface / subtle / outline / plain` から該当するものを持ち、入力系は `outline / surface / subtle`（Input・Textarea は `flushed` も）、Tabs は `line / subtle / enclosed`、Alert は `status`（info / success / warning / error / neutral）と `variant` の組み合わせです。

角丸は `l1 → xs (2px)`、`l2 → sm (4px)`、`l3 → md (6px)`。Panda設定の `semanticTokens.radii` で参照を変更できます。円形部品は `full` を使います。

disabled は Park UI の `layerStyle: 'disabled'`（不透明度0.67とグレースケール）で統一し、hover / active は disabled の要素に効かない条件に置き換えています。フォーカス表示は Panda の `focusVisibleRing`（ボタン類は外側2px、入力類は内側1px＋枠線）で、色は `--global-color-focus-ring`（その要素の `colorPalette.solid.bg`）です。

影はモードに対応した `xs`〜`2xl` と `inset`、重なり順は `dropdown`〜`tooltip` の名前付きトークンを使用します。別名（`accent`・`info`・`success`・`warning`・`danger`）は Park UI のパレットをそのまま指し、コントラストの自動調整はしません。緑・琥珀の淡い背景の文字や明るい solid の白文字は4.5:1に届かない場合があります。本文には `fg.default / fg.muted`、エラー文には `fg.error` を使います。

ネストした Dialog は、子が開いている間、親を少し縮めて暗くします（Base UI の `data-nested-dialog-open` と `--nested-dialogs`）。子の backdrop は重ねません。

品質ページの axe は、閉じた状態に加えて、オーバーレイ13種を1つずつ開いて Portal の中身まで検査します（Base UI のフォーカス番兵は除外）。開けなかったものは結果に表示します。
