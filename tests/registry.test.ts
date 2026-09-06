// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { execFileSync } from 'node:child_process'
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
    expect(index).toContain('export const recipes = { button, input }')
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
    expect(output).toContain('preserve')
    expect(readFileSync(tokens, 'utf8')).toContain('Consumer customization')
    const index = readFileSync(path.join(target, 'src/theme/recipes/index.ts'), 'utf8')
    expect(index).toContain('export const slotRecipes = { dialog }')
    expect(index).toContain('export const recipes = { button, input }')
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
    ).toContain('export const recipes = { button }')
    const installed = JSON.parse(
      readFileSync(path.join(paginationTarget, '.kiso/installed.json'), 'utf8'),
    )
    expect(installed.components).toEqual(['button', 'pagination'])
  })
})
