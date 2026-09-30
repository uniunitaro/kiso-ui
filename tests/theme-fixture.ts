// The semanticTokens.colors an app writes in panda.config.ts (README's default, and a custom one).
import { semanticColors, definePalette } from '../src/theme/tokens'
import { colors as palettes } from '../src/theme/colors'

const { iris, blue, green, amber, red, orange, neutral, slate } = palettes

export const defaultColors = {
  ...semanticColors,
  gray: neutral,
  accent: definePalette('accent', iris),
  info: definePalette('info', blue),
  success: definePalette('success', green),
  warning: definePalette('warning', amber),
  danger: definePalette('danger', red),
}

const brand = definePalette('brand', blue)
export const customColors = {
  ...semanticColors,
  gray: slate,
  accent: definePalette('accent', brand),
  info: definePalette('info', blue),
  success: definePalette('success', green),
  warning: definePalette('warning', orange),
  danger: definePalette('danger', red),
  brand,
  // Listed as is only to use colorPalette="red" directly.
  red,
}

export { palettes }
