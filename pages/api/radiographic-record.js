import multer from 'multer'
import { PrismaClient } from '@prisma/client'

export const config = { api: { bodyParser: false } }

// 1. Multer setup for multiple named fields
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (_req, file, cb) =>
      cb(null, Date.now() + '-' + file.originalname)
  })
})

// 2. Promisify multer
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) =>
    fn(req, res, err => (err ? reject(err) : resolve()))
  )
}

// 3. Normalize array fields
function toArr(val) {
  if (!val) return []
  return Array.isArray(val) ? val : [val]
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
  try {
    // 4. Parse all radiograph file fields + no bodyParser
    await runMiddleware(req, res, upload.fields([
      { name: 'Occlusal' },
      { name: 'Bite wing' },
      { name: 'OPG' },
      { name: 'Lateral cephalogram' },
      { name: 'CBCT' }
    ]))

    const b = req.body
    const p = new PrismaClient()

    // 5. Map files → URLs
    const occ = (req.files['Occlusal'] || []).map(f=>`/uploads/${f.filename}`)
    const bw  = (req.files['Bite wing'] || []).map(f=>`/uploads/${f.filename}`)
    const opg = (req.files['OPG'] || []).map(f=>`/uploads/${f.filename}`)
    const lat = (req.files['Lateral cephalogram'] || []).map(f=>`/uploads/${f.filename}`)
    const cb  = (req.files['CBCT'] || []).map(f=>`/uploads/${f.filename}`)

    await p.radiographicRecord.create({
      data: {
        patientId:        parseInt(b.patientId, 10),
        recordDate:       new Date(b.recordDate),
        doctorName:       b.doctorName,
        registerNumber:   b.registerNumber,

        radiographTypes:  toArr(b.radiographTypes),

        occlusalImages:       occ,
        biteWingImages:       bw,
        opgImages:            opg,
        lateralCephImages:    lat,
        cbctImages:           cb,

        biopsyRecord:       b.biopsyRecord || null,
        cytologyRecord:     b.cytologyRecord || null
      }
    })

    res.status(201).end()
  } catch(err) {
    console.error('💥 /api/radiographic-record error:', err)
    res.status(500).json({ error: err.message })
  }
}
