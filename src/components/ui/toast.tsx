'use client'
import { Toast as Base } from '@base-ui/react/toast'
import { toast } from '../../../styled-system/recipes'
import { createStyleContext } from './style-context'
const { withProvider, withContext } = createStyleContext(toast)
export const Provider = Base.Provider
export const Portal = Base.Portal
export const Root = withProvider(Base.Root, 'root')
export const Viewport = withContext(Base.Viewport, 'viewport')
export const Content = withContext(Base.Content, 'content')
export const Title = withContext(Base.Title, 'title')
export const Description = withContext(Base.Description, 'description')
export const Close = withContext(Base.Close, 'close')
export const Action = withContext(Base.Action, 'action')
export const useToastManager = Base.useToastManager
export const createToastManager = Base.createToastManager

/** Optional composition; mount once inside Provider. Use parts directly for custom layouts. */
export function Toaster() {
  const { toasts } = useToastManager()
  return (
    <Portal>
      <Viewport>
        {toasts.map((item) => (
          <Root key={item.id} toast={item}>
            <Content>
              <Title>{item.title}</Title>
              {item.description && <Description>{item.description}</Description>}
            </Content>
            {item.actionProps && <Action {...item.actionProps} />}
            <Close aria-label="Dismiss notification">
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
              </svg>
            </Close>
          </Root>
        ))}
      </Viewport>
    </Portal>
  )
}
