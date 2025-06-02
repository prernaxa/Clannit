'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import {
  UserCircle,
  ListTodo,
  Group,
  Plus,
  Users,
  LogIn,
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [userName, setUserName] = useState(null) // NEW
  const [habits, setHabits] = useState([])
  const [groups, setGroups] = useState([])
  const [penalties, setPenalties] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch user profile to get the name
  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', userId)
      .single()
    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }
    return data?.name || null
  }

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push('/login')
      } else {
        setUser(data.user)
        fetchData(data.user.id)
        const name = await fetchProfile(data.user.id)
        setUserName(name)
      }
    })
  }, [router])

  useEffect(() => {
    if (user) {
      logPenaltiesForMissedCheckins(user.id)
    }
  }, [user])

  const fetchData = async (userId) => {
    setLoading(true)

    const { data: habitsData } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)

    const { data: groupMembersData } = await supabase
      .from('user_groups')
      .select('group_id, groups(name)')
      .eq('user_id', userId)
      .order('group_id', { ascending: true })

    const { data: penaltiesData } = await supabase
      .from('penalties')
      .select('id, group_id, date, type, completed')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    setHabits(habitsData || [])
    setGroups(groupMembersData ? groupMembersData.map(g => g.groups) : [])
    setPenalties(penaltiesData || [])
    setLoading(false)
  }

  const logPenaltiesForMissedCheckins = async (userId) => {
    try {
      const { data: habits } = await supabase
        .from('habits')
        .select('id')
        .eq('user_id', userId)

      if (!habits || habits.length === 0) return

      const habitIds = habits.map(h => h.id)
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const dateStr = yesterday.toISOString().split('T')[0]

      const { data: missedCheckIns } = await supabase
        .from('check_ins')
        .select('habit_id, group_id, date')
        .in('habit_id', habitIds)
        .eq('date', dateStr)
        .eq('status', 'missed')

      if (!missedCheckIns || missedCheckIns.length === 0) return

      for (const missed of missedCheckIns) {
        const groupId = missed.group_id || null

        const { data: existingPenalty } = await supabase
          .from('penalties')
          .select('id')
          .eq('user_id', userId)
          .eq('group_id', groupId)
          .eq('date', missed.date)
          .eq('type', 'missed_check_in')
          .limit(1)

        if (!existingPenalty || existingPenalty.length === 0) {
          await supabase.from('penalties').insert([{
            user_id: userId,
            group_id: groupId,
            date: missed.date,
            type: 'missed_check_in',
            completed: false,
          }])
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err)
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-center text-teal-600 animate-pulse">
        Loading your dashboard...
      </div>
    )
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-10 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-4">
        <UserCircle className="w-10 h-10 text-teal-600" />
        <h1 className="text-3xl font-bold text-teal-800">
          Welcome, {userName || user?.email}
        </h1>
      </div>

      {/* HABITS */}
      <section className="bg-white border border-teal-200 rounded-2xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <ListTodo className="w-6 h-6 text-teal-500" />
          <h2 className="text-xl font-semibold text-teal-700">Your Micro-Habits</h2>
        </div>

        {habits.length === 0 ? (
          <p className="text-teal-400">You haven’t added any habits yet.</p>
        ) : (
          <ul className="space-y-2 text-teal-800">
            {habits.map(habit => (
              <li
                key={habit.id}
                className="px-4 py-2 bg-teal-50 rounded-lg hover:bg-teal-100 cursor-default transition"
              >
                {habit.name}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={() => router.push('/habits/create')}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition"
        >
          <Plus size={18} /> Create New Habit
        </button>
      </section>
      
      {/* CHECK-INS */}
<section className="bg-white border border-teal-200 rounded-2xl shadow-md p-6">
  <div className="flex items-center gap-3 mb-4">
    <ListTodo className="w-6 h-6 text-teal-500" />
    <h2 className="text-xl font-semibold text-teal-700">Your Check-Ins</h2>
  </div>

  <p className="text-teal-400">Record your daily progress and stay accountable.</p>

  <button
    onClick={() => router.push('/checkins/create')}
    className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition"
  >
    <Plus size={18} /> Create New Check-In
  </button>
</section>

      {/* GROUPS */}
      <section className="bg-white border border-teal-200 rounded-2xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <Group className="w-6 h-6 text-teal-500" />
          <h2 className="text-xl font-semibold text-teal-700">Your Groups</h2>
        </div>

        {groups.length === 0 ? (
          <p className="text-teal-400">You haven’t joined any groups yet.</p>
        ) : (
          <>
            <ul className="space-y-2 text-teal-800">
              {groups.slice(0, 3).map(group => (
                <li
                  key={group.id}
                  className="px-4 py-2 bg-teal-50 rounded-lg hover:bg-teal-100 cursor-pointer transition"
                  onClick={() => router.push('/groups')}
                >
                  {group.name}
                </li>
              ))}
            </ul>

            {groups.length > 3 && (
              <button
                onClick={() => router.push('/groups')}
                className="mt-3 text-sm text-teal-600 hover:underline"
              >
                Show all groups
              </button>
            )}
          </>
        )}

        <div className="flex flex-wrap gap-3 mt-5">
          <button
            onClick={() => router.push('/groups/create')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition"
          >
            <Users size={18} /> Create Group
          </button>
          <button
            onClick={() => router.push('/groups/join')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-400 text-white rounded-xl hover:bg-teal-500 transition"
          >
            <LogIn size={18} /> Join Group
          </button>
        </div>
      </section>
      
    </main>
  )
}
