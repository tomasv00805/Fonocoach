// routes.js

const express = require('express');
const router = express.Router();
const adminController = require('./controller/adminController');
const pacienteController = require('./controller/pacientesController');
const { registrarSesionDeJuego, obtenerSesionDeJuegoPorId } = require('./controller/sesionDeJuegoController');

// Rutas para el registro y gestión de pacientes
router.post('/pacientes/loginpaciente', pacienteController.loginPaciente);
router.post('/pacientes/:creadorId', pacienteController.registrarPaciente);
router.post('/pacientes/:pacienteId/sesiones', pacienteController.registrarSesion);
router.get('/pacientes/:id', pacienteController.encontrarPacientePorId);


// Rutas para el registro y gestión de administradores
router.post('/admin/nuevo', adminController.nuevoAdmin);
router.post('/admin/login', adminController.loginAdmin);
router.get('/admin/:adminId', adminController.obtenerPacientesCreadosPorAdmin);


// Rutas para las sesiones de juego
router.post('/juego/registrarSesion/:pacienteID', registrarSesionDeJuego);
router.get('/juego/:id', obtenerSesionDeJuegoPorId);

module.exports = router;
