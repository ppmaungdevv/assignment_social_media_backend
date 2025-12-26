import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

export const getHashedPassword = async (pwd) => {
  const salt = 10

  const hashed_pwd = await bcrypt.hash(pwd, salt)

  return hashed_pwd
}

export const compareHashedPassword = async (pwd, hashed_pwd) => {
  const is_match = await bcrypt.compare(pwd, hashed_pwd)
  return is_match
}

export const getAccessTokenData = async ( payload, ttl = '60m' ) => {
  payload.jti = uuidv4()
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: `${process.env.ATOKEN_LIFESPAN_MINS}m` || ttl }
  )

  const exp = new Date(Date.now() + (process.env.ATOKEN_LIFESPAN_MINS * 60 * 1000))

  return { token, exp }
}

export const getRefreshTokenData = async () => {
  const refresh_token = uuidv4()
  
  const expires_at = new Date()
  // expires_at.setDate(expires_at.getDate() + process.env.RTOKEN_LIFESPAN_DAYS).toISOString // a classic JavaScript "gotcha": String Concatenation.
  expires_at.setDate(expires_at.getDate() + Number(process.env.RTOKEN_LIFESPAN_DAYS)).toISOString

  const data = {
    token: refresh_token,
    expiresAt: expires_at
  }
  
  return data
}

export const getDataToRevoke = async (token) => {
  const { jti, exp } = await getDataFromToken(token)
  const expires_at = new Date(exp * 1000);
  return { jti, expires_at }
}

export const getDataFromToken = async (token) => {
  const token_data = jwt.decode(token)

  return token_data

}