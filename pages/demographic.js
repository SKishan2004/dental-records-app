// pages/demographic.js

import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Demographic() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    dob: '',
    bloodGroup: '',
    address: '',
    contact: '',
    emergencyPerson: '',
    emergencyContact: '',
    recordDate: ''
  })

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!form.name ||
        !form.age ||
        !form.gender ||
        !form.dob ||
        !form.recordDate) {
      return alert('Please fill in all required fields.')
    }

    const payload = {
      name:               form.name,
      age:                parseInt(form.age, 10),
      gender:             form.gender,
      dob:                new Date(form.dob).toISOString(),
      bloodGroup:         form.bloodGroup,
      address:            form.address,
      contact:            form.contact,
      emergencyPerson:    form.emergencyPerson,
      emergencyContact:   form.emergencyContact,
      recordDate:         new Date(form.recordDate).toISOString()
    }

    const res = await fetch('/api/records', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    })

    if (res.ok) {
      const saved = await res.json()
      router.push(`/medical_history?patientId=${saved.id}`)
    } else {
      const { error } = await res.json()
      alert('Error saving record: ' + (error || res.statusText))
    }
  }

  return (
    <div className="min-h-screen bg-green-100">
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded">
        <h1 className="text-xl uppercase text-black font-bold text-center mb-6">
          Demographic Details
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Name */}
          <div>
            <label className="block font-medium mb-1">Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
              placeholder="Full name"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block font-medium mb-1">Age *</label>
            <input
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
              placeholder="Age in years"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block font-medium mb-1">Gender *</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block font-medium mb-1">Date of Birth *</label>
            <input
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
            />
          </div>

          {/* Blood Group */}
          <div>
            <label className="block font-medium mb-1">Blood Group</label>
            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="">Select</option>
              {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg => (
                <option key={bg}>{bg}</option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="block font-medium mb-1">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded p-2 resize-none"
              placeholder="Street, city, etc."
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block font-medium mb-1">Contact No.</label>
            <input
              name="contact"
              type="tel"
              value={form.contact}
              onChange={handleChange}
              className="w-full border rounded p-2"
              placeholder="Phone number"
            />
          </div>

          {/* Emergency Contact Person */}
          <div>
            <label className="block font-medium mb-1">Emergency Contact Person</label>
            <input
              name="emergencyPerson"
              value={form.emergencyPerson}
              onChange={handleChange}
              className="w-full border rounded p-2"
              placeholder="Name"
            />
          </div>

          {/* Emergency Contact No. */}
          <div>
            <label className="block font-medium mb-1">Emergency Contact No.</label>
            <input
              name="emergencyContact"
              type="tel"
              value={form.emergencyContact}
              onChange={handleChange}
              className="w-full border rounded p-2"
              placeholder="Phone number"
            />
          </div>

          {/* Record Date */}
          <div>
            <label className="block font-medium mb-1">Record Date *</label>
            <input
              name="recordDate"
              type="date"
              value={form.recordDate}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
            />
          </div>

          {/* Save & Next */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              Save & Next
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
