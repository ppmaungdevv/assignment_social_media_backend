/* 
* for handling API success responses
*/
// import { responseWithPagination } from '../helpers/index.js'

export const successResponseMiddleware = (req, res, next) => {
  res.formattedResponse = (data = null, message = 'Success') => {

    const auth_paths = [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/refresh_token'
      // '' // refresh token route kyan ml
    ]
    const url_path = req.baseUrl + req.path

    if (req.method == 'POST' && auth_paths.includes(url_path)) {
      res.cookie('refresh_token', data.refresh_token,{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        // sameSite: 'Strict',
        sameSite: 'Lax',
        expires: data.refresh_token_exp,
        // path: '/api/auth/refresh_auth_token'
      })
      res.cookie('auth_token', data.access_token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        expires: data.access_token_exp,
        // path: '/api/auth/refresh_auth_token'
      })
    }

    // if (req.method == 'GET' && data.total_data_count) { // response with pagination data
    //   data = responseWithPagination({ data: data.data, total_data_count: data.total_data_count, page: req.page, size: req.size })
    // }

    res.status(200).json({
      status: 'success',
      message,
      data,
    });
  };
  next();
};