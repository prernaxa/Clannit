import { supabase } from '@/lib/supabaseClient'

export async function POST(req) {
  const { user_id, suggestion_id } = await req.json()

  // Prevent duplicate votes
  const { data: existing, error: existErr } = await supabase
    .from('penalty_votes')
    .select('*')
    .eq('user_id', user_id)
    .eq('suggestion_id', suggestion_id)
    .single()

  if (existing) {
    return new Response(JSON.stringify({ message: 'Already voted' }), { status: 400 })
  }

  const { data, error } = await supabase
    .from('penalty_votes')
    .insert([{ user_id, suggestion_id }])

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ message: 'Vote cast successfully' }), { status: 200 })
}
