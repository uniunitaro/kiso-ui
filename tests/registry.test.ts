// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  existsSync,
  writeFileSync,
  rmSync,
  realpathSync,
} from 'node:fs'
import path from 'node:path'
import { mergePandaConfig, pandaConfigTemplate } from '../scripts/panda-config.mjs'

const workspace = process.cwd()
const fixtures = path.join(workspace, '.test-workspaces')
let target: string
function cli(args: string[]) {
  return execFileSync(process.execPath, ['scripts/cli.mjs', ...args], {
    cwd: workspace,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}
beforeAll(() => {
  mkdirSync(fixtures, { recursive: true })
  target = mkdtempSync(path.join(fixtures, 'registry-'))
})
afterAll(() => {
  // Only remove the temporary fixture inside the explicitly checked workspace boundary.
  const checked = realpathSync(target)
  if (!checked.startsWith(realpathSync(fixtures) + path.sep))
    throw new Error('Unsafe test cleanup path')
  rmSync(checked, { recursive: true, force: true })
})

describe('source installer', () => {
  it('plans without creating files', () => {
    const output = cli(['add', 'button', '--target', target, '--dry-run', '--json'])
    const plan = JSON.parse(output)
    expect(
      plan.files.some((file: { path: string }) => file.path === 'src/theme/recipes/button.ts'),
    ).toBe(true)
    expect(existsSync(path.join(target, 'src'))).toBe(false)
  })
  it('rejects unknown names before any changes', () => {
    expect(() => cli(['add', 'button', 'missing', '--target', target])).toThrow()
    expect(existsSync(path.join(target, 'src'))).toBe(false)
  })
  it('copies dependencies and registers only requested recipes', () => {
    cli(['add', 'button', 'input', '--target', target])
    expect(existsSync(path.join(target, 'src/components/ui/style-context.tsx'))).toBe(true)
    expect(existsSync(path.join(target, 'src/theme/shared.ts'))).toBe(true)
    const index = readFileSync(path.join(target, 'src/theme/recipes/index.ts'), 'utf8')
    expect(index).toContain('export const recipes = { button, input, spinner }')
    expect(index).not.toContain('dialog')
  })
  it('is idempotent and preserves an owned theme when adding another component', () => {
    const managedIndex = path.join(target, 'src/theme/recipes/index.ts')
    // A Windows Git checkout can convert generated LF to CRLF without a user edit.
    writeFileSync(managedIndex, readFileSync(managedIndex, 'utf8').replaceAll('\n', '\r\n'))
    cli(['add', 'button', '--target', target])
    const tokens = path.join(target, 'src/theme/tokens.ts')
    writeFileSync(tokens, readFileSync(tokens, 'utf8') + '\n// Consumer customization\n')
    const output = cli(['add', 'dialog', '--target', target])
    expect(output).toMatch(/customized\s+src\/theme\/tokens\.ts/)
    expect(readFileSync(tokens, 'utf8')).toContain('Consumer customization')
    const index = readFileSync(path.join(target, 'src/theme/recipes/index.ts'), 'utf8')
    expect(index).toContain('export const slotRecipes = { dialog }')
    expect(index).toContain('export const recipes = { button, input, spinner }')
  })
  it('detects new-file collisions before writing any additional file', () => {
    const conflicting = path.join(target, 'src/components/ui/avatar.tsx')
    writeFileSync(conflicting, '// Existing user component\n')
    expect(() => cli(['add', 'avatar', 'badge', '--target', target])).toThrow()
    expect(readFileSync(conflicting, 'utf8')).toBe('// Existing user component\n')
    expect(existsSync(path.join(target, 'src/components/ui/badge.tsx'))).toBe(false)
  })
  it('refuses to replace a manually edited recipe index', () => {
    const index = path.join(target, 'src/theme/recipes/index.ts')
    writeFileSync(index, readFileSync(index, 'utf8') + '\n// Custom index\n')
    expect(() => cli(['add', 'checkbox', '--target', target])).toThrow()
    expect(existsSync(path.join(target, 'src/components/ui/checkbox.tsx'))).toBe(false)
    expect(readFileSync(index, 'utf8')).toContain('Custom index')
  })
  it('resolves component-to-component recipes in a fresh Pagination install', () => {
    const paginationTarget = path.join(target, 'pagination-consumer')
    cli(['add', 'pagination', '--target', paginationTarget])
    expect(existsSync(path.join(paginationTarget, 'src/components/ui/button.tsx'))).toBe(true)
    expect(existsSync(path.join(paginationTarget, 'src/theme/recipes/button.ts'))).toBe(true)
    expect(
      readFileSync(path.join(paginationTarget, 'src/theme/recipes/index.ts'), 'utf8'),
    ).toContain('export const recipes = { button, spinner }')
    const installed = JSON.parse(
      readFileSync(path.join(paginationTarget, '.kiso/installed.json'), 'utf8'),
    )
    // Button's loading state renders the Spinner component.
    expect(installed.components).toEqual(['button', 'pagination', 'spinner'])
  })
})

describe('keeping copies up to date', () => {
  const read = (app: string, file: string) => readFileSync(path.join(app, file), 'utf8')
  const source = (file: string) => readFileSync(path.join(workspace, file), 'utf8')
  const sha = (text: string) => createHash('sha256').update(text).digest('hex')
  // Pretends Kiso has changed since the install: the copy and its record hold an older version.
  function ageCopy(app: string, file: string) {
    const older = source(file) + '// An older Kiso version\n'
    writeFileSync(path.join(app, file), older)
    const metaPath = path.join(app, '.kiso/installed.json')
    const meta = JSON.parse(readFileSync(metaPath, 'utf8'))
    meta.files[file] = sha(older)
    writeFileSync(metaPath, JSON.stringify(meta))
  }

  it('records a hash of every file it writes', () => {
    const app = path.join(target, 'drift-record')
    cli(['add', 'badge', '--target', app, '--accent=teal'])
    const meta = JSON.parse(read(app, '.kiso/installed.json'))
    expect(meta.schemaVersion).toBe(2)
    expect(meta.palettes).toEqual({ accent: 'teal', gray: 'neutral' })
    expect(meta.files['src/components/ui/badge.tsx']).toBe(
      sha(source('src/components/ui/badge.tsx')),
    )
    expect(meta.files['src/theme/shared.ts']).toBe(sha(source('src/theme/shared.ts')))
    // Later runs reuse the palettes; KISO-SETUP.md stays as written.
    expect(cli(['add', 'kbd', '--target', app])).toMatch(/unchanged\s+KISO-SETUP\.md/)
  })
  // Seven CLI runs.
  it('updates unchanged copies and keeps the ones you edited', () => {
    const app = path.join(target, 'drift-update')
    cli(['add', 'badge', 'kbd', '--target', app])
    ageCopy(app, 'src/theme/shared.ts')
    ageCopy(app, 'src/components/ui/kbd.tsx')
    const badge = path.join(app, 'src/components/ui/badge.tsx')
    writeFileSync(badge, read(app, 'src/components/ui/badge.tsx') + '// Consumer change\n')
    // add refreshes the foundation it depends on, but not other components.
    const added = cli(['add', 'separator', '--target', app])
    expect(added).toMatch(/update\s+src\/theme\/shared\.ts/)
    expect(read(app, 'src/theme/shared.ts')).toBe(source('src/theme/shared.ts'))
    expect(read(app, 'src/components/ui/kbd.tsx')).toContain('An older Kiso version')

    const diff = cli(['diff', '--target', app])
    expect(diff).toContain('outdated: src/components/ui/kbd.tsx')
    expect(diff).toContain('-// An older Kiso version')
    expect(diff).toContain('customized: src/components/ui/badge.tsx')
    expect(diff).toContain('-// Consumer change')
    expect(JSON.parse(cli(['diff', 'kbd', '--target', app, '--json'])).files).toEqual([
      { path: 'src/components/ui/kbd.tsx', status: 'outdated' },
    ])

    const updated = cli(['update', '--target', app])
    expect(updated).toMatch(/update\s+src\/components\/ui\/kbd\.tsx/)
    expect(updated).toMatch(/customized\s+src\/components\/ui\/badge\.tsx/)
    expect(updated).toContain('pnpm ui diff')
    expect(read(app, 'src/components/ui/kbd.tsx')).toBe(source('src/components/ui/kbd.tsx'))
    expect(read(app, 'src/components/ui/badge.tsx')).toContain('Consumer change')
    // An edited file stays customized on later runs.
    expect(cli(['update', '--target', app])).toMatch(/customized\s+src\/components\/ui\/badge\.tsx/)
    expect(() => cli(['update', 'dialog', '--target', app])).toThrow(/Not installed: dialog/)
  }, 20_000)
  it('treats differing files from a version 1 record as customized', () => {
    const app = path.join(target, 'drift-legacy')
    cli(['add', 'badge', '--target', app])
    const metaPath = path.join(app, '.kiso/installed.json')
    writeFileSync(metaPath, JSON.stringify({ schemaVersion: 1, components: ['badge'] }))
    const tokens = path.join(app, 'src/theme/tokens.ts')
    writeFileSync(tokens, read(app, 'src/theme/tokens.ts') + '// Unknown origin\n')
    expect(cli(['update', '--target', app])).toMatch(/customized\s+src\/theme\/tokens\.ts/)
    expect(read(app, 'src/theme/tokens.ts')).toContain('Unknown origin')
    const meta = JSON.parse(readFileSync(metaPath, 'utf8'))
    expect(meta.schemaVersion).toBe(2)
    expect(meta.files['src/theme/tokens.ts']).toBeUndefined()
    expect(meta.files['src/components/ui/badge.tsx']).toBe(
      sha(source('src/components/ui/badge.tsx')),
    )
  })
})

// What `panda init` (Panda 1.12) writes.
const pandaInitConfig = `import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

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
`

describe('panda.config.ts', () => {
  it('creates it when missing and leaves an existing one alone by default', () => {
    const app = path.join(target, 'config-keep')
    cli(['add', 'badge', '--target', app, '--accent', 'teal', '--gray=slate'])
    const config = path.join(app, 'panda.config.ts')
    expect(readFileSync(config, 'utf8')).toBe(
      pandaConfigTemplate({ accent: 'teal', gray: 'slate' }),
    )
    writeFileSync(config, '// Consumer config\n')
    expect(cli(['add', 'button', '--target', app])).toMatch(/keep\s+panda\.config\.ts/)
    expect(readFileSync(config, 'utf8')).toBe('// Consumer config\n')
  })
  it('merges into an existing config or overwrites it only when asked', () => {
    const app = path.join(target, 'config-modes')
    mkdirSync(app, { recursive: true })
    const config = path.join(app, 'panda.config.ts')
    writeFileSync(config, pandaInitConfig)
    cli(['add', 'badge', '--target', app, '--panda-config=merge'])
    const merged = readFileSync(config, 'utf8')
    expect(merged).toContain('// Useful for theme customization')
    expect(merged).toContain('import { recipes, slotRecipes } from "./src/theme/recipes";')
    expect(merged).toContain('accent: definePalette("accent", iris),')
    expect(merged).toContain('danger: definePalette("danger", red),')
    expect(merged).not.toContain('aliases')
    cli(['add', 'badge', '--target', app, '--panda-config', 'overwrite', '--accent', 'tomato'])
    expect(readFileSync(config, 'utf8')).toBe(
      pandaConfigTemplate({ accent: 'tomato', gray: 'neutral' }),
    )
  })
  it('writes nothing when the config cannot be merged safely', () => {
    const app = path.join(target, 'config-conflict')
    mkdirSync(app, { recursive: true })
    const config = path.join(app, 'panda.config.ts')
    const custom = pandaInitConfig.replace('"styled-system"', '"src/styled-system"')
    writeFileSync(config, custom)
    expect(() => cli(['add', 'badge', '--target', app, '--panda-config=merge'])).toThrow(/outdir/)
    expect(readFileSync(config, 'utf8')).toBe(custom)
    expect(existsSync(path.join(app, 'src'))).toBe(false)
  })
  it('rejects unknown modes and palettes before any changes', () => {
    const app = path.join(target, 'config-invalid')
    expect(() => cli(['add', 'badge', '--target', app, '--panda-config=replace'])).toThrow()
    expect(() => cli(['add', 'badge', '--target', app, '--gray', 'teal'])).toThrow()
    expect(existsSync(app)).toBe(false)
  })
})

describe('mergePandaConfig', () => {
  it("adds Kiso once, in the file's own style", () => {
    const { content, conflicts } = mergePandaConfig(pandaInitConfig)
    expect(conflicts).toEqual([])
    expect(content).toContain('\n  jsxFramework: "react",\n')
    expect(content).toContain('\n    extend: {\n      tokens,\n')
    expect(mergePandaConfig(content).content).toBe(content)
    const template = pandaConfigTemplate()
    expect(mergePandaConfig(template).content).toBe(template)
  })
  it("puts Kiso first in flat maps so the user's entries win", () => {
    const { content, conflicts } = mergePandaConfig(`import { defineConfig } from '@pandacss/dev'
import { card } from './card'
const config = defineConfig({
  jsxFramework: 'react',
  conditions: { extend: { hocus: '&:is(:hover, :focus)' } },
  theme: {
    extend: {
      recipes: {
        card,
      },
    },
  },
  plugins: [],
})
export default config
`)
    expect(conflicts).toEqual([])
    expect(content).toContain(
      "conditions: { extend: { ...conditions, hocus: '&:is(:hover, :focus)' } }",
    )
    expect(content).toContain('recipes: {\n        ...recipes,\n        card,\n      },')
    expect(content).toContain('plugins: [removePandaPresetColors]')
    expect(content).toContain("import { recipes, slotRecipes } from './src/theme/recipes'")
  })
  it('reports what it cannot add instead of guessing', () => {
    const { conflicts } = mergePandaConfig(`import { defineConfig } from '@pandacss/dev'
import { tokens } from './my-tokens'
export default defineConfig({
  jsxFramework: 'solid',
  theme: { extend: { semanticTokens: { colors: { brand: { value: 'red' } } } } },
})
`)
    expect(conflicts).toEqual([
      "jsxFramework: Kiso needs 'react'.",
      "theme.extend.semanticTokens.colors: already set; add ...semanticColors, gray and the roles (accent: definePalette('accent', iris), …) by hand.",
      'tokens: the name is already used in panda.config.ts.',
    ])
  })
})
