// pages/orthodontic_record.js

import { useState } from 'react'
import { useRouter } from 'next/router'
import PageHeader from '../components/PageHeader'

export default function OrthodonticRecord() {
  const router = useRouter()
  const { patientId } = router.query

  const occlusionOpts = ['Normal', 'Distocclusion', 'Mesiocclusion']
  const archShapeOpts  = ['Ovoid', 'Square', 'Tapered']
  const bracketOpts    = ['Metal','Ceramic','Self ligating','Lingual','Titanium']
  const wireOpts       = ['NiTi','SS','TMA','Co-Cr','Multi-stranded SS']

  const [form, setForm] = useState({
    recordDate: '',
    doctorName: '',
    registerNumber: '',
    typeOfOcclusion: [],
    archShape: [],
    midlineDeviation: false,
    openBite: false,
    deepBite: false,
    crossbite: false,
    crossbiteDesc: '',
    removableAppliance: false,
    removableApplianceDesc: '',
    fixedAppliances: false,
    bracketMaterials: [],
    archWireTypes: [],
    screwsDesc: '',
    othersDesc: ''
  })
  const [images, setImages] = useState([])
  const [rads, setRads] = useState([])
  const [casts, setCasts] = useState([])

  const handleText = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }
  const handleBool = (name, checked) => {
    setForm(f => ({ ...f, [name]: checked }))
  }
  const handleArr = (field, value, checked) => {
    setForm(f => {
      const arr = f[field]
      return {
        ...f,
        [field]: checked ? [...arr, value] : arr.filter(x => x !== value)
      }
    })
  }
  const handleFile = setter => e => setter(Array.from(e.target.files))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!patientId) return alert('Missing patientId')

    const fd = new FormData()
    fd.append('patientId', patientId)
    fd.append('recordDate', form.recordDate)
    fd.append('doctorName', form.doctorName)
    fd.append('registerNumber', form.registerNumber)

    form.typeOfOcclusion.forEach(v => fd.append('typeOfOcclusion', v))
    form.archShape.forEach(v => fd.append('archShape', v))
    fd.append('midlineDeviation', form.midlineDeviation)
    fd.append('openBite', form.openBite)
    fd.append('deepBite', form.deepBite)
    fd.append('crossbite', form.crossbite)
    fd.append('crossbiteDesc', form.crossbiteDesc)
    fd.append('removableAppliance', form.removableAppliance)
    fd.append('removableApplianceDesc', form.removableApplianceDesc)
    fd.append('fixedAppliances', form.fixedAppliances)
    form.bracketMaterials.forEach(v => fd.append('bracketMaterials', v))
    form.archWireTypes.forEach(v => fd.append('archWireTypes', v))
    fd.append('screwsDesc', form.screwsDesc)
    fd.append('othersDesc', form.othersDesc)

    images.forEach(f => fd.append('images', f))
    rads.forEach(f => fd.append('radiographs', f))
    casts.forEach(f => fd.append('studyCasts', f))

    const res = await fetch('/api/orthodontic-record', {
      method: 'POST',
      body: fd
    })
    if (res.ok) {
      router.push(`/soft_tissue_finding?patientId=${patientId}`)
    } else {
      const err = await res.json().catch(() => ({}))
      alert('Error saving orthodontic record: ' + (err.error || res.statusText))
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader title="Orthodontic Record" />

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
        {/* Date / Doctor / Register */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-medium">Date</label>
            <input
              type="date"
              name="recordDate"
              value={form.recordDate}
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

        {/* Type of Occlusion */}
        <section>
          <label className="block font-medium mb-2">Type of Occlusion</label>
          <div className="flex flex-wrap gap-6">
            {occlusionOpts.map(opt => (
              <label key={opt} className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  onChange={e => handleArr('typeOfOcclusion', opt, e.target.checked)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Arch Shape */}
        <section>
          <label className="block font-medium mb-2">Arch Shape</label>
          <div className="flex flex-wrap gap-6">
            {archShapeOpts.map(opt => (
              <label key={opt} className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  onChange={e => handleArr('archShape', opt, e.target.checked)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Deviation / Bite */}
        <div className="flex flex-wrap gap-6">
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={form.midlineDeviation}
              onChange={e => handleBool('midlineDeviation', e.target.checked)}
            />
            <span>Midline deviation</span>
          </label>
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={form.openBite}
              onChange={e => handleBool('openBite', e.target.checked)}
            />
            <span>Open bite</span>
          </label>
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={form.deepBite}
              onChange={e => handleBool('deepBite', e.target.checked)}
            />
            <span>Deep bite</span>
          </label>
        </div>

        {/* Crossbite */}
        <section>
          <div className="flex items-center space-x-2 mb-2">
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={form.crossbite}
                onChange={e => handleBool('crossbite', e.target.checked)}
              />
              <span>Crossbite</span>
            </label>
            {form.crossbite && (
              <input
                name="crossbiteDesc"
                value={form.crossbiteDesc}
                onChange={handleText}
                placeholder="Describe crossbite"
                className="border rounded p-2 flex-1"
              />
            )}
          </div>
        </section>

        {/* Removable Appliance */}
        <section>
          <div className="flex items-center space-x-2 mb-2">
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={form.removableAppliance}
                onChange={e => handleBool('removableAppliance', e.target.checked)}
              />
              <span>Removable appliance</span>
            </label>
            {form.removableAppliance && (
              <input
                name="removableApplianceDesc"
                value={form.removableApplianceDesc}
                onChange={handleText}
                placeholder="Describe appliance"
                className="border rounded p-2 flex-1"
              />
            )}
          </div>
        </section>

        {/* Fixed Appliances */}
        <section>
          <div className="mb-2">
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={form.fixedAppliances}
                onChange={e => handleBool('fixedAppliances', e.target.checked)}
              />
              <span>Fixed appliances</span>
            </label>
          </div>
          {form.fixedAppliances && (
            <div className="space-y-4 pl-6">
              <div>
                <strong>Brackets</strong>
                <div className="flex flex-wrap gap-4 mt-2">
                  {bracketOpts.map(opt => (
                    <label key={opt} className="inline-flex items-center space-x-2">
                      <input
                        type="checkbox"
                        onChange={e => handleArr('bracketMaterials', opt, e.target.checked)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <strong>Arch wires</strong>
                <div className="flex flex-wrap gap-4 mt-2">
                  {wireOpts.map(opt => (
                    <label key={opt} className="inline-flex items-center space-x-2">
                      <input
                        type="checkbox"
                        onChange={e => handleArr('archWireTypes', opt, e.target.checked)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Screws & Others */}
        <section className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Screws / Plates</label>
            <input
              name="screwsDesc"
              value={form.screwsDesc}
              onChange={handleText}
              placeholder="Describe"
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block font-medium">Others</label>
            <input
              name="othersDesc"
              value={form.othersDesc}
              onChange={handleText}
              placeholder="Describe"
              className="w-full border rounded p-2"
            />
          </div>
        </section>

        {/* Upload Buttons */}
        <section className="flex justify-between space-x-4">
          <label className="px-4 py-2 bg-pink-600 text-white rounded cursor-pointer">
            IMAGE
            <input type="file" multiple onChange={handleFile(setImages)} className="hidden" />
          </label>
          <label className="px-4 py-2 bg-blue-900 text-white rounded cursor-pointer">
            RADIOGRAPH
            <input type="file" multiple onChange={handleFile(setRads)} className="hidden" />
          </label>
          <label className="px-4 py-2 bg-purple-600 text-white rounded cursor-pointer">
            STUDY CAST
            <input type="file" multiple onChange={handleFile(setCasts)} className="hidden" />
          </label>
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
