'use strict'

var Cliente = require('../models/cliente');
var jwt = require('../helpers/jwt');
var bcrypt = require('bcrypt-nodejs');

const registro_cliente = async function(req,res){
    //
    var data = req.body;
    var clientes_arr = [];

    clientes_arr = await Cliente.find({email: data.email});

    if(clientes_arr.length == 0){
        //registo
        if(data.password){
           // var reg = await Cliente.create(data);
            bcrypt.hash(data.password, null, null, async function(err, hash){
                if(hash){
                    data.password = hash;
                    var reg = await Cliente.create(data);
                    console.log(hash);
                    res.status(200).send({data:reg});
                }else{
                    res.status(200).send({message: 'Error server', data:undefined});            
                }
            })
        }else{
            res.status(200).send({message: 'No se ha insertado la contraseña', data:undefined});     
        }

       // res.status(200).send({data:reg});
    }else{
        res.status(200).send({message: 'El correo ya existe en la base de datos', data:undefined}); 
    }
    
    
};

const login_cliente  = async function(req,res){
    var data = req.body;
    var cliente_arr = [];

    cliente_arr = await Cliente.find({email: data.email});
    if (cliente_arr.length == 0){
        res.status(200).send({message:'No se encontro el correo', data: undefined});
    }else{
        //login
        let user = cliente_arr[0];
        //console.log(user);
        //res.status(200).send({data:user});
        bcrypt.compare(data.password, user.password, async function(req,check){
            if(check){
                res.status(200).send({
                    data:user,
                    token: jwt.createToken(user)    
                
                });
            }else{
                res.status(200).send({message: 'la contraseña no coincide'});
            }
        });
        /*if(user.password == data.password){
            res.status(200).send(data.user);
        }else{
            res.status(200).send({message: 'la contrase{a no coincide'});
        };*/

    };

    //res.status(200).send({data:data});
}

const listar_clientes_filtro_admin = async function(req,res){
    console.log(req.user);
   if (req.user) {
    if (req.user.role == 'admin') {
        let tipo = req.params['tipo'];
        let filtro = req.params['filtro'];

       // console.log(tipo);

        if (tipo == null || tipo == 'null'){
            let reg = await Cliente.find();
            res.status(200).send({data:reg});  
        }else{
            if (tipo == 'apellidos'){
                let reg = await Cliente.find({apellidos:new RegExp(filtro,'i')});
                res.status(200).send({data:reg});
            }else if (tipo == 'correo'){
                let reg = await Cliente.find({email:new RegExp(filtro,'i')});
                res.status(200).send({data:reg});
            }
        }        
    } else {
        res.status(500).send({message:'NoAccess'});
    }
   } else {
    res.status(500).send({message:'NoAccess'});
   }

}

const registro_cliente_admin = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){
            var data = req.body;

            bcrypt.hash('12345',null,null,async function(err,hash){
                if(hash){
                    data.password = hash;
                    let req = await Cliente.create(data);
                    res.status(200).send({data:req}); 
                }else{
                    res.status(200).send({message: 'Hbo un error en el servidor', data:undefined});
                }
            })
        }
    }

}
module.exports = {
    registro_cliente,
    login_cliente,
    listar_clientes_filtro_admin, 
    registro_cliente_admin
}

