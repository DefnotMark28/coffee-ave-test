import 'dotenv/config';
import app from './app';
import { databaseLabel, ensureDatabase } from './database';

// This file is only for running the API on your own computer (npm run dev:backend).
// Online, Vercel uses api/index.js instead.
const port = Number(process.env.API_PORT ?? 3001);

await ensureDatabase();
const label = await databaseLabel();

app.listen(port, '127.0.0.1', () => {
  console.log(`Coffee Ave API connected to ${label} and ready at http://localhost:${port}`);
  console.log(`Database viewer: http://localhost:${port}/admin`);
});
