// pages/medical_history.js

import { useState } from 'react'
import { useRouter } from 'next/router'

export default function MedicalHistory() {
  const router = useRouter()
  const { patientId } = router.query

  const baseConditions = [
    "Diabetes mellitus",
    "Hypertension",
    "Thyroid disorders",
    "Cardiovascular disease/conditions",
    "Respiratory diseases/conditions",
    "Drug Allergy",
    "Any history of surgery",
    "H/o of cancer and treatments",
  ]

  // --- existing state ---
  const [checked, setChecked] = useState([])
  const [otherDesc, setOtherDesc] = useState('')
  const [duration, setDuration] = useState('')
  const [underMed, setUnderMed] = useState(null)
  const [files, setFiles] = useState([])

  // --- new Habit History state ---
  const [tobaccoSmoking, setTobaccoSmoking] = useState(false)
  const [tobaccoSmokeless, setTobaccoSmokeless] = useState(false)
  const [alcoholConsumption, setAlcoholConsumption] = useState(false)
  const [habitFrequency, setHabitFrequency] = useState('')
  const [habitDuration, setHabitDuration] = useState('')

  const handleCheckbox = e => {
    const { value, checked } = e.target
    setChecked(prev =>
      checked ? [...prev, value] : prev.filter(v => v !== value)
    )
  }

  const handleFile = e => {
    setFiles(Array.from(e.target.files))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!patientId) {
      alert("Missing patientId in URL")
      return
    }

    const fd = new FormData()
    fd.append('patientId', patientId)

    // medical conditions
    checked.forEach(c => fd.append('history', c))
    if (otherDesc) fd.append('history', otherDesc)
    fd.append('duration', duration)
    fd.append('underMed', underMed)

    // habit history
    fd.append('tobaccoSmoking', tobaccoSmoking)
    fd.append('tobaccoSmokeless', tobaccoSmokeless)
    fd.append('alcoholConsumption', alcoholConsumption)
    fd.append('habitFrequency', habitFrequency)
    fd.append('habitDuration', habitDuration)

    // uploads
    files.forEach(f => fd.append('documents', f))

    const res = await fetch('/api/medical-history', {
      method: 'POST',
      body: fd
    })

    if (res.ok) {
      router.push(`/oral_examination?patientId=${patientId}`)
    } else {
      const err = await res.json()
      alert('Error saving medical history: ' + (err.error || res.statusText))
    }
  }

  return (
    <div className="min-h-screen bg-indigo-100">
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded">
        <h1 className="text-lg uppercase font-bold text-center mb-6">
          Past Medical History
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Habit History */}
          <div>
            <h2 className="text-md font-semibold mb-2">Habit History</h2>
            <div className="flex items-center space-x-6 mb-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={tobaccoSmoking}
                  onChange={e => setTobaccoSmoking(e.target.checked)}
                  className="h-4 w-4 border-indigo-600 accent-indigo-600"
                />
                <span>Smoking</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={tobaccoSmokeless}
                  onChange={e => setTobaccoSmokeless(e.target.checked)}
                  className="h-4 w-4 border-indigo-600 accent-indigo-600"
                />
                <span>Smokeless</span>
              </label>
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={alcoholConsumption}
                  onChange={e => setAlcoholConsumption(e.target.checked)}
                  className="h-4 w-4 border-indigo-600 accent-indigo-600"
                />
                <span>Alcohol consumption</span>
              </label>
            </div>
            <div className="flex items-center space-x-4 mb-2">
              <label className="w-32 font-medium">Frequency:</label>
              <input
                type="text"
                value={habitFrequency}
                onChange={e => setHabitFrequency(e.target.value)}
                placeholder="e.g. daily"
                className="flex-1 border rounded p-2"
              />
            </div>
            <div className="flex items-center space-x-4 mb-6">
              <label className="w-32 font-medium">Duration:</label>
              <input
                type="text"
                value={habitDuration}
                onChange={e => setHabitDuration(e.target.value)}
                placeholder="e.g. 2 years"
                className="flex-1 border rounded p-2"
              />
            </div>
          </div>

          {/* Medical Conditions */}
          {baseConditions.map(cond => (
            <label key={cond} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={cond}
                onChange={handleCheckbox}
                className="h-4 w-4 border-indigo-600 accent-indigo-600"
              />
              <span>{cond}</span>
            </label>
          ))}

          {/* Others */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                value="Others"
                onChange={handleCheckbox}
                className="h-4 w-4 border-indigo-600 accent-indigo-600"
              />
              <span>Others:</span>
            </label>
            <input
              type="text"
              value={otherDesc}
              onChange={e => setOtherDesc(e.target.value)}
              placeholder="Describe other condition"
              className="flex-1 border rounded p-2"
            />
          </div>

          {/* Condition Duration */}
          <div className="flex items-center space-x-4">
            <label className="w-32 font-medium">Duration:</label>
            <input
              type="text"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              placeholder="e.g. 6 months"
              className="flex-1 border rounded p-2"
            />
          </div>

          {/* Under Medication */}
          <div className="flex items-center space-x-4">
            <label className="w-32 font-medium">Under medication:</label>
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="underMed"
                  value="yes"
                  onChange={() => setUnderMed(true)}
                  className="h-4 w-4 border-indigo-600 accent-indigo-600"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="underMed"
                  value="no"
                  onChange={() => setUnderMed(false)}
                  className="h-4 w-4 border-indigo-600 accent-indigo-600"
                />
                <span>No</span>
              </label>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded cursor-pointer">
              IMAGE
              <input
                type="file"
                multiple
                onChange={handleFile}
                className="hidden"
              />
            </label>
            {files.length > 0 && (
              <p className="mt-2 text-sm text-gray-700">
                {files.length} file{files.length > 1 && 's'} selected
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded p-3"
          >
            Save &amp; Next
          </button>
        </form>
      </div>
    </div>
  )
}
