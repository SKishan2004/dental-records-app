// pages/api/download-records.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const patients = await prisma.patient.findMany({
      orderBy: { id: 'asc' }
    })
    if (patients.length === 0) {
      return res.status(204).end() // No content
    }

    const columns = [
      'id',
      'name',
      'age',
      'gender',
      'dob',
      'bloodGroup',
      'address',
      'contact',
      'emergencyPerson',
      'emergencyContact',
      'recordDate',
      'doctorName',
      'registerNumber',
      'createdAt'
    ]

    const escape = v => `"${String(v ?? '').replace(/"/g, '""')}"`
    const header = columns.join(',')
    const rows = patients.map(p =>
      columns.map(col => escape(p[col])).join(',')
    )
    const csv = [header, ...rows].join('\r\n')

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="all-records.csv"'
    )
    res.status(200).send(csv)
  } catch (err) {
    console.error('💥 /api/download-records error:', err)
    res.status(500).json({ error: 'Download failed' })
  } finally {
    await prisma.$disconnect()
  }
}
