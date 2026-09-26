const AdvancedDemo = lazy(() =>
  import('./advanced-demos').then((module) => ({ default: module.AdvancedDemo })),
)
import { lazy, Suspense, useState, type ReactNode } from 'react'
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Plus,
  Bold,
  Italic,
  Underline,
  Info,
  BookOpen,
  Copy,
  Trash2,
  Settings2,
  MoreHorizontal,
  Bell,
  ArrowRight,
  Layers,
  Globe,
  CheckCircle2,
  CircleAlert,
  Mail,
  X,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { Toggle } from '../components/ui/toggle'
import { ToggleGroup } from '../components/ui/toggle'
import { Kbd } from '../components/ui/kbd'
import { Skeleton } from '../components/ui/skeleton'
import { Separator } from '../components/ui/separator'
import * as Checkbox from '../components/ui/checkbox'
import * as Switch from '../components/ui/switch'
import * as Tabs from '../components/ui/tabs'
import * as Accordion from '../components/ui/accordion'
import * as Select from '../components/ui/select'
import * as Dialog from '../components/ui/dialog'
import * as AlertDialog from '../components/ui/alert-dialog'
import * as Popover from '../components/ui/popover'
import * as Menu from '../components/ui/menu'
import * as Tooltip from '../components/ui/tooltip'
import * as Field from '../components/ui/field'
import * as Slider from '../components/ui/slider'
import * as NumberField from '../components/ui/number-field'
import * as RadioGroup from '../components/ui/radio-group'
import * as Avatar from '../components/ui/avatar'
import * as Progress from '../components/ui/progress'
import * as Card from '../components/ui/card'
import * as Alert from '../components/ui/alert'
import { css } from '../../styled-system/css'
import { styles as s } from './styles'

export type DemoSize = 'sm' | 'md' | 'lg'
/** Docs controls offer each recipe's own values (catalog.ts), so they pass straight through. */
export const pass = (value?: string) => value as never
export function CheckControl({
  label,
  defaultChecked = false,
  disabled = false,
  size = 'md',
  variant,
}: {
  label: string
  defaultChecked?: boolean
  disabled?: boolean
  size?: string
  variant?: string
}) {
  return (
    <Checkbox.Label size={pass(size)} variant={pass(variant)}>
      <Checkbox.Root defaultChecked={defaultChecked} disabled={disabled}>
        <Checkbox.Indicator />
      </Checkbox.Root>
      {label}
    </Checkbox.Label>
  )
}
export function Person({
  initials,
  name,
  size = 'md',
  variant,
}: {
  initials: string
  name: string
  size?: string
  variant?: string
}) {
  return (
    <Avatar.Root role="img" size={pass(size)} variant={pass(variant)} aria-label={name}>
      <Avatar.Fallback>{initials}</Avatar.Fallback>
    </Avatar.Root>
  )
}

