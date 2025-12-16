import express from 'express';
import { registrationValidator, loginValidator } from '../../validator/auth-validator.js';
import validate  from '../../middleware/validation-middleware.js';
import { register, login, logout } from '../../controller/auth-controller.js';
import { prisma } from '../../lib/prisma.js'


const router = express.Router();

router.post('/auth/register', validate(registrationValidator), async (req, res) => {
  // const data = await register(req.body)
  
  res.formattedResponse(data, 'User Registartion')
})

router.post('/auth/login', validate(loginValidator), async (req, res) => {
  const data = await login(req.body)
  // res.cookie('refresh_token', data.refresh_token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === 'production',
  //   sameSite: 'Strict',
  //   expires: data.refresh_token_exp,
  //   // path: '/api/auth/refresh_auth_token'
  // })
  // res.cookie('auth_token', data.access_token, {
  //   httpOnly: false,
  //   secure: process.env.NODE_ENV === 'production',
  //   sameSite: 'Lax',
  //   expires: data.access_token_exp,
  //   // path: '/api/auth/refresh_auth_token'
  // })
  return res.formattedResponse(data, 'Success Login')
})

router.post('/auth/logout', async (req, res) => {
  const data = await logout(req.headers)
  res.formattedResponse(data, 'Success Logout')
})

router.get('/test/', async (req, res) => {
  const data = ''
  res.formattedResponse(data, 'Success')
})

export default router;
