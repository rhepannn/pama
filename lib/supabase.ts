import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function createMockClient() {
  const empty = { data: [], error: null }
  const err = { data: null, error: { message: 'Supabase not configured – set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel' } }
  const chain = new Proxy(empty, {
    get: (_, prop) => {
      if (prop === 'then') return undefined
      return () => chain
    },
  })
  const builder = {
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    delete: () => builder,
    upsert: () => builder,
    eq: () => builder,
    neq: () => builder,
    gt: () => builder,
    gte: () => builder,
    lt: () => builder,
    lte: () => builder,
    like: () => builder,
    ilike: () => builder,
    is: () => builder,
    in: () => builder,
    contains: () => builder,
    order: () => builder,
    limit: () => builder,
    range: () => builder,
    single: () => builder,
    maybeSingle: () => builder,
    then: (resolve: any) => { resolve(empty); return builder },
  }
  const from = () => builder
  return { from }
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (console.warn('[PAMA] Supabase env vars missing – using mock client'), createMockClient() as any)
