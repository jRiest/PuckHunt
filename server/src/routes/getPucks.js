// @flow
import {queryPostgres} from '../utils/postgres';

import type {ExpressRouteType} from '../utils/types';

const route: ExpressRouteType = async (req, res) => {
  const rsp = await queryPostgres('SELECT * FROM pucks ORDER BY id ASC');
  res.send(rsp.rows || []);
};

export default route;