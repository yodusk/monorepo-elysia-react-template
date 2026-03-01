import type { NonEmptyArray } from './types'

export function groupBy<T, K extends string>(
  getKey: (item: T) => K,
  items: Array<T>,
): Record<K, Array<T>> {
  return items.reduce(
    (result, item) => {
      const groupKey = getKey(item)
      result[groupKey] ??= []
      result[groupKey].push(item)
      return result
    },
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    {} as Record<K, Array<T>>,
  )
}

export function isEmpty(enumerable: { length: number }): boolean {
  // oxlint-disable-next-line no-magic-numbers
  return enumerable.length === 0
}

export function isNonEmpty<T>(array: Array<T>): array is NonEmptyArray<T> {
  // oxlint-disable-next-line no-magic-numbers
  return array.length > 0
}

export function unique<T>(array: Array<T>): Array<T> {
  return Array.from(new Set(array))
}

export function uniqueBy<T, K extends string>(getKey: (item: T) => K, array: Array<T>): Array<T> {
  const seen = new Set<K>()
  return array.filter((item) => {
    const key = getKey(item)
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

export function mergeCollections<T>(
  comparator: (item1: T, item2: T) => boolean,
  collection1: Array<T>,
  collection2: Array<T>,
) {
  const secondCollectionWithoutDuplicates = collection2.filter(
    (item2) => !collection1.some((item1) => comparator(item1, item2)),
  )
  return collection1.concat(secondCollectionWithoutDuplicates)
}

export function splitIntoChunks<T>(array: Array<T>, chunkSize: number): Array<Array<T>> {
  const chunks: Array<Array<T>> = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}

export function batchProcessArray<T>(
  array: Array<T>,
  batchSize: number,
  processor: (batch: Array<T>) => void,
): void {
  for (let i = 0; i < array.length; i += batchSize) {
    const batch = array.slice(i, i + batchSize)
    processor(batch)
  }
}

export function arrayIntersection<T>(
  array1: Array<T>,
  array2: Array<T>,
  comparator: (item1: T, item2: T) => boolean,
): Array<T> {
  return array1.filter((item1) => array2.some((item2) => comparator(item1, item2)))
}

export function arrayDifference<T>(
  array1: Array<T>,
  array2: Array<T>,
  comparator: (item1: T, item2: T) => boolean,
): Array<T> {
  return array1.filter((item1) => !array2.some((item2) => comparator(item1, item2)))
}

export function indexBy<T, K extends string>(
  getKey: (item: T) => K,
  items: Array<T>,
): Record<K, T> {
  return items.reduce(
    (result, item) => {
      const groupKey = getKey(item)
      result[groupKey] = item
      return result
    },
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    {} as Record<K, T>,
  )
}
