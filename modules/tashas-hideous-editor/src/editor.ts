import * as ace from 'ace-builds'
import 'ace-builds/src-noconflict/keybinding-vim'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-twilight'

import { NotificationsLogger } from 'foundryvtt-logger'
import { css, injectStylesheet } from 'foundryvtt-utils'

import { MODULE_NAME, VERSION } from './constants'

export default class Editor {
  public readonly VERSION = VERSION

  private logger: NotificationsLogger
  private cache: Record<string, ace.Ace.Editor> = {}

  private readonly stylesheet = css`
    .tashas-editor {
      height: calc(100% - 24px);
      width: 100%;
    }
  `
  private readonly theme: string = 'twilight'
  private readonly vim: boolean = game.settings.get(MODULE_NAME, 'vim')

  constructor(logger: NotificationsLogger) {
    this.logger = logger
    this.logger.info('init')

    this.addStyles()
  }

  public create<E extends HTMLTextAreaElement>(id: string, field: E): void {
    const el = document.createElement('div')
    el.classList.add('tashas-editor')

    field.setAttribute('style', 'display: none;')
    field.parentNode.appendChild(el)

    const editor = this.createEditor(el)
    this.cache[id] = editor

    const session = editor.getSession()
    session.setValue(field.value)

    session.on('change' as any, function () {
      field.value = session.getValue()
    })
  }

  public destroy(id: string): void {
    const editor = this.cache[id]

    if (!editor) {
      this.logger.warn(`session ${id} not found`)
      return
    }

    this.cache[id] = undefined
    editor.destroy()
  }

  private addStyles() {
    this.logger.info('adding editor styles')
    injectStylesheet('tashas-editor-stylesheet', this.stylesheet)
  }

  private createEditor<E extends HTMLElement>(el: E): ace.Ace.Editor {
    const editor = ace.edit(el, {
      tabSize: 2,
      mode: `ace/mode/javascript`,
    })

    if (this.theme) editor.setTheme(`ace/theme/${this.theme}`)
    if (this.vim) editor.setKeyboardHandler('ace/keyboard/vim')

    const observer = new ResizeObserver(() => {
      editor.resize()
      editor.renderer.updateFull()
    })
    observer.observe(editor.container)

    return editor
  }
}
