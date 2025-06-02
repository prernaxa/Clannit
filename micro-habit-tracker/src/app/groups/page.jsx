'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Users } from 'lucide-react'

export default function GroupsListPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login')
      } else {
        setUser(data.user)
        fetchGroups(data.user.id)
      }
    })
  }, [router])

  const fetchGroups = async (userId) => {
    setLoading(true)
    const { data: groupMembersData, error } = await supabase
      .from('user_groups')
      .select('group_id, groups(name)')
      .eq('user_id', userId)
      .order('group_id', { ascending: true })

    if (error) {
      console.error('Group fetch error:', error)
      setGroups([])
    } else {
      setGroups(
        groupMembersData?.map(g => ({
          id: g.group_id,
          name: g.groups.name,
        })) || []
      )
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="p-10 text-center text-teal-500 animate-pulse font-semibold">
        Loading your groups...
      </div>
    )
  }

  if (groups.length === 0) {
    return (
      <div className="p-10 text-center text-teal-400 font-semibold">
        You haven’t joined any groups yet.
      </div>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-8 h-8 text-teal-600" />
        <h1 className="text-3xl font-bold text-teal-800">All Your Groups</h1>
      </div>

      <ul className="space-y-3">
        {groups.map(group => (
          <li
            key={group.id}
            onClick={() => router.push(`/groups/${group.id}`)}
            className="flex items-center justify-between cursor-pointer px-5 py-3 bg-teal-50 rounded-lg hover:bg-teal-100 transition-shadow shadow-sm hover:shadow-md"
            aria-label={`Go to group ${group.name}`}
          >
            <span className="text-teal-700 font-semibold">{group.name}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-teal-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </li>
        ))}
      </ul>
    </main>
  )
}
