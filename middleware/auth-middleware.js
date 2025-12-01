import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import CustomError from '../lib/custom-error.js'

export const checkAuth = async (req, res, next) => {
  const auth_header = req.headers['authorization']

  const token = auth_header && auth_header.split(' ')[1]; // Extract the token part

  if (token == null) {
    // 401 Unauthorized: No token provided
    return res.status(401).json({ message: 'Access Denied' });
  }

  const revoked_token = await prisma.revokedToken.findFirst({
    where: {
      token,
    },
  })

  if (revoked_token) {
    console.log('revoked token');
    return res.status(401).json({ message: 'Access Denied' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // 403 Forbidden: Token is invalid, expired, or tampered with
      return res.status(403).json({ message: 'Token is invalid or expired.' });
    }
    console.log(user);
    req.user = user;
  });

    


  next()
}
