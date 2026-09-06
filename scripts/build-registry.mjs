import { mkdir, writeFile } from 'node:fs/promises'
import { catalog, registryItem, foundationFiles, readSource } from './registry-lib.mjs'

const output = new URL('../public/r/', import.meta.url)
await mkdir(output, { recursive: true })
for (const entry of catalog) {
  const item = await registryItem(entry.id)
  await writeFile(new URL(`${entry.id}.json`, output), JSON.stringify(item, null, 2) + '\n')
}
await writeFile(
  new URL('foundation.json', output),
  JSON.stringify(
    {
      schemaVersion: 1,
      name: 'foundation',
      type: 'registry:theme',
      files: await Promise.all(
        foundationFiles.map(async (file) => ({ path: file, content: await readSource(file) })),
      ),
    },
    null,
    2,
  ) + '\n',
)
await writeFile(
  new URL('../registry.json', output),
  JSON.stringify(
    {
      schemaVersion: 1,
      name: 'kiso-ui',
      version: '0.1.0',
      description: 'Copy-ready React components with Base UI and Panda CSS.',
      items: catalog.map((entry) => ({
        name: entry.id,
        title: entry.name,
        category: entry.category,
        url: `r/${entry.id}.json`,
      })),
    },
    null,
    2,
  ) + '\n',
)
await writeFile(
  new URL('../llms.txt', output),
  `# Kiso UI\n\nOwned-source React 19 components using Base UI 1.8 and Panda CSS 1.12.\n\n- [Full reference](llms-full.txt)\n- [Machine-readable registry](registry.json)\n- [Foundation](r/foundation.json)\n\n## Components\n${catalog.map((entry) => `- [${entry.name}](r/${entry.id}.json): ${entry.description}`).join('\n')}\n`,
)
await writeFile(
  new URL('../llms-full.txt', output),
  `# Kiso UI — agent reference\n\n## Conventions\n- React 19 refs are passed as props. Keep Base UI render props, callbacks and keyboard semantics.\n- Styling is in local Panda defineRecipe / defineSlotRecipe files. Register recipes in Panda config.\n- Semantic colors live in src/theme/tokens.ts; conditions in src/theme/conditions.ts.\n- Use presence selectors such as [data-checked], not data-state=checked.\n- Set data-theme and data-accent on html so portaled components inherit the theme.\n- staticCss: ['*'] ensures dynamic variants have emitted CSS. Run panda codegen after recipe changes.\n- Pass className={css({...})} to override; utility layer follows recipes.\n- Do not erase Select/Combobox value generics with a non-generic wrapper.\n- Root styles are shared via React context, including across portals.\n- Use pnpm ui inspect NAME for source and dependency details.\n- Add with pnpm ui add NAME --target PATH; dry-run before writing.\n\n${catalog.map((entry) => `## ${entry.name}\n${entry.description}\nSource: src/components/ui/${entry.id}.tsx\nRecipe: ${entry.recipe ? `src/theme/recipes/${entry.recipe}.ts` : 'inline utilities'}\nParts: ${entry.anatomy.join(', ')}\nSizes: ${(entry.sizes ?? []).join(', ') || 'not applicable'}\nVariants: ${(entry.variants ?? []).join(', ') || 'see recipe'}\n${entry.note}\n`).join('\n')}\n`,
)
console.log(
  `Built ${catalog.length} component manifests, foundation, registry and agent references.`,
)
