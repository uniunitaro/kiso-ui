import { describe, expect, it } from 'vitest'
import { button } from '../src/theme/recipes/button'
import { input } from '../src/theme/recipes/input'
import { select } from '../src/theme/recipes/select'
import { combobox } from '../src/theme/recipes/combobox'
import { checkbox } from '../src/theme/recipes/checkbox'
import { switchRecipe } from '../src/theme/recipes/switch'
import { tokens, semanticTokens, createSemanticTokens, palettes } from '../src/theme/tokens'

describe('Park design system contracts', () => {
  it('aligns primary and secondary control scales and preserves responsive generation', () => {
    const primary = ['8', '9', '10', '11', '12', '16']
    const secondary = ['4', '4.5', '5', '5.5', '6', '8']
    const names = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const
    names.forEach((name, index) => {
      expect(button.variants!.size[name]).toHaveProperty('h', primary[index])
      expect(input.variants!.size[name]).toHaveProperty('h', primary[index])
      expect(select.variants!.size[name]).toHaveProperty('trigger.h', primary[index])
      expect(combobox.variants!.size[name]).toHaveProperty('inputGroup.minH', primary[index])
      expect(checkbox.variants!.size[name]).toHaveProperty('root.h', secondary[index])
      expect(switchRecipe.variants!.size[name]).toHaveProperty(
        'root.h',
        Number(secondary[index]) * 4 + 'px',
      )
    })
    for (const recipe of [button, input, select, combobox, checkbox, switchRecipe])
      expect(recipe.staticCss).toContainEqual({ size: ['*'], responsive: true })
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
  })
  it('keeps nested radii and overlays in the upstream order', () => {
    expect(semanticTokens.radii.l1.value).toContain('{radii.xs}')
    expect(semanticTokens.radii.l2.value).toContain('{radii.sm}')
    expect(semanticTokens.radii.l3.value).toContain('{radii.md}')
    expect(
      ['overlay', 'modal', 'popover', 'toast', 'tooltip'].map(
        (key) => tokens.zIndex[key as keyof typeof tokens.zIndex].value,
      ),
    ).toEqual([1300, 1400, 1500, 1700, 1800])
  })
  it('rebases added palettes so edits affect their own variants and global accent', () => {
    const theme = createSemanticTokens({
      accentColor: 'brand',
      additionalColors: {
        brand: { ...palettes.blue, 9: { value: { base: '#123456', _dark: '#654321' } } },
      },
    })
    expect(theme.colors).toMatchObject({
      brand: { solid: { bg: { DEFAULT: { value: { base: '{colors.brand.9}' } } } } },
    })
    expect(theme.colors.accent).toHaveProperty('solid')
    expect(() => createSemanticTokens({ accentColor: 'missing' })).toThrow('Unknown accent palette')
  })
})
