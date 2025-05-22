// pages/api/endodontic-record.js

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
    fn(req, res, err => (err ? reject(err) : resolve()))
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    // parse multipart/form-data
    await runMiddleware(req, res, upload.fields([
      { name: 'images' },
      { name: 'radiographs' }
    ]))

    const prisma = new PrismaClient()
    const {
      patientId,
      recordDate,
      doctorName,
      registerNumber,
      fracture,
      discoloured,
      rctCrown,
      rctWithout,
      others
    } = req.body

    // helper to normalize array fields
    const toArray = key =>
      Array.isArray(req.body[key])
        ? req.body[key]
        : req.body[key]
        ? [req.body[key]]
        : []

    const decayedClasses = toArray('decayedClasses')
    const amalgam        = toArray('amalgam')
    const gic            = toArray('gic')
    const composite      = toArray('composite')

    // map uploaded files to URL paths
    const images      = (req.files['images']    || []).map(f => `/uploads/${f.filename}`)
    const radiographs = (req.files['radiographs'] || []).map(f => `/uploads/${f.filename}`)

    // create record
    await prisma.endodonticRecord.create({
      data: {
        patientId:           parseInt(patientId, 10),
        recordDate:          new Date(recordDate),
        doctorName,
        registerNumber,
        fracture,
        discoloured,
        decayedClasses,
        amalgam,
        gic,
        composite,
        rctCrown,
        rctWithout,
        others,
        images,
        radiographs
      }
    })

    res.status(201).end()
  } catch (err) {
    console.error('💥 /api/endodontic-record error:', err)
    res.status(500).json({ error: err.message })
  }
}
