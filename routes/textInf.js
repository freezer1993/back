'use strict'

var express = require('express');
var textInfController = require('../controllers/textoInfController');

var api = express.Router();
var auth = require('../middlewares/authenticate');

api.post('/registro_textInf',textInfController.registro_texto_informativo);
api.put('/modificar_textInf', textInfController.modificar_texto_informativo);
api.get('/listar_textInf/:id_sucursal', (req, res, next) => {
    console.log('entro');
    textInfController.listar_texto_informativo(req, res, next);
  });

module.exports = api;