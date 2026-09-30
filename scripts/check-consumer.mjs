import { copyFile, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { execFileSync, spawnSync } from 'node:child_process'
import { catalog, sourceRoot } from './registry-lib.mjs'
import { examples } from '../src/app/examples.ts'
import { teal } from '../src/theme/colors/teal.ts'

const fixtureRoot = path.join(sourceRoot, '.test-workspaces')
await mkdir(fixtureRoot, { recursive: true })
const target = await mkdtemp(path.join(fixtureRoot, 'consumer-'))
const exactVersion = async (name) =>
  JSON.parse(await readFile(path.join(sourceRoot, 'node_modules', name, 'package.json'), 'utf8'))
    .version
const dependencies = Object.fromEntries(
  await Promise.all(
    ['@base-ui/react', 'react', 'react-dom'].map(async (name) => [name, await exactVersion(name)]),
  ),
)
const devDependencies = Object.fromEntries(
  await Promise.all(
    ['@pandacss/dev', 'typescript', '@types/react', '@types/react-dom', '@types/node'].map(
      async (name) => [name, await exactVersion(name)],
    ),
  ),
)
await writeFile(
  path.join(target, 'package.json'),
  JSON.stringify(
    { name: 'kiso-consumer-check', private: true, type: 'module', dependencies, devDependencies },
    null,
    2,
  ),
)
await writeFile(
  path.join(target, 'tsconfig.json'),
  JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        moduleResolution: 'Bundler',
        jsx: 'react-jsx',
        strict: true,
        skipLibCheck: true,
        esModuleInterop: true,
        noEmit: true,
      },
      include: ['src', 'panda.config.ts'],
    },
    null,
    2,
  ),
)
function pnpm(args) {
  const pnpmEntry = process.env.npm_execpath
  if (!pnpmEntry) throw new Error('Run this check using pnpm test:consumer.')
  const result = spawnSync(process.execPath, [pnpmEntry, ...args], {
    cwd: target,
    stdio: 'inherit',
  })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(`Consumer command failed: pnpm ${args.join(' ')}`)
}
// Start from this repository's lockfile so pnpm keeps the versions already in the store. Without
// it, the offline install picks the newest release pnpm has seen, which may not be downloaded.
await copyFile(path.join(sourceRoot, 'pnpm-lock.yaml'), path.join(target, 'pnpm-lock.yaml'))
pnpm(['install', '--offline', '--ignore-scripts'])
// Start from what `panda init` (1.12) writes, then let the CLI merge Kiso into it. panda init
// itself would find the Kiso repository's config above this fixture and write nothing.
// strictTokens: true (an app's own choice) checks that Kiso's theme and examples use only tokens.
await writeFile(
  path.join(target, 'panda.config.ts'),
  `import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,
  strictTokens: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {},
  },

  // The output directory for your css system
  outdir: "styled-system",
});
`,
)
const cliArgs = [
  'scripts/cli.mjs',
  'add',
  ...catalog.map((entry) => entry.id),
  '--target',
  target,
  '--panda-config=merge',
  '--accent=teal',
  '--gray=slate',
]
execFileSync(process.execPath, cliArgs, { cwd: sourceRoot, stdio: 'inherit' })
const rerun = JSON.parse(
  execFileSync(process.execPath, [...cliArgs, '--dry-run', '--json'], {
    cwd: sourceRoot,
    encoding: 'utf8',
  }),
)
if (rerun.files.find((file) => file.path === 'panda.config.ts')?.action !== 'unchanged')
  throw new Error('Merging Kiso into panda.config.ts again changed it.')
// The app then adds colors of its own, as the README shows: a renamed copy and raw palettes it
// uses by name. The larger palette set is also what made wide colorPalette types hit TS2590.
const extraPalettes = ['tomato', 'plum', 'cyan', 'grass', 'orange', 'sky']
const configPath = path.join(target, 'panda.config.ts')
const config = await readFile(configPath, 'utf8')
const withColors = config
  .replace(
    'import { slate } from "./src/theme/colors/slate";',
    (line) =>
      line +
      extraPalettes
        .map((name) => `\nimport { ${name} } from "./src/theme/colors/${name}";`)
        .join(''),
  )
  .replace(
    '          danger: definePalette("danger", red),\n',
    (line) =>
      `${line}          brand: definePalette("brand", blue),\n` +
      extraPalettes.map((name) => `          ${name},\n`).join(''),
  )
// One import and one entry per palette, plus brand.
if (withColors.split('\n').length !== config.split('\n').length + extraPalettes.length * 2 + 1)
  throw new Error('The merged panda.config.ts no longer has the expected colors block.')
