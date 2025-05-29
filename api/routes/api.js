import express from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const readJson = (filename) => {
  try {
    const data = fs.readFileSync(
      path.join(path.dirname(new URL(import.meta.url).pathname), '../json', filename),
      'utf-8'
    );
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
};

router.get('/incendios', (req, res) => {
  const data = readJson('incendios.json');
  if (!data) return res.status(500).json({ error: 'No se pudo leer el archivo de incendios' });
  res.json(data);
});

router.get('/repoblacion', (req, res) => {
  const data = readJson('repoblacion.json');
  if (!data) return res.status(500).json({ error: 'No se pudo leer el archivo de repoblación' });
  res.json(data);
});

export default router;