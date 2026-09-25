'use client'
import {
  createContext,
  createElement,
  useContext,
  type ComponentPropsWithRef,
  type ElementType,
  type ReactNode,
} from 'react'
import { css, cx } from '../../../styled-system/css'
import type { SystemStyleObject } from '../../../styled-system/types'

/** Any palette from the theme: accent, gray, danger, iris, or one added in panda.config.ts. */
export type ColorPaletteProp = { colorPalette?: SystemStyleObject['colorPalette'] }

export function paletteClass(colorPalette: ColorPaletteProp['colorPalette']) {
  return colorPalette ? css({ colorPalette }) : undefined
}

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
type Styles<S extends string> = { slots: Record<S, string>; palette?: string }

/** One tiny helper, copied with the component. No runtime styling engine. */
export function createStyleContext<V extends object, S extends string>(recipe: SlotRecipe<V, S>) {
  const Context = createContext<Styles<S> | null>(null)
  function useStyles() {
    return useContext(Context) ?? { slots: recipe() }
  }
  /** For roots without an element (Dialog, Menu, Select…): parts may render in a portal. */
  function Provider({
    children,
    colorPalette,
    ...variants
  }: V & ColorPaletteProp & { children?: ReactNode }) {
    const value = { slots: recipe(variants as V), palette: paletteClass(colorPalette) }
    return <Context.Provider value={value}>{children}</Context.Provider>
  }
  /** For roots that render an element: the palette is inherited through the DOM. */
  function withProvider<C extends ElementType>(Component: C, slot: S) {
    type Props = Omit<ComponentPropsWithRef<C>, keyof V | 'colorPalette'> & V & ColorPaletteProp
    function Styled(props: Props) {
      const [variants, other] = recipe.splitVariantProps(props)
      const { colorPalette, ...rest } = other as Record<string, unknown> & ColorPaletteProp
      const slots = recipe(variants)
      return (
        <Context.Provider value={{ slots }}>
          {createElement(Component, {
            ...rest,
            'data-slot': slot,
            className: mergeClassName(
              cx(slots[slot], paletteClass(colorPalette)),
              rest.className as string,
            ),
          })}
        </Context.Provider>
      )
    }
    Styled.displayName = `Kiso(${slot})`
    return Styled
  }
  function withContext<C extends ElementType>(Component: C, slot: S) {
    function Styled(props: ComponentPropsWithRef<C>) {
      const { slots, palette } = useStyles()
      return createElement(Component, {
        ...props,
        'data-slot': slot,
        className: mergeClassName(cx(slots[slot], palette), props.className),
      })
    }
    Styled.displayName = `Kiso(${slot})`
    return Styled
  }
  return { withProvider, withContext, Provider, useStyles }
}
