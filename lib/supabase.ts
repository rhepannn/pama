import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

function createMockClient() {
  const empty = { data: [], error: null }
  const resolveThen = (resolve: Function) => resolve(empty)

  function builder(): any {
    return new Proxy({ then: resolveThen }, {
      get: (_, prop) => {
        if (prop === 'then') return resolveThen
        return () => builder()
      },
    })
  }

  return {
    from: () => ({
      select: builder,
      insert: builder,
      update: builder,
      delete: builder,
      upsert: builder,
      eq: () => builder(),
      neq: () => builder(),
      gt: () => builder(),
      gte: () => builder(),
      lt: () => builder(),
      lte: () => builder(),
      like: () => builder(),
      ilike: () => builder(),
      is: () => builder(),
      in: () => builder(),
      contains: () => builder(),
      order: () => builder(),
      limit: () => builder(),
      range: () => builder(),
      single: () => builder(),
      maybeSingle: () => builder(),
      then: resolveThen,
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ error: null }),
        getPublicUrl: () => ({ data: { publicUrl: null } }),
      }),
    },
  }
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (console.warn('[PAMA] Supabase env vars missing – using mock client'), createMockClient() as any)
