import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import type { Client, InValue } from '@libsql/client';
import { INITIAL_NOTIFICATIONS, INITIAL_VEHICLES, PRODUCTS } from '../frontend/src/data/mockData';

export const databaseTables = ['products', 'vehicles', 'notifications', 'users'] as const;
type TableName = (typeof databaseTables)[number];
type RecordData = Record<string, unknown>;

export class ValidationError extends Error {}

/* ------------------------------------------------------------------ */
/* Connection                                                          */
/* ------------------------------------------------------------------ */

let client: Client | null = null;
let usingTurso = false;

// Online (Vercel): uses Turso when TURSO_DATABASE_URL is set.
// On your own computer: falls back to a local file at data/coffee-ave.sqlite.
async function getClient(): Promise<Client> {
  if (client) return client;

  const url = process.env.TURSO_DATABASE_URL?.trim();
  if (url) {
    const { createClient } = await import('@libsql/client/web');
    client = createClient({
      url: url.replace(/^libsql:/, 'https:'),
      authToken: process.env.TURSO_AUTH_TOKEN?.trim(),
    });
    usingTurso = true;
    return client;
  }

  if (process.env.VERCEL) {
    throw new Error('TURSO_DATABASE_URL is not set. Add it in Vercel under Settings, Environment Variables, then redeploy.');
  }

  const { createClient } = await import('@libsql/client');
  mkdirSync('data', { recursive: true });
  client = createClient({ url: 'file:data/coffee-ave.sqlite' });
  return client;
}

export async function databaseLabel() {
  await getClient();
  return usingTurso ? 'Turso' : 'SQLite (local file)';
}

export async function checkDatabaseConnection() {
  const db = await getClient();
  await db.execute('SELECT 1');
}

/* ------------------------------------------------------------------ */
/* Setup and first time data                                           */
/* ------------------------------------------------------------------ */

let ready: Promise<void> | null = null;

export function ensureDatabase() {
  if (!ready) {
    ready = initializeDatabase().catch((error) => {
      ready = null;
      throw error;
    });
  }
  return ready;
}

async function initializeDatabase() {
  const db = await getClient();

  await db.batch(
    [
      `CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        is_wash_package INTEGER NOT NULL,
        data_json TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS vehicles (
        id TEXT PRIMARY KEY,
        plate_number TEXT NOT NULL,
        vehicle_model TEXT NOT NULL,
        stage INTEGER NOT NULL,
        stage_name TEXT NOT NULL,
        data_json TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read INTEGER NOT NULL,
        type TEXT NOT NULL,
        data_json TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        plate_number TEXT NOT NULL,
        vehicle_model TEXT NOT NULL,
        membership TEXT NOT NULL,
        created_at TEXT NOT NULL,
        data_json TEXT NOT NULL
      )`,
    ],
    'write',
  );

  await seedIfEmpty(
    'products',
    PRODUCTS.map((p) => ({ id: p.id, values: tableSpecs.products.toValues(p as unknown as RecordData), record: p })),
  );
  await seedIfEmpty(
    'vehicles',
    INITIAL_VEHICLES.map((v) => ({ id: v.id, values: tableSpecs.vehicles.toValues(v as unknown as RecordData), record: v })),
  );
  await seedIfEmpty(
    'notifications',
    INITIAL_NOTIFICATIONS.map((n) => ({ id: n.id, values: tableSpecs.notifications.toValues(n as unknown as RecordData), record: n })),
  );
}

async function seedIfEmpty(table: TableName, rows: { id: string; values: InValue[]; record: unknown }[]) {
  const db = await getClient();
  const result = await db.execute(`SELECT COUNT(*) AS count FROM ${table}`);
  if (Number(result.rows[0].count) > 0) return;

  const columns = ['id', ...tableSpecs[table].columns, 'data_json'];
  const placeholders = columns.map(() => '?').join(', ');
  await db.batch(
    rows.map((row) => ({
      sql: `INSERT OR IGNORE INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`,
      args: [row.id, ...row.values, JSON.stringify(row.record)],
    })),
    'write',
  );
}

/* ------------------------------------------------------------------ */
/* Checks for incoming data                                            */
/* ------------------------------------------------------------------ */

function requiredString(data: RecordData, key: string, maxLength = 500) {
  const value = data[key];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new ValidationError(`${key} must be a non-empty string.`);
  }
  if (value.trim().length > maxLength) {
    throw new ValidationError(`${key} is too long.`);
  }
  return value.trim();
}

function requiredNumber(data: RecordData, key: string) {
  const value = data[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new ValidationError(`${key} must be a number.`);
  }
  return value;
}

function requiredBoolean(data: RecordData, key: string) {
  const value = data[key];
  if (typeof value !== 'boolean') {
    throw new ValidationError(`${key} must be true or false.`);
  }
  return value;
}

/* ------------------------------------------------------------------ */
/* What each table stores                                              */
/* ------------------------------------------------------------------ */

