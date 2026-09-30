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
await writeFile(
  path.join(target, 'src', 'brand-example.tsx'),
  `import { Button } from './components/ui/button'
import * as Checkbox from './components/ui/checkbox'
import { Pagination } from './components/ui/pagination'
export const Brand = ({ wide }: { wide: boolean }) => (
  <>
    <Button colorPalette="teal" variant="surface" size={{base:'xs',md:'2xl'}}>Teal</Button>
    <Button size={wide ? 'xl' : 'lg'}>Either</Button>
    <Checkbox.Root colorPalette="danger" size={{ base: 'md', lg: 'sm' }} />
    <Checkbox.Label size="2xl"><Checkbox.Root />Large</Checkbox.Label>
    <Pagination count={3} size="2xs" />
  </>
)
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
  '.color-palette_teal',
  '.color-palette_danger',
  // --accent and --gray reach the merged config.
  '--colors-teal-solid-bg',
  '--colors-accent-solid-bg: var(--colors-teal-solid-bg)',
  '--colors-warning-subtle-bg: var(--colors-amber-subtle-bg)',
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
        'Kiso merged into the panda.config.ts panda init writes; merging again changes nothing',
        'source dependency closure',
        'Panda codegen',
        'strict TypeScript and Panda strictTokens with every documented example',
        'CSS generation',
        'recipe variants extracted from JSX (no staticCss); unused variants omitted',
        'colorPalette extracted from component props (no staticCss)',
        'only listed palettes emitted; Panda preset colors removed',
      ],
    },
    null,
    2,
  ) + '\n',
)
console.log(`\nConsumer verified: ${catalog.length} components and examples.\n${target}`)
