import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma.js'

export const register = async (req, res) => {
  //db registration
  const { username, email, password } = req.body
  //hash the password

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    //create a new user and save to database

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    })
    console.log(newUser)
    res.status(201).json({ message: 'user created successfully' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'failed to create user' })
  }
}
export const login = async (req, res) => {
  //db registration

  const { username, password } = req.body

  try {
    //check if the user exists
    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) return res.status(401).json({ message: 'user not found' })
    //check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid)
      return res.status(401).json({ message: 'Invalid password' })
    //generate cookie token and send it to the user

    // res.setHeader('Set-Cookie', 'test=' + 'myValue').json('success')
    const age = 1000 * 60 * 60 * 24 * 7
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECREAT_KEY,
      { expiresIn: age }
    )

    res
      .cookie('token', token, {
        httpOnly: true,
        // secure:true,
        maxAge: age,
      })
      .status(200)
      .json({ message: 'Login sucess' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to login!' })
  }
}

export const logout = (req, res) => {
  //db registration
  res.clearCookie('token').status(200).json({ message: 'Logout successfully' })
}
