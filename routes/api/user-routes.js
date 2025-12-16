import express from 'express';
import { checkAuth } from '../../middleware/auth-middleware.js';
import validate  from '../../middleware/validation-middleware.js';
import { registrationValidator, loginValidator } from '../../validator/user-validator.js';
import { getProfile } from '../../controller/user-controller.js';

const router = express.Router();

router.get('/profile', checkAuth, async (req, res) => {
  // get/post data
  const data = await getProfile(1)
  res.formattedResponse(data, 'User Profile')
})



export default router;