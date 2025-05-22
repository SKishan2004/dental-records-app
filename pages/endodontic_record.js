// pages/endodontic_record.js

import { useState } from 'react'
import { useRouter } from 'next/router'
import PageHeader from '../components/PageHeader'

export default function EndodonticRecord() {
  const router = useRouter()
  const { patientId } = router.query

  const classOptions = ['Class I','Class II','Class III','Class IV','Class V']
  const crownOptions = ['Metal','Metal ceramic','All ceramic']

  const [form, setForm] = useState({
    recordDate:     '',
    doctorName:     '',
    registerNumber: '',
    fracture:       '',
    discoloured:    '',
    decayedClasses: [],
    amalgam:        [],
    gic:            [],
    composite:      [],
    rctCrown:       '',
    rctWithout:     '',
    others:         ''
  })

  // description objects per group
  const [decayedDesc, setDecayedDesc]     = useState({})
  const [amalgamDesc, setAmalgamDesc]     = useState({})
  const [gicDesc, setGicDesc]             = useState({})
  const [compositeDesc, setCompositeDesc] = useState({})

  const [images, setImages]         = useState([])
  const [radiographs, setRadiographs] = useState([])

  const handleText = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const toggleArray = (field, value, checked) => {
    setForm(f => {
      const arr = f[field]
      return {
        ...f,
        [field]: checked
          ? [...arr, value]
          : arr.filter(v => v !== value)
      }
    })
    // clear its description if unchecked
    if (!checked) {
      if (field === 'decayedClasses')     setDecayedDesc(d => { const c = {...d}; delete c[value]; return c })
      if (field === 'amalgam')            setAmalgamDesc(d => { const c = {...d}; delete c[value]; return c })
      if (field === 'gic')                setGicDesc(d => { const c = {...d}; delete c[value]; return c })
      if (field === 'composite')          setCompositeDesc(d => { const c = {...d}; delete c[value]; return c })
    }
  }

  const appendFiles = (setter, filesList) => {
    setter(prev => [...prev, ...Array.from(filesList)])
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!patientId) {
      alert('Missing patientId')
      return
    }
    const fd = new FormData()
    // top fields
    fd.append('patientId',     patientId)
    fd.append('recordDate',    form.recordDate)
    fd.append('doctorName',    form.doctorName)
    fd.append('registerNumber',form.registerNumber)

    // fracture & discoloured
    fd.append('fracture',    form.fracture)
    fd.append('discoloured', form.discoloured)

    // decayed
    form.decayedClasses.forEach(c => fd.append('decayedClasses', c))
    Object.entries(decayedDesc).forEach(([c, desc]) =>
      fd.append('decayedDesc', JSON.stringify({ key: c, desc }))
    )

    // amalgam
    form.amalgam.forEach(c => fd.append('amalgam', c))
    Object.entries(amalgamDesc).forEach(([c, desc]) =>
      fd.append('amalgamDesc', JSON.stringify({ key: c, desc }))
    )

    // gic
    form.gic.forEach(c => fd.append('gic', c))
    Object.entries(gicDesc).forEach(([c, desc]) =>
      fd.append('gicDesc', JSON.stringify({ key: c, desc }))
    )

    // composite
    form.composite.forEach(c => fd.append('composite', c))
    Object.entries(compositeDesc).forEach(([c, desc]) =>
      fd.append('compositeDesc', JSON.stringify({ key: c, desc }))
    )

    // RCT
    fd.append('rctCrown',   form.rctCrown)
    fd.append('rctWithout', form.rctWithout)
    fd.append('others',     form.others)

    // files
    images.forEach(f => fd.append('images', f))
    radiographs.forEach(f => fd.append('radiographs', f))

    const res = await fetch('/api/endodontic-record', {
      method: 'POST',
      body: fd
    })
    if (res.ok) {
      router.push(`/prosthetic_record?patientId=${patientId}`)
    } else {
      alert('Error saving endodontic record')
    }
  }

  // consistent, centered buttons
  const FileButtons = () => (
    <div className="flex flex-col space-y-2 items-center">
      <label className="flex justify-center items-center w-full px-3 py-1 bg-pink-600 text-white rounded cursor-pointer">
        IMAGE
        <input
          type="file"
          hidden
          multiple
          onChange={e => appendFiles(setImages, e.target.files)}
        />
      </label>
      <label className="flex justify-center items-center w-full px-3 py-1 bg-blue-900 text-white rounded cursor-pointer">
        RADIOGRAPH
        <input
          type="file"
          hidden
          multiple
          onChange={e => appendFiles(setRadiographs, e.target.files)}
        />
      </label>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader title="Endodontic Record" />

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-8">

        {/* DATE / DOCTOR / REG */}
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
              name="doctorName"
              value={form.doctorName}
              onChange={handleText}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block font-medium">Register Number</label>
            <input
              name="registerNumber"
              value={form.registerNumber}
              onChange={handleText}
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        {/* FRACTURE */}
        <div className="grid grid-cols-4 items-center gap-4">
          <div className="col-span-3 flex items-center space-x-2">
            <label className="inline-flex items-center space-x-1">
              <input
                type="checkbox"
                checked={!!form.fracture}
                onChange={e =>
                  setForm(f => ({ ...f, fracture: e.target.checked ? f.fracture : '' }))
                }
              />
              <span>Fracture :</span>
            </label>
            <input
              name="fracture"
              value={form.fracture}
              onChange={handleText}
              placeholder="Describe…"
              className="flex-1 border-b p-1"
            />
          </div>
          <div className="col-span-1"><FileButtons /></div>
        </div>

        {/* DISCOLOURED */}
        <div className="grid grid-cols-4 items-center gap-4">
          <div className="col-span-3 flex items-center space-x-2">
            <label className="inline-flex items-center space-x-1">
              <input
                type="checkbox"
                checked={!!form.discoloured}
                onChange={e =>
                  setForm(f => ({ ...f, discoloured: e.target.checked ? f.discoloured : '' }))
                }
              />
              <span>Discoloured :</span>
            </label>
            <input
              name="discoloured"
              value={form.discoloured}
              onChange={handleText}
              placeholder="Describe…"
              className="flex-1 border-b p-1"
            />
          </div>
          <div className="col-span-1"><FileButtons /></div>
        </div>

        {/* DECAYED */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3 space-y-2">
            <span className="font-medium">Decayed :</span>
            {classOptions.map(opt => (
              <div key={opt} className="flex items-center space-x-2">
                <label className="inline-flex items-center space-x-1">
                  <input
                    type="checkbox"
                    onChange={e => toggleArray('decayedClasses', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
                {form.decayedClasses.includes(opt) && (
                  <input
                    value={decayedDesc[opt] || ''}
                    onChange={e => setDecayedDesc(d => ({
                      ...d, [opt]: e.target.value
                    }))}
                    placeholder="Describe…"
                    className="flex-1 border-b p-1"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="col-span-1"><FileButtons /></div>
        </div>

        {/* AMALGAM */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3 space-y-2">
            <span className="font-medium">Restored – AMALGAM</span>
            {classOptions.map(opt => (
              <div key={opt} className="flex items-center space-x-2">
                <label className="inline-flex items-center space-x-1">
                  <input
                    type="checkbox"
                    onChange={e => toggleArray('amalgam', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
                {form.amalgam.includes(opt) && (
                  <input
                    value={amalgamDesc[opt] || ''}
                    onChange={e => setAmalgamDesc(d => ({
                      ...d, [opt]: e.target.value
                    }))}
                    placeholder="Describe…"
                    className="flex-1 border-b p-1"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="col-span-1"><FileButtons /></div>
        </div>

        {/* GIC */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3 space-y-2">
            <span className="font-medium">Restored – GIC</span>
            {classOptions.map(opt => (
              <div key={opt} className="flex items-center space-x-2">
                <label className="inline-flex items-center space-x-1">
                  <input
                    type="checkbox"
                    onChange={e => toggleArray('gic', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
                {form.gic.includes(opt) && (
                  <input
                    value={gicDesc[opt] || ''}
                    onChange={e => setGicDesc(d => ({
                      ...d, [opt]: e.target.value
                    }))}
                    placeholder="Describe…"
                    className="flex-1 border-b p-1"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="col-span-1"><FileButtons /></div>
        </div>

        {/* COMPOSITE */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3 space-y-2">
            <span className="font-medium">Restored – COMPOSITE</span>
            {classOptions.map(opt => (
              <div key={opt} className="flex items-center space-x-2">
                <label className="inline-flex items-center space-x-1">
                  <input
                    type="checkbox"
                    onChange={e => toggleArray('composite', opt, e.target.checked)}
                  />
                  <span>{opt}</span>
                </label>
                {form.composite.includes(opt) && (
                  <input
                    value={compositeDesc[opt] || ''}
                    onChange={e => setCompositeDesc(d => ({
                      ...d, [opt]: e.target.value
                    }))}
                    placeholder="Describe…"
                    className="flex-1 border-b p-1"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="col-span-1"><FileButtons /></div>
        </div>

        {/* RCT WITH CROWN */}
        <div className="grid grid-cols-4 items-center gap-4">
          <div className="col-span-3 flex items-center space-x-6">
            <span className="font-medium">RCT with crown:</span>
            {crownOptions.map(opt => (
              <label key={opt} className="inline-flex items-center space-x-1">
                <input
                  type="radio"
                  name="rctCrown"
                  value={opt}
                  checked={form.rctCrown === opt}
                  onChange={handleText}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
          <div className="col-span-1"><FileButtons /></div>
        </div>

        {/* RCT WITHOUT CROWN */}
        <div className="grid grid-cols-4 items-center gap-4">
          <div className="col-span-3 flex items-center space-x-2">
            <label className="inline-flex items-center space-x-1">
              <input
                type="checkbox"
                onChange={e =>
                  setForm(f => ({ ...f, rctWithout: e.target.checked ? f.rctWithout : '' }))
                }
              />
              <span>RCT without crown:</span>
            </label>
            <input
              name="rctWithout"
              value={form.rctWithout}
              onChange={handleText}
              placeholder="Describe…"
              className="flex-1 border-b p-1"
            />
          </div>
          <div className="col-span-1"><FileButtons /></div>
        </div>

        {/* OTHERS */}
        <div className="grid grid-cols-4 items-center gap-4">
          <div className="col-span-3 flex items-center space-x-2">
            <label className="inline-flex items-center space-x-1">
              <input
                type="checkbox"
                onChange={e =>
                  setForm(f => ({ ...f, others: e.target.checked ? f.others : '' }))
                }
              />
              <span>Others :</span>
            </label>
            <input
              name="others"
              value={form.others}
              onChange={handleText}
              placeholder="Describe…"
              className="flex-1 border-b p-1"
            />
          </div>
          <div className="col-span-1"><FileButtons /></div>
        </div>

        {/* SUBMIT */}
        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Save &amp; Next
          </button>
        </div>
      </form>
    </div>
  )
}
