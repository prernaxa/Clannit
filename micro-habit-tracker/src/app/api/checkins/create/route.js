import { supabase } from '@/lib/supabaseClient'

export async function POST(req) {
  try {
    const { user_id, habit_id, group_id, date, status } = await req.json()

    if (!user_id || !date || (!habit_id && !group_id)) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: user_id, date, and habit_id or group_id' }),
        { status: 400 }
      )
    }

    
    const checkInStatus = status || 'done'

   
    let filter = supabase
      .from('check_ins')
      .select('*')
      .eq('user_id', user_id)
      .eq('date', date)

    if (habit_id) filter = filter.eq('habit_id', habit_id)
    else filter = filter.eq('group_id', group_id)

    const { data: existing, error: fetchError } = await filter.limit(1).single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      return new Response(JSON.stringify({ error: fetchError.message }), { status: 500 })
    }

    if (existing) {
      return new Response(
        JSON.stringify({ error: 'Check-in already exists for this user on this date.' }),
        { status: 409 }
      )
    }

    const { data, error: insertError } = await supabase
      .from('check_ins')
      .insert([{ user_id, habit_id, group_id, date, status: checkInStatus }])
      .select()
      .single()

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), { status: 500 })
    }

    return new Response(JSON.stringify({ message: 'Check-in created', checkin: data }), {
      status: 201,
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
