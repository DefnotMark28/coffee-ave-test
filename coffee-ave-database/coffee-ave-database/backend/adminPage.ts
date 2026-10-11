export const adminPage = `<!doctype html>
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
