import { QaPage } from './qa-page'
import { useEffect, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Box,
  ChevronRight,
  Code2,
  Component,
  Layers,
  Moon,
  Search,
  SlidersHorizontal,
  Sun,
  Terminal,
} from 'lucide-react'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import * as Dialog from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Kbd } from '../components/ui/kbd'
import * as Select from '../components/ui/select'
import { css } from '../../styled-system/css'
import { catalog, categories } from './catalog'
import { CatalogPage, ComponentPage, InstallationPage, PrinciplesPage } from './docs'
import { Overview } from './demos'
import { ThemePage, defaultTheme, type ThemeSettings } from './theme-page'
import { styles as s } from './styles'

function readTheme(): ThemeSettings {
  try {
    const parsed = JSON.parse(localStorage.getItem('kiso-theme') || 'null')
    if (
      parsed &&
      ['light', 'dark'].includes(parsed.mode) &&
      ['iris', 'ocean', 'forest'].includes(parsed.accent) &&
      ['0', '4', '8', '12', '16'].includes(parsed.radius)
    )
      return parsed
  } catch {
    /* A preview works even when storage is blocked. */
  }
  return defaultTheme
}
function path() {
  return window.location.hash.replace(/^#/, '') || '/'
}
const links = [
  { path: '/', title: 'Overview', icon: Box },
  { path: '/principles', title: 'Introduction', icon: BookOpen },
  { path: '/installation', title: 'Installation', icon: Terminal },
  { path: '/theming', title: 'Theming', icon: SlidersHorizontal },
  { path: '/components', title: 'All components', icon: Component },
  { path: '/quality', title: 'Quality checks', icon: Code2 },
]

export function App() {
  const [route, setRoute] = useState(path)
  const [theme, setTheme] = useState<ThemeSettings>(readTheme)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  useEffect(() => {
    const update = () => {
      setRoute(path())
      window.scrollTo({ top: 0 })
      setSearchOpen(false)
    }
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])
  useEffect(() => {
    document.documentElement.dataset.theme = theme.mode
    document.documentElement.dataset.accent = theme.accent
    document.documentElement.style.setProperty('--kiso-radius', `${theme.radius}px`)
    try {
      localStorage.setItem('kiso-theme', JSON.stringify(theme))
    } catch {
      /* Nonessential persistence. */
    }
  }, [theme])
  useEffect(() => {
    function key(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen((open) => !open)
        setQuery('')
      }
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [])
  const entry = route.startsWith('/components/')
    ? catalog.find((item) => item.id === route.split('/')[2])
    : undefined
  const pageName =
    entry?.name ??
    {
      '/': 'Overview',
      '/components': 'Components',
      '/installation': 'Installation',
      '/theming': 'Theming',
      '/principles': 'Introduction',
      '/quality': 'Quality checks',
    }[route] ??
    'Not found'
  useEffect(() => {
    document.title = `${pageName} — Kiso UI`
  }, [pageName])
  const results = catalog.filter((item) =>
    `${item.name} ${item.category}`.toLowerCase().includes(query.toLowerCase()),
  )
  return (
    <div className={s.layout}>
      <a
        href="#main-content"
        onClick={(event) => {
          event.preventDefault()
          document.getElementById('main-content')?.focus()
        }}
        className={css({
          srOnly: true,
          _focus: {
            srOnly: false,
            position: 'fixed',
            top: '3',
            left: '3',
            zIndex: 100,
            bg: 'surface',
            p: '3',
            border: '2px solid',
            borderColor: 'accent',
            borderRadius: 'control',
          },
        })}
      >
        Skip to content
      </a>
      <aside className={s.sidebar}>
        <div className={s.sidebarTop}>
          <a className={s.brand} href="#/" aria-label="Kiso UI home">
            <span className={s.brandMark}>✳</span>kiso
            <span
              className={css({
                fontSize: '11px',
                letterSpacing: '0',
                color: 'fg.subtle',
                fontWeight: 'normal',
                ml: '1',
              })}
            >
              / ui
            </span>
          </a>
          <button
            className={s.search}
            onClick={() => {
              setSearchOpen(true)
              setQuery('')
            }}
          >
            <Search />
            Find a component
            <span className={css({ ml: 'auto' })}>
              <Kbd>⌘K</Kbd>
            </span>
          </button>
        </div>
        <nav className={s.sidebarNav} aria-label="Documentation">
          <p className={s.navLabel}>Start here</p>
          {links.map((link) => (
            <a
              key={link.path}
              href={`#${link.path}`}
              className={s.navLink}
              aria-current={route === link.path ? 'page' : undefined}
            >
              <link.icon />
              {link.title}
              {link.path === '/components' && (
                <span
                  className={css({
                    ml: 'auto',
                    fontFamily: 'mono',
                    fontSize: '10px',
                    color: 'fg.subtle',
                  })}
                >
                  {catalog.length}
                </span>
              )}
            </a>
          ))}
          {categories.map((category) => (
            <div key={category}>
              <p className={s.navLabel}>{category}</p>
              {catalog
                .filter((item) => item.category === category)
                .map((item) => (
                  <a
                    key={item.id}
                    href={`#/components/${item.id}`}
                    className={s.navLink}
                    aria-current={entry?.id === item.id ? 'page' : undefined}
                  >
                    {item.name}
                  </a>
                ))}
            </div>
          ))}
        </nav>
        <div className={s.sidebarFoot}>
          <span
            className={css({ width: '1.5', height: '1.5', borderRadius: 'pill', bg: 'success' })}
          />
          <span>Thoughtfully made. Openly yours.</span>
        </div>
      </aside>
      <div className={s.content}>
        <header className={s.topbar}>
          <a
            href="#/"
            aria-label="Kiso UI home"
            className={css({
              display: { base: 'block', sm: 'none' },
              fontWeight: 'semibold',
              fontSize: 'lg',
              letterSpacing: '-.05em',
              textDecoration: 'none',
            })}
          >
            kiso
          </a>
          <div className={s.breadcrumb}>
            <Layers size={15} />
            <span className={css({ display: { base: 'none', sm: 'inline' } })}>
              The component collection
            </span>
            <ChevronRight />
            <span className={css({ color: 'fg' })}>{pageName}</span>
          </div>
          <div className={s.topActions}>
            <div className={s.mobileNav}>
              <Select.Root
                value={entry ? '/components' : route}
                items={links.map((link) => ({ value: link.path, label: link.title }))}
                onValueChange={(value) => {
                  if (value) window.location.hash = value
                }}
                size="sm"
              >
                <Select.Trigger aria-label="Navigate documentation">
                  <Select.Value placeholder="Navigate" />
                  <Select.Icon>⌄</Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Positioner sideOffset={5} alignItemWithTrigger={false}>
                    <Select.Popup>
                      {links.map((link) => (
                        <Select.Item value={link.path} key={link.path}>
                          <Select.ItemText>{link.title}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Popup>
                  </Select.Positioner>
                </Select.Portal>
              </Select.Root>
            </div>
            <a
              href="#/principles"
              className={css({
                display: { base: 'none', md: 'inline-flex' },
                fontSize: '11px',
                color: 'fg.muted',
                textDecoration: 'none',
                mr: '3',
                alignItems: 'center',
                gap: '1.5',
              })}
            >
              The philosophy
              <ArrowUpRight size={12} />
            </a>
            <Badge>v0.1</Badge>
            <Button
              size="sm"
              variant="ghost"
              colorPalette="neutral"
              square
              aria-label={theme.mode === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
              onClick={() =>
                setTheme((prev) => ({ ...prev, mode: prev.mode === 'light' ? 'dark' : 'light' }))
              }
            >
              {theme.mode === 'light' ? <Moon /> : <Sun />}
            </Button>
          </div>
        </header>
        <main id="main-content" tabIndex={-1} className={s.main}>
          {route === '/' ? (
            <>
              <section className={s.hero}>
                <div>
                  <div className={s.eyebrow}>
                    <span />
                    The starting point for something good.
                  </div>
                  <h1 className={s.heroTitle}>
                    Your next foundation.
                    <br />
                    <span className={css({ color: 'fg.subtle' })}>Entirely your own.</span>
                  </h1>
                  <p className={s.heroDescription}>
                    Thoughtfully crafted components for the things you’re here to build.
                    <br className={css({ display: { base: 'none', md: 'block' } })} />
                    Powered by Base UI and Panda CSS. Ready to become yours.
                  </p>
                  <div className={css({ display: 'flex', gap: '3', mt: '6', flexWrap: 'wrap' })}>
                    <Button
                      render={<a href="#/installation" />}
                      nativeButton={false}
                      variant="outline"
                      colorPalette="neutral"
                    >
                      Start building
                      <ArrowRight />
                    </Button>
                    <Button
                      render={<a href="#/components" />}
                      nativeButton={false}
                      variant="ghost"
                      colorPalette="neutral"
                    >
                      Explore components
                      <ArrowUpRight />
                    </Button>
                  </div>
                </div>
                <div className={s.heroArt} aria-hidden="true">
                  <div
                    className={s.heroTile}
                    style={{
                      top: 0,
                      left: 40,
                      transform: 'rotate(12deg)',
                      background: 'var(--colors-surface-subtle)',
                    }}
                  />
                  <div
                    className={s.heroTile}
                    style={{ top: 22, left: 20, transform: 'rotate(-6deg)' }}
                  />
                  <div
                    className={s.heroTile}
                    style={{ top: 44, left: 0, transform: 'rotate(-18deg)' }}
                  >
                    ✳
                  </div>
                </div>
              </section>
              <div className={s.sectionBar}>
                <nav className={s.sectionTabs} aria-label="Collection views">
                  <a href="#/" aria-current="page">
                    The collection
                  </a>
                  <a href="#/components">
                    Components{' '}
                    <span className={css({ fontSize: '10px', color: 'fg.subtle' })}>
                      {catalog.length}
                    </span>
                  </a>
                  <a href="#/theming">Your theme</a>
                </nav>
                <span
                  className={css({
                    display: { base: 'none', md: 'flex' },
                    alignItems: 'center',
                    gap: '1.5',
                    color: 'fg.subtle',
                    fontSize: '10px',
                  })}
                >
                  <Code2 size={13} />
                  Real components. Go ahead, try them.
                </span>
              </div>
              <Overview />
            </>
          ) : entry ? (
            <ComponentPage key={entry.id} entry={entry} />
          ) : route === '/components' ? (
            <CatalogPage />
          ) : route === '/installation' ? (
            <InstallationPage />
          ) : route === '/theming' ? (
            <ThemePage theme={theme} setTheme={setTheme} />
          ) : route === '/principles' ? (
            <PrinciplesPage />
          ) : route === '/quality' ? (
            <QaPage />
          ) : (
            <>
              <h1 className={s.pageTitle}>A little off the path.</h1>
              <p className={s.pageIntro}>That page isn’t in the collection.</p>
              <Button render={<a href="#/components" />} nativeButton={false}>
                Find a component
                <ArrowRight />
              </Button>
            </>
          )}
          <footer className={s.footer}>
            <span>
              kiso / ui <span className={css({ mx: '2' })}>·</span> A foundation, not a ceiling.
            </span>
            <span>
              Built with Base UI + Panda CSS <span className={css({ mx: '2' })}>·</span> Yours to
              shape.
            </span>
          </footer>
        </main>
      </div>
      <Dialog.Root open={searchOpen} onOpenChange={setSearchOpen} size="lg">
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup className={css({ p: '0' })}>
            <div
              className={css({
                p: '5',
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                borderColor: 'border',
              })}
            >
              <Dialog.Title className={css({ fontSize: 'sm', mb: '3' })}>
                Find your next building block
              </Dialog.Title>
              <Dialog.Description className={css({ srOnly: true })}>
                Search components by name or category, then follow a result.
              </Dialog.Description>
              <Input
                placeholder="Search components…"
                aria-label="Search components"
                value={query}
                onValueChange={setQuery}
              />
            </div>
            <div className={css({ p: '2', maxHeight: '360px', overflowY: 'auto' })}>
              {results.map((item) => (
                <a
                  key={item.id}
                  href={`#/components/${item.id}`}
                  onClick={() => setSearchOpen(false)}
                  className={css({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: '3',
                    borderRadius: 'control',
                    fontSize: 'sm',
                    textDecoration: 'none',
                    _hover: { bg: 'surface.subtle' },
                    _focusVisible: {
                      outline: '2px solid',
                      outlineColor: 'accent',
                      bg: 'accent.subtle',
                    },
                  })}
                >
                  <span>{item.name}</span>
                  <span className={css({ fontSize: 'xs', color: 'fg.subtle' })}>
                    {item.category}
                  </span>
                </a>
              ))}
              {!results.length && <p className={s.empty}>No matches. Try another name.</p>}
            </div>
            <div
              className={css({
                p: '3',
                borderTopWidth: '1px',
                borderTopStyle: 'solid',
                borderColor: 'border',
                display: 'flex',
                justifyContent: 'flex-end',
              })}
            >
              <Dialog.Close render={<Button size="xs" variant="ghost" colorPalette="neutral" />}>
                Close<Kbd>Esc</Kbd>
              </Dialog.Close>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
