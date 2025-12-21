import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import CustomError from '../lib/custom-error.js'
import { getDataToRevoke } from '../helper/helper.js';

export const checkAuth = async (req, res, next) => {
  const auth_header = req.headers['authorization']

  const token = auth_header && auth_header.split(' ')[1]; // Extract the token part
  
  if (token == null) {
    // 401 Unauthorized: No token provided
    return res.status(401).json({ message: 'Access Denied', code: 'INVALID_TOKEN' });
  }

  const { jti } = await getDataToRevoke(token)

  const revoked_token = await prisma.revokedToken.findFirst({
    where: {
      jti,
    },
  })

  if (revoked_token) {
    // revoked token is sent
    return res.status(401).json({ message: 'Access Denied', code: 'INVALID_TOKEN' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name == 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token is Expired', code: 'EXPIRED_TOKEN' });
      }
      // 403 Forbidden: Token is invalid or tampered with
      return res.status(403).json({ message: 'Token is invalid', code: 'INVALID_TOKEN' });
    }
    req.user = user;
  });

    


  next()
}
