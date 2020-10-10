import { NotificationsLogger } from 'foundryvtt-logger'
import { injectStylesheet } from 'foundryvtt-utils'

import { MODULE_NAME, STYLESHEET_NAME, THEME_NAMES, VERSION } from './constants'

import themes from './themes'

export default class Customizer {
  public VERSION = VERSION

  private logger: NotificationsLogger
  private themeName: keyof typeof THEME_NAMES

  constructor(logger: NotificationsLogger) {
    this.logger = logger
    this.logger.info('init')

    this.init()
  }

  private init() {
    this.themeName = game.settings.get(MODULE_NAME, 'theme')
    this.apply()
  }

  private apply() {
    const theme = themes[this.themeName]
    if (!theme) return

    this.logger.info('applying theme', this.themeName)
    injectStylesheet(STYLESHEET_NAME, theme)
  }
}
