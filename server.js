const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'actas.json');

// ── Base de datos (archivo JSON) ───────────────────────────
function loadDB() {
  if (!fs.existsSync(DB_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch (e) {
    console.error('Error leyendo actas.json:', e.message);
    return [];
  }
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// ── Seed inicial si no existe la BD ───────────────────────
if (!fs.existsSync(DB_PATH)) {
  const seedPath = path.join(__dirname, 'seed.json');
  if (fs.existsSync(seedPath)) {
    const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
    saveDB(seed);
    console.log(`Base de datos creada con ${seed.length} registros historicos`);
  } else {
    saveDB([]);
    console.log('Base de datos creada vacia');
  }
}

// ── Middleware ─────────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── API ────────────────────────────────────────────────────

// GET /api/actas — todos los registros, ordenados por fecha desc
app.get('/api/actas', (req, res) => {
  const actas = loadDB().sort((a, b) => {
    const fs1 = b.fecha_sort || '';
    const fs2 = a.fecha_sort || '';
    return fs1.localeCompare(fs2);
  });
  res.json(actas);
});

// GET /api/actas/:id
app.get('/api/actas/:id', (req, res) => {
  const acta = loadDB().find(r => r.id === req.params.id);
  if (!acta) return res.status(404).json({ error: 'No encontrado' });
  res.json(acta);
});

// POST /api/actas — crear nueva acta
app.post('/api/actas', (req, res) => {
  const r = req.body;
  if (!r.funcionario) return res.status(400).json({ error: 'Falta el nombre del funcionario' });

  const nueva = {
    id: 'acta_' + Date.now(),
    source: 'Manual',
    tipo: r.tipo || '',
    fecha_sort: r.fecha_sort || '',
    fecha: r.fecha || '',
    funcionario: r.funcionario || '',
    rut: r.rut || '',
    cargo: r.cargo || '',
    unidad: r.unidad || '',
    marca: r.marca || '',
    modelo: r.modelo || '',
    serie: r.serie || '',
    inventario: r.inventario || '',
    specs: r.specs || '',
    accesorios: r.accesorios || '',
    estado: r.estado || 'NUEVO',
    firmanteTI: r.firmanteTI || '',
    created_at: new Date().toLocaleString('es-CL')
  };

  const actas = loadDB();
  actas.push(nueva);
  saveDB(actas);

  res.status(201).json(nueva);
});

// PUT /api/actas/:id — editar
app.put('/api/actas/:id', (req, res) => {
  const actas = loadDB();
  const idx = actas.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'No encontrado' });

  actas[idx] = { ...actas[idx], ...req.body, id: req.params.id };
  saveDB(actas);
  res.json(actas[idx]);
});

// DELETE /api/actas/:id
app.delete('/api/actas/:id', (req, res) => {
  const actas = loadDB();
  const idx = actas.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'No encontrado' });

  actas.splice(idx, 1);
  saveDB(actas);
  res.json({ ok: true });
});

// GET /api/stats
app.get('/api/stats', (req, res) => {
  const actas = loadDB();
  const porTipo = {};
  actas.forEach(r => { porTipo[r.tipo] = (porTipo[r.tipo] || 0) + 1; });
  res.json({
    total: actas.length,
    porTipo: Object.entries(porTipo).map(([tipo, n]) => ({ tipo, n })).sort((a, b) => b.n - a.n),
    recientes: actas.slice(-5).reverse()
  });
});

// ── Arrancar ───────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  Gestion de Activos TI - Municipalidad de Coyhaique');
  console.log('  ---------------------------------------------------');
  console.log('  http://localhost:' + PORT);
  console.log('');
  console.log('  Base de datos: ' + DB_PATH);
  const n = loadDB().length;
  console.log('  Registros cargados: ' + n);
  console.log('');
  console.log('  Presiona Ctrl+C para detener');
  console.log('');
});
