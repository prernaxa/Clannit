'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { LogOut, Calendar, Home, ArrowLeft} from 'lucide-react'
import Image from 'next/image'

export default function Header({ userName }) {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/signin')
  }

  return (
    <header className="w-full px-6 py-4 bg-white border-b border-teal-100 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
         <button
        onClick={() => router.push('/')}
        className="flex items-center gap-2 text-teal-700 hover:text-teal-900 font-medium transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </button>
        {/* User & Logout */}
        <div className="flex items-center gap-4">
       
          {userName && (
            <div className="text-md text-teal-700 hidden sm:block">
              Hello, <span className="font-medium">{userName}</span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-teal-700 transition-all shadow hover:shadow-md"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
