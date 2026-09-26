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
import {
  checkPalettes,
  defaultPalettes,
  mergePandaConfig,
  pandaConfigModes,
  pandaConfigTemplate,
} from './panda-config.mjs'

// Panda finds the first of these; the CLI edits whichever exists instead of adding a second.
const pandaConfigFiles = [
  'panda.config.ts',
  'panda.config.mts',
  'panda.config.mjs',
  'panda.config.js',
]

const fence = '```'
const setupGuide = (palettes) => `# Kiso UI setup

1. Install runtime packages: pnpm add @base-ui/react react react-dom
2. Install Panda: pnpm add -D @pandacss/dev; configure PostCSS using pnpm exec panda init --postcss (it keeps an existing panda.config.ts).
3. panda.config.ts: the CLI writes the configuration below when the file is missing and leaves an existing one alone. Rerun with --panda-config=merge to add Kiso to an existing file (your values win; if something cannot be added safely, nothing is written), or --panda-config=overwrite to replace it. --accent and --gray choose the palettes. List only the palettes you use; add one by importing it from src/theme/colors and listing it.

${fence}ts
${pandaConfigTemplate(palettes)}${fence}

4. Import src/theme/global.css in your application entry.
5. Set data-theme="light" or "dark" on html. Components inherit colorPalette="accent" (from aliases); pass colorPalette to any component, or set it on an ancestor to recolor a subtree. Use definePalette('brand', blue) for a renamed copy.
6. Run pnpm exec panda codegen. Add it to prepare and run it after adding components.
7. Import individual components from src/components/ui. Panda extracts variant, size and colorPalette values written in JSX (literals, ternaries, responsive objects) and emits only those; list values chosen from variables in staticCss.recipes, e.g. { button: [{ size: ['sm', 'lg'] }] }.

Fonts default to system fallbacks. Optionally install @fontsource-variable/geist and @fontsource-variable/geist-mono and import them in your app.

The CLI only supports the src/components/ui, src/theme and root styled-system layout.
No packages are installed, no network requests are made, and no existing customized files are overwritten; only --panda-config=overwrite replaces panda.config.ts.
Generated src/theme/recipes/index.ts is maintained by the CLI; edit recipe files instead.
`

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
  let pandaConfig = 'keep'
  const palettes = { ...defaultPalettes }
  const ids = []
  while (args.length) {
    // Options take a value as --name value or --name=value.
    const [arg, inline] = args.shift().split(/=(.*)/s)
    const value = (what) => {
      const next = inline ?? args.shift()
      if (!next || next.startsWith('--')) throw new Error(`${arg} needs ${what}.`)
      return next
    }
    if (arg === '--target') targetArg = value('a directory')
    else if (arg === '--panda-config') {
      pandaConfig = value(pandaConfigModes.join(', '))
      if (!pandaConfigModes.includes(pandaConfig))
        throw new Error(`--panda-config must be one of ${pandaConfigModes.join(', ')}.`)
    } else if (arg === '--accent') palettes.accent = value('a palette name')
    else if (arg === '--gray') palettes.gray = value('a palette name')
    else if (arg === '--dry-run') dryRun = true
    else if (arg === '--json') json = true
    else if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`)
    else ids.push(arg)
  }
  checkPalettes(palettes)
  if (command === 'help') {
    console.log(
      `Kiso UI — source you own

  pnpm ui list [--json]
  pnpm ui inspect NAME
  pnpm ui init --target PATH [options]
  pnpm ui add NAME... --target PATH [options]

Options for init and add:
  --dry-run                 Show the plan without writing
  --panda-config=keep       Create panda.config.ts when missing; leave an existing one alone (default)
  --panda-config=merge      Add Kiso to an existing panda.config.ts; your values win
  --panda-config=overwrite  Replace panda.config.ts with the Kiso configuration
  --accent=NAME             Accent palette for a written config (default ${defaultPalettes.accent})
  --gray=NAME               Gray palette for a written config (default ${defaultPalettes.gray})

Requires Node 24+. Existing customized files are never overwritten (only --panda-config=overwrite
replaces the Panda config). No dependencies are installed.`,
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
  files.set('KISO-SETUP.md', setupGuide(palettes))
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
  const configConflicts = []
  {
    let file = pandaConfigFiles[0]
    let before = null
    for (const candidate of pandaConfigFiles) {
      before = await maybeRead(await ensureSafePath(target, candidate))
      if (before !== null) {
        file = candidate
        break
      }
    }
    const template = pandaConfigTemplate(palettes)
    let content = before
    if (before === null || pandaConfig === 'overwrite') content = template
    else if (pandaConfig === 'merge') {
      const merged = mergePandaConfig(before, palettes)
      content = merged.content
      configConflicts.push(...merged.conflicts.map((reason) => `${file}: ${reason}`))
    }
    const action =
      before === null
        ? 'create'
        : pandaConfig === 'keep'
          ? 'keep'
          : before.replaceAll('\r\n', '\n') === content.replaceAll('\r\n', '\n')
            ? 'unchanged'
            : 'update'
    plan.push({ file, absolute: await ensureSafePath(target, file), before, content, action })
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
  if (configConflicts.length)
    throw new Error(
      `The Panda config cannot be merged safely; nothing was written:\n${configConflicts.map((c) => `  ${c}`).join('\n')}\nEdit it by hand (KISO-SETUP.md shows the full configuration) or rerun with --panda-config=overwrite.`,
    )
  const config = plan.at(-1)
  if (dryRun) {
    if (!json && (config.action === 'create' || config.action === 'update'))
      console.log(`\n${config.file} after this run:\n\n${config.content}`)
    return
  }
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
  if (config.action === 'keep')
    console.log(
      `${config.file} was left as is. Add Kiso to it by hand, or rerun with --panda-config=merge.`,
    )
}
main().catch((error) => {
  console.error(`Kiso: ${error.message}`)
  process.exitCode = 1
})
