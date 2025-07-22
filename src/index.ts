/* eslint-disable @typescript-eslint/no-empty-object-type */
import type z from 'zod'

import { ValidatedEnvironment } from './env.js'

/**
 * Create a singleton env
 * @param params The constructor params for a validated environment
 * @returns      The validated environment
 */
export function createEnv<
const TServer extends Record<string, z.ZodType> = {},
const TShared extends Record<`NEXT_PLUBLIC_${string}`, z.ZodType> = {},
const TStatic extends Record<`NEXT_STATIC_${string}`, z.ZodType> = {}
> (...params: ConstructorParameters<typeof ValidatedEnvironment<TServer, TShared, TStatic>>): ValidatedEnvironment<TServer, TShared, TStatic> {
  // @ts-expect-error -- We want this to be a singleton and we want the automatic type inference so we don't declare its type on global
  return ((global._env as undefined) ??= new ValidatedEnvironment(...params)) /* eslint-disable-line @typescript-eslint/no-unnecessary-condition */
}
