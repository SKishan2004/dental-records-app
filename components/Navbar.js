// components/Navbar.js

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useUser } from '../contexts/UserContext'

export default function Navbar() {
  const { user, setUser } = useUser()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const menuRef = useRef()

  // close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const signOut = () => {
    setUser(null)
    router.push('/login')
  }

  return (
    <header className="bg-indigo-600 text-white px-6 py-1 grid grid-cols-3 items-center">
      {/* left placeholder */}
      <div />

      {/* centered title */}
      <h1 className="text-center text-xl font-bold">
        DENTAL RECORD
      </h1>

      {/* right: login or just username */}
      <div className="flex justify-end items-center relative" ref={menuRef}>
        {user ? (
          /* Removed dropdown and click-to-logout; just show username */
          <span className="bg-white text-indigo-600 px-4 py-1.5 rounded shadow">
            {user.username}
          </span>
        ) : (
          <Link href="/login" legacyBehavior>
            <a className="inline-block bg-white text-indigo-600 px-4 py-1.5 rounded shadow hover:bg-indigo-100">
              Log In
            </a>
          </Link>
        )}
      </div>
    </header>
  )
}
