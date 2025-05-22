// pages/index.js
import Link from 'next/link'

const sections = [
  { href: '/demographic',                   label: 'Demographic Details',       color: 'green'  },
  { href: '/medical_history?patientId=1',   label: 'Past Medical History',       color: 'indigo' },
  { href: '/oral_examination?patientId=1',  label: 'Oral Examination',           color: 'yellow' },
  { href: '/endodontic_record?patientId=1', label: 'Endodontic Record',          color: 'red'    },
  { href: '/prosthetic_record?patientId=1', label: 'Prosthetic Record',          color: 'teal'   },
  { href: '/orthodontic_record?patientId=1',label: 'Orthodontic Record',         color: 'purple'},
  { href: '/soft_tissue_finding?patientId=1',label: 'Soft Tissue Finding',       color: 'pink'  },
  { href: '/radiographic_record?patientId=1',label: 'Radiographic Record',        color: 'cyan'  },
  { href: '/biopsy_cytology_record?patientId=1',label: 'Biopsy & Cytology Record',color: 'amber' },
  { href: '/following_visits?patientId=1',       label: 'Following Visits',        color: 'gray'  },
]

const colorClasses = {
  green:  'border-green-300 bg-green-100 hover:bg-green-200 focus:ring-green-200',
  indigo: 'border-indigo-300 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-200',
  yellow: 'border-yellow-300 bg-yellow-100 hover:bg-yellow-200 focus:ring-yellow-200',
  red:    'border-red-300 bg-red-100 hover:bg-red-200 focus:ring-red-200',
  teal:   'border-teal-300 bg-teal-100 hover:bg-teal-200 focus:ring-teal-200',
  purple: 'border-purple-300 bg-purple-100 hover:bg-purple-200 focus:ring-purple-200',
  pink:   'border-pink-300 bg-pink-100 hover:bg-pink-200 focus:ring-pink-200',
  cyan:   'border-cyan-300 bg-cyan-100 hover:bg-cyan-200 focus:ring-cyan-200',
  amber:  'border-amber-300 bg-amber-100 hover:bg-amber-200 focus:ring-amber-200',
  gray:   'border-gray-300 bg-gray-100 hover:bg-gray-200 focus:ring-gray-200',
}

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-center text-indigo-800 mb-8">
        All Records
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map(({ href, label, color }) => (
          <Link
            key={href}
            href={href}
            className={`
              block rounded-lg p-8 text-center font-semibold text-xl
              border-2 transition focus:outline-none focus:ring-4
              ${colorClasses[color]}
            `}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="text-center mt-12">
        <a
          href="/api/download-records"
          className="
            inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700
            text-white font-semibold rounded-lg shadow
          "
        >
          Download All Records
        </a>
      </div>
    </div>
  )
}
