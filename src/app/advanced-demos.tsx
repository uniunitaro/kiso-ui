import { useRef, useState, type ReactNode } from 'react'
import { Bold, Copy, Italic, Layers, Link, Search, Settings2, Share2 } from 'lucide-react'
import * as Autocomplete from '../components/ui/autocomplete'
import { Button } from '../components/ui/button'
import * as Checkbox from '../components/ui/checkbox'
import { CheckboxGroup } from '../components/ui/checkbox-group'
import * as Collapsible from '../components/ui/collapsible'
import * as Combobox from '../components/ui/combobox'
import * as ContextMenu from '../components/ui/context-menu'
import * as Drawer from '../components/ui/drawer'
import * as Field from '../components/ui/field'
import * as Fieldset from '../components/ui/fieldset'
import { Form } from '../components/ui/form'
import { Input } from '../components/ui/input'
import { Menubar } from '../components/ui/menubar'
import * as Menu from '../components/ui/menu'
import * as Meter from '../components/ui/meter'
import * as NavigationMenu from '../components/ui/navigation-menu'
import * as OtpField from '../components/ui/otp-field'
import * as PreviewCard from '../components/ui/preview-card'
import * as ScrollArea from '../components/ui/scroll-area'
import * as Toast from '../components/ui/toast'
import { Toggle } from '../components/ui/toggle'
import * as Toolbar from '../components/ui/toolbar'
import { css } from '../../styled-system/css'
import { styles as s } from './styles'
import { pass } from './demos'
import { NativeDemo } from './native-demos'

const frameworks = ['React', 'Next.js', 'Remix', 'Astro', 'Vue', 'Svelte', 'Solid', 'Angular']

export function ComboboxDemo({
  size = 'md',
  variant,
  palette,
}: {
  size?: string
  variant?: string
  palette?: string
}) {
  return (
    <Field.Root>
      <Field.Label>Your framework</Field.Label>
      <Combobox.Root
        items={frameworks}
        defaultValue="React"
        size={pass(size)}
        variant={pass(variant)}
        colorPalette={pass(palette)}
      >
        <Combobox.InputGroup>
          <Combobox.Input placeholder="Find a framework…" />
          <Combobox.Clear aria-label="Clear framework" />
          <Combobox.Trigger aria-label="Show frameworks" />
        </Combobox.InputGroup>
        <Combobox.Portal>
          <Combobox.Positioner sideOffset={6}>
            <Combobox.Popup>
              <Combobox.Empty>No frameworks found.</Combobox.Empty>
              <Combobox.List>
                {(item: string) => (
                  <Combobox.Item key={item} value={item}>
                    {item}
                    <Combobox.ItemIndicator />
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
      <Field.Description>Type to narrow down the possibilities.</Field.Description>
    </Field.Root>
  )
}

function ToastTrigger() {
  const manager = Toast.useToastManager()
  return (
    <div className={s.row}>
      <Button
        variant="outline"
        colorPalette="gray"
        onClick={() =>
          manager.add({
            title: 'A little progress, saved.',
            description: 'Your project is right where you left it.',
            type: 'success',
          })
        }
      >
        Show notification
      </Button>
      <Button
        variant="plain"
        colorPalette="gray"
        onClick={() =>
          manager.add({
            title: 'Something needs another try.',
            description: 'Your work is safe. Give it another moment.',
            type: 'error',
          })
        }
      >
        Try an error
      </Button>
      <Button
        variant="plain"
        colorPalette="gray"
        onClick={() =>
          manager.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
            loading: 'Publishing your changes…',
            success: 'Published.',
            error: 'That didn’t go through.',
          })
        }
      >
        Publish
      </Button>
      <CopyLinkButton />
    </div>
  )
}

