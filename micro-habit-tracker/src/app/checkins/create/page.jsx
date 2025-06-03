'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { CheckCircle, Calendar, ListChecks, Users } from 'lucide-react'

export default function CreateCheckin() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [groups, setGroups] = useState([])
  const [habits, setHabits] = useState([])
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [status, setStatus] = useState('completed')
  const [groupId, setGroupId] = useState('')
  const [habitId, setHabitId] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login')
      } else {
        setUser(data.user)
        fetchUserGroups(data.user.id)
        fetchUserHabits(data.user.id)
      }
    })
  }, [router])

  useEffect(() => {
    if (groups.length > 0) {
      setGroupId(groups[0].id)
    }
  }, [groups])

  async function fetchUserGroups(userId) {
    const { data, error } = await supabase
      .from('user_groups')
      .select('group_id, groups(id, name)')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching groups:', error)
      return
    }
    setGroups(data.map((g) => g.groups))
  }

  async function fetchUserHabits(userId) {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching habits:', error)
      return
    }
    setHabits(data)
    if (data.length > 0) setHabitId(data[0].id)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!date || !status || !habitId) return alert('Please fill all required fields.')

    setLoading(true)

    const { error } = await supabase.from('check_ins').insert([
      {
        user_id: user.id,
        group_id: groupId || null,
        habit_id: habitId,
        date,
        status,
      },
    ])

    setLoading(false)

    if (error) {
      alert(`Error creating check-in: ${error.message}`)
    } else {
      alert('Check-in created successfully!')
      router.push('/dashboard')
    }
  }

  if (!user) return <p className="p-4">Loading...</p>

  return (
    <div className=" mb-8 max-w-md mx-auto mt-12 p-8 bg-white rounded-lg shadow-lg border border-teal-200">
      <h1 className="text-3xl font-extrabold text-teal-700 mb-8 text-center">Create Check-In</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Habit */}
        <label className="block">
          <div className="flex items-center mb-2 text-teal-700 font-semibold">
            <ListChecks className="w-5 h-5 mr-2" /> Habit
          </div>
          <select
            className="w-full p-3 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={habitId}
            onChange={(e) => setHabitId(e.target.value)}
            required
          >
            {habits.map((habit) => (
              <option key={habit.id} value={habit.id}>
                {habit.name}
              </option>
            ))}
          </select>
        </label>

        {/* Date */}
        <label className="block">
          <div className="flex items-center mb-2 text-teal-700 font-semibold">
            <Calendar className="w-5 h-5 mr-2" /> Date
          </div>
          <input
            type="date"
            className="w-full p-3 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        {/* Status */}
        <label className="block">
          <div className="flex items-center mb-2 text-teal-700 font-semibold">
            <CheckCircle className="w-5 h-5 mr-2" /> Status
          </div>
          <select
            className="w-full p-3 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="completed">Completed</option>
            <option value="missed">Missed</option>
            <option value="skipped">Skipped</option>
          </select>
        </label>

        {/* Group */}
        <label className="block">
          <div className="flex items-center mb-2 text-teal-700 font-semibold">
            <Users className="w-5 h-5 mr-2" /> Group 
          </div>
          <select
            className="w-full p-3 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
          >
           
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 text-white p-4 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Check-In'}
        </button>
      </form>
    </div>
  )
}
