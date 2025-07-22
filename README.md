# next-triple-env

This is a package that allows you to construct a [Zod](https://github.com/colinhacks/zod)-validated 3-environment schema for Next.JS **Pages Router**.

Inspired by [t3-env](https://github.com/t3-oss/t3-env)

Uses [next-runtime-env](https://github.com/expatfile/next-runtime-env) version 1

## Environments
`server` - Accessible only on the server (live env vars)

`shared` - Accessible on the server and the client (live env vars)
> [!NOTE]
> These variables are prefixed with `NEXT_PUBLIC_`

`static` - Accessible on the server and the client (baked in on build)
> [!NOTE]
> These variables are prefixed with `NEXT_STATIC_`

When server variables are accessed from a browser context, an error will be thrown.
When in dev mode, each schema will be separately validated upon access.
When building, only the static schema will be validated.
On production start, all schemas will be validatd.

## Example usage
Create a file `env.ts`

```ts
import { createEnv } from 'next-triple-env'

export const env = createEnv({
  server: {
    TOKEN_SECRET: z.string(),
    TOKEN_EXPIRATION_MINUTES: z.coerce.number()
  },
  shared: {
    NEXT_PUBLIC_API_URL: z.string()
  },
  static: {
    NEXT_STATIC_GOOGLE_ANALYTICS_TAG: z.string().optional()
  },

  staticEnvVars: {
    NEXT_STATIC_GOOGLE_ANALYTICS_TAG: process.env.NEXT_STATIC_GOOGLE_ANALYTICS_TAG
  }
})
```

Edit your Next config:

```ts
import { config } from 'next-triple-env/config'
import { env } from './env'

export default config(env, {
  // ...your config
}, {
  // ...next-runtime-env config
})
```

Now use this file anywhere:

```ts
import { env } from './env'

console.log(env.shared.NEXT_PUBLIC_API_URL)
```

## Standalone
If using `output: 'standalone'`, you can set up a script to run before starting your server

```ts
// prestandalone.ts
import { prestandalone } from 'next-triple-env/prestandalone'
import { env } from './env'

prestandalone(env, {
  // ...next-runtime-env config
})
```

## Disabling Validation
Besides for `env.skip()`, validation can be skipped by setting the `SKIP_ENV_VALIDATION` environment variable.

The value can be any permutation of the 3 environments (`server`, `shared`, `static`) joined by commas without spaces, or `all` or `true` for all 3 environments.
