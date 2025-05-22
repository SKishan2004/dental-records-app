import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useUser } from '../contexts/UserContext'

export default function SignUp() {
  const router = useRouter()
  const { setUser } = useUser()
  const [phone, setPhone] = useState('')
  const [dob, setDob] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    if (!phone.trim() || !dob) {
      return alert('Missing phone or date of birth')
    }
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: phone.trim(),  // we keep “username” key for the API but it’s really the phone
        password: dob            // and “password” holds the DOB string
      })
    })
    if (res.ok) {
      const user = await res.json()  
      setUser(user)  
      router.push('/')  
    } else {
      const { error } = await res.json().catch(() => ({}))
      alert('Signup failed: ' + (error || res.statusText))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Phone Number */}
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
          {/* Date of Birth */}
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
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  )
}
