'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    const { data: existingUser, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      setError('Something went wrong. Please try again.')
      return
    }

    if (existingUser) {
      setError('Account already exists. Please sign in.')
      return
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    })

    if (signUpError) {
      if (
        signUpError.message.toLowerCase().includes('user already registered') ||
        signUpError.message.toLowerCase().includes('email')
      ) {
        setError('Account already exists. Please sign in.')
      } else {
        setError(signUpError.message)
      }
      return
    }

    const { error: profileError } = await supabase.from('profiles').upsert({
      id: data.user.id,
      name,
      email,
    })

    if (profileError) {
      setError('Failed to save profile: ' + profileError.message)
      return
    }

    await supabase.auth.signOut()
    router.push('/signin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white px-4">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 sm:p-10 border border-teal-100"
      >
        <h2 className="text-3xl font-bold text-teal-700 mb-6 text-center">
          Create your account
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            placeholder="Your full name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-teal-700"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600 mb-4 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-lg transition"
        >
          Sign Up
        </button>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <a href="/signin" className="text-teal-600 hover:underline">
            Sign In
          </a>
        </p>
      </form>
    </div>
  )
}