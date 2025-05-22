// pages/api/medical-history.js

import multer from 'multer'
import { PrismaClient } from '@prisma/client'
import path from 'path'

// 1) Tell Next.js not to parse the body automatically
export const config = {
  api: {
    bodyParser: false,
  },
}

// 2) Set up multer storage
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (_req, file, cb) => {
      const uniqueName = Date.now() + path.extname(file.originalname)
      cb(null, uniqueName)
    },
  }),
})

// 3) Helper to run multer as middleware
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
    // 4) Run multer to parse files into req.files and fields into req.body
    await runMiddleware(req, res, upload.array('documents'))

    const prisma = new PrismaClient()
    const { patientId, duration, underMed } = req.body

    // Normalize the history field (might be string or array)
    let history = []
    if (req.body.history) {
      history = Array.isArray(req.body.history)
        ? req.body.history
        : [req.body.history]
    }

    // Map uploaded files to their public URLs
    const docs = (req.files || []).map((f) => `/uploads/${f.filename}`)

    // 5) Create the record in your database
    const record = await prisma.medicalHistory.create({
      data: {
        patientId: parseInt(patientId, 10),
        history,
        duration: duration || null,
        underMed: underMed === 'true',
        documents: docs,
      },
    })

    return res.status(201).json(record)
  } catch (err) {
    console.error("💥 /api/medical-history error:", err)
    return res.status(500).json({ error: err.message })
  }
}
