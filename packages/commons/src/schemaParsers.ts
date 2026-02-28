import type { z } from 'zod'

export function isNotNull<T>(element: T | null): element is T {
  return element !== null
}

function camelCaseDeep(obj: unknown): unknown {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(camelCaseDeep)
  }

  if (obj instanceof Date) {
    return obj
  }

  const newObj: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    newObj[key.replace(/_(.)/g, (_, $1: string) => $1.toUpperCase())] = camelCaseDeep(value)
  }
  return newObj
}

export function snakeCaseDeep(obj: unknown): unknown {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(snakeCaseDeep)
  }

  if (obj instanceof Date) {
    return obj
  }

  const newObj: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    newObj[key.replace(/[A-Z]/g, ($1: string) => `_${$1.toLowerCase()}`)] = snakeCaseDeep(value)
  }
  return newObj
}

export function snakeCaseToCamelCase(str: string): string {
  return str.replace(/_(.)/g, (_, $1: string) => $1.toUpperCase())
}

export function parseItems<T extends z.ZodTypeAny>(
  parser: T,
  items?: Record<string, unknown>[] | null,
): z.output<T>[] {
  return (items ?? []).map((item) => parseItem(parser, item)).filter(isNotNull)
}

export function parseItem<T extends z.ZodTypeAny>(
  parser: T,
  item?: Record<string, unknown> | null,
  camelCase = true,
): z.output<T> | null {
  const result = parser.safeParse(item && camelCase ? camelCaseDeep(item) : item)

  if (!result.success) {
    // eslint-disable-next-line no-console
    console.error('Incomplete data in entity', result.error)
    return null
  }

  return result.data
}

export function parseItemStrict<T extends z.ZodTypeAny>(
  parser: T,
  item?: Record<string, unknown> | null,
  camelCase = true,
): z.output<T> {
  return parser.parse(item && camelCase ? camelCaseDeep(item) : item)
}

export function parseItemsStrict<T extends z.ZodTypeAny>(
  parser: T,
  items?: Record<string, unknown>[] | null,
): z.output<T>[] {
  return (items ?? []).map((item) => parseItemStrict(parser, item))
}

export function isEnum<T extends z.ZodTypeAny>(parser: T, item?: string | null): boolean {
  return parser.safeParse(item).success
}
