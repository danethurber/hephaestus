import { isUndefined } from '.'

export interface Feature {
  _id: string
  data: FeatureData
  name: string
  img: string
}

export interface FeatureData {
  description: { value: any }
  properties: Record<string, any>
  levels?: number
}

export const getClassLevel = (a: Actor, name: string): number => {
  const feature = getFeature(a, name)

  if (isUndefined(feature)) return 0
  return feature.data.levels
}

export const getFeature = (a: Actor, name: string): Feature => {
  const items = ((a.data as unknown) as { items: Feature[] }).items
  const feature = items.find((item) => item.name === name)

  return feature
}

export const hasFeature = (a: Actor, name: string): boolean => {
  const items = ((a.data as unknown) as { items: Feature[] }).items
  const feature = items.find((item) => item.name === name)

  return !isUndefined(feature)
}

export const getFlag = async <F>(a: Actor, name: string): Promise<F> => {
  const flag = await a.getFlag('world', name)
  return flag && (JSON.parse(flag) as F)
}

export const hasFlag = async (a: Actor, name: string): Promise<boolean> => {
  const value = await getFlag(a, name)
  return !isUndefined(value)
}

export const setFlag = async <F>(
  a: Actor,
  name: string,
  data: F
): Promise<void> => {
  const value = JSON.stringify(data)
  await a.setFlag('world', name, value)
}
