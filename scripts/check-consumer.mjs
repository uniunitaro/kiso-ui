import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { execFileSync, spawnSync } from 'node:child_process'
import { catalog, sourceRoot } from './registry-lib.mjs'
import { examples } from '../src/app/examples.ts'

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
execFileSync(
  process.execPath,
  ['scripts/cli.mjs', 'add', ...catalog.map((entry) => entry.id), '--target', target],
  { cwd: sourceRoot, stdio: 'inherit' },
)
await writeFile(
  path.join(target, 'panda.config.ts'),
  `import { defineConfig } from '@pandacss/dev'
import { tokens, semanticColors, aliases, definePalette, radii, removePandaPresetColors } from './src/theme/tokens'
import { shadows } from './src/theme/shadows'
import { blue } from './src/theme/colors/blue'
import { green } from './src/theme/colors/green'
import { orange } from './src/theme/colors/orange'
import { red } from './src/theme/colors/red'
import { slate } from './src/theme/colors/slate'
import { conditions } from './src/theme/conditions'
import { globalCss } from './src/theme/global-css'
import { textStyles } from './src/theme/text-styles'
import { layerStyles } from './src/theme/layer-styles'
import { keyframes } from './src/theme/keyframes'
import { recipes, slotRecipes } from './src/theme/recipes'

const brand = definePalette('brand', blue)

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
          brand, blue, green, orange, red,
          gray: slate,
          ...aliases({ accent: brand, info: blue, success: green, warning: orange, danger: red }),
        },
        radii,
        shadows,
      },
      textStyles, layerStyles, keyframes, recipes, slotRecipes,
    },
  },
  plugins: [removePandaPresetColors],
})
`,
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
await writeFile(
  path.join(target, 'src', 'brand-example.tsx'),
  `import { Button } from './components/ui/button'
import * as Checkbox from './components/ui/checkbox'
export const Brand = () => (
  <>
    <Button colorPalette="brand" variant="surface" size={{base:'xs',md:'2xl'}}>Brand</Button>
    <Checkbox.Root colorPalette="danger" />
  </>
)
`,
)
for (const entry of catalog) {
  if (!examples[entry.id]) throw new Error(`Missing runnable example: ${entry.id}`)
  await writeFile(path.join(target, 'src', `example-${entry.id}.tsx`), examples[entry.id])
}
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
pnpm(['install', '--offline', '--ignore-scripts'])
pnpm(['exec', 'panda', 'codegen'])
pnpm(['exec', 'tsc', '--noEmit'])
pnpm(['exec', 'panda', 'cssgen'])
const generatedCss = await readFile(path.join(target, 'styled-system', 'styles.css'), 'utf8')
for (const selector of [
  // Extracted from JSX props: no staticCss for colorPalette in the consumer config.
  '.color-palette_brand',
  '.color-palette_danger',
  '--colors-brand-solid-bg',
  '--colors-warning-subtle-bg: var(--colors-orange-subtle-bg)',
  '--global-color-focus-ring: var(--colors-color-palette-solid-bg)',
  '.kiso-button:is(:focus-visible, [data-focus-visible])',
  '.md\\:kiso-button--size_lg',
  '.lg\\:kiso-checkbox__root--size_sm',
  '.sm\\:kiso-spinner--size_lg',
]) {
  if (!generatedCss.includes(selector)) throw new Error(`Generated CSS missing: ${selector}`)
}
// Only the palettes listed in the config are emitted; Panda's own 50–950 colors are removed.
for (const unexpected of ['--colors-tomato-9', '--colors-iris-9', '--colors-red-500']) {
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
        'offline installation',
        'source dependency closure',
        'Panda codegen',
        'strict TypeScript with every documented example',
        'CSS generation',
        'responsive recipe classes without consumer static usage',
        'colorPalette extracted from component props (no staticCss)',
        'only listed palettes emitted; Panda preset colors removed',
      ],
    },
    null,
    2,
  ) + '\n',
)
console.log(`\nConsumer verified: ${catalog.length} components and examples.\n${target}`)