await writeFile(configPath, withColors)
await writeFile(
  path.join(target, 'src', 'brand-example.tsx'),
  `import { Button } from './components/ui/button'
import * as Checkbox from './components/ui/checkbox'
import { Pagination } from './components/ui/pagination'
export const Brand = ({ wide }: { wide: boolean }) => (
  <>
    <Button colorPalette="success" variant="surface" size={{base:'xs',md:'2xl'}}>Done</Button>
    <Button size={wide ? 'xl' : 'lg'}>Either</Button>
    <Checkbox.Root colorPalette="danger" size={{ base: 'md', lg: 'sm' }} />
    <Button colorPalette="brand">Brand</Button>
    <Button colorPalette="tomato" variant="outline">Tomato</Button>
    <Checkbox.Label size="2xl"><Checkbox.Root />Large</Checkbox.Label>
    <Pagination count={3} size="2xs" />
  </>
)
`,
)
// Apps wrap Kiso parts with a default palette. With Panda's full colorPalette type (every nested
// role, [ ] and responsive value), these spreads hit TS2590 under strictTokens as palettes grow.
await writeFile(
  path.join(target, 'src', 'palette-wrappers.tsx'),
  `import type { ComponentProps } from 'react'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import * as Checkbox from './components/ui/checkbox'
export const GrayButton = (props: ComponentProps<typeof Button>) => (
  <Button colorPalette="gray" {...props} />
)
export const QuietBadge = (props: ComponentProps<typeof Badge>) => (
  <Badge {...props} colorPalette={props.colorPalette ?? 'gray'} />
)
export const AccentCheckbox = (props: ComponentProps<typeof Checkbox.Root>) => (
  <Checkbox.Root colorPalette="accent" {...props} />
)
// @ts-expect-error The prop takes palette names; nested roles are for css().
export const Nested = () => <Button colorPalette="accent.solid" />
// @ts-expect-error Only the palettes listed in panda.config.ts exist; accent copies teal.
export const Unlisted = () => <Button colorPalette="teal" />
`,
)
for (const entry of catalog) {
  if (!examples[entry.id]) throw new Error(`Missing runnable example: ${entry.id}`)
  await writeFile(path.join(target, 'src', `example-${entry.id}.tsx`), examples[entry.id])
}
pnpm(['exec', 'panda', 'codegen'])
pnpm(['exec', 'tsc', '--noEmit'])
pnpm(['exec', 'panda', 'cssgen'])
const generatedCss = await readFile(path.join(target, 'styled-system', 'styles.css'), 'utf8')
for (const selector of [
  // Extracted from JSX props: no staticCss for colorPalette in the consumer config.
  '.color-palette_success',
  '.color-palette_danger',
  '.color-palette_brand',
  '.color-palette_tomato',
  // Colors the app adds: a renamed copy and a raw palette listed as is.
  '--colors-brand-solid-bg: var(--colors-brand-9)',
  '--colors-tomato-solid-bg: var(--colors-tomato-9)',
  // --accent reaches the merged config: accent is a copy of teal whose roles refer to itself.
  `--colors-accent-9: ${teal['9'].value.base}`,
  '--colors-accent-solid-bg: var(--colors-accent-9)',
  '--colors-warning-subtle-bg: var(--colors-warning-a3)',
  '--global-color-focus-ring: var(--colors-color-palette-solid-bg)',
  '.kiso-button:is(:focus-visible, [data-focus-visible])',
  // Variants are extracted from JSX like Park UI: literals, ternaries and responsive objects.
  '.md\\:kiso-button--size_2xl',
  '.kiso-button--size_xl',
  '.kiso-button--size_lg',
  '.lg\\:kiso-checkbox__root--size_sm',
  // Root inherits the size written on Checkbox.Label; the slot recipe emits both parts.
  '.kiso-checkbox__root--size_2xl',
  '.kiso-checkbox__label--size_2xl',
  // <Pagination size> reaches its buttons through the button recipe's jsx.
  '.kiso-button--size_2xs',
]) {
  if (!generatedCss.includes(selector)) throw new Error(`Generated CSS missing: ${selector}`)
}
// No recipe forces every variant: unused sizes and breakpoints stay out of the CSS.
for (const unused of ['.sm\\:kiso-spinner--size_lg', '.xl\\:kiso-select__trigger--size_2xs']) {
  if (generatedCss.includes(unused)) throw new Error(`Unused variant in CSS: ${unused}`)
}
// Only what the config lists is emitted: the palettes the roles copy (teal, amber, slate…) are
// not, and Panda's own 50–950 colors are removed.
for (const unexpected of [
  '--colors-teal-',
  '--colors-amber-',
  '--colors-slate-',
  '--colors-iris-',
  '--colors-red-500',
]) {
  if (generatedCss.includes(unexpected)) throw new Error(`Unlisted color in CSS: ${unexpected}`)
}
await mkdir(path.join(sourceRoot, 'artifacts'), { recursive: true })
await writeFile(
  path.join(sourceRoot, 'artifacts', 'consumer-check.json'),
  JSON.stringify(
    {
      date: new Date().toISOString(),
      status: 'passed',
      components: catalog.length,
      examples: catalog.length,
      fixture: path.relative(sourceRoot, target),
      checks: [
        'offline installation pinned by the Kiso lockfile',
        'Kiso merged into the panda.config.ts panda init writes; merging again changes nothing',
        'source dependency closure',
        'Panda codegen',
        'strict TypeScript and Panda strictTokens with every documented example',
        'colorPalette takes palette names only: wrappers with a default palette compile (no TS2590)',
        'CSS generation',
        'recipe variants extracted from JSX (no staticCss); unused variants omitted',
        'colorPalette extracted from component props (no staticCss)',
        'only listed colors emitted (roles are copies; their sources are not); Panda preset colors removed',
      ],
    },
    null,
    2,
  ) + '\n',
)
console.log(`\nConsumer verified: ${catalog.length} components and examples.\n${target}`)
