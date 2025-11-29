/* 
* for handling API success responses
*/
// import { responseWithPagination } from '../helpers/index.js'

export const successResponseMiddleware = (req, res, next) => {
  res.formattedResponse = (data = null, message = 'Success') => {

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