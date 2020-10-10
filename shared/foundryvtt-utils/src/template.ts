function sanitize(val: string) {
  const map = {
    "'": '&#x27;',
    '"': '&quot;',
    '&': '&amp;',
    '/': '&#x2F;',
    '<': '&lt;',
    '>': '&gt;',
    '`': '&grave;',
  }
  const reg = /[&<>"'/]/gi

  return val.replace(reg, (match) => map[match])
}

export function tmpl(
  strings: TemplateStringsArray,
  ...values: string[]
): string {
  const evaluated = strings.reduce((acc: string[], string, i) => {
    acc.push(string)
    if (values[i]) acc.push(sanitize(values[i]))

    return acc
  }, [])

  return evaluated.join('')
}

export function tmplUnsafe(
  strings: TemplateStringsArray,
  ...values: string[]
): string {
  const evaluated = strings.reduce((acc: string[], string, i) => {
    acc.push(string)
    if (values[i]) acc.push(values[i])

    return acc
  }, [])

  return evaluated.join('')
}
