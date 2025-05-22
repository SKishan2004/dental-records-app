// pages/radiographic_record.js

import { useState } from 'react'
import { useRouter } from 'next/router'
import PageHeader from '../components/PageHeader'

export default function RadiographicRecord() {
  const router = useRouter()
  const { patientId } = router.query

  const types = [
    'Occlusal',
    'Bite wing',
    'OPG',
    'Lateral cephalogram',
    'CBCT'
  ]

  const [selectedTypes, setSelectedTypes] = useState([])
  const [files, setFiles] = useState(
    types.reduce((acc, t) => { acc[t] = []; return acc }, {})
  )
  const [form, setForm] = useState({
    recordDate: '',
    doctorName: '',
    registerNumber: ''
  })

  const toggleType = (type, checked) => {
    setSelectedTypes(s =>
      checked ? [...s, type] : s.filter(x => x !== type)
    )
  }

  const handleFile = type => e => {
    setFiles(f => ({ ...f, [type]: Array.from(e.target.files) }))
  }

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!patientId) {
      alert('Missing patientId')
      return
    }

    const fd = new FormData()
    fd.append('patientId', patientId)
    fd.append('recordDate', form.recordDate)
    fd.append('doctorName', form.doctorName)
    fd.append('registerNumber', form.registerNumber)

    // append selected radiograph types
    selectedTypes.forEach(t => fd.append('radiographTypes', t))

    // append each type's files
    types.forEach(type => {
      files[type].forEach(file => {
        fd.append(type, file)
      })
    })

    const res = await fetch('/api/radiographic-record', {
      method: 'POST',
      body: fd
    })

    if (res.ok) {
      // ← UPDATED: go to biopsy & cytology page next
      router.push(`/biopsy_cytology_record?patientId=${patientId}`)
    } else {
      const err = await res.json().catch(() => ({}))
      alert('Error saving radiographic record: ' + (err.error || res.statusText))
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader title="Radiographic Record" />

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-8"
      >
        {/* Radiographic types */}
        <section className="space-y-2">
          {types.map(type => {
            const id = `upload-${type.replace(/\s+/g, '-')}`
            return (
              <div
                key={type}
                className="flex items-center justify-between py-2 border-b"
              >
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    onChange={e => toggleType(type, e.target.checked)}
                  />
                  <span>{type}</span>
                </label>
                {selectedTypes.includes(type) && (
                  <label
                    htmlFor={id}
                    className="px-3 py-1 bg-blue-900 text-white rounded cursor-pointer"
                  >
                    RADIOGRAPH
                  </label>
                )}
                <input
                  id={id}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFile(type)}
                />
              </div>
            )
          })}
        </section>

        {/* Date / Doctor / Register */}
        <section className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-medium">Date</label>
            <input
              type="date"
              name="recordDate"
              value={form.recordDate}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block font-medium">Doctor’s Name</label>
            <input
              type="text"
              name="doctorName"
              value={form.doctorName}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block font-medium">Register Number</label>
            <input
              type="text"
              name="registerNumber"
              value={form.registerNumber}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
        </section>

        {/* Save & Next */}
        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Save & Next
          </button>
        </div>
      </form>
    </div>
  )
}
