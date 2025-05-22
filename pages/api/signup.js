import prisma from '../../lib/prisma'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username, password } = req.body
  // username is phone, password is dob
  if (!username?.trim() || !password) {
    return res.status(400).json({ error: 'Missing phone or date of birth' })
  }

  const phone = username.trim()

  try {
    // check if this phone is already registered
    const existing = await prisma.user.findUnique({
      where: { username: phone }
    })
    if (existing) {
      return res.status(409).json({ error: 'Phone number already taken' })
    }

    // hash the DOB string
    const hashed = await bcrypt.hash(password, 10)

    // create the new user
    const user = await prisma.user.create({
      data: { username: phone, password: hashed }
    })

    return res.status(201).json({ id: user.id, username: user.username })
  } catch (err) {
    console.error('✘ /api/signup error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  } finally {
    await prisma.$disconnect()
  }
}
