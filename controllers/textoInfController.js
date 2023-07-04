'use strict'

var TextoInf = require('../models/textoInf');
var jwt = require('../helpers/jwt');
var bcrypt = require('bcrypt-nodejs');

const registro_texto_informativo = async function(req,res){
    //
    var data = req.body;
    
    try{
        var reg = await TextoInf.insertarRegistro(data);
        res.status(200).send({message:'Texto insertado correctamente' ,data:reg});
    }catch(error) {
        console.error('Error en registro_texto_informativo:', error);
        res.status(404).send({ message: 'Error en registro_texto_informativo', error: error.message, stack: error.stack });
      }
};

const modificar_texto_informativo = async function(req,res){
    var data = req.body;
    var id_sucursal = req.body.id_sucursal;
    console.log(data);
    console.log(id_sucursal);
    try{
        var reg = await TextoInf.modificarRegistroPorIdSucursal(id_sucursal, data);
        res.status(200).send({message:'Texto modificado correctamente' ,data:reg});
    }catch(error) {
        console.error('Error en modificar_texto_informativo:', error);
        res.status(404).send({ message: 'Error en modificar_texto_informativo', error: error.message, stack: error.stack });
      }
};


const listar_texto_informativo = async function(req,res){
    const id_sucursal = req.params.id_sucursal;
    console.log('llego');
    console.log(id_sucursal);
    try{
        var reg = await TextoInf.buscarRegistrosPorIdSucursal(id_sucursal);
        res.status(200).send({message:'Texto listado correctamente' ,data:reg});
    }catch(error) {
        console.error('Error en listar_texto_informativo:', error);
        res.status(404).send({ message: 'Error en listar_texto_informativo', error: error.message, stack: error.stack });
      }

}


module.exports = {
    registro_texto_informativo,
    modificar_texto_informativo,
    listar_texto_informativo
}

