import { v4 as uuidv4 } from 'uuid'
import { prisma } from '../lib/prisma.js'
import CustomError from '../lib/custom-error.js'
import { getHashedPassword, compareHashedPassword, getAccessTokenData, getRefreshTokenData, getDataToRevoke } from '../helper/helper.js'

const createRefreshToken = async (user_id) => {
  const refresh_token_data = await getRefreshTokenData()

  const refresh_token = await prisma.refreshToken.create({
    data: { 
      ...refresh_token_data,
      user: {
        connect : {
          id: user_id
        }
      }
    }
  })

  return refresh_token

}

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

  const refresh_token = await createRefreshToken(user.id)

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

  const refresh_token = await createRefreshToken(user.id)

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

export const refershToken = async (req_data) => {

  const refresh_token = req_data.cookies.refresh_token

  const session = await prisma.refreshToken.findUnique({
    where: {
      token: refresh_token
    },
    include: {
      user: {
        select: {
          id: true,
          email: true
        }
      }
    }
  })
  
  if (!session) {
    throw new CustomError({message: 'Access Denied', code: 'INVALID_TOKEN', statusCode: 401})
  }

  const session_expiry = new Date(session.expiresAt).getTime()

  if (session.revoked || (Date.now() > session_expiry)) {
    throw new CustomError({message: 'Access Denied', code: 'INVALID_TOKEN', statusCode: 401})
  }

  // issue a new refresh token
  // const refresh_token_data = await getRefreshTokenData()

  // const new_refresh_token = await prisma.refreshToken.create({
  //   data: { 
  //     ...refresh_token_data,
  //     user: {
  //       connect : {
  //         id: session.user.id
  //       }
  //     }
  //   }
  // })

  const new_refresh_token = await createRefreshToken(session.user.id)

  // issue new access token
  const payload = {
    user_id: session.user.id,
    email: session.user.email
  }

  const access_token = await getAccessTokenData(payload)

  // revoke the old token
  const revoked_rt = await prisma.refreshToken.update({
    where: {
      token: refresh_token
    },
    data: {
      revoked: true,
      replacedByToken: new_refresh_token.token
    }
  })

  return { 
    access_token: access_token.token,
    access_token_exp: access_token.exp,
    refresh_token: new_refresh_token.token, 
    refresh_token_exp: new_refresh_token.expiresAt, 
  }
}

export const logout = async (req_data) => {
  const token = req_data.headers.authorization && req_data.headers.authorization.split(' ')[1]
  const { jti, expires_at } = await getDataToRevoke(token)

  const refresh_token = req_data.cookies.refresh_token
  

  // revoke access token
  const revoked_at = await prisma.revokedToken.create({
    data: {
      jti,
      expireAt: expires_at
    }
  })

  // revoke refresh token
  const revoked_rt = await prisma.refreshToken.update({
    where: {
      token: refresh_token
    },
    data: {
      revoked: true,
    }
  })
  console.log('test');

}