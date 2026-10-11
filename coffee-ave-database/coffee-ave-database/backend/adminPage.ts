// The admin area: a sign in page and a dashboard, both plain HTML so they work without the website build.

const styles = `
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

const fontLink = `<link rel="preconnect" href="https://fonts.googleapis.com" /><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />`;

export const adminLoginPage = `<!doctype html>
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

export const adminPage = `<!doctype html>
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
