import { useEffect, useState } from 'react'
import { Check, Copy, ArrowUpRight, Terminal, FileCode2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import * as Field from '../components/ui/field'
import * as Select from '../components/ui/select'
import { css, cx } from '../../styled-system/css'
import { paletteClass } from '../components/ui/style-context'
import { catalog, type ComponentEntry } from './catalog'
import { Demo, type DemoSize } from './demos'
import { examples } from './examples'
import { styles as s } from './styles'
import foundationCss from '../theme/global.css?raw'

const sourceFiles = import.meta.glob('../components/ui/*.{ts,tsx}', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>
const recipeFiles = import.meta.glob('../theme/recipes/*.ts', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>

export function CodeBlock({ code, title = 'example.tsx' }: { code: string; title?: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setStatus('copied')
      window.setTimeout(() => setStatus('idle'), 1800)
    } catch {
      setStatus('failed')
    }
  }
  return (
    <div className={s.code}>
      <div className={s.codeHead}>
        <span className={s.row}>
          <FileCode2 size={13} />
          {title}
        </span>
        <Button
          variant="plain"
          colorPalette="gray"
          size="xs"
          onClick={copy}
          aria-label={`Copy ${title}`}
        >
          {status === 'copied' ? <Check /> : <Copy />}
          {status === 'copied' ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <pre className={s.pre}>
        <code>{code}</code>
      </pre>
      {status === 'failed' && (
        <p role="status" className={css({ px: '4', pb: '3', fontSize: 'xs', color: 'fg.error' })}>
          Clipboard unavailable. Select and copy the code above.
        </p>
      )}
    </div>
  )
}

export function Choice({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <Field.Root>
      <Field.Label className={css({ fontSize: 'xs' })}>{label}</Field.Label>
      <Select.Root
        items={options.map((value) => ({ label: value, value }))}
        value={value}
        onValueChange={(v) => v && onChange(v)}
        size="sm"
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Icon>⌄</Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner sideOffset={5} alignItemWithTrigger={false}>
            <Select.Popup>
              <Select.List>
                {options.map((option) => (
                  <Select.Item key={option} value={option}>
                    <Select.ItemText>{option}</Select.ItemText>
                    <Select.ItemIndicator>✓</Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </Field.Root>
  )
}

export function ComponentPage({ entry }: { entry: ComponentEntry }) {
  const [size, setSize] = useState('md')
  const [variant, setVariant] = useState(entry.variants?.[0] ?? '')
  const [palette, setPalette] = useState('accent')
  const [orientation, setOrientation] = useState('horizontal')
  const [files, setFiles] = useState({ source: '', recipe: '' })
  const [loadError, setLoadError] = useState(false)
  useEffect(() => {
    let current = true
    Promise.all([
      sourceFiles[`../components/ui/${entry.id}.tsx`]?.() ?? '',
      entry.recipe ? (recipeFiles[`../theme/recipes/${entry.recipe}.ts`]?.() ?? '') : '',
    ])
      .then(([source, recipe]) => {
        if (current) setFiles({ source, recipe })
      })
      .catch(() => {
        if (current) setLoadError(true)
      })
    return () => {
      current = false
    }
  }, [entry.id, entry.recipe])
  const [codeTab, setCodeTab] = useState('Usage')
  const tabs = ['Usage', 'Source', ...(entry.recipe ? ['Recipe'] : [])]
  const { source, recipe } = files
  const content = codeTab === 'Usage' ? examples[entry.id] : codeTab === 'Source' ? source : recipe
  const exampleDependencies = [
    ...new Set([
      entry.id,
      ...[...examples[entry.id].matchAll(/from '\.\/components\/ui\/([^']+)'/g)].map(
        (match) => match[1],
      ),
    ]),
  ]
  return (
    <>
      <div className={s.eyebrow}>
        {entry.category}
        <span />
        Open source. Open possibilities.
      </div>
      <h1 className={s.pageTitle}>{entry.name}</h1>
      <p className={s.pageIntro}>{entry.description}</p>
      <div className={s.row}>
        <Badge>Panda CSS</Badge>
        {entry.base && <Badge colorPalette="gray">Base UI</Badge>}
        <Badge colorPalette="gray">React 19</Badge>
        {entry.base && (
          <a
            className={css({
              fontSize: 'xs',
              ml: 'auto',
              color: 'fg.muted',
              display: 'flex',
              alignItems: 'center',
              gap: '1',
            })}
            href={`https://base-ui.com/react/components/${entry.base}`}
            target="_blank"
            rel="noreferrer"
          >
            Behavior API
            <ArrowUpRight size={13} />
          </a>
        )}
      </div>
      <div className={s.detailGrid}>
        <div>
          <div className={s.preview}>
            {/* The chosen palette is inherited by every part rendered in place. */}
            <div className={cx(css({ width: 'full', maxWidth: '420px' }), paletteClass(palette))}>
              <Demo
                id={entry.id}
                size={size}
                variant={variant || undefined}
                palette={palette}
                orientation={orientation as 'horizontal' | 'vertical'}
              />
            </div>
          </div>
        </div>
        <aside className={css({ display: 'flex', flexDirection: 'column', gap: '5' })}>
          <div>
            <h2 className={s.title}>Make it yours</h2>
            <p className={css({ fontSize: '11px', color: 'fg.muted', mt: '1.5' })}>
              Live props. Real components.
            </p>
          </div>
          {entry.sizes && (
            <Choice label="Size" value={size} options={entry.sizes} onChange={setSize} />
          )}
          {['slider', 'tabs'].includes(entry.id) && (
            <Choice
              label="Orientation"
              value={orientation}
              options={['horizontal', 'vertical']}
              onChange={setOrientation}
            />
          )}
          {entry.palettes && (
            <Choice
              label="Color palette"
              value={palette}
              options={entry.palettes}
              onChange={setPalette}
            />
          )}
          {entry.variants && (
            <Choice
              label="Variant"
              value={variant}
              options={entry.variants}
              onChange={setVariant}
            />
          )}
          <div
            className={css({
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderColor: 'border',
              pt: '4',
              fontSize: '11px',
              lineHeight: '1.8',
              color: 'fg.muted',
            })}
          >
            Try the keyboard, too.
            <br />
            Tab to focus. Space or Enter to interact.
          </div>
        </aside>
      </div>
      <h2 className={s.docHeading}>Bring it into your project</h2>
      <CodeBlock
        title="Terminal · from this repository"
        code={`pnpm ui add ${exampleDependencies.join(' ')} --target ../your-app --dry-run\npnpm ui add ${exampleDependencies.join(' ')} --target ../your-app`}
      />
      <p className={css({ mt: '3', fontSize: 'xs', color: 'fg.muted' })}>
        First time?{' '}
        <a
          href="#/installation"
          className={css({ color: 'colorPalette.plain.fg', textDecoration: 'underline' })}
        >
          Set up the foundation
        </a>
        . The CLI copies the component, recipe, and shared dependencies. It never installs packages
        or overwrites existing files by default.
      </p>
      <h2 className={s.docHeading}>Read it. Change it. Own it.</h2>
      <div
        className={css({ display: 'flex', gap: '1', mb: '3' })}
        role="group"
        aria-label="Code view"
      >
        {tabs.map((tab) => (
          <Button
            key={tab}
            size="sm"
            variant={codeTab === tab ? 'subtle' : 'plain'}
            aria-pressed={codeTab === tab}
            onClick={() => setCodeTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>
      {codeTab !== 'Usage' && !content ? (
        <p role="status">
          {loadError
            ? 'Source could not be loaded. Reload the page to try again.'
            : 'Loading source…'}
        </p>
      ) : (
        <CodeBlock
          code={content ?? ''}
          title={codeTab === 'Recipe' ? `${entry.recipe}.recipe.ts` : `${entry.id}.tsx`}
        />
      )}
      <h2 className={s.docHeading}>The shape of the component</h2>
      <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '2' })}>
        {entry.anatomy.map((part) => (
          <code
            key={part}
            className={css({
              fontFamily: 'mono',
              fontSize: '11px',
              px: '2.5',
              py: '1.5',
              bg: 'gray.subtle.bg',
              borderRadius: 'l2',
              color: 'fg.muted',
            })}
          >
            {part}
          </code>
        ))}
      </div>
      <h2 className={s.docHeading}>A few thoughtful details</h2>
      <p className={s.prose}>{entry.note}</p>
      <table className={s.table}>
        <caption className={css({ srOnly: true })}>Styling API</caption>
        <thead>
          <tr>
            <th>Prop</th>
            <th>Values</th>
            <th>Where it belongs</th>
          </tr>
        </thead>
        <tbody>
          {entry.palettes && (
            <tr>
              <td>
                <code>colorPalette</code>
              </td>
              <td>{entry.palettes.join(' · ')}</td>
              <td>Standalone component</td>
            </tr>
          )}
          {entry.sizes && (
            <tr>
              <td>
                <code>size</code>
              </td>
              <td>{entry.sizes.join(' · ')}</td>
              <td>Root or standalone component</td>
            </tr>
          )}
          {entry.variants && (
            <tr>
              <td>
                <code>variant</code>
              </td>
              <td>{entry.variants.join(' · ')}</td>
              <td>Root or standalone component</td>
            </tr>
          )}
          <tr>
            <td>
              <code>className</code>
            </td>
            <td>CSS class; Base UI parts also accept a state callback</td>
            <td>Any rendered part</td>
          </tr>
          <tr>
            <td>
              <code>ref</code>
            </td>
            <td>React ref</td>
            <td>Any rendered part</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export function CatalogPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const filtered = catalog.filter(
    (entry) =>
      (category === 'All' || entry.category === category) &&
      `${entry.name} ${entry.description}`.toLowerCase().includes(query.toLowerCase()),
  )
  return (
    <>
      <div className={s.eyebrow}>
        <span />A good foundation is only the beginning.
      </div>
      <h1 className={s.pageTitle}>Small pieces. Endless possibilities.</h1>
      <p className={s.pageIntro}>
        A considered collection of {catalog.length} components. Accessible behavior, expressive
        recipes, and every line of source to make your own.
      </p>
      <div className={css({ display: 'flex', gap: '4', mb: '7', flexWrap: 'wrap' })}>
        <Input
          aria-label="Filter components"
          placeholder="Find your next building block…"
          value={query}
          onValueChange={setQuery}
          className={css({ maxWidth: '360px' })}
        />
        <div className={css({ minWidth: '170px' })}>
          <Select.Root
            items={['All', 'Actions', 'Forms', 'Feedback', 'Navigation', 'Overlays', 'Layout'].map(
              (value) => ({ label: value, value }),
            )}
            value={category}
            onValueChange={(v) => v && setCategory(v)}
          >
            <Select.Trigger aria-label="Filter by category">
              <Select.Value />
              <Select.Icon>⌄</Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner sideOffset={5} alignItemWithTrigger={false}>
                <Select.Popup>
                  {['All', 'Actions', 'Forms', 'Feedback', 'Navigation', 'Overlays', 'Layout'].map(
                    (value) => (
                      <Select.Item key={value} value={value}>
                        <Select.ItemText>{value}</Select.ItemText>
                      </Select.Item>
                    ),
                  )}
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>
      <div className={s.componentGrid}>
        {filtered.map((entry) => (
          <a href={`#/components/${entry.id}`} key={entry.id} className={s.catalogCard}>
            <div className={s.spread}>
              <h2 className={s.title}>{entry.name}</h2>
              <ArrowUpRight size={16} className={css({ color: 'fg.muted' })} />
            </div>
            <p
              className={css({
                color: 'fg.muted',
                fontSize: 'xs',
                lineHeight: '1.7',
                mt: '3',
                mb: '5',
                minHeight: '40px',
              })}
            >
              {entry.description}
            </p>
            <Badge colorPalette="gray">{entry.category}</Badge>
          </a>
        ))}
      </div>
      {!filtered.length && (
        <p className={s.empty}>No components found. Try another name or category.</p>
      )}
    </>
  )
}

export function InstallationPage() {
  return (
    <>
      <div className={s.eyebrow}>
        <Terminal size={13} />A few steps. A fresh start.
      </div>
      <h1 className={s.pageTitle}>Your code, from the first line.</h1>
      <p className={s.pageIntro}>
        Kiso is a source collection, not a component dependency. Start with React 19, TypeScript,
        and Panda CSS, then copy only what you need.
      </p>
      <h2 className={s.docHeading}>01 / Install the foundation</h2>
      <CodeBlock
        title="Terminal · your application"
        code="pnpm add @base-ui/react react react-dom\npnpm add -D @pandacss/dev\npnpm exec panda init --postcss"
      />
      <h2 className={s.docHeading}>02 / Copy your first components</h2>
      <p className={s.prose}>
        Run the local CLI from the Kiso repository. The dry run shows every file before writing. The
        foundation includes tokens, conditions, shared styles and an integration guide; existing
        Panda configuration stays yours.
      </p>
      <div className={css({ mt: '4' })}>
        <CodeBlock
          title="Terminal · Kiso repository"
          code="pnpm ui init --target ../your-app --dry-run\npnpm ui init --target ../your-app\npnpm ui add button input field --target ../your-app"
        />
      </div>
      <h2 className={s.docHeading}>03 / Register the local theme</h2>
      <CodeBlock
        title="panda.config.ts"
        code={`import { defineConfig } from '@pandacss/dev'\nimport { tokens, semanticColors, aliases, radii, removePandaPresetColors } from './src/theme/tokens'\nimport { shadows } from './src/theme/shadows'\nimport { iris } from './src/theme/colors/iris'\nimport { neutral } from './src/theme/colors/neutral'\nimport { blue } from './src/theme/colors/blue'\nimport { green } from './src/theme/colors/green'\nimport { amber } from './src/theme/colors/amber'\nimport { red } from './src/theme/colors/red'\nimport { conditions } from './src/theme/conditions'\nimport { globalCss } from './src/theme/global-css'\nimport { textStyles } from './src/theme/text-styles'\nimport { layerStyles } from './src/theme/layer-styles'\nimport { keyframes } from './src/theme/keyframes'\nimport { recipes, slotRecipes } from './src/theme/recipes'\n\nexport default defineConfig({\n  preflight: true,\n  jsxFramework: 'react',\n  include: ['./src/**/*.{ts,tsx}'],\n  outdir: 'styled-system',\n  conditions: { extend: conditions },\n  globalCss: { extend: globalCss },\n  theme: {\n    extend: {\n      tokens,\n      semanticTokens: {\n        colors: {\n          ...semanticColors,\n          // Only the palettes listed here exist. Add one: import it and list it.\n          iris,\n          blue,\n          green,\n          amber,\n          red,\n          gray: neutral,\n          ...aliases({ accent: iris, info: blue, success: green, warning: amber, danger: red }),\n        },\n        radii,\n        shadows,\n      },\n      textStyles,\n      layerStyles,\n      keyframes,\n      recipes,\n      slotRecipes,\n    },\n  },\n  plugins: [removePandaPresetColors],\n})`}
      />
      <h2 className={s.docHeading}>04 / Set up the page</h2>
      <p className={s.prose}>
        Import the copied src/theme/global.css in your application entry. It declares the cascade
        layers; page-level rules (canvas, text color, focus ring color, reduced motion) come from
        globalCss in the config above.
      </p>
      <CodeBlock title="src/theme/global.css" code={foundationCss} />
      <div className={css({ mt: '4' })}>
        <CodeBlock
          title="app.tsx"
          code={`import { Button } from './components/ui/button'\n\n// Set data-theme="light" or "dark" on <html>.\n// Every component inherits colorPalette="accent"; pass colorPalette to change one,\n// or set it on an ancestor to recolor everything inside.\n\nexport function App() {\n  return <Button variant="solid" size="md">Make something good</Button>\n}`}
        />
      </div>
      <h2 className={s.docHeading}>A note about generation</h2>
      <p className={s.prose}>
        Run <code>pnpm exec panda codegen</code> after adding a component or changing a recipe. Add
        it to your prepare script. Each recipe explicitly generates its variants, so values from
        props and agent-generated code work consistently. Keep the generated{' '}
        <code>styled-system</code> directory out of version control.
      </p>
    </>
  )
}

export function PrinciplesPage() {
  return (
    <>
      <div className={s.eyebrow}>
        <span />
        Built with intention.
      </div>
      <h1 className={s.pageTitle}>A foundation, not a ceiling.</h1>
      <p className={s.pageIntro}>
        Good tools give you somewhere to start and the freedom to go somewhere new. That’s the idea
        behind Kiso.
      </p>
      {[
        [
          '01 / Own the last mile',
          'Copy the source and its recipe. There is no private preset, component package, or layer of overrides between you and the result. A component is a small file you can understand.',
        ],
        [
          '02 / Keep behavior where it belongs',
          'Base UI owns interactions, focus management and accessibility semantics. Thin React wrappers add Panda recipe classes without replacing render props or state callbacks. Generic value components keep their type inference.',
        ],
        [
          '03 / Give design a shared language',
          'Semantic tokens describe intent: surface, muted text, accent, danger. Recipes describe component anatomy. Variants describe appearance; size describes scale. Change one layer without untangling all three.',
        ],
        [
          '04 / Make the code easy to reason about',
          'An explicit registry records files and dependencies. Examples are short and complete. Components use the same structure. Both people and coding agents can find the right edit without guessing.',
        ],
        [
          '05 / Treat the preview as a workbench',
          'Try a keyboard, switch a theme, change a size, and inspect the source. The showcase uses the actual components. Improvements belong in recipes, not in one-off demo overrides.',
        ],
      ].map(([title, body]) => (
        <section key={title}>
          <h2 className={s.docHeading}>{title}</h2>
          <p className={s.prose}>{body}</p>
        </section>
      ))}
      <h2 className={s.docHeading}>Standing on good foundations</h2>
      <p className={s.prose}>
        Kiso is an original design built with{' '}
        <a href="https://base-ui.com/react/overview/quick-start" target="_blank" rel="noreferrer">
          Base UI
        </a>{' '}
        and{' '}
        <a href="https://panda-css.com/docs/concepts/slot-recipes" target="_blank" rel="noreferrer">
          Panda CSS
        </a>
        .{' '}
        <a href="https://park-ui.com/docs/introduction" target="_blank" rel="noreferrer">
          Park UI
        </a>{' '}
        informed the editable recipe approach; its visual design and Ark UI wrappers are not copied.
      </p>
    </>
  )
}
