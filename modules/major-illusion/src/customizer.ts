import { NotificationsLogger } from 'foundryvtt-logger'
import { injectStylesheet } from 'foundryvtt-utils'

import { MODULE_NAME, STYLESHEET_NAME, THEME_NAMES, VERSION } from './constants'

import themes from './themes'

interface UIPlayers {
  close: () => void
  render: (next: boolean) => void
  rendered: boolean
}

export default class Customizer {
  public VERSION = VERSION

  private root: HTMLElement
  private logger: NotificationsLogger
  private themeName: keyof typeof THEME_NAMES

  constructor(logger: NotificationsLogger) {
    this.root = document.documentElement

    this.logger = logger
    this.logger.info('init')

    this.init()
  }

  public setPlayerPanelState(show = false): void {
    if (show) this.showPlayerPanel()
    else this.hidePlayerPanel()
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

  private hidePlayerPanel() {
    const players: UIPlayers = (ui as any).players
    this.logger.info('hiding players panel')
    players.close()

    this.root.setAttribute('data-mi-players-hide', 'true')
  }

  private showPlayerPanel() {
    const players: UIPlayers = (ui as any).players
    this.logger.info('showing players panel')
    players.render(true)

    this.root.removeAttribute('data-mi-players-hide')
  }
}
