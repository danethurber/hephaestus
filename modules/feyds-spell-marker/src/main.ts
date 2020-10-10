import { NotificationsLogger } from 'foundryvtt-logger'
import { ValueOf } from 'foundryvtt-utils'
import camelCase from 'lodash/camelCase'

import { SPELLS, MODULE_NAME } from './constants'
import { init as initSettings } from './settings'

import SpellMarker from './spell-marker'

Hooks.on('init', function () {
  const logger = new NotificationsLogger(MODULE_NAME)
  initSettings()

  const spellMarker = new SpellMarker(logger)
  const name = camelCase(MODULE_NAME)

  const methods = {
    isMarked: (name: ValueOf<typeof SPELLS>) => spellMarker.isMarked(name),
    mark: (name: ValueOf<typeof SPELLS>) => spellMarker.mark(name),
    unmark: (name: ValueOf<typeof SPELLS>) => spellMarker.unmark(name),
  }

  // @ts-ignore
  mergeObject(game, { [name]: { ...methods } })
})
