import multer from 'multer'
import { PrismaClient } from '@prisma/client'

export const config = { api: { bodyParser: false } }

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (_req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })
})

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, err => err ? reject(err) : resolve())
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
  try {
    await runMiddleware(req, res, upload.fields([
      { name: 'images' },
      { name: 'studyCasts' },
      { name: 'radiographs' }
    ]))

    const prisma = new PrismaClient()
    const b = req.body

    // helper to normalize arrays
    const toArr = key => Array.isArray(b[key]) ? b[key] : b[key] ? [b[key]] : []

    await prisma.orthodonticRecord.create({
      data: {
        patientId:          parseInt(b.patientId, 10),
        recordDate:         new Date(b.recordDate),
        doctorName:         b.doctorName,
        registerNumber:     b.registerNumber,

        typeOfOcclusion:    toArr('typeOfOcclusion'),
        archShape:          toArr('archShape'),

        midlineDeviation:   b.midlineDeviation === 'true',
        openBite:           b.openBite === 'true',
        deepBite:           b.deepBite === 'true',

        crossbite:          b.crossbite === 'true',
        crossbiteDesc:      b.crossbiteDesc,

        removableAppliance: b.removableAppliance === 'true',
        removableApplianceDesc: b.removableApplianceDesc,

        fixedAppliances:    b.fixedAppliances === 'true',
        bracketMaterials:   toArr('bracketMaterials'),
        archWireTypes:      toArr('archWireTypes'),

        screwsDesc:         b.screwsDesc,
        othersDesc:         b.othersDesc,

        images:             (req.files.images     || []).map(f=>`/uploads/${f.filename}`),
        studyCasts:         (req.files.studyCasts || []).map(f=>`/uploads/${f.filename}`),
        radiographs:        (req.files.radiographs|| []).map(f=>`/uploads/${f.filename}`)
      }
    })

    res.status(201).end()
  } catch(err) {
    console.error('💥 /api/orthodontic-record error:', err)
    res.status(500).json({ error: err.message })
  }
}
