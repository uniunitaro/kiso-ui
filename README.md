# Kiso UI

Base UI の振る舞いと Panda CSS のレシピを組み合わせた、ソースを所有する React コンポーネント集です。49種類の部品、実際に操作できるプレビュー、使用例、レシピ、ローカルコピー用 CLI を収録しています。

Park UI の「パレット（colorPalette）× 見た目（variant）× 大きさ（size）」という考え方を採用し、Base UI の render 合成・状態コールバック・値のジェネリクスを保持しています。配色・意味トークン・状態色・主要部品のサイズ・角丸・影・重なり順・textStyles・disabled の表現は Park UI の定義に準拠しています。

## 起動

Node.js 24 以上、pnpm 10 を使用します。

```sh
pnpm install
pnpm dev
```

表示先は `http://127.0.0.1:5173`。Overview は実際の部品による作例、Components は49種類の検索、各詳細ページはサイズ・見た目・ソースの確認、Theming は配色と角丸の調整、Quality checks は axe の検査画面です。

## ドキュメントサイトの公開

Cloudflare Workers Static Assets で `dist` を配信します。公開先は `https://kiso-ui.uniunita.ro`。Worker 名、アセットの場所、独自ドメインは `wrangler.jsonc` で管理します。

Cloudflare Workers Builds でこの GitHub リポジトリを接続し、Worker 名を `kiso-ui`、本番ブランチを `main`、ビルドコマンドを `pnpm build`、デプロイコマンドを `pnpm deploy` に設定します。ビルド環境変数は `NODE_VERSION=24`、`PNPM_VERSION=10.26.2`、ルートディレクトリはリポジトリ直下です。以後、`main` への push で自動公開されます。

手元から公開する場合は、Cloudflare にログインしてから次を実行します。

```sh
pnpm build
pnpm deploy
```

画面遷移はハッシュ方式なので、SPA 用のフォールバック設定は不要です。ビルドで生成するレジストリと `llms.txt` も静的アセットとして公開します。

## アプリへコピー

コピー先は React 19 / TypeScript / Panda CSS のアプリを想定します。CLI は npm に公開していないため、このリポジトリを手元に置き、そこから実行します。`--target` はこのリポジトリから見たコピー先のパスです。

```sh
git clone https://github.com/uniunitaro/kiso-ui.git kiso-ui
cd kiso-ui
pnpm install
```

```sh
pnpm ui list
pnpm ui inspect dialog
pnpm ui init --target ../your-app --dry-run
pnpm ui init --target ../your-app
pnpm ui add button input field dialog --target ../your-app
```

コピー先で依存を入れ、Panda の PostCSS 統合を設定します（`panda init` は既存の `panda.config.ts` を上書きしません）。

```sh
pnpm add @base-ui/react@^1.8.0 react@^19 react-dom@^19
pnpm add -D @pandacss/dev@^1.12.1
pnpm exec panda init --postcss
```

`panda.config.ts` の扱いは `--panda-config` で指定します。

| 指定           | 動作                                                                                                                                                                                                            |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `keep`（既定） | ファイルがなければ Kiso の設定で作り、あれば触らない                                                                                                                                                            |
| `merge`        | 既存のファイルに Kiso の import と設定を書き足す。書いてある値が優先され、書式（インデント・引用符・セミコロン）も既存に合わせる。`outdir` が違うなど安全に足せない箇所があれば、理由を表示して何も書き込まない |
| `overwrite`    | Kiso の設定で丸ごと置き換える                                                                                                                                                                                   |

`--accent` と `--gray` で、書き込む設定のパレットを選べます（既定は `iris` と `neutral`）。`--dry-run` を付けると、書き込み後の `panda.config.ts` を表示します。

```sh
pnpm ui init --target ../your-app --panda-config=merge --accent=teal --gray=slate --dry-run
```

書き込まれる設定の全文は、コピー先の `KISO-SETUP.md` とプレビューの Installation ページで確認できます（どちらも `src/app/panda-config-template.ts` から生成）。

