const express = require('express');
const path = require('path');
const router = express.Router();

// Página de inicio (redirección)
router.get('/', (req, res) => {
  res.redirect('/home');
});

// Página Home
router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../../web/home.html'));
});

// Página ODS
router.get('/ods', (req, res) => {
  res.sendFile(path.join(__dirname, '../../web/ods.html'));
});

// Página Incendios
router.get('/incendios', (req, res) => {
  res.sendFile(path.join(__dirname, '../../web/incendios.html'));
});

// Página Repoblación
router.get('/repoblacion', (req, res) => {
  res.sendFile(path.join(__dirname, '../../web/repoblacion.html'));
});

// Página Comparativa
router.get('/comparativa', (req, res) => {
  res.sendFile(path.join(__dirname, '../../web/comparativa.html'));
});

// Página Conclusión
router.get('/conclusion', (req, res) => {
  res.sendFile(path.join(__dirname, '../../web/conclusion.html'));
});

module.exports = router;