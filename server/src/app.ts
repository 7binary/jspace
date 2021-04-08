import 'express-async-errors';
import express from 'express';
import path from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler } from './middlewares';
import { NotFoundError } from './errors';
import {
  meRoute,
  signupRoute,
  signoutRoute,
  signinRoute,
  createCellRoute,
  updateCellRoute,
  showCellRoute,
} from './routes';

const isProd = process.env.NODE_ENV === 'production';
const app = express();

// middlewares
app.set('trust-proxy', true);
app.use(express.json());
app.use(cookieSession({
  signed: false,
  secure: false,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
}));
app.use(currentUser);

// routes
app.use(meRoute);
app.use(signupRoute);
app.use(signinRoute);
app.use(signoutRoute);
app.use(createCellRoute);
app.use(updateCellRoute);
app.use(showCellRoute);
app.use(errorHandler);

// client static. Builded (prod) or Proxied (dev)
if (isProd) {
  app.use(['/'], express.static(path.join(__dirname, '../../client/build'), {
    etag: false,
    maxAge: '1s',
  }));
  app.use(['/:uuid'], express.static(path.join(__dirname, '../../client/build'), {
    etag: false,
    maxAge: '1s',
  }));
} else {
  app.use(['/'], createProxyMiddleware({
    target: `http://localhost:${process.env.CLIENT_PORT}`,
    ws: true,
    logLevel: 'silent',
  }));
}

// error handlers
app.all('*', async () => {
  // throw new NotFoundError();
});

export { app };
