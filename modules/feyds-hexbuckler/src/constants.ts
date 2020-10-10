import { keyMirror } from 'foundryvtt-utils'

export { version as VERSION } from '../package.json'

export const CLASSES = keyMirror('Warlock', 'Rogue')

export const MODULE_NAME = 'feyds-hexbuckler' as const
export const MODULE_TITLE = `Feyd's HexBuckler` as const

export const STYLESHEET_NAME = 'feyds-hexbuckler' as const
