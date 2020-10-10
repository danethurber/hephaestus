import { NotificationsLogger } from 'foundryvtt-logger'
import camelCase from 'lodash/camelCase'

import { MODULE_NAME } from './constants'
import HexBuckler from './hexbuckler'

const logger = new NotificationsLogger(MODULE_NAME)
const name = camelCase(MODULE_NAME)

Hooks.on('init', function () {
  const hb = new HexBuckler(logger)

  const methods = {
    makeAttack: (item: string) => hb.makeAttack(item),
    rollBoomingDamage: (i, o) => hb.rollBoomingDamage(i, o),
    rollDamage: (i, o) => hb.rollDamage(i, o),
  }

  // @ts-ignore
  mergeObject(game, { [name]: { ...methods } })
})

Hooks.on('renderChatMessage', function (
  _msg: unknown,
  node: JQuery<HTMLElement>
) {
  const dmg = node.find<HTMLButtonElement>(`[data-hb-action="dmg"]`)
  const sneak = node.find<HTMLButtonElement>(`[data-hb-action="dmg-sneak"]`)
  const booming = node.find<HTMLButtonElement>(`[data-hb-action="dmg-booming"]`)

  if (dmg) {
    dmg.on('click', function (evt) {
      const cardEl = evt.target.closest<HTMLDivElement>('[data-item-id]')
      const props = JSON.parse(node.find(`.item-properties`)[0].innerText)

      game[name].rollDamage(cardEl.dataset.itemId, props)
    })
  }

  if (sneak) {
    sneak.on('click', function (evt) {
      const cardEl = evt.target.closest<HTMLDivElement>('[data-item-id]')
      const props = JSON.parse(node.find(`.item-properties`)[0].innerText)

      game[name].rollDamage(cardEl.dataset.itemId, {
        ...props,
        sneakAttack: true,
      })
    })
  }

  if (booming) {
    booming.on('click', function (evt) {
      const cardEl = evt.target.closest<HTMLDivElement>('[data-item-id]')
      const props = JSON.parse(node.find(`.item-properties`)[0].innerText)

      game[name].rollBoomingDamage(cardEl.dataset.itemId, props)
    })
  }
})
