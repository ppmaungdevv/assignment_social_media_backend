import CustomError from '../lib/custom-error.js';

export const errorResponseMiddleware = (err, req, res, next) => {
  const response = {
    status: 'error',
    message: 'Internal Server Error',
    data: null
  }
  
  if (err instanceof CustomError) {
    response['message'] = err.message
    response['code'] = err.code
    // response['error'] = err.isJson ? JSON.parse(err.error) : { error: err.error }
    if(err.isJson) {
      response['error'] = JSON.parse(err.error) 
    } else {
      console.log("-----------" + err.error);
      response['error'] = { error: err.error }
    }
    
    // response['error'] = err.error 
    return res.status(err.statusCode).json(response);
  }

  // check unique email error for prisma error
  if (err.code == 'P2002') {
    response['message'] = err.meta?.driverAdapterError?.cause.kind
    response['error'] = 'Dulpicate email'

    return res.status(400).json(response);
  }

  return res.status(500).json(response);
};