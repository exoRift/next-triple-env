import { type ConfigureRuntimeEnvOptions, configureRuntimeEnv } from 'next-runtime-env/build/configure'

import type { ValidatedEnvironment } from './env'

export function prestandalone (env: ValidatedEnvironment, runtimeEnvConfig?: ConfigureRuntimeEnvOptions): void {
  configureRuntimeEnv(runtimeEnvConfig)
  env.validate('server')
  env.validate('shared')
  env.validate('static')
}
