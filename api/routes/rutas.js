import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Página de inicio (redirección)
router.get('/', (req, res) => {
  res.redirect('/home');
});

// Página Home
router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../../web/home.html'));
});
router.post('/home', (req, res) => {
  res.status(501).send('No implementado');
});
router.put('/home', (req, res) => {
  res.status(501).send('No implementado');
});
router.delete('/home', (req, res) => {
  res.status(501).send('No implementado');
});

// Página ODS
router.get('/ods', (req, res) => {
  res.sendFile(path.join(__dirname, '../../web/ods.html'));
});
router.post('/ods', (req, res) => {
  res.status(501).send('No implementado');
});
router.put('/ods', (req, res) => {
  res.status(501).send('No implementado');
});
router.delete('/ods', (req, res) => {
  res.status(501).send('No implementado');
});

// Página Incendios
router.get('/incendios', (req, res) => {
  res.sendFile(path.join(__dirname, '../../web/incendios.html'));
});
router.post('/incendios', (req, res) => {
  res.status(501).send('No implementado');
});
router.put('/incendios', (req, res) => {
  res.status(501).send('No implementado');
});
router.delete('/incendios', (req, res) => {
  res.status(501).send('No implementado');
});

// Página Repoblación
router.get('/repoblacion', (req, res) => {
  res.sendFile(path.join(__dirname, '../../web/repoblacion.html'));
});
router.post('/repoblacion', (req, res) => {
  res.status(501).send('No implementado');
});
router.put('/repoblacion', (req, res) => {
  res.status(501).send('No implementado');
});
router.delete('/repoblacion', (req, res) => {
  res.status(501).send('No implementado');
});

// Página Comparativa
router.get('/comparativa', (req, res) => {
  res.sendFile(path.join(__dirname, '../../web/comparativa.html'));
});
router.post('/comparativa', (req, res) => {
  res.status(501).send('No implementado');
});
router.put('/comparativa', (req, res) => {
  res.status(501).send('No implementado');
});
router.delete('/comparativa', (req, res) => {
  res.status(501).send('No implementado');
});

// Página Conclusión
router.get('/conclusion', (req, res) => {
  res.sendFile(path.join(__dirname, '../../web/conclusion.html'));
});
router.post('/conclusion', (req, res) => {
  res.status(501).send('No implementado');
});
router.put('/conclusion', (req, res) => {
  res.status(501).send('No implementado');
});
router.delete('/conclusion', (req, res) => {
  res.status(501).send('No implementado');
});

export default router;