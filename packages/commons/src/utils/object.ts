export function mapRecord<T, K extends string, R>(
  mapper: (key: K, item: T) => R,
  record: Record<K, T>,
): Array<R> {
  const result: Array<R> = []
  for (const key in record) {
    result.push(mapper(key, record[key]))
  }
  return result
}

export function jsonParseOrNull(json: string | null): unknown {
  if (!json) {
    return null
  }
  try {
    return JSON.parse(json)
  } catch {
    return null
  }
}
