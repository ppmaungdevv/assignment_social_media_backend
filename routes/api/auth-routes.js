import express from 'express';
import { registrationValidator, loginValidator } from '../../validator/auth-validator.js';
import validate  from '../../middleware/validation-middleware.js';
import { register, login, refershToken, logout } from '../../controller/auth-controller.js';
import { prisma } from '../../lib/prisma.js'


const router = express.Router();

router.post('/auth/register', validate(registrationValidator), async (req, res) => {
  const data = await register(req.body)
  res.formattedResponse(data, 'User Registartion')
})

router.post('/auth/login', validate(loginValidator), async (req, res) => {
  const data = await login(req.body)
  return res.formattedResponse(data, 'Success Login')
})

router.post('/auth/refresh_token', async (req, res) => {
  const data = await refershToken(req)
  res.formattedResponse(data, 'Success Refresh')
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
