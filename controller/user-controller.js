import { prisma } from '../lib/prisma.js'
import CustomError from '../lib/custom-error.js'

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