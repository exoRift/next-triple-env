import { type ConfigureRuntimeEnvOptions, configureRuntimeEnv } from 'next-runtime-env/build/configure.js'

import type { ValidatedEnvironment } from './env.js'

/**
 * A script to run before starting a standalone distribution of Next.JS
 * @param env              The env schema
 * @param runtimeEnvConfig Additional configurations for next-runtime-env
 * @see https://github.com/expatfile/next-runtime-env/tree/1.x
 */
export function prestandalone (env: ValidatedEnvironment, runtimeEnvConfig?: ConfigureRuntimeEnvOptions): void {
  configureRuntimeEnv(runtimeEnvConfig)
  env.validate('server')
  env.validate('shared')
  env.validate('static')
}
