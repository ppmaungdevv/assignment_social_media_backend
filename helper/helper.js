import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const getHashedPassword = async (pwd) => {
  const salt = 10

  const hashed_pwd = await bcrypt.hash(pwd, salt)

  return hashed_pwd
}

export const compareHashedPassword = async (pwd, hashed_pwd) => {
  const is_match = await bcrypt.compare(pwd, hashed_pwd)
  return is_match
}

export const generateJWTToken = async ( payload ) => {
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRY || '1h' }
  )

  return token
}