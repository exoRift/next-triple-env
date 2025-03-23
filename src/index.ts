/* eslint-disable @typescript-eslint/no-empty-object-type */
import type z from 'zod'

import { ValidatedEnvironment } from './env.js'

export function createEnv<
TServer extends Record<string, z.ZodType> = {},
TShared extends Record<`NEXT_PLUBLIC_${string}`, z.ZodType> = {},
TStatic extends Record<`NEXT_STATIC_${string}`, z.ZodType> = {}
> (...params: ConstructorParameters<typeof ValidatedEnvironment<TServer, TShared, TStatic>>): ValidatedEnvironment {
  // @ts-expect-error -- We want this to be a singleton and we want the automatic type inference so we don't declare its type on global
  return ((global._env as undefined) ??= new ValidatedEnvironment(...params)) /* eslint-disable-line @typescript-eslint/no-unnecessary-condition */
}

export { config } from './config.js'
export { prestandalone } from './prestandalone.js'
