import { NotificationsLogger } from 'foundryvtt-logger'

import { MODULE_NAME } from './constants'
import { init as initSettings } from './settings'

// TODO: change name to MajorIllusion
import Customizer from './customizer'

declare global {
  interface Window {
    majorIllusion: Customizer
  }
}

function getInstance() {
  return window.majorIllusion
}

Hooks.once('init', function () {
  const logger = new NotificationsLogger(MODULE_NAME)
  initSettings()

  window.majorIllusion = new Customizer(logger)
})

Hooks.once('ready', function () {
  const majorIllusion = getInstance()
  majorIllusion.setPlayerPanelState()
})
