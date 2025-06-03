'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import useUser from '@/lib/useUser'
import { Users, AlertCircle, Plus, ThumbsUp, ArrowLeft } from 'lucide-react'

export default function GroupDetailPage() {
  const user = useUser()
  const router = useRouter()
  const params = useParams()
  const groupId = params.id

  const [group, setGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [suggestionsWithUser, setSuggestionsWithUser] = useState([])
  const [newSuggestion, setNewSuggestion] = useState('')
  const [newSuggestionTargetUserId, setNewSuggestionTargetUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(null)

  const suggestionFormRef = useRef(null)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      setLoading(true)

      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single()

      if (groupError) {
        console.error('Error fetching group:', groupError)
        setGroup(null)
        setLoading(false)
        return
      }

      const { data: suggestionsData, error: suggestionsError } = await supabase
        .from('penalty_suggestions')
        .select('*')
        .eq('group_id', groupId)
        .order('votes', { ascending: false })

      if (suggestionsError) {
        console.error('Error fetching suggestions:', suggestionsError)
      }

      const { data: memberData, error: memberError } = await supabase
        .from('user_groups')
        .select('user_id, profiles(name)')
        .eq('group_id', groupId)

      if (memberError) {
        console.error('Error fetching members:', memberError)
      }

      const { data: checkinsData, error: checkinsError } = await supabase
        .from('check_ins')
        .select(`
          user_id,
          status,
          habit_id,
          check_ins_habit_id_fkey (name)
        `)
        .eq('group_id', groupId)

      if (checkinsError) {
        console.error('Error fetching check-ins:', checkinsError)
      }

      const membersWithCheckins = (memberData ?? []).map(m => ({
        id: m.user_id,
        name: m.profiles?.name || 'Unknown',
        checkins: (checkinsData ?? []).filter(ci => ci.user_id === m.user_id),
      }))

      setGroup(groupData)
      setMembers(membersWithCheckins)

      const targetUserIds = [...new Set((suggestionsData ?? []).map(s => s.target_user_id).filter(Boolean))]

      let assignedUsersMap = {}
      if (targetUserIds.length > 0) {
        const { data: assignedUsers, error: assignedUsersError } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', targetUserIds)

        if (assignedUsersError) {
          console.error('Error fetching assigned users:', assignedUsersError)
        } else {
          assignedUsersMap = assignedUsers.reduce((acc, user) => {
            acc[user.id] = user.name
            return acc
          }, {})
        }
      }

      const suggestionsWithUserName = (suggestionsData ?? []).map(s => ({
        ...s,
        assignedUserName: s.target_user_id ? (assignedUsersMap[s.target_user_id] || 'Unknown User') : 'Unassigned',
      }))

      setSuggestionsWithUser(suggestionsWithUserName)
      setLoading(false)
    }

    fetchData()
  }, [groupId, user])

  const handleVote = async (suggestionId) => {
    if (voting) return
    setVoting(suggestionId)

    const res = await fetch('/api/penalties/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        suggestion_id: suggestionId,
      }),
    })

    if (res.ok) {
      setSuggestionsWithUser((prev) =>
        prev.map((s) =>
          s.id === suggestionId ? { ...s, votes: s.votes + 1 } : s
        )
      )
    } else {
      const { message } = await res.json()
      alert(message)
    }
    setVoting(null)
  }

  const handleSuggest = async () => {
    if (!newSuggestion.trim() || !newSuggestionTargetUserId) {
      alert('Please select a user who missed a habit to assign this penalty.')
      return
    }

    const { error } = await supabase.from('penalty_suggestions').insert([{
      group_id: groupId,
      suggested_by: user.id,
      text: newSuggestion.trim(),
      votes: 0,
      target_user_id: newSuggestionTargetUserId,
    }])

    if (error) {
      alert(error.message)
    } else {
      setSuggestionsWithUser((prev) => [
        ...prev,
        {
          id: Date.now(),
          group_id: groupId,
          suggested_by: user.id,
          text: newSuggestion.trim(),
          votes: 0,
          target_user_id: newSuggestionTargetUserId,
          assignedUserName: members.find(m => m.id === newSuggestionTargetUserId)?.name || 'Unknown',
        },
      ])
      setNewSuggestion('')
      setNewSuggestionTargetUserId(null)
    }
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-xl font-medium">
        Please login to view this group.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400 text-lg font-light animate-pulse">
        Loading...
      </div>
    )
  }

  if (!group) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-lg font-semibold">
        Group not found.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-white to-teal-100 py-10 px-4 md:px-10">
    {/* Back to Dashboard Button */}
      <button
        onClick={() => router.push('/dashboard')}
        className="mb-6 flex items-center gap-2 text-teal-700 hover:text-teal-900 font-medium transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12 space-y-16">
        <h1 className="text-4xl md:text-5xl font-bold text-teal-900 tracking-tight">{group.name}</h1>

        {/* Members Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-semibold text-teal-800 flex items-center gap-2 mb-6">
            <Users /> Group Members & Habits
          </h2>
          {members.length === 0 ? (
            <p className="text-gray-400 italic">No members found in this group.</p>
          ) : (
            <div className="space-y-8">
              {members.map((member) => (
                <div key={member.id} className="bg-teal-50 p-6 rounded-2xl border border-teal-100 shadow-sm">
                  <h3 className="text-xl font-semibold text-teal-900 mb-3">{member.name}</h3>
                  <ul className="space-y-3">
                    {member.checkins.length === 0 ? (
                      <li className="text-gray-400 italic">No habits tracked yet.</li>
                    ) : (
                      member.checkins.map((checkin, idx) => (
                        <li key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border shadow">
                          <span className="text-teal-700 font-medium">
                            {checkin.check_ins_habit_id_fkey?.name || 'Habit'}
                          </span>
                          {checkin.status === 'missed' ? (
                            <button
                              onClick={() => {
                                setNewSuggestionTargetUserId(member.id)
                                suggestionFormRef.current?.scrollIntoView({ behavior: 'smooth' })
                              }}
                              className="flex items-center gap-1 text-red-600 hover:text-red-800 font-semibold"
                            >
                              <AlertCircle size={20} />
                              Missed
                            </button>
                          ) : (
                            <span className="text-green-600 flex items-center gap-1">
                              <ThumbsUp size={20} /> Completed
                            </span>
                          )}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Suggestions Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-semibold text-teal-800 flex items-center gap-2 mb-6">
            <AlertCircle /> Penalty Suggestions
          </h2>

          {suggestionsWithUser.length === 0 ? (
            <p className="text-gray-400 italic mb-6">No penalty suggestions yet.</p>
          ) : (
            <ul className="space-y-4 mb-8">
              {suggestionsWithUser.map((s) => (
                <li
                  key={s.id}
                  className="bg-white border border-teal-200 p-4 rounded-xl shadow flex justify-between items-center"
                >
                  <div>
                    <p className="text-teal-800 font-medium">{s.text}</p>
                    <p className="text-sm text-gray-500">Assigned to: {s.assignedUserName}</p>
                  </div>
                  <button
                    onClick={() => handleVote(s.id)}
                    disabled={voting === s.id}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    Vote ({s.votes})
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Suggestion Form */}
          <div ref={suggestionFormRef} className="space-y-4">
            <h3 className="text-xl font-semibold text-teal-700">Suggest a New Penalty</h3>
            <textarea
              className="w-full border border-teal-600 rounded-xl p-3"
              rows={3}
              placeholder="Enter your penalty suggestion..."
              value={newSuggestion}
              onChange={(e) => setNewSuggestion(e.target.value)}
            />
            <select
              className="w-full border text-gray-500 border-teal-600 rounded-xl p-3"
              value={newSuggestionTargetUserId || ''}
              onChange={(e) => setNewSuggestionTargetUserId(e.target.value)}
            >
              <option value="">Assign to a user who missed a habit</option>
              {members
                .filter(m => m.checkins.some(c => c.status === 'missed'))
                .map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
            </select>
            <button
              onClick={handleSuggest}
              className="bg-teal-700 hover:bg-teal-800 text-white font-medium px-6 py-2 rounded-xl"
            >
              <Plus className="inline-block mr-1 mb-1" size={18} />
              Submit Suggestion
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
