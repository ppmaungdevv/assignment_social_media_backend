import z from 'zod'

// source => req.query || req.body

const validate = (schema, source = "body") => (req, res, next) => {
  const req_data = req[source]
  const result = schema.safeParse(req_data)

  if (!result.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      error: z.flattenError(result.error).fieldErrors
      // .map(e => ({
      //   path: e.path.join('.'),
      //   message: e.message
      // }))
    })
  }

  req[source] = result.data

  next()
}

export default validate

