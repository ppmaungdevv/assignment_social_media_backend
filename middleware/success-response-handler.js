/* 
* for handling API success responses
*/
// import { responseWithPagination } from '../helpers/index.js'
import { auth_urls } from '../routes/urls/auth.js';


export const successResponseMiddleware = (req, res, next) => {
  res.formattedResponse = (data = null, message = 'Success') => {

    const auth_paths = [
      // '/api/auth/login',
      // '/api/auth/register',
      // '/api/auth/refresh_token'
    ]

    Object.values(auth_urls).forEach(ele => {
      auth_paths.push('/api' + ele)
    });

    const url_path = req.baseUrl + req.path

    // set cookies
    if (req.method == 'POST' && auth_paths.slice(0, 3).includes(url_path)) {
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

    // delete cookies on logout
    if (req.method == 'POST' && auth_paths.slice(3, 4).includes(url_path)) {
      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        // sameSite: 'Strict',
        sameSite: 'Lax',
        // path: '/api/auth/refresh_auth_token'
      })

      res.clearCookie('auth_token', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
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