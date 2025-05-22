import { useState } from 'react'
import { useRouter } from 'next/router'
import PageHeader from '../components/PageHeader'

export default function BiopsyCytologyRecord() {
  const router = useRouter()
  const { patientId } = router.query

  const [form, setForm] = useState({
    recordDate:      '',
    doctorName:      '',
    registerNumber:  '',
    biopsyRecord:    '',
    cytologyRecord:  ''
  })

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

    const payload = {
      patientId:       parseInt(patientId, 10),
      recordDate:      form.recordDate,
      doctorName:      form.doctorName,
      registerNumber:  form.registerNumber,
      biopsyRecord:    form.biopsyRecord,
      cytologyRecord:  form.cytologyRecord
    }

    const res = await fetch('/api/biopsy-cytology-record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (res.ok) {
      router.push(`/following_visits?patientId=${patientId}`)
    } else {
      const err = await res.json().catch(() => ({}))
      alert(err.error || `Error ${res.status}`)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader title="Biopsy & Cytology Record" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <section>
          <label className="block font-medium">Biopsy Record:</label>
          <input
            type="text"
            name="biopsyRecord"
            value={form.biopsyRecord}
            onChange={handleChange}
            placeholder="______________________________"
            className="w-full border-b-2 border-pink-500 p-1"
          />
        </section>

        <section>
          <label className="block font-medium">Cytology Record:</label>
          <input
            type="text"
            name="cytologyRecord"
            value={form.cytologyRecord}
            onChange={handleChange}
            placeholder="______________________________"
            className="w-full border-b-2 border-pink-500 p-1"
          />
        </section>

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
