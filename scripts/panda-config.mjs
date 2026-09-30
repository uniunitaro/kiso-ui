import { Node, Project, SyntaxKind } from 'ts-morph'
import { accentNames, grayNames } from '../src/app/palettes.ts'
import {
  defaultPalettes,
  importLines,
  importOrder,
  importedPalettes,
  moduleOf,
  paletteEntries,
  pandaConfigTemplate,
} from '../src/app/panda-config-template.ts'

export { defaultPalettes, pandaConfigTemplate }

export const pandaConfigModes = ['keep', 'merge', 'overwrite']

export function checkPalettes({ accent, gray }) {
  if (!accentNames.includes(accent))
    throw new Error(`Unknown accent: ${accent}. Choose from ${accentNames.join(', ')}.`)
  if (!grayNames.includes(gray))
    throw new Error(`Unknown gray: ${gray}. Choose from ${grayNames.join(', ')}.`)
}

function unwrap(node) {
  while (
    node &&
    (Node.isParenthesizedExpression(node) ||
      Node.isAsExpression(node) ||
      Node.isSatisfiesExpression(node))
  )
    node = node.getExpression()
  return node
}

function findConfigObject(file) {
  let node = unwrap(file.getExportAssignment((e) => !e.isExportEquals())?.getExpression())
  if (Node.isIdentifier(node))
    node = unwrap(file.getVariableDeclaration(node.getText())?.getInitializer())
  if (Node.isCallExpression(node)) node = unwrap(node.getArguments()[0])
  return Node.isObjectLiteralExpression(node) ? node : null
}

const valueOf = (property) =>
  Node.isShorthandPropertyAssignment(property)
    ? property.getNameNode()
    : Node.isPropertyAssignment(property)
      ? property.getInitializer()
      : null

const refersTo = (node, name) =>
  (Node.isIdentifier(node) && node.getText() === name) ||
  node.getDescendantsOfKind(SyntaxKind.Identifier).some((id) => id.getText() === name)

const isEmptyObject = (node) =>
  Node.isObjectLiteralExpression(node) && node.getProperties().length === 0

// What Kiso needs in the config. provide: an identifier Kiso exports; spread lets it go first
// into an existing flat map so the user's entries still win.
const provide = (name, spread = true) => ({ kind: 'provide', name, spread })
const object = (entries) => ({ kind: 'object', entries: Object.entries(entries) })
const kisoConfig = object({
  preflight: { kind: 'literal', text: 'true' },
  jsxFramework: { kind: 'literal', text: "'react'", required: true },
  include: { kind: 'literal', text: "['./src/**/*.{ts,tsx}']" },
  outdir: { kind: 'literal', text: "'styled-system'", required: true },
  conditions: object({ extend: provide('conditions') }),
  globalCss: object({ extend: provide('globalCss') }),
  theme: object({
    extend: object({
      // Token groups nest, so a spread could silently replace a whole Kiso group.
      tokens: provide('tokens', false),
      semanticTokens: object({
        colors: { kind: 'colors' },
        radii: provide('radii'),
        shadows: provide('shadows'),
      }),
      textStyles: provide('textStyles'),
      layerStyles: provide('layerStyles'),
      keyframes: provide('keyframes'),
      recipes: provide('recipes'),
      slotRecipes: provide('slotRecipes'),
    }),
  }),
  plugins: { kind: 'plugins' },
})

/**
 * Adds Kiso to an existing panda.config.ts without dropping what is there: what the user set
 * wins, and anything Kiso cannot add safely comes back as a conflict (write nothing then).
 * Additions are spliced into the original text, following its indentation, quotes and commas.
 */
