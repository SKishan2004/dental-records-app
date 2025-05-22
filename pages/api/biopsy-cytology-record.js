import { PrismaClient } from '@prisma/client'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const {
      patientId,
      recordDate,
      doctorName,
      registerNumber,
      biopsyRecord,
      cytologyRecord
    } = req.body

    const pid = parseInt(patientId, 10)
    if (!pid || isNaN(pid)) {
      return res.status(400).json({ error: 'Invalid or missing patientId' })
    }

    const dt = new Date(recordDate)
    const validDate = isNaN(dt.getTime()) ? new Date() : dt

    const prisma = new PrismaClient()
    await prisma.biopsyCytologyRecord.create({
      data: {
        patientId:      pid,
        recordDate:     validDate,
        doctorName:     doctorName   || '',
        registerNumber: registerNumber || '',
        biopsyRecord:   biopsyRecord   || '',
        cytologyRecord: cytologyRecord || ''
      }
    })

    res.status(201).end()
  } catch (err) {
    console.error('💥 /api/biopsy-cytology-record error:', err)
    res.status(500).json({ error: err.message })
  }
}
