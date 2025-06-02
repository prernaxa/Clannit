'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import useUser from '@/lib/useUser'
import { useRouter } from 'next/navigation'
import { PlusCircle } from 'lucide-react'

export default function CreateHabitPage() {
  const user = useUser()
  const router = useRouter()
  const [habitName, setHabitName] = useState('')
  const [loading, setLoading] = useState(false)

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Please log in to create a habit.
      </div>
    )

  const handleCreateHabit = async () => {
    if (!habitName.trim()) return alert('Please enter a habit name')
    setLoading(true)

    const { data, error } = await supabase
      .from('habits')
      .insert([{ user_id: user.id, name: habitName.trim() }])
      .select()

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    setHabitName('')
    setLoading(false)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <div className="flex items-center mb-6">
          <PlusCircle className="h-6 w-6 text-teal-600 mr-2" />
          <h1 className="text-2xl font-semibold text-gray-800">Create a New Micro-Habit</h1>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="e.g. Drink 1 glass of water after waking up"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition"
            disabled={loading}
          />

          <button
            onClick={handleCreateHabit}
            className="w-full flex justify-center items-center gap-2 bg-teal-600 text-white font-medium px-4 py-3 rounded-lg shadow hover:bg-teal-700 transition"
            disabled={loading}
          >
            {loading ? 'Creating...' : (
              <>
                <PlusCircle className="w-5 h-5" />
                Create Habit
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
