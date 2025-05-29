const express = require('express');
const path = require('path');
const app = express();

// Middleware para servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../web')));

// Rutas API
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Rutas de páginas
const pageRoutes = require('./routes/pages');
app.use('/', pageRoutes);

app.listen(3000, () => {
  console.log(`Servidor escuchando en http://localhost:3000`);
});

