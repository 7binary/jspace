require('dotenv').config({ path: __dirname + '/../.env' });
import { Cell, User } from './models';
import { app } from './app';
import { db } from './db';
import { DatabaseConnectionError } from './errors';

const start = async () => {
  console.log('...starting');

  ['SERVER_PORT', 'DB_STRING', 'JWT_KEY'].forEach(env => {
    if (!(env in process.env)) throw new Error(`${env} must be defined @ .env`);
  });

  try {
    await db.authenticate();
    await db.sync({ alter: true });
    await Cell.sync({ alter: true });
    await User.sync({ alter: true });
    console.log(`=> Connected to DB ${process.env.DB_STRING}`);
  } catch (error) {
    throw new DatabaseConnectionError(error.toString());
  }

  app.listen(process.env.SERVER_PORT, async () => {
    console.log(`=> Server Listens port ${process.env.SERVER_PORT}`);
  });
};

start();

