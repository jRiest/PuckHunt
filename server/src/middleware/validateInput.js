// @flow
import validator from 'is-my-json-valid';

import type {ExpressMiddlewareType, ExpressRouteType} from '../utils/types';

const VALIDATOR_OPTIONS = {verbose: true};

export default (route: ExpressRouteType): ExpressMiddlewareType => {
  const {inputSchema} = route;
  if (inputSchema) {
    const validate = validator(inputSchema, VALIDATOR_OPTIONS);
    return (req, res, next) => {
      if (!validate(req.body)) {
        /* eslint-disable no-console */
        console.log(`invalid input: ${JSON.stringify({
          type: 'inputValidationError',
          url: req.originalUrl,
          errors: validate.errors,
          input: req.body,
        }, null, 2)}`);
        /* eslint-enable no-console */
        const error = new Error(`Input schema validation error: ${JSON.stringify(validate.errors)}`);
        // $FlowIgnore
        error.status = 400;
        next(error);
      } else {
        next();
      }
    };
  } else {
    return (req, res, next) => {
      next();
    };
  }
};