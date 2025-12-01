/* 
* formatting the Error object with custom format
*/
export default class CustomError extends Error {
  constructor({ message = 'Error Occured', statusCode = 500, isJson = false, error = null }) {
    super(message);
    this.statusCode = statusCode;
    this.isJson = isJson;
    this.error = error
  }
}