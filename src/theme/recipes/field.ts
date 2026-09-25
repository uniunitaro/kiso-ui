import { defineSlotRecipe } from '@pandacss/dev'

export const field = defineSlotRecipe({
  className: 'kiso-field',
  jsx: ['Field', /^Field\./],
  slots: ['root', 'label', 'description', 'error'],
  base: {
    root: { display: 'flex', flexDirection: 'column', gap: '1.5', width: 'full' },
    label: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5',
      textAlign: 'start',
      userSelect: 'none',
      color: 'fg.default',
      textStyle: 'label',
      _disabled: { layerStyle: 'disabled' },
    },
    description: { color: 'fg.muted', textStyle: 'sm', _disabled: { layerStyle: 'disabled' } },
    error: { color: 'fg.error', textStyle: 'sm' },
  },
})
