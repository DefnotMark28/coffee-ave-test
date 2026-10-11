import { createHash, timingSafeEqual } from 'node:crypto';
import express, { type NextFunction, type Request, type RequestHandler, type Response } from 'express';
import { adminPage } from './adminPage';
import {
  ValidationError,
  checkDatabaseConnection,
  createTableRow,
  databaseLabel,
  databaseTables,
  deleteTableRow,
  ensureDatabase,
  getNotifications,
  getProducts,
  getTableRows,
  getVehicles,
  registerUser,
  updateTableRow,
} from './database';

const app = express();
app.use(express.json({ limit: '100kb' }));

// Lets async route handlers pass their errors to the error handler at the bottom.
const handle = (fn: (request: Request, response: Response) => Promise<void>): RequestHandler => (request, response, next) => {
  fn(request, response).catch(next);
};

/* ------------------------------------------------------------------ */
/* Admin password                                                      */
/* ------------------------------------------------------------------ */

// Online: set ADMIN_PASSWORD in Vercel. Without it, the admin page stays switched off.
// On your own computer: the admin page is open unless you set ADMIN_PASSWORD yourself.
function sameText(a: string, b: string) {
  const hashA = createHash('sha256').update(a).digest();
  const hashB = createHash('sha256').update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

function requireAdmin(request: Request, response: Response, next: NextFunction) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    if (process.env.VERCEL) {
      response.status(403).type('text').send('The admin page is switched off. Set ADMIN_PASSWORD in Vercel to turn it on.');
      return;
    }
    next();
    return;
  }

  const [scheme, encoded] = (request.headers.authorization ?? '').split(' ');
  if (scheme === 'Basic' && encoded) {
    const decoded = Buffer.from(encoded, 'base64').toString();
    const given = decoded.slice(decoded.indexOf(':') + 1);
    if (sameText(given, password)) {
      next();
      return;
    }
  }
  response.set('WWW-Authenticate', 'Basic realm="Coffee Ave Admin"').status(401).type('text').send('Password required.');
}

/* ------------------------------------------------------------------ */
/* Public routes (the website uses these)                              */
/* ------------------------------------------------------------------ */

app.get('/api/health', handle(async (_request, response) => {
  try {
    await ensureDatabase();
    await checkDatabaseConnection();
    response.json({ status: 'ok', database: await databaseLabel() });
  } catch (error) {
    response.status(500).json({ status: 'error', message: error instanceof Error ? error.message : 'Database error.' });
  }
}));

app.get('/api/products', handle(async (_request, response) => {
  await ensureDatabase();
  response.json(await getProducts());
}));

app.get('/api/vehicles', handle(async (_request, response) => {
  await ensureDatabase();
  response.json(await getVehicles());
}));

app.get('/api/notifications', handle(async (_request, response) => {
  await ensureDatabase();
  response.json(await getNotifications());
}));

app.post('/api/users', handle(async (request, response) => {
  await ensureDatabase();
  const user = await registerUser(request.body);
  response.status(201).json(user);
}));

/* ------------------------------------------------------------------ */
/* Admin routes (password protected online)                            */
/* ------------------------------------------------------------------ */

app.use('/api/database', requireAdmin);

app.get('/api/database/tables', (_request, response) => response.json(databaseTables));

app.get('/api/database/:table', handle(async (request, response) => {
  await ensureDatabase();
  const rows = await getTableRows(request.params.table);
  if (!rows) {
    response.status(404).json({ error: 'Table not found' });
    return;
  }
  response.json(rows);
}));

app.post('/api/database/:table', handle(async (request, response) => {
  await ensureDatabase();
  const row = await createTableRow(request.params.table, request.body);
  response.status(201).json(row);
}));

app.put('/api/database/:table/:id', handle(async (request, response) => {
  await ensureDatabase();
  const updated = await updateTableRow(request.params.table, request.params.id, request.body);
  if (!updated) {
    response.status(404).json({ error: 'Record not found.' });
    return;
  }
  response.json({ status: 'updated' });
}));

app.delete('/api/database/:table/:id', handle(async (request, response) => {
  await ensureDatabase();
  const deleted = await deleteTableRow(request.params.table, request.params.id);
  if (!deleted) {
    response.status(404).json({ error: 'Record not found.' });
    return;
  }
  response.json({ status: 'deleted' });
}));

app.get('/admin', requireAdmin, (_request, response) => {
  response.type('html').send(adminPage);
});

/* ------------------------------------------------------------------ */
/* Errors                                                              */
/* ------------------------------------------------------------------ */

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof ValidationError) {
    response.status(400).json({ error: error.message });
    return;
  }
  console.error(error);
  response.status(500).json({ error: 'Something went wrong on the server.' });
});

export default app;
