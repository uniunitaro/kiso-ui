'use client'
import {
  createContext,
  createElement,
  useContext,
  type ComponentPropsWithRef,
  type ElementType,
  type ReactNode,
} from 'react'
import { cx } from '../../../styled-system/css'

/** Base UI accepts state => className. Keep that contract when adding recipe classes. */
export function mergeClassName<S>(
  base: string | undefined,
  custom?: string | ((state: S) => string | undefined),
) {
  return typeof custom === 'function' ? (state: S) => cx(base, custom(state)) : cx(base, custom)
}

type SlotRecipe<V extends object, S extends string> = {
  (variants?: V): Record<S, string>
  splitVariantProps<P extends object>(props: P): [V, object]
}

/** One tiny helper, copied with the component. No runtime styling engine. */
export function createStyleContext<V extends object, S extends string>(recipe: SlotRecipe<V, S>) {
  const Context = createContext<Record<S, string> | null>(null)
  function useStyles() {
    return useContext(Context) ?? recipe()
  }
  function Provider({ children, ...variants }: V & { children?: ReactNode }) {
    return <Context.Provider value={recipe(variants as V)}>{children}</Context.Provider>
  }
  function withProvider<C extends ElementType>(Component: C, slot?: S) {
    type Props = Omit<ComponentPropsWithRef<C>, keyof V> & V
    function Styled(props: Props) {
      const [variants, rest] = recipe.splitVariantProps(props)
      const styles = recipe(variants)
      const pass = rest as Record<string, unknown>
      return (
        <Context.Provider value={styles}>
          {createElement(Component, {
            ...pass,
            ...(slot
              ? {
                  'data-slot': slot,
                  className: mergeClassName(styles[slot], pass.className as string),
                }
              : {}),
          })}
        </Context.Provider>
      )
    }
    Styled.displayName = `Kiso(${typeof Component === 'string' ? Component : (slot ?? 'Root')})`
    return Styled
  }
  function withContext<C extends ElementType>(Component: C, slot: S) {
    function Styled(props: ComponentPropsWithRef<C>) {
      const styles = useStyles()
      return createElement(Component, {
        ...props,
        'data-slot': slot,
        className: mergeClassName(styles[slot], props.className),
      })
    }
    Styled.displayName = `Kiso(${slot})`
    return Styled
  }
  return { withProvider, withContext, Provider, useStyles }
}
