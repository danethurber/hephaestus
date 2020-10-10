export { tmpl as css } from './template'

const prefix = 'custom-style-'

export function injectStylesheet(name: string, rules: string): void {
  const id = prefix + name

  const style = document.getElementById(id) || document.createElement('style')
  style.setAttribute('id', id)
  style.setAttribute('type', 'text/css')
  style.textContent = rules

  document.head.appendChild(style)
}
