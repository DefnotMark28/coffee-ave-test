// backend/app.ts
import express from "express";

// backend/adminPage.ts
var styles = `
      :root { color-scheme: dark; --bg:#171412; --card:#211d1a; --card2:#2a2420; --line:rgba(255,255,255,.09); --text:#ede8e3; --muted:#a39a91; --red:#c0392b; --gold:#d4af37; --green:#34d399; --blue:#60a5fa; }
      * { box-sizing: border-box; }
      body { margin: 0; background: var(--bg); color: var(--text); font-family: "Plus Jakarta Sans", system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
      h1, h2, h3, .brand b { font-family: "Cormorant Garamond", Georgia, serif; font-weight: 700; margin: 0; }
      button, input, select, textarea { font: inherit; color: inherit; }
      button { cursor: pointer; }
      .brand { display: flex; align-items: center; gap: 12px; }
      .mark { width: 42px; height: 42px; border-radius: 50%; border: 1px solid rgba(212,175,55,.45); display: grid; place-items: center; background: linear-gradient(135deg,#28211c,#120e0b); color: var(--gold); font-size: 20px; }
      .brand b { font-size: 24px; letter-spacing: .08em; display: block; line-height: 1; }
      .brand small { color: var(--gold); letter-spacing: .25em; font-size: 10px; font-weight: 600; text-transform: uppercase; }
      a.btn { color: var(--text); display: inline-block; }
      .btn { padding: 9px 16px; border-radius: 10px; border: 1px solid var(--line); background: var(--card2); font-size: 13px; font-weight: 600; transition: .15s; }
      .btn:hover { border-color: rgba(212,175,55,.5); }
      .btn.primary { background: var(--red); border-color: var(--red); color: #fff; }
      .btn.primary:hover { background: #a93226; }
      .btn.danger:hover { border-color: #ef4444; color: #fca5a5; }
      .btn:disabled { opacity: .5; cursor: not-allowed; }
      input, select, textarea { width: 100%; padding: 10px 12px; border-radius: 10px; border: 1px solid var(--line); background: #14110f; font-size: 14px; }
      input:focus, select:focus, textarea:focus { outline: none; border-color: var(--gold); }
      label { display: block; font-size: 12px; font-weight: 600; color: var(--muted); margin-bottom: 5px; }
      .error { color: #f87171; font-size: 13px; min-height: 1.3em; margin: 8px 0 0; }
`;
var fontLink = `<link rel="preconnect" href="https://fonts.googleapis.com" /><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />`;
var adminLoginPage = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Coffee Ave Admin</title>
    ${fontLink}
    <style>${styles}
      body { min-height: 100vh; display: grid; place-items: center; padding: 20px; background: radial-gradient(circle at 80% 0%, rgba(192,57,43,.18), transparent 45%), var(--bg); }
      .panel { width: min(400px, 100%); background: var(--card); border: 1px solid rgba(212,175,55,.2); border-radius: 20px; padding: 32px; box-shadow: 0 25px 60px rgba(0,0,0,.5); }
      .panel h1 { font-size: 30px; margin: 26px 0 4px; }
      .panel p { color: var(--muted); font-size: 13px; margin: 0 0 20px; }
      .panel .btn { width: 100%; margin-top: 14px; padding: 12px; }
    </style>
  </head>
  <body>
    <form class="panel" id="login">
      <div class="brand"><div class="mark">&#9749;</div><div><b>COFFEE AVE</b><small>Admin</small></div></div>
      <h1>Staff sign in</h1>
      <p>Enter the admin password to manage members, vehicles and the menu.</p>
      <label for="password">Admin password</label>
      <input id="password" type="password" autocomplete="current-password" required autofocus />
      <p class="error" id="error" role="alert"></p>
      <button class="btn primary" type="submit" id="submit">Sign in</button>
    </form>
    <script>
      document.querySelector('#login').addEventListener('submit', async (event) => {
        event.preventDefault();
        const error = document.querySelector('#error');
        const button = document.querySelector('#submit');
        error.textContent = '';
        button.disabled = true;
        try {
          const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: document.querySelector('#password').value }),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || 'Could not sign in.');
          location.reload();
        } catch (e) {
          error.textContent = e.message;
          button.disabled = false;
        }
      });
    </script>
  </body>
