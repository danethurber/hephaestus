import { keyMirror } from 'foundryvtt-utils'

export { version as VERSION } from '../package.json'

export const MODULE_NAME = 'major-illusion' as const
export const MODULE_TITLE = 'Major Illusion' as const

export const HOOKS = keyMirror('majorIllusion:updated')

export const STYLESHEET_NAME = 'major-illusion' as const

const themeNames = ['minimal'] as const
export const THEME_NAMES = keyMirror(...themeNames)
