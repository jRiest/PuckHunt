// @flow
import Url from 'url';
import pg from 'pg';
import _ from 'lodash';
import Bluebird from 'bluebird';

import {DATABASE_URL} from '../config';

const parsedUrl = Url.parse(DATABASE_URL);
const [user, password] = (parsedUrl.auth || '').split(':');
const config = {
  user,
  password,
  host: parsedUrl.hostname,
  port: parsedUrl.port,
  database: (parsedUrl.path || '').replace(/^\//, ''),
  max: 10,
  idleTimeoutMillis: 30000,
  ssl: parsedUrl.hostname !== 'localhost',
};

const sharedPool = _.once(() => {
  const pool = new pg.Pool(config);
  pool.on('error', (err, client) => {
    console.error(`idle postgres pool error: ${err.stack || err.message}`); // eslint-disable-line no-console
  });
  return pool;
});

export async function queryPostgres(q: string, args: Array<any> = []) {
  const pool = sharedPool();

  return new Bluebird((resolve, reject) => {
    pool.connect((err, client, done) => {
      if (err) {
        return reject(err);
      }
      client.query(q, args, (err, result) => {
        done();
        if (err) {
          console.log(`query error: ${err.stack || err.message || err}\n\nquery:\n${q}\nargs:\n${JSON.stringify(args)}`); // eslint-disable-line no-console
          return reject(err);
        }
        resolve(result);
      });
    });
  });
}