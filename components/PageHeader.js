// components/PageHeader.js

import Link from 'next/link'

export default function PageHeader({ title }) {
  return (
    <div className="flex items-center justify-between mb-6 w-full">
      {/* Home Button */}
      <Link href="/">
        <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
          Home
        </button>
      </Link>

      {/* Page Title */}
      <h1 className="text-4xl font-bold text-red-600 text-center flex-1">
        {title}
      </h1>

      {/* Spacer to balance the Home button */}
      <div className="w-20" />
    </div>
  )
}