アプリのエントリーで `import './theme/global.css'`（src 内の場合。カスケードレイヤーの宣言だけを持ちます）。`pnpm exec panda codegen` を実行し、prepare スクリプトにも登録してください。PostCSS が CSS を生成します。PostCSS を使わない構成では `panda cssgen` の出力をアプリへ読み込みます。

```tsx
import { Button } from './components/ui/button'
import * as Dialog from './components/ui/dialog'

export function Example() {
  return (
    <Dialog.Root size="md">
      <Dialog.Trigger render={<Button variant="outline" colorPalette="gray" />}>
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

### 更新

CLI は書き込んだファイルのハッシュを `.kiso/installed.json` に記録します。Kiso を `git pull` した後に `update` を実行すると、書き込んだときのまま変更していないファイルだけを新しい版に置き換え、編集したファイルは `customized` と表示してそのまま残します。`add` も、コピーする基盤と部品について同じように扱います。`diff` は手元のファイルと Kiso の差分を表示します（`outdated` は未編集で古いもの、`customized` は編集したもの）。編集したファイルに Kiso の変更を取り込むときは手で統合するか、ファイルを削除してから `update` を実行します。

```sh
pnpm ui diff --target ../your-app
pnpm ui update --target ../your-app --dry-run
pnpm ui update --target ../your-app
pnpm ui update dialog --target ../your-app
```

以前の CLI で入れた（ハッシュの記録がない）ファイルは、Kiso と一致するものだけを未編集として記録します。一致しないものは編集の有無を判別できないため `customized` として扱います。`--accent` / `--gray` は記録され、次回以降の既定値になります。

### 既存アプリの移行: aliases() から definePalette へ

`aliases()` を廃止し、役割は `definePalette()` で作るコピーになりました。`update` は `panda.config.ts` を書き換えないため、`src/theme/tokens.ts` を更新すると `import { aliases }` が壊れます。`panda.config.ts` は手で次のように直してください。

1. `...aliases({ accent: iris, info: blue, success: green, warning: amber, danger: red })` を、役割ごとの行 `accent: definePalette('accent', iris)`・`info: definePalette('info', blue)`・`success: definePalette('success', green)`・`warning: definePalette('warning', amber)`・`danger: definePalette('danger', red)` に置き換えます。`gray: neutral` はそのままです。
2. import を `aliases` から `definePalette` に替えます。
3. `iris, blue, green, amber, red` のように並べていた元のパレットは、`colorPalette="red"` のように名前のまま使うものだけ残し、ほかは行と import を消します。
4. `colorPalette` prop はパレット名だけを受け取ります。`colorPalette="accent.solid"` やレスポンシブ指定を prop に渡していた箇所は、祖先の `css({ colorPalette })` に移します。
5. `panda codegen` を実行し、型検査で消したパレット名の使用が残っていないか確かめます。

新しく `--panda-config=merge` で書き込む場合は、この形の設定が入ります。すでに `semanticTokens.colors` がある設定には書き込まず、手で直すよう表示します。

## カスタマイズ

- **全体**: `panda.config.ts` の `semanticTokens.colors`。`gray` と役割（`accent`・`info`・`success`・`warning`・`danger`）にどのパレットを使うかを決めます。`src/theme/colors/` には Park UI と同じ31色（ライト・ダーク）がありますが、CSS に出るのは並べた色だけです。
- **色**: すべての部品は `colorPalette.*` だけを参照します。既定は html に設定した `accent` を継承し、部品の `colorPalette` prop、または祖先の `css({ colorPalette })` で差し替えます。prop が受け取るのは `accent`・`gray`・`brand` のようなパレット名だけです。`accent.solid` のような入れ子の名前やレスポンシブ指定は、祖先の `css({ colorPalette })` で指定します。
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
<html class="dark"></html>
```

