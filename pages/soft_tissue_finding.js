// pages/soft_tissue_finding.js

import { useState } from 'react'
import { useRouter } from 'next/router'
import PageHeader from '../components/PageHeader'

export default function SoftTissueFinding() {
  const router = useRouter()
  const { patientId } = router.query

  const colorOpts = ['Pink','Red','White','Pigmented']
  const labialTextureOpts  = ['Smooth','Rough','Ulcerated','Papillary']
  const buccalTextureOpts  = ['Smooth','Rough','Ulcerated','Papillary']
  const gingivaTextureOpts = ['Smooth','Stippled','Ulcerated']
  const gingivaOtherOpts   = ['Bleeding','Recession','Overgrowth']
  const tongueSizeOpts     = ['Normal','Macroglossia','Microglossia']
  const tongueTextureOpts  = ['Smooth','Ulcerated','Papillary','Atrophy','Fissured']
  const tongueMobilityOpts = ['Normal','Restricted']

  const [form, setForm] = useState({
    recordDate:        '',
    doctorName:        '',
    registerNumber:    '',

    labialColor:       [], 
    labialTexture:     [],
    labialLesions:     'no',
    labialLesionDesc:  '',

    buccalColor:       [],
    buccalTexture:     [],
    buccalLesions:     'no',
    buccalLesionDesc:  '',

    gingivaColor:      [],
    gingivaTexture:    [],
    gingivaOthers:     [],
    gingivaLesions:    'no',
    gingivaLesionDesc: '',

    tongueSize:        [],
    tongueColor:       [],
    tongueTexture:     [],
    tongueMobility:    [],
    tongueLesions:     'no',
    tongueLesionDesc:  '',

    floorLesions:      'no',
    floorLesionDesc:   '',

    palateColor:       [],
    palateTexture:     [],
    palateLesions:     'no',
    palateLesionDesc:  '',

    otherFindings:     ''
  })

  const [images, setImages] = useState([])

  const handleArr = (field, val, checked) => {
    setForm(f => {
      const arr = f[field]
      return { 
        ...f, 
        [field]: checked 
          ? [...arr, val] 
          : arr.filter(x => x !== val) 
      }
    })
  }

  const handleLesion = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
  }

  const handleText = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleFile = e => {
    setImages(Array.from(e.target.files))
  }

  const onSubmit = async e => {
    e.preventDefault()
    if (!patientId) {
      alert('Missing patientId')
      return
    }

    const fd = new FormData()
    fd.append('patientId',      patientId)
    fd.append('recordDate',     form.recordDate)
    fd.append('doctorName',     form.doctorName)
    fd.append('registerNumber', form.registerNumber)

    const appendArr = key => form[key].forEach(v => fd.append(key, v))

    // Labial
    appendArr('labialColor')
    appendArr('labialTexture')
    fd.append('labialLesions', form.labialLesions)
    fd.append('labialLesionDesc', form.labialLesionDesc)

    // Buccal
    appendArr('buccalColor')
    appendArr('buccalTexture')
    fd.append('buccalLesions', form.buccalLesions)
    fd.append('buccalLesionDesc', form.buccalLesionDesc)

    // Gingiva
    appendArr('gingivaColor')
    appendArr('gingivaTexture')
    appendArr('gingivaOthers')
    fd.append('gingivaLesions', form.gingivaLesions)
    fd.append('gingivaLesionDesc', form.gingivaLesionDesc)

    // Tongue
    appendArr('tongueSize')
    appendArr('tongueColor')
    appendArr('tongueTexture')
    appendArr('tongueMobility')
    fd.append('tongueLesions', form.tongueLesions)
    fd.append('tongueLesionDesc', form.tongueLesionDesc)

    // Floor of Mouth
    fd.append('floorLesions', form.floorLesions)
    fd.append('floorLesionDesc', form.floorLesionDesc)

    // Palate
    appendArr('palateColor')
    appendArr('palateTexture')
    fd.append('palateLesions', form.palateLesions)
    fd.append('palateLesionDesc', form.palateLesionDesc)

    // Other Findings
    fd.append('otherFindings', form.otherFindings)

    // Images
    images.forEach(f => fd.append('images', f))

    const res = await fetch('/api/soft-tissue-finding', {
      method: 'POST',
      body: fd
    })

    if (res.ok) {
      router.push(`/radiographic_record?patientId=${patientId}`)
    } else {
      const err = await res.json().catch(() => ({}))
      console.error(err)
      alert(err.error || 'Error saving soft tissue finding')
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader title="Soft Tissue Finding" />

      <form onSubmit={onSubmit} encType="multipart/form-data" className="space-y-8">

        {/* ─── TOP: Date / Doctor / Reg# ─── */}
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

        {/* Labial Mucosa */}
        <section>
          <h2 className="font-semibold">Labial Mucosa</h2>
          <div className="grid gap-2">
            <div>
              <strong>Color:</strong>
              {colorOpts.map(c => (
                <label key={c} className="inline-flex items-center ml-4">
                  <input
                    type="checkbox"
                    onChange={e => handleArr('labialColor', c, e.target.checked)}
                  />
                  <span className="ml-1">{c}</span>
                </label>
              ))}
            </div>
            <div>
              <strong>Texture:</strong>
              {labialTextureOpts.map(t => (
                <label key={t} className="inline-flex items-center ml-4">
                  <input
                    type="checkbox"
                    onChange={e => handleArr('labialTexture', t, e.target.checked)}
                  />
                  <span className="ml-1">{t}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <strong>Lesions:</strong>
              {['yes','no'].map(v => (
                <label key={v} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="labialLesions"
                    checked={form.labialLesions === v}
                    onChange={() => handleLesion('labialLesions', v)}
                  />
                  <span className="ml-1">{v.charAt(0).toUpperCase() + v.slice(1)}</span>
                </label>
              ))}
              <input
                name="labialLesionDesc"
                value={form.labialLesionDesc}
                onChange={handleText}
                placeholder="Describe…"
                className="ml-4 border-b-2 border-pink-500 flex-1 p-1"
              />
            </div>
          </div>
        </section>

        {/* Buccal Mucosa */}
        <section>
          <h2 className="font-semibold">Buccal Mucosa</h2>
          <div className="grid gap-2">
            <div>
              <strong>Color:</strong>
              {colorOpts.map(c => (
                <label key={c} className="inline-flex items-center ml-4">
                  <input
                    type="checkbox"
                    onChange={e => handleArr('buccalColor', c, e.target.checked)}
                  />
                  <span className="ml-1">{c}</span>
                </label>
              ))}
            </div>
            <div>
              <strong>Texture:</strong>
              {buccalTextureOpts.map(t => (
                <label key={t} className="inline-flex items-center ml-4">
                  <input
                    type="checkbox"
                    onChange={e => handleArr('buccalTexture', t, e.target.checked)}
                  />
                  <span className="ml-1">{t}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <strong>Lesions:</strong>
              {['yes','no'].map(v => (
                <label key={v} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="buccalLesions"
                    checked={form.buccalLesions === v}
                    onChange={() => handleLesion('buccalLesions', v)}
                  />
                  <span className="ml-1">{v.charAt(0).toUpperCase() + v.slice(1)}</span>
                </label>
              ))}
              <input
                name="buccalLesionDesc"
                value={form.buccalLesionDesc}
                onChange={handleText}
                placeholder="Describe…"
                className="ml-4 border-b-2 border-pink-500 flex-1 p-1"
              />
            </div>
          </div>
        </section>

        {/* Gingiva */}
        <section>
          <h2 className="font-semibold">Gingiva</h2>
          <div className="grid gap-2">
            <div>
              <strong>Color:</strong>
              {['Pink','Red','Blue-black'].map(c => (
                <label key={c} className="inline-flex items-center ml-4">
                  <input
                    type="checkbox"
                    onChange={e => handleArr('gingivaColor', c, e.target.checked)}
                  />
                  <span className="ml-1">{c}</span>
                </label>
              ))}
            </div>
            <div>
              <strong>Texture:</strong>
              {gingivaTextureOpts.map(t => (
                <label key={t} className="inline-flex items-center ml-4">
                  <input
                    type="checkbox"
                    onChange={e => handleArr('gingivaTexture', t, e.target.checked)}
                  />
                  <span className="ml-1">{t}</span>
                </label>
              ))}
            </div>
            <div>
              <strong>Others:</strong>
              {gingivaOtherOpts.map(o => (
                <label key={o} className="inline-flex items-center ml-4">
                  <input
                    type="checkbox"
                    onChange={e => handleArr('gingivaOthers', o, e.target.checked)}
                  />
                  <span className="ml-1">{o}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <strong>Lesions:</strong>
              {['yes','no'].map(v => (
                <label key={v} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gingivaLesions"
                    checked={form.gingivaLesions === v}
                    onChange={() => handleLesion('gingivaLesions', v)}
                  />
                  <span className="ml-1">{v.charAt(0).toUpperCase() + v.slice(1)}</span>
                </label>
              ))}
              <input
                name="gingivaLesionDesc"
                value={form.gingivaLesionDesc}
                onChange={handleText}
                placeholder="Describe…"
                className="ml-4 border-b-2 border-pink-500 flex-1 p-1"
              />
            </div>
          </div>
        </section>

        {/* Tongue */}
        <section>
          <h2 className="font-semibold">Tongue</h2>
          <div className="grid gap-2">
            <div>
              <strong>Size:</strong>
              {tongueSizeOpts.map(s => (
                <label key={s} className="inline-flex items-center ml-4">
                  <input
                    type="checkbox"
                    onChange={e => handleArr('tongueSize', s, e.target.checked)}
                  />
                  <span className="ml-1">{s}</span>
                </label>
              ))}
            </div>
            <div>
              <strong>Color:</strong>
              {colorOpts.map(c => (
                <label key={c} className="inline-flex items-center ml-4">
                  <input
                    type="checkbox"
                    onChange={e => handleArr('tongueColor', c, e.target.checked)}
                  />
                  <span className="ml-1">{c}</span>
                </label>
              ))}
            </div>
            <div>
              <strong>Texture:</strong>
              {tongueTextureOpts.map(t => (
                <label key={t} className="inline-flex items-center ml-4">
                  <input
                    type="checkbox"
                    onChange={e => handleArr('tongueTexture', t, e.target.checked)}
                  />
                  <span className="ml-1">{t}</span>
                </label>
              ))}
            </div>
            <div>
              <strong>Mobility:</strong>
              {tongueMobilityOpts.map(m => (
                <label key={m} className="inline-flex items-center ml-4">
                  <input
                    type="checkbox"
                    onChange={e => handleArr('tongueMobility', m, e.target.checked)}
                  />
                  <span className="ml-1">{m}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <strong>Lesions:</strong>
              {['yes','no'].map(v => (
                <label key={v} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="tongueLesions"
                    checked={form.tongueLesions === v}
                    onChange={() => handleLesion('tongueLesions', v)}
                  />
                  <span className="ml-1">{v.charAt(0).toUpperCase() + v.slice(1)}</span>
                </label>
              ))}
              <input
                name="tongueLesionDesc"
                value={form.tongueLesionDesc}
                onChange={handleText}
                placeholder="Describe…"
                className="ml-4 border-b-2 border-pink-500 flex-1 p-1"
              />
            </div>
          </div>
        </section>

        {/* Floor of Mouth */}
        <section>
          <h2 className="font-semibold">Floor of Mouth</h2>
          <div className="flex items-center space-x-4">
            <strong>Lesions:</strong>
            {['yes','no'].map(v => (
              <label key={v} className="inline-flex items-center">
                <input
                  type="radio"
                  name="floorLesions"
                  checked={form.floorLesions === v}
                  onChange={() => handleLesion('floorLesions', v)}
                />
                <span className="ml-1">{v.charAt(0).toUpperCase() + v.slice(1)}</span>
              </label>
            ))}
            <input
              name="floorLesionDesc"
              value={form.floorLesionDesc}
              onChange={handleText}
              placeholder="Describe…"
              className="ml-4 border-b-2 border-pink-500 flex-1 p-1"
            />
          </div>
        </section>

        {/* Palate */}
        <section>
          <h2 className="font-semibold">Hard & Soft Palate</h2>
          <div className="grid gap-2">
            <div>
              <strong>Color:</strong>
              {colorOpts.map(c => (
                <label key={c} className="inline-flex items-center ml-4">
                  <input
                    type="checkbox"
                    onChange={e => handleArr('palateColor', c, e.target.checked)}
                  />
                  <span className="ml-1">{c}</span>
                </label>
              ))}
            </div>
            <div>
              <strong>Texture:</strong>
              {buccalTextureOpts.map(t => (
                <label key={t} className="inline-flex items-center ml-4">
                  <input
                    type="checkbox"
                    onChange={e => handleArr('palateTexture', t, e.target.checked)}
                  />
                  <span className="ml-1">{t}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <strong>Lesions:</strong>
              {['yes','no'].map(v => (
                <label key={v} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="palateLesions"
                    checked={form.palateLesions === v}
                    onChange={() => handleLesion('palateLesions', v)}
                  />
                  <span className="ml-1">{v.charAt(0).toUpperCase() + v.slice(1)}</span>
                </label>
              ))}
              <input
                name="palateLesionDesc"
                value={form.palateLesionDesc}
                onChange={handleText}
                placeholder="Describe…"
                className="ml-4 border-b-2 border-pink-500 flex-1 p-1"
              />
            </div>
          </div>
        </section>

        {/* Other Findings */}
        <section>
          <h2 className="font-semibold">Other Findings</h2>
          <input
            name="otherFindings"
            value={form.otherFindings}
            onChange={handleText}
            placeholder="__________________________"
            className="w-full border-b-2 border-pink-500 p-1"
          />
        </section>

        {/* Upload Images */}
        <section>
          <label className="block font-medium">Upload Images</label>
          <label className="inline-block px-3 py-1 bg-pink-600 text-white rounded cursor-pointer mt-1">
            IMAGE
            <input
              type="file"
              multiple
              hidden
              onChange={handleFile}
            />
          </label>
        </section>

        {/* Save & Next */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded p-2"
        >
          Save & Next
        </button>
      </form>
    </div>
  )
}
