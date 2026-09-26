import { defineSlotRecipe } from '@pandacss/dev'

const input = '.kiso-input'
const element = '.kiso-input-group__element'
const addon = '.kiso-input-group__addon'

// Icons or small buttons inside an Input (Element) and text attached beside it (Addon). The Input
// keeps its own variant and size; the group makes room from the Input's --input-height, so a
// responsive size stays in step.
export const inputGroup = defineSlotRecipe({
  className: 'kiso-input-group',
  jsx: ['InputGroup', /^InputGroup\./],
  slots: ['root', 'element', 'addon'],
  base: {
    root: {
      position: 'relative',
      isolation: 'isolate',
      display: 'flex',
      alignItems: 'stretch',
      width: 'full',
      // Room for an Element before or after the Input. `!` also beats the flushed variant's px.
      [`& > ${element} ~ ${input}`]: { ps: 'var(--input-height)!' },
      [`& > ${input}:has(~ ${element})`]: { pe: 'var(--input-height)!' },
      // Attached addons square the corners they meet; the focus ring stays on top.
      [`& > ${addon} ~ ${input}`]: { borderStartStartRadius: '0', borderEndStartRadius: '0' },
      [`& > ${input}:has(~ ${addon})`]: { borderStartEndRadius: '0', borderEndEndRadius: '0' },
      [`& > ${input}:focus-visible`]: { zIndex: '1' },
    },
    element: {
      position: 'absolute',
      top: '0',
      bottom: '0',
      zIndex: '2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // As wide as the Input is tall.
      aspectRatio: '1',
      color: 'fg.muted',
      textStyle: 'sm',
      // Clicks on an icon reach the Input; buttons and links inside still work.
      pointerEvents: 'none',
      [`&:has(~ ${input})`]: { insetInlineStart: '0' },
      [`${input} ~ &`]: { insetInlineEnd: '0' },
      '& :is(button, a, [role=button])': { pointerEvents: 'auto' },
      '& > svg': { boxSize: '45%' },
    },
    addon: {
      display: 'flex',
      alignItems: 'center',
      flexShrink: '0',
      px: '3',
      textStyle: 'sm',
      whiteSpace: 'nowrap',
      color: 'fg.muted',
      bg: 'gray.subtle.bg',
      borderWidth: '1px',
      borderColor: 'gray.outline.border',
      borderRadius: 'l2',
      [`&:has(~ ${input})`]: {
        borderInlineEndWidth: '0',
        borderStartEndRadius: '0',
        borderEndEndRadius: '0',
      },
      [`${input} ~ &`]: {
        borderInlineStartWidth: '0',
        borderStartStartRadius: '0',
        borderEndStartRadius: '0',
      },
    },
  },
})
