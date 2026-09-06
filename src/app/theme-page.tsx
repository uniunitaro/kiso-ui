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
import { styles as s } from './styles'

export type ThemeSettings = {
  mode: 'light' | 'dark'
  accent: 'iris' | 'ocean' | 'forest'
  radius: string
}
export const defaultTheme: ThemeSettings = { mode: 'light', accent: 'iris', radius: '8' }
export const accents = { iris: '#5b4ed6', ocean: '#1769b3', forest: '#23774d' }

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
                variant="ghost"
                colorPalette="neutral"
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
                        borderRadius: 'pill',
                        color: 'white',
                        outlineOffset: '3px',
                        '&[aria-pressed=true]': { outline: '1px solid', outlineColor: 'fg.subtle' },
                        _focusVisible: { outline: '2px solid', outlineColor: 'accent' },
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
                  {theme.accent} · deliberate, never loud.
                </p>
              </div>
              <Choice
                label="Corner radius"
                value={theme.radius}
                options={['0', '4', '8', '12', '16']}
                onChange={(radius) => setTheme((prev) => ({ ...prev, radius }))}
              />
            </div>
          </div>
        </div>
        <div className={s.preview}>
          <Card.Root className={css({ width: 'full', maxWidth: '380px' })}>
            <Card.Header>
              <Badge tone="accent">Your space</Badge>
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
                <label className={s.spread}>
                  <span className={s.small}>Keep the good ideas coming</span>
                  <Switch.Root defaultChecked>
                    <Switch.Thumb />
                  </Switch.Root>
                </label>
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
          'surface',
          'surface.subtle',
          'fg',
          'fg.muted',
          'border',
          'accent',
          'accent.subtle',
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
        title="index.html · theme settings"
        code={`<html\n  data-theme="${theme.mode}"\n  data-accent="${theme.accent}"\n  style="--kiso-radius: ${theme.radius}px"\n>\n  <!-- Your app goes here. Portals inherit this theme too. -->\n</html>`}
      />
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
