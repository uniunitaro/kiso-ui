import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { catalog } from '../src/app/catalog.ts'
import { examples } from '../src/app/examples.ts'

export const sourceRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
export const recipeNames = {
  button: ['button'],
  input: ['input'],
  textarea: ['textarea'],
  badge: ['badge'],
  toggle: ['toggle', 'toggleGroup'],
  checkbox: ['checkbox'],
  switch: ['switchRecipe'],
  tabs: ['tabs'],
  accordion: ['accordion'],
  select: ['select'],
  dialog: ['dialog'],
  'alert-dialog': ['dialog'],
  popover: ['popover'],
  menu: ['menu'],
  field: ['field'],
  slider: ['slider'],
  'radio-group': ['radioGroup'],
  avatar: ['avatar'],
  progress: ['progress'],
  tooltip: ['tooltip'],
  card: ['card'],
  alert: ['alert'],
  'number-field': ['numberField'],
  combobox: ['combobox'],
  autocomplete: ['combobox'],
  toast: ['toast'],
  'scroll-area': ['scrollArea'],
  collapsible: ['collapsible'],
  fieldset: ['fieldset'],
  toolbar: ['toolbar'],
  drawer: ['drawer'],
  'otp-field': ['otpField'],
  'navigation-menu': ['navigationMenu'],
  'preview-card': ['popover'],
  'context-menu': ['menu'],
  meter: ['progress'],
  skeleton: ['skeleton'],
  kbd: ['kbd'],
  separator: ['separator'],
  form: ['form'],
  'checkbox-group': ['checkboxGroup'],
  menubar: ['menubar'],
  breadcrumb: ['breadcrumb'],
  pagination: ['pagination'],
  table: ['table'],
  'empty-state': ['emptyState'],
  spinner: ['spinner'],
  'button-group': ['buttonGroup'],
}
const componentDependencies = { pagination: ['button'], button: ['spinner'] }
export function resolveComponentIds(ids) {
  const result = new Set()
  function visit(id) {
    getEntry(id)
    if (result.has(id)) return
    result.add(id)
    for (const dependency of componentDependencies[id] ?? []) visit(dependency)
  }
  ids.forEach(visit)
  return [...result].sort()
}
export const singleRecipes = new Set([
  'skeleton',
  'kbd',
  'separator',
  'form',
  'checkboxGroup',
  'menubar',
  'textarea',
  'button',
  'input',
  'badge',
  'toggle',
  'toggleGroup',
  'spinner',
  'buttonGroup',
])
export const foundationFiles = [
  'src/theme/tokens.ts',
  'src/theme/base-colors.ts',
  'src/theme/shadows.ts',
  'src/theme/z-index.ts',
  'src/theme/park-source.json',
  'src/theme/PARK-UI-LICENSE',
  'src/theme/colors/index.ts',
  'src/theme/colors/amber.ts',
  'src/theme/colors/blue.ts',
  'src/theme/colors/bronze.ts',
  'src/theme/colors/brown.ts',
  'src/theme/colors/crimson.ts',
  'src/theme/colors/cyan.ts',
  'src/theme/colors/gold.ts',
  'src/theme/colors/grass.ts',
  'src/theme/colors/green.ts',
  'src/theme/colors/indigo.ts',
  'src/theme/colors/iris.ts',
  'src/theme/colors/jade.ts',
  'src/theme/colors/lime.ts',
  'src/theme/colors/mauve.ts',
  'src/theme/colors/mint.ts',
  'src/theme/colors/neutral.ts',
  'src/theme/colors/olive.ts',
  'src/theme/colors/orange.ts',
  'src/theme/colors/pink.ts',
  'src/theme/colors/plum.ts',
  'src/theme/colors/purple.ts',
  'src/theme/colors/red.ts',
  'src/theme/colors/ruby.ts',
  'src/theme/colors/sage.ts',
  'src/theme/colors/sand.ts',
  'src/theme/colors/sky.ts',
  'src/theme/colors/slate.ts',
  'src/theme/colors/teal.ts',
  'src/theme/colors/tomato.ts',
  'src/theme/colors/violet.ts',
  'src/theme/colors/yellow.ts',
  'src/theme/conditions.ts',
  'src/theme/global-css.ts',
  'src/theme/text-styles.ts',
  'src/theme/layer-styles.ts',
  'src/theme/keyframes.ts',
  'src/theme/shared.ts',
  'src/theme/global.css',
  'src/components/ui/style-context.tsx',
]

