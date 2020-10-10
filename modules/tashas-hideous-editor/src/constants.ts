import { keyMirror } from 'foundryvtt-utils'

export { version as VERSION } from '../package.json'

export const MODULE_NAME = 'tashas-editor' as const
export const MODULE_TITLE = `Tasha's Hideous Editor` as const

export const HOOKS = keyMirror('vimUpdated')
