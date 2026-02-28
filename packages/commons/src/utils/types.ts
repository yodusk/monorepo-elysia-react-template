export type LooseAutocomplete<T> = T | (string & {})

export type ValueOf<T> = T[keyof T]

export type Nullable<T> = T | null

export type Optional<T> = T | undefined

export type Maybe<T> = T | null | undefined

export type NonEmptyArray<T> = [T, ...T[]]

export type Merge<T, U> = Omit<T, keyof U> & U

export function assertUnreachable(_x: never): never {
  throw new Error("Didn't expect to get here")
}

export type Awaitable<T> = T | Promise<T>
export type Awaited<T> = T extends Promise<infer U> ? U : T

export function mapOptional<T, R>(value: Optional<T>, fn: (value: T) => R): Optional<R> {
  // oxlint-disable-next-line no-undefined
  return value === undefined ? undefined : fn(value)
}

export function mapNullable<T, R>(value: Nullable<T>, fn: (value: T) => R): Nullable<R> {
  return value === null ? null : fn(value)
}

export function mapMaybe<T, R>(value: Maybe<T>, fn: (value: T) => R): Maybe<R> {
  // oxlint-disable-next-line no-undefined
  if (value === null || value === undefined) {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    return value as Maybe<R>
  }
  return fn(value)
}
