#!/usr/bin/env node
import { readFile, writeFile, mkdir, lstat, realpath, unlink } from 'node:fs/promises'
import path from 'node:path'
import {
  catalog,
  sourceRoot,
  getEntry,
  componentFiles,
  foundationFiles,
  readSource,
  recipeIndex,
  registryItem,
  resolveComponentIds,
} from './registry-lib.mjs'

const setupGuide = `# Kiso UI setup\n\n1. Install runtime packages: pnpm add @base-ui/react react react-dom\n2. Install Panda: pnpm add -D @pandacss/dev; configure PostCSS using pnpm exec panda init --postcss (merge carefully into existing config).\n3. Merge into your panda.config.ts:\n\n\x60\x60\x60ts\nimport { tokens, createSemanticTokens } from './src/theme/tokens'\nimport { conditions } from './src/theme/conditions'\nimport { recipes, slotRecipes } from './src/theme/recipes'\n// Inside defineConfig:\n// jsxFramework: 'react', outdir: 'styled-system',\n// include: ['./src/**/*.{ts,tsx}'],\n// staticCss: { css: [{ properties: { colorPalette: ['*'] } }] },\n// conditions: { extend: conditions },\n// theme: { extend: { tokens, semanticTokens: createSemanticTokens({ accentColor: 'iris', grayColor: 'neutral' }), recipes, slotRecipes } },\n\x60\x60\x60\n\n4. Import src/theme/global.css in your application entry.\n5. Set data-theme="light" or "dark" on html; optionally set data-accent to a Park palette such as "iris", "blue", or "green"; data-gray="neutral" or "slate".\n6. Run pnpm exec panda codegen. Add it to prepare and run it after adding components.\n7. Import individual components from src/components/ui.\n\nFonts default to system fallbacks. Optionally install @fontsource-variable/geist and @fontsource-variable/geist-mono and import them in your app.\n\nThe CLI preserves your existing configuration. It only supports the src/components/ui, src/theme and root styled-system layout.\nNo packages are installed, no network requests are made, and no existing customized files are overwritten.\nGenerated src/theme/recipes/index.ts is maintained by the CLI; edit recipe files instead.\n`

