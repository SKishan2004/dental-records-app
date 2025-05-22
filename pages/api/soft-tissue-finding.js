import multer from 'multer'
import { PrismaClient } from '@prisma/client'

export const config = { api: { bodyParser: false } }

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (_req, file, cb) =>
      cb(null, Date.now() + '-' + file.originalname)
  })
})

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) =>
    fn(req, res, err => (err ? reject(err) : resolve()))
  )
}

function toArr(body, key) {
  const v = body[key]
  if (!v) return []
  return Array.isArray(v) ? v : [v]
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    // parse images
    await runMiddleware(req, res, upload.array('images'))
    console.log('⚙️  Soft Tissue Finding body:', req.body)
    console.log('⚙️  Uploaded files:', req.files)

    const b = req.body

    // patientId
    const rawPid = Array.isArray(b.patientId) ? b.patientId[0] : b.patientId
    if (!rawPid) {
      console.warn('❌ missing patientId')
      return res.status(400).json({ error: 'Missing patientId' })
    }
    const patientId = parseInt(rawPid, 10)
    if (isNaN(patientId)) {
      console.warn('❌ invalid patientId', rawPid)
      return res.status(400).json({ error: 'Invalid patientId' })
    }

    // recordDate
    const rawDate = Array.isArray(b.recordDate) ? b.recordDate[0] : b.recordDate
    let recordDate
    if (!rawDate || isNaN(Date.parse(rawDate))) {
      console.warn('⚠️ invalid/missing recordDate, defaulting to now:', rawDate)
      recordDate = new Date()
    } else {
      recordDate = new Date(Date.parse(rawDate))
    }

    // build data
    const data = {
      patientId,
      recordDate,
      doctorName: Array.isArray(b.doctorName) ? b.doctorName[0] : b.doctorName || '',
      registerNumber: Array.isArray(b.registerNumber) ? b.registerNumber[0] : b.registerNumber || '',

      labialColor:       toArr(b, 'labialColor'),
      labialTexture:     toArr(b, 'labialTexture'),
      labialLesions:     (Array.isArray(b.labialLesions) ? b.labialLesions[0] : b.labialLesions) === 'true',
      labialLesionDesc:  Array.isArray(b.labialLesionDesc) ? b.labialLesionDesc[0] : b.labialLesionDesc || null,

      buccalColor:       toArr(b, 'buccalColor'),
      buccalTexture:     toArr(b, 'buccalTexture'),
      buccalLesions:     (Array.isArray(b.buccalLesions) ? b.buccalLesions[0] : b.buccalLesions) === 'true',
      buccalLesionDesc:  Array.isArray(b.buccalLesionDesc) ? b.buccalLesionDesc[0] : b.buccalLesionDesc || null,

      gingivaColor:      toArr(b, 'gingivaColor'),
      gingivaTexture:    toArr(b, 'gingivaTexture'),
      gingivaOthers:     toArr(b, 'gingivaOthers'),
      gingivaLesions:    (Array.isArray(b.gingivaLesions) ? b.gingivaLesions[0] : b.gingivaLesions) === 'true',
      gingivaLesionDesc: Array.isArray(b.gingivaLesionDesc) ? b.gingivaLesionDesc[0] : b.gingivaLesionDesc || null,

      tongueSize:        toArr(b, 'tongueSize'),
      tongueColor:       toArr(b, 'tongueColor'),
      tongueTexture:     toArr(b, 'tongueTexture'),
      tongueMobility:    toArr(b, 'tongueMobility'),
      tongueLesions:     (Array.isArray(b.tongueLesions) ? b.tongueLesions[0] : b.tongueLesions) === 'true',
      tongueLesionDesc:  Array.isArray(b.tongueLesionDesc) ? b.tongueLesionDesc[0] : b.tongueLesionDesc || null,

      floorLesions:      (Array.isArray(b.floorLesions) ? b.floorLesions[0] : b.floorLesions) === 'true',
      floorLesionDesc:   Array.isArray(b.floorLesionDesc) ? b.floorLesionDesc[0] : b.floorLesionDesc || null,

      palateColor:       toArr(b, 'palateColor'),
      palateTexture:     toArr(b, 'palateTexture'),
      palateLesions:     (Array.isArray(b.palateLesions) ? b.palateLesions[0] : b.palateLesions) === 'true',
      palateLesionDesc:  Array.isArray(b.palateLesionDesc) ? b.palateLesionDesc[0] : b.palateLesionDesc || null,

      otherFindings:     Array.isArray(b.otherFindings) ? b.otherFindings[0] : b.otherFindings || null,

      images:            (req.files || []).map(f => `/uploads/${f.filename}`)
    }

    console.log('✅ Writing SoftTissueFinding to DB:', data)

    const prisma = new PrismaClient()
    await prisma.softTissueFinding.create({ data })

    res.status(201).end()
  } catch (err) {
    console.error('💥 /api/soft-tissue-finding error:', err)
    res.status(500).json({ error: err.message })
  }
}
