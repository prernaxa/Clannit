'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import useUser from '@/lib/useUser'
import { LogIn } from 'lucide-react'

export default function JoinGroupPage() {
  const user = useUser()
  const router = useRouter()
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Please log in to join a group.
      </div>
    )

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      setMessage('Please enter an invite code.')
      return
    }

    setLoading(true)
    setMessage('')

    // Get group by invite code
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('id, name')
      .eq('invite_code', inviteCode.trim().toUpperCase())
      .single()

    if (groupError || !group) {
      setMessage('Invalid invite code. Please try again.')
      setLoading(false)
      return
    }

    const groupId = group.id

    // Check if user is already a member
    const { data: existingMembership, error: membershipError } = await supabase
      .from('user_groups')
      .select('*')
      .eq('user_id', user.id)
      .eq('group_id', groupId)
      .maybeSingle()

    if (membershipError) {
      setMessage('Failed to check membership. Please try again.')
      setLoading(false)
      return
    }

    if (existingMembership) {
      setMessage(`You are already a member of "${group.name}".`)
      setLoading(false)
      return
    }

    // Insert user into user_groups
    const { error: insertError } = await supabase
      .from('user_groups')
      .insert([{ user_id: user.id, group_id: groupId }])

    if (insertError) {
      setMessage('Failed to join group. Please try again later.')
      setLoading(false)
      return
    }

    setMessage(`Successfully joined "${group.name}"! Redirecting...`)
    setLoading(false)

    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <div className="flex items-center mb-6">
          <LogIn className="h-6 w-6 text-teal-600 mr-2" />
          <h1 className="text-2xl font-semibold text-gray-800">Join a Group</h1>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter Invite Code"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition uppercase tracking-wider"
            disabled={loading}
          />

          <button
            onClick={handleJoin}
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-teal-600 text-white font-medium px-4 py-3 rounded-lg shadow hover:bg-teal-700 transition"
          >
            {loading ? 'Joining...' : (
              <>
                <LogIn className="w-5 h-5" />
                Join Group
              </>
            )}
          </button>

          {message && (
            <div className="mt-4 text-center text-sm text-gray-700">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
