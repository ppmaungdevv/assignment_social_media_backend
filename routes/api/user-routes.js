import express from 'express';
import { checkAuth } from '../../middleware/auth-middleware.js';
import validate  from '../../middleware/validation-middleware.js';
import { getProfile } from '../../controller/user-controller.js';
import { user_urls } from '../urls/user.js';

const router = express.Router();

router.get(user_urls.profile, checkAuth, async (req, res) => {
  // get/post data
  const data = await getProfile(req)
  res.formattedResponse(data, 'User Profile')
})



export default router;