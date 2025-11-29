import { prisma } from '../lib/prisma.js'

export const register = async (req_data) => {

  const { name, email, password } = req_data
  // email must be unique

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password
    }
  })

  const id = ""
  const auth_token = ""
  // resposne
  // User info (id, name, email)
  // Authentication token
  return user
}

export const login = (req_data) => {
  const { email, password } = req_data
  const id = "", name = ""
  
  return { id, name, email, auth_token }

}

export const logout = (req_data) => {
  const id = "", name = ""
  
  return { }

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