export function mergePandaConfig(source, palettes = defaultPalettes) {
  const file = new Project({ useInMemoryFileSystem: true }).createSourceFile('c.ts', source)
  const config = findConfigObject(file)
  if (!config)
    return {
      content: source,
      conflicts: ['expected export default defineConfig({ ... }) or an object literal.'],
    }
  const nl = source.includes('\r\n') ? '\r\n' : '\n'
  const quote = /^import .* from "/m.test(source) ? '"' : "'"
  const semi = /^import .*;\s*$/m.test(source) ? ';' : ''
  const conflicts = []
  const used = new Set()
  const edits = []
  const replace = (node, text) =>
    edits.push({ at: node.getStart(), remove: node.getEnd() - node.getStart(), text })
  const insert = (at, text) => edits.push({ at, remove: 0, text })

  const lineIndent = (node) => {
    const start = source.lastIndexOf('\n', node.getStart() - 1) + 1
    return source.slice(start).match(/^[ \t]*/)[0]
  }
  const multiline = (node) => node.getText().includes('\n')
  // The step between an object's line and its entries, from the nearest object that shows it.
  function unitOf(node) {
    for (const o of [node, ...node.getAncestors()]) {
      const first = Node.isObjectLiteralExpression(o) && multiline(o) && o.getProperties()[0]
      if (!first) continue
      const outer = lineIndent(o)
      const inner = lineIndent(first)
      if (inner.length > outer.length && inner.startsWith(outer)) return inner.slice(outer.length)
    }
    return '  '
  }
  const trailingComma = (container, last) =>
    source.slice(last.getEnd(), container.getEnd() - 1).includes(',')
  const lastProperty = config.getProperties().at(-1)
  const comma = !lastProperty || trailingComma(config, lastProperty) ? ',' : ''

  function entry(key, spec, indent, unit) {
    if (spec.kind === 'literal') return `${key}: ${spec.text.replaceAll("'", quote)}`
    if (spec.kind === 'provide') {
      used.add(spec.name)
      return key === spec.name ? key : `${key}: ${spec.name}`
    }
    if (spec.kind === 'plugins') {
      used.add('removePandaPresetColors')
      return `${key}: [removePandaPresetColors]`
    }
    return `${key}: ${block(spec, indent, unit)}`
  }
  function block(spec, indent, unit) {
    let lines
    if (spec.kind === 'colors') {
      for (const name of ['semanticColors', 'definePalette', ...importedPalettes(palettes)])
        used.add(name)
      lines = ['...semanticColors', ...paletteEntries(palettes, quote)]
    } else {
      lines = spec.entries.map(([key, child]) => entry(key, child, indent + unit, unit))
      if (lines.length === 1 && !lines[0].includes('\n')) return `{ ${lines[0]} }`
    }
    const body = lines.map(
      (line, i) => `${indent}${unit}${line}${i < lines.length - 1 ? ',' : comma}`,
    )
    return `{${nl}${body.join(nl)}${nl}${indent}}`
  }
  const fill = (node, spec) => replace(node, block(spec, lineIndent(node), unitOf(node)))

  // Adds items after the last one of an object or array, on their own lines when it has them.
  function append(container, items, texts) {
    const last = items.at(-1)
    if (!multiline(container)) return insert(last.getEnd(), texts.map((t) => `, ${t}`).join(''))
    const indent = lineIndent(last)
    if (trailingComma(container, last))
      insert(
        source.indexOf(',', last.getEnd()) + 1,
        texts.map((t) => `${nl}${indent}${t},`).join(''),
      )
    else insert(last.getEnd(), texts.map((t) => `,${nl}${indent}${t}`).join(''))
  }

  function merge(target, spec, path) {
    const missing = []
    for (const [key, want] of spec.entries) {
      const property = target.getProperty(key)
      const value = property && valueOf(property)
      const where = path + key
      if (!property) missing.push([key, want])
      else if (want.kind === 'literal') {
        if (want.required && value?.getText().replaceAll('"', "'") !== want.text)
          conflicts.push(`${where}: Kiso needs ${want.text}.`)
      } else if (want.kind === 'object') {
        if (!Node.isObjectLiteralExpression(value))
          conflicts.push(`${where}: expected an object literal.`)
        else if (isEmptyObject(value)) fill(value, want)
        else merge(value, want, `${where}.`)
      } else if (want.kind === 'provide') {
        if (refersTo(value, want.name)) continue
        if (isEmptyObject(value)) replace(property, entry(key, want))
        else if (want.spread && Node.isObjectLiteralExpression(value)) {
          used.add(want.name)
          const first = value.getProperties()[0]
          insert(
            first.getStart(),
            multiline(value) ? `...${want.name},${nl}${lineIndent(first)}` : `...${want.name}, `,
          )
        } else conflicts.push(`${where}: already set; add ${want.name} from Kiso by hand.`)
      } else if (want.kind === 'colors') {
        if (isEmptyObject(value)) fill(value, want)
        else if (!refersTo(value, 'semanticColors'))
          conflicts.push(
            `${where}: already set; add ...semanticColors, gray and the roles (accent: definePalette('accent', iris), …) by hand.`,
          )
      } else if (!Node.isArrayLiteralExpression(value))
        conflicts.push(`${where}: expected an array literal.`)
      else if (!refersTo(value, 'removePandaPresetColors')) {
        used.add('removePandaPresetColors')
        const elements = value.getElements()
        if (elements.length) append(value, elements, ['removePandaPresetColors'])
        else replace(value, '[removePandaPresetColors]')
      }
    }
    if (!missing.length) return
    const props = target.getProperties()
    if (!props.length) return fill(target, { kind: 'object', entries: missing })
    const indent = multiline(target) ? lineIndent(props.at(-1)) : lineIndent(target)
    const unit = unitOf(target)
    append(
      target,
      props,
      missing.map(([key, want]) => entry(key, want, indent, unit)),
    )
  }
  merge(config, kisoConfig, '')

  const declarations = file.getImportDeclarations()
  const added = []
  for (const name of importOrder(palettes).filter((name) => used.has(name))) {
    const bound = (d) =>
      [
        d.getDefaultImport(),
        d.getNamespaceImport(),
        ...d.getNamedImports().map((n) => n.getAliasNode() ?? n.getNameNode()),
      ].some((node) => node?.getText() === name)
    const kiso = declarations.find((d) => d.getModuleSpecifierValue() === moduleOf(name))
    if (kiso && bound(kiso)) continue
    if (declarations.some(bound) || file.getVariableDeclaration(name) || file.getFunction(name))
      conflicts.push(`${name}: the name is already used in panda.config.ts.`)
    else added.push(name)
  }
  if (added.length) {
    const last = declarations.at(-1)
    const lines = importLines(added, { quote, semi }).join(nl)
    insert(last ? last.getEnd() : 0, last ? nl + lines : lines + nl)
  }
  let content = source
  for (const { at, remove, text } of edits.sort((a, b) => b.at - a.at))
    content = content.slice(0, at) + text + content.slice(at + remove)
  return { content, conflicts }
}
