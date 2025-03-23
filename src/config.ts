import type { NextConfig } from 'next'
import { type ConfigureRuntimeEnvOptions, configureRuntimeEnv } from 'next-runtime-env/build/configure'
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER } from 'next/constants'

import type { ValidatedEnvironment } from './env'

export function config (env: ValidatedEnvironment, nextConfig?: NextConfig, runtimeEnvConfig?: ConfigureRuntimeEnvOptions) {
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
        ...env.static,
        ...nextConfig?.env
      },
      ...nextConfig
    }
  }
}
