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

  // Insert vote
  const { data: voteData, error: voteError } = await supabase
    .from('penalty_votes')
    .insert([{ user_id, suggestion_id }])

  if (voteError) {
    return new Response(JSON.stringify({ error: voteError.message }), { status: 500 })
  }

  // Fetch current votes count
  const { data: suggestion, error: fetchError } = await supabase
    .from('penalty_suggestions')
    .select('votes')
    .eq('id', suggestion_id)
    .single()

  if (fetchError) {
    return new Response(JSON.stringify({ error: fetchError.message }), { status: 500 })
  }

  const newVotesCount = (suggestion?.votes || 0) + 1

  // Update votes count
  const { data: updatedSuggestion, error: updateError } = await supabase
    .from('penalty_suggestions')
    .update({ votes: newVotesCount })
    .eq('id', suggestion_id)

  if (updateError) {
    return new Response(JSON.stringify({ error: updateError.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ message: 'Vote cast successfully', votes: newVotesCount }), { status: 200 })
}

export async function GET(req) {
  const url = new URL(req.url)
  const suggestion_id = url.searchParams.get('suggestion_id')

  if (!suggestion_id) {
    return new Response(JSON.stringify({ error: 'Missing suggestion_id' }), { status: 400 })
  }

  // Get votes count from penalty_suggestions table
  const { data, error } = await supabase
    .from('penalty_suggestions')
    .select('votes')
    .eq('id', suggestion_id)
    .single()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ count: data?.votes || 0 }), { status: 200 })
}
