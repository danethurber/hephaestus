import { NotificationsLogger } from 'foundryvtt-logger'

import { MODULE_NAME } from './constants'
import Editor from './editor'
import { init as initSettings } from './settings'

interface MacroConfig {
  element: Element[]
  id: string
  object: unknown
}

let editor: Editor
let logger: NotificationsLogger

Hooks.on('init', function () {
  initSettings()

  logger = new NotificationsLogger(MODULE_NAME)
  editor = new Editor(logger)
})

Hooks.on('renderMacroConfig', function (config: MacroConfig) {
  const enabled = game.settings.get(MODULE_NAME, 'enabled')
  if (!enabled) return

  const dialog = config.element[0]
  const el = dialog.querySelector<HTMLTextAreaElement>('[name="command"]')

  editor.create(config.id, el)
})

Hooks.on('closeMacroConfig', function (config: MacroConfig) {
  editor.destroy(config.id)
})