export function SelectDemo({
  size = 'md',
  variant,
  palette,
}: {
  size?: string
  variant?: string
  palette?: string
}) {
  const options = [
    { label: 'Design', value: 'design' },
    { label: 'Engineering', value: 'engineering' },
    { label: 'Product', value: 'product' },
    { label: 'Marketing', value: 'marketing' },
  ]
  return (
    <Select.Root
      size={pass(size)}
      variant={pass(variant)}
      colorPalette={pass(palette)}
      items={options}
      defaultValue="design"
    >
      <Select.Label>Team</Select.Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={6} alignItemWithTrigger={false}>
          <Select.Popup>
            <Select.List>
              {options.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  )
}

export function WorkspaceForm({
  compact = false,
  onComplete,
}: {
  compact?: boolean
  onComplete?: () => void
}) {
  const [created, setCreated] = useState(false)
  return (
    <form
      className={s.stack}
      onSubmit={(event) => {
        event.preventDefault()
        setCreated(true)
        onComplete?.()
      }}
    >
      {!compact && (
        <div>
          <div className={s.glyph}>
            <Layers />
          </div>
          <h3
            className={css({
              fontWeight: 'medium',
              fontSize: 'lg',
              mt: '4',
              letterSpacing: '-.03em',
            })}
          >
            Make room for your next idea.
          </h3>
          <p className={css({ fontSize: 'xs', color: 'fg.muted', mt: '1.5' })}>
            A shared space for a little more possibility.
          </p>
        </div>
      )}
      <Field.Root name="workspace">
        <Field.Label>Workspace name</Field.Label>
        <Input placeholder="e.g. Studio North" required />
        <Field.Error match="valueMissing">Give your workspace a name.</Field.Error>
      </Field.Root>
      <Field.Root>
        {/* SelectDemo names itself with Select.Label. */}
        <SelectDemo />
      </Field.Root>
      <CheckControl label="Invite my team later" defaultChecked />
      <Button type="submit" className={css({ width: 'full', mt: '1' })}>
        {created ? (
          <>
            <Check size={14} />
            Workspace created
          </>
        ) : (
          <>
            Create workspace
            <ArrowRight size={14} />
          </>
        )}
      </Button>
      {created && (
        <p role="status" className={s.small}>
          Your demo workspace is ready. Nothing was sent to a server.
        </p>
      )}
    </form>
  )
}

export function DialogDemo({ size = 'md', palette }: { size?: string; palette?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog.Root size={pass(size)} colorPalette={pass(palette)} open={open} onOpenChange={setOpen}>
      <Dialog.Trigger render={<Button variant="outline" colorPalette="gray" />}>
        <Plus size={14} />
        New workspace
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <Dialog.Header>
            <Dialog.Title>Create a workspace</Dialog.Title>
            <Dialog.Description>Bring your people and projects together.</Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            <WorkspaceForm compact onComplete={() => setOpen(false)} />
          </Dialog.Body>
          <Dialog.CloseTrigger
            aria-label="Close"
            render={<Button variant="plain" colorPalette="gray" size="sm" square />}
          >
            <X />
          </Dialog.CloseTrigger>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function AlertDialogDemo({ size = 'md' }: { size?: string }) {
  const [archived, setArchived] = useState(false)
  return (
    <div className={s.stack}>
      <AlertDialog.Root size={pass(size)}>
        <AlertDialog.Trigger render={<Button variant="outline" colorPalette="gray" />}>
          Archive project
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Backdrop />
          <AlertDialog.Popup>
            <AlertDialog.Header>
              <AlertDialog.Title>Archive this project?</AlertDialog.Title>
              <AlertDialog.Description>
                The project will move out of your active list. You can restore it at any time.
              </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
              <AlertDialog.Close render={<Button variant="outline" colorPalette="gray" />}>
                Cancel
              </AlertDialog.Close>
              <AlertDialog.Close
                render={<Button colorPalette="danger" />}
                onClick={() => setArchived(true)}
              >
                Archive project
              </AlertDialog.Close>
            </AlertDialog.Footer>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
      {archived && (
        <p role="status" className={s.small}>
          Project archived in this demo.
        </p>
      )}
    </div>
  )
}

export function MenuDemo({ size = 'md', palette }: { size?: string; palette?: string }) {
  const [action, setAction] = useState('')
  return (
    <div className={s.stack}>
      <Menu.Root size={pass(size)} colorPalette={pass(palette)}>
        <Menu.Trigger render={<Button variant="outline" colorPalette="gray" />}>
          Project actions
          <ChevronDown size={14} />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner sideOffset={6}>
            <Menu.Popup>
              <Menu.Group>
                <Menu.GroupLabel>Project</Menu.GroupLabel>
                <Menu.Item onClick={() => setAction('Project duplicated')}>
                  <Copy />
                  Duplicate
                  <Kbd size="sm" className={css({ ml: 'auto' })}>
                    ⌘D
                  </Kbd>
                </Menu.Item>
                <Menu.Item onClick={() => setAction('Project settings opened')}>
                  <Settings2 />
                  Settings
                </Menu.Item>
                <Menu.LinkItem href="#/installation">
                  <BookOpen />
                  Read the guide
                </Menu.LinkItem>
              </Menu.Group>
              <Menu.Separator />
              <Menu.CheckboxItem defaultChecked>
                Show in sidebar
                <Menu.CheckboxItemIndicator />
              </Menu.CheckboxItem>
              <Menu.Separator />
              <Menu.Item
                onClick={() => setAction('Project archived')}
                className={css({ color: 'fg.error' })}
              >
                <Trash2 />
                Archive project
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
      {action && (
        <p role="status" className={s.small}>
          {action} in this demo.
        </p>
      )}
    </div>
  )
}

export function PopoverDemo({ size = 'md' }: { size?: string }) {
  return (
    <Popover.Root size={pass(size)}>
      <Popover.Trigger render={<Button variant="outline" colorPalette="gray" />}>
        <Bell size={14} />
        Notifications
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8}>
          <Popover.Popup>
            <Popover.Arrow />
            <Popover.Title>All caught up.</Popover.Title>
            <Popover.Description>
              Your next big idea can have your full attention. We’ll let you know when something
              arrives.
            </Popover.Description>
            <Popover.Close
              render={<Button size="sm" variant="subtle" className={css({ mt: '4' })} />}
            >
              Sounds good
            </Popover.Close>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}

export function AccordionDemo({ size = 'md', variant }: { size?: string; variant?: string }) {
  const questions = [
    [
      'Is this really my code?',
      'Every component and recipe lives in your project. Read it, change it, and make it your own. There is no component package to work around.',
    ],
    [
      'Can I bring my own theme?',
      'Absolutely. Change semantic tokens to restyle the whole system, or edit an individual recipe for something more specific.',
    ],
    [
      'What handles accessibility?',
      'Base UI provides keyboard navigation, focus management, and ARIA behavior. Kiso adds visible focus states and clear visual structure.',
    ],
  ]
  return (
    <Accordion.Root size={pass(size)} variant={pass(variant)} defaultValue={[0]}>
      {questions.map(([question, answer], index) => (
        <Accordion.Item key={question} value={index}>
          <Accordion.Header>
            <Accordion.Trigger>
              {question}
              <ChevronDown aria-hidden="true" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            <div>{answer}</div>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}

export function TabsDemo({
  size = 'md',
  variant,
  orientation = 'horizontal',
}: {
  size?: string
  variant?: string
  orientation?: 'horizontal' | 'vertical'
}) {
  return (
    <Tabs.Root
      size={pass(size)}
      variant={pass(variant)}
      orientation={orientation}
      defaultValue="overview"
    >
      <Tabs.List aria-label="Project views">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="activity">Activity</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel value="overview">
        <div className={s.stack}>
          <div className={s.spread}>
            <span className={s.small}>Monthly active users</span>
            <Badge colorPalette="success">+12.8%</Badge>
          </div>
          <div className={s.metric}>
            2,840
            <span
              className={css({ fontSize: '12px', letterSpacing: 0, color: 'fg.muted', ml: '2' })}
            >
              people
            </span>
          </div>
          <div
            className={s.bars}
            aria-label="Activity is increasing over the last 20 days"
            role="img"
          >
            {[23, 34, 30, 40, 28, 45, 38, 57, 46, 54, 49, 64, 58, 70, 66, 75, 61, 78, 72, 94].map(
              (h, i) => (
                <span key={i} style={{ height: `${h}%` }} />
              ),
            )}
          </div>
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="activity">
        <div className={s.stack}>
          <p className={s.title}>A good day to make something.</p>
          <p className={s.small}>Alex updated the design system · 12 minutes ago</p>
          <p className={s.small}>Sam published a new component · 1 hour ago</p>
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="settings">
        <Field.Root>
          <Field.Label>Project name</Field.Label>
          <Input defaultValue="Studio North" />
          <Field.Description>Changes stay in this local preview.</Field.Description>
        </Field.Root>
      </Tabs.Panel>
    </Tabs.Root>
  )
}

export function NotificationDemo({ size = 'md' }: { size?: string }) {
  return (
    <div>
      <div className={s.spread}>
        <h3 className={s.title}>Stay in the loop</h3>
        <Bell size={15} className={css({ color: 'fg.muted' })} />
      </div>
      <p className={css({ fontSize: 'xs', color: 'fg.muted', mt: '1.5', mb: '3' })}>
        A little signal. Less noise.
      </p>
      {[
        ['Product updates', 'What’s new and what’s next.', true],
        ['Weekly digest', 'The highlights, once a week.', true],
        ['Tips & inspiration', 'A fresh perspective, occasionally.', false],
      ].map(([title, detail, checked]) => (
        <Switch.Label key={String(title)} size={pass(size)} className={s.notification}>
          <span>
            <span className={css({ display: 'block', fontSize: 'xs', fontWeight: 'medium' })}>
              {String(title)}
            </span>
            <span
              className={css({ display: 'block', fontSize: '11px', color: 'fg.muted', mt: '1' })}
            >
              {String(detail)}
            </span>
          </span>
          <Switch.Root defaultChecked={Boolean(checked)}>
            <Switch.Thumb />
          </Switch.Root>
        </Switch.Label>
      ))}
    </div>
  )
}

export function SliderDemo({
  size = 'md',
  orientation = 'horizontal',
}: {
  size?: string
  orientation?: 'horizontal' | 'vertical'
}) {
  return (
    <Slider.Root size={pass(size)} orientation={orientation} defaultValue={64}>
      <Slider.Label>Creative energy</Slider.Label>
      <Slider.Value />
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
          <Slider.Thumb aria-label="Creative energy" />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  )
}
export function NumberDemo({ size = 'md', variant }: { size?: string; variant?: string }) {
  return (
    <Field.Root>
      <Field.Label>Team seats</Field.Label>
      <NumberField.Root defaultValue={5} min={1} max={50} size={pass(size)} variant={pass(variant)}>
        <NumberField.Group>
          <NumberField.Decrement aria-label="Remove a seat" />
          <NumberField.Input />
          <NumberField.Increment aria-label="Add a seat" />
        </NumberField.Group>
      </NumberField.Root>
      <Field.Description>Between 1 and 50 people.</Field.Description>
    </Field.Root>
  )
}

export function Demo({
  id,
  size = 'md',
  variant,
  palette,
  orientation = 'horizontal',
}: {
  id: string
  size?: string
  variant?: string
  palette?: string
  orientation?: 'horizontal' | 'vertical'
}) {
  const [saved, setSaved] = useState(false)
  const [publishing, setPublishing] = useState(false)
  switch (id) {
    case 'button':
      return (
        <div className={s.row}>
          <Button
            size={pass(size)}
            variant={pass(variant)}
            colorPalette={pass(palette)}
            onClick={() => setSaved(!saved)}
          >
            {saved ? <Check size={14} /> : <Plus size={14} />}
            {saved ? 'Added to your project' : 'Add to project'}
          </Button>
          <Button
            size={pass(size)}
            variant="outline"
            colorPalette="gray"
            loading={publishing}
            onClick={() => {
              setPublishing(true)
              setTimeout(() => setPublishing(false), 2000)
            }}
          >
            Publish
          </Button>
          <Button size={pass(size)} variant="outline" colorPalette="gray" disabled>
            Disabled
          </Button>
          <Button
            size={pass(size)}
            variant="plain"
            colorPalette="gray"
            square
            aria-label="More actions"
            onClick={() => setSaved(!saved)}
          >
            <MoreHorizontal />
          </Button>
        </div>
      )
    case 'input':
      return (
        <Field.Root>
          <Field.Label>Email address</Field.Label>
          <Input
            size={pass(size)}
            variant={pass(variant)}
            placeholder="you@studio.design"
            type="email"
          />
          <Field.Description>For the occasional good thing.</Field.Description>
        </Field.Root>
      )
    case 'textarea':
      return (
        <Field.Root>
          <Field.Label>Your next big idea</Field.Label>
          <Field.Control
            render={
              <Textarea
                size={pass(size)}
                variant={pass(variant)}
                placeholder="It starts with a thought…"
              />
            }
          />
          <Field.Description>Make yourself some room.</Field.Description>
        </Field.Root>
      )
    case 'field':
      return (
        <form
          className={s.stack}
          onSubmit={(e) => {
            e.preventDefault()
            setSaved(true)
          }}
        >
          <Field.Root name="email">
            <Field.Label>Email address</Field.Label>
            <Input type="email" required placeholder="you@studio.design" />
            <Field.Description>We’ll only use this for your account.</Field.Description>
            <Field.Error match="valueMissing">Please enter your email address.</Field.Error>
            <Field.Error match="typeMismatch">
              That email address doesn’t look quite right.
            </Field.Error>
          </Field.Root>
          <Button type="submit">{saved ? 'Saved' : 'Save preferences'}</Button>
          {saved && (
            <p role="status" className={s.small}>
              Preferences saved in this demo.
            </p>
          )}
        </form>
      )
    case 'checkbox':
      return (
        <div className={s.stack}>
          <CheckControl size={size} variant={variant} label="Keep me in the loop" defaultChecked />
          <CheckControl size={size} variant={variant} label="Send a weekly digest" />
          <CheckControl
            size={size}
            variant={variant}
            label="Managed by your organization"
            disabled
          />
          <Checkbox.Label size={pass(size)} variant={pass(variant)}>
            <Checkbox.Root indeterminate>
              <Checkbox.Indicator />
            </Checkbox.Root>
            Some projects selected
          </Checkbox.Label>
        </div>
      )
    case 'switch':
      return <NotificationDemo size={size} />
    case 'radio-group':
      return (
        <RadioGroup.Root
          defaultValue="personal"
          size={pass(size)}
          variant={pass(variant)}
          aria-label="Workspace type"
        >
          {['Personal', 'Team', 'Organization'].map((value) => (
            <RadioGroup.Label key={value}>
              <RadioGroup.Item value={value.toLowerCase()}>
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              {value}
            </RadioGroup.Label>
          ))}
        </RadioGroup.Root>
      )
    case 'select':
      return <SelectDemo size={size} variant={variant} palette={palette} />
    case 'slider':
      return <SliderDemo size={size} orientation={orientation} />
    case 'number-field':
      return <NumberDemo size={size} variant={variant} />
    case 'toggle':
      return (
        <ToggleGroup defaultValue={['bold']} multiple aria-label="Text formatting">
          <Toggle value="bold" size={pass(size)} variant={pass(variant)} aria-label="Bold">
            <Bold />
          </Toggle>
          <Toggle value="italic" size={pass(size)} variant={pass(variant)} aria-label="Italic">
            <Italic />
          </Toggle>
          <Toggle
            value="underline"
            size={pass(size)}
            variant={pass(variant)}
            aria-label="Underline"
          >
            <Underline />
          </Toggle>
        </ToggleGroup>
      )
    case 'badge':
      return (
        <div className={s.row}>
          {[
            ['gray', 'Draft'],
            [palette ?? 'accent', 'In progress'],
            ['success', 'Published'],
            ['warning', 'In review'],
            ['danger', 'Needs attention'],
          ].map(([colorPalette, label]) => (
            <Badge
              key={label}
              size={pass(size)}
              colorPalette={pass(colorPalette)}
              variant={pass(variant)}
            >
              {label}
            </Badge>
          ))}
        </div>
      )
    case 'alert':
      return (
        <div className={s.stack}>
          <Alert.Root status="success" size={pass(size)} variant={pass(variant)}>
            <Alert.Icon>
              <CheckCircle2 />
            </Alert.Icon>
            <Alert.Content>
              <Alert.Title>You’re all set.</Alert.Title>
              <Alert.Description>
                Your changes have been saved. A little progress, made real.
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
          <Alert.Root status="error" size={pass(size)} variant={pass(variant)}>
            <Alert.Icon>
              <CircleAlert />
            </Alert.Icon>
            <Alert.Content>
              <Alert.Title>We couldn’t publish that.</Alert.Title>
              <Alert.Description>Check your connection and try again.</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        </div>
      )
    case 'progress':
      return (
        <Progress.Root value={68} size={pass(size)} variant={pass(variant)}>
          <Progress.Label>Getting things ready</Progress.Label>
          <Progress.Value />
          <Progress.Track>
            <Progress.Indicator />
          </Progress.Track>
        </Progress.Root>
      )
    case 'skeleton':
      return (
        <div className={s.stack}>
          <div className={s.row}>
            <Skeleton variant={pass(variant)} circle className={css({ w: '10', h: '10' })} />
            <div className={css({ flex: 1 })}>
              <Skeleton variant={pass(variant)} className={css({ w: '50%', mb: '2' })} />
              <Skeleton variant={pass(variant)} className={css({ w: '80%', h: '3' })} />
            </div>
          </div>
          <Skeleton variant={pass(variant)} className={css({ h: '24' })} />
        </div>
      )
    case 'tabs':
      return <TabsDemo size={size} variant={variant} orientation={orientation} />
    case 'accordion':
      return <AccordionDemo size={size} variant={variant} />
    case 'dialog':
      return <DialogDemo size={size} palette={palette} />
    case 'alert-dialog':
      return <AlertDialogDemo size={size} />
    case 'popover':
      return <PopoverDemo size={size} />
    case 'menu':
      return <MenuDemo size={size} palette={palette} />
    case 'tooltip':
      return (
        <Tooltip.Provider delay={200}>
          <Tooltip.Root>
            <Tooltip.Trigger
              render={
                <Button
                  variant="outline"
                  colorPalette="gray"
                  square
                  aria-label="About this component"
                />
              }
            >
              <Info size={16} />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Positioner sideOffset={8}>
                <Tooltip.Popup>A little context goes a long way.</Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      )
    case 'avatar':
      return (
        <div className={s.row}>
          <Person initials="AK" name="Alex Kim" size={size} variant={variant} />
          <Person initials="SJ" name="Sam Jones" size={size} variant={variant} />
          <Person initials="MN" name="Morgan North" size={size} variant={variant} />
          <Avatar.Root
            role="img"
            size={pass(size)}
            variant={pass(variant)}
            shape="rounded"
            aria-label="Studio North"
          >
            <Avatar.Fallback>
              <Layers size={18} />
            </Avatar.Fallback>
          </Avatar.Root>
        </div>
      )
    case 'card':
      return (
        <Card.Root size={pass(size)} variant={pass(variant)}>
          <Card.Header>
            <Card.Title>A place to start.</Card.Title>
            <Card.Description>Thoughtful defaults. Room to make it yours.</Card.Description>
          </Card.Header>
          <Card.Body>
            <Badge colorPalette="success">Ready when you are</Badge>
          </Card.Body>
          <Card.Footer>
            <Button size="sm" onClick={() => setSaved(!saved)}>
              {saved ? 'Let’s make something' : 'Explore the possibilities'}
              <ArrowUpRight size={14} />
            </Button>
          </Card.Footer>
        </Card.Root>
      )
    case 'separator':
      return (
        <div className={s.stack}>
          <p className={s.title}>Some things belong together.</p>
          <Separator variant={pass(variant)} />
          <div className={s.row}>
            <span className={s.small}>Design</span>
            <Separator variant={pass(variant)} orientation="vertical" />
            <span className={s.small}>Engineering</span>
            <Separator variant={pass(variant)} orientation="vertical" />
            <span className={s.small}>Something good</span>
          </div>
        </div>
      )
    case 'kbd':
      return (
        <div className={s.row}>
          <span className={s.small}>Find a component</span>
          <Kbd size={pass(size)} variant={pass(variant)}>
            ⌘
          </Kbd>
          <Kbd size={pass(size)} variant={pass(variant)}>
            K
          </Kbd>
          <span className={css({ mx: '2', color: 'fg.muted' })}>or</span>
          <Kbd size={pass(size)} variant={pass(variant)}>
            Ctrl
          </Kbd>
          <Kbd size={pass(size)} variant={pass(variant)}>
            K
          </Kbd>
        </div>
      )
    default:
      return (
        <Suspense fallback={<p role="status">Loading component…</p>}>
          <AdvancedDemo id={id} size={size} variant={variant} palette={palette} />
        </Suspense>
      )
  }
}

export function Specimen({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: ReactNode
}) {
  return (
    <article className={s.specimen}>
      <div className={s.specimenBody}>{children}</div>
      <div className={s.specimenFoot}>
        <span>{label}</span>
        <a href={`#/components/${id}`}>
          View component
          <ArrowUpRight />
        </a>
      </div>
    </article>
  )
}

export function Overview() {
  const [checklist, setChecklist] = useState([true, true, false])
  return (
    <div className={s.gallery}>
      <div className={s.column}>
        <Specimen id="field" label="A little composition">
          <WorkspaceForm />
        </Specimen>
        <Specimen id="slider" label="Slider · md">
          <SliderDemo />
          <div className={css({ mt: '5' })}>
            <Demo id="toggle" size="sm" />
          </div>
        </Specimen>
        <Specimen id="accordion" label="Accordion · line">
          <h3 className={css({ fontWeight: 'medium', fontSize: 'sm', mb: '2' })}>
            Good questions.
          </h3>
          <AccordionDemo size="sm" />
        </Specimen>
      </div>
      <div className={s.column}>
        <Specimen id="button" label="Button · 5 variants">
          <div className={s.spread}>
            <h3 className={s.title}>Small actions. Big possibilities.</h3>
            <ArrowUpRight size={15} className={css({ color: 'fg.muted' })} />
          </div>
          <div className={css({ mt: '5', display: 'flex', gap: '2', flexWrap: 'wrap' })}>
            <Button render={<a href="#/installation" />} nativeButton={false}>
              Get started
              <ArrowRight />
            </Button>
            <Button
              variant="outline"
              colorPalette="gray"
              render={<a href="#/components/button" />}
              nativeButton={false}
            >
              Explore
            </Button>
          </div>
          <div className={css({ mt: '3', display: 'flex', gap: '2', flexWrap: 'wrap' })}>
            <DialogDemo />
            <Button
              variant="subtle"
              size="sm"
              render={<a href="#/installation" />}
              nativeButton={false}
            >
              Quick start
            </Button>
          </div>
          <Separator className={css({ my: '5' })} />
          <div className={s.row}>
            <Badge colorPalette="success">Published</Badge>
            <Badge>In progress</Badge>
            <Badge colorPalette="gray">Draft</Badge>
          </div>
        </Specimen>
        <Specimen id="tabs" label="Tabs · line">
          <TabsDemo size="sm" />
        </Specimen>
        <Specimen id="dialog" label="Avatar + Dialog">
          <div className={s.spread}>
            <div>
              <h3 className={s.title}>Better, together.</h3>
              <p className={css({ fontSize: 'xs', color: 'fg.muted', mt: '1.5' })}>
                Good things are rarely built alone.
              </p>
            </div>
            <Globe size={17} className={css({ color: 'fg.muted' })} />
          </div>
          <div
            className={css({
              mt: '5',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '3',
            })}
          >
            <div
              className={css({
                display: 'flex',
                // A ring in the surface color separates overlapping avatars.
                '& > *': { boxShadow: '0 0 0 2px {colors.gray.surface.bg}' },
                '& > * + *': { ml: '-2' },
              })}
            >
              <Person initials="AK" name="Alex Kim" size="sm" />
              <Person initials="SJ" name="Sam Jones" size="sm" />
              <Person initials="MN" name="Morgan North" size="sm" />
              <Person initials="+2" name="Two more teammates" size="sm" />
            </div>
            <Popover.Root>
              <Popover.Trigger render={<Button size="sm" variant="outline" colorPalette="gray" />}>
                <Mail />
                Invite
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Positioner sideOffset={8}>
                  <Popover.Popup>
                    <Popover.Title>Share a little possibility.</Popover.Title>
                    <Popover.Description>
                      Invitations are a demo here. Add your own service to make this yours.
                    </Popover.Description>
                    <Popover.Close
                      render={<Button size="sm" variant="subtle" className={css({ mt: '4' })} />}
                    >
                      Got it
                    </Popover.Close>
                  </Popover.Popup>
                </Popover.Positioner>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </Specimen>
      </div>
      <div className={s.column}>
        <Specimen id="switch" label="Switch · md">
          <NotificationDemo />
        </Specimen>
        <Specimen id="checkbox" label="Checkbox · md">
          <div className={s.spread}>
            <h3 className={s.title}>The little things add up.</h3>
            <Badge colorPalette="gray">{checklist.filter(Boolean).length} of 3</Badge>
          </div>
          <div className={css({ display: 'flex', flexDirection: 'column', gap: '4', mt: '5' })}>
            {[
              'Start with a good foundation',
              'Make it feel like you',
              'Put something good out there',
            ].map((label, index) => (
              <Checkbox.Label key={label}>
                <Checkbox.Root
                  checked={checklist[index]}
                  onCheckedChange={(checked) =>
                    setChecklist((values) =>
                      values.map((value, i) => (i === index ? checked : value)),
                    )
                  }
                >
                  <Checkbox.Indicator />
                </Checkbox.Root>
                {label}
              </Checkbox.Label>
            ))}
          </div>
        </Specimen>
        <Specimen id="progress" label="Progress + Alert">
          <div className={s.spread}>
            <div className={s.row}>
              <div className={s.glyph}>
                <Layers />
              </div>
              <div>
                <h3 className={s.title}>Your next chapter</h3>
                <p className={s.small}>A work in progress.</p>
              </div>
            </div>
            <Badge>Building</Badge>
          </div>
          <div className={css({ mt: '5' })}>
            <Progress.Root value={72} size="sm">
              <Progress.Label className={css({ fontSize: 'xs', color: 'fg.muted' })}>
                A little closer
              </Progress.Label>
              <Progress.Value />
              <Progress.Track>
                <Progress.Indicator />
              </Progress.Track>
            </Progress.Root>
          </div>
          <div
            className={css({
              bg: 'success.subtle.bg',
              color: 'success.plain.fg',
              borderRadius: 'l2',
              px: '3',
              py: '2.5',
              display: 'flex',
              alignItems: 'center',
              gap: '2',
              fontSize: '11px',
              mt: '5',
            })}
          >
            <CheckCircle2 size={14} />
            All checks passed. Keep going.
          </div>
        </Specimen>
      </div>
    </div>
  )
}
