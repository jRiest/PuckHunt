// @flow
import type {ExpressErrorHandlerType} from '../utils/types';

function getErrorStatusCode(err, res) {
  const status = err.status || err.statusCode || res.statusCode;
  if (typeof status === 'number' && status >= 400 && status < 600) {
    return status;
  }
  return 500;
}

function getMessage(e: Error) {
  if (typeof e === 'string') {
    return e;
  } else if (e && typeof e === 'object' && e.stack) {
    return e.stack;
  } else if (e && typeof e === 'object' && e.message) {
    return e.message;
  } else if (e) {
    return JSON.stringify(e);
  } else {
    return 'Unknown error';
  }
}

export default (): ExpressErrorHandlerType => {
  return (err: any, req, res, next) => {
    // If the headers have already been sent, log an error and then bail
    if (res.headersSent) {
      console.log(`Error handler triggered after headers had been sent: ${err}`); // eslint-disable-line no-console
      return;
    }

    res
      .status(getErrorStatusCode(err, res))
      .send({
        error: getMessage(err),
      });
  };
};