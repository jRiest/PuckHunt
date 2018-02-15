// @flow
import compression from 'compression';
import express from 'express';
import bodyParser from 'body-parser';
import Bluebird from 'bluebird';

// Middleware
import validateInput from './middleware/validateInput';
import catchErrors from './middleware/catchErrors';
import errorHandler from './middleware/errorHandler';

// Routes
import health from './routes/health';
import getPucks from './routes/getPucks';
import setPuckLocation from './routes/setPuckLocation';
import clearPuckLocation from './routes/clearPuckLocation';

// Other
import {PORT} from './config';

import type {ExpressRouteType} from './utils/types';

function wrap(route: ExpressRouteType) {
  return [
    validateInput(route),
    catchErrors(route),
  ];
}

// Express
const app = express();

// Middleware
app.use(bodyParser.json({
  limit: '1mb',
}));
app.use(compression());
app.disable('x-powered-by');

// Routes
app.get('/health', ...wrap(health));
app.get('/pucks', ...wrap(getPucks));
app.post('/set_puck_location', ...wrap(setPuckLocation));
app.post('/clear_puck_location', ...wrap(clearPuckLocation));

// Error handling
app.use((req, res, next) => {
  const e = new Error(`Cannot ${req.method} ${req.originalUrl || req.url}`);
  // $FlowIgnore
  e.status = 404;
  next(e);
});
app.use(errorHandler());

// Start server
const server = app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`); // eslint-disable-line no-console
});
Bluebird.promisifyAll(server);