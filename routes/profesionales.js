'use strict'

var express = require('express');
var profesionalesContoller = require('../controllers/profesionalesController');

var api = express.Router();
var auth = require('../middlewares/authenticate');

// Ruta para listar los prestadores por sucursal
api.get('/prestadores/:id_sucursal', profesionalesContoller.listarPrestadoresPorSucursal);

// Ruta para listar las especialidades por sucursal
api.get('/especialidades/:id_sucursal', profesionalesContoller.listarEspecialidadesPorSucursal);

// Ruta para listar los prestadores y especialidades por sucursal
api.get('/prestadores-especialidades/:id_sucursal/:id_prestador/:id_especialidad', profesionalesContoller.listarPrestadoresYEspecialidadesPorSucursal);

// Ruta para listar los horarios de los profesionales
api.get('/horarios-profesionales/:id_sucursal/:id_prestador/:id_especialidad', profesionalesContoller.listarHorariosProfesionales);

module.exports = api;