import minimal from '!!raw-loader!../themes/minimal.css'

import { THEME_NAMES } from './constants'

export type Theme = string
export type Themes = { [key in keyof typeof THEME_NAMES]: Theme }

const themes: Themes = { minimal }

export default themes
