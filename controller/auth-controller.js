import { v4 as uuidv4 } from 'uuid'
import { prisma } from '../lib/prisma.js'
import CustomError from '../lib/custom-error.js'
import { getHashedPassword, compareHashedPassword, getAccessTokenData, getRefreshTokenData, getDataToRevoke } from '../helper/helper.js'



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

  const token = await getAccessTokenData(payload)

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

  const refresh_token_data = await getRefreshTokenData()


  const refresh_token = await prisma.refreshToken.create({
    data: { 
      ...refresh_token_data,
      user: {
        connect : {
          id: user.id
        }
      }
    }
  })

  const payload = {
    user_id: user.id,
    email: user.email
  }

  const access_token = await getAccessTokenData(payload)
  
  return { 
    access_token: access_token.token,
    access_token_exp: access_token.exp,
    refresh_token: refresh_token.token, 
    refresh_token_exp: refresh_token.expiresAt,
    user_id: user.id, 
    user_name: user.name, 
    email: user.email 
  }

}

export const logout = async (req_data) => {
  const token = req_data.authorization && req_data.authorization.split(' ')[1]

  const { jti, expires_at } = await getDataToRevoke(token)

  const revoked = await prisma.revokedToken.create({
    data: {
      jti,
      expireAt: expires_at
    }
  })

  console.log(revoked);

}