</html>`;
var adminPage = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Coffee Ave Admin</title>
    ${fontLink}
    <style>${styles}
      main { max-width: 1200px; margin: 0 auto; padding: 24px 20px 60px; }
      header { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-bottom: 20px; border-bottom: 1px solid var(--line); flex-wrap: wrap; }
      .actions { display: flex; gap: 8px; }
      .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; margin: 24px 0; }
      .stat { background: var(--card); border: 1px solid var(--line); border-radius: 16px; padding: 18px; }
      .stat span { font-size: 11px; text-transform: uppercase; letter-spacing: .15em; color: var(--gold); font-weight: 600; }
      .stat strong { display: block; font-family: "Cormorant Garamond", Georgia, serif; font-size: 40px; line-height: 1.1; margin: 6px 0 2px; }
      .stat em { font-style: normal; font-size: 12px; color: var(--muted); }
      .tabs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
      .tab { padding: 9px 16px; border-radius: 999px; border: 1px solid var(--line); background: transparent; font-size: 13px; font-weight: 600; color: var(--muted); }
      .tab[aria-selected="true"] { background: var(--red); border-color: var(--red); color: #fff; }
      .bar { display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
      .bar input { max-width: 320px; }
      .bar .grow { flex: 1; }
      .wrap { background: var(--card); border: 1px solid var(--line); border-radius: 16px; overflow: auto; }
      table { width: 100%; border-collapse: collapse; font-size: 13px; }
      th { text-align: left; padding: 12px 14px; font-size: 11px; text-transform: uppercase; letter-spacing: .1em; color: var(--muted); background: var(--card2); position: sticky; top: 0; white-space: nowrap; }
      td { padding: 12px 14px; border-top: 1px solid var(--line); vertical-align: middle; max-width: 340px; overflow-wrap: anywhere; }
      tr:hover td { background: rgba(255,255,255,.02); }
      td.row-actions { white-space: nowrap; text-align: right; }
      td.row-actions .btn { padding: 5px 10px; font-size: 12px; margin-left: 4px; }
      .pill { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; border: 1px solid var(--line); }
      .pill.gray { background: rgba(156,163,175,.15); color: #d1d5db; }
      .pill.blue { background: rgba(96,165,250,.15); color: var(--blue); border-color: rgba(96,165,250,.35); }
      .pill.green { background: rgba(52,211,153,.15); color: var(--green); border-color: rgba(52,211,153,.35); }
      .pill.gold { background: rgba(212,175,55,.15); color: var(--gold); border-color: rgba(212,175,55,.35); }
      .empty { padding: 40px; text-align: center; color: var(--muted); }
      dialog { width: min(640px, calc(100% - 24px)); max-height: 90vh; padding: 0; border: 1px solid rgba(212,175,55,.25); border-radius: 18px; background: var(--card); color: var(--text); }
      dialog::backdrop { background: rgba(0,0,0,.75); }
      dialog form { padding: 24px; }
      dialog h2 { font-size: 26px; margin-bottom: 16px; }
      .fields { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; max-height: 55vh; overflow: auto; padding: 2px; }
      .fields .full { grid-column: 1 / -1; }
      .fields textarea { min-height: 90px; font-family: Consolas, monospace; font-size: 12px; }
      .check { display: flex; align-items: center; gap: 8px; padding-top: 26px; }
      .check input { width: auto; }
      .check label { margin: 0; }
      .dialog-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
      @media (max-width: 600px) { .fields { grid-template-columns: 1fr; } }
    </style>
  </head>
  <body>
    <main>
      <header>
        <div class="brand"><div class="mark">&#9749;</div><div><b>COFFEE AVE</b><small>Admin dashboard</small></div></div>
        <div class="actions"><a class="btn" href="/" style="text-decoration:none">View website</a><button class="btn" id="logout" type="button">Sign out</button></div>
      </header>

      <section class="stats" id="stats"></section>

      <div class="tabs" id="tabs" role="tablist"></div>
      <div class="bar">
        <input id="search" type="search" placeholder="Search this list" />
        <span class="grow"></span>
        <button class="btn primary" id="add" type="button">+ Add</button>
      </div>
      <div class="wrap"><table id="records"></table><div class="empty" id="empty" hidden></div></div>

      <dialog id="editor">
        <form id="record-form">
          <h2 id="editor-title">Edit</h2>
          <div class="fields" id="fields"></div>
          <p class="error" id="error" role="alert"></p>
          <div class="dialog-actions"><button class="btn" id="cancel" type="button">Cancel</button><button class="btn primary" type="submit">Save</button></div>
        </form>
      </dialog>
    </main>
    <script>
      const $ = (selector) => document.querySelector(selector);
      const peso = (n) => '\\u20B1' + Number(n).toLocaleString();
      const stagePill = (d) => {
        const color = d.stage === 3 ? 'green' : d.stage === 2 ? 'blue' : 'gray';
        return '<span class="pill ' + color + '">Stage ' + d.stage + ': ' + escapeHtml(d.stageName) + '</span>';
      };
      function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
      }

      // What to show for each list, and what a new record starts as.
      const tables = {
        users: {
          label: 'Members',
          columns: [
            ['Name', (d) => escapeHtml(d.name)],
            ['Email', (d) => escapeHtml(d.email)],
            ['Plate', (d) => '<code>' + escapeHtml(d.plateNumber) + '</code>'],
            ['Vehicle', (d) => escapeHtml(d.vehicleModel)],
            ['Plan', (d) => '<span class="pill gold">' + (d.membership === 'club' ? 'Lounge Club' : 'Unli-Wash VIP') + '</span>'],
            ['Joined', (d) => escapeHtml((d.createdAt || '').slice(0, 10))],
          ],
          blank: { id: 'user-' + Date.now(), name: '', email: '', plateNumber: '', vehicleModel: '', membership: 'unli' },
        },
        vehicles: {
          label: 'Vehicles',
          columns: [
            ['Plate', (d) => '<code>' + escapeHtml(d.plateNumber) + '</code>'],
            ['Vehicle', (d) => escapeHtml(d.vehicleModel)],
            ['Package', (d) => escapeHtml(d.servicePackage)],
            ['Bay', (d) => escapeHtml(d.bayNumber)],
            ['Status', stagePill],
            ['Progress', (d) => escapeHtml(d.stageProgressPercent) + '%'],
          ],
          blank: { id: 'veh-' + Date.now(), plateNumber: '', vehicleModel: '', vehicleColor: '', colorHex: '#000000', servicePackage: '', startTime: '', estimatedDuration: '', stage: 1, stageName: 'Preparing', stageProgressPercent: 0, bayNumber: 1 },
          advance: true,
        },
        products: {
          label: 'Products',
          columns: [
            ['Name', (d) => escapeHtml(d.name)],
            ['Category', (d) => escapeHtml(d.category)],
            ['Price', (d) => peso(d.price)],
            ['Type', (d) => d.isWashPackage ? '<span class="pill blue">Wash package</span>' : '<span class="pill gray">Caf\\u00E9</span>'],
          ],
          blank: { id: 'prod-' + Date.now(), name: '', category: 'coffee', price: 0, description: '', imageUrl: '', imageFallbackGradient: '', isWashPackage: false },
        },
        notifications: {
          label: 'Notifications',
          columns: [
            ['Title', (d) => escapeHtml(d.title)],
            ['Message', (d) => escapeHtml(d.message)],
            ['Type', (d) => escapeHtml(d.type)],
            ['Read', (d) => d.read ? 'Yes' : 'No'],
          ],
          blank: { id: 'notif-' + Date.now(), title: '', message: '', time: 'Just now', read: false, type: 'wash' },
        },
      };

      const stages = { 1: ['Preparing', 25], 2: ['Cleaning & Prep', 65], 3: ['Ready for Pickup', 100] };
      let current = 'users';
      let rows = [];
      let editing = null;

      async function request(url, options) {
        const response = await fetch(url, options);
        if (response.status === 401) { location.reload(); throw new Error('Signed out.'); }
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Request failed.');
        return result;
      }
      const send = (method, url, body) => request(url, { method, headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });

      async function loadStats() {
        const s = await request('/api/admin/stats');
        const card = (label, value, note) => '<div class="stat"><span>' + label + '</span><strong>' + value + '</strong><em>' + note + '</em></div>';
        $('#stats').innerHTML =
          card('Members', s.members, s.newThisWeek + ' joined in the last 7 days') +
          card('Accounts with sign in', s.withPassword, (s.members - s.withPassword) + ' still need to set a password') +
          card('Vehicles in queue', s.vehicles, s.preparing + ' preparing, ' + s.cleaning + ' cleaning, ' + s.ready + ' ready') +
          card('Menu items', s.products, s.washPackages + ' wash packages') +
          card('Unread alerts', s.unread, s.unli + ' Unli-Wash, ' + s.club + ' Lounge Club members');
      }

      function renderTabs() {
        $('#tabs').innerHTML = '';
        for (const key of Object.keys(tables)) {
          const button = document.createElement('button');
          button.className = 'tab';
          button.type = 'button';
          button.textContent = tables[key].label;
          button.setAttribute('role', 'tab');
          button.setAttribute('aria-selected', String(key === current));
          button.addEventListener('click', () => { current = key; $('#search').value = ''; renderTabs(); loadTable(); });
          $('#tabs').append(button);
        }
      }

      async function loadTable() {
        rows = (await request('/api/database/' + current)).map((row) => ({ id: row.id, data: JSON.parse(row.data_json) }));
        renderTable();
      }

      function renderTable() {
        const spec = tables[current];
        const term = $('#search').value.trim().toLowerCase();
        const shown = rows.filter((row) => !term || JSON.stringify(row.data).toLowerCase().includes(term));
        const table = $('#records');
        $('#add').textContent = '+ Add ' + spec.label.toLowerCase().replace(/s$/, '');
        $('#empty').hidden = shown.length > 0;
        $('#empty').textContent = rows.length ? 'Nothing matches your search.' : 'No ' + spec.label.toLowerCase() + ' yet.';
        table.hidden = shown.length === 0;
        table.innerHTML = '<thead><tr>' + spec.columns.map((c) => '<th>' + c[0] + '</th>').join('') + '<th></th></tr></thead>';
        const body = document.createElement('tbody');
        for (const row of shown) {
          const tr = document.createElement('tr');
          tr.innerHTML = spec.columns.map((c) => '<td>' + c[1](row.data) + '</td>').join('') +
            '<td class="row-actions">' +
            (spec.advance && row.data.stage < 3 ? '<button class="btn" data-act="advance">Next stage</button>' : '') +
            '<button class="btn" data-act="edit">Edit</button><button class="btn danger" data-act="delete">Delete</button></td>';
          tr.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => rowAction(b.dataset.act, row)));
          body.append(tr);
        }
        table.append(body);
      }

      async function rowAction(action, row) {
        try {
          if (action === 'edit') return openEditor(row);
          if (action === 'delete') {
            if (!confirm('Delete this record? This cannot be undone.')) return;
            await send('DELETE', '/api/database/' + current + '/' + encodeURIComponent(row.id));
          }
          if (action === 'advance') {
            const next = row.data.stage + 1;
            await send('PUT', '/api/database/' + current + '/' + encodeURIComponent(row.id), { ...row.data, stage: next, stageName: stages[next][0], stageProgressPercent: stages[next][1] });
          }
          await Promise.all([loadTable(), loadStats()]);
        } catch (error) { alert(error.message); }
      }

      // The form is built from the record itself, so every field can be edited.
      function openEditor(row) {
        editing = row;
        const data = row ? row.data : tables[current].blank;
        $('#editor-title').textContent = (row ? 'Edit ' : 'Add ') + tables[current].label.toLowerCase().replace(/s$/, '');
        $('#error').textContent = '';
        const fields = $('#fields');
        fields.innerHTML = '';
        for (const [key, value] of Object.entries(data)) {
          const box = document.createElement('div');
          const id = 'f-' + key;
          let input;
          if (typeof value === 'boolean') {
            box.className = 'check';
            input = document.createElement('input'); input.type = 'checkbox'; input.checked = value;
            input.id = id; box.append(input);
            box.insertAdjacentHTML('beforeend', '<label for="' + id + '">' + escapeHtml(key) + '</label>');
          } else {
            box.insertAdjacentHTML('beforeend', '<label for="' + id + '">' + escapeHtml(key) + '</label>');
            if (typeof value === 'object' && value !== null) {
              box.className = 'full'; input = document.createElement('textarea'); input.value = JSON.stringify(value, null, 2);
            } else if (typeof value === 'string' && (value.length > 60 || key === 'description' || key === 'message')) {
              box.className = 'full'; input = document.createElement('textarea'); input.style.fontFamily = 'inherit'; input.style.fontSize = '14px'; input.value = value;
            } else {
              input = document.createElement('input'); input.type = typeof value === 'number' ? 'number' : 'text'; input.value = value ?? '';
              if (typeof value === 'number') input.step = 'any';
            }
            input.id = id; box.append(input);
          }
          if (key === 'id' && row) input.readOnly = true;
          input.dataset.key = key;
          input.dataset.kind = Array.isArray(value) ? 'json' : typeof value;
          fields.append(box);
        }
        $('#editor').showModal();
      }

      $('#record-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        $('#error').textContent = '';
        try {
          const record = {};
          for (const input of $('#fields').querySelectorAll('[data-key]')) {
            const kind = input.dataset.kind;
            if (kind === 'boolean') record[input.dataset.key] = input.checked;
            else if (kind === 'number') record[input.dataset.key] = Number(input.value);
            else if (kind === 'object' || kind === 'json') record[input.dataset.key] = JSON.parse(input.value);
            else record[input.dataset.key] = input.value;
          }
          if (editing) await send('PUT', '/api/database/' + current + '/' + encodeURIComponent(editing.id), record);
          else await send('POST', '/api/database/' + current, record);
          $('#editor').close();
          await Promise.all([loadTable(), loadStats()]);
        } catch (error) { $('#error').textContent = error.message; }
      });

      $('#add').addEventListener('click', () => openEditor(null));
      $('#cancel').addEventListener('click', () => $('#editor').close());
      $('#search').addEventListener('input', renderTable);
      $('#logout').addEventListener('click', async () => { await send('POST', '/api/admin/logout'); location.reload(); });

      renderTabs();
      Promise.all([loadStats(), loadTable()]).catch((error) => { $('#empty').hidden = false; $('#empty').textContent = error.message; });
    </script>
  </body>
</html>`;

