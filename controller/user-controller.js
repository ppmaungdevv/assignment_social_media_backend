import { prisma } from '../lib/prisma.js'
import CustomError from '../lib/custom-error.js'
import { getDataFromToken } from '../helper/helper.js'


export const getProfile = async (req) => {
  const auth_header = req.headers['authorization']

  const token = auth_header && auth_header.split(' ')[1];

  const { user_id } = await getDataFromToken(token)

  const user = await prisma.user.findUnique({
    where: {
      id: user_id
    },
    select: {
      id: true,
      name: true,
      email: true
    }
  })

  // Response: user info (id, name, email, created_at, post count, reaction count, comment count)
  return user

}