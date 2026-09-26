// Types for the parts of panda-config.mjs that TypeScript tests read.
import type { Palettes } from '../src/app/panda-config-template.ts'

export { defaultPalettes, pandaConfigTemplate } from '../src/app/panda-config-template.ts'
/** Adds Kiso to an existing panda.config.ts; any conflict means nothing should be written. */
export declare function mergePandaConfig(
  source: string,
  palettes?: Palettes,
): { content: string; conflicts: string[] }
