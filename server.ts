import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Storage directory and files for persistent data
const DATA_DIR = path.join(process.cwd(), 'server_data');
const RECIPES_FILE = path.join(DATA_DIR, 'recipes.json');
const RESTAURANTS_FILE = path.join(DATA_DIR, 'restaurants.json');
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');

// Ensure storage directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.error('Error creating data directory:', e);
  }
}

// Helpers for reading/writing persistent data
function readData<T>(filePath: string, defaultData: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e);
  }
  return defaultData;
}

function writeData<T>(filePath: string, data: T): boolean {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error(`Error writing to ${filePath}:`, e);
    return false;
  }
}

// ================= API ROUTES =================

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. RECIPES API (Persistent across browsers, devices, and sessions)
app.get('/api/recipes', (req, res) => {
  const recipes = readData<any[]>(RECIPES_FILE, []);
  res.json({ success: true, recipes });
});

app.post('/api/recipes', (req, res) => {
  const newRecipe = req.body;
  if (!newRecipe || !newRecipe.id || !newRecipe.nombre) {
    return res.status(400).json({ success: false, error: 'Datos de receta incompletos' });
  }

  const recipes = readData<any[]>(RECIPES_FILE, []);
  const index = recipes.findIndex((r) => r.id === newRecipe.id);
  
  if (index >= 0) {
    recipes[index] = { ...recipes[index], ...newRecipe, updatedAt: new Date().toISOString() };
  } else {
    recipes.unshift({
      ...newRecipe,
      esComunidad: true,
      createdAt: new Date().toISOString(),
    });
  }

  writeData(RECIPES_FILE, recipes);
  res.json({ success: true, recipe: newRecipe, count: recipes.length });
});

app.delete('/api/recipes/:id', (req, res) => {
  const { id } = req.params;
  let recipes = readData<any[]>(RECIPES_FILE, []);
  recipes = recipes.filter((r) => r.id !== id);
  writeData(RECIPES_FILE, recipes);
  res.json({ success: true, deletedId: id });
});

// 3. RESTAURANTS & ADS API (Persistent advertising directory)
app.get('/api/restaurants', (req, res) => {
  const restaurants = readData<any[]>(RESTAURANTS_FILE, []);
  res.json({ success: true, restaurants });
});

app.post('/api/restaurants', (req, res) => {
  const newAd = req.body;
  if (!newAd || !newAd.id || !newAd.nombre) {
    return res.status(400).json({ success: false, error: 'Datos de restaurante incompletos' });
  }

  const restaurants = readData<any[]>(RESTAURANTS_FILE, []);
  const index = restaurants.findIndex((r) => r.id === newAd.id);

  if (index >= 0) {
    restaurants[index] = { ...restaurants[index], ...newAd, updatedAt: new Date().toISOString() };
  } else {
    restaurants.unshift({
      ...newAd,
      createdAt: new Date().toISOString(),
      estadoSuscripcion: 'activa',
    });
  }

  writeData(RESTAURANTS_FILE, restaurants);
  res.json({ success: true, restaurant: newAd });
});

app.delete('/api/restaurants/:id', (req, res) => {
  const { id } = req.params;
  let restaurants = readData<any[]>(RESTAURANTS_FILE, []);
  restaurants = restaurants.filter((r) => r.id !== id);
  writeData(RESTAURANTS_FILE, restaurants);
  res.json({ success: true, deletedId: id });
});

// 4. PAYMENTS & SUBSCRIPTIONS PROCESSING (Yape verification & Credit card tokenization)
app.post('/api/payments/process', (req, res) => {
  const { 
    metodo, 
    monto, 
    planId, 
    restauranteNombre, 
    codigoYape, 
    tarjetaUltimos4,
    titular,
    contacto
  } = req.body;

  if (!metodo || !monto || !restauranteNombre) {
    return res.status(400).json({ success: false, error: 'Faltan datos de pago' });
  }

  // Generate verified transaction receipt
  const transactionId = `WIKI-TX-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
  const paymentRecord = {
    transactionId,
    metodo,
    monto: Number(monto),
    planId,
    restauranteNombre,
    codigoYape: codigoYape || null,
    tarjetaUltimos4: tarjetaUltimos4 || null,
    titular: titular || 'Cliente',
    contacto: contacto || '',
    // This project uses a demonstration checkout flow; it does not charge or verify real payments.
    estado: 'demo_registro_sin_cobro',
    fecha: new Date().toISOString(),
    vigenciaDias: planId === 'anual' ? 365 : 30,
  };

  const payments = readData<any[]>(PAYMENTS_FILE, []);
  payments.unshift(paymentRecord);
  writeData(PAYMENTS_FILE, payments);

  res.json({
    success: true,
    message: 'Registro de demostración completado. No se realizó ningún cobro ni verificación bancaria.',
    receipt: paymentRecord,
  });
});

// ================= VITE DEV / PRODUCTION MIDDLEWARE =================
async function startServer() {
  // In production (for example on Render), serve the Vite build from /dist.
  // We detect the build by checking for dist/index.html so the app also
  // works even if the hosting provider does not set NODE_ENV automatically.
  const distPath = path.join(process.cwd(), 'dist');
  const distIndex = path.join(distPath, 'index.html');

  if (fs.existsSync(distIndex)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(distIndex);
    });
  } else {
    // Local development: use Vite middleware.
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Wiki Alimentacion server running on port ${PORT}`);
  });
}

startServer();
