// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { recipes, slotRecipes } from '../src/theme/recipes'
import { button } from '../src/theme/recipes/button'
import { input } from '../src/theme/recipes/input'
import { select } from '../src/theme/recipes/select'
import { combobox } from '../src/theme/recipes/combobox'
import { checkbox } from '../src/theme/recipes/checkbox'
import { radioGroup } from '../src/theme/recipes/radio-group'
import { switchRecipe } from '../src/theme/recipes/switch'
import { slider } from '../src/theme/recipes/slider'
import { tokens, radii } from '../src/theme/tokens'
import { catalog } from '../src/app/catalog'
import { recipeNames } from '../scripts/registry-lib.mjs'

const all = { ...recipes, ...slotRecipes } as Record<
  string,
  { variants?: Record<string, Record<string, unknown>>; staticCss?: unknown[]; jsx?: unknown[] }
>

describe('Park design system contracts', () => {
  it('aligns primary and secondary control scales and leaves variants to extraction', () => {
    const primary = ['8', '9', '10', '11', '12', '16']
    const secondary = ['4', '4.5', '5', '5.5', '6', '8']
    const names = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const
    names.forEach((name, index) => {
      expect(button.variants!.size[name]).toHaveProperty('h', primary[index])
      expect(input.variants!.size[name]).toHaveProperty('--input-height', `sizes.${primary[index]}`)
      expect(select.variants!.size[name]).toHaveProperty('trigger.h', primary[index])
      expect(combobox.variants!.size[name]).toHaveProperty('inputGroup.minH', primary[index])
      expect(checkbox.variants!.size[name]).toHaveProperty('root.boxSize', secondary[index])
      expect(radioGroup.variants!.size[name]).toHaveProperty('item.boxSize', secondary[index])
      expect(switchRecipe.variants!.size[name]).toHaveProperty(
        'root.--switch-height',
        `sizes.${secondary[index]}`,
      )
    })
    // Like Park UI, variants come from JSX extraction; staticCss would emit every size everywhere.
    for (const recipe of Object.values(all)) expect(recipe.staticCss).toBeUndefined()
  })
  it('scales listbox items with the control size', () => {
    expect(select.variants!.size.sm).toHaveProperty('item.minH', '9')
    expect(select.variants!.size.lg).toHaveProperty('item.minH', '11')
    expect(combobox.variants!.size.xl).toHaveProperty('item.minH', '12')
  })
  it('gives each slider size its own thumb and track', () => {
    const sizes = Object.values(slider.variants!.size).map((size) => JSON.stringify(size))
    expect(new Set(sizes).size).toBe(sizes.length)
  })
  it('gives each interactive variant its own palette state roles', () => {
    expect(button.variants!.variant.solid).toMatchObject({
      _hover: { bg: 'colorPalette.solid.bg.hover' },
    })
    expect(button.variants!.variant.subtle).toMatchObject({
      _hover: { bg: 'colorPalette.subtle.bg.hover' },
    })
    expect(button.variants!.variant.surface).toHaveProperty(
      '_hover.borderColor',
      'colorPalette.surface.border.hover',
    )
    expect(button.variants!.variant.outline).toMatchObject({
      _active: { bg: 'colorPalette.outline.bg.active' },
    })
    expect(button.variants!.variant.plain).toMatchObject({
      _hover: { bg: 'colorPalette.plain.bg.hover' },
    })
    expect(checkbox.variants!.variant.solid).toHaveProperty(
      'root._checked.bg',
      'colorPalette.solid.bg',
    )
  })
  it('styles every recipe through colorPalette and Park roles, never removed aliases', () => {
    const removed =
      /^(surface(\.\w+)?|border\.strong|accent(\..*)?|fg|fg\.inverse|overlay|danger|success|warning|pill|control|panel)$/
    const styleKeys =
      /^(bg|background|color|borderColor|outlineColor|focusRingColor|borderRadius|boxShadow|fill|stroke)$/
    function visit(node: unknown, where: string) {
      if (!node || typeof node !== 'object') return
      for (const [key, value] of Object.entries(node)) {
        if (typeof value === 'string' && styleKeys.test(key))
          expect(value, `${where}.${key}`).not.toMatch(removed)
        visit(value, `${where}.${key}`)
      }
    }
    for (const [name, recipe] of Object.entries(all)) {
      visit(recipe, name)
      // Components inherit the accent through colorPalette instead of naming it.
      expect(JSON.stringify(recipe), name).not.toContain('"accent.')
    }
    for (const name of [
      'button',
      'checkbox',
      'radioGroup',
      'switchRecipe',
      'slider',
      'tabs',
      'progress',
      'badge',
      'alert',
      'avatar',
      'toggle',
    ])
      expect(JSON.stringify(all[name]), name).toContain('colorPalette.')
  })
  it('lets Panda extract colorPalette from component props', () => {
    for (const [name, recipe] of Object.entries(all))
      if (!['form', 'checkboxGroup', 'buttonGroup', 'pagination'].includes(name))
        expect(recipe.jsx?.length, name).toBeGreaterThan(0)
  })
  it('keeps the docs catalog in step with the recipes', () => {
    for (const entry of catalog) {
      const recipe = all[recipeNames[entry.id]?.[0]]
      if (!recipe) continue
      const variants = Object.keys(recipe.variants?.variant ?? {})
      const sizes = Object.keys(recipe.variants?.size ?? {})
      if (entry.variants)
        expect(entry.variants.slice().sort(), entry.id).toEqual(variants.slice().sort())
      if (entry.sizes && entry.id !== 'pagination')
        expect(entry.sizes.slice().sort(), entry.id).toEqual(sizes.slice().sort())
      // The first choice in the docs is the recipe default.
      const defaults = (recipe as { defaultVariants?: Record<string, string> }).defaultVariants
      if (entry.variants && defaults?.variant)
        expect(entry.variants[0], entry.id).toBe(defaults.variant)
    }
  })
  it('keeps nested radii and overlays in the upstream order', () => {
    expect(radii.l1.value).toBe('{radii.xs}')
    expect(radii.l2.value).toBe('{radii.sm}')
    expect(radii.l3.value).toBe('{radii.md}')
    expect(
      ['overlay', 'modal', 'popover', 'toast', 'tooltip'].map(
        (key) => tokens.zIndex[key as keyof typeof tokens.zIndex].value,
      ),
    ).toEqual([1300, 1400, 1500, 1700, 1800])
  })
})
