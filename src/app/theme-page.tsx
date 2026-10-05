import type { Dispatch, SetStateAction } from 'react'
import { ArrowUpRight, Check, Moon, Sun, RotateCcw } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import * as Card from '../components/ui/card'
import { Input } from '../components/ui/input'
import * as Field from '../components/ui/field'
import * as Switch from '../components/ui/switch'
import { css } from '../../styled-system/css'
import { CodeBlock, Choice } from './docs'
import * as Checkbox from '../components/ui/checkbox'
import { accentNames, grayNames, radiusLevels, radiusNames } from './palettes'
import { importLines, importedPalettes, paletteEntries } from './panda-config-template'
import { styles as s } from './styles'

export type ThemeSettings = {
  mode: 'light' | 'dark'
  accent: (typeof accentNames)[number]
  gray: (typeof grayNames)[number]
  radius: string
}
export const defaultTheme: ThemeSettings = {
  mode: 'light',
  accent: 'iris',
  gray: 'neutral',
  radius: 'xl',
}
export const accents = Object.fromEntries(
  accentNames.map((name) => [name, `var(--colors-${name}-9)`]),
)

export function ThemePage({
  theme,
  setTheme,
}: {
  theme: ThemeSettings
  setTheme: Dispatch<SetStateAction<ThemeSettings>>
}) {
  return (
    <>
      <div className={s.eyebrow}>
        <span />
        Same foundation. Your expression.
      </div>
      <h1 className={s.pageTitle}>Make yourself at home.</h1>
      <p className={s.pageIntro}>
        A few intentional choices can change the whole feeling. Explore your theme here, then take
        it back to your project.
      </p>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', xl: '260px minmax(0,1fr)' },
          gap: '7',
        })}
      >
        <div className={s.specimen}>
          <div className={s.specimenBody}>
            <div className={s.spread}>
              <h2 className={s.title}>Your foundation</h2>
              <Button
                variant="plain"
                colorPalette="gray"
                size="xs"
                square
                aria-label="Reset theme"
                onClick={() => setTheme(defaultTheme)}
              >
                <RotateCcw />
              </Button>
            </div>
            <div className={css({ mt: '6', display: 'flex', flexDirection: 'column', gap: '6' })}>
              <div>
                <p className={css({ fontSize: 'xs', fontWeight: 'medium', mb: '3' })}>Appearance</p>
                <div className={s.row}>
                  {(['light', 'dark'] as const).map((mode) => (
                    <Button
                      key={mode}
                      size="sm"
                      variant={theme.mode === mode ? 'subtle' : 'outline'}
                      aria-pressed={theme.mode === mode}
                      onClick={() => setTheme((prev) => ({ ...prev, mode }))}
                    >
                      {mode === 'light' ? <Sun /> : <Moon />}
                      {mode === 'light' ? 'Light' : 'Dark'}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <p className={css({ fontSize: 'xs', fontWeight: 'medium', mb: '3' })}>
                  Accent color
                </p>
                <div className={s.row}>
                  {Object.entries(accents).map(([name, color]) => (
                    <button
                      key={name}
                      type="button"
                      aria-label={`${name} accent`}
                      aria-pressed={theme.accent === name}
                      onClick={() =>
                        setTheme((prev) => ({ ...prev, accent: name as ThemeSettings['accent'] }))
                      }
                      style={{ background: color }}
                      className={css({
                        display: 'grid',
                        placeItems: 'center',
                        w: '9',
                        h: '9',
                        borderRadius: 'full',
                        color: 'white',
                        outlineOffset: '3px',
                        '&[aria-pressed=true]': { outline: '1px solid', outlineColor: 'fg.subtle' },
                        _focusVisible: {
                          outline: '2px solid',
                          outlineColor: 'colorPalette.solid.bg',
                        },
                      })}
                    >
                      {theme.accent === name && <Check size={15} />}
                    </button>
                  ))}
                </div>
                <p
                  className={css({
                    fontSize: '11px',
                    color: 'fg.muted',
                    mt: '3',
                    textTransform: 'capitalize',
                  })}
                >
                  {theme.accent} · 12 shades, light and dark.
                </p>
              </div>
              <Choice
                label="Gray palette"
                value={theme.gray}
                options={[...grayNames]}
                onChange={(gray) =>
                  setTheme((prev) => ({ ...prev, gray: gray as ThemeSettings['gray'] }))
                }
              />
              <Choice
                label="Corner radius"
                value={theme.radius}
                options={[...radiusNames]}
                onChange={(radius) => setTheme((prev) => ({ ...prev, radius }))}
              />
            </div>
          </div>
        </div>
        <div className={s.preview}>
          <Card.Root className={css({ width: 'full', maxWidth: '380px' })}>
            <Card.Header>
              <Badge>Your space</Badge>
              <Card.Title className={css({ fontSize: 'xl', mt: '4' })}>
                Something that feels like you.
              </Card.Title>
              <Card.Description>The same components. A different point of view.</Card.Description>
            </Card.Header>
            <Card.Body>
              <div className={s.stack}>
                <Field.Root>
                  <Field.Label>Project name</Field.Label>
                  <Input defaultValue="A fresh perspective" />
                </Field.Root>
                <Switch.Label className={s.spread}>
                  <span className={s.small}>Keep the good ideas coming</span>
                  <Switch.Root defaultChecked>
                    <Switch.Thumb />
                  </Switch.Root>
                </Switch.Label>
              </div>
            </Card.Body>
            <Card.Footer>
              <Button
                className={css({ flex: 1 })}
                render={<a href="#/components" />}
                nativeButton={false}
              >
                Explore components
                <ArrowUpRight />
              </Button>
            </Card.Footer>
          </Card.Root>
        </div>
      </div>
      <h2 className={s.docHeading}>Sizes that line up</h2>
      <p className={s.prose}>
        Primary controls: 32, 36, 40, 44, 48 and 64px. Supporting controls: 16, 18, 20, 22, 24 and
        32px.
      </p>
      <div className={css({ display: 'flex', flexDirection: 'column', gap: '4', mt: '5' })}>
        {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size, index) => (
          <div
            key={size}
            className={css({ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4' })}
          >
            <span className={css({ w: '12', fontFamily: 'mono', fontSize: 'xs' })}>{size}</span>
            <Button size={size}>Button</Button>
            <Input
              size={size}
              aria-label={size + ' size input'}
              placeholder={[32, 36, 40, 44, 48, 64][index] + 'px'}
              className={css({ w: '40' })}
            />
            <Checkbox.Root size={size} defaultChecked aria-label={size + ' checkbox'}>
              <Checkbox.Indicator />
            </Checkbox.Root>
            <Switch.Root size={size} defaultChecked aria-label={size + ' switch'}>
              <Switch.Thumb />
            </Switch.Root>
          </div>
        ))}
      </div>
      <h2 className={s.docHeading}>Variants & interaction colors</h2>
      <p className={s.prose}>
        Each palette owns its backgrounds, foregrounds, borders and interaction colors.
      </p>
      <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '3', mt: '5' })}>
        {(['solid', 'subtle', 'surface', 'outline', 'plain'] as const).map((variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
      </div>
      <h2 className={s.docHeading}>Nested radii</h2>
      <div className={css({ p: '4', bg: 'gray.3', borderRadius: 'l3', maxW: 'sm' })}>
        <div className={css({ p: '4', bg: 'gray.5', borderRadius: 'l2' })}>
          <div className={css({ p: '4', bg: 'gray.surface.bg', borderRadius: 'l1' })}>
            l3 → l2 → l1
          </div>
        </div>
      </div>
      <h2 className={s.docHeading}>Shadows</h2>
      <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '6', py: '5' })}>
        {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((shadow) => (
          <div
            key={shadow}
            style={{ boxShadow: 'var(--shadows-' + shadow + ')' }}
            className={css({ p: '6', bg: 'gray.surface.bg', borderRadius: 'l2' })}
          >
            {shadow}
          </div>
        ))}
      </div>
      <h2 className={s.docHeading}>Stacking order</h2>
      <p className={s.prose}>
        dropdown 1000 · sticky 1100 · banner 1200 · overlay 1300 · modal 1400 · popover 1500 ·
        skipLink 1600 · toast 1700 · tooltip 1800
      </p>
      <h2 className={s.docHeading}>A shared language for your interface</h2>
      <p className={s.prose}>
        Components use semantic roles, so your theme stays coherent as the collection grows. Accent
        colors are independent of status colors. Both appearances have explicit token values.
      </p>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: 'repeat(2,1fr)', md: 'repeat(4,1fr)', xl: 'repeat(8,1fr)' },
          gap: '3',
          mt: '5',
        })}
      >
        {[
          'canvas',
          'gray.surface.bg',
          'gray.subtle.bg',
          'fg.default',
          'fg.muted',
          'border',
          'accent.solid.bg',
          'accent.subtle.bg',
        ].map((token) => (
          <div key={token} className={s.specimen}>
            <div
              style={{ background: `var(--colors-${token.replaceAll('.', '-')})` }}
              className={css({
                h: '16',
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                borderColor: 'border',
              })}
            />
            <p
              className={css({
                fontSize: '10px',
                fontFamily: 'mono',
                px: '2',
                py: '3',
                color: 'fg.muted',
              })}
            >
              {token}
            </p>
          </div>
        ))}
      </div>
      <h2 className={s.docHeading}>Take this feeling with you</h2>
      <CodeBlock
        title="Terminal · Kiso repository"
        code={`pnpm ui init --target ../your-app --accent=${theme.accent} --gray=${theme.gray}`}
      />
      <div className={css({ mt: '4' })}>
        <CodeBlock
          title="panda.config.ts · theme settings"
          code={`${importLines(['semanticColors', 'definePalette', ...importedPalettes(theme)]).join('\n')}\n\n// defineConfig > theme.extend.semanticTokens\ncolors: {\n  ...semanticColors,\n${paletteEntries(
            theme,
          )
            .map((entry) => `  ${entry},`)
            .join(
              '\n',
            )}\n},\nradii: { l1: { value: '${radiusLevels[theme.radius][0]}px' }, l2: { value: '${radiusLevels[theme.radius][1]}px' }, l3: { value: '${radiusLevels[theme.radius][2]}px' } },\n\n// <Button colorPalette="danger" variant="surface">Remove</Button>\n// <div className={css({ colorPalette: 'success' })}>…</div>`}
        />
      </div>
      <h2 className={s.docHeading}>Go a little deeper</h2>
      <p className={s.prose}>
        Edit <code>src/theme/tokens.ts</code> to change semantic colors, fonts or corner
        relationships. Edit a component’s recipe to add a variant or change its proportions. Use
        Panda’s <code>css()</code> with <code>className</code> for a local adjustment; utility
        classes override recipe defaults through cascade layers.
      </p>
    </>
  )
}
