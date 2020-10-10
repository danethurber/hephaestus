import { titleCase } from 'foundryvtt-utils'

import { MODULE_NAME, THEME_NAMES } from './constants'

export function init(): void {
  const rerender = () => console.log('TODO: rerender ui')

  game.settings.register(MODULE_NAME, 'theme', {
    choices: buildChoices<keyof typeof THEME_NAMES>(THEME_NAMES),
    config: true,
    default: 'none',
    onChange: rerender,
    name: 'Theme',
    scope: 'world',
    type: String,
  })
}

function buildChoices<K extends string>(
  entries: Record<K, string>,
  fallback = { none: '' }
): Record<string, string> {
  return Object.keys(entries).reduce((acc, key) => {
    const val = entries[key]
    return { ...acc, [key]: titleCase(val) }
  }, fallback)
}
