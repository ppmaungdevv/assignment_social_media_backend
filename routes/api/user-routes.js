import express from 'express';
import validate  from '../../middleware/validation-middleware.js';
import { registrationValidator } from '../../validator/user-validator.js';
import { register, login, logout, getProfile } from '../../controller/user-controller.js';

const router = express.Router();

router.post('/register', validate(registrationValidator), async (req, res) => {
  const data = await register(req.body)
  res.formattedResponse(data, 'User Registartion')
})

router.post('/login', validate(registrationValidator), async (req, res) => {
  const data = await login(req.body)
  res.formattedResponse(data, 'User Registartion')
})

router.post('/logout', validate(registrationValidator), async (req, res) => {
  const data = await logout(req.body)
  res.formattedResponse(data, 'User Registartion')
})

router.get('/profile',  async (req, res) => {
  // get/post data
  const data = await getProfile(1)
  res.formattedResponse(data, 'User Profile')
})



export default router;