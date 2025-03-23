import { type ConfigureRuntimeEnvOptions, configureRuntimeEnv } from 'next-runtime-env/build/configure.js'

import type { ValidatedEnvironment } from './env.js'

export function prestandalone (env: ValidatedEnvironment, runtimeEnvConfig?: ConfigureRuntimeEnvOptions): void {
  configureRuntimeEnv(runtimeEnvConfig)
  env.validate('server')
  env.validate('shared')
  env.validate('static')
}
