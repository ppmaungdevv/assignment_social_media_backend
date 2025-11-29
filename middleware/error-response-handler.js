export const errorResponseMiddleware = (err, req, res, next) => {
  
  const response = {
    status: 'error',
    message: 'Internal Server Error',
    data: null
  }

  console.log(err);
  return res.status(500).json(response);
};