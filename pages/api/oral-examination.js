// pages/api/oral-examination.js

import multer from 'multer'
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

// Turn off Next’s body parser so Multer can handle multipart
export const config = {
  api: {
    bodyParser: false
  }
}

// Set up Multer to write into ./public/uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      const dir = path.join(process.cwd(), 'public', 'uploads')
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      cb(null, dir)
    },
    filename: (_req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`)
    }
  })
})

// Helper to run multer within an async function
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, err => (err ? reject(err) : resolve()))
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  // 1. run multer to parse multipart/form-data
  try {
    await runMiddleware(req, res, upload.fields([
      { name: 'oralImages' },
      { name: 'radiographs' }
    ]))
  } catch (err) {
    console.error('Multer Error:', err)
    return res.status(500).json({ error: err.message })
  }

  const prisma = new PrismaClient()
  const b = req.body

  // normalize any field into array
  const toArr = key => {
    if (!b[key]) return []
    return Array.isArray(b[key]) ? b[key] : [b[key]]
  }

  try {
    const created = await prisma.oralExamination.create({
      data: {
        // required fields
        examDate:          new Date(b.examDate),
        doctorName:        b.doctorName,
        registerNumber:    b.registerNumber,

        // arrays
        dentition:         toArr('dentition'),
        teethColor:        toArr('teethColor'),
        abnormalities:     toArr('abnormalities'),
        periodontal:       toArr('periodontal'),
        wasting:           toArr('wasting'),

        // numeric fields (default to 0)
        teethPresent:      parseInt(b.teethPresent, 10)      || 0,
        missingCongenital: parseInt(b.missingCongenital, 10) || 0,
        missingExtracted:  parseInt(b.missingExtracted, 10)  || 0,

        // map files → public URLs
        oralImages:        (req.files.oralImages  || []).map(f=>`/uploads/${f.filename}`),
        radiographs:       (req.files.radiographs || []).map(f=>`/uploads/${f.filename}`),

        // relate back to the patient
        patient: {
          connect: { id: parseInt(b.patientId, 10) }
        }
      }
    })

    return res.status(201).json(created)
  } catch (err) {
    console.error('💥 /api/oral-examination error:', err)
    return res.status(500).json({ error: err.message })
  } finally {
    await prisma.$disconnect()
  }
}
