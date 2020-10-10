import { NotificationsLogger } from 'foundryvtt-logger'

import {
  Feature,
  css,
  getClassLevel,
  getFeature,
  getSelectedTokens,
  getTargetTokens,
  hasFeature,
  injectStylesheet,
  tmplUnsafe as html,
} from 'foundryvtt-utils'

import { STYLESHEET_NAME, VERSION } from './constants'

export interface AttackPromptValues {
  advantage?: boolean
  disadvantage?: boolean
}

export interface AttackProperties {
  advantage?: boolean
  audacity?: boolean
  booming?: boolean
  critical?: boolean
  cursed?: boolean
  disadvantage?: boolean
  hexed?: boolean
  sneakAttack?: boolean
  versatile?: boolean
}

export interface Field {
  checked?: boolean
  name: string
  label: string
}

export default class HexBuckler {
  public readonly VERSION = VERSION

  private logger: NotificationsLogger
  private stylesheet = css`
    .hb-fields {
      margin-bottom: 10px;
    }
    .hb-field {
      display: flex;
      align-items: center;
    }
    .hb-field--label {
      margin: 3px 0 0 3px;
    }
  `

  constructor(logger: NotificationsLogger) {
    this.logger = logger
    this.logger.info('init')

    injectStylesheet(STYLESHEET_NAME, this.stylesheet)
  }

  public async makeAttack(weaponName: string): Promise<void> {
    const token = this.selectedToken
    const speaker = ChatMessage.getSpeaker({ actor: token.actor })

    const weapon = getFeature(token.actor, weaponName)
    const isHexWeapon = weapon.name === `Feyd's Estoc`
    const isMelee = (weapon.data as any).weaponType === 'martialM'
    const hasVersatile = (weapon.data as any).damage.versatile.length > 0

    const { abilities, attributes } = token.actor.data.data
    const prof = attributes.prof
    const mod = isHexWeapon ? abilities.cha.mod : abilities.dex.mod

    const elvenAccuracy = hasFeature(token.actor, 'Elven Accuracy')
    const audacity = hasFeature(token.actor, 'Rakish Audacity')

    const hexed = await game.feydsSpellMarker.isMarked('Hex')
    const cursed = await game.feydsSpellMarker.isMarked('Hexblade’s Curse')

    const answers = await this.attackPrompt(
      [
        isMelee && { name: 'booming', label: 'Booming Blade', checked: true },
        hasVersatile && { name: 'versatile', label: '2H Versatile' },
      ].filter(Boolean)
    )

    const { advantage, disadvantage } = answers

    let attackFormula = '1d20'
    if (advantage && elvenAccuracy) attackFormula = '3d20kh'
    else if (advantage) attackFormula = '2d20kh'
    else if (disadvantage) attackFormula = '2d20kl'

    attackFormula += ' + @prof + @mod'

    const attack = new Roll(attackFormula, { prof, mod })
    const data = await attack.toMessage({}, { create: false })

    const critLowRange = advantage && cursed ? 19 : 20
    const critical =
      attack.dice[0].rolls.find((r) => !r.discarded).roll >= critLowRange

    const attackProps = { ...answers, audacity, critical, cursed, hexed }
    await ChatMessage.create({
      content: this.renderAttack(weapon, attackProps),
      speaker,
    })

    await ChatMessage.create({ ...data, speaker })
  }

  public async rollBoomingDamage(
    _itemId: string,
    _properties: AttackProperties
  ): Promise<void> {
    const token = this.selectedToken
    const speaker = ChatMessage.getSpeaker({ actor: token.actor })

    const roll = new Roll('1d8')
    const data = roll.toMessage({}, { create: false })

    await ChatMessage.create({ ...data, speaker })
  }

