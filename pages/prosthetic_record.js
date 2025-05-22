// pages/prosthetic_record.js

import { useState } from 'react'
import { useRouter } from 'next/router'
import PageHeader from '../components/PageHeader'

export default function ProstheticRecord() {
  const router = useRouter()
  const { patientId } = router.query

  const kennedyOpts      = ['Class I','Class II','Class III','Class IV']
  const removableMatOpts = ['Metal','Acrylic Resin','Flexible']
  const fixedMatOpts     = ['Metal-ceramic','All ceramic','Metal']
  const implantTypeOpts  = ['Threaded','Press fit','Blade']
  const implantMatOpts   = ['Titanium','Zirconia']
  const jawOpts          = ['Maxilla','Mandible']
  const supportOpts      = ['Mucosa','Tooth','Implant']
  const compMatOpts      = ['Metal','Acrylic Resin','Flexible']

  const [form, setForm] = useState({
    removableKennedy:      '',
    removableMaterials:    [],
    removableTeeth:        '',
    fixedMaterial:         '',
    fixedTeeth:            '',
    implantType:           '',
    implantMaterial:       '',
    completeJaw:           [],
    completeSupport:       [],
    completeMaterial:      [],
    others:                '',
    recordDate:            '',
    doctorName:            '',
    registerNumber:        ''
  })

  const [images, setImages]           = useState([])
  const [studyCasts, setStudyCasts]   = useState([])
  const [radiographs, setRadiographs] = useState([])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleCheckbox = (field, value, checked) => {
    setForm(f => {
      const arr = f[field]
      return {
        ...f,
        [field]: checked
          ? [...arr, value]
          : arr.filter(v => v !== value)
      }
    })
  }

  const handleFile = setter => e => setter(Array.from(e.target.files))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!patientId) {
      alert('Missing patientId')
      return
    }
    const fd = new FormData()
    fd.append('patientId',          patientId)
    fd.append('recordDate',         form.recordDate)
    fd.append('doctorName',         form.doctorName)
    fd.append('registerNumber',     form.registerNumber)

    fd.append('removableKennedy',   form.removableKennedy)
    form.removableMaterials.forEach(v => fd.append('removableMaterials', v))
    fd.append('removableTeeth',     form.removableTeeth)

    fd.append('fixedMaterial',      form.fixedMaterial)
    fd.append('fixedTeeth',         form.fixedTeeth)

    fd.append('implantType',        form.implantType)
    fd.append('implantMaterial',    form.implantMaterial)

    form.completeJaw.forEach(v => fd.append('completeJaw', v))
    form.completeSupport.forEach(v => fd.append('completeSupport', v))
    form.completeMaterial.forEach(v => fd.append('completeMaterial', v))

    fd.append('others',             form.others)

    images.forEach(f => fd.append('images', f))
    studyCasts.forEach(f => fd.append('studyCasts', f))
    radiographs.forEach(f => fd.append('radiographs', f))

    const res = await fetch('/api/prosthetic-record', {
      method: 'POST',
      body: fd
    })
    if (res.ok) {
      router.push(`/orthodontic_record?patientId=${patientId}`)
    } else {
      const err = await res.json().catch(() => ({}))
      alert('Error saving prosthetic record: ' + (err.error || res.statusText))
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader title="Prosthetic Record" />

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-8">
        {/* TOP: Record Date / Doctor / Register */}
        <div className="grid grid-cols-3 gap-4">
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
        </div>

        {/* Removable Partial Denture */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Removable Partial Denture</h2>
            <label className="px-3 py-1 bg-pink-600 text-white rounded cursor-pointer">
              IMAGE
              <input
                type="file"
                multiple
                hidden
                onChange={handleFile(setImages)}
              />
            </label>
          </div>
          <div>
            <label className="block font-medium">Kennedy classification</label>
            <div className="flex flex-wrap gap-6 mt-1">
              {kennedyOpts.map(opt => (
                <label key={opt} className="inline-flex items-center space-x-2">
                  <input
                    type="radio"
                    name="removableKennedy"
                    value={opt}
                    checked={form.removableKennedy === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-medium">Material</label>
            <div className="flex flex-wrap gap-6 mt-1">
              {removableMatOpts.map(opt => (
                <label key={opt} className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={form.removableMaterials.includes(opt)}
                    onChange={e => handleCheckbox('removableMaterials', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-medium">Teeth replaced</label>
            <input
              name="removableTeeth"
              value={form.removableTeeth}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
            />
          </div>
        </section>

        {/* Fixed Partial Denture */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Fixed Partial Denture</h2>
            <label className="px-3 py-1 bg-pink-600 text-white rounded cursor-pointer">
              IMAGE
              <input
                type="file"
                multiple
                hidden
                onChange={handleFile(setImages)}
              />
            </label>
          </div>
          <div>
            <label className="block font-medium">Material</label>
            <div className="flex flex-wrap gap-6 mt-1">
              {fixedMatOpts.map(opt => (
                <label key={opt} className="inline-flex items-center space-x-2">
                  <input
                    type="radio"
                    name="fixedMaterial"
                    value={opt}
                    checked={form.fixedMaterial === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-medium">Teeth replaced</label>
            <input
              name="fixedTeeth"
              value={form.fixedTeeth}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
            />
          </div>
        </section>

        {/* Implants */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Implants</h2>
            <label className="px-3 py-1 bg-pink-600 text-white rounded cursor-pointer">
              IMAGE
              <input
                type="file"
                multiple
                hidden
                onChange={handleFile(setImages)}
              />
            </label>
          </div>
          <div>
            <label className="block font-medium">Type</label>
            <div className="flex flex-wrap gap-6 mt-1">
              {implantTypeOpts.map(opt => (
                <label key={opt} className="inline-flex items-center space-x-2">
                  <input
                    type="radio"
                    name="implantType"
                    value={opt}
                    checked={form.implantType === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-medium">Material</label>
            <div className="flex flex-wrap gap-6 mt-1">
              {implantMatOpts.map(opt => (
                <label key={opt} className="inline-flex items-center space-x-2">
                  <input
                    type="radio"
                    name="implantMaterial"
                    value={opt}
                    checked={form.implantMaterial === opt}
                    onChange={handleChange}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* Complete Denture */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Complete Denture</h2>
            <label className="px-3 py-1 bg-pink-600 text-white rounded cursor-pointer">
              IMAGE
              <input
                type="file"
                multiple
                hidden
                onChange={handleFile(setImages)}
              />
            </label>
          </div>
          <div>
            <label className="block font-medium">Jaw</label>
            <div className="flex flex-wrap gap-6 mt-1">
              {jawOpts.map(opt => (
                <label key={opt} className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    onChange={e => handleCheckbox('completeJaw', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-medium">Support</label>
            <div className="flex flex-wrap gap-6 mt-1">
              {supportOpts.map(opt => (
                <label key={opt} className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    onChange={e => handleCheckbox('completeSupport', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-medium">Material</label>
            <div className="flex flex-wrap gap-6 mt-1">
              {compMatOpts.map(opt => (
                <label key={opt} className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    onChange={e => handleCheckbox('completeMaterial', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-medium">Others</label>
            <input
              name="others"
              value={form.others}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
            />
          </div>
        </section>

        {/* Radiograph & Study Cast */}
        <div className="flex justify-end gap-4">
          <label className="px-4 py-2 bg-blue-900 text-white rounded cursor-pointer">
            RADIOGRAPH
            <input
              type="file"
              multiple
              hidden
              onChange={handleFile(setRadiographs)}
            />
          </label>
          <label className="px-4 py-2 bg-purple-600 text-white rounded cursor-pointer">
            STUDY CAST
            <input
              type="file"
              multiple
              hidden
              onChange={handleFile(setStudyCasts)}
            />
          </label>
        </div>

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
