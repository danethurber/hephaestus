import { camelCase, startCase } from 'lodash'

export function titleCase(val: string): string {
  return startCase(camelCase(val))
}
