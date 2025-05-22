// pages/login.js

import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useUser } from '../contexts/UserContext'

export default function Login() {
  const router = useRouter()
  const { setUser } = useUser()
  const [phone, setPhone] = useState('')
  const [dob, setDob] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, dob })
    })
    if (res.ok) {
      const user = await res.json()        // { id, phone }
      setUser(user)                        // stash in context
      router.push('/')                     // go home
    } else {
      const { error } = await res.json().catch(() => ({}))
      alert('Login failed: ' + (error || res.statusText))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Phone */}
          <div>
            <label className="block text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              placeholder="10-digit mobile number"
              pattern="\d{10}"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* DOB */}
          <div>
            <label className="block text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={e => setDob(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Don’t have an account?{' '}
          <Link href="/signup" className="text-indigo-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
