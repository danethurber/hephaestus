import { keyMirror } from 'foundryvtt-utils'

export { version as VERSION } from '../package.json'

export const SPELLS = keyMirror('Hex', 'Hexblade’s Curse')

export const MODULE_NAME = 'feyds-spell-marker' as const
export const MODULE_TITLE = `Feyd's Spell Marker` as const
