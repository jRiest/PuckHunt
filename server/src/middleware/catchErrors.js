// @flow
import type {ExpressMiddlewareType, ExpressRouteType} from '../utils/types';

// Catches errors from the route and passes them on to the express error handlers
export default (fn: ExpressRouteType): ExpressMiddlewareType => {
  const middleware = async (req, res, next) => {
    try {
      await fn(req, res);
      // Make sure that the handler function responded to the call
      if (!res.headersSent) {
        throw new Error(`Route handler for ${req.method} ${req.originalUrl || req.url} completed without a response`);
      }
    } catch (e) {
      next(e);
    }
  };
  return middleware;
};