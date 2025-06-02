'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import useUser from '../../../lib/useUser'
import { Users, ClipboardCopy, Check } from 'lucide-react'

export default function CreateGroupPage() {
  const user = useUser()
  const [groupName, setGroupName] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Please log in to create a group.
      </div>
    )

  const generateInviteCode = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase()

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return alert('Please enter a group name')
    setLoading(true)

    const code = generateInviteCode()

    const { data, error } = await supabase
      .from('groups')
      .insert([{ name: groupName.trim(), invite_code: code, created_by: user.id }])
      .select()

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    const groupId = data[0].id

    const { error: linkError } = await supabase
      .from('user_groups')
      .insert([{ user_id: user.id, group_id: groupId }])

    if (linkError) {
      alert(linkError.message)
      setLoading(false)
      return
    }

    setInviteCode(code)
    setGroupName('')
    setCopied(false)
    setLoading(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <div className="flex items-center mb-6">
          <Users className="h-6 w-6 text-teal-600 mr-2" />
          <h1 className="text-2xl font-semibold text-gray-800">Create a New Group</h1>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition"
            disabled={loading}
          />

          <button
            onClick={handleCreateGroup}
            className="w-full flex justify-center items-center gap-2 bg-teal-600 text-white font-medium px-4 py-3 rounded-lg shadow hover:bg-teal-700 transition"
            disabled={loading}
          >
            {loading ? 'Creating...' : (
              <>
                <Users className="w-5 h-5" />
                Create Group
              </>
            )}
          </button>

          {inviteCode && (
            <div className="flex items-center justify-between px-4 py-3 bg-gray-100 rounded-lg text-gray-700">
              <span>
                Invite Code: <strong>{inviteCode}</strong>
              </span>
              <button
                onClick={handleCopy}
                className="text-teal-600 hover:text-teal-800 transition"
                aria-label="Copy invite code"
              >
                {copied ? <Check className="w-5 h-5" /> : <ClipboardCopy className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
