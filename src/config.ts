/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { z } from 'zod'
import type { NextConfig } from 'next'
import { type ConfigureRuntimeEnvOptions, configureRuntimeEnv } from 'next-runtime-env/build/configure.js'
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER } from 'next/constants.js'

import type { ValidatedEnvironment } from './env.js'

/**
 * Configure Next.JS to support triple-env. For use in next.config.[ts|mjs]
 * @param env              The created validated environment
 * @param nextConfig       Your regular next config
 * @param runtimeEnvConfig Additional options for next-runtime-env
 * @see https://github.com/expatfile/next-runtime-env/tree/1.x
 * @returns                Your augmented Next.JS config
 */
export function config<
TServer extends Record<string, z.ZodType> = {},
TShared extends Record<`NEXT_PLUBLIC_${string}`, z.ZodType> = {},
TStatic extends Record<`NEXT_STATIC_${string}`, z.ZodType> = {}
> (env: ValidatedEnvironment<TServer, TShared, TStatic>, nextConfig?: NextConfig, runtimeEnvConfig?: ConfigureRuntimeEnvOptions) {
  return function (phase: string): NextConfig {
    if (!process.argv.includes('lint')) configureRuntimeEnv(runtimeEnvConfig)
    switch (phase) {
      case PHASE_PRODUCTION_BUILD:
        env.skip('server')
        env.skip('shared')
        env.validate('static')
        break
      case PHASE_DEVELOPMENT_SERVER:
      case PHASE_PRODUCTION_SERVER:
        env.validate('server')
        env.validate('shared')
        env.validate('static')
        break
    }

    return {
      env: {
        ...(env as any)._staticEnv,
        ...nextConfig?.env
      },
      ...nextConfig
    }
  }
}
