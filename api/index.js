import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import apiRoutes from './routes/api.js';
import pageRoutes from './routes/rutas.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware para servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../web')));

// Rutas API
app.use('/api', apiRoutes);

// Rutas de páginas
app.use('/', pageRoutes);

app.listen(3000, () => {
  console.log(`Servidor escuchando en http://localhost:3000`);
});