import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { routes } from './routes/routes.js';
import { successResponseMiddleware } from './middleware/success-response-handler.js';
import { errorResponseMiddleware } from './middleware/error-response-handler.js';

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