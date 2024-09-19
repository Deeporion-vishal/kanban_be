/**
 * Utility function for exhaustive switch checks
 * https://stackoverflow.com/questions/39419170/how-do-i-check-that-a-switch-block-is-exhaustive-in-typescript
 */
export const assertUnreachable = (_arg: never) => {};

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Strongly typed version of Object.keys()
 * @param obj If undefined, returns an empty array
 * @returns
 */
export const getTypedKeys = <T extends object>(obj?: T): (keyof T)[] =>
  (obj ? Object.keys(obj) : []) as (keyof T)[];

/**
 * https://stackoverflow.com/questions/53662208/types-from-both-keys-and-values-of-object-in-typescript
 * @param obj
 * @returns
 */
export const getTypedEntries = <T>(
  obj: T
): [keyof T, Exclude<T[keyof T], undefined>][] =>
  Object.entries(obj) as [keyof T, Exclude<T[keyof T], undefined>][];

export const ofType = <T>(obj: T): T => obj;

// https://stackoverflow.com/questions/59455679/typescript-type-definition-for-an-object-property-path
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, ...0[]];

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never;
export type DeepKeyof<T, D extends number = 2> = [D] extends [never]
  ? never
  : T extends any[]
  ? never
  : T extends Date
  ? never
  : T extends object
  ? {
      [K in keyof T]-?: K extends string | number
        ? `${K}` | Join<K, DeepKeyof<T[K], Prev[D]>>
        : never;
    }[keyof T]
  : "";

