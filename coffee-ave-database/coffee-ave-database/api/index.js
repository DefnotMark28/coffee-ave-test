// backend/app.ts
import { createHash, timingSafeEqual } from "node:crypto";
import express from "express";

// backend/adminPage.ts
var adminPage = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Coffee Ave Database</title>
    <style>
      :root { color-scheme: light; font-family: "Segoe UI", sans-serif; background: #f4f2ef; color: #27231f; }
      body { margin: 0; padding: 32px; }
      main { max-width: 1100px; margin: 0 auto; }
      header { display: flex; justify-content: space-between; align-items: end; gap: 20px; border-bottom: 1px solid #d8d2ca; padding-bottom: 18px; }
      h1 { margin: 0; font-family: Georgia, serif; font-size: 30px; font-weight: 500; }
      p { color: #6b625a; margin: 8px 0 0; }
      select { min-width: 190px; padding: 10px 12px; border: 1px solid #c9c1b7; border-radius: 4px; background: white; font: inherit; }
      button { padding: 9px 12px; border: 1px solid #c9c1b7; border-radius: 4px; background: white; color: inherit; font: inherit; cursor: pointer; }
      button:disabled { cursor: not-allowed; opacity: .45; }
      .toolbar { display: flex; flex-wrap: wrap; gap: 8px; margin: 18px 0 10px; }
      #summary { margin: 18px 0 10px; color: #6b625a; font-size: 14px; }
      .toolbar + #summary { margin-top: 0; }
      .table-wrap { overflow: auto; background: white; border: 1px solid #ded8d0; }
      table { width: 100%; border-collapse: collapse; font-size: 13px; }
      th, td { padding: 11px 13px; border-bottom: 1px solid #eeeae5; text-align: left; vertical-align: top; }
      th { background: #e9e4dd; position: sticky; top: 0; }
      td { max-width: 440px; white-space: pre-wrap; overflow-wrap: anywhere; }
      tbody tr { cursor: pointer; }
      tbody tr[aria-selected="true"] { background: #f2ede6; }
      dialog { width: min(720px, calc(100% - 32px)); padding: 22px; border: 1px solid #c9c1b7; border-radius: 6px; }
      dialog::backdrop { background: #17141280; }
      dialog h2 { margin-top: 0; font-family: Georgia, serif; font-weight: 500; }
      dialog p { margin-bottom: 10px; }
      textarea { box-sizing: border-box; width: 100%; min-height: 320px; padding: 12px; border: 1px solid #c9c1b7; border-radius: 4px; font: 13px/1.5 Consolas, monospace; }
      .dialog-actions { display: flex; justify-content: end; gap: 8px; margin-top: 12px; }
      #error { color: #a12a20; min-height: 1.3em; }
      @media (max-width: 600px) { body { padding: 20px 12px; } header { align-items: start; flex-direction: column; } select { width: 100%; } }
    </style>
  </head>
  <body>
    <main>
      <header><div><h1>Coffee Ave Database</h1><p>Coffee Ave data</p></div><select id="table"></select></header>
      <div class="toolbar">
        <button id="add" type="button">Add record</button>
        <button id="edit" type="button" disabled>Edit selected</button>
        <button id="delete" type="button" disabled>Delete selected</button>
      </div>
      <div id="summary"></div>
      <div class="table-wrap"><table id="records"></table></div>
      <dialog id="editor">
        <form id="record-form">
          <h2 id="editor-title">Add record</h2>
          <p>Enter a JSON object matching this table. Keep required fields and the record id intact when editing.</p>
          <textarea id="record-data" required spellcheck="false"></textarea>
          <p id="error" role="alert"></p>
          <div class="dialog-actions"><button id="cancel" type="button">Cancel</button><button type="submit">Save record</button></div>
        </form>
      </dialog>
    </main>
    <script>
      const picker = document.querySelector('#table');
      const records = document.querySelector('#records');
      const summary = document.querySelector('#summary');
      const editor = document.querySelector('#editor');
      const recordData = document.querySelector('#record-data');
      const errorMessage = document.querySelector('#error');
      const editButton = document.querySelector('#edit');
      const deleteButton = document.querySelector('#delete');
      let currentRows = [];
      let selectedId = null;
      let editId = null;
      const cellText = (value) => typeof value === 'object' && value !== null ? JSON.stringify(value, null, 2) : String(value ?? '');
      async function request(url, options) {
        const response = await fetch(url, options);
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Request failed.');
        return result;
      }
      function updateActions() {
        const hasSelection = selectedId !== null;
        editButton.disabled = !hasSelection;
        deleteButton.disabled = !hasSelection;
      }
      async function showTable(name) {
        currentRows = await request('/api/database/' + encodeURIComponent(name));
        selectedId = null;
        updateActions();
        records.replaceChildren();
        summary.textContent = currentRows.length + ' records in ' + name;
        if (!currentRows.length) return;
        const columns = Object.keys(currentRows[0]).filter((column) => column !== 'data_json');
        const head = records.createTHead().insertRow();
        columns.forEach((column) => { const cell = document.createElement('th'); cell.textContent = column; head.append(cell); });
        const body = records.createTBody();
        currentRows.forEach((row) => {
          const tr = body.insertRow();
          tr.setAttribute('aria-selected', 'false');
          tr.addEventListener('click', () => {
            selectedId = row.id;
            for (const recordRow of body.rows) recordRow.setAttribute('aria-selected', String(recordRow === tr));
            updateActions();
          });
          columns.forEach((column) => { const cell = tr.insertCell(); cell.textContent = cellText(row[column]); });
        });
      }
      function emptyRecord(table) {
        if (table === 'products') return { id: 'prod-new', name: '', category: 'coffee', price: 0, description: '', imageUrl: '', imageFallbackGradient: '', isWashPackage: false };
        if (table === 'vehicles') return { id: 'veh-new', plateNumber: '', vehicleModel: '', vehicleColor: '', colorHex: '#000000', servicePackage: '', startTime: '', estimatedDuration: '', stage: 1, stageName: 'Preparing', stageProgressPercent: 0, bayNumber: 1 };
        if (table === 'users') return { id: 'user-new', name: '', email: '', plateNumber: '', vehicleModel: '', membership: 'unli' };
        return { id: 'notif-new', title: '', message: '', time: '', read: false, type: 'wash' };
      }
      function openEditor(row) {
        editId = row ? row.id : null;
        document.querySelector('#editor-title').textContent = editId ? 'Edit record' : 'Add record';
        recordData.value = JSON.stringify(row ? JSON.parse(row.data_json) : emptyRecord(picker.value), null, 2);
        errorMessage.textContent = '';
        editor.showModal();
      }
      document.querySelector('#add').addEventListener('click', () => openEditor(null));
      editButton.addEventListener('click', () => {
        const row = currentRows.find((item) => item.id === selectedId);
        if (row) openEditor(row);
      });
      deleteButton.addEventListener('click', async () => {
        if (selectedId === null || !confirm('Delete this record? This cannot be undone.')) return;
        try {
          await request('/api/database/' + encodeURIComponent(picker.value) + '/' + encodeURIComponent(selectedId), { method: 'DELETE' });
          await showTable(picker.value);
        } catch (error) {
          alert(error.message);
        }
      });
      document.querySelector('#cancel').addEventListener('click', () => editor.close());
      document.querySelector('#record-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        errorMessage.textContent = '';
        try {
          const record = JSON.parse(recordData.value);
          const url = '/api/database/' + encodeURIComponent(picker.value) + (editId === null ? '' : '/' + encodeURIComponent(editId));
          await request(url, { method: editId === null ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(record) });
          editor.close();
          await showTable(picker.value);
        } catch (error) {
          errorMessage.textContent = error.message;
        }
      });
      request('/api/database/tables').then((tables) => {
        tables.forEach((name) => { const option = document.createElement('option'); option.value = name; option.textContent = name; picker.append(option); });
        picker.addEventListener('change', () => showTable(picker.value));
        showTable(tables[0]);
      }).catch((error) => { summary.textContent = error.message; });
    </script>
  </body>
</html>`;

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
  const result = await db.execute(`SELECT * FROM ${name} ORDER BY rowid`);
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
async function registerUser(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new ValidationError("Sign up details are missing.");
  }
  const data = input;
  const email = requiredString(data, "email", 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ValidationError("Please enter a valid email address.");
  }
  const membership = data.membership === "club" ? "club" : "unli";
  const db = await getClient();
  const existing = await db.execute({ sql: "SELECT id, created_at FROM users WHERE email = ?", args: [email] });
  const id = existing.rows.length > 0 ? String(existing.rows[0].id) : `user-${randomUUID()}`;
  const createdAt = existing.rows.length > 0 ? String(existing.rows[0].created_at) : (/* @__PURE__ */ new Date()).toISOString();
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
  if (existing.rows.length > 0) {
    await updateTableRow("users", id, record);
  } else {
    await db.execute({
      sql: `INSERT INTO users (id, ${tableSpecs.users.columns.join(", ")}, data_json) VALUES (?, ${values.map(() => "?").join(", ")}, ?)`,
      args: [id, ...values, JSON.stringify(record)]
    });
  }
  return { id, name: record.name, email, plateNumber: record.plateNumber, vehicleModel: record.vehicleModel, membership };
}

// backend/app.ts
var app = express();
app.use(express.json({ limit: "100kb" }));
var handle = (fn) => (request, response, next) => {
  fn(request, response).catch(next);
};
function sameText(a, b) {
  const hashA = createHash("sha256").update(a).digest();
  const hashB = createHash("sha256").update(b).digest();
  return timingSafeEqual(hashA, hashB);
}
function requireAdmin(request, response, next) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    if (process.env.VERCEL) {
      response.status(403).type("text").send("The admin page is switched off. Set ADMIN_PASSWORD in Vercel to turn it on.");
      return;
    }
    next();
    return;
  }
  const [scheme, encoded] = (request.headers.authorization ?? "").split(" ");
  if (scheme === "Basic" && encoded) {
    const decoded = Buffer.from(encoded, "base64").toString();
    const given = decoded.slice(decoded.indexOf(":") + 1);
    if (sameText(given, password)) {
      next();
      return;
    }
  }
  response.set("WWW-Authenticate", 'Basic realm="Coffee Ave Admin"').status(401).type("text").send("Password required.");
}
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
app.post("/api/users", handle(async (request, response) => {
  await ensureDatabase();
  const user = await registerUser(request.body);
  response.status(201).json(user);
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
app.get("/admin", requireAdmin, (_request, response) => {
  response.type("html").send(adminPage);
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
