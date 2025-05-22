import multer from 'multer'
import { PrismaClient } from '@prisma/client'

export const config = { api: { bodyParser: false } }

// Multer setup: two fields, “images” and “radiographs”
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    // parse both fields
    await runMiddleware(
      req,
      res,
      upload.fields([
        { name: 'images', maxCount: 10 },
        { name: 'radiographs', maxCount: 10 }
      ])
    )

    const b = req.body

    // patientId
    const rawPid = Array.isArray(b.patientId) ? b.patientId[0] : b.patientId
    if (!rawPid) return res.status(400).json({ error: 'Missing patientId' })
    const patientId = parseInt(rawPid, 10)
    if (isNaN(patientId)) return res.status(400).json({ error: 'Invalid patientId' })

    // visitDate
    const rawDate = Array.isArray(b.visitDate) ? b.visitDate[0] : b.visitDate
    if (!rawDate || isNaN(Date.parse(rawDate))) {
      return res.status(400).json({ error: 'Missing or invalid visitDate' })
    }
    const visitDate = new Date(Date.parse(rawDate))

    // build data object
    const data = {
      patientId,
      visitDate,
      doctorName: Array.isArray(b.doctorName) ? b.doctorName[0] : b.doctorName || '',
      registerNumber: Array.isArray(b.registerNumber) ? b.registerNumber[0] : b.registerNumber || '',
      summary: Array.isArray(b.summary) ? b.summary[0] : b.summary || '',
      images: (req.files.images || []).map(f => `/uploads/${f.filename}`),
      radiographs: (req.files.radiographs || []).map(f => `/uploads/${f.filename}`)
    }

    const prisma = new PrismaClient()
    await prisma.followingVisit.create({ data })

    res.status(201).end()
  } catch (err) {
    console.error('💥 /api/following-visits error:', err)
    res.status(500).json({ error: err.message })
  }
}
