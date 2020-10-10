import { MODULE_NAME } from './constants'

export function init(): void {
  game.settings.register(MODULE_NAME, 'enabled', {
    config: true,
    default: true,
    name: 'Enabled',
    scope: 'client',
    type: Boolean,
  })

  game.settings.register(MODULE_NAME, 'vim', {
    config: true,
    default: false,
    name: 'Vim',
    scope: 'client',
    type: Boolean,
  })
}
