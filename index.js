import express from 'express';
import cors from 'cors';
import { routes } from './routes/routes.js';
import { successResponseMiddleware } from './middleware/success-response-handler.js';
import { errorResponseMiddleware } from './middleware/error-response-handler.js';

const app = express()
const port = 3000

app.use(cors())

app.use(express.json())
app.use(successResponseMiddleware)
  
routes(app)

app.use(errorResponseMiddleware)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})