  public async rollDamage(
    itemId: string,
    properties: AttackProperties
  ): Promise<void> {
    const token = this.selectedToken
    const { abilities } = token.actor.data.data
    const mod = abilities.cha.mod

    const speaker = ChatMessage.getSpeaker({ actor: token.actor })

    const items = ((token.actor.data as unknown) as { items: Feature[] }).items
    const weapon = items.find((item) => item._id === itemId)

    const { cursed, hexed, sneakAttack, versatile } = properties

    const rogueLevel = getClassLevel(token.actor, 'Rogue')

    let formula = versatile
      ? (weapon.data as any).damage.versatile
      : (weapon.data as any).damage.parts[0][0]

    if (sneakAttack) formula += ` + ${Math.ceil(rogueLevel / 2)}d6`
    if (hexed) formula += ' + 1d6'
    if (cursed) formula += ' + 2'

    // TODO: option for max critical damage
    const roll = new Roll(formula, { mod })
    const data = roll.toMessage({}, { create: false })

    await ChatMessage.create({ ...data, speaker })
  }

  private async attackPrompt<FieldValues>(
    fields: Field[]
  ): Promise<AttackPromptValues & FieldValues> {
    const content = html`
      <div class="hb-fields">
        ${fields
          .map(
            (field) => html`
              <label class="hb-field">
                <input
                  type="checkbox"
                  name="${field.name}"
                  ${field.checked && 'checked'}
                />
                <span class="hb-field--label">${field.label}</span>
              </label>
            `
          )
          .join('')}
      </div>
    `

    return new Promise((resolve) => {
      const dialog = new Dialog({
        title: 'Attack',
        content,
        buttons: {
          advantage: {
            icon: '<i class="fas fa-check"></i>',
            label: 'Advantage',
            callback: (node) =>
              handleSubmit('advantage', node as JQuery<HTMLElement>),
          },
          normal: {
            label: 'Normal',
            callback: (node) =>
              handleSubmit('normal', node as JQuery<HTMLElement>),
          },
          disadvantage: {
            icon: '<i class="fas fa-times"></i>',
            label: 'Disadvantage',
            callback: (node) =>
              handleSubmit('disadvantage', node as JQuery<HTMLElement>),
          },
        },
        default: 'normal',
      })

      function handleSubmit(
        roll: 'advantage' | 'disadvantage' | 'normal',
        node: JQuery<HTMLElement>
      ) {
        const initialValues = {
          advantage: roll === 'advantage',
          disadvantage: roll === 'disadvantage',
        }

        const values = fields.reduce((acc, field) => {
          const input = node.find<HTMLInputElement>(`[name="${field.name}"]`)[0]
          return { ...acc, [field.name]: input.checked }
        }, initialValues)

        resolve(values as any)
      }

      dialog.render(true)
    })
  }

  private get selectedToken() {
    const [token, ...other] = getSelectedTokens()

    if (!token) throw new Error('please selected a token')
    if (other.length > 0) throw new Error('please selected a single token')

    return token
  }

  private get target() {
    const [token, ...other] = getTargetTokens()

    if (!token) throw new Error('please target a token')
    if (other.length > 0) throw new Error('please target a single token')

    return token
  }

  // https://gitlab.com/foundrynet/dnd5e/-/blob/master/templates/chat/item-card.html
  private renderAttack(item: Feature, properties: AttackProperties): string {
    const token = this.selectedToken
    const { audacity, booming, cursed, hexed, versatile } = properties

    return html`
      <div
        class="dnd5e chat-card item-card"
        data-actor-id="${token.actor.id}"
        data-item-id="${item._id}"
      >
        <div class="item-properties" style="display: none;">
          ${JSON.stringify(properties)}
        </div>

        <header class="card-header flexrow">
          <img
            src="icons/svg/mystery-man.svg"
            title="Feyd's Estoc"
            width="36"
            height="36"
          />
          <h3 class="item-name">${item.name}</h3>
        </header>

        <div class="card-content" style="display: none;">
          ${item.data.description.value}
        </div>

        <div class="card-buttons">
          <button data-hb-action="dmg">Damage</button>
          <button data-hb-action="dmg-sneak">Damage w/Sneak Attack</button>

          ${booming &&
          html`
            <button data-hb-action="dmg-booming">Booming Blade Damage</button>
          `}
        </div>

        <footer class="card-footer">
          ${audacity && html`<span>Rakish Audacity</span>`}
          ${booming && html`<span>Booming Blade</span>`}
          ${cursed && html`<span>Hexblade’s Curse</span>`}
          ${hexed && html`<span>Hex</span>`}
          ${versatile && html`<span>Versatile</span>`}
        </footer>
      </div>
    `
  }
}
