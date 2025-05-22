import { useState } from 'react'
import { useRouter } from 'next/router'
import PageHeader from '../components/PageHeader'

export default function FollowingVisits() {
  const router = useRouter()
  const { patientId } = router.query

  const [form, setForm] = useState({
    summary: '',
    visitDate: '',
    doctorName: '',
    registerNumber: ''
  })
  const [images, setImages] = useState([])
  const [radiographs, setRadiographs] = useState([])

  const handleText = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }
  const handleFile = setter => e => setter(Array.from(e.target.files))

  const submit = async e => {
    e.preventDefault()
    if (!patientId) return alert('Missing patientId')

    const fd = new FormData()
    fd.append('patientId', patientId)
    fd.append('visitDate', form.visitDate)
    fd.append('doctorName', form.doctorName)
    fd.append('registerNumber', form.registerNumber)
    fd.append('summary', form.summary)

    images.forEach(f => fd.append('images', f))
    radiographs.forEach(f => fd.append('radiographs', f))

    const res = await fetch('/api/following-visits', {
      method: 'POST',
      body: fd
    })
    if (res.ok) {
      // back to home or next step
      router.push(`/`)
    } else {
      const err = await res.json().catch(() => ({}))
      alert(err.error || `Error ${res.status}`)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader title="Following Visits" />

      <form onSubmit={submit} encType="multipart/form-data" className="space-y-6">
        <div>
          <label className="block font-medium">CONSULTATION / TREATMENT DONE:</label>
          <textarea
            name="summary"
            value={form.summary}
            onChange={handleText}
            rows={2}
            placeholder="__________________________________________"
            className="w-full border-b-2 border-pink-500 p-1"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => document.getElementById('imgFiles').click()}
            className="bg-pink-600 text-white px-4 py-1 rounded hover:bg-pink-700"
          >
            IMAGE
          </button>
          <input
            id="imgFiles"
            type="file"
            multiple
            onChange={handleFile(setImages)}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => document.getElementById('radFiles').click()}
            className="bg-blue-900 text-white px-4 py-1 rounded hover:bg-blue-800"
          >
            RADIOGRAPH
          </button>
          <input
            id="radFiles"
            type="file"
            multiple
            onChange={handleFile(setRadiographs)}
            className="hidden"
          />
        </div>

        {/* Date / Doctor / Register */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-medium">Date</label>
            <input
              type="date"
              name="visitDate"
              value={form.visitDate}
              onChange={handleText}
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
              onChange={handleText}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block font-medium">Register Number</label>
            <input
              type="text"
              name="registerNumber"
              value={form.registerNumber}
              onChange={handleText}
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded p-2"
        >
          Save Visit
        </button>
      </form>
    </div>
  )
}
