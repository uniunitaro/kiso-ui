# Kiso UI

Base UI の振る舞いと Panda CSS のレシピを組み合わせた、ソースを所有する React コンポーネント集です。48種類の部品、実際に操作できるプレビュー、使用例、レシピ、ローカルコピー用 CLI を収録しています。

Park UI の「意味トークン → レシピ → サイズ・バリアント」という考え方を参考に、Base UI の render 合成・状態コールバック・値のジェネリクスを保持する設計を採用しました。配色・状態色・主要部品のサイズ・角丸・影・重なり順は Park UI の定義に準拠しています。

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
import { tokens, createSemanticTokens } from './src/theme/tokens'
import { conditions } from './src/theme/conditions'
import { recipes, slotRecipes } from './src/theme/recipes'

export default defineConfig({
  preflight: true,
  jsxFramework: 'react',
  include: ['./src/**/*.{ts,tsx}'],
  outdir: 'styled-system',
  staticCss: { css: [{ properties: { colorPalette: ['*'] } }] },
  conditions: { extend: conditions },
  theme: {
    extend: {
      tokens,
      semanticTokens: createSemanticTokens({ accentColor: 'iris', grayColor: 'neutral' }),
      recipes,
      slotRecipes,
    },
  },
})
```

アプリのエントリーで `import './theme/global.css'`（src 内の場合）。`pnpm exec panda codegen` を実行し、prepare スクリプトにも登録してください。PostCSS が CSS を生成します。PostCSS を使わない構成では `panda cssgen` の出力をアプリへ読み込みます。コピー時の `KISO-SETUP.md` も参照できます。

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

- **全体**: `src/theme/tokens.ts` の意味トークン。ライト・ダーク、Park UIと同じ31色のパレット を用意しています。
- **部品**: `src/theme/recipes/*.ts` の `defineRecipe` / `defineSlotRecipe`。サイズ、バリアント、状態、各スロットの見た目を変更できます。
- **局所**: `className={css({ ... })}`。utilities レイヤーが recipes レイヤーより後に適用されます。
- **合成**: Base UI の `render`、`ref`、状態を受ける `className`、controlled / uncontrolled の props を利用できます。

```tsx
<Button variant="outline" colorPalette="danger" size={{ base: 'sm', md: 'lg' }}>
  Remove
</Button>
```

```html
<html data-theme="dark" data-accent="blue" data-gray="slate"></html>
```

テーマ属性は html に設定すると Portal 内にも継承されます。フォントの追加は任意で、標準ではシステムフォントへフォールバックします。プレビューは Geist を同梱しています。

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

`panda.config.ts` で、アクセント・グレー・追加パレットを設定できます。

```ts
import { tokens, createSemanticTokens, palettes } from './src/theme/tokens'

// defineConfig の theme.extend 内
semanticTokens: createSemanticTokens({
  accentColor: 'iris',
  grayColor: 'neutral',
  additionalColors: { brand: palettes.blue },
})
```

追加色は `<Button colorPalette="brand" variant="surface" />` で使えます。`accentColor: 'brand'` で全体にも適用できます。設定変更後に Panda を再生成してください。実行時に色を選ぶ場合は、上の設定例の `staticCss` でパレットのクラスを生成します。`data-accent` / `data-gray` はプレビュー等の組み込み色の切り替え用で、指定した場合は設定の既定値より優先します。

各パレットは `1`〜`12`、透過色 `a1`〜`a12`、`solid / subtle / surface / outline / plain` の背景・文字・境界線・状態色を持ちます。`brand.9` などを上書きした場合も、追加パレットの内部参照は自分自身を向きます。

主な操作部品の `xs / sm / md / lg / xl / 2xl` は高さ32 / 36 / 40 / 44 / 48 / 64px。Checkbox・Radio・Switchは16 / 18 / 20 / 22 / 24 / 32pxです。Badgeは公式レシピに合わせて sm〜2xl が18 / 20 / 22 / 24 / 28pxで、一般図の32pxとは異なります。Buttonには公式の2xs（24px）もあります。Park UIにない部品や追加サイズはKiso側の拡張です。

角丸は `l1 → xs (2px)`、`l2 → sm (4px)`、`l3 → md (6px)`。Panda設定の `semanticTokens.radii` で参照を変更できます。プレビューの角丸選択は3段階のCSS変数を変更します。円形部品は `full / pill` を使います。`control / panel / popup` は既存利用のための互換エイリアスです。Buttonの `ghost` は `plain` の互換名、`danger` は赤いsolidの互換名です。

影はモードに対応した `xs`〜`2xl` と `inset`、重なり順は `dropdown`〜`tooltip` の名前付きトークンを使用します。ボーダーや淡い文字を含む全ての公式色の組み合わせが、あらゆる用途でコントラスト基準を満たすわけではありません。本文には `fg / fg.muted` を使い、用途に応じて確認してください。