// Anchored toasts get their own manager, so they never join the stack in the corner.
const anchoredToasts = Toast.createToastManager()
function CopyLinkButton() {
  const ref = useRef<HTMLButtonElement>(null)
  return (
    <Button
      ref={ref}
      variant="plain"
      colorPalette="gray"
      onClick={() =>
        anchoredToasts.add({
          title: 'Link copied.',
          timeout: 1500,
          positionerProps: { anchor: ref.current, sideOffset: 10 },
        })
      }
    >
      Copy link
    </Button>
  )
}
function AnchoredToasts() {
  const { toasts } = Toast.useToastManager()
  return (
    <Toast.Portal>
      <Toast.Viewport>
        {toasts.map((item) => (
          <Toast.Positioner key={item.id} toast={item}>
            <Toast.Root toast={item}>
              <Toast.Arrow />
              <Toast.Content>
                <Toast.Title>{item.title}</Toast.Title>
              </Toast.Content>
            </Toast.Root>
          </Toast.Positioner>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  )
}

export function ToastDemo() {
  return (
    <Toast.Provider timeout={5000}>
      <ToastTrigger />
      <Toast.Toaster />
      <Toast.Provider toastManager={anchoredToasts}>
        <AnchoredToasts />
      </Toast.Provider>
    </Toast.Provider>
  )
}

function DrawerDemo({ size }: { size?: string }) {
  // Provider, IndentBackground and Indent make the whole page step back, so they wrap the app
  // (see the usage example), not this preview.
  return (
    <div className={s.stack}>
      <div className={s.row}>
        {(['down', 'right'] as const).map((direction) => (
          <Drawer.Root key={direction} swipeDirection={direction} size={pass(size)}>
            <Drawer.Trigger render={<Button variant="outline" colorPalette="gray" />}>
              {direction === 'down' ? 'Open bottom sheet' : 'Open side panel'}
            </Drawer.Trigger>
            <DrawerSheet
              title="A little room to focus."
              description="Review the details, make your next move, and return to what you were doing."
            >
              <div className={projectCard}>
                <Layers size={20} />
                <span className={s.title}>Studio North · Design system</span>
              </div>
            </DrawerSheet>
          </Drawer.Root>
        ))}
        {/* Snap points: the sheet rests at 20rem first; drag it up for the full height. */}
        <Drawer.Root snapPoints={['20rem', 1]} size={pass(size)}>
          <Drawer.Trigger render={<Button variant="outline" colorPalette="gray" />}>
            Open with snap points
          </Drawer.Trigger>
          <DrawerSheet
            title="Recent files."
            description="Drag the handle up to see everything, or down to put it away."
          >
            {recentFiles.map((name) => (
              <div key={name} className={projectCard}>
                <Layers size={16} />
                <span>{name}</span>
              </div>
            ))}
          </DrawerSheet>
        </Drawer.Root>
        <Drawer.Root size={pass(size)}>
          <Drawer.Trigger render={<Button variant="outline" colorPalette="gray" />}>
            Open nested drawers
          </Drawer.Trigger>
          <NestedSheet level={0} size={size} />
        </Drawer.Root>
      </div>
      <p className={s.small}>
        With a mouse, drag a drawer by its handle. On a touch screen, swipe anywhere on it.
      </p>
    </div>
  )
}

const projectCard = css({
  p: '4',
  borderWidth: '1px',
  borderRadius: 'l3',
  display: 'flex',
  gap: '3',
  alignItems: 'center',
})

const recentFiles = [
  'Brand guidelines',
  'Color tokens',
  'Spacing scale',
  'Button recipe',
  'Dialog recipe',
  'Drawer recipe',
  'Release notes 2.4',
  'Accessibility review',
  'Icon set',
  'Type ramp',
  'Motion study',
  'Onboarding flow',
]

const nestedLevels = [
  {
    title: 'Share the project.',
    description: 'Invite the people who should see it next.',
    next: 'Invite people',
  },
  {
    title: 'Invite people.',
    description: 'The drawer behind steps back while this one is open.',
    next: 'Set permissions',
  },
  {
    title: 'Set permissions.',
    description: 'Drag this one down and the others come forward with it.',
  },
]

// Each level opens the next inside its own Root, which makes Base UI treat it as nested.
function NestedSheet({ level, size }: { level: number; size?: string }) {
  const { title, description, next } = nestedLevels[level]
  return (
    <DrawerSheet
      title={title}
      description={description}
      backdrop={level === 0}
      footer={
        next && (
          <Drawer.Root size={pass(size)}>
            <Drawer.Trigger render={<Button />}>{next}</Drawer.Trigger>
            <NestedSheet level={level + 1} size={size} />
          </Drawer.Root>
        )
      }
    />
  )
}

function DrawerSheet({
  title,
  description,
  children,
  footer,
  backdrop = true,
}: {
  title: string
  description: string
  children?: ReactNode
  footer?: ReactNode
  backdrop?: boolean
}) {
  return (
    <Drawer.Portal>
      {/* A nested drawer needs no backdrop of its own: the first one already dims the page. */}
      {backdrop && <Drawer.Backdrop />}
      <Drawer.Viewport>
        <Drawer.Popup>
          <Drawer.SwipeHandle />
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>{title}</Drawer.Title>
              <Drawer.Description>{description}</Drawer.Description>
            </Drawer.Header>
            {children && <Drawer.Body>{children}</Drawer.Body>}
            <Drawer.Footer>
              {footer || <Drawer.Close render={<Button />}>Done</Drawer.Close>}
            </Drawer.Footer>
            <Drawer.CloseTrigger />
          </Drawer.Content>
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  )
}

export function AdvancedDemo({
  id,
  size = 'md',
  variant,
  palette,
}: {
  id: string
  size?: string
  variant?: string
  palette?: string
}) {
  const [message, setMessage] = useState('')
  switch (id) {
    case 'combobox':
      return <ComboboxDemo size={size} variant={variant} palette={palette} />
    case 'autocomplete':
      return (
        <Field.Root>
          <Field.Label>Search your workspace</Field.Label>
          <Autocomplete.Root
            items={[
              'Design tokens',
              'Design review',
              'Development notes',
              'Product roadmap',
              'Project brief',
            ]}
            size={pass(size)}
            variant={pass(variant)}
            colorPalette={pass(palette)}
          >
            <Autocomplete.InputGroup>
              <Search size={14} className={css({ color: 'fg.subtle' })} />
              <Autocomplete.Input placeholder="Try “design”…" />
            </Autocomplete.InputGroup>
            <Autocomplete.Portal>
              <Autocomplete.Positioner sideOffset={6}>
                <Autocomplete.Popup>
                  <Autocomplete.Empty>
                    No suggestions. Keep typing your own search.
                  </Autocomplete.Empty>
                  <Autocomplete.List>
                    {(item: string) => (
                      <Autocomplete.Item key={item} value={item}>
                        {item}
                      </Autocomplete.Item>
                    )}
                  </Autocomplete.List>
                </Autocomplete.Popup>
              </Autocomplete.Positioner>
            </Autocomplete.Portal>
          </Autocomplete.Root>
          <Field.Description>Suggestions help. Your own words work, too.</Field.Description>
        </Field.Root>
      )
    case 'checkbox-group':
      return (
        <Field.Root>
          <CheckboxGroup defaultValue={['design']} aria-label="Interests">
            {[
              ['Design', 'Tokens, recipes and the details in between.'],
              ['Engineering', 'Types, tests and the build.'],
              ['Product', 'What to make next, and why.'],
            ].map(([name, description]) => (
              <Field.Item key={name}>
                <Checkbox.Label>
                  <Checkbox.Root value={name.toLowerCase()}>
                    <Checkbox.Indicator />
                  </Checkbox.Root>
                  {name}
                </Checkbox.Label>
                <Field.Description>{description}</Field.Description>
              </Field.Item>
            ))}
          </CheckboxGroup>
        </Field.Root>
      )
    case 'fieldset':
      return (
        <Fieldset.Root variant={pass(variant)}>
          <Fieldset.Legend>A little about you</Fieldset.Legend>
          <Field.Root>
            <Field.Label>Display name</Field.Label>
            <Input defaultValue="Alex Kim" />
          </Field.Root>
          <Field.Root>
            <Field.Label>Role</Field.Label>
            <Input defaultValue="Designer & maker" />
          </Field.Root>
        </Fieldset.Root>
      )
    case 'form':
      return (
        <Form
          onSubmit={(event) => {
            event.preventDefault()
            setMessage('Your local preview is ready.')
          }}
        >
          <Field.Root name="name">
            <Field.Label>Your name</Field.Label>
            <Input required placeholder="Alex Kim" />
            <Field.Error match="valueMissing">We’d love to know your name.</Field.Error>
          </Field.Root>
          <Field.Root name="email">
            <Field.Label>Email</Field.Label>
            <Input type="email" required placeholder="alex@studio.design" />
            <Field.Error match="typeMismatch">Please check the email address.</Field.Error>
            <Field.Error match="valueMissing">An email address is needed.</Field.Error>
          </Field.Root>
          <Button type="submit">Create your profile</Button>
          {message && (
            <p role="status" className={s.small}>
              {message}
            </p>
          )}
        </Form>
      )
    case 'otp-field':
      return (
        <Field.Root>
          <Field.Label>Verification code</Field.Label>
          <OtpField.Root
            length={6}
            size={pass(size)}
            variant={pass(variant)}
            onValueComplete={() => setMessage('All 6 digits entered. This is a local demo.')}
          >
            <OtpField.Input aria-label="Digit 1" />
            <OtpField.Input aria-label="Digit 2" />
            <OtpField.Input aria-label="Digit 3" />
            <OtpField.Separator />
            <OtpField.Input aria-label="Digit 4" />
            <OtpField.Input aria-label="Digit 5" />
            <OtpField.Input aria-label="Digit 6" />
          </OtpField.Root>
          <Field.Description>Try pasting a 6-digit code.</Field.Description>
          {message && (
            <p role="status" className={s.small}>
              {message}
            </p>
          )}
        </Field.Root>
      )
    case 'toast':
      return <ToastDemo />
    case 'meter':
      return (
        <Meter.Root value={7.2} min={0} max={10} size={pass(size)} variant={pass(variant)}>
          <Meter.Label>Storage used</Meter.Label>
          <Meter.Value>{(_value, value) => `${value} / 10 GB`}</Meter.Value>
          <Meter.Track>
            <Meter.Indicator />
          </Meter.Track>
        </Meter.Root>
      )
    case 'collapsible':
      return (
        <Collapsible.Root>
          <Collapsible.Trigger>
            Project files
            <Collapsible.Indicator />
          </Collapsible.Trigger>
          <div
            className={css({
              border: '1px solid',
              borderColor: 'border',
              borderRadius: 'l2',
              px: '3',
              py: '2',
              fontSize: 'xs',
              fontFamily: 'mono',
            })}
          >
            README.md
          </div>
          <Collapsible.Panel>
            <div className={css({ pt: '2' })}>
              {['design-tokens.ts', 'components.tsx', 'a-good-idea.md'].map((name) => (
                <div
                  key={name}
                  className={css({ py: '2', px: '3', fontSize: 'xs', fontFamily: 'mono' })}
                >
                  {name}
                </div>
              ))}
            </div>
          </Collapsible.Panel>
        </Collapsible.Root>
      )
    case 'toolbar':
      return (
        <Toolbar.Root aria-label="Editor toolbar" size={pass(size)} variant={pass(variant)}>
          <Toolbar.Group>
            <Toolbar.Button render={<Toggle />} aria-label="Bold">
              <Bold size={16} />
            </Toolbar.Button>
            <Toolbar.Button render={<Toggle />} aria-label="Italic">
              <Italic size={16} />
            </Toolbar.Button>
          </Toolbar.Group>
          <Toolbar.Separator />
          <Toolbar.Button
            aria-label="Copy selection"
            onClick={() => setMessage('Selection copied in this demo.')}
          >
            <Copy size={16} />
          </Toolbar.Button>
          <Toolbar.Link href="#/components">
            Components
            <Link size={13} />
          </Toolbar.Link>
          {message && (
            <span role="status" className={css({ srOnly: true })}>
              {message}
            </span>
          )}
        </Toolbar.Root>
      )
    case 'context-menu':
      return (
        <div className={s.stack}>
          <ContextMenu.Root size={pass(size)} colorPalette={pass(palette)}>
            <ContextMenu.Trigger
              tabIndex={0}
              className={css({
                border: '1px dashed',
                borderColor: 'gray.outline.border',
                borderRadius: 'l3',
                p: '10',
                textAlign: 'center',
                color: 'fg.muted',
                fontSize: 'sm',
                focusVisibleRing: 'outside',
              })}
            >
              Right click here.
              <br />
              <span className={s.small}>Or focus and press Shift + F10.</span>
            </ContextMenu.Trigger>
            <ContextMenu.Portal>
              <ContextMenu.Positioner>
                <ContextMenu.Popup>
                  <ContextMenu.Item onClick={() => setMessage('Duplicated in this demo.')}>
                    <Copy />
                    Duplicate
                  </ContextMenu.Item>
                  <ContextMenu.Item onClick={() => setMessage('Renamed in this demo.')}>
                    <Settings2 />
                    Rename
                  </ContextMenu.Item>
                  <ContextMenu.SubmenuRoot>
                    <ContextMenu.SubmenuTrigger>
                      <Share2 />
                      Share
                    </ContextMenu.SubmenuTrigger>
                    <ContextMenu.Portal>
                      <ContextMenu.Positioner
                        sideOffset={ContextMenu.submenuOffset}
                        alignOffset={ContextMenu.submenuOffset}
                      >
                        <ContextMenu.Popup>
                          {['Copy link', 'Send by email', 'Embed'].map((label) => (
                            <ContextMenu.Item
                              key={label}
                              onClick={() => setMessage(`${label} chosen in this demo.`)}
                            >
                              {label}
                            </ContextMenu.Item>
                          ))}
                        </ContextMenu.Popup>
                      </ContextMenu.Positioner>
                    </ContextMenu.Portal>
                  </ContextMenu.SubmenuRoot>
                  <ContextMenu.Separator />
                  <ContextMenu.Item disabled>Move to another team</ContextMenu.Item>
                </ContextMenu.Popup>
              </ContextMenu.Positioner>
            </ContextMenu.Portal>
          </ContextMenu.Root>
          {message && (
            <p role="status" className={s.small}>
              {message}
            </p>
          )}
        </div>
      )
    case 'drawer':
      return <DrawerDemo size={size} />
    case 'preview-card':
      return <PreviewCardDemo size={size} />
    case 'scroll-area':
      return (
        <ScrollArea.Root
          className={css({
            height: '220px',
            border: '1px solid',
            borderColor: 'border',
            borderRadius: 'l3',
            bg: 'gray.surface.bg',
          })}
        >
          <ScrollArea.Viewport role="region" aria-label="Project list">
            <ScrollArea.Content className={css({ p: '4' })}>
              <h3 className={css({ fontWeight: 'medium', mb: '4' })}>
                A few things in the making.
              </h3>
              {[
                'A fresh perspective',
                'Studio North',
                'The next chapter',
                'An open canvas',
                'Something good',
                'Small beginnings',
                'A better everyday',
                'New possibilities',
                'A quiet moment',
                'The long view',
                'Good company',
                'Room to grow',
              ].map((name, i) => (
                <div
                  key={name}
                  className={css({
                    py: '3',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3',
                    borderBottomWidth: '1px',
                    borderBottomStyle: 'solid',
                    borderColor: 'border',
                    fontSize: 'xs',
                  })}
                >
                  <span className={css({ fontFamily: 'mono', color: 'fg.muted' })}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {name}
                </div>
              ))}
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar>
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
          <ScrollArea.Corner />
        </ScrollArea.Root>
      )
    case 'menubar':
      return (
        <div className={s.stack}>
          <Menubar aria-label="Application menu" variant={pass(variant)}>
            {menubarMenus.map(({ name, items }) => (
              <Menu.Root key={name}>
                <Menu.Trigger render={<Button variant="plain" colorPalette="gray" size="sm" />}>
                  {name}
                </Menu.Trigger>
                <Menu.Portal>
                  <Menu.Positioner sideOffset={6}>
                    <Menu.Popup>
                      {items.map((item) =>
                        typeof item === 'string' ? (
                          <Menu.Item
                            key={item}
                            onClick={() => setMessage(`${item} selected in this demo.`)}
                          >
                            {item}
                          </Menu.Item>
                        ) : (
                          <Menu.SubmenuRoot key={item.label}>
                            <Menu.SubmenuTrigger>{item.label}</Menu.SubmenuTrigger>
                            <Menu.Portal>
                              <Menu.Positioner
                                sideOffset={Menu.submenuOffset}
                                alignOffset={Menu.submenuOffset}
                              >
                                <Menu.Popup>
                                  {item.items.map((label) => (
                                    <Menu.Item
                                      key={label}
                                      onClick={() =>
                                        setMessage(`${item.label}: ${label} in this demo.`)
                                      }
                                    >
                                      {label}
                                    </Menu.Item>
                                  ))}
                                </Menu.Popup>
                              </Menu.Positioner>
                            </Menu.Portal>
                          </Menu.SubmenuRoot>
                        ),
                      )}
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.Root>
            ))}
          </Menubar>
          {message && (
            <p role="status" className={s.small}>
              {message}
            </p>
          )}
        </div>
      )
    case 'navigation-menu':
      return <NavigationMenuDemo />
    default:
      return <NativeDemo id={id} size={size} variant={variant} />
  }
}

// An object opens a submenu with its own items.
const menubarMenus: { name: string; items: (string | { label: string; items: string[] })[] }[] = [
  {
    name: 'File',
    items: [
      'New project',
      { label: 'Open recent', items: ['Brand refresh', 'Design tokens', 'Q3 roadmap'] },
      'Save',
    ],
  },
  { name: 'Edit', items: ['Undo', 'Redo', 'Find'] },
  {
    name: 'View',
    items: ['Zoom in', 'Zoom out', { label: 'Appearance', items: ['Light', 'Dark', 'System'] }],
  },
]

function SinglePreviewCard({ size }: { size?: string }) {
  return (
    <PreviewCard.Root size={pass(size)}>
      <p className={s.small}>
        Made for a little more{' '}
        <PreviewCard.Trigger
          href="#/principles"
          className={css({
            color: 'colorPalette.plain.fg',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          })}
        >
          possibility
        </PreviewCard.Trigger>
        .
      </p>
      <PreviewCard.Portal>
        <PreviewCard.Positioner sideOffset={8}>
          <PreviewCard.Popup>
            <div className={s.glyph}>
              <Layers />
            </div>
            <h3 className={css({ fontWeight: 'medium', mt: '3' })}>A foundation, not a ceiling.</h3>
            <p className={css({ fontSize: 'xs', color: 'fg.muted', lineHeight: '1.7', mt: '2' })}>
              Own every line. Shape every detail. Make something that feels like you.
            </p>
          </PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  )
}

const people = {
  morgan: { name: 'Morgan North', role: 'Design lead. Keeps the system calm and consistent.' },
  sam: {
    name: 'Sam Jones',
    role: 'Engineer. Writes the recipes, the tests and most of the release notes, usually in that order.',
  },
}
const personCard = PreviewCard.createHandle<keyof typeof people>()
const personLink = css({
  color: 'colorPalette.plain.fg',
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
})

function PreviewCardDemo({ size }: { size?: string }) {
  return (
    <div className={s.stack}>
      <SinglePreviewCard size={size} />
      {/* One card for two links: it moves to the next link and resizes to the new person. */}
      <p className={s.small}>
        Made by{' '}
        <PreviewCard.Trigger
          handle={personCard}
          payload="morgan"
          href="#/principles"
          className={personLink}
        >
          Morgan
        </PreviewCard.Trigger>{' '}
        and{' '}
        <PreviewCard.Trigger
          handle={personCard}
          payload="sam"
          href="#/principles"
          className={personLink}
        >
          Sam
        </PreviewCard.Trigger>
        .
      </p>
      <PreviewCard.Root handle={personCard} size={pass(size)}>
        {({ payload }) => (
          <PreviewCard.Portal>
            <PreviewCard.Positioner sideOffset={8}>
              <PreviewCard.Popup>
                <PreviewCard.Viewport>
                  {payload && (
                    <>
                      <h3 className={css({ fontWeight: 'medium' })}>{people[payload].name}</h3>
                      <p className={css({ fontSize: 'xs', color: 'fg.muted', lineHeight: '1.7' })}>
                        {people[payload].role}
                      </p>
                    </>
                  )}
                </PreviewCard.Viewport>
              </PreviewCard.Popup>
            </PreviewCard.Positioner>
          </PreviewCard.Portal>
        )}
      </PreviewCard.Root>
    </div>
  )
}

function NavigationMenuDemo() {
  return (
    <NavigationMenu.Root aria-label="Product navigation">
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>
            Explore
            <NavigationMenu.Icon />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="#/components">The components</NavigationMenu.Link>
            <NavigationMenu.Link href="#/theming">Your theme</NavigationMenu.Link>
            <NavigationMenu.Link href="#/principles">The philosophy</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>
            Learn
            <NavigationMenu.Icon />
          </NavigationMenu.Trigger>
          {/* Another size: the popup resizes, and the content slides in from this side. */}
          <NavigationMenu.Content>
            <div
              className={css({
                display: 'grid',
                gridTemplateColumns: { base: '1fr', sm: '1fr 1fr' },
                gap: '1',
              })}
            >
              {[
                ['Installation', 'Add Kiso to a Panda project.'],
                ['Theming', 'Palettes, radii and your own roles.'],
                ['Accessibility', 'What Base UI handles, and what you do.'],
                ['Updating', 'Keep your edits when Kiso changes.'],
              ].map(([title, text]) => (
                <NavigationMenu.Link key={title} href="#/installation">
                  <span className={css({ display: 'block', fontWeight: 'medium' })}>{title}</span>
                  <span className={css({ display: 'block', textStyle: 'xs', color: 'fg.muted' })}>
                    {text}
                  </span>
                </NavigationMenu.Link>
              ))}
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#/installation">Get started</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <NavigationMenu.Portal>
        <NavigationMenu.Positioner sideOffset={8}>
          <NavigationMenu.Popup>
            <NavigationMenu.Viewport />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  )
}