ダークモードは Park UI と同じく html の `class="dark"` で切り替えます（Panda 既定の `dark` 条件）。next-themes は既定の `attribute="class"` のまま使えます。何も付けなければライトです。html に付けるので Portal 内にも効きます。`colorPalette` は DOM で継承されるため、Portal で描画する Menu・Select・Dialog などは Root の `colorPalette` prop で指定します（部品側でポップアップへ届けます）。フォントの追加は任意で、標準ではシステムフォントへフォールバックします。プレビューは Geist を同梱しています。

## 開発と検証

```sh
pnpm typecheck
pnpm test
pnpm test:consumer
pnpm build
pnpm preview
```

`test:consumer` は別ディレクトリに全コンポーネントをインストールし、49種類の使用例、型、Panda 生成を検証します。JSX に書いた variant・レスポンシブなサイズが抽出され、使っていない variant が CSS に出ないことも確認します。初回の `pnpm install` 後、キャッシュ済み依存を使うオフライン検証です。

`pnpm registry:build` は `public/registry.json`・`public/r/*.json`・`public/llms*.txt` を生成します。これは Kiso のスキーマで、shadcn CLI との互換性を謳うものではありません。実行例と依存情報を人にも AI にも同じソースから提供します。

設計の詳細は [設計ガイド](docs/ARCHITECTURE.md)、作業の規約は [AGENTS.md](AGENTS.md)、検証記録は [品質記録](docs/QUALITY.md) にあります。

## 対応範囲

Base UI のフォーム、選択、オーバーレイ、ナビゲーションに加え、Card・Table・Breadcrumb・Pagination などを収録しています。Drawer の既定レシピは下から開く構成です。日付処理、データテーブルのソートエンジン、グラフ描画、サービスへの送信はアプリ側で合成してください。アクセシビリティは実際のラベルと使い方にも依存し、自動検査だけで適合を保証するものではありません。

## Park UI テーマ

