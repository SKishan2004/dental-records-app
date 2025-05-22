// pages/api/prosthetic-record.js

import multer from 'multer'
import { PrismaClient } from '@prisma/client'
import path from 'path'

export const config = {
  api: {
    bodyParser: false
  }
}

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
    fn(req, res, (err) => {
      if (err) return reject(err)
      resolve()
    })
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
      { name: 'studyCast' },
      { name: 'radiographs' }
    ]))

    const prisma = new PrismaClient()
    const {
      patientId,
      removableKennedy,
      removableTeeth,
      fixedMaterial,
      fixedTeeth,
      implantType,
      implantMaterial,
      others,
      recordDate,
      doctorName,
      registerNumber
    } = req.body

    const toArray = key =>
      Array.isArray(req.body[key])
        ? req.body[key]
        : req.body[key]
        ? [req.body[key]]
        : []

    const removableMaterials = toArray('removableMaterials')
    const completeJaw        = toArray('completeJaw')
    const completeSupport    = toArray('completeSupport')
    const completeMaterial   = toArray('completeMaterial')

    const images      = (req.files['images']    || []).map(f => `/uploads/${f.filename}`)
    const studyCast   = (req.files['studyCast'] || []).map(f => `/uploads/${f.filename}`)
    const radiographs = (req.files['radiographs']|| []).map(f => `/uploads/${f.filename}`)

    await prisma.prostheticRecord.create({
      data: {
        patientId:           parseInt(patientId, 10),
        removableKennedy,
        removableMaterials,
        removableTeeth,
        fixedMaterial,
        fixedTeeth,
        implantType,
        implantMaterial,
        completeJaw,
        completeSupport,
        completeMaterial,
        others,
        recordDate:         new Date(recordDate),
        doctorName,
        registerNumber,
        images,
        studyCast,
        radiographs
      }
    })

    res.status(201).end()
  } catch (err) {
    console.error('💥 /api/prosthetic-record error:', err)
    res.status(500).json({ error: err.message })
  }
}
