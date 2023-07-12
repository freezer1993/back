'use strict'
const cors = require('cors');
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
const path = require('path');
const dirPath = path.join(__dirname, '/tokens-sessions.json');
const { logger } = require('./config/loggin');
const config = require('./config/config');
const conexion = require('./config/conexion');
//const {PORT} = require('./config/config');
var port = config.PUERTO;

//var cliente_route = require('./routes/Cliente');
var admin_route = require('./routes/admin');
var images_route = require('./routes/images');
var textInf_route = require('./routes/textInf');
var profesionales_route = require('./routes/profesionales');


conexion.connect()
  .then(() => {
    app.listen(port, function () {
      console.log('Servidor corriendo en el puerto ' + port);
    });
  })
  .catch(err => {
    console.log(err);
  });

app.use(express.static('./public'));

app.use(require("morgan")("dev", { "stream": logger.stream }));
// Habilitar CORS para todas las solicitudes
app.use(cors());

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json({limit: '50mb',extended:true}));
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); 
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();
});

//app.use('/api',cliente_route);
app.use('/api',admin_route);
app.use('/api',images_route);
app.use('/api',textInf_route);
app.use('/api',profesionales_route);

//creamos el archivo
config.createSessionsFileIfNotExists(dirPath);

module.exports = app;
