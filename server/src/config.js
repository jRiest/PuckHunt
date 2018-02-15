// @flow
import envalid, {str, num} from 'envalid';
import path from 'path';
import dotenv from 'dotenv';
import _ from 'lodash';
import fs from 'fs';

import {version} from '../package.json';

try {
  const envPath = path.resolve(__dirname, '../.envDev');
  const parsedEnv = dotenv.parse(fs.readFileSync(envPath, 'utf8'));
  _.forEach(parsedEnv, (val: string, key: string) => {
    process.env[key] = val;
  });
} catch (e) {} // eslint-disable-line no-empty

const obj = envalid.cleanEnv(process.env, {
  DATABASE_URL: str(),
  NODE_ENV: str(),
  PORT: num(),
});

export const {
  DATABASE_URL,
  NODE_ENV,
  PORT,
} = obj;

export const VERSION = version;