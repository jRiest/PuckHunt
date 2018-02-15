// @flow
import {queryPostgres} from '../utils/postgres';

import type {ExpressRouteType} from '../utils/types';

const query = 'UPDATE pucks SET "lat"=$1, "lng"=$2 WHERE "id"=$3 RETURNING "id"';

const route: ExpressRouteType = async (req, res) => {
  const {id, lat, lng} = req.body;

  const rsp = await queryPostgres(query, [lat, lng, id]);
  if (!rsp.rows.length) {
    const e = new Error(`No puck exists for id '${id}'`);
    // $FlowIgnore
    e.status = 404;
    throw e;
  }
  res.send({status: 'OK'});
};

route.inputSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'number',
    },
    lat: {
      type: 'number',
    },
    lng: {
      type: 'number',
    },
  },
  required: [
    'id',
    'lat',
    'lng',
  ],
};

export default route;