// backend/auth.ts
import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from "node:crypto";
function scrypt(password, salt) {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, 64, (error, key) => error ? reject(error) : resolve(key));
  });
}
async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt);
  return `scrypt$${salt.toString("base64")}$${key.toString("base64")}`;
}
async function verifyPassword(password, stored) {
  if (!stored) return false;
  const [scheme, saltText, keyText] = stored.split("$");
  if (scheme !== "scrypt" || !saltText || !keyText) return false;
  const expected = Buffer.from(keyText, "base64");
  const actual = await scrypt(password, Buffer.from(saltText, "base64"));
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
function sameText(a, b) {
  const hashA = createHash("sha256").update(a).digest();
  const hashB = createHash("sha256").update(b).digest();
  return timingSafeEqual(hashA, hashB);
}
var MEMBER_COOKIE = "ca_session";
var ADMIN_COOKIE = "ca_admin";
var MEMBER_DAYS = 14;
var ADMIN_HOURS = 8;
function secret() {
  const value = process.env.SESSION_SECRET?.trim() || process.env.ADMIN_PASSWORD?.trim();
  if (value) return value;
  if (process.env.VERCEL) return null;
  return "coffee-ave-local-development-secret";
}
function authConfigured() {
  return secret() !== null;
}
function sign(body, key) {
  return createHmac("sha256", key).update(body).digest("base64url");
}
function makeToken(session, lifetimeMs) {
  const key = secret();
  if (!key) throw new Error("Set SESSION_SECRET (or ADMIN_PASSWORD) in Vercel to turn on sign in.");
  const body = Buffer.from(JSON.stringify({ ...session, exp: Date.now() + lifetimeMs })).toString("base64url");
  return `${body}.${sign(body, key)}`;
}
function readToken(token) {
  const key = secret();
  if (!token || !key) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature || !sameText(signature, sign(body, key))) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString());
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    if (data.role === "member" && typeof data.sub === "string") return { role: "member", sub: data.sub };
    if (data.role === "admin") return { role: "admin", sub: "admin" };
  } catch {
  }
  return null;
}
function cookies(request) {
  const result = {};
  for (const part of (request.headers.cookie ?? "").split(";")) {
    const index = part.indexOf("=");
    if (index > 0) result[part.slice(0, index).trim()] = decodeURIComponent(part.slice(index + 1).trim());
  }
  return result;
}
function cookieText(name, value, maxAgeSeconds) {
  const secure = process.env.VERCEL ? "; Secure" : "";
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}${secure}`;
}
function startMemberSession(response, userId) {
  const lifetime = MEMBER_DAYS * 24 * 3600 * 1e3;
  response.append("Set-Cookie", cookieText(MEMBER_COOKIE, makeToken({ role: "member", sub: userId }, lifetime), lifetime / 1e3));
}
function endMemberSession(response) {
  response.append("Set-Cookie", cookieText(MEMBER_COOKIE, "", 0));
}
function startAdminSession(response) {
  const lifetime = ADMIN_HOURS * 3600 * 1e3;
  response.append("Set-Cookie", cookieText(ADMIN_COOKIE, makeToken({ role: "admin", sub: "admin" }, lifetime), lifetime / 1e3));
}
function endAdminSession(response) {
  response.append("Set-Cookie", cookieText(ADMIN_COOKIE, "", 0));
}
function memberSession(request) {
  const session = readToken(cookies(request)[MEMBER_COOKIE]);
  return session?.role === "member" ? session : null;
}
function adminSession(request) {
  const session = readToken(cookies(request)[ADMIN_COOKIE]);
  return session?.role === "admin" ? session : null;
}
function requireMember(request, response, next) {
  const session = memberSession(request);
  if (!session) {
    response.status(401).json({ error: "Please sign in first." });
    return;
  }
  response.locals.userId = session.sub;
  next();
}
var attempts = /* @__PURE__ */ new Map();
function tooManyAttempts(key) {
  const entry = attempts.get(key);
  return !!entry && entry.resetAt > Date.now() && entry.count >= 8;
}
function recordFailure(key) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt <= now) attempts.set(key, { count: 1, resetAt: now + 10 * 60 * 1e3 });
  else entry.count += 1;
}
function clearFailures(key) {
  attempts.delete(key);
}

// backend/database.ts
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";

// frontend/src/data/mockData.ts
var PRODUCTS = [
  // Best Sellers & Coffee Drinks
  {
    id: "prod-latte-spanish",
    name: "Spanish Oat Latte",
    category: "coffee",
    price: 195,
    description: "Signature espresso pulled over condensed oat milk and silky textured foam, finished with a dash of Ceylon cinnamon.",
    tag: "BEST SELLER",
    tagColor: "gold",
    imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80",
    imageFallbackGradient: "from-[#3b2314] via-[#5c371d] to-[#1c120c]",
    isWashPackage: false,
    options: [
      { label: "Temperature", choices: ["Iced (Recommended)", "Hot"] },
      { label: "Sweetness", choices: ["Standard (100%)", "Subtle (50%)", "No Added Sugar"] }
    ]
  },
  {
    id: "prod-cold-brew",
    name: "Artisanal Cold Brew",
    category: "coffee",
    price: 180,
    description: "18-hour slow steeped micro-lot single origin beans from Benguet, presenting chocolate and citrus notes over clear ice sphere.",
    tag: "FRESH DAILY",
    tagColor: "emerald",
    imageUrl: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80",
    imageFallbackGradient: "from-[#1e130c] via-[#331c10] to-[#120a06]",
    isWashPackage: false,
    options: [
      { label: "Style", choices: ["Black On The Rocks", "Sweet Cream Float", "Tonic Spritz"] }
    ]
  },
  {
    id: "prod-pistachio-croissant",
    name: "Pistachio Croissant",
    category: "bakery",
    price: 185,
    description: "House-laminated 72-layer butter pastry stuffed with Sicilian pistachio praline cream and toasted crushed emerald nuts.",
    tag: "BEST SELLER",
    tagColor: "gold",
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
    imageFallbackGradient: "from-[#423318] via-[#2c220f] to-[#171209]",
    isWashPackage: false,
    options: [
      { label: "Preparation", choices: ["Warmed & Crispy", "Room Temperature"] }
    ]
  },
  {
    id: "prod-smoked-salmon-bagel",
    name: "Smoked Salmon Bagel",
    category: "bakery",
    price: 290,
    description: "Toasted seeded sourdough bagel, Norwegian dill-cured lox, whipped scallion cream cheese, capers, and pickled shallots.",
    tag: "NEW ITEM",
    tagColor: "crimson",
    imageUrl: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80",
    imageFallbackGradient: "from-[#442b1a] via-[#311f13] to-[#1a110a]",
    isWashPackage: false
  },
  {
    id: "prod-flat-white",
    name: "Auto Ave Flat White",
    category: "coffee",
    price: 175,
    description: "Double ristretto with microfoam velvety milk, served in an insulated matte stoneware tumbler.",
    imageUrl: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80",
    imageFallbackGradient: "from-[#2a1b12] via-[#482d1c] to-[#19100a]",
    isWashPackage: false,
    options: [
      { label: "Milk Choice", choices: ["Whole Dairy", "Barista Oat (+\u20B130)", "Almond (+\u20B130)"] }
    ]
  },
  {
    id: "prod-affogato",
    name: "Smoked Vanilla Affogato",
    category: "features",
    price: 210,
    description: "Madagascar bourbon vanilla bean gelato drowned in a freshly extracted double shot of dark-roasted blend.",
    tag: "NEW ITEM",
    tagColor: "crimson",
    imageUrl: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=600&q=80",
    imageFallbackGradient: "from-[#3c2816] via-[#291a0c] to-[#120b05]",
    isWashPackage: false
  },
  // Wash Packages
  {
    id: "wash-premium-spa",
    name: "Premium Spa Wash",
    category: "exterior",
    price: 450,
    description: "Two-bucket hand wash with active pH-neutral snow foam, deep wheel decontamination, tire dressing, and ultra-plush microfiber air dry.",
    tag: "BEST SELLER",
    tagColor: "gold",
    imageUrl: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=600&q=80",
    imageFallbackGradient: "from-[#112437] via-[#0b1824] to-[#071017]",
    isWashPackage: true,
    estimatedTime: "30 mins",
    options: [
      { label: "Vehicle Class", choices: ["Sedan / Compact", "Midsize SUV (+\u20B1100)", "Full Van / Pickup (+\u20B1150)"] }
    ]
  },
  {
    id: "wash-ultimate-interior",
    name: "Ultimate Interior Detail",
    category: "interior",
    price: 850,
    description: "Deep high-temperature steam sterilization, leather conditioner massage, AC ozone purifier treatment, and triple-filtered HEPA vacuuming.",
    tag: "BEST SELLER",
    tagColor: "gold",
    imageUrl: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=600&q=80",
    imageFallbackGradient: "from-[#2b1717] via-[#1a0e0e] to-[#0d0707]",
    isWashPackage: true,
    estimatedTime: "45 mins",
    options: [
      { label: "Vehicle Class", choices: ["Sedan / Compact", "Midsize SUV (+\u20B1150)", "Full Van / 7-Seater (+\u20B1250)"] }
    ]
  },
  {
    id: "wash-ceramic-hydro",
    name: "Ceramic Hydro Shield Wax",
    category: "exterior",
    price: 750,
    description: "Full exterior decontamination wash followed by machine spray coating with SiO2 ceramic sealant for 90-day mirror gloss and extreme hydrophobicity.",
    tag: "NEW ITEM",
    tagColor: "crimson",
    imageUrl: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=600&q=80",
    imageFallbackGradient: "from-[#1c2430] via-[#121921] to-[#090e14]",
    isWashPackage: true,
    estimatedTime: "40 mins",
    options: [
      { label: "Vehicle Class", choices: ["Sedan / Compact", "Midsize SUV (+\u20B1120)", "Full Van / Pickup (+\u20B1180)"] }
    ]
  },
  {
    id: "wash-complete-combo",
    name: "The Full Ave Experience (Wash + Interior + Coffee)",
    category: "features",
    price: 1199,
    description: "Complete bumper-to-bumper detailing: Premium exterior foam wash, steam interior cleanse, glass sealant, plus any 2 specialty caf\xE9 drinks of your choice.",
    tag: "BEST SELLER",
    tagColor: "gold",
    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80",
    imageFallbackGradient: "from-[#381a17] via-[#22100e] to-[#120807]",
    isWashPackage: true,
    estimatedTime: "60 mins",
    options: [
      { label: "Vehicle Class", choices: ["Sedan / Compact", "Midsize SUV (+\u20B1200)", "Full Van / Pickup (+\u20B1300)"] }
    ]
  },
  {
    id: "wash-engine-bay",
    name: "Precision Engine Bay Detailing",
    category: "interior",
    price: 650,
    description: "Safe dry-steam cleaning of engine bay components, grease degreasing, electrical harness masking, and non-greasy satin rubber conditioning.",
    imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80",
    imageFallbackGradient: "from-[#2b2b2b] via-[#1a1a1a] to-[#0d0d0d]",
    isWashPackage: true,
    estimatedTime: "35 mins"
  },
  {
    id: "wash-unli-pass",
    name: "Auto Ave Unli-Wash Monthly VIP",
    category: "features",
    price: 2499,
    description: "Unlimited exterior washes for 30 days, express bay queue access, 15% discount on all coffee and lounge items, and complimentary cupping passes.",
    tag: "VIP EXCLUSIVE",
    tagColor: "gold",
    imageUrl: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80",
    imageFallbackGradient: "from-[#423214] via-[#241a08] to-[#140e03]",
    isWashPackage: true,
    estimatedTime: "Instant Activation"
  }
];
var INITIAL_VEHICLES = [
  {
    id: "veh-1",
    plateNumber: "NDE 4821",
    vehicleModel: "Toyota GR Yaris",
    vehicleColor: "Pearl White",
    colorHex: "#f3f4f6",
    servicePackage: "Premium Spa Wash + Hydro Coat",
    startTime: "16:35",
    estimatedDuration: "30 min",
    stage: 2,
    stageName: "Cleaning & Prep",
    stageProgressPercent: 68,
    bayNumber: 2,
    customerName: "Marcus T.",
    cafeOrderLinked: "1x Spanish Oat Latte (Table 04)",
    drinkStatus: "Served at Table",
    tableNumber: "Table 04"
  },
  {
    id: "veh-2",
    plateNumber: "CBD 9024",
    vehicleModel: "Mazda 3 Hatchback",
    vehicleColor: "Soul Red Crystal",
    colorHex: "#991b1b",
    servicePackage: "Ultimate Interior Detail",
    startTime: "16:20",
    estimatedDuration: "45 min",
    stage: 2,
    stageName: "Cleaning & Prep",
    stageProgressPercent: 85,
    bayNumber: 3,
    customerName: "Aileen R.",
    cafeOrderLinked: "1x Artisanal Cold Brew, 1x Pistachio Croissant",
    drinkStatus: "Served at Table",
    tableNumber: "Lounge Seat B"
  },
  {
    id: "veh-3",
    plateNumber: "NEO 7710",
    vehicleModel: "Honda Civic Type R (FL5)",
    vehicleColor: "Championship White",
    colorHex: "#f8fafc",
    servicePackage: "The Full Ave Experience",
    startTime: "16:05",
    estimatedDuration: "55 min",
    stage: 3,
    stageName: "Ready for Pickup",
    stageProgressPercent: 100,
    bayNumber: 1,
    customerName: "Kenneth Tan",
    cafeOrderLinked: "2x Auto Ave Flat White",
    drinkStatus: "Served at Table",
    tableNumber: "Terrace 01"
  },
  {
    id: "veh-4",
    plateNumber: "NBX 3190",
    vehicleModel: "Ford Everest Titanium",
    vehicleColor: "Meteor Grey",
    colorHex: "#4b5563",
    servicePackage: "Premium Spa Wash (SUV)",
    startTime: "16:48",
    estimatedDuration: "35 min",
    stage: 1,
    stageName: "Preparing",
    stageProgressPercent: 25,
    bayNumber: 4,
    customerName: "Dave Reyes",
    cafeOrderLinked: "1x Spanish Oat Latte",
    drinkStatus: "Brewing",
    tableNumber: "Workstation 08"
  },
  {
    id: "veh-5",
    plateNumber: "NBP 5521",
    vehicleModel: "BMW 330i M-Sport",
    vehicleColor: "Portimao Blue",
    colorHex: "#1d4ed8",
    servicePackage: "Ceramic Hydro Shield Wax",
    startTime: "16:52",
    estimatedDuration: "40 min",
    stage: 1,
    stageName: "Preparing",
    stageProgressPercent: 15,
    bayNumber: 2,
    customerName: "Patricia G.",
    cafeOrderLinked: "1x Smoked Salmon Bagel",
    drinkStatus: "Brewing",
    tableNumber: "Table 06"
  },
  {
    id: "veh-6",
    plateNumber: "DAQ 8820",
    vehicleModel: "Subaru WRX STI",
    vehicleColor: "World Rally Blue",
    colorHex: "#2563eb",
    servicePackage: "The Full Ave Experience",
    startTime: "15:50",
    estimatedDuration: "60 min",
    stage: 3,
    stageName: "Ready for Pickup",
    stageProgressPercent: 100,
    bayNumber: 1,
    customerName: "Ramon V.",
    cafeOrderLinked: "1x Flat White",
    drinkStatus: "Served at Table",
    tableNumber: "Bar Counter 03"
  }
];
var INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Vehicle Status Update",
    message: "Your vehicle (NDE 4821) has entered Stage 2: High-Pressure Snow Foam & Underchassis Rinse.",
    time: "2 mins ago",
    read: false,
    type: "wash"
  },
  {
    id: "notif-2",
    title: "Caf\xE9 Order Ready",
    message: "Spanish Oat Latte has been delivered to Table 04 by Barista Team.",
    time: "8 mins ago",
    read: false,
    type: "cafe"
  },
  {
    id: "notif-3",
    title: "Unli-Wash Privilege",
    message: "Welcome back to Coffee Ave, Nieves Hills! Double loyalty points active today.",
    time: "1 hour ago",
    read: true,
    type: "promo"
  }
];

// backend/database.ts
var databaseTables = ["products", "vehicles", "notifications", "users"];
var ValidationError = class extends Error {
};
var client = null;
var usingTurso = false;
async function getClient() {
  if (client) return client;
  const url = process.env.TURSO_DATABASE_URL?.trim();
  if (url) {
    const { createClient: createClient2 } = await import("@libsql/client/web");
    client = createClient2({
      url: url.replace(/^libsql:/, "https:"),
      authToken: process.env.TURSO_AUTH_TOKEN?.trim()
    });
    usingTurso = true;
    return client;
  }
  if (process.env.VERCEL) {
    throw new Error("TURSO_DATABASE_URL is not set. Add it in Vercel under Settings, Environment Variables, then redeploy.");
  }
  const { createClient } = await import("@libsql/client");
  mkdirSync("data", { recursive: true });
  client = createClient({ url: "file:data/coffee-ave.sqlite" });
  return client;
}
async function databaseLabel() {
  await getClient();
  return usingTurso ? "Turso" : "SQLite (local file)";
}
async function checkDatabaseConnection() {
  const db = await getClient();
  await db.execute("SELECT 1");
}
var ready = null;
function ensureDatabase() {
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
      )`
    ],
    "write"
  );
  const columns = await db.execute("PRAGMA table_info(users)");
  if (!columns.rows.some((column) => column.name === "password_hash")) {
    await db.execute("ALTER TABLE users ADD COLUMN password_hash TEXT");
  }
  await seedIfEmpty(
    "products",
    PRODUCTS.map((p) => ({ id: p.id, values: tableSpecs.products.toValues(p), record: p }))
  );
  await seedIfEmpty(
    "vehicles",
    INITIAL_VEHICLES.map((v) => ({ id: v.id, values: tableSpecs.vehicles.toValues(v), record: v }))
  );
  await seedIfEmpty(
    "notifications",
    INITIAL_NOTIFICATIONS.map((n) => ({ id: n.id, values: tableSpecs.notifications.toValues(n), record: n }))
  );
}
async function seedIfEmpty(table, rows) {
  const db = await getClient();
  const result = await db.execute(`SELECT COUNT(*) AS count FROM ${table}`);
  if (Number(result.rows[0].count) > 0) return;
  const columns = ["id", ...tableSpecs[table].columns, "data_json"];
  const placeholders = columns.map(() => "?").join(", ");
  await db.batch(
    rows.map((row) => ({
      sql: `INSERT OR IGNORE INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`,
      args: [row.id, ...row.values, JSON.stringify(row.record)]
    })),
    "write"
  );
}
function requiredString(data, key, maxLength = 500) {
  const value = data[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new ValidationError(`${key} must be a non-empty string.`);
  }
  if (value.trim().length > maxLength) {
    throw new ValidationError(`${key} is too long.`);
  }
  return value.trim();
}
function requiredNumber(data, key) {
  const value = data[key];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new ValidationError(`${key} must be a number.`);
  }
  return value;
}
function requiredBoolean(data, key) {
  const value = data[key];
  if (typeof value !== "boolean") {
    throw new ValidationError(`${key} must be true or false.`);
  }
  return value;
}
var tableSpecs = {
  products: {
    columns: ["name", "category", "price", "is_wash_package"],
    toValues: (r) => [requiredString(r, "name"), requiredString(r, "category"), requiredNumber(r, "price"), Number(requiredBoolean(r, "isWashPackage"))]
  },
  vehicles: {
    columns: ["plate_number", "vehicle_model", "stage", "stage_name"],
    toValues: (r) => [requiredString(r, "plateNumber"), requiredString(r, "vehicleModel"), requiredNumber(r, "stage"), requiredString(r, "stageName")]
  },
  notifications: {
    columns: ["title", "message", "is_read", "type"],
    toValues: (r) => [requiredString(r, "title"), requiredString(r, "message"), Number(requiredBoolean(r, "read")), requiredString(r, "type")]
  },
  users: {
    columns: ["name", "email", "plate_number", "vehicle_model", "membership", "created_at"],
    toValues: (r) => {
      if (typeof r.createdAt !== "string" || r.createdAt === "") r.createdAt = (/* @__PURE__ */ new Date()).toISOString();
      return [
        requiredString(r, "name", 100),
        requiredString(r, "email", 254).toLowerCase(),
        requiredString(r, "plateNumber", 20).toUpperCase(),
        requiredString(r, "vehicleModel", 100),
        requiredString(r, "membership", 20),
        r.createdAt
      ];
    }
  }
};
function getTable(table) {
  return databaseTables.includes(table) ? table : null;
}
async function getTableRows(table) {
  const name = getTable(table);
  if (!name) return null;
  const db = await getClient();
  const select = name === "users" ? "id, name, email, plate_number, vehicle_model, membership, created_at, data_json" : "*";
  const result = await db.execute(`SELECT ${select} FROM ${name} ORDER BY rowid`);
  return result.rows.map((row) => ({ ...row }));
}
function buildRecord(table, id, data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new ValidationError("Record data must be a JSON object.");
  }
  const record = { ...data, id };
  const values = tableSpecs[table].toValues(record);
  return { record, values };
}
async function createTableRow(table, data) {
  const name = getTable(table);
  if (!name) throw new ValidationError("Table not found.");
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new ValidationError("Record data must be a JSON object.");
  }
  const id = requiredString(data, "id", 100);
  const { record, values } = buildRecord(name, id, data);
  const columns = ["id", ...tableSpecs[name].columns, "data_json"];
  const db = await getClient();
  try {
    await db.execute({
      sql: `INSERT INTO ${name} (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`,
      args: [id, ...values, JSON.stringify(record)]
    });
  } catch (error) {
    throw new ValidationError("Could not create record. The id or email may already exist.");
  }
  return record;
}
async function updateTableRow(table, id, data) {
  const name = getTable(table);
  if (!name) throw new ValidationError("Table not found.");
  const { record, values } = buildRecord(name, id, data);
  const db = await getClient();
  const assignments = [...tableSpecs[name].columns, "data_json"].map((column) => `${column} = ?`).join(", ");
  const result = await db.execute({
    sql: `UPDATE ${name} SET ${assignments} WHERE id = ?`,
    args: [...values, JSON.stringify(record), id]
  });
  return result.rowsAffected > 0;
}
async function deleteTableRow(table, id) {
  const name = getTable(table);
  if (!name) throw new ValidationError("Table not found.");
  const db = await getClient();
  const result = await db.execute({ sql: `DELETE FROM ${name} WHERE id = ?`, args: [id] });
  return result.rowsAffected > 0;
}
async function getRecords(table) {
  const db = await getClient();
  const result = await db.execute(`SELECT data_json FROM ${table} ORDER BY rowid`);
  return result.rows.map((row) => JSON.parse(String(row.data_json)));
}
var getProducts = () => getRecords("products");
var getVehicles = () => getRecords("vehicles");
var getNotifications = () => getRecords("notifications");
function toPublicUser(record) {
  return {
    id: String(record.id),
    name: String(record.name),
    email: String(record.email),
    plateNumber: String(record.plateNumber),
    vehicleModel: String(record.vehicleModel),
    membership: record.membership === "club" ? "club" : "unli",
    createdAt: String(record.createdAt ?? "")
  };
}
function checkPassword(value) {
  if (typeof value !== "string" || value.length < 8) {
    throw new ValidationError("Password must be at least 8 characters.");
  }
  if (value.length > 200) throw new ValidationError("Password is too long.");
  return value;
}
function checkEmail(data) {
  const email = requiredString(data, "email", 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ValidationError("Please enter a valid email address.");
  }
  return email;
}
async function registerUser(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new ValidationError("Sign up details are missing.");
  }
  const data = input;
  const email = checkEmail(data);
  const password = checkPassword(data.password);
  const membership = data.membership === "club" ? "club" : "unli";
  const db = await getClient();
  const existing = await db.execute({ sql: "SELECT id, created_at, password_hash FROM users WHERE email = ?", args: [email] });
  const row = existing.rows[0];
  if (row && row.password_hash) {
    throw new ValidationError("An account with this email already exists. Please sign in instead.");
  }
  const id = row ? String(row.id) : `user-${randomUUID()}`;
  const createdAt = row ? String(row.created_at) : (/* @__PURE__ */ new Date()).toISOString();
  const record = {
    id,
    name: requiredString(data, "name", 100),
    email,
    plateNumber: requiredString(data, "plateNumber", 20).toUpperCase(),
    vehicleModel: requiredString(data, "vehicleModel", 100),
    membership,
    createdAt
  };
  const values = tableSpecs.users.toValues(record);
  const passwordHash = await hashPassword(password);
  if (row) {
    await db.execute({
      sql: `UPDATE users SET ${tableSpecs.users.columns.map((c) => `${c} = ?`).join(", ")}, data_json = ?, password_hash = ? WHERE id = ?`,
      args: [...values, JSON.stringify(record), passwordHash, id]
    });
  } else {
    await db.execute({
      sql: `INSERT INTO users (id, ${tableSpecs.users.columns.join(", ")}, data_json, password_hash) VALUES (?, ${values.map(() => "?").join(", ")}, ?, ?)`,
      args: [id, ...values, JSON.stringify(record), passwordHash]
    });
  }
  return toPublicUser(record);
}
async function loginUser(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const data = input;
  if (typeof data.email !== "string" || typeof data.password !== "string") return null;
  const db = await getClient();
  const result = await db.execute({
    sql: "SELECT data_json, password_hash FROM users WHERE email = ?",
    args: [data.email.trim().toLowerCase()]
  });
  const row = result.rows[0];
  if (!row || !await verifyPassword(data.password, row.password_hash ? String(row.password_hash) : null)) return null;
  return toPublicUser(JSON.parse(String(row.data_json)));
}
async function getUserById(id) {
  const db = await getClient();
  const result = await db.execute({ sql: "SELECT data_json FROM users WHERE id = ?", args: [id] });
  return result.rows[0] ? toPublicUser(JSON.parse(String(result.rows[0].data_json))) : null;
}
async function updateOwnProfile(id, input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new ValidationError("Profile details are missing.");
  }
  const data = input;
  const current = await getUserById(id);
  if (!current) throw new ValidationError("Account not found.");
  const record = {
    ...current,
    name: requiredString(data, "name", 100),
    plateNumber: requiredString(data, "plateNumber", 20).toUpperCase(),
    vehicleModel: requiredString(data, "vehicleModel", 100),
    membership: data.membership === "club" ? "club" : "unli"
  };
  const values = tableSpecs.users.toValues(record);
  const db = await getClient();
  await db.execute({
    sql: `UPDATE users SET ${tableSpecs.users.columns.map((c) => `${c} = ?`).join(", ")}, data_json = ? WHERE id = ?`,
    args: [...values, JSON.stringify(record), id]
  });
  return toPublicUser(record);
}
async function changeOwnPassword(id, input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new ValidationError("Password details are missing.");
  }
  const data = input;
  const newPassword = checkPassword(data.newPassword);
  const db = await getClient();
  const result = await db.execute({ sql: "SELECT password_hash FROM users WHERE id = ?", args: [id] });
  const stored = result.rows[0]?.password_hash;
  if (typeof data.currentPassword !== "string" || !await verifyPassword(data.currentPassword, stored ? String(stored) : null)) {
    throw new ValidationError("Your current password is not correct.");
  }
  await db.execute({ sql: "UPDATE users SET password_hash = ? WHERE id = ?", args: [await hashPassword(newPassword), id] });
}
async function getAdminStats() {
  const db = await getClient();
  const count = async (sql) => Number((await db.execute(sql)).rows[0].count);
  const [members, withPassword, newThisWeek, unli, club, products, washPackages, vehicles, preparing, cleaning, ready2, unread] = await Promise.all([
    count("SELECT COUNT(*) AS count FROM users"),
    count("SELECT COUNT(*) AS count FROM users WHERE password_hash IS NOT NULL"),
    (async () => {
      const since = new Date(Date.now() - 7 * 24 * 3600 * 1e3).toISOString();
      return Number((await db.execute({ sql: "SELECT COUNT(*) AS count FROM users WHERE created_at >= ?", args: [since] })).rows[0].count);
    })(),
    count("SELECT COUNT(*) AS count FROM users WHERE membership = 'unli'"),
    count("SELECT COUNT(*) AS count FROM users WHERE membership = 'club'"),
    count("SELECT COUNT(*) AS count FROM products"),
    count("SELECT COUNT(*) AS count FROM products WHERE is_wash_package = 1"),
    count("SELECT COUNT(*) AS count FROM vehicles"),
    count("SELECT COUNT(*) AS count FROM vehicles WHERE stage = 1"),
    count("SELECT COUNT(*) AS count FROM vehicles WHERE stage = 2"),
    count("SELECT COUNT(*) AS count FROM vehicles WHERE stage = 3"),
    count("SELECT COUNT(*) AS count FROM notifications WHERE is_read = 0")
  ]);
  return { members, withPassword, newThisWeek, unli, club, products, washPackages, vehicles, preparing, cleaning, ready: ready2, unread };
}

