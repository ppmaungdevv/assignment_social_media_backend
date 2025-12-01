import { prisma } from '../lib/prisma.js'
import CustomError from '../lib/custom-error.js'
import { getHashedPassword, compareHashedPassword, generateJWTToken } from '../helper/helper.js'

export const register = async (req_data) => {

  const { name, email, password } = req_data
  
  const hashed_password = await getHashedPassword(password)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed_password
    }
  })

  const payload = {
    user_id: user.id,
    email: user.email
  }

  const token = await generateJWTToken(payload)

  return { token, user_id: user.id, user_name: user.name, email: user.email }
}

export const login = async (req_data) => {
  const { email, password } = req_data

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  const is_valid_pwd = await compareHashedPassword(password, user.password)

  if (!is_valid_pwd) {
    throw new CustomError({message: "Invalid credential", statusCode: 400, error: "Invalid credential"})
  }

  const payload = {
    user_id: user.id,
    email: user.email
  }

  const token = await generateJWTToken(payload)

  // refresh token table lo ml
  
  return { token, user_id: user.id, user_name: user.name, email: user.email }

}

export const logout = async (req_data) => {
  const token = req_data.authorization && req_data.authorization.split(' ')[1]

  const revoked = await prisma.revokedToken.create({
    data: {
      token,
      expireAt: new Date()
    }
  })

  console.log(revoked);

}

export const getProfile = async (id) => {

  const allUsers = await prisma.user.findMany({
    // include: {
    //   posts: true,
    // },
  })

  const data = {
    name: "Pyae",
    status: "active"
  }

  // Response: user info (id, name, email, created_at, post count, reaction count, comment count)
  return allUsers

}