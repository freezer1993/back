'use strict'

var express = require('express');
var imagesController = require('../controllers/imagesController');
//var fileUpload = require('express-fileupload');
var auth = require('../middlewares/authenticate');

var api = express.Router();

// Middleware para agregar el parámetro id_sucursal en todas las peticiones
api.use((req, res, next) => {
    const id_sucursal = req.query.id_sucursal; // Obtener el valor de id_sucursal de los parámetros de consulta (?id_sucursal=valor)
    req.id_sucursal = id_sucursal; // Agregar el valor de id_sucursal al objeto request para que esté disponible en los controladores
    next();
  });
  
// Middleware para procesar archivos enviados en la solicitud
//api.use(fileUpload());

api.get('/listar_slides',imagesController.listar_slides);
api.get('/listar_slides2',imagesController.listar_slides2);
api.post('/upload',imagesController.uploadImage);
api.delete('/delete/:imageName',imagesController.deleteImage);

module.exports = api;