// `columns` are the table columns between `id` and `data_json`.
// `toValues` checks a record and returns the values for those columns, in order.
const tableSpecs: Record<TableName, { columns: string[]; toValues: (record: RecordData) => InValue[] }> = {
  products: {
    columns: ['name', 'category', 'price', 'is_wash_package'],
    toValues: (r) => [requiredString(r, 'name'), requiredString(r, 'category'), requiredNumber(r, 'price'), Number(requiredBoolean(r, 'isWashPackage'))],
  },
  vehicles: {
    columns: ['plate_number', 'vehicle_model', 'stage', 'stage_name'],
    toValues: (r) => [requiredString(r, 'plateNumber'), requiredString(r, 'vehicleModel'), requiredNumber(r, 'stage'), requiredString(r, 'stageName')],
  },
  notifications: {
    columns: ['title', 'message', 'is_read', 'type'],
    toValues: (r) => [requiredString(r, 'title'), requiredString(r, 'message'), Number(requiredBoolean(r, 'read')), requiredString(r, 'type')],
  },
  users: {
    columns: ['name', 'email', 'plate_number', 'vehicle_model', 'membership', 'created_at'],
    toValues: (r) => {
      if (typeof r.createdAt !== 'string' || r.createdAt === '') r.createdAt = new Date().toISOString();
      return [
        requiredString(r, 'name', 100),
        requiredString(r, 'email', 254).toLowerCase(),
        requiredString(r, 'plateNumber', 20).toUpperCase(),
        requiredString(r, 'vehicleModel', 100),
        requiredString(r, 'membership', 20),
        r.createdAt as string,
      ];
    },
  },
};

function getTable(table: string): TableName | null {
  return (databaseTables as readonly string[]).includes(table) ? (table as TableName) : null;
}

/* ------------------------------------------------------------------ */
/* Admin helpers (used by the /admin page)                             */
/* ------------------------------------------------------------------ */

export async function getTableRows(table: string) {
  const name = getTable(table);
  if (!name) return null;
  const db = await getClient();
  const result = await db.execute(`SELECT * FROM ${name} ORDER BY rowid`);
  return result.rows.map((row) => ({ ...row }));
}

function buildRecord(table: TableName, id: string, data: unknown) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new ValidationError('Record data must be a JSON object.');
  }
  const record: RecordData = { ...(data as RecordData), id };
  const values = tableSpecs[table].toValues(record);
  return { record, values };
}

export async function createTableRow(table: string, data: unknown) {
  const name = getTable(table);
  if (!name) throw new ValidationError('Table not found.');
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new ValidationError('Record data must be a JSON object.');
  }
  const id = requiredString(data as RecordData, 'id', 100);
  const { record, values } = buildRecord(name, id, data);

  const columns = ['id', ...tableSpecs[name].columns, 'data_json'];
  const db = await getClient();
  try {
    await db.execute({
      sql: `INSERT INTO ${name} (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
      args: [id, ...values, JSON.stringify(record)],
    });
  } catch (error) {
    throw new ValidationError('Could not create record. The id or email may already exist.');
  }
  return record;
}

export async function updateTableRow(table: string, id: string, data: unknown) {
  const name = getTable(table);
  if (!name) throw new ValidationError('Table not found.');
  const { record, values } = buildRecord(name, id, data);

  const db = await getClient();
  const assignments = [...tableSpecs[name].columns, 'data_json'].map((column) => `${column} = ?`).join(', ');
  const result = await db.execute({
    sql: `UPDATE ${name} SET ${assignments} WHERE id = ?`,
    args: [...values, JSON.stringify(record), id],
  });
  return result.rowsAffected > 0;
}

export async function deleteTableRow(table: string, id: string) {
  const name = getTable(table);
  if (!name) throw new ValidationError('Table not found.');
  const db = await getClient();
  const result = await db.execute({ sql: `DELETE FROM ${name} WHERE id = ?`, args: [id] });
  return result.rowsAffected > 0;
}

/* ------------------------------------------------------------------ */
/* Data the website reads                                              */
/* ------------------------------------------------------------------ */

async function getRecords(table: 'products' | 'vehicles' | 'notifications') {
  const db = await getClient();
  const result = await db.execute(`SELECT data_json FROM ${table} ORDER BY rowid`);
  return result.rows.map((row) => JSON.parse(String(row.data_json)));
}

export const getProducts = () => getRecords('products');
export const getVehicles = () => getRecords('vehicles');
export const getNotifications = () => getRecords('notifications');

/* ------------------------------------------------------------------ */
/* Sign up                                                             */
/* ------------------------------------------------------------------ */

export async function registerUser(input: unknown) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new ValidationError('Sign up details are missing.');
  }
  const data = input as RecordData;
  const email = requiredString(data, 'email', 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ValidationError('Please enter a valid email address.');
  }
  const membership = data.membership === 'club' ? 'club' : 'unli';

  const db = await getClient();
  const existing = await db.execute({ sql: 'SELECT id, created_at FROM users WHERE email = ?', args: [email] });

  const id = existing.rows.length > 0 ? String(existing.rows[0].id) : `user-${randomUUID()}`;
  const createdAt = existing.rows.length > 0 ? String(existing.rows[0].created_at) : new Date().toISOString();

  const record: RecordData = {
    id,
    name: requiredString(data, 'name', 100),
    email,
    plateNumber: requiredString(data, 'plateNumber', 20).toUpperCase(),
    vehicleModel: requiredString(data, 'vehicleModel', 100),
    membership,
    createdAt,
  };
  const values = tableSpecs.users.toValues(record);

  if (existing.rows.length > 0) {
    await updateTableRow('users', id, record);
  } else {
    await db.execute({
      sql: `INSERT INTO users (id, ${tableSpecs.users.columns.join(', ')}, data_json) VALUES (?, ${values.map(() => '?').join(', ')}, ?)`,
      args: [id, ...values, JSON.stringify(record)],
    });
  }

  return { id, name: record.name, email, plateNumber: record.plateNumber, vehicleModel: record.vehicleModel, membership };
}