// backend/app.ts
var app = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "100kb" }));
var handle = (fn) => (request, response, next) => {
  fn(request, response).catch(next);
};
function adminAllowed(request) {
  if (!process.env.ADMIN_PASSWORD) return !process.env.VERCEL;
  return adminSession(request) !== null;
}
function requireAdmin(request, response, next) {
  if (adminAllowed(request)) {
    next();
    return;
  }
  response.status(401).json({ error: "Admin sign in required." });
}
var clientKey = (request, name) => `${name}:${request.ip ?? "unknown"}`;
app.get("/api/health", handle(async (_request, response) => {
  try {
    await ensureDatabase();
    await checkDatabaseConnection();
    response.json({ status: "ok", database: await databaseLabel() });
  } catch (error) {
    response.status(500).json({ status: "error", message: error instanceof Error ? error.message : "Database error." });
  }
}));
app.get("/api/products", handle(async (_request, response) => {
  await ensureDatabase();
  response.json(await getProducts());
}));
app.get("/api/vehicles", handle(async (_request, response) => {
  await ensureDatabase();
  response.json(await getVehicles());
}));
app.get("/api/notifications", handle(async (_request, response) => {
  await ensureDatabase();
  response.json(await getNotifications());
}));
function requireAuthSetup(response) {
  if (authConfigured()) return true;
  response.status(503).json({ error: "Sign in is not set up yet. Add SESSION_SECRET in Vercel, then redeploy." });
  return false;
}
app.post("/api/auth/signup", handle(async (request, response) => {
  if (!requireAuthSetup(response)) return;
  await ensureDatabase();
  const user = await registerUser(request.body);
  startMemberSession(response, user.id);
  response.status(201).json(user);
}));
app.post("/api/auth/login", handle(async (request, response) => {
  if (!requireAuthSetup(response)) return;
  const key = clientKey(request, "login");
  if (tooManyAttempts(key)) {
    response.status(429).json({ error: "Too many attempts. Please wait a few minutes and try again." });
    return;
  }
  await ensureDatabase();
  const user = await loginUser(request.body);
  if (!user) {
    recordFailure(key);
    response.status(401).json({ error: "Email or password is not correct." });
    return;
  }
  clearFailures(key);
  startMemberSession(response, user.id);
  response.json(user);
}));
app.post("/api/auth/logout", (_request, response) => {
  endMemberSession(response);
  response.json({ status: "signed out" });
});
app.get("/api/auth/me", handle(async (request, response) => {
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
app.put("/api/me", requireMember, handle(async (request, response) => {
  await ensureDatabase();
  response.json(await updateOwnProfile(response.locals.userId, request.body));
}));
app.put("/api/me/password", requireMember, handle(async (request, response) => {
  await ensureDatabase();
  await changeOwnPassword(response.locals.userId, request.body);
  response.json({ status: "password changed" });
}));
app.post("/api/admin/login", (request, response) => {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    response.status(403).json({ error: "The admin page is switched off. Set ADMIN_PASSWORD in Vercel to turn it on." });
    return;
  }
  const key = clientKey(request, "admin");
  if (tooManyAttempts(key)) {
    response.status(429).json({ error: "Too many attempts. Please wait a few minutes and try again." });
    return;
  }
  const given = typeof request.body?.password === "string" ? request.body.password : "";
  if (!sameText(given, password)) {
    recordFailure(key);
    response.status(401).json({ error: "That password is not correct." });
    return;
  }
  clearFailures(key);
  startAdminSession(response);
  response.json({ status: "signed in" });
});
app.post("/api/admin/logout", (_request, response) => {
  endAdminSession(response);
  response.json({ status: "signed out" });
});
app.use("/api/admin/stats", requireAdmin);
app.get("/api/admin/stats", handle(async (_request, response) => {
  await ensureDatabase();
  response.json(await getAdminStats());
}));
app.use("/api/database", requireAdmin);
app.get("/api/database/tables", (_request, response) => response.json(databaseTables));
app.get("/api/database/:table", handle(async (request, response) => {
  await ensureDatabase();
  const rows = await getTableRows(request.params.table);
  if (!rows) {
    response.status(404).json({ error: "Table not found" });
    return;
  }
  response.json(rows);
}));
app.post("/api/database/:table", handle(async (request, response) => {
  await ensureDatabase();
  const row = await createTableRow(request.params.table, request.body);
  response.status(201).json(row);
}));
app.put("/api/database/:table/:id", handle(async (request, response) => {
  await ensureDatabase();
  const updated = await updateTableRow(request.params.table, request.params.id, request.body);
  if (!updated) {
    response.status(404).json({ error: "Record not found." });
    return;
  }
  response.json({ status: "updated" });
}));
app.delete("/api/database/:table/:id", handle(async (request, response) => {
  await ensureDatabase();
  const deleted = await deleteTableRow(request.params.table, request.params.id);
  if (!deleted) {
    response.status(404).json({ error: "Record not found." });
    return;
  }
  response.json({ status: "deleted" });
}));
app.get("/admin", (request, response) => {
  if (!process.env.ADMIN_PASSWORD && process.env.VERCEL) {
    response.status(403).type("text").send("The admin page is switched off. Set ADMIN_PASSWORD in Vercel to turn it on.");
    return;
  }
  response.set("Cache-Control", "no-store").type("html").send(adminAllowed(request) ? adminPage : adminLoginPage);
});
app.use((error, _request, response, _next) => {
  if (error instanceof ValidationError) {
    response.status(400).json({ error: error.message });
    return;
  }
  console.error(error);
  response.status(500).json({ error: "Something went wrong on the server." });
});
var app_default = app;
export {
  app_default as default
};
