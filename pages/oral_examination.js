// pages/oral_examination.js

import { useState } from 'react'
import { useRouter } from 'next/router'

export default function OralExamination() {
  const router = useRouter()
  const { patientId } = router.query

  const dentitionOpts    = ['Deciduous','Permanent','Mixed']
  const teethColorOpts   = ['Very light','Natural white','Yellowish','Greyish','Brownish']
  const abnormalityOpts  = [
    'Diastema','Crowding','Supra-eruption','Impaction','Rotation',
    'Transposition','Mesial tilt','Distal tilt','Lingual tilt',
    'Buccal tilt','Root stumps','Buccoverted'
  ]
  const periodontalOpts  = ['Gingival recession','Mobility','Bone loss']
  const wastingOpts      = ['Attrition','Abrasion','Erosion']

  const [form, setForm] = useState({
    examDate:          '',
    doctorName:        '',
    registerNumber:    '',
    dentition:         [],
    teethPresent:      '',
    missingCongenital: '',
    missingExtracted:  '',
    teethColor:        [],
    abnormalities:     [],
    periodontal:       [],
    wasting:           []
  })

  const [abnormalDesc, setAbnormalDesc]       = useState({})
  const [periodontalDesc, setPeriodontalDesc] = useState({})
  const [wastingDesc, setWastingDesc]         = useState({})

  const [oralImages, setOralImages]   = useState([])
  const [radiographs, setRadiographs] = useState([])

  const toggleArray = (field, value, checked) => {
    setForm(f => {
      const arr = f[field]
      return {
        ...f,
        [field]: checked
          ? [...arr, value]
          : arr.filter(x => x !== value)
      }
    })
    if (!checked) {
      if (field === 'abnormalities') {
        setAbnormalDesc(d => { const c = { ...d }; delete c[value]; return c })
      }
      if (field === 'periodontal') {
        setPeriodontalDesc(d => { const c = { ...d }; delete c[value]; return c })
      }
      if (field === 'wasting') {
        setWastingDesc(d => { const c = { ...d }; delete c[value]; return c })
      }
    }
  }

  const handleText = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const appendFiles = (setter, filesList) => {
    setter(prev => [...prev, ...Array.from(filesList)])
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!patientId) return alert('Missing patientId')

    const fd = new FormData()
    fd.append('patientId',        patientId)
    fd.append('examDate',         form.examDate)
    fd.append('doctorName',       form.doctorName)
    fd.append('registerNumber',   form.registerNumber)

    form.dentition.forEach(v => fd.append('dentition',     v))
    fd.append('teethPresent',     form.teethPresent)
    fd.append('missingCongenital',form.missingCongenital)
    fd.append('missingExtracted', form.missingExtracted)
    form.teethColor.forEach(v => fd.append('teethColor',    v))

    form.abnormalities.forEach(v => fd.append('abnormalities',v))
    Object.entries(abnormalDesc).forEach(([k, d]) =>
      fd.append('abnormalityDesc', JSON.stringify({ key: k, desc: d }))
    )

    form.periodontal.forEach(v => fd.append('periodontal',   v))
    Object.entries(periodontalDesc).forEach(([k, d]) =>
      fd.append('periodontalDesc', JSON.stringify({ key: k, desc: d }))
    )

    form.wasting.forEach(v => fd.append('wasting',        v))
    Object.entries(wastingDesc).forEach(([k, d]) =>
      fd.append('wastingDesc', JSON.stringify({ key: k, desc: d }))
    )

    oralImages.forEach(f => fd.append('oralImages', f))
    radiographs.forEach(f => fd.append('radiographs',f))

    const res = await fetch('/api/oral-examination', {
      method: 'POST',
      body: fd
    })

    if (res.ok) {
      router.push(`/endodontic_record?patientId=${patientId}`)
    } else {
      alert('Error saving oral examination')
    }
  }

  return (
    <div className="min-h-screen bg-yellow-100">
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded">
        <h1 className="text-lg uppercase  font-bold text-center mb-6">
          Oral Examination
        </h1>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-8"
        >
          {/* DATE / DOCTOR / REGISTER */}
          <section className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-medium">Date</label>
              <input
                type="date"
                name="examDate"
                value={form.examDate}
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
          </section>

          {/* DENTITION */}
          <section>
            <h2 className="font-semibold mb-2">Type of Dentition</h2>
            <div className="flex space-x-6">
              {dentitionOpts.map(opt => (
                <label key={opt} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={form.dentition.includes(opt)}
                    onChange={e =>
                      toggleArray('dentition', opt, e.target.checked)
                    }
                    className="h-4 w-4 accent-yellow-600"
                  />
                  <span className="ml-1">{opt}</span>
                </label>
              ))}
            </div>
          </section>

          {/* TEETH COUNTS */}
          <section className="space-y-4">
            <div>
              <label className="block font-medium">Teeth Present</label>
              <input
                type="number"
                name="teethPresent"
                value={form.teethPresent}
                onChange={handleText}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block font-medium">Missing (congenital)</label>
              <input
                type="number"
                name="missingCongenital"
                value={form.missingCongenital}
                onChange={handleText}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block font-medium">Missing (extracted)</label>
              <input
                type="number"
                name="missingExtracted"
                value={form.missingExtracted}
                onChange={handleText}
                className="w-full border rounded p-2"
              />
            </div>
          </section>

          {/* TEETH COLOUR */}
          <section>
            <h2 className="font-semibold mb-2">Teeth Colour</h2>
            <div className="flex space-x-4">
              {teethColorOpts.map(opt => (
                <label key={opt} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={form.teethColor.includes(opt)}
                    onChange={e =>
                      toggleArray('teethColor', opt, e.target.checked)
                    }
                    className="h-4 w-4 accent-yellow-600"
                  />
                  <span className="ml-1">{opt}</span>
                </label>
              ))}
            </div>
          </section>

          {/* ABNORMALITIES */}
          <section className="space-y-4">
            <h2 className="font-semibold">Abnormalities</h2>
            {abnormalityOpts.map(opt => (
              <div key={opt} className="flex items-center space-x-3">
                <label className="inline-flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={form.abnormalities.includes(opt)}
                    onChange={e =>
                      toggleArray('abnormalities', opt, e.target.checked)
                    }
                    className="h-4 w-4 accent-yellow-600"
                  />
                  <span>{opt}</span>
                </label>
                {form.abnormalities.includes(opt) && (
                  <input
                    type="text"
                    placeholder="Describe details"
                    value={abnormalDesc[opt] || ''}
                    onChange={e =>
                      setAbnormalDesc(d => ({ ...d, [opt]: e.target.value }))
                    }
                    className="flex-1 border rounded p-2"
                  />
                )}
              </div>
            ))}
          </section>

          {/* PERIODONTAL STATUS */}
          <section className="space-y-4">
            <h2 className="font-semibold">Periodontal Status</h2>
            {periodontalOpts.map(opt => (
              <div key={opt} className="flex items-center space-x-3">
                <label className="inline-flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={form.periodontal.includes(opt)}
                    onChange={e =>
                      toggleArray('periodontal', opt, e.target.checked)
                    }
                    className="h-4 w-4 accent-yellow-600"
                  />
                  <span>{opt}</span>
                </label>
                {form.periodontal.includes(opt) && (
                  <input
                    type="text"
                    placeholder="Describe details"
                    value={periodontalDesc[opt] || ''}
                    onChange={e =>
                      setPeriodontalDesc(d => ({ ...d, [opt]: e.target.value }))
                    }
                    className="flex-1 border rounded p-2"
                  />
                )}
              </div>
            ))}
          </section>

          {/* WASTING DISEASE */}
          <section className="space-y-4">
            <h2 className="font-semibold">Wasting Disease</h2>
            {wastingOpts.map(opt => (
              <div key={opt} className="flex items-center space-x-3">
                <label className="inline-flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={form.wasting.includes(opt)}
                    onChange={e =>
                      toggleArray('wasting', opt, e.target.checked)
                    }
                    className="h-4 w-4 accent-yellow-600"
                  />
                  <span>{opt}</span>
                </label>
                {form.wasting.includes(opt) && (
                  <input
                    type="text"
                    placeholder="Describe details"
                    value={wastingDesc[opt] || ''}
                    onChange={e =>
                      setWastingDesc(d => ({ ...d, [opt]: e.target.value }))
                    }
                    className="flex-1 border rounded p-2"
                  />
                )}
              </div>
            ))}
          </section>

          {/* IMAGES & RADIOGRAPHS */}
          <section>
            <h2 className="font-semibold mb-2">Images & Radiographs</h2>
            <div className="flex space-x-4">
              <label className="px-4 py-2 bg-pink-600 text-white rounded cursor-pointer">
                IMAGE
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={e => appendFiles(setOralImages, e.target.files)}
                />
              </label>
              <label className="px-4 py-2 bg-blue-900 text-white rounded cursor-pointer">
                RADIOGRAPH
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={e => appendFiles(setRadiographs, e.target.files)}
                />
              </label>
            </div>
            {(oralImages.length + radiographs.length) > 0 && (
              <p className="mt-2 text-sm text-gray-700">
                {oralImages.length} oral image(s), {radiographs.length} radiograph(s) selected
              </p>
            )}
          </section>

          {/* SUBMIT */}
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
    </div>
  )
}