export function getEntry(id) {
  const entry = catalog.find((item) => item.id === id)
  if (!entry)
    throw new Error(`Unknown component: ${id}. Run "pnpm ui list" to see available names.`)
  return entry
}

export async function readSource(relative) {
  const absolute = path.resolve(sourceRoot, relative)
  if (!absolute.startsWith(sourceRoot + path.sep))
    throw new Error(`Invalid source path: ${relative}`)
  return readFile(absolute, 'utf8')
}

// Derive local dependencies from source imports, so helpers cannot silently be omitted.
export async function componentFiles(id) {
  const entry = getEntry(id)
  const pending = [
    `src/components/ui/${id}.tsx`,
    ...(entry.recipe ? [`src/theme/recipes/${entry.recipe}.ts`] : []),
  ]
  const files = new Set()
  while (pending.length) {
    const file = pending.pop()
    if (files.has(file)) continue
    files.add(file)
    const component = catalog.find((entry) => file === `src/components/ui/${entry.id}.tsx`)
    if (component?.recipe) pending.push(`src/theme/recipes/${component.recipe}.ts`)
    const source = await readSource(file)
    const relativeImports = [...source.matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)].map(
      (match) => match[1],
    )
    for (const specifier of relativeImports) {
      if (specifier.includes('styled-system')) continue
      const base = path.posix.normalize(path.posix.join(path.posix.dirname(file), specifier))
      if (!base.startsWith('src/'))
        throw new Error(`Dependency escapes src: ${specifier} in ${file}`)
      const candidates = [base, `${base}.tsx`, `${base}.ts`, `${base}/index.ts`]
      let found
      for (const candidate of candidates) {
        try {
          await readSource(candidate)
          found = candidate
          break
        } catch (error) {
          if (error.code !== 'ENOENT' && error.code !== 'EISDIR') throw error
        }
      }
      if (!found) throw new Error(`Unresolved dependency ${specifier} in ${file}`)
      pending.push(found)
    }
  }
  return [...files].sort()
}

export function recipeIndex(ids) {
  const files = new Map()
  const singles = new Set()
  const slots = new Set()
  for (const id of [...ids].sort()) {
    const entry = getEntry(id)
    for (const name of recipeNames[id] ?? []) {
      const names = files.get(entry.recipe) ?? new Set()
      names.add(name)
      files.set(entry.recipe, names)
      ;(singleRecipes.has(name) ? singles : slots).add(name)
    }
  }
  const imports = [...files.entries()]
    .sort()
    .map(([file, names]) => `import { ${[...names].sort().join(', ')} } from './${file}'`)
    .join('\n')
  return `// Generated by Kiso CLI. Edit individual recipe files; add components with the CLI.\n${imports}\n\n// prettier-ignore\nexport const recipes = { ${[...singles].sort().join(', ')} }\n// prettier-ignore\nexport const slotRecipes = { ${[...slots].sort().join(', ')} }\n`
}

export async function registryItem(id) {
  const entry = getEntry(id)
  const paths = await componentFiles(id)
  const contents = await Promise.all(
    paths.map(async (file) => ({ path: file, content: await readSource(file) })),
  )
  const needsBaseUi = contents.some((file) => file.content.includes("from '@base-ui/react/"))
  return {
    schemaVersion: 1,
    name: entry.id,
    title: entry.name,
    description: entry.description,
    type: 'registry:ui',
    category: entry.category,
    dependencies: ['react@^19', ...(needsBaseUi ? ['@base-ui/react@^1.8.0'] : [])],
    devDependencies: ['@pandacss/dev@^1.12.1'],
    registryDependencies: [
      'foundation',
      ...resolveComponentIds([id]).filter((dependency) => dependency !== id),
    ],
    exampleDependencies: [
      ...new Set(
        [...examples[id].matchAll(/from '\.\/components\/ui\/([^']+)'/g)].map((match) => match[1]),
      ),
    ],
    recipes: {
      file: entry.recipe ? `src/theme/recipes/${entry.recipe}.ts` : null,
      names: recipeNames[id] ?? [],
      kind: (recipeNames[id] ?? []).some((n) => singleRecipes.has(n)) ? 'recipes' : 'slotRecipes',
    },
    anatomy: entry.anatomy,
    note: entry.note,
    files: contents,
  }
}

export { catalog }
