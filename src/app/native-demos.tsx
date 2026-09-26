import { useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, FolderPlus, Plus, Search, X } from 'lucide-react'
import { Badge } from '../components/ui/badge'
import * as Breadcrumb from '../components/ui/breadcrumb'
import { Button } from '../components/ui/button'
import { ButtonGroup } from '../components/ui/button-group'
import * as EmptyState from '../components/ui/empty-state'
import { Input } from '../components/ui/input'
import * as InputGroup from '../components/ui/input-group'
import { Pagination } from '../components/ui/pagination'
import { Spinner } from '../components/ui/spinner'
import * as Table from '../components/ui/table'
import { css } from '../../styled-system/css'
import { styles as s } from './styles'
import { pass } from './demos'

export function NativeDemo({
  id,
  size = 'md',
  variant,
}: {
  id: string
  size?: string
  variant?: string
}) {
  const [page, setPage] = useState(1)
  const [created, setCreated] = useState(false)
  const [query, setQuery] = useState('')
  const search = useRef<HTMLInputElement>(null)
  switch (id) {
    case 'table':
      return (
        <Table.Container>
          <Table.Root size={pass(size)} variant={pass(variant)}>
            <Table.Caption>Projects in your workspace.</Table.Caption>
            <Table.Header>
              <Table.Row>
                <Table.Head>Project</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head className={css({ textAlign: 'end' })}>Members</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {[
                ['Studio North', 'Published', '8'],
                ['A fresh perspective', 'In progress', '4'],
                ['The next chapter', 'Draft', '2'],
              ].map(([name, status, count]) => (
                <Table.Row key={name}>
                  <Table.Cell>{name}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      colorPalette={
                        status === 'Published' ? 'success' : status === 'Draft' ? 'gray' : 'accent'
                      }
                    >
                      {status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className={css({ textAlign: 'end', fontFamily: 'mono' })}>
                    {count}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.Container>
      )
    case 'breadcrumb':
      return (
        <Breadcrumb.Root size={pass(size)} variant={pass(variant)}>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="#/">Home</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Link href="#/components">Components</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Current>Breadcrumb</Breadcrumb.Current>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )
    case 'pagination':
      return (
        <div className={s.stack}>
          <Pagination count={12} page={page} onPageChange={setPage} size={pass(size)} />
          <p
            role="status"
            className={css({ textAlign: 'center', fontSize: 'xs', color: 'fg.muted' })}
          >
            Page {page} of 12 · Projects {(page - 1) * 10 + 1}–{page * 10}
          </p>
        </div>
      )
    case 'spinner':
      return (
        <div className={s.row}>
          <Spinner size={pass(size)} label="Preparing your project" />
          <span className={s.small}>Making room for your next idea…</span>
        </div>
      )
    case 'empty-state':
      return (
        <EmptyState.Root size={pass(size)} variant={pass(variant)}>
          <EmptyState.Icon>
            <FolderPlus />
          </EmptyState.Icon>
          <EmptyState.Title>
            {created ? 'Your first project is ready.' : 'Every good thing starts somewhere.'}
          </EmptyState.Title>
          <EmptyState.Description>
            {created
              ? 'A blank canvas, full of possibility. This project lives in the demo.'
              : 'Your workspace is empty. Make a little room for your next big idea.'}
          </EmptyState.Description>
          <EmptyState.Actions>
            <Button size="sm" onClick={() => setCreated(!created)}>
              <Plus />
              {created ? 'Start again' : 'Create a project'}
            </Button>
          </EmptyState.Actions>
        </EmptyState.Root>
      )
    case 'button-group':
      return (
        <div className={s.stack}>
          <ButtonGroup attached aria-label="Browse pages">
            <Button
              variant="outline"
              colorPalette="gray"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((n) => n - 1)}
            >
              <ArrowLeft />
              Previous
            </Button>
            <Button
              variant="outline"
              colorPalette="gray"
              size="sm"
              disabled={page === 5}
              onClick={() => setPage((n) => n + 1)}
            >
              Next
              <ArrowRight />
            </Button>
          </ButtonGroup>
          <p className={s.small} role="status">
            Page {page} of 5
          </p>
        </div>
      )
    case 'input-group':
      return (
        <div className={s.stack}>
          <InputGroup.Root>
            <InputGroup.Element>
              <Search />
            </InputGroup.Element>
            <Input
              ref={search}
              type="search"
              aria-label="Search projects"
              placeholder="Search projects"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <InputGroup.Element>
                <Button
                  variant="plain"
                  colorPalette="gray"
                  size="xs"
                  square
                  aria-label="Clear search"
                  onClick={() => {
                    setQuery('')
                    search.current?.focus()
                  }}
                >
                  <X />
                </Button>
              </InputGroup.Element>
            )}
          </InputGroup.Root>
          <InputGroup.Root>
            <InputGroup.Addon>https://</InputGroup.Addon>
            <Input aria-label="Website" placeholder="studio-north" />
            <InputGroup.Addon>.com</InputGroup.Addon>
          </InputGroup.Root>
        </div>
      )
    default:
      return null
  }
}
