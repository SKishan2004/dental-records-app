// pages/api/login.js

import prisma from '../../lib/prisma'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { phone, dob } = req.body

  // both fields required
  if (!phone?.trim() || !dob) {
    return res.status(400).json({ error: 'Missing phone or date of birth' })
  }

  const trimmedPhone = phone.trim()

  // validate 10-digit phone
  if (!/^\d{10}$/.test(trimmedPhone)) {
    return res.status(400).json({ error: 'Phone must be exactly 10 digits' })
  }

  // validate DOB format YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    return res.status(400).json({ error: 'Date of birth must be YYYY-MM-DD' })
  }

  try {
    // look up the user by their phone number
    const user = await prisma.user.findUnique({
      where: { username: trimmedPhone }
    })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // compare the provided DOB string against the stored hash
    const valid = await bcrypt.compare(dob, user.password)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // TODO: establish your session or issue a JWT here

    return res.status(200).json({ id: user.id, phone: user.username })
  } catch (err) {
    console.error('✘ /api/login error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  } finally {
    await prisma.$disconnect()
  }
}
