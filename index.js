import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import cron from 'node-cron';
import { prisma } from './lib/prisma.js';
import { routes } from './routes/routes.js';
import { successResponseMiddleware } from './middleware/success-response-handler.js';
import { errorResponseMiddleware } from './middleware/error-response-handler.js';

// auto delete revoked refresh tokens every night at 3 AM
cron.schedule('0 3 * * *', async () => {
  console.log('cron runs every night at 3 AM', new Date().toLocaleString());
  try {
    const deleted_rt = await prisma.refreshToken.deleteMany({
      where: {
        expiresAt:{
          lt: new Date()
        }
      }
    })
    console.log(`Cleanup successful. Deleted ${deleted_rt.count} Refresh Tokens.`);
  } catch (error) {
    console.log('Clean up Refresh Token Failed:', error);
  }
})

// auto delete revoked access token every 15 mins
cron.schedule('*/15 * * * *', async () => {
  console.log('cron runs every 15 mins', new Date().toLocaleString());
  try {
    const deleted_at = await prisma.revokedToken.deleteMany({
      where: {
        expireAt:{
          lt: new Date()
        }
      }
    })
    console.log(`Cleanup successful. Deleted ${deleted_at.count} Access Tokens.`);
  } catch (error) {
    console.log('Clean up Refresh Token Failed:', error);
  }
})


const app = express()
const port = 3000

app.use(cookieParser('jgK48cxMiG'))

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())
app.use(successResponseMiddleware)
  
routes(app)

app.use(errorResponseMiddleware)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})