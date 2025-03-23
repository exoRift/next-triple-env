/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { z } from 'zod'
import { env as runtimeEnv } from 'next-runtime-env'

type RecordInput<Z extends Record<string, z.ZodType>> = {
  [K in keyof Z]: z.input<Z[K]>
}
type RecordOutput<Z extends Record<string, z.ZodType>> = {
  [K in keyof Z]: z.output<Z[K]>
}

type EnvOptions<
TServer extends Record<string, z.ZodType> = {},
TShared extends Record<`NEXT_PLUBLIC_${string}`, z.ZodType> = {},
TStatic extends Record<`NEXT_STATIC_${string}`, z.ZodType> = {}
> = {
  server?: TServer
  shared?: TShared
  static?: TStatic
  skipValidation?: boolean
} & (
  {} extends TStatic
    ? {
      staticEnvVars?: never
    }
    : {
      /** Required for Next static bake */
      staticEnvVars: RecordInput<TStatic>
    }
)

export class ValidatedEnvironment<
TServer extends Record<string, z.ZodType> = {},
TShared extends Record<`NEXT_PLUBLIC_${string}`, z.ZodType> = {},
TStatic extends Record<`NEXT_STATIC_${string}`, z.ZodType> = {}
> {
  private readonly _staticEnv?: RecordInput<TStatic>

  private readonly _validated: {
    server: RecordOutput<TServer> | undefined
    shared: RecordOutput<TShared> | undefined
    static: RecordOutput<TStatic> | undefined
  }

  private readonly _schemas: {
    server?: TServer
    shared?: TShared
    static?: TStatic
  }

  constructor (options: EnvOptions<TServer, TShared, TStatic>) {
    this._staticEnv = options.staticEnvVars

    this._schemas = {
      server: options.server,
      shared: options.shared,
      static: options.static
    }

    this._validated = {
      server: undefined,
      shared: undefined,
      static: undefined
    }
  }

  /**
   * Skip validation for an env schema and default all values to empty strings
   * @param schema The schema to skip (or 'all')
   */
  skip (schema: 'server' | 'shared' | 'static' | 'all'): void {
    switch (schema) {
      case 'all': process.env.SKIP_ENV_VALIDATION = 'server,shared,static'; break
      default: {
        const existing = this.skippedValidations
        existing.add(schema)
        process.env.SKIP_ENV_VALIDATION = Array.from(existing).join(',')
        break
      }
    }
  }

  get skippedValidations (): Set<'server' | 'shared' | 'static'> {
    return new Set(process.env.SKIP_ENV_VALIDATION?.split(',') as Array<'server' | 'shared' | 'static'>)
  }

  /** Server-side env vars */
  get server (): RecordOutput<TServer> {
    if (typeof window !== 'undefined') throw new Error('❌ Tried to access server schema in client environment')

    this.validate('server')
    return this._validated.server!
  }

  /** Server-side and client-side env vars */
  get shared (): RecordOutput<TShared> {
    this.validate('shared')
    return this._validated.shared!
  }

  /** Env vars baked into the build */
  get static (): RecordOutput<TStatic> {
    this.validate('static')
    return this._validated.static!
  }

  /**
   * Validate an env schema
   * @param schema The schema to validate
   */
  validate (schema: 'server' | 'shared' | 'static'): void {
    if (this._validated[schema]) return
    this._validated[schema] = {} as any

    if (!this._schemas[schema]) throw new Error(`❌ Requesting env var from nonexistent schema (${schema})`)

    let failed = false
    for (const key in this._schemas[schema]) {
      let retrieved = schema === 'static'
        ? this._staticEnv?.[key as keyof typeof this._staticEnv]
        : runtimeEnv(key)
      if (retrieved === '') retrieved = undefined

      try {
        const result = ((this._schemas[schema] as any)[key] as z.ZodType).parse(retrieved)

        ;(this._validated[schema] as any)[key] = result
      } catch (err: unknown) {
        failed = true
        if (!this.skippedValidations.has(schema)) console.error('❌ Invalid environment variable: ' + key, err)
      }
    }

    if (failed && !this.skippedValidations.has(schema)) throw new Error(`Environment Validation Failed (${schema})`)
  }
}
