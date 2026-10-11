import express, { type NextFunction, type Request, type RequestHandler, type Response } from 'express';
import { adminPage, adminLoginPage } from './adminPage';
import {
  adminSession,
  authConfigured,
  clearFailures,
  endAdminSession,
  endMemberSession,
  memberSession,
  recordFailure,
  requireMember,
  sameText,
  startAdminSession,
  startMemberSession,
  tooManyAttempts,
} from './auth';
import {
  ValidationError,
  changeOwnPassword,
  checkDatabaseConnection,
  createTableRow,
  databaseLabel,
  databaseTables,
  deleteTableRow,
  ensureDatabase,
  getAdminStats,
  getNotifications,
  getProducts,
  getTableRows,
  getUserById,
  getVehicles,
  loginUser,
  registerUser,
  updateOwnProfile,
  updateTableRow,
} from './database';

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '100kb' }));

// Lets async route handlers pass their errors to the error handler at the bottom.
const handle = (fn: (request: Request, response: Response) => Promise<void>): RequestHandler => (request, response, next) => {
  fn(request, response).catch(next);
};

/* ------------------------------------------------------------------ */
/* Admin sign in                                                       */
/* ------------------------------------------------------------------ */

// Online: set ADMIN_PASSWORD in Vercel. Without it, the admin page stays switched off.
// On your own computer: the admin page is open unless you set ADMIN_PASSWORD yourself.
function adminAllowed(request: Request) {
  if (!process.env.ADMIN_PASSWORD) return !process.env.VERCEL;
  return adminSession(request) !== null;
}

function requireAdmin(request: Request, response: Response, next: NextFunction) {
  if (adminAllowed(request)) {
    next();
    return;
  }
  response.status(401).json({ error: 'Admin sign in required.' });
}

const clientKey = (request: Request, name: string) => `${name}:${request.ip ?? 'unknown'}`;

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

/* ------------------------------------------------------------------ */
/* Member accounts                                                     */
/* ------------------------------------------------------------------ */

function requireAuthSetup(response: Response) {
  if (authConfigured()) return true;
  response.status(503).json({ error: 'Sign in is not set up yet. Add SESSION_SECRET in Vercel, then redeploy.' });
  return false;
}

app.post('/api/auth/signup', handle(async (request, response) => {
  if (!requireAuthSetup(response)) return;
  await ensureDatabase();
  const user = await registerUser(request.body);
  startMemberSession(response, user.id);
  response.status(201).json(user);
}));

app.post('/api/auth/login', handle(async (request, response) => {
  if (!requireAuthSetup(response)) return;
  const key = clientKey(request, 'login');
  if (tooManyAttempts(key)) {
    response.status(429).json({ error: 'Too many attempts. Please wait a few minutes and try again.' });
    return;
  }
  await ensureDatabase();
  const user = await loginUser(request.body);
  if (!user) {
    recordFailure(key);
    response.status(401).json({ error: 'Email or password is not correct.' });
    return;
  }
  clearFailures(key);
  startMemberSession(response, user.id);
  response.json(user);
}));

app.post('/api/auth/logout', (_request, response) => {
  endMemberSession(response);
  response.json({ status: 'signed out' });
});

app.get('/api/auth/me', handle(async (request, response) => {
  const session = memberSession(request);
  if (!session) {
    response.json({ user: null });
    return;
  }
  await ensureDatabase();
  const user = await getUserById(session.sub);
  if (!user) endMemberSession(response);
  response.json({ user });
}));

app.put('/api/me', requireMember, handle(async (request, response) => {
  await ensureDatabase();
  response.json(await updateOwnProfile(response.locals.userId, request.body));
}));

app.put('/api/me/password', requireMember, handle(async (request, response) => {
  await ensureDatabase();
  await changeOwnPassword(response.locals.userId, request.body);
  response.json({ status: 'password changed' });
}));

/* ------------------------------------------------------------------ */
/* Admin routes (password protected online)                            */
/* ------------------------------------------------------------------ */

app.post('/api/admin/login', (request, response) => {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    response.status(403).json({ error: 'The admin page is switched off. Set ADMIN_PASSWORD in Vercel to turn it on.' });
    return;
  }
  const key = clientKey(request, 'admin');
  if (tooManyAttempts(key)) {
    response.status(429).json({ error: 'Too many attempts. Please wait a few minutes and try again.' });
    return;
  }
  const given = typeof request.body?.password === 'string' ? request.body.password : '';
  if (!sameText(given, password)) {
    recordFailure(key);
    response.status(401).json({ error: 'That password is not correct.' });
    return;
  }
  clearFailures(key);
  startAdminSession(response);
  response.json({ status: 'signed in' });
});

app.post('/api/admin/logout', (_request, response) => {
  endAdminSession(response);
  response.json({ status: 'signed out' });
});

app.use('/api/admin/stats', requireAdmin);
app.get('/api/admin/stats', handle(async (_request, response) => {
  await ensureDatabase();
  response.json(await getAdminStats());
}));

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

app.get('/admin', (request, response) => {
  if (!process.env.ADMIN_PASSWORD && process.env.VERCEL) {
    response.status(403).type('text').send('The admin page is switched off. Set ADMIN_PASSWORD in Vercel to turn it on.');
    return;
  }
  response.set('Cache-Control', 'no-store').type('html').send(adminAllowed(request) ? adminPage : adminLoginPage);
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
