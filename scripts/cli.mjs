#!/usr/bin/env node
import { readFile, writeFile, mkdir, lstat, realpath, unlink } from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { normalizeNewlines, unifiedDiff } from './diff.mjs'
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
No packages are installed and no network requests are made. Files the CLI wrote and you have not changed are updated when you run add or update; files you changed are kept (pnpm ui diff compares them with Kiso). Only --panda-config=overwrite replaces panda.config.ts.
Generated src/theme/recipes/index.ts is maintained by the CLI; edit recipe files instead.
`

// installed.json records components, palettes and a hash of every file the CLI wrote.
const metaVersion = 2
const hash = (text) => createHash('sha256').update(normalizeNewlines(text)).digest('hex')

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
  const paletteArgs = {}
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
    } else if (arg === '--accent') paletteArgs.accent = value('a palette name')
    else if (arg === '--gray') paletteArgs.gray = value('a palette name')
    else if (arg === '--dry-run') dryRun = true
    else if (arg === '--json') json = true
    else if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`)
    else ids.push(arg)
  }
  checkPalettes({ ...defaultPalettes, ...paletteArgs })
  if (command === 'help') {
    console.log(
      `Kiso UI — source you own

  pnpm ui list [--json]
  pnpm ui inspect NAME
  pnpm ui init --target PATH [options]
  pnpm ui add NAME... --target PATH [options]
  pnpm ui update [NAME...] --target PATH [options]
  pnpm ui diff [NAME...] --target PATH [--json]

update refreshes the foundation and installed components (all, or the named ones) to this
version of Kiso. diff shows how your copies differ from it.

Options for init, add and update:
  --dry-run                 Show the plan without writing
  --panda-config=keep       Create panda.config.ts when missing; leave an existing one alone (default)
  --panda-config=merge      Add Kiso to an existing panda.config.ts; your values win
  --panda-config=overwrite  Replace panda.config.ts with the Kiso configuration
  --accent=NAME             Accent palette for a written config (default ${defaultPalettes.accent}, then the last one used)
  --gray=NAME               Gray palette for a written config (default ${defaultPalettes.gray}, then the last one used)

Requires Node 24+. Files the CLI wrote and you have not changed are updated; files you changed
are kept and listed as customized (only --panda-config=overwrite replaces the Panda config).
No dependencies are installed.`,
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
  if (!['init', 'add', 'update', 'diff'].includes(command))
    throw new Error(`Unknown command: ${command}`)
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
  const previous = previousText
    ? JSON.parse(previousText)
    : { schemaVersion: metaVersion, components: [], files: {} }
  if (
    ![1, metaVersion].includes(previous.schemaVersion) ||
    !Array.isArray(previous.components) ||
    (previous.files !== undefined &&
      (typeof previous.files !== 'object' || previous.files === null))
  )
    throw new Error('Unsupported .kiso/installed.json format.')
  previous.components.forEach(getEntry)
  // Hashes of what the CLI last wrote. Version 1 did not record them, so every file that
  // differs from Kiso counts as customized until it matches again.
  const recorded = { ...previous.files }
  const palettes = { ...defaultPalettes, ...previous.palettes, ...paletteArgs }
  checkPalettes(palettes)
  if (command === 'update' || command === 'diff') {
    if (!previousText) throw new Error(`Nothing is installed in ${target}. Run init or add first.`)
    const missing = ids.filter((id) => !previous.components.includes(id))
    if (missing.length) throw new Error(`Not installed: ${missing.join(', ')}. Use add.`)
  }
  // update and diff cover every installed component unless names are given.
  const selected = ids.length || command === 'add' ? ids : previous.components
  const installed = resolveComponentIds([...previous.components, ...ids])
  const ownedFiles = new Set(previousText ? [...foundationFiles, 'KISO-SETUP.md'] : [])
  for (const id of previous.components)
    for (const file of await componentFiles(id)) ownedFiles.add(file)
  for (const file of Object.keys(recorded)) ownedFiles.add(file)
  const files = new Map()
  for (const file of foundationFiles) files.set(file, await readSource(file))
  for (const id of selected)
    for (const file of await componentFiles(id)) files.set(file, await readSource(file))

  if (command === 'diff') {
    const report = []
    for (const [file, content] of files) {
      const local = await maybeRead(await ensureSafePath(target, file))
      if (local !== null && normalizeNewlines(local) === normalizeNewlines(content)) continue
      const status =
        local === null ? 'missing' : recorded[file] === hash(local) ? 'outdated' : 'customized'
      const diff = unifiedDiff(local ?? '', content, {
        from: local === null ? '/dev/null' : `${file} (yours)`,
        to: `${file} (Kiso)`,
      })
      report.push({ path: file, status, diff })
    }
    if (json)
      console.log(
        JSON.stringify({ target, files: report.map(({ diff, ...rest }) => rest) }, null, 2),
      )
    else if (!report.length) console.log(`Everything matches Kiso → ${target}`)
    else
      console.log(
        `${report.map((r) => `${r.status}: ${r.path}\n${r.diff}`).join('\n')}
outdated and missing files are written by "pnpm ui update". Customized files are never
overwritten: merge the changes by hand, or delete the file and run update to take Kiso's version.`,
      )
    return
  }

  const indexFile = 'src/theme/recipes/index.ts'
  files.set('KISO-SETUP.md', setupGuide(palettes))
  files.set(indexFile, recipeIndex(installed))
  const plan = []
  const conflicts = []
  for (const [file, content] of files) {
    const absolute = await ensureSafePath(target, file)
    const before = await maybeRead(absolute)
    const generatedIndex =
      file === indexFile &&
      previousText &&
      before !== null &&
      normalizeNewlines(before) === recipeIndex(previous.components)
    const action =
      before === null
        ? 'create'
        : normalizeNewlines(before) === normalizeNewlines(content)
          ? 'unchanged'
          : generatedIndex || recorded[file] === hash(before)
            ? 'update'
            : // An edited index would leave new recipes unregistered, so it stops the run.
              ownedFiles.has(file) && file !== indexFile
              ? 'customized'
              : 'conflict'
    if (action === 'conflict') conflicts.push(file)
    plan.push({ file, absolute, before, content, action })
  }
  const nextFiles = { ...recorded }
  for (const { file, content, action } of plan)
    if (action !== 'customized' && action !== 'conflict') nextFiles[file] = hash(content)
  // Record installed files this run did not touch once they match Kiso, for version 1 records.
  for (const file of ownedFiles) {
    if (files.has(file) || nextFiles[file]) continue
    const local = await maybeRead(await ensureSafePath(target, file))
    const source = await readSource(file).catch(() => null)
    if (local !== null && source !== null && normalizeNewlines(local) === normalizeNewlines(source))
      nextFiles[file] = hash(local)
  }
  const configConflicts = []
  let config
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
          : normalizeNewlines(before) === normalizeNewlines(content)
            ? 'unchanged'
            : 'update'
    config = { file, absolute: await ensureSafePath(target, file), before, content, action }
    plan.push(config)
  }
  const meta =
    JSON.stringify(
      {
        schemaVersion: metaVersion,
        components: installed,
        palettes,
        files: Object.fromEntries(Object.entries(nextFiles).sort(([a], [b]) => (a < b ? -1 : 1))),
      },
      null,
      2,
    ) + '\n'
  plan.push({
    file: '.kiso/installed.json',
    absolute: metaPath,
    before: previousText,
    content: meta,
    action: previousText === null ? 'create' : previousText === meta ? 'unchanged' : 'update',
  })
  const customized = plan.filter((p) => p.action === 'customized').map((p) => p.file)
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
  if (customized.length && !json)
    console.log(
      `\nYou changed ${customized.length} file(s) the CLI wrote; they were kept as is. Compare them with Kiso:\n  pnpm ui diff --target ${targetArg}`,
    )
  if (conflicts.length)
    throw new Error(
      `Existing files differ; nothing was written. Review these files manually:\n${conflicts.join('\n')}`,
    )
  if (configConflicts.length)
    throw new Error(
      `The Panda config cannot be merged safely; nothing was written:\n${configConflicts.map((c) => `  ${c}`).join('\n')}\nEdit it by hand (KISO-SETUP.md shows the full configuration) or rerun with --panda-config=overwrite.`,
    )
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
