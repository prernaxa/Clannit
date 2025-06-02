'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import useUser from '@/lib/useUser'
import { Users, AlertCircle, PlusCircle, Plus, ThumbsUp } from 'lucide-react'

export default function GroupDetailPage() {
  const user = useUser()
  const router = useRouter()
  const params = useParams()
  const groupId = params.id

  const [group, setGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [newSuggestion, setNewSuggestion] = useState('')
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

      const { data: memberData, error: memberError } = await supabase
        .from('user_groups')
        .select('user_id, profiles(name)')
        .eq('group_id', groupId)

      const { data: checkinsData, error: checkinsError } = await supabase
        .from('check_ins')
        .select(`
          user_id,
          status,
          habit_id,
          check_ins_habit_id_fkey (name)
        `)
        .eq('group_id', groupId)

      const membersWithCheckins = (memberData ?? []).map(m => ({
        id: m.user_id,
        name: m.profiles?.name || 'Unknown',
        checkins: (checkinsData ?? []).filter(ci => ci.user_id === m.user_id),
      }))

      setGroup(groupData)
      setSuggestions(suggestionsData ?? [])
      setMembers(membersWithCheckins)
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
      setSuggestions((prev) =>
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
    if (!newSuggestion.trim()) return

    const { error } = await supabase.from('penalty_suggestions').insert([{
      group_id: groupId,
      suggested_by: user.id,
      text: newSuggestion.trim(),
      votes: 0,
    }])

    if (error) {
      alert(error.message)
    } else {
      setSuggestions((prev) => [
        ...prev,
        {
          id: Date.now(),
          group_id: groupId,
          suggested_by: user.id,
          text: newSuggestion.trim(),
          votes: 0,
        },
      ])
      setNewSuggestion('')
    }
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-teal-700 text-lg font-semibold">
        Please login to view this group.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-teal-400 text-lg font-light animate-pulse">
        Loading...
      </div>
    )
  }

  if (!group) {
    return (
      <div className="flex justify-center items-center h-screen text-teal-700 text-lg font-semibold">
        Group not found.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-teal-50 to-teal-100 p-6 flex justify-center">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-lg border border-teal-200 p-10">
        <h1 className="text-5xl font-extrabold text-teal-900 mb-12 tracking-wide drop-shadow-sm">
          {group.name}
        </h1>

        {/* Group Members & Habits */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-teal-800 mb-6 border-b border-teal-300 pb-3 flex items-center gap-3">
            <Users size={32} className="text-teal-600" />
            Group Members & Habits
          </h2>
          {members.length === 0 ? (
            <p className="text-teal-400 italic text-lg">No members found in this group.</p>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="mb-8 p-6 bg-teal-50 rounded-2xl shadow-inner border border-teal-100"
              >
                <h3 className="text-2xl font-semibold text-teal-900 mb-5">{member.name}</h3>
                <ul className="ml-6 space-y-3">
                  {member.checkins.length === 0 ? (
                    <li className="text-teal-300 italic text-lg">No habits tracked yet.</li>
                  ) : (
                    member.checkins.map((checkin, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md border border-teal-100"
                      >
                        <span className="text-teal-700 font-semibold">
                          {checkin.check_ins_habit_id_fkey?.name || 'Habit'}
                        </span>

                        {checkin.status === 'missed' ? (
                          <button
                            onClick={() => {
                              suggestionFormRef.current?.scrollIntoView({ behavior: 'smooth' })
                            }}
                            className="text-white bg-red-600 hover:bg-red-700 transition px-5 py-2 rounded-full text-sm font-semibold shadow-lg shadow-red-300 flex items-center gap-2"
                            aria-label="Suggest Penalty"
                          >
                            <Plus size={16} />
                            Suggest Penalty
                          </button>
                        ) : (
                          <span className="text-green-600 font-semibold text-sm tracking-wide">
                            Completed
                          </span>
                        )}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ))
          )}
        </section>

        {/* Penalty Suggestions */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-teal-800 mb-6 border-b border-teal-300 pb-3 flex items-center gap-3">
            <AlertCircle size={32} className="text-teal-600" />
            Penalty Suggestions
          </h2>
          {suggestions.length === 0 ? (
            <p className="text-teal-400 italic text-lg">No suggestions yet. Be the first to suggest!</p>
          ) : (
            <ul className="space-y-6">
              {suggestions.map((s) => (
                <li
                  key={s.id}
                  className="bg-white rounded-3xl p-6 shadow-md border border-teal-100 flex flex-col sm:flex-row sm:justify-between sm:items-center"
                >
                  <p className="text-teal-900 text-lg font-medium mb-5 sm:mb-0">{s.text}</p>
                  <div className="flex items-center gap-6">
                    <span className="text-teal-600 font-semibold select-none text-base">
                      Votes: {s.votes}
                    </span>
                    <button
                      onClick={() => handleVote(s.id)}
                      disabled={voting === s.id}
                      className={`px-6 py-2 rounded-3xl font-semibold transition shadow flex items-center gap-2 ${
                        voting === s.id
                          ? 'bg-teal-300 cursor-not-allowed text-white'
                          : 'bg-teal-700 hover:bg-teal-800 text-white shadow-teal-500/50'
                      }`}
                      aria-label={`Vote for penalty suggestion: ${s.text}`}
                    >
                      <ThumbsUp size={16} />
                      {voting === s.id ? 'Voting...' : 'Vote'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Suggest a new penalty */}
        <section ref={suggestionFormRef}>
          <h2 className="text-3xl font-semibold text-teal-800 mb-6 border-b border-teal-300 pb-3 flex items-center gap-3">
            <PlusCircle size={32} className="text-teal-600" />
            Suggest a New Penalty
          </h2>
          <textarea
            value={newSuggestion}
            onChange={(e) => setNewSuggestion(e.target.value)}
            className="w-full border border-teal-300 rounded-3xl p-6 mb-8 shadow-sm focus:outline-none focus:ring-4 focus:ring-teal-400 focus:border-transparent transition resize-none text-teal-900 placeholder-teal-400 text-lg"
            placeholder="e.g., 30 push-ups, donate ₹50..."
            rows={5}
            maxLength={150}
          />
          <button
            onClick={handleSuggest}
            disabled={!newSuggestion.trim()}
            className={`w-full py-5 rounded-3xl font-semibold text-white text-lg transition shadow-md flex items-center justify-center gap-3 ${
              newSuggestion.trim()
                ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/50'
                : 'bg-teal-300 cursor-not-allowed'
            }`}
            aria-label="Submit penalty suggestion"
          >
            <Plus size={20} />
            Submit Suggestion
          </button>
        </section>
      </div>
    </div>
  )
}
