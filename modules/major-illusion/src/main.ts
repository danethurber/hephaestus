import { NotificationsLogger } from 'foundryvtt-logger'

import { MODULE_NAME } from './constants'
import Customizer from './customizer'
import { init as initSettings } from './settings'

Hooks.on('init', function () {
  const logger = new NotificationsLogger(MODULE_NAME)
  initSettings()

  window['customizer'] = new Customizer(logger)
})

Hooks.on('ready', function () {
  //
})
