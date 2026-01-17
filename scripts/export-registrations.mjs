#!/usr/bin/env node
import fs from 'fs/promises'
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be provided as environment variables')
  process.exit(1)
}

const supabase = createClient(url, key)

try {
  const { data, error } = await supabase.from('registrations').select('*').order('registeredAt', { ascending: true })
  if (error) throw error
  const out = data ?? []
  await fs.mkdir('lib/data/mock', { recursive: true })
  await fs.writeFile('lib/data/mock/registrations.json', JSON.stringify(out, null, 2), 'utf-8')
  console.log(`Saved ${out.length} registrations to lib/data/mock/registrations.json`)
} catch (err) {
  console.error('Failed to export registrations:', err)
  process.exit(1)
}
