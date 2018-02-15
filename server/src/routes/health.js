// @flow
import {VERSION} from '../config';

import type {ExpressRouteType} from '../utils/types';

const route: ExpressRouteType = async (req, res) => {
  res.send({
    success: true,
    version: VERSION,
  });
};

export default route;