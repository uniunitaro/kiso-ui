// The semanticTokens.colors an app writes in panda.config.ts (README's default, and a custom one).
import { semanticColors, aliases, definePalette } from '../src/theme/tokens'
import { colors as palettes } from '../src/theme/colors'

const { iris, blue, green, amber, red, orange, neutral, slate } = palettes

export const defaultColors = {
  ...semanticColors,
  iris,
  blue,
  green,
  amber,
  red,
  gray: neutral,
  ...aliases({ accent: iris, info: blue, success: green, warning: amber, danger: red }),
}

const brand = definePalette('brand', blue)
export const customColors = {
  ...semanticColors,
  brand,
  blue,
  green,
  orange,
  red,
  gray: slate,
  ...aliases({ accent: brand, info: blue, success: green, warning: orange, danger: red }),
}

export { palettes }
