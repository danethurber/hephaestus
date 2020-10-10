import { NotificationsLogger } from 'foundryvtt-logger'
import {
  ValueOf,
  getFlag,
  getSelectedTokens,
  getTargetTokens,
  hasFeature,
  setFlag,
} from 'foundryvtt-utils'

import { SPELLS, VERSION } from './constants'

export const hasSpell = (a: Actor, name: ValueOf<typeof SPELLS>): boolean => {
  return hasFeature(a, name)
}
interface MarkerFlag {
  active: boolean
  spellName: ValueOf<typeof SPELLS>
  targetId: string
}

export default class SpellMarker {
  public readonly VERSION = VERSION
  public readonly PREFIX = 'marker:'

  private logger: NotificationsLogger

  constructor(logger: NotificationsLogger) {
    this.logger = logger
    this.logger.info('init')
  }

  public async mark(name: ValueOf<typeof SPELLS>): Promise<void> {
    this.logger.info(`marking with spell ${name}`)
    const flag = this.toFlagName(name)

    const token = this.selectedToken
    const target = this.spellTarget

    const canCast = hasSpell(token.actor, name)
    if (!canCast) throw new Error(`Select token cannot cast ${name}`)

    const msg: unknown = await game.dnd5e.rollItemMacro(name)
    if (!msg) return

    const value = { active: true, targetId: target.id, spellName: name }
    await setFlag<MarkerFlag>(token.actor, flag, value)
  }

  public async isMarked(name: ValueOf<typeof SPELLS>): Promise<boolean> {
    const flag = this.toFlagName(name)

    const token = this.selectedToken
    const target = this.spellTarget

    const value = await getFlag<MarkerFlag>(token.actor, flag)
    if (!value || value.targetId !== target.id) return false

    return value.spellName === name && value.active
  }

  public async unmark(name: ValueOf<typeof SPELLS>): Promise<void> {
    this.logger.info(`removing ${name}`)

    const marked = await this.isMarked(name)
    if (!marked) return

    const flag = this.toFlagName(name)

    const token = this.selectedToken
    const target = this.spellTarget

    const value = { active: false, targetId: target.id, spellName: name }
    await setFlag<MarkerFlag>(token.actor, flag, value)
  }

  private get selectedToken() {
    const [token, ...other] = getSelectedTokens()

    if (!token) throw new Error('please selected a token')
    if (other.length > 0) throw new Error('please selected a single token')

    return token
  }

  private get spellTarget() {
    const [token, ...other] = getTargetTokens()

    if (!token) throw new Error('please target a token')
    if (other.length > 0) throw new Error('please target a single token')

    return token
  }

  private toFlagName(name: ValueOf<typeof SPELLS>): string {
    return this.PREFIX + name
  }
}
