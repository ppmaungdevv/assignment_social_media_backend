import z from 'zod'
import CustomError from '../lib/custom-error.js'
// source => req.query || req.body

const validate = (schema, source = "body") => (req, res, next) => {
  const req_data = req[source]
  const result = schema.safeParse(req_data)

  if (!result.success) {
    throw new CustomError({message: "Invalid credential", statusCode: 400, error: z.flattenError(result.error).fieldErrors})
  }

  req[source] = result.data

  next()
}

export default validate