配色と状態色の参照元は [Park UI](https://park-ui.com/docs/theming) です。取り込み元のコミットは `src/theme/park-source.json`、ライセンスは `src/theme/PARK-UI-LICENSE` に保存しています。Ark UI の実装は取り込まず、Base UI の状態属性と合成契約を維持します。

色は Park UI と同じく、`panda.config.ts` の `semanticTokens.colors` に使うものだけを並べます。並べた色だけが CSS に出力され、`colorPalette` にも使えます。Panda 標準の 50〜950 の色は `removePandaPresetColors` で取り除きます。

```ts
import { semanticColors, definePalette } from './src/theme/tokens'
import { iris } from './src/theme/colors/iris'
import { tomato } from './src/theme/colors/tomato'
// blue・green・amber・red・neutral も同じく import します

semanticTokens: {
  colors: {
    ...semanticColors,
    gray: neutral, // グレーの差し替え: slate / mauve / olive / sage / sand
    accent: definePalette('accent', iris),
    info: definePalette('info', blue),
    success: definePalette('success', green),
    warning: definePalette('warning', amber),
    danger: definePalette('danger', red),
    brand: definePalette('brand', blue), // 名前を付けた追加色
    tomato, // 名前のまま使う色だけ並べる
  },
  radii,
  shadows,
}
```

役割 `accent`・`info`・`success`・`warning`・`danger` は Kiso の追加で（Park UI にはありません）、`definePalette(名前, パレット)` で作るパレットのコピーです。コピーは値を自分で持つため、元の `iris` や `red` を並べる必要はなく、並べなければ CSS にも出ません。参照は新しい名前に付け替わるので、`accent.9` を上書きすれば `accent.solid.bg` なども追従します。`gray` は Park UI と同じくパレットをそのまま割り当てます。部品は `accent` を継承し、Alert・Toast・`fg.error` などは役割を参照します。`colorPalette="tomato"` のように元の名前で使いたいパレットだけ、import して並べてください。追加色は `<Button colorPalette="brand" variant="surface" />` のように使えます。設定変更後に Panda を再生成してください。

`colorPalette="danger"`・`variant`・`size` のように JSX に書いた値は、Park UI と同じく Panda が部品名（各レシピの `jsx`）から静的に抽出し、使われた値だけを CSS にします。三項演算子やレスポンシブ指定（`size={{ base: 'sm', md: 'lg' }}`）も抽出されるため、通常は `staticCss` は不要です。変数から variant やサイズを決める場合は、使う値を `staticCss.recipes` に列挙します（例：`staticCss: { recipes: { button: [{ size: ['sm', 'lg'] }] } }`）。変数で色を決める場合だけ、使う名前を `staticCss.css[].properties.colorPalette` に列挙します。プレビューの Theming ページはアクセントとグレーを実行時に切り替えるため、全パレットを登録しています（`src/app/theme-runtime.ts`、コピー対象外）。

各パレットは `1`〜`12`、透過色 `a1`〜`a12`、`solid / subtle / surface / outline / plain` の背景・文字・境界線・状態色を持ちます。

意味トークンは Park UI と同じ `fg.default / fg.muted / fg.subtle`、`canvas`、`border`、`error` です。Kiso は読みやすいエラー文用に `fg.error`（danger の11番）を足しています。パレットの役割は `gray`（Park UI と同じく config で `gray: neutral` のように割り当て）と、`definePalette()` で作る `accent`・`info`・`success`・`warning`・`danger` です。Panda 標準の色は外しますが、`transparent` と `current` は同じ名前のトークンとして残します。部品とテーマは Panda の `strictTokens: true` でも型エラーになりません。`colorPalette` prop の型をパレット名に絞っているため、`<Button colorPalette="gray" {...props} />` のように既定色を付けて包む部品も、パレットを増やして TS2590（union 型が複雑すぎる）になりません。

主な操作部品の `xs / sm / md / lg / xl / 2xl` は高さ32 / 36 / 40 / 44 / 48 / 64px。Select・Combobox・Menu の size はポップアップ内の項目の高さと文字にも効きます。Checkbox・Radio・Switchは16 / 18 / 20 / 22 / 24 / 32pxです。Badgeは公式レシピに合わせて sm〜2xl が18 / 20 / 22 / 24 / 28pxです。Button・Inputには公式の2xs（24 / 28px）もあります。Slider は Park UI では3サイズが同じ値ですが、Kiso ではつまみと溝の太さが変わります。Park UIにない部品や追加サイズはKiso側の拡張です。

バリアントは Park UI に合わせています。色を持つ部品は `solid / surface / subtle / outline / plain` から該当するものを持ち、入力系は `outline / surface / subtle`（Input・Textarea は `flushed` も）、Tabs は `line / subtle / enclosed`、Alert は `status`（info / success / warning / error / neutral）と `variant` の組み合わせです。

角丸は `l1 → xs (2px)`、`l2 → sm (4px)`、`l3 → md (6px)`。Panda設定の `semanticTokens.radii` で参照を変更できます。円形部品は `full` を使います。

disabled は Park UI の `layerStyle: 'disabled'`（不透明度0.67とグレースケール）で統一し、hover / active は disabled の要素に効かない条件に置き換えています。フォーカス表示は Panda の `focusVisibleRing`（ボタン類は外側2px、入力類は内側1px＋枠線）で、色は `--global-color-focus-ring`（その要素の `colorPalette.solid.bg`）です。

影はモードに対応した `xs`〜`2xl` と `inset`、重なり順は `dropdown`〜`tooltip` の名前付きトークンを使用します。役割（`accent`・`info`・`success`・`warning`・`danger`）は Park UI のパレットの値をそのままコピーし、コントラストの自動調整はしません。緑・琥珀の淡い背景の文字や明るい solid の白文字は4.5:1に届かない場合があります。本文には `fg.default / fg.muted`、エラー文には `fg.error` を使います。

ネストした Dialog は、子が開いている間、親を少し縮めて暗くします（Base UI の `data-nested-dialog-open` と `--nested-dialogs`）。子の backdrop は重ねません。

品質ページの axe は、閉じた状態に加えて、オーバーレイ13種を1つずつ開いて Portal の中身まで検査します（Base UI のフォーカス番兵は除外）。開けなかったものは結果に表示します。
