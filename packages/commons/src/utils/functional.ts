export type Predicate<T> = (item: T) => boolean

export function and<T>(...predicates: Array<Predicate<T>>): Predicate<T> {
  return (item: T) => predicates.every((predicate) => predicate(item))
}

export function or<T>(...predicates: Array<Predicate<T>>): Predicate<T> {
  return (item: T) => predicates.some((predicate) => predicate(item))
}

export function not<T>(predicate: Predicate<T>): Predicate<T> {
  return (item: T) => !predicate(item)
}
