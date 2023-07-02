'use strict'

var Admin = require('../models/admin');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');
const registro_admin = async function(req,res){
    //
    var data = req.body;
    var admin_arr = [];

    admin_arr = await Admin.findAdminByEmail(data.email);

    if(admin_arr.length == 0){
        //registo
        if(data.password){
           // var reg = await Cliente.create(data);
            bcrypt.hash(data.password, null, null, async function(err, hash){
                if(hash){
                    data.password = hash;
                    var reg = await Admin.insertAdmin(data);
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


const login_admin  = async function(req,res){
    var data = req.body;
    var admin_arr = [];

    admin_arr = await Admin.findAdminByEmail(data.email);
    if (admin_arr.length == 0){
        res.status(200).send({message:'No se encontro el correo', data: undefined});
    }else{
        //login

        let user = admin_arr[0];
        console.log(user);
        console.log(user.password);
        //res.status(200).send({data:user});
         bcrypt.compare(data.password, user.password, async function(req,check){
            if(check){
                res.status(200).send({
                    data:user,
                    token: jwt.createToken(user)
                });
            }else{
                res.status(200).send({message: 'la contraseña no coincide '});
            }
        });

    };

    //res.status(200).send({data:data});
}

module.exports = {registro_admin,
                  login_admin};
