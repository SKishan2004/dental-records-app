// pages/api/records.js

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const {
      name,
      age,
      gender,
      dob,
      bloodGroup,
      address,
      contact,
      emergencyPerson,
      emergencyContact,
      recordDate
    } = req.body

    if (!name || !age || !gender || !dob || !recordDate) {
      return res.status(400).json({ error: 'Missing one or more required fields.' })
    }

    const patient = await prisma.patient.create({
      data: {
        name,
        age:                Number(age),
        gender,
        dob:                new Date(dob),
        bloodGroup,
        address,
        contact,
        emergencyPerson,
        emergencyContact,
        recordDate:         new Date(recordDate)
        // doctorName & registerNumber are now optional and omitted
      }
    })

    return res.status(201).json(patient)
  } catch (error) {
    console.error('💥 POST /api/records error:', error)
    return res.status(500).json({ error: error.message })
  }
}