async function maybeRead(file) {
  try {
    return await readFile(file, 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
}

async function ensureSafePath(root, relative) {
  const target = path.resolve(root, relative)
  if (!target.startsWith(root + path.sep)) throw new Error(`Path is outside target: ${relative}`)
  let current = root
  for (const segment of relative.split('/')) {
    current = path.join(current, segment)
    try {
      if ((await lstat(current)).isSymbolicLink())
        throw new Error(`Refusing to follow a symlink: ${current}`)
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
  }
  return target
}

async function main() {
  const args = process.argv.slice(2)
  const command = args.shift() ?? 'help'
  let targetArg
  let dryRun = false
  let json = false
  const ids = []
  while (args.length) {
    const arg = args.shift()
    if (arg === '--target') {
      targetArg = args.shift()
      if (!targetArg || targetArg.startsWith('--')) throw new Error('--target needs a directory.')
    } else if (arg === '--dry-run') dryRun = true
    else if (arg === '--json') json = true
    else if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`)
    else ids.push(arg)
  }
  if (command === 'help') {
    console.log(
      'Kiso UI — source you own\n\n  pnpm ui list [--json]\n  pnpm ui inspect NAME\n  pnpm ui init --target PATH [--dry-run]\n  pnpm ui add NAME... --target PATH [--dry-run]\n\nRequires Node 24+. Existing customized files are never overwritten. No dependencies are installed.',
    )
    return
  }
  if (command === 'list') {
    console.log(
      json
        ? JSON.stringify(catalog, null, 2)
        : catalog.map((e) => `${e.id.padEnd(16)} ${e.description}`).join('\n'),
    )
    return
  }
  if (command === 'inspect') {
    if (ids.length !== 1) throw new Error('inspect requires exactly one component name.')
    console.log(JSON.stringify(await registryItem(ids[0]), null, 2))
    return
  }
  if (!['init', 'add'].includes(command)) throw new Error(`Unknown command: ${command}`)
  if (!targetArg)
    throw new Error('--target is required. Pass the destination application directory.')
  if (command === 'init' && ids.length)
    throw new Error('init does not accept component names. Use add.')
  if (command === 'add' && !ids.length) throw new Error('add requires at least one component name.')
  ids.forEach(getEntry)
  let target = path.resolve(targetArg)
  try {
    target = await realpath(target)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  if (target === sourceRoot)
    throw new Error('Choose a consumer application, not the Kiso source repository.')
  const metaPath = await ensureSafePath(target, '.kiso/installed.json')
  const previousText = await maybeRead(metaPath)
  const previous = previousText ? JSON.parse(previousText) : { schemaVersion: 1, components: [] }
  if (previous.schemaVersion !== 1 || !Array.isArray(previous.components))
    throw new Error('Unsupported .kiso/installed.json format.')
  previous.components.forEach(getEntry)
  const installed = resolveComponentIds([...previous.components, ...ids])
  const ownedFiles = new Set(
    previousText ? [...foundationFiles, 'src/theme/global.css', 'KISO-SETUP.md'] : [],
  )
  for (const id of previous.components)
    for (const file of await componentFiles(id)) ownedFiles.add(file)
  const files = new Map()
  for (const file of foundationFiles) files.set(file, await readSource(file))
  for (const id of ids)
    for (const file of await componentFiles(id)) files.set(file, await readSource(file))
  files.set('KISO-SETUP.md', setupGuide)
  files.set('src/theme/recipes/index.ts', recipeIndex(installed))
  files.set(
    '.kiso/installed.json',
    JSON.stringify({ schemaVersion: 1, components: installed }, null, 2) + '\n',
  )
  const plan = []
  const conflicts = []
  for (const [file, content] of files) {
    const absolute = await ensureSafePath(target, file)
    const before = await maybeRead(absolute)
    const managed =
      (file === 'src/theme/recipes/index.ts' &&
        previousText &&
        before?.replaceAll('\r\n', '\n') === recipeIndex(previous.components)) ||
      (file === '.kiso/installed.json' && previousText)
    const action =
      before === content
        ? 'unchanged'
        : before === null
          ? 'create'
          : managed
            ? 'update'
            : ownedFiles.has(file)
              ? 'preserve'
              : 'conflict'
    if (action === 'conflict') conflicts.push(file)
    plan.push({ file, absolute, before, content, action })
  }
  const summary = {
    target,
    dryRun,
    components: installed,
    files: plan.map(({ file, action }) => ({ path: file, action })),
  }
  console.log(
    json
      ? JSON.stringify(summary, null, 2)
      : `${dryRun ? 'Dry run' : 'Plan'} → ${target}\n${plan.map((p) => `  ${p.action.padEnd(10)} ${p.file}`).join('\n')}`,
  )
  if (conflicts.length)
    throw new Error(
      `Existing files differ; nothing was written. Review these files manually:\n${conflicts.join('\n')}`,
    )
  if (dryRun) return
  const written = []
  try {
    for (const entry of plan.filter((p) => p.action === 'create' || p.action === 'update')) {
      await mkdir(path.dirname(entry.absolute), { recursive: true })
      // Recheck before writing so changes made during planning are not lost.
      if ((await maybeRead(entry.absolute)) !== entry.before)
        throw new Error(`File changed during installation: ${entry.file}`)
      await writeFile(entry.absolute, entry.content, { flag: entry.before === null ? 'wx' : 'w' })
      written.push(entry)
    }
  } catch (error) {
    for (const entry of written.reverse()) {
      if ((await maybeRead(entry.absolute)) === entry.content) {
        if (entry.before === null) await unlink(entry.absolute)
        else await writeFile(entry.absolute, entry.before)
      }
    }
    throw error
  }
  console.log(
    `\nReady. ${installed.length} component(s) registered. Follow KISO-SETUP.md, install dependencies, then run panda codegen.`,
  )
}
main().catch((error) => {
  console.error(`Kiso: ${error.message}`)
  process.exitCode = 1
})
